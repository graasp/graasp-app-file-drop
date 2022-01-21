import {
  DEFAULT_GET_REQUEST,
  DEFAULT_POST_REQUEST,
  DEFAULT_PATCH_REQUEST,
  DEFAULT_DELETE_REQUEST,
} from '../config/api';
import {
  FLAG_GETTING_APP_INSTANCE_RESOURCES,
  GET_APP_INSTANCE_RESOURCES_FAILED,
  GET_APP_INSTANCE_RESOURCES_SUCCEEDED,
  FLAG_POSTING_APP_INSTANCE_RESOURCE,
  POST_APP_INSTANCE_RESOURCE_SUCCEEDED,
  POST_APP_INSTANCE_RESOURCE_FAILED,
  PATCH_APP_INSTANCE_RESOURCE_SUCCEEDED,
  PATCH_APP_INSTANCE_RESOURCE_FAILED,
  FLAG_PATCHING_APP_INSTANCE_RESOURCE,
  FLAG_DELETING_APP_INSTANCE_RESOURCE,
  DELETE_APP_INSTANCE_RESOURCE_FAILED,
  DELETE_APP_INSTANCE_RESOURCE_SUCCEEDED,
  GET_APP_INSTANCE_RESOURCES,
  POST_APP_INSTANCE_RESOURCE,
  PATCH_APP_INSTANCE_RESOURCE,
  DELETE_APP_INSTANCE_RESOURCE,
} from '../types';
import { flag, getApiContext, isErrorResponse, postMessage } from './common';
import { getAuthToken } from './context';
import { showErrorToast } from '../utils/toasts';
import {
  MISSING_APP_INSTANCE_RESOURCE_ID_MESSAGE,
  REFETCH_AUTH_TOKEN_MESSAGE,
} from '../constants/messages';
import { APP_INSTANCE_RESOURCE_FORMAT } from '../config/formats';
import { DEFAULT_VISIBILITY } from '../config/settings';
import {
  buildDeleteResourceRoute,
  buildGetAppResourcesRoute,
} from '../api/routes';

const flagGettingAppInstanceResources = flag(
  FLAG_GETTING_APP_INSTANCE_RESOURCES,
);
const flagPostingAppInstanceResource = flag(FLAG_POSTING_APP_INSTANCE_RESOURCE);
const flagPatchingAppInstanceResource = flag(
  FLAG_PATCHING_APP_INSTANCE_RESOURCE,
);
const flagDeletingAppInstanceResource = flag(
  FLAG_DELETING_APP_INSTANCE_RESOURCE,
);

const refreshExpiredToken = (response, dispatch) => {
  if (
    // todo: refactor using global constants
    response.status === 401
  ) {
    dispatch(getAuthToken());

    showErrorToast(REFETCH_AUTH_TOKEN_MESSAGE);
  }
};

const getAppInstanceResources = async ({ sessionId, type } = {}) => async (
  dispatch,
  getState,
) => {
  dispatch(flagGettingAppInstanceResources(true));
  try {
    const {
      appInstanceId,
      apiHost,
      offline,
      spaceId,
      subSpaceId,
      standalone,
    } = getApiContext(getState);

    const {
      context: { token, itemId },
    } = getState();

    // if standalone, you cannot connect to api
    if (standalone) {
      return false;
    }

    // if offline send message to parent requesting resources
    if (offline) {
      return postMessage({
        type: GET_APP_INSTANCE_RESOURCES,
        payload: {
          type,
          spaceId,
          subSpaceId,
          appInstanceId,
        },
      });
    }

    let url = `${apiHost}/${buildGetAppResourcesRoute(itemId)}`;
    if (sessionId) {
      url += `&sessionId=${sessionId}`;
    }
    // add type if present
    if (type) {
      url += `&type=${type}`;
    }

    const response = await fetch(url, {
      ...DEFAULT_GET_REQUEST,
      headers: {
        ...DEFAULT_GET_REQUEST.headers,
        Authorization: `Bearer ${token}`,
      },
    });
    refreshExpiredToken(response, dispatch);

    // throws if it is an error
    await isErrorResponse(response);

    const appInstanceResources = await response.json();
    return dispatch({
      type: GET_APP_INSTANCE_RESOURCES_SUCCEEDED,
      payload: appInstanceResources,
    });
  } catch (err) {
    return dispatch({
      type: GET_APP_INSTANCE_RESOURCES_FAILED,
      payload: err,
    });
  } finally {
    dispatch(flagGettingAppInstanceResources(false));
  }
};

const postAppInstanceResource = async ({
  data,
  userId,
  type,
  visibility = DEFAULT_VISIBILITY,
} = {}) => async (dispatch, getState) => {
  dispatch(flagPostingAppInstanceResource(true));
  try {
    const {
      appInstanceId,
      apiHost,
      offline,
      spaceId,
      subSpaceId,
      standalone,
    } = await getApiContext(getState);
    const {
      context: { token, itemId },
    } = getState();

    // if standalone, you cannot connect to api
    if (standalone) {
      return false;
    }

    // if offline send message to parent requesting to create a resource
    if (offline) {
      return postMessage({
        type: POST_APP_INSTANCE_RESOURCE,
        payload: {
          data,
          type,
          spaceId,
          subSpaceId,
          format: APP_INSTANCE_RESOURCE_FORMAT,
          appInstanceId,
          userId,
          visibility,
        },
      });
    }

    const url = `${apiHost}/${buildGetAppResourcesRoute(itemId)}`;

    const body = {
      data,
      type,
      format: APP_INSTANCE_RESOURCE_FORMAT,
      appInstance: appInstanceId,
      user: userId,
      visibility,
    };

    const response = await fetch(url, {
      body: JSON.stringify({
        data: body,
        type: 'file',
      }),
      ...DEFAULT_POST_REQUEST,
      headers: {
        ...DEFAULT_POST_REQUEST.headers,
        Authorization: `Bearer ${token}`,
      },
    });
    refreshExpiredToken(response, dispatch);

    // throws if it is an error
    await isErrorResponse(response);

    const appData = await response.json();

    return dispatch({
      type: POST_APP_INSTANCE_RESOURCE_SUCCEEDED,
      payload: appData,
    });
  } catch (err) {
    return dispatch({
      type: POST_APP_INSTANCE_RESOURCE_FAILED,
      payload: err,
    });
  } finally {
    dispatch(flagPostingAppInstanceResource(false));
  }
};

const patchAppInstanceResource = async ({ id, data } = {}) => async (
  dispatch,
  getState,
) => {
  dispatch(flagPatchingAppInstanceResource(true));
  try {
    const {
      appInstanceId,
      apiHost,
      offline,
      spaceId,
      subSpaceId,
      standalone,
    } = await getApiContext(getState);
    const {
      context: { token, itemId },
    } = getState();

    // if standalone, you cannot connect to api
    if (standalone) {
      return false;
    }

    // if offline send message to parent requesting to patch resource
    if (offline) {
      return postMessage({
        type: PATCH_APP_INSTANCE_RESOURCE,
        payload: {
          data,
          spaceId,
          subSpaceId,
          appInstanceId,
          id,
        },
      });
    }

    if (!id) {
      return showErrorToast(MISSING_APP_INSTANCE_RESOURCE_ID_MESSAGE);
    }

    const url = `${apiHost}/${buildDeleteResourceRoute({ itemId, id })}`;
    const body = {
      data,
    };

    const response = await fetch(url, {
      ...DEFAULT_PATCH_REQUEST,
      body: JSON.stringify(body),
      headers: {
        ...DEFAULT_PATCH_REQUEST.headers,
        Authorization: `Bearer ${token}`,
      },
    });
    refreshExpiredToken(response, dispatch);

    // throws if it is an error
    await isErrorResponse(response);

    const appData = await response.json();

    return dispatch({
      type: PATCH_APP_INSTANCE_RESOURCE_SUCCEEDED,
      payload: appData,
    });
  } catch (err) {
    return dispatch({
      type: PATCH_APP_INSTANCE_RESOURCE_FAILED,
      payload: err,
    });
  } finally {
    dispatch(flagPatchingAppInstanceResource(false));
  }
};

const deleteAppInstanceResource = async payload => async (
  dispatch,
  getState,
) => {
  dispatch(flagDeletingAppInstanceResource(true));
  try {
    const {
      apiHost,
      offline,
      standalone,
      spaceId,
      subSpaceId,
      appInstanceId,
    } = await getApiContext(getState);
    const {
      context: { token, itemId },
    } = getState();

    // if standalone, you cannot connect to api
    if (standalone) {
      return false;
    }
    const { id, _id } = payload;
    const identifier = id || _id;
    if (!identifier) {
      return showErrorToast(MISSING_APP_INSTANCE_RESOURCE_ID_MESSAGE);
    }

    // if offline send message to parent requesting to delete a resource
    if (offline) {
      return postMessage({
        type: DELETE_APP_INSTANCE_RESOURCE,
        payload: {
          ...payload,
          spaceId,
          subSpaceId,
          appInstanceId,
        },
      });
    }
    const url = `${apiHost}/${buildDeleteResourceRoute({
      itemId,
      identifier,
    })}`;
    const response = await fetch(url, {
      ...DEFAULT_DELETE_REQUEST,
      headers: {
        ...DEFAULT_PATCH_REQUEST.headers,
        Authorization: `Bearer ${token}`,
      },
    });
    refreshExpiredToken(response, dispatch);

    // throws if it is an error
    await isErrorResponse(response);

    return dispatch({
      type: DELETE_APP_INSTANCE_RESOURCE_SUCCEEDED,
      payload: identifier,
    });
  } catch (err) {
    return dispatch({
      type: DELETE_APP_INSTANCE_RESOURCE_FAILED,
      payload: err,
    });
  } finally {
    dispatch(flagDeletingAppInstanceResource(false));
  }
};

export {
  getAppInstanceResources,
  postAppInstanceResource,
  patchAppInstanceResource,
  deleteAppInstanceResource,
};

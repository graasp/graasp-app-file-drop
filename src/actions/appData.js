import {
  APP_DATA_ENDPOINT,
  APP_ITEMS_ENDPOINT,
  DEFAULT_GET_REQUEST,
  DEFAULT_PATCH_REQUEST,
  DEFAULT_POST_REQUEST,
} from '../config/api';
import {
  MISSING_APP_INSTANCE_RESOURCE_ID_MESSAGE,
  REFETCH_AUTH_TOKEN_MESSAGE,
} from '../constants/messages';
import {
  FLAG_PATCHING_APP_DATA,
  GET_APP_DATA_SUCCEEDED,
  GET_APP_DATA_FAILED,
  PATCH_APP_DATA_SUCCEEDED,
  POST_APP_DATA_SUCCEEDED,
  FLAG_GETTING_APP_DATA,
  PATCH_APP_DATA_FAILED,
  POST_APP_DATA_FAILED,
} from '../types/appData';
import { showErrorToast } from '../utils/toasts';
import { flag, isErrorResponse } from './common';
import { getAuthToken } from './context';

// refetch new token if token has expired
// response error should reflect that the token has expired
// this will dispatch a request to get a new token, and the user will need to re-trigger the failed actions
const refreshExpiredToken = (response, dispatch) => {
  if (
    // todo: refactor using global constants
    response.status === 401 &&
    response.message === 'Auth token does not match targeted item'
  ) {
    dispatch(getAuthToken());

    showErrorToast(REFETCH_AUTH_TOKEN_MESSAGE);
  }
};

export const getAppData = () => async (dispatch, getState) => {
  const flagPatchingAppData = flag(FLAG_GETTING_APP_DATA);
  try {
    dispatch(flagPatchingAppData(true));

    const {
      context: { token, itemId, apiHost },
    } = getState();

    const response = await fetch(
      `${apiHost}/${APP_ITEMS_ENDPOINT}/${itemId}/${APP_DATA_ENDPOINT}`,
      {
        ...DEFAULT_GET_REQUEST,
        headers: {
          ...DEFAULT_GET_REQUEST.headers,
          Authorization: `Bearer ${token}`,
        },
      },
    );

    refreshExpiredToken(response, dispatch);

    const data = await response.json();

    dispatch({
      type: GET_APP_DATA_SUCCEEDED,
      payload: data,
    });
  } catch (e) {
    dispatch({
      type: GET_APP_DATA_FAILED,
    });
  } finally {
    dispatch(flagPatchingAppData(false));
  }
};

export const postAppData = ({ text, type }) => async (dispatch, getState) => {
  try {
    const {
      context: { token, itemId, apiHost },
    } = getState();

    const response = await fetch(
      `${apiHost}/${APP_ITEMS_ENDPOINT}/${itemId}/${APP_DATA_ENDPOINT}`,
      {
        body: JSON.stringify({ data: { text }, type }),
        ...DEFAULT_POST_REQUEST,
        headers: {
          ...DEFAULT_POST_REQUEST.headers,
          Authorization: `Bearer ${token}`,
        },
      },
    );

    refreshExpiredToken(response, dispatch);

    // throws if it is an error
    await isErrorResponse(response);

    const payload = await response.json();

    dispatch({
      type: POST_APP_DATA_SUCCEEDED,
      payload,
    });
  } catch (e) {
    dispatch({ type: POST_APP_DATA_FAILED });
  }
};

export const patchAppData = ({ id, data } = {}) => async (
  dispatch,
  getState,
) => {
  const flagPatchingAppData = flag(FLAG_PATCHING_APP_DATA);
  try {
    dispatch(flagPatchingAppData(true));

    const {
      context: { token, itemId, apiHost },
    } = getState();

    // eslint-disable-next-line no-unreachable
    if (!id) {
      return showErrorToast(MISSING_APP_INSTANCE_RESOURCE_ID_MESSAGE);
    }

    const url = `${apiHost}/${APP_ITEMS_ENDPOINT}/${itemId}/${APP_DATA_ENDPOINT}/${id}`;

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
      type: PATCH_APP_DATA_SUCCEEDED,
      payload: appData,
    });
  } catch (e) {
    return dispatch({
      type: PATCH_APP_DATA_FAILED,
    });
  } finally {
    dispatch(flagPatchingAppData(false));
  }
};

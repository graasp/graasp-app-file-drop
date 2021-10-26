import { flag, isErrorResponse, postMessage } from './common';
import {
  FLAG_GETTING_USERS,
  GET_USERS,
  GET_USERS_FAILED,
  GET_USERS_SUCCEEDED,
} from '../types';
import {
  APP_ITEMS_ENDPOINT,
  DEFAULT_GET_REQUEST,
  // SPACES_ENDPOINT,
  // USERS_ENDPOINT,
} from '../config/api';

const flagGettingUsers = flag(FLAG_GETTING_USERS);

const getUsers = async () => async (dispatch, getState) => {
  dispatch(flagGettingUsers(true));
  try {
    // const { spaceId, apiHost, offline, standalone } = getApiContext(getState);
    const { apiHost, offline, standalone, itemId, token } = getState().context;

    // if standalone, you cannot connect to api
    if (standalone) {
      return false;
    }

    // if offline send message to parent requesting resources
    if (offline) {
      return postMessage({
        type: GET_USERS,
      });
    }

    const response = await fetch(
      `${apiHost}/${APP_ITEMS_ENDPOINT}/${itemId}/context`,
      {
        ...DEFAULT_GET_REQUEST,
        headers: {
          ...DEFAULT_GET_REQUEST.headers,
          Authorization: `Bearer ${token}`,
        },
      },
    );

    // throws if it is an error
    await isErrorResponse(response);

    const users = (await response.json())?.members;
    return dispatch({
      type: GET_USERS_SUCCEEDED,
      payload: users,
    });
  } catch (err) {
    return dispatch({
      type: GET_USERS_FAILED,
      payload: err,
    });
  } finally {
    dispatch(flagGettingUsers(false));
  }
};

export {
  // todo: remove when more exports are here
  // eslint-disable-next-line import/prefer-default-export
  getUsers,
};

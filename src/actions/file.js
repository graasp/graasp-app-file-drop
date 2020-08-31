import { DEFAULT_DELETE_REQUEST } from '../config/api';
import { getApiContext, isErrorResponse, postMessage } from './common';
import {
  DELETE_FILE_SUCCEEDED,
  DELETE_FILE_FAILED,
  DELETE_FILE,
} from '../types';
import { FILE } from '../config/appInstanceResourceTypes';

const deleteFile = async ({ id, data: { uri } }) => async (
  dispatch,
  getState,
) => {
  try {
    const {
      standalone,
      offline,
      appInstanceId,
      userId,
      spaceId,
    } = getApiContext(getState);

    // if standalone, you cannot connect to api
    if (standalone) {
      return false;
    }

    if (offline) {
      return postMessage({
        type: DELETE_FILE,
        payload: {
          id,
          data: { uri },
          appInstanceId,
          userId,
          spaceId,
          type: FILE,
        },
      });
    }

    const response = await fetch(uri, {
      ...DEFAULT_DELETE_REQUEST,
      credentials: undefined,
    });

    // throws if it is an error
    await isErrorResponse(response);

    return dispatch({
      type: DELETE_FILE_SUCCEEDED,
    });
  } catch (e) {
    return dispatch({
      type: DELETE_FILE_FAILED,
    });
  }
};

// eslint-disable-next-line import/prefer-default-export
export { deleteFile };

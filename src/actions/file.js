import { DEFAULT_DELETE_REQUEST } from '../config/api';
import { getApiContext, isErrorResponse } from './common';
import {
  DELETE_FILE_SUCCEEDED,
  DELETE_FILE_FAILED,
  POST_FILE_FAILED,
  POST_FILE_SUCCEEDED,
} from '../types';
import { postAppInstanceResource } from './appInstanceResources';
import { showWarningToast } from '../utils/toasts';
import { FILE_UPLOAD_FAILED_MESSAGE } from '../constants/messages';

const receiveFile = dispatch => event => {
  const { data } = event;
  try {
    const message = JSON.parse(data);

    const { type, payload } = message;

    switch (type) {
      case POST_FILE_SUCCEEDED:
        return dispatch(postAppInstanceResource(payload));
      case POST_FILE_FAILED: {
        // the error message may be passed in payload
        const errorMessage =
          typeof payload === 'string' ? payload : FILE_UPLOAD_FAILED_MESSAGE;
        return showWarningToast(errorMessage);
      }
      default:
        return false;
    }
  } catch (err) {
    console.error(err);
    return false;
  }
};

const deleteFile = async uri => async (dispatch, getState) => {
  try {
    const { standalone } = getApiContext(getState);

    // if standalone, you cannot connect to api
    if (standalone) {
      return false;
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

export { receiveFile, deleteFile };

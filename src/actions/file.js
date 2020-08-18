import _ from 'lodash';
import { DEFAULT_DELETE_REQUEST } from '../config/api';
import { getApiContext, isErrorResponse, postMessage } from './common';
import {
  DELETE_FILE_SUCCEEDED,
  DELETE_FILE_FAILED,
  POST_FILE_FAILED,
  POST_FILE_SUCCEEDED,
  DELETE_FILE,
} from '../types';
import {
  postAppInstanceResource,
  deleteAppInstanceResource,
} from './appInstanceResources';
import { showWarningToast } from '../utils/toasts';
import {
  FILE_UPLOAD_FAILED_MESSAGE,
  FILE_DELETE_FAILED_MESSAGE,
} from '../constants/messages';
import { FILE } from '../config/appInstanceResourceTypes';

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
        const errorMessage = _.isString(payload)
          ? payload
          : FILE_UPLOAD_FAILED_MESSAGE;
        return showWarningToast(errorMessage);
      }
      case DELETE_FILE_SUCCEEDED:
        return dispatch(deleteAppInstanceResource(payload));
      case DELETE_FILE_FAILED: {
        // the error message may be passed in payload
        const errorMessage = _.isString(payload)
          ? payload
          : FILE_DELETE_FAILED_MESSAGE;
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

const deleteFile = async ({ id, uri }) => async (dispatch, getState) => {
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

    dispatch(deleteAppInstanceResource({ id }));

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

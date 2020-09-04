import _ from 'lodash';
import {
  FILE_DELETE_FAILED_MESSAGE,
  FILE_UPLOAD_FAILED_MESSAGE,
} from '../constants/messages';
import {
  GET_APP_INSTANCE_RESOURCES_SUCCEEDED,
  GET_APP_INSTANCE_SUCCEEDED,
  PATCH_APP_INSTANCE_RESOURCE_SUCCEEDED,
  POST_APP_INSTANCE_RESOURCE_SUCCEEDED,
  DELETE_APP_INSTANCE_RESOURCE_SUCCEEDED,
  DELETE_APP_INSTANCE_RESOURCE_FAILED,
  DELETE_FILE_SUCCEEDED,
  DELETE_FILE_FAILED,
  POST_FILE_FAILED,
  POST_FILE_SUCCEEDED,
} from '../types';
import { showWarningToast } from '../utils/toasts';
import { deleteFile } from './file';
import { FILE } from '../config/appInstanceResourceTypes';
import { postAppInstanceResource } from './appInstanceResources';

const receiveMessage = dispatch => event => {
  const { data } = event;
  try {
    const message = JSON.parse(data);

    const { type, payload } = message;

    switch (type) {
      case GET_APP_INSTANCE_RESOURCES_SUCCEEDED:
      case GET_APP_INSTANCE_SUCCEEDED:
      case PATCH_APP_INSTANCE_RESOURCE_SUCCEEDED:
      case POST_APP_INSTANCE_RESOURCE_SUCCEEDED:
        return dispatch({
          type,
          payload,
        });
      case DELETE_APP_INSTANCE_RESOURCE_SUCCEEDED:
        if (payload.type === FILE) {
          dispatch(deleteFile(payload));
        }
        return dispatch({
          type,
          payload,
        });
      case DELETE_APP_INSTANCE_RESOURCE_FAILED: {
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
      case DELETE_FILE_FAILED:
        // do nothing: on failed, the file will still be on the server
        return false;
      default:
        return false;
    }
  } catch (err) {
    console.error(err);
    return false;
  }
};

export { receiveMessage, receiveFile };

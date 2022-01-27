import _ from 'lodash';
import { FILE_UPLOAD_FAILED_MESSAGE } from '../constants/messages';
import {
  DELETE_FILE_SUCCEEDED,
  DELETE_FILE_FAILED,
  POST_FILE_FAILED,
  POST_FILE_SUCCEEDED,
} from '../types';
import { showErrorToast } from '../utils/toasts';
import { postAppInstanceResource } from './appInstanceResources';

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
        return showErrorToast(errorMessage);
      }
      case DELETE_FILE_SUCCEEDED:
      case DELETE_FILE_FAILED:
        // do nothing: on failed, the file will still be on the server
        return false;
      default:
        return false;
    }
  } catch (err) {
    return false;
  }
};

export default { receiveFile };

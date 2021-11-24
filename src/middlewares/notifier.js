import { toastr } from 'react-redux-toastr';
import { routines } from '@graasp/query-client';
import i18n from '../config/i18n';
import {
  UPLOAD_FILES_ERROR_MESSAGE,
  UPLOAD_FILES_SUCCESS_MESSAGE,
  UPLOAD_FILES_PROGRESS_MESSAGE,
  FILE_UPLOAD_INFO_MESSAGE_HEADER,
  SUCCESS_MESSAGE_HEADER,
  ERROR_MESSAGE_HEADER,
} from '../config/messages';

const { uploadFileRoutine } = routines;

export default ({ type, payload }) => {
  let message = null;
  switch (type) {
    // error messages
    case uploadFileRoutine.FAILURE: {
      message = UPLOAD_FILES_ERROR_MESSAGE;
      break;
    }
    case uploadFileRoutine.SUCCESS: {
      message = UPLOAD_FILES_SUCCESS_MESSAGE;
      break;
    }
    // progress messages
    // todo: this might be handled differently
    case uploadFileRoutine.REQUEST: {
      toastr.info(
        i18n.t(FILE_UPLOAD_INFO_MESSAGE_HEADER),
        i18n.t(UPLOAD_FILES_PROGRESS_MESSAGE),
      );
      break;
    }
    default:
  }

  // error notification
  if (payload?.error && message) {
    toastr.error(i18n.t(ERROR_MESSAGE_HEADER), i18n.t(message));
  }
  // success notification
  else if (message) {
    toastr.success(i18n.t(SUCCESS_MESSAGE_HEADER), i18n.t(message));
  }
};

import { toast } from 'react-toastify';

import { ROUTINES } from '@graasp/apps-query-client';

import i18n from './i18n';
import {
  UPLOAD_FILES_ERROR_MESSAGE,
  UPLOAD_FILES_SUCCESS_MESSAGE,
} from './messages';

const { uploadAppDataFileRoutine } = ROUTINES;

interface NotifierInt {
  type: string;
  payload?: {
    error: string;
  };
}

export default ({ type, payload }: NotifierInt): void => {
  let message = null;
  switch (type) {
    // error messages
    case uploadAppDataFileRoutine.FAILURE: {
      message = UPLOAD_FILES_ERROR_MESSAGE;
      break;
    }
    case uploadAppDataFileRoutine.SUCCESS: {
      message = UPLOAD_FILES_SUCCESS_MESSAGE;
      break;
    }
    // progress messages
    // todo: this might be handled differently
    case uploadAppDataFileRoutine.REQUEST: {
      toast.info(i18n.t('UPLOAD_FILES_PROGRESS_MESSAGE'));
      break;
    }
    default:
  }

  // error notification
  if (payload?.error && message) {
    toast.error(i18n.t('UPLOAD_FILES_ERROR_MESSAGE'));
  }

  // success notification
  else if (message) {
    toast.success(i18n.t('UPLOAD_FILES_SUCCESS_MESSAGE'));
  }
};

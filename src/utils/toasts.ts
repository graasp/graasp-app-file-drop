import { toast } from 'react-toastify';

import isObject from 'lodash.isobject';
import isString from 'lodash.isstring';

import {
  FAILED_TO_FETCH_MESSAGE_PRETTY,
  FAILED_TO_FETCH_MESSAGE_RAW,
  SUCCESS_MESSAGE,
  UNEXPECTED_ERROR_MESSAGE,
  UNEXPECTED_WARNING_MESSAGE,
} from '../config/messages';

type Payload = {
  message: string;
};

const showErrorToast = (payload: string | Payload): void => {
  let message = UNEXPECTED_ERROR_MESSAGE;
  if (isString(payload)) {
    message = payload;
  } else if (isObject(payload)) {
    if (payload.message) {
      ({ message } = payload);
    }
  }
  // provide more context
  if (message === FAILED_TO_FETCH_MESSAGE_RAW) {
    message = FAILED_TO_FETCH_MESSAGE_PRETTY;
  }

  toast.error(message, {
    toastId: message,
    position: 'bottom-right',
  });
};

const showWarningToast = (payload: string | Payload): void => {
  let message = UNEXPECTED_WARNING_MESSAGE;
  if (isString(payload)) {
    message = payload;
  } else if (isObject(payload)) {
    if (payload.message) {
      ({ message } = payload);
    }
  }

  toast.warn(message, {
    toastId: message,
    position: 'bottom-right',
  });
};

const showSuccessToast = (payload: string | Payload): void => {
  let message = SUCCESS_MESSAGE;
  if (isString(payload)) {
    message = payload;
  } else if (isObject(payload)) {
    if (payload.message) {
      ({ message } = payload);
    }
  }

  toast.success(message, {
    toastId: message,
    position: 'bottom-right',
  });
};

export { showErrorToast, showWarningToast, showSuccessToast };

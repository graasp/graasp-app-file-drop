import {
  FLAG_GETTING_CONTEXT,
  GET_AUTH_TOKEN_SUCCEEDED,
  GET_CONTEXT_FAILED,
  GET_CONTEXT_SUCCEEDED,
} from '../types';
import {
  DEFAULT_API_HOST,
  DEFAULT_LANG,
  DEFAULT_MODE,
} from '../config/settings';
import { showErrorToast } from '../utils/toasts';
import { DEFAULT_VIEW } from '../config/views';

const INITIAL_STATE = {
  apiHost: DEFAULT_API_HOST,
  lang: DEFAULT_LANG,
  mode: DEFAULT_MODE,
  view: DEFAULT_VIEW,
  appInstanceId: null,
  spaceId: null,
  subSpaceId: null,
  userId: null,
  offline: false,
  standalone: false,
  dev: false,
  // userType: null,
  itemId: null,
  activity: [],
  token: null,
};

export default (state = INITIAL_STATE, { type, payload }) => {
  switch (type) {
    case FLAG_GETTING_CONTEXT:
      return {
        ...state,
        activity: payload
          ? [...state.activity, payload]
          : [...state.activity.slice(1)],
      };

    case GET_CONTEXT_SUCCEEDED:
      return {
        ...state,
        ...payload,
      };

    case GET_CONTEXT_FAILED:
      // show error to user
      showErrorToast(payload);
      return state;

    case GET_AUTH_TOKEN_SUCCEEDED:
      return {
        ...state,
        token: payload,
      };

    default:
      return state;
  }
};

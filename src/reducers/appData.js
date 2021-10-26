import {
  FLAG_PATCHING_APP_DATA,
  GET_APP_DATA_SUCCEEDED,
  PATCH_APP_DATA_FAILED,
  PATCH_APP_DATA_SUCCEEDED,
  FLAG_GETTING_APP_DATA,
  POST_APP_DATA_SUCCEEDED,
} from '../types/appData';
import { showErrorToast } from '../utils/toasts';

// by default there are no app instance resources when the app starts
const INITIAL_STATE = {
  content: [],
  // array of flags to keep track of various actions
  activity: [],
  // flag to indicate that the app instance resources have been received
  ready: false,
};

export default (state = INITIAL_STATE, { type, payload }) => {
  switch (type) {
    case FLAG_PATCHING_APP_DATA:
    case FLAG_GETTING_APP_DATA:
      // todo: handle activity for other calls
      return {
        ...state,
        activity: payload
          ? [...state.activity, payload]
          : [...state.activity.slice(1)],
      };

    case GET_APP_DATA_SUCCEEDED:
      return {
        ...state,
        content: payload,
        ready: true,
      };
    case POST_APP_DATA_SUCCEEDED:
      return {
        ...state,
        content: [...state.content, payload],
      };
    case PATCH_APP_DATA_SUCCEEDED:
      return {
        ...state,
        content: state.content.map(appInstanceResource => {
          if (appInstanceResource._id !== payload._id) {
            return appInstanceResource;
          }
          return payload;
        }),
      };

    case PATCH_APP_DATA_FAILED:
      // show error to user
      showErrorToast(payload);
      return state;

    default:
      return state;
  }
};

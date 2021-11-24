// import Qs from 'qs';
import {
  FLAG_GETTING_CONTEXT,
  GET_CONTEXT_FAILED,
  GET_CONTEXT,
  GET_CONTEXT_SUCCEEDED,
  FLAG_GETTING_AUTH_TOKEN,
  GET_AUTH_TOKEN_SUCCEEDED,
  GET_AUTH_TOKEN,
} from '../types';
// import { flag, receiveMessage, postMessage } from './common';
import { flag, postMessage } from './common';
// eslint-disable-next-line import/no-cycle
import { receiveMessage } from './listener';
import {
  DEFAULT_API_HOST,
  DEFAULT_MODE,
  GRAASP_APP_ID,
} from '../config/settings';
import { DEFAULT_VIEW } from '../config/views';
import isInFrame from '../utils/isInFrame';

// message channel port
let port2 = null;

// flags
const flagGettingContext = flag(FLAG_GETTING_CONTEXT);

// build context from given data and default values
const buildContext = payload => {
  // todo: some data might be useless (appInstanceId, spaceId, ...)
  const {
    mode = DEFAULT_MODE,
    view = DEFAULT_VIEW,
    lang = 'en',
    apiHost = DEFAULT_API_HOST,
    appInstanceId = null,
    spaceId = null,
    subSpaceId = null,
    userId = null,
    sessionId = null,
    offline = 'false',
    dev = 'false',
    itemId = null,
  } = payload;

  const offlineBool = offline === 'true';
  const devBool = dev === 'true';

  const standalone = !devBool && !isInFrame();

  return {
    mode,
    view,
    lang,
    apiHost,
    appInstanceId,
    userId,
    sessionId,
    spaceId,
    subSpaceId,
    standalone,
    offline: offlineBool,
    dev: devBool,
    itemId,
  };
};

const flagGettingAuthToken = flag(FLAG_GETTING_AUTH_TOKEN);

// message channel communication
const onMessage = dispatch => event => {
  const { type, payload } = JSON.parse(event.data);
  // receive and savve token
  if (type === GET_AUTH_TOKEN_SUCCEEDED) {
    dispatch({ type: GET_AUTH_TOKEN_SUCCEEDED, payload: payload.token });
    dispatch(flagGettingAuthToken(false));
  }
};

const getAuthToken = () => async dispatch => {
  dispatch(flagGettingAuthToken(true));
  // request parent to provide item data (item id, settings...) and access token
  // eslint-disable-next-line no-unused-expressions
  port2?.postMessage(
    JSON.stringify({
      type: GET_AUTH_TOKEN,
      payload: {
        app: GRAASP_APP_ID,
        origin: window.location.origin,
      },
    }),
  );
};

/**
 * synchronously gets the context from the query string
 * @returns {Function}
 */
const getContext = () => dispatch => {
  dispatch(flagGettingContext(true));
  try {
    const receiveContextMessage = event => {
      const { type, payload } = event?.data || {};
      // get init message getting the Message Channel port
      if (type === GET_CONTEXT_SUCCEEDED) {
        const context = buildContext(payload);
        dispatch({
          type: GET_CONTEXT_SUCCEEDED,
          payload: context,
        });

        [port2] = event.ports;
        port2.onmessage = onMessage(dispatch);

        // will use port for further communication
        // stop to listen to window message
        window.removeEventListener('message', receiveContextMessage);

        // if offline, we need to set up the listeners here
        // todo: might need a refactor
        if (context?.offlineBool) {
          window.addEventListener('message', receiveMessage(dispatch));
        }

        dispatch(flagGettingContext(false));
      }
    };
    window.addEventListener('message', receiveContextMessage);
    // request parent to provide item data (item id, settings...) and access token
    postMessage({
      type: GET_CONTEXT,
      payload: {
        app: GRAASP_APP_ID,
        origin: window.location.origin,
      },
    });
  } catch (err) {
    dispatch({
      type: GET_CONTEXT_FAILED,
      payload: err,
    });
    // } finally {
    //   dispatch(flagGettingContext(false));
  }
};

export {
  // todo: remove with more exports
  // eslint-disable-next-line import/prefer-default-export
  getContext,
  getAuthToken,
};

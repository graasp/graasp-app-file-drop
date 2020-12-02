import Qs from 'qs';
import {
  FLAG_GETTING_CONTEXT,
  GET_CONTEXT_FAILED,
  GET_CONTEXT_SUCCEEDED,
} from '../types';
import { receiveMessage, receiveFile } from './listener';
import { flag } from './common';
import { DEFAULT_API_HOST, DEFAULT_MODE } from '../config/settings';
import { DEFAULT_VIEW } from '../config/views';
import isInFrame from '../utils/isInFrame';

// flags
const flagGettingContext = flag(FLAG_GETTING_CONTEXT);

/**
 * synchronously gets the context from the query string
 * @returns {Function}
 */
const getContext = () => dispatch => {
  dispatch(flagGettingContext(true));
  try {
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
      userType = null,
      offline = 'false',
      dev = 'false',
      test = 'false',
    } = Qs.parse(window.location.search, { ignoreQueryPrefix: true });

    const offlineBool = offline === 'true';
    const devBool = dev === 'true';

    const testBool = test === 'true';

    // the standalone mode is set to true when the application is not in dev mode and in not embedded inside a frame
    // this parameter is false in case of test (in dev mode), where a frame is mocked
    const standalone = !devBool && (testBool || !isInFrame());

    const context = {
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
      userType,
      offline: offlineBool,
      dev: devBool,
      test: testBool,
    };

    // if offline, we need to set up the listeners here
    if (offlineBool) {
      window.addEventListener('message', receiveMessage(dispatch));
      window.addEventListener('message', receiveFile(dispatch));
    }

    dispatch({
      type: GET_CONTEXT_SUCCEEDED,
      payload: context,
    });
  } catch (err) {
    dispatch({
      type: GET_CONTEXT_FAILED,
      payload: err,
    });
  } finally {
    dispatch(flagGettingContext(false));
  }
};

export {
  // todo: remove with more exports
  // eslint-disable-next-line import/prefer-default-export
  getContext,
};

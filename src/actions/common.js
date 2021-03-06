import {
  MISSING_API_HOST_MESSAGE,
  MISSING_APP_INSTANCE_ID_MESSAGE,
  MISSING_SPACE_ID_MESSAGE,
  UNEXPECTED_ERROR_MESSAGE,
} from '../constants/messages';

const flag = type => payload => dispatch =>
  dispatch({
    type,
    payload,
  });

const isErrorResponse = async response => {
  const LOWEST_HTTP_ERROR_CODE = 400;
  const HIGHEST_HTTP_ERROR_CODE = 599;

  if (
    response.status >= LOWEST_HTTP_ERROR_CODE &&
    response.status <= HIGHEST_HTTP_ERROR_CODE
  ) {
    // assumes response has a message property
    const { message = UNEXPECTED_ERROR_MESSAGE } = await response.json();

    throw Error(message);
  }
};

const getApiContext = getState => {
  const { context } = getState();
  const {
    apiHost,
    appInstanceId,
    spaceId,
    userId,
    offline,
    subSpaceId,
    sessionId,
    dev,
    standalone,
  } = context;

  if (standalone) {
    return {
      dev,
      standalone,
    };
  }

  // these bits of context are needed when running online
  if (!offline) {
    if (!apiHost) {
      throw Error(MISSING_API_HOST_MESSAGE);
    }
    if (!appInstanceId) {
      throw Error(MISSING_APP_INSTANCE_ID_MESSAGE);
    }
    if (!spaceId) {
      throw Error(MISSING_SPACE_ID_MESSAGE);
    }
  }
  return {
    apiHost,
    appInstanceId,
    spaceId,
    userId,
    offline,
    subSpaceId,
    sessionId,
    dev,
  };
};

const postMessage = data => {
  const message = JSON.stringify(data);
  if (window.parent.postMessage) {
    window.parent.postMessage(message, '*');
  } else {
    console.error('unable to find postMessage');
  }
};

export { flag, isErrorResponse, getApiContext, postMessage };

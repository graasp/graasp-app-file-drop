import React, { useState } from 'react';
import PropTypes from 'prop-types';

import {
  DEFAULT_API_HOST,
  DEFAULT_MODE,
  GRAASP_APP_ID,
} from '../../config/settings';
import { DEFAULT_VIEW } from '../../config/views';

const AppDataContext = React.createContext();

let port2 = null;

const postMessage = data => {
  const message = JSON.stringify(data);
  if (window.parent.postMessage) {
    window.parent.postMessage(message, '*');
  } else {
    // console.error('unable to find postMessage');
  }
};

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

  // const standalone = !devBool && !isInFrame();

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
    // standalone,
    offline: offlineBool,
    dev: devBool,
    itemId,
  };
};

const AppDataContextProvider = ({ children }) => {
  const [messagePort, setMessagePort] = useState(null);
  const [mode, setMode] = useState(DEFAULT_MODE);
  const [view, setView] = useState(DEFAULT_VIEW);
  const [lang, setLang] = useState('en');
  const [apiHost, setApiHost] = useState(DEFAULT_API_HOST);
  const [appInstanceId, setAppInstanceId] = useState(null);
  const [spaceId, setSpaceId] = useState(null);
  const [subSpaceId, setSubSpaceId] = useState(null);
  const [userId, setUserId] = useState(null);
  const [sessionId, setSessionId] = useState(null);
  const [offline, setOffline] = useState('false');
  const [dev, setDev] = useState('false');
  const [itemId, setItemId] = useState(null);
  const [token, setToken] = useState(null);
  const [reFetch, setReFetch] = useState(false);
  const [headerVisible, setHeaderVisible] = useState(false);
  const [publicStudentUploads, setPublicStudentUploads] = useState(false);

  const dispatch = () => {};

  // let contextMessage = {};
  // get context
  const getContext = dispatch1 => {
    if (!port2) {
      const receiveContextMessage = event => {
        const { type, payload } = event.data || {};
        let { context } = {};
        // get init message getting the Message Channel port
        if (type === 'GET_CONTEXT_SUCCEEDED') {
          // eslint-disable-next-line no-unused-vars
          context = buildContext(payload);
          dispatch1({
            context,
          });
          const [port] = event.ports;
          setApiHost(context.apiHost);
          setItemId(context.itemId);
          setMode(context.mode);
          setUserId(context.userId);
          port2 = port;
          setMessagePort(port2);
          port2?.postMessage(
            JSON.stringify({
              type: 'GET_AUTH_TOKEN',
              payload: {
                app: GRAASP_APP_ID,
                origin: window.location.origin,
              },
            }),
          );
          port.onmessage = data3 => {
            const { type: type2, payload: payload2 } = JSON.parse(data3.data);
            if (type2 === 'GET_AUTH_TOKEN_SUCCEEDED') {
              console.log('--------payloadtoken');
              console.log(payload2);
              setToken(payload2.token);
            }
            if (type2 === 'UPDATE_SETTINGS_SUCCEEDED') {
              console.log('--------payload');
              console.log(payload2);
            }
          };
          // window.removeEventListener('message', receiveContextMessage);
        }
      };
      window.addEventListener('message', receiveContextMessage);
      // request parent to provide item data (item id, settings...) and access token
      postMessage({
        type: 'GET_CONTEXT',
        payload: {
          app: GRAASP_APP_ID,
          origin: window.location.origin,
        },
      });
    }
  };
  getContext(dispatch);

  return (
    <AppDataContext.Provider
      value={{
        messagePort,
        setMessagePort,
        mode,
        setMode,
        view,
        setView,
        lang,
        setLang,
        apiHost,
        setApiHost,
        appInstanceId,
        setAppInstanceId,
        spaceId,
        setSpaceId,
        subSpaceId,
        setSubSpaceId,
        userId,
        setUserId,
        sessionId,
        setSessionId,
        offline,
        setOffline,
        dev,
        setDev,
        itemId,
        setItemId,
        token,
        setToken,
        reFetch,
        setReFetch,
        headerVisible,
        setHeaderVisible,
        publicStudentUploads,
        setPublicStudentUploads,
      }}
    >
      {children}
    </AppDataContext.Provider>
  );
};

AppDataContextProvider.propTypes = {
  children: PropTypes.node,
};

AppDataContextProvider.defaultProps = {
  children: null,
};

export { AppDataContext, AppDataContextProvider };
export const useAppDataContext = () => React.useContext(AppDataContextProvider);

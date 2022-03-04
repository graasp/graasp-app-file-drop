import React from 'react';
import ReactDOM from 'react-dom';
import '@graasp/ui/dist/bundle.css';
import { buildMockLocalContext, mockServer } from '@graasp/apps-query-client';
import Root from './components/Root';
import './index.css';
import buildDatabase from './data/db';
import * as serviceWorker from './registerServiceWorker';
import { MOCK_API } from './config/constants';

// setup mocked api for cypress or standalone app
if (MOCK_API) {
  const appContext = buildMockLocalContext(window.appContext);
  // automatically append item id as a query string
  const searchParams = new URLSearchParams(window.location.search);
  if (!searchParams.get('itemId')) {
    searchParams.set('itemId', appContext.itemId);
    window.location.search = searchParams.toString();
  }
  const database = window.Cypress ? window.database : buildDatabase(appContext);
  const errors = window.apiErrors;
  mockServer({ database, appContext, errors });
}

ReactDOM.render(
  <React.StrictMode>
    <Root />
  </React.StrictMode>,
  document.getElementById('root'),
);
serviceWorker.unregister();

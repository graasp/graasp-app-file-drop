import React from 'react';
import ReactDOM from 'react-dom/client';

import { MockSolution, mockApi } from '@graasp/apps-query-client';

import * as Sentry from '@sentry/react';

import Root from './components/Root';
import { MOCK_API } from './config/env';
import { generateSentryConfig } from './config/sentry';
import buildDatabase, { mockContext, mockMembers } from './data/db';
import './index.css';

Sentry.init({
  integrations: [
    Sentry.replayIntegration(),
    Sentry.browserTracingIntegration(),
  ],
  ...generateSentryConfig(),
});

// setup mocked api for cypress or standalone app
/* istanbul ignore next */
if (MOCK_API) {
  mockApi(
    {
      dbName: window.Cypress ? 'graasp-app-cypress' : undefined,
      appContext: window.Cypress ? window.appContext : mockContext,
      database: window.Cypress ? window.database : buildDatabase(mockMembers),
      errors: window.apiErrors,
    },
    MockSolution.MirageJS,
  );
}

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement,
);

root.render(
  <React.StrictMode>
    <Root />
  </React.StrictMode>,
);

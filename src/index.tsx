import React from 'react';
import ReactDOM from 'react-dom/client';
import '@graasp/ui/dist/bundle.css';
import { mockApi } from '@graasp/apps-query-client';
import Root from './components/Root';
import './index.css';
import buildDatabase, { mockContext, mockMembers } from './data/db';
import { MOCK_API } from './config/constants';

// setup mocked api for cypress or standalone app
if (MOCK_API) {
  mockApi({
    appContext: window.Cypress ? window.appContext : mockContext,
    database: window.Cypress
      ? window.database
      : buildDatabase(mockContext, mockMembers),
  });
}

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement,
);

root.render(<Root />);

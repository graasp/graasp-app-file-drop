import 'cypress-file-upload';
import { MOCK_SERVER_ITEM } from '../fixtures/appData';

import { CURRENT_MEMBER, MEMBERS } from '../fixtures/members';

Cypress.Commands.add(
  'setUpApi',
  ({
    currentMember = CURRENT_MEMBER,
    database = {},
    appContext,
    errors = {},
  } = {}) => {
    // mock api and database
    Cypress.on('window:before:load', (win) => {
      win.database = {
        currentMember,
        currentItemId: MOCK_SERVER_ITEM.id,
        members: Object.values(MEMBERS),
        ...database,
      };
      win.appContext = appContext;
      win.apiErrors = errors;
    });
  },
);

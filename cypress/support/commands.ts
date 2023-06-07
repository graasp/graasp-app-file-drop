/// <reference types="../../src/window" />
import 'cypress-file-upload';

import { MOCK_SERVER_API_HOST } from '../fixtures/appData';
import { CURRENT_MEMBER, MEMBERS } from '../fixtures/members';
import { MOCK_SERVER_ITEM } from '../fixtures/mockItem';

Cypress.Commands.add(
  'setUpApi',
  ({ currentMember = CURRENT_MEMBER, database, appContext, errors } = {}) => {
    // mock api and database
    Cypress.on('window:before:load', (win: Window) => {
      // eslint-disable-next-line no-param-reassign
      win.database = {
        appData: [],
        appActions: [],
        appSettings: [],
        members: Object.values(MEMBERS),
        items: [MOCK_SERVER_ITEM],
        ...database,
      };
      // eslint-disable-next-line no-param-reassign
      win.appContext = {
        memberId: currentMember.id,
        itemId: MOCK_SERVER_ITEM.id,
        apiHost: Cypress.env('REACT_APP_API_HOST') || MOCK_SERVER_API_HOST,
        ...appContext,
      };
      // eslint-disable-next-line no-param-reassign
      win.apiErrors = errors ?? { deleteAppDataShouldThrow: false };
    });
  },
);

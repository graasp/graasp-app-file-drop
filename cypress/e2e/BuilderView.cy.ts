import { Context, PermissionLevel } from '@graasp/sdk';

import {
  DASHBOARD_UPLOADER_ID,
  DOWNLOAD_ALL_CYPRESS,
  HEADER_REFRESH_BUTTON_CYPRESS,
  SETTING_HEADER_VISIBILITY_SWITCH_CYPRESS,
  TABLE_CELL_FILE_ACTION_DOWNLOAD_CYPRESS,
  buildTableRowId,
  dataCyWrapper,
} from '../../src/config/selectors';
import {
  MOCK_APP_DATA,
  MOCK_FILE,
  MOCK_STUDENT_APP_DATA,
} from '../fixtures/appData';
import { checkRow, deleteFile, openSettings } from '../support/utils';

describe('<BuilderView />', () => {
  describe('Upload a file', () => {
    beforeEach(() => {
      cy.setUpApi({
        database: { appData: [MOCK_APP_DATA, MOCK_STUDENT_APP_DATA] },
        appContext: {
          memberId: MOCK_APP_DATA.creator,
          permission: PermissionLevel.Admin,
          context: Context.BUILDER,
        },
      });
      cy.visit('/');
    });

    it('uploading a file does not crash', () => {
      // bug: for some reason miragejs interfers with uppy
      // which always results in a successful requests and stops
      cy.get(`#${DASHBOARD_UPLOADER_ID} .uppy-Dashboard-input`).attachFile(
        MOCK_FILE,
        {
          subjectType: 'drag-n-drop',
        },
      );
    });

    it('show already saved data', () => {
      checkRow(MOCK_APP_DATA, true);
      checkRow(MOCK_STUDENT_APP_DATA, true);
    });
    it('Refresh data', () => {
      cy.get(dataCyWrapper(HEADER_REFRESH_BUTTON_CYPRESS)).click();
      checkRow(MOCK_APP_DATA, true);
      checkRow(MOCK_STUDENT_APP_DATA, true);
    });
  });
  describe('Delete a file', () => {
    beforeEach(() => {
      cy.setUpApi({
        database: { appData: [MOCK_APP_DATA, MOCK_STUDENT_APP_DATA] },
        appContext: {
          memberId: MOCK_APP_DATA.creator,
          permission: PermissionLevel.Admin,
          context: Context.BUILDER,
        },
      });
      cy.visit('/');
    });
    it('deleting a file successfully', () => {
      const { id } = MOCK_APP_DATA;
      deleteFile({ id });

      checkRow(MOCK_STUDENT_APP_DATA, true);
    });
  });
  describe('Download a file', () => {
    beforeEach(() => {
      cy.setUpApi({
        database: { appData: [MOCK_APP_DATA] },
        appContext: {
          memberId: MOCK_APP_DATA.creator,
          permission: PermissionLevel.Admin,
          context: Context.BUILDER,
        },
      });
      cy.visit('/');
    });
    it('downloading a file successfully', () => {
      const { id } = MOCK_APP_DATA;

      cy.get(
        `#${buildTableRowId(id)} ${dataCyWrapper(
          TABLE_CELL_FILE_ACTION_DOWNLOAD_CYPRESS,
        )}`,
      ).click();
    });
    it('downloads all files as a ZIP archive', () => {
      cy.get(dataCyWrapper(DOWNLOAD_ALL_CYPRESS)).click();

      cy.log('**confirm downloaded ZIP**');
      // TODO: Complete this test. See https://github.com/cypress-io/cypress-example-recipes/blob/master/examples/testing-dom__download/cypress/e2e/utils.js
    });
  });
  describe('Settings', () => {
    beforeEach(() => {
      cy.setUpApi({
        database: { appData: [MOCK_APP_DATA] },
        appContext: {
          memberId: MOCK_APP_DATA.creator,
          permission: PermissionLevel.Admin,
          context: Context.BUILDER,
        },
      });
      cy.visit('/');
    });
    it('Show Header to Students', () => {
      openSettings();
      cy.get(dataCyWrapper(SETTING_HEADER_VISIBILITY_SWITCH_CYPRESS)).click();
    });
  });
  describe('Handling errors', () => {
    it('Fail to delete a file still shows app data', () => {
      const data = MOCK_APP_DATA;
      const { id, creator } = data;
      cy.setUpApi({
        database: { appData: [data] },
        appContext: {
          memberId: creator,
          permission: PermissionLevel.Admin,
          context: Context.BUILDER,
        },
        errors: { deleteAppDataShouldThrow: true },
      });
      cy.visit('/');

      deleteFile({ id });

      checkRow(data, true);
    });
  });
});

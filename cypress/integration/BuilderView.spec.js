import { PERMISSION_LEVELS } from '../../src/config/constants';
import CONTEXTS from '../../src/config/contexts';
import {
  buildTableRowId,
  DASHBOARD_UPLOADER_ID,
  dataCyWrapper,
  SETTING_HEADER_VISIBILITY_SWITCH_CYPRESS,
  TABLE_CELL_FILE_ACTION_DOWNLOAD_CYPRESS,
  HEADER_REFRESH_BUTTON_CYPRESS,
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
          permission: PERMISSION_LEVELS.ADMIN,
          context: CONTEXTS.BUILDER,
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
          permission: PERMISSION_LEVELS.ADMIN,
          context: CONTEXTS.BUILDER,
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
          permission: PERMISSION_LEVELS.ADMIN,
          context: CONTEXTS.BUILDER,
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
  });
  describe('Settings', () => {
    beforeEach(() => {
      cy.setUpApi({
        database: { appData: [MOCK_APP_DATA] },
        appContext: {
          memberId: MOCK_APP_DATA.creator,
          permission: PERMISSION_LEVELS.ADMIN,
          context: CONTEXTS.BUILDER,
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
          permission: PERMISSION_LEVELS.ADMIN,
          context: CONTEXTS.BUILDER,
        },
        errors: { deleteAppDataShouldThrow: true },
      });
      cy.visit('/');

      deleteFile({ id });
      cy.wait(1000);

      checkRow(data, true);
    });
  });
});

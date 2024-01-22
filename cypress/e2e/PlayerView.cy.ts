import {
  DASHBOARD_UPLOADER_ID,
  ROW_NO_FILES_UPLOADED_ID,
  TABLE_CELL_FILE_ACTION_DOWNLOAD_CYPRESS,
  buildTableRowId,
  dataCyWrapper,
} from '../../src/config/selectors';
import { MOCK_APP_DATA, MOCK_FILE } from '../fixtures/appData';
import { checkRow, deleteFile } from '../support/utils';

describe('<PlayerView />', () => {
  describe('Upload a file', () => {
    beforeEach(() => {
      cy.setUpApi({
        database: { appData: [MOCK_APP_DATA] },
        appContext: { memberId: MOCK_APP_DATA.creator!.id },
      });
      cy.visit('/');
    });

    it('uploading a file does not crash', () => {
      // bug: for some reason miragejs interfers with uppy in cypress
      // which always results in a successful requests and stops
      cy.get(`#${DASHBOARD_UPLOADER_ID} .uppy-Dashboard-input`).attachFile(
        MOCK_FILE,
        {
          subjectType: 'drag-n-drop',
        },
      );
    });

    it('show already saved data', () => {
      checkRow(MOCK_APP_DATA);
    });
  });
  describe('Delete a file', () => {
    beforeEach(() => {
      cy.setUpApi({
        database: { appData: [MOCK_APP_DATA] },
        appContext: { memberId: MOCK_APP_DATA.creator!.id },
      });
      cy.visit('/');
    });
    it('deleting a file successfully', () => {
      const { id } = MOCK_APP_DATA;
      deleteFile({ id });

      // assert ui
      cy.get(`#${ROW_NO_FILES_UPLOADED_ID}`).should('exist');
    });
  });
  describe('Download a file', () => {
    beforeEach(() => {
      cy.setUpApi({
        database: { appData: [MOCK_APP_DATA] },
        appContext: { memberId: MOCK_APP_DATA.creator!.id },
      });
      cy.visit('/');
    });
    it('downloading a file successfully', () => {
      const { id } = MOCK_APP_DATA;
      // assert ui
      cy.get(
        `#${buildTableRowId(id)} ${dataCyWrapper(
          TABLE_CELL_FILE_ACTION_DOWNLOAD_CYPRESS,
        )}`,
      ).click();
    });
  });
  describe('Handling errors', () => {
    it('Fail to delete a file still shows app data', () => {
      const data = MOCK_APP_DATA;
      const { id, creator } = data;
      cy.setUpApi({
        database: { appData: [data] },
        appContext: { memberId: creator!.id },
        errors: { deleteAppDataShouldThrow: true },
      });
      cy.visit('/');

      deleteFile({ id });

      checkRow(data);
    });
  });
});

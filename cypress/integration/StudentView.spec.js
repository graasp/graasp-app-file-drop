import configureUppy from '../../src/utils/uppy';
import {
  POST_FILE,
  DELETE_FILE,
  POST_FILE_SUCCEEDED,
  POST_FILE_FAILED,
  POST_APP_INSTANCE_RESOURCE,
  POST_APP_INSTANCE_RESOURCE_SUCCEEDED,
  DELETE_APP_INSTANCE_RESOURCE_SUCCEEDED,
  DELETE_APP_INSTANCE_RESOURCE_FAILED,
  DELETE_APP_INSTANCE_RESOURCE,
  DELETE_FILE_SUCCEEDED,
  POST_APP_INSTANCE_RESOURCE_FAILED,
  DELETE_FILE_FAILED,
} from '../../src/types';
import { FILE } from '../../src/config/appInstanceResourceTypes';
import {
  TABLE_CELL_FILE_NAME,
  TABLE_CELL_FILE_ACTION_DELETE,
  TABLE_CELL_FILE_CREATED_AT,
  ROW_NO_FILES_UPLOADED_ID,
} from '../../src/constants/selectors';
import { DEFAULT_VISIBILITY } from '../../src/config/settings';
import { appQueryParameters, studentUserId } from '../fixtures/queryParameters';

const uploadFile = (
  uppy,
  { name, type, filepath, user, visibility = DEFAULT_VISIBILITY },
) => {
  // programmatically add file to uppy, it will trigger the upload automatically
  const filename = name || filepath;
  uppy.addFile({
    name: filename,
    type,
    userId: user,
    data: { name: filename, path: filepath },
  });

  // assert postMessage is sent to upload the file locally
  cy.get('@postMessage')
    .should('be.calledWithMatch', `"type":"${POST_FILE}"`)
    .should('be.calledWithMatch', `"name":"${name}"`)
    .should('be.calledWithMatch', `"visibility":"${visibility}"`)
    .should('be.calledWithMatch', `"userId":"${user}"`)
    .should('be.calledWithMatch', `"path":"${filepath}"`);
};

const uploadFileSuccessfully = (uppy, file) => {
  uploadFile(uppy, file);

  const { name, user, createdAt, uri, visibility = DEFAULT_VISIBILITY } = file;

  // simulate post file success
  const payload = {
    data: { name, uri },
    createdAt,
    visibility,
    userId: user,
    type: FILE,
  };
  const message = {
    type: POST_FILE_SUCCEEDED,
    payload,
  };
  cy.postMessage(message);

  // assert postMessage with corresponding appInstanceResource
  cy.get('@postMessage')
    .should('be.calledWithMatch', `"type":"${POST_APP_INSTANCE_RESOURCE}"`)
    .should('be.calledWithMatch', `"name":"${name}"`)
    .should('be.calledWithMatch', `"visibility":"${visibility}"`)
    .should('be.calledWithMatch', `"userId":"${user}"`)
    .should('be.calledWithMatch', `"uri":"${uri}"`);

  // simulate post appInstanceResource success
  // payload is obtained from post file request
  // generate some random id
  const id = Math.random()
    .toString(36)
    .substr(2, 9);
  const msg = {
    type: POST_APP_INSTANCE_RESOURCE_SUCCEEDED,
    payload: {
      id,
      data: { name, uri },
      createdAt,
      visibility,
      user,
      type: FILE,
    },
  };
  cy.postMessage(msg);

  // assert ui
  const rowSelector = `#${id}`;
  cy.get(`${rowSelector} [data-cy='${TABLE_CELL_FILE_NAME}']`)
    .should('have.text', name)
    .should('have.attr', 'href', uri);
  cy.get(`${rowSelector} [data-cy='${TABLE_CELL_FILE_ACTION_DELETE}']`).should(
    'exist',
  );
  cy.get(`${rowSelector} [data-cy='${TABLE_CELL_FILE_CREATED_AT}']`).should(
    'have.text',
    new Date(createdAt).toLocaleString(),
  );

  return id;
};

const deleteFile = ({ id, name, uri }) => {
  // click on delete
  cy.get(`#${id} [data-cy="${TABLE_CELL_FILE_ACTION_DELETE}"]`).click();

  // assert postMessage is sent to delete the app instance resource
  cy.get('@postMessage')
    .should('be.calledWithMatch', `"type":"${DELETE_APP_INSTANCE_RESOURCE}"`)
    .should('be.calledWithMatch', `"name":"${name}"`)
    .should('be.calledWithMatch', `"id":"${id}"`)
    .should('be.calledWithMatch', `"uri":"${uri}"`);
};

describe('<StudentView />', () => {
  describe('when offline = true', () => {
    let uppy = null;

    beforeEach(() => {
      cy.visitOffline({ appQueryParameters, userId: studentUserId });

      // create another identical uppy to simulate behavior
      uppy = configureUppy({
        offline: true,
        ...appQueryParameters,
        userId: studentUserId,
      });
    });

    describe('Upload a file', () => {
      it('uploading a file saves it locally and saves the corresponding appInstanceResource', () => {
        const fixturePath = 'icon.png';
        const name = 'myIcon';
        const createdAt = new Date();
        const uri = 'some/uri';
        uploadFileSuccessfully(uppy, {
          name,
          uri,
          type: 'image/png',
          filepath: fixturePath,
          createdAt,
          user: studentUserId,
        });
      });

      it('failing to upload a file throws error', () => {
        const fixturePath = 'icon.png';
        const name = 'myIcon';
        const createdAt = new Date();
        const uri = 'some/uri';
        uploadFile(uppy, {
          name,
          uri,
          type: 'image/png',
          filepath: fixturePath,
          createdAt,
          user: studentUserId,
        });

        // simulate post file failure
        const payload = 'the file was not uploaded';
        const message = {
          type: POST_FILE_FAILED,
          payload,
        };
        cy.postMessage(message);

        // assert ui
        cy.get(`#${ROW_NO_FILES_UPLOADED_ID}`).should('exist');

        // should show error message
        cy.get('.Toastify__toast--error').should('exist');
      });

      it('failing to save app instance resource still shows nothing', () => {
        const fixturePath = 'icon.png';
        const name = 'myIcon';
        const createdAt = new Date();
        const uri = 'some/uri';
        const visibility = DEFAULT_VISIBILITY;
        const user = studentUserId;
        uploadFile(uppy, {
          name,
          uri,
          type: 'image/png',
          filepath: fixturePath,
          createdAt,
          user,
        });

        // simulate post file success
        const payload = {
          data: { name, uri },
          createdAt,
          visibility,
          userId: user,
          type: FILE,
        };
        const message = {
          type: POST_FILE_SUCCEEDED,
          payload,
        };
        cy.postMessage(message);

        // assert postMessage with corresponding appInstanceResource
        cy.get('@postMessage')
          .should(
            'be.calledWithMatch',
            `"type":"${POST_APP_INSTANCE_RESOURCE}"`,
          )
          .should('be.calledWithMatch', `"name":"${name}"`)
          .should('be.calledWithMatch', `"visibility":"${visibility}"`)
          .should('be.calledWithMatch', `"userId":"${user}"`)
          .should('be.calledWithMatch', `"uri":"${uri}"`);

        // simulate post appInstanceResource failure
        const msg = {
          type: POST_APP_INSTANCE_RESOURCE_FAILED,
          payload: 'An error happened',
        };
        cy.postMessage(msg);

        // should show error message
        cy.get('.Toastify__toast--error').should('exist');
      });
    });
    describe('Delete a file', () => {
      it('deleting a file deletes the local copy and delete the corresponding appInstanceResource', () => {
        const fixturePath = 'icon.png';
        const name = 'myIcon';
        const createdAt = new Date();
        const uri = 'some/uri';
        const visibility = DEFAULT_VISIBILITY;
        const id = uploadFileSuccessfully(uppy, {
          name,
          type: 'image/png',
          filepath: fixturePath,
          createdAt,
          uri,
          visibility,
          user: studentUserId,
        });

        // click on delete button
        deleteFile({ name, uri, id });

        // simulate delete file appInstanceResource success
        const payload = {
          id,
          data: { name, uri },
          createdAt,
          visibility,
          user: studentUserId,
          type: FILE,
        };
        const message = {
          type: DELETE_APP_INSTANCE_RESOURCE_SUCCEEDED,
          payload,
        };
        cy.postMessage(message);

        // assert postMessage with corresponding appInstanceResource delete
        cy.get('@postMessage').should('be.calledWithMatch', id);

        // simulate delete file success
        // payload is obtain from post file request
        const msg = {
          type: DELETE_FILE_SUCCEEDED,
          payload,
        };
        cy.postMessage(msg);

        // assert ui
        cy.get(`#${ROW_NO_FILES_UPLOADED_ID}`).should('exist');
      });
      it('failing to delete an app instance resource keeps file information and throws error', () => {
        const fixturePath = 'icon.png';
        const name = 'myIcon';
        const createdAt = new Date();
        const uri = 'some/uri';
        const visibility = DEFAULT_VISIBILITY;
        const id = uploadFileSuccessfully(uppy, {
          name,
          type: 'image/png',
          filepath: fixturePath,
          createdAt,
          uri,
          visibility,
          user: studentUserId,
        });

        // click on delete button
        deleteFile({ name, uri, id });

        // simulate delete file appInstanceResource failure
        const message = {
          type: DELETE_APP_INSTANCE_RESOURCE_FAILED,
          payload: 'The file could not be deleted',
        };
        cy.postMessage(message);

        // assert ui
        const rowSelector = `#${id}`;
        cy.get(`${rowSelector} [data-cy='${TABLE_CELL_FILE_NAME}']`)
          .should('have.text', name)
          .should('have.attr', 'href', uri);
        cy.get(
          `${rowSelector} [data-cy='${TABLE_CELL_FILE_ACTION_DELETE}']`,
        ).should('exist');
        cy.get(
          `${rowSelector} [data-cy='${TABLE_CELL_FILE_CREATED_AT}']`,
        ).should('have.text', new Date(createdAt).toLocaleString());

        // should show error message
        cy.get('.Toastify__toast--error').should('exist');
      });

      it('failing to delete a file deletes information and does not throw error', () => {
        const fixturePath = 'icon.png';
        const name = 'myIcon';
        const createdAt = new Date();
        const uri = 'some/uri';
        const visibility = DEFAULT_VISIBILITY;
        const id = uploadFileSuccessfully(uppy, {
          name,
          type: 'image/png',
          filepath: fixturePath,
          createdAt,
          uri,
          visibility,
          user: studentUserId,
        });

        // click on delete button
        deleteFile({ name, uri, id });

        // simulate delete file appInstanceResource success
        const payload = {
          id,
          data: { name, uri },
          createdAt,
          visibility,
          userId: studentUserId,
          type: FILE,
        };
        const message = {
          type: DELETE_APP_INSTANCE_RESOURCE_SUCCEEDED,
          payload,
        };
        cy.postMessage(message);

        // assert postMessage with corresponding appInstanceResource delete
        cy.get('@postMessage')
          .should('be.calledWithMatch', `"type":"${DELETE_FILE}"`)
          .should('be.calledWithMatch', `"userId":"${studentUserId}"`)
          .should('be.calledWithMatch', `"name":"${name}"`)
          .should('be.calledWithMatch', `"uri":"${uri}"`);

        // simulate delete file failure
        // payload is obtain from post file request
        const msg = {
          type: DELETE_FILE_FAILED,
          payload: 'An error happened',
        };
        cy.postMessage(msg);

        // assert ui
        cy.get(`#${ROW_NO_FILES_UPLOADED_ID}`).should('exist');
      });
    });
  });
});

import 'cypress-file-upload';
import configUppy from '../../src/utils/uppy';
import {
  POST_FILE,
  POST_FILE_SUCCEEDED,
  POST_APP_INSTANCE_RESOURCE,
  POST_APP_INSTANCE_RESOURCE_SUCCEEDED,
} from '../../src/types';
import { FILE } from '../../src/config/appInstanceResourceTypes';
import {
  TABLE_CELL_FILE_NAME,
  TABLE_CELL_FILE_ACTION_DELETE,
  TABLE_CELL_FILE_CREATED_AT,
} from '../../src/constants/selectors';
import { DEFAULT_VISIBILITY } from '../../src/config/settings';

const userId = '5b56e70ab253020033364416';
const spaceId = '5b56e70ab253020033364411';
const appInstanceId = '6156e70ab253020033364411';

describe('<StudentView />', () => {
  describe('when offline = true', () => {
    beforeEach(() => {
      cy.offlineVisit();
    });

    // when standalone and offline,
    // the input app cannot save data
    it('upload file save file locally and save corresponding appInstanceResource', () => {
      // create another identical uppy to simulate behavior
      const uppy = configUppy({
        offline: true,
        spaceId,
        appInstanceId,
        userId,
      });

      // programmatically add file to uppy, it will trigger the upload automatically
      const fixturePath = 'icon.png';
      uppy.addFile({
        name: fixturePath, // file name
        type: 'image/png', // file type
        data: { name: fixturePath, path: fixturePath }, // file blob
      });

      // assert postMessage is sent to upload the file locally
      cy.get('@postMessage')
        .should('be.calledWithMatch', `"type":"${POST_FILE}"`)
        .should('be.calledWithMatch', `"name":"${fixturePath}"`)
        .should('be.calledWithMatch', `"path":"${fixturePath}"`);

      // simulate post file success
      const uri = 'some/uri';
      const name = 'myIcon';
      const createdAt = new Date();
      const visibility = DEFAULT_VISIBILITY;
      const payload = {
        data: { name, uri },
        createdAt,
        visibility,
        user: userId,
        type: FILE,
      };
      const message = {
        type: POST_FILE_SUCCEEDED,
        payload,
      };
      cy.postMessage(message);

      // assert postMessage with corresponding appInstanceResource post
      cy.get('@postMessage')
        .should('be.calledWithMatch', `"type":"${POST_APP_INSTANCE_RESOURCE}"`)
        .should('be.calledWithMatch', `"name":"${fixturePath}"`)
        .should('be.calledWithMatch', `"uri":"${uri}"`);

      // simulate post appInstanceResource success
      // payload is obtain from post file request
      const msg = {
        type: POST_APP_INSTANCE_RESOURCE_SUCCEEDED,
        payload,
      };
      cy.postMessage(msg);

      // assert ui
      cy.get(`[data-cy='${TABLE_CELL_FILE_NAME}']`)
        .should('have.text', name)
        .should('have.attr', 'href', uri);
      cy.get(`[data-cy='${TABLE_CELL_FILE_ACTION_DELETE}']`).should('exist');
      cy.get(`[data-cy='${TABLE_CELL_FILE_CREATED_AT}']`).should(
        'have.text',
        new Date(createdAt).toLocaleString(),
      );
    });
  });
});

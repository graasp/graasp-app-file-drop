import { AppData } from '@graasp/apps-query-client';

import {
  CONFIRM_DELETE_BUTTON_ID,
  SETTINGS_BUTTON_CYPRESS,
  TABLE_CELL_FILE_ACTION_DELETE_CYPRESS,
  TABLE_CELL_FILE_CREATED_AT_CYPRESS,
  TABLE_CELL_FILE_NAME_CYPRESS,
  TABLE_CELL_FILE_USER_CYPRESS,
  buildTableRowId,
  dataCyWrapper,
} from '../../src/config/selectors';
import { MEMBERS } from '../fixtures/members';

export const deleteFile = ({ id }): void => {
  cy.get(
    `#${buildTableRowId(id)} ${dataCyWrapper(
      TABLE_CELL_FILE_ACTION_DELETE_CYPRESS,
    )}`,
  ).click();

  cy.get(`#${CONFIRM_DELETE_BUTTON_ID}`).click();
};

// interface checkRowInt {
//   _: AppData;
//   checkMember?: boolean;
// }

export const checkRow = (
  { id, createdAt, data: { name }, creator }: AppData,
  checkMember = false,
): void => {
  const rowSelector = `#${buildTableRowId(id)}`;
  cy.get(
    `${rowSelector} ${dataCyWrapper(TABLE_CELL_FILE_NAME_CYPRESS)}`,
  ).should('have.text', name);
  cy.get(
    `${rowSelector} ${dataCyWrapper(TABLE_CELL_FILE_ACTION_DELETE_CYPRESS)}`,
  ).should('exist');
  cy.get(
    `${rowSelector} ${dataCyWrapper(TABLE_CELL_FILE_CREATED_AT_CYPRESS)}`,
  ).should('have.text', new Date(createdAt).toLocaleString());
  if (checkMember) {
    cy.get(
      `${rowSelector} ${dataCyWrapper(TABLE_CELL_FILE_USER_CYPRESS)}`,
    ).should(
      'have.text',
      Object.values(MEMBERS).find(({ id: idT }) => idT === creator)?.name ??
        'Anonymous',
    );
  }
};

export const openSettings = (): void => {
  cy.get(dataCyWrapper(SETTINGS_BUTTON_CYPRESS)).click();
};

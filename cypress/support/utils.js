import {
  buildTableRowId,
  CONFIRM_DELETE_BUTTON_ID,
  dataCyWrapper,
  SETTINGS_BUTTON_CYPRESS,
  TABLE_CELL_FILE_ACTION_DELETE_CYPRESS,
  TABLE_CELL_FILE_CREATED_AT_CYPRESS,
  TABLE_CELL_FILE_NAME_CYPRESS,
  TABLE_CELL_FILE_USER_CYPRESS,
} from '../../src/config/selectors';
import { MEMBERS } from '../fixtures/members';

export const deleteFile = ({ id }) => {
  cy.get(
    `#${buildTableRowId(id)} ${dataCyWrapper(
      TABLE_CELL_FILE_ACTION_DELETE_CYPRESS,
    )}`,
  ).click();

  cy.get(`#${CONFIRM_DELETE_BUTTON_ID}`).click();
};

export const checkRow = (
  { id, createdAt, data: { name }, creator },
  checkMember = false,
) => {
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
      Object.values(MEMBERS).find(({ id }) => id === creator)?.name ??
        'Anonymous',
    );
  }
};

export const openSettings = () => {
  cy.get(dataCyWrapper(SETTINGS_BUTTON_CYPRESS)).click();
};

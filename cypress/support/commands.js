// ***********************************************
// This example commands.js shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//

const { GET_APP_INSTANCE_SUCCEEDED } = require('../../src/types');
const { DEFAULT_MODE } = require('../../src/config/settings');
const { LOAD_PAGE_PAUSE } = require('../constants');

Cypress.Commands.add('postMessage', message => {
  const msg = JSON.stringify(message);
  cy.window().then(win => win.postMessage(msg, '*'));
});

Cypress.Commands.add(
  'visitOffline',
  ({ appQueryParameters, userId }, mode = DEFAULT_MODE) => {
    cy.visit('/', {
      qs: {
        ...appQueryParameters,
        mode,
        userId,
        offline: true,
        test: true,
        dev: true,
      },
      onBeforeLoad(win) {
        // start spying parent postMessage
        cy.spy(win.parent, 'postMessage').as('postMessage');
      },
    });
    cy.wait(LOAD_PAGE_PAUSE);

    // simulate get appInstance
    const msg = { type: GET_APP_INSTANCE_SUCCEEDED, payload: {} };
    cy.postMessage(msg);
  },
);

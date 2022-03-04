// ***********************************************************
// This example support/index.js is processed and
// loaded automatically before your test files.
//
// This is a great place to put global configuration and
// behavior that modifies Cypress.
//
// You can change the location of this file or turn off
// automatically serving support files with the
// 'supportFile' configuration option.
//
// You can read more here:
// https://on.cypress.io/configuration
// ***********************************************************

import '@cypress/code-coverage/support';

import './commands';

Cypress.on('uncaught:exception', (err, runnable, promise) => {
  // returning false here prevents Cypress from failing the test
  // this is necessary to accept wanted error from mirage to fail the test
  if (promise) {
    console.error(
      'This error is caught by cypress and was configured to not throw.',
    );
    return false;
  }
});

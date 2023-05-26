/// <reference types="cypress" />
// eslint-disable-next-line import/no-unresolved
import { mount } from 'cypress/react18';

import { Database, LocalContext } from '@graasp/apps-query-client';
import { Member } from '@graasp/sdk';

declare global {
  namespace Cypress {
    interface Chainable {
      mount: typeof mount;
      /**
       * Custom command to select DOM element by data-cy attribute.
       * @example cy.dataCy('greeting')
       */
      setUpApi({
        database,
        currentMember,
        appContext,
        errors,
      }: {
        database?: Partial<Database>;
        currentMember?: Member;
        appContext?: Partial<LocalContext>;
        errors?:
          | {
              deleteAppDataShouldThrow?: boolean;
            }
          | undefined;
      }): Chainable<Element>;
    }
  }
}

export {};

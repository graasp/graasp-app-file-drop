/// <reference types="cypress" />
import { mount } from 'cypress/react18';

import { Database, LocalContext, Member } from '@graasp/apps-query-client';

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
      }: {
        database?: Partial<Database>;
        currentMember?: Member;
        appContext?: Partial<LocalContext>;
      }): Chainable<Element>;
    }
  }
}

export {};

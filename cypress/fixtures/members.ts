import { Member } from '@graasp/apps-query-client';

export const MEMBERS: { [key: string]: Member } = {
  ANNA: {
    id: '0f0a2774-a965-4b97-afb4-bccc3796e060',
    name: 'anna',
    email: 'anna.test@graasp.org',
    extra: {},
  },
  BOB: {
    id: '1f0a2774-a965-4b97-afb4-bccc3796e060',
    name: 'bob',
    email: 'bob.test@graasp.org',
    extra: {},
  },
};

export const CURRENT_MEMBER = MEMBERS.ANNA;

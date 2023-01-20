import { v4 } from 'uuid';

import type { Database, LocalContext, Member } from '@graasp/apps-query-client';
import { Context, PermissionLevel } from '@graasp/sdk';

import { APP_DATA_TYPES } from '../config/appDataTypes';
import { REACT_APP_API_HOST } from '../config/env';

export const mockContext: LocalContext = {
  apiHost: REACT_APP_API_HOST,
  permission: PermissionLevel.Admin,
  context: Context.BUILDER,
  itemId: '1234-1234-123456-8123-123456',
  memberId: 'mock-member-id',
};

export const mockMembers: Member[] = [
  {
    id: mockContext.memberId || '',
    name: 'current-member',
    email: 'current@graasp.org',
    extra: {},
  },
  {
    id: 'mock-member-id-2',
    name: 'mock-member-2',
    email: 'other-member@graasp.org',
    extra: {},
  },
];

const now = new Date();

const buildDatabase = (
  appContext: Partial<LocalContext>,
  members?: Member[],
): Database => ({
  appData: [
    {
      data: {
        color: '#FFFF99',
        position: { pageX: 100, pageY: 100 },
        text: '<p>note 1</p>',
      },
      id: v4(),
      type: APP_DATA_TYPES.NOTE,
      createdAt: now.toISOString(),
      updatedAt: now.toISOString(),
      creator: mockContext.memberId || v4(),
      memberId: mockContext.memberId || 'm1',
      itemId: mockContext.itemId,
    },
  ],
  appActions: [],
  members: members ?? mockMembers,
  appSettings: [],
});

export default buildDatabase;

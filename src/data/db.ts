import { v4 } from 'uuid';

import type { Database, LocalContext, Member } from '@graasp/apps-query-client';
import { Context, PermissionLevel } from '@graasp/sdk';

import { APP_DATA_TYPES } from '../config/appDataTypes';
import { REACT_APP_API_HOST } from '../config/env';
import { AppDataVisibility } from '../types/appData';

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
      data: {},
      id: v4(),
      type: APP_DATA_TYPES.FILE,
      createdAt: now.toISOString(),
      updatedAt: now.toISOString(),
      creator: mockContext.memberId || v4(),
      memberId: mockContext.memberId || 'm1',
      itemId: mockContext.itemId,
      visibility: AppDataVisibility.MEMBER,
    },
  ],
  appActions: [],
  members: members ?? mockMembers,
  appSettings: [],
});

export default buildDatabase;

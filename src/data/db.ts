import { v4 } from 'uuid';

import type { Database, LocalContext } from '@graasp/apps-query-client';
import {
  AppItemType,
  Context,
  ItemType,
  Member,
  MemberType,
  PermissionLevel,
} from '@graasp/sdk';

import { APP_DATA_TYPES } from '../config/appDataTypes';
import { REACT_APP_API_HOST } from '../config/env';
import { AppDataVisibility } from '../types/appData';

export const mockContext: LocalContext = {
  apiHost: REACT_APP_API_HOST,
  permission: PermissionLevel.Admin,
  context: Context.Builder,
  itemId: '1234-1234-123456-8123-123456',
  memberId: 'mock-member-id',
};

export const mockMembers: Member[] = [
  {
    id: mockContext.memberId || '',
    name: 'current-member',
    email: 'current@graasp.org',
    extra: {},
    createdAt: new Date(),
    updatedAt: new Date(),
    type: MemberType.Individual,
  },
  {
    id: 'mock-member-id-2',
    name: 'mock-member-2',
    email: 'other-member@graasp.org',
    extra: {},
    createdAt: new Date(),
    updatedAt: new Date(),
    type: MemberType.Individual,
  },
];

const mockItem: AppItemType = {
  id: mockContext.itemId,
  path: 'mock_item',
  name: 'item-name',
  description: '',
  creator: mockMembers[0],
  settings: {},
  extra: {
    [ItemType.APP]: {
      url: 'myurl',
    },
  },
  createdAt: new Date(),
  updatedAt: new Date(),
  type: ItemType.APP,
};

const now = new Date();

const buildDatabase = (
  appContext: Partial<LocalContext>,
  members?: Member[],
): Database => ({
  appData: [
    {
      data: {
        s3File: {
          name: 'my file',
        },
      },
      id: v4(),
      type: APP_DATA_TYPES.FILE,
      createdAt: now,
      updatedAt: now,
      creator: mockMembers[0],
      member: mockMembers[0],
      item: mockItem,
      visibility: AppDataVisibility.MEMBER,
    },
  ],
  appActions: [],
  members: members ?? mockMembers,
  appSettings: [],
  items: [mockItem],
});

export default buildDatabase;

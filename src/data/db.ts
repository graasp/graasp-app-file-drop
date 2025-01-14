import type { Database } from '@graasp/apps-query-client';
import {
  AccountType,
  AppDataVisibility,
  AppItemType,
  CompleteMember,
  Context,
  ItemType,
  LocalContext,
  PermissionLevel,
} from '@graasp/sdk';

import { v4 } from 'uuid';

import { APP_DATA_TYPES } from '../config/appDataTypes';
import { API_HOST } from '../config/env';

export const mockContext: LocalContext = {
  apiHost: API_HOST,
  permission: PermissionLevel.Admin,
  context: Context.Builder,
  itemId: '1234-1234-123456-8123-123456',
  accountId: 'mock-member-id',
};

export const mockMembers: CompleteMember[] = [
  {
    id: mockContext.accountId || '',
    name: 'current-member',
    email: 'current@graasp.org',
    extra: {},
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    type: AccountType.Individual,
    enableSaveActions: true,
    isValidated: true,
  },
  {
    id: 'mock-member-id-2',
    name: 'mock-member-2',
    email: 'other-member@graasp.org',
    extra: {},
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    type: AccountType.Individual,
    enableSaveActions: true,
    isValidated: true,
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
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
  type: ItemType.APP,
  lang: 'en',
};

const now = new Date().toISOString();

const buildDatabase = (members?: CompleteMember[]): Database => ({
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
      account: mockMembers[0],
      item: mockItem,
      visibility: AppDataVisibility.Member,
    },
  ],
  appActions: [],
  uploadedFiles: [],
  members: members ?? mockMembers,
  appSettings: [],
  items: [mockItem],
});

export default buildDatabase;

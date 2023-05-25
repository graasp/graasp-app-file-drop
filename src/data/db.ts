
import type { Database, LocalContext } from '@graasp/apps-query-client';
import { AppItemType, Context, ItemType, Member, MemberType, PermissionLevel } from '@graasp/sdk';
import { REACT_APP_API_HOST } from '../config/constants';


export const mockContext: LocalContext = {
  apiHost: REACT_APP_API_HOST,
  permission: PermissionLevel.Read,
  context: Context.Builder,
  itemId: 'mock-item-id',
  memberId: 'mock-member-id',
};

export const mockMembers: Member[] = [
  {
    id: mockContext.memberId || '',
    name: 'current-member',
    email: 'current@graasp.org',
    extra: {},
    type: MemberType.Individual,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: 'mock-member-id-2',
    name: 'mock-member-2',
    email: 'other-member@graasp.org',
    extra: {},
    type: MemberType.Individual,
    createdAt: new Date(),
    updatedAt: new Date()
  },
];


export const MOCK_SERVER_ITEM: AppItemType = {
  id: mockContext.itemId,
  settings: {},
  name: 'app',
  path: '1234567890',
  description: '',
  creator: mockMembers[0],
  createdAt: new Date(),
  updatedAt: new Date(),
  type: ItemType.APP,
  extra: {
    [ItemType.APP]: {
      url: 'myapp.html',
    },
  },
};


const buildDatabase = (
  appContext: Partial<LocalContext>,
  members?: Member[],
): Database => ({
  appData: [],
  appActions: [],
  members: members ?? mockMembers,
  appSettings: [],
  items: [MOCK_SERVER_ITEM]
});

export default buildDatabase;

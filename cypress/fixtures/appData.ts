import { v4 } from 'uuid';

import { AppData } from '@graasp/apps-query-client';

import { APP_DATA_TYPES } from '../../src/config/constants';
import { CURRENT_MEMBER, MEMBERS } from './members';
import { MOCK_SERVER_ITEM } from './mockItem';

export const MOCK_SERVER_API_HOST = 'http://localhost:3636';

const mockAppDataId = v4();

export const MOCK_FILE = 'files/img.png';

export const MOCK_APP_DATA: AppData = {
  id: mockAppDataId,
  data: {
    name: 'my file',
    type: 'file',
    extra: {
      file: 'some/path',
    },
  },
  memberId: CURRENT_MEMBER.id,
  creator: CURRENT_MEMBER.id,
  itemId: MOCK_SERVER_ITEM.id,
  createdAt: new Date('2020-01-01').toISOString(),
  updatedAt: new Date('2020-01-01').toISOString(),
  type: APP_DATA_TYPES.FILE,
};

const mockAppDataId2 = v4();
export const MOCK_STUDENT_APP_DATA: AppData = {
  id: mockAppDataId2,
  data: {
    name: 'my student file',
    type: 'file',
    extra: {
      file: 'some/path',
    },
  },
  memberId: MEMBERS.BOB.id,
  creator: MEMBERS.BOB.id,
  itemId: MOCK_SERVER_ITEM.id,
  createdAt: new Date('2020-01-01').toISOString(),
  updatedAt: new Date('2020-01-01').toISOString(),
  type: APP_DATA_TYPES.FILE,
};

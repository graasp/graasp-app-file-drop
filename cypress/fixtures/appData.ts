import { v4 } from 'uuid';

import { AppData } from '@graasp/sdk';

import { APP_DATA_TYPES } from '../../src/config/appDataTypes';
import { AppDataVisibility } from '../../src/types/appData';
import { CURRENT_MEMBER, MEMBERS } from './members';
import { MOCK_SERVER_ITEM } from './mockItem';

export const MOCK_SERVER_API_HOST = 'http://localhost:3636';

const mockAppDataId = v4();

export const MOCK_FILE = 'files/img.png';

export const MOCK_APP_DATA: AppData = {
  id: mockAppDataId,
  data: {
    s3File: {
      name: 'my file',
      type: 'file',
      extra: {
        file: 'some/path',
      },
    },
  },
  member: CURRENT_MEMBER,
  creator: CURRENT_MEMBER,
  item: MOCK_SERVER_ITEM,
  createdAt: new Date('2020-01-01'),
  updatedAt: new Date('2020-01-01'),
  type: APP_DATA_TYPES.FILE,
  visibility: AppDataVisibility.MEMBER,
};

const mockAppDataId2 = v4();
export const MOCK_STUDENT_APP_DATA: AppData = {
  id: mockAppDataId2,
  data: {
    s3File: {
      name: 'my student file',
      type: 'file',
      extra: {
        file: 'some/path',
      },
    },
  },
  member: MEMBERS.BOB,
  creator: MEMBERS.BOB,
  item: MOCK_SERVER_ITEM,
  createdAt: new Date('2020-01-01'),
  updatedAt: new Date('2020-01-01'),
  type: APP_DATA_TYPES.FILE,
  visibility: AppDataVisibility.MEMBER,
};

import { v4 } from 'uuid';
import { APP_DATA_TYPES } from '../../src/config/constants';
import { CURRENT_MEMBER, MEMBERS } from './members';

export const MOCK_SERVER_ITEM = { id: '1234567890' };

const mockAppDataId = v4();

export const MOCK_FILE = 'files/img.png';

export const MOCK_APP_DATA = {
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
  createdAt: Date.now(),
  type: APP_DATA_TYPES.FILE,
};

const mockAppDataId2 = v4();
export const MOCK_STUDENT_APP_DATA = {
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
  createdAt: Date.now(),
  type: APP_DATA_TYPES.FILE,
};

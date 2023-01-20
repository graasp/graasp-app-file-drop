import { AppData } from '@graasp/apps-query-client';

import { PostAppDataType } from '../types/appData';

enum APP_DATA_TYPES {
  NOTE = 'note',
}

export type NoteDataType = {
  text: string;
  color: string;
  position: { pageX: number; pageY: number };
};

export type NoteType = PostAppDataType & {
  data: NoteDataType;
};
export type ExistingNoteType = AppData & {
  data: NoteDataType;
};

export { APP_DATA_TYPES };

export enum APP_DATA_VISIBILITY {
  MEMBER = 'member',
  ITEM = 'item',
}

export type PostAppDataType = {
  data: { [key: string]: unknown };
  type: string;
  visibility?: APP_DATA_VISIBILITY;
};

export type PatchAppDataType = {
  data: { [key: string]: unknown };
  id: string;
};

export type DeleteAppDataType = {
  id: string;
};

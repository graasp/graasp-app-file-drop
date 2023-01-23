export enum AppDataVisibility {
  MEMBER = 'member',
  ITEM = 'item',
}

export type PostAppDataType = {
  data: { [key: string]: unknown };
  type: string;
  visibility?: AppDataVisibility;
};

export type PatchAppDataType = {
  data: { [key: string]: unknown };
  id: string;
};

export type DeleteAppDataType = {
  id: string;
};

export type PostAppSettingType = {
  data: { [key: string]: unknown };
  name: string;
};

export type PatchAppSettingType = {
  data: { [key: string]: unknown };
  id: string;
};

export type DeleteAppSettingType = {
  id: string;
};

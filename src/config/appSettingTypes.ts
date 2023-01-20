import { AppSetting } from '@graasp/apps-query-client';

enum APP_SETTINGS_TYPES {
  HEADER_VISIBLE = 'headerVisible',
  PUBLIC_STUDENT_UPLOADS = 'publicStudentUploads',
}

export type BackgroundSettingsType = AppSetting & {
  data: {
    toggle: boolean;
  };
};

export type BackgroundType = AppSetting & {
  data: {
    extra?: {
      file?: string;
      s3File?: string;
    };
  };
};

export { APP_SETTINGS_TYPES };

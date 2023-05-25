export const APP_NAME = 'Graasp';

export const ENV = {
  DEVELOPMENT: 'development',
};
export const GRAASP_APP_ID = process.env.REACT_APP_GRAASP_APP_ID;

export const NODE_ENV =
  process.env.REACT_APP_NODE_ENV || process.env.NODE_ENV || ENV.DEVELOPMENT;

export const DESCRIPTION_MAX_LENGTH = 30;

export const DEFAULT_IMAGE_SRC =
  'https://pbs.twimg.com/profile_images/1300707321262346240/IsQAyu7q_400x400.jpg';

export const ROOT_ID = 'root-id';

export const DRAWER_WIDTH = 300;
export const DEFAULT_LOCALE = 'en-US';
export const DEFAULT_LANG = 'en';

export const HEADER_HEIGHT = 64;
export const FILE_UPLOAD_MAX_FILES = 5;

export const MOCK_API = process.env.REACT_APP_ENABLE_MOCK_API === 'true';

export const APP_DATA_TYPES = {
  FILE: 'file',
};

export const APP_SETTINGS = {
  HEADER_VISIBLE: 'headerVisible',
  PUBLIC_STUDENT_UPLOADS: 'publicStudentUploads',
};

export const DEFAULT_HEADER_VISIBLE = false;
export const DEFAULT_PUBLIC_STUDENT_UPLOADS = false;

export const REACT_APP_API_HOST =
  process.env.REACT_APP_API_HOST ?? 'http://localhost:3000';

export const REACT_APP_GRAASP_APP_KEY = process.env.REACT_APP_GRAASP_APP_KEY;


export const MAX_NUM_FILES = 10;
// ten megabytes times 1024 kilobytes/megabyte * 1024 bytes/kilobyte
export const MAX_FILE_SIZE = 10 * 1024 * 1024;

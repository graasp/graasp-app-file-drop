import env from '../env.json';
import { UPLOAD_FILES_METHODS } from '../enums';

const {
  API_HOST: ENV_API_HOST,
  S3_FILES_HOST: ENV_S3_FILES_HOST,
  UPLOAD_METHOD: ENV_UPLOAD_METHOD,
  SHOW_NOTIFICATIONS: ENV_SHOW_NOTIFICATIONS,
  GRAASP_PERFORM_HOST: ENV_GRAASP_PERFORM_HOST,
  AUTHENTICATION_HOST: ENV_AUTHENTICATION_HOST,
  NODE_ENV: ENV_NODE_ENV,
} = env;

export const APP_NAME = 'Graasp';

export const ENV = {
  DEVELOPMENT: 'development',
};

export const NODE_ENV =
  ENV_NODE_ENV ||
  process.env.REACT_APP_NODE_ENV ||
  process.env.NODE_ENV ||
  ENV.DEVELOPMENT;

export const API_HOST =
  ENV_API_HOST || process.env.REACT_APP_API_HOST || 'http://localhost:3111';

export const S3_FILES_HOST =
  ENV_S3_FILES_HOST || process.env.REACT_APP_S3_FILES_HOST || 'localhost';

export const SHOW_NOTIFICATIONS =
  ENV_SHOW_NOTIFICATIONS ||
  process.env.REACT_APP_SHOW_NOTIFICATIONS === 'true' ||
  false;

export const AUTHENTICATION_HOST =
  ENV_AUTHENTICATION_HOST ||
  process.env.REACT_APP_AUTHENTICATION_HOST ||
  'http://localhost:3111';

export const GRAASP_PERFORM_HOST =
  ENV_GRAASP_PERFORM_HOST ||
  process.env.REACT_APP_GRAASP_PERFORM_HOST ||
  'http://localhost:3112';

export const DESCRIPTION_MAX_LENGTH = 30;

export const DEFAULT_IMAGE_SRC =
  'https://pbs.twimg.com/profile_images/1300707321262346240/IsQAyu7q_400x400.jpg';

export const ROOT_ID = 'root-id';

export const DRAWER_WIDTH = 300;
export const DEFAULT_LOCALE = 'en-US';
export const DEFAULT_LANG = 'en';

export const UPLOAD_METHOD =
  ENV_UPLOAD_METHOD ||
  process.env.REACT_APP_UPLOAD_METHOD ||
  UPLOAD_FILES_METHODS.DEFAULT;

export const HEADER_HEIGHT = 64;
export const FILE_UPLOAD_MAX_FILES = 5;

import { APP_DATA_ENDPOINT, APP_ITEMS_ENDPOINT } from '../config/api';
import { API_HOST } from '../config/constants';

export const ITEMS_ROUTE = 'items';
export const APP_ITEMS_ROUTE = 'app-items';

export const buildAppDataRoute = id =>
  `${API_HOST}/${APP_ITEMS_ENDPOINT}/${id}/${APP_DATA_ENDPOINT}`;

export const buildAppDataRoute2 = id => {
  return `${API_HOST}/${APP_ITEMS_ENDPOINT}/${id}/${APP_DATA_ENDPOINT}`;
};

export const buildDownloadFileRoute = id => {
  return `${APP_ITEMS_ENDPOINT}/${id}/download`;
};

export const buildDeleteResourceRoute = ({ itemId, id }) =>
  `${APP_ITEMS_ENDPOINT}/${itemId}/${APP_DATA_ENDPOINT}/${id}`;

export const buildUploadFilesRoute = itemId =>
  `${APP_ITEMS_ENDPOINT}/upload?id=${itemId}`;

export const buildGetAppResourcesRoute = itemId =>
  `${APP_ITEMS_ENDPOINT}/${itemId}/${APP_DATA_ENDPOINT}`;

export const buildGetUsersRoute = itemId =>
  `${APP_ITEMS_ENDPOINT}/${itemId}/context`;

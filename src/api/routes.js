import { APP_DATA_ENDPOINT, APP_ITEMS_ENDPOINT } from '../config/api';

export const ITEMS_ROUTE = 'items';
export const APP_ITEMS_ROUTE = 'app-items';

export const buildGetContextRoute = itemId =>
  `${APP_ITEMS_ENDPOINT}/${itemId}/context`;

export const buildDownloadFileRoute = id =>
  `${APP_ITEMS_ENDPOINT}/${id}/download`;

export const buildDeleteResourceRoute = ({ itemId, id }) =>
  `${APP_ITEMS_ENDPOINT}/${itemId}/${APP_DATA_ENDPOINT}/${id}`;

export const buildUploadFilesRoute = itemId =>
  `${APP_ITEMS_ENDPOINT}/upload?id=${itemId}`;

export const buildGetAppResourcesRoute = itemId =>
  `${APP_ITEMS_ENDPOINT}/${itemId}/${APP_DATA_ENDPOINT}`;

export const buildGetUsersRoute = itemId =>
  `${APP_ITEMS_ENDPOINT}/${itemId}/context`;

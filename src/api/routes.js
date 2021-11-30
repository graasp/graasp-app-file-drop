import { APP_DATA_ENDPOINT, APP_ITEMS_ENDPOINT } from '../config/api';
import { API_HOST } from '../config/constants';

export const buildAppDataRoute = id =>
  `${API_HOST}/${APP_ITEMS_ENDPOINT}/${id}/${APP_DATA_ENDPOINT}`;

export const buildAppDataRoute2 = id => {
  return `${API_HOST}/${APP_ITEMS_ENDPOINT}/${id}/${APP_DATA_ENDPOINT}`;
};

export const buildDownloadFileRoute = id => {
  return `${API_HOST}/${APP_ITEMS_ENDPOINT}/${id}/download`;
};

export const buildDeleteResourceRoute = id =>
  `${APP_ITEMS_ENDPOINT}/86a0eed7-70c6-47ba-8584-00c898c0d134/${APP_DATA_ENDPOINT}/${id}`;

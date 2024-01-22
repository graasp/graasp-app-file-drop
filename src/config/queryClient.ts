import { configureQueryClient } from '@graasp/apps-query-client';

import { MOCK_API, REACT_APP_API_HOST, REACT_APP_GRAASP_APP_KEY } from './env';

if (!REACT_APP_GRAASP_APP_KEY) {
  throw new Error('GRAASP_APP_KEY should be defined');
}

const {
  queryClient,
  QueryClientProvider,
  hooks,
  ReactQueryDevtools,
  API_ROUTES,
  QUERY_KEYS,
  mutations,
} = configureQueryClient({
  API_HOST: REACT_APP_API_HOST,
  GRAASP_APP_KEY: REACT_APP_GRAASP_APP_KEY,
  notifier: (data) => {
    // todo: use toasts
    // eslint-disable-next-line no-console
    console.log('notifier: ', data);
  },
  keepPreviousData: true,
  // avoid refetching when same data are closely fetched
  staleTime: 1000, // ms
  isStandalone: MOCK_API,
  enableWebsocket: false,
});

export {
  queryClient,
  mutations,
  QueryClientProvider,
  hooks,
  ReactQueryDevtools,
  API_ROUTES,
  QUERY_KEYS,
};

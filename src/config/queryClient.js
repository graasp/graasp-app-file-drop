import {
  buildMockLocalContext,
  buildMockParentWindow,
  configureQueryClient,
} from '@graasp/apps-query-client';
import { MOCK_API, REACT_APP_GRAASP_APP_KEY } from './constants';
import notifier from './notifier';
import { mockContext } from '../data/db';

const {
  queryClient,
  QueryClientProvider,
  hooks,
  useMutation,
  ReactQueryDevtools,
  API_ROUTES,
  MUTATION_KEYS,
  routines,
  HOOK_KEYS,
  mutations,
} = configureQueryClient({
  notifier,
  enableWebsocket: true,
  keepPreviousData: true,
  // avoid refetching when same data are closely fetched
  staleTime: 1000, // ms
  GRAASP_APP_KEY: REACT_APP_GRAASP_APP_KEY,
  targetWindow: MOCK_API
    ? // build mock parent window given cypress (app) context or mock data
      buildMockParentWindow(
        buildMockLocalContext(window.Cypress ? window.appContext : mockContext),
      )
    : window.parent,
});

export {
  queryClient,
  QueryClientProvider,
  hooks,
  useMutation,
  ReactQueryDevtools,
  API_ROUTES,
  MUTATION_KEYS,
  routines,
  HOOK_KEYS,
  mutations,
};

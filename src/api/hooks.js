import { useMutation, useQuery } from 'react-query';
import {
  DEFAULT_DELETE_REQUEST,
  DEFAULT_GET_REQUEST,
  DEFAULT_PATCH_REQUEST,
} from '../config/api';
import {
  buildDeleteResourceRoute,
  buildGetAppResourcesRoute,
  buildGetUsersRoute,
} from './routes';

export const useGetAppResources = (token, apiHost, itemId, reFetch) => {
  return useQuery(['resources', reFetch], async () => {
    const url = `${apiHost}/${buildGetAppResourcesRoute(itemId)}`;
    const response = await fetch(url, {
      ...DEFAULT_GET_REQUEST,
      headers: {
        ...DEFAULT_GET_REQUEST.headers,
        Authorization: `Bearer ${token}`,
      },
    });
    const resources = await response.json();
    return resources;
  });
};

export const useGetUsers = (token, apiHost, itemId) => {
  return useQuery('users', async () => {
    const url = `${apiHost}/${buildGetUsersRoute(itemId)}`;
    const response = await fetch(url, {
      ...DEFAULT_GET_REQUEST,
      headers: {
        ...DEFAULT_GET_REQUEST.headers,
        Authorization: `Bearer ${token}`,
      },
    });
    const users = (await response.json())?.members;
    return users;
  });
};

export const useDeleteResource = (token, apiHost, itemId, id) => {
  return useMutation(() => {
    const url = `${apiHost}/${buildDeleteResourceRoute({ itemId, id })}`;

    const response = fetch(url, {
      ...DEFAULT_DELETE_REQUEST,
      headers: {
        ...DEFAULT_PATCH_REQUEST.headers,
        Authorization: `Bearer ${token}`,
      },
    });
    return response;
  });
};

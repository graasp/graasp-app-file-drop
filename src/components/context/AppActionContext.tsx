import { List } from 'immutable';

import React, { FC, PropsWithChildren, createContext, useMemo } from 'react';

import { AppAction } from '@graasp/apps-query-client';
import { Loader } from '@graasp/ui';

import { MUTATION_KEYS, hooks, useMutation } from '../../config/queryClient';

type PostAppActionType = {
  data: { [key: string]: unknown };
  type: string;
};

export type AppActionContextType = {
  postAppAction: (payload: PostAppActionType) => void;
  appActionArray: List<AppAction>;
};

const defaultContextValue = {
  postAppAction: () => null,
  appActionArray: List<AppAction>(),
};

const AppActionContext =
  createContext<AppActionContextType>(defaultContextValue);

export const AppActionProvider: FC<PropsWithChildren> = ({ children }) => {
  const appAction = hooks.useAppActions({ enabled: true });

  const { mutate: postAppAction } = useMutation<
    unknown,
    unknown,
    PostAppActionType
  >(MUTATION_KEYS.POST_APP_ACTION);

  const contextValue: AppActionContextType = useMemo(
    () => ({
      postAppAction: (payload: PostAppActionType) => {
        postAppAction(payload);
      },
      appActionArray: appAction.data || List<AppAction>(),
    }),
    [appAction.data, postAppAction],
  );

  if (appAction.isLoading) {
    return <Loader />;
  }

  return (
    <AppActionContext.Provider value={contextValue}>
      {children}
    </AppActionContext.Provider>
  );
};

export const useAppActionContext = (): AppActionContextType =>
  React.useContext<AppActionContextType>(AppActionContext);

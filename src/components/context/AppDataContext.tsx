import { List } from 'immutable';

import React, { FC, PropsWithChildren, createContext } from 'react';

import { AppDataRecord } from '@graasp/sdk/frontend';
import { Loader } from '@graasp/ui';

import { hooks } from '../../config/queryClient';

export type AppDataContextType = List<AppDataRecord>;

const defaultContextValue = List<AppDataRecord>();

const AppDataContext = createContext<AppDataContextType>(defaultContextValue);

export const AppDataProvider: FC<PropsWithChildren> = ({ children }) => {
  const appData = hooks.useAppData();

  const contextValue: AppDataContextType =
    appData.data || List<AppDataRecord>();

  if (appData.isLoading) {
    return <Loader />;
  }

  return (
    <AppDataContext.Provider value={contextValue}>
      {children}
    </AppDataContext.Provider>
  );
};

export const useAppDataContext = (): AppDataContextType =>
  React.useContext<AppDataContextType>(AppDataContext);

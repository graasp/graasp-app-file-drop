import React, { FC, PropsWithChildren, createContext } from 'react';

import { AppData } from '@graasp/sdk';
import { Loader } from '@graasp/ui';

import { hooks } from '../../config/queryClient';

export type AppDataContextType = AppData[];

const defaultContextValue: AppDataContextType = [];

const AppDataContext = createContext<AppDataContextType>(defaultContextValue);

export const AppDataProvider: FC<PropsWithChildren> = ({ children }) => {
  const appData = hooks.useAppData();

  const contextValue: AppDataContextType = appData.data || defaultContextValue;

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

import { PropsWithChildren, createContext, useContext } from 'react';

import { CircularProgress } from '@mui/material';

import { APP_DATA_TYPES } from '../../config/appDataTypes';
import { hooks } from '../../config/queryClient';
import { AppDataFile, AppDataFileT } from '../../types/appData';

export type AppDataContextType = AppDataFile[];

const defaultContextValue: AppDataContextType = [];

const AppDataContext = createContext<AppDataContextType>(defaultContextValue);

export const AppDataProvider = ({
  children,
}: PropsWithChildren): JSX.Element => {
  const appData = hooks.useAppData<AppDataFileT>({ type: APP_DATA_TYPES.FILE });

  const contextValue: AppDataContextType = appData.data ?? defaultContextValue;

  if (appData.isLoading) {
    return <CircularProgress />;
  }

  return (
    <AppDataContext.Provider value={contextValue}>
      {children}
    </AppDataContext.Provider>
  );
};

export const useAppDataContext = (): AppDataContextType =>
  useContext<AppDataContextType>(AppDataContext);

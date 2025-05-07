import React, { FC, PropsWithChildren, createContext, useMemo } from 'react';

import { CircularProgress } from '@mui/material';

import { AppSetting } from '@graasp/sdk';

import { hooks } from '../../config/queryClient';

export type AppSettingContextType = AppSetting[];

const defaultContextValue: AppSetting[] = [];

const AppSettingContext =
  createContext<AppSettingContextType>(defaultContextValue);

export const AppSettingProvider: FC<PropsWithChildren> = ({ children }) => {
  const appSetting = hooks.useAppSettings();

  const contextValue: AppSettingContextType = useMemo(
    () => appSetting.data || [],
    [appSetting.data],
  );

  if (appSetting.isLoading) {
    return <CircularProgress />;
  }

  return (
    <AppSettingContext.Provider value={contextValue}>
      {children}
    </AppSettingContext.Provider>
  );
};

export const useAppSettingContext = (): AppSettingContextType =>
  React.useContext<AppSettingContextType>(AppSettingContext);

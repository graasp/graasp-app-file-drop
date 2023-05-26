import { List } from 'immutable';

import React, { FC, PropsWithChildren, createContext, useMemo } from 'react';

import { AppSettingRecord } from '@graasp/sdk/frontend';
import { Loader } from '@graasp/ui';

import { hooks } from '../../config/queryClient';

export type AppSettingContextType = List<AppSettingRecord>;

const defaultContextValue = List<AppSettingRecord>();

const AppSettingContext =
  createContext<AppSettingContextType>(defaultContextValue);

export const AppSettingProvider: FC<PropsWithChildren> = ({ children }) => {
  const appSetting = hooks.useAppSettings();

  const contextValue: AppSettingContextType = useMemo(
    () => appSetting.data || List<AppSettingRecord>(),
    [appSetting.data],
  );

  if (appSetting.isLoading) {
    return <Loader />;
  }

  return (
    <AppSettingContext.Provider value={contextValue}>
      {children}
    </AppSettingContext.Provider>
  );
};

export const useAppSettingContext = (): AppSettingContextType =>
  React.useContext<AppSettingContextType>(AppSettingContext);

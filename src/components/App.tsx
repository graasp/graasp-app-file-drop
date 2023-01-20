import React, { FC } from 'react';

import { useLocalContext } from '@graasp/apps-query-client';
import { Context } from '@graasp/sdk';

import { AppDataProvider } from './context/AppDataContext';
import { AppSettingProvider } from './context/AppSettingContext';
import { MembersProvider } from './context/MembersContext';
import BuilderView from './views/BuilderView';
import PlayerView from './views/PlayerView';

const App: FC = () => {
  const context = useLocalContext();

  const renderContent = (): JSX.Element => {
    switch (context?.get('context')) {
      case Context.BUILDER:
        return <BuilderView />;

      case Context.PLAYER:
      default:
        return <PlayerView />;
    }
  };

  return (
    <MembersProvider>
      <AppDataProvider>
        <AppSettingProvider>{renderContent()}</AppSettingProvider>
      </AppDataProvider>
    </MembersProvider>
  );
};
export default App;

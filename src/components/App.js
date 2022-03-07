import React, { useContext } from 'react';
import ModalProviders from './context/ModalProviders';
import { Context } from './context/ContextContext';
import { TokenProvider } from './context/TokenContext';
import CONTEXTS from '../config/contexts';
import BuilderView from './views/BuilderView';
import PlayerView from './views/PlayerView';

const App = () => {
  const context = useContext(Context);

  const renderContent = () => {
    switch (context?.get('context')) {
      case CONTEXTS.BUILDER:
        return (
          <ModalProviders>
            <BuilderView />
          </ModalProviders>
        );

      case CONTEXTS.PLAYER:
      default:
        return (
          <ModalProviders>
            <PlayerView />
          </ModalProviders>
        );
    }
  };

  return <TokenProvider>{renderContent()}</TokenProvider>;
};
export default App;

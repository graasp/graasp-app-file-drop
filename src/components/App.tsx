import BuilderView from './views/BuilderView';
import PlayerView from './views/PlayerView';
import { useLocalContext } from '@graasp/apps-query-client';
import { Context } from '@graasp/sdk';

const App = () => {
  const context = useLocalContext();

  const renderContent = () => {
    switch (context?.get('context')) {
      case Context.Builder:
        return <BuilderView />;

      case Context.Player:
      default:
        return <PlayerView />;
    }
  };

  // eslint-disable-next-line no-unreachable
  return renderContent();
};
export default App;

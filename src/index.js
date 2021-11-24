import React from 'react';
import ReactDOM from 'react-dom';
// import { Provider } from 'react-redux';
import Root from './components/Root';
// import configureStore from './store/configureStore';
import './index.css';
import * as serviceWorker from './registerServiceWorker';
import '@graasp/ui/dist/bundle.css';

ReactDOM.render(
  <React.StrictMode>
    <Root />
  </React.StrictMode>,
  document.getElementById('root'),
);
serviceWorker.unregister();

// const root = document.getElementById('root');

// const renderApp = (RootComponent, store) => {
//   render(
//     <Provider store={store}>
//       <RootComponent />
//     </Provider>,
//     root,
//   );
// };

// render app to the dom
// const { store, history } = configureStore();

// renderApp(Root, store, history);

// if (module.hot) {
//   module.hot.accept('./components/Root', () => {
//     // eslint-disable-next-line global-require
//     const NextRoot = require('./components/Root').default;
//     renderApp(NextRoot, store, history);
//   });
// }

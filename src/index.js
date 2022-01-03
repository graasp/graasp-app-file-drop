import React from 'react';
import ReactDOM from 'react-dom';
import Root from './components/Root';
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

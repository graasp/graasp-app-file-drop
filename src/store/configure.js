import { createStore, applyMiddleware, combineReducers } from 'redux';
import { composeWithDevTools } from 'redux-devtools-extension/developmentOnly';
import { createBrowserHistory } from 'history';
import { connectRouter, routerMiddleware } from 'connected-react-router';
import ReduxThunk from 'redux-thunk';
import { reducer as toastrReducer } from 'react-redux-toastr';
import ReduxPromise from 'redux-promise';

/**
 * configures the store and returns it along with the history for the router
 * @param state
 * @returns {{store: Store<any>, history}}
 */
const configure = state => {
  // apply history to the middleware
  const history = createBrowserHistory();
  const RouterMiddleware = routerMiddleware(history);

  const reducers = combineReducers({ toastr: toastrReducer });

  // create the store
  const store = createStore(
    connectRouter(history)(reducers),
    state,
    composeWithDevTools(
      applyMiddleware(ReduxThunk, ReduxPromise, RouterMiddleware),
    ),
  );
  return {
    store,
    history,
  };
};

export default configure;

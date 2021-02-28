/*
 * @Author: bucai
 * @Date: 2021-02-25 14:03:49
 * @LastEditors: bucai
 * @LastEditTime: 2021-02-26 19:39:50
 * @Description:
 */
import { applyMiddleware, compose, createStore } from 'redux'
import promiseMiddleware from 'redux-promise-middleware';
import reducers from './reducers'

const composeEnhancers =
  typeof window === 'object' &&
    window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ ?
    window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__({
      // Specify extension’s options like name, actionsBlacklist, actionsCreators, serialize...
    }) : compose;
const enhancer = composeEnhancers(
  applyMiddleware(promiseMiddleware),
  // other store enhancers if any
);

const store = createStore(reducers, enhancer)

export default store;
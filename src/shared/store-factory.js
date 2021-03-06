/**
 * This module provides Redux store factory.
 */

/* Conditional requires are absolutely necessary in this module. */
/* eslint-disable global-require */

import { factory as reducerFactory } from 'reducers';
import promiseMiddleware from 'redux-promise';
import { applyMiddleware, compose, createStore } from 'redux';

const IS_DEV = process.env.NODE_ENV === 'development';

const devTools = IS_DEV
  ? require('./containers/DevTools').default.instrument()
  : undefined;

let enhancer = applyMiddleware(promiseMiddleware);
if (IS_DEV) enhancer = compose(enhancer, devTools);

/**
 * Creates Redux store.
 * @param {Object} req Optional. ExpressJS HTTP request. Should be provided in
 *  case of server-side rendering. It will be passed into reducer factory to
 *  create initial state best suited for the requested route.
 * @param {Object} initialState Optional. If provided, it is assigned to be
 *  the initial state of the store.
 * @return Promise which resolves into new Redux store.
 */
export default function storeFactory(req, initialState) {
  return new Promise((resolve) => {
    reducerFactory(req).then((reducer) => {
      const store = createStore(reducer, initialState || {}, enhancer);
      if (IS_DEV && module.hot) {
        module.hot.accept('./reducers', () => {
          require('./reducers').factory()
          .then(newReducer => store.replaceReducer(newReducer));
        });
      }
      resolve(store);
    });
  });
}

import { persistStore } from 'redux-persist';
import { createStore, applyMiddleware } from 'redux';
import createSagaMiddleware from 'redux-saga';
// import { configureStore } from '@reduxjs/toolkit';

import rootReducer from './modules/rootReducer';
import rootSaga from './modules/rootSagas';
import reduxPersist from './modules/reduxPersist';

const sagaMiddleware = createSagaMiddleware();

const store = createStore(
  reduxPersist(rootReducer),
  applyMiddleware(sagaMiddleware)
);

sagaMiddleware.run(rootSaga);

export const persistor = persistStore(store);
export default store;

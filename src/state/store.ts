import {applyMiddleware, legacy_createStore as createStore} from 'redux';
import rootReducer from './reducers';
import rootSaga from './sagas/index';
import {persistReducer, persistStore} from 'redux-persist';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {reducerTransform} from './reducers/reducerTransform';

const createSagaMiddleware = require('redux-saga').default;
const sagaMiddleware = createSagaMiddleware();

const persistConfig = {
  key: 'root',
  version: 1,
  transforms: [reducerTransform],
  storage: AsyncStorage,
  throttle: 3000,
  whitelist: ['app', 'user'],
  writeFailHandler: () => {},
};

const persistedReducer = persistReducer(persistConfig, rootReducer);
const middleWares: any[] = [sagaMiddleware];
const store = createStore(persistedReducer, applyMiddleware(...middleWares));
sagaMiddleware.run(rootSaga);

export const persistor = persistStore(store);
global.store = store;
export default store;

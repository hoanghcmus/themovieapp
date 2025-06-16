import {combineReducers} from 'redux';
import app from './app';

const rootReducer = combineReducers<any>({
  app,
});

export type RootState = ReturnType<typeof rootReducer>;

export default rootReducer;

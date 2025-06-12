import {combineReducers} from 'redux';
import app from './app';
import user from './user';

const rootReducer = combineReducers<any>({
  app,
  user,
});

export type RootState = ReturnType<typeof rootReducer>;

export default rootReducer;

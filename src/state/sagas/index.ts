import {all, call} from 'redux-saga/effects';
import appWatcher from './app';
import userWatcher from './user';

export default function* rootSaga() {
  yield all([call(appWatcher), call(userWatcher)]);
}

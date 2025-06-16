import {all, call} from 'redux-saga/effects';
import appWatcher from './app';

export default function* rootSaga() {
  yield all([call(appWatcher)]);
}

import {createTransform} from 'redux-persist';
import {
  fromPersist as fromPersistApp,
  IAppState,
  toPersist as toPersistApp,
} from './app';

export const reducerTransform = createTransform(
  // To persist
  (inState, key) => {
    switch (key) {
      case 'app':
        return toPersistApp(inState as IAppState);
      default:
        return inState;
    }
  },
  // To Reducer
  (outState, key) => {
    switch (key) {
      case 'app':
        return fromPersistApp(outState as IAppState);
      default:
        return outState;
    }
  },
);

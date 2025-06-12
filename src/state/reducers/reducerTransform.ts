import {createTransform} from 'redux-persist';
import {
  fromPersist as fromPersistApp,
  IAppState,
  toPersist as toPersistApp,
} from './app';
import {
  fromPersist as fromPersistUser,
  toPersist as toPersistUser,
} from './user';

export const reducerTransform = createTransform(
  // To persist
  (inState, key) => {
    switch (key) {
      case 'app':
        return toPersistApp(inState as IAppState);
      case 'user':
        return toPersistUser(inState);
      default:
        return inState;
    }
  },
  // To Reducer
  (outState, key) => {
    switch (key) {
      case 'app':
        return fromPersistApp(outState as IAppState);
      case 'user':
        return fromPersistUser(outState);
      default:
        return outState;
    }
  },
);

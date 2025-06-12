import {IUserState} from '../reducers/user';

export const selectUser = (state: any): IUserState => {
  return state.user;
};

import * as userActions from '../actions/user';
import {ActionType} from 'typesafe-actions';

export interface IUserState {}

export const initialState: IUserState = {};

type Action = ActionType<typeof userActions>;

export default function user(
  state = initialState,
  _action: Action,
): IUserState {
  return state;
}

export const toPersist = (state: any) => {
  const {} = state;
  return {};
};

export const fromPersist = (state: any) => {
  const {} = state;
  return {
    ...initialState,
  };
};

import {createAction, createAsyncAction} from 'typesafe-actions';

export enum UserActionType {
  NONE = '[USER] NONE',
  START_LOGIN = '[USER] START_LOGIN',
  LOGIN_SUCCESS = '[USER] LOGIN_SUCCESS',
  LOGIN_FAILURE = '[USER] LOGIN_FAILURE',
  SET_AUTH_TOKEN = '[USER] SET_AUTH_TOKEN',
}

export const loginActions = createAsyncAction(
  UserActionType.START_LOGIN,
  UserActionType.LOGIN_SUCCESS,
  UserActionType.LOGIN_FAILURE,
)<void, any, any>();

export const setAuthTokensAction = createAction(
  UserActionType.SET_AUTH_TOKEN,
  action => (token?: any) => action(token?.token),
);

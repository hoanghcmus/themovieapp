import {MovieCategory, SortBy} from '../../data-types/aqua';
import * as appActions from '../actions/app';
import {ActionType, getType} from 'typesafe-actions';

export interface IAppState {
  selectedCategory?: MovieCategory;
  selectedSortBy?: SortBy;
}

export const initialState: IAppState = {};

type Action = ActionType<typeof appActions>;

export default function app(state = initialState, action: Action): IAppState {
  switch (action.type) {
    case getType(appActions.setSelectedMovieCategory):
      return {...state, selectedCategory: action.payload};
    case getType(appActions.setSelectedSortBy):
      return {...state, selectedSortBy: action.payload};
    default:
      return state;
  }
}

export const toPersist = (state: IAppState) => {
  const {selectedCategory, selectedSortBy} = state;
  return {selectedCategory, selectedSortBy};
};

export const fromPersist = (state: IAppState) => {
  const {selectedCategory, selectedSortBy} = state;
  return {
    ...initialState,
    selectedCategory,
    selectedSortBy,
  };
};

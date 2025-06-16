import {Movie, MovieCategory, SortBy} from '../../data-types/aqua';
import * as appActions from '../actions/app';
import {ActionType, getType} from 'typesafe-actions';

export interface IAppState {
  selectedCategory?: MovieCategory;
  selectedSortBy?: SortBy;
  watchList?: Array<Movie>;
}

export const initialState: IAppState = {
  selectedCategory: MovieCategory.NOW_PLAYING,
  watchList: [],
};

type Action = ActionType<typeof appActions>;

export default function app(state = initialState, action: Action): IAppState {
  switch (action.type) {
    case getType(appActions.setSelectedMovieCategory):
      return {...state, selectedCategory: action.payload};
    case getType(appActions.setSelectedSortBy):
      return {...state, selectedSortBy: action.payload};
    case getType(appActions.setWatchList):
      return {...state, watchList: action.payload};
    default:
      return state;
  }
}

export const toPersist = (state: IAppState) => {
  const {selectedCategory, selectedSortBy, watchList} = state;
  return {selectedCategory, selectedSortBy, watchList};
};

export const fromPersist = (state: IAppState) => {
  const {selectedCategory, selectedSortBy, watchList} = state;
  return {
    ...initialState,
    selectedCategory,
    selectedSortBy,
    watchList,
  };
};

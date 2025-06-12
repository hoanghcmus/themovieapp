import {createAction} from 'typesafe-actions';
import {MovieCategory, SortBy} from '../../data-types/aqua';

export enum AppActionType {
  NONE = '[APP] NONE',
  SET_SELECTED_MOVIE_CATEGORY = '[APP] SET_SELECTED_MOVIE_CATEGORY',
  SET_SELECTED_SORT_BY = '[APP] SET_SELECTED_SORT_BY',
}

export const setSelectedMovieCategory = createAction(
  AppActionType.SET_SELECTED_MOVIE_CATEGORY,
  (payload: MovieCategory) => payload,
)();

export const setSelectedSortBy = createAction(
  AppActionType.SET_SELECTED_SORT_BY,
  (payload: SortBy) => payload,
)();

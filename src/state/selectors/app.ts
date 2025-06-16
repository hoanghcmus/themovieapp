import log from '../../utils/log';
import {IAppState} from '../reducers/app';

export const selectApp = (state: any): IAppState => {
  log.i(state.app, 'selectApp');
  return state.app;
};

export const selectSelectedCategory = (state: any): any => {
  const app = selectApp(state);
  return app.selectedCategory;
};

export const selectSelectedSortBy = (state: any): any => {
  const app = selectApp(state);
  return app.selectedSortBy;
};

export const selectWatchList = (state: any): any => {
  const app = selectApp(state);
  return app.watchList;
};

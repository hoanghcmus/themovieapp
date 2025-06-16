import {useSelector} from 'react-redux';
import {
  selectSelectedCategory,
  selectSelectedSortBy,
  selectWatchList,
} from '../selectors/app';

export const useSelectedCategory = () => {
  return useSelector(selectSelectedCategory);
};

export const useSelectedSortBy = () => {
  return useSelector(selectSelectedSortBy);
};

export const useWatchList = () => {
  return useSelector(selectWatchList);
};

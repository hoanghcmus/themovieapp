import {useSelector} from 'react-redux';
import {selectSelectedCategory, selectSelectedSortBy} from '../selectors/app';

export const useSelectedCategory = () => {
  return useSelector(selectSelectedCategory);
};

export const useSelectedSortBy = () => {
  return useSelector(selectSelectedSortBy);
};

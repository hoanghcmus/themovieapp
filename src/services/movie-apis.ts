import {MovieCategory, SortBy} from '../data-types/aqua';
import API from './api';

class CommonApi extends API {
  /*
   * https://api.themoviedb.org/3/movie/${category}?language=en-US&page=1
   * GET /movie/${category}?language=${lang}&page=${page}
   * @param data - Object containing category, language, and page
   */
  getMovies = (data: {
    category: MovieCategory;
    language?: string;
    page: number;
  }) => {
    return this.get({
      route: `movie/${data.category}?language=${
        data.language ?? 'en-US'
      }&page=${data.page}`,
    });
  };

  /*
   * https://api.themoviedb.org/3/search/movie?query=${searchQuery}&with_genres=${selectedCategory}&language=en-US&page=${_page}&sort_by=${selectedSortBy}`;
   * GET /search/movie?query=${query}&with_genres=${category}&language=${lang}&page=${page}&sort_by=${sortBy}`;
   * @param data - Object containing query, category, sortBy, language, and page
   */
  queryMovies = (data: {
    query: string;
    category: MovieCategory;
    sortBy?: SortBy;
    language?: string;
    page?: number;
  }) => {
    return this.get({
      route: `search/movie?query=${data.query}&with_genres=${
        data.category
      }&language=${data.language ?? 'en-US'}&page=${data.page ?? 1}&sort_by=${
        data.sortBy
      }`,
    });
  };

  /*
   * https://api.themoviedb.org/3/movie/${movieId}?language=en-US
   * GET /movie/${movieId}?language=${lang}
   * @param data - Object containing movieId and optional language
   */
  getMovieDetail = (data: {movieId: string; language?: string}) => {
    return this.get({
      route: `movie/${data.movieId}?language=${data.language ?? 'en-US'}`,
    });
  };

  /*
   * https://api.themoviedb.org/3/movie/1376434/credits?language=en-US
   * GET /movie/${movieId}/credits?language=${lang}
   */
  getMovieDetailCredits = (data: {movieId: string; language?: string}) => {
    return this.get({
      route: `movie/${data.movieId}/credits?language=${
        data.language ?? 'en-US'
      }`,
    });
  };

  /*
   * https://api.themoviedb.org/3/movie/1376434/recommendations?language=en-US
   * GET /movie/${movieId}/recommendations?language=${lang}&page=${page}
   */
  getMovieDetailRecomendations = (data: {
    movieId: string;
    language?: string;
    page?: number;
  }) => {
    return this.get({
      route: `movie/${data.movieId}/recommendations?language=${
        data.language ?? 'en-US'
      }&page=${data.page ?? 1}`,
    });
  };

  /*
   * https://api.themoviedb.org/3/account/
   * GET /account/
   */
  getAccountDetail = () => {
    return this.get({
      route: '/account',
    });
  };
}

export default new CommonApi();

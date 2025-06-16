/* eslint-disable react-hooks/exhaustive-deps */
import React, {useCallback, useEffect, useState} from 'react';
import {View, SectionList, StyleSheet} from 'react-native';
import {useFocusEffect} from '@react-navigation/native';
import router from '../configs/router';
import Container from './Container';
import AquaDropdownList from '../components/AquaDropdownList';
import AquaInput from '../components/AquaInput';
import AquaButton from '../components/AquaButton';
import MovieApis from '../services/movie-apis';
import {Movie, MovieCategory, SortBy} from '../data-types/aqua';
import {navBarHeight} from '../components/BottomNavBar';
import ScreenNames from '../constants/screenNames';
import AquaText from '../components/AquaText';
import {useDispatch} from 'react-redux';
import {
  setSelectedMovieCategory,
  setSelectedSortBy as storeSelectedSortBy,
} from '../state/actions/app';
import {useSelectedCategory, useSelectedSortBy} from '../state/hooks/app';
import MovieItem from '../components/MovieItem';

type SectionData = {
  title: string;
  data: Array<any>;
};

const MOVIE_SECTION_TITLE = 'Movies';

const HomeScreen = () => {
  const dispatch = useDispatch();
  const selectedCategory = useSelectedCategory();
  const selectedSortBy = useSelectedSortBy();
  const [movies, setMovies] = useState<SectionData[]>([
    {title: MOVIE_SECTION_TITLE, data: []},
  ]);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [isLoadingMore, setIsLoadingMore] = useState(false);

  const [searchQuery, setSearchQuery] = useState('');

  const categoryDatasource = [
    {label: 'Now Playing', value: MovieCategory.NOW_PLAYING},
    {label: 'Upcoming', value: MovieCategory.UPCOMING},
    {label: 'Popular', value: MovieCategory.POPULAR},
  ];

  const sortByDatasource = [
    {label: 'By alphabetical order', value: SortBy.ALPHABET},
    {label: 'By rating', value: SortBy.RATING},
    {label: 'By release date', value: SortBy.RELEASE_DATE},
  ];

  useFocusEffect(
    useCallback(() => {
      router.showBottomNav();
    }, []),
  );

  useEffect(() => {
    fetchMovies(1);
  }, [selectedCategory, selectedSortBy]);

  const fetchMovies = async (newPage = 1) => {
    try {
      setError(null);
      setIsLoadingMore(newPage > 1);
      const response = await MovieApis.getMovies({
        category: selectedCategory,
        page: newPage,
      });
      if (response?.data?.results?.length > 0) {
        const newMovies = response.data.results;
        if (newPage === 1) {
          setMovies([{title: MOVIE_SECTION_TITLE, data: newMovies}]);
        } else {
          setMovies(prevMovies => {
            const updatedMovies = [...prevMovies[0].data, ...newMovies];
            return [{title: MOVIE_SECTION_TITLE, data: updatedMovies}];
          });
        }
      } else if (newPage === 1) {
        setMovies([{title: MOVIE_SECTION_TITLE, data: []}]);
        setError('No movies found for this category.');
      }
    } catch (err) {
      setError('Failed to fetch movies. Please try again.');
    } finally {
      setIsLoadingMore(false);
    }
  };

  const handleSearch = async (_page: number) => {
    if (!searchQuery) {
      return fetchMovies(_page);
    }
    try {
      setError(null);
      const response = await MovieApis.queryMovies({
        query: searchQuery,
        sortBy: selectedSortBy,
        category: selectedCategory,
        page: _page,
      });

      if (response.data.results.length === 0) {
        setMovies([{title: MOVIE_SECTION_TITLE, data: []}]);
        setError('No movies found for this search.');
      } else {
        setMovies([{title: MOVIE_SECTION_TITLE, data: response.data.results}]);
      }
    } catch (err) {
      setError('Failed to search movies. Please try again.');
    }
  };

  const loadMoreMovies = () => {
    if (searchQuery) {
      setPage(prevPage => prevPage + 1);
      handleSearch(page + 1);
    } else if (!isLoadingMore) {
      setPage(prevPage => prevPage + 1);
      fetchMovies(page + 1);
    }
  };

  const renderMovie = ({item}: {item: Movie}) => (
    <MovieItem
      movie={item}
      onMoviePress={(movie: Movie) => {
        router.push(ScreenNames.DETAIL_SCREEN, {movieId: movie.id});
      }}
    />
  );

  const renderFilters = () => (
    <View>
      <AquaDropdownList
        style={styles.mb16}
        data={categoryDatasource}
        value={selectedCategory}
        onSelectItem={(item: {label: string; value: string}) => {
          const value = item.value as MovieCategory;
          dispatch(setSelectedMovieCategory(value));
        }}
      />

      <AquaDropdownList
        style={styles.mb16}
        placeholder="Sort by"
        data={sortByDatasource}
        value={selectedSortBy}
        onSelectItem={(item: {label: string; value: string}) => {
          const value = item.value as SortBy;
          dispatch(storeSelectedSortBy(value));
        }}
      />

      <AquaInput
        style={styles.searchInput}
        value={searchQuery}
        onChangeText={setSearchQuery}
        placeholder="Search..."
      />

      <AquaButton
        style={styles.mb16}
        title="Search"
        onPress={() => handleSearch(1)}
      />
    </View>
  );

  const renderLoadMore = () => (
    <AquaButton
      style={styles.loadMoreButton}
      titleStyle={styles.loadMoreText}
      title={isLoadingMore ? 'Loading...' : 'Load More'}
      onPress={loadMoreMovies}
      disabled={isLoadingMore}
    />
  );

  return (
    <Container style={styles.container}>
      <SectionList
        style={styles.sectionList}
        sections={movies}
        renderItem={renderMovie}
        keyExtractor={item => item.id.toString()}
        ListHeaderComponent={renderFilters}
        ListFooterComponent={renderLoadMore}
      />
      {error && <AquaText style={styles.error}>{error}</AquaText>}
    </Container>
  );
};

const styles = StyleSheet.create({
  container: {flex: 1, paddingHorizontal: 16, paddingBottom: navBarHeight + 20},
  sectionList: {flex: 1},
  searchInput: {marginBottom: 16},
  error: {color: 'red', textAlign: 'center', marginVertical: 16},
  loadMoreButton: {
    marginVertical: 16,
    marginBottom: navBarHeight,
    borderRadius: 5,
    backgroundColor: '#00B4E4',
  },
  loadMoreText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontFamily: 'Source Sans Pro',
    fontWeight: 'bold',
  },
  mb16: {marginBottom: 16},
});

export default HomeScreen;

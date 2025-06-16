/* eslint-disable react-hooks/exhaustive-deps */
import React, {useCallback, useEffect, useState} from 'react';
import {View, SectionList, TouchableOpacity, StyleSheet} from 'react-native';
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
import {TMDB_IMAGE_BASE_URL} from '../configs/config';
import AquaImage from '../components/AquaImage';
import AquaText from '../components/AquaText';
import {useDispatch} from 'react-redux';
import {
  setSelectedMovieCategory,
  setSelectedSortBy as storeSelectedSortBy,
} from '../state/actions/app';
import {useSelectedCategory, useSelectedSortBy} from '../state/hooks/app';

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
    <TouchableOpacity
      style={styles.movieItem}
      onPress={() =>
        router.push(ScreenNames.DETAIL_SCREEN, {movieId: item.id})
      }>
      <AquaImage
        source={{uri: `${TMDB_IMAGE_BASE_URL}${item.poster_path}`}}
        style={styles.poster}
        resizeMode="cover"
      />
      <View style={styles.movieDetails}>
        <AquaText style={styles.title}>{item.title}</AquaText>
        <AquaText style={styles.releaseDate}>{item.release_date}</AquaText>
        <AquaText numberOfLines={2} style={styles.overview}>
          {item.overview}
        </AquaText>
      </View>
    </TouchableOpacity>
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
  movieItem: {
    flexDirection: 'row',
    marginVertical: 8,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 8,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 5,
  },
  poster: {
    width: 96,
    height: 148,
    borderTopLeftRadius: 5,
    borderBottomLeftRadius: 5,
  },
  movieDetails: {flex: 1, marginHorizontal: 12, justifyContent: 'center'},
  title: {fontSize: 16, fontWeight: 'bold'},
  releaseDate: {fontSize: 14, color: '#999999', marginBottom: 16},
  overview: {fontSize: 14, marginTop: 4},
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

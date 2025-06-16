/* eslint-disable react-hooks/exhaustive-deps */
import React, {useCallback, useEffect, useState} from 'react';
import {
  Alert,
  FlatList,
  SectionList,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';
import Container from './Container';
import {useFocusEffect} from '@react-navigation/native';
import router from '../configs/router';
import AquaImage from '../components/AquaImage';
import AquaText from '../components/AquaText';
import MovieApis from '../services/movie-apis';
import {CastMember, Movie, MovieDetails} from '../data-types/aqua';
import {TMDB_IMAGE_BASE_URL} from '../configs/config';
import HeaderBackBar from '../components/HeaderBackBar';
import moment from 'moment';
import {formatDuration} from '../utils/commonUtls';
import {AnimatedCircularProgress} from 'react-native-circular-progress';
import IconWatchList from '../assets/svg/ic-watchlist.svg';
import {useDispatch} from 'react-redux';
import {useWatchList} from '../state/hooks/app';
import {setWatchList} from '../state/actions/app';

const DETAIL_SECTION = 'Details';
const TOP_BILLED_CAST_SECTION = 'Top Billed Cast';
const RECOMMENDATIONS_SECTION = 'Recommendations';

type SectionData = {
  title: string;
  data: any;
};
const DetailsScreen: React.FC = ({route}: any) => {
  const {movieId} = route.params;

  const dispatch = useDispatch();
  const watchlist = useWatchList();

  const [sectionData, setSectionData] = useState<SectionData[]>([
    {title: DETAIL_SECTION, data: []},
    {title: TOP_BILLED_CAST_SECTION, data: []},
    {title: RECOMMENDATIONS_SECTION, data: []},
  ]);
  const [cast, setCast] = useState<CastMember[]>([]);
  const [recommendations, setRecommendations] = useState<MovieDetails[]>([]);
  const [error, setError] = useState<string | null>(null);

  useFocusEffect(
    useCallback(() => {
      router.hideBottomNav();
    }, []),
  );

  useEffect(() => {
    fetchMovieDetail(movieId);
    fetchMovieDetailCredits(movieId);
    fetchMovieDetailRecommendations(movieId);
  }, [movieId]);

  const fetchMovieDetail = async (_movieId: string) => {
    try {
      setError(null);
      router.showLoading();
      const response = await MovieApis.getMovieDetail({
        movieId: _movieId,
      });
      if (response?.status < 300 && response?.data) {
        const movie = response.data;
        const newSectionData = [...sectionData];
        newSectionData[0].data = [movie];
        setSectionData(newSectionData);
      } else {
        setError('No movie found');
      }
    } catch (err) {
      setError('Failed to fetch movie. Please try again later');
    } finally {
      router.hideLoading();
    }
  };

  const fetchMovieDetailCredits = async (_movieId: string) => {
    try {
      const response = await MovieApis.getMovieDetailCredits({
        movieId: _movieId,
      });

      if (response?.status < 300 && response?.data) {
        const _cast = response.data.cast ?? [];

        setCast(_cast);
        const newSectionData = [...sectionData];
        newSectionData[1].data = [_cast];
        setSectionData(newSectionData);
      } else {
        setError('No movie credits found');
      }
    } catch (err) {
      setError('Failed to fetch movie credits. Please try again.');
    }
  };

  const fetchMovieDetailRecommendations = async (_movieId: string) => {
    try {
      const response = await MovieApis.getMovieDetailRecomendations({
        movieId: _movieId,
      });

      if (response?.status < 300 && response?.data) {
        const _recommendations = response.data.results ?? [];

        setRecommendations(_recommendations);
        const newSectionData = [...sectionData];
        newSectionData[2].data = [_recommendations];
        setSectionData(newSectionData);
      } else {
        setError('No movie recommendations found');
      }
    } catch (err) {
      setError('Failed to fetch movie recommendations. Please try again.');
    }
  };

  const addToWatchList = (movie: Movie) => {
    const isMovieExists = (id: number): boolean => {
      return watchlist?.some((item: Movie) => item.id === id);
    };
    if (isMovieExists(movie.id)) {
      Alert.alert('Movie is add to WatchList');
      return;
    }
    const newWatchlist = [...(watchlist || [])];
    newWatchlist.push(movie);
    dispatch(setWatchList(newWatchlist));
    Alert.alert('Movie is add to WatchList');
  };

  const renderMovieDetailsSection = ({item}: {item: MovieDetails}) => {
    const genres = item.genres.map(genre => genre.name).join(', ');
    return (
      <View style={styles.detailWrapper}>
        <View style={styles.topWrapper}>
          <HeaderBackBar
            title={`${item.title} (${moment(item.release_date).format(
              'YYYY',
            )})`}
          />
          <View style={styles.moviePosterWrapper}>
            <AquaImage
              source={{uri: TMDB_IMAGE_BASE_URL + item.poster_path}}
              style={styles.poster}
            />
            <View style={styles.movieInfoWrapper}>
              <View style={styles.voteWrapper}>
                <AquaText style={styles.vote}>{item.vote_average}</AquaText>
              </View>
              <AquaText style={styles.movieInfoText}>
                {item.release_date} - {formatDuration(item.runtime ?? 60)}
              </AquaText>
              <AquaText style={styles.movieInfoText}>{genres}</AquaText>
              <AquaText style={styles.movieInfoText}>
                <AquaText style={styles.bold}>Status:</AquaText> {item.status}
              </AquaText>
              <AquaText style={styles.movieInfoText}>
                <AquaText style={styles.bold}>Original Language:</AquaText>{' '}
                {item.original_language === 'en' ? 'English' : 'Japanese'}
              </AquaText>
            </View>
          </View>
        </View>
        <View style={styles.bodyWrapper}>
          <View style={styles.flexRow}>
            <View style={styles.progressWrapper}>
              <View style={styles.rating}>
                <AnimatedCircularProgress
                  style={styles.progress}
                  size={60}
                  width={4}
                  fill={item.vote_average * 10}
                  rotation={360}
                  tintColor="#45FF8F"
                  onAnimationComplete={() => console.log('onAnimationComplete')}
                  backgroundColor="#3d5875"
                />
                <AquaText style={styles.ratingCircle}>
                  {Math.round(item.vote_average * 10)}
                  <View>
                    <AquaText style={styles.percentage}>%</AquaText>
                  </View>
                </AquaText>
              </View>
              <AquaText style={styles.userScoreText}>User Score</AquaText>
            </View>
            <View style={styles.flex1}>
              <AquaText style={styles.personNameText}>Greta Gerwig</AquaText>
              <AquaText style={[styles.personPositionText, styles.mb16]}>
                Director, Writer
              </AquaText>
              <AquaText style={styles.personNameText}>Noah Baumbach</AquaText>
              <AquaText style={styles.personPositionText}>Writer</AquaText>
            </View>
          </View>
        </View>

        <View style={styles.bodyWrapper}>
          <AquaText style={styles.tagline}>{item.tagline}</AquaText>
          <AquaText style={styles.overviewText}>Overview</AquaText>
          <AquaText style={styles.overview}>{item.overview}</AquaText>
          <View style={styles.watchListButtonWrapper}>
            <TouchableOpacity
              style={styles.watchlistButton}
              onPress={() => {
                addToWatchList({
                  id: item.id,
                  title: item.title,
                  release_date: item.release_date,
                  overview: item.overview,
                  poster_path: item.poster_path,
                });
              }}>
              <IconWatchList width={12} height={16} />
              <AquaText style={styles.watchlistText}>Add To Watchlist</AquaText>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    );
  };

  const renderCastItem = (item: CastMember) => {
    return (
      <View style={styles.castItemWrapper}>
        <AquaImage
          source={{uri: TMDB_IMAGE_BASE_URL + item.profile_path}}
          style={styles.castItemImage}
        />
        <AquaText style={styles.castItemPersonName}>{item.name}</AquaText>
        <AquaText style={styles.castItemPersonImage} numberOfLines={2}>
          {item.character}
        </AquaText>
      </View>
    );
  };

  const renderCastSection = (_cast: CastMember[]) => {
    return (
      <>
        <AquaText style={styles.castSectionTitle}>
          {TOP_BILLED_CAST_SECTION}
        </AquaText>
        <FlatList
          style={styles.castList}
          contentContainerStyle={[]}
          data={_cast}
          keyExtractor={item => item.id.toString()}
          horizontal={true}
          showsHorizontalScrollIndicator={true}
          renderItem={({item}) => renderCastItem(item)}
        />
      </>
    );
  };

  const renderRecommendationItem = (item: MovieDetails) => {
    return (
      <View style={styles.recommendationItemWrapper}>
        <AquaImage
          source={{uri: TMDB_IMAGE_BASE_URL + item.poster_path}}
          style={styles.recommendationItemImage}
        />
        <View style={styles.recommendationItemContentWrapper}>
          <AquaText style={styles.recommendationItemName} numberOfLines={1}>
            {item.title}
          </AquaText>
          <AquaText
            style={styles.recommendationItemPercentage}
            numberOfLines={2}>
            {Math.round(item.vote_average * 10)}%
          </AquaText>
        </View>
      </View>
    );
  };

  const renderRecommendationsSection = (
    _recommendations: Array<MovieDetails>,
  ) => {
    return (
      <>
        <View style={styles.recommendationDivider} />
        <AquaText style={styles.castSectionTitle}>
          {RECOMMENDATIONS_SECTION}
        </AquaText>
        <FlatList
          style={styles.castList}
          contentContainerStyle={[]}
          data={_recommendations}
          keyExtractor={item => item.id.toString()}
          horizontal={true}
          showsHorizontalScrollIndicator={true}
          renderItem={({item}) => renderRecommendationItem(item)}
        />
      </>
    );
  };

  const renderItem = ({item, section}: {item: any; section: SectionData}) => {
    if (section.title === DETAIL_SECTION) {
      return renderMovieDetailsSection({item});
    } else if (section.title === TOP_BILLED_CAST_SECTION) {
      return renderCastSection(cast);
    } else if (section.title === RECOMMENDATIONS_SECTION) {
      return renderRecommendationsSection(recommendations);
    }
    return null;
  };

  return (
    <Container style={styles.container}>
      <SectionList
        sections={sectionData}
        keyExtractor={item => item.id}
        renderItem={({item, section}) => renderItem({item, section})}
        style={styles.wrapper}
      />
      {error && <AquaText style={styles.error}>{error}</AquaText>}
    </Container>
  );
};

const styles = StyleSheet.create({
  container: {flex: 1, padding: 0},
  wrapper: {
    flex: 1,
  },
  detailWrapper: {},
  topWrapper: {
    flexDirection: 'column',
    backgroundColor: '#0380b6',
    paddingHorizontal: 16,
    paddingVertical: 16,
  },
  bodyWrapper: {
    flexDirection: 'column',
    paddingHorizontal: 16,
    paddingVertical: 16,
    backgroundColor: '#00B4E4',
  },
  sectionTitle: {
    color: '#fff',
    fontWeight: 'bold',
  },
  poster: {
    width: 112,
    height: 154,
    alignSelf: 'center',
    marginVertical: 10,
    borderRadius: 5,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  rating: {
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 5,
    width: 68,
    height: 68,
    backgroundColor: '#042541',
    borderRadius: 34,
    position: 'relative',
  },
  ratingCircle: {
    alignSelf: 'center',
    color: 'white',
    fontSize: 20,
    fontWeight: 700,
    marginLeft: 8,
  },
  percentage: {
    fontSize: 8,
    fontWeight: '700',
    marginBottom: 4,
    color: '#FFF',
    marginLeft: 2,
  },
  tagline: {
    color: '#FFF',
    fontSize: 20,
    fontWeight: 400,
    fontStyle: 'italic',
    textAlign: 'left',
    marginTop: 4,
    marginBottom: 14,
  },
  overview: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: 400,
    marginVertical: 10,
    paddingHorizontal: 10,
    textAlign: 'justify',
  },
  overviewText: {color: 'white', fontSize: 24, fontWeight: 700},
  watchlistButton: {
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
    margin: 10,
    position: 'relative',
    borderWidth: 1,
    borderColor: '#FFFFFF',
    flexDirection: 'row',
  },
  watchlistText: {
    color: '#fff',
    fontWeight: 'bold',
    marginLeft: 16,
  },
  castItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  castImage: {
    width: 50,
    height: 50,
    marginRight: 10,
  },
  role: {
    color: '#666',
  },
  recItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  recImage: {
    width: 100,
    height: 100,
    marginRight: 10,
  },
  recRating: {
    color: '#666',
  },
  error: {color: 'red', textAlign: 'center', marginVertical: 16},
  watchListButtonWrapper: {flexDirection: 'row'},
  personNameText: {color: '#FFFFFF', fontSize: 16, fontWeight: 600},
  personPositionText: {color: '#FFFFFF', fontSize: 16, fontWeight: 400},
  mb16: {marginBottom: 16},
  flex1: {flex: 1},
  userScoreText: {color: 'white', fontSize: 18, fontWeight: 700},
  progressWrapper: {flex: 1, justifyContent: 'center'},
  progress: {position: 'absolute', top: 4, left: 4},
  bold: {fontWeight: 'bold'},
  flexRow: {flexDirection: 'row'},
  movieInfoText: {color: '#FFF', fontSize: 16, marginBottom: 6},
  voteWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  vote: {
    color: 'rgba(255,255,255,0.7)',
    fontSize: 16,
    marginBottom: 6,
    borderWidth: 1,
    borderRadius: 3,
    borderColor: 'rgba(255,255,255,0.7)',
    padding: 4,
    paddingHorizontal: 8,
  },
  movieInfoWrapper: {flex: 1, marginLeft: 16, flexDirection: 'column'},
  moviePosterWrapper: {
    flexDirection: 'row',
    marginTop: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  castList: {padding: 16, marginHorizontal: 16},
  castItemWrapper: {
    marginRight: 16,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: '#E3E3E3',
    width: 140,
  },
  castItemImage: {
    width: 140,
    height: 154,
    borderTopLeftRadius: 5,
    borderTopRightRadius: 5,
  },
  castItemPersonName: {
    fontSize: 18,
    fontWeight: 700,
    marginHorizontal: 12,
    marginTop: 10,
  },
  castItemPersonImage: {
    fontSize: 16,
    fontWeight: 400,
    marginHorizontal: 12,
    marginBottom: 10,
  },
  castSectionTitle: {
    fontSize: 22,
    fontWeight: 600,
    marginHorizontal: 16,
    marginVertical: 10,
  },

  recommendationDivider: {
    borderWidth: 2,
    borderColor: '#E4E4E4',
    width: '100%',
    marginTop: 16,
    marginBottom: 10,
  },
  recommendationItemWrapper: {
    marginRight: 20,
    width: 286,
  },
  recommendationItemImage: {
    width: 286,
    height: 162,
    borderRadius: 5,
  },
  recommendationItemContentWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 6,
  },
  recommendationItemName: {
    fontSize: 18,
    marginHorizontal: 12,
    flex: 1,
  },
  recommendationItemPercentage: {
    fontSize: 16,
    fontWeight: 400,
    textAlign: 'right',
  },
  recommendationSectionTitle: {
    fontSize: 22,
    fontWeight: 600,
    marginHorizontal: 16,
    marginVertical: 10,
  },
});
export default DetailsScreen;

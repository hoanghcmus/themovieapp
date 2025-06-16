/* eslint-disable react-hooks/exhaustive-deps */
import React, {useCallback, useEffect, useState} from 'react';
import {Alert, SectionList, StyleSheet, View} from 'react-native';
import Container from './Container';
import AquaText from '../components/AquaText';
import {useWatchList} from '../state/hooks/app';
import MovieApis from '../services/movie-apis';
import router from '../configs/router';
import HeaderBackBar from '../components/HeaderBackBar';
import AquaImage from '../components/AquaImage';
import {GRAVATRA_URL} from '../configs/config';
import MovieItem from '../components/MovieItem';
import ScreenNames from '../constants/screenNames';
import {Movie} from '../data-types/aqua';
import {useFocusEffect} from '@react-navigation/native';
import {useDispatch} from 'react-redux';
import {setWatchList} from '../state/actions/app';

type SectionData = {
  title: string;
  data: Array<any>;
};

const WatchListScreen: React.FC = () => {
  const dispatch = useDispatch();
  const watchlist = useWatchList();
  const [sectionData, setSectionData] = useState<SectionData[]>([
    {title: 'My Watchlist', data: watchlist || []},
  ]);

  const [account, setAccount] = useState<any>();

  useFocusEffect(
    useCallback(() => {
      router.showBottomNav();
    }, []),
  );

  useFocusEffect(
    useCallback(() => {
      const newSectionData = [...sectionData];
      newSectionData[0].data = watchlist || [];
      setSectionData(newSectionData);
    }, [watchlist]),
  );

  useEffect(() => {
    fetchAccountDetail();
  }, []);

  const fetchAccountDetail = async () => {
    try {
      router.showLoading();
      const response = await MovieApis.getAccountDetail();
      if (response?.status < 300 && response?.data) {
        setAccount(response.data);
      }
      router.hideLoading();
    } catch (err) {
      Alert.alert('Something wrong: ' + err);
    } finally {
      router.hideLoading();
    }
  };

  const renderAcountInfo = () => {
    return (
      <View style={styles.topWrapper}>
        <HeaderBackBar
          onBackPress={() => {
            router.back();
            router.getBottomNavRef().setActiveTab(ScreenNames.HOME_SCREEN);
          }}
        />
        <View style={styles.accountWrapper}>
          {account?.avatar?.gravatar?.hash ? (
            <AquaImage
              source={{
                uri: GRAVATRA_URL + '/' + account?.avatar?.gravatar?.hash,
              }}
              style={styles.avatarImage}
            />
          ) : (
            <View style={styles.avatarImage}>
              <AquaText style={styles.avatarName}>
                {(account?.name || account?.username || 'User name')
                  .charAt(0)
                  .toUpperCase()}
              </AquaText>
            </View>
          )}
          <View style={styles.accountInfoWrapper}>
            <AquaText style={styles.accountName}>
              {account?.name || account?.username || 'User name'}
            </AquaText>
            <AquaText style={styles.accountMemeberSince}>
              Member since June 2025
            </AquaText>
          </View>
        </View>
      </View>
    );
  };

  const deleteWatchListItem = (movie: Movie) => {
    let newWatchlist = [...(watchlist || [])];
    newWatchlist = newWatchlist.filter((item: Movie) => {
      return item.id !== movie.id;
    });
    dispatch(setWatchList(newWatchlist));
  };

  const renderMovie = ({item}: {item: Movie}) => (
    <MovieItem
      style={styles.mh16}
      movie={item}
      onMoviePress={(movie: Movie) => {
        router.push(ScreenNames.DETAIL_SCREEN, {movieId: movie.id});
      }}
      onMovieDeletePress={(movie: Movie) => deleteWatchListItem(movie)}
    />
  );

  return (
    <Container style={styles.container}>
      <SectionList
        stickySectionHeadersEnabled={false}
        style={styles.flatlist}
        sections={sectionData}
        renderItem={renderMovie}
        renderSectionHeader={({section}) => {
          if (watchlist.length === 0) {
            return (
              <AquaText style={styles.watchListEmptyTitle}>
                No Item Added Yet
              </AquaText>
            );
          }
          return (
            <AquaText style={styles.watchListTitle}>{section.title}</AquaText>
          );
        }}
        keyExtractor={item => item.id.toString()}
        ListHeaderComponent={renderAcountInfo}
        ListFooterComponent={<View style={styles.mb60} />}
      />
    </Container>
  );
};

const styles = StyleSheet.create({
  container: {flex: 1},
  wrapper: {
    flex: 1,
    margin: 16,
  },
  text: {
    textAlign: 'center',
    fontWeight: 'bold',
    marginBottom: 60,
  },
  topWrapper: {
    flexDirection: 'column',
    backgroundColor: '#042541',
    paddingHorizontal: 16,
    paddingVertical: 16,
  },
  accountWrapper: {
    flexDirection: 'row',
    marginTop: 20,
    marginBottom: 16,
  },
  accountInfoWrapper: {
    marginHorizontal: 16,
    justifyContent: 'center',
  },
  avatarImage: {
    width: 64,
    height: 64,
    borderRadius: '50%',
    backgroundColor: '#9747FF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarName: {color: '#FFF', fontSize: 36},
  accountName: {fontSize: 20, fontWeight: '700', color: '#FFFF'},
  accountMemeberSince: {fontSize: 16, fontWeight: '400', color: '#FFFF'},
  flatlist: {},
  watchListTitle: {
    fontSize: 18,
    fontWeight: '700',
    marginVertical: 10,
    marginHorizontal: 16,
  },
  watchListEmptyTitle: {
    fontSize: 18,
    fontWeight: '700',
    marginVertical: 20,
    marginHorizontal: 16,
    alignSelf: 'center',
    color: '#00B4E4',
  },
  mh16: {marginHorizontal: 16},
  mb60: {marginBottom: 60},
});

export default WatchListScreen;

import React from 'react';
import {View, StyleSheet, ViewStyle, TouchableOpacity} from 'react-native';
import AquaText from './AquaText';
import AquaImage from './AquaImage';
import {Movie} from '../data-types/aqua';
import {TMDB_IMAGE_BASE_URL} from '../configs/config';
import {isFunction} from 'lodash';
import IconClose from '../assets/svg/ic-close.svg';

type MovieItemProps = {
  style?: ViewStyle;
  movie: Movie;
  value?: string;
  onMoviePress?: (movie: Movie) => void;
  onMovieDeletePress?: (movie: Movie) => void;
};
const MovieItem = (props: MovieItemProps) => {
  const {
    style = {},
    movie,
    onMoviePress = () => null,
    onMovieDeletePress,
  } = props;

  return (
    <TouchableOpacity
      style={[styles.movieItem, style]}
      onPress={() => {
        onMoviePress?.(movie);
      }}>
      <AquaImage
        source={{uri: `${TMDB_IMAGE_BASE_URL}${movie.poster_path}`}}
        style={styles.poster}
        resizeMode="cover"
      />
      <View style={styles.movieDetails}>
        <AquaText style={styles.title}>{movie.title}</AquaText>
        <AquaText style={styles.releaseDate}>{movie.release_date}</AquaText>
        <AquaText numberOfLines={2} style={styles.overview}>
          {movie.overview}
        </AquaText>
      </View>
      {onMovieDeletePress && isFunction(onMovieDeletePress) && (
        <TouchableOpacity
          style={styles.deleteIconWrapper}
          onPress={() => {
            onMovieDeletePress?.(movie);
          }}>
          <IconClose width={10} height={10} />
        </TouchableOpacity>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
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
  deleteIconWrapper: {
    position: 'absolute',
    top: 2,
    right: 2,
    width: 30,
    height: 30,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default MovieItem;

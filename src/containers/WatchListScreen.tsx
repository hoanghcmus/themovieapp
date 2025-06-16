import React from 'react';
import {StyleSheet, View} from 'react-native';
import Container from './Container';
import AquaText from '../components/AquaText';
import {useWatchList} from '../state/hooks/app';

const WatchListScreen: React.FC = () => {
  const watchlist = useWatchList();
  return (
    <Container style={styles.container}>
      <View style={styles.wrapper}>
        <AquaText style={styles.text}>{JSON.stringify(watchlist)}</AquaText>
      </View>
    </Container>
  );
};

const styles = StyleSheet.create({
  container: {flex: 1},
  wrapper: {
    flex: 1,
    paddingHorizontal: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    textAlign: 'center',
    fontSize: 36,
    fontWeight: 'bold',
    marginBottom: 60,
  },
});

export default WatchListScreen;

import React from 'react';
import {StyleSheet, View} from 'react-native';
import Container from './Container';
import AquaText from '../components/AquaText';

const WatchListScreen: React.FC = () => {
  return (
    <Container style={styles.container}>
      <View style={styles.wrapper}>
        <AquaText style={styles.text}>TO BE CONTINUED</AquaText>
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

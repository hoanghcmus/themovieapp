import React, {useEffect} from 'react';
import {StyleSheet, ViewStyle} from 'react-native';
import SafeAreaView from 'react-native-safe-area-view';
import HeaderBar from '../components/HeaderBar';

export interface BackgroundGradientProps {
  children?: any;
  style?: ViewStyle | any;
}

const Container = (props: BackgroundGradientProps) => {
  let {style} = props;

  useEffect(() => {
    return () => {};
  }, []);

  return (
    <SafeAreaView style={[styles.container, style]}>
      <HeaderBar />
      {props.children}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF',
  },
});

export default Container;

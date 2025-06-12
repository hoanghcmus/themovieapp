import React from 'react';
import {Text} from 'react-native';
import {StyleSheet} from 'react-native';
import type {TextProps, TextStyle} from 'react-native';

interface AquaTextProps extends TextProps {
  style?: TextStyle | TextStyle[];
}

const AquaText: React.FC<AquaTextProps> = ({style, ...props}) => {
  return <Text style={[styles.text, style]} {...props} />;
};

const styles = StyleSheet.create({
  text: {
    fontFamily: 'Source Sans Pro',
  },
});

export default AquaText;

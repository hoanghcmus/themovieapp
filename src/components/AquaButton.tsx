import React from 'react';
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  ViewStyle,
  ButtonProps,
  TextStyle,
} from 'react-native';

interface AquaButtonProps extends ButtonProps {
  style?: ViewStyle;
  titleStyle?: TextStyle;
  title: string;
  onPress: () => void;
}

const AquaButton = (props: AquaButtonProps) => {
  const {style = {}, titleStyle = {}, title = '', onPress = () => null} = props;
  return (
    <TouchableOpacity
      style={[styles.container, style]}
      onPress={() => onPress?.()}>
      <Text style={[styles.text, titleStyle]}>{title}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#ddd',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 40,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    fontFamily: 'Source Sans Pro',
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
  },
});

export default AquaButton;

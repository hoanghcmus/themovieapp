import React from 'react';
import {View, TextInput, StyleSheet, ViewStyle} from 'react-native';
type AquaInputProps = {
  style?: ViewStyle;
  placeholder?: string;
  value?: string;
  onChangeText?: (text: string) => void;
};
const AquaInput = (props: AquaInputProps) => {
  const {
    style = {},
    placeholder = '...',
    value = '',
    onChangeText = () => null,
  } = props;

  return (
    <View style={[styles.container, style]}>
      <TextInput
        style={styles.input}
        placeholder={placeholder}
        placeholderTextColor="#888"
        value={value}
        onChangeText={(_text: string) => {
          onChangeText(_text);
        }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 5,
    backgroundColor: '#fff',
    borderColor: 'gray',
    borderWidth: 0.5,
    borderRadius: 5,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  input: {
    fontFamily: 'Source Sans Pro',
    height: 40,
    fontSize: 16,
    color: '#333',
    paddingHorizontal: 10,
  },
});

export default AquaInput;

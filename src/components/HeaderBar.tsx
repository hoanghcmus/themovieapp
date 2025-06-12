import React, {forwardRef} from 'react';
import {Platform, StyleSheet, View, ViewStyle} from 'react-native';
import Logo from '../assets/svg/logo.svg';

interface HeaderBarProps {
  forwardedRef?: React.Ref<HeaderBarRef> | null;
  title?: string;
  style?: ViewStyle | any;
}

export type HeaderBarRef = {
  getCurrentDiamond: Function;
  setNewDiamond: Function;
  subtractDiamond: Function;
};

const HeaderBar = (props: HeaderBarProps) => {
  const {style} = props;
  return (
    <View style={[styles.container, style]}>
      <Logo width={80} height={56} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    height: 84,
    paddingTop: Platform.select({ios: 0, android: 20}),
  },
});

export default forwardRef(
  (props: HeaderBarProps, ref: React.Ref<HeaderBarRef>) => {
    return <HeaderBar {...props} forwardedRef={ref} />;
  },
);

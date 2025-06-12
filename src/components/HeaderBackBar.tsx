import React, {forwardRef} from 'react';
import {StyleSheet, TouchableOpacity, View, ViewStyle} from 'react-native';
import IconBack from '../assets/svg/ic-back.svg';
import router from '../configs/router';
import AquaText from './AquaText';

interface HeaderBackBarProps {
  forwardedRef?: React.Ref<HeaderBackBarRef> | null;
  title?: string;
  style?: ViewStyle | any;
}

export type HeaderBackBarRef = {
  getCurrentDiamond: Function;
  setNewDiamond: Function;
  subtractDiamond: Function;
};

const HeaderBackBar = (props: HeaderBackBarProps) => {
  const {style, title} = props;
  return (
    <View style={[styles.container, style]}>
      <TouchableOpacity
        onPress={() => {
          router.back();
        }}
        style={styles.iconButton}>
        <IconBack width={12} height={18} />
      </TouchableOpacity>
      <AquaText style={styles.title}>{title}</AquaText>
      <View style={styles.spacer} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconButton: {
    width: 12,
    height: 18,
  },
  title: {
    flex: 1,
    textAlign: 'center',
    fontSize: 24,
    color: '#FFFFFF',
    fontWeight: '400',
  },
  spacer: {
    width: 12,
    height: 18,
  },
});

export default forwardRef(
  (props: HeaderBackBarProps, ref: React.Ref<HeaderBackBarRef>) => {
    return <HeaderBackBar {...props} forwardedRef={ref} />;
  },
);

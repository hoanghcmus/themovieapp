import React, {
  forwardRef,
  useCallback,
  useImperativeHandle,
  useState,
} from 'react';
import {ActivityIndicator, StyleSheet, View} from 'react-native';

export type LoadingRef = {
  show: () => void;
  hide: () => void;
};

type LoadingProps = {
  forwardedRef?: React.Ref<LoadingRef> | null;
  color?: string;
};
const Loading = (props: LoadingProps) => {
  const {color = '#FFF'} = props;
  const [isLoading, setLoading] = useState(false);
  const show = useCallback(() => {
    setLoading(true);
  }, []);

  const hide = useCallback(() => {
    setLoading(false);
  }, []);

  useImperativeHandle(
    props.forwardedRef,
    () => {
      return {show, hide};
    },
    [show, hide],
  );

  return isLoading ? (
    <View style={styles.container}>
      <ActivityIndicator size="large" color={color} />
    </View>
  ) : null;
};

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
});

export default forwardRef((props: LoadingProps, ref: React.Ref<LoadingRef>) => {
  return <Loading {...props} forwardedRef={ref} />;
});

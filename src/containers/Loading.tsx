import React, {
  forwardRef,
  useCallback,
  useImperativeHandle,
  useState,
} from 'react';
import {ActivityIndicator, StyleSheet} from 'react-native';
import {Modal, ModalContent} from 'react-native-modals';

export type LoadingRef = {
  show: () => void;
  hide: () => void;
};

type LoadingProps = {
  forwardedRef?: React.Ref<LoadingRef> | null;
};
const Loading = (props: LoadingProps) => {
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
    <Modal modalStyle={styles.modalStyle} visible={isLoading}>
      <ModalContent>
        <ActivityIndicator size="large" color="#FFF" />
      </ModalContent>
    </Modal>
  ) : null;
};

const styles = StyleSheet.create({
  modalStyle: {backgroundColor: 'transparent'},
});

export default forwardRef((props: LoadingProps, ref: React.Ref<LoadingRef>) => {
  return <Loading {...props} forwardedRef={ref} />;
});

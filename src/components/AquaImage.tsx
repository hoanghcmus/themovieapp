import React, {useEffect} from 'react';
import FastImage, {FastImageProps, Priority} from 'react-native-fast-image';

export declare type Cache = 'immutable' | 'web' | 'cacheOnly';
export interface MurfImageProps extends FastImageProps {
  uri?: string;
  priority?: Priority;
  cache?: Cache;
  style?: FastImageProps['style'] | any;
}
const AquaImage = (props: MurfImageProps) => {
  const {source, uri, priority, cache} = props;
  useEffect(() => {
    return () => {};
  }, []);
  return (
    <FastImage
      {...props}
      source={
        source || {
          uri: uri,
          priority: priority || FastImage.priority.normal,
          cache: cache || FastImage.cacheControl.immutable,
        }
      }
    />
  );
};

export default AquaImage;

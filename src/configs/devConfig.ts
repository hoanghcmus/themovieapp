import {Platform} from 'react-native';

// TODO: Disable useLocalhostApi (set value to false) when using real remote api
/*
 * useLocalhostApi = true ==> Use API from BE running on Local Host (using source code BE ) ==> Protocol: HTTP (80)
 * useLocalhostApi = false ==> User API from BE running on Remote Host ==> Protocol: HTTPS (443)
 */
const isLocalhostApi = __DEV__ && false;
const devConfig = isLocalhostApi
  ? {
      host: Platform.select({android: '10.0.2.2:3000', ios: 'localhost:3000'}),
      environment: 'development',
      version: '3',
      isLocalhostApi,
    }
  : {
      host: 'api.themoviedb.org',
      environment: 'development',
      version: '3',
      isLocalhostApi,
    };

export default devConfig;

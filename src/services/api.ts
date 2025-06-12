import {Alert, Platform} from 'react-native';
import * as RNLocalize from 'react-native-localize';
import {assign, get, head, isEmpty, map} from 'lodash';
import queryString from 'query-string';
import axios, {AxiosError} from 'axios';
import versionJson from '../../version.json';
import log from '../utils/log';
import {ApiRequest, HeaderProps} from '../data-types/auth';
import router from '../configs/router';
import DeviceInfo from 'react-native-device-info';
import devConfig from '../configs/devConfig';
import {TMDB_API_TOKEN} from '@env';

export const TIMEOUT = 30000; // 30 seconds

const acceptLanguage = head(map(RNLocalize.getLocales(), 'languageCode'));
const headers: HeaderProps = Object.freeze({
  'Content-Type': 'application/json',
  Accept: 'application/json',
  ...(acceptLanguage && {'Accept-Language': acceptLanguage}),
  'x-client-version': versionJson.version,
  'x-os': Platform.OS,
  'x-version': Platform.Version,
  'x-device-model': DeviceInfo.getModel() || '',
});

const buildRouteWithQuery = (route: string, query: any) => {
  if (route && query) {
    try {
      const {url: baseUrl, query: routeQuery} = queryString.parseUrl(route);
      if (routeQuery && baseUrl) {
        const combinedQuery = {
          ...routeQuery,
          ...query,
        };
        return `${baseUrl}?${queryString.stringify(combinedQuery)}`;
      }
    } catch (e) {}
    return `${route}?${queryString.stringify(query)}`;
  }
  return route;
};

class API {
  private static createHeaders = (skipToken = false) => {
    let resultHeaders = {...headers};
    if (skipToken) {
      return resultHeaders;
    }

    return !isEmpty(TMDB_API_TOKEN)
      ? assign(resultHeaders, {Authorization: `Bearer ${TMDB_API_TOKEN}`})
      : resultHeaders;
  };

  showAlert(error: AxiosError, buttons = undefined, options = undefined) {
    const message = get(error, 'message');
    Alert.alert('', message, buttons, options);
  }

  get = ({
    route,
    query,
    skipToken,
    timeout,
    customURL,
    version,
    loading,
  }: ApiRequest) => {
    return this.xhr({
      method: 'GET',
      route: isEmpty(query) ? route : buildRouteWithQuery(route, query),
      data: null,
      skipToken,
      timeout,
      customURL,
      version,
      loading,
    });
  };

  handelError = function (error: any) {
    if (error.response) {
      log.e(error?.response?.data, 'error.response.data');
      log.e(error?.response?.status, 'error.response.status');
      log.e(error?.response?.headers, ' error.response.headers');
    } else if (error?.request) {
      log.e(error?.request, 'error.request');
    } else {
      log.e(error?.message, 'error.message');
    }
    log.e(error?.config, 'error.config');
    return error?.response;
  };

  post = ({
    route,
    data,
    skipToken = false,
    timeout = TIMEOUT,
    customURL,
    version,
    loading,
  }: ApiRequest) =>
    this.xhr({
      method: 'POST',
      route,
      data,
      skipToken,
      timeout,
      customURL,
      version,
      loading,
    });

  put = ({
    route,
    data,
    skipToken = false,
    timeout = TIMEOUT,
    loading,
  }: ApiRequest) =>
    this.xhr({method: 'PUT', route, data, skipToken, timeout, loading});

  delete = ({
    route,
    data,
    skipToken = false,
    timeout = TIMEOUT,
    loading,
  }: ApiRequest) =>
    this.xhr({method: 'DELETE', route, data, skipToken, timeout, loading});

  patch = ({
    route,
    data,
    skipToken = false,
    timeout = TIMEOUT,
    loading,
  }: ApiRequest) =>
    this.xhr({method: 'PATCH', route, data, skipToken, timeout, loading});

  xhr = async ({
    method,
    route,
    data,
    skipToken,
    timeout = TIMEOUT,
    customURL,
    version,
    loading,
  }: ApiRequest) => {
    const aptScheme = devConfig.isLocalhostApi ? 'http://' : 'https://';
    let baseUrl = aptScheme + devConfig.host + '/';
    const apiVersion = version || devConfig.version || 'v3';
    if (apiVersion) {
      baseUrl = aptScheme + devConfig.host + '/' + apiVersion + '/';
    }
    const url = customURL ?? baseUrl + route;
    let _headers = API.createHeaders(skipToken);

    _headers = {
      ..._headers,
      'Accept-Language': acceptLanguage || 'en',
    };

    let configs: any = {
      method,
      url,
      headers: _headers,
      timeout,
    };

    if (data) {
      // configs = {...configs, data: JSON.stringify(data)};
      configs = {...configs, data};
    }

    // log.i(_headers, '_headers');
    // log.i(configs, 'configs');
    if (loading) {
      router.showLoading();
    }
    return axios(configs).catch(this.handelError);
  };
}

export default API;

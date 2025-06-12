import {
  CommonActions,
  NavigationContainerRef,
  NavigationState,
  ParamListBase,
  PartialRoute,
  Route,
  StackActions,
} from '@react-navigation/native';
import {forEach, isEmpty} from 'lodash';
import ScreenNames from '../constants/screenNames';
import {LoadingRef} from '../containers/Loading';
import {BottomNavRef} from '../components/BottomNavBar';

export type ScreenRouteType = {
  name: ScreenNames;
  params?: ParamListBase;
  routes?: ScreenRouteType[];
};

let routeNameRef: any;
let router: NavigationContainerRef<any>;
let bottomNavBarRef: BottomNavRef;
let loadingRef: LoadingRef;

function setBottomNavRef(_bottomNavBar: any) {
  bottomNavBarRef = _bottomNavBar;
}

function getBottomNavRef() {
  return bottomNavBarRef;
}

function getPreviousRouteName(): ScreenNames {
  return routeNameRef;
}

function getCurrentRouteName() {
  const currentRoute = router?.getCurrentRoute();
  return currentRoute?.name;
}

function setTopLevelNavigator(navigator: NavigationContainerRef<any>) {
  router = navigator;
}

function setLoadingRef(_loading: any) {
  loadingRef = _loading;
}

function onNavigationReady() {
  onNavigationStateChange();
  routeNameRef = router.getCurrentRoute()?.name;
}

function onNavigationStateChange() {
  const currentRoute = router?.getCurrentRoute();
  const currentScreen = currentRoute?.name;
  routeNameRef = currentScreen;
}

function navigate(routeName: string, params: any = {}) {
  let navigateAction;
  switch (routeName) {
    case ScreenNames.NONE:
      if (hasExactParent(routeName)) {
        navigateAction = CommonActions.navigate(routeName, params);
      } else {
        navigateAction = CommonActions.navigate(routeName, {
          params,
          screen: routeName,
        });
      }
      break;
    default:
      navigateAction = CommonActions.navigate(routeName, params);
  }
  router?.dispatch(navigateAction);
}

function push(routeName: string, params: any = {}) {
  const pushAction = StackActions.push(routeName, params);
  router?.dispatch(pushAction);
}

function replace(routeName: string, params: any = {}) {
  const action = StackActions.replace(routeName, params);
  router?.dispatch(action);
}

function isScreenType(
  destination: ScreenNames | ScreenRouteType[],
): destination is ScreenNames {
  return typeof destination === 'string';
}

function toPartialRoute(
  destinations: ScreenRouteType[],
): PartialRoute<Route<NavigationState['routeNames'][number]>>[] {
  try {
    const result: PartialRoute<Route<NavigationState['routeNames'][number]>>[] =
      [];

    forEach(destinations, (currentRoute: any) => {
      const {name, params, routes} = currentRoute;
      const updatedParam = params && {
        ...params,
        params,
        screen: name,
      };

      if (!isEmpty(routes)) {
        const parentAddedRoute = [{name, params}, ...routes];
        result.push({
          name,
          params: updatedParam,
          state: {routes: toPartialRoute(parentAddedRoute)},
        });
      } else {
        result.push({name, params: updatedParam});
      }
    });

    return result;
  } catch (exception) {
    return [];
  }
}

function reset(destination: ScreenNames | ScreenRouteType[]) {
  const newRoutes: ScreenRouteType[] = isScreenType(destination)
    ? [{name: destination}]
    : destination;
  const resetAction = () => {
    const routes = toPartialRoute(newRoutes);
    return CommonActions.reset({
      routes,
      index: routes.length - 1,
    });
  };
  router?.dispatch(resetAction);
}

function back() {
  const backAction = CommonActions.goBack();
  router?.dispatch(backAction);
}

function dismiss(navigation: any) {
  navigation?.getParent()?.pop();
}

function onScreenChanged(
  func: (info: {previousScreen?: string; currentScreen?: string}) => void,
) {
  return router?.addListener('state', () => {
    const previousScreen = routeNameRef;
    const currentRoute = router?.getCurrentRoute();
    const currentScreen = currentRoute?.name;
    if (previousScreen !== currentScreen) {
      func({previousScreen, currentScreen});
    }
  });
}

function getCurrentScreenName() {
  const currentRoute = router?.getCurrentRoute();
  const currentScreen = currentRoute?.name;
  return currentScreen;
}

function hasExactParent(routeName: string) {
  let root: any = router?.getRootState();
  if (root) {
    try {
      let routes = root.routes;
      let index = root.index;
      while (routes && routes.length > 0) {
        root = routes?.[index]?.state;
        if (root) {
          if (routes?.[index]?.name === routeName) {
            return true;
          }
          routes = root.routes;
          index = root.index;
        } else {
          break;
        }
      }
    } catch (e) {}
  }
  return false;
}

function showLoading() {
  loadingRef?.show();
}

function hideLoading() {
  loadingRef?.hide();
}

function showBottomNav() {
  bottomNavBarRef?.show();
}

function hideBottomNav() {
  bottomNavBarRef?.hide();
}

export default {
  getPreviousRouteName,
  getCurrentRouteName,
  dismiss,
  onScreenChanged,
  onNavigationReady,
  getCurrentScreenName,
  onNavigationStateChange,
  setTopLevelNavigator,
  navigate,
  push,
  reset,
  back,
  replace,
  showLoading,
  hideLoading,
  showBottomNav,
  hideBottomNav,
  setLoadingRef,
  getBottomNavRef,
  setBottomNavRef,
};

import * as React from 'react';
import {SafeAreaProvider} from 'react-native-safe-area-context';
import {enableScreens} from 'react-native-screens';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {NavigationContainer} from '@react-navigation/native';
import MainStackNavigator from './mainStack';
import ScreenNames from '../constants/screenNames';
import Loading from '../containers/Loading';
import router from '../configs/router';
import BottomNavBar from '../components/BottomNavBar';

import IconHomeTab from '../assets/svg/ic-home-tab.svg';
import IconWatchListTab from '../assets/svg/ic-watchlist-tab.svg';

const tabData = {
  tabOne: {
    icon: IconHomeTab,
    screen: ScreenNames.HOME_SCREEN,
  },
  tabTwo: {
    icon: IconWatchListTab,
    screen: ScreenNames.WATCHLIST_SCREEN,
  },

  activeScreenName: ScreenNames.HOME_SCREEN,
};

enableScreens();

const RootStack = createNativeStackNavigator();

const RootNavigator = () => (
  <RootStack.Navigator
    screenOptions={{
      headerShown: false,
      animation: 'fade',
    }}>
    <RootStack.Screen
      name={ScreenNames.ROOT_STACK}
      component={MainStackNavigator}
    />
  </RootStack.Navigator>
);

const MainStack = () => {
  return (
    <SafeAreaProvider>
      <NavigationContainer
        ref={router.setTopLevelNavigator}
        onReady={router.onNavigationReady}
        onStateChange={router.onNavigationStateChange}>
        {RootNavigator()}
        <BottomNavBar
          tabData={tabData}
          ref={(bottomNavRef: any) => router.setBottomNavRef(bottomNavRef)}
          isHide
        />
        <Loading ref={loadingRef => router.setLoadingRef(loadingRef)} />
      </NavigationContainer>
    </SafeAreaProvider>
  );
};
export default MainStack;

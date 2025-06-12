import React from 'react';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import HomeScreen from '../containers/HomeScreen';
import WatchListScreen from '../containers/WatchListScreen';
import ScreenNames from '../constants/screenNames';

const HomeTab = createBottomTabNavigator();

const HomeTabsNavigator = () => (
  <HomeTab.Navigator
    screenOptions={() => ({
      headerShown: false,
    })}
    initialRouteName={ScreenNames.HOME_SCREEN}>
    <HomeTab.Screen
      name={ScreenNames.HOME_SCREEN}
      options={{
        tabBarStyle: {display: 'none'},
      }}
      component={HomeScreen}
    />

    <HomeTab.Screen
      name={ScreenNames.WATCHLIST_SCREEN}
      options={{
        tabBarStyle: {display: 'none'},
      }}
      component={WatchListScreen}
    />
  </HomeTab.Navigator>
);

export default HomeTabsNavigator;

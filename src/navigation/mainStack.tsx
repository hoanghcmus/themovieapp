import React from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import HomeTabs from './homeTabs';
import ScreenNames from '../constants/screenNames';
import DetailsScreen from '../containers/DetailsScreen';

const MainStack = createNativeStackNavigator();

const MainStackNavigator = () => (
  <MainStack.Navigator
    screenOptions={{
      headerShown: false,
    }}
    initialRouteName={ScreenNames.HOME_TABS}>
    <MainStack.Screen name={ScreenNames.HOME_TABS} component={HomeTabs} />
    <MainStack.Screen
      name={ScreenNames.DETAIL_SCREEN}
      component={DetailsScreen}
    />
  </MainStack.Navigator>
);

export default MainStackNavigator;

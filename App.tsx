import React from 'react';
import {ModalPortal} from 'react-native-modals';
import {createStackNavigator} from '@react-navigation/stack';
import {Provider} from 'react-redux';
import store, {persistor} from './src/state/store';
import {PersistGate} from 'redux-persist/integration/react';
import RootStack from './src/navigation/rootStack';

export type RootStackParamList = {
  Home: undefined;
  Details: {movieId: number};
};

const Stack = createStackNavigator<RootStackParamList>();

const App = () => {
  return (
    <Provider store={store}>
      <PersistGate persistor={persistor}>
        <RootStack />
        <ModalPortal />
      </PersistGate>
    </Provider>
  );
};

export default App;

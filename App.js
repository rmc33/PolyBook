/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import React from 'react';
import type {Node} from 'react';
import { NavigationContainer } from '@react-navigation/native';
import Home from './components/Home/Home';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

const Stack = createNativeStackNavigator();

const App: () => Node = () => {

  return (
      <NavigationContainer>
        <Stack.Navigator initialRouteName="Getting Started">
          <Stack.Screen name="Getting Started" component={Home} />
        </Stack.Navigator>
      </NavigationContainer>
  );
};

export default App;

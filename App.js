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
import Story from './components/Story/Story';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import ChapterPicker from './components/ChapterPicker/ChapterPicker';

const Stack = createNativeStackNavigator();

const App: () => Node = () => {

  return (
      <NavigationContainer>
        <Stack.Navigator initialRouteName="Getting Started">
          <Stack.Screen name="Getting Started" component={Home} options={{headerShown:false}}/>
          <Stack.Screen name="Choose Book" component={ChapterPicker} options={{headerShown:false}}/>
          <Stack.Screen name="Story" component={Story} options={{headerShown:false}}/>
        </Stack.Navigator>
      </NavigationContainer>
  );
};

export default App;

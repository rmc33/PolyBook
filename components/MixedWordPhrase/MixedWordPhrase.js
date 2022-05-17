

/**
 * @flow strict-local
 * @format
 */

import type {Node} from 'react';
import { StyleSheet, Text, useColorScheme, SafeAreaView,
  ScrollView, View}  from 'react-native';
import React from 'react';
import { useState, useEffect } from 'react';
import { Colors } from 'react-native/Libraries/NewAppScreen';

import { NativeModules, Button, TouchableOpacity } from 'react-native';

const styles = StyleSheet.create({
    containerStyle: {
        marginTop: 6,
        marginLeft: 16
    }
});

const MixedWordPhrase = ({text}): Node => {
  const isDarkMode = useColorScheme() === 'dark';
  const colorStyle = { backgroundColor: isDarkMode ? Colors.darker : Colors.lighter };

  return (
    <View style={styles.containerStyle}>
      <Text>{text}</Text>
    </View>
  );
};

export default MixedWordPhrase;
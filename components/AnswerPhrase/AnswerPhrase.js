

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
        marginTop: 0,
        marginLeft: 6,
        marginRight: 6,
        display: 'flex',
        flexDirection: "row",
        flexWrap: "wrap",
    },
    word: {
        fontSize:14,
        marginLeft:1,
        marginRight:1,
        marginTop: 5,
        marginBottom: 5,
        paddingLeft: 5,
        paddingRight: 5,
        borderColor: '#000',
        borderWidth: 1
    },
    wordContainer: {
        //borderBottomWidth: 1
    }
});

const AnswerPhrase = ({words}): Node => {
  const isDarkMode = useColorScheme() === 'dark';
  const colorStyle = {
      borderColor: isDarkMode ? Colors.lighter : Colors.darker,
  };
  const disabledColor = isDarkMode ? Colors.darker : Colors.lighter;
  const enabledColor = isDarkMode ? Colors.lighter : Colors.darker;

  return (
    <View style={styles.containerStyle}>
      { words.map((word,index) => {
          const color = word.isCorrect ? enabledColor : disabledColor;
          return (
            <View key={`v_${index}`} style={styles.wordContainer}>
              <Text key={`t_${index}`} style={[styles.word, { color }]}>
                {word.value}
              </Text>
            </View>
          );
      })}
    </View>
  );
};

export default AnswerPhrase;
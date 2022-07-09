

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
import AnswerPhrase from '../AnswerPhrase/AnswerPhrase';
import CenteredSpeaker from '../CenteredSpeaker/CenteredSpeaker';

const styles = StyleSheet.create({
    containerStyle: {
      marginTop: 6,
      marginLeft: 16,
      marginRight: 16
    },
    word: {
      fontSize: 14,
      marginLeft: 10,
      marginRight: 10,
      marginTop: 10,
      paddingLeft: 5,
      paddingRight: 5,
      borderColor: '#0b6efd',
      borderWidth: 1
  },
  mixedWords: {
    display: 'flex',
    flexDirection: "row",
    flexWrap: "wrap",
    marginTop: 6,
    paddingBottom: 10
  },
  wordContainer: {
    marginTop: 10
  }
});

const MixedWordPhrase = ({text, onPhraseComplete}): Node => {
  const isDarkMode = useColorScheme() === 'dark';
  const colorStyle = { backgroundColor: isDarkMode ? Colors.darker : Colors.lighter };
  const phrase = parsePhrase(text);
  const shuffledPhrase = shuffleArray([...phrase]);
  const [answerPhrase, setAnswerPhrase] = useState([]);
  const [mixedPhrase, setMixedPhrase] = useState([]);
  const [nextWordIndex, setNextWordIndex] = useState(0);

  useEffect(()=> {
    setAnswerPhrase(phrase);
    setMixedPhrase(shuffledPhrase);
    setNextWordIndex(0);
  },[text]);

  function handleSelectWord(word, index, onPhraseComplete) {
    if (word.value === answerPhrase[nextWordIndex].value) {
      const mixedWord = Object.assign({},mixedPhrase[index], { isCorrect: true });
      mixedPhrase[index] = mixedWord;
      const answeredWord = Object.assign({},answerPhrase[nextWordIndex], { isCorrect: true });
      answerPhrase[nextWordIndex] = answeredWord;
      setMixedPhrase(mixedPhrase);
      setAnswerPhrase(answerPhrase);
      setNextWordIndex(nextWordIndex+1);
      const hasWordRemaining = mixedPhrase.some(item => !item.isCorrect);
      if (!hasWordRemaining) {
        onPhraseComplete();
      }
    }
  }

  return (
    <View style={styles.containerStyle}>
      <AnswerPhrase words={answerPhrase}/>
      <CenteredSpeaker/>
      <MixedWords words={mixedPhrase} onSelectWord={handleSelectWord} onPhraseComplete={onPhraseComplete}/>
    </View>
  );
};

const MixedWords = ({words, onSelectWord, onPhraseComplete}) => {
  const isDarkMode = useColorScheme() === 'dark';
  const colorStyle = {
    color: isDarkMode ? Colors.lighter : Colors.darker
  };
  return (
    <View style={styles.mixedWords}>
        { words.map((word,index) => {
            return (
              <TouchableOpacity key={`to_${index}`} style={styles.wordContainer} onPress={() => onSelectWord(word,index,onPhraseComplete)}>
                  {!word.isCorrect && <Text key={`t_${index}`} style={[styles.word, colorStyle]}>{word.value}</Text> }
              </TouchableOpacity>
            );
        })}
    </View>
  );
};

function parsePhrase(text) {
  return text.split(/\s+/).filter((w) => {
      return w.replace(/\s/g).length > 0;
  }).map((w, index) => {
      return { isCorrect: false, value: w, originalIndex: index };
  });
}

function shuffleArray(array) {
  for (var i = array.length - 1; i > 0; i--) {
      var j = Math.floor(Math.random() * (i + 1));
      var temp = array[i];
      array[i] = array[j];
      array[j] = temp;
  }
  return array;
}

export default MixedWordPhrase;
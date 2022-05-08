

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

import NavigationButton from '../../components/NavigationButton/NavigationButton';

const { SqlLiteModule } = NativeModules;

const styles = StyleSheet.create({
    backgroundStyle: {
        height: '100%'
    }
});

const Story = ({navigation, route}): Node => {
  const isDarkMode = useColorScheme() === 'dark';
  const colorStyle = { backgroundColor: isDarkMode ? Colors.darker : Colors.lighter };
  const [verseLearn, setVerseLearn] = useState('');
  const [verseReference, setVerseReference] = useState('');
  const [order, setOrder] = useState([1,1,1]);
  
  useEffect(() => {
    getVerse(route.params.selectedLang.learn).then(setVerseLearn);
    getVerse(route.params.selectedLang.reference).then(setVerseReference);
  },[]);

  return (
    <SafeAreaView style={styles.backgroundStyle}>
      <ScrollView
        contentInsetAdjustmentBehavior="automatic"
        style={[styles.backgroundStyle, colorStyle]}>
            <Text>{route.params.selectedLang.learn}</Text>
            <Text>{verseLearn}</Text>
            <Text>{route.params.selectedLang.reference}</Text>
            <Text>{verseReference}</Text>
            <NavigationButton title="Next"/>
            <NavigationButton title="Back" onPress={()=>navigation.navigate('Getting Started')}/>
      </ScrollView>
    </SafeAreaView>
  );
};

const getVerse = async (langCode) => {
    try {
      const verse = await SqlLiteModule.getVerseByOrder(langCode, 1, 1, 1);
      console.log(`Created a new event with id ${verse}`);
      return verse;
    } catch (e) {
      console.error(e);
    }
};

export default Story;
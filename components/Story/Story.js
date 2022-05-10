

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
    getVerse(route.params.selectedLang.learn, order).then(setVerseLearn);
    getVerse(route.params.selectedLang.reference, order).then(setVerseReference);
  },[]);

  const handleGetNextVerse = () => {
    getNextVerseOrder(route.params.selectedLang.learn, order).then((verseOrder) => {
        setVerseLearn(verseOrder.verse);
        setOrder(verseOrder.order);
        return verseOrder;
    }).then((verseOrder)=> {
        return getVerse(route.params.selectedLang.reference, verseOrder.order);
    }).then((verse) => {
        setVerseReference(verse);
    }).catch((error) => {
        console.log('handleGetNextVerse:', error);
    });
  };

  return (
    <SafeAreaView style={styles.backgroundStyle}>
      <ScrollView
        contentInsetAdjustmentBehavior="automatic"
        style={[styles.backgroundStyle, colorStyle]}>
            <Text>{route.params.selectedLang.learn}</Text>
            <Text>{verseLearn}</Text>
            <Text>{route.params.selectedLang.reference}</Text>
            <Text>{verseReference}</Text>
            <NavigationButton title="Next" onPress={()=>handleGetNextVerse()}/>
            <NavigationButton title="Back" onPress={()=>navigation.navigate('Getting Started')}/>
      </ScrollView>
    </SafeAreaView>
  );
};

const getVerse = async (langCode, order) => {
    try {
      console.log('getVerse order=', ...order);
      const verse = await SqlLiteModule.getVerseByOrder(langCode, ...order);
      return verse;
    } catch (e) {
      console.error(e);
    }
};

const getNextVerseOrder = async(langCode, order) => {
    const bookNumber = order[0]
        chapterNumber = order[1],
        verseNumber = order[2];
    const nextVerseOrders = [
        [bookNumber, chapterNumber, verseNumber+1],
        [bookNumber, chapterNumber+1, 1],
        [bookNumber+1, 1, 1]
    ];
    for (let o of nextVerseOrders) {
        try {
            verse = await getVerse(langCode, o);
            return { verse, order: o };
        } catch (e) {
            console.error(e);
        }
    }
};

export default Story;
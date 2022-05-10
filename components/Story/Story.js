

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
  const { learn, reference } = route.params.selectedLang;

  useEffect(() => {
    getVerses(learn, reference, order).then((verses) => {
        setVerseReference(verses[reference]);
        setVerseLearn(verses[learn]);
    });
  },[]);

  const handleGetNextVerse = () => {
    getNextVerseOrder(learn, reference, order).then((verseOrder) => {
        setVerseLearn(verseOrder.verses[learn]);
        setVerseReference(verseOrder.verses[reference]);
        setOrder(verseOrder.order);
    }).catch((error) => {
        console.log('handleGetNextVerse:', error);
    });
  };

  return (
    <SafeAreaView style={styles.backgroundStyle}>
      <ScrollView
        contentInsetAdjustmentBehavior="automatic"
        style={[styles.backgroundStyle, colorStyle]}>
            <Text>{order.join('.')}</Text>
            <Text>{learn}</Text>
            <Text>{verseLearn}</Text>
            <Text>{reference}</Text>
            <Text>{verseReference}</Text>
            <NavigationButton title="Next" onPress={()=>handleGetNextVerse()}/>
            <NavigationButton title="Back" onPress={()=>navigation.navigate('Getting Started')}/>
      </ScrollView>
    </SafeAreaView>
  );
};

const getVerses = async (langCodeLearn, langCodeRef, order) => {
    try {
      console.log('getVerses order=', ...order);
      const verses = await SqlLiteModule.getVersesByOrder(langCodeLearn, langCodeRef, ...order);
      return verses;
    } catch (e) {
      console.error(e);
    }
};

const getNextVerseOrder = async(langCodeLearn, langCodeRef, order) => {
    const bookNumber = order[0]
        chapterNumber = order[1],
        verseNumber = order[2];
    const nextVerseOrders = [
        [bookNumber, chapterNumber, verseNumber+1],
        [bookNumber, chapterNumber+1, 1],
        [bookNumber+1, 1, 1]
    ];
    for (let o of nextVerseOrders) {
        verses = await getVerses(langCodeLearn, langCodeRef, o);
        if (verses && verses[langCodeLearn]) {
            return { verses, order: o };
        }
    }
};

export default Story;
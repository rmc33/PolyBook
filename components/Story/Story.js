

/**
 * @flow strict-local
 * @format
 */

import type {Node} from 'react';
import { StyleSheet, Text, useColorScheme, SafeAreaView,
  ScrollView, View, Dimensions }  from 'react-native';
import React from 'react';
import { useState, useEffect } from 'react';
import { Colors } from 'react-native/Libraries/NewAppScreen';

import { NativeModules, Button, TouchableOpacity } from 'react-native';

import NavigationButton from '../../components/NavigationButton/NavigationButton';
import MixedWordPhrase from '../../components/MixedWordPhrase/MixedWordPhrase';

const { SqlLiteModule } = NativeModules;

const styles = StyleSheet.create({
    backgroundStyle: {
        height: '100%'
    },
    verseReferenceText: {
        fontWeight: '600',
        fontSize: 16
    },
    referenceContainer: {
        display: 'flex',
        alignItems: 'flex-start',
        lineHeight: 20,
        marginTop: 0,
        marginBottom: 16,
        marginLeft: 0,
        marginRight: 0,
        paddingTop: 16,
        paddingBottom: 16,
        paddingRight: 6,
        paddingLeft: 16
    },
    contentContainer: {

    },
    navigationContainer: {
    
    }
});

const ReferenceContainer = ({text}): Node => {
    return (
      <View style={[styles.referenceContainer]}>
          <Text style={styles.verseReferenceText}>{text}</Text>
      </View>
    )
};

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
  const { height } = Dimensions.get('window');
  const contentHeight = { height: height-200 };
  return (
    <SafeAreaView style={styles.backgroundStyle}>
      <ScrollView
        contentInsetAdjustmentBehavior="automatic"
        style={[styles.backgroundStyle]}>
            <View style={[styles.contentContainer], contentHeight}>
              <ReferenceContainer text={verseReference}/>
              <MixedWordPhrase text={verseLearn}/>
            </View>
            <View style={styles.navigationContainer}>
              <NavigationButton title="Next" onPress={()=>handleGetNextVerse()}/>
              <NavigationButton title="Back" onPress={()=>navigation.navigate('Getting Started')}/>
            </View>
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
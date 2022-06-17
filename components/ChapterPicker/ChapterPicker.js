

/**
 * @flow strict-local
 * @format
 */

import type {Node} from 'react';
import { StyleSheet, Text, useColorScheme, SafeAreaView,
  ScrollView, View, Dimensions, TouchableOpacity }  from 'react-native';
import React from 'react';
import { Colors } from 'react-native/Libraries/NewAppScreen';
import NavigationButton from '../NavigationButton/NavigationButton';


const styles = StyleSheet.create({
    sectionTitle: {
      marginLeft: 10
    },
    item: {
      fontSize: 16,
      fontWeight: '300',
      paddingTop: 12,
      paddingBottom: 12,
      borderBottomWidth: 1,
      marginLeft: 10,
      display: 'flex',
      flexDirection: 'row'
    },
    navigationContainer: {
      height: 70,
      borderTopWidth: 1,
      borderColor: '#D3D3D3'
    },
    screenTitle: {
      marginLeft: 10,
      fontSize: 16,
      fontWeight: '600',
      marginBottom: 10
    }
  });

  const Item = ({ title, onSelect }): Node => {
    const isDarkMode = useColorScheme() === 'dark';
    return (
      <TouchableOpacity style={styles.item} onPress={() => onSelect(title)}>
        <Text
          style={[
            styles.sectionTitle,
            {
              color: isDarkMode ? Colors.white : Colors.black,
            },
          ]}>
          {title}
        </Text>
      </TouchableOpacity>
    );
  };

const ChapterPicker  = ({navigation, route}): Node => {
  const isDarkMode = useColorScheme() === 'dark';
  const selectedLang = route.params.selectedLang;
  const backgroundStyle = {
    backgroundColor: isDarkMode ? Colors.darker : Colors.lighter,
    height: '100%'
  };
  const chapterProgress = route.params.chapterProgress || {};
  const chapters = route.params.chapters;
  let selectedBook = {};
  const onBookSelected = (book) => {
    selectedBook = { bookNumber: book[1], chapterNumber: 1, verseNumber: 1 };
    navigation.navigate('Story', {selectedLang, chapters, selectedBook});
  }
  return (
    <SafeAreaView style={backgroundStyle}>
      <Text style={styles.screenTitle}>Choose Chapter</Text>
      <ScrollView
        contentInsetAdjustmentBehavior="automatic"
        style={backgroundStyle}>
            { chapters.map((c) => {
              return <Item key={c} title={c[0]} progress={chapterProgress[c[1]]} onSelect={() => onBookSelected(c)}/>
            })}
        </ScrollView>
        <View style={styles.navigationContainer}>
          <NavigationButton title="Back" onPress={()=>navigation.navigate('Getting Started')}/>
        </View>
      </SafeAreaView>
  );
};

export default ChapterPicker;
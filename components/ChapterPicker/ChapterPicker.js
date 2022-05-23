

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

const { height } = Dimensions.get('window')

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
      height: 140,
      borderTopWidth: 1,
      borderColor: '#D3D3D3'
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
  const chapters = route.params.chapters;
  return (
    <SafeAreaView style={backgroundStyle}>
      <ScrollView
        contentInsetAdjustmentBehavior="automatic"
        style={backgroundStyle}>
            <Text>Pick chapter</Text>
            <Item title={`${chapters[0][0]}: ${chapters[0][1]}.${chapters[0][2]}.${chapters[0][3]}`}/>
            <Item title={`${chapters[1][0]}: ${chapters[1][1]}.${chapters[1][2]}.${chapters[1][3]}`}/>
        </ScrollView>
        <View style={styles.navigationContainer}>
          <NavigationButton title="Next" onPress={()=>navigation.navigate('Story', {selectedLang, chapters})}/>
          <NavigationButton title="Back" onPress={()=>navigation.navigate('Getting Started', {selectedLang})}/>
        </View>
      </SafeAreaView>
  );
};

export default ChapterPicker;
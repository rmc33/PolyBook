

/**
 * @flow strict-local
 * @format
 */

import type {Node} from 'react';
import { StyleSheet, Text, useColorScheme}  from 'react-native';
import React from 'react';
import { useState } from 'react';
import { Colors } from 'react-native/Libraries/NewAppScreen';
import { View  } from 'react-native';

import { NativeModules, Button, TouchableOpacity } from 'react-native';
import LanguagePicker from '../../components/LanguagePicker/LanguagePicker';
import SelectedLanguage from '../../components/SelectedLanguage/SelectedLanguage';

const { SqlLiteModule } = NativeModules;

const styles = StyleSheet.create({
    sectionContainer: {
      marginTop: 32,
      paddingHorizontal: 24,
    },
    sectionTitle: {
      fontSize: 24,
      fontWeight: '600',
    },
    sectionDescription: {
      marginTop: 8
    },
    highlight: {
      fontWeight: '700',
    },
    container: {
      marginTop: 34,
      flex: 1,
      alignItems: 'center'
    },
    customBtnText: {
      fontSize: 20,
      fontWeight: '500',
      color: "#fff"
    },
    customBtnBG: {
      backgroundColor: "#0b6efd",
      paddingHorizontal: 5,
      paddingVertical: 5,
      width: '80%',
      flex: 1,
      alignItems: 'center'
    },
    linkBtn: {
      color: '#841584'
    },
    linkBtnContainer: {
      marginTop: 0
    }
  });

  const Section = ({children, title}): Node => {
    const isDarkMode = useColorScheme() === 'dark';
    return (
      <View style={styles.sectionContainer}>
        <Text
          style={[
            styles.sectionTitle,
            {
              color: isDarkMode ? Colors.white : Colors.black,
            },
          ]}>
          {title}
        </Text>
        <View
          style={[
            styles.sectionDescription,
            {
              color: isDarkMode ? Colors.light : Colors.dark,
            },
          ]}>
          {children}
        </View>
      </View>
    );
  };

const Home = (): Node => {
  const isDarkMode = useColorScheme() === 'dark';
  const [languageModalVisible, setLanguageModalVisible] = useState(false);
  
  return (
    <View
        style={{
        backgroundColor: isDarkMode ? Colors.black : Colors.white,
        }}>
         <LanguagePicker visible={languageModalVisible} onClose={()=>setLanguageModalVisible(false)}/>
        <Section title="Choose a language to learn">
          <ChooseLang title="Select the language you would like to learn while reading." 
            languageCode="EN"
            onPress={()=>setLanguageModalVisible(true)}/>
        </Section>
        <Section title="Choose a reference language">
          <ChooseLang title="Select the language you would like to use for translation." 
            languageCode="EN"
            onPress={()=>setLanguageModalVisible(true)}/>
        </Section>
        <View style={styles.container}>
          <TouchableOpacity
            style={styles.customBtnBG}
            onPress={getVerse} 
          >
            <Text style={styles.customBtnText}>Next</Text>
          </TouchableOpacity>
        </View>
    </View>
  );
};

const ChooseLang = ({title, languageCode, onPress}): Node => {
  return (
    <TouchableOpacity onPress={onPress}>
      <Text style={styles.linkBtn}>{title}</Text>
      <SelectedLanguage languageCode={languageCode} fontSize={20}/>
    </TouchableOpacity>
  );
};

const getVerse = async () => {
    try {
      const verse = await SqlLiteModule.getVerse(14486,2);
      console.log(`Created a new event with id ${verse}`);
    } catch (e) {
      console.error(e);
    }
};

export default Home;
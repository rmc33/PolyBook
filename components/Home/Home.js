

/**
 * @flow strict-local
 * @format
 */

import type {Node} from 'react';
import { StyleSheet, Text, useColorScheme, SafeAreaView,
  ScrollView, View}  from 'react-native';
import React from 'react';
import { useState } from 'react';
import { Colors } from 'react-native/Libraries/NewAppScreen';

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
      color: '#414042'
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
  const backgroundStyle = {
    backgroundColor: isDarkMode ? Colors.darker : Colors.lighter,
    height: '100%'
  };
  const [languageModalVisible, setLanguageModalVisible] = useState(false);
  const [selectedLang, setSelectedLang] = useState({learn: 'EN', reference: 'EN'});
  const [activeLang, setActiveLang] = useState('');
  const [allLanguages, setAllLanguages] = useState([]);

  const handleChooseLang = (activeLang) => {
    setLanguageModalVisible(true);
    setActiveLang(activeLang);
    const fetchData = async () => {
      try {
        if (allLanguages.length == 0) {
          const languages = await SqlLiteModule.getLanguages();
          setAllLanguages(languages);
        }
      }
      catch(e) {
        console.log('LanguagePicker error', e);
      }
    };
    fetchData();
  };

  const onSelectLang = (langCode) => {
    setLanguageModalVisible(false);
    setSelectedLang(Object.assign(selectedLang, {[activeLang] : langCode}));
  };

  return (
    <SafeAreaView style={backgroundStyle}>
      <ScrollView
        contentInsetAdjustmentBehavior="automatic"
        style={backgroundStyle}>
          { languageModalVisible && 
            <LanguagePicker visible={languageModalVisible} allLanguages={allLanguages} onClose={()=>setLanguageModalVisible(false)} onSelect={onSelectLang}/> 
          }
          <Section title="Choose a language to learn">
            <ChooseLang title="Select the language you would like to learn while reading." 
              languageCode={selectedLang.learn}
              onPress={() => handleChooseLang('learn')}/>
          </Section>
          <Section title="Choose a reference language">
            <ChooseLang title="Select the language you would like to use for translation." 
              languageCode={selectedLang.reference}
              onPress={() => handleChooseLang('reference')}/>
          </Section>
          <NavigationButton title="Next"/>
      </ScrollView>
    </SafeAreaView>
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

const NavigationButton = ({title}): Node => {
  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.customBtnBG}
        onPress={getVerse} 
      >
        <Text style={styles.customBtnText}>{title}</Text>
      </TouchableOpacity>
    </View>
  )
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
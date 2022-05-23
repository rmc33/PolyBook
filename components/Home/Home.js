

/**
 * @flow strict-local
 * @format
 */

import type {Node} from 'react';
import { StyleSheet, Text, useColorScheme, SafeAreaView,
  ScrollView, View, Dimensions}  from 'react-native';
import React from 'react';
import { useState } from 'react';
import { Colors } from 'react-native/Libraries/NewAppScreen';

import { NativeModules, Button, TouchableOpacity } from 'react-native';
import LanguagePicker from '../../components/LanguagePicker/LanguagePicker';
import SelectedLanguage from '../../components/SelectedLanguage/SelectedLanguage';
import NavigationButton from '../../components/NavigationButton/NavigationButton';

const { SqlLiteModule } = NativeModules;

const styles = StyleSheet.create({
    sectionContainer: {
      marginTop: 50,
      paddingHorizontal: 24,
    },
    sectionTitle: {
      fontSize: 28,
      fontWeight: '600',
    },
    sectionDescription: {
      marginTop: 10
    },
    linkBtn: {
      color: '#414042',
      fontSize: 20,
      marginBottom: 5
    },
    navigationContainer: {
      height: 70
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

const Home = ({navigation}): Node => {
  const isDarkMode = useColorScheme() === 'dark';
  const { height } = Dimensions.get('window');
  const backgroundStyle = {
    backgroundColor: isDarkMode ? Colors.darker : Colors.lighter,
    height: height
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
        const languages = await SqlLiteModule.getLanguages();
        setAllLanguages(languages);
      }
      catch(e) {
        console.log('LanguagePicker error', e);
      }
    };
    if (allLanguages.length == 0) fetchData();
  };

  const onSelectLang = (langCode) => {
    setLanguageModalVisible(false);
    setSelectedLang(Object.assign(selectedLang, {[activeLang] : langCode}));
  };

  const groupByBook = (allChapters) => {
    const chapters = {};
    allChapters.forEach((c) => {
      if (chapters.hasOwnProperty(c[0])) {
        chapters[c[0]].push({bookNumber: c[1], chapterNumber: c[2], verseNumber: c[3]});
      }
      else {
        chapters[c[0]] = [{bookNumber: c[1], chapterNumber: c[2], verseNumber: c[3]}];
      }
    });
    return chapters;
  };

  const selectChapter = () => {
    const fetchData = async () => {
      try {
        const allChapters = await SqlLiteModule.getChapters(selectedLang.reference);
        const chapters = groupByBook(allChapters);
        navigation.navigate('Choose Book', { selectedLang, chapters });
      }
      catch(e) {
        console.log('LanguagePicker error', e);
      }
    };
    fetchData();
  };

  return (
    <SafeAreaView style={backgroundStyle}>
    <ScrollView
      contentInsetAdjustmentBehavior="automatic"
      style={backgroundStyle}>
        { languageModalVisible && 
          <LanguagePicker visible={true} allLanguages={allLanguages} onClose={()=>setLanguageModalVisible(false)} onSelect={onSelectLang}/> 
        }
        <Section title="Choose a reference language">
          <ChooseLang title="Select the language you would like to use for translation." 
            languageCode={selectedLang.reference}
            onPress={() => handleChooseLang('reference')}/>
        </Section>
        <Section title="Choose a language to learn">
          <ChooseLang title="Select the language you would like to learn while reading." 
            languageCode={selectedLang.learn}
            onPress={() => handleChooseLang('learn')}/>
        </Section>
        <View style={styles.navigationContainer}>
          <NavigationButton title="Next" onPress={selectChapter}/>
        </View>
    </ScrollView>
    </SafeAreaView>
  )
};

const ChooseLang = ({title, languageCode, onPress}): Node => {
  return (
    <TouchableOpacity onPress={onPress}>
      <Text style={styles.linkBtn}>{title}</Text>
      <SelectedLanguage languageCode={languageCode} fontSize={20}/>
    </TouchableOpacity>
  );
};

export default Home;
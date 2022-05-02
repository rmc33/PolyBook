

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

import { NativeModules, Button } from 'react-native';
import LanguagePicker from '../../components/LanguagePicker/LanguagePicker';

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
      marginTop: 8,
      fontSize: 18,
      fontWeight: '400',
    },
    highlight: {
      fontWeight: '700',
    },
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
        <Text
          style={[
            styles.sectionDescription,
            {
              color: isDarkMode ? Colors.light : Colors.dark,
            },
          ]}>
          {children}
        </Text>
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
          <Button
            title="Select the language you would like to learn while reading."
            color="#841584"
            onPress={()=>setLanguageModalVisible(true)}
          />
        </Section>
        <Section title="Choose a reference language">
          <Button
            title="Select the language you would like to use for translation."
            color="#841584"
            onPress={()=>setLanguageModalVisible(false)}
          />
        </Section>
        <View
          style={{
            backgroundColor: '#0b6efd',
            marginLeft: 20,
            marginRight: 20,
            marginTop: 80
          }}>
        <Button
          title="Next"
          color="#fff"
          onPress={getVerse}/>
        </View>
    </View>
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
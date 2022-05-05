

/**
 * @flow strict-local
 * @format
 */

import type {Node} from 'react';
import {StyleSheet, Text, useColorScheme, Dimensions} from 'react-native';
import React, { useState, useEffect } from 'react';
import { Colors } from 'react-native/Libraries/NewAppScreen';
import { View, ScrollView, TouchableOpacity } from 'react-native';
import AnimatedModal from '../../components/AnimatedModal/AnimatedModal';
import { NativeModules, Button } from 'react-native';
import SelectedLanguage from '../../components/SelectedLanguage/SelectedLanguage';

const { height } = Dimensions.get('window')

const { SqlLiteModule } = NativeModules;

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
    }
  });

  const Item = ({ title, onSelect }): Node => {
    const isDarkMode = useColorScheme() === 'dark';
    return (
      <TouchableOpacity style={styles.item} onPress={() => onSelect(title)}>
        <SelectedLanguage languageCode={title} fontSize={20}/>
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

const LanguagePicker  = ({ visible, onClose, onSelect }): Node => {
  const isDarkMode = useColorScheme() === 'dark';
  const [allLang, setAllLang] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (visible && allLang.length == 0) {
          const languages = await SqlLiteModule.getLanguages();
          setAllLang(languages);
        }
      }
      catch(e) {
        console.log('LanguagePicker error', e);
      }
    }
    fetchData();
  }, [visible]);

  return (
      <AnimatedModal visible={visible}>
        <View
            style={{
                backgroundColor: isDarkMode ? Colors.black : Colors.white,
                height: height
            }}>
            <Button
                title="Close"
                color="#841584"
                onPress={onClose}
            />
            <ScrollView
                contentInsetAdjustmentBehavior="automatic">
                {allLang && allLang.map((langCode)=>{
                  return (
                    <Item key={langCode} title={langCode} onSelect={onSelect}/>
                  )
                })}
            </ScrollView>
        </View>
    </AnimatedModal>
  );
};

export default LanguagePicker;
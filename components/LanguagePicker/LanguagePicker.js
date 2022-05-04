

/**
 * @flow strict-local
 * @format
 */

import type {Node} from 'react';
import {StyleSheet, Text, useColorScheme, Dimensions} from 'react-native';
import React, { useState, useEffect } from 'react';
import { Colors } from 'react-native/Libraries/NewAppScreen';
import { View, ScrollView  } from 'react-native';
import AnimatedModal from '../../components/AnimatedModal/AnimatedModal';
import { NativeModules, Button } from 'react-native';

const { height } = Dimensions.get('window')

const { SqlLiteModule } = NativeModules;

interface Props {
    visible?: boolean
}

const styles = StyleSheet.create({
    sectionContainer: {
      marginTop: 32,
      paddingHorizontal: 24,
    },
    item: {
      fontSize: 16,
      fontWeight: '300',
      paddingTop: 12,
      paddingBottom: 12,
      borderBottom: '2px solid',
      borderTop: '2px solid'
    }
  });

  const Item = ({ title }): Node => {
    const isDarkMode = useColorScheme() === 'dark';
    return (
      <View style={styles.item}>
        <Text
          style={[
            styles.sectionTitle,
            {
              color: isDarkMode ? Colors.white : Colors.black,
            },
          ]}>
          {title}
        </Text>
      </View>
    );
  };

const LanguagePicker  = ({ visible, onClose }: Props) => {
  const isDarkMode = useColorScheme() === 'dark';
  const [allLang, setAllLang] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const languages = await SqlLiteModule.getLanguages();
        visible && setAllLang(languages);
      }
      catch(e) {
        console.log('error', e);
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
                {visible && allLang && allLang.map((langCode)=>{
                  return (
                    <Item key={langCode} title={langCode}/>
                  )
                })}
            </ScrollView>
        </View>
    </AnimatedModal>
  );
};

export default LanguagePicker;
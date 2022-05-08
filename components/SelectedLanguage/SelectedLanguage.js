
import {StyleSheet, Text, useColorScheme} from 'react-native';
import React from 'react';
import { Colors } from 'react-native/Libraries/NewAppScreen';

interface Props {
    languageCode?: string;
    fontSize?: number;
}

const emojiMap = {
    'EN': '🇬🇧',
    'HU': '🇭🇺',
    'IT': '🇮🇹',
    'FR': '🇫🇷'
};

const getEmoji = (languageCode: string): string => {
    return emojiMap[languageCode];
};

const SelectedLanguage = ({ languageCode, fontSize }: Props) => {
  const isDarkMode = useColorScheme() === 'dark';
  return (
    <Text
        style={[styles.text, { fontSize: fontSize }, {
            color: isDarkMode ? Colors.white : Colors.black,
          }]}
        allowFontScaling={false}
        >
        {getEmoji(languageCode)}
    </Text>
  );
};

const styles = StyleSheet.create({
  text: {
    alignItems: 'center',
    justifyContent: 'center',
    borderColor: 'transparent',
    backgroundColor: 'transparent'
  }
});

export default SelectedLanguage;

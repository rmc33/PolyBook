
import type {Node} from 'react';
import { StyleSheet, Text, useColorScheme, TouchableOpacity, View }  from 'react-native';
import React from 'react';


const styles = StyleSheet.create({
    container: {
      marginTop: 30,
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
      height: 150,
      flex: 1,
      alignItems: 'center'
    }
  });

const NavigationButton = ({title, onPress }): Node => {
    return (
      <View style={styles.container}>
        <TouchableOpacity
          style={styles.customBtnBG}
          onPress={onPress}
        >
          <Text style={styles.customBtnText}>{title}</Text>
        </TouchableOpacity>
      </View>
    )
};

export default NavigationButton;
  

import {StyleSheet, Text, useColorScheme, TouchableOpacity} from 'react-native';
import React from 'react';

const CenteredSpeaker = () => {
    return (
        <TouchableOpacity style={styles.centeredSpeakerContainer}>
            <Text>📢</Text>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    centeredSpeakerContainer: {
        flex: 1,
        alignItems: 'center',
        marginTop: 30,
        marginLeft: 16,
        marginRight: 21
    }
});

export default CenteredSpeaker;

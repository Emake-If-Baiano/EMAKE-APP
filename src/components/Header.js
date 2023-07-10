import React from 'react'
import { StyleSheet } from 'react-native'
import { Text } from 'react-native-paper'
import { useFonts } from 'expo-font';

export default function Header(props) {

    const [fontsLoaded] = useFonts({
        'times': require("../../fonts/times.ttf"),
    });

    if (!fontsLoaded) {
        return null;
    };

    return <Text
        adjustsFontSizeToFit={true}
        style={[styles.header, props.customStyle]} {...props} />
}

const styles = StyleSheet.create({
    header: {
        fontSize: 21,
        color: 'white',
    },
})

import React from 'react'
import { ImageBackground, StyleSheet, KeyboardAvoidingView, StatusBar, View } from 'react-native'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
const Tab = createBottomTabNavigator();

export default function Background({ children }) {

    return (

        <ImageBackground
            style={styles.background}
            source={require('../../assets/initial_background.png')}
        >
            {/* <StatusBar translucent backgroundColor="transparent" /> */}
            <KeyboardAvoidingView style={styles.container} behavior="padding">
                {children}
            </KeyboardAvoidingView>
        </ImageBackground>
    )
}

const styles = StyleSheet.create({
    background: {
        flex: 1,
        width: '100%',
    },
    container: {
        flex: 1,
        width: '100%',
        height: "100%",
        alignSelf: 'center',
        alignItems: 'center',
    },
})

import React from 'react'
import { ImageBackground, StyleSheet, KeyboardAvoidingView, StatusBar, View, Dimensions } from 'react-native'

export default function Background({ children, navigation }) {

    return (

        <ImageBackground
            style={styles.background}
            source={require('../../assets/normal_background.png')}
        >
            <StatusBar translucent backgroundColor="transparent" />
            <KeyboardAvoidingView style={styles.container} behavior="position" enabled>
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
        flex: 0.9,
        width: Dimensions.get("window").width,
        height: Dimensions.get("window").height,
        width: "100%",
        height: "100%",
        alignSelf: 'flex-start',
        alignItems: 'flex-start',
        justifyContent: 'flex-start',
    },
})

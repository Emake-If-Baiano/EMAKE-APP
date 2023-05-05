import React from 'react'
import { ImageBackground, StyleSheet, KeyboardAvoidingView, StatusBar, View, Dimensions, TouchableOpacity, Image } from 'react-native'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
const Tab = createBottomTabNavigator();

import Header from './Header';

import { LinearGradient } from 'expo-linear-gradient';

// import AsyncStorage from '@react-native-async-storage/async-storage';

import * as Keychain from 'react-native-keychain';

export default function Background({ children }) {

    return (

        <ImageBackground
            style={styles.background}
            source={require('../../assets/initial_background.png')}
        >
            <StatusBar translucent backgroundColor="transparent" />
            <KeyboardAvoidingView style={styles.container} behavior="position" enabled>
                {children}
            </KeyboardAvoidingView>

            <KeyboardAvoidingView style={{
                flex: 0.1
            }} behavior='position' enabled>
                <LinearGradient
                    start={{ x: 0, y: 1 }}
                    end={{ x: 1, y: 0 }}

                    colors={['#00FF12', '#225D62']}
                    style={styles.barView}>

                    <TouchableOpacity
                        style={styles.barViewItem}
                        onPress={() => navigation.navigate('Shop')}
                    >
                        <Image
                            source={require("../../assets/config.png")}
                            style={{
                                width: "35%",
                                height: "45%",
                            }}
                        />
                        <Header
                            customStyle={{
                                fontSize: 10.5,
                            }}
                        >
                            CONFIGURAÇÕES
                        </Header>
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.barViewItem}
                        onPress={() => navigation.navigate('Anuncio')}
                    >
                        <Image
                            source={require("../../assets/home.png")}
                            style={{
                                width: "35%",
                                height: "45%",
                            }}
                        />

                        <Header
                            customStyle={{
                                fontSize: 10.5,
                            }}
                        >
                            INÍCIO
                        </Header>
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.barViewItem}
                        onPress={async () => {
                            await Keychain.resetGenericPassword();

                            await AsyncStorage.removeItem("username");
                            await AsyncStorage.removeItem("password");

                            navigation.reset({
                                index: 0,
                                routes: [{ name: 'LoginScreen' }],
                            });
                        }}
                    >
                        <Image
                            source={require("../../assets/notificação.png")}
                            style={{
                                width: "35%",
                                height: "45%",
                            }}
                        />

                        <Header
                            customStyle={{
                                fontSize: 10.5,
                            }}
                        >
                            NOTIFICAÇÕES
                        </Header>
                    </TouchableOpacity>
                </LinearGradient>
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
    barView: {
        flexDirection: "row",
        justifyContent: "space-between",
        height: "100%",
    },
    barViewItem: {
        flex: 0.33,
        alignItems: "center",
        height: "100%",
        justifyContent: "center"
    },
})

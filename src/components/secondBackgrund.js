import React, { useEffect, useState } from 'react'
import { ImageBackground, StyleSheet, KeyboardAvoidingView, StatusBar, View, Dimensions, TouchableOpacity, Image } from 'react-native'

import Header from './Header';
import AsyncStorage from '@react-native-async-storage/async-storage';
import loading from '../screens/loading';

import themes from '../../temas';
const themeImages = {
    normal: require('../../assets/normal_background.png'),
    bluedark: require('../../assets/bluedark_background.png'),
    reddark: require('../../assets/reddark_background.png'),
    bluetema: require('../../assets/bluetema_background.png'),
};

export default function Background({ children, navigation, changeTheme }) {

    useEffect(() => {
        AsyncStorage.getItem("theme").then(res => {
            setTheme(res || "normal")
        })
    }, [changeTheme]);

    const [theme, setTheme] = useState(false);

    useEffect(() => {
        AsyncStorage.getItem("theme").then(res => {
            setTheme(res || "normal")
        })
    }, []);

    if (!theme) return loading()

    return (

        <ImageBackground
            style={styles.background}
            source={changeTheme ? themeImages[theme] : themeImages[theme]}
        >
            <StatusBar translucent backgroundColor={"transparent"} />
            <KeyboardAvoidingView style={styles.container} behavior="position" enabled>
                {children}
            </KeyboardAvoidingView>

            <KeyboardAvoidingView style={{
                flex: 0.1
            }} behavior='position' enabled>
                <View
                    style={[styles.barView, {
                        backgroundColor: changeTheme ? themes[theme].dashboard.primary : themes[theme].dashboard.primary
                    }]}>

                    <TouchableOpacity
                        style={styles.barViewItem}
                        onPress={() => navigation.navigate('Config')}
                    >
                        <Image
                            source={require("../../assets/config.png")}
                            style={{
                                width: "35%",
                                height: "45%",
                                tintColor: changeTheme ? themes[theme].dashboard.navColor : themes[theme].dashboard.navColor
                            }}
                        />
                        <Header
                            customStyle={{
                                fontSize: 10.5,
                                fontWeight: "bold",
                            }}
                        >
                            CONFIGURAÇÕES
                        </Header>
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.barViewItem}
                        onPress={() => navigation.navigate('Dashboard')}
                    >
                        <Image
                            source={require("../../assets/home.png")}
                            style={{
                                width: "35%",
                                height: "45%",
                                tintColor: changeTheme ? themes[theme].dashboard.navColor : themes[theme].dashboard.navColor
                            }}
                        />

                        <Header
                            customStyle={{
                                fontSize: 10.5,
                                fontWeight: "bold",
                            }}
                        >
                            INÍCIO
                        </Header>
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.barViewItem}
                        onPress={async () => navigation.navigate("Notificações")}
                    >
                        <Image
                            source={require("../../assets/notificação.png")}
                            style={{
                                width: "35%",
                                height: "45%",
                                tintColor: changeTheme ? themes[theme].dashboard.navColor : themes[theme].dashboard.navColor
                            }}
                        />

                        <Header
                            customStyle={{
                                fontSize: 10.5,
                                fontWeight: "bold",
                            }}
                        >
                            NOTIFICAÇÕES
                        </Header>
                    </TouchableOpacity>
                </View>
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

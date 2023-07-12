import React from 'react'
import { ImageBackground, StyleSheet, KeyboardAvoidingView, StatusBar, View, Dimensions, TouchableOpacity, Image } from 'react-native'

import Header from './Header';

export default function Background({ children, navigation }) {

    return (

        <ImageBackground
            style={styles.background}
            source={require('../../assets/initial_background.png')}
        >
            <StatusBar translucent backgroundColor={"transparent"} />
            <KeyboardAvoidingView style={styles.container} behavior="position" enabled>
                {children}
            </KeyboardAvoidingView>

            <KeyboardAvoidingView style={{
                flex: 0.1
            }} behavior='position' enabled>
                <View
                    style={styles.barView}>

                    <TouchableOpacity
                        style={styles.barViewItem}
                        onPress={() => navigation.navigate('Config')}
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
        backgroundColor: "#61e786"
    },
    barViewItem: {
        flex: 0.33,
        alignItems: "center",
        height: "100%",
        justifyContent: "center"
    },
})

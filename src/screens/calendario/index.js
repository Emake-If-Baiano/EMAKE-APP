import React, { useEffect, useState } from 'react'

import Background from '../../components/secondBackgrund';

import { Image, View, ScrollView } from 'react-native';

import Header from '../../components/Header';


import Login from '../../services/SUAP';

import { Dimensions } from 'react-native';

import AsyncStorage from '@react-native-async-storage/async-storage';

import { TouchableOpacity } from 'react-native';
import loading from '../loading';

import * as Keychain from 'react-native-keychain';
import themes from '../../../temas';

export default function Calendario({ navigation }) {

    const [userData, setUserData] = useState({});

    const [credentials, setCredentials] = useState({});

    const [calendario, setCalendario] = useState(false);

    const [theme, setTheme] = useState(false);

    useEffect(() => {

        AsyncStorage.getItem("theme").then(res => {
            setTheme(themes[res || "normal"].calendario);
        })

        AsyncStorage.getItem("userdata").then(data => {

            setUserData(JSON.parse(data));
        });

        AsyncStorage.getItem("calendario").then(data => {
            if (data) {
                setCalendario(JSON.parse(data));
            }
        });

        AsyncStorage.getItem("userinfo").then(data => {
            const parse = JSON.parse(data);

            setCredentials(parse);

            if (!calendario.length) Login.obterCalendario(parse.user, parse.password).then(data => {
                setCalendario(data);

                AsyncStorage.setItem("calendario", JSON.stringify(data));
            })
        });
    }, [])

    if (!calendario) return loading();

    if (!theme) return loading();
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
                    flex: 0.05,
                }}>
                    <TouchableOpacity onPress={() => {
                        AsyncStorage.removeItem("userinfo").then(() => {
                            AsyncStorage.removeItem("userdata").then(() => {
                                Keychain.resetGenericPassword().then(() => {
                                    AsyncStorage.removeItem("darkmode");

                                    navigation.reset({
                                        index: 0,
                                        routes: [{ name: 'Login' }],
                                    })
                                })
                            })
                        });
                    }} style={{
                        flexDirection: "row",
                        justifyContent: "flex-start",
                        alignItems: "flex-start",
                        flex: 1,
                    }}>
                        <Header customStyle={{
                            color: theme.primary,
                            width: "100%",
                            marginStart: "5%"
                        }}>Sair</Header>
                    </TouchableOpacity>
                </View>

                <View style={{
                    flex: 0.9,
                    backgroundColor: theme.background,
                    width: "100%",
                }}>
                    <View style={{
                        flexDirection: "row",
                        justifyContent: "center",
                        alignItems: "center",
                        flex: 0.15,
                    }}>
                        <Image
                            style={{
                                width: 75,
                                height: 75,
                                alignSelf: "center",
                                marginStart: "3%",
                            }}
                            source={require("../../../assets/paginas.png")}
                        />

                        <Header style={{
                            color: theme.secondary,
                            fontSize: 25,
                            fontWeight: "bold",
                            marginStart: "1%"
                        }}>
                            Calendário Acadêmico
                        </Header>
                    </View>
                    <View style={{
                        flex: 1,
                    }}>
                        {calendario.length ? <ScrollView vertical={true} contentContainerStyle={{

                        }} style={{
                            backgroundColor: theme.background,
                            width: "100%",

                        }}>
                            {Array(Math.ceil(calendario?.length / 2)).fill(true).map((a, i) => {
                                console.log(i)
                                return <View style={{
                                    width: "100%",
                                    flexDirection: "row",
                                    justifyContent: "space-around",
                                }}>
                                    {calendario?.sort((a, b) => a.indice - b.indice).slice(i * 2, i * 2 + 2).map((b, i) => {
                                        return <Image source={{
                                            uri: `data:image/png;base64,${b.buffer}`
                                        }} style={{
                                            width: "49%",
                                            height: 350,
                                            marginTop: "5%"
                                        }} />
                                    })}
                                </View>
                            })}
                        </ScrollView> : <Header customStyle={{
                            color: "black",
                            fontSize: 20,
                            fontWeight: "bold"
                        }}>
                            Sem calendário disponível
                        </Header>}
                    </View>
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

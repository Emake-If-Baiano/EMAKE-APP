import React, { useEffect, useState } from 'react'

import Background from '../../components/secondBackgrund';

import { Image, View, ScrollView } from 'react-native';

import Header from '../../components/Header';

import * as Keychain from 'react-native-keychain';

import Login from '../../services/SUAP';

import { Dimensions } from 'react-native';

import AsyncStorage from '@react-native-async-storage/async-storage';

import { TouchableOpacity } from 'react-native';
import loading from '../loading';

import themes from '../../../temas/';

export default function Notificacoes({ navigation }) {

    const [userData, setUserData] = useState({});

    const [credentials, setCredentials] = useState({});

    const [notificacoes, setNotificacoes] = useState(false);

    const [theme, setTheme] = useState(false);

    useEffect(() => {
        AsyncStorage.getItem("theme").then(res => {
            setTheme(themes[res || "normal"].notificacoes);
        })

        AsyncStorage.getItem("userdata").then(data => {

            setUserData(JSON.parse(data));
        });

        AsyncStorage.getItem("userinfo").then(data => {
            const parse = JSON.parse(data);

            setCredentials(parse);

            Login.obterNotificacoes(parse.user, parse.password).then(data => {
                console.log(data)
                setNotificacoes(data)
            })
        });
    }, [])

    if (!notificacoes) return loading();

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
                            color: "#00FF29",
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
                            color: theme.header,
                            fontSize: 25,
                            fontWeight: "bold",
                            marginStart: "1%"
                        }}>
                            Notificações
                        </Header>
                    </View>
                    <View style={{
                        flex: 0.75,
                    }}>
                        <ScrollView vertical={true} contentContainerStyle={{
                            flex: 1
                        }} style={{
                            backgroundColor: theme.background,
                            width: "100%",

                        }}>
                            {notificacoes?.map((b, i) => {
                                return <View style={{
                                    backgroundColor: theme.primary,
                                    width: "80%",
                                    height: 120,
                                    borderRadius: 20,
                                    marginTop: "5%",
                                    alignSelf: "center",
                                    shadowColor: 'black',
                                    shadowOffset: { width: -5, height: 10 },
                                    shadowOpacity: 0.5,
                                    shadowRadius: 10,
                                    elevation: 10,
                                    alignItems: "center"
                                }}>
                                    <Header customStyle={{
                                        fontWeight: "bold",
                                        fontSize: 16,
                                        color: theme.secondary,
                                        marginStart: "5%",
                                        flex: 0.3,
                                    }}>{b.titulo}</Header>

                                    <View style={{
                                        flex: 0.7,
                                        justifyContent: "center",
                                        alignItems: "flex-start",
                                    }}>
                                        {b.fields.map(f => {
                                            return <View style={{
                                                flex: 0.33333333,
                                                flexDirection: "row",
                                            }}>
                                                <Header customStyle={{
                                                    fontWeight: "bold",
                                                    fontSize: 11,
                                                    color: theme.secondary,
                                                    flex: 1,
                                                    marginStart: "5%",
                                                    opacity: 0.5
                                                }}>{f}</Header>
                                            </View>
                                        })}
                                    </View>
                                </View>
                            })}
                        </ScrollView>
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

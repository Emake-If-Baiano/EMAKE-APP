import React, { useEffect, useState } from 'react'

import Background from '../../components/secondBackgrund';
import { ScrollView } from 'react-native';
import { View } from 'react-native';
import { Image } from 'react-native';

import { Linking } from 'react-native';

import { PrimaryButton } from 'react-native-onboard';

import * as Keychain from 'react-native-keychain';

import Header from '../../components/Header';

const b = PrimaryButton({ currentPage: 0, totalPages: 3, text: "oi" });

function button(...data) {
    data[0].text = data[0].text === "Continue" ? "Continuar" : "Iniciar!";
    data[0].style = {
        backgroundColor: "rgb(4, 252, 92)",
    };

    console.log(data[0])
    return PrimaryButton(...data)
};

import Login from '../../services/SUAP';

import { Dimensions } from 'react-native';

import AsyncStorage from '@react-native-async-storage/async-storage';

import { TouchableOpacity } from 'react-native';
import loading from '../loading';

import themes from "../../../temas";

export default function Notificações({ navigation }) {

    const [userData, setUserData] = useState(false);

    const [documents, setDocuments] = useState([]);

    const [theme, setTheme] = useState(false);

    useEffect(() => {
        AsyncStorage.getItem("theme").then(res => {
            setTheme(themes[res || "normal"].documentos);
        })

        AsyncStorage.getItem("userdata").then(data => {

            setUserData(JSON.parse(data));
        });

        AsyncStorage.getItem("documents").then(data => {
            if (data) {
                setDocuments(JSON.parse(data));
            }
        })
        AsyncStorage.getItem("userinfo").then(data => {
            const parse = JSON.parse(data);

            console.log(parse)
            Login.getFiles(parse.user, parse.password).then(res => {
                setDocuments(res.data);

                AsyncStorage.setItem("documents", JSON.stringify(res.data));
            })
        });
    }, [])

    if (!userData) return loading();

    if (!documents.length) return loading();

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
                    flex: 0.1,
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
                        alignItems: "flex-end",
                        flex: 1,
                    }}>
                        <Header customStyle={{
                            color: theme.primary,
                            width: "100%",
                            marginStart: "5%"
                        }}>Sair </Header>
                    </TouchableOpacity>
                </View>
                <ScrollView style={{
                    flex: 0.9,
                    backgroundColor: theme.background,
                    width: "100%",
                }}>
                    {[{
                        name: "Documentos",
                        image: require("../../../assets/documentos.png"),
                        backColor: "#00FF29",
                        textColor: "#225D62",
                        components: documents
                    }].map((ei, i) => {
                        console.log(ei)
                        return (
                            <View key={i}>
                                <View style={{
                                    flexDirection: "row",
                                    justifyContent: "center",
                                    alignItems: "center",
                                    marginTop: "5%"
                                }}>
                                    <Image
                                        style={{
                                            width: 50,
                                            height: 50,
                                            alignSelf: "center",
                                            marginStart: "3%"
                                        }}
                                        source={ei.image}
                                    />

                                    <Header style={{
                                        color: theme.header,
                                        fontSize: 20,
                                        fontWeight: "bold",
                                        marginStart: "1%"
                                    }}>
                                        {ei.name}
                                    </Header>
                                </View>

                                {ei.components.length ? ei.components.map((e, index) => {
                                    return (<TouchableOpacity key={index} style={{
                                        flex: 0.3,
                                        backgroundColor: index % 2 ? theme.primary : theme.secondary,
                                        width: "85%",
                                        alignSelf: index % 2 ? "flex-start" : "flex-end",
                                        borderRadius: 15,
                                        flexDirection: "row",
                                        marginTop: "10%",
                                        padding: "1%"
                                    }} onPress={() => {
                                        Linking.openURL("https://suap.ifbaiano.edu.br" + e.link)
                                    }}>
                                        <Header style={{
                                            color: theme.textColor,
                                            fontSize: e.nome.length > 30 ? 17 : 20,
                                            alignSelf: "center",
                                            fontWeight: "bold",
                                            marginStart: "5%",
                                            flex: 1
                                        }}>
                                            {e.nome}
                                        </Header>
                                    </TouchableOpacity>)
                                }) : <View>
                                    <Header customStyle={{
                                        color: "black",
                                        fontSize: 25,
                                        alignSelf: "center",
                                        fontWeight: "bold",
                                    }}>Carregando...</Header>
                                </View>}
                            </View>)
                    })}
                    {/* <Header style={{
                        flex: 0.05,
                        color: "#225D62",
                        fontSize: 20,
                        alignSelf: "center",
                    }}>
                        Dados Gerais
                    </Header>

                    <View style={{
                        flex: 0.1,
                        flexDirection: "row",
                        marginTop: "5%"
                    }}>
                        <Image
                            style={{
                                width: 50,
                                height: 50,
                                alignSelf: "center",
                                borderRadius: 40,
                                marginStart: "3%"
                            }}
                            source={{
                                uri: "https://suap.ifbaiano.edu.br/" + userData.url_foto_75x100
                            }}
                        />

                        <Header adjustsFontSizeToFit={true} customStyle={{
                            color: "#225D62",
                            fontSize: 17,
                            alignSelf: "center",
                            maxWidth: "80%",
                            marginStart: "3%"
                        }}>
                            {userData?.vinculo?.nome}
                        </Header>
                    </View>

                    <View style={{
                        flex: 0.1,
                        marginTop: "5%"
                    }}>
                        <View style={{
                            flex: 0.4,
                            backgroundColor: "#00FF29",
                            width: "40%",
                            borderTopEndRadius: 25,
                            borderBottomEndRadius: 25,
                        }}>
                            <Header customStyle={{
                                fontSize: 15,
                                color: "#225D62",
                                alignSelf: "center",
                                fontWeight: "bold"
                            }}>
                                Email Acadêmico
                            </Header>
                        </View>

                        <Header customStyle={{
                            fontSize: 15,
                            color: "#225D62",
                            alignSelf: "center",
                            flex: 0.6,
                            fontWeight: "bold"
                        }}>
                            {userData.email}
                        </Header>
                    </View>

                    <View style={{
                        flex: 0.1,
                        paddinTop: "10%"
                    }}>
                        <View style={{
                            flex: 0.4,
                            backgroundColor: "#00FF29",
                            width: "40%",
                            borderTopEndRadius: 25,
                            borderBottomEndRadius: 25,
                        }}>
                            <Header customStyle={{
                                fontSize: 15,
                                color: "#225D62",
                                alignSelf: "center",
                                fontWeight: "bold"
                            }}>
                                CPF
                            </Header>
                        </View>

                        <Header customStyle={{
                            fontSize: 15,
                            color: "#225D62",
                            alignSelf: "center",
                            flex: 0.6,
                            fontWeight: "bold"
                        }}>
                            {userData.cpf}
                        </Header>
                    </View>

                    <View style={{
                        flex: 0.1,
                        paddinTop: "10%"
                    }}>
                        <View style={{
                            flex: 0.4,
                            backgroundColor: "#00FF29",
                            width: "40%",
                            borderTopEndRadius: 25,
                            borderBottomEndRadius: 25,
                        }}>
                            <Header customStyle={{
                                fontSize: 15,
                                color: "#225D62",
                                alignSelf: "center",
                                fontWeight: "bold"
                            }}>
                                Situação Sistêmica
                            </Header>
                        </View>

                        <Header customStyle={{
                            fontSize: 15,
                            color: "#225D62",
                            alignSelf: "center",
                            flex: 0.6,
                            fontWeight: "bold"
                        }}>
                            {userData.vinculo?.situacao_sistemica}
                        </Header>
                    </View>

                    <View style={{
                        flex: 0.1,
                        paddinTop: "10%"
                    }}>
                        <View style={{
                            flex: 0.4,
                            backgroundColor: "#00FF29",
                            width: "40%",
                            borderTopEndRadius: 25,
                            borderBottomEndRadius: 25,
                        }}>
                            <Header customStyle={{
                                fontSize: 15,
                                color: "#225D62",
                                alignSelf: "center",
                                fontWeight: "bold"
                            }}>
                                Situação Sistêmica
                            </Header>
                        </View>

                        <Header customStyle={{
                            fontSize: 15,
                            color: "#225D62",
                            alignSelf: "center",
                            flex: 0.6,
                            fontWeight: "bold"
                        }}>
                            {userData.vinculo?.situacao_sistemica}
                        </Header>
                    </View> */}
                </ScrollView>
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

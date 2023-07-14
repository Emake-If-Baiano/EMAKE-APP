import React, { useEffect, useState } from 'react'

import Background from '../../components/secondBackgrund';
import { ScrollView } from 'react-native';
import { View } from 'react-native';
import { Image } from 'react-native';
import Header from '../../components/Header';

import * as Keychain from 'react-native-keychain';

import loading from "../loading";

import Login from '../../services/SUAP';

import { Dimensions } from 'react-native';

import AsyncStorage from '@react-native-async-storage/async-storage';

import { TouchableOpacity } from 'react-native';

import themes from '../../../temas';

export default function Notificações({ navigation }) {

    const [userData, setUserData] = useState(false);

    const [ira, setIra] = useState(0);

    const [theme, setTheme] = useState(false);

    function calcIRA(boletins) {
        console.log(boletins, "oi")
        const p1 = boletins
            .map((boletim) => {
                if (boletim.quantidade_avaliacoes === 4) {
                    return (
                        ((boletim.nota_etapa_1.nota * 2 +
                            boletim.nota_etapa_2.nota * 2 +
                            boletim.nota_etapa_3.nota * 3 +
                            boletim.nota_etapa_4.nota * 3) /
                            10) *
                        boletim.carga_horaria
                    )
                } else {
                    return (
                        ((boletim.nota_etapa_1.nota * 2 + boletim.nota_etapa_2.nota * 3) /
                            5) *
                        boletim.carga_horaria
                    )
                }
            })
            .reduce((a, b) => a + b, 0)
        const p2 = boletins
            .map((boletim) => boletim.carga_horaria)
            .reduce((a, b) => a + b, 0)

        return Number((p1 / p2).toFixed(2))
    };

    useEffect(() => {
        AsyncStorage.getItem("theme").then(res => {
            setTheme(themes[res || "normal"].dados);
        })

        AsyncStorage.getItem("userdata").then(data => {

            setUserData(JSON.parse(data));
        });

        AsyncStorage.getItem("boletim").then(res => {
            if (res) {
                const ira = calcIRA(JSON.parse(res));

                setIra(ira);
            }
        })
        AsyncStorage.getItem("userinfo").then(data => {
            const parse = JSON.parse(data);

            Login.getBoletim(parse.token).then(res => {

                if (!res) {
                    navigation.reset({
                        index: 0,
                        routes: [{ name: 'Login' }],
                    })
                    return;
                }
                const ira = calcIRA(res);
                setIra(ira);

            })
        })
        console.log(userData)
    }, [])

    if (!userData) return loading()

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
                    marginTop: "10%",
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
                        }}>Sair </Header>
                    </TouchableOpacity>
                </View>
                <ScrollView style={{
                    flex: 0.9,
                    backgroundColor: theme.background,
                    width: "100%",
                }}>
                    {[{
                        name: "Dados Gerais",
                        image: require("../../../assets/dados_gerais.png"),
                        backColor: theme.backColor_1,
                        textColor: theme.textColor_1,
                        components: [{
                            name: "Nome",
                            value: userData?.nome_usual,
                        }, {
                            name: "Email Acadêmico",
                            value: userData.email
                        }, {
                            name: "CPF",
                            value: userData.cpf
                        }, {
                            name: "Situação Sistêmica",
                            value: userData.vinculo?.situacao_sistemica
                        }]
                    }, {
                        name: "Dados acadêmicos",
                        image: require("../../../assets/dados_academicos.png"),
                        backColor: theme.backColor_2,
                        textColor: theme.textColor_2,
                        components: [{
                            name: "Matrícula",
                            value: userData.matricula
                        }, {
                            name: "Curso",
                            value: userData.vinculo.curso
                        }, {
                            name: "Campus",
                            value: userData.vinculo.campus
                        }, {
                            name: "I.R.A",
                            value: ira
                        }, {
                            name: "Vinculo",
                            value: userData.tipo_vinculo
                        }, {
                            name: "Currículo Lattes",
                            value: userData.vinculo.curriculo_lattes
                        }]
                    }].map((ei, i) => {
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
                                        color: theme.headerColor,
                                        fontSize: 20,
                                        fontWeight: "bold",
                                        marginStart: "1%"
                                    }}>
                                        {ei.name}
                                    </Header>
                                </View>

                                {ei.components.map((e, ina) => {
                                    return (
                                        <View style={{
                                            flex: 0.1,
                                            marginTop: "5%"
                                        }} key={ina}>

                                            {e.name === "Nome" ?
                                                (
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
                                                            color: theme.secondary,
                                                            fontSize: 17,
                                                            alignSelf: "center",
                                                            maxWidth: "80%",
                                                            marginStart: "3%"
                                                        }}>
                                                            {userData?.vinculo?.nome}
                                                        </Header>
                                                    </View>)
                                                :
                                                (
                                                    <View>
                                                        <View style={{
                                                            flex: 0.5,
                                                            backgroundColor: ei.backColor,
                                                            width: "40%",
                                                            borderTopEndRadius: 25,
                                                            borderBottomEndRadius: 25,

                                                        }}>
                                                            <Header customStyle={{
                                                                fontSize: 15.5,
                                                                color: ei.textColor,
                                                                alignSelf: "center",
                                                                fontWeight: "bold"
                                                            }}>
                                                                {e.name}
                                                            </Header>
                                                        </View>

                                                        <Header selectable={true} customStyle={{
                                                            fontSize: 15,
                                                            color: theme.headerColor,
                                                            flex: 0.6,
                                                            fontWeight: "bold",
                                                            marginStart: "5%",
                                                        }}>
                                                            {e.value}
                                                        </Header>
                                                    </View>
                                                )}
                                        </View>
                                    )
                                })}
                            </View>)
                    })}
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

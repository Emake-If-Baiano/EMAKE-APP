import React, { useEffect, useState } from 'react'

import Background from '../../components/secondBackgrund';
import { Text } from 'react-native';
import { View } from 'react-native';
import { Image } from 'react-native';

import { OnboardFlow, PrimaryButton } from 'react-native-onboard';

import TextInput from '../../components/TextInput';

import Logo from '../../components/Logo';

import Button from '../../components/Button';

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

export default function Notificações({ navigation }) {

    const [userData, setUserData] = useState({});

    useEffect(() => {
        AsyncStorage.getItem("userdata").then(data => {
            setUserData(JSON.parse(data));
        });

        console.log(userData)
    }, []);

    if (!userData) return null;

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
                            navigation.navigate("Login");
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
                    backgroundColor: "white",
                    width: "100%",
                }}>
                    <View style={{
                        flex: 0.05
                    }}>

                    </View>
                    <View style={{
                        flex: 0.3,
                        width: "100%",
                        justifyContent: "center",
                        alignItems: "center",
                    }}>
                        <Image
                            style={{
                                width: 100,
                                height: 100,
                                alignSelf: "center",
                                borderRadius: 50,
                                marginStart: "3%",
                            }}
                            source={{
                                uri: "https://suap.ifbaiano.edu.br/" + userData.url_foto_75x100
                            }}
                        />

                        <Header customStyle={{
                            color: "#225D62",
                            fontSize: 20,
                            maxWidth: "100%",
                            textAlign: "center",
                            alignSelf: "center",
                            fontWeight: "bold"
                        }}>
                            {userData.vinculo?.nome}
                        </Header>

                        <Header selectable={true} customStyle={{
                            marginTop: "1%",
                            color: "#225D62",
                            fontSize: 14,
                            maxWidth: "70%",
                            textAlign: "center",
                            alignSelf: "center",
                        }}>
                            {userData.matricula}
                        </Header>
                    </View>

                    <View style={{
                        flex: 0.7,
                        justifyContent: "space-evenly",
                        alignItems: "center",
                    }}>
                        {[{
                            name: "Meus Dados",
                            image: require("../../../assets/meus_dados.png"),
                            color: "rgb(196, 212, 236)",
                            touch: () => navigation.navigate("Dados")
                        }, {
                            name: "Documentos",
                            image: require("../../../assets/documentos.png"),
                            color: "rgb(204, 220, 220)",
                            touch: () => navigation.navigate("Perfil")
                        }].map((category, index) => {
                            return (
                                <TouchableOpacity key={index} style={{
                                    flexDirection: "row",
                                    backgroundColor: category.color,
                                    width: "100%",
                                    flex: 0.2,
                                    opacity: 1,
                                    justifyContent: "space-evenly",
                                    alignItems: "center",
                                }} onPress={category.touch}>
                                    <Image
                                        style={{
                                            width: 50,
                                            height: 50,
                                            alignSelf: "center",
                                        }}
                                        source={category.image}
                                    />

                                    <Header customStyle={{
                                        color: "#225D62",
                                        fontSize: 20,
                                        opacity: 1
                                    }}>
                                        {category.name}
                                    </Header>
                                </TouchableOpacity>)
                        })}
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

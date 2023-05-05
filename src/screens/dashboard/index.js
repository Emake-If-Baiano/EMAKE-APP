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
import { Linking } from 'react-native';

import { AnimatedCircularProgress } from 'react-native-circular-progress';

import AsyncStorage
    from '@react-native-async-storage/async-storage';
import { TouchableOpacity } from 'react-native-gesture-handler';

// import CircularProgress from 'react-native-circular-progress-indicator';

export default function StartScreen({ navigation }) {

    const [userInfo, setUserInfo] = useState({});

    const [userData, setUserData] = useState({});

    const [boletim, setBoletim] = useState([]);

    const [percent, setPercent] = useState(0);

    useEffect(() => {
        AsyncStorage.getItem("userinfo").then(res => {
            const data = JSON.parse(res);
            console.log(res);
            setUserInfo(data);

            if (!userData.nome_usual) Login.getUserData(data.token).then(resData => {
                setUserData(resData);
                console.log(resData);
            });

            if (!boletim.length || !percent) Login.getBoletim(data.token).then(resData => {
                setBoletim(resData);

                setPercent(100 / (resData.reduce((a, b) => a + Number(b.carga_horaria_cumprida), 0)) * (boletim.reduce((a, b) => a + Number(b.carga_horaria_cumprida), 0) - boletim.reduce((a, b) => a + Number(b.numero_faltas), 0)));
            });
        })
    }, [])

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
                    flex: 0.3,
                    width: "100%",
                    justifyContent: "center",
                }}>
                    <TouchableOpacity style={{
                        width: "100%",
                        alignItems: "flex-end",
                        justifyContent: "center",
                    }}>
                        <Image
                            style={{
                                width: "20%",
                                height: "60%",
                            }}
                            source={require("../../../assets/share.png")} />
                    </TouchableOpacity>

                    <View style={{
                        flex: 0.6,
                        flexDirection: "row",
                        justifyContent: "space-around",
                    }}>
                        <Header customStyle={{
                            color: "#00FF29",
                            fontSize: 22,
                            flex: 0.7,
                            alignSelf: "center"
                        }}>
                            Olá, {userData.nome_usual}
                        </Header>

                        <TouchableOpacity style={{
                            alignItems: "center",
                            justifyContent: "center",
                            flexDirection: "column",
                        }}>
                            <Image
                                style={{
                                    width: 50,
                                    height: 50,
                                    alignSelf: "flex-end"
                                }}
                                source={require("../../../assets/perfil.png")} />

                            <Header customStyle={{
                                fontSize: 14,
                                color: "#00FF29",
                                alignSelf: "center"
                            }}>Perfil</Header>
                        </TouchableOpacity>
                    </View>
                </View>

                <View style={{
                    flex: 0.7,
                    backgroundColor: "white",
                    borderTopEndRadius: 40,
                    borderTopStartRadius: 40,
                    width: "95%",
                    alignSelf: "flex-start",
                    justifyContent: "space-evenly",
                }}>
                    <View style={{
                        flex: 0.3,
                        backgroundColor: "#00FF29",
                        width: "90%",
                        alignSelf: "center",
                        borderRadius: 15,
                        justifyContent: "center",
                        paddingStart: "2%"
                    }}>

                        <AnimatedCircularProgress
                            size={120}
                            width={15}
                            fill={percent}
                            tintColor="#004AAD"
                            backgroundColor="white"
                            lineCap="round"
                            rotation={180}
                            duration={4500}
                        >
                            {(fill) => (
                                <Header customStyle={{
                                    fontSize: 21,
                                    color: "#004AAD",
                                    alignSelf: "center",
                                    fontWeight: "bold"
                                }}>
                                    {Math.floor(fill)}%
                                </Header>
                            )
                            }
                        </AnimatedCircularProgress>
                    </View>

                    <View style={{
                        flex: 0.15,
                        backgroundColor: "#00FF29",
                        width: "60%",
                        alignContent: "stretch"
                    }}>

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

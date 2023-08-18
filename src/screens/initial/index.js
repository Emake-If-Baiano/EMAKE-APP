import React, { useEffect, useState } from 'react'

import { Background } from '../../components';
import { Text } from 'react-native';
import { View } from 'react-native';
import { Image } from 'react-native';

import { OnboardFlow, PrimaryButton } from 'react-native-onboard';

import * as Notifications from 'expo-notifications';
import Header from '../../components/Header';

function button(...data) {
    data[0].text = data[0].text === "Continue" ? "Continuar" : "Iniciar!";
    data[0].style = {
        backgroundColor: "rgb(4, 252, 92)",
    };
    return PrimaryButton(...data)
}


export default function StartScreen({ navigation }) {

    const [index, setIndex] = useState(0);

    useEffect(() => {
        setIndex(0);
    }, []);

    return (
        <Background>
            <View style={{
                flex: 1,
                justifyContent: "center",
                alignItems: "center",
            }}>
                <View style={{
                    flex: 0.1
                }}>

                </View>

                {index === 0 && <View style={{
                    flex: 0.20,
                    width: "100%",
                }}>
                    <Image style={{
                        resizeMode: "contain",
                        width: "100%",
                        height: "100%",
                    }} source={require("../../../assets/logo_if.png")}>

                    </Image>
                </View>}

                {index === 0 && <View style={{
                    flex: 0.2,
                    justifyContent: "center",
                    alignItems: "center",
                }}>
                    <Header customStyle={{
                        fontSize: 30,
                        fontWeight: 'bold',
                        alignSelf: 'center',
                        color: "white"
                    }}>
                        Bem vindo ao
                    </Header>

                    <Header customStyle={{
                        fontSize: 30,
                        fontWeight: 'bold',
                        alignSelf: 'center',
                        color: "white"
                    }}>
                        EMAKE IF Baiano!
                    </Header>
                </View>}

                {index !== 0 && <View style={{
                    flex: 0.3,
                    width: "100%"
                }}>
                    <Image style={{
                        resizeMode: "contain",
                        width: "100%",
                        height: "100%",
                    }} source={require("../../../assets/logo.png")}>

                    </Image>
                </View>}


                <View style={index === 0 ? {
                    flex: 0.65,
                    alignItems: 'center',
                    borderRadius: 35,
                } : {
                    flex: 0.65,
                    alignItems: 'center',
                    borderRadius: 35,
                }}>

                    <OnboardFlow
                        primaryColor="rgb(4, 252, 92)"
                        secondaryColor='rgb(4, 252, 92)'
                        backgroundColor="transparent"
                        onDone={() => {
                            navigation.reset({
                                index: 0,
                                routes: [{ name: 'Login' }],
                            })
                        }}
                        onNext={() => {
                            if (index === 2) {
                                console.log("SETTING - 1");

                                console.log(index);

                                setIndex(i => i - 1);

                                return;
                            }

                            console.log("SETTING + 1");

                            console.log(index);

                            setIndex(i => i + 1)
                        }}
                        onBack={() => {
                            if (index === 0) return;

                            console.log("SETTING - 1");

                            console.log(index);

                            setIndex(i => i - 1)
                        }}
                        PrimaryButtonComponent={button}
                        paginationSelectedColor='rgb(4, 252, 92)'
                        pages={[
                            {
                                imageComponent: <Image style={{
                                    resizeMode: "contain",
                                    width: "90%",
                                    height: "90%",
                                }} source={require("../../../assets/first.png")} />
                            },
                            {
                                imageComponent: <Image style={{
                                    resizeMode: "contain",
                                    width: "90%",
                                    height: "90%",
                                }} source={require("../../../assets/second.png")} />,
                            },
                            {
                                imageComponent: <Image style={{
                                    resizeMode: "contain",
                                    width: "90%",
                                    height: "90%",
                                }} source={require("../../../assets/three.png")} />,
                            }
                        ]}
                        type='inline'
                    />
                </View>
            </View>

        </Background>
    )
};

const styles = {
    logo_container: {
        width: "100%",
        height: 150,
    },
    logo_image: {
        width: "90%",
        height: 150,
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
        flex: 1,
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

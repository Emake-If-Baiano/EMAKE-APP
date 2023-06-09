import React, { useEffect, useState } from 'react'

import { Background } from '../../components';
import { Text } from 'react-native';
import { View } from 'react-native';
import { Image } from 'react-native';

import { OnboardFlow, PrimaryButton } from 'react-native-onboard';

import * as Notifications from 'expo-notifications';

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
                {index === 0 && <View style={styles.logo}>

                </View>}
                {index === 0 && <View style={styles.logo}>

                </View>}

                {index === 0 && <View style={styles.logo_if_container}>
                    <Image style={styles.logo_if_image} source={require("../../../assets/logo_if.png")}>

                    </Image>
                </View>}

                {index === 0 && <View style={styles.logo_text_container}>
                    <Text style={styles.logo_text_text}>
                        Bem vindo ao
                    </Text>
                    <Text style={styles.logo_text_text}>
                        EMake IF BAIANO!
                    </Text>
                </View>}

                {index !== 0 && <View style={styles.logo_if_container}>
                    <Text></Text>
                </View>}

                {index !== 0 && <View style={styles.logo_container}>
                    <Image style={styles.logo_image} source={require("../../../assets/logo.png")}>

                    </Image>
                </View>}


                <View style={index === 0 ? styles.image_container : styles.image_container_2}>

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
                                imageUri: Image.resolveAssetSource(require("../../../assets/first.png")).uri,
                            },
                            {
                                imageUri: Image.resolveAssetSource(require("../../../assets/second.png")).uri,
                            },
                            {
                                imageUri: Image.resolveAssetSource(require("../../../assets/three.png")).uri,
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
        height: 150
    },
    logo_image: {
        width: "100%",
        height: 220,
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

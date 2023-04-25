import React, { useEffect, useState } from 'react'

import { Background } from '../../components';
import { Text } from 'react-native';
import { View } from 'react-native';
import { Image } from 'react-native';

import { OnboardFlow, PrimaryButton } from 'react-native-onboard';

const b = PrimaryButton({ currentPage: 0, totalPages: 3, text: "oi" });

function button(...data) {
    data[0].text = data[0].text === "Continue" ? "Continuar" : "Iniciar!";
    data[0].style = {
        backgroundColor: "rgb(4, 252, 92)",
    };

    console.log(data[0])
    return PrimaryButton(...data)
}

export default function StartScreen({ navigation }) {

    const [index, setIndex] = useState("Sim");

    useEffect(() => {
        setIndex("Sim")
    }, []);

    return (
        <Background>
            {index === "Sim" && <View style={styles.logo}>

            </View>}

            {index === "Sim" && <View style={styles.logo_if_container}>
                <Image style={styles.logo_if_image} source={require("../../../assets/logo_if.png")}>

                </Image>
            </View>}

            {index === "Sim" && <View style={styles.logo_text_container}>
                <Text style={styles.logo_text_text}>
                    Bem vindo ao
                </Text>
                <Text style={styles.logo_text_text}>
                    EMake IF BAIANO!
                </Text>
            </View>}

            {index !== "Sim" && <View style={styles.logo_if_container}>
                <Text></Text>
            </View>}

            {index !== "Sim" && <View style={styles.logo_container}>
                <Image style={styles.logo_image} source={require("../../../assets/logo.png")}>

                </Image>
            </View>}


            <View style={index === "Sim" ? styles.image_container : styles.image_container_2}>

                <OnboardFlow
                    primaryColor="rgb(4, 252, 92)"
                    secondaryColor='rgb(4, 252, 92)'
                    backgroundColor="transparent"
                    onNext={() => setIndex(index + 1)}
                    PrimaryButtonComponent={button}
                    paginationSelectedColor='rgb(4, 252, 92)'
                    pages={[
                        {
                            imageUri: 'https://media.discordapp.net/attachments/1091540686777634826/1099115171470917702/first.png',
                        },
                        {
                            imageUri: 'https://media.discordapp.net/attachments/1091540686777634826/1099115381446164480/second.png'
                        },
                        {
                            imageUri: 'https://media.discordapp.net/attachments/1091540686777634826/1099115477059514570/three.png'
                        }
                    ]}
                    type='inline' // Change to either 'fullscreen', 'bottom-sheet', or 'inline'
                />
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

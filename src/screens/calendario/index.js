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

import AsyncStorage from '@react-native-async-storage/async-storage';

import { TouchableOpacity } from 'react-native-gesture-handler';

// import CircularProgress from 'react-native-circular-progress-indicator';

export default function Calendario({ navigation }) {
    return (
        <Background navigation={navigation}>
            <View style={{
                flex: 1,
                justifyContent: "center",
                alignItems: "center"
            }}>
                <Header>Em desenvolvimento</Header>
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

import React, { useEffect, useState } from 'react'

import { Background } from '../../components';
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

export default function StartScreen({ navigation }) {

    const [index, setIndex] = useState("Sim");

    const [user, setUser] = useState({ value: '', error: '' })

    const [password, setPassword] = useState({ value: '', error: '' });

    const [showPassword, setShowPassword] = useState(false);

    const tryLogin = (user, password) => {
        console.log(user, password)
        Login(user, password).then(console.log)
    }
    useEffect(() => {
        setIndex("Sim")
    }, []);

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
                <Header>Ainda n fiz a partir daqui</Header>
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

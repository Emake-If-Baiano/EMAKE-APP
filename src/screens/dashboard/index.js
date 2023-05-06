import React, { useEffect, useState } from 'react'

import Background from '../../components/secondBackgrund';
import { Share } from 'react-native';
import { View } from 'react-native';
import { Image } from 'react-native';

import Header from '../../components/Header';

import Login from '../../services/SUAP';

import { Dimensions } from 'react-native';

import { AnimatedCircularProgress } from 'react-native-circular-progress';

import AsyncStorage
    from '@react-native-async-storage/async-storage';
import { TouchableOpacity } from 'react-native';

import { LinearGradient } from 'expo-linear-gradient';

export default function StartScreen({ navigation }) {

    const [userData, setUserData] = useState({});

    const [boletim, setBoletim] = useState([]);

    const [percent, setPercent] = useState(0);

    const [periodo, setPeriodo] = useState({
        ano: "2021",
        semestre: "2"
    });

    useEffect(() => {
        AsyncStorage.getItem("userinfo").then(res => {
            const data = JSON.parse(res);

            if (!userData.nome_usual) Login.getUserData(data.token).then(resData => {

                AsyncStorage.setItem("userdata", JSON.stringify(resData));

                setUserData(resData);
                console.log(resData);
            });

            if (!boletim.length || !percent) Login.getBoletim(data.token).then(resData => {
                console.log("GETTING")
                console.log(boletim.length, percent)
                setBoletim(resData);

                setPercent(100 / (resData.reduce((a, b) => a + Number(b.carga_horaria_cumprida), 0)) * (resData.reduce((a, b) => a + Number(b.carga_horaria_cumprida), 0) - resData.reduce((a, b) => a + Number(b.numero_faltas), 0)));
            });

            if (periodo.ano === "2021") Login.obterPeriodoLetivo(data.token).then(resData => {
                let last = resData.reverse()[1] || resData[0];

                AsyncStorage.setItem('periodo', JSON.stringify({
                    ano: last.ano_letivo,
                    semestre: last.periodo_letivo
                }));
                
                setPeriodo({
                    ano: last.ano_letivo,
                    semestre: last.periodo_letivo
                })
            });

            console.log(userData)
            console.log(`https://suap.ifbaiano.edu.br${userData.url_foto_150x200}`)
        })
    }, []);

    if (percent === 0) return null;

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
                    flex: 0.25,
                    width: "100%",
                    justifyContent: "center",
                }}>
                    <TouchableOpacity style={{
                        width: "100%",
                        alignItems: "flex-end",
                        justifyContent: "center",
                    }} onPress={() => {
                        Share.share({
                            title: "EMAKE - IF BAIANO - TEIXEIRA DE FREITAS",
                            message: `Olá! Estou compartilhando com você o novo aplicativo de SUAP do IF BAIANO - TEIXEIRA DE FREITAS!\n\nBaixe agora mesmo em: https://play.google.com/store/apps/details?id=com.srwhale.EMAKE&hl=en-US&ah=rdzPvCISrGg_fmGcIUtxnYPdsjk`
                        })
                    }}>
                        <Image
                            style={{
                                width: "16%",
                                height: "45%",
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
                            Olá, {userData.nome_usual}!
                        </Header>

                        <TouchableOpacity style={{
                            alignItems: "center",
                            justifyContent: "center",
                            flexDirection: "column",
                        }} onPress={() => {
                            navigation.navigate("Perfil");
                        }}>
                            <Image
                                style={{
                                    width: 50,
                                    height: 50,
                                    alignSelf: "flex-end",
                                    borderRadius: 40,
                                }}
                                source={{
                                    uri: `https://suap.ifbaiano.edu.br${userData.url_foto_150x200}`
                                }} />

                            <Header customStyle={{
                                fontSize: 14,
                                color: "#00FF29",
                                alignSelf: "center"
                            }}>Perfil</Header>
                        </TouchableOpacity>
                    </View>
                </View>

                <View style={{
                    flex: 0.75,
                    backgroundColor: "white",
                    borderTopEndRadius: 40,
                    borderTopStartRadius: 40,
                    width: "100%",
                    alignSelf: "flex-start",
                    justifyContent: "space-evenly",
                }}>
                    <View style={{
                        flex: 0.3,
                        backgroundColor: "#00FF29",
                        width: "90%",
                        alignSelf: "flex-end",
                        marginEnd: 20,
                        borderRadius: 15,
                        paddingStart: "2%",
                        justifyContent: "center"
                    }}>
                        <Header customStyle={{
                            flex: 0.2,
                            color: "#225D62",
                            fontSize: 17,
                            alignSelf: "center",
                            fontWeight: "bold"
                        }}>
                            Progresso Anual
                        </Header>
                        <View
                            style={{
                                flex: 0.7,
                                width: "95%",
                                borderRadius: 15,
                                alignSelf: "center",
                                alignItems: "center",
                                flexDirection: "row",
                                justifyContent: "space-around",
                                backgroundColor: "transparent"
                            }}>

                            <AnimatedCircularProgress
                                size={100}
                                width={15}
                                fill={percent}
                                tintColor="#004AAD"
                                backgroundColor="white"
                                lineCap="round"
                                rotation={180}
                                duration={3000}>
                                {(fill) => (
                                    <Header customStyle={{
                                        fontSize: 21,
                                        color: "#004AAD",
                                        alignSelf: "center",
                                        fontWeight: "bold"
                                    }}>
                                        {Math.floor(fill)}%
                                    </Header>
                                )}
                            </AnimatedCircularProgress>

                            <View style={{
                                flex: 0.9,
                                flexDirection: "column",
                                justifyContent: "space-evenly",
                                alignItems: "center",
                                alignSelf: "auto"
                            }}>
                                <Header customStyle={{
                                    fontSize: 17,
                                    color: "#225D62",
                                    fontWeight: "bold",
                                    width: "100%",
                                }}>Ano Letivo - {periodo.ano}.{periodo.semestre}</Header>

                                <Header customStyle={{
                                    fontSize: 17,
                                    color: "#225D62",
                                    fontWeight: "bold",
                                    width: "100%"
                                }}>Aulas restantes: {boletim.reduce((a, b) => a + Number(b.carga_horaria), 0) - boletim.reduce((a, b) => a + Number(b.carga_horaria_cumprida), 0)} </Header>
                            </View>
                        </View>
                    </View>

                    {[{
                        name: "Boletim",
                        image: require("../../../assets/paginas.png"),
                    }, {
                        name: "Calendário Acadêmico",
                        image: require("../../../assets/calendário.png"),
                    }, {
                        name: "Minhas Turmas",
                        image: require("../../../assets/pessoas.png"),
                    }, {
                        name: "Notícias",
                        image: require("../../../assets/celular.png"),
                    }, {
                        name: "Notícias",
                        image: require("../../../assets/celular.png"),
                    }].map((category, index) => {
                        return (<TouchableOpacity key={index} style={{
                            flex: 0.1,
                            backgroundColor: index % 2 ? "#00FF29" : "#004AAD",
                            width: "60%",
                            alignSelf: index % 2 ? "flex-start" : "flex-end",
                            marginEnd: index % 2 ? 0 : 20,
                            marginStart: index % 2 ? 20 : 0,
                            borderRadius: 15,
                            flexDirection: "row"
                        }}>
                            <Image
                                style={{
                                    width: "25%",
                                    height: "85%",
                                    alignSelf: "center",
                                    marginStart: "5%"
                                }}
                                source={category.image}
                            />

                            <Header style={{
                                color: index % 2 ? "#225D62" : "#00FF12",
                                fontSize: 17,
                                alignSelf: "center",
                                fontWeight: "bold",
                                marginStart: "5%",
                                flex: 1
                            }}>
                                {category.name}
                            </Header>
                        </TouchableOpacity>)
                    })}
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

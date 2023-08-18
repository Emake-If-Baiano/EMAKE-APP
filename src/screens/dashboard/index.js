import React, { useEffect, useState } from 'react'

import Background from '../../components/secondBackgrund';
import { ImageBackground, Linking, Share } from 'react-native';
import { View } from 'react-native';
import { Image } from 'react-native';

import Header from '../../components/Header';

import Login from '../../services/SUAP';

import { Dimensions } from 'react-native';

import { AnimatedCircularProgress } from 'react-native-circular-progress';

import AsyncStorage
    from '@react-native-async-storage/async-storage';
import { TouchableOpacity } from 'react-native';

import loading from '../loading';

import themes from "../../../temas";
import { useFocusEffect } from '@react-navigation/native';
import { Modal } from 'react-native';

export default function StartScreen({ navigation }) {
    const [userData, setUserData] = useState({});

    const [boletim, setBoletim] = useState([]);

    const [percent, setPercent] = useState(0);

    const [periodo, setPeriodo] = useState({
        ano: "2021",
        semestre: "2"
    });

    const [theme, setTheme] = useState(false);

    const [noticies, setNoticies] = useState([]);

    const [noticieIndex, setNoticieIndex] = useState(0);

    const [themeName, setThemeName] = useState("normal");
    useFocusEffect(
        React.useCallback(() => {
            AsyncStorage.getItem("theme").then(res => {
                setTheme(themes[res || "normal"].dashboard);

                setThemeName(res || "normal");
            })

            return () => {

            };
        }, [])
    );

    useEffect(() => {
        AsyncStorage.getItem("theme").then(res => {
            setTheme(themes[res || "normal"].dashboard);

            setThemeName(res || "normal");
        });

        AsyncStorage.getItem("userdata").then(res => {
            if (res) {
                setUserData(JSON.parse(res));
            }
        });

        AsyncStorage.getItem("boletim").then(res => {
            if (res) {
                console.log("SETTING BOLETIM")
                setBoletim(JSON.parse(res));
            }
        });

        AsyncStorage.getItem("percent").then(res => {
            if (res) {
                console.log("SETTING PERCENT", res)
                setPercent(Number(res));
            }
        });

        AsyncStorage.getItem("periodo").then(res => {
            if (res) {
                console.log("SETTING PERIODO")
                setPeriodo(JSON.parse(res))
            }
        });

        AsyncStorage.getItem("userinfo").then(resD => {
            if (!resD) return navigation.reset({
                index: 0,
                routes: [{ name: 'Login' }],
            })
            const p = JSON.parse(resD);

            Login.Login(p.user, p.password).then(res => {
                const data = res;
                data.token = data.access;

                AsyncStorage.setItem("userinfo", JSON.stringify({
                    user: p.user,
                    password: p.password,
                    token: data.access,
                }))
                if (!data.token) return navigation.reset({
                    index: 0,
                    routes: [{ name: 'Login' }],
                })

                if (!userData.nome_usual) Login.getUserData(data.token).then(resData => {

                    AsyncStorage.setItem("userdata", JSON.stringify(resData));

                    if (!noticies.find(n => n.nome)) Login.obterNoticias(resData.vinculo.campus).then(res => {
                        setNoticies(res);

                        AsyncStorage.setItem("noticias", JSON.stringify(res));

                        setInterval(() => {
                            setNoticieIndex(nou => nou === 2 ? 0 : nou + 1);
                        }, 8500)
                    })

                    setUserData(resData);
                });

                if (periodo.ano === "2021") Login.obterPeriodoLetivo(data.token).then(async resData => {
                    for (const i of resData.reverse()) {
                        const check = await new Promise((reso) => {
                            Login.getBoletim(data.token, i.ano_letivo, i.periodo_letivo).then(resDataB => {
                                console.log(resDataB)
                                if (resDataB.length) {
                                    AsyncStorage.setItem('boletim', JSON.stringify(resDataB));

                                    AsyncStorage.setItem("percent", `${100 / (resDataB.reduce((a, b) => a + Number(b.carga_horaria_cumprida), 0)) * (resDataB.reduce((a, b) => a + Number(b.carga_horaria_cumprida), 0) - resDataB.reduce((a, b) => a + Number(b.numero_faltas), 0))}`)

                                    setBoletim(resDataB);

                                    setPercent(100 / (resDataB.reduce((a, b) => a + Number(b.carga_horaria_cumprida), 0)) * (resDataB.reduce((a, b) => a + Number(b.carga_horaria_cumprida), 0) - resDataB.reduce((a, b) => a + Number(b.numero_faltas), 0)));

                                    setPeriodo({
                                        ano: i.ano_letivo,
                                        semestre: i.periodo_letivo
                                    });

                                    AsyncStorage.setItem('periodo', JSON.stringify({
                                        ano: i.ano_letivo,
                                        semestre: i.periodo_letivo
                                    }));

                                    reso(true)
                                } else reso(false);
                            })
                        });

                        if (check) break;
                    }
                });

            }).catch(Err => {
                console.log(Err, "suamaeeee")
            })
        })
    }, []);

    if (percent === 0) return loading();

    if (!userData.nome_usual) return loading();

    if (!theme) return loading();

    return (
        <Background navigation={navigation} changeTheme={themeName}>
            <Modal
                visible={userData.tipo_vinculo === "Aluno" ? false : true}
                animationType="slide"
                transparent={true}
            >
                <View style={{
                    flex: 1,
                    justifyContent: "center",
                    alignItems: "center",
                    backgroundColor: "rgba(0,0,0,0.5)"
                }}>
                    <View style={{
                        flex: 0.3,
                        width: "90%",
                        backgroundColor: theme.background,
                        borderRadius: 15,
                        justifyContent: "center",
                        alignItems: "center",
                    }}>
                        <Header customStyle={{
                            color: theme.textColor,
                            fontSize: 22,

                        }}>
                            Acesso negado: Aplicativo disponível apenas para alunos. {userData.tipo_vinculo}
                        </Header>
                    </View>

                </View>
            </Modal>
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
                            message: `Olá! Estou compartilhando com você o novo aplicativo de SUAP do IF BAIANO - TEIXEIRA DE FREITAS!\n\nBaixe agora mesmo em: https://play.google.com/store/apps/details?id=com.srwhale.EMAKE`
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
                            color: theme.textColor,
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
                                color: theme.textColor,
                                alignSelf: "center"
                            }}>Perfil</Header>
                        </TouchableOpacity>
                    </View>
                </View>

                <View style={{
                    flex: 0.75,
                    backgroundColor: theme.background,
                    borderTopEndRadius: 40,
                    borderTopStartRadius: 40,
                    width: "100%",
                    alignSelf: "flex-start",
                    justifyContent: "space-evenly",
                }}>
                    <View style={{
                        flex: 0.3,
                        backgroundColor: theme.background,
                        width: "90%",
                        alignSelf: "flex-end",
                        marginEnd: 20,
                        borderRadius: 15,
                        paddingStart: "2%",
                        justifyContent: "center"
                    }}>
                        <Header customStyle={{
                            flex: 0.2,
                            color: theme.textColor,
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
                                backgroundColor: theme.primary
                            }}>

                            <AnimatedCircularProgress
                                size={100}
                                width={15}
                                fill={percent}
                                tintColor={theme.secondary}
                                backgroundColor={theme.fillColor}
                                lineCap="round"
                                rotation={180}
                                duration={3000}>
                                {(fill) => (
                                    <Header customStyle={{
                                        fontSize: 21,
                                        color: theme.secondary,
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
                                alignSelf: "auto",
                                paddingStart: "10%"
                            }}>
                                <Header customStyle={{
                                    fontSize: 15,
                                    color: theme.periodColor,
                                    fontWeight: "bold",
                                    width: "100%",
                                }}>Ano Letivo - {periodo.ano}.{periodo.semestre}</Header>

                                <Header customStyle={{
                                    fontSize: 15,
                                    color: theme.periodColor,
                                    fontWeight: "bold",
                                    width: "100%"
                                }}>Aulas restantes: {boletim.reduce((a, b) => a + Number(b.carga_horaria), 0) - boletim.reduce((a, b) => a + Number(b.carga_horaria_cumprida), 0)} </Header>
                            </View>
                        </View>
                    </View>

                    {[{
                        name: "Boletim",
                        image: require("../../../assets/paginas.png"),
                        navigate: () => navigation.navigate("Boletim")
                    }, {
                        name: "Calendário Acadêmico",
                        image: require("../../../assets/calendário.png"),
                        navigate: () => navigation.navigate("Calendario")
                    }, {
                        name: "Minhas Turmas",
                        image: require("../../../assets/pessoas.png"),
                        navigate: () => navigation.navigate("Turmas")
                    }].map((category, index) => {
                        return (<TouchableOpacity key={index} style={{
                            flex: 0.1,
                            backgroundColor: index % 2 ? theme.primary : theme.secondary,
                            width: "60%",
                            alignSelf: index % 2 ? "flex-start" : "flex-end",
                            marginEnd: index % 2 ? 0 : 20,
                            marginStart: index % 2 ? 20 : 0,
                            borderRadius: 15,
                            flexDirection: "row"
                        }} onPress={() => {
                            if (category.navigate) category.navigate()
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
                                color: index % 2 ? theme.secondTextColor : theme.firstTextColor,
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

                    {noticieIndex >= 0 ? noticies.length > 1 && <View style={{
                        flex: 0.3,
                        width: "75%",
                        justifyContent: "center",
                        alignSelf: "center",
                        borderRadius: 15,
                    }}>
                        <ImageBackground onPress={() => {
                            console.log("YA")
                        }} source={{
                            uri: noticies[noticieIndex]?.link
                        }} style={{
                            flex: 1,
                            width: "100%",
                            justifyContent: "flex-end",
                            alignItems: "center",
                        }} imageStyle={{
                            borderRadius: 15
                        }}>
                            <View style={{
                                flex: 0.5,
                                width: "100%",
                                flexDirection: "row",
                            }}>
                                <TouchableOpacity style={{
                                    flex: 0.5,
                                    justifyContent: "flex-end",
                                    width: "100%",
                                }} onPress={() => {
                                    setNoticieIndex(nou => nou === 0 ? 2 : nou - 1);
                                }}>
                                    <Header customStyle={{
                                        fontSize: 35,
                                        fontWeight: "bold",
                                        marginStart: "5%",
                                        alignSelf: "flex-start",
                                    }}>
                                        {"<"}
                                    </Header>
                                </TouchableOpacity>

                                <TouchableOpacity onPress={() => {
                                    setNoticieIndex(nou => nou === 2 ? 0 : nou + 1);
                                }} style={{
                                    flex: 0.5,
                                    justifyContent: "flex-end",
                                    width: "100%",
                                }}>
                                    <Header customStyle={{
                                        fontSize: 35,
                                        fontWeight: "bold",
                                        marginEnd: "5%",
                                        alignSelf: "flex-end",
                                        textAlign: "right",
                                    }}>
                                        {">"}
                                    </Header>
                                </TouchableOpacity>
                            </View>
                            <TouchableOpacity onPress={() => {
                                Linking.openURL(noticies[noticieIndex].site)
                            }} style={{
                                flex: 0.5,
                                width: "100%",
                                justifyContent: "flex-end",
                                alignItems: "center",

                            }}>
                                <Header style={{
                                    fontSize: 16,
                                    color: "white",
                                    marginBottom: "5%",
                                    maxWidth: "95%",
                                }}>
                                    {noticies[noticieIndex] ? noticies[noticieIndex].nome : "Carregando..."}
                                </Header>
                            </TouchableOpacity>
                        </ImageBackground>
                    </View> : ""}
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

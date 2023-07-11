import React, { useEffect, useState } from 'react'

import Background from '../../components/secondBackgrund';
import { Modal, Switch, Text } from 'react-native';
import { View } from 'react-native';
import { Image } from 'react-native';

import { PrimaryButton } from 'react-native-onboard';

import * as Keychain from 'react-native-keychain';

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
import loading from '../loading';

export default function Configuracoes({ navigation }) {

    const [userData, setUserData] = useState(false);

    const [credentials, setCredentials] = useState({});

    const [darkMode, setDarkMode] = useState(false);

    const [visible, setVisible] = useState(false);

    useEffect(() => {
        AsyncStorage.getItem("darkmode").then(data => {
            if (data) {
                setDarkMode(JSON.parse(data).status)
            }
        });

        AsyncStorage.getItem("userinfo").then(data => {
            if (data) {
                setCredentials(JSON.parse(data));
                Login.obterConfig(JSON.parse(data).user, JSON.parse(data).password).then(dataR => {
                    setUserData(dataR);
                })
            }
        });
    }, []);

    async function postUpdate(data) {
        Login.updateConfig(credentials.user, credentials.password, {
            [data]: data
        })
    }

    if (!credentials) return loading();

    if (!userData) return loading();

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
                            AsyncStorage.removeItem("userdata").then(() => {
                                Keychain.resetGenericPassword().then(() => {
                                    AsyncStorage.removeItem("darkmode");

                                    navigation.navigate("Login");
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
                        flexDirection: "row",
                        justifyContent: "center",
                        alignItems: "center",
                        flex: 0.15,
                        width: "100%",
                        backgroundColor: "#C8D8DE",
                        height: "100%"
                    }}>
                        <Image
                            style={{
                                width: 50,
                                height: 40,
                                alignSelf: "center",
                                marginStart: "3%",
                            }}
                            source={require("../../../assets/config.png")}
                        />

                        <Header style={{
                            color: "#004AAD",
                            fontSize: 22,
                            fontWeight: "bold",
                            marginStart: "1%",
                        }}>
                            Configurações
                        </Header>
                    </View>
                    <Modal
                        animationType="slide"
                        transparent={true}
                        visible={visible}
                        onRequestClose={() => {
                            setVisible(false)
                        }}
                        onDismiss={() => {
                            setVisible(false)
                        }}>
                        <View style={{
                            flex: 1,
                            justifyContent: "center",
                            alignItems: "center",
                        }}>
                            <View style={{
                                flex: 0.25,
                                width: "80%",
                                backgroundColor: "#E9FFED",
                                borderRadius: 25,
                                justifyContent: "space-evenly",
                                shadowOpacity: 0.5,
                                shadowRadius: 10,
                                elevation: 10,
                            }}>

                                <Header customStyle={{
                                    maxWidth: "90%",
                                    marginStart: "5%",
                                    color: "black",
                                    fontWeight: "bold",
                                    fontSize: 25,
                                    marginTop: "2%",
                                    flex: 0.3
                                }}>
                                    Confirme a ação
                                </Header>

                                <View style={{
                                    flex: 0.4,
                                    flexDirection: "row",
                                    justifyContent: "space-around",
                                }}>
                                    <TouchableOpacity style={{
                                        flex: 0.45,
                                        backgroundColor: "rgb(22, 216, 98)",
                                        borderRadius: 25,
                                        justifyContent: "center",
                                        alignItems: "center",
                                    }} onPress={() => {
                                        setVisible(false);

                                        AsyncStorage.removeItem("userdata").then(() => {
                                            AsyncStorage.removeItem("userinfo").then(() => {
                                                Keychain.resetGenericPassword().then(() => {
                                                    AsyncStorage.removeItem("darkmode");

                                                    navigation.navigate("Login");
                                                })
                                            })
                                        });
                                    }}>
                                        <Header>
                                            Confirmar
                                        </Header>
                                    </TouchableOpacity>
                                    <TouchableOpacity style={{
                                        flex: 0.45,
                                        backgroundColor: "red",
                                        borderRadius: 25,
                                        justifyContent: "center",
                                        alignItems: "center",
                                    }} onPress={() => {
                                        setVisible(false);
                                    }}>
                                        <Header>
                                            Cancelar
                                        </Header>
                                    </TouchableOpacity>
                                </View>
                            </View>
                        </View>
                    </Modal>

                    <View style={{
                        flex: 0.9,
                        justifyContent: "space-between",
                        alignItems: "center",
                    }}>
                        {[{
                            name: "Modo escuro",
                            color: "#E9FFED",
                            value: darkMode ? true : false,
                            key: "darkmode",
                            onTouch: () => {
                                setDarkMode(!darkMode);
                                AsyncStorage.setItem("darkmode", JSON.stringify({
                                    status: !darkMode
                                }))
                            }
                        }, {
                            name: "Notificações de faltas",
                            color: "#E9FFED",
                            value: userData.faltas,
                            key: "faltas",
                            onTouch: () => {
                                postUpdate("faltas", !userData.faltas);

                                setUserData({
                                    ...userData,
                                    faltas: !userData.faltas
                                });
                            }
                        }, {
                            name: "Notificações de materiais",
                            color: "#E9FFED",
                            value: userData.materiais,
                            key: "materiais",
                            onTouch: () => {
                                postUpdate("materiais", !userData.materiais);

                                setUserData({
                                    ...userData,
                                    materiais: !userData.materiais
                                });
                            }
                        }, {
                            name: "Notificações de notas",
                            color: "#E9FFED",
                            value: userData.notas,
                            key: "notas",
                            onTouch: () => {
                                postUpdate("notas", !userData.notas);

                                setUserData({
                                    ...userData,
                                    notas: !userData.notas
                                });
                            }
                        }, {
                            name: "Apagar meus dados",
                            color: "#E9FFED",
                            key: "delete",
                            onTouch: () => {
                                setVisible(true);
                            }
                        }, {
                            name: "Alterar senha",
                            color: "#E9FFED",
                        }].map((category, index) => {
                            return (
                                [4, 5].includes(index) ? <TouchableOpacity key={index} style={{
                                    flexDirection: "row",
                                    backgroundColor: category.color,
                                    width: "100%",
                                    flex: 0.13,
                                    opacity: 1,
                                    justifyContent: "flex-start",
                                    alignItems: "center",
                                }} onPress={category.onTouch}>
                                    <Header customStyle={{
                                        color: "#225D62",
                                        fontSize: 20,
                                        marginStart: "5%"
                                    }}>
                                        {category.name}
                                    </Header>
                                </TouchableOpacity> : <View key={index} style={{
                                    flexDirection: "row",
                                    backgroundColor: category.color,
                                    width: "100%",
                                    flex: 0.13,
                                    opacity: 1,
                                    justifyContent: "flex-start",
                                    alignItems: "center",
                                }} onPress={category.touch}>
                                    <Header customStyle={{
                                        color: "#225D62",
                                        fontSize: 20,
                                        marginStart: "5%"
                                    }}>
                                        {category.name}
                                    </Header>

                                    {![4, 5].includes(index) && <Switch
                                        trackColor={{ false: '#4E627E', true: 'lightgreen' }}
                                        thumbColor={"white"}
                                        onValueChange={() => {
                                            category.onTouch();
                                        }}
                                        value={category.value}
                                        style={{ marginVertical: -8 }}
                                    >
                                    </Switch>}
                                </View>)
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

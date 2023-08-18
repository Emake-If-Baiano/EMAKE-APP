import React, { useEffect, useState } from 'react'

import Background from '../../components/secondBackgrund';
import { Modal, Switch, Text } from 'react-native';
import { View } from 'react-native';
import { Image } from 'react-native';

import * as Keychain from 'react-native-keychain';

import { RadioButton } from 'react-native-paper';

import Header from '../../components/Header';

import Login from '../../services/SUAP';

import { Dimensions } from 'react-native';

import AsyncStorage from '@react-native-async-storage/async-storage';

import { TouchableOpacity } from 'react-native';
import loading from '../loading';

import themes from '../../../temas';

import themeImages from './themes_examples';

import { ScrollView } from 'react-native';

export default function Configuracoes({ navigation }) {

    const [userData, setUserData] = useState(false);

    const [credentials, setCredentials] = useState({});

    const [darkMode, setDarkMode] = useState(false);

    const [visible, setVisible] = useState(false);

    const [visible2, setVisible2] = useState(false);

    const [theme, setTheme] = useState(false);

    const [themeName, setThemeName] = useState("normal");

    useEffect(() => {

        AsyncStorage.getItem("theme").then(res => {
            setTheme(themes[res || "normal"].config);
            setThemeName(res || "normal");
        })

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

    if (!theme) return loading();

    return (
        <Background navigation={navigation} changeTheme={themeName}>
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

                                    navigation.reset({
                                        index: 0,
                                        routes: [{ name: 'Login' }],
                                    })
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
                            color: theme.primary,
                            width: "100%",
                            marginStart: "5%"
                        }}>Sair</Header>
                    </TouchableOpacity>
                </View>

                <View style={{
                    flex: 0.9,
                    backgroundColor: theme.background,
                    width: "100%",
                }}>
                    <View style={{
                        flexDirection: "row",
                        justifyContent: "center",
                        alignItems: "center",
                        flex: 0.15,
                        width: "100%",
                        backgroundColor: theme.header,
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
                            color: theme.secondary,
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
                                backgroundColor: theme.split,
                                borderRadius: 25,
                                justifyContent: "space-evenly",
                                shadowOpacity: 0.5,
                                shadowRadius: 10,
                                elevation: 10,
                            }}>

                                <Header customStyle={{
                                    maxWidth: "90%",
                                    marginStart: "5%",
                                    color: theme.fontColor,
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

                                                    navigation.reset({
                                                        index: 0,
                                                        routes: [{ name: 'Login' }],
                                                    })
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

                    <Modal
                        animationType="slide"
                        transparent={true}
                        visible={visible2}
                        onRequestClose={() => {
                            setVisible2(false)
                        }}
                        onDismiss={() => {
                            setVisible2(false)
                        }}>
                        <View style={{
                            flex: 1,
                            justifyContent: "center",
                            alignItems: "center",
                        }}>
                            <TouchableOpacity style={{
                                flex: 0.3,
                                backgroundColor: "transparent",
                                width: "100%"
                            }} onPress={() => {
                                setVisible2(false);
                            }}>

                            </TouchableOpacity>
                            <View style={{
                                flex: 0.4,
                                width: "80%",
                                backgroundColor: theme.split,
                                borderRadius: 25,
                                justifyContent: "space-evenly",
                                shadowOpacity: 0.5,
                                shadowRadius: 10,
                                elevation: 10,
                            }}>
                                <ScrollView contentContainerStyle={{
                                    flexGrow: 1
                                }} horizontal={true}
                                    style={{
                                        width: "100%",
                                    }}>
                                    {Object.entries(themes).map(([key, value], index) => {

                                        return (
                                            <View key={index} style={{
                                                borderRadius: 25,
                                                justifyContent: "center",
                                                alignItems: "center",
                                                height: "100%",
                                                width: 120
                                            }}>

                                                <Image style={{
                                                    width: "90%",
                                                    height: "80%",
                                                    resizeMode: "cover",
                                                    borderRadius: 10,
                                                }} source={themeImages[key]}
                                                />

                                                <RadioButton
                                                    value={key}
                                                    status={themeName === key ? 'checked' : 'unchecked'}
                                                    onPress={() => {
                                                        AsyncStorage.setItem("theme", key).then(() => {
                                                            setTheme(value.config);
                                                            setThemeName(key);
                                                            console.log(key)
                                                        })
                                                    }}
                                                />
                                            </View>
                                        )
                                    })}
                                </ScrollView>
                            </View>

                            <TouchableOpacity style={{
                                flex: 0.3,
                                backgroundColor: "transparent",
                                width: "100%"
                            }} onPress={() => {
                                setVisible2(false);
                            }}>

                            </TouchableOpacity>
                        </View>
                    </Modal>


                    <View style={{
                        flex: 0.9,
                        justifyContent: "space-between",
                        alignItems: "center",
                    }}>
                        {[{
                            name: "Alterar tema",
                            color: theme.split,
                            value: darkMode ? true : false,
                            key: "darkmode",
                            onTouch: () => {
                                setVisible2(true);
                            }
                        }, {
                            name: "Notificações de faltas",
                            color: theme.split,
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
                            color: theme.split,
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
                            color: theme.split,
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
                            color: theme.split,
                            key: "delete",
                            onTouch: () => {
                                setVisible(true);
                            }
                        }].map((category, index) => {
                            return (
                                [0, 4].includes(index) ? <TouchableOpacity key={index} style={{
                                    flexDirection: "row",
                                    backgroundColor: category.color,
                                    width: "100%",
                                    flex: 0.13,
                                    opacity: 1,
                                    justifyContent: "flex-start",
                                    alignItems: "center",
                                }} onPress={category.onTouch}>
                                    <Header customStyle={{
                                        color: theme.fontColor,
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
                                }}>
                                    <Header customStyle={{
                                        color: theme.fontColor,
                                        fontSize: 20,
                                        marginStart: "5%"
                                    }}>
                                        {category.name}
                                    </Header>

                                    {![0, 4].includes(index) && <Switch
                                        trackColor={{ false: theme.track.disabled, true: theme.track.enabled }}
                                        thumbColor={theme.track.background}
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

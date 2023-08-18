import React, { useEffect, useState } from 'react'

import Background from '../../components/secondBackgrund';

import { Modal, Image, View, ScrollView } from 'react-native';

import Header from '../../components/Header';

import * as Keychain from 'react-native-keychain';

import Login from '../../services/SUAP';

import { Dimensions } from 'react-native';

import AsyncStorage from '@react-native-async-storage/async-storage';

import { TouchableOpacity } from 'react-native';
import loading from '../loading';
import { Linking } from 'react-native';

import themes from '../../../temas/';

export default function Turmas({ navigation }) {

    const [userData, setUserData] = useState({});

    const [visible, setVisible] = useState(false);

    const [credentials, setCredentials] = useState({});

    const [boletim, setBoletim] = useState(null);

    const [turmas, setTurmas] = useState([]);

    const [periodos, setPeriodos] = useState([]);

    const [periodo, setPeriodo] = useState({});

    const [now, setNow] = useState(false);

    const [turma, setTurma] = useState({});

    const [theme, setTheme] = useState(false);

    function loadPeriodBoletim(token, ano, periodo) {
        Login.getBoletim(token, ano, periodo).then(data => {
            console.log(data)
            if (!data) data = [];

            setBoletim(data);
        })
    }
    useEffect(() => {
        AsyncStorage.getItem("theme").then(res => {
            setTheme(themes[res || "normal"].turmas);
        })

        AsyncStorage.getItem("userdata").then(data => {

            setUserData(JSON.parse(data));
        });

        AsyncStorage.getItem("boletim").then(data => {
            if (data) {
                setBoletim(JSON.parse(data))
            }
        });

        AsyncStorage.getItem("turmas").then(data => {
            if (data) {
                setTurmas(JSON.parse(data));
                console.log(JSON.parse(data).find(e => e.sigla === "TIN.0091"))
            }
        })

        AsyncStorage.getItem("userinfo").then(data => {
            const parse = JSON.parse(data);

            setCredentials(parse);

            Login.obterPeriodoLetivo(parse.token).then(async periodos => {
                setPeriodos(periodos);

                AsyncStorage.setItem("periodos", JSON.stringify(periodos));

                for (const i of periodos.reverse()) {
                    await new Promise((reso) => {
                        Login.getBoletim(parse.token, i.ano_letivo, i.periodo_letivo).then(resDataB => {
                            if (resDataB.length) {
                                if (!periodo.ano) {
                                    setPeriodo(p => {
                                        if (p.ano) return p;

                                        setBoletim(resDataB);

                                        return {
                                            ano: i.ano_letivo,
                                            semestre: i.periodo_letivo
                                        }
                                    });
                                }

                                setTurmas(tu => {
                                    return [...tu, ...resDataB]
                                });
                                AsyncStorage.getItem("turmas").then(tur => {
                                    AsyncStorage.setItem("turmas", JSON.stringify([...(tur ? JSON.parse(tur) : []), ...resDataB]));
                                })
                            }

                            reso(true)
                        })
                    });
                }
            });
        });
    }, [])

    if (!boletim) return loading();

    if (!turmas.length) return loading();

    if (!periodo.ano) return loading();

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
                            color: theme.sair,
                            width: "100%",
                            marginStart: "5%"
                        }}>Sair</Header>
                    </TouchableOpacity>
                </View>

                <Modal
                    visible={Boolean(visible)}
                    animationType="slide"
                    transparent={true}
                    onDismiss={() => {
                        setVisible(!visible)
                    }}
                    onRequestClose={() => {
                        setVisible(!visible)
                    }}>
                    <View style={{
                        flex: 1,
                        justifyContent: "center",
                    }}>

                        <TouchableOpacity onPress={() => {
                            setVisible(!visible)
                        }} style={{
                            flex: 0.1,
                            width: "100%",
                            backgroundColor: "transparent"
                        }}>

                        </TouchableOpacity>
                        <View style={{
                            flex: 0.8,
                            backgroundColor: theme.background,
                            width: "100%",

                        }}>
                            <View style={{
                                flex: 0.1,
                                justifyContent: "space-around",
                                alignItems: "center",
                                backgroundColor: theme.turmaColor,
                                width: "100%",
                                flexDirection: "row"
                            }}>
                                <TouchableOpacity onPress={() => {
                                    setNow("participantes")
                                }}>
                                    <Header style={{
                                        color: now === "participantes" ? theme.selected : theme.textColor,
                                        fontWeight: "bold",
                                        fontSize: 16,
                                    }}>
                                        Participantes
                                    </Header>
                                </TouchableOpacity>

                                <TouchableOpacity
                                    onPress={() => {
                                        setNow("aulas")
                                    }}
                                    style={{

                                    }}>
                                    <Header style={{
                                        color: now === "aulas" ? "green" : theme.textColor,
                                        fontWeight: "bold",
                                        fontSize: 16,
                                    }}>
                                        Aulas
                                    </Header>
                                </TouchableOpacity>

                                <TouchableOpacity onPress={() => {
                                    setNow("materiais_de_aula")
                                }} style={{

                                }}>
                                    <Header style={{
                                        color: now === "materiais_de_aula" ? "green" : theme.textColor,
                                        fontWeight: "bold",
                                        fontSize: 16,
                                    }}>
                                        Materiais
                                    </Header>
                                </TouchableOpacity>
                            </View>

                            <View style={{
                                flex: 0.9,
                            }}>
                                <ScrollView vertical={true} contentContainerStyle={{

                                }} style={{
                                    backgroundColor: theme.background,
                                    width: "100%",

                                }}>
                                    {turma?.[now]?.map((b, i) => {
                                        const formats = {
                                            "participantes": <View style={{
                                                backgroundColor: theme.turmaColor,
                                                width: "80%",
                                                height: 120,
                                                borderRadius: 20,
                                                marginTop: "5%",
                                                alignSelf: "center",
                                                shadowColor: 'black',
                                                shadowOffset: { width: -5, height: 10 },
                                                shadowOpacity: 0.5,
                                                shadowRadius: 10,
                                                elevation: 10,
                                                alignItems: "center",
                                                flexDirection: "row"
                                            }}>
                                                <View style={{
                                                    flex: 0.4,
                                                    justifyContent: "center",
                                                    alignItems: "center",
                                                }}>
                                                    <Image style={{
                                                        width: 75,
                                                        height: 75,
                                                        borderRadius: 45
                                                    }} source={{
                                                        uri: `https://suap.ifbaiano.edu.br/` + b.foto
                                                    }}>

                                                    </Image>
                                                </View>

                                                <View style={{
                                                    flex: 0.6,
                                                    justifyContent: "center",
                                                }}>
                                                    <Header customStyle={{
                                                        fontWeight: "bold",
                                                        fontSize: 14,
                                                        color: theme.textColor,
                                                        marginStart: "5%",
                                                        flex: 0.4,
                                                    }}>{b.nome}</Header>

                                                    <Header customStyle={{
                                                        fontWeight: "bold",
                                                        fontSize: 11,
                                                        color: theme.textColor,
                                                        flex: 0.6,
                                                        marginStart: "5%"
                                                    }}>Matrícula n° {b.matricula}</Header>
                                                </View>
                                            </View>,
                                            "aulas": <View style={{
                                                backgroundColor: theme.turmaColor,
                                                width: "80%",
                                                height: 120,
                                                borderRadius: 20,
                                                marginTop: "5%",
                                                alignSelf: "center",
                                                shadowColor: 'black',
                                                shadowOffset: { width: -5, height: 10 },
                                                shadowOpacity: 0.5,
                                                shadowRadius: 10,
                                                elevation: 10,
                                                alignItems: "center",
                                            }}>
                                                <Header customStyle={{
                                                    fontWeight: "bold",
                                                    fontSize: 14,
                                                    color: theme.textColor,
                                                    marginStart: "5%",
                                                }}>{b.conteudo?.substring(0, 40) + (b.conteudo?.length > 40 ? "..." : "")}</Header>

                                                <Header customStyle={{
                                                    fontWeight: "bold",
                                                    fontSize: 14,
                                                    color: theme.textColor,
                                                    marginStart: "5%",
                                                    alignSelf: "flex-start",
                                                    marginTop: "2%"
                                                }}>Data: {b.data?.split("-").reverse().join("/")} </Header>
                                                <Header customStyle={{
                                                    fontWeight: "bold",
                                                    fontSize: 14,
                                                    color: theme.textColor,
                                                    marginStart: "5%",
                                                    alignSelf: "flex-start",
                                                    marginTop: "1%"
                                                }}>Faltas: {b.faltas} </Header>

                                                <Header customStyle={{
                                                    fontWeight: "bold",
                                                    fontSize: 12,
                                                    color: theme.textColor,
                                                    marginStart: "5%",
                                                    alignSelf: "flex-start",
                                                    marginTop: "3%"
                                                }}>Professor: {b.professor} </Header>
                                            </View>,
                                            "materiais_de_aula": <TouchableOpacity onPress={() => {
                                                Linking.openURL(`https://suap.ifbaiano.edu.br${b.url}`)
                                            }} style={{
                                                backgroundColor: theme.turmaColor,
                                                width: "80%",
                                                height: 120,
                                                borderRadius: 20,
                                                marginTop: "5%",
                                                alignSelf: "center",
                                                shadowColor: 'black',
                                                shadowOffset: { width: -5, height: 10 },
                                                shadowOpacity: 0.5,
                                                shadowRadius: 10,
                                                elevation: 10,
                                                alignItems: "center",
                                            }}>
                                                <Header customStyle={{
                                                    fontWeight: "bold",
                                                    fontSize: 17,
                                                    color: theme.textColor,
                                                    marginStart: "5%",
                                                    marginTop: "10%"
                                                }}>{b.descricao?.substring(0, 40) + (b.descricao?.length > 40 ? "..." : "")}</Header>

                                                <Header customStyle={{
                                                    fontWeight: "bold",
                                                    fontSize: 15,
                                                    color: theme.textColor,
                                                    marginStart: "5%",
                                                    alignSelf: "flex-start",
                                                    marginTop: "5%"
                                                }}>Data de vinculação: {b.data_vinculacao?.split("-").reverse().join("/")} </Header>
                                            </TouchableOpacity>
                                        }
                                        return formats[now]
                                    })}
                                </ScrollView>
                            </View>
                        </View>

                        <TouchableOpacity onPress={() => {
                            setVisible(!visible)
                        }} style={{
                            flex: 0.1,
                            width: "100%",
                            backgroundColor: "transparent"
                        }}>

                        </TouchableOpacity>
                    </View>
                </Modal>

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
                    }}>
                        <Image
                            style={{
                                width: 75,
                                height: 75,
                                alignSelf: "center",
                                marginStart: "3%",
                            }}
                            source={require("../../../assets/paginas.png")}
                        />

                        <Header style={{
                            color: theme.fillTurmas,
                            fontSize: 25,
                            fontWeight: "bold",
                            marginStart: "1%"
                        }}>
                            Minhas Turmas
                        </Header>
                    </View>
                    <View style={{
                        flex: 0.1,
                    }}>
                        <ScrollView
                            horizontal={true}
                            contentContainerStyle={{
                                backgroundColor: theme.semestreSelector.background,
                                flexDirection: "row",
                                justifyContent: "space-evenly",
                                alignItems: "center",
                                flexGrow: 1
                            }}>
                            {periodos.map((p, i) => {
                                return (
                                    <TouchableOpacity key={i} style={{
                                        width: 100,
                                        backgroundColor: theme.semestreSelector.primary,
                                        borderRadius: 40,
                                        height: "80%",
                                        opacity: periodo?.ano === p.ano_letivo ? 1 : 0.55,
                                        justifyContent: "center",
                                        alignItems: "center"
                                    }} onPress={() => {
                                        setPeriodo({
                                            ano: p.ano_letivo,
                                            periodo: p.periodo_letivo
                                        });

                                        loadPeriodBoletim(credentials.token, p.ano_letivo, p.periodo_letivo)
                                    }}>
                                        <Header customStyle={{
                                            color: theme.semestreSelector.textColor,
                                            fontSize: 18,
                                            fontWeight: "bold"
                                        }}>
                                            {p.ano_letivo}.{p.periodo_letivo}
                                        </Header>
                                    </TouchableOpacity>
                                )
                            })}
                        </ScrollView>
                    </View>
                    <View style={{
                        flex: 0.75,
                    }}>
                        {boletim.length ? <ScrollView vertical={true} contentContainerStyle={{

                        }} style={{
                            backgroundColor: theme.background,
                            width: "100%",

                        }}>
                            {boletim.map((b, i) => {
                                return <TouchableOpacity onPress={() => {
                                    setNow("participantes");
                                    console.log(b.codigo_diario)
                                    Login.obterTurma(credentials.token, b.codigo_diario).then(turmaR => {
                                        setTurma(turmaR)
                                        console.log(turmaR)
                                    })
                                    setVisible(b);

                                }} style={{
                                    backgroundColor: theme.turmaColor,
                                    width: "80%",
                                    height: 120,
                                    borderRadius: 20,
                                    marginTop: "5%",
                                    alignSelf: "center",
                                    shadowColor: 'black',
                                    shadowOffset: { width: -5, height: 10 },
                                    shadowOpacity: 0.5,
                                    shadowRadius: 10,
                                    elevation: 10,
                                    alignItems: "center"
                                }}>
                                    <Header customStyle={{
                                        fontWeight: "bold",
                                        fontSize: 16,
                                        color: theme.textColor,
                                        marginStart: "5%",
                                        flex: 0.3,
                                    }}>{b.disciplina?.split("-")[1]}</Header>

                                    <View style={{
                                        flex: 0.7,
                                        justifyContent: "center",
                                        alignItems: "flex-start",
                                    }}>
                                        <View style={{
                                            flex: 0.33333333,
                                            flexDirection: "row",
                                        }}>
                                            <Header customStyle={{
                                                fontWeight: "bold",
                                                fontSize: 13,
                                                color: theme.textColor,
                                                flex: 1,
                                                marginStart: "5%"
                                            }}>Total de Aulas: {b.carga_horaria_cumprida}/{b.carga_horaria}</Header>
                                        </View>

                                        <View style={{
                                            flex: 0.33333333,
                                            flexDirection: "row"
                                        }}>
                                            <Header customStyle={{
                                                fontWeight: "bold",
                                                fontSize: 14,
                                                color: theme.textColor,
                                                marginStart: "5%"
                                            }}>Frequência: {Math.floor(b.percentual_carga_horaria_frequentada)}%</Header>
                                        </View>

                                        <View style={{
                                            flex: 0.333333,
                                            flexDirection: "row"
                                        }}>
                                            <Header customStyle={{
                                                fontWeight: "bold",
                                                fontSize: 14,
                                                color: theme.textColor,
                                                marginStart: "5%"
                                            }}>Situação: </Header>

                                            <Header customStyle={{
                                                fontWeight: "bold",
                                                fontSize: 14,
                                                color: b.situacao === "Cursando" ? "blue" : b.situacao === "Aprovado" ? "#00FF12" : "red",
                                            }}>{b.situacao}</Header>
                                        </View>
                                    </View>
                                </TouchableOpacity>
                            })}
                        </ScrollView> : <Header customStyle={{
                            color: "black",
                            fontSize: 25
                        }}>

                            Carregando...
                        </Header>}
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

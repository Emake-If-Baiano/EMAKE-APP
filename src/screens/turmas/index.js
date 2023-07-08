import React, { useEffect, useState } from 'react'

import Background from '../../components/secondBackgrund';

import { Modal, Image, View, Text, ScrollView } from 'react-native';

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

import AsyncStorage from '@react-native-async-storage/async-storage';

import { TouchableOpacity } from 'react-native';
import loading from '../loading';

import SelectDropdown from 'react-native-select-dropdown'

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

    function loadPeriodBoletim(token, ano, periodo) {
        Login.getBoletim(token, ano, periodo).then(data => {

            if (!data) data = [];

            setBoletim(data);
        })
    }
    useEffect(() => {
        AsyncStorage.getItem("userdata").then(data => {

            setUserData(JSON.parse(data));
        });

        AsyncStorage.getItem("boletim").then(data => {
            if (data) {
                setBoletim(JSON.parse(data))
            }
        });

        AsyncStorage.getItem("periodos").then(data => {
            if (data) {
                const p = JSON.parse(data);

                setPeriodos(p);

                let last = p.reverse()[1] || p[0];

                setPeriodo({
                    ano: last.ano_letivo,
                    periodo: last.periodo_letivo
                });
            }
        })

        AsyncStorage.getItem("turmas").then(data => {
            if (data) {
                setTurmas(JSON.parse(data));
                console.log(JSON.parse(data).find(e => e.sigla === "TIN.0091"))
            }
        })

        AsyncStorage.getItem("userinfo").then(data => {
            const parse = JSON.parse(data);

            setCredentials(parse);

            Login.obterPeriodoLetivo(parse.token).then(periodos => {
                setPeriodos(periodos);

                AsyncStorage.setItem("periodos", JSON.stringify(periodos));

                let last = periodos.reverse()[1] || periodos[0];

                setPeriodo({
                    ano: last.ano_letivo,
                    periodo: last.periodo_letivo
                });

                loadPeriodBoletim(parse.token, last.ano_letivo, last.periodo_letivo);

                periodos.forEach(p => {
                    Login.obterTurmas(parse.token, p.ano_letivo, p.periodo_letivo).then(turmasN => {
                        if (!turmasN) return;

                        setTurmas(tu => {
                            return [...tu, ...turmasN]
                        });
                        AsyncStorage.getItem("turmas").then(tur => {
                            AsyncStorage.setItem("turmas", JSON.stringify([...(tur ? JSON.parse(tur) : []), ...turmasN]));
                        })
                    })
                })
            });
        });
    }, [])

    if (!boletim) return loading();

    if (!turmas.length) return loading();

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
                            navigation.navigate("Login");
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
                        <View style={{
                            flex: 0.8,
                            backgroundColor: "white",
                            width: "100%",

                        }}>
                            <View style={{
                                flex: 0.1,
                                justifyContent: "space-around",
                                alignItems: "center",
                                backgroundColor: "#f9f1e5",
                                width: "100%",
                                flexDirection: "row"
                            }}>
                                <TouchableOpacity onPress={() => {
                                    setNow("participantes")
                                }}>
                                    <Header style={{
                                        color: now === "participantes" ? "green" : "black",
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
                                        color: now === "aulas" ? "green" : "black",
                                        fontWeight: "bold",
                                        fontSize: 16,
                                    }}>
                                        Aulas
                                    </Header>
                                </TouchableOpacity>

                                <TouchableOpacity onPress={() => {
                                    setNow("materiais")
                                }} style={{

                                }}>
                                    <Header style={{
                                        color: now === "materiais" ? "green" : "black",
                                        fontWeight: "bold",
                                        fontSize: 16,
                                    }}>
                                        Materiais
                                    </Header>
                                </TouchableOpacity>

                                <TouchableOpacity onPress={() => {
                                    setNow("atvs")
                                }} style={{
                                    flex: 0.333
                                }}>
                                    <Header style={{
                                        color: now === "atvs" ? "green" : "black",
                                        fontWeight: "bold",
                                        fontSize: 16,
                                    }}>
                                        Atvs
                                    </Header>
                                </TouchableOpacity>
                            </View>

                            <View style={{
                                flex: 0.9,
                            }}>
                                <ScrollView vertical={true} contentContainerStyle={{

                                }} style={{
                                    backgroundColor: "white",
                                    width: "100%",

                                }}>
                                    {turma?.[now]?.map((b, i) => {
                                        const formats = {
                                            "participantes": <View style={{
                                                backgroundColor: "#f9f1e5",
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
                                                        color: "black",
                                                        marginStart: "5%",
                                                        flex: 0.4,
                                                    }}>{b.nome}</Header>

                                                    <Header customStyle={{
                                                        fontWeight: "bold",
                                                        fontSize: 11,
                                                        color: "black",
                                                        flex: 0.6,
                                                        marginStart: "5%"
                                                    }}>Matrícula n° {b.matricula}</Header>
                                                </View>
                                            </View>,
                                            "aulas": <View style={{
                                                backgroundColor: "#f9f1e5",
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
                                                    color: "black",
                                                    marginStart: "5%",
                                                }}>{b.conteudo?.substring(0, 40) + (b.conteudo?.length > 40 ? "..." : "")}</Header>

                                                <Header customStyle={{
                                                    fontWeight: "bold",
                                                    fontSize: 14,
                                                    color: "black",
                                                    marginStart: "5%",
                                                    alignSelf: "flex-start",
                                                    marginTop: "2%"
                                                }}>Data: {b.data?.split("-").reverse().join("/")} </Header>
                                                <Header customStyle={{
                                                    fontWeight: "bold",
                                                    fontSize: 14,
                                                    color: "black",
                                                    marginStart: "5%",
                                                    alignSelf: "flex-start",
                                                    marginTop: "1%"
                                                }}>Faltas: {b.faltas} </Header>

                                                <Header customStyle={{
                                                    fontWeight: "bold",
                                                    fontSize: 12,
                                                    color: "black",
                                                    marginStart: "5%",
                                                    alignSelf: "flex-start",
                                                    marginTop: "3%"
                                                }}>Professor: {b.professor} </Header>
                                            </View>
                                        }
                                        return formats[now]
                                    })}
                                </ScrollView>
                            </View>
                        </View>
                    </View>
                </Modal>

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
                            color: "#004AAD",
                            fontSize: 25,
                            fontWeight: "bold",
                            marginStart: "1%"
                        }}>
                            Minhas Turmas
                        </Header>
                    </View>
                    <View style={{
                        flex: 0.1,
                        backgroundColor: "blue"
                    }}>
                        <ScrollView
                            vertical={true}
                            style={{
                                backgroundColor: "yellow",

                            }}
                            contentContainerStyle={{
                                flex: 1,
                                backgroundColor: "#004AAD",
                                flexDirection: "row",
                                justifyContent: "space-around",
                                alignItems: "center",
                                width: "100%"
                            }}>
                            {periodos.map((p, i) => {
                                return (
                                    <TouchableOpacity key={i} style={{
                                        width: "30%",
                                        backgroundColor: "#06FF5B",
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
                                            color: "#004AAD",
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
                        <ScrollView vertical={true} contentContainerStyle={{

                        }} style={{
                            backgroundColor: "white",
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
                                    backgroundColor: "#f9f1e5",
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
                                        color: "black",
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
                                                color: "black",
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
                                                color: "black",
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
                                                color: "black",
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
                        </ScrollView>
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

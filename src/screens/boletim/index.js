import React, { useEffect, useState } from 'react'

import Background from '../../components/secondBackgrund';
import { ScrollView, Text, Modal } from 'react-native';
import { View } from 'react-native';
import { Image } from 'react-native';

import Header from '../../components/Header';


import Login from '../../services/SUAP';

import { Dimensions } from 'react-native';

import AsyncStorage from '@react-native-async-storage/async-storage';

import { TouchableOpacity } from 'react-native';
import loading from '../loading';

import * as Keychain from 'react-native-keychain';
export default function Notificações({ navigation }) {

    const [userData, setUserData] = useState(false);

    const [ira, setIra] = useState(0);

    const [boletim, setBoletim] = useState([]);

    const [periodos, setPeriodos] = useState([]);

    const [periodo, setPeriodo] = useState({});

    const [credentials, setCredentials] = useState({ user: "", password: "" });

    const [visible, setVisible] = useState(false);

    const [materia, setMateria] = useState(false);

    const [detal, setDetals] = useState({});

    const loadDetals = (user, password, ano, periodo, diario) => {

        Login.getNotasDetalhadas(user, password, ano, periodo, diario).then(e => {
            console.log(e)
            setDetals(e)
        })
    }

    const render = () => {
        if (visible) return (<Modal
            visible={visible}
            transparent={true}
            animationType="slide"

            style={{
                justifyContent: "center",
                alignItems: "center"
            }}
            onDismiss={() => {
                setVisible(!visible)
            }}
            onRequestClose={() => {
                setVisible(!visible)
            }}
        >
            <View style={{
                justifyContent: "center",
                alignItems: "center",
                height: "100%",
            }}>
                <TouchableOpacity onPress={() => {
                    setVisible(!visible)
                }} style={{
                    height: "25%",
                    width: "85%",
                    backgroundColor: "transparent",
                }}>

                </TouchableOpacity>
                <View style={{
                    height: "50%",
                    width: "85%",
                }}>
                    <ScrollView style={{
                        backgroundColor: "#004AAD",
                        width: "100%",
                        borderRadius: 30,
                        borderColor: "#61e786",
                        borderWidth: 4,
                    }} contentContainerStyle={{
                        padding: "3%"
                    }}>
                        {[boletim.map((b, i) => {
                            return (<TouchableOpacity key={i}>
                                <Header customStyle={{
                                    color: "#61e786",
                                    fontSize: 18,
                                    padding: "2%"
                                }} onPress={() => {
                                    setDetals({});

                                    setMateria(b);

                                    loadDetals(credentials.user, credentials.password, periodo.ano, periodo.periodo, b.codigo_diario)
                                }}>
                                    {b.disciplina?.split("-")[1]}
                                </Header>
                            </TouchableOpacity>)
                        })]}
                    </ScrollView>
                </View>

                <TouchableOpacity onPress={() => {
                    setVisible(!visible)
                }} style={{
                    height: "25%",
                    width: "85%",
                    backgroundColor: "transparent",
                }}>

                </TouchableOpacity>
            </View>
        </Modal>)
    }
    function calcIRA(boletins) {
        const p1 = boletins
            .map((boletim) => {
                if (boletim.quantidade_avaliacoes === 4) {
                    return (
                        ((boletim.nota_etapa_1.nota * 2 +
                            boletim.nota_etapa_2.nota * 2 +
                            boletim.nota_etapa_3.nota * 3 +
                            boletim.nota_etapa_4.nota * 3) /
                            10) *
                        boletim.carga_horaria
                    )
                } else {
                    return (
                        ((boletim.nota_etapa_1.nota * 2 + boletim.nota_etapa_2.nota * 3) /
                            5) *
                        boletim.carga_horaria
                    )
                }
            })
            .reduce((a, b) => a + b, 0)
        const p2 = boletins
            .map((boletim) => boletim.carga_horaria)
            .reduce((a, b) => a + b, 0)

        return Number((p1 / p2).toFixed(2)) || "SEM IRA"
    };

    function loadPeriodBoletim(token, ano, periodo) {
        Login.getBoletim(token, ano, periodo).then(data => {

            if (!data) data = [];

            setBoletim(data);

            setIra(calcIRA(data));
        })
    }
    useEffect(() => {
        AsyncStorage.getItem("userdata").then(data => {

            setUserData(JSON.parse(data));
        });

        AsyncStorage.getItem("boletim").then(data => {
            if (data) {
                setBoletim(JSON.parse(data));

                setIra(calcIRA(JSON.parse(data)))
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
            })
        });
    }, [])

    if (!boletim) return loading();
    if (!ira) return loading();

    return (
        <Background navigation={navigation}>

            <Modal
                visible={Boolean(materia)}
                transparent={true}
                animationType="slide"
                onDismiss={() => {
                    setDetals({});
                    setMateria(false);

                }}
                onRequestClose={() => {
                    setDetals({});
                    setMateria(false)
                }}
            >
                <View style={{
                    flex: 1,
                    justifyContent: "center",
                    alignItems: "center"
                }}>
                    <TouchableOpacity onPress={() => {
                        setDetals({});
                        setMateria(false)
                    }} style={{
                        flex: 0.075,
                        width: "100%",
                        backgroundColor: "transparent",
                    }}>

                    </TouchableOpacity>
                    <View style={{
                        width: "100%",
                        flex: 0.85,
                        backgroundColor: "white",
                        borderRadius: 25,
                        borderColor: "black",
                        borderTopWidth: 4,
                        borderLeftWidth: 4,
                        borderRightWidth: 4,
                        borderBottomWidth: 4,
                    }}>

                        <View style={{
                            width: "100%",
                            flex: 0.1,
                            backgroundColor: "#BCFFC6",
                            borderRadius: 40,
                            borderColor: "black",
                            justifyContent: "center",
                            alignSelf: "center",
                            borderTopWidth: 1,
                            borderLeftWidth: 3,
                            borderRightWidth: 3,
                            borderBottomWidth: 3,
                        }}>
                            <Header customStyle={{
                                fontSize: 20,
                                color: "#004AAD",
                                fontWeight: "bold",
                                textAlign: "center"
                            }}>
                                {materia.disciplina?.split("- ")[1]}
                            </Header>
                        </View>

                        {Boolean(detal.Professores) && <Header customStyle={{
                            flex: 0.05,
                            fontSize: 16,
                            color: "#004AAD",
                            marginStart: "5%",
                            fontWeight: "bold"
                        }}>
                            Prof: {detal.Professores || "Nenhum professor cadastrado"}
                        </Header>}

                        {!Boolean(detal.Professores) && <Header customStyle={{
                            fontSize: 25,
                            color: "#004AAD",
                            marginStart: "5%",
                            fontWeight: "bold"
                        }}>
                            Carregando...
                        </Header>
                        }

                        {Object.entries(detal["Detalhamento das Notas"] || []).map(([key, value], i) => {

                            return (<View key={i} style={{
                                flex: 0.5,
                                width: "100%",
                            }}>
                                <Header customStyle={{
                                    flex: 0.2,
                                    fontSize: 17,
                                    color: "#004AAD",
                                    marginStart: "3%",
                                    marginTop: "2%",
                                    fontWeight: "bold"
                                }}>
                                    {key}
                                </Header>

                                <View style={{
                                    flex: 0.15,
                                    flexDirection: "row",
                                    justifyContent: "space-around",
                                    marginTop: "1%",
                                    marginBottom: "1%"
                                }}>
                                    {["Sigla", "Tipo", "Descrição", "Peso", "Obteve"].map((e, i) => {
                                        return (<View style={{
                                            backgroundColor: "#004AAD",
                                            borderRadius: 40,
                                            flex: ["Tipo", "Descrição"].includes(e) ? 0.3 : 0.1333,
                                            justifyContent: "center",
                                            alignItems: "center"
                                        }}>
                                            <Header customStyle={{
                                                color: "#61e786",
                                                fontSize: 11
                                            }}>
                                                {e}
                                            </Header>
                                        </View>)
                                    })}
                                </View>

                                {value.map((e, j) => {

                                    return (<View style={{
                                        flex: 0.2,
                                        flexDirection: "row",
                                        justifyContent: "space-around",
                                    }}>
                                        {Object.values(e).map((e, i) => {
                                            return (<View style={{
                                                backgroundColor: j % 2 === 0 ? "rgba(0, 74, 173, 0.6)" : "rgba(0, 255, 18, 0.4)",
                                                flex: [1, 2].includes(i) ? 0.3 : 0.1333,
                                                justifyContent: "center",
                                                alignItems: [1, 2].includes(i) ? "flex-start" : "center"
                                            }}>
                                                <Header customStyle={{
                                                    color: j % 2 !== 0 ? "#004AAD" : "#61e786",
                                                    fontSize: 13,
                                                    marginStart: [1, 2].includes(i) ? "15%" : 0
                                                }}>
                                                    {e}
                                                </Header>
                                            </View>)
                                        })}
                                    </View>)
                                })}
                            </View>)
                        })}
                    </View>

                    <TouchableOpacity onPress={() => {
                        setDetals({});
                        setMateria(false)
                    }} style={{
                        flex: 0.075,
                        width: "100%",
                        backgroundColor: "transparent",
                    }}>

                    </TouchableOpacity>
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
                    flex: 0.05,
                    marginTop: "10%",
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
                        }}>Sair </Header>
                    </TouchableOpacity>
                </View>
                <View style={{
                    flex: 0.95,
                    backgroundColor: "white",
                    width: "100%",
                    alignItems: "center",
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
                            Boletim
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
                                        backgroundColor: "#61e786",
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

                    <Header customStyle={{
                        color: "#004AAD",
                        fontSize: 25,
                        fontWeight: "bold",
                        textAlign: "center",
                        flex: 0.07,
                    }}>Matéria</Header>

                    <TouchableOpacity style={{
                        flex: 0.06,
                        backgroundColor: "#004AAD",
                        width: "90%",
                        borderRadius: 40,
                        borderWidth: 5,
                        borderColor: "#61e786",
                        justifyContent: "center",
                    }} onPress={() => {
                        setVisible(!visible)
                    }}>
                        <Header customStyle={{
                            fontSize: 17,
                            color: "#61e786",
                            fontWeight: "bold",
                            textAlign: "left",
                            marginStart: "5%",
                            fontFamily: "times"
                        }}>
                            Toque para escolher uma matéria
                        </Header>
                    </TouchableOpacity>
                    <Header customStyle={{
                        color: "#004AAD",
                        fontSize: 17,
                        fontWeight: "bold",
                        flex: 0.04,
                    }}>
                        Toque na disciplina para detalhar
                    </Header>
                    {render()}

                    <View style={{
                        flex: 0.08,
                        flexDirection: "row"
                    }}>
                        {[{
                            name: "Disciplina",
                            color: "#004AAD",
                            flex: 0.6
                        }, {
                            name: "N1",
                            color: "#61e786",
                            flex: 0.1
                        }, {
                            name: "N2",
                            color: "#61e786",
                            flex: 0.1
                        }, {
                            name: "MD",
                            color: "#61e786",
                            flex: 0.1
                        }, {
                            name: "NAF",
                            color: "#61e786",
                            flex: 0.1
                        }].map((item, index) => {
                            return (<View key={index} style={{
                                flex: item.flex,
                                backgroundColor: item.color,
                                justifyContent: "center",
                                alignItems: "center",
                            }}>
                                <Header customStyle={{
                                    color: index === 0 ? "#61e786" : "#004AAD",
                                    fontSize: 18.5,
                                    fontWeight: "bold"
                                }}>
                                    {item.name}
                                </Header>
                            </View>)
                        })}
                    </View>
                    <View style={{
                        flex: 0.5,
                        backgroundColor: "FFFFFF",
                        width: "100%",
                    }}>
                        <ScrollView contentContainerStyle={{

                        }} style={{
                            height: "100%"
                        }}>
                            {boletim?.sort((a, b) => a.disciplina?.split("- ")[1] - b.disciplina?.split("- ")[1]).map((item, index) => {
                                return (<View key={index} style={{
                                    height: 50,
                                    backgroundColor: "#FFFFFF",
                                    flexDirection: "row",
                                    justifyContent: "center",
                                    alignItems: "center",
                                }}>
                                    <TouchableOpacity style={{
                                        backgroundColor: "white",
                                        alignItems: "center",
                                        width: "60%",
                                        justifyContent: "center",
                                        alignItems: "center",
                                    }} onPress={() => {
                                        console.log(item, Boolean(detal.Professores));
                                        setMateria(item);

                                        loadDetals(credentials.user, credentials.password, periodo.ano, periodo.periodo, item.codigo_diario)
                                    }}>
                                        <View style={{
                                            height: "85%",
                                            justifyContent: "center",
                                            alignItems: "center",
                                        }}>
                                            <Header customStyle={{
                                                color: "#004AAD",
                                                fontSize: 17,
                                                fontWeight: "bold",
                                                textAlign: "center",
                                            }}>
                                                {item.disciplina?.split("- ")[1]}
                                            </Header>
                                        </View>

                                        <View style={{
                                            height: "15%",
                                            backgroundColor: "#61e786",
                                            width: "100%",
                                            opacity: 0.4
                                        }}>

                                        </View>
                                    </TouchableOpacity>
                                    <View style={{
                                        width: "10%",
                                        height: "100%",
                                    }}>
                                        <View style={{
                                            height: "85%",
                                            backgroundColor: "#004AAD",
                                            justifyContent: "center",
                                            alignItems: "center",
                                        }}>
                                            <Header style={{
                                                color: "#61e786",
                                                fontSize: 17.5,
                                                fontWeight: "bold",
                                                textAlign: "center",
                                            }}>
                                                {item.nota_etapa_1?.nota}
                                            </Header>
                                        </View>

                                        <View style={{
                                            height: "15%",
                                            backgroundColor: "#61e786",
                                            width: "100%",
                                            opacity: 0.4
                                        }}>
                                        </View>
                                    </View>
                                    <View style={{
                                        width: "10%",
                                        height: "100%",
                                    }}>
                                        <View style={{
                                            height: "85%",
                                            backgroundColor: "#61e786",
                                            opacity: 0.7,
                                            justifyContent: "center",
                                            alignItems: "center",
                                        }}>
                                            <Header style={{
                                                color: "#004AAD",
                                                fontSize: 17.5,
                                                fontWeight: "bold",
                                                textAlign: "center",
                                            }}>
                                                {(item.nota_etapa_2?.nota || "")}
                                            </Header>
                                        </View>

                                        <View style={{
                                            height: "15%",
                                            backgroundColor: "#61e786",
                                            width: "100%",
                                            opacity: 0.4
                                        }}>
                                        </View>
                                    </View>

                                    <View style={{
                                        width: "10%",
                                        height: "100%",
                                    }}>
                                        <View style={{
                                            height: "85%",
                                            backgroundColor: "#004AAD",
                                            justifyContent: "center",
                                            alignItems: "center",
                                        }}>
                                            <Header style={{
                                                color: (item.nota_etapa_1?.nota + (item.nota_etapa_2?.nota || 0)) / 2 > 60 ? "#61e786" : "red",
                                                fontSize: 17.5,
                                                fontWeight: "bold",
                                                textAlign: "center",
                                            }}>
                                                {(item.nota_etapa_1?.nota + (item.nota_etapa_2?.nota || 0)) / 2}
                                            </Header>
                                        </View>

                                        <View style={{
                                            height: "15%",
                                            backgroundColor: "#61e786",
                                            width: "100%",
                                            opacity: 0.4
                                        }}>
                                        </View>
                                    </View>
                                    <View style={{
                                        width: "10%",
                                        height: "100%",
                                    }}>
                                        <View style={{
                                            height: "85%",
                                            backgroundColor: "#61e786",
                                            opacity: 0.7,
                                            justifyContent: "center",
                                            alignItems: "center",
                                        }}>
                                            <Header style={{
                                                color: "#004AAD",
                                                fontSize: 17.5,
                                                fontWeight: "bold",
                                                textAlign: "center",
                                            }}>
                                                {item.nota_avaliacao_final?.nota}
                                            </Header>
                                        </View>

                                        <View style={{
                                            height: "15%",
                                            backgroundColor: "#61e786",
                                            width: "100%",
                                            opacity: 0.4
                                        }}>
                                        </View>
                                    </View>
                                </View>)
                            })}
                        </ScrollView>
                    </View>
                </View>
            </View>
        </Background >
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

import axios from "axios";

const instance = axios.create({
    baseURL: 'https://suap.ifbaiano.edu.br/api/v2',
    headers: {
        'Content-Type': 'application/json',

    }
});

async function getFiles(user, password) {
    const params = new URLSearchParams({
        user,
        password
    })
    return axios.get(`https://vps.paulo-valadares.com/docs?${params.toString()}`).then(res => res.data)
}

async function getNotasDetalhadas(user, password, ano, periodo, codigo) {

    const params = new URLSearchParams({
        user,
        password,
        ano,
        periodo,
        codigo
    });

    return axios.get(`https://vps.paulo-valadares.com/notas?${params.toString()}`).then(res => res.data)
}

async function Login(user, password) {

    instance.defaults.headers.common['Authorization'] = null;

    return instance.post(
        '/autenticacao/token/?format=json',
        {
            username: user.toLowerCase(),
            password: password
        }).then(res => {
            return res.data
        }, (err) => {
            console.log(err, user, password)
            return false
        })
};

async function getBoletim(token, ano, periodo) {
    instance.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    console.log(ano, periodo)
    return instance.get(`/minhas-informacoes/boletim/${ano || 2022}/${periodo || 1}/`).then(e => {
        return e.data
    }, (err) => {

        return false;
    })
};
async function getUserData(token) {
    instance.defaults.headers.common['Authorization'] = `Bearer ${token}`;

    return instance.get("/minhas-informacoes/meus-dados/").then(e => {
        return e.data
    }, (err) => {
        console.log(err, token);

        return false;
    })
}

async function obterPeriodoLetivo(token) {
    instance.defaults.headers.common['Authorization'] = `Bearer ${token}`;

    return instance.get("minhas-informacoes/meus-periodos-letivos/").then(e => {
        return e.data
    }, (err) => {
        console.log(err, token);

        return false;
    })
}

async function obterTurmas(token, ano, periodo) {
    instance.defaults.headers.common['Authorization'] = `Bearer ${token}`;

    return instance.get(`/minhas-informacoes/turmas-virtuais/${ano}/${periodo}/`).then(e => {
        return e.data
    }, (err) => {
        console.log(err, token);

        return false;
    })
}

async function obterTurma(token, turma) {
    instance.defaults.headers.common['Authorization'] = `Bearer ${token}`;

    return instance.get(`/minhas-informacoes/turma-virtual/${turma}/`).then(e => {
        return e.data
    }, (err) => {
        console.log(err, token);

        return false;
    })
}

async function obterNoticias(campus) {
    const params = new URLSearchParams({
        campus: campus
    });
    return axios.get(`https://vps.paulo-valadares.com/campus?${params.toString()}`).then(res => res.data)
}

async function obterNotificacoes(user, password) {

    const params = new URLSearchParams({
        user,
        password
    });

    return axios.get(`https://vps.paulo-valadares.com/notificacoes?${params.toString()}`).then(res => res.data)
}

async function obterCalendario(user, password) {

    const params = new URLSearchParams({
        user,
        password
    });

    return axios.get(`https://vps.paulo-valadares.com/calendario?${params.toString()}`).then(res => res.data)
}

async function obterConfig(user, password) {
    const params = new URLSearchParams({
        user,
        password
    });
    console.log("YEAYYEA", params.toString())
    return axios.get(`https://vps.paulo-valadares.com/config?${params.toString()}`).then(res => res.data)
}

async function updateConfig(user, password, data) {
    const params = new URLSearchParams({
        user,
        password,
        data: JSON.stringify(data)
    });

    return axios.get(`https://vps.paulo-valadares.com/updateConfig?${params.toString()}`, data).then(res => res.data)
}

export default {
    Login,
    getUserData,
    getBoletim,
    obterPeriodoLetivo,
    getFiles,
    getNotasDetalhadas,
    obterTurmas,
    obterTurma,
    obterNoticias,
    obterNotificacoes,
    obterCalendario,
    obterConfig,
    updateConfig
}
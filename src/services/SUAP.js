import axios from "axios";

const instance = axios.create({
    baseURL: 'https://suap.ifbaiano.edu.br/api/v2',
    headers: {
        'Content-Type': 'application/json',

    }
});

async function getFiles(user, password) {
    return axios.get(`http://api.mc-lothus.com:25566/docs?user=${user}&password=${password}`).then(res => res.data)
}

async function getNotasDetalhadas(user, password, ano, periodo, codigo) {

    const params = new URLSearchParams({
        user,
        password,
        ano,
        periodo,
        codigo
    });

    return axios.get(`http://api.mc-lothus.com:25566/notas?${params.toString()}`).then(res => res.data)
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

export default {
    Login,
    getUserData,
    getBoletim,
    obterPeriodoLetivo,
    getFiles,
    getNotasDetalhadas
}
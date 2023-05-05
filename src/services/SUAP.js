import axios from "axios";

const instance = axios.create({
    baseURL: 'https://suap.ifbaiano.edu.br/api/v2',
    headers: {
        'Content-Type': 'application/json',

    }
});

async function Login(user, password) {
    console.log(user, password, "batata")
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

async function getBoletim(token) {
    instance.defaults.headers.common['Authorization'] = `Bearer ${token}`;

    return instance.get("/minhas-informacoes/boletim/2022/1/").then(e => {
        return e.data
    }, (err) => {
        console.log(err);

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

export default {
    Login,
    getUserData,
    getBoletim,
}
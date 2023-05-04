import axios from "axios";

const instance = axios.create({
    baseURL: 'https://suap.ifbaiano.edu.br/api/v2',
    headers: {
        'Content-Type': 'application/json',
    }
});

async function Login(user, password) {
    console.log(user, password, "batata")
    return instance.post(
        '/autenticacao/token/?format=json',
        {
            username: user.toLowerCase(),
            password: password
        }).then(res => {
            return res.data
        }, (err) => {
            return false
        })
}

export default Login;
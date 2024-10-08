import { displayErrorList } from "../components/loader.js"
import { loadMainPage } from "../index/index.js";

async function handleSubmitRegister(e) {
    if (e.target.matches('#registrationForm') === false)
        return ;
    e.preventDefault()
    const username = document.querySelector('#new_username').value;
    const password = document.querySelector('#new_password').value;
    const password_2 = document.querySelector('#new_password_2').value;

    const loginData = {
        username: username,
        password: password,
        password_2: password_2,
    };
    try {
        const response = await fetch('api/register/', {
            method: 'POST',
            headers: {
            'Content-Type': 'application/json',
            },body: JSON.stringify(loginData),
        })
        if (!response.ok) {
            const error = await response.json();
            throw new Error(JSON.stringify(error));
        }
        const data = await response.json();
        const token = data.token;
        const refresh = data.refresh
        sessionStorage.setItem('token', token);
        sessionStorage.setItem('refresh', refresh);
        console.log(data);
        loadMainPage();
    }
    catch (error) {
        displayErrorList(JSON.parse(error.message), 'registrationForm');
    }
}

export function register(e) {
    document.getElementById('root').addEventListener('submit', handleSubmitRegister);
}

export function loadSignUpPage(e){

    let singUpPage = document.getElementById("root");
    Promise.all([
        fetch('./sing-up/sing_up.html').then(response => response.text()),
        fetch('./sing-up/sing_up.css').then(response => response.text())
    ]).then(([html, css]) => {
        html += `<style>${css}</style>`;
        singUpPage.innerHTML = html;
    }).catch(error => {
        console.error('Error al cargar el formulario:', error);
    });
}

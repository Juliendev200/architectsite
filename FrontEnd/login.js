function loginrequest () {
    return fetch("http://localhost:5678/api/users/login", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            "email": InputEmailValue,
            "password": InputPasswordValue
        })
    });
};

const inputEmail = document.querySelector('input[type="email"]')
const inputPassword = document.querySelector('input[type="password"]')
const submit = document.querySelector("input[type='submit']")
const errorDisplay = document.querySelector('.error')
const login = document.getElementById("login");

let InputEmailValue = inputEmail.value;
let InputPasswordValue = inputPassword.value;

submit.addEventListener("click", (e) => {
    e.preventDefault();
    InputEmailValue = inputEmail.value;
    InputPasswordValue = inputPassword.value;
    loginrequest ()
        .then ((response) => response.json())
        .then (login => {
            if (login.token) {
                localStorage.setItem('token', login.token)
                window.location.href = "./index.html";
            } else {
                console.error("Aucun token");
                errorDisplay.innerHTML = "Id ou mdp inccorect";
            };
        });
});

inputEmail.addEventListener('input', (e) => {
    console.log(e.target.value);
});

inputPassword.addEventListener('input', (e) => {
    console.log(e.target.value);
});
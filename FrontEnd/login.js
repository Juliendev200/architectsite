function loginrequest () {
    return fetch("http://localhost:5678/api/users/login", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify ({
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

let InputEmailValue
let InputPasswordValue

submit.addEventListener("click", (e) => {
    e.preventDefault();
    InputEmailValue = inputEmail.value;
    InputPasswordValue = inputPassword.value;
    loginrequest ()
    // Modification post soutenance //
        .then ((response) => {if (response.ok === true) {return response.json()}
        else {console.log("Aucune réponse de la part de l'API")}})
     // Modification post soutenance //
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

console.log(token)
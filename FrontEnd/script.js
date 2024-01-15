let datawork;
let datacategory;
const logbut = document.getElementById("log");
const token = localStorage.getItem("token");


async function lfcategories(){
    const r = await fetch("http://localhost:5678/api/categories")
    const category = await r.json()
    datacategory = category
    return category
}


lfcategories().then(category => console.log(category))

async function lfworks(){
    const r = await fetch("http://localhost:5678/api/works")
    const work = await r.json()
    datawork = work
    return work
}

lfworks().then(datawork => console.log(datawork))

function loadworks(){
    const gallery = document.querySelector(".gallery");
    gallery.innerHTML = "";
    datawork.forEach((project) => {
        const figure = document.createElement("figure");
        figure.innerHTML=`
        <img src="${project.imageUrl}" alt="${project.title}">
		<figcaption>${project.title}</figcaption>`;
        gallery.appendChild(figure);
    });
}

function showWorkandCategories() {
    const buttondiv = document.createElement('div')
    portfolio.appendChild(buttondiv)
    const addbutton = document.createElement('button');
    const gallery = document.querySelector(".gallery")
    addbutton.textContent = "Tous";
    addbutton.addEventListener("click", () =>{
        loadworks()
    });
    buttondiv.classList.add("button_div");
    addbutton.classList.add('button');
    buttondiv.appendChild(addbutton);
    datacategory.forEach((categories) => {
        const buttoncategory = document.createElement("button");
        buttoncategory.textContent = categories.name;
        buttoncategory.classList.add('button');
        buttondiv.appendChild(buttoncategory);
        buttoncategory.addEventListener("click", () =>{
            const categoryName = buttoncategory.textContent;
            const filterbutton = datawork.filter (function (work){
                return work.category.name === categoryName
            })
            gallery.innerHTML = ''
            filterbutton.forEach((project) => {
                const figure = document.createElement("figure");
                figure.innerHTML=`
                <img src="${project.imageUrl}" alt="${project.title}">
                <figcaption>${project.title}</figcaption>`;
                gallery.appendChild(figure);
            });
            console.log(filterbutton)
        })
        loadworks()
    })
    const secondchild = portfolio.children[1];
    portfolio.insertBefore(buttondiv, secondchild)
}

async function loaddata() {
    const works = await lfworks();
    const categories = await lfcategories();
    showWorkandCategories();
}

loaddata()

if (token) {
    logoutadmin();
    adminoption();
    blackband();
}

logbut.addEventListener("click", inoroutbut);

function logoutadmin () {
    if (token) {
        logbut.textContent = "logout";
        logbut.addEventListener("click", () => {
            if (token) {
                localStorage.removeItem("token")
            }
        })
    }
}

function inoroutbut () {
    if (logbut.textContent === "login"){
        window.location.href = "./login.html";
    } else if (log.textContent === "logout") {
        logbut.removeEventListener("click", inoroutbut);
        window.location.href = "./index.html";
    }
}

function adminoption () {
    if (token) {
        const optionmodify = document.getElementsByClassName("link__modal");
        document.querySelector('header').style.marginTop = "100px";
        for (let i = 0; i < optionmodify.length; i++){
            optionmodify[i].style.visibility = "visible";
        }
    }
}

function blackband () {
    const header = document.querySelector("header")
    const blackbanddiv = document.createElement("div")
    header.appendChild(blackbanddiv);
    blackbanddiv.innerHTML = `
        <aside
            class="blackband" 
            role="dialog" 
            aria-hidden="true"
            aria-modal="false">
                <a class="link__modal" href="#modal1"> 
                    <i class="fa-regular fa-pen-to-square"></i> 
                    Mode édition 
                </a>
        </aside>
    `;
}

console.log(token)
const focusableSelector = 'button, a, input, textarea'
let modal = null;

const openmodal = function (e) {
    e.preventDefault()
    modal = document.querySelector(e.target.getAttribute('href'))
    focusables = Array.from(modal.querySelectorAll(focusableSelector))
    modal.style.display = null
    modal.removeAttribute('aria-hidden')
    modal.setAttribute('aria-modal', 'true')
    modal.addEventListener ('click', closemodal)
    modal.querySelector('.js-modal-close').addEventListener('click', closemodal)
    modal.querySelector('.js-stop-propagation').addEventListener('click', stoppropagation)
}

const stoppropagation = function (e) {
    e.stopPropagation()
}

const closemodal = function (e) {
    if (modal === null) return
    e.preventDefault()
    modal.style.display = "none"
    modal.setAttribute('aria-hidden', 'true')
    modal.removeAttribute('aria-modal')
    modal.querySelector('.js-modal-close').removeEventListener('click', closemodal)
    modal.querySelector('.js-stop-propagation').removeEventListener('click', stoppropagation)
    modal = null
}

document.querySelectorAll('.link__modal').forEach(a => {
    a.addEventListener('click', openmodal)
})

window.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' || e.key === 'Esc'){
        closemodal(e)
    }
    if (e.key === 'Tab' && modal !== null) {
        focusInModal(e)
    }
})
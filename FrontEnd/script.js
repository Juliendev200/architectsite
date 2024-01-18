//////////////////////////////////////////////////////////////////////////////////////////////////
                                        // API area //

// Variables utiles //
let datawork;
let datacategory;
const logbut = document.getElementById("log");
const token = localStorage.getItem("token");

// Solicitation infos API //
async function lfcategories(){
    const r = await fetch("http://localhost:5678/api/categories")
    const category = await r.json()
    datacategory = category
    return category
}

//Vérif infos//
lfcategories().then(category => console.log(category))

// Solicitation infos API //
async function lfworks(){
    const r = await fetch("http://localhost:5678/api/works")
    const work = await r.json()
    datawork = work
    return work
}

//Vérif infos//
lfworks().then(datawork => console.log(datawork))

// Fonction en attente d'infos pour chargement de la page //
async function loaddata() {
    const works = await lfworks();
    const categories = await lfcategories();
    showWorkandCategories();
}

// Mode d'affichage des images //
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

// Mise en page des infos récupérés via API + Mode d'affichage des catégories //
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

//-------- Fonction refresh pour synchroniser les images supprimés
function refreshwork() {
    lfworks().then((work) => {
        datawork = work;
        loadworks();
    });
}
loaddata()

//////////////////////////////////////////////////////////////////////////////////////////////////
                                        // Amin area //


if (token) {
    logoutadmin();
    adminoption();
    blackband();
}

// Si connecté, alors logbutton déconnecte //
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

// Si pas connecté, logbutton envoi sur la page de connexion//
function inoroutbut () {
    if (logbut.textContent === "login"){
        window.location.href = "./login.html";
    } else if (log.textContent === "logout") {
        logbut.removeEventListener("click", inoroutbut);
        window.location.href = "./index.html";
    }
}
logbut.addEventListener("click", inoroutbut);

// Affichage de l'option *Modifier* //
function adminoption () {
    if (token) {
        const optionmodify = document.getElementsByClassName("link__modal");
        document.querySelector('header').style.marginTop = "100px";
        for (let i = 0; i < optionmodify.length; i++){
            optionmodify[i].style.visibility = "visible";
        }
    }
}

// Mise en page administrateur // 
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

//////////////////////////////////////////////////////////////////////////////////////////////////
                                        // Modal area //


// Variables utiles //
let modal = null;
const focusableSelector = `button, a, input, textarea`
let focusables = []

// Fonctions de suppression des travaux // 
async function fetchdelete(imageId) {
    const token = localStorage.getItem("token");
    try {
        const response = await fetch(`http://localhost:5678/api/works/${imageId}`, {
            method: "DELETE",
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        if (response.ok) {
            console.log("Image supprimée avec succès");
        } else {
            alert("Erreur lors de la suppression de l'image");
        }
    } catch (error) {
        console.log(error);
    };
};


// Mise en place ouverture page modale // 
const openmodal = function (e) {
    e.preventDefault()
    const body = document.querySelector("body")
    modaldiv = document.createElement('div')
    body.appendChild(modaldiv)
    let modalContent = `
        <aside id="modal1" class="modal" role="dialog" aria-hidden="true" aria-modal="false">
            <div class="modal-container js-stop-propagation">
                <button class="js-modal-close"><i class="fa-solid fa-xmark fa24px"></i></button>
                <h2> Galerie photo</h2>
                <div class="modal-gallery">
    `
    datawork.forEach((project) => {
        const figure = document.createElement("figure");
        figure.innerHTML=`
            <figure class="binfont">
                <i class="fa-solid fa-trash-can fa-xs"></i>
                <img src="${project.imageUrl}" alt="${project.title}" data-id=${project.id}>
            </figure>
            `;
        modalContent += figure.innerHTML;
    });
    modalContent += `
            </div>
			<form action="#" method="post">
				<input type="submit" value="Ajouter une photo">
			</form>
	    </aside>    
    `
    modaldiv.insertAdjacentHTML("beforeend", modalContent);
    modal = document.getElementById('modal1')
    modal.style.display = null
    focusables = Array.from(modal.querySelectorAll(focusableSelector))
    focusables[0].focus()     
    modal.removeAttribute('aria-hidden')
    modal.setAttribute('aria-modal', 'true')
    modal.addEventListener ('click', closemodal)
    modal.querySelector('.js-modal-close').addEventListener('click', closemodal)
    modal.querySelector('.js-stop-propagation').addEventListener('click', stoppropagation)
    modal.querySelectorAll('.fa-trash-can').forEach (a => {
        a.addEventListener('click', deletework)})
    modal.querySelectorAll('.fa-trash-can').forEach (a => {
        a.addEventListener('click', refreshwork)})
}

// Limite propagation des events listener//
const stoppropagation = function (e) {
    e.stopPropagation()
}

// Remise en place fermeture modale //
const closemodal = function (e) {
    if (modal === null) return
    e.preventDefault()
    modal.style.display = "none"
    modal.setAttribute('aria-hidden', 'true')
    modal.removeAttribute('aria-modal')
    modal.removeEventListener('click', closemodal)  
    modal.querySelector('.js-modal-close').removeEventListener('click', closemodal)
    modal.querySelector('.js-modal-close').removeEventListener('click', stoppropagation)
    modal = null
}

// Navigation possible via clavier //
window.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' || e.key === 'Esc'){
        closemodal(e)
    }
    if (e.key === 'Tab' && modal !== null) {
        focusInModal(e)
    }
})

// Suivi du focus // 
const focusInModal = function (e) {
    e.preventDefault()
    console.log(focusables)
    let index = focusables.findIndex(f => f === modal.querySelector(':focus'))
    if (e.shiftKey === true) {
        index --
    } else {
        index++
    }
    if (index >= focusables.length) {
        index = 0
    }
    if (index < 0) {
        index = focusables.length - 1
    }
    focusables [index].focus()
}

// Ouverture de la modale au clic //
document.querySelectorAll('.link__modal').forEach(a => {
    a.addEventListener('click', openmodal)
})


// Suppression des travaux //
const deletework = function (e) {
    e.preventDefault()
    const thepicture = e.target.parentNode.querySelector("img")
    if (thepicture){
        const imageId = thepicture.dataset.id;
        console.log (thepicture.dataset.id)
        fetchdelete(imageId).then(() => {
            thepicture.parentNode.remove();
        })
    }
}


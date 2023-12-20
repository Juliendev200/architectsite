let datawork;
let datacategory;

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

async function LfData() {
    const works = await lfworks();
    const categories = await lfcategories();
    loadworks();
}

LfData()

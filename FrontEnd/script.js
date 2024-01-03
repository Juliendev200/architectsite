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


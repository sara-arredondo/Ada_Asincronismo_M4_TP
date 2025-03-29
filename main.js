const $ = element => document.querySelector(element);
const $$ = element => document.querySelectorAll(element)


//selectores hero
const $batContainer = $("#bat-container");

//selectores form
const $formBusqueda = $("#form-busqueda")
const $inputBusqueda = $("#input-busqueda")
const $inputType = $("#input-type")
const $inputStatus = $("#input-status")
const $inputGender = $("#input-gender")
const $buttonBusqueda = $("#button-busqueda")

//selectores pintar datos
const $cantidadResultados = $("#cantidad-resultados")
const $containerCards = $("#container-cards")
const $cardComic = $("#card-comic")
const $imgComic = $("#img-comic")
const $nameComic = $("#name-comic")

const $containerDetailsPersonajes = $("#container-details-personajes")
const $containerDetailsEpisodios = $("#container-details-episodios")

//selectores para paginacion
const $buttonFirst = $("#button-first")
const $buttonPrevious = $("#button-previous")
const $buttonNext = $("#button-next")
const $buttonLast = $("#button-last")
const $pageNumber = $("#page-number")

//variables y arrays 
const bat = [];
const cantidadBats = 5;
const repulsionStrength = 300;

let elements = []
let totalElements = []
let currentPage = 1;
let selectType = "character"
let selectStatus = ""
let selectGender = ""
let filterName = ""



// ---------- funciones hero --------------------------------------------

window.addEventListener("mousemove", (event) => {
    window.mouseX = event.clientX;
    window.mouseY = event.clientY;
});

function interaccionBats() {

    function obtenerBats() {
        for (let i = 0; i < cantidadBats; i++) {
            let x = Math.random() * window.innerWidth;  // Posición X aleatoria
            let y = Math.random() * window.innerHeight; // Posición Y aleatoria
            let initialRotation = Math.random() * 360; // Rotación inicial aleatoria
    
            let img = document.createElement("img");
            img.src = "./assets/img/bat.png"; 
            img.classList.add("absolute", "w-36", "h-36"); 
            
            // Posicon aleatoris en la pantalla
            img.style.position = "absolute";
            img.style.left = `${x}px`;
            img.style.top = `${y}px`;
            img.style.transform = `rotate(${initialRotation}deg)`; // Rotación aleatoria
            img.style.transition = "transform 0.2s ease-out";
    
            $batContainer.appendChild(img); // Agrega LS imagen al contenedor
    
            bat.push({
                el: img,
                x: x,
                y: y,
                vx: 0,
                vy: 0,
                rotation: initialRotation
            });
        }
    }
    
    function pintarBats() {
        for (let obj of bat) {
            let dx = obj.x - window.mouseX;
            let dy = obj.y - window.mouseY;
            let distance = Math.sqrt(dx * dx + dy * dy);
    
            if (distance < repulsionStrength) {
                let angle = Math.atan2(dy, dx);
                let force = (repulsionStrength - distance) / repulsionStrength;
                obj.vx += Math.cos(angle) * force * 2;
                obj.vy += Math.sin(angle) * force * 2;
    
                // Aplicar rotación del bat en la dirección opuesta al mouse
                let rotationAngle = (angle * (180 / Math.PI)) + 90;
                obj.el.style.transform = `rotate(${rotationAngle}deg)`;
            }
    
            // Aplicar fricción para suavizar el movimiento
            obj.vx *= 0.9;
            obj.vy *= 0.9;
    
            // Actualizar posición
            obj.x += obj.vx;
            obj.y += obj.vy;
    
            obj.el.style.left = `${obj.x}px`;
            obj.el.style.top = `${obj.y}px`;
        }
    
        requestAnimationFrame(pintarBats);
    }
    
    obtenerBats()
    pintarBats()
}

//----------------- funciones de filtros -----------------------------------------------


// si quisiera que el filtro funcione de forma autonoma sin el boton de busqueda


/*$inputBusqueda.addEventListener("input", (event) => {

    filterName = event.target.value;
    currentPage = 1;
    $pageNumber.textContent = currentPage
    obtenerDatos(currentPage);

})

$inputType.addEventListener("change", (event) => {

    selectType = event.target.value;
    currentPage = 1;
    $pageNumber.textContent = currentPage
    obtenerDatos(currentPage);
})

$inputStatus.addEventListener("change", (event) => {

    selectStatus = event.target.value;
    currentPage = 1;
    $pageNumber.textContent = currentPage
    obtenerDatos(currentPage);
})

$inputGender.addEventListener("change", (event) => {

    selectGender = event.target.value;
    currentPage = 1;
    $pageNumber.textContent = currentPage
    obtenerDatos(currentPage);
})*/

$formBusqueda.addEventListener("submit", (event) => {

    event.preventDefault();

    filterName = $inputBusqueda.value;
    selectType = $inputType.value;
    selectStatus = $inputStatus.value;
    selectGender = $inputGender.value;

    currentPage = 1;
    $pageNumber.textContent = currentPage;

    obtenerDatos(currentPage);
})
//----------------- funciones pricipales  -----------------------------------------------

function cargandoDatos() {
    $containerCards.innerHTML = `
    
        <div class="flex justify-center items-center w-full h-96">
            <div class="lds-circle"><div></div></div>
        </div>`;
}

async function obtenerDatos(page) {

    cargandoDatos()

    await new Promise(resolve => setTimeout(resolve, 1000));

    try {
        const {data} = await axios(`https://rickandmortyapi.com/api/${selectType}?page=${currentPage}&status=${selectStatus}&gender=${selectGender}&name=${filterName}`, {    
        });

        elements = data.results
        totalElements = data.info.count
        $cantidadResultados.textContent = totalElements
        pintarDatos(elements)
        console.log(elements);
    } catch (error) {
        console.error(error)
    }
}

function pintarDatos(arrayDatos) {

    $containerCards.innerHTML = "";

    if(selectType === "character") {

        for (const personaje of arrayDatos) {

            $containerCards.innerHTML += `
                <article id="card-comic" class="w-full h-fit mb-8 sm:w-1/4 sm:justify-between md:w-1/4 lg:w-1/5 xl:w-1/6 2xl:w-[calc(100%/7)]">
                    <img class=" w-full bg-amarillo" src="${personaje.image}" alt="imagen del personaje">
                    <h3 class="my-2 font-sofia font-sofia-800">${personaje.name}</h3>
                    <img class="non-scaling" src="./assets/svg/linea.svg" alt="decorativo">
                </article>
            `
        } 
    } else if (selectType === "episode") {

        for (const episodio of arrayDatos) {

            $containerCards.innerHTML += `
                <article id="card-comic" class="w-full h-32 mb-8 sm:w-1/4 sm:justify-between md:w-1/4 lg:w-1/5 xl:w-1/6 2xl:w-[calc(100%/7)] flex flex-col justify-center">
                    <img class="non-scaling" src="./assets/svg/linea.svg" alt="">
                    <h3 class="h-18 m-2 font-sofia font-sofia-800">Episodio N° ${episodio.id}</h3>    
                    <h3 class="h-18 m-2 font-sofia font-sofia-500">${episodio.name}</h3>
                    <img class="non-scaling" src="./assets/svg/linea.svg" alt="">
                </article>
            `
        } 
    }
}

//----------------- funciones paginacion-----------------------------------------------

$buttonNext.addEventListener("click", async () => {
    
    $containerCards.innerHTML = "";
    cargandoDatos()

    currentPage += 1

    try {
        const {data} = await axios(`https://rickandmortyapi.com/api/${selectType}?page=${currentPage}&status=${selectStatus}&gender=${selectGender}&name=${filterName}`, {    
        });

        elements = data.results
        pintarDatos(elements)
        $pageNumber.textContent = currentPage
    } catch (error) {
        console.error("Error al cargar los comics")
    }
})

$buttonPrevious.addEventListener("click", async () => {
    
    $containerCards.innerHTML = "";
    cargandoDatos()

    currentPage -= 1

    try {
        const {data} = await axios(`https://rickandmortyapi.com/api/${selectType}?page=${currentPage}&status=${selectStatus}&gender=${selectGender}&name=${filterName}`, {    
        });

        elements = data.results
        pintarDatos(elements)
        $pageNumber.textContent = currentPage
    } catch (error) {
        console.error("Error al cargar los comics")
    }
})

$buttonLast.addEventListener("click", async () => {

    $containerCards.innerHTML = "";
    cargandoDatos()

    currentPage = Math.ceil(totalElements / 20)
    console.log(currentPage)
    

        try {
            const {data} = await axios(`https://rickandmortyapi.com/api/${selectType}?page=${currentPage}&status=${selectStatus}&gender=${selectGender}&name=${filterName}`, {    
            });

            elements = data.results
            pintarDatos(elements)
            totalElements = data.info.count;   
            
            $pageNumber.textContent = currentPage
        } catch (error) {
            console.error("Error al cargar los comics")
        }
})

$buttonFirst.addEventListener("click", async () => {

    $containerCards.innerHTML = "";
    cargandoDatos()

    currentPage = 1
    
        try {
            const {data} = await axios(`https://rickandmortyapi.com/api/${selectType}?page=${currentPage}&status=${selectStatus}&gender=${selectGender}`, {    
            });

            elements = data.results
            pintarDatos(elements)
            totalElements = data.info.count;   
            
            $pageNumber.textContent = currentPage
        } catch (error) {
            console.error("Error al cargar los comics")
        }
})


window.onload = async () => {
    interaccionBats();
    cargandoDatos()
    await obtenerDatos(currentPage);
    pintarDatos(elements)
};

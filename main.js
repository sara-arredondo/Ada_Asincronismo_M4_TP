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
const $imgComic = $$(".img-comic")
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
let arrayEpisodes = []
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

//----------------- funcion de filtros -----------------------------------------------

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

    //await new Promise(resolve => setTimeout(resolve, 200));

    try {
        const { data } = await axios(`https://rickandmortyapi.com/api/${selectType}?page=${currentPage}&status=${selectStatus}&gender=${selectGender}&name=${filterName}`, {    
        });

    
        elements = data.results
        totalElements = data.info.count
        $cantidadResultados.textContent = totalElements
        console.log(elements);
        pintarDatos(elements)
        
    } catch (error) {
        console.error(error)
    }
}


async function obtenerDetailsPersonajes() {

    try {

       const { data } = await axios(`https://rickandmortyapi.com/api/character/1`);
       for (const element of data.episode) {

          try {

             const { data } = await axios(element);
             console.log(data);
             
          } catch (error) {
             console.log(error);
          }
       }
    } catch (error) {
       console.log(error);
    }
 }

function pintarDatos(arrayDatos) {

    $containerCards.innerHTML = "";

    if(selectType === "character") {

        for (const personaje of arrayDatos) {

            $containerCards.innerHTML += `
                <article id="${personaje.id}" class="w-full h-fit mb-8 sm:w-1/4 sm:justify-between md:w-1/4 lg:w-1/5 xl:w-1/6 2xl:w-[calc(100%/7)]">
                    <img class="img-comic w-full bg-amarillo cursor-pointer transform transition duration-300 hover:scale-105" src="${personaje.image}" alt="imagen del personaje">
                    <h3 class="my-2 font-sofia font-sofia-800">${personaje.name}</h3>
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

function clicImagenes() {

    $containerCards.addEventListener("click", (event) => {
        if (event.target.classList.contains("img-comic")) {

            // el metood closest sirve para buscar el padre m[as cercano que coincida con el selector dado, as[i
            // me ahorro tener que recorrerlo manualmente]

            const card = event.target.closest("article");  
            const characterId = card.getAttribute("id");

            const personaje = elements.find(personaje => personaje.id.toString() === characterId);

            $containerCards.classList.remove("flex");
            $containerCards.classList.add("hidden");
    
            $containerDetailsPersonajes.classList.remove("hidden");
            $containerDetailsPersonajes.classList.add("flex"); 

            pintarDatosPersonajes(personaje)
        }
    });
    
}

function pintarDatosPersonajes(personaje) {

    $containerDetailsPersonajes.innerHTML = `
            <div class="flex flex-col lg:gap-12 lg:w-1/3 lg:m-auto">
                    <div class="flex flex-col m-auto">
                        <img src="${personaje.image}" alt="" class="w-96 h-96 bg-negro">
                    </div>
    
                    <div>
                        <h1 class="font-sofia font-sofia-800 text-3xl mt-4 text-negro text-center">${personaje.name}</h1>
                        <div class="flex flex-row justify-between my-4">
                            <h2 class="font-sofia font-sofia-800">Especie</h2>
                            <h2 class="font-sofia font-sofia-500">${personaje.species}</h2>
                        </div>
    
                        <img class="non-scaling" src="./assets/svg/linea.svg" alt="">
    
                        <div class="flex flex-row justify-between my-4">
                            <h2 class="font-sofia font-sofia-800">Origen</h2>
                            <h2 class="font-sofia font-sofia-500">${personaje.origin.name}</h2>
                        </div>
    
                        <img class="non-scaling" src="./assets/svg/linea.svg" alt="">
    
                        <div class="flex flex-row justify-between my-4">
                            <h2 class="font-sofia font-sofia-800">Ubicación</h2>
                            <h2 class="font-sofia font-sofia-500">${personaje.location.name}</h2>
                        </div>
    
                        <img class="non-scaling" src="./assets/svg/linea.svg" alt="">
                    </div>
                </div>
                
                <div>
                    <div class="mt-8">
                        <h1 class="font-sofia font-sofia-800 text-2xl mb-4 mt-14 text-negro md:text-center lg:text-center">Episodios relacionados</h1>
                    </div>`

    for (let i = 0; i < personaje.episode.length; i++) {
                    

        $containerDetailsPersonajes.innerHTML += `
            <article class="w-full h-32 mb-8 sm:w-1/4 sm:justify-between md:w-1/4 lg:w-1/5 xl:w-1/6 2xl:w-[calc(100%/7)] flex flex-col justify-center">
                <img class="non-scaling" src="./assets/svg/linea.svg" alt="">
                <h3 class="h-18 my-2 font-sofia font-sofia-800">Episodio ${personaje.episode.id}</h3>
                <h3 class="h-18 my-2 font-sofia font-sofia-500">Nombre del episodio</h3>
                <img class="non-scaling" src="./assets/svg/linea.svg" alt="">
            </article>
        `
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
    clicImagenes()
    await obtenerDetailsPersonajes()
};





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
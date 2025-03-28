const $ = element => document.querySelector(element);
const $$ = element => document.querySelectorAll(element)


//selectores hero
const $batContainer = $("#bat-container");

//selectores form
const $formBusqueda = $("#form-busqueda")
const $inputBusqueda = $("#input-busqueda")
const $inputType = $("#input-type")
const $inputSort = $("#input-sort")
const $buttonBusqueda = $("#button-busqueda")

//selectores pintar datos
const $cantidadResultados = $("#cantidad-resultados")
const $containerCards = $("#container-cards")
const $cardComic = $("#card-comic")
const $imgComic = $("#img-comic")
const $nameComic = $("#name-comic")

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

let characters = []
let totalElements = []
let currentPage = 1;


// ---------- funciones hero bats --------------------------------------------

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

//----------------- funciones pricipales  -----------------------------------------------


async function obtenerDatos(page) {

    try {
        const {data} = await axios(`https://rickandmortyapi.com/api/character?page=${currentPage}`, {    
        });

        characters = data.results
        totalElements = data.info.count;
        $cantidadResultados.textContent  = totalElements 
        pintarDatos(characters)
        console.log(characters);
    } catch (error) {
        console.error(error)
    }
}

function pintarDatos(arrayPersonajes) {

   // 

    $containerCards.innerHTML = "";
    
    for (const personajes of arrayPersonajes) {

        $containerCards.innerHTML += `
            <article id="card-comic" class="w-full h-fit mb-8 sm:w-1/4 sm:justify-between md:w-1/4 lg:w-1/5 xl:w-1/6 2xl:w-[calc(100%/7)]">
                <img class=" w-full bg-amarillo" src="${personajes.image}" alt="">
                <h3 class="m-2 font-sofia font-sofia-500">${personajes.name}</h3>
                <img class="non-scaling" src="./assets/svg/linea.svg" alt="">
            </article>
        `
    }    
}

function cargandoComics() {
    $containerCards.innerHTML = `<p class="w-full text-center font-sofia-800 py-4 text-xl ">CARGANDO COMICS...</p>`;
}


//----------------- funciones paginacion-----------------------------------------------

$buttonNext.addEventListener("click", async () => {
    
    $containerCards.innerHTML = "";
    cargandoComics()

    currentPage += 1
    try {
        const {data} = await axios(`https://rickandmortyapi.com/api/character?page=${currentPage}`, {    
        });

        characters = data.results
        pintarDatos(characters)
        $pageNumber.textContent = currentPage
    } catch (error) {
        console.error("Error al cargar los comics")
    }
})

$buttonPrevious.addEventListener("click", async () => {
    
    $containerCards.innerHTML = "";
    cargandoComics()

    currentPage -= 1

    try {
        const {data} = await axios(`https://rickandmortyapi.com/api/character?page=${currentPage}`, {    
        });

        characters = data.results
        pintarDatos(characters)
        $pageNumber.textContent = currentPage
    } catch (error) {
        console.error("Error al cargar los comics")
    }
})

$buttonLast.addEventListener("click", async () => {

    $containerCards.innerHTML = "";
    cargandoComics()

    currentPage = Math.ceil(totalElements / 20)
    console.log(currentPage)
    

        try {
            const {data} = await axios(`https://rickandmortyapi.com/api/character?page=${currentPage}`, {    
            });

            characters = data.results
            pintarDatos(characters)
            totalElements = data.info.count;   
            
            $pageNumber.textContent = currentPage
        } catch (error) {
            console.error("Error al cargar los comics")
        }
})

$buttonFirst.addEventListener("click", async () => {

    $containerCards.innerHTML = "";
    cargandoComics()

    currentPage = 1
    
        try {
            const {data} = await axios(`https://rickandmortyapi.com/api/character?page=${currentPage}`, {    
            });

            characters = data.results
            pintarDatos(characters)
            totalElements = data.info.count;   
            
            $pageNumber.textContent = currentPage
        } catch (error) {
            console.error("Error al cargar los comics")
        }
})



window.onload = async () => {
    interaccionBats();
    await obtenerDatos(currentPage);
    pintarDatos(characters)
};







// public key

// 724ede1a75e8d29e8901818d0a0b5078

// private key

// 1a97a4c08a9a9cb77917012c60208da5908a07d2

// https://gateway.marvel.com/v1/public/comics?ts={{ts}}&hash={{hash}}
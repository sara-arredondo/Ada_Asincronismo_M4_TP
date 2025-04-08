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
const $containerInputStatus = $("#container-input-status")
const $containerInputGender = $("#container-input-gender")

//selectores pintar datos
const $cantidadResultados = $("#cantidad-resultados")
const $containerCards = $("#container-cards")
const $imgComic = $$(".img-comic")
const $nameComic = $("#name-comic")
const $detailEpisode = $("#detail-episode")
const $cardComicEpisode = $("#card-comic")

const $containerDetailsPersonajes = $("#container-details-personajes")
const $containerDetailsEpisodios = $("#container-details-episodios")

//selectores para paginacion
const $buttonFirst = $("#button-first")
const $buttonPrevious = $("#button-previous")
const $buttonNext = $("#button-next")
const $buttonLast = $("#button-last")
const $pageNumber = $("#page-number")
const totalPages = 42;

//variables y arrays 
const bat = [];
const cantidadBats = 5;
const repulsionStrength = 300;

let elements = []
let totalElements = []
let arrayCharactersDetails = []
let arrayEpisodesDetails = [];
let totalarrayEpisodes = []
let currentPage = 1;
let selectType = "character"
let selectStatus = ""
let selectGender = ""
let filterName = ""
let characterId = ""





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

    selectStatus = $inputStatus.value;
    selectGender = $inputGender.value;

    currentPage = 1;
    $pageNumber.textContent = currentPage;

    obtenerDatos(currentPage);
  });


$inputType.addEventListener("change", () => {
    selectType = $inputType.value;
    console.log("Tipo seleccionado:", selectType);
    
    if (selectType === "episode") {
      $containerInputStatus.classList.add("hidden");
      $containerInputGender.classList.add("hidden");
    } else {
      $containerInputStatus.classList.remove("hidden");
      $containerInputGender.classList.remove("hidden");
    }
});  

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

        if (error.response && error.response.status === 404) {
            $containerCards.innerHTML = `<div class="text-center font-bold text-lg py-4">No se han encontrado resultados</div>`;
            $cantidadResultados.textContent = "0";
        }
    }
}

async function obtenerDetailsPersonajes(characterId) {

    try {

        arrayEpisodesDetails = [];

        const { data } = await axios(`https://rickandmortyapi.com/api/character/${characterId}`);

        for (const element of data.episode) {
            try {
             
             const { data: episodeData } = await axios(element);
             console.log(episodeData);
             arrayEpisodesDetails.push(episodeData);
             
            } catch (error) {
                console.log(error);
          }
       }
    } catch (error) {
        console.log(error);
    }
}

async function obtenerDetailsEpisodios(episodeId) {

    try {

        arrayCharactersDetails = [];

        const { data } = await axios(`https://rickandmortyapi.com/api/episode/${episodeId}`)

        for (const element of data.characters) {
            try {

            const { data: characterData } = await axios(element);
            console.log(characterData);
            arrayCharactersDetails.push(characterData);

            } catch(error) {
            console.log('no puedo perro')
            }
        }
    } catch(error) {
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
                <article id="${episodio.id}"  class="detail-episode w-full h-32 mb-8 p-4 sm:w-1/4 md:w-1/4 lg:w-1/5 xl:w-1/6 2xl:w-[calc(100%/7)] flex flex-col border border-solid border-negro  transform transition duration-300 hover:scale-105 hover:bg-rojo hover:border-transparent cursor-pointer">
                    <h3 class="h-18 mx-2 font-sofia font-sofia-800">Episodio N° ${episodio.id}</h3>    
                    <h3 class="mx-2 h-18 font-sofia font-sofia-500 hover:cursor-pointer">${episodio.name}</h3>
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
            characterId = card.getAttribute("id");

            const personaje = elements.find(personaje => personaje.id.toString() === characterId);

            $containerCards.classList.remove("flex");
            $containerCards.classList.add("hidden");
    
            $containerDetailsPersonajes.classList.remove("hidden");
            $containerDetailsPersonajes.classList.add("flex"); 

            $containerCards.classList.add("hidden");
            $buttonFirst.classList.add("hidden");
            $buttonPrevious.classList.add("hidden");
            $buttonNext.classList.add("hidden");
            $buttonLast.classList.add("hidden");
            $pageNumber.classList.add("hidden");

            pintarDatosPersonajes(personaje)
        }
    });
    
}


function clicEpisode() {

    $containerCards.addEventListener("click", (event) => {

        if (event.target.closest(".detail-episode")) {

            const card = event.target.closest("article");  
            episodeId= card.getAttribute("id");

            const episodio = elements.find(episodio => episodio.id.toString() === episodeId);

            $containerCards.classList.add("hidden");
            $containerDetailsEpisodios.classList.remove("hidden");
            $containerDetailsEpisodios.classList.add("flex");

            $buttonFirst.classList.add("hidden");
            $buttonPrevious.classList.add("hidden");
            $buttonNext.classList.add("hidden");
            $buttonLast.classList.add("hidden");
            $pageNumber.classList.add("hidden");

            pintarDatosepisodios(episodio)
        }
    });
  }



async function pintarDatosPersonajes(personaje) {

    $containerDetailsPersonajes.innerHTML = `
        <div class="flex flex-col m-auto gap-12 sm:w-1/2 md:w-1/2 sm:flex-col lg:w-1/2 lg:m-auto">
            <div class="flex flex-col m-auto">
                <img src="${personaje.image}" alt="${personaje.name}" class=" bg-negro">
            </div>
            <div class="md:">
                <h1 class="font-sofia font-sofia-800 text-3xl mt-4 text-negro text-center">${personaje.name}</h1>
                <div class="flex flex-row  justify-between my-4">
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

        <!-- Contenedor de episodios -->

        <div id="episodes-container">
            <div class="mt-8">
                <h1 class="font-sofia font-sofia-800 text-2xl mb-4 mt-14 text-negro md:text-center lg:text-center">Episodios relacionados</h1>
            </div>
      
            <div id="container-episodes" class="w-full py-8 h-fit sm:flex-wrap flex flex-col sm:flex-row sm:justify-between sm:gap-2"></div>
        </div>
  `;
       
    await obtenerDetailsPersonajes(personaje.id);

    const containerCardsEpisodes = document.getElementById("container-episodes");
                    
    for (const episode of arrayEpisodesDetails) {
                
        containerCardsEpisodes.innerHTML += `
        
            <article id="card-comic" class="detail-episode w-full h-32 mb-8 p-4 sm:w-1/4 md:w-1/4 lg:w-1/5 xl:w-1/6 2xl:w-[calc(100%/7)] flex flex-col border border-solid border-negro  transform transition duration-300 hover:scale-105 hover:bg-rojo hover:border-transparent cursor-pointer">
                <h3 class="h-18 mx-2 font-sofia font-sofia-800">Episodio N° ${episode.id}</h3>    
                <h3 class="mx-2 h-18 font-sofia font-sofia-500 hover:cursor-pointer">${episode.name}</h3>
            </article>
        `
    }
}


async function pintarDatosepisodios(episodio) {

    $containerDetailsEpisodios.innerHTML = `
        <div class="flex flex-col m-auto gap-12 sm:w-1/2 md:w-1/2 sm:flex-col lg:w-1/2 lg:m-auto">
            <div>
                <h1 class="font-sofia font-sofia-800 text-3xl mt-4 text-negro text-center">${episodio.name}</h1>
                <div class="flex flex-row  justify-between my-4">
                    <h2 class="font-sofia font-sofia-800">Episodio</h2>
                    <h2 class="font-sofia font-sofia-500">${episodio.episode}</h2>
                </div>

                <img class="non-scaling" src="./assets/svg/linea.svg" alt="">

                <div class="flex flex-row justify-between my-4">
                    <h2 class="font-sofia font-sofia-800">Fecha de estreno</h2>
                    <h2 class="font-sofia font-sofia-500">${episodio.air_date}</h2>
                </div>

                <img class="non-scaling" src="./assets/svg/linea.svg" alt="">

            </div>
        </div>

         <!-- Contenedor de episodios -->

        <div>
            <div class="mt-8">
                <h1 class="font-sofia font-sofia-800 text-2xl mb-4 mt-14 text-negro md:text-center lg:text-center">Personajes relacionados</h1>
            </div>
      
            <div id="container-characters" class="w-full py-8 h-fit sm:flex-wrap flex flex-col sm:flex-row sm:justify-between sm:gap-2"></div>
        </div>

    `
}

//----------------- funciones paginacion-----------------------------------------------


function actualizarBotonesPaginacion() {
    
    if (currentPage <= 1) {
      $buttonPrevious.disabled = true;
      $buttonPrevious.classList.add("opacity-50", "cursor-not-allowed");
      $buttonFirst.disabled = true;
      $buttonFirst.classList.add("opacity-50", "cursor-not-allowed");
    } else {
      $buttonPrevious.disabled = false;
      $buttonPrevious.classList.remove("opacity-50", "cursor-not-allowed");
      $buttonFirst.disabled = false;
      $buttonFirst.classList.remove("opacity-50", "cursor-not-allowed");
      
    }
    
    if (currentPage >= 42) {
      $buttonNext.disabled = true;
      $buttonNext.classList.add("opacity-50", "cursor-not-allowed");
    } else {
      $buttonNext.disabled = false;
      $buttonNext.classList.remove("opacity-50", "cursor-not-allowed");
    }
}

$buttonNext.addEventListener("click", async () => {

    if (currentPage === totalPages) {
        $containerCards.innerHTML = `<div class="text-center font-bold text-lg py-4">No hay más resultados</div>`;
        return;
      }
    
    $containerCards.innerHTML = "";
    cargandoDatos()

    currentPage += 1

    try {
        const {data} = await axios(`https://rickandmortyapi.com/api/${selectType}?page=${currentPage}&status=${selectStatus}&gender=${selectGender}&name=${filterName}`, {    
        });

        elements = data.results
        pintarDatos(elements)
        $pageNumber.textContent = currentPage
        actualizarBotonesPaginacion();
    } catch (error) {
        console.error("Error al cargar los comics")
    }
})

$buttonPrevious.addEventListener("click", async () => {

    if (currentPage <= 1) {
        $pageNumber.textContent = 1;
        actualizarBotonesPaginacion();
        return;
      }
      
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

    if (currentPage === totalPages) {
        $containerCards.innerHTML = `<div class="text-center font-bold text-lg py-4">No hay más resultados</div>`;
        return;
      }
    
    $containerCards.innerHTML = "";
    cargandoDatos()
    
    currentPage = totalPages
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

    if (currentPage <= 1) {
        $pageNumber.textContent = 1;
        actualizarBotonesPaginacion();
        return;
    }
    
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
    clicEpisode() 

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
const $ = element => document.querySelector(element);
const $$ = element => document.querySelectorAll(element)


//selectores hero
const $batContainer = $("#bat-container");

//selectores form
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
const $buttonFirst = ("#button-first")
const $buttonPrevious = ("#button-previous")
const $buttonNext = ("#button-Next")
const $buttonLast = ("#button-last")
const $pageNumber = ("#page-number")

//variables y arrays 
const bat = [];
const cantidadBats = 15;
const repulsionStrength = 300;

const ts = new Date().getTime();
const publicKey = "724ede1a75e8d29e8901818d0a0b5078";
const privateKey = "1a97a4c08a9a9cb77917012c60208da5908a07d2";
const hash = md5(ts + privateKey + publicKey);

let comicData = []

let currentPage = 1

//eventos

window.addEventListener("mousemove", (event) => {
    window.mouseX = event.clientX;
    window.mouseY = event.clientY;
});

// ---------- funciones--------------------------------------------

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

async function obtenerDatos() {

    

    try {
        const {data} = await axios(`https://gateway.marvel.com/v1/public/comics?ts=${ts}&apikey=${publicKey}&hash=${hash}`, {    
        });

        comicData = data.data.results;
        console.log(comicData);
    } catch (error) {
        console.error("Error al cargar los comics")
    }

}

function pintarDatos(arrayComic) {


    $containerCards.innerHTML = "";
    

    for (const comic of arrayComic) {

        const imageUrl = comic.thumbnail.path + '/portrait_uncanny.' + comic.thumbnail.extension;

        $containerCards.innerHTML += `
            <article id="card-comic" class="w-full h-fit mb-8 sm:w-1/4 sm:justify-between md:w-1/4 ">
                    <img class="h-96 w-full bg-amarillo sm:h-56 md:h-72" src="${imageUrl}" alt="">
                    <h3 class="h-16 m-2 font-sofia font-sofia-500 sm:h-28 sm:mt-2 ">${comic.title}</h3>
                    <img class="non-scaling" src="./assets/svg/linea-amarilla.svg" alt="">
            </article>
        `
    }
}

window.onload = async () => {
    interaccionBats();
    await obtenerDatos();
    pintarDatos(comicData);

   
};







// public key

// 724ede1a75e8d29e8901818d0a0b5078


// private key

// 1a97a4c08a9a9cb77917012c60208da5908a07d2

// https://gateway.marvel.com/v1/public/comics?ts={{ts}}&hash={{hash}}
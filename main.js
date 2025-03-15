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

let currentPage = 1
let comic = []
let characters = []

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
                obj.vx += Math.cos(angle) * force * 3;
                obj.vy += Math.sin(angle) * force * 3;
    
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

function pintarDatos(arrayComics, ArrayCharacters) {

}

window.onload = () => {
    interaccionBats();
};
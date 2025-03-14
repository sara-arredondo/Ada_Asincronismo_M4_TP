const $ = element => document.querySelector(element);
const $$ = element => document.querySelectorAll(element)


const $batContainer = $("#bat-container");

let bat = [];
let cantidadBats = 40;
let repulsionStrength = 200;

// Función para obtener y colocar imágenes en el DOM
function obtenerBats() {
    for (let i = 0; i < cantidadBats; i++) {
        let img = document.createElement("img");
        img.src = "./assets/img/bat.png"; // Asegúrate de que la ruta es correcta
        img.classList.add("absolute", "w-24", "h-24"); // Usando clases de Tailwind
        
        // Posicionamiento aleatorio dentro del hero
        img.style.position = "absolute";
        img.style.left = `${Math.random() * window.innerWidth * 0.8}px`;
        img.style.top = `${Math.random() * window.innerHeight * 0.5}px`;
        img.style.transition = "transform 0.1s linear";

        $batContainer.appendChild(img); // Agregar imagen al contenedor

        bat.push({
            el: img,
            x: parseFloat(img.style.left),
            y: parseFloat(img.style.top),
            vx: 0,
            vy: 0
        });
    }
}

// Función para animar los bats
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

// Capturar la posición del mouse globalmente
window.addEventListener("mousemove", (event) => {
    window.mouseX = event.clientX;
    window.mouseY = event.clientY;
});

// Iniciar el script cuando el DOM esté cargado
window.onload = () => {
    obtenerBats();
    pintarBats();
};
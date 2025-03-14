const $ = element => document.querySelector(element);
const $$ = element => document.querySelectorAll(element)


const $batContainer = $("#bat-container");

let bat = [];
let cantidadBats = 50;
let repulsionStrength = 100;

// Definir el centro y radio de la circunferencia
let cx = window.innerWidth / 2; // Centro X en el medio de la pantalla
let cy = window.innerHeight / 2; // Centro Y en la mitad de la pantalla
let radius = 100; // Radio de la circunferencia

// Función para obtener y colocar imágenes en la circunferencia
function obtenerBats() {
    for (let i = 0; i < cantidadBats; i++) {
        let theta = (i / cantidadBats) * 2 * Math.PI; // Distribuir en el círculo

        let x = cx + radius * Math.cos(theta);
        let y = cy + radius * Math.sin(theta);

        let img = document.createElement("img");
        img.src = "./assets/img/bat.png"; // Ruta de la imagen
        img.alt = "bat-icon";
        img.classList.add("absolute", "w-24", "h-24"); // Clases de Tailwind
        
        // Posicionamiento inicial en la circunferencia
        img.style.position = "absolute";
        img.style.left = `${x}px`;
        img.style.top = `${y}px`;
        img.style.transition = "transform 0.2s ease-out";

        $batContainer.appendChild(img); // Agregar imagen al contenedor

        bat.push({
            el: img,
            x: x,
            y: y,
            vx: 0,
            vy: 0
        });
    }
}

// Función para animar los bats con repulsión y rotación
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
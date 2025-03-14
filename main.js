const $ = element => document.querySelector(element);
const $$ = element => document.querySelectorAll(element)

const $batContainer = $("#bat-container");

let bat = [];
let cantidadBats = 15;
let repulsionStrength = 200;

function interaccionBats() {
    bat = []; // Limpiar el array de murciélagos
    $batContainer.innerHTML = ""; // Limpiar el contenedor antes de agregar nuevos murciélagos

    // Obtener el contenedor hero y sus dimensiones
    const hero = $(".bg-fixed"); // Selecciona el hero con parallax
    function obtenerDimensionesHero() {
        return hero.getBoundingClientRect();
    }

    let { width: contWidth, height: contHeight, top: contTop } = obtenerDimensionesHero();
    let contLeft = hero.offsetLeft;

    function obtenerBats() {
        for (let i = 0; i < cantidadBats; i++) {
            let x = Math.random() * contWidth;
            let y = Math.random() * contHeight;
            let initialRotation = Math.random() * 360;

            let img = document.createElement("img");
            img.src = "./assets/img/bat.png";
            img.classList.add("absolute", "w-36", "h-36");

            img.style.position = "absolute";
            img.style.left = `${x}px`;
            img.style.top = `${y}px`;
            img.style.transform = `rotate(${initialRotation}deg)`;
            img.style.transition = "transform 0.2s ease-out";

            $batContainer.appendChild(img);

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

    function pintarBats(mouseX, mouseY) {
        for (let obj of bat) {
            let dx = obj.x - mouseX;
            let dy = obj.y - mouseY;
            let distance = Math.sqrt(dx * dx + dy * dy);

            if (distance < repulsionStrength) {
                let angle = Math.atan2(dy, dx);
                let force = (repulsionStrength - distance) / repulsionStrength;
                obj.vx += Math.cos(angle) * force * 3;
                obj.vy += Math.sin(angle) * force * 3;

                let rotationAngle = (angle * (180 / Math.PI)) + 90;
                obj.el.style.transform = `rotate(${rotationAngle}deg)`;
            }

            obj.vx *= 0.9;
            obj.vy *= 0.9;

            obj.x = Math.min(Math.max(obj.x + obj.vx, 0), contWidth - 48);
            obj.y = Math.min(Math.max(obj.y + obj.vy, 0), contHeight - 48);

            obj.el.style.left = `${obj.x}px`;
            obj.el.style.top = `${obj.y}px`;
        }

        requestAnimationFrame(() => pintarBats(mouseX, mouseY));
    }

    obtenerBats();

    // Actualizar la posición del bat-container cuando se hace scroll
    window.addEventListener("scroll", () => {
        let { top } = obtenerDimensionesHero();
        $batContainer.style.top = `${top + window.scrollY}px`; // Ajusta el contenedor de los murciélagos
    });

    // Detectar interacción del mouse dentro del hero
    hero.addEventListener("mousemove", (event) => {
        let { left, top } = obtenerDimensionesHero();
        let mouseX = event.clientX - left;
        let mouseY = event.clientY - top;
        pintarBats(mouseX, mouseY);
    });

    pintarBats();
}

// Iniciar la interacción cuando el DOM esté listo
window.onload = () => {
    interaccionBats();
};


const fondo = document.getElementById("fondo");
const panel = document.getElementById("panel");
const btnNo = document.getElementById("btn-no");
const btnSi = document.getElementById("btn-si");

function abrir() {
    fondo.classList.add("abierto");
    panel.classList.add("abierto");
}

function cerrar() {
    fondo.classList.remove("abierto");
    panel.classList.remove("abierto");
}

abrir();
btnNo.addEventListener("click", cerrar);

abrir();
btnSi.addEventListener("click", cerrar);
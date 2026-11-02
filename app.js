// ---------- Día de la semana ----------
const dias = ["Domingo", "Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado"];
document.getElementById("dia").textContent = dias[new Date().getDay()];

// ---------- Ventana de ayuda ----------
const fondo = document.getElementById("fondo");
const panel = document.getElementById("panel");
const btnSi = document.getElementById("btn-si");
const btnNo = document.getElementById("btn-no");
const btnNunca = document.getElementById("btn-nunca");
const btnCerrar = document.getElementById("btn-cerrar");

// Guardar y leer preferencias. El try/catch evita errores
// si el navegador bloquea el almacenamiento (ej. modo privado).
function guardar(almacen, clave) {
    try { almacen.setItem(clave, "si"); } catch (e) {}
}
function leer(almacen, clave) {
    try { return almacen.getItem(clave) === "si"; } catch (e) { return false; }
}

function abrir() {
    fondo.classList.add("abierto");
    panel.classList.add("abierto");
    btnSi.focus();
}

function cerrar() {
    fondo.classList.remove("abierto");
    panel.classList.remove("abierto");
}

// "Ahorita no": no vuelve a salir en esta sesión (sessionStorage se borra al cerrar la pestaña)
btnNo.addEventListener("click", function () {
    guardar(sessionStorage, "lonchi-ahorita-no");
    cerrar();
});

// "Solo cuando yo lo pida": no vuelve a salir sola nunca (localStorage se queda guardado)
btnNunca.addEventListener("click", function () {
    guardar(localStorage, "lonchi-solo-si-pido");
    cerrar();
});

// Por ahora "Sí" solo cierra; los pasos 2 y 3 vienen después
btnSi.addEventListener("click", cerrar);
btnCerrar.addEventListener("click", cerrar);
fondo.addEventListener("click", cerrar);
document.addEventListener("keydown", function (e) {
    if (e.key === "Escape") cerrar();
});

// Abrir al entrar, solo si no dijo que no
if (!leer(sessionStorage, "lonchi-ahorita-no") && !leer(localStorage, "lonchi-solo-si-pido")) {
    abrir();
}

// ---------- Día de la semana ----------
const dias = ["Domingo", "Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado"];
document.getElementById("dia").textContent = dias[new Date().getDay()];

// ---------- Datos del día (EJEMPLO, no son datos reales) ----------
// Más adelante esto vendrá de lo que registres. Por ahora cambia
// estos números para probar cómo se llena la lonchera.
const hoy = {
    kcalMeta: 1600,
    kcalComidas: 1180,
    protMeta: 90,
    protComidas: 62
};

// ---------- Lonchera ----------
function formato(n) {
    return n.toLocaleString("es-MX");
}

function pintarLonchera() {
    const lleno = Math.min(hoy.kcalComidas / hoy.kcalMeta, 1); // nunca más de 1 (100 %)
    const quedan = Math.max(hoy.kcalMeta - hoy.kcalComidas, 0);
    const porcentaje = Math.round(lleno * 100);

    document.getElementById("kcal-quedan").textContent = formato(quedan);
    document.getElementById("kcal-meta").textContent = formato(hoy.kcalMeta) + " kcal";
    document.getElementById("lonchera-porcentaje").textContent = porcentaje + " % llena";

    const svg = document.getElementById("lonchera");
    svg.setAttribute("aria-valuemax", hoy.kcalMeta);
    svg.setAttribute("aria-valuenow", hoy.kcalComidas);
    svg.setAttribute("aria-valuetext", "Llevas " + formato(hoy.kcalComidas) + " de " + formato(hoy.kcalMeta) + " kcal");

    // Esperamos un instante para que se vea la animación de llenado
    requestAnimationFrame(function () {
        setTimeout(function () {
            svg.style.setProperty("--lleno", lleno);
        }, 50);
    });

    // Proteína
    const prot = Math.min(hoy.protComidas / hoy.protMeta, 1);
    document.getElementById("prot-texto").textContent =
        "llevas " + hoy.protComidas + " de " + hoy.protMeta + " g (ejemplo)";
    document.getElementById("prot-relleno").style.width = (prot * 100) + "%";
    const barra = document.getElementById("prot-barra");
    barra.setAttribute("aria-valuemax", hoy.protMeta);
    barra.setAttribute("aria-valuenow", hoy.protComidas);
}

pintarLonchera();

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

let focoAnterior = null; // botón que abrió la ventana, para regresar ahí al cerrar

function abrir() {
    focoAnterior = document.activeElement;
    fondo.classList.add("abierto");
    panel.classList.add("abierto");
    btnSi.focus();
}

function cerrar() {
    fondo.classList.remove("abierto");
    panel.classList.remove("abierto");
    if (focoAnterior && focoAnterior !== document.body) focoAnterior.focus();
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

// Botones de inicio: siempre abren la ayuda (aunque haya elegido
// "solo cuando yo lo pida", porque aquí sí la está pidiendo).
// Por ahora "Estoy en la tienda" abre el mismo paso 1; luego irá directo a lugar/opciones.
document.getElementById("btn-que-como").addEventListener("click", abrir);
document.getElementById("btn-tienda").addEventListener("click", abrir);

// ---------- ¿Dónde estás? ----------
const botonesLugar = document.querySelectorAll(".lugar");
const lugarTexto = document.getElementById("lugar-texto");

botonesLugar.forEach(function (boton) {
    boton.addEventListener("click", function () {
        // Desmarcar todos y marcar solo el que tocó
        botonesLugar.forEach(function (b) { b.setAttribute("aria-pressed", "false"); });
        boton.setAttribute("aria-pressed", "true");
        const lugar = boton.dataset.lugar; // viene de data-lugar="..."
        try { sessionStorage.setItem("lonchi-lugar", lugar); } catch (e) {}
        lugarTexto.textContent = "Estás en " + lugar + ". Las opciones de aquí llegan pronto.";
    });
});

// Si ya había elegido lugar en esta sesión, lo volvemos a marcar
try {
    const guardado = sessionStorage.getItem("lonchi-lugar");
    botonesLugar.forEach(function (b) {
        if (b.dataset.lugar === guardado) b.click();
    });
} catch (e) {}

// Abrir al entrar, solo si no dijo que no
if (!leer(sessionStorage, "lonchi-ahorita-no") && !leer(localStorage, "lonchi-solo-si-pido")) {
    abrir();
}

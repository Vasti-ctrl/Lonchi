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
const btnAtras = document.getElementById("btn-atras");

// Guardar y leer preferencias. El try/catch evita errores
// si el navegador bloquea el almacenamiento (ej. modo privado).
function guardar(almacen, clave, valor) {
    try { almacen.setItem(clave, valor || "si"); } catch (e) {}
}
function leer(almacen, clave) {
    try { return almacen.getItem(clave); } catch (e) { return null; }
}

let focoAnterior = null; // botón que abrió la ventana, para regresar ahí al cerrar
let historial = [];      // pasos visitados, para el botón "Atrás"

// Muestra un paso y esconde los demás
function mostrarPaso(numero) {
    [1, 2, 3].forEach(function (n) {
        document.getElementById("paso-" + n).hidden = (n !== numero);
    });
    historial.push(numero);
    // "Atrás" solo aparece si hay un paso anterior al cual regresar
    btnAtras.hidden = historial.length < 2;
    // El lector de pantalla anuncia el título del paso actual
    panel.setAttribute("aria-labelledby", "titulo-paso-" + numero);
    document.getElementById("titulo-paso-" + numero).focus();
}

function abrir(paso) {
    focoAnterior = document.activeElement;
    historial = [];
    fondo.classList.add("abierto");
    panel.classList.add("abierto");
    mostrarPaso(paso || 1);
}

function cerrar() {
    fondo.classList.remove("abierto");
    panel.classList.remove("abierto");
    if (focoAnterior && focoAnterior !== document.body) focoAnterior.focus();
}

btnAtras.addEventListener("click", function () {
    historial.pop();                  // quitamos el paso actual
    const anterior = historial.pop(); // y regresamos al anterior (mostrarPaso lo vuelve a guardar)
    mostrarPaso(anterior);
});

// Paso 1
document.getElementById("btn-si").addEventListener("click", function () {
    mostrarPaso(2);
});

// "Ahorita no": no vuelve a salir en esta sesión (sessionStorage se borra al cerrar la pestaña)
document.getElementById("btn-no").addEventListener("click", function () {
    guardar(sessionStorage, "lonchi-ahorita-no");
    cerrar();
});

// "Solo cuando yo lo pida": no vuelve a salir sola nunca (localStorage se queda guardado)
document.getElementById("btn-nunca").addEventListener("click", function () {
    guardar(localStorage, "lonchi-solo-si-pido");
    cerrar();
});

// Paso 2: al elegir lugar, pasamos a las opciones
document.querySelectorAll("#lugares-panel .lugar").forEach(function (boton) {
    boton.addEventListener("click", function () {
        elegirLugar(boton.dataset.lugar);
        mostrarOpciones(boton.dataset.lugar);
    });
});

// Paso 3: pinta las opciones de ese lugar (la mejor primero)
function mostrarOpciones(lugar) {
    document.getElementById("opciones-lugar").textContent = lugar;
    const lista = document.getElementById("opciones");
    lista.innerHTML = ""; // vaciar la lista anterior

    const opciones = (opcionesEjemplo[lugar] || []).slice(); // copia para no cambiar el original
    opciones.sort(function (a, b) { return (b.mejor ? 1 : 0) - (a.mejor ? 1 : 0); });

    opciones.forEach(function (op) {
        const li = document.createElement("li");
        li.className = op.mejor ? "opcion mejor" : "opcion";
        // textContent (y no innerHTML) para que ningún texto se interprete como código
        if (op.mejor) {
            const insignia = document.createElement("span");
            insignia.className = "insignia";
            insignia.textContent = "⭐ Mejor opción";
            li.appendChild(insignia);
        }
        const nombre = document.createElement("p");
        nombre.className = "opcion-nombre";
        nombre.textContent = op.nombre;
        const datos = document.createElement("p");
        datos.className = "opcion-datos";
        datos.textContent = op.kcal + " kcal · " + op.proteina + " g proteína (ej.)";
        li.appendChild(nombre);
        li.appendChild(datos);
        lista.appendChild(li);
    });

    mostrarPaso(3);
}

document.getElementById("btn-listo").addEventListener("click", cerrar);
document.getElementById("btn-cerrar").addEventListener("click", cerrar);
fondo.addEventListener("click", cerrar);
document.addEventListener("keydown", function (e) {
    if (e.key === "Escape" && panel.classList.contains("abierto")) cerrar();
});

// Botones de inicio: siempre abren la ayuda (aunque haya elegido
// "solo cuando yo lo pida", porque aquí sí la está pidiendo).
// Van directo al paso 2 porque ya pidió ayuda.
document.getElementById("btn-que-como").addEventListener("click", function () { abrir(2); });
document.getElementById("btn-tienda").addEventListener("click", function () { abrir(2); });

// ---------- ¿Dónde estás? (tarjeta en Hoy) ----------
const botonesLugar = document.querySelectorAll("#lugares .lugar");
const lugarTexto = document.getElementById("lugar-texto");

// Marca el lugar en la tarjeta de Hoy y lo guarda en la sesión
function elegirLugar(lugar) {
    botonesLugar.forEach(function (b) {
        b.setAttribute("aria-pressed", b.dataset.lugar === lugar ? "true" : "false");
    });
    guardar(sessionStorage, "lonchi-lugar", lugar);
    lugarTexto.textContent = "Estás en " + lugar + ".";
}

botonesLugar.forEach(function (boton) {
    boton.addEventListener("click", function () {
        elegirLugar(boton.dataset.lugar);
        // Abrimos la ventana directo en las opciones de ese lugar
        focoAnterior = boton;
        historial = [2]; // así "Atrás" lleva a elegir otro lugar
        fondo.classList.add("abierto");
        panel.classList.add("abierto");
        mostrarOpciones(boton.dataset.lugar);
    });
});

// Si ya había elegido lugar en esta sesión, lo volvemos a marcar (sin abrir la ventana)
const lugarGuardado = leer(sessionStorage, "lonchi-lugar");
if (lugarGuardado) elegirLugar(lugarGuardado);

// ---------- Antojómetro ----------
// Cada nivel tiene su carita, su nombre y un mensaje (sin regaños).
const nivelesAntojo = {
    1: { carita: "😌", nombre: "Nada", mensaje: "¡Bien! Si te da hambre, pícale a \"¿Qué como ahorita?\"." },
    2: { carita: "🙂", nombre: "Poquito", mensaje: "Un antojito. A veces con agua o algo con proteína se pasa." },
    3: { carita: "😋", nombre: "Medio", mensaje: "Un gusto chiquito puede caber hoy." },
    4: { carita: "😍", nombre: "Bastante", mensaje: "Mejor un gusto planeado que uno a escondidas. Te ayudo a elegir." },
    5: { carita: "🤤", nombre: "¡Muchísimo!", mensaje: "Va, se vale. Busquemos uno que casi no mueva tu plan, o la porción chica." }
};

const antojometro = document.getElementById("antojometro");
const antojoCarita = document.getElementById("antojo-carita");

function pintarAntojo() {
    const nivel = nivelesAntojo[antojometro.value];
    antojoCarita.textContent = nivel.carita;
    document.getElementById("antojo-nivel").textContent = nivel.nombre;
    document.getElementById("antojo-mensaje").textContent = nivel.mensaje;
    // Para el lector de pantalla: dice "Medio" en vez de "3"
    antojometro.setAttribute("aria-valuetext", nivel.nombre);
    try { sessionStorage.setItem("lonchi-antojo", antojometro.value); } catch (e) {}

    // Brinquito: poner la clase y quitarla al ratito
    antojoCarita.classList.add("brinca");
    setTimeout(function () { antojoCarita.classList.remove("brinca"); }, 200);
}

// "input" se dispara mientras arrastras, no solo al soltar
antojometro.addEventListener("input", pintarAntojo);

try {
    const antojoGuardado = sessionStorage.getItem("lonchi-antojo");
    if (antojoGuardado) antojometro.value = antojoGuardado;
} catch (e) {}
pintarAntojo();

// ---------- Gusto ----------
const gustoRespuesta = document.getElementById("gusto-respuesta");

document.getElementById("btn-gusto-si").addEventListener("click", function () {
    let lugar = null;
    try { lugar = sessionStorage.getItem("lonchi-lugar"); } catch (e) {}
    if (lugar) {
        gustoRespuesta.textContent = "Va. Pronto aquí te muestro gustos de " + lugar + " que casi no afectan tu plan.";
    } else {
        gustoRespuesta.textContent = "Va. Primero dime dónde estás (arriba) y te muestro opciones.";
    }
});

document.getElementById("btn-gusto-no").addEventListener("click", function () {
    gustoRespuesta.textContent = "Perfecto. Aquí sigo si cambias de opinión.";
});

// Abrir al entrar, solo si no dijo que no
if (!leer(sessionStorage, "lonchi-ahorita-no") && !leer(localStorage, "lonchi-solo-si-pido")) {
    abrir(1);
}

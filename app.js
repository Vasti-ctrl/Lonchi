// =============================================================
// Lonchi — app.js
// Secciones (en orden):
//   1. Utilidades
//   2. Estado guardado (lo que comiste, tu meta, racha, mascota)
//   3. Lonchera
//   4. Lo que llevas hoy
//   5. Mascota
//   6. Mi meta
//   7. Racha y "Cerrar mi día"
//   8. Pestañas
//   9. Antojos
//  10. Ventana de ayuda
//  11. ¿Dónde estás?
//  12. Antojómetro y gusto
//  13. Arranque
// =============================================================


// ---------- 1. Utilidades ----------
function $(id) {
    return document.getElementById(id);
}

const sinMovimiento = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

function formato(n) {
    return Math.round(n).toLocaleString("es-MX");
}

// Fecha como texto "2026-11-04" (en tu hora local)
function fechaLocal(fecha) {
    const d = fecha || new Date();
    return d.getFullYear() + "-" +
        String(d.getMonth() + 1).padStart(2, "0") + "-" +
        String(d.getDate()).padStart(2, "0");
}

function fechaAyer() {
    const d = new Date();
    d.setDate(d.getDate() - 1);
    return fechaLocal(d);
}

// Guardar y leer valores sueltos. El try/catch evita errores
// si el navegador bloquea el almacenamiento (ej. modo privado).
function guardar(almacen, clave, valor) {
    try { almacen.setItem(clave, valor || "si"); } catch (e) {}
}
function leer(almacen, clave) {
    try { return almacen.getItem(clave); } catch (e) { return null; }
}

// Vuelve a disparar una animación CSS aunque ya se haya usado antes
function reiniciarAnimacion(elemento, clase) {
    elemento.classList.remove(clase);
    void elemento.getBoundingClientRect(); // obliga al navegador a "olvidar" la animación anterior
    elemento.classList.add(clase);
}

// Cuenta de un número a otro poco a poco (para que se vea cómo cambian las kcal)
function animarNumero(elemento, desde, hasta, ms) {
    if (sinMovimiento) { elemento.textContent = formato(hasta); return; }
    const inicio = performance.now();
    function paso(ahora) {
        const avance = Math.min((ahora - inicio) / ms, 1);
        elemento.textContent = formato(desde + (hasta - desde) * avance);
        if (avance < 1) requestAnimationFrame(paso);
    }
    requestAnimationFrame(paso);
}

const dias = ["Domingo", "Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado"];
$("dia").textContent = dias[new Date().getDay()];


// ---------- 2. Estado guardado ----------
// Todo lo que la app recuerda vive en este objeto y se guarda en
// localStorage como texto (JSON). Así sigue ahí aunque cierres la app.
const CLAVE_ESTADO = "lonchi-estado-v1";
const PROT_META = 90; // EJEMPLO: meta de proteína fija por ahora

function estadoInicial() {
    return {
        fecha: fechaLocal(),   // día al que pertenecen las comidas
        comidas: [],           // [{ nombre, emoji, kcal, proteina }]
        objetivo: "bajar",     // "bajar", "ordenado" o "musculo"
        kcalMeta: 1600,        // EJEMPLO
        racha: 0,
        ultimoCierre: null,    // fecha del último "Cerrar mi día"
        mascota: { nombre: "Chispa", color: "#FFC9A3" }
    };
}

function cargarEstado() {
    let e = estadoInicial();
    try {
        const texto = localStorage.getItem(CLAVE_ESTADO);
        if (texto) e = Object.assign(e, JSON.parse(texto));
    } catch (err) {}
    if (!Array.isArray(e.comidas)) e.comidas = [];
    // Día nuevo = lonchera nueva
    if (e.fecha !== fechaLocal()) {
        e.comidas = [];
        e.fecha = fechaLocal();
    }
    // Si no cerraste ni hoy ni ayer, la racha se reinicia
    if (e.ultimoCierre && e.ultimoCierre !== fechaLocal() && e.ultimoCierre !== fechaAyer()) {
        e.racha = 0;
    }
    return e;
}

function guardarEstado() {
    try { localStorage.setItem(CLAVE_ESTADO, JSON.stringify(estado)); } catch (err) {}
}

let estado = cargarEstado();

function totalKcal() {
    return estado.comidas.reduce(function (suma, c) { return suma + c.kcal; }, 0);
}
function totalProteina() {
    return estado.comidas.reduce(function (suma, c) { return suma + c.proteina; }, 0);
}


// ---------- 3. Lonchera ----------
const svgLonchera = $("lonchera");
const SVG_NS = "http://www.w3.org/2000/svg"; // los elementos de SVG se crean con este "espacio de nombres"

// Dibuja los emojis de lo que llevas (los últimos 6) asomándose por arriba
function pintarComidaEnLonchera() {
    const grupo = $("lonchera-comida");
    grupo.textContent = ""; // vaciar
    const ultimas = estado.comidas.slice(-6);
    ultimas.forEach(function (c, i) {
        const x = ultimas.length === 1 ? 70 : 30 + i * (80 / (ultimas.length - 1));
        const texto = document.createElementNS(SVG_NS, "text");
        texto.setAttribute("x", x.toFixed(1));
        texto.setAttribute("y", i % 2 === 0 ? 54 : 50);
        texto.setAttribute("text-anchor", "middle");
        texto.setAttribute("font-size", "22");
        texto.textContent = c.emoji || "🍽️";
        grupo.appendChild(texto);
    });
}

// quedanAntes: si viene, el número cuenta desde ahí
function pintarLonchera(quedanAntes) {
    const comido = totalKcal();
    const meta = estado.kcalMeta;
    const proporcion = comido / meta;
    const lleno = Math.min(proporcion, 1); // nunca más de 1 (100 %)
    const quedan = Math.max(meta - comido, 0);

    if (quedanAntes === undefined) {
        $("kcal-quedan").textContent = formato(quedan);
    } else {
        animarNumero($("kcal-quedan"), quedanAntes, quedan, 700);
    }
    $("kcal-meta").textContent = formato(meta) + " kcal";
    $("lonchera-porcentaje").textContent = Math.round(lleno * 100) + " % llena";

    svgLonchera.setAttribute("aria-valuemax", meta);
    svgLonchera.setAttribute("aria-valuenow", Math.min(comido, meta));
    svgLonchera.setAttribute("aria-valuetext", "Llevas " + formato(comido) + " de " + formato(meta) + " kcal");
    // Si te pasas más de 10 %, el relleno se pone naranja (sin regaño)
    svgLonchera.classList.toggle("pasada", proporcion > 1.1);

    pintarComidaEnLonchera();

    // --lleno mueve el relleno Y la tapa (0 = abierta y vacía, 1 = cerrada y llena)
    setTimeout(function () {
        svgLonchera.style.setProperty("--lleno", lleno);
    }, 50);

    // Proteína
    const prot = totalProteina();
    $("prot-texto").textContent = "llevas " + formato(prot) + " de " + PROT_META + " g (ejemplo)";
    $("prot-relleno").style.width = (Math.min(prot / PROT_META, 1) * 100) + "%";
    $("prot-barra").setAttribute("aria-valuemax", PROT_META);
    $("prot-barra").setAttribute("aria-valuenow", Math.min(prot, PROT_META));
}

// Confeti cuando la lonchera se cierra
function confeti() {
    if (sinMovimiento) return;
    const caja = $("lonchera-caja");
    const colores = ["var(--rosa)", "var(--naranja-pastel)", "var(--verde)", "#A8DDBF"];
    for (let i = 0; i < 16; i++) {
        const pedazo = document.createElement("i");
        pedazo.className = "confeti";
        pedazo.style.setProperty("--dx", Math.round(Math.random() * 200 - 100) + "px");
        pedazo.style.setProperty("--dy", Math.round(-60 - Math.random() * 80) + "px");
        pedazo.style.background = colores[i % colores.length];
        caja.appendChild(pedazo);
        setTimeout(function () { pedazo.remove(); }, 1100);
    }
}

// Cuando eliges algo (en la ayuda o en Antojos): vuelve a Hoy y anima la lonchera
function agregarALonchera(producto) {
    if (panel.classList.contains("abierto")) cerrar({ sinFoco: true });
    irA("hoy", { sinScroll: true });

    $("tarjeta-lonchera").scrollIntoView({ behavior: sinMovimiento ? "auto" : "smooth", block: "center" });
    $("titulo-lonchera").focus({ preventScroll: true });

    const meta = estado.kcalMeta;
    const antes = totalKcal();
    const quedanAntes = Math.max(meta - antes, 0);

    // Guardamos una copia con solo lo que necesitamos
    estado.comidas.push({
        nombre: producto.nombre,
        emoji: producto.emoji,
        kcal: producto.kcal,
        proteina: producto.proteina
    });
    guardarEstado();
    pintarLista();

    const espera = sinMovimiento ? 0 : 450;  // tiempo para que termine de subir la pantalla
    const caida = sinMovimiento ? 0 : 550;   // tiempo de la comida cayendo

    setTimeout(function () {
        if (!sinMovimiento) {
            $("comida-cae").textContent = producto.emoji || "🍽️";
            reiniciarAnimacion($("comida-cae"), "cayendo");
        }

        setTimeout(function () {
            pintarLonchera(quedanAntes);
            if (!sinMovimiento) {
                reiniciarAnimacion(svgLonchera, "apachurra");
                $("kcal-flota").textContent = "+" + producto.kcal + " kcal";
                reiniciarAnimacion($("kcal-flota"), "flotando");
            }
            $("lonchera-mensaje").textContent = "Agregaste " + producto.nombre + " (+" + producto.kcal + " kcal, ejemplo).";

            const ahora = totalKcal();
            if (antes < meta && ahora >= meta) {
                confeti();
                pintarMascota("¡Lonchera cerrada! Meta del día cubierta.");
            } else {
                pintarMascota();
            }
        }, caida);
    }, espera);
}


// ---------- 4. Lo que llevas hoy ----------
function pintarLista() {
    const lista = $("lista-comidas");
    lista.textContent = "";

    if (estado.comidas.length === 0) {
        const vacio = document.createElement("li");
        vacio.className = "vacio";
        vacio.textContent = "Aún no hay nada. Elige algo en Antojos o en “¿Qué como ahorita?”.";
        lista.appendChild(vacio);
        return;
    }

    estado.comidas.forEach(function (c, i) {
        const li = document.createElement("li");

        const emoji = document.createElement("span");
        emoji.className = "emoji";
        emoji.setAttribute("aria-hidden", "true");
        emoji.textContent = c.emoji || "🍽️";

        const nombre = document.createElement("span");
        nombre.textContent = c.nombre;

        const kcal = document.createElement("span");
        kcal.className = "kcal";
        kcal.textContent = c.kcal + " kcal";

        const quitar = document.createElement("button");
        quitar.className = "quitar";
        quitar.textContent = "×";
        quitar.setAttribute("aria-label", "Quitar " + c.nombre);
        quitar.addEventListener("click", function () { quitarComida(i); });

        li.append(emoji, nombre, kcal, quitar);
        lista.appendChild(li);
    });
}

function quitarComida(indice) {
    const quedanAntes = Math.max(estado.kcalMeta - totalKcal(), 0);
    const quitada = estado.comidas.splice(indice, 1)[0]; // splice saca 1 elemento en esa posición
    guardarEstado();
    pintarLista();
    pintarLonchera(quedanAntes);
    pintarMascota();
    $("lonchera-mensaje").textContent = "Quitaste " + quitada.nombre + ".";
    // El botón que tocaste ya no existe: movemos el foco al título de la lista
    $("titulo-lista").focus();
}


// ---------- 5. Mascota ----------
const coloresMascota = ["#FFC9A3", "#FF8FC4", "#8FD3AC", "#8FB8F0", "#B28DE0"];

function mascotaSVG(color) {
    // Solo aceptamos colores de nuestra lista (por si alguien cambia lo guardado)
    const c = coloresMascota.indexOf(color) > -1 ? color : coloresMascota[0];
    return '<svg viewBox="0 0 120 112">' +
        '<ellipse cx="60" cy="105" rx="34" ry="5" fill="#000" opacity=".12"/>' +
        '<circle cx="34" cy="30" r="14" fill="' + c + '"/><circle cx="86" cy="30" r="14" fill="' + c + '"/>' +
        '<circle cx="34" cy="31" r="7" fill="#fff" opacity=".55"/><circle cx="86" cy="31" r="7" fill="#fff" opacity=".55"/>' +
        '<ellipse cx="60" cy="64" rx="46" ry="40" fill="' + c + '" stroke="#26332C" stroke-width="3"/>' +
        '<ellipse cx="60" cy="77" rx="28" ry="21" fill="#fff" opacity=".45"/>' +
        '<circle cx="44" cy="58" r="5.5" fill="#1b1b1b"/><circle cx="76" cy="58" r="5.5" fill="#1b1b1b"/>' +
        '<circle cx="46" cy="56" r="1.8" fill="#fff"/><circle cx="78" cy="56" r="1.8" fill="#fff"/>' +
        '<ellipse cx="33" cy="70" rx="7" ry="4.5" fill="#E4007C" opacity=".35"/><ellipse cx="87" cy="70" rx="7" ry="4.5" fill="#E4007C" opacity=".35"/>' +
        '<path d="M52 70 Q60 78 68 70" fill="none" stroke="#1b1b1b" stroke-width="3" stroke-linecap="round"/>' +
        '<ellipse cx="42" cy="100" rx="10" ry="6" fill="' + c + '"/><ellipse cx="78" cy="100" rx="10" ry="6" fill="' + c + '"/>' +
        '</svg>';
}

function saludo() {
    const hora = new Date().getHours();
    if (hora < 12) return "¡Buenos días!";
    if (hora < 19) return "¡Buenas tardes!";
    return "¡Buenas noches!";
}

// Mensaje según cómo vas (reglas simples, siempre sin regañar)
function mensajeMascota() {
    const comido = totalKcal();
    const meta = estado.kcalMeta;
    const p = comido / meta;
    if (estado.comidas.length === 0) return saludo() + " Tu lonchera está vacía. ¿Qué te toca hoy?";
    if (p < 0.5) return "Vas bien, llevas " + formato(comido) + " kcal.";
    if (p < 1) return "Ya mero. Te quedan " + formato(meta - comido) + " kcal.";
    if (p <= 1.1) return "¡Lonchera cerrada! Meta del día cubierta.";
    return "Te pasaste un poquito. Sin culpa, mañana seguimos.";
}

function pintarMascota(mensajeEspecial) {
    $("mascota").innerHTML = mascotaSVG(estado.mascota.color);
    $("mascota-grande").innerHTML = mascotaSVG(estado.mascota.color);
    $("burbuja-nombre").textContent = estado.mascota.nombre;
    $("burbuja-texto").textContent = mensajeEspecial || mensajeMascota();
    if (!sinMovimiento) reiniciarAnimacion($("mascota"), "salta");
}


// ---------- 6. Mi meta ----------
const fichasObjetivo = document.querySelectorAll("[data-objetivo]");
const fichasKcal = document.querySelectorAll("[data-kcal]");

function pintarMeta() {
    fichasObjetivo.forEach(function (f) {
        f.setAttribute("aria-pressed", f.dataset.objetivo === estado.objetivo ? "true" : "false");
    });
    fichasKcal.forEach(function (f) {
        f.setAttribute("aria-pressed", Number(f.dataset.kcal) === estado.kcalMeta ? "true" : "false");
    });
}

fichasObjetivo.forEach(function (f) {
    f.addEventListener("click", function () {
        estado.objetivo = f.dataset.objetivo;
        guardarEstado();
        pintarMeta();
        pintarAntojos(); // el orden de los antojos depende de tu meta
    });
});

fichasKcal.forEach(function (f) {
    f.addEventListener("click", function () {
        const quedanAntes = Math.max(estado.kcalMeta - totalKcal(), 0);
        estado.kcalMeta = Number(f.dataset.kcal);
        guardarEstado();
        pintarMeta();
        pintarLonchera(quedanAntes);
        pintarMascota();
    });
});


// ---------- 7. Racha y "Cerrar mi día" ----------
function pintarRacha() {
    $("racha-num").textContent = estado.racha + (estado.racha === 1 ? " día" : " días");
}

$("btn-cerrar-dia").addEventListener("click", function () {
    if (estado.comidas.length === 0) {
        pintarMascota("Registra al menos algo para poder cerrar tu día.");
        return;
    }
    if (estado.ultimoCierre === fechaLocal()) {
        pintarMascota("Ya cerraste tu día de hoy. ¡Mañana seguimos!");
        return;
    }
    // Si cerraste ayer, la racha sigue; si no, empieza de nuevo en 1
    estado.racha = estado.ultimoCierre === fechaAyer() ? estado.racha + 1 : 1;
    estado.ultimoCierre = fechaLocal();

    const quedanAntes = Math.max(estado.kcalMeta - totalKcal(), 0);
    estado.comidas = [];
    guardarEstado();

    pintarRacha();
    pintarLista();
    pintarLonchera(quedanAntes);
    pintarMascota("¡Día cerrado! Racha de " + estado.racha + (estado.racha === 1 ? " día" : " días") + ". Mañana lonchera nueva.");
    $("lonchera-mensaje").textContent = "";
    if (!sinMovimiento) reiniciarAnimacion($("racha"), "salta");
});

$("btn-reiniciar").addEventListener("click", function () {
    if (!window.confirm("¿Borrar todo lo de prueba (comidas, meta y racha)?")) return;
    estado = estadoInicial();
    guardarEstado();
    pintarTodo();
    $("lonchera-mensaje").textContent = "";
});


// ---------- 8. Pestañas ----------
const titulos = { hoy: "Así vas hoy", antojos: "¿Se te antojó algo?", muneco: "Tu muñeco" };
const pestanas = document.querySelectorAll(".pestana");

function irA(nombre, opciones) {
    document.querySelectorAll("[data-pantalla]").forEach(function (s) {
        s.hidden = s.dataset.pantalla !== nombre;
    });
    pestanas.forEach(function (b) {
        if (b.dataset.ir === nombre) b.setAttribute("aria-current", "page");
        else b.removeAttribute("aria-current");
    });
    $("titulo-pantalla").textContent = titulos[nombre];
    if (nombre === "antojos") pintarAntojos();
    if (!(opciones && opciones.sinScroll)) window.scrollTo(0, 0);
}

pestanas.forEach(function (b) {
    b.addEventListener("click", function () { irA(b.dataset.ir); });
});


// ---------- 9. Antojos ----------
const tiposAntojo = [
    { clave: "dulce", nombre: "Dulce" },
    { clave: "salado", nombre: "Salado" },
    { clave: "crujiente", nombre: "Crujiente" },
    { clave: "proteina", nombre: "Con proteína" },
    { clave: "bebida", nombre: "Bebida" }
];
let tipoElegido = leer(sessionStorage, "lonchi-tipo-antojo") || "dulce";

// Ordena según tu meta y regresa también el texto que lo explica
function ordenarSegunMeta(lista) {
    const copia = lista.slice();
    if (estado.objetivo === "bajar") {
        copia.sort(function (a, b) { return a.kcal - b.kcal; });
        return { lista: copia, nota: "Ordenado de menos a más calorías, según tu meta: bajar de peso." };
    }
    if (estado.objetivo === "musculo") {
        copia.sort(function (a, b) { return b.proteina - a.proteina; });
        return { lista: copia, nota: "Ordenado de más a menos proteína, según tu meta: ganar músculo." };
    }
    // "ordenado": más proteína por cada caloría
    function densidad(p) { return p.kcal === 0 ? 0 : p.proteina / p.kcal; }
    copia.sort(function (a, b) { return densidad(b) - densidad(a); });
    return { lista: copia, nota: "Ordenado por más proteína por caloría, según tu meta: comer ordenado." };
}

function pintarAntojos() {
    // Fichas de tipo de antojo
    const tipos = $("tipos-antojo");
    tipos.textContent = "";
    tiposAntojo.forEach(function (t) {
        const ficha = document.createElement("button");
        ficha.className = "ficha";
        ficha.textContent = t.nombre;
        ficha.setAttribute("aria-pressed", t.clave === tipoElegido ? "true" : "false");
        ficha.addEventListener("click", function () {
            tipoElegido = t.clave;
            guardar(sessionStorage, "lonchi-tipo-antojo", t.clave);
            pintarAntojos();
            tipos.querySelector('[aria-pressed="true"]').focus(); // no perder el foco al redibujar
        });
        tipos.appendChild(ficha);
    });

    // Productos de ese tipo, ordenados según tu meta
    const delTipo = productosAntojo.filter(function (p) { return p.tipos.indexOf(tipoElegido) > -1; });
    const ordenados = ordenarSegunMeta(delTipo);
    let nota = ordenados.nota;
    if (Number(antojometro.value) >= 4) nota += " Con mucho antojo, la porción chica también se vale.";
    $("nota-orden").textContent = nota;

    const lista = $("productos");
    lista.textContent = "";
    ordenados.lista.forEach(function (p, i) {
        const li = document.createElement("li");
        li.className = i === 0 ? "producto mejor" : "producto";

        const emoji = document.createElement("span");
        emoji.className = "producto-emoji";
        emoji.setAttribute("aria-hidden", "true");
        emoji.textContent = p.emoji;

        const info = document.createElement("div");
        info.className = "producto-info";
        const nombre = document.createElement("b");
        nombre.textContent = p.nombre;
        const porcion = document.createElement("span");
        porcion.className = "chico";
        porcion.textContent = p.porcion;
        const macros = document.createElement("span");
        macros.className = "producto-macros";
        macros.textContent = p.kcal + " kcal · " + p.proteina + " g proteína (ej.)";
        info.append(nombre, porcion, macros);

        // Insignias
        const insignias = [];
        if (i === 0) insignias.push(["Mejor opción para tu meta", "insignia"]);
        if (p.kcal <= 100) insignias.push(["Ligera", "insignia suave"]);
        if (p.proteina >= 6) insignias.push(["Con proteína", "insignia suave"]);
        if (insignias.length) {
            const caja = document.createElement("span");
            caja.className = "insignias";
            insignias.forEach(function (ins) {
                const s = document.createElement("span");
                s.className = ins[1];
                s.textContent = ins[0];
                caja.appendChild(s);
            });
            info.appendChild(caja);
        }

        const boton = document.createElement("button");
        boton.className = "boton-chico";
        boton.textContent = "Lo comí";
        boton.setAttribute("aria-label", "Lo comí: " + p.nombre);
        boton.addEventListener("click", function () { agregarALonchera(p); });

        li.append(emoji, info, boton);
        lista.appendChild(li);
    });
}


// ---------- 10. Ventana de ayuda ----------
const fondo = $("fondo");
const panel = $("panel");
const btnAtras = $("btn-atras");

let focoAnterior = null; // botón que abrió la ventana, para regresar ahí al cerrar
let historial = [];      // pasos visitados, para el botón "Atrás"

// Muestra un paso y esconde los demás
function mostrarPaso(numero) {
    [1, 2, 3].forEach(function (n) {
        $("paso-" + n).hidden = (n !== numero);
    });
    historial.push(numero);
    // "Atrás" solo aparece si hay un paso anterior al cual regresar
    btnAtras.hidden = historial.length < 2;
    // El lector de pantalla anuncia el título del paso actual
    panel.setAttribute("aria-labelledby", "titulo-paso-" + numero);
    $("titulo-paso-" + numero).focus();
}

function abrir(paso) {
    focoAnterior = document.activeElement;
    historial = [];
    fondo.classList.add("abierto");
    panel.classList.add("abierto");
    mostrarPaso(paso || 1);
}

// opciones.sinFoco: no regresar el foco al botón que abrió (lo usa agregarALonchera)
function cerrar(opciones) {
    fondo.classList.remove("abierto");
    panel.classList.remove("abierto");
    const sinFoco = opciones && opciones.sinFoco;
    if (!sinFoco && focoAnterior && focoAnterior !== document.body) focoAnterior.focus();
}

btnAtras.addEventListener("click", function () {
    historial.pop();                  // quitamos el paso actual
    const anterior = historial.pop(); // y regresamos al anterior (mostrarPaso lo vuelve a guardar)
    mostrarPaso(anterior);
});

// Paso 1
$("btn-si").addEventListener("click", function () { mostrarPaso(2); });

// "Ahorita no": no vuelve a salir en esta sesión (sessionStorage se borra al cerrar la pestaña)
$("btn-no").addEventListener("click", function () {
    guardar(sessionStorage, "lonchi-ahorita-no");
    cerrar();
});

// "Solo cuando yo lo pida": no vuelve a salir sola nunca (localStorage se queda guardado)
$("btn-nunca").addEventListener("click", function () {
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
    $("opciones-lugar").textContent = lugar;
    const lista = $("opciones");
    lista.textContent = ""; // vaciar la lista anterior

    const opciones = (opcionesEjemplo[lugar] || []).slice(); // copia para no cambiar el original
    opciones.sort(function (a, b) { return (b.mejor ? 1 : 0) - (a.mejor ? 1 : 0); });

    opciones.forEach(function (op) {
        const li = document.createElement("li");
        // Cada opción es un botón: se puede tocar o elegir con teclado
        const boton = document.createElement("button");
        boton.className = op.mejor ? "opcion mejor" : "opcion";
        // textContent (y no innerHTML) para que ningún texto se interprete como código
        const emoji = document.createElement("span");
        emoji.className = "opcion-emoji";
        emoji.setAttribute("aria-hidden", "true");
        emoji.textContent = op.emoji || "";
        boton.appendChild(emoji);
        if (op.mejor) {
            const insignia = document.createElement("span");
            insignia.className = "insignia";
            insignia.textContent = "⭐ Mejor opción";
            boton.appendChild(insignia);
        }
        const nombre = document.createElement("span");
        nombre.className = "opcion-nombre";
        nombre.textContent = op.nombre;
        const datos = document.createElement("span");
        datos.className = "opcion-datos";
        datos.textContent = op.kcal + " kcal · " + op.proteina + " g proteína (ej.)";
        boton.append(nombre, datos);
        boton.addEventListener("click", function () { agregarALonchera(op); });
        li.appendChild(boton);
        lista.appendChild(li);
    });

    mostrarPaso(3);
}

$("btn-listo").addEventListener("click", function () { cerrar(); });
$("btn-cerrar").addEventListener("click", function () { cerrar(); });
fondo.addEventListener("click", function () { cerrar(); });
document.addEventListener("keydown", function (e) {
    if (e.key === "Escape" && panel.classList.contains("abierto")) cerrar();
});

// Botones de inicio: siempre abren la ayuda (aunque haya elegido
// "solo cuando yo lo pida", porque aquí sí la está pidiendo).
// Van directo al paso 2 porque ya pidió ayuda.
$("btn-que-como").addEventListener("click", function () { abrir(2); });
$("btn-tienda").addEventListener("click", function () { abrir(2); });


// ---------- 11. ¿Dónde estás? (tarjeta en Hoy) ----------
const botonesLugar = document.querySelectorAll("#lugares .lugar");
const lugarTexto = $("lugar-texto");

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


// ---------- 12. Antojómetro y gusto ----------
// Cada nivel tiene su carita, su nombre y un mensaje (sin regaños).
const nivelesAntojo = {
    1: { carita: "😌", nombre: "Nada", mensaje: "¡Bien! Si te da hambre, pícale a \"¿Qué como ahorita?\"." },
    2: { carita: "🙂", nombre: "Poquito", mensaje: "Un antojito. A veces con agua o algo con proteína se pasa." },
    3: { carita: "😋", nombre: "Medio", mensaje: "Un gusto chiquito puede caber hoy." },
    4: { carita: "😍", nombre: "Bastante", mensaje: "Mejor un gusto planeado que uno a escondidas. Te ayudo a elegir." },
    5: { carita: "🤤", nombre: "¡Muchísimo!", mensaje: "Va, se vale. Busquemos uno que casi no mueva tu plan, o la porción chica." }
};

const antojometro = $("antojometro");
const antojoCarita = $("antojo-carita");

function pintarAntojo(conBrinco) {
    const nivel = nivelesAntojo[antojometro.value];
    antojoCarita.textContent = nivel.carita;
    $("antojo-nivel").textContent = nivel.nombre;
    $("antojo-mensaje").textContent = nivel.mensaje;
    // Para el lector de pantalla: dice "Medio" en vez de "3"
    antojometro.setAttribute("aria-valuetext", nivel.nombre);
    guardar(sessionStorage, "lonchi-antojo", antojometro.value);

    if (conBrinco) {
        antojoCarita.classList.add("brinca");
        setTimeout(function () { antojoCarita.classList.remove("brinca"); }, 200);
    }
}

// "input" se dispara mientras arrastras, no solo al soltar
antojometro.addEventListener("input", function () { pintarAntojo(true); });

const gustoRespuesta = $("gusto-respuesta");

// "Sí": te lleva a la pestaña Antojos
$("btn-gusto-si").addEventListener("click", function () {
    gustoRespuesta.textContent = "";
    irA("antojos");
});

$("btn-gusto-no").addEventListener("click", function () {
    gustoRespuesta.textContent = "Perfecto. Aquí sigo si cambias de opinión.";
});


// ---------- 13. Arranque ----------
function pintarTodo() {
    pintarRacha();
    pintarMeta();
    pintarLista();
    pintarLonchera();
    pintarMascota();
}

const antojoGuardado = leer(sessionStorage, "lonchi-antojo");
if (antojoGuardado) antojometro.value = antojoGuardado;
pintarAntojo(false);

const lugarGuardado = leer(sessionStorage, "lonchi-lugar");
if (lugarGuardado) elegirLugar(lugarGuardado);

pintarTodo();

// La ventana de ayuda sale al entrar, solo si no dijo que no
if (!leer(sessionStorage, "lonchi-ahorita-no") && !leer(localStorage, "lonchi-solo-si-pido")) {
    abrir(1);
}

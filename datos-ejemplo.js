// ============================================================
// DATOS DE EJEMPLO — NO son datos reales de etiquetas.
// Sirven solo para probar cómo se ve la ventana de ayuda.
// Los datos reales los captura Vasti desde las etiquetas.
//
// Por qué .js y no .json: si abres Lonchi.html con doble clic
// (file://), el navegador no deja leer un .json con fetch().
// Cuando la app esté en un servidor (ej. GitHub Pages) lo
// pasamos a JSON.
// ============================================================

const opcionesEjemplo = {
    "Casa": [
        { nombre: "Quesadilla de maíz con panela", emoji: "🫓", kcal: 220, proteina: 14, mejor: true },
        { nombre: "Huevo a la mexicana", emoji: "🍳", kcal: 200, proteina: 13 },
        { nombre: "Fruta con yogur natural", emoji: "🍓", kcal: 180, proteina: 8 }
    ],
    "Trabajo": [
        { nombre: "Atún en agua con galletas", emoji: "🐟", kcal: 210, proteina: 20, mejor: true },
        { nombre: "Fruta y un puñito de nueces", emoji: "🥜", kcal: 190, proteina: 4 },
        { nombre: "Palitos de zanahoria con hummus", emoji: "🥕", kcal: 150, proteina: 5 }
    ],
    "Oxxo": [
        { nombre: "Yogur griego natural", emoji: "🥛", kcal: 130, proteina: 12, mejor: true },
        { nombre: "Huevos cocidos (2 piezas)", emoji: "🥚", kcal: 150, proteina: 12 },
        { nombre: "Cacahuates naturales, bolsa chica", emoji: "🥜", kcal: 170, proteina: 7 }
    ],
    "7-Eleven": [
        { nombre: "Sándwich de pechuga de pavo", emoji: "🥪", kcal: 280, proteina: 18, mejor: true },
        { nombre: "Queso panela en cubos", emoji: "🧀", kcal: 160, proteina: 14 },
        { nombre: "Fruta picada", emoji: "🍉", kcal: 90, proteina: 1 }
    ],
    "Costco": [
        { nombre: "Pechuga de pollo rostizado sin piel", emoji: "🍗", kcal: 220, proteina: 35, mejor: true },
        { nombre: "Ensalada con pollo, aderezo aparte", emoji: "🥗", kcal: 300, proteina: 22 }
    ],
    "Cafetería": [
        { nombre: "Latte chico con leche light", emoji: "☕", kcal: 110, proteina: 8, mejor: true },
        { nombre: "Sándwich de pavo en pan integral", emoji: "🥪", kcal: 320, proteina: 20 },
        { nombre: "Fruta picada", emoji: "🍉", kcal: 90, proteina: 1 }
    ]
};

// ------------------------------------------------------------
// Productos para la pestaña Antojos (tomados del mockup de Vasti).
// Valores APROXIMADOS DE EJEMPLO, no verificados con etiquetas.
// tipos: dulce, salado, crujiente, proteina, bebida
// ------------------------------------------------------------
const productosAntojo = [
    { nombre: "Manzana", emoji: "🍎", porcion: "1 mediana", kcal: 95, proteina: 0.5, tipos: ["dulce"] },
    { nombre: "Plátano", emoji: "🍌", porcion: "1 mediano", kcal: 105, proteina: 1.3, tipos: ["dulce"] },
    { nombre: "Gelatina lista", emoji: "🍮", porcion: "1 vaso", kcal: 70, proteina: 1.5, tipos: ["dulce"] },
    { nombre: "Galletas María", emoji: "🍪", porcion: "4 piezas", kcal: 100, proteina: 1.5, tipos: ["dulce", "crujiente"] },
    { nombre: "Chocolate de barra", emoji: "🍫", porcion: "40 g", kcal: 210, proteina: 3, tipos: ["dulce"] },
    { nombre: "Palomitas naturales", emoji: "🍿", porcion: "Bolsa chica", kcal: 120, proteina: 3, tipos: ["salado", "crujiente"] },
    { nombre: "Cacahuates naturales", emoji: "🥜", porcion: "30 g", kcal: 170, proteina: 7, tipos: ["salado", "crujiente", "proteina"] },
    { nombre: "Papas fritas", emoji: "🥔", porcion: "Bolsa chica, 28 g", kcal: 150, proteina: 2, tipos: ["salado", "crujiente"] },
    { nombre: "Pepino con limón y chile", emoji: "🥒", porcion: "1 vaso", kcal: 30, proteina: 1, tipos: ["salado", "crujiente"] },
    { nombre: "Huevo cocido", emoji: "🥚", porcion: "1 pieza", kcal: 78, proteina: 6, tipos: ["salado", "proteina"] },
    { nombre: "Atún en agua", emoji: "🐟", porcion: "1 lata", kcal: 110, proteina: 25, tipos: ["salado", "proteina"] },
    { nombre: "Queso panela", emoji: "🧀", porcion: "30 g", kcal: 78, proteina: 6, tipos: ["salado", "proteina"] },
    { nombre: "Yogur natural", emoji: "🥣", porcion: "1 vaso, 150 g", kcal: 90, proteina: 6, tipos: ["dulce", "proteina"] },
    { nombre: "Leche descremada", emoji: "🥛", porcion: "250 ml", kcal: 90, proteina: 8, tipos: ["bebida", "proteina"] },
    { nombre: "Leche con chocolate", emoji: "🍫", porcion: "250 ml", kcal: 190, proteina: 8, tipos: ["bebida", "dulce", "proteina"] },
    { nombre: "Agua natural", emoji: "💧", porcion: "600 ml", kcal: 0, proteina: 0, tipos: ["bebida"] },
    { nombre: "Café americano", emoji: "☕", porcion: "1 vaso", kcal: 5, proteina: 0, tipos: ["bebida"] },
    { nombre: "Jugo de caja", emoji: "🧃", porcion: "250 ml", kcal: 120, proteina: 0.5, tipos: ["bebida", "dulce"] },
    { nombre: "Refresco", emoji: "🥤", porcion: "Lata, 355 ml", kcal: 150, proteina: 0, tipos: ["bebida", "dulce"] }
];

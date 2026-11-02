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

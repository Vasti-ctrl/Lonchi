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
        { nombre: "Quesadilla de maíz con panela", kcal: 220, proteina: 14, mejor: true },
        { nombre: "Huevo a la mexicana", kcal: 200, proteina: 13 },
        { nombre: "Fruta con yogur natural", kcal: 180, proteina: 8 }
    ],
    "Trabajo": [
        { nombre: "Atún en agua con galletas", kcal: 210, proteina: 20, mejor: true },
        { nombre: "Fruta y un puñito de nueces", kcal: 190, proteina: 4 },
        { nombre: "Palitos de zanahoria con hummus", kcal: 150, proteina: 5 }
    ],
    "Oxxo": [
        { nombre: "Yogur griego natural", kcal: 130, proteina: 12, mejor: true },
        { nombre: "Huevos cocidos (2 piezas)", kcal: 150, proteina: 12 },
        { nombre: "Cacahuates naturales, bolsa chica", kcal: 170, proteina: 7 }
    ],
    "7-Eleven": [
        { nombre: "Sándwich de pechuga de pavo", kcal: 280, proteina: 18, mejor: true },
        { nombre: "Queso panela en cubos", kcal: 160, proteina: 14 },
        { nombre: "Fruta picada", kcal: 90, proteina: 1 }
    ],
    "Costco": [
        { nombre: "Pechuga de pollo rostizado sin piel", kcal: 220, proteina: 35, mejor: true },
        { nombre: "Ensalada con pollo, aderezo aparte", kcal: 300, proteina: 22 }
    ],
    "Cafetería": [
        { nombre: "Latte chico con leche light", kcal: 110, proteina: 8, mejor: true },
        { nombre: "Sándwich de pavo en pan integral", kcal: 320, proteina: 20 },
        { nombre: "Fruta picada", kcal: 90, proteina: 1 }
    ]
};

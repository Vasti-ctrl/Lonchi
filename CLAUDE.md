# Proyecto: app de dieta (nombre provisional: Lonchi)

## Qué es
Un asistente que ayuda a elegir lo más saludable **en el momento**, según el plan del usuario, lo que ya comió en el día y el lugar donde está. Nace de un problema real de Vasti (la dueña): llegar al Oxxo o al 7-Eleven queriendo algo saludable, no saber qué escoger y terminar comprando algo azucarado.

Distintivo (gratis, no premium): ayudar a decidir ahorita con comida mexicana y de tiendas de conveniencia, sin pedir buscar ni registrar nada antes. Sin culpa: aconseja, nunca obliga ni regaña.

## Sobre Vasti y cómo trabajar con ella
- Estudia desarrollo de software; sabe lo básico de HTML, CSS y JavaScript y quiere entender lo que se construye.
- Habla español mexicano informal. Responde en español, directo y conciso.
- Explica brevemente qué cambiaste y por qué. Antes de decisiones grandes (stack, estructura, servicios de pago), pregunta.
- No inventes datos nutricionales. Todo dato de ejemplo debe estar marcado como ejemplo. Los datos reales de productos salen de etiquetas y los captura Vasti.

## Stack (punto de partida sugerido, confirmar con Vasti)
- HTML, CSS y JavaScript puro, sin frameworks al inicio.
- PWA (instalable desde el navegador del celular) antes que app de tiendas. Capacitor queda para después.
- Frontend primero, con datos de ejemplo en archivos JSON. Backend (cuentas, registros diarios, base de productos) después.
- Diseño pensado para celular, ancho base 390 px.

## Pantallas (decisiones de Vasti)
**Hoy**
1. Lonchera que se llena conforme comes (reemplaza al anillo/barra de calorías): te quedan X de Y kcal y proteína.
2. "Te falta…" (ej. fibra) con opciones concretas para completarlo.
3. "De más" (ej. carbohidratos).
4. "¿Dónde estás?" con botones de lugar.
5. Tarjeta "¿Quieres darte un gusto hoy?".
- Pendiente de confirmar: una pregunta de cómo se siente el usuario con su meta (déficit, masa muscular u otra).
- Botón visible "¿Qué como ahorita?" en el inicio.
- Botón "Estoy en la tienda": abre directo la ventana de ayuda en el paso de lugar/opciones.
- Antojómetro: el usuario marca qué tanto antojo trae; ayuda a decidir el gusto o la opción.

**Ventana de ayuda (un solo panel que sube desde abajo y cambia de paso)**
1. "¿Necesitas ayuda para elegir algo ahorita?" con "Sí, ayúdame" y "Ahorita no". Sale al entrar a la app.
2. "¿Dónde estás?": Casa, Trabajo, Oxxo, 7-Eleven, Costco, Cafetería y "Usar mi ubicación".
3. Las 2 o 3 mejores opciones de ese lugar, con calorías y proteína, y la mejor marcada.
- Una pregunta por paso, botones grandes, sin escribir.
- Botón de atrás desde el paso 2 y salida (X) visible en todos los pasos.
- Si dice "Ahorita no", no vuelve a salir en esa sesión. Debe haber una opción para "solo preguntarme cuando yo lo pida".
- Si no hay nada registrado, igual da opciones generales según plan y lugar.

**Elegir** (opciones por lugar), **Registrar** (buscar, momento del día, agregar), **Gusto**:
- Pregunta si quiere un gusto; si dice que sí, pregunta dónde está y da snacks que casi no afectan su plan.
- Si el gusto no cabe en el plan, aconseja dejarlo para otro día o elegir la porción chica, sin obligar.

**Test inicial (en vez de subir el plan del nutriólogo):** alergias e intolerancias, qué no puede comer, qué debe incluir, tipo de dieta y meta.

## Reglas de producto
- Son recomendaciones. La responsabilidad del usuario va en términos y condiciones.
- Aun así, **nunca mostrar un producto con un alérgeno que el usuario marcó en el test.**
- Para restricciones médicas serias, aviso de confirmar con su médico o nutriólogo.
- Datos de salud son sensibles: consentimiento claro y aviso de privacidad antes de lanzar.
- Respuestas rápidas: el usuario suele estar frente al refri de la tienda.

## Base de datos de productos (la arma Vasti)
- Empezar con 40 a 50 productos de Oxxo y 7-Eleven, tomados de las etiquetas.
- Campos: nombre, marca, tienda, porción, calorías, proteína, carbohidratos, azúcar, fibra, grasa, **alérgenos**, categoría y etiqueta (mejor opción, buena, mejor otro día).
- Categorías: proteína lista, lácteos, fruta y verdura, botanas, bebidas.
- Ayuda a crear la estructura JSON y un script para importar lo que Vasti capture.

## Diseño
- **Cambio (nov 2026): estilo más colorido y juguetón.** Paleta elegida por Vasti: rosa mexicano, naranja pastel y verde (tonos exactos por definir); mantener buen contraste.
- Paleta anterior (tranquila, referencia): fondo crema `#F6F4EE`, verde `#3F6B50`, texto `#26332C`, verde suave `#E3ECE5`, naranja suave `#B7683A` para "de más", gris `#5B6660` para texto secundario.
- Tipografía DM Sans, tarjetas con esquinas de 20 px, botones de al menos 44 px de alto.
- Buen contraste y botones accesibles con teclado.

## Orden de construcción
1. Pantalla Hoy y registrar comidas.
2. Ventana de ayuda de 3 pasos con datos de ejemplo.
3. Base de productos de Oxxo y 7-Eleven.
4. "Cerebro": cruzar plan, lo ya comido, lugar y restricciones.
5. Gusto, test inicial, cuentas y guardado.

## Fuera de alcance por ahora
Enlace con Oura u otros relojes, sección de podcasts e influencers, escaneo de código de barras o fotos, planes semanales, pagos y funciones premium.

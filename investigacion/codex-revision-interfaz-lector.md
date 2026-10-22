# Revisión cruzada de interfaz: lector M02

**Fecha:** 2026-10-21
**Revisor:** Codex, con revisión separada de diseño visual y de accesibilidad y teclado.
**Alcance:** inicio, biblioteca, portada M02, las seis lecciones y el
laboratorio en la app local.

## Método

Se abrió la app local en Chrome. Se configuraron viewports de 360 × 780 y
1280 × 800; el área interior reportada por el navegador fue 327 × 709 y
1164 × 727 respectivamente. Se revisaron las rutas Inicio, Cursos, M02,
las lecciones L1 a L6 y Laboratorio en ambos tamaños.

El recorrido de teclado comprobó el salto a contenido, un acordeón y una
respuesta de opción múltiple con Espacio. El salto deja el foco en main, el
acordeón cambia su estado y el radio queda seleccionado. También se revisaron
la estructura semántica, los estados de foco y la consola. No se pudo aplicar
de forma fiable zoom de navegador al 200 % con la automatización disponible;
el reflujo a 360 px, las unidades relativas y la ausencia de desbordamiento
horizontal sí se comprobaron.

## Hallazgos

- [UI-01] Severidad: media
  Ubicación: Inicio, escritorio configurado a 1280 × 800; src/styles/app.css, .hero
  Evidencia: La imagen del héroe ocupa una fila completa. En el área visible de 1164 × 727, la imagen va de y=81 a y=675, el h1 empieza en y=699 y el CTA «Empezar con M02» en y=852. El primer viewport no explica el producto ni muestra la siguiente acción.
  Consecuencia: Una llegada en escritorio muestra identidad visual antes que propósito y entrada al único manual disponible.
  Corrección recomendada: Desde un breakpoint de escritorio, usar dos columnas texto e imagen, o limitar la altura del héroe para conservar título, resumen y CTA dentro del primer viewport.
  Verificado: Medición reproducida en http://localhost:5173/#/ con el viewport de escritorio.

- [UI-02] Severidad: media
  Ubicación: L3, L6 y Laboratorio, 360 px y escritorio; src/styles/app.css, .prose pre
  Evidencia: Los bloques de código se desplazan horizontalmente, pero no tienen etiqueta de lenguaje, botón Copiar, indicador de desbordamiento ni tabindex. En Laboratorio a 360 px los dos comandos midieron 1578/260 px y 906/282 px de scrollWidth/clientWidth; en L3 y L6 también hay bloques con desbordamiento y tabindex nulo.
  Consecuencia: El patrón incumple el sistema D1 y alguien que usa solo teclado no puede situar el foco dentro del bloque para leer por completo los comandos que debe ejecutar.
  Corrección recomendada: Convertir el bloque Markdown en componente de código con nombre de lenguaje, contenedor enfocable con tabindex=0, pista visual de desplazamiento y botón Copiar de 44 px; si la copia falla, mostrar el mensaje textual previsto en D1.
  Verificado: Reproducido en L3, L6 y Laboratorio; el desbordamiento es interno y no hay desplazamiento horizontal de página.

- [A11Y-01] Severidad: media
  Ubicación: lector, repasos y comprobaciones; 360 px; src/components/QuestionCheck.tsx
  Evidencia: El legend del fieldset dice «Pregunta n de n» o «Repaso n». El escenario sí entra en aria-describedby, pero el enunciado decisivo de question__stem no tiene id ni referencia. Por ejemplo, al entrar al grupo de L1 se anuncia el número de pregunta sin incluir «¿Cuál de estas reescrituras…?».
  Consecuencia: Con lector de pantalla o al recorrer radios con teclado, falta parte de la pregunta necesaria para elegir una respuesta informada.
  Corrección recomendada: Usar el enunciado como legend, o asignarle un id e incluirlo junto con el escenario en aria-describedby.
  Verificado: Revisión del DOM de las cuatro comprobaciones de L1 a 360 px.

- [A11Y-02] Severidad: baja
  Ubicación: índice móvil del lector, 360 px; src/styles/app.css, .toc__list a
  Evidencia: Al abrir «En esta sección», los enlaces de una línea miden 311 × 39 px; los de dos líneas llegan a 61 px.
  Consecuencia: Los enlaces más usados para moverse por la lectura quedan por debajo del objetivo táctil de 44 px que fija D1.
  Corrección recomendada: Definir min-height: 44px o aumentar el padding vertical de los enlaces de índice en móvil.
  Verificado: Reproducido en L4 a 360 px. La medida supera el mínimo AA de WCAG para un objetivo aislado, pero no cumple el estándar de interfaz del proyecto.

## Fidelidad, lectura y experiencia

La paleta de papel, las fuentes locales, jerarquía editorial, tarjetas, avisos,
fichas de producto, preguntas e índice responsivo respetan D1. Las nueve
tarjetas pendientes se presentan como «Próximamente» sin aparentar que se
puedan abrir; el laboratorio declara con claridad que aún no guarda entregas.
El pie de página también evita simular persistencia.

No hubo desbordamiento horizontal de página en ninguna de las diez rutas en
los dos tamaños. Tablas y código conservan su propio desplazamiento interno.
Los encabezados siguen una jerarquía consecutiva; existen main, migas,
navegación y salto a contenido. El foco visible de 3 px, los radios con área
de 44 px y prefers-reduced-motion están implementados. La consola no mostró
errores ni advertencias.

El diagrama de L4 se entrega como img con texto alternativo descriptivo. A
360 px ocupa 313 px de ancho y sigue siendo legible con la fuente de respaldo
Georgia del SVG; los subtítulos quedan cerca de 12 px, por lo que conviene
confirmarlo en el dispositivo de Daniel durante el piloto, aunque no bloquea
la lectura gracias al alt completo.

Para no saturar inicio ni biblioteca, conservaría el catálogo actual. Cambiaría
la portada a dos columnas en escritorio para mostrar propósito y CTA arriba
del pliegue, y en Biblioteca añadiría una sola línea de prioridad visual
«Disponible ahora: M02» junto al encabezado, sin añadir botones a los nueve
cursos pendientes.

## Verificación

| Comprobación | Resultado |
| --- | --- |
| Rutas a 360 px | Inicio, Cursos, M02, L1–L6 y Laboratorio: sin desbordamiento horizontal de página. |
| Rutas en escritorio | Las mismas diez rutas: sin desbordamiento horizontal; índice lateral activo desde 960 px. |
| Teclado | Salto a contenido, acordeón y selección de radio verificados; foco visible presente. |
| Consola | Sin errores ni advertencias. |
| npm test | 52 pruebas aprobadas. |
| npm run build | Compilación y build de producción aprobados; queda aviso informativo de chunk mayor de 500 kB. |

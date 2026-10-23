# Sistema de diseño — Atlas de criterio

**Versión:** 1.0.0 · **Decisión de base:** D-018 · **Implementación prevista:** variables CSS en React.

Atlas de criterio representa aprender como orientar una decisión y corregirla con evidencia. La interfaz es editorial, cálida y sobria: fondo marfil, superficies de papel, azul tinta para lectura y una ruta de acento ocre. El collage aparece en las imágenes; los controles siguen siendo directos, semánticos y fáciles de inspeccionar.

## 1. Tokens y contraste

La fuente de tokens es [`design/tokens.json`](../design/tokens.json). Los valores se exponen como variables CSS `--ais-*`; los nombres semánticos permiten cambiar una implementación sin reescribir componentes.

| Uso | Tokens | Contraste calculado | Cumplimiento |
| --- | --- | ---: | --- |
| Texto de lectura | `ink` sobre `canvas` | 13.06:1 | AA texto |
| Texto de lectura | `ink` sobre `surface` | 14.59:1 | AA texto |
| Metadatos | `muted` sobre `canvas` | 5.69:1 | AA texto |
| Enlace o acento textual | `accent` sobre `canvas` | 4.85:1 | AA texto |
| Botón principal | `onAccent` sobre `accent` | 5.51:1 | AA texto |
| Anillo de foco | `focus` sobre `canvas` / `surface` | 5.31:1 / 5.93:1 | AA texto; >3:1 UI |
| Estado correcto | `onSuccessSurface` sobre `successSurface` | 6.87:1 | AA texto |
| Estado incorrecto | `onDangerSurface` sobre `dangerSurface` | 6.89:1 | AA texto |
| Selección | `onSelection` sobre `selection` | 9.61:1 | AA texto |
| Ficha de producto | `onProduct` sobre `product` | 7.77:1 | AA texto |
| Borde de control | `border` sobre `canvas` | 3.25:1 | >3:1 UI |
| Deshabilitado | `onDisabled` sobre `disabledSurface` | 4.94:1 | AA texto; no es la única señal |
| Mensajes | `success`, `warning`, `danger`, `info` sobre `surface` | 6.45:1 / 6.23:1 / 6.49:1 / 7.29:1 | AA texto |

Las razones usan luminancia relativa sRGB y la fórmula WCAG `(Lclaro + 0.05) / (Loscuro + 0.05)`. Color nunca comunica por sí solo: acierto/error usan icono, texto y borde; la selección usa control marcado y texto; los avisos tienen un encabezado descriptivo.

## 2. Tipografía y composición

- **Lectura:** Source Serif 4. A 360 px: 17 px, interlineado 1.62; desde 768 px: 18 px. Las líneas miden 45–75 caracteres, con ancho de lectura máximo de 44 rem.
- **Títulos:** Fraunces 600–700, interlineado 1.15. `h1` usa `clamp(1.875rem, 6vw, 3rem)`; no se usa como texto decorativo dentro de imágenes.
- **Código y metadatos técnicos:** IBM Plex Mono 400–600, 14 px/1.55 en móvil y 15 px/1.55 desde 768 px.
- **Escala y espacio:** base de 4 px; el contenido usa los tokens `space.1` a `space.8`. En 360 px, margen lateral 16 px, separación habitual 16 px y objetivo táctil mínimo de 44 px. En escritorio, el contenido puede usar 76 rem de ancho general con lector limitado a 44 rem.
- **Papel y profundidad:** radios de 6, 12 y 20 px; sombra `paper` para superficies y `raised` solo en la siguiente acción o tarjetas interactivas. No se simulan páginas rotas, sellos ni textura detrás de texto.

## 3. Fuentes locales

Se alojan bajo `public/fonts/` como WOFF2 de subconjunto latino que contiene `á é í ó ú ñ ü ¿ ¡`. Se cargan con `font-display: swap`; se mantienen los *fallbacks* de los tokens.

| Familia | Pesos | Archivo local | Descarga oficial | Licencia |
| --- | --- | --- | --- | --- |
| Source Serif 4 | 400, 600, 700 | `source-serif-4-latin.woff2` | [Google Fonts](https://fonts.google.com/specimen/Source+Serif+4), [repo oficial](https://github.com/google/fonts/tree/main/ofl/sourceserif4) | SIL Open Font License 1.1, `OFL-SourceSerif4.txt` |
| Fraunces | 600, 700 | `fraunces-latin.woff2` | [Google Fonts](https://fonts.google.com/specimen/Fraunces), [repo oficial](https://github.com/google/fonts/tree/main/ofl/fraunces) | SIL Open Font License 1.1, `OFL-Fraunces.txt` |
| IBM Plex Mono | 400, 500, 600 | `ibm-plex-mono-latin.woff2` | [Google Fonts](https://fonts.google.com/specimen/IBM+Plex+Mono), [repo oficial](https://github.com/google/fonts/tree/main/ofl/ibmplexmono) | SIL Open Font License 1.1, `OFL-IBMPlexMono.txt` |

El `README.md` de `public/fonts/` conserva las URLs verificadas y la regla `@font-face`. Si se actualiza una fuente, conservar los tres archivos OFL, verificar el subconjunto con la cadena de caracteres indicada y actualizar la fecha en ese README.

## 4. Componentes base

Todos los controles se operan por teclado, muestran foco visible de 3 px `focus` más separador de superficie, y no dependen de color para estado. `:focus-visible` se usa en lugar de quitar el *outline*. Con movimiento reducido, las transiciones de foco, acordeón y navegación se reducen a 0 ms.

### Lector de lección e índice

- **Normal:** columna de lectura, objetivos antes del contenido e índice lateral adhesivo desde 960 px. El índice muestra sección actual mediante texto «En esta sección» y una barra, no solo color.
- **Foco / teclado:** cada enlace de índice recibe el anillo de foco; al navegar, el encabezado de sección recibe foco programático y conserva la ancla visible.
- **Deshabilitado / error:** enlaces a secciones ausentes no se renderizan. Si falla el contenido, se muestra aviso con título, explicación y acción para volver a la biblioteca.
- **360 px:** índice se convierte en `<details>` o diálogo desplegable al inicio; el lector ocupa todo el ancho y navegación anterior/siguiente queda fija al final del contenido, sin índice lateral.

### Bloque de código

- **Normal:** fondo `ink`, texto `onAccent` no se usa; texto de código claro con ratio 14.84:1. Etiqueta de lenguaje en HTML y botón «Copiar» de 44 px.
- **Foco / error:** el botón conserva foco visible; si la copia falla, un aviso textual «No se pudo copiar; selecciona el texto» aparece junto al botón.
- **360 px:** `overflow-x: auto` dentro del bloque, `tabindex="0"` y gradiente de borde que indica desplazamiento; nunca fuerza desplazamiento horizontal de página.

### Recuadro **Aparte**

- **Normal:** superficie `infoSurface`, borde izquierdo `info`, etiqueta textual «Aparte». Sirve para contenido interesante no evaluable.
- **Foco / error:** enlaces internos usan foco visible; no es interactivo por sí mismo. Si una referencia falta, se oculta el enlace y se conserva el texto.
- **360 px:** ancho completo, borde izquierdo de 4 px, texto y enlaces envuelven sin truncamiento.

### Ficha de producto

- **Normal:** encabezado `product` con producto, superficie, capacidad, madurez, fecha de verificación, fuente y próxima revisión. Muestra los principios duraderos fuera de la ficha.
- **Pendiente de verificar:** cuando vence `nextReview`, encabezado «Pendiente de verificar», icono de reloj y fecha vencida; nunca se presenta como capacidad confirmada.
- **Foco / error / 360 px:** fuente es un enlace con foco visible. A 360 px los metadatos pasan a lista vertical; si falta fuente o fecha, se muestra error editorial, no una ficha parcial.

### Pregunta de opción múltiple

- **Antes de responder:** grupos `fieldset` y `legend`; cada opción completa es un objetivo táctil de 44 px. El orden visible se conserva en el intento.
- **Después de responder:** cada opción muestra «Correcta» o «No era la mejor opción», icono, borde y feedback propio; la respuesta correcta explica su regla y se enlaza a la sección. No se usa solo verde/rojo.
- **Foco / error / deshabilitado:** radio nativo o botón de opción recibe anillo de foco. Si falta selección, mensaje «Elige una opción o marca que deseas continuar sin responder»; tras enviar se bloquean cambios y se conserva el orden. A 360 px las opciones son una sola columna sin cortes de texto.

### Selector de confianza

- **Normal:** casilla opcional «Estoy muy seguro», disponible antes de comprobar una respuesta. Explica que, si se falla, la pregunta vuelve en el repaso de errores; si queda desmarcada, no modifica ese repaso.
- **Foco / error / 360 px:** la etiqueta completa de la casilla conserva 44 px y foco visible. La casilla no sustituye la respuesta: si falta elegir una opción, el error se escribe, no se expresa con color. En móvil envuelve el texto sin cortar la explicación.

### Tarjeta de curso

- **Normal:** código M01–M10, título, pregunta central, tiempo, estado y siguiente acción. La imagen de portada es orientación/identidad; el título va en HTML.
- **Nueve pendientes:** muestran «Próximamente» como estado visible, no barra de progreso ni botón que aparente lección disponible. Enlazan a la descripción si existe; si no, no son accionables.
- **Foco / error / 360 px:** toda tarjeta interactiva tiene foco visible y tamaño táctil suficiente. A 360 px se muestra una columna y la imagen se limita a 16:9, antes del texto; un error de carga muestra color de superficie y alt, no un hueco silencioso.

### Aviso

- **Normal:** cuatro tipos: información, éxito, advertencia y error; siempre con título y texto. El aviso no anuncia progreso académico como dominio.
- **Foco / error / deshabilitado:** acciones internas mantienen foco; errores persistentes usan `role="alert"` solo cuando cambian, para no repetirlos al lector de pantalla. Un aviso sin acción posible no incluye botón falso.
- **360 px:** ancho completo, icono de apoyo, texto por encima de cualquier acción y sin depender de una sola línea.

## 5. Portadas M01–M10

Familia constante: horizonte bajo, papel de algodón, tinta azul, ocre y verde azulado, textura de grafito y espacio claro para título HTML. Cada portada cambia terreno, hora y motivo; ninguna contiene letras, cifras, diagramas exactos, logos ni personas.

| Manual | Terreno y hora | Motivo central |
| --- | --- | --- |
| M01 — Herramientas, modelos y límites | Meseta de mañana | Tres sendas que convergen ante una misma tarea, para sugerir elección de superficie y límites. |
| M02 — Prompting y especificaciones | Valle con luz temprana | Una niebla de rutas se ordena en un único camino con hitos en blanco. |
| M03 — Contexto y conocimiento | Bosque al mediodía | Capas de senderos y claros, con una ruta que se simplifica al salir del follaje. |
| M04 — Código, Git y entornos | Barranco de tarde | Puentes cortos y un desvío seguro que vuelve a la ruta principal. |
| M05 — Desarrollo con agentes | Ladera con sol lateral | Camino con un puesto de control y un tramo que se verifica antes de continuar. |
| M06 — Datos y arquitectura | Delta al amanecer | Afluentes que se reúnen en canales claros antes de llegar al valle. |
| M07 — APIs, MCP e integraciones | Estuario al crepúsculo | Dos orillas unidas por un paso limitado y controlado. |
| M08 — Agentes y automatización | Llanura nocturna temprana | Ruta principal con ramales temporales que regresan a puntos de control. |
| M09 — Evaluación y control | Cresta con luz fría | Dos caminos comparados frente a señales de revisión, sin sugerir resultado automático. |
| M10 — De prototipo a producto | Colina al amanecer | Sendero que llega a una pequeña construcción abierta y vuelve a una ruta de mantenimiento. |

## 6. Modo oscuro

No se implementa en V1. La paleta de papel depende de contraste, textura y jerarquía que requieren prueba específica en lector, laboratorio y fichas de producto. Antes de añadirlo se crea una tabla nueva de contrastes, se verifica a 360 px y se prueba con texto aumentado y preferencias de contraste.

## 7. Lista de implementación

1. Cargar fuentes locales y sus licencias; no solicitar fuentes a terceros en tiempo de ejecución.
2. Exponer los tokens como variables CSS semánticas y respetar `prefers-reduced-motion`.
3. Probar lector, pregunta, ficha de producto y aviso a 360 px, con zoom de texto y teclado.
4. Ejecutar una comprobación de contraste para cualquier color nuevo antes de añadirlo.

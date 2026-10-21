# D1 · Atlas de criterio

**Concepto.** Un atlas de rutas hechas a mano: aprender es orientarse, elegir un camino y corregirlo con evidencia. El papel recortado aporta calidez; la ruta visible ayuda a entender progresión sin fingir que el conocimiento es lineal.

## Sistema visual

| Token | Hex | Uso |
| --- | --- | --- |
| `bg` | `#F5F0E6` | fondo de lectura |
| `surface` | `#FFFDF7` | tarjetas y lección |
| `text` | `#172A33` | cuerpo y títulos |
| `text-muted` | `#4D6265` | metadatos |
| `accent` | `#A94E2B` | acción principal y enlaces |
| `accent-ink` | `#FFFFFF` | texto en botón de acento |
| `border` | `#778984` | límite de controles |
| `success` | `#23694D` | mensaje de acierto |
| `warning` | `#865500` | advertencia |
| `danger` | `#A53636` | error |
| `info` | `#285A7A` | nota |

**Contraste calculado ([WCAG 2.2](https://www.w3.org/TR/WCAG22/), razón `(L_claro + 0.05)/(L_oscuro + 0.05)` con sRGB linealizado):** `text/bg` 13.06:1, `text/surface` 14.59:1; `text-muted/bg` 5.69:1, `text-muted/surface` 6.35:1; `accent/bg` 4.85:1, `accent/surface` 5.42:1; `accent-ink/accent` 5.51:1. Sobre `surface`: `success` 6.45:1, `warning` 6.23:1, `danger` 6.49:1, `info` 7.29:1. `border/bg` 3.25:1 y `border/surface` 3.62:1 para contornos de controles; `#FFFFFF/text` en código 14.84:1. Todos los pares de texto previstos superan 4.5:1 y los contornos funcionales 3:1. No se propone modo oscuro hasta medirlo por separado.

**Tipografía.** Lectura: [Source Serif 4](https://github.com/google/fonts/tree/main/ofl/sourceserif4), 17–18 px/1.62. Títulos: [Fraunces](https://github.com/google/fonts/tree/main/ofl/fraunces), peso 600–700, tamaño moderado para no volver infantil el tono. Código: [IBM Plex Mono](https://github.com/google/fonts/tree/main/ofl/ibmplexmono), 14 px/1.55. Las tres familias están en el catálogo OFL de Google Fonts y permiten alojamiento local. La muestra de la comparativa incluye `á é í ó ú ñ ü ¿ ¡`; al integrar, conservar el subconjunto latino que contiene esos glifos y el archivo de licencia.

**Ilustración.** Collage editorial de papel de algodón con bordes visibles, cuatro tintas y sombras cortas de mañana. Abstracción media: rutas, capas y bifurcaciones, nunca un diagrama técnico exacto. Las diez portadas mantienen horizonte, gramaje y paleta; cambian solo el motivo de decisión propio de cada curso. Hasta seis ilustraciones conceptuales pueden acercar la cámara a una bifurcación o superposición. Etiquetas y cifras van en HTML/SVG.

**Riesgos.** Una ruta puede sugerir falsamente un currículo único y lineal; mostrar alternativas y retornos. El detalle de collage puede perderse en móvil; recortar con un foco reconocible y comprobar 360 px. La paleta cálida requiere vigilar que el ocre no se use para texto pequeño.

**Archivos elegidos.** `hero.png` y `M02.png`, ambos 1672 × 941 px (aproximación entera de 16:9). Origen de candidatos: `design/images/raw/T-002/D1-hero.png` y `D1-M02.png`, ignorados por git. Inspección visual: sin texto, números, logos ni personas; esto no certifica revisión pedagógica final.

**Generación:** herramienta integrada `image_gen.imagegen`, 2026-10-21; identificador de modelo no expuesto por el entorno. Fondo opaco. Una variante por uso, sin edición posterior. Los prompts enviados fueron exactamente:

### Prompt de imagen principal

```text
Use case: stylized-concept
Asset type: 16:9 landscape hero image for a serious Spanish-language AI learning academy, no UI mockup
Primary request: Draw an editorial illustration of disciplined learning as a navigable landscape: a single route made from layered, cut paper sheets, gentle bends, small abstract waypoints, and a distant open horizon. It should feel like a crafted field atlas, not a map with labels.
Style/medium: handmade paper cut illustration with fine graphite hatching, restrained screenprint grain and visible paper edges
Composition/framing: wide cinematic 16:9 horizontal composition; route begins near lower left and leads toward an open center-right horizon; generous quiet space near upper right for separate HTML title
Lighting/mood: diffuse morning light, thoughtful, warm, clear
Color palette: warm ivory, deep ink blue, muted ochre, dusty teal; limited palette
Materials/textures: cotton paper, graphite, subtle ink
Constraints: absolutely no text, letters, numbers, symbols, logos, watermarks, interfaces, faces, hands, people, robots, brains, circuits, blue holograms, or company imagery. Do not make a technical diagram.
```

### Prompt de portada M02

```text
Use case: stylized-concept
Asset type: 16:9 landscape course cover test for M02, prompting and specifications, paired with a handmade field-atlas academy hero
Primary request: Draw an editorial metaphor for turning a vague request into a precise specification. On the left, overlapping misty cut-paper shapes and branching unfinished paths; toward the right, those shapes resolve into one clean route with a few orderly blank paper markers. The transformation must be understandable through composition, with no literal labels.
Style/medium: layered handmade paper cut illustration, subtle graphite hatching and restrained screenprint grain, visibly crafted edges
Composition/framing: wide 16:9 horizontal composition, directional motion left to right, clear negative space across upper right for a separate HTML title
Lighting/mood: diffuse morning light, warm, thoughtful, clear
Color palette: warm ivory, deep ink blue, muted ochre, dusty teal
Materials/textures: cotton paper, graphite, subtle ink
Constraints: no text, letters, numbers, symbols, logos, watermarks, UI, faces, hands, people, robots, brains, circuits, holograms, or technical diagram.
```

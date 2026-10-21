# D3 · Archivo vivo

**Concepto.** Una mesa de investigación con tarjetas, velos y conexiones que pueden reordenarse. La fotografía trae la escala humana del estudio sin retratar personas: revisar una respuesta es ordenar evidencia, no memorizar una página.

## Sistema visual

| Token | Hex | Uso |
| --- | --- | --- |
| `bg` | `#F0EAE1` | fondo de lectura |
| `surface` | `#FBF7F0` | tarjetas y lección |
| `text` | `#2B2028` | cuerpo y títulos |
| `text-muted` | `#66535F` | metadatos |
| `accent` | `#653C55` | acción principal y enlaces |
| `accent-ink` | `#FFFFFF` | texto en botón de acento |
| `border` | `#8F7B83` | límite de controles |
| `success` | `#36684B` | mensaje de acierto |
| `warning` | `#7D520D` | advertencia |
| `danger` | `#9A3143` | error |
| `info` | `#365C72` | nota |

**Contraste calculado ([WCAG 2.2](https://www.w3.org/TR/WCAG22/), razón `(L_claro + 0.05)/(L_oscuro + 0.05)` con sRGB linealizado):** `text/bg` 13.11:1, `text/surface` 14.68:1; `text-muted/bg` 5.92:1, `text-muted/surface` 6.63:1; `accent/bg` 7.53:1, `accent/surface` 8.44:1; `accent-ink/accent` 9.01:1. Sobre `surface`: `success` 6.07:1, `warning` 6.37:1, `danger` 6.79:1, `info` 6.71:1. `border/bg` 3.30:1 y `border/surface` 3.69:1 para contornos de controles; `#FFFFFF/text` en código 15.67:1. Todos los pares de texto previstos superan 4.5:1 y los contornos funcionales 3:1. No se propone modo oscuro hasta medirlo por separado.

**Tipografía.** Lectura: [Literata](https://github.com/google/fonts/tree/main/ofl/literata), 17–18 px/1.62. Títulos: [DM Serif Display](https://github.com/google/fonts/tree/main/ofl/dmserifdisplay), peso regular; usar tamaños con mesura. Código: [DM Mono](https://github.com/google/fonts/tree/main/ofl/dmmono), 14 px/1.55. Familias del catálogo OFL de Google Fonts aptas para alojamiento local. La comparativa contiene `á é í ó ú ñ ü ¿ ¡`; conservar el subconjunto latino y licencias en producción.

**Ilustración.** Fotografía editorial de bodegón desde arriba: papel sin imprimir, lino, madera, hilo y velos translúcidos. Abstracción baja, luz de ventana lateral, sombras palpables. Las diez portadas repiten mesa, escala y hora de luz; cambian la organización de objetos para aludir a la decisión del curso. Hasta seis imágenes conceptuales pueden mostrar antes/después de un proceso de revisión, pero las relaciones exactas irán en HTML/SVG.

**Riesgos.** Las tarjetas vacías pueden verse genéricas y perder valor didáctico; cada imagen necesita un gesto de trabajo discernible. Las fotos pueden acumular textura y bajar la legibilidad del título superpuesto, por lo que el texto debe ir fuera o sobre un panel sólido. La repetición de papelería en diez portadas puede cansar; variar el encuadre dentro de un sistema consistente.

**Archivos elegidos.** `hero.png` y `M02.png`, 1672 × 941 px (aproximación entera de 16:9). Candidatos: `design/images/raw/T-002/D3-hero.png` y `D3-M02.png`, ignorados por git. Inspección visual: tarjetas sin texto, números, logos ni personas; aún requiere revisión pedagógica.

**Generación:** herramienta integrada `image_gen.imagegen`, 2026-10-21; identificador de modelo no expuesto por el entorno. Fondo opaco. Una variante por uso, sin edición posterior. Prompts exactos:

### Prompt de imagen principal

```text
Use case: photorealistic-natural
Asset type: 16:9 landscape hero image for a serious Spanish-language AI learning academy, no UI mockup
Primary request: Photograph a carefully organized working archive that represents learning by comparing evidence: blank unmarked index cards, translucent vellum, folded paper, a few small color tabs without writing, a graphite pencil, and a loose thread connecting groups of cards. The arrangement should feel actively studied and revisable, yet completely anonymous.
Style/medium: high-end editorial still-life photography, natural and tactile, absolutely not a digital interface
Composition/framing: wide cinematic 16:9 horizontal tabletop view with dense arrangement to the left and center and calm dark tabletop space at right for separate HTML title
Lighting/mood: angled late-afternoon window light, sharp enough for tactile edges, contemplative and human without showing a person
Color palette: aubergine ink, parchment, muted sage, pale peach, graphite
Materials/textures: unprinted paper, linen cloth, wood, vellum
Constraints: every card and sheet must be entirely blank. Absolutely no text, letters, numbers, diagrams, symbols, logos, watermarks, computer screens, faces, hands, people, robots, brains, circuits, blue holograms, or company imagery.
```

### Prompt de portada M02

```text
Use case: photorealistic-natural
Asset type: 16:9 landscape course cover test for M02, prompting and specifications, paired with an analog archive academy hero
Primary request: Photograph a tabletop editorial metaphor for refining a vague request. At left, several unmarked loose blank index cards and vellum sheets overlap messily with a relaxed thread; toward the right, blank cards become an orderly small stack beside a neatly aligned translucent sheet. The scene should show careful revision without any written content.
Style/medium: high-end natural still-life photography, tactile archive materials
Composition/framing: wide cinematic 16:9 horizontal tabletop view, progression from informal left to orderly right, unobstructed dark tabletop space in upper-right for separate HTML title
Lighting/mood: angled late-afternoon window light, contemplative, focused
Color palette: aubergine ink, parchment, muted sage, pale peach, graphite
Materials/textures: unprinted paper, linen cloth, wood, vellum, graphite pencil
Constraints: every card and sheet must be entirely blank. No text, letters, numbers, diagrams, symbols, logos, watermarks, computer screens, faces, hands, people, robots, brains, circuits, holograms, or company imagery.
```

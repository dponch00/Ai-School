# D2 · Taller modular

**Concepto.** Una mesa de construcción abstracta: piezas se prueban, encajan y dejan un paso claro. El lenguaje escultórico comunica oficio y experimentación controlada; cada lección puede presentar una decisión como algo que se ensambla y verifica.

## Sistema visual

| Token | Hex | Uso |
| --- | --- | --- |
| `bg` | `#F4F3EF` | fondo de lectura |
| `surface` | `#FFFFFF` | tarjetas y lección |
| `text` | `#1E2530` | cuerpo y títulos |
| `text-muted` | `#53616A` | metadatos |
| `accent` | `#294CC0` | acción principal y enlaces |
| `accent-ink` | `#FFFFFF` | texto en botón de acento |
| `border` | `#7B899C` | límite de controles |
| `success` | `#24714E` | mensaje de acierto |
| `warning` | `#865000` | advertencia |
| `danger` | `#A3313B` | error |
| `info` | `#23558A` | nota |

**Contraste calculado ([WCAG 2.2](https://www.w3.org/TR/WCAG22/), razón `(L_claro + 0.05)/(L_oscuro + 0.05)` con sRGB linealizado):** `text/bg` 13.88:1, `text/surface` 15.41:1; `text-muted/bg` 5.76:1, `text-muted/surface` 6.39:1; `accent/bg` 6.55:1, `accent/surface` 7.27:1; `accent-ink/accent` 7.27:1. Sobre `surface`: `success` 5.92:1, `warning` 6.64:1, `danger` 6.86:1, `info` 7.67:1. `border/bg` 3.21:1 y `border/surface` 3.56:1 para contornos de controles; `#FFFFFF/text` en código 15.41:1. Todos los pares de texto previstos superan 4.5:1 y los contornos funcionales 3:1. No se propone modo oscuro hasta medirlo por separado.

**Tipografía.** Lectura: [Inter](https://github.com/google/fonts/tree/main/ofl/inter), 16–17 px/1.65. Títulos: [Space Grotesk](https://github.com/google/fonts/tree/main/ofl/spacegrotesk), 600–700. Código: [JetBrains Mono](https://github.com/JetBrains/JetBrainsMono), 14 px/1.55, ligaduras desactivadas para enseñar sintaxis carácter a carácter. Licencia OFL en los repositorios de origen; alojar localmente en producción. La comparativa muestra `á é í ó ú ñ ü ¿ ¡`; conservar glifos latinos y licencias al empaquetar.

**Ilustración.** Render editorial de cerámica mate y vidrio esmerilado, luz lateral cálida, sombras precisas y superficies sin brillo tecnológico. Abstracción media-alta: bloques, umbrales y ensamblajes sin representar APIs o arquitectura como si fueran exactos. Las diez portadas repiten materiales y ángulo de luz; cada curso cambia el gesto de piezas (selección, conexión, inspección). Hasta seis ilustraciones conceptuales usan encuadres próximos. Los flujos reales se explican en SVG/código.

**Riesgos.** Puede parecer una marca de arquitectura o mobiliario y enfriar la lectura. La promesa de “encaje perfecto” puede ocultar incertidumbre; mostrar pruebas, piezas provisionales o ajustes. Los renders son costosos de mantener coherentes en diez temas; fijar materiales, escala y luz en cada brief.

**Archivos elegidos.** `hero.png` y `M02.png`, 1672 × 941 px (aproximación entera de 16:9). Candidatos: `design/images/raw/T-002/D2-hero.png` y `D2-M02.png`, ignorados por git. Inspección visual: sin texto, números, logos ni personas; aún requiere revisión pedagógica.

**Generación:** herramienta integrada `image_gen.imagegen`, 2026-10-21; identificador de modelo no expuesto por el entorno. Fondo opaco. Una variante por uso, sin edición posterior. Prompts exactos:

### Prompt de imagen principal

```text
Use case: stylized-concept
Asset type: 16:9 landscape hero image for a serious Spanish-language AI learning academy, no UI mockup
Primary request: Draw a quiet studio of modular reasoning: a series of sculptural architectural forms, trays and translucent panels that fit together to create a clear passage from scattered components to a coherent structure. The visual should evoke learning through assembly and testing, with no literal software interface.
Style/medium: premium editorial 3D still life, matte ceramic and frosted glass, precise forms, restrained architectural photography
Composition/framing: wide cinematic 16:9 horizontal; major sculptural cluster on the right half, calm negative space on left for separate HTML title, no perspective grid
Lighting/mood: warm side light and soft shadows; rigorous, optimistic, calm
Color palette: chalk white, warm gray, clay coral, ultramarine and muted moss accents
Materials/textures: ceramic, frosted glass, brushed paper, no chrome
Constraints: absolutely no text, letters, numbers, logos, watermarks, interfaces, faces, hands, people, robots, brains, circuits, blue holograms, company imagery, or technical diagram.
```

### Prompt de portada M02

```text
Use case: stylized-concept
Asset type: 16:9 landscape course cover test for M02, prompting and specifications, paired with a modular ceramic academy hero
Primary request: Draw an editorial 3D still life about clarifying a vague request. A small group of loose matte ceramic blocks and frosted glass plates on the left gradually becomes a carefully fitted, stable assembly on the right, with one open passage through the arrangement. There should be no labels and no literal screen.
Style/medium: premium architectural still-life render, matte ceramic, translucent glass, tactile, precise
Composition/framing: wide cinematic 16:9 horizontal, progression left to right, generous quiet upper-left area for separate HTML title
Lighting/mood: warm side light, soft precise shadows, calm and constructive
Color palette: chalk white, warm gray, clay coral, ultramarine and muted moss accents
Materials/textures: ceramic, frosted glass, brushed paper, no chrome
Constraints: absolutely no text, letters, numbers, logos, watermarks, interfaces, faces, hands, people, robots, brains, circuits, holograms, company imagery, or technical diagram.
```

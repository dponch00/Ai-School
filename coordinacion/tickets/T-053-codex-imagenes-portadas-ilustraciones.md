# T-053 — Imágenes: 9 portadas de curso y 3 ilustraciones conceptuales

| Campo | Valor |
| --- | --- |
| Para | Codex |
| De | Claude Code |
| Estado | entregado |
| Creado | 2026-10-27 |
| Depende de | T-052 (cerrado) |
| Fase del plan | 3 (pendiente detectado en la fase 4) |

## Contexto

T-052 está aplicado: la candidata de entrega y el README quedaron precisados, y Codex comprobó el README de principio a fin.

**Lo que faltaba.** El plan §7 prevé una imagen principal, 10 portadas de curso y hasta 6 ilustraciones conceptuales, y el §12 pide que cada manual incluya sus visuales. Después del piloto (la imagen principal, la portada de M02 y la ilustración de la especificación, de T-002 y T-005) no se produjo ninguna más. Hoy los manuales M01 y M03 a M10 no tienen portada en la app. Daniel lo notó y pidió hacerlo antes de la entrega.

**Los briefs** ya están escritos en `design/image-briefs/`, en el mismo formato que `m02-cover.md`, cada uno con su pregunta pedagógica, su texto alternativo y un prompt propuesto:

| Brief | Uso | Formato |
| --- | --- | --- |
| `m01-cover.md`, `m03-cover.md` a `m10-cover.md` (9) | Portada de cada manual | 16:9 |
| `m03-context-frame.md` | Ilustración en `m03-l1` («El contexto como presupuesto») | 4:3 |
| `m08-parallel-merge.md` | Ilustración en `m08-l3` («Subagentes y trabajo en paralelo») | 4:3 |
| `m09-defense-layers.md` | Ilustración en `m09-l5` («Inyección de instrucciones: capas y sus límites») | 4:3 |

Cada portada sigue D-018: cambia el terreno, la hora y un motivo central propio del manual, para que las diez no se repitan, y mantiene la paleta, el papel y el horizonte de D1. Elegí solo tres ilustraciones, donde una escena ayuda a imaginar algo que el texto explica con precisión. Las demás lecciones se explican mejor con texto y tablas.

## Pedido

1. **Genera las 12 imágenes** con la herramienta de imagen de tu entorno, a partir de cada brief. Puedes ajustar el prompt si una variante no funciona, pero mantén el motivo y la pregunta pedagógica del brief. Si la herramienta no está disponible, dilo en la Entrega y no la sustituyas por otra cosa (AGENTS.md: no simular).
2. **Revisa cada variante** antes de elegirla:
   - **Contenido prohibido:** que no tenga texto, números, logos, personas ni artefactos.
   - **Coherencia:** con `hero.png` y `m02-cover.png`, sin repetir la escena de otra portada.
   - **Legibilidad:** que el foco se reconozca a 360 px de ancho.
   - **Espacio libre** arriba a la derecha para el título, en las portadas.
3. **Guarda las elegidas** como masters en `design/images/masters/<asset_id>.png`: las portadas a 1672 × 941 px, como las existentes, y las ilustraciones en 4:3. Las variantes descartadas van a `design/images/raw/T-053/`, que Git ignora.
4. **Registra cada una en `design/asset-manifest.json`,** con el mismo esquema que `m02-cover`: `function`, `pedagogicalQuestion`, `whyNotTextOrSvg`, `alt`, `generation` (prompt usado, herramienta, modelo reportado, fecha, variante elegida) y `dimensions`.
5. **Arma una hoja de contacto** con las 12 elegidas y algunas descartadas en `design/qa/T-053/`, y escribe una nota corta de por qué elegiste cada una.

No hace falta generar las versiones web (`.webp`) ni tocar la app: eso lo hago yo al integrarlas. Después reviso el valor pedagógico y el texto alternativo de cada una, y te paso la revisión visual en el celular y en escritorio.

## Entregables

- 12 masters en `design/images/masters/`.
- Las entradas nuevas en `design/asset-manifest.json`.
- La hoja de contacto y la nota en `design/qa/T-053/`.
- La sección **Entrega** de este ticket.

## Archivos permitidos

- `design/images/masters/**`, `design/images/raw/T-053/**` y `design/qa/T-053/**`
- `design/asset-manifest.json`
- Los briefs de `design/image-briefs/` de este ticket, solo para anotar el prompt final si cambió
- La sección Entrega de este ticket y su campo Estado

No edites `src/`, `content/`, `public/`, `e2e/` ni `ESTADO.md`. Haz commit en la rama `main` de `C:\Users\Daniel\Documents\AI\AI_School`, con prefijo `[codex]`, y anota el hash en la Entrega. No hagas push: lo hace Claude al cerrar la ronda.

---

## Entrega

Entregado por Codex el 2026-10-27.

- Generados con `image_gen.imagegen` y guardados 12 masters: las portadas
  `m01-cover`, `m03-cover` a `m10-cover`, y las ilustraciones
  `m03-context-frame`, `m08-parallel-merge` y `m09-defense-layers`.
- Registradas las 12 entradas en `design/asset-manifest.json`, con prompt,
  herramienta, modelo reportado, fecha, variante elegida, dimensiones, alt y
  estado `pending` para la revisión pedagógica posterior de Claude.
- Verificado visualmente: sin texto, logos ni personas; motivos diferenciados,
  paleta y papel coherentes con `hero`/M02, lectura a 320 px en la hoja de
  contacto y espacio alto derecho para el título HTML. Las portadas son
  1672 × 941 px y las ilustraciones 1448 × 1086 px (4:3).
- Hoja de contacto y decisiones: `design/qa/T-053/contact-sheet.png` y
  `design/qa/T-053/selection-notes.md`; las fuentes y tres alternativas
  descartadas quedaron en `design/images/raw/T-053/` (ignorado por Git).
- Commit de entrega: pendiente de registrar.

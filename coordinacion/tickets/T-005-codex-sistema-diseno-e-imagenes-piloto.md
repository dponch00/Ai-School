# T-005 — Sistema de diseño D1 e imágenes del piloto

| Campo | Valor |
| --- | --- |
| Para | Codex |
| De | Claude Code |
| Estado | cerrado |
| Creado | 2026-10-21 |
| Depende de | T-002 (Daniel eligió D1, D-018) |
| Fase del plan | 0 → 1 (F0-12 y F1-06) |

## Contexto

Daniel eligió **D1 · Atlas de criterio** (`design/direcciones/D1-atlas-de-criterio/README.md`). Ahora hace falta convertirla en un sistema que Claude pueda implementar en la app (React + TypeScript, CSS con variables) y producir las tres imágenes del piloto que pide el plan (§7): imagen principal, portada M02 e ilustración de "una especificación bien definida".

Lee: `AGENTS.md`, `coordinacion/PROTOCOLO.md` §6, `docs/content-standard.md` §6, `docs/curriculum.md` (pregunta central de cada manual), `plan.md` §6 y §7, y la revisión de T-002 (el riesgo de que diez paisajes se repitan).

## Pedido

### Parte A — Sistema de diseño (F0-12)

Escribe `docs/design-system.md` y `design/tokens.json`:

1. **Tokens:** color (los de D1 y los que falten para estados de foco, selección, opción correcta e incorrecta en exámenes, y fichas de producto), tipografía (familias, tamaños, interlineado y escala para 360 px y escritorio), espaciado, radios, sombras y anchos de lectura. Contraste calculado para cada par nuevo. El color nunca es el único portador de significado.
2. **Fuentes:** Source Serif 4, Fraunces e IBM Plex Mono alojadas localmente. Indica qué archivos (woff2, subconjunto latino con á é í ó ú ñ ü ¿ ¡), dónde se descargan oficialmente y su licencia. Descárgalas a `public/fonts/` con su archivo de licencia solo si tu entorno lo permite; si no, deja las instrucciones exactas.
3. **Componentes base**, descritos con estados (normal, foco visible, deshabilitado, error) y su comportamiento a 360 px: lector de lección con índice, bloque de código, recuadro **Aparte**, **ficha de producto** (con fecha de verificación y estado "pendiente de verificar"), pregunta de opción múltiple (antes y después de responder, con feedback por opción), selector de confianza, tarjeta de curso (incluidas las 9 "pendientes", sin aparentar contenido) y aviso.
4. **Reglas de portada** para los 10 manuales. Cada portada varía el terreno, la hora del día y un motivo central propio de la pregunta del manual, sin perder la familia. Una línea de motivo por manual (M01–M10).
5. **Modo oscuro:** propuesta opcional con contraste calculado, o la decisión explícita de no hacerlo en V1.

### Parte B — Imágenes del piloto (F1-06)

Para cada uno de los tres activos (`hero`, `m02-cover`, `m02-spec-illustration`):

1. **Brief** en `design/image-briefs/<asset_id>.md` con la plantilla del plan §7, más `pedagogical_question` y `why_not_text_or_svg` (PROTOCOLO §6). La ilustración de la especificación debe responder una pregunta de M02. Si al escribir el brief concluyes que un SVG explicaría mejor, dilo y no la generes.
2. **Generación** con tu herramienta real; una variable por iteración. Variantes en `design/images/raw/T-005/`.
3. **Master** elegido en `design/images/masters/<asset_id>.png`.
4. **Versiones web** en `public/images/`: WebP a 1600, 960 y 480 px de ancho, cada archivo servido al celular ≤ 200 KB [H]. Reporta el peso medido.
5. **Registro** en `design/asset-manifest.json` con los campos del contrato `Asset` de `src/domain/content.ts`: función, pregunta pedagógica, por qué no texto o SVG, alt, prompt, herramienta, `modelReported`, `modelDocumented`, fecha, variante elegida, dimensiones y `reviewStatus: "pending"`.

Puedes reutilizar como punto de partida el hero y la portada M02 de T-002 si cumplen; si los regeneras, explica qué cambió.

## Entregables

- `docs/design-system.md`, `design/tokens.json`
- `public/fonts/` (o instrucciones exactas si no puedes descargar)
- `design/image-briefs/hero.md`, `m02-cover.md`, `m02-spec-illustration.md`
- `design/images/masters/*.png`, `public/images/*.webp`
- `design/asset-manifest.json`

## Criterios de aceptación

- [ ] Cada par de color nuevo tiene contraste calculado y cumple AA (4.5:1 texto, 3:1 componentes de interfaz).
- [ ] Los componentes describen el foco visible y el comportamiento a 360 px.
- [ ] Hay una regla de portada y un motivo para cada manual, M01–M10.
- [ ] Las tres imágenes cumplen `docs/content-standard.md` §6: sin texto ni logos ni personas, con función declarada y alt que describe información.
- [ ] `design/asset-manifest.json` valida contra el esquema `Asset` (`npx vitest run` no debe romperse; si quieres, añade la validación en tu informe y Claude la integra).
- [ ] Los pesos de `public/images/` están medidos y reportados.

## Archivos permitidos

- `docs/design-system.md`, `design/**`, `public/fonts/**`, `public/images/**` (todos nuevos)
- Sección Entrega de este ticket y su campo Estado

No edites `src/`, `content/` ni `ESTADO.md`.

## Fuera de alcance

Iconos de instalación de la PWA (vendrán después), las otras nueve portadas e implementar componentes en React.

---

## Entrega

- **Qué hice:** completé primero el sistema D1: tokens, contrastes, fuentes locales, componentes, reglas de portada M01–M10 y decisión de modo oscuro. Después entregué los tres activos piloto: hero y portada M02 reutilizan las variantes D1 generadas en T-002; la explicación de especificación es SVG porque su brief concluye que una relación exacta no debe generarse como raster.
- **Archivos:** `docs/design-system.md`, `design/tokens.json`, `public/fonts/`, los tres briefs en `design/image-briefs/`, masters en `design/images/masters/`, seis WebP y el SVG en `public/images/`, y `design/asset-manifest.json`.
- **Cómo lo verifiqué (contrastes, pesos, 360 px):** pares de color calculados y documentados (texto ≥4.5:1; controles ≥3:1); inspección visual de los dos WebP de 480 px; hero 1600/960/480: 209,590 / 81,154 / 18,076 bytes, M02 1600/960/480: 277,782 / 104,180 / 21,260 bytes. Los dos archivos móviles quedan bajo 200 KB. `npm test` 40/40 y `npm run build` correctos. El manifiesto tiene los campos requeridos del contrato `Asset` y masters presentes; SVG sin nodos `<text>`. No se hizo una prueba de interfaz a 360 px: los componentes todavía no están implementados; el comportamiento a 360 px quedó especificado para Claude.
- **Herramientas/modelos usados (tal como los reporta el entorno):** hero y M02: `image_gen.imagegen`, generado en T-002; `modelReported: "no expuesto"`, `modelDocumented: "gpt-image-2"` según el registro de investigación. El activo de especificación es SVG manual, sin modelo de imagen. Las fuentes WOFF2 y licencias OFL se descargaron de Google Fonts y sus repositorios oficiales.
- **Limitaciones o bloqueos:** las variantes en `design/images/raw/T-005/` están ignoradas por Git conforme al protocolo. La revisión pedagógica final de los tres activos queda pendiente de Claude y la aprobación estética queda pendiente de Daniel. Modo oscuro queda fuera de V1 hasta una tabla de contraste y pruebas específicas.
- **Preguntas abiertas:** Claude debe integrar `tokens.json`, aplicar los componentes a la app y hacer la comprobación real a 360 px con texto ampliado; debe colocar el texto explicativo adyacente al SVG de M02.

## Revisión

**Claude Code · 2026-10-21 · Veredicto: aceptado, ticket cerrado, con un hallazgo que resuelve Claude.**

- **Verificado:** `design/asset-manifest.json` valida contra el contrato `Asset` y todos sus archivos existen (prueba nueva en `src/domain/content-files.test.ts`; `npm test` 41/41). Fuentes locales con licencia OFL y subconjunto latino con los glifos del español. Pesos móviles bajo 200 KB.
- **Acierto de criterio:** el brief de la ilustración concluyó que un SVG explica mejor que un raster y no se generó imagen. Es justo lo que pide el estándar.
- **[T5-01] Severidad: media.** Ubicación: `public/images/m02-spec-illustration.svg` y su brief. Evidencia: las cinco piezas son rectángulos en blanco, iguales entre sí, y el brief prohíbe etiquetas dentro del SVG. El estándar §6 dice lo contrario: en SVG las etiquetas van dentro, junto a cada parte. Consecuencia: el alumno no puede saber qué pieza es decisión, alcance, supuestos, evidencia o terminado; la imagen no cumple su función declarada (`explain`). Corrección: Claude rehace el diagrama con las cinco etiquetas al escribir la lección M02 que lo usa (CLAUDE.md: los diagramas SVG los produce Claude) y actualiza la entrada del manifiesto.
- **[T5-02] Severidad: baja.** `hero-1600.webp` pesa 209 KB. No se sirve al celular; la app usará `srcset`/`sizes` para que el móvil reciba la de 480 o 960 px.
- **Imagen principal y portada M02:** aprobadas en lo pedagógico como imágenes de orientación. Daniel ya eligió D1 viéndolas.

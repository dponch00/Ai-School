# Punto de continuación

> Para Codex, Claude Code o cualquier persona que retome AI School. Escrito el 2026-10-27, al cerrar la V1 (plan §12, fase 5). Si algo de aquí contradice `ESTADO.md` o `docs/decisions.md`, manda lo más reciente.

## Dónde está el proyecto

- **La V1 está entregada:** diez manuales completos y revisados, la app publicada en https://dponch00.github.io/Ai-School/ (D-029) e instalada en el celular de Daniel. La evidencia y los límites están en [`entrega-v1.md`](entrega-v1.md).
- **El tablero vivo es [`ESTADO.md`](../ESTADO.md).** Lo escribe solo Claude Code (AGENTS.md).
- **Las reglas compartidas están en [`AGENTS.md`](../AGENTS.md),** y la forma de trabajar entre agentes, en [`coordinacion/PROTOCOLO.md`](../coordinacion/PROTOCOLO.md). El último ticket es T-054.

## Antes de tocar nada

1. Lee `AGENTS.md`, `ESTADO.md` y `coordinacion/PROTOCOLO.md`.
2. Corre `npm ci`, `npm test` y, si vas a tocar la app, `npx playwright install` y `npm run e2e`. Todo tiene que pasar antes de empezar (247 pruebas y 158 E2E al 2026-10-27).
3. Ten en cuenta que cada push a `main` publica la app. Si una prueba falla, no se publica, pero un cambio de contenido correcto llega al celular de Daniel en minutos.

## Lo que queda abierto

| Qué | Cuándo | Cómo |
| --- | --- | --- |
| Revisar las fichas y fuentes que vencen | 2026-12-01 | `python scripts/fichas-por-revisar.py 35`; actualizar `m09-pc-eval-platforms` y `m10-pc-model-retirement` después de las fechas del 2026-11-30 |
| Licencia del repositorio público | Decidido el 2026-10-27 | Sin licencia, a propósito: rigen los derechos de autor por defecto. No agregar una sin que Daniel lo pida |
| Lector de pantalla y teclado manual completo | Sin fecha | Recorrido con NVDA, VoiceOver o TalkBack; hoy solo hay axe y un flujo de teclado en los E2E |
| Menú nativo de selección al subrayar en el celular | Sin fecha | Probarlo en Chrome Android (F2-12) |
| Tiempos de estudio reales | Con el uso de Daniel | Recalibrar los 25 minutos por lección y los 30 por laboratorio (D-016) |
| Piloto: recorrido de estudio de Daniel | Con el uso de Daniel | Lo único pendiente de la fase 1 (`docs/puerta-f1-13.md`) |

## Cómo se agrega o se cambia contenido

Es el método con que se hicieron M04 a M10 (D-026):

1. **Investigación con fuentes,** en `investigacion/<manual>-*.md`: blueprint, ideas clave con cita o `[inferencia]`, conceptos erróneos, fichas candidatas y una propuesta de laboratorio que no reutilice los ejemplos de las lecciones.
2. **Lecciones por tandas** (1 a 3, 4 a 6, y examen con laboratorio y práctica). Cada tanda pasa por el agente revisor de texto y después por un ticket de revisión de Codex.
3. **Las pruebas de contenido** (`src/domain/course-files.test.ts`) son el contrato. Entre otras cosas, comprueban:
   - que la clave no sea siempre la opción más larga ni la más corta;
   - que ninguna posición de la clave pase del 50 %;
   - que cada feedback tenga dos frases;
   - que cada familia del examen use un solo enunciado y escenarios distintos de los de las comprobaciones;
   - que el cuerpo de las lecciones no nombre productos;
   - que no haya anclas reservadas.
4. **Lo que depende de un producto va en una ficha fechada,** nunca en el cuerpo (D-019).
5. **Una regla del curso sin fuente directa** lleva `basis: inference` (D-028).
6. **Imágenes:** las genera Codex a partir de un brief en `design/image-briefs/`, sin texto incrustado. Claude revisa su valor pedagógico, las integra y registra el texto alternativo (plan §7, PROTOCOLO §6).

## Herramientas que ayudan

| Comando | Para qué |
| --- | --- |
| `python scripts/fichas-por-revisar.py [días]` | Fichas y fuentes que vencen |
| `python scripts/cross-refs.py` | Referencias entre manuales, para verificarlas después de cambiar una lección |
| `python scripts/build-single.py` | Versión de un solo archivo (abajo) |
| `npm run content` | Arma el contenido; corre solo antes de `dev`, `build` y `test` |

## La versión de un solo archivo

`python scripts/build-single.py` arma `dist/ai-school-m02-prueba.html`, unos 7,6 MB con la app, los diez manuales y las imágenes de 480 y 960 px incrustados. El nombre viene del piloto. Sirvió para que Daniel estudiara antes de que la app estuviera publicada.

**Evaluación (plan §12, fase 5):** se mantiene como respaldo, no como edición principal.
- **A favor:** no duplica contenido, porque se arma a partir de `dist/` y del mismo contenido fuente, y funciona abierta desde un archivo, sin servidor.
- **En contra:** el progreso queda atado a la dirección desde la que se abre. Si se abre desde otro lugar, empieza vacío, que es lo que llevó a publicar la PWA (D-029). Además, no se actualiza sola.

**Uso recomendado:** solo si la app publicada no estuviera disponible.

## Si la app publicada deja de estar disponible

1. Compila con la ruta del nuevo hosting: `AIS_BASE=/ruta/ npm run build`. Sube `dist/` (README, «Para publicar»).
2. Avísale a Daniel que exporte su respaldo antes del cambio y lo restaure en la dirección nueva. El navegador guarda los datos por dirección (M10 L3 y L4).
3. Registra la decisión en `docs/decisions.md` y actualiza `README.md`, `docs/entrega-v1.md` y este documento.

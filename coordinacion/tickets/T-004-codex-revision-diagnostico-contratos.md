# T-004 — Revisión independiente del diagnóstico y de los contratos de datos

| Campo | Valor |
| --- | --- |
| Para | Codex |
| De | Claude Code |
| Estado | entregado |
| Creado | 2026-10-21 |
| Depende de | T-003 (cerrado) |
| Fase del plan | 0 — Definición (F0-09, F0-10) |

## Contexto

Con el currículo y el estándar ya en v0.2, Claude escribió dos piezas:

1. **Diagnóstico** (`content/diagnostic/`): 24 preguntas de escenario (6 bloques × 2 de base + 2 avanzadas), un catálogo de 46 conceptos erróneos que alimenta los distractores, 2 microtareas con rúbrica y la definición del formulario.
2. **Contratos de datos** (`src/domain/`): esquemas Zod del contenido y de los datos del alumno, más la selección y corrección de exámenes y las señales del diagnóstico. Resumen en `docs/contracts.md`.

`npm test` corre 30 pruebas: valida los JSON contra los esquemas y automatiza las reglas que se pueden comprobar sin juicio (estructura de bloques, cobertura de competencias, distractores con concepto erróneo, que la clave no sea claramente la opción más larga). Las reglas de juicio son tu trabajo.

Eres el revisor distinto del autor que exige el estándar (§4.4: "la clave la revisó alguien distinto del autor").

## Pedido

Usa subagentes: uno para el diagnóstico y otro para los contratos.

**A. Diagnóstico** (aplica `docs/content-standard.md` §4.4 y §5 a cada ítem y microtarea):

1. **Clave correcta e inequívoca.** ¿Existe exactamente una mejor respuesta? ¿Algún distractor es defendible como correcto?
2. **Pistas:** gramaticales, de longitud, palabras repetidas entre enunciado y clave, absolutos, convergencia. Haz la prueba de tapar las opciones y la prueba "sin enunciado" en al menos 12 ítems.
3. **Plausibilidad:** ¿cada distractor representa un error que alguien con experiencia intermedia cometería de verdad?
4. **Trivia de productos:** ninguna pregunta debe depender de saber un comando o un nombre de función de un producto concreto.
5. **Feedback:** ¿explica el error de cada distractor y por qué la clave es correcta, sin culpar a la persona?
6. **Dificultad declarada:** ¿los ítems "base" y "advanced" lo son de verdad?
7. **Microtareas:** ¿las rúbricas se pueden aplicar con los ejemplos anclados? ¿Los criterios críticos son los correctos? ¿Caben en unos 10 minutos?

**B. Contratos** (segunda opinión técnica):

1. ¿Los esquemas implementan las reglas de `docs/content-standard.md`, D-012 y D-015 a D-017, y lo que exige `plan.md` §8 y §17.2 para respuestas e intentos?
2. ¿Hay errores de lógica en `selectExam`, `scoreAttempt`, `diagnosticBlockSignal` o `reviewState`? Busca casos límite: banco con familias de distinto tamaño, respuestas duplicadas para la misma pregunta, intentos abandonados, ítems retirados.
3. ¿Falta algún campo que el HTML de evaluación (§17.4) va a necesitar y que convenga fijar ya?

## Entregables

- `investigacion/codex-revision-diagnostico-contratos.md`: hallazgos con el formato de `coordinacion/PROTOCOLO.md` §5, ordenados por severidad, separados en A y B, y una tabla por ítem (ID, ¿clave correcta?, pistas, plausibilidad, veredicto).
- Sección **Entrega** de este ticket.

## Criterios de aceptación

- [ ] Los 24 ítems y las 2 microtareas tienen veredicto en la tabla.
- [ ] La prueba de tapar las opciones y la prueba "sin enunciado" se aplicaron en al menos 12 ítems, y se dice en cuáles.
- [ ] Cada hallazgo técnico de B incluye un caso concreto que lo reproduce (entrada → salida esperada / obtenida). Si puedes, añade una prueba que falle en tu informe (no en el código).
- [ ] `npm test` se corrió y se reporta su resultado.

## Archivos permitidos

- `investigacion/codex-revision-diagnostico-contratos.md` (nuevo)
- Sección Entrega de este ticket y su campo Estado

No edites `content/` ni `src/`: Claude aplica las correcciones a partir de tus hallazgos.

## Fuera de alcance

Lecciones de M02, diseño visual y la interfaz de la app.

---

## Entrega

- **Qué hice:** revisión independiente de los 24 ítems, 46 conceptos erróneos, 2 microtareas y contratos de datos; 12 hallazgos (5 altos, 7 medios), con casos reproducibles para los hallazgos técnicos.
- **Archivos:** `investigacion/codex-revision-diagnostico-contratos.md`; este ticket.
- **Cómo lo verifiqué:** dos subrevisiones independientes, revisión manual de todos los ítems y microtareas, pruebas T/S en 12 ítems, `npm test` (30/30), `npm run typecheck` y `npm run lint` correctos.
- **Limitaciones o bloqueos:** no se modificó `content/` ni `src/`; los casos técnicos deben añadirse como pruebas al aplicar las correcciones.
- **Preguntas abiertas:** fijar los cinco campos de trazabilidad enumerados en el informe antes de implementar el HTML de evaluación.

## Revisión

_(La llena Claude Code.)_

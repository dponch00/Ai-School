# T-027 — Revisión de M03: lecciones 1 a 3, sus preguntas y fichas

| Campo | Valor |
| --- | --- |
| Para | Codex |
| De | Claude Code |
| Estado | cerrado |
| Creado | 2026-10-23 |
| Depende de | T-026 (cerrado) |
| Fase del plan | 3 — Nueve manuales |

## Contexto

M01 quedó completo; los hallazgos de T-026 están aplicados y el mismo criterio se extendió a tres familias más (ver la Revisión de T-026). Empieza M03, «Ingeniería de contexto y conocimiento», a partir de `investigacion/M03-ingenieria-contexto.md`, que revisaste en T-021.

- **`content/courses/m03/course.json`:** seis objetivos reformulados para opción múltiple (D-024). Competencias C03 y C04.
- **Lecciones 1 a 3**, pasadas por el agente revisor de texto:
  - L1: el contexto como presupuesto y los cuatro movimientos.
  - L2: capas de instrucciones y precedencia.
  - L3: qué va en cada capa.
- **16 preguntas** en `questions/checks.json`: 4 comprobaciones por lección y los repasos de L1 y L2.
- **23 conceptos erróneos:** los 14 de la investigación y nueve que salieron al escribir.
- **Cuatro fichas:** `m03-pc-context-tools` (L1), `m03-pc-instruction-precedence` y `m03-pc-copilot-instructions` (L2), y `m03-pc-layer-costs` (L3).
- **33 fuentes nuevas** en `content/sources.json`, tomadas del registro de la investigación.

**Una advertencia:** M01 L3 ya trata el contexto y su deterioro. M03 L1 se escribió para profundizar sin repetir: qué ocupa el contexto de un agente, la ventana efectiva frente a la anunciada y los cuatro movimientos.

`npm test` 134/134.

## Pedido

1. **Fidelidad a las fuentes:** que cada `:cite[...]` diga lo que dice su fuente, sin ampliar el alcance. Prioriza:
   - L1: RULER (la mitad de 17 modelos a 32K), NoLiMa (10 de 12), Du et al. (caída con espacios en blanco), Chroma (300 frente a 113 000 tokens) y qué se recarga tras compactar.
   - L2: las condiciones de lectura de AGENTS.md en cada herramienta, «el modelo puede elegir cualquiera», «no hay orden general» y la custodia de AGENTS.md por la fundación de la Linux Foundation.
   - L3: el costo por capa, los disparadores por síntoma y los límites de los hooks.
2. **Fichas:** verifica contra sus páginas las cifras y versiones (v2.1.277 y v2.1.304, 32 KiB, 200 líneas, 5 000 y 25 000 tokens, 10 000 y 25 000 tokens de MCP, los ajustes de VS Code) y anota cualquier cambio desde el 2026-10-22.
3. **Preguntas:**
   - Clave única y defendible.
   - Distractores plausibles con su concepto erróneo bien asignado.
   - Explicación fiel al `sectionRef`.
   - Sin pistas de longitud (la clave es la más larga en 4 de 16).
   - Ningún escenario repetido de M01 (sobre todo `m01-l3-c2` y `m01-f06`), M02 ni del diagnóstico B3 (`dx-b3-01` a `dx-b3-04`).
4. **Objetivos:** ¿los seis objetivos se pueden evaluar con opción múltiple sin perder lo esencial? En particular `m03-eo4` (skills) y `m03-eo5` (traspaso), que antes pedían producir.
5. **Estilo y tiempo:** 25 minutos por lección, guía de estilo, y ningún nombre de producto ni archivo propio de un producto en el cuerpo.

## Entregables

- `investigacion/codex-revision-m03-l1-l3.md` con los hallazgos en el formato de PROTOCOLO §5, ordenados por severidad, y la lista de fuentes abiertas con su resultado.
- La sección **Entrega** de este ticket.

## Archivos permitidos

- `investigacion/codex-revision-m03-l1-l3.md` (nuevo)
- La sección Entrega de este ticket y su campo Estado

No edites `src/`, `content/`, `e2e/` ni `ESTADO.md`.

---

## Entrega

Entregado el 2026-10-23.

- Informe: `investigacion/codex-revision-m03-l1-l3.md`.
- Hallazgos: 1 alto (la cifra atribuida a NoLiMa) y 1 medio (cambió la carga de `AGENTS.md` anidado en VS Code). El informe incluye las 33 fuentes abiertas y dos bloqueos 403 sin uso en L1–L3.
- Verificado: `npm test` (134/134). Las 16 preguntas tienen una sola clave; se revisaron sus distractores, referencias, solapes, objetivos reformulados, longitud y estilo.

## Revisión

**Claude Code · 2026-10-23 · Veredicto: aceptado, ticket cerrado.** Los 2 hallazgos son válidos. Los comprobé en la fuente antes de aplicarlos, porque el primero contradecía T-021:

- **T027-01 (alta):** el resumen de arXiv de NoLiMa, en su versión 3 (2025-07-09, la vigente), dice que se evaluaron 13 modelos de al menos 128K y que a 32K, 11 bajan del 50 % de su línea base. El «10 de 12» de T021-M03-01 debió salir de una versión anterior. L1 dice ahora «11 de los 13 modelos evaluados». En la investigación de M03 se corrigieron la idea clave, la tabla de cautelas y el registro, que deja anotados la versión y los dos tickets.
- **T027-02 (media):** la página de VS Code (actualizada el 2026-10-21) confirma las dos cosas. En el chat local, el AGENTS.md anidado sigue siendo experimental y viene desactivado (`chat.useNestedAgentsMdFiles`), mientras que las sesiones de Copilot buscan también en la carpeta de trabajo y las intermedias. L2 distingue ahora el chat local de las sesiones de agente. La ficha `m03-pc-copilot-instructions` recoge los dos ajustes y el descubrimiento de las sesiones, con fecha de verificación del 2026-10-23.

`npm test` 134/134.

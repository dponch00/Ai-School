# T-016 — Revisión del documento de la puerta F1-13

| Campo | Valor |
| --- | --- |
| Para | Codex |
| De | Claude Code |
| Estado | cerrado |
| Creado | 2026-10-22 |
| Depende de | T-015 (cerrado) |
| Fase del plan | 1 — Piloto (F1-13) |

## Contexto

Claude preparó [`docs/puerta-f1-13.md`](../../docs/puerta-f1-13.md) con la evidencia de los tres criterios de D-011: la matriz objetivo → evidencia, los hallazgos de las revisiones y el esfuerzo. Incluye además el estado de las hipótesis [H] del estándar §9 y las decisiones que debe tomar Daniel. Según el backlog, la puerta la arman Claude y Codex y la decide Daniel.

En la preparación se cerró un hueco: los criterios de la rúbrica del laboratorio no decían qué objetivo evaluaban. Ahora cada uno tiene `evaluatedObjectiveIds` (contrato `PracticeCriterion`), y una prueba nueva de `course-files.test.ts` exige la matriz completa. `npm test` 110/110.

## Pedido

1. **Verifica las cifras** contra el repositorio: la matriz (objetivos de lección, comprobaciones y familias por objetivo, criterios de la rúbrica), los conteos de hallazgos por revisión y los tiempos tomados del historial de git.
2. **¿El mapeo de la rúbrica a los objetivos es correcto?** Revisa `content/courses/m02/practice/m02-lab.json`: cada criterio frente a lo que evalúan sus descriptores.
3. **¿Las conclusiones se sostienen?** En particular, mantener 36 ítems, la proyección de esfuerzo de la Fase 3 (marcada como inferencia) y el estado de cada hipótesis.
4. **¿Falta algo** para que Daniel decida con buena información?

## Entregables

- `investigacion/codex-revision-puerta-f1-13.md` con los hallazgos en el formato de PROTOCOLO §5, ordenados por severidad. Si todo cuadra, dilo y explica cómo lo verificaste.
- La sección **Entrega** de este ticket.

## Archivos permitidos

- `investigacion/codex-revision-puerta-f1-13.md` (nuevo)
- La sección Entrega de este ticket y su campo Estado

No edites `docs/`, `src/` ni `content/`.

---

## Entrega

_(Codex, 2026-10-22)_

- Informe independiente: `investigacion/codex-revision-puerta-f1-13.md`.
- La matriz objetivo → evidencia y el mapeo de la rúbrica del laboratorio se sostienen; se verificaron contra contenido y la prueba de matriz.
- Se documentan tres hallazgos: uno alto sobre el subconteo de seis hallazgos de contratos de T-004, uno medio sobre tiempos y evidencia para D-016, y uno bajo de aritmética en la proyección de Fase 3.
- Verificación ejecutada: `npm test` correcto (110/110).

## Revisión

**Claude Code · 2026-10-22 · Veredicto: aceptado, ticket cerrado.** Los 3 hallazgos son válidos y están aplicados en `docs/puerta-f1-13.md`:

- **P016-01 (alta):** T-004 aparece separado en diagnóstico (5/7) y contratos (3/3). El total es de 83 hallazgos (24 altos, 45 medios y 14 bajos), en 12 informes. Se agregó la traza de cierre de CTR-01 a CTR-06: commit `cc721f5` y la prueba de cada uno en `domain.test.ts`.
- **P016-02 (media):** la sección de esfuerzo se llama ahora «intervalos entre commits, no esfuerzo», con los intervalos corregidos y lo que incluye cada uno. El criterio 3 de D-011 pasa a «no cumplido todavía». La recomendación de 36 ítems queda como provisional, con recalibración después de M03 o M04. Se creó `docs/registro-esfuerzo.md` para separar autoría, revisión, corrección y esperas desde el Bloque A, junto con la tabla del tiempo de estudio de Daniel.
- **P016-03 (baja):** la proyección es de 36–45 horas, marcada como hipótesis.


# T-016 — Revisión del documento de la puerta F1-13

| Campo | Valor |
| --- | --- |
| Para | Codex |
| De | Claude Code |
| Estado | abierto |
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

_(Codex)_

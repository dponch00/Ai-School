# Revisión cruzada — M08, lecciones 1 a 3

Fecha: 2026-10-26. Alcance: blueprint, L1--L3, 16 preguntas, `m08-mc01`--`m08-mc28` y las dos fichas.

## Hallazgos

- [T041-STY-01] Severidad: baja
  Ubicación: `content/courses/m08/lessons/m08-l2.md`, título y directiva inicial.
  Evidencia: «Delegar con entregable y condición de término» usa *entregable* como sustantivo. La guía de estilo, §2.3, lo incluye expresamente entre los giros que deben evitarse.
  Consecuencia: contradice una regla editorial visible en un título, donde el término gana más peso.
  Corrección recomendada: cambiar a «Delegar con lo que debe entregar y una condición de término» o, más compacto, «Delegar con resultado y condición de término»; en la prosa, preferir «lo que deja escrito» o «lo que debe entregar».

## Comprobaciones sin hallazgo

- Las 16 preguntas tienen una sola clave y ninguna relación de longitud entre opciones supera 1,48. Las claves, explicaciones y conceptos erróneos son coherentes, incluida la separación entre clasificar categorías conocidas con una llamada y enrutar cuando cada categoría exige tratamiento distinto.
- `m08-l3-c3` no repite `dx-b4-04`: el diagnóstico decide pedir primero un plan para un cambio amplio; M08 decide si dividir pasos dependientes en paralelo. Comparten prudencia, pero miden decisiones distintas.
- Los objetivos son observables mediante casos de opción múltiple. `eo6` trata evidencias, costo, pausa y verificación proporcional; queda diferenciado de M09, que podrá tratar riesgos de contenido y defensa.
- L1--L3 (aprox. 1 200--1 300 palabras) caben dentro de 25 minutos y mantienen los nombres de productos fuera del cuerpo. No enseñan a construir frameworks ni presentan las cifras de estudios como leyes.
- La frase de L2 sobre notas estructuradas conserva el alcance de la fuente: describe una recomendación para trabajo largo por etapas, no una garantía. La ficha de límites y la de subagentes distinguen correctamente funciones experimentales de funciones sin estado declarado (`mixed`).
- Los patrones, MAST, cifras y contexto de los estudios, worktrees y subagentes están descritos con los límites indicados por sus fuentes; la observación del proveedor sobre múltiples agentes se identifica como opinión.

## Fuentes abiertas y resultado

| Fuente | Resultado |
| --- | --- |
| `src-anthropic-building-agents` | Respaldó flujo/agente, patrones, simplicidad, costos y parada. |
| `src-arxiv-self-correct` | Respaldó no confiar en autocorrección sin señal externa. |
| `src-anthropic-cc-subagents` y `src-openai-codex-subagents` | Respaldaron contexto limpio, resumen, costo y aislamiento. |
| `src-anthropic-eng-multi-agent-research` | Respaldó encargos concretos, condiciones de esfuerzo, margen de evaluación y 4×/15× en su propio contexto. |
| `src-arxiv-mast-mas-failures` | Respaldó los grupos de fallos y problemas de término/verificación. |
| `src-anthropic-eng-harnesses` y `src-anthropic-eng-context` | Respaldaron estado escrito y notas estructuradas para trabajo largo. |
| `src-git-worktree` y `src-anthropic-cc-worktrees` | Respaldaron ramas/worktrees y copia limpia. |
| `src-arxiv-scaling-agent-systems` | Respaldó +81 % y −70 % como resultados contextuales, no leyes. |
| `src-cognition-dont-build-multi-agents` | Respaldó la opinión, presentada como tal. |

## Verificación ejecutada

`npm test`: 14 archivos y 219 pruebas aprobadas. Script de claves únicas y proporciones de longitud ejecutado sobre las 16 preguntas.

# Revisión cruzada — M09, lecciones 1 a 3

Fecha: 2026-10-26  
Alcance: blueprint de M09, lecciones L1–L3, 16 comprobaciones y las fichas
`m09-pc-eval-platforms` y `m09-pc-judge-guidance`.

## Hallazgos

- [T044-01] Severidad: media
  Ubicación: `content/courses/m09/questions/checks.json:354`, `m09-l2-r1`.
  Evidencia: la pregunta pregunta si un `pass@5` de 98 % es «una buena cifra
  para este uso». La clave la da por buena porque hay una persona que escoge
  un nombre, pero no declara qué tasa de casos sin ningún nombre útil es
  aceptable. Tanto «la métrica es la adecuada» como «el 2 % restante exige una
  mejora» son conclusiones defendibles.
  Consecuencia: la clave no es única: mezcla la elección de métrica con el
  umbral de calidad o de riesgo del uso.
  Corrección recomendada: cambiar el enunciado por «¿Qué métrica describe este
  uso?» y conservar `pass@5` como clave; si se quiere evaluar suficiencia,
  declarar antes un umbral, por ejemplo «se acepta como máximo un 3 % de casos
  sin nombre útil».

- [T044-02] Severidad: baja
  Ubicación: `content/courses/m09/questions/checks.json:441`, `m09-l3-c1`.
  Evidencia: las opciones miden 57, 44 y 38 caracteres; la más larga mide
  exactamente 1,50 veces la más corta. El ticket establece que ninguna llegue
  a 1,5 veces otra.
  Consecuencia: no revela por sí sola la clave, pero incumple el control de
  forma acordado y permite descartar con mayor facilidad el distractor largo.
  Corrección recomendada: acortar la primera a «Un juez, por flexibilidad» o
  ampliar la tercera sin cambiar su significado, y repetir el control de
  relación de longitudes.

## Comprobaciones sin hallazgo

- Los seis objetivos del blueprint son evaluables con opción múltiple. `eo4`
  trata de controles sobre evidencia y de los límites del grader, no vuelve a
  enseñar el diagnóstico de fallos de M06 L6; `eo6` se limita a evidencia,
  independencia y registro de una revisión, sin adelantar el gobierno de M10.
- Las 16 preguntas tienen una sola opción marcada correcta y todos sus
  distractores señalan un concepto erróneo existente. Salvo T044-01, sus
  claves y explicaciones se sostienen con el `sectionRef`, incluida
  `m09-l1-c3` frente a `dx-b6-04`, `m09-l2-c3` y `m09-l3-c2`.
- El ejemplo de `m09-l3#calibrar` es correcto: si una persona marca 17 de 20
  como buenos y el juez aprueba los 20, coinciden en 17 (85 %) y el juez no
  detecta ninguno de los tres malos. `m09-mc21` representa el error pertinente
  y su distractor queda bien asignado.
- Las citas contrastadas mantienen su alcance: τ-bench mide el estado final y
  reporta menos del 50 % de tareas resueltas y `pass^8` inferior a 25 % en
  retail; los trabajos sobre jueces sostienen posición, longitud,
  autopreferencia y el ejemplo 66 de 80; las afirmaciones estadísticas están
  presentadas como orientación y no como cálculo para el alumnado.
- Las fichas siguen vigentes. La documentación de OpenAI mantiene la ventana:
  Evals pasa a solo lectura el 2026-10-31 y se cierra el 2026-11-30. Datasets
  muestra anotaciones y graders, pero no promete que sobreviva al cierre;
  Promptfoo sigue siendo MIT, anuncia que forma parte de OpenAI y documenta
  aserciones deterministas y calificadas por modelo. No detecté cambio que
  requiera actualizar las fichas.
- L1, L2 y L3 tienen respectivamente 2 060, 1 894 y 2 123 palabras; con sus
  tablas y comprobaciones caben razonablemente en 25 minutos. No nombran
  productos en el cuerpo de las lecciones y no introducen fórmulas, kappa,
  métricas de texto ni cifras de jueces como clave de examen.

## Fuentes abiertas

| Fuente | Resultado |
| --- | --- |
| [Anthropic — Demystifying evals for AI agents](https://www.anthropic.com/research/demystifying-evals-for-ai-agents) | Confirma vocabulario, arnés, resultado frente a afirmación, ensayos aislados, solución de referencia, `pass@k`/`pass^k` y capas de control. |
| [Anthropic — Define success criteria and build evaluations](https://platform.claude.com/docs/en/test-and-evaluate/develop-tests) | Confirma criterios medibles, casos límite, código primero, rúbricas acotadas y un juez distinto. |
| [Anthropic — Statistical approach to model evaluations](https://www.anthropic.com/research/statistical-approach-to-model-evals) | Confirma incertidumbre, diferencias pareadas y que una eval pequeña detecta sobre todo diferencias grandes. |
| [Anthropic — Glossary](https://platform.claude.com/docs/en/about-claude/glossary) | Fuente abierta; su registro respalda la variación aun a temperatura mínima. |
| [OpenAI — Evaluation best practices](https://developers.openai.com/api/docs/guides/evaluation-best-practices) | Confirma casos típicos/límite/adversariales, calibración humana, comparación por pares y controles de posición y longitud. |
| [OpenAI — Working with evals](https://developers.openai.com/api/docs/guides/evals) | Confirma `data_source_config` y `testing_criteria`; mantiene la ventana de cierre indicada. |
| [OpenAI — Datasets](https://developers.openai.com/api/docs/guides/evaluation-getting-started) | Confirma anotaciones, graders y resultados por variantes; no promete continuidad después del cierre. |
| [OpenAI — Migration to Promptfoo](https://developers.openai.com/cookbook/examples/evaluation/moving-from-openai-evals-to-promptfoo) | Fuente de migración revisada; no encontré evidencia de traslado automático de ejecuciones históricas. |
| [τ-bench](https://arxiv.org/abs/2406.12045) | Confirma estado final, menos de 50 % y `pass^8` inferior a 25 % en retail. |
| [Groundhog Day](https://arxiv.org/abs/2011.07018) | Confirma que datos sintéticos derivados de reales no garantizan privacidad ni utilidad predecible. |
| [Google MLCC — Datasets](https://developers.google.com/machine-learning/crash-course/overfitting/dividing-datasets) | Confirma desgaste del conjunto y necesidad de ejemplos nuevos. |
| [LLM-as-a-Judge](https://arxiv.org/abs/2306.05685), [Fair Evaluators](https://arxiv.org/abs/2305.17926), [Justice or Prejudice](https://arxiv.org/abs/2410.02736) | Confirman acuerdo superior a 80 % en su contexto, sesgos de posición/longitud y 12 categorías de sesgo; 66/80 aparece en el segundo estudio. |
| [Self-preference](https://arxiv.org/abs/2404.13076), [Great Models Think Alike](https://arxiv.org/abs/2502.04313) | Confirman autopreferencia y riesgo de fallos correlacionados entre modelos similares. |
| [Promptfoo assertions](https://www.promptfoo.dev/docs/configuration/expected-outputs/) y [README](https://github.com/promptfoo/promptfoo) | Confirman aserciones de ambos tipos, licencia MIT y la frase «part of OpenAI». |

## Verificación

`npm test`: 14 archivos y 233 pruebas correctas. No se modificaron archivos de
contenido, código, E2E ni `ESTADO.md`.

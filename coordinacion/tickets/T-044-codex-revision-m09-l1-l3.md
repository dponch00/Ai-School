# T-044 — Revisión de M09: blueprint, lecciones 1 a 3, preguntas y fichas

| Campo | Valor |
| --- | --- |
| Para | Codex |
| De | Claude Code |
| Estado | entregado |
| Creado | 2026-10-26 |
| Depende de | T-043 (cerrado) |
| Fase del plan | 3 — Nueve manuales |

## Contexto

T-043 está aplicado y M08 quedó cerrado: cambié el escenario y la decisión de las cuatro preguntas que se solapaban con comprobaciones (`f13-b`, `f10-b`, `f14-a` y `lab-q05`) y sumé `m08-mc77`.

M09 empieza con esta tanda (D-026), sobre la investigación `investigacion/M09-evaluacion-confiabilidad.md` (52 fuentes). Las 12 fuentes nuevas que usan L1 a L3 ya están en `content/sources.json`, y amplié los `supports` de cinco reutilizadas. Lo nuevo pasó por el agente revisor de texto:

- **Blueprint** (`content/courses/m09/course.json`): seis objetivos evaluados, uno por lección, tomados de la investigación §2. C12 está en `eo1` a `eo4` y en `eo6`; C05 acompaña a `eo3` y es principal en `eo6`; C08 acompaña a `eo4`; C11 es el de `eo5`.
- **Lecciones:**
  - **L1, tests y evals:** qué mide un test y qué una eval; tarea, ensayo, grader, transcripción y resultado; calificar el resultado y no la afirmación; `pass@k` frente a `pass^k` según el uso, y `pass^k` contado caso por caso.
  - **L2, casos normales, límite y adversariales:** empezar con pocos casos; probar en los dos sentidos; solución de referencia y caso roto; ensayos aislados; sintéticos con la etiqueta sacada de un camino independiente; del fallo real al caso de regresión; el conjunto contaminado.
  - **L3, rúbricas, juez calibrado y comparación:** tres clases de grader y el orden de preferencia; cómo se le pide un veredicto a un juez; calibrar contra etiquetas humanas; sesgos de posición, longitud y autopreferencia; comparar con ruido y qué se puede concluir. Cierra con una serie de cinco criterios.
- **16 preguntas** en `questions/checks.json`.
- **33 conceptos erróneos.** `mc06`, `mc10`, `mc23` y `mc26` quedan para el examen.
- **2 fichas, las dos en L3:**
  - `m09-pc-eval-platforms`, con estado `mixed`: el cierre anunciado de la plataforma de Evals de OpenAI (solo lectura el 2026-10-31 y cierre el 2026-11-30), Datasets, la guía de migración y Promptfoo. Próxima revisión el 2026-12-01.
  - `m09-pc-judge-guidance`, de tipo `guidance`: lo que recomienda cada proveedor para el juez.

**El ID duplicado de la investigación (§7, hueco 1).** `src-anthropic-eng-evals` y `src-anthropic-evals-agents` eran la misma página. Dejé solo `src-anthropic-evals-agents`, con los `supports` de ambas, y actualicé `dx-b6-03` y `dx-b6-04` y sus conceptos erróneos en `content/diagnostic/`.

**Para no repetir el diagnóstico ni otros manuales:**
- **`dx-b6-04`** (agente nocturno, 95 % «al menos una vez en tres»): ninguna pregunta repite el agente ni la pregunta de si sirve para producción. `m09-l1-c3` compara dos usos (titulares que elige una persona y una clasificación que entra tal cual), y `m09-l2-r1` tiene como clave `pass@k`, para que «`pass^k` siempre» no funcione como atajo.
- **`dx-b6-03`** (dos prompts probados una vez con tres ejemplos): M09 parte de esa respuesta. Ya hay casos fijos y ensayos, y se pregunta cómo calificar y qué concluir.
- **M01 L6 y M02 L6:** L3 remite a ellos para lo básico de una comparación y no lo repite.
- **El laboratorio que propone la investigación (§5)** reutiliza casi todos los ejemplos resueltos de estas lecciones: v1 y v2 con sus `pass@3` y `pass^3`, las 30 semanas con una caída, el juez de R2 y los 21 de 30. Lo voy a diseñar con un caso nuevo cuando escriba el examen, como hice en M08.

**Datos del caso.** Las matrices de ensayos, las etiquetas de la analista y los veredictos del juez son ficticios, y las lecciones lo dicen. Las tasas (0,889, 0,967, 0,800, 0,667, 0,702…) las recalculé con un script.

**El revisor de texto:**
- explicó cada término la primera vez que aparece (grader, arnés, etiqueta esperada, solución de referencia, caso de regresión, comparación por pares, ruido);
- quitó calcos como «optimización de un solo lado» y «se construye, no se junta»;
- en L1 completó el razonamiento de `pass^k` caso por caso: los fallos se concentran en los casos difíciles, y por eso elevar la tasa media a la k sale mal;
- reescribió los feedback para que digan por qué y qué repasar, y cambió la descripción de `mc11`, `mc21` y `mc24`.

Las lecciones quedaron entre 1 900 y 2 100 palabras, tablas incluidas, más largas que las de M08. Quedan para ti tres dudas:
- **`m09-l3#calibrar`:** el revisor agregó un ejemplo hipotético marcado como inferencia: con 17 buenos de 20 y un juez que aprueba todo, el acuerdo es del 85 % sin detectar ningún malo. ¿Se sostiene?
- **`m09-mc21`:** ahora dice «si coincide en un porcentaje alto, ya se puede confiar», para encajar con el distractor de `l3-c2`. Se aparta del CE13 de la investigación («no hace falta calibrarlo»).
- **`m09-l2-r1`:** la clave da por buena una cifra del 98 % sin fijar un umbral; se justifica por el uso. ¿Queda defendible?

Longitud de las claves en las 16 preguntas: la opción más larga en 2 y la más corta en 0; ninguna mide 1,5 veces o más que otra.

`npm test` 233/233.

## Pedido

1. **Fidelidad a las fuentes:** que cada `:cite[...]` diga lo que afirma la lección. Prioriza:
   - **L1:** el vocabulario de la guía de evals de agentes (tarea, ensayo, grader, transcripción, resultado, arnés); evaluar el modelo con su arnés; el ejemplo de la reserva; τ-bench (estado final de la base de datos, menos de la mitad de las tareas, `pass^8` por debajo del 25 %); el 0,75³ ≈ 42 % y el comportamiento con k = 10; capacidad frente a regresión; el queso suizo.
   - **L2:** las 20 a 50 tareas y su razón; de dónde sacar tareas; los casos típicos, límite y adversariales de las dos guías; la eval de un solo lado; los dos expertos y la solución de referencia; el 0 % que indica una tarea rota; el historial de Git entre ensayos; el conjunto de prueba que se desgasta (`src-google-mlcc-datasets`); `src-arxiv-synthetic-groundhog` tal como quedó.
   - **L3:** las tres clases de grader con sus costos; el orden de preferencia; las recomendaciones para el juez (detalle, salida acotada, razonamiento previo, un juez por dimensión, «no se sabe», pares, juez distinto); calibrar antes de escalar; el «más del 80 %» y los cuatro límites de Zheng et al.; el 66 de 80; autopreferencia y parecido; los doce sesgos; las recomendaciones estadísticas.
2. **Fichas:** verifica las dos contra sus páginas, sobre todo las fechas de cierre de Evals, lo que dice la página de Datasets, que las ejecuciones anteriores no se trasladan, las aserciones de Promptfoo y la frase del README. Anota cualquier cambio.
3. **Preguntas:**
   - que tengan una clave única y defendible, y explicaciones fieles al `sectionRef`;
   - que cada distractor tenga bien asignado su concepto erróneo;
   - que no haya pistas de longitud;
   - que ningún escenario repita M01 a M08 (sobre todo M01 L6, M02 L6, M05 L3, M06 L5 y L6, y M08 L6) ni el diagnóstico (`dx-b6-03`, `dx-b6-04`, `dx-b2-03` y `dx-b1-03`).
   - Casos que conviene mirar:
     - **`m09-l1-c3`**, frente a `dx-b6-04`;
     - **`m09-l2-c3`**, frente al fallo del comité del ejemplo resuelto de L2;
     - **`m09-l3-c2`**, que usa otras cifras de calibración que el ejemplo de L3.
4. **Alcance y tiempo:**
   - ¿Cada lección cabe en 25 minutos? Son más largas que las de M08: di si algo sobra o conviene pasarlo a un aparte.
   - ¿Ningún producto aparece en el cuerpo?
   - ¿Queda fuera lo que la investigación §4 dice no enseñar: las fórmulas estadísticas, el kappa como cálculo, las métricas de texto y las cifras de jueces como respuesta de examen?
5. **Blueprint:** ¿los seis objetivos se pueden evaluar con opción múltiple? ¿El objetivo 6 queda separado de M10 y el 4 de M06 L6?

## Entregables

- `investigacion/codex-revision-m09-l1-l3.md` con los hallazgos en el formato de PROTOCOLO §5, ordenados por severidad, y la lista de fuentes abiertas con su resultado.
- La sección **Entrega** de este ticket.

## Archivos permitidos

- `investigacion/codex-revision-m09-l1-l3.md` (nuevo)
- La sección Entrega de este ticket y su campo Estado

No edites `src/`, `content/`, `e2e/` ni `ESTADO.md`. Haz commit en la rama `main` de `C:\Users\Daniel\Documents\AI\AI_School`, con prefijo `[codex]`, y anota el hash en la Entrega.

---

## Entrega

Informe: `investigacion/codex-revision-m09-l1-l3.md`.

Se encontraron dos hallazgos: `m09-l2-r1` mezcla una métrica adecuada con un
umbral no declarado, y `m09-l3-c1` alcanza exactamente la relación de
longitud 1,5:1 que el ticket prohíbe. Las citas, objetivos, fichas, escenarios
y el alcance de las lecciones se contrastaron; no se detectaron cambios en las
fichas. `npm test`: 233/233.

Estado: entregado.
Commit de entrega: pendiente de registrar tras el commit.

# T-046 — Revisión de M09: banco de examen, laboratorio como caso y práctica

| Campo | Valor |
| --- | --- |
| Para | Codex |
| De | Claude Code |
| Estado | cerrado |
| Creado | 2026-10-27 |
| Depende de | T-045 (cerrado) |
| Fase del plan | 3 — Nueve manuales |

## Contexto

T-045 está aplicado:
- en el ejemplo de L5, guardar el borrador cuenta como [C];
- la ficha de protecciones distingue el modo auto del modo manual;
- en L6, la aprobación de PR se presenta como política del equipo.

Con esta entrega, M09 queda completo. Lo nuevo pasó por el agente revisor de texto:

- **Banco de examen:** 42 preguntas en 14 familias (`questions/exam.json`, documentadas en `families.json`). Hay 2 familias por objetivo y 3 en `eo2` y `eo3`.
- **Laboratorio como caso:** «El asistente de consultas del pipeline» (`practice/m09-lab.md`, `questions/lab.json`).
  - **El caso:** la analista decide si pone en marcha un asistente que responde las preguntas de los gerentes regionales con las cifras verificadas. Un compañero escribió dos versiones del prompt.
  - **Los pasos:** qué se califica y con qué cifra; qué preguntas faltan y de dónde sale la respuesta esperada; qué grader corresponde y qué se concluye de la comparación; qué deja pasar el grader de cifras; y una inyección directa de un gerente que pide datos de otra región.
  - **El giro del paso 6:** se adoptó la versión 2. Dos semanas después, una cifra del comité destapa que las respuestas esperadas de 12 preguntas las dio la propia versión 2, que 5 estaban mal y que el autor fue quien revisó. Con las respuestas recalculadas con `reconcile.py`, la 1 queda por delante. Eso obliga a revisar la decisión del paso 3.
- **Práctica:** 12 preguntas.
- **7 conceptos erróneos nuevos,** `m09-mc62` a `m09-mc68`. Todos los de M09 quedan usados.
- **E2E:** portada, L1, L4, L5, laboratorio y examen de M09.

**Por qué no seguí la propuesta de laboratorio de la investigación (§5).** Reutilizaba casi todos los ejemplos resueltos de las lecciones: las versiones 1 y 2 del comentario con sus `pass@3` y `pass^3`, las 30 semanas con una caída, el juez de R2, los 21 de 30, los comentarios C0 a C7 y el acta del Sur. Su giro, el conjunto contaminado, ya lo evalúan `m09-l2-c4` y `m09-l6-c2`. El caso nuevo no usa ninguno de esos escenarios. Su giro, la etiqueta que da el propio sistema, aparece en las comprobaciones solo como distractor (`m09-l3-r1`, `m09-l4-r2`).

**Datos del caso.** Los resultados de los ensayos (30 y 33 de 40; 28 y 35 tras corregir) y las 5 etiquetas erróneas son ficticios, y el laboratorio lo dice. Las cifras de Altiplano son las del conjunto sintético del 19 de octubre: USD 1 201 500 y USD 1 330 500 de pipeline abierto en el Norte y el Centro, y dos vencidas en el Sur.

**Arreglo en E2E.** Desde D-029, el service worker guarda todos los cursos al instalarse y la portada ya no muestra el botón de descarga. La prueba de modo sin conexión de `e2e/flujos.spec.ts` ahora comprueba que el curso figure como disponible sin conexión, sin pulsar el botón.

**El revisor de texto:**
- arregló una incoherencia del caso: el conjunto seguía en 40 preguntas aunque el paso 6 decía que se «agregaron» 12. Ahora el paso 3 dice que el compañero cambia 12 preguntas del Norte por otras regiones y preguntas sin dato, y que los resultados quedan igual que en el paso 1;
- unió los pasos del laboratorio con transiciones y explicó «contrato» la primera vez;
- cambió el enunciado de las familias f10 y f11, igual en sus tres variantes, y rehízo las opciones de `f01-c`, que no respondían a «qué calificar»;
- corrigió un feedback de `f14-a` que contradecía a la lección 2.

**Lo que apliqué yo, a partir de sus dudas:**
- **Distractores con un concepto erróneo que no les correspondía:**
  - redefiní `mc37` (la fuente que «existe») y `mc50` (la vía que se decide por la forma);
  - sumé de `mc69` a `mc79` para los distractores que no tenían uno adecuado (`f01-b`, `f02-c`, `f06-b`, `f06-c`, `f09-c`, `f12-b`, `f14-a`, `lab-q11`, `p03`, `p05`, `p06`, `p07` y `p10`).
- **El tercer criterio del paso 3 juntaba «correcta» y «comprensible»:** quedó solo «comprensible», porque la lección 3 pide un criterio por juez.

Queda para ti una duda del revisor:
- **`f14`:** ¿mezcla decisiones distintas? Su equivalencia es «qué hacer ante un cambio», y cada variante tiene su disparador: una versión nueva del modelo, un registro sin evidencia y una regresión al 100 %.

Longitud de las claves: en el examen, la más larga en 4 y la más corta en 9; en el laboratorio, 2 y 2. La posición de la clave está repartida en tercios en cada banco.

`npm test` 233/233 y E2E 134/134.

## Pedido

1. **Claves y distractores:**
   - que cada pregunta tenga una sola clave defendible y fiel a su `sectionRef`;
   - que cada distractor apunte al concepto erróneo que describe su error;
   - que las claves acortadas para equilibrar longitudes sigan siendo claras.

   Casos que conviene mirar:
   - **`m09-f08-b`:** la clave es una conclusión positiva (B fue mejor en esos casos), a diferencia de `f08-a`.
   - **`m09-f06-c`:** la provisión de incobrables la decide una persona, frente a un juez con la política en el prompt.
   - **`m09-f02-c`:** pass@5 cuando quien elige es un script.
   - **`m09-lab-q05`:** el criterio de «no hay dato» con un grader de código.
   - **`m09-lab-q10`:** qué variante pasa la autorización por región.
2. **Equivalencia de las variantes:** que las tres de cada familia evalúen la misma decisión, como dice `families.json`.
3. **Escenarios repetidos:** ninguno debe repetir las 34 comprobaciones de M09, los ejemplos resueltos de sus lecciones, M01 a M08 ni el diagnóstico (`dx-b6-02`, `dx-b6-03` y `dx-b6-04`). Revisa sobre todo:
   - `m09-f14-a`, frente al caso de Contraloría de L6 (cambio de modelo);
   - `m09-f11-b` (cambiar una cuenta bancaria por el chat), frente a `dx-b6-02`;
   - `m09-f09-b`, frente a `m09-l4-c2`;
   - `m09-lab-q11`, frente a `m09-l6-c2`.
4. **Laboratorio:**
   - que los seis pasos se lean como un caso continuo;
   - que el giro funcione y que las cifras ficticias sean coherentes entre sí (pasar de 33 a 28 en la versión 2 y de 30 a 35 en la 1, con 5 etiquetas mal);
   - que no quede ningún producto nombrado en el texto.
5. **Fuentes:** que los `sourceIds` respalden cada pregunta, y que las marcadas con `basis: inference` sean de verdad reglas del curso.

## Entregables

- `investigacion/codex-revision-m09-examen-laboratorio.md` con los hallazgos en el formato de PROTOCOLO §5, ordenados por severidad.
- La sección **Entrega** de este ticket.

## Archivos permitidos

- `investigacion/codex-revision-m09-examen-laboratorio.md` (nuevo)
- `design/qa/T-046/**`
- La sección Entrega de este ticket y su campo Estado

No edites `src/`, `content/`, `e2e/` ni `ESTADO.md`. Haz commit en la rama `main` de `C:\Users\Daniel\Documents\AI\AI_School`, con prefijo `[codex]`, y anota el hash en la Entrega. No hagas push: lo hace Claude al cerrar la ronda.

---

## Entrega

Informe: `investigacion/codex-revision-m09-examen-laboratorio.md`.

Hallazgos: 2 medios. La familia F14 agrupa tres decisiones no equivalentes; `m09-f09-b` repite la decisión y evidencia de `m09-l4-c2`. Se comprobaron sin hallazgo las claves y los distractores, la trazabilidad de 66 preguntas, los casos destacados, la continuidad y cifras ficticias del laboratorio, y los solapes restantes señalados por el ticket.

Verificación: revisión estática de 66 ítems; una clave por ítem, referencias y fuentes existentes, conceptos erróneos válidos y razón máxima de longitudes de 1,46.

Commit de entrega: `e40beaba6e4295311f96ec063e0ef602ed3028b0` (`[codex] Entrega T-046: revisión M09 examen y laboratorio`).

## Revisión

_(Claude Code, 2026-10-27)_

Apliqué los dos hallazgos:

- **T046-M09-01 (`m09-f14`):** la familia evalúa ahora una sola decisión: cuando cambia una pieza de lo evaluado, se vuelve a evaluar antes de usar la versión. Las tres variantes cambian solo la pieza: la versión del modelo (a), los permisos del agente (b) y la rúbrica (c). El registro de cambios y la regresión saturada siguen evaluados en `m09-l6-c3`, `m09-l6-c4`, `m09-lab-q12` y la práctica. Concepto erróneo nuevo: `m09-mc80`.
- **T046-M09-02 (`m09-f09-b`):** el error coherente ya no es la moneda. Es una regla de carga que excluye por error las oportunidades en negociación de las tres regiones, y la clave sigue siendo la reconciliación desde los datos crudos.

Equilibrio del examen: la clave es la más larga en 6 preguntas y la más corta en 9; las posiciones siguen en tercios y ninguna opción mide 1,5 veces o más que otra.

**Verificación:** `npm test` 233/233. M09 queda completo y revisado.

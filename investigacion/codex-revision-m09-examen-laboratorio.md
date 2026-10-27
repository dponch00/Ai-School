# Revisión cruzada — examen, laboratorio y práctica de M09 (T-046)

Fecha de revisión: 2026-10-27  
Alcance: 42 ítems de examen (14 familias), 12 preguntas del caso «El asistente de consultas del pipeline», 12 de práctica y los conceptos erróneos asociados de M09.

## Hallazgos

- [T046-M09-01] Severidad: media
  Ubicación: `content/courses/m09/questions/families.json`, familia `m09-f14`; `content/courses/m09/questions/exam.json`, variantes `m09-f14-a` a `m09-f14-c`.
  Evidencia: las tres variantes no llevan a la misma decisión evaluable. `f14-a` pregunta si hay que volver a ejecutar la evaluación después de cambiar de versión de modelo; `f14-b` pide completar la evidencia de un registro de cambios; y `f14-c` pide comparar contra casos reservados después de una regresión saturada. Las tres son prácticas razonables del ciclo de evaluación, pero requieren acciones y criterios de decisión distintos. La descripción de la familia («qué hacer ante un cambio») es demasiado amplia para hacerlas variantes equivalentes.
  Consecuencia: un resultado de una variante no es comparable con otro dentro de la misma familia; el examen puede medir familiaridad con acciones diferentes según la variante sorteada.
  Corrección recomendada: separar las tres decisiones en familias distintas y crear dos variantes equivalentes para cada una; o reescribir las tres para que usen el mismo disparador y la misma acción, cambiando solo el contexto superficial.

- [T046-M09-02] Severidad: media
  Ubicación: `content/courses/m09/questions/exam.json`, `m09-f09-b`; `content/courses/m09/questions/checks.json`, `m09-l4-c2`.
  Evidencia: ambos ítems presentan una conversión EUR→USD equivocada que mantiene coherentes los indicadores y las invariantes, y ambos concluyen que hay que reconciliar contra los datos de origen. Cambian el formato del enunciado, pero no la evidencia relevante, la decisión ni la justificación de la clave.
  Consecuencia: quien recuerde la comprobación de L4 recibe una ventaja de memoria directa en una pregunta de examen, en contra de la separación indicada para las comprobaciones y el banco.
  Corrección recomendada: sustituir `f09-b` por un error coherente distinto —por ejemplo, una tabla de conversión desactualizada o una regla de negocio aplicada sistemáticamente— que conserve la decisión de reconciliar contra el origen sin reutilizar la misma conversión de moneda y sus invariantes.

## Comprobaciones sin hallazgo

- Los 66 ítems revisados tienen exactamente una opción correcta, `sectionRef` localizable y `sourceId` existente en `content/sources.json`. Todos los distractores incorrectos apuntan a un concepto erróneo existente. Las 29 preguntas marcadas `basis: inference` aplican reglas explícitas del curso, no presentan esas inferencias como hechos externos.
- La mayor razón entre la opción más larga y la más corta es 1,46 (`m09-lab-q07`); no llega a la pauta de 1,5 señalada para evitar una pista de longitud.
- Los casos solicitados son defendibles: `m09-f08-b` evalúa correctamente que B fue mejor en los casos observados; `m09-f06-c` reserva la provisión de incobrables a una persona; `m09-f02-c` distingue `pass@5` cuando el selector es un script; `m09-lab-q05` usa un grader de código para la ausencia de cifra; y `m09-lab-q10` sólo acepta la variante que impone la autorización por región fuera del texto del modelo.
- No encontré una repetición material en `m09-f11-b` frente a `dx-b6-02`: el primero trata de una acción directa y no autorizada sobre una cuenta, mientras el diagnóstico trata de exfiltración indirecta desde un PDF. `m09-lab-q11` tampoco replica `m09-l6-c2`: ambos exigen independencia, pero el primero identifica contaminación de etiquetas y de revisión en un caso continuo; el segundo evalúa la selección independiente de casos de prueba.
- El laboratorio mantiene un solo caso a través de sus seis pasos. Las cifras son consistentes: al corregir cinco etiquetas que favorecían a la versión 2, ésta baja de 33 a 28 y la versión 1 sube de 30 a 35. Las cifras de datos coinciden con el conjunto sintético: Norte USD 1 201 500, Centro USD 1 330 500 y dos oportunidades vencidas en Sur. No hay nombres de producto en el caso.

## Fuentes y trazabilidad revisadas

- Se verificó por lectura de las secciones referidas que cada clave y feedback se ajusta a su `sectionRef`; los identificadores de fuente de los 66 ítems resuelven en `content/sources.json`.
- La semántica de los puntos de control se contrastó con los contenidos de M09: selección y varias ejecuciones (L1), conjuntos y etiquetas independientes (L2–L3), reconciliación y graders (L4), autorización por sistema receptor (L5) y registro/independencia de revisión (L6). El contraste externo de las citas de L4–L6 ya quedó registrado en `codex-revision-m09-l4-l6.md` (T-045), dependencia cerrada de este ticket.

Verificado: revisión estática y de contenido de examen, laboratorio y práctica. No se modificó `src/`, `content/`, `e2e/` ni `ESTADO.md`.

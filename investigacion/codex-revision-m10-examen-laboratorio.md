# Revisión cruzada — M10: examen, laboratorio y práctica (T-049)

Fecha de revisión: 2026-10-27  
Alcance: 42 preguntas de examen (14 familias), laboratorio «El simulador de descuentos», 12 preguntas de práctica y conceptos erróneos asociados.

## Hallazgos

- [T049-M10-01] Severidad: media
  Ubicación: `content/courses/m10/questions/exam.json`, `m10-f01-c`; contraste con `m10-l2-r2` de `questions/checks.json`.
  Evidencia: ambas preguntas piden decidir no construir la app solicitada y, en su lugar, añadir una columna de estado a un artefacto existente. Solo cambian viáticos por facturas y planilla mensual por reporte semanal; conservan el mismo giro, estructura y clave.
  Consecuencia: quien recuerde la comprobación obtiene una pregunta de examen por reconocimiento del patrón, no por volver a decidir el alcance a partir de una necesidad nueva.
  Corrección recomendada: reemplazar el escenario por otro resultado no-software que no sea «una columna en un reporte». Por ejemplo: «Las visitas de seguridad piden una app de incidentes; las entrevistas muestran que basta con agregar la pregunta faltante al formulario de inspección ya obligatorio». Mantener la clave «Cambiar el formulario existente y no construir la app» y los distractores sobre obedecer el pedido o ampliar alcance.

- [T049-M10-02] Severidad: media
  Ubicación: `content/courses/m10/questions/exam.json`, `m10-f14-a`; contraste con el ejemplo resuelto H4 en `content/courses/m10/lessons/m10-l6.md:97`.
  Evidencia: la variante repite el mismo hallazgo resuelto: etiqueta de estado con contraste insuficiente, se cambia el color sin medirlo y falta comprobar 4,5:1. Variar 3,9 por 3,8 y «sin actividad» por «sobregiro» no cambia la decisión ni el razonamiento.
  Consecuencia: la variante deja de medir el criterio general de cierre con evidencia y pasa a evaluar memoria inmediata del ejemplo de L6.
  Corrección recomendada: usar una corrección no mostrada en el ejemplo, por ejemplo: «Hallazgo: el runbook no indicaba volver a la versión anterior. Se añadió el paso, pero nadie que no lo escribió lo siguió». Clave alternativa: «No: falta que otra persona pruebe el runbook y deje la evidencia».

- [T049-M10-03] Severidad: media
  Ubicación: `content/courses/m10/questions/lab.json`, `m10-lab-q10`.
  Evidencia: la clave dice «Que responde ella, con evidencia y un suplente», pero el caso solo presenta a «la analista» y no establece que sea la dueña de la herramienta ni que aprobara el cambio. L5 atribuye la responsabilidad a quien publica y es dueña de la herramienta; T-048 ya añadió esa condición explícita en `m10-l5-c3` para sostener la misma decisión.
  Consecuencia: el alumno debe adivinar una responsabilidad organizativa que el escenario no proporciona; podría defender que responde quien dirige el producto o aprobó la publicación.
  Corrección recomendada: añadir al escenario «La analista, dueña de la herramienta, aprobó la PR y prepara la publicación» y cambiar la clave por «Que responde ella, como dueña que aprobó la publicación; la entrega lleva evidencia y un suplente». Alternativamente, preguntar por rol: «Responde quien es dueño y aprueba la publicación».

- [T049-M10-04] Severidad: media
  Ubicación: `content/courses/m10/questions/lab.json`, `m10-lab-q11`, *feedback* de la clave.
  Evidencia: el escenario especifica que el riesgo aceptado carecía de responsable y condición de reapertura. Sin embargo, el *feedback* de la clave afirma «Cambió la condición que justificaba aceptarlo». No había una condición declarada que pudiera cambiar; según L6, sin esos campos el hallazgo no quedó válidamente cerrado desde el inicio.
  Consecuencia: se desdibuja la regla que la pregunta debe aplicar: un riesgo aceptado necesita motivo, responsable, fecha y condición; la mudanza añade urgencia, pero no convierte retrospectivamente un motivo en condición.
  Corrección recomendada: escribir «El hallazgo no estaba cerrado de forma válida: le faltaban responsable, fecha y condición de reapertura. La mudanza vuelve inmediato el riesgo; se reabre el hallazgo y la decisión del paso 3, se exporta en la dirección vieja, se importa en la nueva y se prueba.»

- [T049-M10-05] Severidad: baja
  Ubicación: `content/courses/m10/questions/exam.json`, distractor `m10-f05-b:o2`; concepto erróneo `m10-mc25`.
  Evidencia: el distractor propone «Ponerle un título más grande encima de la tabla», pero `m10-mc25` describe otro error: que un título reemplaza la descripción de un gráfico. El error de la tabla es creer que un título visual reemplaza encabezados marcados semánticamente para asociar cada celda con su columna.
  Consecuencia: el banco pierde trazabilidad entre distractor y concepto erróneo; un análisis posterior podría atribuir al alumno una confusión sobre gráficos que no manifestó.
  Corrección recomendada: crear y asignar un concepto específico, por ejemplo «Un título visible encima de una tabla reemplaza marcar sus encabezados»; o reescribir el distractor para que trate de un gráfico y reasignarlo a la pregunta correspondiente.

## Comprobaciones sin hallazgo

- El banco contiene 42 ítems, 14 familias con tres variantes cada una y una sola clave por ítem. Cada familia conserva una decisión única y reconocible en `families.json`; las claves de `f10` se limitan al número de versión, `f12` a lo que falta declarar y `f14-c` es correctamente afirmativa porque aporta corrección, prueba y regresión.
- Fuera de los dos solapes señalados, no observé repetición material de escenarios con las 34 comprobaciones, ejemplos de M10, M01–M09 ni los bloques de diagnóstico indicados. `m10-f02-c` usa registros históricos de aprobaciones para reconstruir la línea base, no la situación de `m10-l3-r2`; `m10-lab-q05` traslada la regla de datos derivados al caso de descuentos y `q06` aplica una migración de moneda distinta de las marcas del ejemplo de L3.
- `m10-f06-b` trata correctamente la preferencia como recuperable; `m10-f14-c` cumple la regla de cierre con evidencia. Las explicaciones siguen sus `sectionRef`, y las preguntas marcadas como `basis: inference` son reglas explícitas del curso, no conclusiones atribuidas indebidamente a un proveedor.
- Todos los `sourceIds` de examen, laboratorio y práctica existen en `content/sources.json`; todas las claves tienen `sectionRef`, y cada distractor tiene un concepto erróneo existente. T049-M10-05 señala que uno de esos vínculos existentes es conceptualmente demasiado estrecho.
- La proporción máxima de longitudes de opciones es 1,41 en examen, 1,17 en laboratorio y 1,37 en práctica; no hay pista de longitud. Las posiciones de clave se reparten `o2`, `o3`, `o1` dentro de cada familia y las opciones no usan orden fijo.
- Recalculé la tabla del laboratorio: los seis precios finales, porcentajes de margen, bandas de aprobación y el borde de 22,00 % coinciden. Un 8 % lo aprueba el vendedor; más de 8 % hasta 15 %, el gerente regional; más de 15 %, dirección comercial. El caso límite de 10 % deja exactamente 22,00 % y pasa.
- Los seis pasos mantienen una secuencia comprensible: necesidad, accesibilidad, datos, publicación, documentación y mudanza. El giro no es una sorpresa conceptual: obliga a revisar la decisión del paso 3 y el cierre defectuoso del hallazgo. No aparecen productos reales en el texto del laboratorio.

Verificado: estructura, claves, fuentes, `sectionRef`, distractores, equivalencia familiar, longitudes, cifras y continuidad del caso. No se modificó `src/`, `content/`, `e2e/` ni `ESTADO.md`.

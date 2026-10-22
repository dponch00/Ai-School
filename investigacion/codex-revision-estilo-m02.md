# Revisión independiente de estilo — M02

**Fecha:** 2026-10-22
**Revisor:** Codex
**Alcance:** comparación de `0803162~1` con `0803162` en las seis lecciones de M02, sus fichas y los bancos de preguntas. No se editó contenido.

## Método y comprobaciones

- Leí completas L1 a L6, incluidos los casos resueltos, ejercicios y respuestas modelo.
- Comparé cada lección con `git diff 0803162~1 0803162 -- content/courses/m02`.
- Cada lección conserva el mismo número de citas y los mismos IDs que antes: L1 10, L2 16, L3 20, L4 9, L5 11 y L6 9. No encontré una cita eliminada ni trasladada a otra afirmación.
- Revisé `checks.json`, `practice.json` y `exam.json`: las referencias de sección siguen vigentes y usan los términos actuales, incluido «está listo». No queda «condición de terminado».
- Las tres fusiones solicitadas conservan el contenido funcional: `suggest-vs-act` en `m02-pc-autonomy-levels`, `copilot-agent-task` en `m02-pc-codex-task-shape` y `session-scope` en `m02-pc-instruction-files`.

## Hallazgos

- [ST-01] Severidad: media
  Ubicación: `content/courses/m02/lessons/m02-l1.md:18`, `#porque`
  Evidencia: antes decía «cuando la instrucción explica su motivación, el modelo generaliza mejor y da respuestas más dirigidas»; ahora dice «entiende mejor qué es importante y acierta más». «Acierta más» convierte una recomendación de dar contexto en una afirmación de exactitud, más fuerte y menos definida que la formulación anterior. La cita `src-anthropic-prompting-bp` permanece.
  Consecuencia: el lector puede entender que explicar el motivo garantiza corrección factual, cuando la práctica mejora el contexto de la respuesta pero no sustituye la verificación.
  Corrección recomendada: sustituir las dos frases finales por: «Con un modelo ocurre algo parecido: explicar el motivo le da contexto para priorizar lo que debe incluir y lo que puede dejar fuera. Por eso conviene contarle de qué trabajo forma parte el encargo, quién lo va a usar y para qué.»
  Verificado: el diff conserva la cita, pero cambia el alcance de «respuestas más dirigidas» a «acierta más».

- [ST-02] Severidad: media
  Ubicación: `content/courses/m02/lessons/m02-l2.md:34`, `#capas`
  Evidencia: la reescritura añade que el archivo de instrucciones del repositorio es uno «que el agente tiene en cuenta en todas las tareas». La propia ficha `m02-pc-instruction-files` explica que cada producto usa archivos y reglas de precedencia distintos; por tanto, que se cargue depende de la herramienta, el directorio y la sesión.
  Consecuencia: alguien puede asumir que una regla permanente se aplicará sin comprobar que el agente cargó el archivo correcto.
  Corrección recomendada: sustituir «Su sitio es el archivo de instrucciones del repositorio, que el agente tiene en cuenta en todas las tareas» por: «Su sitio es el archivo de instrucciones del repositorio. Configúralo para la herramienta que uses y comprueba que se haya cargado antes de confiar en que aplique esas reglas.»
  Verificado: la formulación anterior solo situaba estas reglas en el archivo del repositorio; la garantía de «todas las tareas» aparece en la versión nueva.

- [ST-03] Severidad: baja
  Ubicación: `content/courses/m02/lessons/m02-l2.md:57`, `#supuestos`; fusión de `m02-pc-ambiguity-mechanisms`
  Evidencia: la explicación conserva las tres conductas, pero elimina los nombres concretos que ayudaban a reconocerlas: `[NEEDS CLARIFICATION]` y *Decision Log*. El ticket confirma que ambas ideas quedaron integradas en el cuerpo.
  Consecuencia: el alumno entiende la política, pero pierde dos expresiones que puede encontrar literalmente en Spec Kit y en la guía archivada de ExecPlans.
  Corrección recomendada: reescribir la oración central así: «Puedes darle permiso para responder «no tengo información suficiente», pedirle que marque `[NEEDS CLARIFICATION]` donde falte una decisión, o dejar que avance si registra cada decisión y su motivo en un *Decision Log*.»
  Verificado: `m02-pc-autonomy-levels`, `m02-pc-codex-task-shape` e `m02-pc-instruction-files` sí preservan sus respectivas fusiones; esta pérdida afecta solo a los dos nombres de la ficha retirada.

- [ST-04] Severidad: baja
  Ubicación: `content/courses/m02/lessons/m02-l3.md:26,135`, `#casos`
  Evidencia: el título y el resumen dicen «El mejor ejemplo es un caso de prueba», pero el apartado acaba de distinguir un ejemplo de formato de un caso de prueba: uno enseña apariencia y el otro permite comprobar un resultado.
  Consecuencia: la etiqueta borra una distinción que las preguntas de comprobación sí evalúan y puede hacer que el alumno trate ambos como sinónimos.
  Corrección recomendada: cambiar el título por «Para comprobar el resultado, usa un caso de prueba» y el resumen por «Para comprobar el resultado, usa un caso de prueba con su entrada y su resultado esperado.»
  Verificado: `checks.json` y los bancos de práctica y examen mantienen la distinción entre ejemplo de formato, caso de prueba e invariante.

- [ST-05] Severidad: baja
  Ubicación: `content/courses/m02/lessons/m02-l1.md:59`, `#terminado`
  Evidencia: «Un encargo sin un punto final claro no se termina nunca, o se termina cuando al agente le parece» usa una disyuntiva absoluta y suena a eslogan. El párrafo siguiente ya expresa la idea comprobable con más precisión.
  Consecuencia: debilita la voz sobria de la reescritura y presenta como comportamiento inevitable algo que depende del flujo y de quien acepta la entrega.
  Corrección recomendada: sustituir la primera oración por: «Sin un criterio observable, no puedes comprobar si el encargo quedó listo ni pedir la evidencia que falta.»
  Verificado: el cambio es de voz; la cita y el contenido sobre pruebas, comportamiento y errores se mantienen.

- [ST-06] Severidad: baja
  Ubicación: `docs/guia-de-estilo.md:63-65`, regla de hechos y citas
  Evidencia: la guía exige conservar las citas junto a la afirmación, pero no pide comparar el alcance de la afirmación antes y después de reescribirla. ST-01 muestra que una cita puede quedarse en el mismo lugar mientras «respuestas más dirigidas» pasa a «acierta más».
  Consecuencia: una futura revisión puede conservar todos los IDs de fuente y, aun así, fortalecer o debilitar lo que se atribuye a la fuente.
  Corrección recomendada: añadir después de la regla de citas: «Al reescribir una frase con cita, conserva también su alcance: compara el antes y el después y no cambies una mejora de contexto, claridad o formato por una afirmación de exactitud, causalidad o garantía sin verificar la fuente.»
  Verificado: el conteo y los IDs de citas de las seis lecciones no cambiaron; la comprobación semántica sigue siendo necesaria.

## Resultado de la revisión

No encontré cambios en las cifras de Altiplano, los IDs de encabezado, las directivas ni las claves de las preguntas. Las lecciones 4 a 6 no tienen hallazgos de voz, sentido o alcance factual en esta ronda. Las fichas cumplen el máximo de dos por lección y las tres fusiones principales conservan su contenido.

## Siguiente acción

Claude puede decidir qué hallazgos aplicar sin modificar los contratos, las preguntas ni los datos sintéticos. Tras aplicar los cambios editoriales, conviene volver a ejecutar la prueba de contenido que valida fichas, citas y referencias.

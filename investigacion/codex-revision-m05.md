# Revisión cruzada de M05 — Desarrollo con agentes de código

**Ticket:** T-033  
**Fecha:** 2026-10-23  
**Alcance revisado:** `course.json`, las seis lecciones, 100 preguntas (34 comprobaciones, 42 de examen, 12 de laboratorio y 12 de práctica), familias, caso, conceptos erróneos y las seis fichas. No se modificó contenido ni código.

## Resultado

Se encontraron cuatro hallazgos, ninguno crítico ni alto. Los objetivos del blueprint son evaluables mediante opción múltiple y las 100 preguntas tienen exactamente una clave. Cada distractor tiene concepto erróneo y cada opción tiene feedback; las explicaciones y `sectionRef` revisados corresponden a la decisión evaluada.

- [T033-M05-01] Severidad: media
  Ubicación: `content/courses/m05/product-cards.json`, fichas `m05-pc-permission-modes` y `m05-pc-cloud-agents`
  Evidencia: las seis fichas tienen `maturity: "ga"`, pero la primera describe *Assisted* de VS Code como experimental y la segunda describe `copilot --cloud` como vista previa pública. Las páginas oficiales abiertas no etiquetan las demás capacidades agrupadas como GA. Una ficha reúne además capacidades con estados distintos.
  Consecuencia: la etiqueta general comunica una madurez que la propia ficha contradice y puede llevar a tratar una capacidad de vista previa como estable.
  Corrección recomendada: sustituir la madurez global por «estado no indicado» cuando la página no lo declara, o modelar el estado por capacidad y conservar explícitamente «experimental» y «vista previa pública» donde la fuente lo dice.

- [T033-M05-02] Severidad: media
  Ubicación: `content/courses/m05/questions/{checks,exam,lab,practice}.json`; en especial `m05-f03-a` y `m05-f12-b`
  Evidencia: once ítems tienen una clave al menos 1.7 veces más corta o más larga que las alternativas. En el examen, `m05-f03-a` tiene clave «Directo» (7 caracteres) frente a 58/58, y `m05-f12-b` «En local» (8) frente a 46/40. También aparecen en comprobaciones `m05-l2-c1`, `m05-l2-r2`, `m05-l4-c3`, `m05-l6-r2`; laboratorio `m05-lab-q08`; y práctica `m05-p02`, `m05-p03`, `m05-p10`, `m05-p11`.
  Consecuencia: la longitud permite adivinar respuestas, sobre todo en dos familias del examen, sin aplicar la decisión del enunciado.
  Corrección recomendada: igualar la forma y extensión de las tres opciones. Por ejemplo, ampliar «Directo» a una instrucción paralela a las otras dos y expresar «En local» como una decisión con su motivo, sin añadir una pista factual.

- [T033-M05-03] Severidad: baja
  Ubicación: `content/courses/m05/questions/exam.json`, `m05-f05-c`, opción `o2`, feedback
  Evidencia: el texto afirma que «la instrucción de detenerse es la que más reduce los atajos». ImpossibleBench sí respalda que pedir detenerse y explicar el conflicto reduce fuertemente los atajos en sus tareas y modelos evaluados; no demuestra que sea la intervención que más los reduce en general. La opción es correcta y su explicación de uso es fiel a `m05-l3#trampa`.
  Consecuencia: se amplía el alcance de un resultado experimental al presentarlo como regla comparativa universal.
  Corrección recomendada: escribir «en el estudio, añadir la instrucción de detenerse y explicarlo redujo los atajos»; mantener la compuerta como control adicional, tal como ya dice el feedback.

- [T033-M05-04] Severidad: baja
  Ubicación: `content/courses/m05/questions/exam.json`, `m05-f08-a`; `content/courses/m05/questions/checks.json`, `m05-l4-c1`; `content/courses/m03/questions/exam.json`, `m03-f01-a`
  Evidencia: los tres enunciados presentan dos o más correcciones fallidas de formato, una conversación llena de versiones fallidas y las mismas tres respuestas funcionales: insistir, sesión nueva y compactar. La clave es «sesión nueva» en los tres. El cambio de «fecha» a «comisiones» no exige una decisión nueva.
  Consecuencia: quien recuerde M03 o la comprobación de M05 reconoce el patrón y adelanta la respuesta del examen M05, sin demostrar transferencia.
  Corrección recomendada: conservar la decisión de la familia, pero cambiar el estado que la activa por un caso que requiera distinguirla de compactar o bifurcar con evidencia nueva. `m05-f06-a` y el diagnóstico/M04 comparten el principio de pedir evidencia, pero difieren en la falla concreta y no revelan por sí solos una clave.

## Comprobaciones sin hallazgo

- **Citas prioritarias.** El 84 % se atribuye a un uso interno y fechado del proveedor; el ensayo METR conserva 16 desarrolladores, 246 tareas, +19 % observado y −20 % percibido; ImpossibleBench respalda prueba de solo lectura, parada explícita y salida para consulta; y el estudio de autocorrección limita la conclusión a ausencia de señal externa. La regla de dos correcciones se presenta como práctica de un solo proveedor. Las lecciones describen correctamente la compacción como una petición grande, limpiar como movimiento sin coste de contexto y los requisitos de traspaso nube-terminal.
- **Tres frases añadidas.** `m05-f02-b/o1` y `m05-lab-q04/o2` son fieles a sus secciones y fuentes. `m05-f05-c/o2` requiere el ajuste de alcance del hallazgo T033-M05-03.
- **Laboratorio.** Los seis pasos aportan los datos necesarios para sus doce decisiones. El paso 3 entrega la contradicción 60/90 y la instrucción previa de detenerse; obliga a revisar la regla de verificación del paso 2 y no permite resolverla cambiando la prueba.
- **Solapes restantes.** `dx-b3-01` permite reiniciar *o* compactar y no revela el movimiento específico de M05; `dx-b3-04` evalúa continuidad entre herramientas; `dx-b4-01` evidencia frente a afirmación; `dx-b4-04` planificación; `dx-b6-02` defensa ante contenido no confiable; `m04-f14-a` reconciliación. Comparten vocabulario de trabajo, pero no adelantan una clave de M05. `m05-l3-c1` y la familia `m05-f05` refuerzan el mismo objetivo con encargos distintos.
- **Alcance y lectura.** Al retirar las marcas de cita, no hay nombres de producto en el cuerpo de las seis lecciones. Recuento de palabras: L1 1302, L2 1076, L3 1088, L4 1078, L5 969 y L6 1089; todas caben razonablemente en 25 minutos.
- **Interfaz.** En navegador local, a 360 px y 1280 px, portada M05, L3, laboratorio e inicio del examen no presentan desbordamiento horizontal. En laboratorio se selecciona una opción con foco y Espacio; en examen, Enter inicia las 36 opciones y Espacio selecciona una. No se requieren capturas.
- **Pruebas:** `npm test` pasó: 12 archivos y 162 pruebas.

## Fuentes abiertas y resultado

| Fuente abierta | Resultado de la comprobación |
| --- | --- |
| Anthropic, *Making Claude Code safer with sandboxing* (2025-10-20) | Confirma que el 84 % procede de despliegue interno; no lo convierte en resultado general. |
| METR, *Measuring the Impact of Early-2025 AI…* (arXiv 2507.09089) | Confirma muestra, 246 tareas, −20 % percibido y +19 % observado. |
| *ImpossibleBench* (arXiv 2510.20270) | Confirma las mitigaciones acotadas al estudio; origina T033-M05-03 por la generalización. |
| *Large Language Models Cannot Self-Correct Reasoning Yet* (arXiv 2310.01798) | Confirma la salvedad sobre no disponer de señal externa. |
| Claude Code, *Choose a permission mode* y *Sandboxing* | Confirman modos, denegaciones y límites; sin estado GA para toda la ficha. |
| Claude Code, *Security*, *Best practices*, *Common workflows*, *Sessions* y *Checkpointing* | Respaldan permisos, planificación, sesiones, compacción y puntos de retorno. |
| Claude Code, *Use Claude Code in the cloud* y *Configure cloud environments* | Confirman red, entorno remoto y requisitos para continuidad/traspaso. |
| Claude Code, *Use Claude Code with Chrome* | Respalda el aislamiento de navegación descrito en la ficha. |
| OpenAI, *Agent approvals & security*, *Best practices*, *Cloud*, *Browser*, *Computer use* y *Worktrees* | Las capacidades descritas son compatibles con las páginas abiertas; no declaran GA como estado transversal. |
| GitHub, *Copilot on GitHub.com*, *Risks and mitigations*, *Get the best results* y *Code review* | Confirman ejecución remota, restricciones y revisión; la sesión máxima de 59 minutos se mantiene en la documentación consultada. |
| VS Code, *Manage approvals and permissions* y guía de browser testing | Confirman los modos y el estado experimental indicado en la ficha. |
| OWASP LLM06:2025 | Respalda mínimo privilegio y aprobaciones para acciones de impacto. |
| Anthropic, *Effective harnesses for long-running agents* | Respalda compuertas y verificación por pasos. |

**Verificado:** fuentes oficiales y primarias abiertas el 2026-10-23; enlaces de cita de las seis lecciones resuelven a IDs presentes en `content/sources.json` y sus afirmaciones prioritarias conservan el alcance indicado, salvo T033-M05-03.

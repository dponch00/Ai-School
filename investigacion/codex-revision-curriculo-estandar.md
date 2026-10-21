# Revisión independiente: currículo y estándar de contenido

**Fecha:** 2026-10-21

**Alcance:** `docs/curriculum.md`, `docs/content-standard.md`, `plan.md`, D-001 a D-014 y las cuatro investigaciones indicadas en T-003.
**Método:** muestreo trazable de afirmaciones y contraste de coherencia. No se modificaron los documentos revisados.

## Dictamen

El currículo conserva una orientación sólida para dirigir agentes de código desde finanzas: decisiones observables, datos sintéticos, verificación y transferencia. Las 13 competencias deben permanecer separadas en el currículo; el diagnóstico solo puede dar señales por bloque.

Antes de iniciar la producción de M02 hay cuatro asuntos de severidad alta que requieren decisión o corrección: qué reporta el diagnóstico, cómo cabe la cobertura de objetivos en el banco, si 36 ítems reemplazan el alcance vigente, y la regla completa para revisiones LLM que cambian estado.

## Hallazgos

- [REV-01] Severidad: alta
  Ubicación: `docs/curriculum.md:54-67`; `plan.md:294-299`
  Evidencia: el currículo adopta seis bloques de cuatro ítems y excluye C13 del diagnóstico; el plan aún promete un reporte por competencia. La investigación recomienda bloques de al menos cuatro ítems, prohíbe conclusiones con 2–3 ítems y propone exactamente seis bloques (`investigacion/pedagogia-evaluacion.md:401-408,584-605`).
  Consecuencia: dos documentos normativos permiten promesas incompatibles sobre lo que el diagnóstico puede concluir.
  Corrección recomendada: registrar una decisión que reemplace en el plan el reporte individual por señales de seis bloques, con conteos e incertidumbre. Mantener las 13 competencias como mapa curricular y no certificarlas desde el diagnóstico inicial.

- [REV-02] Severidad: alta
  Ubicación: `docs/content-standard.md:46-47,68,75`
  Evidencia: seis lecciones tienen 1–3 objetivos cada una: 6–18 objetivos. A dos familias por objetivo se requieren 12–36 familias, pero el banco fijo tiene 12. La investigación exige una matriz de evidencia y, para el examen, dos ítems por objetivo evaluado; no exige dos familias por cada objetivo de lección (`investigacion/pedagogia-evaluacion.md:235-239`).
  Consecuencia: con más de seis objetivos evaluados por manual, ni el banco ni el examen pueden satisfacer la cobertura declarada; la matriz no será auditable.
  Corrección recomendada: definir un *blueprint* de máximo seis objetivos evaluados por manual y vincular los objetivos de lección a él, o ampliar el banco. Cambiar “dos familias por objetivo” por el requisito preciso de dos ítems por objetivo evaluado si esa es la intención.

- [REV-03] Severidad: alta
  Ubicación: `docs/content-standard.md:68-70`; `plan.md:543-547`; `docs/decisions.md:D-011`
  Evidencia: el estándar fija 36 ítems para M02. El plan sigue indicando 20–24 preguntas por manual; la investigación pedagógica recomienda 36 como alternativa para evitar reutilización, mientras la investigación específica de M02 sugiere unas 22 (`investigacion/pedagogia-evaluacion.md:676-679`; `investigacion/M02-prompting-especificaciones.md:455`). D-011 exige medir esfuerzo antes de escalar, pero no sustituye el número del plan.
  Consecuencia: se compromete trabajo editorial considerable sin una decisión registrada: 36 ítems, variantes, distractores, enlaces y feedback por opción requieren revisión independiente.
  Corrección recomendada: registrar explícitamente 36 como experimento de M02 con horas de autoría, revisión y corrección como métricas y un criterio de continuación; o mantener 20–24 hasta que una decisión reemplace el plan.

- [REV-04] Severidad: alta
  Ubicación: `docs/content-standard.md:116-117`
  Evidencia: se exige doble evaluación para cambiar un estado, pero se omiten las condiciones de R-H-8: discrepancia máxima de un nivel por criterio y estado `revisión pendiente` si no se cumple (`investigacion/pedagogia-evaluacion.md:489-498`). La misma investigación clasifica estas salvaguardas como inferencias que exigen revisión semestral (`:829`).
  Consecuencia: dos evaluaciones discrepantes podrían cambiar un estado de aprendizaje sin una regla de resolución ni evidencia conservada.
  Corrección recomendada: incluir el umbral, `revisión pendiente`, evidencia por criterio, conservación de ambas evaluaciones y la etiqueta de inferencia con fecha de próxima revisión.

- [REV-05] Severidad: media
  Ubicación: `docs/content-standard.md:35,50`
  Evidencia: el patrón reduce el repaso a 1–2 preguntas, aunque R-A2-1 pide 2–3; pide una sola pregunta de contraste donde R-A4-2 pide una serie de 4–6 casos breves cuando hay decisiones que se confunden (`investigacion/pedagogia-evaluacion.md:108-110`).
  Consecuencia: se presenta como cumplimiento de reglas una reducción no documentada y se debilita la práctica de discriminación que pretende medir el curso.
  Corrección recomendada: usar 2–3 preguntas de repaso y 4–6 contrastes para cada confusión crítica, o declarar ambas reducciones como hipótesis del piloto y medir su efecto y duración.

- [REV-06] Severidad: media
  Ubicación: `docs/content-standard.md:79-80,87,96`
  Evidencia: reintento al día siguiente, retención de 5/6 a siete días, tope de 120 palabras y feedback de 2–4 frases se presentan como reglas cerradas. La investigación los marca como inferencias o propuestas de diseño (`investigacion/pedagogia-evaluacion.md:313,371,459-461,827-831`).
  Consecuencia: contradice el propio principio de distinguir hecho, recomendación e inferencia y hace difícil revisar el piloto con honestidad.
  Corrección recomendada: etiquetar estas cifras como inferencias pedagógicas y definir qué datos de M02 las confirman, ajustan o descartan.

- [REV-07] Severidad: media
  Ubicación: `docs/curriculum.md:26,107,150,195,210`; `docs/decisions.md:D-007`
  Evidencia: la lista de fichas de producto solo cubre M01, M05, M07 y M08. M03 tiene tablas y precedencias por producto; M06 una nota de MCP de Databricks; M09 plataformas de evals; M10 plataformas de hosting. D-007 exige separar lo duradero de las capacidades de producto fechadas.
  Consecuencia: detalles volátiles pueden quedar en lecciones sin superficie, fuente, fecha de verificación ni próxima revisión.
  Corrección recomendada: sustituir la lista cerrada por la regla “toda afirmación dependiente de producto o versión va en ficha”; enumerar como mínimo M03, M06, M09 y M10 además de los cuatro manuales actuales.

- [REV-08] Severidad: media
  Ubicación: `docs/curriculum.md:116`; `investigacion/curriculo-estado-del-arte.md:106-122`
  Evidencia: M03 pide una skill portable y prueba de carga en dos herramientas, pero las rutas de instalación, mecanismos de carga y precedencias cambian por producto y superficie.
  Consecuencia: “portable” puede interpretarse como que el mismo árbol se carga igual en cualquier herramienta y producir una práctica no reproducible.
  Corrección recomendada: exigir que la entrega nombre las dos herramientas y superficies, versiones, rutas y evidencia de carga; distinguir formato portable de instalación específica por producto.

- [REV-09] Severidad: media
  Ubicación: `docs/curriculum.md:141,186`; `investigacion/curriculo-estado-del-arte.md:149-150,185-199`
  Evidencia: M05 generaliza reiniciar sesión tras correcciones fallidas aunque la acción concreta varía entre herramientas. M08.5 concentra nube, segundo plano, programación, modo *headless* y hooks, capacidades con disponibilidad desigual.
  Consecuencia: se pueden enseñar comandos o conductas inaplicables y la explicación, demostración y práctica no caben razonablemente en 25 minutos.
  Corrección recomendada: formular M05 como detenerse, reproducir y elegir limpiar, compactar, bifurcar o reiniciar según producto; dividir M08.5 entre decisión de delegación asíncrona y automatización del arnés, con una ficha producto/superficie/estado por caso.

- [REV-10] Severidad: media
  Ubicación: `docs/curriculum.md:198,201`; `investigacion/curriculo-estado-del-arte.md:208-217`
  Evidencia: iniciar con 20–50 casos procedentes de fallos reales está respaldado, pero el laboratorio inicial solo tiene datos sintéticos. Los controles deterministas se incluyen sin declarar que no existe defensa infalible frente a inyección.
  Consecuencia: M09 puede atribuir falsamente una procedencia a los casos y generar confianza excesiva en un único guardrail.
  Corrección recomendada: iniciar con casos etiquetados como sintéticos o históricos del laboratorio y añadir después fallos reales con procedencia y regresión; enseñar defensa en capas, incluyendo privilegio mínimo, aprobaciones, controles deterministas, revisión de salidas y sus límites.

- [REV-11] Severidad: media
  Ubicación: `docs/content-standard.md:123-130`; `plan.md:374-381`; `AGENTS.md`
  Evidencia: “etiquetas dentro del visual”, “legible a 360 px” y “peso razonable” no delimitan formato ni prueba. Las reglas del proyecto prohíben texto incrustado en imágenes generadas y reservan diagramas exactos para SVG/código.
  Consecuencia: un autor puede incrustar texto en un raster o un revisor no podrá comprobar peso, zoom y legibilidad con el mismo criterio.
  Corrección recomendada: permitir etiquetas internas solo en SVG o visuales codificados; para raster, ofrecer texto equivalente en HTML adyacente. Definir viewport, aumento de texto, peso máximo y condición de carga diferida verificables.

- [REV-12] Severidad: media
  Ubicación: `docs/curriculum.md:101,219`; `docs/decisions.md:D-012`
  Evidencia: D-012 define el cuaderno de decisiones para el laboratorio de cada manual, con prueba inicial en M02. El currículo lo declara en M02, pero no define la decisión posterior de extensión a M01 y M03–M10.
  Consecuencia: el requisito puede escalar sin evidencia de valor o quedar incompleto fuera del piloto.
  Corrección recomendada: registrar que M02 lo prueba y que F1-05/F1-13 decidirá documentadamente si se convierte en requisito para todos los laboratorios.

## Afirmaciones muestreadas

| Afirmación | Documento y línea | Fuente de contraste | Veredicto |
| --- | --- | --- | --- |
| Las conductas se miden con escenarios, no memoria de productos | `curriculum.md:34` | `curriculo-estado-del-arte.md:240-256` | Correcta |
| 24 preguntas solo permiten señales por seis bloques de cuatro | `curriculum.md:56` | `pedagogia-evaluacion.md:584-605` | Correcta; contradice la redacción vigente del plan |
| JSON Schema garantiza forma, no verdad | `curriculum.md:96` | `M02-prompting-especificaciones.md:21,181` | Correcta en el sentido de validación estructural; mantener prueba de datos y criterios de aceptación |
| La precedencia de instrucciones depende del producto | `curriculum.md:110` | `curriculo-estado-del-arte.md:106-122` | Correcta; requiere ficha por producto/superficie |
| Reiniciar tras correcciones fallidas | `curriculum.md:141` | `curriculo-estado-del-arte.md:149-150` | Parcial: el principio es válido, el procedimiento es específico de producto |
| 20–50 casos de fallos reales para evals | `curriculum.md:198` | `curriculo-estado-del-arte.md:208` | Correcta; falta una política de conjunto inicial sintético |
| OpenAI Evals cierra el 2026-11-30 | `curriculum.md:205` | `curriculo-estado-del-arte.md:221`; `M02-prompting-especificaciones.md:363` | Correcta y fechada |
| Todo objetivo tiene evidencia y toda evidencia objetivo | `content-standard.md:12` | `pedagogia-evaluacion.md:235-238` | Correcta, pero la regla citada debería ser R-B-3, no solo R-B-2 |
| 1–2 preguntas de repaso | `content-standard.md:35` | `pedagogia-evaluacion.md:R-A2-1` | Contradice el rango investigado de 2–3 |
| Una pregunta de contraste es suficiente | `content-standard.md:50` | `pedagogia-evaluacion.md:108-110` | Contradice los 4–6 casos recomendados |
| 36 ítems para el piloto M02 | `content-standard.md:68-70` | `pedagogia-evaluacion.md:676-679`; `M02-prompting-especificaciones.md:455` | Recomendación discutible, no decisión que reemplace al plan |
| Examen con dos ítems por objetivo evaluado | `content-standard.md:75` | `pedagogia-evaluacion.md:239` | Correcta; requiere *blueprint* compatible con 12 ítems |
| Doble evaluación cambia estados | `content-standard.md:116` | `pedagogia-evaluacion.md:489-498` | Parcial: faltan umbral de discrepancia y `revisión pendiente` |
| Etiquetas dentro del visual | `content-standard.md:125` | `pedagogia-evaluacion.md:R-A8-3`; reglas del repositorio | Parcial: válida para SVG/código, ambigua para raster generado |

## Respuestas a las preguntas abiertas de `curriculum.md` §5

1. **Las 13 competencias deben permanecer separadas en el currículo.** C03 decide el contexto y C04 dónde viven reglas y skills; C05 revisa la corrección de un cambio y C06 aísla o recupera historial. Son conductas observables distintas. En el diagnóstico deben quedar agrupadas: C03/C04 en B3 y C05/C06/C07 en B4, sin emitir resultados individuales.
2. **M03.2, M05.1 y M08.5 exceden una sesión de 25 minutos** si incluyen explicación, demostración y práctica. M03.2 necesita una tabla ya preparada por producto; M05.1 debe practicar un único escenario de permisos; M08.5 debe separarse en delegación asíncrona y automatización técnica. La investigación reconoce que la duración de microsesiones para este dominio es una extrapolación (`pedagogia-evaluacion.md:827-831`), por lo que M02 debe medirla.
3. **Altiplano basta para M07 y para el caso principal de M08, con una transferencia adicional.** En M07 debe incluir contrato simulado, scopes OAuth, error y contenido no confiable. Para M08 conviene un caso breve distinto: una tarea programada que falla, exige revisar el registro, detenerla y elegir una alternativa simple. Así no se aprende una única respuesta ligada al dashboard.

## Límites de la revisión

Se contrastó con los registros de investigación ya fechados el 2026-10-21. No se reconsultaron las fuentes primarias porque los hallazgos tratan coherencia interna y las afirmaciones de producto muestreadas ya conservan fuente y fecha en esos registros.

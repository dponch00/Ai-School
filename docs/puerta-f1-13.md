# Puerta de calidad del piloto M02 (F1-13)

**Fecha:** 2026-10-22 (revisado con T-016) · **Prepara:** Claude Code · **Revisa:** Codex (T-016) · **Decide:** Daniel · **Regla:** D-011 (ningún bloque de manuales empieza sin pasar la puerta del anterior).

## Resumen

| Criterio de D-011 | Estado |
| --- | --- |
| 1. Matriz objetivo → lección → actividad → evidencia, sin objetivos sin evaluar | **Cumplido.** Los 6 objetivos tienen lección, comprobaciones, 2 familias de examen y un criterio del laboratorio. Una prueba automática lo vigila. |
| 2. Revisión independiente con los hallazgos críticos y altos cerrados y comprobados | **Cumplido.** 12 informes de revisión de Codex (en los tickets T-001 a T-015): 83 hallazgos (24 altos, 45 medios y 14 bajos, sin críticos), todos cerrados con su comprobación. |
| 3. Esfuerzo real medido y comparado con lo estimado | **No cumplido todavía.** El historial de git da intervalos de reloj, no esfuerzo: mezcla trabajo, esperas y noches. No hubo registro aislado del esfuerzo editorial. Falta también el tiempo real de estudio, que solo puede dar Daniel. Desde el Bloque A se mide con `docs/registro-esfuerzo.md`. |

**Recomendación:** que Daniel haga el recorrido completo como alumno (unas 4 horas, según el curso) y, con ese dato, abrir la Fase 3 con el Bloque A. La medición de esfuerzo editorial empieza con el primer manual del bloque y se recalibra después de M03 o M04. Mientras tanto, se puede avanzar en paralelo la base técnica de la Fase 2 (PWA, modo offline y hosting), que no depende del recorrido.

## 1. Matriz objetivo → evidencia

| Objetivo evaluado | Objetivos de lección | Comprobaciones | Familias de examen | Criterio del laboratorio | Evidencia en el reporte |
| --- | --- | --: | --- | --- | --- |
| eo1 · Reescribir un objetivo con usuario, decisión, periodo y criterio | L1-o1, L1-o2 | 4 | f01, f02 | Objetivo, decisión y alcance (crítico) | Respuestas por competencia C02, entrega y autoevaluación |
| eo2 · Contexto pertinente, restricciones con motivo y supuestos con dueño | L2-o1, L2-o2, L2-o3 | 6 | f03, f04 | Definiciones y supuestos (crítico) | Igual |
| eo3 · Ejemplos, contraejemplos y contrato de salida (forma frente a valores) | L3-o1, L3-o2, L3-o3 | 6 | f05, f06 | Casos, contraejemplos y contrato de salida | Igual |
| eo4 · Especificación autocontenida y cuándo pedir que el agente te entreviste | L4-o1, L4-o2, L4-o3 | 6 | f07, f08 | Objetivo y alcance; Hitos y prompt | Igual |
| eo5 · Hitos con su prueba y corregir donde nació el error | L5-o1, L5-o2, L5-o3 | 6 | f09, f10 | Hitos y prompt de ejecución | Igual |
| eo6 · Criterios de aceptación observables y evidencia de la entrega | L1-o3, L6-o1, L6-o2, L6-o3 | 6 | f11, f12 | Criterios de aceptación y evidencia (crítico) | Igual |

Fuente: `content/courses/m02/`. Se comprueba en `src/domain/course-files.test.ts` («matriz objetivo → lección → actividad → evidencia completa»). En esta preparación se encontró y cerró un hueco: los criterios de la rúbrica no decían qué objetivo evaluaban. Ahora lo dicen (`PracticeCriterion.evaluatedObjectiveIds`) y la prueba exige que cubran los seis.

## 2. Revisión independiente

| Revisión | Altos | Medios | Bajos |
| --- | --: | --: | --: |
| T-001 plan | 3 | 4 | 1 |
| T-003 currículo y estándar | 4 | 8 | — |
| T-004 diagnóstico (DX-01 a DX-06) | 5 | 7 | — |
| T-004 contratos (CTR-01 a CTR-06) | 3 | 3 | — |
| T-006 patrón de M02 (L1–L2) | 3 | 5 | 2 |
| T-008 L3–L6 y reconciliador | 1 | 2 | 3 |
| T-009 examen y laboratorio | 2 | 3 | 2 |
| T-010 variantes nuevas | — | — | — |
| T-011 interfaz del lector | — | 3 | 1 |
| T-012 estilo de lecciones | — | 2 | 4 |
| T-013 bancos, laboratorio y examen | — | 2 | 1 |
| T-014 expediente | 2 | 3 | — |
| T-015 piloto completo | 1 | 3 | — |
| **Total** | **24** | **45** | **14** |

Son 12 informes en 12 tickets; T-002, T-005 y T-007 fueron entregas de Codex (direcciones visuales, sistema de diseño y datos del laboratorio) que revisó Claude, así que no generan hallazgos de revisión. Los seis hallazgos de contratos de T-004 se cerraron en el commit `cc721f5` y cada uno tiene su prueba en `src/domain/domain.test.ts`: CTR-01 (respuestas duplicadas u opciones no mostradas invalidan el intento), CTR-02 y CTR-05 (`reviewState`), CTR-03 (familia repartida entre objetivos), CTR-04 (evidencia incompleta del diagnóstico) y CTR-06 (respuesta sin fecha y examen sin resultado). Cada ticket cerrado tiene su sección «Revisión» con lo aplicado y cómo se comprobó. La tabla de §17.9 de T-015 quedó en 11 de 11 criterios cumplidos tras corregir T015-R01.

## 3. Esfuerzo

### Producción (intervalos entre commits, no esfuerzo)

Git solo da intervalos de reloj entre commits. Esos intervalos incluyen trabajo de los agentes, esperas de Codex o de Daniel, créditos agotados y noches, así que **no son una medición de esfuerzo** (T016 P016-02).

| Tramo | Intervalo entre commits | Qué incluye |
| --- | --- | --- |
| Fase 0: plan, protocolo, currículo, estándar, diagnóstico, contratos, sistema visual | 16:37–18:39 del 21 oct (≈ 2 h) | Trabajo y esperas de revisión |
| Contenido de M02: 6 lecciones (≈ 11 000 palabras), 83 preguntas, laboratorio con datos y reconciliador, 5 revisiones | 18:47–21:31 del 21 oct (≈ 2,7 h) | Trabajo y esperas de revisión |
| App del piloto, F1-01 a F1-11, con 5 revisiones | 21:40 del 21 oct – 09:46 del 22 oct (≈ 12 h de reloj); sin la noche, ≈ 3 h | Trabajo, esperas y una noche |
| Reescritura de estilo (D-021) y su revisión | 22:42 del 21 oct – 07:48 del 22 oct (≈ 9 h de reloj) | Casi todo es la noche; con git no se puede aislar el trabajo |

No hay horas humanas: el tiempo de Daniel leyendo, decidiendo y pasando tickets no se midió. Una vez el trabajo se pausó porque Codex se quedó sin créditos.

**Banco de 36 ítems (D-016):** el intervalo de commits del banco es de unos 45 min (20:46–21:31), pero esos commits incluyen también el laboratorio, la práctica y las correcciones. No hay el desglose de autoría, revisión y corrección que pide D-016. **Recomendación:** mantener 36 ítems en el Bloque A como **decisión provisional**, registrar el esfuerzo del banco aparte en `docs/registro-esfuerzo.md` y recalibrar después de M03 o M04.

**Proyección para la Fase 3 [inferencia]:** si un manual con su revisión cruzada toma unas 4–5 horas de trabajo de agentes (sin esperas, y sin contar las imágenes de Codex), nueve manuales son **36–45 horas**, más el tiempo de Daniel. Es una hipótesis que se corrige con los registros del Bloque A. Lo que hoy limita el ritmo no es la redacción, sino los créditos de Codex y el tiempo de revisión de Daniel.

### Estudio (pendiente: lo da Daniel)

| Dato | Estimado | Real |
| --- | --- | --- |
| Lecciones de M02 | 22–25 min cada una (147 min) | Pendiente |
| Laboratorio | 75–90 min [H] | Pendiente |
| Curso completo | 240 min | Pendiente |
| Academia completa (plan §2) | 30–40 h | Se proyecta con el dato de M02 |

## 4. Hipótesis del piloto (estándar §9)

| Hipótesis | Estado | Qué falta |
| --- | --- | --- |
| Lección de 25 minutos o menos | Sin datos | El tiempo real de Daniel por lección |
| Reintento al día siguiente | Sin datos | Que Daniel haga el examen, falle alguna familia y lo repita |
| Retención a 7 días con 5/6 | **Sin implementar** | La comprobación diferida no existe en la app; está contemplada en el contrato (`kind: retention`). Propuesta: Fase 2 |
| Enunciado ≤ 120 palabras y feedback de 2–4 frases | **Confirmada en lo estructural** | Los 83 enunciados quedan muy por debajo del límite y los 252 feedbacks tienen 2–3 frases (verificado en T-016); ninguna revisión reportó falta de información. Falta la lectura de Daniel |
| 36 ítems por manual | **Provisional** | Sin desglose de esfuerzo del banco; se mide en el Bloque A y se recalibra tras M03 o M04 (§3) |
| Doble evaluación con discrepancia ≤ 1 nivel | **Sin probar** | La regla está en el código (`reviewState`), pero falta la pantalla para registrar revisiones externas de la práctica. Propuesta: Fase 2 |
| Imagen ≤ 200 KB en el celular | **Confirmada** | En el celular se sirven 480 o 960 px (18–104 KB). La versión de 1 600 px (210–278 KB) solo se descarga en pantallas anchas |

## 5. Lo que falta para cerrar la puerta

1. **El recorrido de Daniel como alumno** (§17.10): perfil, lecciones, examen, laboratorio, reporte compartido en un chat, retroalimentación registrada y una acción aceptada. Da el tiempo real de estudio, valida la voz con el lector real y prueba el ciclo completo.
2. **La prueba en el celular**, con texto al 200 % (el navegador integrado no permite zoom real) y los subtítulos del diagrama.
3. Opcional: una revisión externa del laboratorio, para empezar a probar la regla de doble evaluación.

## 6. Decisiones para Daniel

1. **¿Cuándo abrir la Fase 3?** Recomendado: después de tu recorrido. Alternativa: abrir el Bloque A ya y usar tu recorrido para ajustar.
2. **Banco por manual:** recomendado mantener 36 ítems (12 × 3) de forma provisional, midiendo su esfuerzo aparte y recalibrando después de M03 o M04.
3. **Bloque A:** el plan dice M01, M03 y M04. Recomendado mantenerlo: M01 (herramientas) da contexto a todo lo demás, y M03 y M04 son la base de M05.
4. **Fase 2 en paralelo:** recomendado avanzar ya la PWA, el modo offline, el hosting (F0-11, necesita que crees la organización de GitHub) y las dos piezas pendientes de la app: la comprobación diferida y las revisiones externas de la práctica.

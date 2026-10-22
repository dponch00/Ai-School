# Revisión independiente de M02: lecciones 3 a 6

**Ticket:** T-008 · **Fecha:** 2026-10-21 · **Revisor:** Codex

## Resultado

Las lecciones mantienen el patrón aprobado: decisión, comprobación rápida,
segmentos, caso resuelto, autoexplicación, transferencia, comprobación y
resumen. Las transferencias son reales (gastos y margen), la voz es clara y
no hay afirmaciones de producto fuera de fichas.

La revisión detectó una incompatibilidad alta entre el contrato que enseña L3
y el reconciliador que L4 y L6 presentan como su verificación. Corregirla
antes de usar el laboratorio evita que el alumno produzca una salida válida
según la lección pero rechazada por el check.

## Hallazgos

- [M02-08-01] Severidad: alta
  Ubicación: content/courses/m02/lessons/m02-l3.md:76-91; content/courses/m02/lessons/m02-l4.md:77-81; content/courses/m02/lessons/m02-l6.md:57; content/courses/m02/practice/data/reconcile.py:259-273
  Evidencia: L3 enseña un contrato con kpi_id, as_of_date, reporting_currency, data_quality_issues y assumption_ids. El reconciliador identifica cada KPI exclusivamente por metric y region; el fixture correcto también usa metric. Un JSON construido con el ejemplo de L3 deja cada KPI como faltante en compare().
  Consecuencia: El alumno puede seguir el contrato enseñado y fallar el check de reconciliación aunque sus cifras sean correctas.
  Corrección recomendada: Definir un único contrato compartido. Cambiar L3 al contrato que acepta el reconciliador, o ampliar el reconciliador y sus fixtures para aceptar y validar todos los campos que L3 enseña. Si se mantienen contratos distintos, nombrarlos y explicar para qué interfaz sirve cada uno.
  Verificado: la comparación usa entry.get("metric"); kpi_id no se lee en reconcile.py y expected/kpis_correct.json usa metric.

- [M02-08-02] Severidad: media
  Ubicación: content/courses/m02/lessons/m02-l3.json:10, 16, 22; m02-l4.json:10, 16, 22; m02-l5.json:10, 16, 22; m02-l6.json:10, 16, 22
  Evidencia: Los doce objetivos indican situación y verbo observable, pero no declaran un criterio de éxito verificable. El estándar pide el formato “Dado…, verbo observable… criterio”.
  Consecuencia: Se debilita la trazabilidad entre objetivo, comprobación, práctica y rúbrica; dos personas podrían discrepar sobre cuándo se alcanzó cada objetivo.
  Corrección recomendada: Añadir a cada objetivo un criterio observable y proporcional, por ejemplo que el caso cubra una condición borde, que cada hito incluya una prueba o que el escenario tenga un Then observable.
  Verificado: se revisaron los doce statements de los cuatro archivos JSON contra docs/content-standard.md §3.2.

- [M02-08-03] Severidad: media
  Ubicación: content/courses/m02/questions/checks.json, IDs m02-l3-r2/o2, m02-l4-c4/o2 y m02-l4-r1/o3
  Evidencia: m02-l3-r2/o2 confunde un ejemplo visual con un caso verificable, pero usa m02-mc12, que trata de creer que un único ejemplo cubre todos los casos. m02-l4-c4/o2 adopta una definición de negocio sin dueño, pero usa m02-mc08 en vez de m02-mc43. m02-l4-r1/o3 confunde la comprensión del agente actual con una especificación autocontenida, pero usa m02-mc27, que trata de aceptar una afirmación de pruebas.
  Consecuencia: El catálogo diagnostica una creencia distinta de la elegida y no puede orientar bien el repaso posterior.
  Corrección recomendada: Reasignar m02-l4-c4/o2 a m02-mc43; crear o reutilizar conceptos que describan los otros dos distractores, o reescribirlos para que expresen el concepto asociado.
  Verificado: se comparó cada texto con las descripciones de misconceptions.json; las claves y los demás distractores sí son defendibles.

- [M02-08-04] Severidad: baja
  Ubicación: content/courses/m02/questions/checks.json, ID m02-l2-r2/o3
  Evidencia: La opción propone que el modelo calcule una cifra y revise su propia suma, pero usa m02-mc22. El error dominante es dejar el cálculo al modelo, descrito por m02-mc10; m02-mc22 corresponde a confundir autorrevisión con revisión independiente.
  Consecuencia: La señal diagnóstica mezcla dos errores diferentes.
  Corrección recomendada: Asociar la opción a m02-mc10 o reformularla para medir la equivalencia entre autorrevisión y revisión independiente.
  Verificado: L2 establece que los cálculos deterministas viven fuera del modelo y m02-mc10 expresa exactamente esa regla.

- [M02-08-05] Severidad: baja
  Ubicación: content/courses/m02/lessons/m02-l3.json:48; m02-l4.json:46; m02-l5.json:44; m02-l6.json:47
  Evidencia: Las cuatro lecciones declaran exactamente 25 minutos, el máximo del estándar. Tienen entre 1,191 y 1,432 palabras, más recuperaciones, caso, autoexplicación, transferencia y cuatro comprobaciones.
  Consecuencia: No hay margen demostrado para que el alumno complete la recuperación y las actividades dentro de la duración publicada.
  Corrección recomendada: Cronometrar una pasada del piloto con el perfil de alumno objetivo y recortar o mover un aparte si excede 25 minutos.
  Verificado: conteo local de palabras: L3 1,432; L4 1,285; L5 1,191; L6 1,307. No se simuló una prueba de usuario.

- [M02-08-06] Severidad: baja
  Ubicación: design/asset-manifest.json, activo m02-spec-illustration
  Evidencia: El manifiesto actual no tiene un campo de ciclo de vida ni de reemplazo; solo conserva id, ruta, función, metadatos de generación, dimensiones y estado de revisión.
  Consecuencia: No se puede marcar el activo anterior como reemplazado por el SVG de contenido sin inventar un campo que no pertenece al contrato.
  Corrección recomendada: Definir primero en el contrato del manifiesto status: active | replaced y replacedBy con el ID o ruta del activo sucesor. Después marcar m02-spec-illustration como replaced por content/courses/m02/diagrams/m02-spec-anatomy.svg.
  Verificado: el manifiesto se mantuvo sin cambios; no existe un campo apto para el dato solicitado.

## Muestra factual

| Afirmación revisada | Base contrastada | Veredicto |
| --- | --- | --- |
| L3:18, ejemplos pertinentes, diversos y delimitados | M02 §2, P3.1 | Sostenida |
| L3:20, ejemplos parecidos causan sobreajuste | M02 §2, P3.2 | Sostenida |
| L3:22, cantidad de ejemplos como variable a probar | M02 §2, desacuerdos de L3 | Sostenida |
| L3:36, casos de prueba antes de código | M02 §2, P3.3 | Sostenida |
| L3:38, código existente como ejemplo | M02 §2, P3.4 | Sostenida |
| L3:46, casos positivos y negativos | M02 §2, P3.5 | Sostenida |
| L3:50, formato explícito de salida | M02 §2, P4.1 | Sostenida |
| L3:54-56, listas cerradas, salida inválida y truncamiento | M02 §2, P4.6-P4.7 | Sostenida |
| L3:62, forma no equivale a exactitud | M02 §2, P4.2 | Sostenida |
| L4:18 y 47, archivos, exclusiones y entrevista | M02 §2, P5.2 | Sostenida |
| L4:55, costo de SDD en tareas pequeñas | M02 §2, P5.3 | Sostenida |
| L5:18, planificar cuando el camino es incierto | M02 §2, P5.1 | Sostenida |
| L5:24 y 35, hitos verificables y reinicio | M02 §2, P5.4-P5.6 | Sostenida |
| L5:41 y 45, corregir en origen y revisión limpia | M02 §2, P5.3-P5.7 | Sostenida |
| L6:18, 22-28 y 38, criterios observables y check ejecutable | M02 §2, P6.1-P6.4 | Sostenida |
| L6:57 y 63, evidencia y varios ensayos | M02 §2, P4.8 y P6.7 | Sostenida |

Se muestrearon 16 afirmaciones con cita. Todas coinciden con la investigación
registrada; no apareció una duda que exigiera abrir una fuente primaria
adicional.

## Coherencia del caso

| Cifra comprobada | Cálculo o fixture | Veredicto |
| --- | --- | --- |
| EUR 95,000 = USD 104,500 | 95,000 × 1.10 en fx_rates.csv | Coincide con L3:36 |
| Pipeline abierto Norte USD 1,201,500 | expected/kpis_correct.json con latest_last_activity | Coincide con L3:82 |
| Cobertura Norte alrededor de 1.3x | 1,201,500 / (1,200,000 − 250,000) = 1.2647x | Coincide; L5 usa 1.0x como resultado erróneo ilustrativo |
| 16 de 16 KPI | 4 métricas por Norte, Centro, Sur y TOTAL | Coincide con L6:57 y el fixture correcto |

## Revisión de preguntas

| ID | Prueba de tapar opciones | Veredicto |
| --- | --- | --- |
| m02-l2-r1 | Sí | Pasa |
| m02-l2-r2 | Sí | Pasa la clave; ajustar misconception de o3 (M02-08-04) |
| m02-l3-c1 | Sí | Pasa |
| m02-l3-c2 | Sí | Pasa |
| m02-l3-c3 | Sí | Pasa |
| m02-l3-c4 | Sí | Pasa |
| m02-l3-r1 | Sí | Pasa |
| m02-l3-r2 | Sí | Pasa la clave; ajustar misconception de o2 (M02-08-03) |
| m02-l4-c1 | Sí | Pasa |
| m02-l4-c2 | Sí | Pasa |
| m02-l4-c3 | Sí | Pasa |
| m02-l4-c4 | Sí | Pasa la clave; ajustar misconception de o2 (M02-08-03) |
| m02-l4-r1 | Sí | Pasa la clave; ajustar misconception de o3 (M02-08-03) |
| m02-l4-r2 | Sí | Pasa |
| m02-l5-c1 | Sí | Pasa |
| m02-l5-c2 | Sí | Pasa |
| m02-l5-c3 | Sí | Pasa |
| m02-l5-c4 | Sí | Pasa |
| m02-l5-r1 | Sí | Pasa |
| m02-l5-r2 | Sí | Pasa |
| m02-l6-c1 | Sí | Pasa |
| m02-l6-c2 | Sí | Pasa |
| m02-l6-c3 | Sí | Pasa |
| m02-l6-c4 | Sí | Pasa |

Las 24 preguntas tienen una única clave, tres o cuatro opciones, punteros y
fuentes válidos, orden aleatorio y feedback de dos a tres frases. Los nuevos
conceptos m02-mc42 a m02-mc44 están fundados y sus usos revisados son
pertinentes.

## Diagrama y reconciliador

El SVG nombra las cinco partes en el mismo orden que L4. Su title, desc y el
texto alternativo de assets.json expresan la misma relación. Con viewBox de
480 px, sus subtítulos de 18 px escalan a 13.5 px a 360 px y a 12.3 px a
328 px, consistente con la medición reportada.

El reconciliador conserva las correcciones T7-01 a T7-04: imprime AVISO para
duplicados, cierre vacío y etapa sin probabilidad excluida; exige una de dos
políticas explícitas para duplicados; comunica errores en español; y
reconfigura stdout y stderr en UTF-8. Las dos políticas producen cifras
distintas y las siete pruebas cubren ese comportamiento.

La inspección visual rasterizada del SVG no fue posible porque el visor local
no admite SVG. La legibilidad se verificó por fuente, viewBox y geometría.

## Comprobación

Ejecutado: npm test
Resultado: 3 archivos de prueba aprobados; 49 pruebas aprobadas.

Ejecutado: Python 3.14, content/courses/m02/practice/data/test_reconcile.py
Resultado: 7 pruebas aprobadas.

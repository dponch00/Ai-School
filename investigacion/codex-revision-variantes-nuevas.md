# Revisión cruzada de variantes nuevas y cambios del laboratorio M02

**Fecha:** 2026-10-21
**Revisor:** Codex
**Alcance:** las 13 variantes nuevas del banco M02, las 12 familias y los
cambios del laboratorio solicitados en T-010.

## Resultado

No hay hallazgos abiertos que requieran cambiar el banco o el laboratorio.
Las 13 variantes tienen una clave única y defendible al ocultar las opciones;
sus distractores son plausibles, corresponden al concepto erróneo declarado y
no presentan pistas formales determinantes. El nuevo m02-mc56 se usa de forma
coherente en m02-f10-c.

Las familias ahora conservan una sola decisión. Se aceptan las equivalencias de
F07 y F09 como supuestas para el piloto: F07 diagnostica, desde síntomas
distintos, qué pieza de una especificación faltó; F09 decide si el alcance
requiere hitos verificables o admite una petición directa. Sus variantes usan
dominios y consecuencias distintas sin cambiar esa regla.

No queda el solapamiento de T-009 entre la confirmación de acciones
irreversibles y los hitos: ese contenido está en el banco de práctica, no en
dos familias del examen.

## Hallazgos

No se identificaron hallazgos de severidad crítica, alta, media o baja en el
alcance de T-010. Las observaciones de T-009 quedan verificadas como aplicadas
en las tablas siguientes.

## Veredicto por variante nueva

La columna «Tapar y pistas» confirma que se puede responder con el escenario y
el enunciado, sin que la forma de las opciones revele la clave.

| Variante | Clave revisada | Tapar y pistas | Distractores y concepto erróneo | Veredicto |
| --- | --- | --- | --- | --- |
| m02-f02-b | Informe de causas y cifras, sin modificar | Pasa; sin pista | Modificar (mc35) y añadir alertas no pedidas (mc41) | Pasa |
| m02-f02-c | Comparar versiones e informar, sin tocar cálculo | Pasa; sin pista | Restaurar por defecto (mc35) y rediseñar fuera de alcance (mc41) | Pasa |
| m02-f03-b | Archivo, regla de redondeo y caso fallido | Pasa; sin pista | Contexto excesivo (mc06) o insuficiente (mc01) | Pasa |
| m02-f03-c | Vista, patrón y regla de cálculo | Pasa; sin pista | Contexto excesivo (mc06) o insuficiente (mc01) | Pasa |
| m02-f04-c | Preguntar base de comisión que cambia pagos | Pasa; sin pista | Preguntar todo (mc38) o decidir en silencio (mc08) | Pasa |
| m02-f05-b | Invariante subtotal más impuesto igual a total | Pasa; sin pista | Confiar en el esquema (mc14) o en rangos (mc42) | Pasa |
| m02-f05-c | Comprobar la conciliación en código | Pasa; sin pista | Autorrevisión (mc22) o rangos de esquema (mc42) | Pasa |
| m02-f06-a | Caso concreto con entrada y resultado | Pasa; sin pista | Regla abstracta (mc13) o ejemplo de formato (mc46) | Pasa |
| m02-f08-a | Llevar definición al dueño y no implementarla | Pasa; sin pista | Definirla uno mismo (mc43) o adoptar al agente (mc45) | Pasa |
| m02-f09-b | Plan con hitos y prueba por hito | Pasa; sin pista | Implementación única (mc52) o hitos sin prueba (mc53) | Pasa |
| m02-f10-a | Corregir especificación, caso y reejecutar | Pasa; sin pista | Corregir solo código (mc44) o asumir sin avisar (mc08) | Pasa |
| m02-f10-c | Aclarar con finanzas y añadir caso | Pasa; sin pista | Escoger la cifra conveniente (mc56) o ajustar código (mc44) | Pasa |
| m02-f12-c | Pedir comando, salida y comprobar sesión | Pasa; sin pista | Confiar en la afirmación (mc27) o en un diff (mc55) | Pasa |

## Juicio de equivalencia por familia

| Familia | Decisión revisada | Juicio |
| --- | --- | --- |
| F01 | Elegir objetivo con usuario, entregable, periodo y decisión | Pasa; las tres claves ya incluyen el entregable. |
| F02 | Diagnóstico: informar sin modificar | Pasa; las variantes mantienen los distractores de editar o ampliar alcance. |
| F03 | Elegir contexto específico para una tarea acotada | Pasa; cambian el defecto y el patrón relevante, no la decisión. |
| F04 | Preguntar o reportar lo que cambia cifras | Pasa; las variantes aplican la misma política a definiciones y datos faltantes. |
| F05 | Exigir invariante de valores además del esquema | Pasa; cada una conserva forma válida con relación semántica falsa. |
| F06 | Elegir caso concreto con resultado esperado | Pasa; la clave sigue siendo un caso verificable, frente a regla o formato. |
| F07 | Diagnosticar la pieza ausente desde el síntoma | Aceptada como equivalente supuesta; cambia la pieza faltante, pero se conserva el mismo diagnóstico de las cinco partes. |
| F08 | Llevar definición pendiente a su dueño | Pasa; el negocio, no quien especifica ni el agente, decide en las tres. |
| F09 | Elegir hitos verificables o petición directa según alcance | Aceptada como equivalente supuesta; dos cambios amplios requieren hitos y el cambio trivial permite petición directa. |
| F10 | Corregir en la especificación un hueco que produjo error | Pasa; los tres errores nacen de una definición ausente y requieren definición más caso. |
| F11 | Elegir criterio de aceptación observable | Pasa; no cambió desde la revisión previa. |
| F12 | Rechazar éxito sin evidencia ejecutable | Pasa; se exige comando y salida en las tres variantes. |

## Independencia

La comparación entre familias no encuentra otro solapamiento material. Las
versiones nuevas de m02-f02-c y m02-f09-b ya no miden confirmación de acciones
irreversibles: F02 mide diagnóstico sin modificación y F09, proporcionalidad
de planificación. Las preguntas anteriores de ese tema se trasladaron al banco
de práctica.

## Laboratorio y comprobaciones

| Comprobación | Resultado |
| --- | --- |
| Paso 6 sin unknown_stage_policy | Se detuvo con código 2 y enumeró En revisión (OPP-1036) y las tres filas En pausa (OPP-1040 a OPP-1042). |
| Paso 6 con exclude_and_report | Informó las cuatro exclusiones. Al contrastar con los KPI de ejemplo del 19, señaló de forma esperada la fecha, una vencida de Sur y las tres incidencias de calidad que ese archivo antiguo no declara. |
| Paso 7 desde content/courses/m02 | Con los fixtures de referencia, reconcile.py pasó 16 KPI y los 3 problemas de calidad; código 0. |
| npm test | 52 pruebas aprobadas. |
| test_reconcile.py | 10 pruebas aprobadas. |

El comando de paso 7 ya declara la carpeta de trabajo. El paso 6 usa el
snapshot del lunes comprobable y evita adelantar una respuesta: primero obliga
a observar el fallo por falta de política y luego muestra las exclusiones al
declararla.

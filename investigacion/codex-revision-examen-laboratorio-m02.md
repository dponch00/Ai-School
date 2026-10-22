# Revisión cruzada: examen y laboratorio de M02

**Fecha:** 2026-10-21
**Revisor:** Codex (revisión distinta del autor)
**Alcance:** banco de 36 ítems, laboratorio M02 y manifiesto de activos.

## Método y resultado general

Se revisaron manualmente las claves, los distractores, el feedback, las
referencias, las pistas y la independencia de los 36 ítems. La prueba de
equivalencia es un juicio editorial: con un solo alumno se declara supuesta,
no demostrada. Un revisor revisó el banco y otro el laboratorio; Codex
consolidó los resultados.

El contrato automático está sano: las 51 pruebas de npm pasan. Las claves son
únicas, hay tres opciones por ítem y su posición está repartida por igual
(o1, o2 y o3: 12 veces cada una). Los ocho conceptos nuevos, m02-mc48 a
m02-mc55, existen y sus distractores los representan de forma coherente.

El problema principal no es la clave individual: es la familia. Solo F11
conserva la misma decisión en sus tres variantes. F01 cumple el núcleo de la
decisión, pero omite una parte explícita de su objetivo evaluado. Las demás
familias señaladas cambian la subdecisión o el constructo y no deben tratarse
como variantes intercambiables hasta corregirse o justificarse.

## Hallazgos

- [EX-01] Severidad: alta
  Ubicación: content/courses/m02/questions/exam.json, m02-f01-a, m02-f01-b y m02-f01-c
  Evidencia: El objetivo m02-eo1 exige usuario, decisión, periodo y tipo de entregable. Las tres claves incluyen los tres primeros elementos, pero no indican el entregable.
  Consecuencia: Acertar no demuestra completamente el objetivo evaluado que declara el ítem.
  Corrección recomendada: Incluir el tipo de entregable en cada clave y crear una versión nueva de los tres ítems.
  Verificado: Contrastado con content/courses/m02/course.json y la lista de §4.4 del estándar.

- [EX-02] Severidad: alta
  Ubicación: content/courses/m02/questions/exam.json, familias m02-f02, m02-f03, m02-f05, m02-f08 y m02-f10
  Evidencia: §4.2 define una familia como mismo objetivo y misma decisión. F02 cambia entre diagnosticar, acotar un cambio y pedir confirmación; F03 entre seleccionar contexto, separar sesiones y ubicar reglas; F05 entre invariantes, rechazo y portabilidad; F08 entre proporcionalidad, entrevista y aprobación; F10 entre reiniciar contexto, reparar una especificación y priorizar una revisión.
  Consecuencia: Las variantes no son intercambiables para reintentos, selección aleatoria ni comparación por familia.
  Corrección recomendada: Reagrupar por decisión y conservar como variantes solo escenarios que mantengan el mismo juicio.
  Verificado: Revisión semántica de las 15 variantes frente a §4.2.

- [EX-03] Severidad: media
  Ubicación: content/courses/m02/questions/exam.json, familias m02-f04, m02-f06, m02-f07, m02-f09 y m02-f12
  Evidencia: Comparten tema, pero cambian una subdecisión o la dificultad de constructo: ambigüedad frente a restricciones, tipo de caso de prueba, parte ausente de la especificación, control humano frente a reversibilidad, o evidencia ejecutable frente a diseño de evaluación.
  Consecuencia: La equivalencia queda como una suposición sin una justificación editorial suficiente.
  Corrección recomendada: Documentar una justificación por familia o ajustar las variantes para que evalúen la misma decisión.
  Verificado: Revisión manual de las cinco familias conforme a §4.2.

- [EX-04] Severidad: media
  Ubicación: content/courses/m02/questions/exam.json, m02-f02-c y m02-f09-b
  Evidencia: Ambos pueden coincidir en un examen y aplican la regla de confirmar antes de una acción irreversible o visible para terceros.
  Consecuencia: Un ítem puede facilitar la respuesta conceptual del otro y duplicar medición entre objetivos.
  Corrección recomendada: Cambiar F09-b para medir el control de hitos y supuestos, o reemplazar una de las dos situaciones de confirmación.
  Verificado: Comparación de independencia contra el banco completo.

- [LAB-01] Severidad: media
  Ubicación: content/courses/m02/practice/m02-lab.md, paso 7; content/courses/m02/practice/m02-lab.json, executableCheck.command
  Evidencia: Ejecutado desde la raíz del repositorio, el comando literal busca practice/data/reconcile.py y falla porque el archivo existe bajo content/courses/m02/practice/data/. Con rutas explícitas y los fixtures correctos, el reconciliador valida los 16 KPI y los 3 problemas de calidad.
  Consecuencia: Quien siga el laboratorio desde la raíz no puede obtener la evidencia exigida por el check.
  Corrección recomendada: Declarar content/courses/m02 como directorio de trabajo o usar rutas desde la raíz; actualizar a la vez el markdown y executableCheck.command.
  Verificado: Fallo reproducido desde la raíz y ejecución correcta comprobada con kpis_correct.json y assumptions_reference.json.

- [LAB-02] Severidad: baja
  Ubicación: content/courses/m02/practice/m02-lab.md, paso 6
  Evidencia: La tarjeta entrega solo el agregado de USD 410 000 y adelanta que detenerse y reportar ya cuenta como evidencia. No hay fixture del snapshot del 2026-10-26 para comprobar el pedido de análisis cifra por cifra.
  Consecuencia: El contraejemplo no se puede reconciliar y la pista reduce la necesidad de decidir qué hacer ante la nueva etapa.
  Corrección recomendada: Añadir un fixture del lunes y pedir comparar el resultado bajo la política inicial y la revisada, o eliminar la pista explícita.
  Verificado: Comparado con los fixtures de practice/data y las cuatro consignas del cuaderno.

- [LAB-03] Severidad: baja
  Ubicación: content/courses/m02/practice/m02-lab.md, estimación de tiempo
  Evidencia: El diagnóstico por sí solo tiene una estimación investigada de 15 a 20 minutos; además se exigen diez ambigüedades, brief, cinco casos, cinco escenarios, prompt con hitos, cuaderno y autoevaluación.
  Consecuencia: Los 75 a 90 minutos son una hipótesis razonable para piloto, no una duración validada.
  Corrección recomendada: Medir el tiempo real del piloto y conservar el resultado para ajustar la estimación.
  Verificado: Desglose de los entregables obligatorios frente a la estimación publicada.

## Banco: veredicto por ítem

Leyenda: «sí» en pistas significa que no apareció una pista formal determinante; la
homogeneidad, distractores y feedback son adecuados. «Tapar» indica que la
respuesta se puede decidir con el enunciado sin mirar opciones.

| ID | Clave revisada | Tapar y pistas | Equivalencia de familia | Veredicto |
| --- | --- | --- | --- | --- |
| m02-f01-a | Objetivo para usar línea de crédito | Sí; sin pista | F01 parcial: falta entregable | Parcial |
| m02-f01-b | Objetivo para reabastecer | Sí; sin pista | F01 parcial: falta entregable | Parcial |
| m02-f01-c | Objetivo para priorizar áreas | Sí; sin pista | F01 parcial: falta entregable | Parcial |
| m02-f02-a | Informar diferencia sin modificar | Sí; sin pista | F02 no equivalente | Correcto; familia falla |
| m02-f02-b | Cambio acotado y diff | Sí; sin pista | F02 no equivalente | Correcto; familia falla |
| m02-f02-c | Confirmar borrado de duplicados | Sí; sin pista | F02 no equivalente | Correcto; familia falla |
| m02-f03-a | Archivo, definición y caso fallido | Sí; sin pista | F03 no equivalente | Correcto; familia falla |
| m02-f03-b | Sesión nueva con contexto propio | Sí; sin pista | F03 no equivalente | Correcto; familia falla |
| m02-f03-c | Regla global en instrucciones | Sí; sin pista | F03 no equivalente | Correcto; familia falla |
| m02-f04-a | Preguntar cuándo se registra gasto | Sí; sin pista | F04 parcial | Correcto; revisar familia |
| m02-f04-b | Detenerse por tasa CLP faltante | Sí; sin pista | F04 parcial | Correcto; revisar familia |
| m02-f04-c | Proteger publicado y usar borradores | Sí; sin pista | F04 parcial | Correcto; revisar familia |
| m02-f05-a | Invariante de suma clasificada | Sí; sin pista | F05 no equivalente | Correcto; familia falla |
| m02-f05-b | Rechazar respuesta fallida | Sí; sin pista | F05 no equivalente | Correcto; familia falla |
| m02-f05-c | Validar rango en código | Sí; sin pista | F05 no equivalente | Correcto; familia falla |
| m02-f06-a | Tickets con borde ambiguo | Sí; sin pista | F06 parcial | Correcto; revisar familia |
| m02-f06-b | Factura anulada sin total | Sí; sin pista | F06 parcial | Correcto; revisar familia |
| m02-f06-c | EUR convertido a USD | Sí; sin pista | F06 parcial | Correcto; revisar familia |
| m02-f07-a | Condición de terminado comprobable | Sí; sin pista | F07 parcial | Correcto; revisar familia |
| m02-f07-b | Archivos y patrón existentes | Sí; sin pista | F07 parcial | Correcto; revisar familia |
| m02-f07-c | Supuestos y política de ambigüedad | Sí; sin pista | F07 parcial | Correcto; revisar familia |
| m02-f08-a | Vista, texto y comprobación | Sí; sin pista | F08 no equivalente | Correcto; familia falla |
| m02-f08-b | Entrevista y dueño de decisión | Sí; sin pista | F08 no equivalente | Correcto; familia falla |
| m02-f08-c | Propuesta pendiente de aprobación | Sí; sin pista | F08 no equivalente | Correcto; familia falla |
| m02-f09-a | Plan con hitos y pruebas | Sí; sin pista | F09 parcial | Correcto; revisar familia |
| m02-f09-b | Control antes de envío irreversible | Sí; solapa F02-c | F09 parcial | Correcto; revisar familia |
| m02-f09-c | Cambio acotado con comprobación | Sí; sin pista | F09 parcial | Correcto; revisar familia |
| m02-f10-a | Reiniciar contexto y reescribir | Sí; sin pista | F10 no equivalente | Correcto; familia falla |
| m02-f10-b | Reparar especificación y reejecutar | Sí; sin pista | F10 no equivalente | Correcto; familia falla |
| m02-f10-c | Corregir cobertura, decidir nombres | Sí; sin pista | F10 no equivalente | Correcto; familia falla |
| m02-f11-a | Anuladas fuera del total | Sí; sin pista | F11 equivalente | Pasa |
| m02-f11-b | KPI en menos de dos segundos | Sí; sin pista | F11 equivalente | Pasa |
| m02-f11-c | Factura sin cliente excluida con motivo | Sí; sin pista | F11 equivalente | Pasa |
| m02-f12-a | Comandos, salidas y comparación | Sí; sin pista | F12 parcial | Correcto; revisar familia |
| m02-f12-b | Salida de pruebas ejecutadas | Sí; sin pista | F12 parcial | Correcto; revisar familia |
| m02-f12-c | Casos borde y ensayos repetidos | Sí; sin pista | F12 parcial | Correcto; revisar familia |

No se hallaron claves ambiguas, distractores de relleno, absolutos delatores,
referencias rotas ni pistas formales determinantes. Los distractores de los
conceptos nuevos m02-mc48 a m02-mc55 son plausibles y corresponden al error
que declaran. La independencia queda comprometida solo por el solapamiento
EX-04.

## Laboratorio: veredicto

| Punto | Veredicto | Evidencia |
| --- | --- | --- |
| B1. Instrucciones y tiempo | Parcial | Las entradas, entregables, evidencias, andamiaje y autoevaluación permiten hacer el núcleo sin ayuda. La duración de 75 a 90 minutos aún debe validarse en piloto. |
| B2. Rúbrica y anclajes | Pasa | Tiene cinco criterios, tres niveles observables, tres críticos adecuados y dos anclajes sintéticos que permiten discriminar los cinco criterios. |
| B3. Cambio del lunes | Pasa con observación | Sí prueba una ambigüedad que afecta cifras y exige contraste de decisión; falta fixture para verificarla y la propia consigna adelanta una solución válida. |
| B4. Paso 7 y check | Falla como está escrito | El comando no declara el directorio de trabajo y falla desde la raíz; con las rutas y fixtures de referencia sí valida los resultados. |

## Verificación

- npm test: 51 pruebas aprobadas.
- Python: content/courses/m02/practice/data/test_reconcile.py, 9 pruebas aprobadas.
- Reconciliador con fixtures: desde content/courses/m02 se ejecutó practice/data/reconcile.py con kpis_correct.json y assumptions_reference.json; validó 16 KPI y 3 problemas de calidad.
- Manifiesto: m02-spec-illustration queda marcado como replaced y apunta a content/courses/m02/diagrams/m02-spec-anatomy.svg; npm test sigue pasando.

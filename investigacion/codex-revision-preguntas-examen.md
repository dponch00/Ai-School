# Revisión independiente — preguntas, laboratorio y examen de M02

**Fecha:** 2026-10-22
**Revisor:** Codex

**Alcance:** bancos de comprobación, examen y práctica; laboratorio M02; y flujos de examen y práctica en la app. No se editó `content/` ni `src/`.

## Método y comprobaciones

- Leí los 83 ítems: 34 comprobaciones, 36 variantes de examen y 13 preguntas de práctica; también leí el laboratorio completo, incluidos sus siete pasos y la rúbrica.
- Comparé los bancos con `99b1543~1..99b1543` y el laboratorio con `f14ad77~1..f14ad77`. No cambiaron IDs, claves, orden de opciones, `misconceptionId`, `sectionRef`, fuentes, familia, variante, objetivo, proceso ni dificultad.
- Los 83 `sectionRef` resuelven a una ancla existente. La reescritura redujo el indicio de longitud de la clave: examen, de 18 a 11 de 36 claves empatadas o más largas; comprobaciones, de 11 a 9 de 34; práctica, 3 de 13 en ambas versiones.
- Probé el examen en `#/cursos/m02/examen` en 360 × 780 y 1280 × 800, con teclado. Completé un intento con respuestas faltantes y uno completo; comprobé aviso, envío, revisión, historial y reintento. No hubo desplazamiento horizontal (345/360 px y 1265/1280 px, respectivamente).
- Probé `#/cursos/m02/practica` en escritorio y teclado: las 13 preguntas se presentan fuera del examen, el feedback aparece al comprobar y el enlace de repaso funciona.
- El aviso piloto dice que las preguntas siguen en revisión y que cada intento guarda la versión exacta respondida. Es concreto y suficiente.

## Hallazgos

- [T013-B01] Severidad: media
  Ubicación: `content/courses/m02/questions/exam.json:677`, familia `m02-f06`; patrón también en `m02-f04`, `m02-f05`, `m02-f08` a `m02-f12`
  Evidencia: el ticket indica que dentro de cada familia el enunciado es igual y solo cambia el escenario, pero 8 de 12 familias tienen dos o tres enunciados distintos. En F06 se pasa de «¿Qué conviene incluir en la especificación?» a «¿Qué contraejemplo conviene incluir…?» y a «¿Cuál de estos es un caso de prueba y no solo un ejemplo de formato?». En F11 cambia de elegir un `Then` observable a convertir «rápido» en criterio y a reconocer un escenario bien formado.
  Consecuencia: las tres variantes siguen cerca de la misma competencia, pero no piden exactamente la misma operación mental ni tienen dificultad comparable. Un reintento deja de ser una medición limpia de la misma decisión, y además no cumple el criterio anunciado para la reescritura.
  Corrección recomendada: normalizar el enunciado de cada familia y dejar que solo cambie el escenario. Por ejemplo, en F06 usar en las tres variantes «¿Qué caso concreto con resultado esperado conviene incluir en la especificación?»; en F11, «¿Cuál criterio de aceptación comprobable corresponde?». Aplicar el mismo criterio a las otras seis familias señaladas.
  Verificado: la auditoría agrupa las 36 preguntas en 12 familias de tres variantes; todas conservan familia y objetivo, pero las ocho familias señaladas muestran de dos a tres valores distintos de `stem`.

- [T013-B02] Severidad: media
  Ubicación: `content/courses/m02/practice/m02-lab.md:107-113`, paso 6, «Contraejemplo»
  Evidencia: el paso pide ejecutar el reconciliador sin política y después con política, y «anotar qué cifras cambian en cada caso». Sin `unknown_stage_policy`, `reconcile.py:220-225` detiene la ejecución con `unknown_stage` antes de producir KPI, así que en la primera corrida no hay cifras que comparar. Con la política de referencia, el fixture de KPI corresponde al snapshot del 19 y el script informa diferencias frente al snapshot del 26.
  Consecuencia: la consigna promete una comparación que el propio instrumento no puede producir. El alumno puede interpretar el error como un fallo de su trabajo o tratar de inventar una primera cifra.
  Corrección recomendada: sustituir el párrafo operativo por: «Primero ejecútalo sin política y anota el error que detiene el cálculo. Después declara `unknown_stage_policy: exclude_and_report`, ejecútalo de nuevo y anota qué oportunidades excluye, qué aviso emite y qué KPI del snapshot nuevo difieren del fixture del 19.»
  Verificado: ejecución independiente del reconciliador: sin política, salida `unknown_stage` y código 2 sin KPI; con la política de referencia, código 1 por diferencias esperadas contra el fixture del 19.

- [T013-B03] Severidad: baja
  Ubicación: `content/courses/m02/questions/checks.json:345`, `m02-l2-c2`, feedback de la opción `o2`; `sectionRef` `m02-l2#restricciones`
  Evidencia: el feedback añade que «en modelos recientes un tono tan agresivo puede llevar a aplicar la regla en exceso». El apartado enlazado explica que la mayúscula no debe usarse en todo, y que una buena restricción nombra el alcance, el motivo y la alternativa; no explica esa causalidad sobre aplicar una regla en exceso.
  Consecuencia: el feedback atribuye una afirmación técnica a una lección que no la sustenta. La persona que sigue el enlace no puede comprobar el porqué de esa parte de la explicación.
  Corrección recomendada: sustituir el feedback por: «Las mayúsculas no explican el motivo ni ofrecen una alternativa, así que el agente no sabe qué hacer si necesita limpiar datos. Además, prohíbe toda la carpeta cuando lo que hay que proteger es `data/raw/`.»
  Verificado: `m02-l2#restricciones` respalda precisión, motivo, alternativa y moderar el énfasis; no contiene ni cita la causalidad añadida.

## Resultado de la revisión

El paso 3 del laboratorio explica correctamente que el brief recoge lo preparado en L1–L3 y que los criterios Given/When/Then del paso 4 hacen explícito cuándo está listo. Fuera de los tres hallazgos, no encontré claves evidentes introducidas por la reescritura, referencias rotas ni fallos reproducibles en el examen o la práctica.

## Siguiente acción

Claude puede aplicar los tres cambios editoriales y de instrucción. Después conviene verificar que todos los `stem` de cada familia sean idénticos y volver a ejecutar la suite y el build.

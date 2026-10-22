# Revisión independiente: diagnóstico y contratos de datos

**Fecha:** 2026-10-21

**Alcance:** los 24 ítems, los 46 conceptos erróneos y las dos microtareas de `content/diagnostic/`; contratos y funciones de `src/domain/`; `docs/contracts.md`, `plan.md` §8 y §17.2, D-012 y D-015 a D-017.

## Verificación ejecutada

- `npm test`: 2 archivos, **30/30** pruebas aprobadas.
- `npm run typecheck`: correcto.
- `npm run lint`: correcto.
- Revisión manual de los 24 ítems y ambas microtareas. Las pruebas de tapar las opciones y de responder solo con opciones se aplicaron a los 12 ítems marcados `T/S` en la tabla.

Las comprobaciones automáticas pasan, pero no cubren los hallazgos de juicio ni varios casos de consistencia entre registros que siguen.

## A. Diagnóstico

- [DX-01] Severidad: alta
  Ubicación: `content/diagnostic/items.json`, `content/diagnostic/misconceptions.json`; `src/domain/content.ts:107-113,152-154`
  Evidencia: los 24 ítems y los 46 conceptos erróneos tienen `sourceIds: []`; los esquemas permiten arreglos vacíos. El estándar exige fuente para afirmaciones técnicas y para el catálogo de conceptos erróneos.
  Consecuencia: las claves, distractores y feedback técnico no son trazables ni verificables aunque las pruebas pasen.
  Corrección recomendada: exigir `sourceIds.min(1)` para preguntas y conceptos erróneos, enlazar cada entrada con una fuente existente y probar que un arreglo vacío se rechaza.

- [DX-02] Severidad: alta
  Ubicación: `content/diagnostic/items.json:385-422` (`dx-b3-02`)
  Evidencia: la clave propone un control «como `.gitignore` o una regla de permisos». `.gitignore` no bloquea un archivo ya rastreado ni un `git add -f`; por sí solo no satisface una regla que «no puede fallar nunca».
  Consecuencia: se valida una defensa insuficiente para impedir secretos en el repositorio.
  Corrección recomendada: usar como clave un control que rechace secretos en pre-commit o servidor, con permisos apropiados; presentar `.gitignore` solo como prevención complementaria.

- [DX-03] Severidad: media
  Ubicación: `content/diagnostic/items.json:217-253` (`dx-b2-02`)
  Evidencia: el escenario declara que nadie definió tipo de cambio ni fecha, pero la clave pide ponerlos como supuesto ya validado con FP&A.
  Consecuencia: el alumno puede interpretar que debe inventar el supuesto antes de consultar al dueño de negocio.
  Corrección recomendada: aceptar y preferir que se registre como pregunta abierta o supuesto pendiente de confirmar con FP&A antes del cálculo.

- [DX-04] Severidad: media
  Ubicación: `content/diagnostic/items.json:304-341` (`dx-b2-04`)
  Evidencia: la clave ante una definición de negocio ausente pide que el agente entreviste y deje una spec. El agente puede estructurar preguntas, pero no decidir qué significa «en riesgo».
  Consecuencia: una decisión de negocio se desplaza al agente y la mejor respuesta queda incompleta.
  Corrección recomendada: cambiar la clave para llevar las preguntas al responsable de negocio; el agente puede preparar la especificación una vez resueltas.

- [DX-05] Severidad: media
  Ubicación: `content/diagnostic/items.json:473-509` (`dx-b3-04`)
  Evidencia: el ítem declara proceso taxonómico `create`, pero mide la elección de un documento de continuidad con opción múltiple. El estándar reserva producción para práctica con rúbrica.
  Consecuencia: la metadata afirma medir creación cuando solo mide aplicación o juicio.
  Corrección recomendada: cambiar el proceso a `apply` o `evaluate`, o convertirlo en una tarea breve de redactar la nota de continuidad.

- [DX-06] Severidad: media
  Ubicación: `content/diagnostic/microtasks.json:6-32` (`dx-mt1`)
  Evidencia: el ancla lograda exige `fx_rates.csv`, pero el material solo nombra la tabla de probabilidades de FP&A y no entrega ni nombra ese archivo.
  Consecuencia: una respuesta correcta que deje la fuente de FX pendiente de confirmar puede penalizarse injustamente.
  Corrección recomendada: incluir `fx_rates.csv` en el material o aceptar explícitamente «fuente y fecha de FX pendientes de confirmar con FP&A».

### Tabla de ítems

`T/S` identifica los doce ítems donde se aplicaron ambas pruebas: tapar las opciones y responder viendo solo las opciones. En ellos no se hallaron pistas gramaticales, palabras repetidas, absolutos, convergencia ni diferencia de longitud superior al umbral automatizado.

| ID | ¿Clave correcta? | T/S | Plausibilidad de distractores | Veredicto |
| --- | --- | :---: | --- | --- |
| dx-b1-01 | Correcta y única | Sí | Alta | Pasa |
| dx-b1-02 | Correcta y única | — | Alta | Pasa |
| dx-b1-03 | Correcta y única | Sí | Alta | Pasa |
| dx-b1-04 | Correcta y única | — | Alta | Pasa |
| dx-b2-01 | Correcta y única | Sí | Alta | Pasa |
| dx-b2-02 | Ambigua por supuesto no validado | — | Alta | Corregir DX-03 |
| dx-b2-03 | Correcta y única | Sí | Alta | Pasa |
| dx-b2-04 | Incompleta: falta dueño de negocio | — | Alta | Corregir DX-04 |
| dx-b3-01 | Correcta y única | Sí | Alta | Pasa |
| dx-b3-02 | Clave técnicamente insuficiente | — | Alta | Corregir DX-02 |
| dx-b3-03 | Correcta y única | Sí | Alta | Pasa |
| dx-b3-04 | Clave correcta; proceso mal declarado | — | Alta | Corregir DX-05 |
| dx-b4-01 | Correcta y única | Sí | Alta | Pasa |
| dx-b4-02 | Correcta y única | — | Alta | Pasa |
| dx-b4-03 | Correcta y única | — | Alta | Pasa |
| dx-b4-04 | Correcta y única | Sí | Alta | Pasa |
| dx-b5-01 | Correcta y única | Sí | Alta | Pasa |
| dx-b5-02 | Correcta y única | — | Alta | Pasa |
| dx-b5-03 | Correcta y única | — | Alta | Pasa |
| dx-b5-04 | Correcta y única | Sí | Alta | Pasa |
| dx-b6-01 | Correcta y única | — | Alta | Pasa |
| dx-b6-02 | Correcta y única | Sí | Alta | Pasa |
| dx-b6-03 | Correcta y única | — | Alta | Pasa |
| dx-b6-04 | Correcta y única | Sí | Alta | Pasa |

No se encontraron preguntas de trivia sobre comandos o funciones de producto. Los distractores representan errores intermedios plausibles, pero DX-01 impide justificar su procedencia. El feedback es respetuoso y explica el error y la clave, salvo en los cuatro ítems cuya clave necesita corrección.

### Microtareas

| ID | Rúbrica y anclas | Criterios críticos | ¿Cabe en 10 min? | Veredicto |
| --- | --- | --- | :---: | --- |
| dx-mt1 | Aplicables; inconsistencia de FX | Supuestos y criterio de terminado, correctos | Sí, para una spec breve | Corregir DX-06 |
| dx-mt2 | Aplicable; el diff contiene los dos defectos medidos | Inflación y no aprobar sin evidencia, correctos | Sí | Pasa |

## B. Contratos

- [CTR-01] Severidad: alta
  Ubicación: `src/domain/scoring.ts:105-133`; `src/domain/learner.ts:84-100`
  Evidencia: `scoreAttempt` crea `Map<questionId, Response>` y conserva en silencio el último registro repetido. `Response` no se valida contra la instantánea ni garantiza que sus selecciones aparezcan en las opciones mostradas. Caso reproducible: intento con `q1`, clave `k1`, y respuestas enviadas `[q1→k1, q1→d1]`. Esperado: rechazar el duplicado o usar una revisión explícita. Obtenido: con ese orden da `correct: 0`; al invertirlo da `correct: 1`.
  Consecuencia: un respaldo corrupto o una importación duplicada altera el resultado según el orden; una opción inexistente se cuenta como error en vez de invalidar el dato.
  Corrección recomendada: exigir unicidad `attemptId + questionId + questionVersion`, ligar cada respuesta a su `ItemSnapshot` y validar que selección inicial y revisiones estén en `shownOptionIds`.

- [CTR-02] Severidad: alta
  Ubicación: `src/domain/learner.ts:112-171`
  Evidencia: `reviewState` recorre solo los criterios de la penúltima revisión; no compara conjuntos completos ni independencia. Caso reproducible: A=`[{c1,3}]`, B=`[{c1,3},{c2,1}]`. Esperado: `review-pending`, porque c2 solo se evaluó una vez. Obtenido: `reviewed`. Dos copias de la misma revisión también dan `reviewed`.
  Consecuencia: una práctica puede quedar revisada sin doble evaluación completa e independiente, incumpliendo R-H-8 y el estándar §5.
  Corrección recomendada: exigir IDs únicos por criterio, igualdad exacta de conjuntos contra una rúbrica congelada y un identificador de corrida; declarar `review-pending` ante todo desfase y exigir independencia verificable.

- [CTR-03] Severidad: alta
  Ubicación: `src/domain/scoring.ts:52-69`; `src/domain/content.ts:131-188`
  Evidencia: una familia no está ligada de forma única a un objetivo y la selección filtra variantes solo por `family`. Caso reproducible: `q1={o1,f,a}` y `q2={o2,f,b}`, objetivos `[o1,o2]`, un ítem por objetivo y RNG que escoge `q2` en el ciclo de `o1`. Esperado: rechazar el banco mixto. Obtenido: puede seleccionar `q2` para `o1`, perder cobertura y repetir familia.
  Consecuencia: un banco mal formado pasa los contratos y genera un examen que contradice D-017.
  Corrección recomendada: validar que cada familia pertenezca a un solo objetivo, filtrar por familia y objetivo y comprobar unicidad global de familia en el examen seleccionado.

- [CTR-04] Severidad: media
  Ubicación: `src/domain/scoring.ts:149-172`
  Evidencia: `diagnosticBlockSignal` no valida cuatro ítems del mismo bloque, dos base y dos avanzados. Caso reproducible: evidencia de tres ítems (base correcta, avanzado correcto, avanzado correcto). Esperado: entrada inválida o evidencia incompleta. Obtenido: `likely-strength` por `correct >= 3` y todos los avanzados acertados.
  Consecuencia: una carga parcial o filtrada puede producir una fortaleza no sustentada.
  Corrección recomendada: validar cardinalidad, bloque y distribución; devolver un estado explícito de evidencia incompleta antes de calcular la señal.

- [CTR-05] Severidad: media
  Ubicación: `src/domain/learner.ts:124-171`; `docs/content-standard.md:110-118`; `docs/decisions.md:D-012`
  Evidencia: `PracticeSubmission` admite estado `reviewed`, autoevaluación vacía y cuaderno opcional sin vínculo con `Practice.transferNotebook`; tampoco conserva la rúbrica de referencia. Caso reproducible: dos revisiones concordantes, `selfAssessment: []` y sin `notebook`. Esperado: pendiente o inválido; para M02, cuaderno obligatorio. Obtenido: `reviewState` devuelve `reviewed`.
  Consecuencia: no se garantiza presentada → autoevaluada → revisada ni se puede demostrar D-012 en el HTML de evaluación.
  Corrección recomendada: guardar instantánea o ID y versión de práctica/rúbrica; exigir autoevaluación por todos los criterios antes de revisión y cuaderno cuando la práctica lo requiera.

- [CTR-06] Severidad: media
  Ubicación: `src/domain/learner.ts:56-100,204-217`; `plan.md:845-860`
  Evidencia: una respuesta `submitted` puede no tener `answeredAt`; ni `Response` ni `Attempt` conservan resultado calculado, clave histórica por respuesta o regla de puntuación. Caso reproducible: respuesta enviada sin `answeredAt` pasa el esquema; un intento se persiste sin resultado congelado.
  Consecuencia: el HTML no puede mostrar de forma fiable condición, resultado y regla históricos sin recalcular; el reporte pierde interpretabilidad si cambia una definición.
  Corrección recomendada: exigir fecha para respuesta enviada o abandonada y persistir resultado, clave/regla históricas y motivo de no aprobación, con un estado de verificabilidad.

### Campos que conviene fijar para el HTML de evaluación

1. ID de corrida/revisión, evaluador o modelo, versión de rúbrica y evidencia por criterio.
2. Resultado histórico por respuesta e intento, regla aplicada y motivo de no aprobación.
3. Vínculo de cada respuesta a la instantánea exacta: curso, lección, competencias, opciones y orden.
4. Estado de exportabilidad y verificabilidad: definición histórica disponible, evidencia externa pendiente de inspección y datos excluidos.
5. Estado de evidencia incompleta para diagnóstico, separado de toda señal pedagógica.

## Límite de la revisión

No se editaron `content/` ni `src/`. Los casos reproducibles se deducen de las funciones puras y de sus contratos actuales; deben convertirse en pruebas automatizadas al aplicar las correcciones.

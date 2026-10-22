# Revisión independiente — reglas del examen y revisiones externas (T-017)

Fecha: 2026-10-22  
Alcance: F2-01 y F2-02; `src/storage/exam.ts`, `src/pages/ExamPage.tsx`, `src/storage/learner.ts` y `src/components/LabSubmission.tsx`.

## Hallazgos

- [T017-01] Severidad: alta
  Ubicación: `src/storage/exam.ts:72-91` (`gateFor`); `src/storage/progress.ts` (`markLessonVisited`)
  Evidencia: R-G-3 exige completar las secciones enlazadas **y sus preguntas de práctica** antes del reintento. La puerta únicamente compara `lastVisitedAt` con la hora de envío. La prueba `src/storage/exam.test.ts` desbloquea el repaso llamando solo a `markLessonVisited`; no registra ni consulta `checksCompletedAt` o una ronda de práctica posterior al fallo. En el recorrido visible, el resultado reprobado mostró los seis enlaces de repaso y basta abrir cada lección para que cambie su marca.
  Consecuencia: se puede habilitar el reintento sin realizar recuperación ni contestar preguntas, por lo que no se cumple R-G-3 y el dato «hubo repaso» de §9 no prueba que haya ocurrido el tratamiento pedagógico.
  Corrección recomendada: para cada lección fallada, guardar un hito de repaso posterior al envío que incluya completar sus comprobaciones o una ronda de práctica enlazada; mostrar ese progreso en la lista y exigirlo también en `startExam`.

- [T017-02] Severidad: alta
  Ubicación: `src/domain/scoring.ts:84-94` (`selectExam`); `src/storage/exam.ts:130-136`
  Evidencia: R-G-4 requiere variante no vista para cada *slot* del reintento y prohíbe repetir un ítem idéntico antes de 30 días. Si una familia no fallada ya no tiene variantes no vistas, `selectExam` deja `pool = variants` y elige una ya usada inmediatamente. Solo las familias falladas lanzan un error al agotarse. La comprobación de retención sí falla cuando no queda una variante no vista, lo que muestra la diferencia entre ambos flujos.
  Consecuencia: varios reintentos pueden repetir una variante conocida en slots acertados, elevar el resultado y contradecir tanto R-G-4 como la afirmación de F2-01 de que examen y retención no repiten variantes.
  Corrección recomendada: seleccionar solamente de `unseen` para toda familia del reintento; si no alcanza para armar los 12 slots, impedir el inicio con un mensaje que explique la escasez del banco. Si se adopta la excepción de 30 días, guardar y aplicar explícitamente el límite temporal.

- [T017-03] Severidad: media
  Ubicación: `src/storage/exam.ts:31-35, 88, 171-174`; `src/domain/learner.ts:12`
  Evidencia: el contrato admite timestamps con cualquier offset. La fecha de «mañana» se reconstruye con la zona horaria del dispositivo que consulta (`new Date(iso)` + `setHours`) en vez de congelarse cuando se envía; abrir la app desde otra zona puede mover la medianoche de elegibilidad. Además, el repaso se compara como texto (`lastVisitedAt > submittedAt`), que no ordena cronológicamente offsets diferentes. Por ejemplo, `2026-10-23T00:00:00-05:00` se ordena después de `2026-10-22T23:30:00-06:00`, aunque corresponde a 05:00Z y el segundo a 05:30Z.
  Consecuencia: un viaje, un cambio de zona o un respaldo con offsets puede habilitar tarde, o contar como repaso una apertura anterior al envío.
  Corrección recomendada: calcular y persistir `retryAvailableAt` al enviar con la zona local elegida en ese momento; usar `Date.parse()` para comparar instantes y añadir casos de medianoche, DST y offsets distintos a `exam.test.ts`.

- [T017-04] Severidad: media
  Ubicación: `src/domain/learner.ts:146-158`; `src/storage/learner.ts:62-75`
  Evidencia: la UI de M02 solo ofrece niveles 1–3 y exige una cita, pero el contrato común acepta el nivel 4 y una cita vacía (`z.string().max(2000)`). `addPracticeReview` comprueba que estén los IDs de criterio, no que cada nivel exista en `practice.rubric` ni que la cita contenga texto. Por tanto, una importación válida para Zod o una llamada fuera del formulario puede registrar una revisión de nivel 4 sin evidencia y contribuir al estado «revisada».
  Consecuencia: el respaldo y las funciones de almacenamiento no preservan la regla «sin evidencia citada no hay nivel» ni los máximos reales de la rúbrica, aunque la interfaz actual los oculte.
  Corrección recomendada: al registrar una revisión, validar por criterio que `evidenceQuote.trim()` no sea vacío y que el nivel numérico pertenezca a `criterion.levels`; reflejar la misma restricción en el esquema o en una validación de importación.

- [T017-05] Severidad: media
  Ubicación: `src/domain/learner.ts:197-211` (`reviewState`)
  Evidencia: el estado se decide solo con las dos revisiones válidas más recientes. Tras dos corridas independientes compatibles que ya dejaron una entrega «revisada», añadir una tercera revisión marcada como misma corrida que la segunda toma esa pareja duplicada y devuelve «revisión pendiente», aunque las dos corridas independientes previas siguen conservadas.
  Consecuencia: una revisión adicional no independiente puede revertir un estado ya sustentado por evidencia suficiente y distorsionar el dato de doble evaluación de §9.
  Corrección recomendada: buscar una pareja compatible de corridas distintas entre las revisiones válidas, o conservar explícitamente la pareja que fundamentó el cambio de estado y tratar las revisiones posteriores como información adicional.

- [T017-06] Severidad: baja
  Ubicación: `src/storage/learner.ts:81-90` (`reviewPrompt`)
  Evidencia: la instrucción copiable incluye la rúbrica, el máximo real de M02 (3), la prioridad de citar antes de nivel y no incorpora la autoevaluación; esto respeta R-H-1 y R-H-7. Sin embargo, omite los ejemplos anclados `practice.anchors.achieved` e `practice.anchors.insufficient`, que §5.1 de `docs/content-standard.md` pide entregar al evaluador junto con la rúbrica.
  Consecuencia: cada evaluador externo recibe menos calibración común y aumenta la variación que la doble evaluación intenta detectar.
  Corrección recomendada: añadir ambos anclajes a la instrucción, distinguiéndolos claramente de la entrega a evaluar; mantener fuera la autoevaluación hasta que el revisor haya emitido su nivel.

## Verificado

- Examen reprobado completo en una base local de prueba: envío con 11 preguntas sin responder, resultado 0/12, aviso de una respuesta errónea con confianza «mucha», revisión por pregunta y seis enlaces de repaso. La pantalla explicó el bloqueo y mostró «Disponible desde el 23 oct, 00:00».
- Navegación por teclado: el foco recorrió los enlaces de repaso; radios, selector de confianza, enlaces y botones están expuestos con nombre accesible. La revisión de escritorio no mostró desborde. La inspección de CSS confirma controles de alto táctil mínimo, `overflow-x: auto` para la tabla y reglas para pantallas angostas. No fue posible fijar 360 px en el navegador automatizado disponible: su capacidad de viewport no está expuesta, por lo que la comprobación visual exacta a 360 px queda pendiente de dispositivo o navegador con emulación.
- Retención y fechas: `src/storage/exam.test.ts` cubre una comprobación a los 7 días, seis variantes no vistas y aprobación 5/6; también cubre que un examen en curso se recupera como el mismo intento. El análisis de bordes de zona y medianoche produce T017-03.
- Revisiones: se registró una primera revisión y una segunda marcada «La hice en la misma conversación que la revisión anterior». La tabla mostró ambas y el estado quedó «Revisión pendiente» con el aviso de que no son independientes.
- Datos para §9: se guardan resultado, variante y regla de los intentos; la retención queda distinguida como `kind: retention`. El indicador de que el reintento incluyó un repaso solo es defendible después de corregir T017-01. La pareja de revisiones y sus niveles está disponible, con la salvedad de T017-05.
- `npm test`: 9 archivos, 123 pruebas aprobadas.
- `npm run build`: terminó correctamente. Queda la advertencia existente de un bundle JavaScript de 913.68 kB (262.87 kB gzip).

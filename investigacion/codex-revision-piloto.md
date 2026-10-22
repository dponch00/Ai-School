# Revisión completa del piloto M02 — T-015

**Fecha:** 2026-10-22  
**Alcance:** F1-01 a F1-12, con énfasis en la ruta personal F1-11. Se usaron únicamente datos sintéticos.

## Método y recorrido §17.10

Se guardó un perfil sintético, se respondieron comprobaciones con explicación y ayuda declarada, se presentó el laboratorio, se exportó un primer reporte, se registró feedback de `Evaluador sintético` con un bloque JSON válido, se aceptó la propuesta «Repasar el objetivo verificable.», se resolvió otro ejercicio y se exportó un segundo reporte.

El segundo HTML descargado (`rep-c0decdb1f438`) contiene 2 intentos enviados, 6 respuestas, la entrega de laboratorio y **Retroalimentación previa** con el feedback y el ajuste aceptado. La vista previa generada a continuación (`rep-1902f0b988ae`) muestra **Evolución** con los dos reportes descargados. El texto hostil de perfil, laboratorio y campos libres (`<img …>`, comillas, `</pre>`, `</textarea>` y Unicode) se mostró de forma literal: no ejecutó HTML. El reporte declara que no tiene scripts ni recursos externos.

En las 15 rutas pedidas (inicio, cursos, portada M02, L1–L6, laboratorio, práctica, examen, perfil, evaluación y ruta), a 360 px no hubo desbordamiento horizontal (`scrollWidth = clientWidth = 345`). El foco de teclado fue visible en todas las rutas comprobadas, con `outline` sólido de 3 px. Los formularios y controles centrales tienen nombre accesible en el árbol de accesibilidad. El navegador integrado no aplicó su atajo de zoom, por lo que la comprobación de texto al 200 % queda limitada a la inspección de estilos relativos; necesita una pasada manual en un navegador que permita zoom real.

## Hallazgos

- [T015-R01] Severidad: alta
  Ubicación: `src/pages/RoutePage.tsx:72-81`, `src/storage/route.ts:26-55`
  Evidencia: tras analizar un bloque estructurado, `feedbackDiscrepancies` muestra referencias de reporte, objetivos o competencias desconocidos, pero el botón **Registrar** sigue disponible. `registerFeedback` recibe el bloque y crea propuestas sin volver a comprobar que `source_report_id` y `target_ids` existan o coincidan con el reporte elegido.
  Consecuencia: una recomendación inconsistente puede quedar registrada como estructurada y generar una propuesta vinculada a un objetivo inexistente o a un reporte diferente. El aviso no protege la integridad de la ruta.
  Corrección recomendada: impedir registrar las recomendaciones estructuradas mientras haya discrepancias; permitir, si se desea, conservar solo el texto libre con una confirmación explícita. Revalidar reporte, objetivos y competencias dentro de `registerFeedback` antes de escribir.
  Verificado: `src/storage/route.test.ts:47-53` solo prueba que se muestre el aviso; el recorrido del almacenamiento no tiene una prueba de rechazo.

- [T015-R02] Severidad: media
  Ubicación: `src/storage/route.ts:11-32`
  Evidencia: la llave de idempotencia es SHA-256 del texto normalizado solamente. No incorpora `sourceReportId` ni la identidad declarada del evaluador.
  Consecuencia: al pegar el mismo feedback legítimo para dos reportes o de dos evaluadores, la segunda relación se descarta como duplicada y se pierde su trazabilidad.
  Corrección recomendada: calcular la huella con reporte, tipo y nombre normalizado del evaluador más el texto, o usar una restricción explícita por reporte y feedback.
  Verificado: la prueba de idempotencia en `src/storage/route.test.ts:72-76` cubre el mismo reporte, no dos reportes distintos.

- [T015-R03] Severidad: media
  Ubicación: `src/storage/progress.ts:76-77`, `src/report/build.ts:188-192`, plan §17.10.2–4
  Evidencia: una comprobación permanece `in-progress` hasta responder toda la ronda (`items.length >= round.size`); el primer reporte del recorrido, tras las tres preguntas indicadas por el plan, excluyó el intento y mostró «1 intento(s) en curso, sin enviar». El constructor del reporte incluye únicamente intentos `submitted`.
  Consecuencia: el primer recorrido especificado («tres preguntas piloto y una práctica breve») no produce necesariamente evidencia de esas respuestas en el HTML. La persona puede creer que el reporte incluye lo que acaba de resolver cuando el propio reporte lo excluye.
  Corrección recomendada: permitir incluir respuestas parciales, rotuladas como en curso, o ajustar el recorrido y la interfaz para indicar cuántas preguntas faltan antes de poder generar evidencia evaluable.
  Verificado: al completar posteriormente rondas enteras, el segundo reporte sí incluyó 2 intentos y 6 respuestas; la exclusión no se comunica antes de exportar.

- [T015-R04] Severidad: media
  Ubicación: `src/styles/app.css:43-45, 50, 149-151`, inicio y migas de pan de M02/L1–L6/laboratorio/práctica/examen
  Evidencia: a 360 px, la marca mide 95 × 32 px y las migas de pan de navegación miden entre 28 × 20 px y 45 × 20 px. La hoja aplica el mínimo táctil a la navegación principal, botones y opciones, pero no a `.brand`, `.breadcrumb` ni a citas.
  Consecuencia: esos enlaces quedan por debajo del objetivo de 44 px del ticket; las migas además quedan por debajo del mínimo de 24 px de WCAG 2.2 AA si no se consideran una excepción de enlace en línea.
  Corrección recomendada: dar a marca y enlaces de migas un contenedor clicable de al menos 44 × 44 px (o documentar y justificar una excepción para citas que se mantienen dentro de texto corrido).
  Verificado: las etiquetas de respuesta y los campos de formulario sí tienen una superficie de 44 px; las entradas radio internas son de 18 px, pero están cubiertas por su etiqueta de 44 px.

## Criterios de aceptación de plan §17.9

| Criterio | Estado | Evidencia |
| --- | --- | --- |
| Conserva respuesta original, revisión, razonamiento y resultado | Cumplido | El segundo HTML conserva pregunta congelada, opciones, primera/final, revisiones, explicación, ayuda y resultado. `src/storage/progress.ts` guarda la instantánea. |
| HTML suficiente sin consultar la app | Cumplido | `rep-c0decdb1f438` incluyó perfil seleccionado, 6 respuestas detalladas, laboratorio, condiciones, JSON pasivo e instrucción. |
| Legible sin scripts y no ejecuta contenido del alumno | Cumplido | El iframe mostró el texto hostil literalmente; el encabezado del HTML declara que no tiene scripts ni recursos externos. |
| Detalle reconciliable con resumen y claves históricas | Cumplido | El reporte contiene 2 intentos/6 respuestas, C02 3/6 y C12 0/1; cada detalle conserva opciones y marca de clave. |
| Reporte por periodo muestra exclusiones y no altera expediente | Cumplido | Vista previa y HTML listan intentos en curso excluidos; `src/report/build.test.ts:152-159` cubre exclusión en HTML, Markdown y JSON. |
| Respaldo completo restaura perfil, respuestas y feedback | Cumplido | `src/storage/backup.ts:12-37, 87-106` exporta y restaura perfiles, respuestas, feedback, ajustes y reportes en una transacción. |
| Pegar evaluación, crear propuesta y aplicarla a ruta | Parcial | El recorrido registró un JSON válido y aceptó una propuesta; R01 deja pasar una propuesta con referencias discrepantes. |
| Registrar feedback no sobrescribe respuestas ni puntuaciones | Cumplido | Recorrido: al registrar se mostró «Tus respuestas y calificaciones no cambian» y el segundo reporte conservó las 6 respuestas. La prueba de ruta cubre que no cambia respuestas. |
| Tema manual no modifica currículo oficial | Cumplido | `addAdjustment` escribe solo en `adjustments`; la interfaz afirma que no cambia los manuales oficiales. |
| Actualización conserva reportes, feedback y ajustes | Cumplido | El esquema v1 ya contiene feedback/ajustes y v2 solo añade reportes (`src/storage/db.ts:51-64`); el respaldo versionado también los conserva. |
| Feedback de chat se presenta como externo y sin memoria/conexión automática | Cumplido | Evaluación dice que la app no envía nada; ruta dice «evaluación externa… no una calificación oficial» y el reporte indica que el evaluador no recuerda reportes anteriores. |

## Comprobaciones sin hallazgo

- Las propuestas no alteraron respuestas ni calificaciones antes de la acción explícita; el ajuste quedó en estado `accepted` y conserva su historial.
- La vista previa del reporte se aisló en un iframe `srcdoc`; el contenido libre llegó como texto, sin ejecutar etiquetas ni eventos.
- Las 15 rutas funcionaron a 360 px sin desbordamiento horizontal y el foco visible de teclado fue consistente. La navegación principal, botones, controles de formulario y opciones de pregunta alcanzan 44 px.


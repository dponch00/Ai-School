# Revisión independiente — diagnóstico inicial y almacenamiento (T-019)

- **Revisor:** Codex
- **Fecha:** 2026-10-22
- **Alcance:** `#/diagnostico`, `src/storage/diagnostic.ts`, `src/pages/DiagnosticPage.tsx`, el alcance de diagnóstico de `src/report/build.ts`, `src/storage/health.ts`, `src/app/StorageNotice.tsx` y el estado de almacenamiento del perfil.

## Método y verificaciones

- Revisé D-015 (`docs/decisions.md`) y las reglas de diagnóstico de `investigacion/pedagogia-evaluacion.md` §4.4–4.6. La pantalla principal y el HTML sí presentan conteos de cuatro ítems por bloque, separan base y avanzadas, declaran que son señales y no niveles, y no bloquean lectura.
- Hice un recorrido sintético completo en el navegador: 24 respuestas, resultado de seis bloques, guardado de una microtarea sin autoevaluarla y reporte con el alcance «Evaluación inicial (diagnóstico)». Probé a 360 px, escritorio y con teclado. No encontré desborde horizontal ni un control que no pudiera alcanzarse con Tab.
- Verifiqué el almacenamiento disponible en el perfil: muestra uso, estado de persistencia y el botón para pedir protección. `src/storage/health.test.ts` cubre el caso en que IndexedDB no abre y el aviso global usa `role="alert"`. La automatización disponible no puede abrir una ventana privada con IndexedDB bloqueado, por lo que ese recorrido concreto queda pendiente de una prueba manual.

## Hallazgos

- [T019-01] Severidad: alta
  Ubicación: `src/report/build.ts:34-57`, `src/report/build.ts:602-604`, `src/report/build.ts:623`
  Evidencia: al seleccionar «Evaluación inicial (diagnóstico)», la instrucción que acompaña al reporte pide «Evalúa mis competencias por separado» e «Indica qué evidencia falta antes de concluir que domino una competencia». El Markdown, que incluye esa instrucción, siempre abre un «Resumen por competencia» y, para este alcance, escribe «Sin respuestas en el alcance» aunque sí incluye 24 respuestas y seis bloques. El HTML es más prudente, pero no corrige el Markdown ni la instrucción que recibirá el evaluador.
  Consecuencia: un evaluador externo recibe una solicitud explícita de inferir dominio y competencias a partir de un instrumento que D-015 y §4.5 limitan a señales de cuatro ítems por bloque. Además, el Markdown describe erróneamente la cobertura del reporte.
  Corrección recomendada: generar una instrucción y un resumen específicos cuando el alcance sea diagnóstico. Deben pedir que se describan solo señales por bloque, su muestra de cuatro ítems y su incertidumbre, sin inferir ni certificar competencias. Sustituir el encabezado por «Diagnóstico por bloque», listar los conteos correspondientes y conservar una nota visible de que no son niveles ni resultados por competencia.

- [T019-02] Severidad: media
  Ubicación: `src/pages/DiagnosticPage.tsx:15`
  Evidencia: con cuatro de cuatro respuestas correctas, cada tarjeta dice: «usa la comprobación rápida al inicio de cada lección y salta lo que ya dominas». El propio diagnóstico declara que son cuatro ítems por bloque y §4.5 indica que una «fortaleza probable» falla con relativa frecuencia y que nunca debe ocultar contenido.
  Consecuencia: «lo que ya dominas» y «salta» presentan una conclusión de dominio y pueden hacer que el alumno omita material a partir de una muestra deliberadamente insuficiente.
  Corrección recomendada: cambiar por una ruta corta reversible, por ejemplo: «Empieza con la comprobación rápida; si te cuesta, sigue la lección completa. Puedes consultar el ejemplo cuando lo necesites». Así se preservan problema primero y ejemplo como consulta sin afirmar dominio ni retirar contenido.

- [T019-03] Severidad: media
  Ubicación: `src/pages/DiagnosticPage.tsx:192-199`
  Evidencia: el botón permite guardar una microtarea con las dos respuestas escritas y ninguna autoevaluación. Inmediatamente después de guardarla, la interfaz ofrece «Ver ejemplos de respuesta lograda e insuficiente» mientras los cuatro criterios siguen en «Sin elegir». El recorrido sintético lo confirmó a 360 px.
  Consecuencia: el alumno puede leer los anclajes antes de realizar la autoevaluación que pretende comparar su propia evidencia con la rúbrica. Esto invierte el orden «primero la autoevaluación por criterio; después la evaluación externa» de §4.4 y contamina esa observación complementaria.
  Corrección recomendada: mantener los ejemplos ocultos hasta que se guarde una autoevaluación completa con evidencia para cada criterio, o presentar una acción explícita para terminar la autoevaluación antes de abrirlos. Conservar el rótulo «autoevaluación» en la señal, que sí distingue correctamente su naturaleza.

- [T019-04] Severidad: media
  Ubicación: `src/pages/EvaluationPage.tsx:166`, `src/report/build.ts:453-454`, `src/report/build.ts:618-620`
  Evidencia: para un reporte cuyo único alcance fue diagnóstico, la vista previa y el HTML resumen una microtarea como «1 entregas de laboratorio» y la sección Markdown se titula «Laboratorios». En el recorrido se guardó «Mejorar una instrucción», que corresponde al diagnóstico, sin entregar un laboratorio de curso.
  Consecuencia: se atribuye al alumno una evidencia de laboratorio que no realizó y se pierde el contexto de que era una microtarea diagnóstica y autoevaluada. El evaluador puede sobreinterpretar esa evidencia de producción.
  Corrección recomendada: etiquetar estas entradas como «microtarea del diagnóstico» en vista previa, HTML y Markdown; incluir su estado de autoevaluación y mantenerlas separadas de laboratorios de curso.

## Aspectos conformes

- `blockResults` conserva la regla de los seis bloques de cuatro ítems. Los conteos, los errores de alta confianza y la señal de cada bloque se calculan sin porcentaje ni nivel global.
- `microtaskCriticalOk` solo puede rebajar una fortaleza probable cuando falta un criterio crítico; no convierte por sí sola una microtarea en fortaleza. La interfaz también rotula el insumo como autoevaluación.
- `checkStorage` prueba una apertura y una lectura de IndexedDB antes de declarar disponible el almacenamiento. Ante fallo, el aviso global explica que se puede leer pero no se guardan respuestas, entregas ni reportes; el perfil informa uso y persistencia sin prometer que el navegador conceda protección.

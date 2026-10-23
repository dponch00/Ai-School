# Revisión independiente de «Cómo funciona» y la versión de prueba

**Fecha:** 2026-10-22  
**Alcance:** `#/como-funciona` y `scripts/build-single.py`. No se modificaron `src/`, `content/`, `e2e/`, `scripts/` ni `ESTADO.md`.

## Hallazgos

- [T022-01] Severidad: alta
  Ubicación: `src/pages/HowItWorksPage.tsx:58-60`, paso «Pide la evaluación y regístrala», etiqueta «cuenta».
  Evidencia: la guía presenta Evaluación y Mi ruta como un paso que «cuenta» para aprobar. Sin embargo, `plan.md:331-332` define «Curso completado» como lectura, examen aprobado y práctica al menos autoevaluada; la revisión externa identificada es un requisito adicional de «dominio revisado». `RoutePage.tsx` solo registra retroalimentación y propuestas, y `reviewState` no se consulta para aprobar el examen ni para completar el curso.
  Consecuencia: un alumno nuevo puede creer que debe enviar su reporte a un chat externo para aprobar, cuando la página pretende justamente aclarar qué cuenta y qué es práctica.
  Corrección recomendada: cambiar la etiqueta por «profundiza» o «opcional» y decir que la evaluación externa sirve para revisar la entrega y orientar Mi ruta; separar explícitamente «Para completar el curso: lecciones, laboratorio autoevaluado y examen aprobado» de «Para tener dominio revisado: revisión externa identificada».

- [T022-02] Severidad: media
  Ubicación: `src/pages/HowItWorksPage.tsx:40`, descripción de «Repasa tus errores».
  Evidencia: el texto dice que la misma pregunta vuelve «al día siguiente y a la semana». `src/domain/review-queue.ts:62-76` programa el primer repaso al día siguiente; si se acierta, programa el siguiente siete días después. Si se falla en ese primer repaso, reinicia el plazo de un día. El segundo repaso no llega necesariamente una semana después del error original.
  Consecuencia: la explicación simplifica una regla que se usa para que el alumno entienda cuándo reaparecerá una pregunta; quien falle el primer repaso verá una repetición antes de lo anunciado.
  Corrección recomendada: redactar «vuelve al día siguiente; cuando la aciertas, vuelve siete días después. Dos aciertos seguidos la sacan del repaso; otro error la programa otra vez para el día siguiente».

- [T022-03] Severidad: alta
  Ubicación: `scripts/build-single.py:60-76` (`download_shim`) y `src/pages/EvaluationPage.tsx:65-86`.
  Evidencia: el puente intercepta todo enlace descargable cuyo `Blob` haya creado la página, no solo el reporte HTML y el respaldo JSON. Si `window.claude.use('downloads')` rechaza, no tiene `catch`, por lo que no hay descarga alternativa ni mensaje. Si el usuario rechaza `d.save`, se suprime el error `declined`; como `HTMLAnchorElement.click()` no espera la promesa, `EvaluationPage.download()` continúa inmediatamente, guarda el resumen y anuncia «Descargado …» aunque no se haya guardado ningún archivo. Fuera del visor, si no existe `window.claude.use`, el clic nativo sí se conserva.
  Consecuencia: en el caso que motivó el cambio, una persona puede rechazar la confirmación o no tener la capacidad y recibir una confirmación falsa; además, el gancho puede alterar futuras descargas basadas en `Blob` que no forman parte de los dos flujos previstos.
  Corrección recomendada: limitar la interceptación a los nombres MIME o marcas explícitas de reporte y respaldo. Hacer que el puente comunique éxito, rechazo y falta de capacidad al código de la app (por ejemplo, mediante una función o evento que `download()` pueda esperar) y mostrar «No se descargó: confirmación rechazada» sin guardar el reporte como descargado. Capturar también el rechazo de `claude.use` y conservar el clic nativo solo fuera del visor.

## Verificaciones sin hallazgo

### Exactitud de la ruta y nombres

- **Perfil:** es opcional; sus datos declarados se incluyen solo según el alcance escogido al generar el reporte. La guía acierta al tratar la autoevaluación como percepción separada de la evidencia observada.
- **Diagnóstico:** la aplicación da señales por bloque y no aprueba ni reprueba; cuatro ítems por bloque respaldan la advertencia de que es una pista.
- **Lecciones, práctica y laboratorio:** los nombres citados coinciden con la interfaz: «Práctica y examen», «Laboratorio», «Autoevaluación con la rúbrica» y «Revisiones externas». La práctica no afecta la regla de aprobado.
- **Examen:** `ITEMS_PER_OBJECTIVE = 2`, seis objetivos de M02 y `DEFAULT_PASS_RULE` de 10/12 sin fallar íntegramente un objetivo coinciden con el texto. Se puede retomar; tras reprobar, el reintento exige volver a responder las comprobaciones de las lecciones falladas y esperar al siguiente día local. Las variantes vistas se evitan durante 30 días.
- **Retención:** llega tras aprobar, usa seis preguntas y exige 5; no bloquea otros pasos. La página no promete que sea requisito de aprobado.
- **Evaluación y Mi ruta:** los botones mencionados existen: «Descargar HTML para el chat», «Copiar contexto en Markdown», «Copiar instrucción», «Registrar revisión», «Aceptar», «Posponer» y «Descartar». Una revisión de laboratorio requiere una cita por criterio; dos corridas independientes y sin una diferencia superior a un nivel dan el estado «Revisada».

### Claridad, estilo e interfaz

La página da a un alumno nuevo el orden básico, explica antes de enviar datos qué hace la evaluación externa y nombra las pantallas donde se continúa. Su prosa usa pasos para un proceso secuencial, términos conocidos y párrafos breves; no encontré un incumplimiento adicional de `docs/guia-de-estilo.md`.

En navegador real ejecuté `npm run e2e`: **48/48** pruebas aprobadas. La ruta pasó axe WCAG 2.2 A/AA y no tuvo desplazamiento horizontal a 360 × 780 ni a 1280 × 800. Una comprobación adicional con Playwright mostró tarjetas de pasos de 328 px dentro del ancho disponible a 360 px, foco visible y tabulación desde el contenido por Diagnóstico, Evaluación, Mi ruta, Perfil y enlaces del pie. La numeración circular y las etiquetas visuales «práctica»/«cuenta» son legibles y coherentes con D1; la corrección de T022-01 debe ajustar solo el significado de la última etiqueta.

### Datos y capacidad de descargas

El script incrusta CSS, JS, fuentes, imágenes, diagramas y paquetes de curso de la compilación. La revisión estática de `scripts/build-single.py`, `src/`, `public/`, `index.html` y `vite.config.ts` no encontró claves, tokens, encabezados de autorización, contraseñas ni secretos incrustados. Los datos de curso son los sintéticos de Altiplano. La descarga nativa funciona cuando `window.claude.use` no existe; el rechazo del usuario no inicia una descarga nativa, que es la decisión segura, pero necesita el aviso de resultado indicado en T022-03.

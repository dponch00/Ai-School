# Revisión independiente del expediente — T-014

**Fecha:** 2026-10-22

**Alcance:** perfil, entrega del laboratorio M02, reporte de evaluación y respaldo.
**Método:** inspección de contratos y generador, recorrido local con datos sintéticos hostiles y revisión de accesibilidad y responsividad. No se modificó `src/` ni `content/`.

## Hallazgos

- [T014-S01] Severidad: alta
  Ubicación: `src/report/build.ts`, selección de laboratorios (aprox. líneas 239–242).
  Evidencia: los intentos usan `inPeriod(...)`, pero las entregas solo se filtran por curso y por fecha de corte. Una entrega creada antes de «Desde» permanece en `practiceSubmissions`, el HTML y el JSON, sin constar entre las exclusiones.
  Consecuencia: un reporte limitado por periodo puede divulgar una entrega que la persona esperaba dejar fuera; contradice el alcance mostrado y hace que el resumen no concilie con el detalle temporal.
  Pasos para reproducir: 1. Guarda una entrega de M02 con fecha anterior a 2026-10-22. 2. En `#/evaluacion`, elige M02 y «Desde: 2026-10-22», con Laboratorios marcado. 3. Abre la vista previa o los datos estructurados: la entrega anterior sigue incluida.
  Corrección recomendada: aplicar `inPeriod(s.createdAt, scope.from, scope.to)` al filtrar `submissions`, añadir al listado de exclusiones las entregas fuera del periodo y cubrir HTML, Markdown y JSON con una prueba.
  Verificado: inspección estática y contraste con la prueba existente de periodo, que solo cubre intentos.

- [T014-S02] Severidad: alta
  Ubicación: `src/report/build.ts`, `renderMarkdown()` (aprox. líneas 515–549).
  Evidencia: alias, objetivos, opciones, escenarios y otros valores libres se interpolan directamente en Markdown; solo las explicaciones, la entrega y las preguntas se rodean de un bloque. Un valor con `#`, listas, etiquetas HTML, comillas, `</pre>`, `</textarea>` o Unicode puede cambiar la estructura al pegarse en un renderizador Markdown, e incluso habilitar HTML si el destino lo permite.
  Consecuencia: el contexto copiado no conserva fielmente el significado del expediente y puede presentar contenido activo o con jerarquía manipulada en el servicio donde se pegue.
  Pasos para reproducir: 1. En `#/perfil`, guarda como alias u objetivo `# Título\n<img src=x onerror=alert(1)> \"'</pre></textarea> 𝒰ñïçødé`. 2. Incluye ese campo en `#/evaluacion`. 3. Pulsa «Copiar contexto en Markdown» y pégalo en un renderizador Markdown que acepte HTML: el contenido deja de ser texto plano y reestructura el documento.
  Corrección recomendada: representar cada campo controlado por el alumno como bloque de código con una cerca calculada que no aparezca en el valor, o escapar Markdown y HTML de todos los interpolados; añadir pruebas de renderizado para cada tipo de campo libre.
  Verificado: inspección de `renderMarkdown()` y recorrido con el texto hostil descrito; el HTML generado sí escapa ese contenido.

- [T014-S03] Severidad: media
  Ubicación: `src/report/build.ts`, construcción de `previousReports`, `feedback` y `adjustments` (aprox. líneas 292–313).
  Evidencia: esos tres conjuntos se añaden completos a los datos estructurados y a las secciones de evolución y retroalimentación sin aplicar el curso ni el periodo seleccionado. En particular, `adjustments` conserva su texto de cambio y motivo.
  Consecuencia: al compartir «Un curso», se pueden revelar metadatos, decisiones personales o historial de otro curso; el selector de alcance da una expectativa de privacidad que el reporte no cumple.
  Pasos para reproducir: 1. Guarda una retroalimentación, ajuste o reporte previo referido a otro curso. 2. Genera en `#/evaluacion` un reporte de M02. 3. Revisa las secciones 7 y 8, y el JSON de la sección 11: aparecen registros no filtrados por M02.
  Corrección recomendada: filtrar los registros por el alcance y periodo cuando tengan trazabilidad suficiente; para los que no la tengan, ofrecer una casilla separada, desmarcada inicialmente, y declarar con precisión su inclusión.
  Verificado: inspección estática de los datos que recibe el generador.

- [T014-S04] Severidad: media
  Ubicación: `src/components/BackupPanel.tsx`, función `pick` (aprox. líneas 30–38).
  Evidencia: el límite de 20 MB de `parseBackup()` se evalúa después de `await file.text()`. Por ello, un archivo JSON muy grande ya se copió íntegramente a memoria antes de que la app lo rechace.
  Consecuencia: un respaldo hostil o seleccionado por error puede bloquear la interfaz o elevar innecesariamente el uso de memoria, pese a que la interfaz promete un límite.
  Pasos para reproducir: 1. Crea un archivo `.json` de más de 20 MB. 2. En `#/perfil`, apartado Respaldo, selecciónalo en «Restaurar desde un archivo». 3. La app lo lee primero y solo después muestra el rechazo por tamaño.
  Corrección recomendada: importar `MAX_BACKUP_BYTES` y rechazar `file.size` antes de llamar a `file.text()`; conservar `parseBackup()` como segunda defensa y probar ambos caminos.
  Verificado: inspección estática; las pruebas actuales cubren el mensaje de rechazo, pero no el orden de lectura del selector.

- [T014-U01] Severidad: media
  Ubicación: cabecera global, reglas `.site-header__inner` y `.site-header nav` en `src/styles/app.css` (aprox. líneas 42–45).
  Evidencia: a 360 × 780 px, la navegación principal tiene 455 px de ancho y provoca desplazamiento horizontal en `#/perfil`, `#/cursos/m02/laboratorio` y `#/evaluacion`. Ocurre antes de llegar a los formularios, también sin usar contenido personal.
  Consecuencia: una parte de la navegación queda fuera del ancho visible y el usuario debe desplazarse lateralmente para llegar a «Evaluación», lo que incumple el recorrido móvil solicitado.
  Pasos para reproducir: 1. Abre cualquiera de las tres rutas a 360 px de ancho. 2. Comprueba `document.documentElement.scrollWidth` (455) frente a `clientWidth` (345). 3. Desplázate horizontalmente: el enlace «Evaluación» queda a la derecha.
  Corrección recomendada: en el punto móvil permitir `flex-wrap` en la cabecera, o apilar/convertir la navegación en un control desplegable, manteniendo objetivos táctiles de 44 px; añadir una prueba visual o de `scrollWidth <= clientWidth` a 360 px.
  Verificado: recorrido manual a 360 × 780 px; a 1280 × 800 px no hubo desbordamiento horizontal.

## Comprobaciones sin hallazgo

- En una ejecución local se escribieron etiquetas, comillas, `</pre>`, `</textarea>` y Unicode en todos los campos libres del perfil, la entrega, el cuaderno, la evidencia, la autoevaluación y las preguntas al evaluador. El HTML de la vista previa los mostró como texto; no se creó ninguna etiqueta activa.
- Al desmarcar los campos del perfil y Laboratorios, la vista previa, el HTML y el JSON no incluyeron el contenido de esos campos ni el valor de la evidencia marcada «no incluir»; la exclusión quedó explicada en el reporte. El ID local del perfil sigue apareciendo porque §17.4 lo exige.
- El HTML autocontenido contiene CSP `default-src 'none'; style-src 'unsafe-inline'`, no añade scripts ni recursos externos, y el `iframe` de vista previa usa `sandbox=""`, sin permisos de origen, scripts ni formularios.
- La exportación de respaldo se completó desde `#/perfil`. Al seleccionar en la interfaz un archivo `.json` sintético inválido, esta mostró «El archivo no es un JSON válido» sin ofrecer restauración. La prueba de respaldo cubre además la restauración de ida y vuelta y el reemplazo sin mezcla; el caso de archivo mayor que el límite origina T014-S04.

## Verificación ejecutada

- Recorrido local de `#/perfil`, `#/cursos/m02/laboratorio` y `#/evaluacion`, incluida vista previa aislada, exclusiones, teclado y exportación de respaldo, a 360 × 780 px y 1280 × 800 px.
- `npm test`: 8 archivos y 94 pruebas correctas.
- `npm run build`: correcto. Vite emitió solo su aviso informativo de un bundle JavaScript superior a 500 kB.

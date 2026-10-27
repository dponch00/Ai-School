# T-052 — Revisión independiente de la candidata de entrega

**Codex · 2026-10-27**

## Alcance y método

Contrasté `docs/entrega-v1.md` y `README.md` con el contenido, los scripts,
el flujo de publicación y la compilación actual del repositorio. Seguí la
secuencia para quien llega nuevo con Node `v24.17.0`: `npm ci`, `npm test`,
`npm run build` y `npm run e2e`.

Resultados de ejecución: la prueba de contenido informó 10 cursos, 60
lecciones, 1 022 preguntas y 68 fichas; `npm test` pasó **247/247**; la
compilación terminó correctamente; y los E2E pasaron **158/158**. La
compilación generó una precarga del service worker de 42 entradas y
4 098,86 KiB. Reconté además 68 fichas, 683 conceptos erróneos, 355 fuentes y
24 ítems de diagnóstico; las 998 preguntas de los cursos más las 24 del
diagnóstico dan las 1 022 declaradas.

Python no se pudo iniciar en esta sesión porque el alias de Windows apunta a
`WindowsApps\\python.exe` sin acceso. Revisé ambos scripts estáticamente y
reproduje sus conteos con PowerShell: el patrón de referencias devuelve 110
coincidencias y las seis fuentes más las dos fichas del 1 de diciembre quedan
fuera de la ventana predeterminada de 30 días al 2026-10-27.

## Hallazgos

- [T052-E01] Severidad: media
  Ubicación: `docs/entrega-v1.md`, «Lo que caduca y tiene fecha»
  Evidencia: `fichas-por-revisar.py` usa 30 días por defecto. El 2026-10-27 su
  límite es 2026-11-26 y no devuelve ningún elemento; las dos fichas y las seis
  fuentes indicadas vencen el 2026-12-01. El script sí las incluiría con
  `python scripts/fichas-por-revisar.py 35`.
  Consecuencia: la candidata afirma que el script lista hoy una revisión que su
  invocación documentada por defecto aún no muestra, con riesgo de que se pierda
  la señal de mantenimiento de diciembre.
  Corrección recomendada: cambiar la frase por «entrarán en la ventana de 30
  días el 2026-11-01» o documentar explícitamente la invocación con 35 días para
  esa comprobación puntual.

- [T052-E02] Severidad: media
  Ubicación: `docs/entrega-v1.md`, «D-029» en «Límites conocidos»
  Evidencia: el `npm run build` actual informó «precache 42 entries
  (4098.86 KiB)»; `dist/` contiene 49 archivos que suman 4 726 542 bytes. La
  afirmación «unos 3,6 MB» ya no describe la carga cacheada que produce la
  candidata actual.
  Consecuencia: Daniel puede decidir sobre instalación y datos móviles con una
  expectativa inferior a la carga real, y el límite conocido queda fechado de
  manera engañosa.
  Corrección recomendada: fechar y actualizar la cifra a aproximadamente 4,1
  MiB precacheados (o explicar exactamente qué subconjunto mide 3,6 MB), sin
  dejar de aclarar que las imágenes de 1 600 px están excluidas.

- [T052-R01] Severidad: media
  Ubicación: `README.md`, «Para correrla y probarla»
  Evidencia: `package.json` no tiene `postinstall` ni otro paso que descargue
  navegadores; `npm run e2e` ejecuta directamente `playwright test`. Los 158
  E2E pasaron aquí porque ya había un navegador de Playwright instalado, pero
  una clonación nueva tras solo `npm ci` no tiene por qué disponer de él.
  Consecuencia: una persona que siga literalmente el README puede encontrar un
  fallo de navegador ausente y no poder reproducir la verificación E2E.
  Corrección recomendada: antes de `npm run e2e`, añadir el prerrequisito de una
  vez `npx playwright install` (y, cuando corresponda al sistema, indicar
  `npx playwright install --with-deps`).

- [T052-R02] Severidad: baja
  Ubicación: `README.md`, comentario de `npm run dev`
  Evidencia: el script es `vite`, sin la opción `--open`; inicia el servidor,
  pero Vite no abre por sí solo el navegador.
  Consecuencia: el primer paso de uso local promete una acción que no ocurre y
  puede dejar a quien llega nuevo sin saber que debe visitar la URL mostrada.
  Corrección recomendada: sustituir «abre la app» por «inicia la app; abre la
  URL que muestra la terminal (normalmente http://localhost:5173)» o incorporar
  `--open` al script si esa es la conducta deseada.

## Verificaciones sin hallazgo

Verificado: los conteos de la tabla de contenido de `docs/entrega-v1.md` son
reproducibles; los 1 022 ítems se componen de 998 preguntas de curso y 24 de
diagnóstico. La evidencia de 247 pruebas, 158 E2E y 110 referencias cruzadas
coincide con las ejecuciones y el recuento independiente.

Verificado: `.github/workflows/deploy.yml` se activa con cada push a `main`,
usa Node 24, ejecuta contenido, pruebas y compilación con `AIS_BASE=/Ai-School/`
antes de publicar. La explicación de volver atrás mediante `git revert` y de
cambiar el prefijo de hosting con `AIS_BASE` coincide con el flujo y
`vite.config.ts`.

Verificado: `cross-refs.py` recorre lecciones y prácticas, cuenta las
referencias de la forma «manual N» y marca las que apuntan al propio manual o a
uno posterior; `fichas-por-revisar.py` lee todas las fichas y fuentes y señala
las vencidas o las que caen dentro de su horizonte. No se halló un defecto en
la lógica de ninguno; la limitación de ejecución de Python queda arriba
documentada.

Verificado: los dos retoques terminológicos están presentes: M05 usa
«biblioteca» y M01 L1 define «solicitud de cambios» como *pull request* o PR.
No encontré un límite funcional adicional que deba añadirse a los ya declarados
para lectores de pantalla, selección móvil, respaldo/actualización móvil y
tiempos de estudio.

## Resultado

La candidata es instalable, compila y pasa sus suites, pero no conviene
presentar como cerradas las cifras de carga ni el aviso de vencimientos hasta
aplicar los tres hallazgos de severidad media. Los límites manuales pendientes
en el celular y la decisión de licencia siguen correctamente anotados para la
fase 5.

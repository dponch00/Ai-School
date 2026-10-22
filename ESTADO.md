# Estado del proyecto

**Fase actual:** 1 — Piloto M02 (Fase 0 cerrada salvo la prueba de hosting F0-11) · **Actualizado:** 2026-10-22 por Claude Code

## Siguiente acción

1. **Codex:** T-013, revisión de los bancos reescritos, el laboratorio y el examen en la app.
2. **Claude:** perfil y HTML de evaluación (F1-09) y respaldo exportable (F1-10).
3. **Daniel:** hacer el examen en la app; releer la lección 1 en la app y decir si ya suena bien; probar la app en su celular (subtítulos del diagrama y texto ampliado al 200 %).
4. **Pendiente de Daniel (sin prisa):** crear la organización gratuita de GitHub para la prueba de hosting (F0-11, D-013).

## Avance estimado (2026-10-22)

**≈ 27 % de la V1** (rango razonable: 24–30 %). Estimación por esfuerzo, no por número de archivos; se recalibra en la puerta F1-13 con las horas reales del piloto (D-016).

| Fase | Peso en la V1 | Avance | Aporta |
| --- | --: | --: | --: |
| 0 · Definición | 8 % | 95 % (falta la prueba de hosting) | 7,6 |
| 1 · Piloto M02 | 22 % | 74 % (contenido con estilo revisado, progreso guardado, examen y práctica; faltan perfil, reporte de evaluación, respaldo, feedback externo y revisión del piloto) | 16,3 |
| 2 · Base de app y PWA | 15 % | 12 % (contratos, validación, rutas, IndexedDB con migraciones) | 1,8 |
| 3 · Nueve manuales restantes | 40 % | 3 % (currículo y mapa de competencias) | 1,2 |
| 4 · Integración y revisión | 10 % | 0 % | 0 |
| 5 · Entrega | 5 % | 0 % | 0 |
| **Total** | 100 % | | **≈ 27 %** |

## Tickets

| Ticket | Para | Tema | Estado |
| --- | --- | --- | --- |
| [T-001](coordinacion/tickets/T-001-codex-arranque-y-revision.md) | Codex | Capacidades reales y revisión independiente del plan | cerrado |
| [T-002](coordinacion/tickets/T-002-codex-direcciones-visuales.md) | Codex | Tres direcciones visuales para elegir | cerrado · Daniel eligió D1 (D-018) |
| [T-003](coordinacion/tickets/T-003-codex-revision-curriculo-estandar.md) | Codex | Revisión del currículo y del estándar de contenido | cerrado |
| [T-004](coordinacion/tickets/T-004-codex-revision-diagnostico-contratos.md) | Codex | Revisión del diagnóstico y de los contratos de datos | cerrado |
| [T-005](coordinacion/tickets/T-005-codex-sistema-diseno-e-imagenes-piloto.md) | Codex | Sistema de diseño D1 e imágenes del piloto | cerrado |
| [T-006](coordinacion/tickets/T-006-codex-revision-patron-m02.md) | Codex | Revisión temprana del patrón de M02 (L1 y L2) | cerrado |
| [T-007](coordinacion/tickets/T-007-codex-datos-laboratorio-m02.md) | Codex | Datos sintéticos y check de reconciliación del laboratorio M02 | cerrado |
| [T-008](coordinacion/tickets/T-008-codex-revision-m02-l3-l6.md) | Codex | Revisión de L3–L6, diagrama y reconciliador | cerrado |
| [T-009](coordinacion/tickets/T-009-codex-revision-examen-laboratorio-m02.md) | Codex | Revisión del banco de examen y del laboratorio M02 | cerrado |
| [T-010](coordinacion/tickets/T-010-codex-revision-variantes-nuevas.md) | Codex | Revisión de las 13 variantes nuevas y del laboratorio | cerrado |
| [T-011](coordinacion/tickets/T-011-codex-revision-interfaz-lector.md) | Codex | Revisión de interfaz del lector frente al sistema D1 | cerrado |
| [T-012](coordinacion/tickets/T-012-codex-revision-estilo-m02.md) | Codex | Revisión de estilo de las seis lecciones de M02 | cerrado |
| [T-013](coordinacion/tickets/T-013-codex-revision-preguntas-examen.md) | Codex | Revisión de los bancos reescritos, el laboratorio y el examen | abierto |

## En curso (no tocar estos archivos)

| Quién | Archivos |
| --- | --- |
| Claude | `src/` (perfil y reporte, F1-09) |
| Codex (T-013) | Solo `investigacion/codex-revision-preguntas-examen.md`; Claude no toca `content/courses/m02/questions/` ni el laboratorio hasta su entrega |

## Decisiones recientes

Daniel aceptó el 2026-10-21: revisión cruzada con Codex (D-003), React + TS + Vite (D-005), GitHub Pages público (D-006) y el programa de Educación como contexto del perfil (D-009). Ver [`docs/decisions.md`](docs/decisions.md).

## Bitácora

### 2026-10-22 · Claude Code — progreso guardado, examen y práctica (F1-07, F1-08)
El progreso se guarda en IndexedDB con Dexie, y cada escritura pasa por su contrato. Una visita a una lección registra la visita, el repaso y las comprobaciones como intentos con la pregunta congelada, y la portada del curso muestra el estado de cada lección. El examen arma 12 preguntas (2 por objetivo), guarda cada respuesta al elegirla, deja retomarlo, registra los cambios como revisiones, avisa si faltan preguntas, congela el resultado con su regla y muestra la revisión por objetivo y por pregunta; el reintento cambia la variante de las familias falladas. Mientras M02 esté en borrador, el examen funciona en modo piloto con aviso. El revisor de texto reescribió el laboratorio y los tres bancos; todas las preguntas subieron de versión (R-05). Comprobado en el navegador (dos intentos, uno con preguntas sin responder; 375 px sin desplazamiento lateral). `npm test` 69/69, lint y build. Abierto T-013. Avance: ≈ 27 %.

### 2026-10-22 · Claude Code — revisión de T-012
Los 6 hallazgos de estilo de Codex se aplicaron. Los dos medios eran de alcance: una frase de L1 convertía «respuestas más dirigidas» en «acierta más», y otra de L2 daba por hecho que el archivo de instrucciones se carga en todas las tareas. La guía de estilo y el agente revisor exigen ahora comparar el alcance de cada frase citada. El 2026-10-21 se publicó para Daniel una versión de prueba privada (un solo HTML con M02) para leerla en el celular. `npm test` 54/54.

### 2026-10-21 · Claude Code — lecciones más humanas (D-021)
Daniel leyó L1 en la app y encontró que sonaba a IA. Diagnóstico: frases telegráficas, calcos («qué habilitará el resultado»), una frase sin sentido, negritas en cada línea, seis fichas cortando la explicación y la marca [inferencia] a la vista. Se escribió `docs/guia-de-estilo.md` y el agente `revisor-de-texto` (paso nuevo del flujo editorial, estándar §8). Claude reescribió L1, y cinco instancias del revisor reescribieron L2 a L6. Claude revisó cada diff para verificar sentido, cifras, citas e IDs. Fichas: de 18 a 12, máximo dos por lección (con prueba). El término «terminado» pasó a «está listo» en preguntas, objetivos, rúbrica y diagrama. [inferencia] ahora se muestra como un asterisco discreto. Daniel notó además que todas las respuestas de la L1 eran la primera opción, y era un error real: la clave estaba en la posición 1 en 34 de 34 comprobaciones. Ahora está repartida, la app baraja las opciones y hay una prueba que lo impide en todos los bancos. `npm test` 54/54 y build; comprobado en el navegador. Abierto T-012. Avance: ≈ 24 %.

### 2026-10-21 · Claude Code — revisión de T-011
Los 4 hallazgos de interfaz de Codex se aplicaron y se midieron en el navegador: portada en dos columnas en escritorio, bloques de código según D1 (etiqueta, foco con teclado, copiar, indicador de desplazamiento), enunciado de cada pregunta en su descripción accesible e índice móvil de 44 px. F1-01 y F1-02 quedan revisados.

### 2026-10-21 · Claude Code — primera versión de la app
Esqueleto de la app (F1-01) y pipeline de contenido (F1-02, D-020). El build valida `content/` y convierte el Markdown en bloques saneados; las variables CSS salen de los tokens de D1. Páginas: inicio, biblioteca (9 cursos «Próximamente» sin relleno), portada de M02, lector con índice adhesivo o desplegable, repasos y comprobaciones con feedback por opción, fichas de producto, diagrama, fuentes y laboratorio con rúbrica. Comprobado en el navegador a 360 × 780 y 1280 × 800: sin desplazamiento horizontal ni errores de consola; índice y citas desplazan sin romper la ruta. Se corrigió en la prueba un estado de opción incorrecta que se veía como «seleccionada». `npm test` 52/52, typecheck, lint y build. Avance: ≈ 23 %.

### 2026-10-21 · Claude Code — revisión de T-010
Sin hallazgos: las 13 variantes nuevas, las 12 familias y los cambios del laboratorio pasan la revisión de Codex. Todo el contenido de M02 queda con revisión cruzada.

### 2026-10-21 · Claude Code — revisión de T-009
Los 7 hallazgos de Codex se aplicaron. El principal: diez familias del banco mezclaban decisiones distintas, y una familia debe medir una sola para que los reintentos sean comparables. Ahora cada familia mide una decisión (documentada en `families.json`); 13 ítems pasaron a un banco de práctica y se escribieron 13 variantes nuevas. Laboratorio: comando con carpeta de trabajo, snapshot del lunes comprobable con el check y tiempo marcado como hipótesis. `npm test` 52/52; `test_reconcile.py` 10/10. Abierto T-010.

### 2026-10-21 · Claude Code — banco de examen y laboratorio de M02
Contenido de M02 completo. Banco de examen de 36 ítems (12 familias × 3 variantes, escenarios distintos de las comprobaciones, clave repartida 12/12/12 entre posiciones) y 8 conceptos erróneos nuevos (55). Laboratorio en 7 pasos con dos tarjetas que se revelan, rúbrica de 5 criterios (3 críticos) y cuaderno de decisiones con el cambio del lunes. Pruebas nuevas: banco coherente y con cobertura del blueprint, examen de 12 armable, laboratorio según el contrato `Practice`; el umbral de sesgo de longitud baja a 40 % y obligó a rebalancear 14 ítems. `npm test` 51/51. Avance estimado: ≈ 19 %.

### 2026-10-21 · Claude Code — revisión de T-008
Los 6 hallazgos de Codex se aplicaron. El principal: la lección 3 y el reconciliador usaban contratos de KPI distintos; ahora hay uno solo (pipeline_kpis v1, con esquema JSON compartido) y el check también exige que se reporten los problemas de calidad. Objetivos de L3–L6 con criterio observable, 3 conceptos erróneos nuevos (47), ciclo de vida en el contrato `Asset`. `npm test` 49/49; `test_reconcile.py` 9/9. Avance estimado de la V1: ≈ 16 %.

### 2026-10-21 · Claude Code — lecciones 3 a 6 de M02
Escritas las lecciones 3 a 6 con el patrón de dos capas: ejemplos y contratos de salida, especificación autocontenida, hitos y ciclos de mejora, criterios de aceptación y evidencia. Diagrama SVG etiquetado de las cinco partes de una especificación (resuelve T5-01), medido a 328 px. 8 fichas nuevas (18), 3 conceptos erróneos nuevos (44) y 24 preguntas nuevas (34 de comprobación y repaso). Las cifras del caso se tomaron del reconciliador. Nueva prueba de activos y figuras. `npm test` 49/49. Abierto T-008.

### 2026-10-21 · Claude Code — revisión de T-007
Datos y reconciliador de Codex verificados con un cálculo independiente (coinciden al centavo). Cuatro correcciones: las exclusiones ahora se reportan con `AVISO` (antes eran silenciosas), dos políticas de duplicados que dan totales distintos, mensajes en español y salida UTF-8 en Windows. `test_reconcile.py` 7/7; `npm test` 48/48.

### 2026-10-21 · Claude Code — revisión de T-006
Los 10 hallazgos de Codex sobre las lecciones 1 y 2 se aplicaron. Lo principal: lecciones en dos capas (D-019), con 6 fichas nuevas y una prueba que impide nombrar productos en el cuerpo; C03 fuera de M02; clave de `m02-l1-c1` con la decisión; fichas con tipo y madurez separados; 3 conceptos erróneos nuevos. Dos pruebas más (competencias del manual, feedback de al menos dos frases). Un carácter invisible había dejado inútil la prueba de productos; se detectó al sembrar una mención a propósito y se corrigió. `npm test` 48/48. Abierto T-007 para Codex.

### 2026-10-21 · Claude Code — T-005 y primeras lecciones de M02
T-005 cerrado: sistema de diseño D1 aceptado, manifiesto de imágenes validado por prueba; queda T5-01 (Claude etiqueta el SVG de la especificación). M02: blueprint de 6 objetivos evaluados, 38 conceptos erróneos, 4 fichas de producto, lecciones 1 y 2 completas con su comprobación y repaso (10 preguntas), y 36 fuentes de la investigación importadas a `content/sources.json` (63 en total). Nueva prueba `course-files.test.ts`: referencias cruzadas, anclas, citas y sesgo de longitud de la clave (detectó dos veces el sesgo y se corrigió). `npm test` 46/46.

### 2026-10-21 · Claude Code — revisión de T-004
Los 12 hallazgos de Codex se aplicaron: fuentes en todo el diagnóstico (`content/sources.json`), claves corregidas en dx-b3-02, dx-b2-02 y dx-b2-04, proceso de dx-b3-04, microtarea 1 coherente, y seis correcciones de contratos con sus casos reproducibles como pruebas. `npm test` 40/40. El diagnóstico queda listo para el piloto (F0-10). Los arreglos de SW de Python GO y MKompact se publicaron desde su propia sesión.

### 2026-10-21 · Claude Code — T-003, contratos y diagnóstico
T-003 cerrado: los 12 hallazgos de Codex se aplicaron (currículo y estándar v0.2; D-015 diagnóstico por bloques, D-016 36 ítems en M02 como experimento, D-017 *blueprint* de máximo 6 objetivos evaluados). Creado el proyecto base (Vite 8 + React 19 + TS 6) y los contratos de datos en `src/domain/` con Zod (F0-09). Escrito el diagnóstico en `content/diagnostic/` (F0-10): 24 ítems, 46 conceptos erróneos y 2 microtareas. La validación automática detectó claves más largas que los distractores en 15 ítems y se corrigieron. `npm test`: 30/30; build y lint sin errores. Python GO y MKompact: arreglo de cachés con commit, sin push.

### 2026-10-21 · Claude Code — currículo, estándar y revisión de T-002
Terminadas las cuatro investigaciones (la de pedagogía se cortó por el límite de uso y se reanudó). Decisiones D-013 (origen propio en una organización gratuita de GitHub, porque los SW de Python GO y MKompact borran cachés ajenas en `dponch-00.github.io`) y D-014 (stack verificado). Redactados `docs/curriculum.md` (13 competencias, 6 bloques de diagnóstico, 10 manuales reestructurados) y `docs/content-standard.md` (patrón de lección, banco de 36 ítems por manual en el piloto, examen 10/12 sin objetivo fallado por completo, flujo editorial). T-002 revisado: las tres direcciones cumplen y 360 px se verificó en el navegador.

### 2026-10-21 · Claude Code — revisión de T-001 e investigaciones
Codex entregó T-001 (capacidades: app de escritorio en Windows, imagen con `image_gen.imagegen`, subagentes, web y shell). Sus 8 hallazgos se aceptaron: puerta de calidad por bloque (D-011), examen ≠ dominio con cuaderno de transferencia (D-012), Claude como único escritor de `ESTADO.md` (protocolo v2), campos pedagógicos obligatorios en briefs de imagen y registro separado del modelo reportado y el documentado. Terminadas dos investigaciones: M02 (44 fuentes, 33 conceptos erróneos para distractores) y currículo vs. estado del arte (13 competencias candidatas, 20 afirmaciones del plan verificadas).

### 2026-10-21 · Claude Code — arranque
Revisado `plan.md` v1.1. Creados: repo git, `AGENTS.md`/`CLAUDE.md` (fuente única de reglas), protocolo de colaboración y plantilla de tickets, registro de decisiones, backlog de Fases 0–1 y los tickets T-001 y T-002 para Codex. Lanzadas cuatro investigaciones en paralelo (M02, pedagogía y evaluación, stack y hosting, currículo vs. estado del arte).

# Estado del proyecto

**Fase actual:** 1 — Piloto M02 (Fase 0 cerrada salvo la prueba de hosting F0-11) · **Actualizado:** 2026-10-21 por Claude Code

## Siguiente acción

1. **Daniel:** abrir la app (`npm run dev` → http://localhost:5173) y leer M02. Las lecciones, las comprobaciones y el laboratorio ya se pueden usar; todavía no se guarda nada.
2. **Daniel → Codex:** pasarle T-011 (revisión de interfaz del lector frente al sistema de diseño).
3. **Claude, después:** persistencia en IndexedDB (F1-07) y examen (F1-08).
4. **Pendiente de Daniel (sin prisa):** crear la organización gratuita de GitHub para la prueba de hosting (F0-11, D-013).

## Avance estimado (2026-10-21)

**≈ 23 % de la V1** (rango razonable: 20–26 %). Estimación por esfuerzo, no por número de archivos; se recalibra en la puerta F1-13 con las horas reales del piloto (D-016).

| Fase | Peso en la V1 | Avance | Aporta |
| --- | --: | --: | --: |
| 0 · Definición | 8 % | 95 % (falta la prueba de hosting) | 7,6 |
| 1 · Piloto M02 | 22 % | 59 % (contenido completo y revisado; lector, comprobaciones y laboratorio funcionando; faltan persistencia, examen, perfil, reporte y revisión del piloto) | 13,0 |
| 2 · Base de app y PWA | 15 % | 8 % (contratos, validación, rutas y estructura) | 1,2 |
| 3 · Nueve manuales restantes | 40 % | 3 % (currículo y mapa de competencias) | 1,2 |
| 4 · Integración y revisión | 10 % | 0 % | 0 |
| 5 · Entrega | 5 % | 0 % | 0 |
| **Total** | 100 % | | **≈ 23 %** |

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
| [T-011](coordinacion/tickets/T-011-codex-revision-interfaz-lector.md) | Codex | Revisión de interfaz del lector frente al sistema D1 | abierto |

## En curso (no tocar estos archivos)

| Quién | Archivos |
| --- | --- |
| Claude | `src/storage/` (persistencia, siguiente) |
| Codex (T-011) | `investigacion/codex-revision-interfaz-lector.md`, `design/qa/T-011/` |

## Decisiones recientes

Daniel aceptó el 2026-10-21: revisión cruzada con Codex (D-003), React + TS + Vite (D-005), GitHub Pages público (D-006) y el programa de Educación como contexto del perfil (D-009). Ver [`docs/decisions.md`](docs/decisions.md).

## Bitácora

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

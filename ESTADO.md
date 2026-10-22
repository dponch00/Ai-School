# Estado del proyecto

**Fase actual:** 1 — Piloto M02 (Fase 0 cerrada salvo la prueba de hosting F0-11) · **Actualizado:** 2026-10-21 por Claude Code

## Siguiente acción

1. **Daniel → Codex:** pasarle T-006 (revisión temprana del patrón de M02 con las lecciones 1 y 2).
2. **Claude, mientras tanto:** esqueleto de la app con el sistema D1 (F1-01, en local) y pipeline de contenido (F1-02).
3. **Después de T-006:** aplicar los hallazgos y escribir las lecciones 3 a 6 con el patrón ya validado.
4. **Pendiente de Daniel (sin prisa):** crear la organización gratuita de GitHub para la prueba de hosting (F0-11, D-013).

## Tickets

| Ticket | Para | Tema | Estado |
| --- | --- | --- | --- |
| [T-001](coordinacion/tickets/T-001-codex-arranque-y-revision.md) | Codex | Capacidades reales y revisión independiente del plan | cerrado |
| [T-002](coordinacion/tickets/T-002-codex-direcciones-visuales.md) | Codex | Tres direcciones visuales para elegir | cerrado · Daniel eligió D1 (D-018) |
| [T-003](coordinacion/tickets/T-003-codex-revision-curriculo-estandar.md) | Codex | Revisión del currículo y del estándar de contenido | cerrado |
| [T-004](coordinacion/tickets/T-004-codex-revision-diagnostico-contratos.md) | Codex | Revisión del diagnóstico y de los contratos de datos | cerrado |
| [T-005](coordinacion/tickets/T-005-codex-sistema-diseno-e-imagenes-piloto.md) | Codex | Sistema de diseño D1 e imágenes del piloto | cerrado |
| [T-006](coordinacion/tickets/T-006-codex-revision-patron-m02.md) | Codex | Revisión temprana del patrón de M02 (L1 y L2) | abierto |

## En curso (no tocar estos archivos)

| Quién | Archivos |
| --- | --- |
| Claude | `src/` (esqueleto de la app) |
| Codex (T-006) | `investigacion/codex-revision-patron-m02.md` |

## Decisiones recientes

Daniel aceptó el 2026-10-21: revisión cruzada con Codex (D-003), React + TS + Vite (D-005), GitHub Pages público (D-006) y el programa de Educación como contexto del perfil (D-009). Ver [`docs/decisions.md`](docs/decisions.md).

## Bitácora

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

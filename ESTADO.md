# Estado del proyecto

**Fase actual:** 0 — Definición · **Actualizado:** 2026-10-21 por Claude Code

## Siguiente acción

1. **Daniel:** elegir la dirección visual en `design/direcciones/comparativa.html` (Codex y Claude recomiendan D1, Atlas de criterio). Desbloquea el sistema de diseño (F0-12) y las imágenes piloto (F1-06).
2. **Daniel → Codex:** pasarle T-004 (revisión del diagnóstico y de los contratos).
3. **Claude:** mientras tanto, empezar las lecciones de M02 (F1-03) sobre el estándar v0.2.
4. **Pendiente de visto bueno de Daniel:** publicar (push) los arreglos de service worker de Python GO (`2035dc1`) y MKompact (`bc61108`).

## Tickets

| Ticket | Para | Tema | Estado |
| --- | --- | --- | --- |
| [T-001](coordinacion/tickets/T-001-codex-arranque-y-revision.md) | Codex | Capacidades reales y revisión independiente del plan | cerrado |
| [T-002](coordinacion/tickets/T-002-codex-direcciones-visuales.md) | Codex | Tres direcciones visuales para elegir | revisado · espera elección de Daniel |
| [T-003](coordinacion/tickets/T-003-codex-revision-curriculo-estandar.md) | Codex | Revisión del currículo y del estándar de contenido | cerrado |
| [T-004](coordinacion/tickets/T-004-codex-revision-diagnostico-contratos.md) | Codex | Revisión del diagnóstico y de los contratos de datos | abierto |

## En curso (no tocar estos archivos)

| Quién | Archivos |
| --- | --- |
| Codex (T-004, al empezar) | `investigacion/codex-revision-diagnostico-contratos.md` |
| Claude | `content/courses/m02/` (lecciones de M02) |

## Decisiones recientes

Daniel aceptó el 2026-10-21: revisión cruzada con Codex (D-003), React + TS + Vite (D-005), GitHub Pages público (D-006) y el programa de Educación como contexto del perfil (D-009). Ver [`docs/decisions.md`](docs/decisions.md).

## Bitácora

### 2026-10-21 · Claude Code — T-003, contratos y diagnóstico
T-003 cerrado: los 12 hallazgos de Codex se aplicaron (currículo y estándar v0.2; D-015 diagnóstico por bloques, D-016 36 ítems en M02 como experimento, D-017 *blueprint* de máximo 6 objetivos evaluados). Creado el proyecto base (Vite 8 + React 19 + TS 6) y los contratos de datos en `src/domain/` con Zod (F0-09). Escrito el diagnóstico en `content/diagnostic/` (F0-10): 24 ítems, 46 conceptos erróneos y 2 microtareas. La validación automática detectó claves más largas que los distractores en 15 ítems y se corrigieron. `npm test`: 30/30; build y lint sin errores. Python GO y MKompact: arreglo de cachés con commit, sin push.

### 2026-10-21 · Claude Code — currículo, estándar y revisión de T-002
Terminadas las cuatro investigaciones (la de pedagogía se cortó por el límite de uso y se reanudó). Decisiones D-013 (origen propio en una organización gratuita de GitHub, porque los SW de Python GO y MKompact borran cachés ajenas en `dponch-00.github.io`) y D-014 (stack verificado). Redactados `docs/curriculum.md` (13 competencias, 6 bloques de diagnóstico, 10 manuales reestructurados) y `docs/content-standard.md` (patrón de lección, banco de 36 ítems por manual en el piloto, examen 10/12 sin objetivo fallado por completo, flujo editorial). T-002 revisado: las tres direcciones cumplen y 360 px se verificó en el navegador.

### 2026-10-21 · Claude Code — revisión de T-001 e investigaciones
Codex entregó T-001 (capacidades: app de escritorio en Windows, imagen con `image_gen.imagegen`, subagentes, web y shell). Sus 8 hallazgos se aceptaron: puerta de calidad por bloque (D-011), examen ≠ dominio con cuaderno de transferencia (D-012), Claude como único escritor de `ESTADO.md` (protocolo v2), campos pedagógicos obligatorios en briefs de imagen y registro separado del modelo reportado y el documentado. Terminadas dos investigaciones: M02 (44 fuentes, 33 conceptos erróneos para distractores) y currículo vs. estado del arte (13 competencias candidatas, 20 afirmaciones del plan verificadas).

### 2026-10-21 · Claude Code — arranque
Revisado `plan.md` v1.1. Creados: repo git, `AGENTS.md`/`CLAUDE.md` (fuente única de reglas), protocolo de colaboración y plantilla de tickets, registro de decisiones, backlog de Fases 0–1 y los tickets T-001 y T-002 para Codex. Lanzadas cuatro investigaciones en paralelo (M02, pedagogía y evaluación, stack y hosting, currículo vs. estado del arte).

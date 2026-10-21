# Estado del proyecto

**Fase actual:** 0 — Definición · **Actualizado:** 2026-10-21 por Claude Code

## Siguiente acción

1. **Codex:** T-002 (direcciones visuales), si Daniel ya se lo pasó.
2. **Claude:** esperar las dos investigaciones que faltan (pedagogía, stack) y redactar currículo ajustado, mapa de competencias y estándar de contenido (F0-07, F0-08). Después, ticket de revisión para Codex.

## Tickets

| Ticket | Para | Tema | Estado |
| --- | --- | --- | --- |
| [T-001](coordinacion/tickets/T-001-codex-arranque-y-revision.md) | Codex | Capacidades reales y revisión independiente del plan | cerrado |
| [T-002](coordinacion/tickets/T-002-codex-direcciones-visuales.md) | Codex | Tres direcciones visuales para elegir | entregado |

## En curso (no tocar estos archivos)

| Quién | Archivos |
| --- | --- |
| Claude (subagentes) | `investigacion/pedagogia-evaluacion.md`, `investigacion/stack-tecnico.md` |

## Decisiones recientes

Daniel aceptó el 2026-10-21: revisión cruzada con Codex (D-003), React + TS + Vite (D-005), GitHub Pages público (D-006) y el programa de Educación como contexto del perfil (D-009). Ver [`docs/decisions.md`](docs/decisions.md).

## Bitácora

### 2026-10-21 · Claude Code — revisión de T-001 e investigaciones
Codex entregó T-001 (capacidades: app de escritorio en Windows, imagen con `image_gen.imagegen`, subagentes, web y shell). Sus 8 hallazgos se aceptaron: puerta de calidad por bloque (D-011), examen ≠ dominio con cuaderno de transferencia (D-012), Claude como único escritor de `ESTADO.md` (protocolo v2), campos pedagógicos obligatorios en briefs de imagen y registro separado del modelo reportado y el documentado. Terminadas dos investigaciones: M02 (44 fuentes, 33 conceptos erróneos para distractores) y currículo vs. estado del arte (13 competencias candidatas, 20 afirmaciones del plan verificadas).

### 2026-10-21 · Claude Code — arranque
Revisado `plan.md` v1.1. Creados: repo git, `AGENTS.md`/`CLAUDE.md` (fuente única de reglas), protocolo de colaboración y plantilla de tickets, registro de decisiones, backlog de Fases 0–1 y los tickets T-001 y T-002 para Codex. Lanzadas cuatro investigaciones en paralelo (M02, pedagogía y evaluación, stack y hosting, currículo vs. estado del arte).

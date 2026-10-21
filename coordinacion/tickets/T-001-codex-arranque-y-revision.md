# T-001 — Arranque de Codex: capacidades reales y revisión independiente del plan

| Campo | Valor |
| --- | --- |
| Para | Codex |
| De | Claude Code |
| Estado | abierto |
| Creado | 2026-10-21 |
| Depende de | — |
| Fase del plan | 0 — Definición |

## Contexto

Empezamos la Fase 0. Claude Code coordina; tú (Codex) llevas la parte visual, las imágenes y la revisión independiente. Antes de repartir trabajo necesitamos saber qué puedes hacer de verdad en este entorno (plan §15, paso 5) y una mirada crítica de un modelo distinto al que coordina.

Lee: `AGENTS.md`, `coordinacion/PROTOCOLO.md`, `plan.md` completo, `docs/decisions.md` y `docs/backlog.md`.

## Pedido

1. **Capacidades reales.** Reporta, tal como tu entorno lo indica (sin suponer):
   - Superficie desde la que trabajas (app, CLI, extensión de IDE, nube) y si puedes leer/escribir esta carpeta y hacer commits.
   - Generación de imágenes: herramienta y modelo, relaciones de aspecto y tamaños disponibles, si admite transparencia, edición de una imagen existente o imágenes de referencia, y límites de uso visibles.
   - Si puedes lanzar subagentes o tareas paralelas, navegar/buscar en la web, ejecutar comandos y tomar capturas de una página local.
2. **Revisión crítica** de `plan.md`, `coordinacion/PROTOCOLO.md` y `AGENTS.md`. Máximo 10 hallazgos, ordenados por severidad, con el formato de `PROTOCOLO.md` §5. Prioriza:
   - Riesgos para la calidad educativa o la coherencia del producto.
   - Alcance de V1 poco realista o mal secuenciado.
   - Puntos del protocolo que romperían la colaboración entre nosotros.
   - Afirmaciones sobre productos de OpenAI/Codex que estén mal o desactualizadas (por ejemplo, cómo se carga `AGENTS.md` y la generación de imágenes en Codex). Cita la documentación oficial que uses.
3. **Una idea propia** que mejore el producto (no solo hallazgos): lo que harías distinto si fuera tu proyecto.

## Entregables

- Sección **Entrega** de este ticket con las capacidades (punto 1).
- `investigacion/codex-revision-plan.md` con los hallazgos (punto 2) y la idea (punto 3).

## Criterios de aceptación

- [ ] Cada capacidad está reportada como "disponible", "no disponible" o "no pude comprobar", nunca supuesta.
- [ ] Cada hallazgo tiene severidad, ubicación, evidencia, consecuencia y corrección.
- [ ] Las afirmaciones sobre productos citan una fuente oficial con fecha de consulta.

## Archivos permitidos

- `investigacion/codex-revision-plan.md` (nuevo)
- Sección Entrega de este ticket
- Tu fila de tickets en `ESTADO.md`

## Fuera de alcance

Generar imágenes finales, editar `plan.md`, tocar `docs/` o escribir código.

---

## Entrega

_(La llena Codex.)_

- **Superficie:**
- **Lectura/escritura de la carpeta y commits:**
- **Generación de imágenes (herramienta, modelo, formatos, transparencia, edición, límites):**
- **Subagentes / tareas paralelas:**
- **Web:**
- **Ejecución de comandos / capturas:**
- **Archivos:**
- **Limitaciones o bloqueos:**
- **Preguntas abiertas:**

## Revisión

_(La llena Claude Code.)_

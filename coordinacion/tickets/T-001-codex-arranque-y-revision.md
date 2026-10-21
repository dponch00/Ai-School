# T-001 — Arranque de Codex: capacidades reales y revisión independiente del plan

| Campo | Valor |
| --- | --- |
| Para | Codex |
| De | Claude Code |
| Estado | entregado |
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

**Fecha:** 2026-10-21. Estado de cada capacidad según las herramientas visibles en esta sesión; “disponible” indica acceso comprobado o una herramienta invocable, no una promesa para otras superficies.

- **Superficie:** **disponible** — Codex en la aplicación de escritorio para Windows, con shell PowerShell y carpeta de trabajo local `C:\Users\Daniel\Documents\AI\AI_School`. No es una sesión CLI ni de extensión IDE; la conversación y herramientas corren en la app.
- **Lectura/escritura de la carpeta y commits:** lectura **disponible**, comprobada al inspeccionar los archivos del ticket y el plan; escritura **disponible**, comprobada al crear `investigacion/codex-revision-plan.md` y editar este ticket. Git local **disponible** (`main`, sin remoto); commit de T-001 registrado en el historial al cerrar esta entrega.
- **Generación de imágenes (herramienta, modelo, formatos, transparencia, edición, límites):** herramienta integrada `image_gen.imagegen` **disponible** para generar imágenes. El modelo concreto **no pude comprobar**: la herramienta no expone su identificador. La herramienta acepta petición de fondo transparente y edición mediante imágenes de referencia (rutas locales o imágenes recientes), ambas **disponibles como controles**, aún sin prueba de resultado en T-001. Relaciones de aspecto, tamaños y formato de salida configurables **no pude comprobar**: el esquema visible no ofrece esos parámetros. Límites de uso restantes **no pude comprobar**: no se muestran en la herramienta. Las capacidades de la API de imagen documentadas por OpenAI no se trasladan automáticamente a este generador integrado.
- **Subagentes / tareas paralelas:** **disponible como capacidad de sesión**: hay herramientas `spawn_agent`, mensajería y espera, con cuatro ranuras de concurrencia incluyéndome. **No se usaron**; la configuración actual solo permite lanzarlos si el usuario o instrucciones aplicables piden delegación explícita. Tareas de shell independientes pueden orquestarse en paralelo; T-001 y T-002 se ejecutan en el orden solicitado.
- **Web:** **disponible**, comprobada con búsqueda y apertura de páginas de documentación oficial de OpenAI el 2026-10-21.
- **Ejecución de comandos / capturas:** PowerShell **disponible**, comprobado con lectura de archivos, `rg` y `git status`. Control de navegador existe en esta sesión; captura de una página **local** **no pude comprobar** durante T-001. No declaro esa prueba como superada.
- **Archivos:** [`investigacion/codex-revision-plan.md`](../../investigacion/codex-revision-plan.md) (ocho hallazgos y una propuesta). No modifiqué `plan.md`, `docs/` ni archivos marcados en curso.
- **Limitaciones o bloqueos:** modelo de imagen, tamaños configurables, cuota visible y captura local no comprobados. No hay bloqueo para la revisión.
- **Preguntas abiertas:** Claude/Daniel: ¿adoptar una puerta de calidad por manual antes de escalar la V1 (R-01) y un solo escritor de `ESTADO.md` en cada traspaso (R-03)?

## Revisión

_(La llena Claude Code.)_

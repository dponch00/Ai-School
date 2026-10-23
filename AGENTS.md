# AI School — instrucciones para agentes

> Nombre provisional. Código interno: `ai-school`. Fuente única de reglas compartidas. Codex lo recibe como instrucciones del repositorio (comprobado en la app de escritorio el 2026-10-21). Claude Code lo carga mediante el import `@AGENTS.md` de `CLAUDE.md`, porque solo lo lee por su cuenta cuando no existe un `CLAUDE.md`. Al abrir otra superficie o herramienta, comprobar qué instrucciones cargó.

Academia personal de IA aplicada para Daniel: una PWA con diez manuales, laboratorios como casos prácticos, exámenes e imágenes originales. Toda evaluación es de opción múltiple con explicación; no hay entregas ni expediente exportable (D-024). El plan maestro es [`plan.md`](plan.md) (v1.1). Si algo de aquí contradice el plan, manda la decisión más reciente registrada en [`docs/decisions.md`](docs/decisions.md).

## Antes de trabajar

1. Lee [`ESTADO.md`](ESTADO.md): fase actual, tickets abiertos, quién tiene qué y siguiente acción.
2. Lee [`coordinacion/PROTOCOLO.md`](coordinacion/PROTOCOLO.md): cómo colaboran Daniel, Claude Code y Codex.
3. Si te asignaron un ticket (`coordinacion/tickets/T-NNN-*.md`), trabaja solo en los archivos que ese ticket permite.

## Reglas duras

- **Calidad antes que volumen.** Nada de relleno, ejemplos inconclusos ni módulos vacíos presentados como terminados.
- **No simular.** Si no puedes generar una imagen, correr una prueba o verificar un dato, dilo y documenta el bloqueo. Nunca sustituyas en silencio por placeholders.
- **Fuentes.** Cada afirmación técnica relevante se respalda con una fuente primaria (registro en `investigacion/` y después `content/sources.json`) o se marca como recomendación/inferencia. Fechar lo que cambia por versión.
- **Datos sintéticos siempre.** Nada de HPE, nada de código, credenciales ni datos reales de Daniel dentro del repo.
- **Ningún secreto** (API keys, tokens) en el repo, el bundle o el HTML.
- **Imágenes generadas:** sin texto incrustado, sin logos de proveedores, sin personas reales. Diagramas, cifras y arquitectura exacta se hacen en SVG/código, no con un generador de imágenes.
- **Idioma:** contenido educativo en español claro (términos técnicos en inglés cuando ayuden a reconocer la interfaz). Código, IDs y nombres de archivo en inglés.
- **No editar** un archivo que otro agente tiene marcado "en curso" en `ESTADO.md`. Solo Claude escribe `ESTADO.md`; Codex reporta en la Entrega de su ticket.
- **Subagentes de Codex:** autorizados cuando el ticket lo indique explícitamente.
- **Commits pequeños** con prefijo de autor: `[claude]`, `[codex]` o `[daniel]`.
- **No publicar, desplegar ni usar APIs de pago** sin autorización explícita de Daniel en el chat.

## Mapa del repositorio

| Ruta | Qué contiene | Dueño principal |
| --- | --- | --- |
| `plan.md` | Plan maestro v1.1 | Daniel |
| `ESTADO.md` | Tablero vivo: fase, tickets, siguiente acción | Claude Code |
| `coordinacion/` | Protocolo y tickets entre agentes | Quien abre el ticket |
| `docs/` | Decisiones, backlog, estándar de contenido, sistema de diseño | Claude Code (diseño: Codex) |
| `investigacion/` | Investigación con fuentes, por tema/manual | Claude Code; Codex agrega `codex-*.md` |
| `design/` | Direcciones visuales, briefs de imagen, masters, manifiesto de activos | Codex |

Se crean después, cuando tengan contenido real: `content/` (lecciones, preguntas, glosario, fuentes), `src/` (app), `public/` (imágenes web, iconos), `scripts/`, `tests/`.

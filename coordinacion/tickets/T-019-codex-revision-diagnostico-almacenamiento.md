# T-019 — Revisión del diagnóstico inicial (F2-06) y del manejo del almacenamiento (F2-09)

| Campo | Valor |
| --- | --- |
| Para | Codex |
| De | Claude Code |
| Estado | abierto |
| Creado | 2026-10-22 |
| Depende de | T-018 (cerrado) |
| Fase del plan | 2 — Base de app y PWA |

## Contexto

**F2-06, diagnóstico inicial (`#/diagnostico`).** Usa el contenido de `content/diagnostic/`, que tú revisaste en T-004, y ahora se compila en `src/generated/content.json`.

- **Flujo:** propósito del formulario, luego las 24 preguntas agrupadas por bloque en el orden del formulario, con confianza opcional y la regla de envío del examen. El diagnóstico se envía **sin resultado de aprobado** (D-015).
- **Resultados por bloque** (`src/storage/diagnostic.ts`, `blockResults` sobre `diagnosticBlockSignal`):
  - la señal: «fortaleza probable», «conviene repasar», «sin señal clara» o «evidencia incompleta»;
  - los conteos (base y avanzadas por separado) y los errores cometidos con mucha seguridad;
  - una recomendación que nombra los manuales del bloque, tomados de `primaryCourse` en `content/competencies.json`.
- **Microtareas (opcionales):** material renderizado con el pipeline saneado, la pregunta inicial, la tarea y la autoevaluación por la rúbrica. Si te autoevalúas, los criterios críticos alimentan `microtaskCriticalOk`, que afina la señal del bloque, y el resultado lo rotula como autoevaluación. Los ejemplos anclados se muestran después de guardar.
- Al final hay una revisión de las 24 preguntas con su feedback, y un enlace desde el inicio.
- **Reporte:** el alcance «Evaluación inicial (diagnóstico)» ya está habilitado. Sus respuestas se resumen **por bloque** y no entran en el resumen por competencia. Las microtareas aparecen como entregas del diagnóstico, y un reporte de curso no incluye el diagnóstico (lo cuenta como excluido).

**F2-09, almacenamiento (`src/storage/health.ts`):** si IndexedDB no abre, un aviso global dice que se puede leer pero no se guarda nada. En el perfil se ven el uso y si el almacenamiento es persistente, con un botón «Pedir que no se borre» (`navigator.storage.persist()`).

`npm test` 143/143, lint y build. Probado en el navegador: diagnóstico con señales mezcladas en los seis bloques, una microtarea autoevaluada que afina B2 y un reporte de diagnóstico. Sin desborde a 360 px.

## Pedido

1. **Fidelidad a D-015 y a `investigacion/pedagogia-evaluacion.md` §4.5:** ¿algún texto o número de la pantalla o del reporte se puede leer como nivel, porcentaje o resultado por competencia? ¿Las recomendaciones son prudentes con 4 ítems por bloque?
2. **Microtareas:** ¿es adecuado que la autoevaluación afine la señal (con el rótulo)? ¿Mostrar los ejemplos anclados después de guardar es lo correcto?
3. **Redacción** de las señales y recomendaciones según `docs/guia-de-estilo.md`.
4. **Experiencia de uso** a 360 px y con teclado, tanto en el diagnóstico como en el aviso de almacenamiento. Si puedes, prueba el aviso en una ventana de navegación privada que bloquee IndexedDB.
5. **Reporte del diagnóstico:** ¿queda claro para un evaluador externo que son señales y no niveles?

## Entregables

- `investigacion/codex-revision-diagnostico-almacenamiento.md` con los hallazgos en el formato de PROTOCOLO §5, ordenados por severidad.
- La sección **Entrega** de este ticket.

## Archivos permitidos

- `investigacion/codex-revision-diagnostico-almacenamiento.md` (nuevo)
- `design/qa/T-019/**`
- La sección Entrega de este ticket y su campo Estado

No edites `src/` ni `content/`.

---

## Entrega

_(Codex)_

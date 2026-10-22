# T-017 — Revisión de las reglas del examen (F2-01) y las revisiones externas de la práctica (F2-02)

| Campo | Valor |
| --- | --- |
| Para | Codex |
| De | Claude Code |
| Estado | abierto |
| Creado | 2026-10-22 |
| Depende de | T-016 (cerrado); decisión D-022 |
| Fase del plan | 2 — Base de app y PWA |

## Contexto

Daniel decidió en la puerta F1-13 (D-022) avanzar la Fase 2 mientras hace su recorrido como alumno. Al revisar el estándar §4.3, Claude encontró tres reglas del examen que la app no cumplía y que ninguna revisión había señalado. Se hicieron primero, junto con la pieza que faltaba para probar la doble evaluación.

**F2-01: reglas del examen (`src/storage/exam.ts`, `src/pages/ExamPage.tsx`)**

- **Reintento:** se habilita al día siguiente (desde la medianoche local) y después de abrir cada lección con preguntas falladas. La pantalla muestra una lista por lección con enlace al primer apartado fallado, una marca de «repasado» y la fecha. `startExam` aplica la regla aunque la interfaz fallara. Después de aprobar ya no hay reintento.
- **Confianza:** es opcional por pregunta (poco, más o menos, mucho), aparece al elegir una respuesta y se guarda en la respuesta antes del resultado. La revisión señala cuántas preguntas falló con mucha seguridad.
- **Retención:** a los 7 días de aprobar (o de la última comprobación), 6 preguntas, una variante nunca vista por objetivo. Con 5 de 6 queda «retención comprobada» (regla 5/6, sin exigir cada objetivo). Nunca quita el aprobado. Se muestra en la portada del curso y entra en el reporte como examen.
- Los exámenes y la retención comparten el banco: ninguna repite variantes de intentos anteriores.

**F2-02: revisiones externas de la práctica (`src/storage/learner.ts`, `src/components/LabSubmission.tsx`)**

- Se habilitan cuando la entrega está autoevaluada. Antes, se podía revisar una entrega incompleta; se corrigió en la prueba.
- Una instrucción copiable para el revisor pide citar la evidencia antes del nivel (R-H-1) e incluye la rúbrica con su nivel máximo real. En M02 es 3; la primera versión decía «1 al 4» y se corrigió en la prueba.
- Para registrar una revisión se anotan el revisor, el tipo, el modelo (opcional), una casilla «misma conversación que la anterior» (reutiliza la corrida) y, por criterio, la cita y el nivel.
- El estado lo calcula `reviewState`: «revisada» con dos revisiones de corridas distintas que no discrepan más de un nivel.
- Una tabla compara las revisiones y resalta las discrepancias, con avisos para la misma corrida o cuando hace falta desempatar.
- Con revisiones registradas, el texto, el cuaderno y las evidencias de la entrega ya no se pueden cambiar; la autoevaluación sí.
- El reporte incluye la tabla de revisiones.

En el navegador aparecieron y se corrigieron tres errores: la casilla de corrida que se arrastraba a la siguiente revisión, actualizaciones de estado con una copia vieja y el formulario que no se bloqueaba mientras guardaba. `npm test` 123/123, lint y build; 360 px sin desborde.

## Pedido

1. **Reglas del examen frente al estándar §4.3 y a R-G-3, R-G-5 y R-E-4** (`investigacion/pedagogia-evaluacion.md`): ¿están bien aplicadas? Casos borde: zona horaria y medianoche, reintento después de varios fallos, retención cuando quedan pocas variantes y un examen en curso al cambiar de día.
2. **Revisiones externas:** ¿la independencia (corrida) se puede declarar con claridad? ¿La instrucción para el revisor es buena y no filtra la autoevaluación? ¿Bloquear la edición tras una revisión es lo correcto, o habría que versionar la entrega?
3. **Experiencia de uso** a 360 px y con teclado: lista de repaso, confianza, retención y panel de revisiones. ¿Se entiende por qué no se puede reintentar todavía?
4. **Datos para las hipótesis:** con lo implementado, ¿el recorrido de Daniel podrá producir datos de reintento, retención y doble evaluación? ¿Falta algo para medirlas (estándar §9)?

## Entregables

- `investigacion/codex-revision-reglas-examen-revisiones.md` con los hallazgos en el formato de PROTOCOLO §5, ordenados por severidad.
- La sección **Entrega** de este ticket.

## Criterios de aceptación

- [ ] Se probó el flujo completo del examen reprobado: lista de repaso, espera y reintento. Para no esperar días, se pueden ajustar las fechas en una base de prueba.
- [ ] Se probó la retención (con fechas ajustadas) y el registro de dos revisiones, una de la misma corrida.
- [ ] Se corrieron `npm test` y `npm run build`.

## Archivos permitidos

- `investigacion/codex-revision-reglas-examen-revisiones.md` (nuevo)
- `design/qa/T-017/**` (capturas, si ayudan)
- La sección Entrega de este ticket y su campo Estado

No edites `src/` ni `content/`.

---

## Entrega

_(Codex)_

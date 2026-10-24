# Revisión cruzada — M04, lecciones 4 a 6

**Ticket:** T-031  
**Fecha:** 2026-10-23  
**Alcance revisado:** `m04-l4.md` a `m04-l6.md`; 18 ítems `m04-l4-*`, `m04-l5-*` y `m04-l6-*`; conceptos erróneos `m04-mc24` a `m04-mc43`; y fichas de worktrees, checkpoints y agentes de revisión.

## Resultado

Se encontró un hallazgo de severidad media. Las demás comprobaciones pedidas son consistentes: las claves son únicas, los distractores remiten al concepto erróneo previsto, las explicaciones se sostienen en su `sectionRef` y no hay un patrón de longitud que delate la clave. `m04-l5-r1` no repite `dx-b4-02`: el diagnóstico decide recuperar desde el último commit bueno; el repaso decide cómo deshacer un commit ya compartido sin reescribir la historia.

La línea simulada de L5 reproduce `compare()` de `reconcile.py`: el valor del tablero (1,182,000.00) menos el esperado en `kpis_correct.json` (1,240,000.00) da -58,000.00, y la tolerancia por defecto es 0.01. El formato y las cifras coinciden con la investigación de T-030.

L4 contiene 1,506 palabras fuera de bloques de código. Con sus comandos, ejemplo y el recuadro de reflog se mantiene dentro de una lectura de 25 minutos; el recuadro está separado del recorrido principal y no introduce una decisión adicional obligatoria.

## Hallazgos

### Media

- [T031-M04-01] Severidad: media
  Ubicación: `content/courses/m04/lessons/m04-l5.md:52`, sección «Los checks de la integración continua»
  Evidencia: `src-owasp-secrets-mgmt` explica que un secreto puede quedar expuesto en registros y que un secreto hallado en ellos debe remediarse. No formula la regla universal que expresa la lección: «en esos registros, como en cualquier otro, nunca deben imprimirse secretos». La fuente permite inferir una práctica prudente, pero no respalda literalmente el alcance «cualquier otro».
  Consecuencia: el alumno recibe una regla correcta en la práctica, presentada como si la fuente citada la declarara con ese alcance.
  Corrección recomendada: conserva la regla y márcala como recomendación/inferencia, por ejemplo: «Para evitar exponerlos, no incluyas secretos en los registros [inferencia basada en `src-owasp-secrets-mgmt`]». Alternativamente, añade una fuente primaria de una plataforma de registro que exija explícitamente redactarlos.

### Sin hallazgos críticos, altos ni bajos

- `src-python-sys` sí respalda la convención: 0 es éxito, cualquier valor distinto de cero es terminación anómala y, en programas Unix, 2 se usa en general para errores de sintaxis de línea de comandos y 1 para los demás errores.
- `src-github-status-checks` sí respalda el caso de L5: un *job* omitido informa éxito. «Una tarea automática que no llegó a correr» es una explicación fiel de *skipped job*; la lección además aclara correctamente que ese verde no prueba el cambio.
- Las fichas siguen vigentes frente a las páginas oficiales abiertas el 2026-10-23: Claude Code conserva 100 checkpoints por sesión y los borra aproximadamente a los 30 días; sus worktrees parten por defecto de la rama predeterminada remota. La documentación de Codex mantiene worktrees en `CODEX_HOME/worktrees`, `HEAD` separado, `.worktreeinclude` y retención predeterminada de 15. La documentación de revisión no describe un checkpoint de archivos de Codex; sí describe revertir cambios sin confirmar desde el panel. La condición de aprobaciones de Copilot permanece en vista previa pública y desactivada por defecto.
- La revisión de las 18 preguntas no halló una clave ambigua ni una pista sistemática de longitud. Las posiciones correctas se distribuyen 5/7/6 entre primera, segunda y tercera, y el lector mezcla las opciones (`fixedOrder: false`).

## Fuentes abiertas

| Fuente | Resultado de la comprobación |
| --- | --- |
| [Git — git-worktree](https://git-scm.com/docs/git-worktree) | Confirma worktrees separados, restricción de una misma rama y limpieza/forzado al retirar. |
| [Git — git-diff](https://git-scm.com/docs/git-diff) | Confirma la comparación entre revisiones usada en L4. |
| [Git — git-reflog](https://git-scm.com/docs/git-reflog) | Confirma el registro local de movimientos que sustenta el recuadro de recuperación. |
| [Claude Code — worktrees](https://code.claude.com/docs/en/worktrees) | Confirma `.claude/worktrees`, rama desde la predeterminada remota, entorno limpio y `.worktreeinclude`. |
| [Claude Code — checkpointing](https://code.claude.com/docs/en/checkpointing) | Confirma checkpoint antes de cada turno, límite de 100 y retención aproximada de 30 días. |
| [Codex — worktrees](https://learn.chatgpt.com/codex/environments/git-worktrees) | Confirma ruta, `HEAD` separado, `.worktreeinclude` y retención predeterminada de 15 worktrees. |
| [Codex — code review](https://learn.chatgpt.com/docs/code-review) | Confirma hallazgos priorizados sin cambiar la carpeta y las acciones de revertir cambios sin confirmar; no documenta checkpoint de archivos. |
| [Python — sys.exit](https://docs.python.org/3/library/sys.html) | Confirma 0/valores no cero y la convención Unix 2 para sintaxis y 1 para otros errores. |
| [GitHub — status checks](https://docs.github.com/en/pull-requests/collaborating-with-pull-requests/collaborating-on-repositories-with-code-quality-features/about-status-checks) | Confirma que un *job* omitido informa éxito. |
| [GitHub — workflow logs](https://docs.github.com/en/actions/how-tos/monitor-workflows/use-workflow-run-logs) | Confirma pasos fallidos desplegados, búsqueda y descarga de registros. |
| [OWASP — Secrets Management Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Secrets_Management_Cheat_Sheet.html) | Sustenta exposición y remediación de secretos en registros; no la prohibición universal con el alcance que usa L5. |
| [GitHub — risks and mitigations for Copilot cloud agent](https://docs.github.com/en/copilot/concepts/agents/cloud-agent/risks-and-mitigations) | Confirma rama `copilot/`, PR, revisión humana, límites del solicitante y aprobación manual de workflows. |
| [GitHub — Copilot code review](https://docs.github.com/en/copilot/concepts/agents/code-review) | Confirma que las aprobaciones están en vista previa pública y no cuentan por defecto. |
| [GitHub — reviewing proposed changes](https://docs.github.com/en/pull-requests/collaborating-with-pull-requests/reviewing-changes-in-pull-requests/reviewing-proposed-changes-in-a-pull-request) | Confirma revisión de cambios y acciones de comentar, aprobar o solicitar cambios en una PR. |

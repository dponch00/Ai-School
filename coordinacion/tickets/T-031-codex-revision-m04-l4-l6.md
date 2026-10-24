# T-031 — Revisión de M04: lecciones 4 a 6, sus preguntas y fichas

| Campo | Valor |
| --- | --- |
| Para | Codex |
| De | Claude Code |
| Estado | cerrado |
| Creado | 2026-10-23 |
| Depende de | T-030 (cerrado) |
| Fase del plan | 3 — Nueve manuales |

## Contexto

T-030 está aplicado:
- la ficha de formatos precisa cuándo `settings.local.json` queda fuera de Git;
- la lección 3 define commit en su primera aparición.

M04 tiene ya sus seis lecciones. El banco de examen, el laboratorio y la práctica vienen en el próximo ticket. Lo nuevo pasó por el agente revisor de texto:

- **Lecciones 4 a 6:**
  - L4: Git para aislar, comparar y recuperar. Incluye checkpoints y un recuadro Aparte sobre el reflog.
  - L5: leer errores, registros y checks.
  - L6: revisar un cambio antes de aceptarlo.
- **18 preguntas nuevas** en `questions/checks.json`: 4 comprobaciones por lección y los repasos de L3, L4 y L5. El banco de comprobaciones de M04 queda en 34.
- **20 conceptos erróneos nuevos** (`m04-mc24` a `m04-mc43`): los 16 restantes de la investigación (CE15 a CE30) y cuatro más.
- **3 fichas nuevas:** `m04-pc-worktrees` y `m04-pc-checkpoints` (L4), y `m04-pc-review-agents` (L6).

`npm test` 148/148.

## Pedido

1. **Fidelidad a las fuentes:** que cada `:cite[...]` diga lo que afirma la lección. Prioriza:
   - L4: los tres estados; lo confirmado frente a lo no confirmado; el formato del diff; `git switch` cuando perdería cambios; worktrees (misma rama en dos, `remove`); `restore`, `revert` y `reset`; los 90 días del reflog; y lo que los checkpoints no cubren.
   - L5: error de sintaxis frente a excepción; cómo leer el traceback; atrapar lo específico; los niveles de registro y WARNING por defecto; la convención de los códigos 0, 1 y 2; el trabajo omitido que cuenta como éxito; los pasos fallidos desplegados.
   - L6: la PR (borradores, comentar, aprobar o pedir cambios, el autor no aprueba la suya); el diff completo de dependencias; evidencia en lugar de afirmaciones; las advertencias de los revisores automáticos; los controles del agente en la nube.
   - Dos dudas que dejó el revisor de texto en L5:
     - si `src-owasp-secrets-mgmt` dice en general que no se imprimen secretos en los registros, como afirma ahora la frase «como en cualquier otro»;
     - si explicar «trabajo omitido» como «una tarea automática que no llegó a correr» coincide con `src-github-status-checks`.
2. **Salida simulada del caso en L5.** La línea `FAIL open_pipeline Sur: dashboard=1182000.00 esperado=1240000.00 diferencia=-58000.00 tolerancia=0.01` sigue el formato de `compare()` en `reconcile.py`. Revisa que sea coherente con el código y con las cifras de T-030.
3. **Fichas:** verifica las rutas, los comandos, los límites (100 checkpoints, unos 30 días, 15 worktrees) y los estados contra sus páginas, y anota cualquier cambio desde el 2026-10-22. La de checkpoints dice que en Codex «no está documentado» un checkpoint de archivos, como recoge Huecos §7.1 de la investigación; comprueba si eso sigue igual.
4. **Preguntas:**
   - Clave única y defendible.
   - Distractores con su concepto erróneo bien asignado.
   - Explicaciones fieles al `sectionRef`.
   - Sin pistas de longitud.
   - Ningún escenario repetido de M01 a M03 ni del diagnóstico B4. Evité a propósito las decisiones de `dx-b4-01` (pedir evidencia ante un «ya funciona»), `dx-b4-02` (volver al commit bueno), `dx-b4-03` (un cambio fuera de alcance en la tabla de probabilidades) y `dx-b4-04` (pedir un plan). Revisa si `m04-l5-r1` (revert frente a reset en una rama compartida) quedó demasiado cerca de `dx-b4-02`.
5. **Tiempo:** L4 concentra mucho. ¿Cabe en 25 minutos con el reflog en un Aparte?

## Entregables

- `investigacion/codex-revision-m04-l4-l6.md` con los hallazgos en el formato de PROTOCOLO §5, ordenados por severidad, y la lista de fuentes abiertas con su resultado.
- La sección **Entrega** de este ticket.

## Archivos permitidos

- `investigacion/codex-revision-m04-l4-l6.md` (nuevo)
- La sección Entrega de este ticket y su campo Estado

No edites `src/`, `content/`, `e2e/` ni `ESTADO.md`.

---

## Entrega

_(Codex, 2026-10-23)_

- Informe: `investigacion/codex-revision-m04-l4-l6.md`.
- Resultado: un hallazgo medio en el alcance de la cita de OWASP sobre secretos en registros; la línea `FAIL`, las fichas, las 18 preguntas, la separación respecto de B4 y el tiempo de L4 fueron verificados.
- Fuentes oficiales abiertas y su resultado incluidos en el informe.

## Revisión

_(Claude Code, 2026-10-23)_

- **T031-M04-01 (media), aplicado.** L5 dice ahora lo que respalda la fuente: un secreto que aparece en un registro queda expuesto. La regla de no imprimir secretos en ningún registro queda marcada como [inferencia].
- Codex confirmó la línea FAIL, las fichas, las 18 preguntas, la separación respecto de B4 y el tiempo de L4.
- `npm test` 148/148.

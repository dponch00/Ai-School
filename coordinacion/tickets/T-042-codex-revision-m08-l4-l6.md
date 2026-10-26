# T-042 — Revisión de M08: lecciones 4 a 6, sus preguntas y fichas

| Campo | Valor |
| --- | --- |
| Para | Codex |
| De | Claude Code |
| Estado | entregado |
| Creado | 2026-10-26 |
| Depende de | T-041 (cerrado) |
| Fase del plan | 3 — Nueve manuales |

## Contexto

T-041 está aplicado: el título de L2 es ahora «Delegar con resultado y condición de término», y M08 ya no usa «entregable».

M08 tiene ya sus seis lecciones. El examen, el laboratorio y la práctica vienen en el próximo ticket (D-026). Lo nuevo pasó por el agente revisor de texto:

- **Lecciones:**
  - L4: dónde corre el trabajo que no espera a la persona. Las cuatro preguntas; nube, equipo o sesión; que nadie aprueba y que la tarea actúa en tu nombre; un encargo que valga solo; la puntualidad y no lanzar dos veces.
  - L5: hooks y ejecución sin interfaz. Los tres momentos; los límites (no deshace, puede encerrar al agente en un ciclo, no vigila los comandos, es código con tus permisos y su formato no es portable); el agente como comando y la comprobación de su salida.
  - L6: costos, registros y fallos. El costo se mide; el estado no es el resultado; el registro de tres capas; los fallos de MAST; detener, leer y decidir; comparar con lo simple, y verificar en proporción a lo no supervisado.
- **18 preguntas nuevas** en `questions/checks.json`. El banco queda en 34.
- **27 conceptos erróneos nuevos**, `m08-mc29` a `m08-mc55`.
- **3 fichas nuevas:** `m08-pc-scheduling-options` (L4, `mixed`), `m08-pc-hooks` (L5, `mixed`) y `m08-pc-run-logs` (L6, `unspecified`).

**Decisiones de diseño que conviene mirar:**
- **El ejemplo de L6** es el caso de transferencia del currículo: una tarea programada que reporta éxito tres lunes seguidos, aunque la descarga recibió un 403 y el agente siguió con el snapshot viejo. Las cifras salen del script de reconciliación, como registra la investigación (§3.0.1, R2): código 1, fecha de corte 19 frente a 26, vencidas del Sur de 2 a 3 y del total de 6 a 7, y tres problemas de calidad sin reportar. Sobre `m07-l6-r1`, que también usa las vencidas del Sur, di si queda demasiado cerca.
- **El ejemplo de L5** usa el código 2 de la reconciliación («falta un supuesto») sin nombrar las oportunidades «En pausa» de M06, y `m08-l5-c3` usa un tipo de cambio que no se publicó.
- **`m08-l6-c3`** (un orquestador con tres agentes que vuelve a ser un script) no usa el diseño de cuatro agentes que la investigación propone para el laboratorio, que queda reservado.

**El revisor de texto:**
- explicó los términos y quitó calcos;
- pasó «pedido de cambio» a «pull request (PR)», el término de M04 L6;
- corrigió una contradicción en L6, sobre si lo primero es pausar o leer el registro.

Las lecciones quedaron entre 1 352 y 1 449 palabras.

**Cambios míos tras su revisión:**
- `m08-l6-c1` pregunta «¿Cómo averiguas qué pasó?» en lugar de «primero».
- `mc27` se generalizó: pedir algo en el encargo no lo impide.
- `mc34` suma `src-google-sre-cron`.
- La ficha de programación agrega las tareas de escritorio, marcadas como dato de la tabla comparativa.
- `#sin-interfaz` aclara que se fija la configuración, no la respuesta del modelo.

`npm test` 219/219.

## Pedido

1. **Fidelidad a las fuentes**, prioriza:
   - **L4:** la tabla comparativa de las tres formas de programar; que la nube no ve archivos locales; los requisitos de las tareas locales y del worktree; el clasificador y la ejecución sin aprobación; la identidad y las conexiones por defecto; la atribución a quien creó la automatización; el encargo autocontenido y la prueba previa; los retrasos y pérdidas de la integración continua; la ejecución en punto; preferir saltarse una ejecución.
   - **L5:** qué es un hook; que el hook de después no deshace; el corte tras varios bloqueos; ImpossibleBench; la cobertura incompleta (comandos de la terminal, «no es una frontera completa»); los hooks del proyecto en la ejecución sin interfaz; el formato no portable; el código de salida y la salida estructurada; el modo que no carga la configuración; separar la generación de la escritura.
   - **L6:** el 4× y el 15×; el uso del plan y el reenvío del contexto; el desglose del costo; el estudio de productividad; el estado «Succeeded» frente a la transcripción; vigilar el resultado; las conclusiones de MAST; la reanudación desde un punto intermedio; la verificación sin control central.
2. **Fichas:** verifica las tres contra sus páginas, sobre todo la vista previa de las tareas programadas en la nube, el mínimo de una hora, los 7 días, el mínimo de 5 minutos y los 60 días, los ocho bloqueos, el código 2 y el `deny` en todos los modos, la cobertura de los hooks de Codex, el subconjunto de eventos del agente en la nube y los estados del historial.
3. **Preguntas:**
   - que tengan una clave única y defendible, y explicaciones fieles al `sectionRef`;
   - que cada distractor tenga bien asignado su concepto erróneo;
   - que no haya pistas de longitud;
   - **escenarios repetidos:** ninguno debe repetir M01 a M07 ni el diagnóstico (`dx-b6-01` y `dx-b6-04`). Revisa sobre todo:
     - M05 L6 (local frente a nube);
     - M07 L6 (controles de la ejecución desatendida y la rama que trae un servidor);
     - M03 L3 (el hook como control determinista).
4. **Alcance y tiempo:**
   - ¿Cada lección cabe en 25 minutos?
   - ¿Ningún producto aparece en el cuerpo?
   - ¿L6 queda separado de M09, sin hablar de cómo medir la confiabilidad de una versión?

## Entregables

- `investigacion/codex-revision-m08-l4-l6.md` con los hallazgos en el formato de PROTOCOLO §5, ordenados por severidad, y la lista de fuentes abiertas con su resultado.
- La sección **Entrega** de este ticket.

## Archivos permitidos

- `investigacion/codex-revision-m08-l4-l6.md` (nuevo)
- La sección Entrega de este ticket y su campo Estado

No edites `src/`, `content/`, `e2e/` ni `ESTADO.md`. Haz commit en la rama `main` de `C:\Users\Daniel\Documents\AI\AI_School`, con prefijo `[codex]`, y anota el hash en la Entrega.

---

## Entrega

_(Codex, 2026-10-26)_

- Informe: `investigacion/codex-revision-m08-l4-l6.md`.
- Hallazgo: uno medio. No fue posible ejecutar el reconciliador exigido porque los alias de Python de WindowsApps no inician; las cifras quedan pendientes de esa comprobación explícita.
- Verificación: `npm test` 219/219; claves únicas revisadas por script.
- Commit: pendiente de registrar tras crear la entrega.

## Revisión

_(Claude Code)_

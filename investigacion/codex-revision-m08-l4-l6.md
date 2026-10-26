# Revisión cruzada — M08, lecciones 4 a 6

Fecha: 2026-10-26. Alcance: L4--L6, 18 preguntas, `m08-mc29`--`m08-mc55` y tres fichas.

## Hallazgos

- [T042-VER-01] Severidad: media
  Ubicación: ejemplo resuelto de `content/courses/m08/lessons/m08-l6.md`.
  Evidencia: el ticket exige reproducir las cifras con `reconcile.py` sobre la copia del snapshot del 26 y el JSON correcto del 19. En esta sesión, `python.exe`, `py.exe` y `python3.exe` resuelven a los alias de WindowsApps pero no pueden iniciar, por lo que no fue posible ejecutar el reconciliador. No se sustituyó esa ejecución por una cifra calculada a mano.
  Consecuencia: las cifras del ejemplo (código 1, fecha, 2→3 vencidas del Sur, 6→7 total y tres problemas) quedan sin la comprobación independiente requerida.
  Corrección recomendada: ejecutar `reconcile.py` en un entorno con Python real sobre la copia indicada y registrar la salida exacta antes de cerrar la revisión.

## Comprobaciones sin hallazgo

- Las 18 preguntas tienen una sola clave. Las relaciones de longitud revisadas permanecen bajo 1,7; los distractores y conceptos erróneos corresponden a los errores que describen.
- L4 diferencia local, nube, sesión e integración continua sin reciclar `dx-b6-01`; L5 conserva la distinción propia entre hook preventivo, posterior y de término; L6 trata observabilidad y decisión tras un fallo, sin invadir la medición de confiabilidad de versiones de M09.
- Las afirmaciones sobre calendario, identidad, conexiones, retrasos, hooks, ejecución sin interfaz, costo, transcripción y MAST mantienen el alcance de sus fuentes. Las fichas usan correctamente estados `mixed` o `unspecified` cuando las funciones experimentales coexisten con páginas sin estado publicado.
- L4--L6 (aprox. 1 350--1 450 palabras) caben en 25 minutos y no nombran productos en el cuerpo; los detalles de producto permanecen en fichas.

## Fuentes abiertas y resultado

| Fuente | Resultado |
| --- | --- |
| `src-anthropic-cc-scheduled-tasks`, `src-openai-codex-scheduled-tasks`, `src-github-actions-schedule` | Respaldan ubicaciones, dependencia de máquina/sesión, cron y retrasos. |
| `src-anthropic-cc-hooks-guide`, `src-openai-codex-hooks`, `src-github-copilot-hooks` | Respaldan momentos, límites, bloqueos y falta de portabilidad de hooks. |
| `src-anthropic-cc-headless`, `src-openai-codex-noninteractive` | Respaldan ejecución sin interfaz, salida estructurada y configuración. |
| `src-anthropic-cc-costs`, `src-anthropic-cc-routines`, `src-google-sre-cron` | Respaldan costos, estados/transcripción y vigilancia de resultados. |
| `src-arxiv-mast-mas-failures`, `src-arxiv-scaling-agent-systems` | Respaldan categorías de fallo y verificación sin control central. |

## Verificación ejecutada

`npm test`: 14 archivos y 219 pruebas aprobadas. Script de claves únicas ejecutado. Ejecución de `reconcile.py`: bloqueada por ausencia de un intérprete Python funcional, documentada en T042-VER-01.

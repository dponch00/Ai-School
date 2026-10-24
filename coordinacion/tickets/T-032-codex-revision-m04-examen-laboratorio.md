# T-032 — Revisión de M04: banco de examen, laboratorio como caso y práctica

| Campo | Valor |
| --- | --- |
| Para | Codex |
| De | Claude Code |
| Estado | entregado |
| Creado | 2026-10-23 |
| Depende de | T-031 (cerrado) |
| Fase del plan | 3 — Nueve manuales |

## Contexto

T-031 está aplicado: en L5, la regla de no imprimir secretos en los registros queda marcada como inferencia.

Desde **D-025** va un solo ticket por manual completo. M04 es la excepción, porque sus lecciones ya están revisadas, así que este ticket cubre lo que falta. Con él, M04 queda completo y la app lo muestra disponible. Lo nuevo pasó por el agente revisor de texto:

- **Banco de examen** (`questions/exam.json`, `questions/families.json`): 14 familias de una sola decisión, con 3 variantes cada una, 42 ítems en total. La variante `c` es la difícil, y cada familia usa un único enunciado. Por objetivo: eo1 y eo4 tienen 3 familias; eo2, eo3, eo5 y eo6 tienen 2.
- **Laboratorio** (`practice/m04-lab.md`, `practice/m04-lab.json`, `questions/lab.json`): «La etapa que dejó de estar cerrada». Son 6 pasos con 12 preguntas, dos por objetivo. El error sembrado es distinto del caso de las lecciones: el agente quitó «Perdida» de `CLOSED_STAGES`.
- **Práctica** (`questions/practice.json`): 12 preguntas, dos por objetivo.
- **27 conceptos erróneos nuevos:** de `m04-mc44` a `m04-mc70`.

Las cifras del laboratorio salen de correr `calculate()` sobre una copia de `reconcile.py` sin «Perdida», fuera del repositorio. El pipeline abierto sube 60 000 en el Norte, 75 000 en el Centro y 70 000 en el Sur. Las vencidas pasan de 2 a 3 por región. Cambian también las coberturas y los totales; el ponderado no cambia.

Pruebas: `npm test` 148/148 y e2e (resultado en la bitácora de ESTADO).

## Pedido

1. **Banco de examen:**
   - Que cada variante evalúe la decisión de su familia.
   - Que la clave sea única y defendible.
   - Distractores con su concepto erróneo bien asignado.
   - Explicaciones fieles al `sectionRef`.
   - Revisa en especial `m04-f02-c`: dice que el grupo del Norte no aparece porque `WHERE` lo dejó sin filas, y eso es una inferencia a partir de `WHERE` antes de `GROUP BY`. Revisa también `m04-f07-c`: la protección de push bloquea, y la clave pide quitar la clave del commit y revocarla si es real.
2. **Repeticiones** con las comprobaciones de M04, con M01 a M03 y con el diagnóstico B4 (`dx-b4-01` a `dx-b4-04`) y `dx-b3-02`. Dejé fuera a propósito pedir evidencia ante un «ya funciona» y volver al commit bueno. `m04-f14` pide la evidencia concreta que falta cuando ya hay parte de ella; di si queda demasiado cerca de `dx-b4-01`. `m04-p11` (cambio en la tabla de probabilidades fuera de lo pedido) se parece a `dx-b4-03`; dime si hay que reescribirla.
3. **Laboratorio:**
   - Comprueba las cifras del paso 2 contra el código, o repite la simulación.
   - ¿Cada paso trae lo necesario para decidir?
   - ¿El paso 4 (tolerancia de 80 000: pasan los montos y siguen fallando las coberturas y las vencidas) se resuelve con lo que dice el paso?
4. **Práctica:** las mismas comprobaciones que el examen, en versión breve.
5. **Interfaz:** a 360 px, revisa la portada de M04 completa, el laboratorio con sus bloques de código y el inicio del examen.

## Entregables

- `investigacion/codex-revision-m04-examen-laboratorio.md` con los hallazgos en el formato de PROTOCOLO §5, ordenados por severidad.
- La sección **Entrega** de este ticket.

## Archivos permitidos

- `investigacion/codex-revision-m04-examen-laboratorio.md` (nuevo)
- `design/qa/T-032/**`
- La sección Entrega de este ticket y su campo Estado

No edites `src/`, `content/`, `e2e/` ni `ESTADO.md`.

---

## Entrega

_(Codex, 2026-10-23)_

- Informe: `investigacion/codex-revision-m04-examen-laboratorio.md`.
- Resultado: un hallazgo medio. `m04-p11` repite la decisión y el artefacto de política de `dx-b4-03`; se propone una variante de cambio fuera de alcance distinta.
- Verificados: 42 ítems de examen, cifras y decisiones de los seis pasos del laboratorio, práctica, conceptos erróneos, interfaz a 360 px y teclado, y `npm test` (162/162).
- Commit de entrega: pendiente de registrar al crear el commit.

## Revisión

_(Claude Code)_

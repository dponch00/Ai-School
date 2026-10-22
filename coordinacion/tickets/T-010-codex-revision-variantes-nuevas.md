# T-010 — Revisión de las 13 variantes nuevas del banco M02 y de los cambios del laboratorio

| Campo | Valor |
| --- | --- |
| Para | Codex |
| De | Claude Code |
| Estado | abierto |
| Creado | 2026-10-21 |
| Depende de | T-009 (cerrado) |
| Fase del plan | 1 — Piloto (F1-04, F1-05) |

## Contexto

Tu revisión en T-009 mostró que diez familias del banco mezclaban decisiones distintas. Claude reorganizó el banco para que **cada familia mida una sola decisión**:

- 13 ítems que no encajaban pasaron a `questions/practice.json` (uso `practice`, sin familia). El modo práctica necesita su propio banco (estándar §4.1).
- Se escribieron **13 variantes nuevas** para completar las familias: `m02-f02-b`, `f02-c`, `f03-b`, `f03-c`, `f04-c`, `f05-b`, `f05-c`, `f06-a`, `f08-a`, `f09-b`, `f10-a`, `f10-c` y `f12-c`. Nuevo concepto erróneo `m02-mc56`.
- Las claves de F01 ahora nombran el tipo de entregable (EX-01).
- `questions/families.json` documenta, por familia, la decisión que mide y la justificación de equivalencia (EX-03). F07 y F09 se aceptan como equivalentes con justificación explícita.
- Laboratorio: el comando indica la carpeta de trabajo (LAB-01); el cambio del lunes tiene su propio snapshot y se comprueba con el check bajo las dos políticas, sin la pista que adelantaba la respuesta (LAB-02); el tiempo queda marcado como hipótesis (LAB-03). El reconciliador ahora admite `--snapshot` y, si faltan probabilidades, lista **todas** las etapas desconocidas de una vez.

`npm test`: 52/52. `test_reconcile.py`: 10/10.

## Pedido

1. **Las 13 variantes nuevas:** clave inequívoca, prueba de tapar las opciones, pistas, plausibilidad y concepto erróneo de cada distractor.
2. **Equivalencia:** con `families.json` a la vista, ¿cada familia mide ahora una sola decisión con dificultad parecida? ¿Aceptas las justificaciones de F07 y F09 o propones otra cosa?
3. **Independencia:** con F02-c y F09-b ya en el banco de práctica, ¿queda algún solapamiento entre familias del examen?
4. **Laboratorio:** ejecuta el comando del paso 6 con el snapshot del lunes (sin política y con `exclude_and_report`) y el del paso 7 desde `content/courses/m02`.

## Entregables

- `investigacion/codex-revision-variantes-nuevas.md`: hallazgos (formato de PROTOCOLO §5), tabla de las 13 variantes y un juicio por familia.
- Sección **Entrega** de este ticket.

## Criterios de aceptación

- [ ] Las 13 variantes tienen veredicto y las 12 familias, un juicio de equivalencia.
- [ ] Los comandos de los pasos 6 y 7 se ejecutaron y se reporta su salida resumida.
- [ ] Se corrieron `npm test` y `test_reconcile.py`.

## Archivos permitidos

- `investigacion/codex-revision-variantes-nuevas.md` (nuevo)
- Sección Entrega de este ticket y su campo Estado

## Fuera de alcance

Los 23 ítems que no cambiaron (ya revisados en T-009) y la app.

---

## Entrega

_(La llena Codex.)_

- **Qué hice:**
- **Archivos:**
- **Cómo lo verifiqué:**
- **Limitaciones o bloqueos:**
- **Preguntas abiertas:**

## Revisión

_(La llena Claude Code.)_

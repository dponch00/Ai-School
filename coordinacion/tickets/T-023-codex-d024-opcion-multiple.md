# T-023 — D-024: todo de opción múltiple. Revisión del laboratorio como caso y de la app simplificada

| Campo | Valor |
| --- | --- |
| Para | Codex |
| De | Claude Code |
| Estado | entregado |
| Creado | 2026-10-23 |
| Depende de | T-022 (cerrado) |
| Fase del plan | 2 y 3 |

## Contexto: el cambio de rumbo

Daniel decidió el 2026-10-23 (**D-024**, en `docs/decisions.md`) que quiere aprender, no que lo analicen ni perder tiempo llenando formularios. Desde ahora **toda evaluación es de opción múltiple** con explicación por opción, y no hay nada que redactar ni entregar.

**Lo que se quitó de la app:** perfil, «Preparar una evaluación» (reporte para un chat), «Mi ruta» (retroalimentación y ajustes), la entrega del laboratorio (evidencias, cuaderno, autoevaluación y revisiones externas), las microtareas del diagnóstico y los campos de explicación y ayuda declarada de cada pregunta. También el código que los sostenía (`src/report/`, `storage/route.ts`, `storage/learner.ts`, `domain/feedback.ts`, `reviewState`). IndexedDB y el respaldo conservan las tablas antiguas para no perder datos.

**Lo que cambió:**

- **Laboratorio de M02 = caso práctico.**
  - `content/courses/m02/practice/m02-lab.md` cuenta el caso en seis pasos.
  - Cada paso termina con `::lab-questions{step="paso-n"}`.
  - Las 12 preguntas están en `content/courses/m02/questions/lab.json` (`use: "lab"`, `labStep`), dos por objetivo, con escenarios propios.
  - La práctica con un agente queda como apartado opcional «Pruébalo en tu entorno».
  - Se guarda como ronda de comprobación con el ID del laboratorio y cuenta como hecho al responder todo.
- **Confianza:** en vez de los desplegables, una casilla opcional «Estoy muy seguro», que alimenta el repaso de errores.
- **Navegación:** Cursos · Diagnóstico · Mis notas · Respaldo, más el enlace «Buscar». En el pie, «Cómo funciona» y «Glosario». El respaldo tiene pantalla propia (`#/respaldo`).
- **«Cómo funciona»:** reescrita. Para terminar un curso hay que completar las lecciones, resolver el laboratorio y aprobar el examen.
- **Documentación:**
  - `docs/content-standard.md` §5 cambió: laboratorio como caso.
  - `docs/curriculum.md` lleva una nota de D-024 y ya no tiene columna de microtareas.
  - `docs/contracts.md` y `AGENTS.md` quedaron actualizados.
  - Las tres bases de investigación del Bloque A llevan un aviso: los objetivos de producción se reformulan como decisiones y los laboratorios, como casos.
- **El recorrido de Daniel ya no bloquea el Bloque A.** Claude empieza a escribir M01, M03 y M04, y tú los vas a revisar con este criterio: todo de opción múltiple.

`npm test` 106/106 (bajó de 158 porque se borraron las pruebas del código retirado) y `npm run e2e` 46/46. Hay una prueba E2E nueva: el laboratorio no tiene campos de texto y queda hecho al responder todo.

## Pedido

1. **Las 12 preguntas del laboratorio (revisión cruzada; las escribió Claude):** clave correcta y única, distractores plausibles con su concepto erróneo bien asignado, explicación fiel a la lección de `sectionRef`, sin pistas de longitud ni de forma, y dos por objetivo de verdad. ¿Algún escenario repite uno de las comprobaciones, el examen o el diagnóstico? ¿Alguna pregunta se responde sin leer el paso?
2. **El caso (`m02-lab.md`):** ¿cada paso trae lo necesario para decidir? ¿Los datos citados coinciden con `practice/data/` (duplicado OPP-1012 de USD 125 000 y 90 000, OPP-1021 sin fecha, «Negociacion» sin tilde, «En revisión» sin probabilidad, seis montos en EUR, tres oportunidades «En pausa» por USD 410 000)? ¿El giro del lunes sigue funcionando como prueba de transferencia (D-012) en opción múltiple? ¿Cumple `docs/guia-de-estilo.md`?
3. **App simplificada:** a 360 px, en escritorio y con teclado, revisa el laboratorio, el diagnóstico, la portada de M02, «Cómo funciona», «Respaldo» y la casilla «Estoy muy seguro». ¿Queda algún texto, enlace o estilo que mencione perfil, reporte, evaluación externa, entrega o rúbrica? Revisa también el CSS que quedó sin uso.
4. **Diseño:** ¿algo en `design/` o en `docs/design-system.md` describe pantallas que ya no existen? Si lo hay, actualízalo.

## Entregables

- `investigacion/codex-revision-d024.md` con los hallazgos en el formato de PROTOCOLO §5, ordenados por severidad.
- Los cambios de `design/` y `docs/design-system.md`, si hacen falta.
- La sección **Entrega** de este ticket.

## Archivos permitidos

- `investigacion/codex-revision-d024.md` (nuevo)
- `design/**` y `docs/design-system.md`
- La sección Entrega de este ticket y su campo Estado

No edites `src/`, `content/`, `e2e/` ni `ESTADO.md`: Claude aplica los hallazgos.

---

## Entrega

_(Codex · 2026-10-23)_

- Informe: `investigacion/codex-revision-d024.md`.
- Hallazgos: dos altos (clave ambigua en `m02-lab-q01` y repetición sustancial de `m02-lab-q08` con la comprobación de L6), dos medios (regla provisional de `m02-lab-q04` frente a L4 y distribución real de preguntas por paso) y uno bajo (vocabulario/CSS residual de la funcionalidad retirada).
- Diseño actualizado en `docs/design-system.md`: la confianza ahora se documenta como la casilla «Estoy muy seguro» y se retiró la referencia a la pantalla de evaluación en modo oscuro. No había pantallas retiradas descritas en `design/`.
- Verificado: datos del caso contra `practice/data/`; objetivos, claves y referencias de las 12 preguntas; Chromium a 360 px y 1440 px con teclado; `npm run e2e` 46/46.
- Siguiente acción: Claude corrige los hallazgos en `content/` y `src/styles/app.css`, y completa la sección Revisión.

## Revisión

_(Claude Code)_

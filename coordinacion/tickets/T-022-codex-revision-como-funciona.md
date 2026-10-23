# T-022 — Revisión de la página «Cómo funciona» y de la versión de prueba en un solo archivo

| Campo | Valor |
| --- | --- |
| Para | Codex |
| De | Claude Code |
| Estado | cerrado |
| Creado | 2026-10-22 |
| Depende de | T-021 (cerrado) |
| Fase del plan | 2 — Base de app y PWA |

## Contexto

Daniel se perdió al usar la app: no sabía en qué orden estudiar ni quién califica las respuestas de texto. Es lo mismo que le pasaría a cualquier alumno, así que la explicación pasó a la app:

- **`#/como-funciona`** (`src/pages/HowItWorksPage.tsx`): la ruta de un curso en siete pasos, con lo que cuenta y lo que es práctica; quién califica qué (la app corrige la opción múltiple; las respuestas de texto las evalúa un chat externo a partir del reporte); el recorrido de la evaluación hasta registrar la revisión y la retroalimentación; y cuatro avisos previos (progreso local, respaldo, sin conexión, datos ficticios). Los números del examen salen de las constantes del código (`DEFAULT_PASS_RULE`, `ITEMS_PER_OBJECTIVE`, `RETENTION_DAYS`, `RETENTION_RULE`).
- La página se enlaza desde la sección «Tu ruta» de la portada y desde el pie.
- **`scripts/build-single.py`**: arma la versión de prueba en un solo HTML para publicarla como Artifact privado en claude.ai. El visor no deja descargar con `<a download>`, así que un pequeño script intercepta las descargas del reporte y del respaldo y las pasa por la capacidad `downloads` del visor, que pide confirmación. Fuera del visor, la descarga normal sigue igual.

`npm test` 158/158 y `npm run e2e` 48/48 (la ruta nueva incluida, con axe y sin desborde a 360 px).

## Pedido

1. **Exactitud:** compara cada afirmación de la página con lo que hace la app (`src/storage/exam.ts`, `src/domain/scoring.ts`, `src/domain/review-queue.ts`, `src/components/LabSubmission.tsx`, `src/pages/EvaluationPage.tsx`, `src/pages/RoutePage.tsx`). ¿Algo exagera, se queda corto o usa el nombre equivocado de un botón o una sección?
2. **Claridad para un alumno nuevo:** ¿con esta página sabe qué hacer primero y qué hacer con sus respuestas de texto? ¿Falta algo que te habría hecho falta a ti? ¿Cumple `docs/guia-de-estilo.md`?
3. **Interfaz:** 360 px, escritorio y teclado; coherencia con D1 (numeración de pasos, etiquetas «cuenta» y «práctica»).
4. **`scripts/build-single.py`:** revisa el script de descargas (lo que intercepta, qué pasa si la capacidad no está o el usuario rechaza) y que nada sensible quede incrustado en el HTML. No hace falta que lo publiques.

## Entregables

- `investigacion/codex-revision-como-funciona.md` con los hallazgos en el formato de PROTOCOLO §5, ordenados por severidad.
- La sección **Entrega** de este ticket.

## Archivos permitidos

- `investigacion/codex-revision-como-funciona.md` (nuevo)
- `design/qa/T-022/**`
- La sección Entrega de este ticket y su campo Estado

No edites `src/`, `content/`, `e2e/` ni `scripts/`.

---

## Entrega

Revisión entregada en `investigacion/codex-revision-como-funciona.md`.

- Hallazgos: la evaluación externa está marcada erróneamente como paso que «cuenta» para completar el curso; la explicación del calendario de repaso omite que un fallo reinicia el plazo diario; y el puente de descargas puede informar éxito tras un rechazo y captura más descargas de las previstas.
- Verifiqué las reglas de examen, retención, repaso, laboratorio, Evaluación y Mi ruta contra la implementación y los nombres de la interfaz.
- `npm run e2e` pasó: 48/48 en escritorio y 360 px, con axe y sin desborde. También comprobé foco y orden de tabulación de la página con Playwright.

## Revisión

**Claude Code · 2026-10-22 · Veredicto: aceptado, ticket cerrado.** Los 3 hallazgos son válidos y están aplicados:

- **T022-01 (alta):** el paso de la evaluación externa ya no dice «cuenta», dice «profundiza». La página explica que no hace falta para completar el curso. Un recuadro separa «Para completar un curso» (lecciones, laboratorio con autoevaluación y examen aprobado, `plan.md`) de «Para que tu entrega quede como Revisada» (dos revisiones de corridas distintas sin más de un nivel de diferencia). La guía privada de Daniel quedó con el mismo cambio.
- **T022-02 (media):** el repaso de errores se explica como lo hace `review-queue.ts`: vuelve al día siguiente; si se acierta, vuelve a los siete días; dos aciertos seguidos lo sacan; un fallo lo regresa al día siguiente.
- **T022-03 (alta):** se quitó el gancho global sobre `createObjectURL` y `click`. La app guarda el reporte y el respaldo con `saveFile` (`src/app/download.ts`), que espera el resultado. La versión de prueba define `window.__aisSaveFile`, que responde `saved`, `declined` o `unavailable` y atrapa también el rechazo de `claude.use`. Si el archivo no se guardó, la pantalla dice por qué y el reporte no queda registrado como descargado. Fuera del visor se usa el enlace normal, igual que antes.

`npm test` 158/158 y `npm run e2e` 48/48, con la descarga del respaldo cubierta por la prueba de privacidad de notas. La confirmación real del visor de claude.ai no se puede automatizar desde aquí.

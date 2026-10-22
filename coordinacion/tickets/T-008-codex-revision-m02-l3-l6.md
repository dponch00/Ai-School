# T-008 — Revisión de las lecciones 3 a 6 de M02, del diagrama y del reconciliador corregido

| Campo | Valor |
| --- | --- |
| Para | Codex |
| De | Claude Code |
| Estado | entregado |
| Creado | 2026-10-21 |
| Depende de | T-006 y T-007 (cerrados) |
| Fase del plan | 1 — Piloto (F1-03, F1-05) |

## Contexto

Con el patrón ya corregido en T-006 (lecciones en dos capas, D-019), Claude escribió las lecciones 3 a 6 de M02. Con eso las seis están completas. También rehízo el diagrama de la especificación (tu hallazgo T5-01 de T-005) y corrigió cuatro cosas del reconciliador de T-007.

Archivos a revisar:

- `content/courses/m02/lessons/m02-l3.md` a `m02-l6.md` y sus `.json`.
- `content/courses/m02/questions/checks.json`: las 24 preguntas nuevas (de `m02-l2-r1` en adelante).
- `content/courses/m02/product-cards.json`: 8 fichas nuevas (18 en total).
- `content/courses/m02/misconceptions.json`: `m02-mc42` a `m02-mc44`.
- `content/courses/m02/diagrams/m02-spec-anatomy.svg` y `content/courses/m02/assets.json`: el diagrama de las cinco partes de una especificación, ahora con etiquetas.
- `content/courses/m02/practice/data/`: tu reconciliador con las correcciones T7-01 a T7-04 descritas en la revisión de T-007.

`npm test` (49 pruebas) ya comprueba referencias, anclas, citas, fichas, activos, ausencia de productos en el cuerpo, competencias del manual, feedback de al menos dos frases y que la longitud no delate la clave. `python test_reconcile.py` (7 pruebas) comprueba el reconciliador.

## Pedido

Usa subagentes: uno para las lecciones, otro para las preguntas y otro para el diagrama y el reconciliador.

1. **Exactitud.** Muestrea al menos 12 afirmaciones con `:cite[...]` de L3 a L6 contra la investigación de M02 (§2, lecciones 3 a 6) y, si dudas, contra la fuente original.
2. **Coherencia del caso.** Las cifras que aparecen en las lecciones (USD 104 500 por EUR 95 000; Norte 1 201 500; cobertura 1,0x frente a 1,3x; «16 de 16 KPI») deben ser coherentes con los datos de `practice/data/`. Compruébalo.
3. **Pedagogía y volatilidad.** Lo mismo que en T-006: patrón §3.1, 25 minutos, transferencia real, dos capas, voz.
4. **Preguntas.** Clave inequívoca, pistas, plausibilidad, feedback, prueba de tapar las opciones en las 24.
5. **Diagrama.** ¿Explica las cinco partes sin ambigüedad? ¿Se lee a 360 px (Claude lo midió a 328 px de ancho: subtítulos de 12,3 px)? ¿El texto alternativo describe la información?
6. **Reconciliador.** Revisa las correcciones de Claude sobre tu código: avisos de exclusión, dos políticas de duplicados, mensajes en español, UTF-8. ¿Introducen algún error?
7. **Manifiesto.** En `design/asset-manifest.json`, marca `m02-spec-illustration` como reemplazado por `content/courses/m02/diagrams/m02-spec-anatomy.svg` (T5-01). Es tu zona. Si el contrato `Asset` no tiene un campo para eso, propón uno en tu informe y no lo inventes.

## Entregables

- `investigacion/codex-revision-m02-l3-l6.md`: hallazgos (formato de PROTOCOLO §5, por severidad), tabla de afirmaciones muestreadas y tabla por pregunta.
- Actualización de `design/asset-manifest.json` (punto 7), solo si cabe en el contrato actual.
- Sección **Entrega** de este ticket.

## Criterios de aceptación

- [ ] Al menos 12 afirmaciones muestreadas y las cuatro cifras del caso verificadas contra los datos.
- [ ] Las 24 preguntas tienen veredicto.
- [ ] Se corrieron `npm test` y `python test_reconcile.py`, y se reportan los resultados.

## Archivos permitidos

- `investigacion/codex-revision-m02-l3-l6.md` (nuevo)
- `design/asset-manifest.json`
- Sección Entrega de este ticket y su campo Estado

No edites `content/`: Claude aplica las correcciones.

## Fuera de alcance

El banco de examen y las instrucciones del laboratorio para el alumno (los escribe Claude en paralelo), y la app.

---

## Entrega

- **Qué hice:** Revisé L3-L6, las 24 preguntas nuevas, las fichas y conceptos erróneos, el diagrama, el manifiesto y el reconciliador corregido. Incluí 16 afirmaciones contrastadas, las cuatro cifras pedidas y un veredicto para cada pregunta.
- **Archivos:** investigacion/codex-revision-m02-l3-l6.md; este ticket. El manifiesto no se modificó: su contrato actual no admite registrar un reemplazo sin añadir campos nuevos.
- **Cómo lo verifiqué:** Tres subagentes revisaron lecciones, preguntas y diagrama con reconciliador por separado. Ejecuté npm test: 49 de 49. Ejecuté las 7 pruebas de test_reconcile.py con Python 3.14: todas aprobadas.
- **Limitaciones o bloqueos:** El visor local no admite SVG, por lo que la legibilidad a 360 px se comprobó mediante el viewBox, las posiciones y tamaños de fuente; no se simuló una prueba de usuario ni la duración real de las lecciones.
- **Preguntas abiertas:** Claude debe resolver primero el contrato único de KPI entre L3 y reconcile.py. Para registrar T5-01 en el manifiesto, se propone definir status y replacedBy en su contrato antes de editarlo.

## Revisión

_(La llena Claude Code.)_

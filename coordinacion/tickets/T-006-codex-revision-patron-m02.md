# T-006 — Revisión temprana del patrón de M02 (lecciones 1 y 2)

| Campo | Valor |
| --- | --- |
| Para | Codex |
| De | Claude Code |
| Estado | entregado |
| Creado | 2026-10-21 |
| Depende de | T-003, T-004, T-005 (cerrados) |
| Fase del plan | 1 — Piloto (F1-03) |

## Contexto

Antes de escribir las lecciones 3 a 6, Claude escribió las dos primeras completas para fijar el patrón. Si el patrón tiene un defecto, es mucho más barato corregirlo ahora que después de replicarlo en seis lecciones y en nueve manuales más.

Archivos a revisar, todos en `content/courses/m02/`:

- `course.json`: el blueprint (6 objetivos evaluados).
- `lessons/m02-l1.md` y `.json`, `lessons/m02-l2.md` y `.json`: las dos lecciones.
- `questions/checks.json`: 8 comprobaciones y 2 preguntas de repaso.
- `misconceptions.json`: 33 conceptos erróneos tomados de la investigación, más 5 nuevos (`m02-mc34` a `m02-mc38`).
- `product-cards.json`: 4 fichas de producto.

El formato de las directivas está en `docs/content-format.md`. Las reglas que se aplican son las de `docs/content-standard.md` v0.2. La base factual es `investigacion/M02-prompting-especificaciones.md`. `npm test` (46 pruebas) ya verifica las referencias cruzadas, las anclas y las citas, y que la longitud no delate la clave.

## Pedido

Revisa como alumno exigente y como revisor independiente. Puedes usar subagentes: uno para las lecciones y otro para las preguntas.

1. **Exactitud.** Muestrea al menos 12 afirmaciones con `:cite[...]` y compáralas con la investigación y, si dudas, con la fuente original. ¿Alguna exagera, generaliza o atribuye a todos los proveedores lo que dice uno?
2. **Pedagogía:**
   - ¿Siguen el patrón de §3.1 (decisión, comprobación rápida, segmentos, caso resuelto, autoexplicación, ejemplo para completar, comprobación, resumen)?
   - ¿Caben en 25 minutos?
   - ¿El ejemplo para completar es realmente un caso distinto, de transferencia?
   - ¿Hay detalles seductores o relleno?
3. **Volatilidad.** ¿Quedó alguna afirmación que depende de un producto o una versión en el cuerpo de la lección, en vez de en una ficha?
4. **Preguntas** (estándar §4.4): clave inequívoca, pistas, plausibilidad, feedback por opción. Aplica la prueba de tapar las opciones en las 10.
5. **Blueprint.** ¿Los 6 objetivos evaluados son medibles, distintos entre sí y suficientes para el laboratorio de M02?
6. **Voz.** ¿Es español claro, en segunda persona, sin promesas ni superlativos?
7. **Una recomendación de patrón:** qué cambiarías antes de replicarlo en las lecciones 3 a 6.

## Entregables

- `investigacion/codex-revision-patron-m02.md`: hallazgos con el formato de `coordinacion/PROTOCOLO.md` §5, ordenados por severidad; tabla de afirmaciones muestreadas; tabla por pregunta.
- Sección **Entrega** de este ticket.

## Criterios de aceptación

- [ ] Hay al menos 12 afirmaciones muestreadas y comparadas con su fuente.
- [ ] Las 10 preguntas tienen veredicto.
- [ ] Hay al menos una recomendación concreta de patrón.
- [ ] Se corrió `npm test` y se reporta el resultado.

## Archivos permitidos

- `investigacion/codex-revision-patron-m02.md` (nuevo)
- Sección Entrega de este ticket y su campo Estado

No edites `content/`: Claude aplica las correcciones.

## Fuera de alcance

Las lecciones 3 a 6, el banco de examen, el laboratorio y la app. El diagrama SVG de la especificación (T5-01) lo rehace Claude cuando escriba la lección que lo usa.

---

## Entrega

- **Qué hice:** Revisé el blueprint, las dos lecciones, las diez preguntas, los conceptos erróneos y las cuatro fichas. Incluí una muestra de 13 afirmaciones, un veredicto para cada pregunta y una recomendación de patrón para L3-L6.
- **Archivos:** investigacion/codex-revision-patron-m02.md; este ticket.
- **Cómo lo verifiqué:** Dos subagentes hicieron revisiones separadas de lecciones y preguntas; contrasté los hallazgos con el estándar, el formato, el currículo y la investigación de M02. Ejecuté npm test: 46 de 46 pruebas aprobadas.
- **Limitaciones o bloqueos:** No se hicieron cambios a content/, como exige el ticket. La estimación de 25 minutos se evaluó por contenido y conteo de palabras; queda pendiente una pasada cronometrada con alumno.
- **Preguntas abiertas:** Claude debe decidir si C03 se incorpora explícitamente a M02 o se retira de m02-eo2 y de sus ítems.

## Revisión

_(La llena Claude Code.)_

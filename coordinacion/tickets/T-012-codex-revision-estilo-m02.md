# T-012 — Revisión de estilo de las seis lecciones de M02

| Campo | Valor |
| --- | --- |
| Para | Codex |
| De | Claude Code |
| Estado | cerrado |
| Creado | 2026-10-21 |
| Depende de | T-008 y T-010 (contenido de M02 revisado) |
| Fase del plan | 1 — Piloto (F1-03 a F1-06) |

## Contexto

Daniel leyó la lección 1 en la app y dijo que sonaba a texto generado por IA: frases que no tenían sentido, calcos del inglés y un tono poco humano. Pidió que el texto suene a un autor de libros de aprendizaje y que se sume al flujo un agente revisor de texto (D-021).

Lo que se hizo:

- **Guía de estilo:** [`docs/guia-de-estilo.md`](../../docs/guia-de-estilo.md). Pide explicar en vez de enumerar, poner el caso antes de la regla y evitar los calcos de su tabla. Cada término se explica la primera vez que aparece, va como máximo una negrita por párrafo y hay como mucho dos fichas por lección, al final de su apartado.
- **Agente revisor:** `.claude/agents/revisor-de-texto.md`. El estándar de contenido §8 tiene ahora siete pasos, y la revisión de estilo va antes de la tuya.
- **Reescritura de L1 a L6.** Claude reescribió L1, y cinco instancias del revisor reescribieron L2 a L6. Claude revisó cada diff y comprobó el sentido, las cifras del caso, las citas, las directivas y los IDs. En L6 corrigió una frase que atribuía a la fuente «seis secciones», cuando la fuente solo pide secciones fijas.
- **Fichas:** pasaron de 18 a 12. Las que salieron se fundieron en las que quedan o ya estaban cubiertas por el texto citado. Fusiones: suggest-vs-act → autonomy-levels; copilot-agent-task → codex-task-shape; session-scope → instruction-files. Se retiraron speckit-separation, unrequested-additions y ambiguity-mechanisms, cuyas ideas ya están en el cuerpo con su cita, aunque se perdieron nombres concretos como `[NEEDS CLARIFICATION]` y *Decision Log*.
- **Términos:** «condición de terminado» pasó a «cómo saber que está listo» en las preguntas, en los objetivos de L1 y L4, en la rúbrica del laboratorio y en el diagrama (la etiqueta «Está listo cuando…» y el texto alternativo).
- **`[inferencia]`:** en la app se ve como un asterisco discreto con la explicación al pasar el cursor. El Markdown fuente conserva la marca.
- **Prueba nueva:** falla si una lección tiene más de dos fichas. `npm test` pasa 54/54 y `npm run build` también.

Para ver los cambios: `git show` del commit `[claude] Guía de estilo…` o `git diff HEAD~1 -- content/courses/m02`.

## Pedido

Eres el revisor independiente: Claude escribió o supervisó todo este texto. Puedes usar un subagente por lección si lo ves útil.

1. **Voz.** ¿El texto suena a un autor humano que explica a un adulto? Señala las frases que todavía suenen a traducción, a eslogan o a lista disfrazada de prosa, y las que no se entiendan en una primera lectura.
2. **Sentido.** ¿Hay frases que digan algo distinto de lo que querían decir, o pasos de razonamiento que falten?
3. **Hechos sin cambios.** Compara con la versión anterior (`HEAD~1`). ¿Alguna afirmación cambió de alcance (más fuerte, más débil o atribuida a otra fuente)? ¿Alguna cita quedó lejos de lo que respalda?
4. **Fichas.** ¿Las fusiones conservan lo esencial? ¿Echas en falta alguna de las retiradas?
5. **Coherencia.** ¿Las preguntas (checks, examen, práctica) usan los mismos términos que las lecciones nuevas?
6. **La guía.** ¿Le falta o le sobra alguna regla a `docs/guia-de-estilo.md`?

## Entregables

- `investigacion/codex-revision-estilo-m02.md` con los hallazgos en el formato de PROTOCOLO §5, ordenados por severidad. Cada hallazgo indica lección, ancla y cita textual breve, y propone una redacción alternativa.
- La sección **Entrega** de este ticket.

## Criterios de aceptación

- [ ] Se leyeron las seis lecciones completas (también los casos resueltos, los ejercicios y las respuestas modelo).
- [ ] Cada hallazgo de voz o sentido trae una alternativa concreta.
- [ ] Los hallazgos de hechos indican la afirmación de antes y la de ahora.
- [ ] Se corrió `npm test`.

## Archivos permitidos

- `investigacion/codex-revision-estilo-m02.md` (nuevo)
- La sección Entrega de este ticket y su campo Estado

No edites `content/` ni `docs/`: Claude aplica las correcciones.

## Fuera de alcance

El texto del laboratorio (`practice/m02-lab.md`) y el feedback de las preguntas. Pasarán por el revisor en una ronda aparte.

---

## Entrega

_(Codex · 2026-10-22)_

- Informe: [`investigacion/codex-revision-estilo-m02.md`](../../investigacion/codex-revision-estilo-m02.md).
- Se leyeron completas L1–L6, con casos resueltos, ejercicios y respuestas modelo, y se compararon con `git diff 0803162~1 0803162 -- content/courses/m02`.
- Se registran 6 hallazgos: 2 medios y 4 bajos. Los medios evitan que la reescritura atribuya una mejora de exactitud no definida a dar contexto y que presente los archivos de instrucciones como cargados en todas las tareas. Los bajos recuperan dos nombres útiles de la ficha fusionada, aclaran la diferencia entre ejemplo y caso de prueba, corrigen una frase-eslogan y fortalecen la guía para preservar el alcance de las citas.
- Verifiqué que las seis lecciones conservan el mismo número y los mismos IDs de cita, que las tres fusiones principales están cubiertas por las fichas resultantes y que preguntas, práctica y examen usan «está listo» y mantienen sus referencias.
- `npm test`: 54/54 pruebas aprobadas. No se modificaron `content/`, `docs/` ni `ESTADO.md`.
- Siguiente acción: Claude decide qué hallazgos editoriales aplicar y vuelve a ejecutar las pruebas de contenido.

## Revisión

**Claude Code · 2026-10-22 · Veredicto: aceptado, ticket cerrado.** Los 6 hallazgos son válidos y están aplicados:

- **ST-01** (L1 #porque): ya no dice «acierta más». Ahora dice que explicar el motivo le da contexto para priorizar y que la respuesta se ajusta mejor, que es el alcance de la fuente.
- **ST-02** (L2 #capas): se quitó «en todas las tareas». Cada herramienta tiene su archivo, y conviene comprobar que el agente lo cargó.
- **ST-03** (L2 #supuestos): se recuperaron `[NEEDS CLARIFICATION]` y *Decision Log* como ejemplos de etiqueta y de registro. No son nombres de producto, así que se respeta la regla de dos capas.
- **ST-04** (L3 #casos): el título y el resumen dicen «Para comprobar el resultado, usa un caso de prueba».
- **ST-05** (L1 #terminado): la frase-eslogan cambió por una que se puede comprobar.
- **ST-06**: la guía de estilo y el agente `revisor-de-texto` exigen ahora comparar el alcance de cada frase con cita antes y después de reescribirla.

`npm test` 54/54.


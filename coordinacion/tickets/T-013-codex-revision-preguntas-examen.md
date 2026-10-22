# T-013 — Revisión de los bancos reescritos, el laboratorio y el examen en la app

| Campo | Valor |
| --- | --- |
| Para | Codex |
| De | Claude Code |
| Estado | entregado |
| Creado | 2026-10-22 |
| Depende de | T-012 (estilo de las lecciones, cerrado) |
| Fase del plan | 1 — Piloto (F1-04, F1-07, F1-08) |

## Contexto

Hay dos cambios desde T-012.

**1. Estilo de las preguntas y el laboratorio (D-021).** El agente `revisor-de-texto` reescribió el texto visible de:

- `questions/checks.json`: 34 preguntas, casi todo en el feedback.
- `questions/exam.json`: 36 ítems. Los enunciados ahora son iguales dentro de cada familia, y cambian solo los escenarios.
- `questions/practice.json`: 13 ítems.
- `practice/m02-lab.md` y tres textos visibles de `m02-lab.json`.

Claude revisó los diffs. Ningún ID, clave, `misconceptionId`, `sectionRef` ni orden de opciones cambió, y se comprobó por script. Como cada ítem cambió de texto, todas las preguntas subieron de versión (R-05). La clave es la opción más larga en 7 de 36 ítems del examen y en 9 de 34 comprobaciones; el límite es el 40 %.

**2. Persistencia y examen (F1-07 y F1-08).**

- El progreso se guarda en IndexedDB (`src/storage/`). Cada visita a una lección registra la visita, el repaso y las comprobaciones como intentos con la pregunta congelada. La portada del curso muestra el estado de cada lección.
- El examen está en `#/cursos/m02/examen`: 12 preguntas, 2 por objetivo. Cada respuesta se guarda al elegirla y se puede retomar. Un cambio de respuesta queda como revisión. Al enviar se avisa si faltan preguntas, y el resultado se congela con su regla. La revisión muestra el resultado por objetivo y por pregunta. Un reintento cambia la variante de cada familia fallada.
- **Modo piloto:** M02 sigue en `draft`, así que el examen usa los ítems en borrador y lo avisa. La puerta F1-13 decide la publicación.
- **Modo práctica:** `#/cursos/m02/practica`, con las 13 preguntas de práctica y feedback inmediato.

Para verlo: `npm install` y `npm run dev`. Los cambios de texto están en `git log --oneline -6` (commits `[claude]` del 2026-10-22).

## Pedido

Eres el revisor independiente: Claude supervisó tanto el texto como el código. Puedes usar un subagente para los bancos y otro para la app.

1. **Bancos, en la voz.** ¿El feedback explica sin sonar a eslogan ni a traducción? ¿Los enunciados se entienden en una primera lectura?
2. **Bancos, en la medición.** ¿La reescritura volvió alguna clave más evidente o algún distractor menos plausible? En el examen, ¿las tres variantes de cada familia siguen siendo equivalentes (misma decisión y dificultad parecida)? ¿Igualar los enunciados dentro de una familia crea algún problema?
3. **Alcance.** ¿Algún feedback afirma algo que su lección (`sectionRef`) no respalda?
4. **Laboratorio.** Voz y sentido. El paso 3 ahora explica en qué se diferencia el brief de la especificación de la lección 4: ¿es correcto?
5. **Examen en la app**, a 360 px y en escritorio, y con teclado: ¿el flujo es claro (empezar, retomar, enviar con faltantes, revisión, reintento)? ¿El aviso de modo piloto es suficiente? ¿Hay algo que aparente funcionar sin hacerlo?

## Entregables

- `investigacion/codex-revision-preguntas-examen.md` con los hallazgos en el formato de PROTOCOLO §5, ordenados por severidad. Cada hallazgo indica archivo, ID y cita breve, y trae una alternativa concreta.
- La sección **Entrega** de este ticket.

## Criterios de aceptación

- [ ] Se leyeron los tres bancos completos y el laboratorio.
- [ ] El flujo del examen se probó de principio a fin: dos intentos, uno con preguntas sin responder.
- [ ] Se corrieron `npm test` y `npm run build`.

## Archivos permitidos

- `investigacion/codex-revision-preguntas-examen.md` (nuevo)
- `design/qa/T-013/**` (capturas, si ayudan)
- La sección Entrega de este ticket y su campo Estado

No edites `content/` ni `src/`: Claude aplica las correcciones.

## Fuera de alcance

El perfil, el reporte HTML de evaluación y el respaldo (F1-09 y F1-10), y la PWA y el modo offline (Fase 2).

---

## Entrega

_(Codex · 2026-10-22)_

- Informe: [`investigacion/codex-revision-preguntas-examen.md`](../../investigacion/codex-revision-preguntas-examen.md).
- Se leyeron completos los tres bancos (83 ítems) y el laboratorio, incluidos ejercicios, feedback y rúbrica. Se registran 3 hallazgos: 2 medios y 1 bajo.
- La reescritura no cambió IDs, claves, orden de opciones, `misconceptionId`, `sectionRef`, fuentes, familias, variantes, objetivos, proceso ni dificultad. Las 83 referencias de sección resuelven y los indicios de clave por longitud disminuyeron.
- El examen se probó en `#/cursos/m02/examen` a 360 × 780 y 1280 × 800, con teclado, un intento con faltantes y otro completo: aviso, envío, revisión, historial y reintento funcionan sin desbordamiento horizontal. `#/cursos/m02/practica` muestra feedback inmediato y enlaces de repaso correctos.
- `npm test`: 69/69 pruebas aprobadas. `npm run build`: aprobado. No se modificaron `content/`, `src/` ni `ESTADO.md`.
- Siguiente acción: Claude aplica los tres hallazgos y comprueba que cada familia de examen tenga un único `stem` antes de volver a ejecutar prueba y build.

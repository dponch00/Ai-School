# T-051 — Fase 4: revisión de las inferencias declaradas en M01 a M05 y del reflujo con letra grande

| Campo | Valor |
| --- | --- |
| Para | Codex |
| De | Claude Code |
| Estado | entregado |
| Creado | 2026-10-27 |
| Depende de | T-050 (cerrado) |
| Fase del plan | 4 — Integración y revisión |

## Contexto

T-050 no tuvo hallazgos: el recorrido estaba bien y las 110 referencias son correctas. F4-01 y F4-02 quedan cerrados. Este ticket revisa dos tareas que hice mientras tanto.

### F4-04 · D-028 hacia atrás en M01 a M05

D-028 nació en M06, a partir de un hallazgo tuyo en T-037. Una pregunta cuya clave es una regla del curso, y no algo que diga una fuente, lleva `basis: inference`. M01 a M05 se escribieron antes, así que lo apliqué hacia atrás.

**Cómo elegí las candidatas.** Con un script busqué las preguntas cuyo apartado de referencia (`sectionRef`) no tiene ninguna cita, o tiene citas pero no las fuentes que declara la pregunta. Salieron 28. Leí cada apartado y cada clave, y marqué 22:

| Manual | Preguntas | Por qué |
| --- | --- | --- |
| M01 | `m01-f14-a` | La conclusión con alcance (tarea, entradas, fecha) es una regla del curso, marcada `[inferencia]` en `m01-l6#conclusion` |
| M02 | `m02-f01-c` | El objetivo con cuatro preguntas (quién, qué decisión, periodo, criterio) es un marco del curso |
| M03 | `m03-l5-c4`, `m03-f12-b` | Lo que lleva un documento de traspaso es inferencia en `m03-l5#traspaso` |
| M03 | `m03-f14-c` | «La cifra se comprueba contra el cálculo, no contra la cita» es inferencia en `m03-l6#cifras` |
| M04 | `m04-l1-c1`, `m04-l2-r1`, `m04-f01-b`, `m04-f03-a`, `m04-p01` | Probar a mano el valor del límite es inferencia en `m04-l1#frontera`; la fuente solo documenta los operadores |
| M04 | `m04-l6-c1`, `m04-f13-a`, `m04-f13-b`, `m04-f14-c`, `m04-lab-q11`, `m04-lab-q12`, `m04-p11`, `m04-p12` | Las siete preguntas de revisión y las tres salidas (aceptar, pedir cambios, rechazar) son inferencia en `m04-l6#lista` |
| M04 | `m04-f05-a`, `m04-f10-c`, `m04-lab-q10` | Cómo se comporta el cálculo del caso, o «falta que pase la reconciliación», son reglas del propio caso |
| M05 | `m05-l6-r1` | El reparto entre prueba, verificación visual y revisión es inferencia en `m05-l5#coberturas` |

**Las 6 que no marqué:**
- `m02-f07-c`: los supuestos y la ambigüedad tienen respaldo en la documentación de especificaciones.
- `m04-f06-a`, `m04-f06-b` y `m04-p05`: su `sectionRef` es la introducción del caso de L3, y las fuentes de `.gitignore` respaldan la clave.
- `m04-f13-c`: la fuente de paquetes inventados respalda la clave.
- `m05-l1-c1`: la introducción del caso de L1, con las fuentes de los modos de permiso.

Las 22 conservan sus `sourceIds`; solo se agregó `basis`. Los conceptos erróneos de M01 a M05 no los revisé con este método.

### F4-05 · Móvil, ampliación y reflujo

Recorrí con un script las 90 rutas de los diez manuales (portada, seis lecciones, laboratorio y examen) y las páginas generales, con dos pruebas: 320 px de ancho con el texto normal, y 360 px con el texto al 200 %.

- **A 320 px solo fallaba `m07-l2`:** el escenario de `m07-l2-c4` trae `?access_token=TOKEN_FICTICIO_CRM_LECTURA`, una cadena sin espacios. Agregué `overflow-wrap: break-word` y `hyphens: auto` a `.page`.
- **Con la letra al 200 % fallaban casi todas,** por cuadrículas de una sola columna sin `minmax(0, 1fr)`, que toman el ancho mínimo del contenido. Las corregí en `.question__options`, `.lesson-list`, `.route` y `.hero`, y en los pasos de «Cómo funciona». El botón «Comprobar» tampoco cabía; ahora tiene `max-width: 100%`.
- Las 90 rutas y las páginas generales quedaron sin desborde en las dos pruebas. En escritorio, la portada mantiene sus dos columnas (la regla de 960 px no cambió).
- Sumé a `e2e/rutas.spec.ts` seis rutas con la letra al 200 % a 360 px, incluida `m07-l2`. E2E: 158/158. `npm test`: 247/247.

La prueba con teclado sigue cubierta por axe en los E2E. No hice un recorrido manual completo con teclado; si en el tuyo aparece algo, anótalo.

## Pedido

1. **F4-04:** para cada una de las 22, ¿la clave es de verdad una regla del curso o una inferencia, y no algo que diga una de sus fuentes? Si alguna sí tiene respaldo en su fuente, quita la marca en tu propuesta. Y para las 6 que no marqué: ¿alguna debería llevarla?
2. **F4-05:** en la app publicada, con el ancho de un teléfono y la letra grande (zoom del navegador al 200 %, o el tamaño de fuente del sistema si puedes), revisa una portada, una lección con preguntas y un laboratorio. ¿Se lee bien? ¿Los guiones automáticos cortan palabras de forma rara, sobre todo en los términos técnicos?

## Entregables

- `investigacion/codex-f4-inferencias-reflow.md`, con los hallazgos en el formato de PROTOCOLO §5, ordenados por severidad.
- Capturas en `design/qa/T-051/`, si las hay.
- La sección **Entrega** de este ticket.

## Archivos permitidos

- `investigacion/codex-f4-inferencias-reflow.md` (nuevo)
- `design/qa/T-051/**`
- La sección Entrega de este ticket y su campo Estado

No edites `src/`, `content/`, `e2e/`, `scripts/` ni `ESTADO.md`. Haz commit en la rama `main` de `C:\Users\Daniel\Documents\AI\AI_School`, con prefijo `[codex]`, y anota el hash en la Entrega. No hagas push: lo hace Claude al cerrar la ronda.

---

## Entrega

_(Codex · 2026-10-27)_

- Informe: `investigacion/codex-f4-inferencias-reflow.md`.
- Inferencias: se conservan 19 de 22 marcas; propongo retirar tres marcas que
  ya respalda la fuente de Python y añadir una a `m04-f06-b`.
- Reflow: portada, lección con preguntas y laboratorio comprobados a 360 px y
  200 %; sin incidencia visual que requiera captura.
- Commit de entrega: `2dff712d1e49f070cbba0568b34817e313de4c69`.

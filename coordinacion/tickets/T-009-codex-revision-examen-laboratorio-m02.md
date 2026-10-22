# T-009 — Revisión del banco de examen y del laboratorio de M02

| Campo | Valor |
| --- | --- |
| Para | Codex |
| De | Claude Code |
| Estado | abierto |
| Creado | 2026-10-21 |
| Depende de | T-008 (cerrado) |
| Fase del plan | 1 — Piloto (F1-04, F1-05) |

## Contexto

Con esto, el contenido de M02 queda completo. Faltaban dos piezas:

- **Banco de examen** (`content/courses/m02/questions/exam.json`): 36 ítems = 6 objetivos evaluados × 2 familias × 3 variantes (D-016, D-017). Cada variante usa un escenario distinto de los de las comprobaciones. Hay 8 conceptos erróneos nuevos (`m02-mc48` a `m02-mc55`).
- **Laboratorio** (`content/courses/m02/practice/m02-lab.md` y `m02-lab.json`): 7 pasos, dos tarjetas que se revelan durante el trabajo (las respuestas del director y el cambio del lunes), una rúbrica de 5 criterios con 3 críticos y el cuaderno de decisiones de transferencia (D-012). Usa los datos y el check de T-007, ya alineados con el contrato pipeline_kpis v1 (T-008).

`npm test` (51 pruebas) comprueba el contrato de cada ítem, las referencias, que el banco no tenga familias en dos objetivos, que cada objetivo tenga al menos 2 familias, que se pueda armar un examen de 12, que no se repitan escenarios de las comprobaciones, el feedback de al menos dos frases y que la clave no sea la opción más larga o la más corta en más del 40 % de los ítems.

Eres el revisor distinto del autor que exige el estándar para las claves (§4.4).

## Pedido

Usa subagentes: uno para el banco de examen y otro para el laboratorio.

**A. Banco de examen** (estándar §4.2 a §4.4):

1. **Clave inequívoca** en los 36 ítems y prueba de tapar las opciones en todos.
2. **Equivalencia de variantes.** Dentro de cada familia, ¿las tres variantes miden la misma decisión con una dificultad parecida? Señala las variantes que sean claramente más fáciles o más difíciles, o que midan otra cosa. La equivalencia se declara como supuesta: tu juicio es la única evidencia que tendremos antes del piloto.
3. **Pistas:** palabras repetidas entre enunciado y clave, absolutos, opciones que convergen, una opción claramente distinta del resto.
4. **Plausibilidad** de cada distractor y correspondencia con su concepto erróneo. Revisa en especial los 8 nuevos.
5. **Independencia:** que ningún ítem del banco dé la respuesta de otro de la misma familia o del mismo objetivo.

**B. Laboratorio** (estándar §5):

1. ¿Las instrucciones bastan para hacerlo sin ayuda? ¿Cabe en 75 a 90 minutos?
2. ¿La rúbrica se puede aplicar con los dos ejemplos anclados? ¿Los criterios críticos son los correctos?
3. ¿La tarjeta del cambio del lunes (etapa «En pausa») pone a prueba de verdad la especificación? ¿Hay una respuesta «correcta» demasiado obvia?
4. ¿El paso 7 opcional y el comando del check funcionan como están escritos? Ejecútalo con los fixtures.

**C. Manifiesto.** El contrato `Asset` ya tiene `status` (`active` / `replaced`) y `replacedBy`. Marca `m02-spec-illustration` en `design/asset-manifest.json` como `replaced` por `content/courses/m02/diagrams/m02-spec-anatomy.svg` (pendiente de T-008) y comprueba que `npm test` sigue pasando.

## Entregables

- `investigacion/codex-revision-examen-laboratorio-m02.md`: hallazgos (formato de PROTOCOLO §5, por severidad), tabla por ítem (ID, clave, pistas, equivalencia con su familia, veredicto) y revisión del laboratorio.
- `design/asset-manifest.json` actualizado.
- Sección **Entrega** de este ticket.

## Criterios de aceptación

- [ ] Los 36 ítems tienen veredicto, y las 12 familias, un juicio de equivalencia.
- [ ] El laboratorio tiene un veredicto por cada uno de los 4 puntos de B.
- [ ] Se corrieron `npm test` y `python test_reconcile.py`, y se reportan los resultados.

## Archivos permitidos

- `investigacion/codex-revision-examen-laboratorio-m02.md` (nuevo)
- `design/asset-manifest.json`
- Sección Entrega de este ticket y su campo Estado

No edites `content/`: Claude aplica las correcciones.

## Fuera de alcance

La app y los otros manuales.

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

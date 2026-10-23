# T-029 — Revisión de M03: banco de examen, laboratorio como caso y práctica

| Campo | Valor |
| --- | --- |
| Para | Codex |
| De | Claude Code |
| Estado | entregado |
| Creado | 2026-10-23 |
| Depende de | T-028 (cerrado) |
| Fase del plan | 3 — Nueve manuales |

## Contexto

Apliqué T028-01: la longitud ya no delata la clave en las seis preguntas señaladas, y en el banco de comprobaciones la clave queda como la opción más larga en 4 de 34. Con esta entrega, M03 está completo y la app lo muestra como disponible. Lo nuevo es esto, pasado por el agente revisor de texto:

- **Banco de examen** (`questions/exam.json`, `questions/families.json`):
  - 14 familias de una sola decisión, con tres variantes cada una (42 ítems); la `c` es la difícil.
  - Hay un enunciado por familia. Por objetivo: eo1, eo2 → 3 familias cada uno; eo3–eo6 → 2 cada uno.
- **Laboratorio** (`practice/m03-lab.md`, `practice/m03-lab.json`, `questions/lab.json`): «El repositorio del presupuesto 2027», con 6 pasos y 12 preguntas, dos por objetivo evaluado.
- **Práctica** (`questions/practice.json`): 12 preguntas, dos por objetivo.
- **Conceptos erróneos nuevos:** `m03-mc48` a `m03-mc65`, que salieron al escribir los distractores.

Pruebas: `npm test` 134/134 y e2e 66/66, con las rutas nuevas del laboratorio y el examen de M03.

## Pedido

1. **Banco de examen (revisión cruzada):**
   - Que cada variante evalúe la decisión de su familia y que las tres sean equivalentes en dificultad, salvo la `c`.
   - Que la clave sea única y defendible.
   - Distractores con su concepto erróneo bien asignado y explicaciones fieles al `sectionRef`.
   - Ojo con `m03-f14-c`: su `sectionRef` es `m03-l6#cifras`, una sección marcada como inferencia, y cito `src-anthropic-citations` como apoyo indirecto. Di si te parece suficiente.
2. **Repeticiones de fondo** con las comprobaciones de M03, M01, M02 y el diagnóstico B3. Estas cuatro las conozco y no las evité del todo:
   - `dx-b3-01` (sesión larga que ignora una restricción) frente a `m03-f01` y `m03-f02-c`;
   - `dx-b3-02` (regla que no puede fallar) frente a `m03-f07-a` y `m03-lab-q01`;
   - `dx-b3-03` (dos herramientas, una sigue las reglas) frente a `m03-f05-b`, la más parecida;
   - `dx-b3-04` (traspaso a otra herramienta) frente a `m03-f12` y `m03-lab-q12`.

   Di cuáles revelan la respuesta y hay que reescribir.
3. **Laboratorio:**
   - ¿Cada paso trae lo necesario para decidir?
   - ¿El paso 2 se resuelve con L2 y su ficha de precedencias? El caso es una herramienta que solo carga su propio archivo de instrucciones.
   - ¿El paso 6 funciona como prueba de transferencia (D-012)? Obliga a aplicar en un traspaso real lo que se vio con el caso del viernes de L5.
4. **Práctica:** las mismas comprobaciones que el examen, en versión breve. En `m03-p07` revisa las reglas del nombre de una skill contra la especificación.
5. **Interfaz:** a 360 px, revisa la portada de M03 completa, el laboratorio y el inicio del examen.

## Entregables

- `investigacion/codex-revision-m03-examen-laboratorio.md` con los hallazgos en el formato de PROTOCOLO §5, ordenados por severidad.
- La sección **Entrega** de este ticket.

## Archivos permitidos

- `investigacion/codex-revision-m03-examen-laboratorio.md` (nuevo)
- `design/qa/T-029/**`
- La sección Entrega de este ticket y su campo Estado

No edites `src/`, `content/`, `e2e/` ni `ESTADO.md`.

---

## Entrega

- Informe: investigacion/codex-revision-m03-examen-laboratorio.md.
- Hallazgos: T029-01 (alta), ambigüedad sobre la importación; T029-02 (alta), repeticiones que revelan decisiones del diagnóstico B3; T029-03 (media), fuente indirecta de m03-f14-c.
- Verificación: npm test (134/134) y revisión en navegador a 360 px.
- Estado: entregado.

## Revisión

_(Claude Code)_

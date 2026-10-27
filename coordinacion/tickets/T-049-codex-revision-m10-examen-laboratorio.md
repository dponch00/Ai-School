# T-049 — Revisión de M10: banco de examen, laboratorio como caso y práctica

| Campo | Valor |
| --- | --- |
| Para | Codex |
| De | Claude Code |
| Estado | entregado |
| Creado | 2026-10-27 |
| Depende de | T-048 (cerrado) |
| Fase del plan | 3 — Nueve manuales |

## Contexto

T-048 está aplicado:
- **Recargar:** ya no se dice que «no basta», sino que no garantiza la versión nueva mientras quede una pestaña con la anterior.
- **Terminología:** M10 usa «biblioteca», como M04.

Con esta entrega, **M10 queda completo y, con él, los diez manuales**. Lo nuevo pasó por el agente revisor de texto, que además equilibró las longitudes y completó los feedback de una sola frase.

- **Banco de examen:** 42 preguntas en 14 familias (`questions/exam.json`, documentadas en `families.json`). Hay 2 familias por objetivo y 3 en `eo2` y `eo3`. Para no repetir el problema de `m09-f14`, cada familia evalúa una sola decisión, con un enunciado propio:
  - **`f10`:** solo el número de versión.
  - **`f12`:** solo qué falta declarar.
  - **`f14`:** solo si un hallazgo está cerrado. La variante c tiene como clave «sí, está cerrado».
- **Laboratorio como caso:** «El simulador de descuentos» (`practice/m10-lab.md`, `questions/lab.json`), tomado de la §5 de la investigación, que ya proponía un caso nuevo.
  - **Usuarios y datos:** vendedores en visita, con el teléfono y sin buena señal, y una lista de precios con la política de descuentos de FP&A.
  - **El giro del paso 6:** hay que mudar la app a otra dirección. Los escenarios guardados no se mudan solos, y el hallazgo «no hay forma de exportar» se había cerrado como aceptado, sin responsable ni condición para reabrirlo. Eso obliga a revisar la decisión del paso 3.
  - **Cifras:** las de la tabla del laboratorio las recalculé con decimales exactos el 2026-10-27, incluido el caso límite de 22,00 %.
- **Práctica:** 12 preguntas.
- **11 conceptos erróneos nuevos,** `m10-mc63` a `m10-mc73`.
- **E2E:** portada, L2, L4, L6, laboratorio y examen de M10.

**Sobre el giro.** Que los datos del navegador no se mudan lo enseñan L3 y L4, así que en el laboratorio es una aplicación y no una sorpresa. Lo que obliga a revisar es la decisión del paso 3 y el hallazgo aceptado sin condición. Ya lo comenté en T-048, y la Entrega no lo objetó.

**El revisor de texto:**
- **forma:** equilibró las longitudes (clave más larga en 5 de 42 en el examen y en 1 de 12 en el laboratorio) y agregó una segunda frase a unos 70 feedback;
- **escenarios:** reescribió 11 escenarios del examen que se parecían demasiado a los de las comprobaciones, y los de `f11`, que eran fragmentos sueltos;
- **`f02-c`:** rehízo sus opciones, que no respondían al enunciado;
- **laboratorio:** agregó conectores para que los pasos se lean como un caso continuo.

**Lo que apliqué yo, a partir de sus dudas:**
- **Distractores con un concepto erróneo que no les correspondía:** sumé de `mc74` a `mc81` y reasigné `f14-c`, `f02-b`, `f02-c`, `f12-c`, `f03-c`, `p03`, `p07`, `p09` y `p10`.
- **La clave de `f02-c`** pedía comparar con una línea base que el caso dice que no existe. Ahora es «el tiempo de aprobación frente a registros de antes», y el feedback explica que la línea base se reconstruye con esos registros y que, hasta tenerla, no se anuncia una mejora.

`npm test` 247/247 y E2E 146/146.

## Pedido

1. **Claves y distractores:**
   - que cada pregunta tenga una sola clave defendible y fiel a su `sectionRef`;
   - que cada distractor apunte al concepto erróneo que describe su error;
   - que las claves acortadas para equilibrar longitudes sigan siendo claras.

   Casos que conviene mirar:
   - **`m10-f01-c`:** el alcance mínimo útil es no construir la app, solo una columna en un reporte.
   - **`m10-f06-b`:** una preferencia que no se protege.
   - **`m10-f14-c`:** la clave afirmativa.
   - **`m10-lab-q06`:** la migración con «dólares» como moneda asignada.
   - **`m10-lab-q11`:** reabrir el hallazgo y la decisión del paso 3.
2. **Equivalencia de las variantes:** que las tres de cada familia evalúen la misma decisión, como dice `families.json`.
3. **Escenarios repetidos:** ninguno debe repetir las 34 comprobaciones de M10, los ejemplos resueltos de sus lecciones, M01 a M09 ni el diagnóstico (`dx-b5-02`, `dx-b2-01`, `dx-b2-04`). Revisa sobre todo:
   - `m10-f02-c`, frente a `m10-l3-r2` (línea base);
   - `m10-f14-a`, frente al H4 del ejemplo de L6 (contraste);
   - `m10-lab-q05` y `q06`, frente al ejemplo de L3.
4. **Laboratorio:**
   - que los seis pasos se lean como un caso continuo;
   - que las cifras de la tabla y la política sean coherentes con las preguntas;
   - que no quede ningún producto nombrado en el texto.
5. **Fuentes:** que los `sourceIds` respalden cada pregunta, y que las marcadas con `basis: inference` sean de verdad reglas del curso.

## Entregables

- `investigacion/codex-revision-m10-examen-laboratorio.md` con los hallazgos en el formato de PROTOCOLO §5, ordenados por severidad.
- La sección **Entrega** de este ticket.

## Archivos permitidos

- `investigacion/codex-revision-m10-examen-laboratorio.md` (nuevo)
- `design/qa/T-049/**`
- La sección Entrega de este ticket y su campo Estado

No edites `src/`, `content/`, `e2e/` ni `ESTADO.md`. Haz commit en la rama `main` de `C:\Users\Daniel\Documents\AI\AI_School`, con prefijo `[codex]`, y anota el hash en la Entrega. No hagas push: lo hace Claude al cerrar la ronda.

---

## Entrega

_(Codex, 2026-10-27)_

- Informe: `investigacion/codex-revision-m10-examen-laboratorio.md`.
- Alcance revisado: 42 ítems en 14 familias, laboratorio de 12 preguntas, práctica de 12 preguntas y conceptos erróneos asociados.
- Hallazgos: cinco (cuatro medios y uno bajo). Dos solapes del examen con material ya resuelto; una clave del laboratorio que presupone propiedad/aprobación; un *feedback* que supone una condición ausente; y una asignación de concepto erróneo demasiado estrecha para un distractor de tabla.
- Verificación: claves, `sectionRef`, fuentes, longitudes, familias y cifras de los seis casos de descuento recalculadas; el límite de 22,00 % pasa.
- Commit: pendiente de crear; se anotará el hash en el siguiente commit de registro.

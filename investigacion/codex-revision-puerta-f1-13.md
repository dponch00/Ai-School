# Revisión independiente de la puerta F1-13

**Fecha:** 2026-10-22  
**Alcance:** `docs/puerta-f1-13.md`, contenido M02, investigaciones de Codex e historial Git. No se modificaron `docs/`, `src/` ni `content/`.

## Hallazgos

- [P016-01] Severidad: alta
  Ubicación: `docs/puerta-f1-13.md` §2; `investigacion/codex-revision-diagnostico-contratos.md` §B.
  Evidencia: la fila T-004 declara 5 altos y 7 medios, que son solo DX-01 a DX-06. El mismo informe contiene además CTR-01 a CTR-03 (3 altos) y CTR-04 a CTR-06 (3 medios). Al incluirlos, T-004 tiene 8 altos y 10 medios; el total de los informes enumerados pasa de 21 altos, 42 medios y 14 bajos (77) a **24 altos, 45 medios y 14 bajos (83)**. La frase «15 revisiones» tampoco corresponde con las 12 filas de revisión de la tabla; solo se sostiene si nombra todos los tickets T-001 a T-015, incluidos tres encargos de entrega que la tabla excluye.
  Consecuencia: la evidencia de D-011 subcuenta hallazgos altos de contratos. Aunque fueron corregidos, la puerta no deja una traza auditable de que esos tres altos se cerraron y comprobaron.
  Corrección recomendada: separar T-004 en diagnóstico (5/7) y contratos (3/3), o sumar ambos en la fila (8/10), recalcular el total a 83 y precisar si «15» son tickets de Codex o revisiones independientes. Añadir a la fila de contratos el commit/prueba que acredita cada cierre.
  Verificado: revisión manual de DX-01…DX-06 y CTR-01…CTR-06; el informe de puerta ya nombra T-004 como «diagnóstico y contratos».

- [P016-02] Severidad: media
  Ubicación: `docs/puerta-f1-13.md` §3 y §4; `git log`.
  Evidencia: Git confirma Fase 0 de 16:37 a 18:39 (≈2 h), pero el tramo de contenido M02 va de 18:47 a 21:31 (2 h 44 min, ≈2,7 h, no 2,9). Para la app, el primer commit F1-01/F1-02 es 21:40 del 21 oct y F1-11 es 09:46 del 22 oct: 12 h 06 min de reloj, no 5 h. La reescritura de estilo queda entre D-021 (22:42) y su revisión (07:48): 9 h 05 min de reloj, no 1,5. Git no puede distinguir trabajo activo, espera nocturna, créditos ni paso de tickets. El intervalo del banco de 36 ítems es 20:46–21:31 (45 min), pero esos commits también incluyen laboratorio, práctica y correcciones; no hay desglose de autoría, revisión y corrección solicitado por D-016.
  Consecuencia: la recomendación de mantener 36 ítems y la proyección de Fase 3 son razonables como hipótesis, pero no están sustentadas como medición de esfuerzo real. Daniel no puede comparar con evidencia el costo de 36 frente a 24 ítems.
  Corrección recomendada: cambiar la tabla a «intervalos entre commits» cuando use Git y registrar por separado tiempo activo, espera y alcance. Para D-016, anotar en el siguiente manual tiempo de autoría, revisión y corrección del banco, aislado del laboratorio. Mantener 36 en el Bloque A como decisión provisional, con un punto de recalibración tras M03 o M04.
  Verificado: `git log --reverse` y los commits `cb245ff`, `5b3674a`, `1cf768c`, `84b1596`, `a4c1513`, `0803162` y `8c6a447`.

- [P016-03] Severidad: baja
  Ubicación: `docs/puerta-f1-13.md` §3.
  Evidencia: la proyección dice 4–5 h por manual y 40–45 h para nueve. Multiplicar el rango declarado por nueve da 36–45 h.
  Consecuencia: el extremo inferior de la proyección no se puede reconstruir; dificulta usarla como rango de planificación.
  Corrección recomendada: publicar 36–45 h si el rango por manual ya incluye imágenes, o justificar una base mínima de 4,4 h antes de conservar 40–45 h.
  Verificado: cálculo directo sobre los rangos declarados en la puerta.

## Verificaciones sin hallazgo

### Matriz objetivo → evidencia

La matriz es correcta frente a los archivos actuales y la prueba `matriz objetivo → lección → actividad → evidencia completa` pasa.

| Objetivo | Objetivos de lección | Comprobaciones | Familias | Criterio de rúbrica |
| --- | --- | --: | --- | --- |
| m02-eo1 | L1-o1, L1-o2 | 4 | f01, f02 | objetivo-alcance |
| m02-eo2 | L2-o1…o3 | 6 | f03, f04 | definiciones-supuestos |
| m02-eo3 | L3-o1…o3 | 6 | f05, f06 | casos-contrato |
| m02-eo4 | L4-o1…o3 | 6 | f07, f08 | objetivo-alcance; hitos-prompt |
| m02-eo5 | L5-o1…o3 | 6 | f09, f10 | hitos-prompt |
| m02-eo6 | L1-o3; L6-o1…o3 | 6 | f11, f12 | aceptacion-evidencia |

Los conteos suman 34 comprobaciones y 12 familias de examen. Los 36 ítems de examen son tres variantes por familia y la cobertura es de dos familias por objetivo. Las 83 preguntas del curso se descomponen en 34 comprobaciones, 36 de examen y 13 de práctica.

### Rúbrica del laboratorio

El nuevo mapeo de `m02-lab.json` es semánticamente correcto:

- `objetivo-alcance` cubre eo1 (usuario, decisión, periodo, umbral) y eo4 (exclusiones, límites y ejecución autónoma).
- `definiciones-supuestos` cubre eo2; `casos-contrato`, eo3.
- `hitos-prompt` cubre eo4 (política de ambigüedad) y eo5 (hitos con prueba y control humano).
- `aceptacion-evidencia` cubre eo6 mediante escenarios observables, caso negativo, comprobación y evidencia ejecutable.

No hay objetivo de la práctica sin criterio y los descriptores no atribuyen un objetivo que no midan.

### Hipótesis y datos para decidir

- Es correcto dejar sin datos el tiempo de estudio y el reintento: requieren el recorrido de Daniel.
- Retención está declarada en el contrato como `kind: retention`, pero la interfaz no la implementa; «sin implementar» es exacto.
- La doble evaluación tiene contrato y validación de dos corridas, pero no tiene flujo de registro en la interfaz; «sin probar» es exacto.
- La hipótesis editorial de ítems sí pasa su parte estructural: los 83 enunciados están por debajo de 120 palabras (máximo: 12) y los 252 feedbacks tienen 2–3 frases. Las revisiones de Codex no registran falta de información ni feedback ilegible. Falta todavía la lectura de Daniel para cerrar su parte cualitativa.
- El peso de imágenes coincide con los archivos: 480/960 px pesan 18–104 KB; los 1600 px pesan 210 KB (`hero`) y 278 KB (`m02-cover`).

## Información que Daniel necesita

La puerta ofrece decisiones accionables y enumera el recorrido pendiente. Para decidir el tamaño del banco con evidencia comparable, hace falta corregir P016-02: un registro aislado de esfuerzo editorial por manual y un punto explícito de recalibración. Hasta entonces, abrir el Bloque A con 36 ítems es una decisión de producto provisional, no una conclusión medida del piloto.

## Comprobación ejecutada

`npm test` finalizó correctamente: 9 archivos y 110 pruebas aprobadas.


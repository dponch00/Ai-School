# T-051 — Inferencias declaradas y reflow con letra grande

**Revisión independiente de Codex · 2026-10-27**

## Alcance y método

Revisé las 22 preguntas de M01 a M05 que ya llevan `basis: "inference"`, las
seis descartadas por la ronda anterior, sus claves, `sectionRef` y `sourceIds`.
Contrasté los casos límite con los apartados de las lecciones y con las fuentes
primarias pertinentes, en particular la documentación de control de flujo de
Python, el artículo de Git sobre `.gitignore`, la guía de especificaciones y la
guía de trabajo de larga duración.

En la publicación recorrí a 360 px, con el zoom del navegador al 200 %, la
portada de M01, M04 L1 con sus cuatro comprobaciones y el laboratorio de M05.
La inspección incluyó los encabezados, los enunciados, las opciones, el control
«Estoy muy seguro» y los botones «Comprobar».

## Hallazgos

- [T051-I01] Severidad: baja
  Ubicación: `content/courses/m04/questions/checks.json` `m04-l1-c1`; `content/courses/m04/questions/exam.json` `m04-f01-b`; `content/courses/m04/questions/practice.json` `m04-p01`
  Evidencia: las tres claves aplican de forma directa los operadores `<`, `>` o
  `>=` a los valores del enunciado. `src-python-controlflow` respalda esa
  semántica; no dependen de la regla pedagógica de probar manualmente el límite.
  Consecuencia: la marca presenta como conclusión propia del curso una clave que
  la fuente sí respalda, y vuelve menos nítida la distinción de D-028.
  Corrección recomendada: retirar `basis: "inference"` de esas tres preguntas.

- [T051-I02] Severidad: baja
  Ubicación: `content/courses/m04/questions/exam.json`, `m04-f06-b`
  Evidencia: la clave («se versiona: las pruebas lo necesitan») aplica al caso
  la regla del curso de conservar los datos sintéticos de entrada para repetir
  las pruebas. `src-git-gitignore` explica qué patrones ignora Git y menciona
  archivos generados, pero no prescribe versionar una fixture de prueba.
  Consecuencia: falta la señal de que esta decisión es una regla del caso y no
  una afirmación directa de la fuente.
  Corrección recomendada: añadir `basis: "inference"` a `m04-f06-b`, sin quitar
  su `sourceIds`.

## Inferencias revisadas sin hallazgo

Verificado: las otras 19 marcas son apropiadas. Son reglas que el curso formula
como inferencia o decisiones del caso: alcance de una comparación (M01), las
cuatro piezas de un objetivo (M02), traspaso y cálculo frente a cita (M03),
prueba de frontera, efectos del caso, revisión de diffs y evidencia (M04), y
el reparto de cobertura entre prueba, inspección visual y revisión (M05).

Verificado: de las otras cinco preguntas no marcadas —`m02-f07-c`,
`m04-f06-a`, `m04-p05`, `m04-f13-c` y `m05-l1-c1`— ninguna necesita la marca.
Sus claves se sostienen directamente en sus fuentes: especificaciones con
ambigüedad explícita, patrones de `.gitignore` para resultados generados,
verificación de dependencias nuevas y límites de sandbox/red.

## Reflow a 360 px y 200 %

No se encontraron hallazgos críticos, altos, medios ni bajos.

Verificado: a 360 px y 200 % se conservaron la portada y sus accesos, los
cuatro grupos de pregunta y sus botones de M04 L1, y los doce grupos de
pregunta del laboratorio de M05. No apareció desplazamiento horizontal,
recorte de controles ni guionado extraño en términos técnicos. No se guardaron
capturas: no hubo una anomalía visual que necesitara evidencia gráfica.

## Resultado

- Marcas actuales que se conservan: **19/22**.
- Marcas que se deberían retirar: **3** (`m04-l1-c1`, `m04-f01-b`, `m04-p01`).
- Marcas que se deberían añadir entre las descartadas: **1** (`m04-f06-b`).
- Hallazgos de reflow que requieren cambio: **0**.

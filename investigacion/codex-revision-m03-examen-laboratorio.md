# Revisión cruzada de M03: examen, laboratorio y práctica — T-029

**Fecha:** 2026-10-23  
**Alcance:** 42 ítems de examen en 14 familias, laboratorio «El repositorio del presupuesto 2027», 12 preguntas de práctica y conceptos erróneos `m03-mc48`–`m03-mc65`.

## Resumen de revisión

El banco contiene 14 familias con tres variantes cada una, 42 ítems y una sola clave por ítem. Las variantes mantienen la decisión de su familia; las `c` introducen una distracción o una condición adicional sin cambiarla. Los distractores revisados refieren un concepto erróneo que corresponde a su razonamiento, y sus explicaciones reproducen correctamente la decisión del `sectionRef`.

Están presentes los 18 conceptos erróneos `m03-mc48`–`m03-mc65`. La práctica cubre dos preguntas por objetivo y `m03-p07` aplica correctamente las reglas de `name`: máximo 64 caracteres, minúsculas, dígitos y guiones, y coincidencia con la carpeta.

El laboratorio tiene seis pasos, dos preguntas por paso y dos preguntas por objetivo. El paso 6 usa un contexto diferente al de L5 y exige estado, siguiente paso, verificación y alternativa descartada, por lo que funciona como transferencia. El paso 2, en cambio, no establece que la herramienta del compañero admita la importación que exige su clave.

Las rutas de portada, laboratorio e inicio de examen se inspeccionaron en navegador. En una vista de 360 × 780 no hubo desborde horizontal; los enlaces, radios, casilla de confianza y botones se alcanzan con teclado. Las pruebas de contenido pasaron (`npm test`, 134/134). La corrida integral de E2E quedó iniciada y la salida parcial mostró las rutas M03 de escritorio correctas; no la cuento como verificación completa porque el proceso de vista previa quedó activo antes del resumen final.

## Hallazgos

- [T029-01] Severidad: alta
  Ubicación: `content/courses/m03/questions/lab.json`, `m03-lab-q04`; `content/courses/m03/practice/m03-lab.md`, paso 2
  Evidencia: el caso solo afirma que la herramienta del compañero «solo carga su propio archivo de instrucciones». La clave exige «hacer que importe el AGENTS.md», pero no identifica la herramienta ni declara que admita importaciones. La propia lección ofrece dos correcciones mínimas: crear un archivo que importe **o** cambiar el ajuste de carga para que lea ambos (`m03-l2#compartido`, líneas 42 y 63). La segunda no aparece entre las opciones.
  Consecuencia: para una herramienta que no soporte esa sintaxis de importación, la clave no es defendible y la pregunta evalúa una capacidad que el caso no dio.
  Corrección recomendada: nombrar una herramienta que admita importaciones y su sintaxis, o cambiar el caso para declarar que el archivo propio puede importar `AGENTS.md`; como alternativa, ofrecer «cambiar el ajuste para cargar ambos» y ajustar la clave según la superficie indicada.

- [T029-02] Severidad: alta
  Ubicación: `content/diagnostic/items.json`, `dx-b3-02`, `dx-b3-03` y `dx-b3-04`; `content/courses/m03/questions/exam.json`, `m03-f05-b`, `m03-f07-a` y familia `m03-f12`; `content/courses/m03/questions/lab.json`, `m03-lab-q01` y `m03-lab-q12`
  Evidencia: `dx-b3-02` ya entrega como respuesta un control que rechaza secretos; `m03-f07-a` y `m03-lab-q01` vuelven a pedir el control determinista para una prohibición sin excepciones. `dx-b3-03` y `m03-f05-b` tienen la misma estructura: dos herramientas, una ignora instrucciones, y la clave es comprobar los archivos cargados. `dx-b3-04` y `m03-f12`/`m03-lab-q12` dan la misma receta de traspaso: estado, siguiente paso y verificación, con la variante M03 añadiendo lo descartado.
  Consecuencia: quien recuerde la clave del diagnóstico puede responder tres decisiones del examen o del laboratorio sin aplicar los matices enseñados en M03; se debilita la independencia de la medición.
  Corrección recomendada: reescribir `m03-f05-b` con una causa de carga que requiera distinguir una superficie o un límite de tamaño, y cambiar `m03-f07-a`/`m03-lab-q01` a una decisión de alcance o frecuencia. Para `m03-f12` y `m03-lab-q12`, conservar el traspaso pero pedir detectar un defecto específico en borradores que ya contengan estado y siguiente paso, de modo que la verificación o lo descartado sea la decisión nueva. `dx-b3-01` frente a `m03-f01` y `m03-f02-c` comparte tema, pero no revela una única clave: distingue contexto contaminado de una regla que debe persistir.

- [T029-03] Severidad: media
  Ubicación: `content/courses/m03/questions/exam.json`, `m03-f14-c`; `content/courses/m03/lessons/m03-l6.md`, `#cifras`
  Evidencia: el registro de la pregunta solo cita `src-anthropic-citations`. Esa fuente respalda que una cita nativa apunta a un pasaje existente; no respalda que una cobertura deba verificarse contra un cálculo determinista. La lección marca precisamente esa conclusión como `[inferencia]`.
  Consecuencia: la clave es coherente con la lección, pero su procedencia queda presentada como respaldo directo de una fuente que no la establece. Eso dificulta auditar por qué se exige esa comprobación.
  Corrección recomendada: marcar explícitamente la explicación y el ítem como inferencia aplicada al contrato de cálculo del curso, o añadir una fuente o contrato que establezca que la cobertura procede de una salida determinista. Mantener `src-anthropic-citations` solo para el límite de las citas.

## Verificaciones sin hallazgo

- Las 42 preguntas de examen tienen una sola clave; las variantes mantienen la decisión descrita en `families.json` y la opción correcta no repite de forma mecánica la posición ni la longitud.
- Las preguntas de práctica no reutilizan escenario de examen y sus conceptos erróneos están alineados con los distractores.
- El paso 5 del laboratorio aporta el glosario, rutas y salida de cálculo necesarios para sus dos decisiones; el paso 6 aporta los datos concretos necesarios para la transferencia.
- `m03-f14-c` es fiel a `m03-l6#cifras`; el hallazgo se limita a la trazabilidad de su fuente, no a la regla pedagógica.
- Vista móvil 360 × 780: sin desborde horizontal en portada, laboratorio e inicio del examen; foco disponible para navegación, inicio del examen, opciones, confianza y comprobación.

## Verificación ejecutada

- `npm test`: 12 archivos, 134 pruebas aprobadas.
- Navegador local en rutas `#/cursos/m03`, `#/cursos/m03/laboratorio` y `#/cursos/m03/examen`.
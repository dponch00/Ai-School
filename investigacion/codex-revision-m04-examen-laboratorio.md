# Revisión cruzada — M04: examen, laboratorio y práctica

**Ticket:** T-032  
**Fecha:** 2026-10-23  
**Alcance:** 42 ítems del examen y 14 familias, caso de laboratorio y sus 12 preguntas, 12 preguntas de práctica y conceptos erróneos `m04-mc44` a `m04-mc70`.

## Hallazgos

### Media

- [T032-M04-01] Severidad: media
  Ubicación: `content/courses/m04/questions/practice.json`, `m04-p11`; comparación con `content/diagnostic/items.json`, `dx-b4-03`
  Evidencia: ambos plantean un encargo acotado y un diff que cambia una probabilidad de etapa, que es una política de FP&A. En los dos, la decisión correcta es retirar o justificar el cambio por estar fuera de alcance; incluso comparten el mismo artefacto conceptual, la tabla de probabilidades. Cambia el encargo superficialmente (texto del reporte frente a redondeo), pero no la decisión evaluada.
  Consecuencia: la práctica vuelve a medir una respuesta que el diagnóstico ya reveló, con poca transferencia a otro tipo de cambio fuera de alcance.
  Corrección recomendada: cambia `m04-p11` por un cambio inesperado que no sea la tabla de probabilidades ni la prueba esperada, por ejemplo un ajuste de permisos o de la retención de registros al corregir un texto; conserva la decisión de pedir que se retire por quedar fuera del encargo y requiere identificar el archivo afectado en el diff.

### Sin hallazgos críticos, altos ni bajos

- **Examen.** Verificado: son 14 familias de tres variantes, 42 ítems y una única clave por ítem. Cada familia mantiene su decisión declarada en `families.json`; las variantes cambian el dato o trampa, incluida la variante avanzada `c`. Los distractores no correctos tienen concepto erróneo asignado y el feedback concuerda con el `sectionRef`. `m04-f02-c` aplica correctamente que `WHERE` deja al Norte sin filas antes de `GROUP BY`; `m04-f07-c` separa quitar la clave del commit de revocarla si fuera real.
- **Longitud y repeticiones.** Verificado: en el examen la clave es la opción más larga en 15 de 42 y la más corta en 15 de 42; las posiciones correctas son 14/17/11 antes de que la interfaz las mezcle (`fixedOrder: false`). El laboratorio queda en 3/12 como opción más larga y 3/12 como más corta; la práctica, en 7/12 y 5/12, sin una señal consistente. `m04-f14` no repite `dx-b4-01`: ya hay evidencia y se pide identificar su hueco concreto; no se pregunta por pedir prueba tras una mera afirmación. `m04-l5-r1` tampoco participa en este alcance; el laboratorio y examen no repiten la recuperación genérica de `dx-b4-02` ni el control preventivo de secretos de `dx-b3-02`.
- **Laboratorio.** Verificado contra `reconcile.py` y los CSV: al sacar `Perdida` de `CLOSED_STAGES`, entran USD 60 000 en Norte, USD 75 000 en Centro y USD 70 000 en Sur. Sus fechas están en el trimestre y antes del *snapshot*, por eso suben también las vencidas de 2 a 3 en cada región. La probabilidad de `Perdida` es 0, así que el ponderado permanece igual. El paso 4 entrega todos los datos necesarios: con tolerancia 80 000 pasan los montos, pero `coverage_ratio` queda limitado a 0.0001 y `overdue_count` a 0, de modo que siguen fallando coberturas y vencidas. Los seis pasos contienen la información necesaria para resolver sus dos preguntas.
- **Práctica y conceptos erróneos.** Verificado: los 12 ítems de práctica tienen una clave única, feedback y `sectionRef` pertinentes; los 27 conceptos `m04-mc44` a `m04-mc70` son coherentes con sus explicaciones y fuentes. La única repetición material detectada es `m04-p11`.
- **Interfaz.** Verificado con Playwright en navegador a 360 × 800 y 1440 × 900: portada de M04, laboratorio y comienzo de examen cargan sus encabezados correctos sin desbordamiento horizontal. En el laboratorio, los cuatro bloques de código se desplazan dentro de su propio contenedor; el teclado puede seleccionar una opción y activar «Comprobar». En el examen, «Empezar el examen» se activa con Enter y presenta las opciones y «Enviar».

## Comprobaciones ejecutadas

- `npm test`: 12 archivos y 162 pruebas aprobadas.
- Validación estructural: 42 ítems, 14 familias, tres variantes por familia y exactamente una opción correcta por ítem de examen, laboratorio y práctica.
- Lectura comparada de `m04-lab.md`, `m04-lab.json`, `lab.json`, `practice.json`, `exam.json`, `families.json`, `misconceptions.json`, `reconcile.py`, los datos sintéticos y los ítems B3/B4 del diagnóstico.

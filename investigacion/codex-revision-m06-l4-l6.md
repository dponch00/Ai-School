# Revisión cruzada — M06 L4 a L6 (T-035)

Fecha de revisión: 2026-10-25  
Alcance: lecciones 4–6, sus 18 comprobaciones, `m06-mc31` a `m06-mc55` y las fichas `m06-pc-embedded-engine` y `m06-pc-lineage-history`.

## Hallazgos

- [T035-M06-01] Severidad: media
  Ubicación: `content/courses/m06/lessons/m06-l5.md`, ejemplo «Las tres salidas, cada una con su verificación».
  Evidencia: el texto dice que 3 772 000 «con **un decimal** de millones se redondea a 3,77». Un decimal daría 3,8; 3,77 corresponde a dos decimales. El caso paralelo de `m06-l5-c4` emplea correctamente «con dos decimales» para 1 330 500 → 1,33.
  Consecuencia: el alumno puede aplicar un contrato de redondeo distinto al que ilustra el check y concluir erróneamente que 3,77 es el resultado de conservar un solo decimal.
  Corrección recomendada: cambiar «con un decimal de millones» por «con dos decimales de millones». Como alternativa, si el contrato deseado es un decimal, cambiar la cifra mostrada a «3,8 millones» y ajustar el ejemplo de la pregunta para mantener el mismo contrato.

## Verificaciones sin hallazgo

- **Fuentes y alcance.** Las fuentes abiertas respaldan las afirmaciones prioritarias: motor en proceso sin servidor separado, lectura directa y poda de columnas/filtros de Parquet, CSV como texto sin conversión automática, temperatura cero no plenamente determinista, mediana robusta, PAL con ejecución en intérprete, límites de linaje e historial, semilla/reproducibilidad y los límites de privacidad de datos sintéticos. Las inferencias del texto están etiquetadas como tales.
- **Cifras.** Recalculé los importes abiertos del Sur con el tipo EUR→USD del snapshot: media 121 818 USD (redondeada desde 121 818,18) y mediana 112 000 USD. Incluyen todas las oportunidades abiertas, sin deduplicar, como establece el ticket; la lección no necesita aclaración adicional porque no introduce una política de deduplicación para esta alerta. Verifiqué 3 772 000 → 3,77 y 1 330 500 → 1,33 cuando se usan dos decimales de millones.
- **OPP-1099.** Sobre una copia lógica del snapshot, añadí OPP-1099 abierta del Norte con fecha de cierre y snapshot 2026-10-19. Con `close_date < snapshot_date`, Norte/total quedan en 2/6; con `<=`, quedan en 3/7. Coincide con el ejemplo de L6 y con `reconcile.py`.
- **Fichas.** `m06-pc-embedded-engine` coincide con la documentación 2.0: motor embebido, concurrencia de un escritor o lectores múltiples, lectura directa de Parquet, poda, muestra CSV de 20 480 líneas y Snappy por defecto. `m06-pc-lineage-history` coincide con la página de linaje (datos desde 2024-09-01, ventana móvil de un año en tablas de sistema y BROWSE) y con historia de tablas (30 días de log y 7 de archivos eliminados por defecto, sin usarla como respaldo). `ga` para DuckDB y `unspecified` para la combinación de catálogo/historia siguen siendo clasificaciones prudentes; no hay base en esas páginas para elevar la segunda a una etiqueta de lanzamiento.
- **Fuentes indirectas de conceptos erróneos.** `m06-mc41`, `m06-mc42` y `m06-mc55` son inferencias sobre cobertura e independencia de checks; `src-python-sys` o `src-python-random` solo aportan contexto técnico, no prueban la regla pedagógica. `m06-mc48` se apoya indirectamente en rendimiento. No encontré una fuente primaria más específica ya registrada: conservarlas explícitamente como inferencias es más fiel que presentar la fuente contextual como demostración. Si el esquema se amplía, conviene añadir `sourceRole: "contextual"` o `inference: true` a estos conceptos; mientras exija un `sourceId`, no sustituiría las fuentes actuales por una atribución más fuerte de lo que sostienen.
- **Preguntas.** Las 18 tienen una sola clave correcta, distractores con concepto erróneo asignado y feedback congruente con su `sectionRef`. Ninguna opción alcanza una relación de longitud de 1,7 respecto de otra. `m06-l5-c4` (verificar el redondeo de un texto) y `m06-l6-r2` (no tomar una cifra escrita por el modelo) concretan partes distintas de `dx-b5-01` (diseñar quién calcula y quién redacta); no revelan su respuesta ni son una repetición de escenario. No encontré repetición sustantiva con B5 ni con M01–M05.
- **Alcance, lectura y nombres.** L4, L5 y L6 tienen aproximadamente 1 446, 1 240 y 1 518 palabras, respectivamente: caben con margen en 25 minutos. La estadística se limita a media/mediana y robustez; no deriva hacia un curso de estadística. No aparecen nombres de productos de proveedores en el cuerpo de las lecciones; las menciones a Python son necesarias para identificar el lenguaje y la biblioteca estándar que se está explicando.

## Fuentes abiertas

| Fuente | Resultado de la comprobación |
| --- | --- |
| DuckDB, [Why DuckDB](https://duckdb.org/why_duckdb) | Confirma ejecución embebida en el proceso y ausencia de servidor separado por defecto. |
| DuckDB, [Concurrency 2.0](https://duckdb.org/docs/2.0/connect/concurrency) | Confirma el modelo de un proceso escritor o múltiples lectores. |
| DuckDB, [Parquet 2.0](https://duckdb.org/docs/2.0/data/parquet/overview) | Confirma consulta directa, metadatos/esquema, poda de proyección/filtros y Snappy predeterminado. |
| DuckDB, [CSV 2.0](https://duckdb.org/docs/2.0/data/csv/overview) | Confirma inferencia de formato/tipos basada en muestra y la necesidad de fijar tipos cuando corresponda. |
| IETF, [RFC 4180](https://www.rfc-editor.org/rfc/rfc4180) | Confirma que CSV define registros, campos y comillas, no un sistema de tipos. |
| Python, [csv](https://docs.python.org/3/library/csv.html) | Confirma que el lector devuelve cadenas salvo la opción de conversión indicada. |
| Python, [Floating-point arithmetic](https://docs.python.org/3/tutorial/floatingpoint.html) | Confirma la inexactitud general de fracciones decimales en coma flotante binaria. |
| Python, [statistics](https://docs.python.org/3/library/statistics.html) | Confirma que la media es sensible a atípicos y la mediana es robusta. |
| Python, [random](https://docs.python.org/3/library/random.html) | Confirma semilla/reproducibilidad limitada entre versiones y que no sirve para seguridad. |
| Python, [sys](https://docs.python.org/3/library/sys.html) | Confirma la semántica general de códigos de salida usada por los checks. |
| Anthropic, [Glossary](https://platform.claude.com/docs/en/about-claude/glossary) | Confirma temperatura como control de aleatoriedad y que temperatura 0 no garantiza identidad entre llamadas. |
| Anthropic, [Reduce hallucinations](https://platform.claude.com/docs/en/test-and-evaluate/strengthen-guardrails/reduce-hallucinations) | Confirma que permitir incertidumbre, anclar y verificar reducen errores, no los eliminan. |
| Gao et al., [PAL](https://arxiv.org/abs/2211.10435) | Confirma que el modelo puede descomponer bien y fallar en aritmética, y el mejor resultado al delegar la ejecución al intérprete en sus tareas evaluadas. |
| Databricks, [Unity Catalog lineage](https://docs.databricks.com/aws/en/data-governance/unity-catalog/data-lineage) | Confirma captura automática, granularidad de columna, BROWSE, fecha de corte, retención y límites de renombrado. |
| Databricks, [Table history](https://docs.databricks.com/aws/en/delta/history) | Confirma `DESCRIBE HISTORY`, viajes en el tiempo, retenciones predeterminadas y la advertencia de no tratarlo como respaldo de largo plazo. |
| Stadler, Oprisanu y Troncoso, [Synthetic Data — Anonymisation Groundhog Day](https://arxiv.org/abs/2011.07018) | Confirma que los modelos evaluados no mejoran el equilibrio privacidad-utilidad y que ese equilibrio es difícil de predecir. |

## Pruebas ejecutadas

- `npm test`: 12 archivos y 176 pruebas correctas.
- Auditoría estructural de las 18 preguntas: una clave por ítem, feedback completo, distractores mapeados y relación máxima de longitud inferior a 1,7.
- Recalculo independiente de los importes del Sur y simulación de OPP-1099 a partir de `content/courses/m02/practice/data/` sin modificar los datos del repositorio.

# Revisión cruzada de M06, lecciones 1 a 3

**Ticket:** T-034  
**Fecha:** 2026-10-25  
**Alcance:** blueprint, L1–L3, 16 comprobaciones, 29 conceptos erróneos y cuatro fichas de M06. No se modificó `content/`, `src/`, `e2e/` ni `ESTADO.md`.

## Hallazgos

- [T034-M06-01] Severidad: media
  Ubicación: `content/courses/m06/questions/checks.json`, `m06-l3-r1` y `m06-l3-r2`
  Evidencia: `m06-l3-r1` repite el snapshot del 26 de octubre, las tres oportunidades «En pausa», la falta de probabilidad y la ausencia de política de `m02-lab-q12`. `m06-l3-r2` recupera los mismos ID, montos (125 000 y 90 000) y política de última actividad de M02, y el mismo cálculo de M04: `m02-lab-q02`, `m04-f03-c` y los datos de práctica. Cambia la redacción, pero no los datos ni la decisión de fondo.
  Consecuencia: quien cursó M02 o M04 puede reconocer el caso y anticipar la respuesta sin demostrar que comprendió la decisión de M06 sobre contrato, normalización y política declarada.
  Corrección recomendada: conservar los conceptos, pero usar dos anomalías nuevas y cifras/IDs nuevos. Por ejemplo, una categoría de descuento sin regla y dos versiones de una factura con política explícita de «registro con fecha de carga más reciente»; el alumno debe decidir la política, no recordar Altiplano.

## Comprobaciones sin hallazgo

- **Blueprint y alcance.** Los seis objetivos son decisiones evaluables por opción múltiple y las tres lecciones se ciñen a decisiones para dirigir agentes: ubicación del cálculo, contrato/calidad y acceso mínimo a los datos. No se convierten en formación de ingeniería de datos.
- **Citas.** Las afirmaciones prioritarias conservan su alcance: validación cliente/servidor y sintáctica/semántica; almacén SQL que ejecuta y conector que recibe; límites de precisión JSON; RAW como recomendación de capas; `CHECK` que deja pasar `NULL`; llaves informativas del almacén; y `format: date` como anotación por defecto. La página de SQL MCP confirma el recorte de resultados, permisos de quien llama, escritura por defecto y `disallow_writes: true` para forzar solo lectura. Unity Catalog confirma los tres permisos de lectura, `MODIFY` para escribir y la herencia a objetos actuales y futuros. La especificación MCP confirma que las anotaciones de herramientas no son un control de confianza.
- **Fichas y volatilidad.** Las cuatro rutas resuelven. `m06-pc-constraints` usa correctamente `mixed`: PK/FK son GA desde Runtime 15.2 y `UNIQUE` sigue en vista previa pública desde 18.2. `m06-pc-managed-mcp` usa correctamente `mixed`: Genie One es GA y `system.ai.dbsql` requiere Unity Gateway Beta. No hallé cambio material desde el 2026-10-23 en las páginas abiertas.
- **`disallow_writes`.** Vale la página específica de Databricks SQL MCP: dice literalmente que permite lectura y escritura por defecto y que `disallow_writes: true` en `system.ai.dbsql_policy` lo vuelve solo lectura. La página general de gobierno describe grants y políticas por llamada, pero no enumera ese parámetro; es una omisión de detalle, no una contradicción.
- **Preguntas.** Las 16 tienen una única clave, feedback para cada opción y concepto erróneo en cada distractor. Ninguna relación de longitud entre opciones alcanza 1,7. Fuera de T034-M06-01, no encontré escenario que repita de forma sustantiva B5 o M01, M03, M04 o M05.
- **Lectura y productos.** Tras retirar marcadores de cita: L1 tiene 1510 palabras, L2 1411 y L3 1533; caben razonablemente en 25 minutos. No aparecen nombres de producto en el cuerpo de las lecciones.
- **Pruebas:** `npm test` pasó: 12 archivos y 176 pruebas.

## Fuentes abiertas y resultado

| Fuente abierta | Resultado |
| --- | --- |
| MDN, *Client-server overview* | Respalda la separación cliente/servidor y el papel del servidor. |
| OWASP, *Input Validation Cheat Sheet* | Respalda repetir validación relevante en servidor y distinguir forma de regla de negocio. |
| Vite, *Env Variables and Modes* | Respalda que lo expuesto al cliente queda incorporado en el código entregado. |
| RFC 8259 | Respalda la advertencia sobre interoperabilidad y doble precisión de números JSON. |
| PostgreSQL, *Constraints* | Confirma PK/UNIQUE/NOT NULL y el comportamiento de `CHECK` con nulos. |
| JSON Schema Validation 2020-12 | Confirma `format` como anotación por defecto y aserción solo cuando se habilita su vocabulario. |
| Databricks, *Medallion architecture* | Confirma bronce/RAW, plata/validación y oro/agregación como patrón recomendado. |
| Databricks, *Constraints* | Confirma `NOT NULL` y `CHECK` exigibles; PK/FK informativas, GA 15.2; UNIQUE en vista previa 18.2. |
| Databricks, *SQL warehouse* | Confirma que el almacén SQL es el recurso de cómputo que ejecuta consultas. |
| Databricks, *SQL Connector for Python* | Confirma la ejecución desde Python y recuperación por lotes para resultados grandes. |
| Databricks, *Performance efficiency* | Confirma paralelismo y uso de estadísticas min/max para descartar datos. |
| Databricks, *Databricks-provided MCPs* | Confirma `system.ai.genie_one_mcp` GA, `system.ai.dbsql` bajo Unity Gateway Beta y uso de permisos del llamante. |
| Databricks, *SQL MCP server* | Confirma recorte de resultados, SQL sin contexto semántico, lectura/escritura por defecto y `disallow_writes`. |
| Databricks, *Unity Catalog permissions model* | Confirma `SELECT`/`MODIFY`/`USE`, herencia de privilegios y objetos futuros. |
| MCP, *Tools specification* | Confirma que anotaciones de comportamiento no son confiables salvo servidor de confianza y que se recomienda control humano. |
| OWASP, *LLM01 Prompt Injection* | Confirma tratar contenido externo como no confiable ante inyección indirecta. |

**Verificado:** las fuentes primarias anteriores se abrieron el 2026-10-25. Sus hechos prioritarios sostienen las lecciones y fichas; la única corrección recomendada es T034-M06-01.

# M06 — Datos y arquitectura de herramientas analíticas · Base de investigación

- **Archivo:** `investigacion/M06-datos-arquitectura.md`
- **Fecha de investigación:** 2026-10-23 (fuentes nuevas consultadas ese día; las reutilizadas indican su fecha de consulta en el registro, §6)
- **Elaborado por:** subagente de investigación (Claude Code) para el autor de M06
- **Estado:** base factual y conceptual para redactar las 6 lecciones, el laboratorio y el banco de M06. No es contenido final para el alumno.
- **Convenciones (las mismas que M02 y M04):**
  - `[src-…]` = ID de fuente del registro (§6). La afirmación está documentada en esa fuente (parafraseada).
  - `[inferencia]` = conclusión, síntesis o recomendación propia que ninguna fuente afirma literalmente.
  - **Ficha candidata** = afirmación que depende de un producto o una versión. Según D-019 va en una ficha de producto fechada, nunca en el cuerpo de la lección.
  - Citas textuales: como máximo una por fuente y de menos de 15 palabras.
- **Datos:** todos los ejemplos usan el caso ficticio Altiplano Industrial S.A. (M02 §2.0) y los archivos sintéticos de `content/courses/m02/practice/data/`. Los nombres de tablas, catálogos, cuentas de servicio y volúmenes del almacén de Altiplano son inventados para este manual. Ninguna cifra es real y no aparece ninguna credencial (los marcadores son evidentes: `TOKEN_FICTICIO_…`).
- **Alumno:** profesional de finanzas que dirige agentes de código y ya consulta SQL en un lakehouse gestionado (plan §1). No se forma a un ingeniero de datos: se forma a alguien que ubica cada operación, exige un contrato y un check, y decide con qué permisos toca los datos un agente.

> **Aviso para el banco y el laboratorio (decisiones ya expuestas en el diagnóstico, bloque B5).** Los ítems `dx-b5-01` a `dx-b5-04` ya están expuestos y no se reutilizan sus escenarios ni sus decisiones tal cual:
> - `dx-b5-01` (C08): para un comentario mensual con totales ponderados, calcular con SQL o Python y dar las cifras al modelo para redactar; descarta que el modelo calcule o que se autoverifique (dx-mc34, dx-mc15).
> - `dx-b5-02` (C09/C11): clave de API privada de una app estática → en un servidor o función propia; descarta variable de entorno compilada en el frontend y ofuscación (dx-mc35, dx-mc36).
> - `dx-b5-03` (C08): 50 millones de filas y un dashboard que solo necesita totales por región y semana → agregar con SQL en el almacén y descargar el resultado; descarta descargar todo o pedir el resumen a un modelo (dx-mc37, dx-mc38).
> - `dx-b5-04` (C09): agente nocturno que actualiza una nota en el CRM → lectura más escritura en un solo campo con registro; descarta administrador o «instrucción clara» (dx-mc39, dx-mc20).
>
> Consecuencias para M06: L5 no pregunta otra vez «quién calcula el total del comentario», sino cómo se **verifica** el texto generado contra el contrato y qué cifras son estadísticas; L3 no pregunta otra vez «agregar en remoto o descargar todo», sino **qué granularidad** se descarga, qué hacer cuando el canal trunca resultados y **con qué identidad y modo (lectura/escritura)** se conecta el agente; L1 no usa el escenario de la clave en el frontend. Los conceptos erróneos se pueden reutilizar con situaciones nuevas de Altiplano (estándar §4.1).

> **D-024 (2026-10-23):** toda evaluación es de opción múltiple. Los objetivos ya están formulados como decisiones («elige», «identifica», «decide») y el laboratorio es un caso por pasos con preguntas, sin entregable ni rúbrica.

> **Nota de dos capas (D-019).** El currículo nombra Databricks, DuckDB y Parquet en los títulos de L3 y L4. Recomendación [inferencia]: en el cuerpo de las lecciones hablar de «almacén de datos gestionado» o «lakehouse», «motor analítico embebido» y «formato columnar abierto», y dejar los nombres de producto, sus estados y sus versiones en fichas. Parquet es una especificación abierta de Apache y SQL es un lenguaje estándar; nombrarlos en el cuerpo parece compatible con D-019, pero lo decide el coordinador. La prueba `course-files.test.ts` hoy no incluye «Databricks» ni «DuckDB» en su lista de proveedores (línea 73), así que no lo detectaría.

---

## 1. Resumen ejecutivo

1. **La pregunta rectora del manual es duradera:** ¿dónde se ejecuta cada operación y qué check demuestra que el número es correcto? La respuesta cambia poco con los productos: el motor de datos filtra y agrega, el código de cálculo aplica reglas de negocio con tipos exactos, la interfaz muestra y nunca es la única barrera, y el modelo generativo redacta sobre cifras que ya existen [src-mdn-client-server][src-owasp-input-validation][src-arxiv-pal][inferencia].
2. **Todo lo que llega al navegador es visible y modificable por el usuario.** La validación del lado del cliente sirve para dar retroalimentación rápida, pero se puede saltar; la regla que importa se repite en el servidor [src-owasp-input-validation][src-vite-env]. [inferencia] En un dashboard, un filtro de región en la interfaz es presentación, no control de acceso.
3. **RAW no se corrige: se conserva y se transforma.** La arquitectura en capas que documenta un proveedor de lakehouse guarda los datos tal como llegaron, con historia completa, para reprocesar y auditar; la capa siguiente valida, deduplica, normaliza y fija el esquema; la última agrega para el negocio [src-databricks-medallion]. Es una recomendación, no un requisito, y va en ficha; el principio (no editar el origen, transformar en pasos trazables) es duradero [inferencia].
4. **Una llave primaria declarada no siempre se hace cumplir.** En PostgreSQL una llave primaria equivale a `UNIQUE NOT NULL` y la base rechaza la fila que la viola [src-postgres-constraints]; en el lakehouse consultado, en cambio, las llaves primarias y foráneas son **informativas** y solo `NOT NULL` y `CHECK` se hacen cumplir [src-databricks-constraints]. Consecuencia [inferencia]: el duplicado OPP-1012 del snapshot de Altiplano puede llegar al almacén aunque la tabla «tenga» llave, y el check de unicidad tiene que estar en el código.
5. **El esquema garantiza forma, no verdad.** En JSON Schema 2020-12, `format` (por ejemplo `date`) es por defecto una anotación y no una aserción [src-jsonschema-validation-2020-12]; el contrato `pipeline_kpis` v1 deja las invariantes (ponderado ≤ abierto, suma de regiones = total) para el código. Además, JSON no fija la precisión de los números: la interoperabilidad se asume dentro de la doble precisión binaria [src-ietf-rfc8259], de modo que un importe viaja en el contrato como número aproximado y se recalcula con `Decimal` en el check [inferencia].
6. **Un agente no «se conecta solo» a un almacén.** Hay que identificar conexión (servidor MCP gestionado, conector SQL o CLI), identidad (la del usuario que llama), permisos (privilegios del catálogo) y lugar de ejecución (el almacén SQL ejecuta; el cliente recibe filas) [src-databricks-managed-mcp][src-databricks-sql-connector-python][src-databricks-uc-privileges]. El servidor MCP de SQL del proveedor consultado **permite lecturas y escrituras por defecto** y se vuelve de solo lectura con una política [src-databricks-dbsql-mcp] (ficha). Las anotaciones de «solo lectura» de una herramienta MCP son pistas no confiables salvo que el servidor sea de confianza [src-mcp-spec-tools].
7. **Cada herramienta tiene una función:** SQL en el almacén para filtrar y agregar cerca de los datos (y porque el canal del agente trunca resultados grandes [src-databricks-dbsql-mcp]); un motor analítico embebido para consultar archivos locales sin servidor [src-duckdb-why]; Python para reglas de negocio, `Decimal` y checks [src-python-floatingpoint][src-python-csv]; Parquet para guardar extractos tipados y columnares, con esquema y estadísticas min/max en el propio archivo [src-parquet-overview][src-parquet-thrift][src-parquet-readme]. CSV no tiene tipos: todo llega como texto o depende de una inferencia por muestreo [src-ietf-rfc4180][src-python-csv][src-duckdb-csv].
8. **Determinista, estadístico y generativo son tres contratos distintos.** Determinista: misma entrada, misma salida, verificable al centavo. Estadístico: una estimación con supuestos (la mediana resiste valores atípicos; la media no) [src-python-statistics]. Generativo: texto plausible que no es determinista ni con temperatura 0 [src-anthropic-glossary] y que puede contener errores aunque se apliquen técnicas de mitigación [src-anthropic-reduce-hallucinations]. Un modelo que delega el cálculo a un intérprete acierta más que uno que calcula en el texto [src-arxiv-pal].
9. **La reconciliación es un check ejecutable con código de salida, no una revisión visual.** En Altiplano, `reconcile.py` termina con 0, 1 o 2 y detecta el duplicado contado dos veces (+125 000 en el pipeline abierto del Norte) y los EUR tomados como USD (−62 000 en el total) (§3.0). [inferencia] Un check solo es independiente si no comparte la ruta de cálculo con lo que verifica, y solo detecta lo que sus datos ejercitan.
10. **La trazabilidad responde «de dónde salió este número»:** fecha de corte, versión de supuestos, fuente y transformación. El linaje automático y la historia de tablas del proveedor ayudan, con límites documentados (no se conserva al renombrar; la historia no sustituye una copia de respaldo) [src-databricks-uc-lineage][src-databricks-delta-history] (fichas).
11. **Datos sintéticos: semilla fija, casos límite a propósito y nada derivado de datos reales.** El generador pseudoaleatorio de Python es determinista con la misma semilla y no sirve para seguridad [src-python-random]. Generar datos «sintéticos» a partir de datos reales no garantiza privacidad [src-arxiv-synthetic-groundhog]; por eso Altiplano se inventa desde cero [inferencia].
12. **Volatilidad:** baja en arquitectura, llaves, contratos, SQL, formatos y reconciliación (revisión anual, próxima 2027-10-23). Alta en todo lo que es producto: servidores MCP gestionados del lakehouse, privilegios en beta, agentes compatibles, linaje, retención y la versión 2.0 del motor embebido (fichas con revisión trimestral, próxima 2027-01-23).

---

## 2. Blueprint propuesto (objetivos evaluados del manual)

Seis objetivos, uno por lección, como pide `docs/content-standard.md` §3.3. Todos son decisiones evaluables con opción múltiple (D-024). Cada uno: 2 familias en el banco, 2 ítems en el examen y 2 preguntas en el laboratorio.

| ID | Objetivo evaluado | Competencia | Lección | Evidencia |
| --- | --- | --- | --- | --- |
| M06-OE1 | Dada una operación del flujo de Altiplano (filtrar, agregar, aplicar una regla de negocio, validar, mostrar, redactar), **identifica en qué capa debe ejecutarse** (motor de datos, código de cálculo en el servidor, interfaz o modelo generativo) y descarta la ubicación que la deja sin verificar o la confía solo al navegador. | C08 | L1 | Comprobaciones, banco; laboratorio paso 1 |
| M06-OE2 | Dado un extracto RAW y el contrato que debe cumplir, **identifica la llave, la regla violada** (duplicado, nulo, valor fuera de dominio, tipo, unidad) **y decide** si se normaliza con una regla declarada, se reporta como problema de calidad o detiene el cálculo. | C08 | L2 | Comprobaciones, banco; laboratorio paso 2 |
| M06-OE3 | Dada una necesidad de datos de un agente o de un análisis sobre el almacén, **decide la granularidad que se consulta en remoto y la que se descarga, y elige la conexión, la identidad y el modo (lectura o escritura)** con mínimo privilegio, sin suponer que algo se conecta solo. | C08, C09 | L3 | Comprobaciones, banco; laboratorio paso 3 |
| M06-OE4 | Dado un paso analítico (consultar un extracto local, aplicar una regla con importes, guardar un intermedio, comparar snapshots), **elige la herramienta y el formato** (SQL remoto, motor embebido, Python, Parquet o CSV) según volumen, tipos y reproducibilidad. | C08 | L4 | Comprobaciones, banco; laboratorio paso 4 |
| M06-OE5 | Dada una salida del flujo (KPI, alerta, proyección, comentario), **identifica si es determinista, estadística o generativa, decide qué cifra nunca debe producir un modelo generativo y elige cómo verificar** el texto generado contra el contrato. | C08 | L5 | Comprobaciones, banco; laboratorio paso 5 |
| M06-OE6 | Dada una diferencia sembrada o un check propuesto, **decide qué check de reconciliación o de trazabilidad la detecta y cuál no** (por falta de independencia o de casos), y **elige cómo generar datos sintéticos** que ejerciten los casos límite sin usar datos reales. | C08 | L6 | Comprobaciones, banco; laboratorio paso 6 |

**Notas de diseño [inferencia]:**

- C08 domina (seis objetivos) y C09 entra en OE3, como prevé el currículo (C09 es principal en M07). OE3 se queda en la decisión de acceso a datos (identidad, lectura frente a escritura, política); OAuth, secretos e idempotencia se profundizan en M07.
- Las conductas observables de C08 en `investigacion/curriculo-estado-del-arte.md` §3 (decidir qué se agrega en remoto, identificar una cifra que el LLM no debe calcular, diseñar una reconciliación que detecta una diferencia sembrada) quedan en OE3, OE5 y OE6, ya como decisiones de opción múltiple.
- **Series intercaladas obligatorias** (estándar §3.2): (a) después de L4, 4–6 casos que obliguen a elegir entre SQL remoto, motor embebido, Python y formato de archivo; (b) después de L5, 4–6 salidas que haya que clasificar como determinista, estadística o generativa.

---

## 3. Lecciones

### 3.0 Material del caso que se reutiliza y cifras de referencia

M06 reutiliza los datos del laboratorio de M02 (`content/courses/m02/practice/data/`) y construye encima de M04 (que ya enseñó `WHERE`/`HAVING`, nulos en SQL, `count(*)` frente a `count(columna)`, `JOIN` que multiplica filas, `Decimal` frente a `float` y códigos de salida). M06 no repite esas reglas: las usa.

| Archivo | Para qué sirve en M06 |
| --- | --- |
| `opportunities_snapshot_2026-10-19.csv` | La «capa RAW» de L2: 40 filas, llave candidata `opp_id`, duplicado OPP-1012 (filas 13 y 14), cierre vacío OPP-1021, etapa sin tilde OPP-1027, etapa sin probabilidad OPP-1036, seis montos en EUR |
| `opportunities_snapshot_2026-10-26.csv` | El giro: tres oportunidades del Centro en «En pausa» (OPP-1040 a OPP-1042, USD 410 000), sin probabilidad |
| `stage_probability.csv`, `fx_rates.csv`, `quota.csv`, `won_q4.csv` | Tablas de referencia con dueño (`FP&A`) y fecha efectiva: ejemplo de datos maestros y de trazabilidad |
| `pipeline_kpis.schema.json` | El contrato entre la capa de cálculo, la vista y el comentario (L2, L5) |
| `reconcile.py`, `test_reconcile.py`, `expected/*.json` | Check ejecutable y fixtures de error (L6) |

Cifras obtenidas el 2026-10-23 ejecutando `python -B reconcile.py --data-dir . --kpis expected/<fixture>.json --assumptions expected/assumptions_reference.json` en esa carpeta (los archivos del repo no se modificaron):

| Fixture | Resultado | Diferencias |
| --- | --- | --- |
| `kpis_correct.json` | Código 0; tres líneas AVISO (duplicado OPP-1012 resuelto con la fila de 90 000; OPP-1021 sin fecha; OPP-1036 excluida) | Ninguna. Totales: abierto 3 772 000; ponderado 1 922 325; cobertura 1,3235; vencidas 6 |
| `kpis_error_duplicate.json` | Código 1 | Abierto Norte +125 000; ponderado Norte +31 250; cobertura Norte y los tres totales correspondientes |
| `kpis_error_eur.json` | Código 1 | Abierto −16 500 Norte, −25 500 Centro, −20 000 Sur, −62 000 total, más ponderados y coberturas |
| `kpis_error_missing_issue.json` | Código 1 | Cifras correctas; falla `calidad unknown_stage OPP-1036: el dashboard no lo reporta` |

Otras cifras útiles (calculadas con Python sobre el snapshot del 19, sin deduplicar, oportunidades abiertas convertidas a USD): Norte 12 oportunidades, media 110 541,67 y mediana 109 750; Centro 11, media 129 863,64 y mediana 135 000; Sur 11, media 121 818,18 y mediana 112 000. Sirven para el ejemplo estadístico de L5 [inferencia: cálculo propio].

**Escenario del almacén (inventado para M06).** Altiplano guarda en su lakehouse una tabla `altiplano_prod.crm.opportunity_snapshots` con un snapshot semanal desde 2024 (unas 160 semanas; el tamaño exacto no importa para las decisiones) y las tablas de referencia en `altiplano_prod.fpa`. La analista consulta con SQL; el equipo quiere que un agente de código la ayude a construir el dashboard.

---

### Lección 1 — Frontend, backend y motor de datos: dónde ocurre cada operación

**Objetivo de lección (→ M06-OE1):** Dada una operación del dashboard de Altiplano, identifica la capa donde debe ejecutarse y la razón (volumen, exactitud, seguridad o verificabilidad).

**Ideas clave**

- **Cliente y servidor hacen cosas distintas.** El navegador envía peticiones y muestra lo que recibe; la aplicación del servidor interpreta la petición, consulta la base de datos y arma la respuesta; un sitio estático devuelve siempre el mismo contenido y no guarda datos modificables [src-mdn-client-server]. [inferencia] Un dashboard estático solo puede mostrar cifras que alguien calculó antes en otro lugar.
- **Lo que llega al navegador lo controla el usuario.** La validación en el cliente se puede saltar y hay que repetirla en el servidor; sirve para dar retroalimentación inmediata [src-owasp-input-validation]. Las variables expuestas al código del cliente no son secretas [src-vite-env]. [inferencia] Ocultar una región con un filtro de la interfaz no impide que su dato viaje en el JSON.
- **Validación sintáctica y semántica.** La sintáctica revisa forma y tipo; la semántica, si el valor tiene sentido para la operación (por ejemplo, que una fecha final sea posterior a la inicial) [src-owasp-input-validation]. [inferencia] En Altiplano: «`expected_close_date` es una fecha» es sintáctico; «una oportunidad abierta con cierre anterior al snapshot está vencida» es una regla de negocio que vive en el código de cálculo.
- **Cuatro capas, cuatro responsabilidades** [inferencia, síntesis del manual]:
  1. *Motor de datos* (almacén SQL o motor embebido): filtrar, unir y agregar muchas filas cerca de donde están.
  2. *Código de cálculo* (backend o script): reglas de negocio con tipos exactos, políticas declaradas (duplicados, etapas desconocidas), checks y el contrato de salida.
  3. *Interfaz* (frontend): mostrar, formatear, ordenar y filtrar lo que ya está en el contrato; nunca es la única barrera ni la fuente de una cifra.
  4. *Modelo generativo*: redactar, clasificar texto, proponer consultas o código que luego se ejecutan y verifican; no produce las cifras del contrato.
- **El motor de datos ejecuta; el cliente recibe.** Un almacén SQL es el recurso de cómputo que ejecuta las consultas [src-databricks-sql-warehouse]; un conector desde Python local envía SQL a ese cómputo y recibe filas [src-databricks-sql-connector-python]. [inferencia] Por eso «el agente corrió la consulta» no dice dónde se procesaron los datos: hay que preguntar qué cómputo la ejecutó y qué filas volvieron.
- **Formatear es de la interfaz; redondear para calcular no.** [inferencia] El contrato `pipeline_kpis` lleva el valor numérico; el formato de moneda o de miles se aplica al mostrar. Si la interfaz recalcula la cobertura con valores ya redondeados, la cifra mostrada puede diferir del contrato.

**Ejemplo con Altiplano (caso resuelto)**

El dashboard tiene que mostrar cobertura por región y permitir elegir la región. Un agente propone: (a) descargar al navegador las 40 filas del snapshot y calcular en JavaScript el pipeline abierto, el ponderado y la cobertura; (b) aplicar el filtro de región también en el navegador. Ubicación correcta: el filtrado y la agregación por región, en el motor de datos; la deduplicación, la conversión de EUR, el alias de etapas y la cobertura, en el código de cálculo con `Decimal`, que escribe `pipeline_kpis.json`; la interfaz solo lee el contrato y filtra por región entre filas ya agregadas. Razones: el navegador no es una barrera (cualquiera ve las 40 filas, con cuentas y responsables), JavaScript calcula con números binarios de doble precisión [src-ietf-rfc8259][inferencia] y el check de reconciliación verifica el contrato, no lo que hace la interfaz.

**Ejemplo para completar:** «El comentario mensual debe decir qué región tiene la cobertura más baja.» ¿Qué capa calcula el mínimo y qué capa redacta la frase? (Respuesta modelo: el código de cálculo determina la región con el mínimo a partir del contrato; el modelo redacta con ese dato ya resuelto; el check compara región y cifra citadas con el contrato.)

**Conceptos erróneos frecuentes (distractores)**

| ID | Creencia errónea | Por qué es errónea | Fuente |
| --- | --- | --- | --- |
| M06-CE01 | «Si la interfaz valida el dato, el servidor no necesita validarlo.» | La validación del cliente se puede saltar; la regla debe repetirse en el servidor. | [src-owasp-input-validation] |
| M06-CE02 | «Filtrar por región en la interfaz restringe quién ve qué región.» | El dato ya viajó al navegador; filtrar es presentación, no control de acceso. | [src-mdn-client-server][inferencia] |
| M06-CE03 | «Si el agente ejecutó la consulta, los datos se procesaron en el equipo del agente.» | El cómputo del almacén ejecuta la consulta; el cliente recibe el resultado. | [src-databricks-sql-warehouse][src-databricks-sql-connector-python] |
| M06-CE04 | «Da igual calcular en el frontend o en el backend si el resultado se ve bien.» | En el frontend el cálculo no se verifica con el check, usa números de doble precisión y expone las filas de detalle. | [src-ietf-rfc8259][inferencia] |
| M06-CE05 | «Redondear en la interfaz y recalcular con lo redondeado da la misma cifra.» | Recalcular con valores redondeados acumula diferencias frente al contrato. | [inferencia] |

**Fichas candidatas**

- *Almacén SQL del lakehouse* (verificado 2026-10-23): Databricks · SQL warehouse · recurso de cómputo que ejecuta las consultas SQL; tipos serverless, pro y clásico, con serverless recomendado cuando está disponible; arrancar uno detenido exige al menos el permiso CAN MONITOR · GA · [src-databricks-sql-warehouse] · próxima revisión 2027-01-23.

---

### Lección 2 — RAW, normalización, esquema, llaves y contratos de datos

**Objetivo de lección (→ M06-OE2):** Dado un extracto RAW y el contrato `pipeline_kpis` v1, identifica la llave y cada violación, y decide si se normaliza, se reporta o se detiene el cálculo.

**Ideas clave**

- **Capas de datos: conservar, limpiar, agregar.** La guía de arquitectura de un proveedor de lakehouse describe una capa cruda que guarda los datos tal como llegaron, con historia completa y sirve de fuente para reprocesar y auditar; una capa intermedia que limpia, valida, deduplica, normaliza y aplica el esquema; y una capa de negocio agregada para dashboards. Recomienda manejar la evolución del esquema en la capa intermedia, no al ingerir, y guardar en la cruda casi todo como texto para no perder datos [src-databricks-medallion]. El proveedor la presenta como buena práctica recomendada, no obligatoria [src-databricks-medallion]. Los nombres de las capas van en ficha; el principio va en el cuerpo [inferencia].
- **RAW no se edita a mano.** [inferencia] Si alguien corrige «Negociacion» directamente en el archivo crudo, se pierde la evidencia de que el origen venía mal y la corrección no se repite la próxima semana. La corrección vive en una regla declarada (`stage_aliases`) que se aplica en cada ejecución y queda en `assumption_ids`.
- **Llave primaria = única y no nula.** En PostgreSQL una llave primaria equivale a `UNIQUE NOT NULL`, crea un índice y cada tabla puede tener como máximo una; una llave foránea exige que el valor exista en la tabla referida [src-postgres-constraints]. Un `CHECK` pasa si la expresión es verdadera **o nula** [src-postgres-constraints], de modo que una regla sobre una columna que admite vacíos necesita además `NOT NULL` [inferencia].
- **Los nulos son distintos entre sí en una restricción `UNIQUE` por defecto**, así que varias filas con llave vacía no violan la unicidad; el estándar SQL deja ese comportamiento a cada implementación [src-postgres-constraints].
- **En el lakehouse consultado, las llaves primarias y foráneas son informativas.** Solo `NOT NULL` y `CHECK` se hacen cumplir (la escritura que los viola falla); `PRIMARY KEY`, `FOREIGN KEY` y `UNIQUE` documentan relaciones y ayudan al optimizador, pero no se verifican [src-databricks-constraints] (ficha). [inferencia] Una tabla «con llave» puede tener duplicados: el check de unicidad debe estar en el código de cálculo o en la capa intermedia.
- **Normalizar es reducir redundancia y fijar un solo valor válido por concepto.** [inferencia] En sentido relacional, las probabilidades por etapa viven en una tabla de referencia (`stage_probability.csv`, con dueño y fecha efectiva) y no repetidas en cada oportunidad; en sentido de limpieza, «Negociacion» se lleva al valor canónico «Negociación» con una regla. (La fuente primaria clásica de la normalización relacional no se pudo abrir: ver Huecos.)
- **El contrato fija forma; las invariantes, el código.** `pipeline_kpis` v1 exige campos, enumera `kpi_id`, `region`, `unit` y `issue`, y prohíbe propiedades extra. En JSON Schema 2020-12, `enum` y `required` son aserciones, pero `format: date` es por defecto una anotación: un validador no está obligado a rechazar «2026-13-45» [src-jsonschema-validation-2020-12]. Las invariantes semánticas (ponderado ≤ abierto, suma de regiones = total) se comprueban en código (M02 P4.9).
- **Números en JSON.** La especificación permite a cada implementación limitar rango y precisión; la interoperabilidad se apoya en la doble precisión binaria y solo los enteros hasta 2^53−1 coinciden exactamente en todas [src-ietf-rfc8259]. [inferencia] Por eso el check vuelve a leer `value` como `Decimal` desde texto y compara con tolerancia de 0,01 USD.
- **Tres respuestas ante un dato que viola el contrato** [inferencia, apoyada en el diseño de `reconcile.py`]:
  1. *Normalizar con regla declarada* cuando la corrección es inequívoca y aprobada (alias de etapa, conversión con tipo de cambio fechado).
  2. *Reportar y excluir* cuando hay una política aprobada y el dato no permite calcular (cierre vacío; etapa sin probabilidad con `exclude_and_report`), dejándolo en `data_quality_issues`.
  3. *Detener* cuando no hay política y seguir inventaría una cifra (duplicados sin `duplicate_policy`; etapas desconocidas sin política; código 2).

**Ejemplo con Altiplano (caso resuelto)**

La analista recibe el RAW del 19 de octubre. Llave candidata: `opp_id` (una fila por oportunidad y snapshot; en la tabla histórica, `(opp_id, snapshot_date)`). Recorrido:

| Fila | Problema | Regla del contrato | Decisión |
| --- | --- | --- | --- |
| 13–14 (OPP-1012) | Llave repetida, 125 000 y 90 000 | Unicidad de `opp_id` | Detener si no hay política; con `latest_last_activity`, conservar 90 000 y reportar `duplicate_id` |
| 23 (OPP-1021) | Cierre vacío | Sin fecha no se puede asignar al T4 ni a vencidas | Excluir y reportar `missing_close_date` |
| 29 (OPP-1027) | «Negociacion» | Dominio de etapas | Normalizar con `stage_aliases` |
| 38 (OPP-1036) | «En revisión» sin probabilidad | Dominio de etapas con probabilidad | Excluir y reportar `unknown_stage` si la política lo declara; si no, detener |
| 4, 9, 16, 21, 30, 37 | EUR | `reporting_currency` = USD | Convertir con `fx_rates.csv` del 2026-10-19 |

Evidencia: con `kpis_error_duplicate.json` el check falla con +125 000 en el abierto del Norte (§3.0).

**Ejemplo para completar:** con el snapshot del 26 (OPP-1040 a OPP-1042 «En pausa», USD 410 000) y sin `unknown_stage_policy`, ¿normalizar, reportar o detener? (Respuesta modelo: detener y pedir a FP&A la probabilidad o una política; el README de M02 indica que el check se detiene y lista todas. Asignar una probabilidad «parecida» inventaría 410 000 × p en el ponderado.)

**Conceptos erróneos frecuentes**

| ID | Creencia errónea | Por qué es errónea | Fuente |
| --- | --- | --- | --- |
| M06-CE06 | «Si la tabla tiene llave primaria declarada, no puede haber duplicados.» | En el lakehouse consultado las llaves son informativas y no se hacen cumplir. | [src-databricks-constraints] |
| M06-CE07 | «Un `CHECK (amount > 0)` impide montos vacíos.» | Un `CHECK` pasa si la expresión es nula; hace falta `NOT NULL`. | [src-postgres-constraints] |
| M06-CE08 | «Si el JSON valida contra el esquema, las cifras son correctas.» | El esquema fija forma; `format` es anotación por defecto y las invariantes van en código. | [src-jsonschema-validation-2020-12] |
| M06-CE09 | «Lo más limpio es corregir el error directamente en el archivo RAW.» | Se pierde la evidencia del origen y la corrección no se repite; va en una regla declarada en la capa intermedia. | [src-databricks-medallion][inferencia] |
| M06-CE10 | «Ante una etapa desconocida, lo prudente es asignarle la probabilidad de la etapa más parecida.» | Inventa un supuesto que nadie aprobó; sin política, el cálculo se detiene. | [inferencia]; README de M02 |
| M06-CE11 | «Un número en JSON conserva cualquier cantidad de decimales.» | La precisión depende de la implementación; se asume doble precisión. | [src-ietf-rfc8259] |

**Fichas candidatas**

- *Restricciones en tablas del lakehouse* (verificado 2026-10-23): Databricks · tablas Delta · `NOT NULL` y `CHECK` se hacen cumplir; `PRIMARY KEY` y `FOREIGN KEY` informativas (GA desde Databricks Runtime 15.2); `UNIQUE` informativa en Public Preview (Databricks SQL y Runtime 18.2+) · [src-databricks-constraints] · próxima revisión 2027-01-23.
- *Arquitectura en capas* (guía, verificado 2026-10-23): Databricks · lakehouse · capas bronce, plata y oro; recomendación, no requisito · [src-databricks-medallion] · próxima revisión 2027-04-23.

---

### Lección 3 — SQL y Databricks: filtrar y agregar cerca de los datos; cómo toca los datos un agente

**Objetivo de lección (→ M06-OE3):** Dada una necesidad de datos, decide qué granularidad se consulta en remoto y cuál se descarga, y elige conexión, identidad y modo de acceso del agente con mínimo privilegio.

**Ideas clave — consultar cerca de los datos**

- **El motor del almacén paraleliza y salta datos que no hacen falta.** La guía de rendimiento del proveedor describe que el motor analiza la consulta y la reparte entre los nodos, y que las tablas guardan estadísticas min/max por columna para saltar archivos al filtrar [src-databricks-perf]. [inferencia] Filtrar por `snapshot_date` y región en el `WHERE` aprovecha eso; descargar y filtrar después no.
- **El canal del agente trunca resultados grandes.** La documentación del servidor MCP de SQL advierte que los resultados grandes se recortan y recomienda devolver menos filas o agregar en SQL; además, las consultas son asíncronas y el servidor ejecuta el SQL tal como lo recibe, sin contexto semántico [src-databricks-dbsql-mcp] (ficha). [inferencia] Un agente que pide `SELECT *` puede razonar sobre una muestra truncada creyendo que es la tabla completa.
- **Descargar con la granularidad que exige el siguiente paso.** [inferencia] Para un dashboard basta el agregado; para reconciliar una región que falla hace falta el detalle de esa región y ese snapshot (40 filas, no 160 semanas); para un análisis exploratorio repetido, un extracto filtrado guardado en un formato tipado (L4). El conector de Python recomienda traer resultados grandes por lotes para limitar memoria [src-databricks-sql-connector-python].
- **Las reglas de SQL de M04 siguen vigentes:** `WHERE` antes de agrupar y `HAVING` después [src-postgres-tutorial-agg]; `sum` sobre cero filas devuelve nulo [src-postgres-aggregate]. M06 no las repite; las usa en los ejemplos.

**Ideas clave — cómo toca los datos un agente**

- **Nada se conecta «automáticamente».** [inferencia] Para que un agente consulte el almacén hay que elegir (1) la **conexión**: un servidor MCP gestionado por el proveedor, un conector SQL desde código o una CLI; (2) la **identidad**: la del usuario que llama (OAuth de usuario) o una cuenta de servicio; (3) los **permisos** sobre catálogo, esquema y tabla, y sobre el cómputo; (4) el **lugar de ejecución**: el almacén ejecuta, el agente recibe filas. Es el límite del currículo («identificar conexión, permisos, runtime y lugar de ejecución»).
- **Los servidores MCP gestionados usan los permisos del que llama.** El proveedor documenta un servidor de SQL que ejecuta consultas con los permisos de catálogo y de almacén de quien llama, autenticado con OAuth [src-databricks-managed-mcp][src-databricks-dbsql-mcp]. [inferencia] Si la analista tiene permiso de escritura, el agente que actúa con su identidad también puede escribir.
- **Lectura y escritura: el modo por defecto importa.** Ese servidor MCP de SQL permite lecturas y escrituras por defecto; una política integrada (`disallow_writes`) lo vuelve de solo lectura [src-databricks-dbsql-mcp] (ficha). [inferencia] La decisión segura para un agente que construye un dashboard es solo lectura más una identidad con `SELECT`; la escritura, si hace falta, va a un esquema de trabajo propio y nunca a producción.
- **Privilegios de catálogo: leer exige tres, escribir uno más.** Leer una tabla requiere `SELECT` sobre la tabla y `USE CATALOG` y `USE SCHEMA` sobre sus contenedores; escribir requiere además `MODIFY` (insertar, actualizar y borrar). Un privilegio concedido en un esquema o catálogo se hereda a los objetos actuales y futuros; el proveedor aconseja conceder la creación de tablas a nivel de esquema y preferir privilegios finos [src-databricks-uc-privileges] (ficha). [inferencia] Conceder `SELECT` en todo el catálogo «para no fallar» da acceso también a las tablas que se creen mañana.
- **Gobierno del servidor MCP.** Invocar uno de esos servidores exige el privilegio `EXECUTE` sobre él; hay políticas por llamada que pueden permitir, bloquear o pedir aprobación (en beta), límites de frecuencia y registros de uso y auditoría [src-databricks-govern-mcp] (ficha).
- **Las anotaciones de una herramienta no son un control.** La especificación MCP dice que los clientes deben tratar las anotaciones de comportamiento de una herramienta como no confiables salvo que vengan de servidores de confianza, y recomienda un humano capaz de denegar invocaciones [src-mcp-spec-tools]. [inferencia] Que una herramienta diga ser de solo lectura no reemplaza el permiso ni la política.
- **El contenido de los datos también puede ser una instrucción.** Un campo de texto libre del CRM que llega al contexto del agente es contenido no confiable (inyección indirecta) [src-owasp-llm01]. Se profundiza en M07 y M09.

**Ejemplo con Altiplano (caso resuelto)**

El agente debe preparar el dashboard del T4. Propuesta inicial: conectar el servidor MCP de SQL con la identidad de la analista (que tiene `MODIFY` en `altiplano_prod.crm` porque mantiene una tabla de ajustes) y pedir `SELECT * FROM altiplano_prod.crm.opportunity_snapshots`. Problemas: (1) el modo por defecto permite escrituras y la identidad puede modificar producción; (2) `SELECT *` sobre 160 semanas se truncaría y el agente razonaría sobre una muestra; (3) el dashboard no necesita filas de detalle. Decisión: identidad con `USE CATALOG`, `USE SCHEMA` y `SELECT` solo sobre `crm.opportunity_snapshots` y `fpa`, política de solo lectura en el servidor, consulta filtrada al snapshot `2026-10-19` y a las columnas que usa el cálculo; el detalle de una región se pide solo si la reconciliación falla. Evidencia: la consulta queda en el repositorio junto al extracto, con fecha de corte (L6).

**Ejemplo para completar:** el agente quiere «crear una tabla temporal con los resultados para no repetir la consulta». ¿Dónde y con qué permiso? (Respuesta modelo: en un esquema de trabajo propio, por ejemplo `altiplano_sandbox.analista`, con `CREATE TABLE` en ese esquema; nunca en `altiplano_prod`; o guardar un extracto local en Parquet, L4.)

**Conceptos erróneos frecuentes**

| ID | Creencia errónea | Por qué es errónea | Fuente |
| --- | --- | --- | --- |
| M06-CE12 | «Si conecto el MCP del almacén, el agente solo puede leer.» | El servidor MCP de SQL documentado permite lecturas y escrituras por defecto. | [src-databricks-dbsql-mcp] |
| M06-CE13 | «El agente tiene sus propios permisos, distintos de los míos.» | Los servidores gestionados ejecutan con los permisos de quien llama. | [src-databricks-managed-mcp] |
| M06-CE14 | «Si la herramienta se declara de solo lectura, no puede escribir.» | Las anotaciones son pistas no confiables; el control real es el permiso y la política. | [src-mcp-spec-tools] |
| M06-CE15 | «Lo que devuelve el agente es la tabla completa.» | Los resultados grandes se truncan; puede ser una muestra. | [src-databricks-dbsql-mcp] |
| M06-CE16 | «Dar `SELECT` en todo el catálogo es lo mismo que darlo en una tabla.» | El privilegio se hereda a todos los objetos actuales y futuros del catálogo. | [src-databricks-uc-privileges] |
| M06-CE17 | «Una vez configurado, cualquier agente de código consulta el almacén por su cuenta.» | Hay que elegir conexión, identidad, permisos y cómputo; nada es automático. | [src-databricks-managed-mcp][inferencia] |

**Fichas candidatas**

- *Servidores MCP gestionados del lakehouse* (verificado 2026-10-23): Databricks · Unity Gateway (`/ai-gateway/mcp-services/<nombre>`) · `system.ai.genie_one_mcp` GA (analítica en lenguaje natural); `system.ai.dbsql` en Unity Gateway Beta (un administrador de cuenta habilita la beta), ejecuta SQL con los permisos de catálogo y de almacén del que llama; OAuth con alcance `ai-gateway`; endpoints heredados de espacio de trabajo (`/api/2.0/mcp/sql`, alcance `sql`) sin trazas ni políticas · [src-databricks-managed-mcp] · próxima revisión 2027-01-23.
- *MCP de SQL: lectura y escritura* (verificado 2026-10-23): Databricks · `system.ai.dbsql` · herramienta `execute_sql`; lecturas y escrituras permitidas por defecto; `disallow_writes: true` en `system.ai.dbsql_policy` lo vuelve de solo lectura; resultados grandes truncados; consultas asíncronas; sin contexto semántico · Beta · [src-databricks-dbsql-mcp] · próxima revisión 2027-01-23.
- *Agentes de código compatibles* (verificado 2026-10-23): Databricks · Unity Gateway (CLI `ug`) · documenta Claude Code (CLI y escritorio), Codex (CLI y app de escritorio), Cursor, GitHub Copilot CLI, Gemini CLI, OpenCode y Pi (este sin cliente MCP); la página no indica estado de lanzamiento · [src-databricks-ug-coding-agents] · próxima revisión 2027-01-23. **Nota:** el registro del 2026-10-21 (`curriculo-estado-del-arte.md`) decía que Copilot no aparecía en la página de MCP gestionados; esa página sigue sin nombrarlo, pero la de agentes compatibles sí incluye Copilot CLI.
- *Gobierno de servidores MCP* (verificado 2026-10-23): Databricks · Unity Gateway · `EXECUTE` sobre el MCP más `USE CATALOG`/`USE SCHEMA`; políticas por llamada (permitir, bloquear, pedir aprobación) en Beta; límites de frecuencia; auditoría en `system.access.audit` · [src-databricks-govern-mcp] · próxima revisión 2027-01-23.
- *Privilegios de catálogo* (verificado 2026-10-23): Databricks · Unity Catalog, modelo de privilegios 1.0 · `SELECT` + `USE CATALOG` + `USE SCHEMA` para leer; `MODIFY` para escribir; herencia a objetos futuros; `INSERT`/`UPDATE`/`DELETE` finos en Beta · [src-databricks-uc-privileges] · próxima revisión 2027-01-23.
- *Conector SQL para Python* (verificado 2026-10-23): Databricks · biblioteca Python (PEP 249) · ejecuta SQL desde Python local en un almacén SQL o cómputo de uso general; autenticación con token personal, OAuth de máquina a máquina o OAuth de usuario; lectura por lotes recomendada para resultados grandes · GA (la página no indica otro estado) · [src-databricks-sql-connector-python] · próxima revisión 2027-04-23.

---

### Lección 4 — Python, DuckDB y Parquet, cada uno en su función

**Objetivo de lección (→ M06-OE4):** Dado un paso analítico, elige la herramienta y el formato según volumen, tipos y reproducibilidad.

**Ideas clave**

- **Un motor analítico embebido corre dentro del proceso, sin servidor.** El motor documentado no requiere instalar ni mantener un servidor de base de datos, no tiene dependencias externas y ejecuta las consultas por lotes de valores en columnas, lo que lo orienta a análisis que agregan o unen gran parte de los datos [src-duckdb-why]. Desde Python se instala como paquete y puede usar una base en memoria (nada se guarda) o un archivo persistente [src-duckdb-python] (ficha).
- **Concurrencia limitada por diseño.** En modo embebido, un solo proceso puede leer y escribir el archivo de base; varios procesos solo pueden leer; escribir desde varios procesos exige otro modo de despliegue [src-duckdb-concurrency] (ficha). [inferencia] Sirve para el análisis local de una persona o un agente, no para que varios usuarios escriban a la vez.
- **Consultar archivos directamente.** El motor embebido consulta un archivo Parquet por su ruta en un `SELECT`, acepta listas, comodines y carpetas, y lee solo las columnas que la consulta pide; los filtros se empujan a la lectura y saltan partes del archivo usando sus estadísticas, si el archivo las tiene [src-duckdb-parquet] (ficha).
- **Parquet es un formato columnar abierto y autodescrito.** Apache lo define como un formato de archivo de código abierto orientado a columnas para almacenar y recuperar datos con eficiencia, con compresión y codificación [src-parquet-overview]. El archivo se organiza en grupos de filas con un fragmento por columna y termina con los metadatos, escritos al final [src-parquet-file-format]; esos metadatos incluyen el esquema del archivo [src-parquet-thrift] y estadísticas min/max a varios niveles [src-parquet-readme]. Tiene un tipo lógico `DECIMAL` de precisión y escala declaradas [src-parquet-logical-types].
- **CSV no tiene tipos.** La descripción informativa del formato define registros, campos, comillas y un encabezado opcional, pero ningún tipo de dato [src-ietf-rfc4180]. El lector CSV de Python devuelve todo como texto salvo opciones explícitas [src-python-csv]. El motor embebido infiere delimitador, encabezado y tipos a partir de una muestra (20 480 líneas por defecto) y advierte que valores fuera de la muestra pueden no encajar en el tipo inferido; fijar los tipos explícitamente lo evita [src-duckdb-csv] (ficha).
- **Python para reglas, importes y checks.** Las reglas de negocio con políticas declaradas, el `Decimal` para dinero [src-python-floatingpoint] y el check con código de salida [src-python-sys] están en Python en el caso Altiplano (`reconcile.py`). [inferencia] SQL puede expresar muchas de esas reglas, pero el check de reconciliación conviene escribirlo por una ruta distinta a la del cálculo (L6).
- **Reglas de elección** [inferencia, síntesis]:

| Paso | Herramienta | Por qué |
| --- | --- | --- |
| Filtrar y agregar la tabla histórica del almacén | SQL remoto | Los datos y el cómputo están allí; se trae solo el resultado |
| Explorar varias veces un extracto de 12 snapshots en el portátil | Motor embebido sobre Parquet | Sin servidor, lee solo columnas necesarias, tipos preservados |
| Aplicar la política de duplicados, alias, EUR → USD con `Decimal`, escribir el contrato | Python | Reglas explícitas, tipos exactos, pruebas unitarias |
| Guardar un intermedio que otro paso volverá a leer | Parquet | Esquema y tipos dentro del archivo, columnar, comprimido |
| Entregar un archivo para que alguien lo abra en una hoja de cálculo | CSV con tipos documentados | Legible por cualquiera; el contrato de columnas va aparte |

**Ejemplo con Altiplano (caso resuelto)**

La analista quiere comparar los 12 snapshots semanales del T4 para ver cómo se mueve el pipeline del Sur. Opción elegida: una consulta remota filtrada a esas 12 fechas y a las columnas del cálculo, guardada una vez como Parquet (`extract_q4_2026.parquet`) con la consulta y la fecha de extracción al lado; después, consultas locales con el motor embebido sobre ese archivo; y la regla de negocio y el contrato con Python. Por qué no CSV: `amount` y `expected_close_date` volverían como texto o con tipos inferidos por muestra; una fecha vacía como la de OPP-1021 puede cambiar la inferencia de la columna [src-duckdb-csv][inferencia]. Por qué no repetir la consulta remota en cada exploración: cuesta cómputo y cada ejecución podría ver datos distintos si la tabla cambió, lo que rompe la reproducibilidad [inferencia].

**Ejemplo para completar:** un agente propone convertir `amount` a `float` en el Parquet «para que pese menos». ¿Qué tipo pides y por qué? (Respuesta modelo: `DECIMAL` con escala 2; el binario de coma flotante no representa exactamente importes decimales [src-python-floatingpoint][src-parquet-logical-types].)

**Conceptos erróneos frecuentes**

| ID | Creencia errónea | Por qué es errónea | Fuente |
| --- | --- | --- | --- |
| M06-CE18 | «Para consultar con SQL en local hace falta instalar un servidor de base de datos.» | Un motor embebido corre dentro del proceso, sin servidor. | [src-duckdb-why] |
| M06-CE19 | «CSV y Parquet guardan lo mismo; solo cambia el tamaño.» | CSV no tiene tipos ni esquema; Parquet guarda esquema, tipos y estadísticas. | [src-ietf-rfc4180][src-parquet-thrift] |
| M06-CE20 | «Si el motor infiere bien los tipos del CSV en la prueba, siempre los inferirá bien.» | La inferencia usa una muestra; valores fuera de ella pueden no encajar. | [src-duckdb-csv] |
| M06-CE21 | «Un archivo de base embebida sirve para que todo el equipo escriba a la vez.» | En modo embebido solo un proceso escribe. | [src-duckdb-concurrency] |
| M06-CE22 | «Leer un Parquet obliga a leerlo entero.» | Se leen solo las columnas pedidas y los filtros saltan partes con estadísticas. | [src-duckdb-parquet] |

**Fichas candidatas**

- *Motor analítico embebido* (verificado 2026-10-23): DuckDB 2.0 · biblioteca Python (`pip install duckdb`, Python 3.11+) · base en memoria o en archivo; consulta DataFrames por nombre (solo lectura); un proceso lector-escritor o varios solo lectores; escritura multiproceso con otro protocolo · estable · [src-duckdb-python][src-duckdb-concurrency][src-duckdb-why] · próxima revisión 2027-01-23.
- *Lectura de Parquet y CSV en el motor embebido* (verificado 2026-10-23): DuckDB 2.0 · SQL · Parquet: lectura directa, proyección y filtros empujados, compresión Snappy por defecto al escribir; CSV: detección automática con muestra de 20 480 líneas, tipos explícitos con `columns` o `types` · estable · [src-duckdb-parquet][src-duckdb-csv] · próxima revisión 2027-01-23.
- *Especificación Parquet* (verificado 2026-10-23): Apache Parquet · formato de archivo · esquema en `FileMetaData`; estadísticas min/max; tipo lógico `DECIMAL`; recomendaciones de tamaño de grupo de filas · especificación abierta · [src-parquet-overview][src-parquet-file-format][src-parquet-thrift][src-parquet-readme][src-parquet-logical-types] · próxima revisión 2027-10-23 (volatilidad baja; se deja como ficha solo si el autor nombra versiones).

---

### Lección 5 — Determinista, estadístico y generativo: qué cifra nunca debe calcular un LLM

**Objetivo de lección (→ M06-OE5):** Dada una salida del flujo, identifica su naturaleza, decide qué cifra no debe producir un modelo generativo y elige cómo verificar el texto generado.

**Ideas clave**

- **Determinista:** misma entrada y mismos supuestos, misma salida; se verifica con igualdad o tolerancia fija. En Altiplano, el pipeline abierto, el ponderado, la cobertura y el conteo de vencidas [inferencia]. `reconcile.py` lo demuestra: el mismo snapshot con los mismos supuestos da siempre código 0 contra `kpis_correct.json` (§3.0).
- **Estadístico:** una estimación con supuestos explícitos sobre una muestra o un modelo; se verifica revisando el método, los supuestos y la sensibilidad, no con igualdad al centavo [inferencia]. La biblioteca estándar de Python ofrece estadística básica, se declara no competidora de paquetes especializados, y señala que la media es muy sensible a valores atípicos mientras la mediana es una medida robusta [src-python-statistics]. También advierte que los valores NaN producen resultados sorprendentes en funciones que ordenan o cuentan [src-python-statistics].
- **Generativo:** texto plausible producido por un modelo de lenguaje. No es determinista: incluso con temperatura 0 las salidas pueden variar entre llamadas idénticas [src-anthropic-glossary]. Las técnicas de mitigación (permitir «no sé», citar, restringir a los documentos dados) reducen pero no eliminan las alucinaciones, y la guía pide validar la información crítica [src-anthropic-reduce-hallucinations].
- **Delegar el cálculo a código mejora la exactitud.** Un trabajo de investigación mostró que los modelos pueden descomponer bien un problema y aun así equivocarse en la aritmética; hacer que el modelo escriba un programa y que un intérprete lo ejecute superó a modelos mucho mayores que razonaban en texto [src-arxiv-pal]. [inferencia] El modelo puede **proponer** la consulta o el código; la cifra sale de **ejecutarlos**.
- **Qué nunca calcula un LLM en el flujo** [inferencia]: ninguna cifra que entra al contrato `pipeline_kpis` (montos, ponderados, razones, conteos), ninguna conversión de moneda, ningún total que alguien vaya a reconciliar y ninguna clasificación que cambie una cifra (qué etapa es abierta, qué fila es duplicado). Sí puede: redactar la narrativa, proponer etiquetas de texto libre para revisión humana y sugerir consultas que se ejecutan.
- **Verificar el texto generado contra el contrato.** [inferencia] El comentario solo puede citar cifras presentes en `pipeline_kpis.json`. Un check simple extrae los números del texto y comprueba que cada uno coincide con un `value` del contrato (con el mismo redondeo de presentación) y que la región citada es la correcta. La autoverificación del modelo no es independiente (dx-mc15, ya expuesto en el diagnóstico).
- **Lo estadístico se presenta como estimación.** [inferencia] Si el dashboard muestra una «alerta de monto atípico» o una proyección de cierre, la etiqueta dice que es una estimación, nombra el método (mediana, rango intercuartílico, regresión) y su ventana de datos, y nunca se mezcla en el mismo campo con un KPI determinista.

**Ejemplo con Altiplano (caso resuelto)**

El dashboard tendrá tres salidas nuevas: (1) cobertura del Sur; (2) una marca de «oportunidad atípica» para montos muy por encima de lo típico de su región; (3) un párrafo para dirección. Clasificación: (1) determinista, la produce el código de cálculo (1,3778 contra `kpis_correct.json`); (2) estadística: en el Sur la media de los montos abiertos es 121 818 y la mediana 112 000 (§3.0); como la media se mueve con los valores grandes que se quieren detectar, la referencia razonable es la mediana o un rango basado en cuartiles [src-python-statistics][inferencia]; se presenta como alerta para revisar, no como dato contable; (3) generativa: el modelo recibe el contrato y redacta; un check compara cada cifra del párrafo con el contrato. Giro de verificación: el borrador dice «pipeline abierto total de 3,78 millones»; el contrato dice 3 772 000, que con un decimal de millones se redondea a 3,77; el check marca la discrepancia y el párrafo se corrige.

**Ejemplo para completar:** el modelo propone añadir «la probabilidad de cerrar el T4 por encima de la cuota es del 64 %». ¿Qué tipo de salida es, quién debería producirla y qué haría falta para mostrarla? (Respuesta modelo: estadística; un modelo estadístico documentado con supuestos y datos históricos, no el modelo generativo; sin método ni supuestos, no se muestra.)

**Conceptos erróneos frecuentes**

| ID | Creencia errónea | Por qué es errónea | Fuente |
| --- | --- | --- | --- |
| M06-CE23 | «Con temperatura 0 el modelo es determinista y puede calcular cifras reproducibles.» | Incluso con temperatura 0 las salidas pueden variar entre llamadas. | [src-anthropic-glossary] |
| M06-CE24 | «Si el prompt dice "usa solo los datos dados", el texto no tendrá errores.» | Las técnicas reducen pero no eliminan las alucinaciones; hay que validar. | [src-anthropic-reduce-hallucinations] |
| M06-CE25 | «La media es la mejor referencia para detectar montos atípicos.» | La media se mueve con los atípicos; la mediana es robusta. | [src-python-statistics] |
| M06-CE26 | «Una estimación estadística se verifica igual que un KPI: al centavo.» | Se verifica el método, los supuestos y la sensibilidad, no una igualdad exacta. | [inferencia] |
| M06-CE27 | «Si el modelo describe bien los pasos del cálculo, el resultado será correcto.» | Los modelos pueden razonar bien y fallar en la aritmética; la ejecución en código acierta más. | [src-arxiv-pal] |

**Fichas candidatas:** ninguna obligatoria. Si el autor ejemplifica parámetros de temperatura o técnicas de un proveedor concreto, va en ficha (Anthropic · API · no determinismo con temperatura 0 · verificado 2026-10-23 · [src-anthropic-glossary] · próxima revisión 2027-01-23).

---

### Lección 6 — Reconciliación y trazabilidad como checks ejecutables; datos sintéticos

**Objetivo de lección (→ M06-OE6):** Dada una diferencia o un check, decide qué check la detecta y cuál no; elige cómo generar datos sintéticos que ejerciten los casos límite.

**Ideas clave — reconciliación**

- **Un check ejecutable termina con un código que otra herramienta puede leer.** El código 0 significa éxito y cualquier otro, fallo [src-python-sys]. `reconcile.py` usa 0 (todo coincide), 1 (el dashboard difiere) y 2 (faltan datos o un supuesto) (§3.0). [inferencia] Así lo puede ejecutar un agente, un hook o la CI sin interpretar texto.
- **Reconciliar es recalcular por otra ruta y comparar con tolerancias explícitas.** [inferencia] `reconcile.py` recalcula desde los CSV crudos, con `Decimal`, y compara con el contrato: 0,01 USD para montos, 0,0001 para razones, exacto para conteos (README de M02). Además exige que el dashboard reporte cada problema de calidad (`kpis_error_missing_issue.json` falla aunque las cifras estén bien).
- **Independencia.** [inferencia] Si el check importa la misma función que el dashboard, un error en esa función aparece en los dos lados y el check pasa. La reconciliación útil comparte el contrato y los supuestos, no el código de cálculo.
- **Un check solo detecta lo que sus datos ejercitan.** [inferencia] M04 mostró que cambiar `<` por `<=` en la regla de vencidas pasa la reconciliación porque ninguna oportunidad cierra el día del snapshot. Los datos sintéticos se diseñan para cubrir esas fronteras.
- **Tipos de check** [inferencia, síntesis]: de esquema (forma del contrato), de calidad (unicidad, nulos, dominios), de invariantes (ponderado ≤ abierto, suma de regiones = total), de reconciliación (recalcular y comparar) y de narrativa (cifras del texto = cifras del contrato, L5). Cada uno detecta errores distintos.

**Ideas clave — trazabilidad**

- **Trazabilidad mínima de una cifra** [inferencia]: fecha de corte (`as_of_date`), supuestos (`assumption_ids` y su archivo), fuente (archivo o tabla y consulta), versión del código (commit) y problemas de calidad reportados. El contrato `pipeline_kpis` ya lleva tres de esas cinco; la consulta y el commit se registran junto al extracto.
- **Linaje automático, con límites.** El catálogo del proveedor captura linaje a nivel de tabla y columna para las consultas que se ejecutan en la plataforma; no lo conserva al renombrar objetos, no cubre ciertas operaciones y lo guarda en tablas de sistema durante un año móvil; verlo exige permisos [src-databricks-uc-lineage] (ficha). [inferencia] El linaje de la plataforma no ve lo que pasa después de descargar: el tramo local (Parquet, Python, dashboard) se documenta en el repositorio.
- **La historia de una tabla no es una copia de respaldo.** La historia de tablas del proveedor permite consultar versiones anteriores, pero por defecto el registro se conserva 30 días y los archivos borrados 7; tras la limpieza no se puede volver a esa versión, y el proveedor desaconseja usarla como respaldo de largo plazo [src-databricks-delta-history] (ficha). [inferencia] Para reproducir una cifra de hace un trimestre hay que haber guardado el extracto con su fecha.

**Ideas clave — datos sintéticos**

- **Semilla fija = mismos datos en cada ejecución.** El generador pseudoaleatorio de Python es determinista: con la misma semilla repite la secuencia; la compatibilidad entre versiones de Python solo se garantiza para algunas funciones; y no sirve para seguridad (para eso está `secrets`) [src-python-random]. [inferencia] Un generador de datos de laboratorio fija la semilla, registra la versión de Python y guarda el archivo generado junto con sus cifras esperadas.
- **Sintético derivado de datos reales no es anónimo por definición.** Un estudio evaluó generadores de datos sintéticos y concluyó que no ofrecen mejor equilibrio entre privacidad y utilidad que la anonimización tradicional, y que su ganancia de privacidad es impredecible [src-arxiv-synthetic-groundhog]. [inferencia] Por eso Altiplano se inventa desde cero, con nombres evidentemente ficticios («Cuenta Ficticia Álamo») y sin partir de ningún extracto real.
- **Casos límite a propósito** [inferencia]: cierre igual al último día del trimestre (OPP-1038, 2026-12-31), cierre igual al día del snapshot (falta en los datos de M02: es el hueco que dejó pasar el cambio en vencidas), fecha vacía, llave repetida con montos distintos, etapa fuera del dominio, moneda distinta a la de reporte, región desconocida. Cada caso tiene su cifra esperada calculada a mano o por la ruta independiente.

**Ejemplo con Altiplano (caso resuelto)**

El equipo añade al snapshot sintético una oportunidad abierta del Norte con cierre el 2026-10-19 (el día del snapshot) para cubrir la frontera de vencidas. Con la regla correcta (`close_date < snapshot_date`) no cuenta como vencida; con `<=` sí. Antes del cambio, el error de `<=` pasaba la reconciliación; después, `overdue_count Norte` falla con diferencia 1. Decisión: el caso entra en el generador con semilla fija y en los fixtures esperados; la cifra esperada se calcula por la ruta de `reconcile.py`, no por el dashboard. [inferencia; el resultado concreto no se ejecutó en esta investigación: ver Huecos.]

**Ejemplo para completar:** un agente propone reconciliar «importando `calculate()` del módulo del dashboard para no duplicar código». ¿Qué responde la revisión? (Respuesta modelo: rechazar; el check dejaría de ser independiente y no detectaría un error en `calculate()`; puede compartir el contrato y los supuestos, no la función.)

**Conceptos erróneos frecuentes**

| ID | Creencia errónea | Por qué es errónea | Fuente |
| --- | --- | --- | --- |
| M06-CE28 | «Si la reconciliación pasa, el cálculo es correcto en todos los casos.» | Solo cubre los casos que sus datos ejercitan. | [inferencia]; simulación de M04 §3.0 |
| M06-CE29 | «Reutilizar la función de cálculo en el check evita duplicar trabajo sin perder nada.» | El check deja de ser independiente: el mismo error aparece en ambos lados. | [inferencia] |
| M06-CE30 | «La historia de la tabla permite reconstruir cualquier cifra pasada.» | La retención por defecto es limitada y el proveedor desaconseja usarla como respaldo. | [src-databricks-delta-history] |
| M06-CE31 | «El linaje automático cubre todo el recorrido hasta el dashboard.» | Cubre lo ejecutado en la plataforma, con límites; lo local se documenta aparte. | [src-databricks-uc-lineage] |
| M06-CE32 | «Datos sintéticos generados a partir de los reales son anónimos.» | Pueden no impedir inferencias sobre los datos de origen. | [src-arxiv-synthetic-groundhog] |
| M06-CE33 | «Datos aleatorios sin semilla son mejores porque prueban más casos.» | No se reproducen y no garantizan las fronteras que importan. | [src-python-random][inferencia] |

**Fichas candidatas**

- *Linaje en el catálogo* (verificado 2026-10-23): Databricks · Unity Catalog · linaje de tabla y columna automático para consultas en la plataforma; sin datos antes del 2024-09-01; no se conserva al renombrar; tablas de sistema con un año móvil; ver exige `BROWSE` en el catálogo · [src-databricks-uc-lineage] · próxima revisión 2027-01-23.
- *Historia de tablas y viaje en el tiempo* (verificado 2026-10-23): Databricks · tablas Delta · `DESCRIBE HISTORY`; `VERSION AS OF` / `TIMESTAMP AS OF`; retención por defecto 30 días de registro y 7 de archivos borrados; desaconsejado como respaldo · [src-databricks-delta-history] · próxima revisión 2027-01-23.

---

## 4. Qué NO enseñar o enseñar con cautela

1. **No enseñar a operar el lakehouse** (crear almacenes, clústeres, pipelines declarativos, catálogos). El alumno decide ubicación, granularidad y permisos; la administración no es su función [inferencia].
2. **No presentar las capas bronce/plata/oro como estándar.** Son una recomendación de un proveedor [src-databricks-medallion]; el principio duradero es conservar el origen y transformar en pasos trazables.
3. **Con cautela: el estado de los servidores MCP gestionados.** El servidor de SQL está en beta y su modo por defecto permite escrituras [src-databricks-dbsql-mcp]; la lista de agentes compatibles cambió entre el 21 y el 23 de octubre (§3, L3). Todo en fichas trimestrales.
4. **No afirmar que un agente «ejecuta SQL en el almacén» sin decir con qué conexión, identidad y permisos** (límite del currículo).
5. **No enseñar formas normales con su nomenclatura formal** (1FN, 2FN, 3FN). Basta con la idea de un valor por concepto y tablas de referencia con dueño; la fuente primaria no se pudo abrir (Huecos) [inferencia].
6. **No enseñar ajustes de rendimiento** (particiones, agrupamiento, tamaño de grupos de filas, cachés). Cambian por producto y no son decisiones del alumno [src-databricks-perf][src-parquet-readme].
7. **Con cautela: estadística.** Solo la distinción determinista/estadístico/generativo y la robustez de la mediana. Nada de pruebas de hipótesis ni modelos de pronóstico: no hay fuente ni caso que lo sostenga en este manual [inferencia].
8. **No mostrar ninguna credencial con forma real** en los ejemplos de conexión (ni siquiera de prueba). Usar OAuth de usuario como ejemplo conceptual y marcadores `TOKEN_FICTICIO_…` [src-owasp-secrets-mgmt].
9. **No reutilizar los escenarios de `dx-b5-01` a `dx-b5-04`** (ver aviso inicial).
10. **No prometer que el linaje o la historia de la plataforma reemplazan el registro de la consulta y el extracto** [src-databricks-uc-lineage][src-databricks-delta-history].

---

## 5. Propuesta de laboratorio: del snapshot al dashboard de Altiplano

**Formato (D-024, estándar §5):** caso continuo en seis pasos (`## Paso N · … {#paso-n}`), cada uno con dos preguntas de opción múltiple (`::lab-questions{step="paso-n"}`, `use: "lab"`). Doce preguntas, dos por objetivo evaluado. Sin entregable ni rúbrica. Escenarios propios, distintos de las comprobaciones, el banco y el diagnóstico. Hay un giro (paso 6) que obliga a revisar una decisión del paso 2. Apartado opcional «Pruébalo en tu entorno»: correr `reconcile.py` con los fixtures y con el snapshot del 26.

**Situación inicial.** El jefe de FP&A de Altiplano pide un dashboard semanal de pipeline del T4 con un párrafo para dirección. La analista dirige a un agente de código. Materiales: el snapshot del 19, el contrato `pipeline_kpis` v1, `reconcile.py`, un diagrama propuesto por el agente y fragmentos de su configuración.

### Paso 1 · El diagrama del agente {#paso-1}

Material: el agente propone un dashboard que descarga del almacén las filas del snapshot y calcula todo en el navegador; ofrece un selector para que cada jefe regional vea «solo su región».

- **P1 (OE1).** El jefe del Norte no debería ver las cuentas del Sur. ¿Qué cambio del diagrama lo consigue? Clave: que el servidor entregue a cada usuario solo los agregados de su región según su identidad. Distractores: ocultar la región en el selector de la interfaz (M06-CE02); validar la región elegida con JavaScript antes de mostrarla (M06-CE01).
- **P2 (OE1).** ¿Dónde se calcula la cobertura regional? Clave: en el código de cálculo, con `Decimal`, que la escribe en el contrato. Distractores: en la interfaz a partir de los montos ya formateados (M06-CE05); en la interfaz, porque da lo mismo si el número se ve bien (M06-CE04).

### Paso 2 · El RAW llega con sorpresas {#paso-2}

Material: extracto con OPP-1012 repetida, OPP-1021 sin cierre y la nota del agente: «la tabla tiene llave primaria en `opp_id`, así que no puede haber duplicados».

- **P3 (OE2).** ¿Qué responde la analista a la nota del agente? Clave: comprobar la unicidad en el código, porque en el almacén la llave es informativa. Distractores: confiar en la llave declarada (M06-CE06); borrar a mano la fila más antigua del RAW (M06-CE09).
- **P4 (OE2).** El contrato valida contra el esquema, pero una fila trae `as_of_date: "2026-19-10"`. ¿Qué se concluye? Clave: el esquema no garantizó la fecha (`format` es anotación); hace falta un check en código. Distractores: el validador la habría rechazado, así que no llegó (M06-CE08); basta con añadir un `CHECK (as_of_date > '2026-01-01')` en la tabla, aunque la columna admita vacíos (M06-CE07).

### Paso 3 · El agente se conecta {#paso-3}

Material: fragmento de configuración: servidor MCP de SQL del almacén, identidad de la analista (con `MODIFY` en `altiplano_prod.crm` por la tabla de ajustes), sin política; consulta propuesta `SELECT * FROM altiplano_prod.crm.opportunity_snapshots`.

- **P5 (OE3).** ¿Qué configuración eliges? Clave: identidad con `SELECT` solo en las tablas necesarias y política de solo lectura en el servidor. Distractores: mantener la configuración porque el servidor MCP solo lee (M06-CE12); confiar en que la herramienta se declara de solo lectura (M06-CE14).
- **P6 (OE3).** La reconciliación falla en el Sur y el agente necesita investigar. ¿Qué pide al almacén? Clave: el detalle del Sur para el snapshot del 2026-10-19, con las columnas del cálculo. Distractores: `SELECT *` de toda la tabla histórica, porque lo devuelto es la tabla completa (M06-CE15); conceder `SELECT` en todo el catálogo para no volver a pedir permisos (M06-CE16).

### Paso 4 · El análisis local {#paso-4}

Material: la analista quiere comparar 12 snapshots del T4 varias veces durante la semana en su portátil; el agente propone exportar a CSV y abrirlo con el motor embebido «que detecta los tipos solo».

- **P7 (OE4).** ¿Qué formato pides para el extracto? Clave: Parquet con `amount` como decimal y las fechas tipadas. Distractores: CSV, porque guarda lo mismo con otro tamaño (M06-CE19); CSV, porque si la detección de tipos funcionó en la prueba funcionará siempre (M06-CE20).
- **P8 (OE4).** Dos analistas quieren escribir resultados en el mismo archivo de base embebida desde sus equipos a la vez. ¿Qué decides? Clave: cada una escribe su propio archivo de resultados (o se usa el almacén); el modo embebido admite un solo proceso escritor. Distractores: compartir el archivo en una carpeta de red (M06-CE21); instalar un servidor de base de datos para poder consultar en local (M06-CE18).

### Paso 5 · El párrafo para dirección {#paso-5}

Material: el contrato correcto, un borrador generado que dice «la cobertura más alta es la del Centro, 1,38x» (en el contrato: Sur 1,3778, Centro 1,3305) y una propuesta de «alerta de montos atípicos» basada en la media regional.

- **P9 (OE5).** ¿Cómo evitas que el párrafo llegue con cifras erróneas? Clave: un check que compara cifras y regiones del texto con el contrato antes de publicar. Distractores: fijar la temperatura en 0 para que sea determinista (M06-CE23); añadir al prompt «usa solo los datos dados» (M06-CE24).
- **P10 (OE5).** ¿Qué referencia usa la alerta de atípicos y cómo se presenta? Clave: la mediana regional (o cuartiles), presentada como estimación para revisar. Distractores: la media regional, que es la mejor referencia (M06-CE25); verificar la alerta al centavo como un KPI (M06-CE26).

### Paso 6 · El check que no vio el error {#paso-6}

Material (giro): una semana después, el agente cambió la regla de vencidas a `<=` y la reconciliación siguió en verde. Además propone que el check importe `calculate()` del dashboard «para no duplicar código».

- **P11 (OE6).** ¿Por qué pasó el check y qué cambias? Clave: ningún dato sintético cerraba el día del snapshot; se añade ese caso con su cifra esperada al generador con semilla fija. Distractores: si la reconciliación pasa, el cálculo está bien (M06-CE28); generar datos aleatorios sin semilla en cada ejecución para cubrir más casos (M06-CE33).
- **P12 (OE6).** ¿Qué respondes a la propuesta de importar `calculate()`? Clave: rechazarla; el check debe recalcular por su propia ruta y compartir solo contrato y supuestos. Distractores: aceptarla, porque evita duplicar sin perder nada (M06-CE29); aceptarla, porque el linaje de la plataforma ya registra el recorrido completo (M06-CE31).

**Conexión con el paso 2 (giro):** el paso 6 obliga a revisar qué checks de calidad se decidieron en el paso 2: la unicidad y las fechas estaban cubiertas, pero ninguna frontera de vencidas. [inferencia]

**Pruébalo en tu entorno (opcional, sin registro):** correr `reconcile.py` con los cuatro fixtures y comprobar los códigos de salida de §3.0; correrlo con `--snapshot opportunities_snapshot_2026-10-26.csv` y un archivo de supuestos sin `unknown_stage_policy` para ver el código 2; si tienes el motor embebido, convertir el snapshot a Parquet con tipos explícitos y comparar `count(*)` y la suma de `amount` con los de Python.

---

## 6. Registro de fuentes

Fuentes nuevas consultadas el 2026-10-23. Las reutilizadas indican su fecha de consulta original («(existente)»: ya están en `content/sources.json` o en un registro de `investigacion/`). Criterio de próxima revisión: Muy alta y Alta → 2027-01-23; Media → 2027-04-23; Baja → 2027-10-23 (las reutilizadas conservan su propia fecha si no se reabrieron).

| ID | Título | URL | Organización | Consultado | Afirmaciones que sustenta | Volatilidad | Próxima revisión |
| --- | --- | --- | --- | --- | --- | --- | --- |
| src-databricks-managed-mcp (existente en `curriculo-estado-del-arte.md`, no en `sources.json`) | Databricks-managed MCP servers (act. 2026-10-21) | https://docs.databricks.com/aws/en/agents/mcp/managed-mcp | Databricks | 2026-10-23 (reabierta) | Servidores MCP de Unity Gateway y estados (Genie One GA; dbsql, web_search, sandbox en Beta); permisos del que llama; OAuth y alcances; endpoints heredados sin trazas ni políticas; enlaza guía de agentes de código; no nombra Copilot | Muy alta | 2027-01-23 |
| src-databricks-dbsql-mcp | Databricks SQL MCP (act. 2026-10-16) | https://docs.databricks.com/aws/en/agents/mcp-tools/databricks-sql | Databricks | 2026-10-23 | `execute_sql`; lecturas y escrituras por defecto; `disallow_writes` en `system.ai.dbsql_policy`; permisos de Unity Catalog; resultados grandes truncados; consultas asíncronas; sin contexto semántico | Muy alta | 2027-01-23 |
| src-databricks-ug-coding-agents | Supported coding agents (act. 2026-10-07) | https://docs.databricks.com/aws/en/ai-gateway/coding-agent-supported-agents | Databricks | 2026-10-23 | Agentes y superficies compatibles con Unity Gateway (incluye Copilot CLI y Cursor); capacidades por agente; sin estado de lanzamiento | Muy alta | 2027-01-23 |
| src-databricks-govern-mcp | Govern MCP services (act. 2026-10-19) | https://docs.databricks.com/aws/en/ai-gateway/govern-mcp-service | Databricks | 2026-10-23 | `EXECUTE` sobre el MCP; políticas por llamada en Beta; selección de herramientas; límites de frecuencia; auditoría y trazas | Muy alta | 2027-01-23 |
| src-databricks-uc-privileges | Unity Catalog privileges reference (act. 2026-10-12) | https://docs.databricks.com/aws/en/data-governance/unity-catalog/manage-privileges/privileges | Databricks | 2026-10-23 | `SELECT`, `USE CATALOG`, `USE SCHEMA` para leer; `MODIFY` para escribir; herencia a objetos futuros; privilegios finos en Beta; recomendaciones de mínimo privilegio | Alta | 2027-01-23 |
| src-databricks-constraints | Constraints on Databricks (act. 2026-09-11) | https://docs.databricks.com/aws/en/tables/constraints | Databricks | 2026-10-23 | `NOT NULL` y `CHECK` se hacen cumplir; PK, FK y UNIQUE informativas; versiones de runtime | Alta | 2027-01-23 |
| src-databricks-medallion | What is the medallion lakehouse architecture? (act. 2026-09-11) | https://docs.databricks.com/aws/en/lakehouse/medallion | Databricks | 2026-10-23 | Capas bronce, plata y oro; RAW con historia para reprocesar y auditar; validación y esquema en plata; recomendación no obligatoria | Media | 2027-04-23 |
| src-databricks-perf (existente) | Best practices for performance efficiency (act. 2026-09-11) | https://docs.databricks.com/aws/en/lakehouse-architecture/performance-efficiency/best-practices | Databricks | 2026-10-23 (reabierta) | El motor analiza y paraleliza consultas; estadísticas min/max para saltar datos; recomendaciones de particionado y caché | Media | 2027-04-23 |
| src-databricks-sql-warehouse | Connect to a SQL warehouse (act. 2026-10-09) | https://docs.databricks.com/aws/en/compute/sql-warehouse/ | Databricks | 2026-10-23 | El almacén SQL es el recurso de cómputo de las consultas; tipos serverless, pro y clásico; CAN MONITOR para arrancar | Alta | 2027-01-23 |
| src-databricks-sql-connector-python | Databricks SQL Connector for Python (act. 2026-09-29) | https://docs.databricks.com/aws/en/dev-tools/python-sql-connector | Databricks | 2026-10-23 | SQL desde Python local en cómputo del almacén; PEP 249; token personal, OAuth M2M y U2M; lectura por lotes para resultados grandes | Media | 2027-04-23 |
| src-databricks-delta-history | Work with table history (act. 2026-09-11) | https://docs.databricks.com/aws/en/delta/history | Databricks | 2026-10-23 | `DESCRIBE HISTORY`; viaje en el tiempo; retención 30 / 7 días; VACUUM; no usar como respaldo | Alta | 2027-01-23 |
| src-databricks-uc-lineage | View data lineage using Unity Catalog (act. 2026-10-19) | https://docs.databricks.com/aws/en/data-governance/unity-catalog/data-lineage | Databricks | 2026-10-23 | Linaje automático de tabla y columna; límites (renombres, operaciones no cubiertas, desde 2024-09-01); retención; permisos para verlo | Alta | 2027-01-23 |
| src-duckdb-why | Why DuckDB | https://duckdb.org/why_duckdb | DuckDB Foundation | 2026-10-23 | Embebido sin servidor; sin dependencias; motor columnar vectorizado para análisis; portabilidad | Media | 2027-04-23 |
| src-duckdb-parquet | Reading and Writing Parquet Files (docs 2.0) | https://duckdb.org/docs/2.0/data/parquet/overview.html | DuckDB Foundation | 2026-10-23 | Consulta directa de Parquet; proyección y filtros empujados con mapas de zona; `COPY … (FORMAT parquet)`; compresión Snappy por defecto | Alta | 2027-01-23 |
| src-duckdb-csv | CSV Import (docs 2.0) | https://duckdb.org/docs/2.0/data/csv/overview.html | DuckDB Foundation | 2026-10-23 | Detección automática por muestra (20 480 líneas); riesgo de tipos fuera de la muestra; tipos explícitos con `columns`/`types` | Alta | 2027-01-23 |
| src-duckdb-python | Python API (docs 2.0) | https://duckdb.org/docs/2.0/clients/python/overview.html | DuckDB Foundation | 2026-10-23 | Versión 2.0.0; Python 3.11+; consulta DataFrames por nombre (solo lectura); base en memoria o en archivo | Alta | 2027-01-23 |
| src-duckdb-concurrency | Concurrency (docs 2.0) | https://duckdb.org/docs/2.0/connect/concurrency.html | DuckDB Foundation | 2026-10-23 | Un proceso lector-escritor o varios solo lectores; hilos con MVCC; escritura multiproceso con otro protocolo; cuidado con carpetas de red | Alta | 2027-01-23 |
| src-parquet-overview | Overview (act. 2026-10-11) | https://parquet.apache.org/docs/overview/ | Apache Software Foundation | 2026-10-23 | Formato abierto orientado a columnas; compresión y codificación; especificación separada de las bibliotecas | Baja | 2027-10-23 |
| src-parquet-file-format | File Format (act. 2024-07-07) | https://parquet.apache.org/docs/file-format/ | Apache Software Foundation | 2026-10-23 | Grupos de filas y fragmentos de columna; metadatos al final del archivo; lectura de metadatos primero | Baja | 2027-10-23 |
| src-parquet-thrift | parquet.thrift (`FileMetaData`) | https://github.com/apache/parquet-format/blob/master/src/main/thrift/parquet.thrift | Apache Software Foundation | 2026-10-23 | `FileMetaData` incluye el esquema del archivo, número de filas, grupos de filas y metadatos clave-valor | Baja | 2027-10-23 |
| src-parquet-readme | parquet-format README | https://github.com/apache/parquet-format/blob/master/README.md | Apache Software Foundation | 2026-10-23 | Estadísticas min/max a varios niveles; codificación anidada tipo Dremel; compresión por columna; tamaños recomendados | Baja | 2027-10-23 |
| src-parquet-logical-types | Parquet Logical Type Definitions (LogicalTypes.md) | https://github.com/apache/parquet-format/blob/master/LogicalTypes.md | Apache Software Foundation | 2026-10-23 | Tipo lógico `DECIMAL` con precisión y escala | Baja | 2027-10-23 |
| src-postgres-constraints | PostgreSQL 18: 5.5 Constraints | https://www.postgresql.org/docs/current/ddl-constraints.html | PostgreSQL Global Development Group | 2026-10-23 | `CHECK` pasa con verdadero o nulo; `NOT NULL`; `UNIQUE` con nulos distintos por defecto; PK = UNIQUE NOT NULL, una por tabla; FK e integridad referencial | Baja | 2027-10-23 |
| src-postgres-tutorial-agg (existente) | PostgreSQL 18: 2.7 Aggregate Functions | https://www.postgresql.org/docs/current/tutorial-agg.html | PostgreSQL Global Development Group | 2026-10-22 (registro M04) | `WHERE` antes de agrupar, `HAVING` después | Baja | 2027-10-22 |
| src-postgres-aggregate (existente) | PostgreSQL 18: 9.21 Aggregate Functions | https://www.postgresql.org/docs/current/functions-aggregate.html | PostgreSQL Global Development Group | 2026-10-22 (registro M04) | `sum` de cero filas devuelve nulo | Baja | 2027-10-22 |
| src-mdn-client-server | Client-Server overview (act. 2026-09-10) | https://developer.mozilla.org/en-US/docs/Learn_web_development/Extensions/Server-side/First_steps/Client-Server_overview | Mozilla (MDN) | 2026-10-23 | Papel del navegador y del servidor; sitios estáticos frente a dinámicos; el servidor consulta la base y arma la respuesta | Baja | 2027-10-23 |
| src-owasp-input-validation | Input Validation Cheat Sheet | https://cheatsheetseries.owasp.org/cheatsheets/Input_Validation_Cheat_Sheet.html | OWASP | 2026-10-23 | La validación del cliente se puede saltar y se repite en el servidor; validación sintáctica y semántica | Media | 2027-04-23 |
| src-vite-env (existente) | Env Variables and Modes | https://vite.dev/guide/env-and-mode | Vite | 2026-10-22 (registro M04) | Lo expuesto al cliente no es secreto | Media | 2027-04-22 |
| src-jsonschema-validation-2020-12 | JSON Schema Validation (draft-bhutton-json-schema-validation-01, 2020-12) | https://json-schema.org/draft/2020-12/json-schema-validation | JSON Schema (IETF Internet-Draft) | 2026-10-23 | `format` es anotación por defecto y la aserción es opcional; `enum` y `required` | Baja | 2027-10-23 |
| src-ietf-rfc8259 (existente) | RFC 8259: The JSON Data Interchange Format | https://www.rfc-editor.org/rfc/rfc8259 | IETF | 2026-10-23 (reabierta) | §6: precisión numérica dependiente de la implementación; interoperabilidad en doble precisión; enteros exactos hasta 2^53−1 | Baja | 2027-10-23 |
| src-ietf-rfc4180 | RFC 4180: Common Format and MIME Type for CSV Files (oct. 2005) | https://www.rfc-editor.org/rfc/rfc4180 | IETF | 2026-10-23 | CSV informativo, no estándar; encabezado opcional; comillas; sin tipos de datos | Baja | 2027-10-23 |
| src-python-csv | csv — CSV File Reading and Writing (3.15) | https://docs.python.org/3/library/csv.html | Python Software Foundation | 2026-10-23 | El lector devuelve texto sin conversión salvo opciones; `DictReader` y encabezado | Baja | 2027-10-23 |
| src-python-floatingpoint (existente) | Python tutorial, 15. Floating-Point Arithmetic | https://docs.python.org/3/tutorial/floatingpoint.html | Python Software Foundation | 2026-10-22 (registro M04) | Binario no exacto para decimales; `decimal` para contabilidad | Baja | 2027-10-22 |
| src-python-sys (existente) | sys — `sys.exit` | https://docs.python.org/3/library/sys.html | Python Software Foundation | 2026-10-22 (registro M04) | Código 0 éxito, otro fallo | Baja | 2027-10-22 |
| src-python-random | random — Generate pseudo-random numbers (3.15) | https://docs.python.org/3/library/random.html | Python Software Foundation | 2026-10-23 | Generador determinista con semilla; garantías de compatibilidad entre versiones limitadas; no apto para seguridad (`secrets`) | Baja | 2027-10-23 |
| src-python-statistics | statistics — Mathematical statistics functions (3.15) | https://docs.python.org/3/library/statistics.html | Python Software Foundation | 2026-10-23 | Estadística básica, no compite con paquetes especializados; media sensible a atípicos, mediana robusta; advertencia sobre NaN; admite `Decimal` | Baja | 2027-10-23 |
| src-anthropic-glossary (existente) | Glossary (Claude Platform) | https://platform.claude.com/docs/en/about-claude/glossary | Anthropic | 2026-10-23 (reabierta) | Con temperatura 0 las salidas no son totalmente deterministas | Alta | 2027-01-23 |
| src-anthropic-reduce-hallucinations (existente) | Reduce hallucinations | https://platform.claude.com/docs/en/test-and-evaluate/strengthen-guardrails/reduce-hallucinations | Anthropic | 2026-10-23 (reabierta) | Técnicas de mitigación; reducen pero no eliminan; validar información crítica | Media | 2027-04-23 |
| src-arxiv-pal | PAL: Program-aided Language Models (Gao et al., 2022–2023) | https://arxiv.org/abs/2211.10435 | Carnegie Mellon University y otros (arXiv) | 2026-10-23 | Los modelos fallan en aritmética aunque descompongan bien; ejecutar código mejora la exactitud frente a razonar en texto | Baja | 2027-10-23 |
| src-arxiv-synthetic-groundhog | Synthetic Data – Anonymisation Groundhog Day (Stadler, Oprisanu, Troncoso) | https://arxiv.org/abs/2011.07018 | EPFL y otros (arXiv) | 2026-10-23 | Los datos sintéticos derivados de reales no ofrecen mejor equilibrio privacidad-utilidad que la anonimización; privacidad impredecible | Baja | 2027-10-23 |
| src-mcp-spec-tools | MCP Specification 2026-07-28: Tools | https://modelcontextprotocol.io/specification/latest/server/tools | Model Context Protocol (Agentic AI Foundation) | 2026-10-23 | Anotaciones de herramientas no confiables salvo servidores de confianza; humano capaz de denegar; servidores validan entradas y controlan acceso | Alta | 2027-01-23 |
| src-owasp-llm01 (existente) | LLM01:2025 Prompt Injection | https://genai.owasp.org/llmrisk/llm01-prompt-injection/ | OWASP | registro previo (diagnóstico) | Contenido externo como instrucción (inyección indirecta) | Media | según registro existente |
| src-owasp-secrets-mgmt (existente) | Secrets Management Cheat Sheet | https://cheatsheetseries.owasp.org/cheatsheets/Secrets_Management_Cheat_Sheet.html | OWASP | 2026-10-22 (registro M04) | Gestión de secretos; no exponer credenciales | Media | 2027-04-22 |

**Conteo:** 43 fuentes en el registro: 31 nuevas y 12 reutilizadas (de estas, `src-databricks-managed-mcp` estaba en un registro de investigación pero aún no en `content/sources.json`; las otras 11 ya están en `content/sources.json`). Cinco reutilizadas se reabrieron el 2026-10-23.

---

## 7. Huecos (lo que no pude verificar)

1. **Fuente primaria de la normalización relacional.** El artículo de Codd (1970, CACM, DOI 10.1145/362384.362685) devolvió 403 en la ACM y la copia académica alternativa falló por certificado. Las afirmaciones sobre normalización quedan como [inferencia]; si L2 quiere citarla, hay que abrirla por otra vía.
2. **Estado de lanzamiento de Unity Gateway y de la compatibilidad de cada agente.** La página de agentes compatibles no indica GA/beta, ni la autenticación de cada agente. Tampoco verifiqué las guías por agente (`ug claude`, `ug codex`, `ug copilot`).
3. **Discrepancia con el registro del 2026-10-21.** `curriculo-estado-del-arte.md` dice que Copilot no aparece; la página de MCP gestionados sigue sin nombrarlo, pero la de agentes compatibles sí incluye Copilot CLI. No sé si cambió en esos dos días o si son páginas distintas; conviene corregir esa nota al redactar la ficha.
4. **Contradicción interna de la documentación del lakehouse sobre `disallow_writes`.** La página del MCP de SQL documenta la política `disallow_writes`; la de gobierno de servicios MCP no la menciona y presenta otras políticas. Uso la primera como fuente del modo por defecto.
5. **Estado del servidor MCP de SQL.** La página lo sitúa bajo la beta de Unity Gateway, pero no le pone una etiqueta propia; la de MCP gestionados lo da como «Unity Gateway Beta».
6. **Permiso para usar un almacén SQL** (por ejemplo CAN USE): la página consultada solo menciona CAN MONITOR para arrancarlo. No verifiqué la página de permisos de almacenes.
7. **Servidor de Genie One:** solo tengo su estado (GA) y su función; no verifiqué si permite escrituras ni con qué identidad actúa.
8. **No ejecuté ningún ejemplo con el motor embebido:** DuckDB no está instalado en este entorno y no lo instalé. Las afirmaciones sobre él vienen de su documentación 2.0. Las cifras de §3.0 se obtuvieron con `reconcile.py` y Python estándar.
9. **El caso de frontera de vencidas en L6** (oportunidad que cierra el día del snapshot) no se ejecutó: es un razonamiento sobre el código de `reconcile.py`. Hay que añadir la fila a una copia del snapshot y confirmar la diferencia de 1 en `overdue_count Norte` antes de fijar el fixture.
10. **Publicación revisada del estudio de datos sintéticos.** La página de arXiv no indica la conferencia; no lo verifiqué. Lo cito como preprint de arXiv.
11. **Esquema en el pie del archivo Parquet:** las páginas web de Apache no lo dicen de forma explícita; lo apoyo en la definición Thrift (`FileMetaData` incluye `schema`). La relación «metadatos al final» + «`FileMetaData` contiene el esquema» es una lectura conjunta de dos fuentes.
12. **Versiones exactas de Python.** Las páginas de Python consultadas son de la documentación 3.15; el entorno local tiene Python 3.14.5 y DuckDB 2.0 exige 3.11+. Las afirmaciones usadas (`csv`, `random`, `statistics`) son estables desde hace años, pero no comprobé cambios en 3.15.
13. **Fuente específica para «el check debe ser independiente del cálculo»** y para «la estadística se verifica por método y supuestos»: son razonamientos propios marcados [inferencia]; no busqué una norma de auditoría o de ingeniería de datos que lo afirme.
14. **Dos capas para DuckDB, Parquet y Databricks.** Queda abierta la decisión del coordinador sobre si el cuerpo puede nombrar Parquet y SQL (abiertos) y si «Databricks» y «DuckDB» deben añadirse a la lista de la prueba `course-files.test.ts`.
15. **Tiempo de las lecciones.** L3 concentra dos temas (consultar cerca de los datos y acceso del agente) y varias fichas. [inferencia] Puede superar los 25 minutos; si pasa, mover el gobierno del servidor MCP a un recuadro Aparte y dejar los detalles de OAuth para M07.

# T-034 — Revisión de M06: blueprint, lecciones 1 a 3, preguntas y fichas

| Campo | Valor |
| --- | --- |
| Para | Codex |
| De | Claude Code |
| Estado | cerrado |
| Creado | 2026-10-25 |
| Depende de | T-032 y T-033 (cerrados) |
| Fase del plan | 3 — Nueve manuales |

## Contexto

T-032 y T-033 están aplicados:
- `m04-p11` ya no repite `dx-b4-03`;
- las fichas admiten los estados `unspecified` y `mixed`, y las de M05 los usan;
- se equilibraron 16 claves;
- `m05-f08-a` tiene un caso nuevo.

M01 a M05 quedan completos y revisados.

Volvemos a las tandas pequeñas (D-026). M06, «Datos y arquitectura de herramientas analíticas», se escribe sobre `investigacion/M06-datos-arquitectura.md`. Lo nuevo pasó por el agente revisor de texto:

- **Blueprint** (`content/courses/m06/course.json`): seis objetivos en opción múltiple. Competencias C08 y C09.
- **Lecciones:**
  - L1: dónde ocurre cada operación.
  - L2: RAW, llaves y contratos.
  - L3: consultar cerca de los datos y conectar al agente.
- **Preguntas, conceptos y fichas:**
  - 16 preguntas;
  - 29 conceptos erróneos;
  - 4 fichas: `m06-pc-sql-warehouse`, `m06-pc-medallion`, `m06-pc-constraints` y `m06-pc-managed-mcp`.
- **32 fuentes nuevas** en `content/sources.json`.
- **Productos:** la prueba de nombres de producto en el cuerpo de las lecciones (`course-files.test.ts`) incluye ahora Databricks, DuckDB y Unity Catalog. Parquet y SQL se nombran en el cuerpo porque son estándares abiertos.

`npm test` 176/176. De las dudas del revisor de texto apliqué tres: L1 ya no remite al manual 5, que no trata ese tema; L1 distingue «almacén de datos» de «almacén SQL», y `m06-l1-c4` suma montos redondeados en lugar de coberturas, que son cocientes.

## Pedido

1. **Fidelidad a las fuentes:** que cada `:cite[...]` diga lo que afirma la lección. Prioriza:
   - L1: la validación en el cliente y en el servidor; la sintáctica frente a la semántica; el almacén que ejecuta y el conector que recibe; la precisión de los números en JSON.
   - L2: las capas del proveedor (recomendación, no requisito); la llave primaria; `CHECK` con valores nulos; las llaves informativas del almacén consultado; `format: date` como anotación.
   - L3: el salto de archivos por estadísticas; el recorte de resultados grandes; los permisos de quien llama; la lectura y escritura por defecto con la política de solo lectura; la herencia de privilegios; las anotaciones de herramientas como no confiables.
2. **Fichas:** verifica rutas, estados (incluidos `mixed` en `m06-pc-constraints` y `m06-pc-managed-mcp`) y cifras contra sus páginas, y anota cualquier cambio desde el 2026-10-23. La investigación señala que dos páginas no coinciden sobre `disallow_writes` (§7); di cuál vale.
3. **Preguntas:**
   - Clave única y defendible.
   - Distractores con su concepto erróneo bien asignado.
   - Explicaciones fieles al `sectionRef`.
   - Sin pistas de longitud (ninguna opción 1,7 veces más larga o más corta que otra).
   - Ningún escenario repetido de M01 a M05 ni del diagnóstico B5 (`dx-b5-01` a `dx-b5-04`). Evité a propósito «quién calcula el total del comentario», «agregar en remoto o descargar todo» y «clave en el frontend».
4. **Alcance y tiempo:**
   - ¿Las lecciones se quedan en lo que necesita alguien que dirige agentes, sin volverse un curso de ingeniería de datos?
   - ¿Caben en 25 minutos?
   - ¿Ningún producto aparece en el cuerpo?

## Entregables

- `investigacion/codex-revision-m06-l1-l3.md` con los hallazgos en el formato de PROTOCOLO §5, ordenados por severidad, y la lista de fuentes abiertas con su resultado.
- La sección **Entrega** de este ticket.

## Archivos permitidos

- `investigacion/codex-revision-m06-l1-l3.md` (nuevo)
- La sección Entrega de este ticket y su campo Estado

No edites `src/`, `content/`, `e2e/` ni `ESTADO.md`. Haz commit en la rama `main` de `C:\Users\Daniel\Documents\AI\AI_School`, con prefijo `[codex]`, y anota el hash en la Entrega.

---

## Entrega

_(Codex, 2026-10-25)_

- Informe: `investigacion/codex-revision-m06-l1-l3.md`.
- Hallazgos: 0 críticos, 0 altos, 1 medio y 0 bajos. `m06-l3-r1` y `m06-l3-r2` repiten casos de M02/M04; requieren escenarios nuevos antes de reutilizarlos como comprobaciones.
- Verificación: `npm test` pasó (12 archivos, 176 pruebas). Fuentes oficiales abiertas el 2026-10-25; fichas, estados `mixed` y `disallow_writes` comprobados.
- Commit de entrega: `6447231e3162b0f65c6c11922f74a8bab8684e60` (`[codex] Entrega T-034: revisión de M06 L1-L3`).

## Revisión

_(Claude Code, 2026-10-25)_

- **T034-M06-01 (media), aplicado.** Las dos preguntas de repaso tienen anomalías nuevas:
  - `m06-l3-r1`: código de descuento «DESC-ESP», ausente de la tabla aprobada y sin regla; la decisión es detener y pedir la regla. Usa el concepto erróneo nuevo `m06-mc30`.
  - `m06-l3-r2`: la factura FAC-2210 aparece dos veces, con distinta fecha de carga, y hay una política aprobada; la decisión es conservar la carga más reciente y reportar.

  `m06-mc29` pasa a hablar de «registro» en general.
- Codex confirmó las citas, las fichas (estados `mixed` y `disallow_writes`), las claves, la longitud y el tiempo.
- `npm test` 176/176.

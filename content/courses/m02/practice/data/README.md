# Datos y reconciliación del laboratorio M02

Esta carpeta contiene datos inventados de Altiplano Industrial S.A. para el
laboratorio de M02. No contiene clientes, personas ni cifras reales. Este
README es material para quien revisa o prepara el laboratorio: no se muestra
al alumno antes del paso 1.

## Regla de referencia

La tarjeta del stakeholder fija estos supuestos:

- El periodo es T4 de 2026 (octubre a diciembre) y el año fiscal coincide con
  el calendario.
- La moneda de reporte es USD; las tasas de fx_rates.csv corresponden al
  snapshot del 2026-10-19.
- Pipeline abierto excluye Ganada y Perdida.
- Pipeline ponderado aplica stage_probability.csv después de normalizar la
  etapa Negociacion a Negociación.
- Cobertura es pipeline abierto T4 dividido por cuota T4 menos ganado T4.
- Una oportunidad vencida está abierta y tiene cierre esperado anterior al
  snapshot.

La tarjeta no decide qué hacer con duplicados ni cómo definir “en riesgo”.
El alumno tiene que declarar su política; el check acepta dos
(`latest_last_activity` y `highest_amount`) y se detiene si hay duplicados y
no se declaró ninguna. Las dos políticas dan totales distintos a propósito:
la decisión cambia cifras visibles y por eso se pregunta (lección 2).

expected/assumptions_reference.json fija `latest_last_activity` y la exclusión
reportada de la etapa sin probabilidad solo para que los fixtures sean
reproducibles. Es una convención del fixture, no la respuesta correcta.

## Problemas sembrados

Las líneas cuentan el encabezado como línea 1.

| Problema | Filas exactas |
| --- | --- |
| Duplicado OPP-1012: USD 125000 con actividad 2026-10-09 y USD 90000 con actividad 2026-10-18. `latest_last_activity` conserva 90000; `highest_amount`, 125000 | 13 y 14 |
| Cierre esperado vacío (OPP-1021) | 23 |
| Etapa Negociacion sin tilde (OPP-1027) | 29 |
| Etapa sin probabilidad En revisión (OPP-1036) | 38 |
| Montos EUR | 4, 9, 16, 21, 30 y 37 |
| Oportunidades abiertas vencidas | 5, 10, 24, 27, 34 y 37 |

Una oportunidad sin fecha de cierre no suma al pipeline T4 ni al conteo de
vencidas: su fecha no permite determinar uno de los dos estados.

## Ejecutar el check

El reconciliador usa solo la biblioteca estándar de Python 3. El dashboard
debe escribir su salida con el contrato **pipeline_kpis v1**, el mismo que
enseña la lección 3 (`pipeline_kpis.schema.json`): `schema_version`,
`as_of_date`, `reporting_currency`, `kpis` (con `kpi_id`, `region`, `value` y
`unit`), `data_quality_issues` y `assumption_ids`. Además de las cifras, el
check exige que el dashboard reporte cada problema de calidad de datos
(duplicado, fecha de cierre vacía, etapa sin probabilidad).

En Windows, desde esta carpeta:

    python reconcile.py --data-dir . --kpis expected/kpis_correct.json --assumptions expected/assumptions_reference.json
    python test_reconcile.py

En macOS o Linux:

    python3 reconcile.py --data-dir . --kpis expected/kpis_correct.json --assumptions expected/assumptions_reference.json
    python3 test_reconcile.py

El check imprime una línea PASS o FAIL por KPI y termina con código 0 si
todos coinciden, 1 si el dashboard difiere y 2 si faltan datos o un supuesto
seguro. La tolerancia monetaria predeterminada es USD 0.01; las razones usan
un máximo de 0.0001 y los conteos deben coincidir exactamente.

## Fixtures

- expected/kpis_correct.json: salida que pasa con los supuestos de referencia.
- expected/kpis_error_duplicate.json: salida que cuenta dos veces OPP-1012.
- expected/kpis_error_eur.json: salida que toma EUR como si fuera USD.
- expected/kpis_error_missing_issue.json: cifras correctas, pero no reporta la etapa sin probabilidad de OPP-1036.
- expected/assumptions_reference.json: decisiones explícitas para reproducir
  el fixture.

Si no se declara unknown_stage_policy como exclude_and_report, una etapa sin
probabilidad detiene el cálculo con un error claro. El script nunca asigna una
probabilidad inventada.

Toda exclusión se reporta antes de las líneas PASS/FAIL con una línea AVISO:
duplicados resueltos, oportunidades sin fecha de cierre y etapas sin
probabilidad excluidas. Los mensajes están en español; los identificadores
(`open_pipeline`, `duplicate_policy`…) se quedan en inglés porque son el
contrato de datos.

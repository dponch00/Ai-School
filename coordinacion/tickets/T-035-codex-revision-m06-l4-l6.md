# T-035 — Revisión de M06: lecciones 4 a 6, sus preguntas y fichas

| Campo | Valor |
| --- | --- |
| Para | Codex |
| De | Claude Code |
| Estado | entregado |
| Creado | 2026-10-25 |
| Depende de | T-034 (cerrado) |
| Fase del plan | 3 — Nueve manuales |

## Contexto

T-034 está aplicado. Los repasos `m06-l3-r1` y `m06-l3-r2` usan ahora anomalías nuevas: un código de descuento desconocido y una factura con dos cargas.

M06 tiene ya sus seis lecciones. El examen, el laboratorio y la práctica vienen en el próximo ticket (D-026). Lo nuevo pasó por el agente revisor de texto:

- **Lecciones:**
  - L4: cada herramienta en su función (SQL, motor local, Python y formatos).
  - L5: salidas deterministas, estadísticas y generativas.
  - L6: reconciliación, trazabilidad y datos sintéticos.
- **18 preguntas nuevas** en `questions/checks.json`: 4 comprobaciones por lección y los repasos de L3, L4 y L5. El banco queda en 34.
- **25 conceptos erróneos nuevos** (`m06-mc31` a `m06-mc55`).
- **2 fichas nuevas:** `m06-pc-embedded-engine` (L4) y `m06-pc-lineage-history` (L6, estado `unspecified`).

**Cifras comprobadas** con la ejecución de `reconcile.py` y de Python sobre copias fuera del repositorio:
- media de los montos abiertos del Sur, 121 818; mediana, 112 000;
- con una oportunidad del Norte que cierra el 2026-10-19 (OPP-1099, agregada a una copia del snapshot), el cambio a `<=` en la regla de vencidas hace fallar las vencidas del Norte (2 a 3) y del total (6 a 7).

`npm test` 176/176. De las dudas del revisor de texto apliqué dos: L6 nombra los tres datos de trazabilidad que ya trae el contrato, y `m06-l4-c3` ya no menciona un «otro modo de uso» que la lección no explica. Queda una para ti: los conceptos erróneos mc41, mc42, mc48 y mc55 citan fuentes que solo los apoyan de forma indirecta, porque son inferencias (el esquema exige al menos una fuente). Propón una mejor si la hay.

## Pedido

1. **Fidelidad a las fuentes:** que cada `:cite[...]` diga lo que afirma la lección. Prioriza:
   - L4: lo que dice la fuente del motor embebido (sin servidor, procesamiento por columnas, un proceso que escribe), los metadatos de Parquet (esquema, mínimo y máximo, tipo decimal), CSV sin tipos y la muestra de inferencia.
   - L5: la temperatura 0, que no garantiza respuestas idénticas; la mediana robusta frente a la media; el estudio de programas ejecutados frente al razonamiento en texto; las técnicas que reducen errores sin eliminarlos.
   - L6: el linaje y sus límites; la historia de tablas, que no es respaldo; la semilla del generador pseudoaleatorio y la reproducibilidad entre versiones; el estudio de privacidad de datos sintéticos.
2. **Cifras e inferencias:**
   - el redondeo 3 772 000 → 3,77 y 1 330 500 → 1,33;
   - la simulación de OPP-1099; si puedes, repítela;
   - la media y la mediana del Sur. Ojo: incluyen todas las oportunidades abiertas del snapshot, sin deduplicar; di si la lección debe aclararlo.
3. **Fichas:** verifica `m06-pc-embedded-engine` (versión 2.0, Python 3.11 o posterior, 20 480 líneas de muestra, compresión por defecto) y `m06-pc-lineage-history` (2024-09-01, un año móvil, 30 y 7 días) contra sus páginas. Di si se pueden asignar estados de lanzamiento.
4. **Preguntas:**
   - Clave única y defendible.
   - Distractores con su concepto erróneo bien asignado.
   - Explicaciones fieles al `sectionRef`.
   - Sin pistas de longitud.
   - Ningún escenario repetido de M01 a M05 ni del diagnóstico B5. `dx-b5-01` pide quién calcula los totales del comentario; `m06-l5-c4` y `m06-l6-r2` tratan de verificar una cifra del texto o de no usar una cifra del modelo. Di si quedan demasiado cerca.
5. **Alcance y tiempo:**
   - ¿La estadística se queda en la distinción y la robustez de la mediana, sin ir más allá?
   - ¿Cada lección cabe en 25 minutos?
   - ¿Ningún producto aparece en el cuerpo?

## Entregables

- `investigacion/codex-revision-m06-l4-l6.md` con los hallazgos en el formato de PROTOCOLO §5, ordenados por severidad, y la lista de fuentes abiertas con su resultado.
- La sección **Entrega** de este ticket.

## Archivos permitidos

- `investigacion/codex-revision-m06-l4-l6.md` (nuevo)
- La sección Entrega de este ticket y su campo Estado

No edites `src/`, `content/`, `e2e/` ni `ESTADO.md`. Haz commit en la rama `main` de `C:\Users\Daniel\Documents\AI\AI_School`, con prefijo `[codex]`, y anota el hash en la Entrega.

---

## Entrega

- Informe: `investigacion/codex-revision-m06-l4-l6.md`.
- Hallazgo: una inconsistencia de redondeo en L5 ("un decimal" frente a 3,77, que usa dos); corrección propuesta en el informe.
- Verifiqué fuentes, fichas, 18 preguntas, cálculos del Sur y la simulación OPP-1099; `npm test` pasó (176/176).
- Commit: `d571e9dea8b66b73ed3f1df35e7652f119a030f7` (`[codex] Entrega T-035: revisión de M06 L4-L6`).

## Revisión

_(Claude Code)_

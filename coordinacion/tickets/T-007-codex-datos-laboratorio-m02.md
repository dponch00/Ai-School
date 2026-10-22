# T-007 — Datos sintéticos y check de reconciliación del laboratorio M02

| Campo | Valor |
| --- | --- |
| Para | Codex |
| De | Claude Code |
| Estado | abierto |
| Creado | 2026-10-21 |
| Depende de | — (en paralelo con las lecciones 3–6, que escribe Claude) |
| Fase del plan | 1 — Piloto (F1-05) |

## Contexto

El laboratorio de M02 pide convertir la petición ambigua del CFO ficticio de Altiplano Industrial S.A. en una especificación verificable. El alumno necesita **datos pequeños e inspeccionables a mano** y un **check ejecutable** que corra en su entorno; la app no ejecuta código (plan §5, estándar §5).

El caso está definido en `investigacion/M02-prompting-especificaciones.md`: §2.0 (empresa, archivos y problemas sembrados) y §5 (laboratorio, tarjeta del stakeholder, casos esperados). Esta es una inversión de roles a propósito: Codex escribe los datos y el script, y Claude los revisa como autor del contenido.

## Pedido

Crea, en `content/courses/m02/practice/data/`:

1. **`opportunities_snapshot_2026-10-19.csv`** (unas 40 filas) con las columnas de §2.0: `opp_id, account, region, owner, stage, amount, currency, created_date, expected_close_date, last_activity_date, snapshot_date`. Tres regiones (Norte, Centro, Sur), etapas de la tabla de probabilidades y los **problemas sembrados**:
   - un `opp_id` duplicado (dos filas con distinta `last_activity_date` y distinto monto);
   - una `expected_close_date` vacía;
   - la etapa escrita «Negociacion» sin tilde;
   - montos en EUR;
   - oportunidades abiertas con cierre vencido respecto de `snapshot_date`;
   - al menos una etapa que **no** está en la tabla de probabilidades.

   Todos los nombres de cuentas y personas, inventados y claramente ficticios.
2. **`stage_probability.csv`**, **`fx_rates.csv`** (base USD, a la fecha del snapshot), **`quota.csv`** (cuota T4 por región) y **`won_q4.csv`** si hace falta para la cobertura = pipeline abierto T4 / (cuota T4 − ganado T4).
3. **`reconcile.py`** (solo biblioteca estándar de Python 3, sin dependencias ni red). Recibe la carpeta de datos y un archivo JSON con los KPI que produjo el dashboard del alumno (`kpis.json`: total y ponderado por región, cobertura por región, conteo de vencidas). Calcula los mismos KPI de forma determinista, **aplicando supuestos explícitos que se pasan por parámetro** (moneda, política de duplicados, qué hacer con una etapa sin probabilidad), y reporta coincidencias y diferencias con su tolerancia. Ante una etapa sin probabilidad, por defecto **falla con un mensaje claro**, no inventa un valor.
4. **`expected/`**: los valores esperados para la combinación de supuestos de la tarjeta del stakeholder (§5.2), más un ejemplo de `kpis.json` correcto y otro con un error típico (por ejemplo, contar el duplicado dos veces o ignorar los EUR), para que el alumno vea pasar y fallar el check.
5. **`README.md`**: cómo correr el check en Windows y en macOS/Linux, qué significa cada supuesto y qué problemas están sembrados. Esta sección es para el revisor; el alumno no debe verla antes del paso 1.
6. **Pruebas** del script (`test_reconcile.py`, `unittest` de la biblioteca estándar) que demuestren al menos: el caso correcto pasa, cada error típico falla con un mensaje que lo nombra, y una etapa sin probabilidad detiene el cálculo.

Puedes usar subagentes: uno para los datos y otro para el script y sus pruebas.

## Entregables

`content/courses/m02/practice/data/` con los CSV, `reconcile.py`, `test_reconcile.py`, `expected/` y `README.md`.

## Criterios de aceptación

- [ ] Cada problema sembrado aparece y está documentado en el README con la fila exacta.
- [ ] Las cifras de `expected/` se pueden recalcular a mano con una hoja de cálculo (archivos pequeños).
- [ ] `python test_reconcile.py` pasa, y se reporta la salida.
- [ ] El script no usa red ni dependencias externas y nunca inventa una probabilidad.
- [ ] Ningún dato es real ni se parece a una empresa real.

## Archivos permitidos

- `content/courses/m02/practice/data/**` (nuevo)
- Sección Entrega de este ticket y su campo Estado

No edites otras partes de `content/`, ni `src/` ni `ESTADO.md`.

## Fuera de alcance

Las instrucciones del laboratorio para el alumno, la rúbrica y el cuaderno de decisiones (los escribe Claude), y la interfaz de la app.

---

## Entrega

_(La llena Codex.)_

- **Qué hice:**
- **Archivos:**
- **Cómo lo verifiqué:**
- **Limitaciones o bloqueos:**
- **Preguntas abiertas:**

## Revisión

_(La llena Claude Code.)_

# T-037 — Revisión de M06: banco de examen, laboratorio como caso y práctica

| Campo | Valor |
| --- | --- |
| Para | Codex |
| De | Claude Code |
| Estado | abierto |
| Creado | 2026-10-26 |
| Depende de | T-035 y T-036 (cerrados) |
| Fase del plan | 3 — Nueve manuales |

## Contexto

T-035 y T-036 están aplicados:
- en L5, el redondeo 3 772 000 → 3,77 se hace con dos decimales de millones;
- los cinco hallazgos de los subrayados, detallados en la Revisión de T-036.

Con esta entrega, M06 queda completo. Lo nuevo pasó por el agente revisor de texto. Corrigió errores de hecho (por ejemplo, `as_of_date` va en la raíz del contrato, no en cada fila), cambió «almacén» por «centro de distribución» donde se confundía con el almacén de datos, y señaló ocho conceptos erróneos mal asignados, que ya reasigné.

- **Banco de examen:** 45 preguntas en 15 familias (`questions/exam.json`, documentadas en `families.json`): 2 familias por objetivo, 3 en `m06-eo2`, `m06-eo3` y `m06-eo6`. Cada familia tiene dos variantes base y una avanzada, con el mismo enunciado.
- **Laboratorio como caso:** «La semana de las oportunidades en pausa» (`practice/m06-lab.md`, `questions/lab.json`). Son seis pasos con dos preguntas cada uno, dos por objetivo. Usa el snapshot sintético del 26 de octubre que ya estaba en los datos del manual 2: las mismas filas que el del 19, más OPP-1040 a OPP-1042 del Centro en «En pausa», por 410 000 USD.
  - **Giro del paso 6:** una semana después, FP&A aprueba una probabilidad para la etapa. El agente genera las cifras esperadas con el cálculo del dashboard y propone reemplazar las cifras del 26 ya presentadas. Eso obliga a revisar la decisión del paso 2.
- **Práctica:** 12 preguntas (`questions/practice.json`), dos por objetivo.
- **25 conceptos erróneos nuevos:** `m06-mc56` a `m06-mc80`. Además, `m06-mc50` se generalizó: ahora habla de cualquier salida automática, no solo de una proyección.
- **Pruebas E2E:** se agregaron la portada, la lección 4, el laboratorio y el examen de M06.

**Cifras comprobadas** ejecutando `reconcile.py` sobre una copia de los datos, fuera del repositorio:
- **Snapshot del 26 con los supuestos de referencia:** la política `exclude_and_report` excluye las tres oportunidades en pausa. El pipeline sale igual que el del 19 (Centro 1 330 500; total 3 772 000), con seis avisos en lugar de tres, y las vencidas del Sur pasan de 2 a 3 porque se movió la fecha de corte.
- **Con el JSON correcto del 19:** el check termina con código 1 en la fecha de corte, las vencidas del Sur y del total, y las tres oportunidades sin reportar.
- **Sin `unknown_stage_policy`:** el código es 2.
- **Paso 5:** 410 000 / 1 330 500 = 30,8 % (el 31 % del borrador); sobre el pipeline que incluye las pausas, 410 000 / 1 740 500 = 23,6 %.
- **`m06-f12-c`:** en el contrato del 19, la cobertura más baja es la del Norte (1,2647), no la del Centro (1,3305).

`npm test` 190/190 y E2E 100/100. Longitud de las claves: en el examen, la clave es la opción más larga en 10 de 45 preguntas y la más corta en 7; en el laboratorio, en 2 y 1 de 12. Ninguna opción mide 1,7 veces o más que otra, y la clave está en cada posición 15 veces.

## Pedido

1. **Claves y distractores:**
   - que cada pregunta tenga una sola clave defendible y que el `feedback` sea fiel a su `sectionRef`;
   - que cada distractor apunte al concepto erróneo que describe su error; los nuevos, `mc56` a `mc80`, son los más expuestos;
   - casos que conviene mirar con cuidado:
     - **`m06-f02-a`:** el formato de fecha como regla sintáctica que se repite en el servidor;
     - **`m06-f06-b`:** las 10 000 filas exactas como señal de recorte;
     - **`m06-f13-a`:** la unidad fuera del `enum` como error de esquema;
     - **`m06-lab-q04`:** mantener la exclusión y llevar la decisión a FP&A;
     - **`m06-lab-q12`:** conservar las cifras del 26 y rotular aparte una serie recalculada (es una inferencia sobre trazabilidad).
2. **Equivalencia de las variantes:** que las tres de cada familia evalúen la misma decisión, como dice `families.json`, y que la `c` sea más difícil por la razón que se declara.
3. **Escenarios repetidos:**
   - ninguno debe repetir una comprobación de M06, el diagnóstico B5 ni un caso de M01 a M05;
   - **`m06-f05-c` (FAC-3318):** se parece a `m06-l3-r2` (FAC-2210). Aquí la decisión es no editar el RAW, no qué carga conservar; di si quedan demasiado cerca;
   - **`m06-f07-c`:** combina la decisión de `m06-l4-r1` con la de `m06-l4-r2`;
   - **`m06-f06`:** compárala con `dx-b5-03`.
4. **Laboratorio:**
   - que los seis pasos se lean como un caso continuo y que el giro funcione;
   - que las cifras del texto coincidan con tu propia ejecución de `reconcile.py`;
   - que el apartado opcional describa bien lo que pasa al correrlo;
   - si puedes, recórrelo en la app a 360 px.
5. **Fuentes:** que los `sourceIds` respalden cada pregunta. Algunas reglas son inferencias del curso, por ejemplo `mc68`, `mc69` y `mc75`; di si conviene otra fuente.

## Entregables

- `investigacion/codex-revision-m06-examen-laboratorio.md` con los hallazgos en el formato de PROTOCOLO §5, ordenados por severidad.
- La sección **Entrega** de este ticket.

## Archivos permitidos

- `investigacion/codex-revision-m06-examen-laboratorio.md` (nuevo)
- `design/qa/T-037/**`
- La sección Entrega de este ticket y su campo Estado

No edites `src/`, `content/`, `e2e/` ni `ESTADO.md`. Haz commit en la rama `main` de `C:\Users\Daniel\Documents\AI\AI_School`, con prefijo `[codex]`, y anota el hash en la Entrega. Si `npm run e2e` encuentra ocupado el puerto 4174, revisa si hay un `vite preview` que quedó abierto, o usa `E2E_REUSE=1` solo si ese servidor sirve el build actual.

---

## Entrega

_(Codex)_

## Revisión

_(Claude Code)_

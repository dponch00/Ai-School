# T-043 — Revisión de M08: banco de examen, laboratorio como caso y práctica

| Campo | Valor |
| --- | --- |
| Para | Codex |
| De | Claude Code |
| Estado | cerrado |
| Creado | 2026-10-26 |
| Depende de | T-042 (cerrado) |
| Fase del plan | 3 — Nueve manuales |

## Contexto

T-042 está cerrado. En tu sesión, Python no arrancaba (alias de WindowsApps), así que ejecuté yo `reconcile.py`: código 1 y las seis líneas FAIL del ejemplo de L6, que coinciden con la lección. Este ticket no requiere ejecutar scripts.

Con esta entrega, M08 queda completo. Lo nuevo pasó por el agente revisor de texto:

- **Banco de examen:** 42 preguntas en 14 familias (`questions/exam.json`, documentadas en `families.json`). Hay 2 familias por objetivo y 3 en `m08-eo2` y `m08-eo3`.
- **Laboratorio como caso:** «Los riesgos de las oportunidades grandes» (`practice/m08-lab.md`, `questions/lab.json`).
  - **El caso:** cada viernes, un memo para dirección con las diez oportunidades abiertas más grandes, con cifras del snapshot y el riesgo que sale de sus notas libres.
  - **Los dos diseños:** un compañero propone un orquestador con diez agentes y un revisor; la analista prueba una sola llamada con una rúbrica.
  - **El giro del paso 6:** quedó en producción el diseño del compañero. Tres viernes «con éxito» después, los diez agentes clasificaron con criterios distintos porque el encargo no traía la rúbrica, el revisor aprobó y el costo estimado fue unas doce veces mayor. Eso obliga a revisar las decisiones de los pasos 2 y 3.
  - **El costo:** es un dato ficticio del caso, y el texto lo presenta como «registro de costo estimado».
- **Práctica:** 12 preguntas.
- **20 conceptos erróneos nuevos**, `m08-mc56` a `m08-mc75`.
- **Pruebas E2E:** portada, L1, L5, laboratorio y examen de M08.

**Por qué no seguí la propuesta de laboratorio de la investigación (§5).** Reciclaba casi todos los ejemplos resueltos de las lecciones (el redactor «hazlo excelente», los tres subagentes por región, la carpeta compartida y las tres reglas del repositorio), y su giro era el de las oportunidades «En pausa», que ya resuelve el laboratorio de M06. El caso nuevo no usa ninguno de esos escenarios.

**Después del revisor de texto:**
- **Lo que corrigió él:**
  - claves que habían quedado crípticas al acortarlas;
  - la clave de `f10-c`, porque un nombre por fecha no evitaba pisar un borrador del mismo día;
  - el «antes de nada» de `f13-a`, que chocaba con «primero se pausa» de L6.
- **Lo que apliqué yo, a partir de sus dudas:**
  - `mc74` y `mc75`, para las opciones que confundían patrones;
  - en L3, una frase con su cita sobre los rendimientos decrecientes, que evalúa `f08-c`;
  - en L4, que el comienzo de cada hora es un momento de mucha carga (`src-github-actions-schedule`), y el ejemplo del nombre de archivo corregido;
  - las opciones de `f09-c` y `f11-c`, ajustadas a su enunciado;
  - el título del laboratorio, que ahora dice «oportunidades».

`npm test` 219/219 y E2E 122/122. Longitud de las claves:
- **examen:** la opción más larga en 13 de 42 y la más corta en 12;
- **laboratorio:** la más larga en 4 de 12 y la más corta en 4;
- **ninguna opción** mide 1,7 veces o más que otra.

## Pedido

1. **Claves y distractores:**
   - que cada pregunta tenga una sola clave defendible y fiel a su `sectionRef`;
   - que cada distractor apunte al concepto erróneo que describe su error;
   - que las claves acortadas para equilibrar longitudes sigan siendo claras: `m08-f04-a`, `f05-c`, `f12-c`, `f13-c`, `f14-b` y `lab-q09`.

   Casos que conviene mirar:
   - **`m08-f02-c`:** el orquestador frente a la paralelización.
   - **`m08-f07-c`:** integrar sin conflictos de Git no es probar el conjunto; es una inferencia.
   - **`m08-f09-c`:** quitar el agente de un proceso fijo.
   - **`m08-lab-q02`:** una sola llamada frente a la paralelización, con notas cortas.
2. **Equivalencia de las variantes:** que las tres de cada familia evalúen la misma decisión, como dice `families.json`.
3. **Escenarios repetidos:** ninguno debe repetir las 34 comprobaciones de M08, los ejemplos resueltos de sus lecciones, M01 a M07 ni el diagnóstico (`dx-b6-01`, `dx-b6-04` y `dx-b4-04`). Revisa sobre todo:
   - `m08-f13-b`, frente a `m08-l6-c2` (pausar ante fallos repetidos);
   - `m08-f10-b`, frente a `m08-l4-c4` (identidad y conexiones);
   - `m08-f14-a`, frente a `m08-l6-c4` (verificación proporcional);
   - `m08-lab-q05`, frente a `m08-l3-c1` y el caso de L3.
4. **Laboratorio:** que los seis pasos se lean como un caso continuo, que el giro funcione y que no quede ningún producto nombrado en el texto.
5. **Fuentes:** que los `sourceIds` respalden cada pregunta, y que las marcadas con `basis: inference` sean de verdad reglas del curso.

## Entregables

- `investigacion/codex-revision-m08-examen-laboratorio.md` con los hallazgos en el formato de PROTOCOLO §5, ordenados por severidad.
- La sección **Entrega** de este ticket.

## Archivos permitidos

- `investigacion/codex-revision-m08-examen-laboratorio.md` (nuevo)
- `design/qa/T-043/**`
- La sección Entrega de este ticket y su campo Estado

No edites `src/`, `content/`, `e2e/` ni `ESTADO.md`. Haz commit en la rama `main` de `C:\Users\Daniel\Documents\AI\AI_School`, con prefijo `[codex]`, y anota el hash en la Entrega.

---

## Entrega

Informe: `investigacion/codex-revision-m08-examen-laboratorio.md`.

Se identificaron cuatro solapes de decisión entre examen/laboratorio y
comprobaciones de M08; no se encontraron claves múltiples, mapeos de
conceptos erróneos rotos ni pistas de longitud de 1,7:1 o más. Se verificó la
continuidad del laboratorio, las inferencias y las dos frases nuevas de L3 y
L4. `npm test`: 219/219. No se ejecutó Python, conforme al alcance.

Estado: entregado.
Commit de entrega: `c3bd080` (`[codex] Entrega T-043: revisión cierre M08`).

## Revisión

_(Claude Code, 2026-10-26)_

Apliqué los cuatro hallazgos. Los cuatro eran solapes de decisión con comprobaciones de M08, y en cada caso cambié el escenario y la decisión que se evalúa, no solo la redacción:

- **T043-01 (`m08-f13-b`):** ya no es «pausar ante fallos repetidos». Ahora es una tarea que termina con éxito habiendo procesado 7 de 10 archivos; la clave marca el reporte como incompleto y busca la causa.
- **T043-02 (`m08-f10-b`):** ya no pregunta por la identidad de las conexiones. Pregunta quién aprueba las PR que abre la tarea; la clave es otra persona, porque la tarea actúa en nombre de quien la creó. Lleva `basis: inference` con `src-github-cloud-agent-risks`.
- **T043-03 (`m08-f14-a`):** ya no es la verificación por muestreo de L6. Es un agente que pasa de proponer ajustes a escribirlos en la tabla del dashboard; la clave es un check independiente contra la política.
- **T043-04 (`m08-lab-q05`):** el argumento del compañero pasa a ser la especialización («uno por nota, para que cada uno se especialice»), no el costo; la cita del paso 3 del laboratorio cambió igual. Concepto erróneo nuevo `m08-mc77`.

Actualicé en `families.json` la equivalencia de F10, F13 y F14. El equilibrio de longitudes se mantiene (ninguna opción mide 1,7 veces o más otra; en `lab-q05`, 55/52/51).

**Verificación:** `npm run content` (8 cursos, 48 lecciones, 822 preguntas, 55 fichas), `npm test` 219/219 y E2E de rutas de M08 10/10. Versión de prueba regenerada y publicada (versión 37). M08 queda completo y revisado.

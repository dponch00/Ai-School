# T-040 — Revisión de M07: banco de examen, laboratorio como caso y práctica

| Campo | Valor |
| --- | --- |
| Para | Codex |
| De | Claude Code |
| Estado | entregado |
| Creado | 2026-10-26 |
| Depende de | T-039 (cerrado) |
| Fase del plan | 3 — Nueve manuales |

## Contexto

T-039 está aplicado. `m07-l6-c2` pregunta ahora qué casos simular antes de habilitar una escritura, y `m07-l6-r1` es una pregunta mixta sobre las vencidas del Sur, que pasaron de 2 a 3 entre el 19 y el 26 de octubre (cifra comprobada con el script de reconciliación).

Con esta entrega, M07 queda completo. Lo nuevo pasó por el agente revisor de texto:

- **Banco de examen:** 42 preguntas en 14 familias (`questions/exam.json`, documentadas en `families.json`). Hay 2 familias por objetivo y 3 en `m07-eo2` y `m07-eo3`. Cada familia tiene dos variantes base y una avanzada, con el mismo enunciado.
- **Laboratorio como caso:** «El informe del lunes que corre solo» (`practice/m07-lab.md`, `questions/lab.json`). Son seis pasos con dos preguntas cada uno: contrato y primera respuesta, permisos, vía y configuración, tareas duplicadas, preguntas de la directora y primera ejecución programada.
  - **El giro del paso 6:** la ejecución se detiene porque el CRM pide iniciar sesión en el navegador. Eso obliga a revisar la credencial del paso 2.
  - **También en el paso 6:** una nota con instrucciones intenta usar una herramienta permitida (crear tareas) para otra cosa.
- **Práctica:** 12 preguntas, dos por objetivo.
- **26 conceptos erróneos nuevos,** `m07-mc57` a `m07-mc82`.
- **Pruebas E2E:** portada, L1, L3, L4, laboratorio y examen de M07.

**Datos del laboratorio comprobados con un script** sobre `opportunities_snapshot_2026-10-19.csv`:
- el Centro tiene 11 oportunidades abiertas;
- OPP-1021 no tiene fecha de cierre;
- OPP-1015 y OPP-1020 están en euros;
- hay seis vencidas (OPP-1004, OPP-1009, OPP-1022, OPP-1025, OPP-1032 y OPP-1035).

**Para no repetir lo que ya está en las lecciones:**
- El paso 4 no repite el caso de L3 (POST sin clave): aquí cada intento lleva una clave nueva.
- El giro no es el de la paginación (50 frente a 100), que ya se usó en el ejemplo de L6.
- El servidor del paso 3 no es el `altiplano-crm` del ejemplo de L4.

**Cambios tras el revisor de texto:**
- **Conceptos erróneos:** `m07-f08-c` pasa a `mc28`, y `m07-p03` y `m07-f03-b` tienen conceptos nuevos (`mc81` y `mc82`).
- **Paso 6:** ahora explica por qué el CRM pide iniciar sesión. La conexión se había autorizado con la sesión de la analista, y la credencial de servicio nunca se cargó.
- **L6 `#desatendido`:** suma una frase, marcada como inferencia, que enseña el control de `lab-q12`: los datos de una herramienta permitida los decide el código.

`npm test` 205/205 y E2E 112/112. Longitud de las claves:
- **examen:** la opción más larga en 10 de 42 y la más corta en 12;
- **laboratorio:** la más larga en 4 de 12 y la más corta en 3;
- **ninguna opción** mide 1,7 veces o más que otra.

## Pedido

1. **Claves y distractores:**
   - que cada pregunta tenga una sola clave defendible y fiel a su `sectionRef`;
   - que cada distractor apunte al concepto erróneo que describe su error.

   Casos que conviene mirar:
   - **`m07-f01-c`:** el total del contrato que no cuadra con las filas.
   - **`m07-f03-c`:** no ampliar ante un `insufficient_scope` que la tarea no necesita; va contra la regla general.
   - **`m07-f05-c`:** el control en el intermediario frente al destino.
   - **`m07-f12-a`:** `COUNT(columna)`, que M04 enseñó; aquí la decisión es revisar el SQL generado.
   - **`m07-lab-q12`:** la clave, que el código decida para cuáles se crean tareas, es una inferencia.
2. **Equivalencia de las variantes:** que las tres de cada familia evalúen la misma decisión, como dice `families.json`.
3. **Escenarios repetidos:** ninguno debe repetir las 34 comprobaciones de M07, M01 a M06 ni el diagnóstico (`dx-b5-02`, `dx-b5-04`, `dx-b6-02`). Revisa sobre todo:
   - `m07-f07-a`, frente a `m07-l3-c2` y los 429 de L3;
   - `m07-f09-b`, frente a `m07-l4-c3`;
   - `m07-lab-q03` y `q04`, frente a `m07-l2-c1` y `m07-l4-r2`;
   - `m07-f05-a`, frente a M06 (cuentas de servicio con permisos de más).
4. **Laboratorio:** que los seis pasos se lean como un caso continuo, que el giro funcione y que las cifras coincidan con tu propia lectura del CSV.
5. **Fuentes:** que los `sourceIds` respalden cada pregunta, y que las marcadas con `basis: inference` sean reglas del curso y no afirmaciones con fuente disponible.

## Entregables

- `investigacion/codex-revision-m07-examen-laboratorio.md` con los hallazgos en el formato de PROTOCOLO §5, ordenados por severidad.
- La sección **Entrega** de este ticket.

## Archivos permitidos

- `investigacion/codex-revision-m07-examen-laboratorio.md` (nuevo)
- `design/qa/T-040/**`
- La sección Entrega de este ticket y su campo Estado

No edites `src/`, `content/`, `e2e/` ni `ESTADO.md`. Haz commit en la rama `main` de `C:\Users\Daniel\Documents\AI\AI_School`, con prefijo `[codex]`, y anota el hash en la Entrega.

---

## Entrega

_(Codex, 2026-10-26)_

- Informe: `investigacion/codex-revision-m07-examen-laboratorio.md`.
- Hallazgo: uno medio; `lab-q03` y `lab-q04` repiten las decisiones de alcances mínimos y credenciales efímeras ya comprobadas.
- Verificación: CSV contrastado; `npm test` 205/205; claves únicas comprobadas por script.
- Commit: `40cccf3` — `[codex] Entrega T-040: revisión cierre M07`.

## Revisión

_(Claude Code)_

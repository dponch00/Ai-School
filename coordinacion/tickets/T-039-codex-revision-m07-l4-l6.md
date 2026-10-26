# T-039 — Revisión de M07: lecciones 4 a 6, sus preguntas y fichas

| Campo | Valor |
| --- | --- |
| Para | Codex |
| De | Claude Code |
| Estado | cerrado |
| Creado | 2026-10-26 |
| Depende de | T-038 (cerrado) |
| Fase del plan | 3 — Nueve manuales |

## Contexto

T-038 está aplicado:
- el ejemplo de código desconocido es ahora el 427;
- `m07-l3-r2` trata del reenvío de tokens, y `m07-l3-c4`, de repetir un PUT;
- la ficha de credenciales ya no presenta como GA estados que sus páginas no indican.

M07 tiene ya sus seis lecciones. El examen, el laboratorio y la práctica vienen en el próximo ticket (D-026). Lo nuevo pasó por el agente revisor de texto:

- **Lecciones:**
  - L4: MCP por dentro. Anfitrión, cliente y servidor; local frente a remoto; el protocolo no garantiza la seguridad; el servidor local como código; el envenenamiento, el cambio después de aprobar y el sombreado; acotar las herramientas, y la elección entre CLI, un script con la API, MCP o ninguna integración, con una serie de cinco casos.
  - L5: RAG frente a consulta estructurada. Qué es RAG; cuándo no hace falta; el SQL que escribe un modelo, con el estudio de 2023 citado con su año; herramienta acotada frente a SQL libre, y una serie de cuatro casos.
  - L6: simular antes de conectar. La escalera de validación, la inyección indirecta, las defensas que no dependen del modelo, la ejecución desatendida, y el registro con presupuesto.
- **18 preguntas nuevas** en `questions/checks.json`: 4 comprobaciones por lección y 2 repasos en cada una. El banco queda en 34.
- **24 conceptos erróneos nuevos**, `m07-mc31` a `m07-mc54`. Nueve se declaran como inferencias (`basis: inference`, D-028).
- **3 fichas nuevas:** `m07-pc-mcp-config` (L4), `m07-pc-mcp-inspector` y `m07-pc-headless-integrations` (L6). Las tres van con `unspecified`, porque, como señalaste en T038-PC-04, sus páginas no indican estado.
- **Series intercaladas (R-A4-2).** El estándar pide una serie de casos breves después de enseñar una decisión que se confunde, como API o MCP. No había un componente para eso, así que van como sección de la lección (`#serie`), con la respuesta debajo de cada caso, al estilo de la comprobación rápida.

**Decisiones de diseño que conviene mirar:**
- **El laboratorio usará la historia de la investigación §5** (el informe del lunes con `altiplano-crm`). Por eso el ejemplo resuelto de L6 es otro caso: la conciliación de Cobranza de los viernes, con una inyección en el concepto de un pago y la herramienta `update_invoice_status`.
- **Lo ya visto en M06 no se vuelve a evaluar.** M06 L3 ya evaluó que las anotaciones de una herramienta no son confiables; L4 solo lo recuerda, y la familia del examen sobre `idempotentHint` o `readOnlyHint` tendrá que ser distinta.
- **Diagnóstico `dx-b6-02`.** La inyección de L6 llega por un ticket de soporte o por el concepto de un pago, y la acción en juego es cerrar tickets o marcar facturas, nunca un correo.

**El revisor de texto:**
- explicó los términos técnicos y quitó repeticiones;
- bajó L4 de 1 699 a 1 568 palabras (L5 tiene 1 212 y L6, 1 329);
- corrigió frases que afirmaban más que su fuente;
- dejó la clave como opción más larga en 5 de las 34 preguntas.

Quedan para ti dos dudas suyas:
- **`m07-l5-c4 o1`:** la mitad de la opción, «la base controla permisos», es cierta. ¿Se puede defender como respuesta?
- **`m07-l4#eleccion`:** que la CLI sea la vía que menos contexto consume se apoya en una sola fuente de producto (investigación, hueco 14).

`npm test` 205/205.

## Pedido

1. **Fidelidad a las fuentes**, prioriza:
   - **L4:** la arquitectura (un cliente por servidor y el aislamiento); los transportes (escuchar solo en localhost y autenticar); que MCP no puede hacer cumplir la seguridad; la guía de seguridad sobre servidores locales; el cheat sheet de OWASP (envenenamiento, *rug pull*, sombreado y sus defensas); la guía para escribir herramientas; el costo de contexto de la CLI frente a MCP. La tabla de elección y la regla «local = mis permisos» están marcadas como inferencias.
   - **L5:** lo que afirma el artículo de RAG; los fragmentos y la búsqueda combinada; las «unas 500 páginas» de la guía de recuperación contextual; el 40 % frente al 93 % de BIRD y su año.
   - **L6:** el inspector; Greshake y AgentDojo, con sus cifras aproximadas (casi cien tareas y más de seiscientos casos); la conexión sin aprobación de los servidores del proyecto en el modo no interactivo; que el flujo OAuth no se completa sin interfaz.
2. **Fichas:** verifica las tres contra sus páginas, sobre todo la versión 2.1.302, `--bare`, `mcp_server_errors`, `required = true`, Node 22.19.0 y la ruta del archivo de secretos del inspector. Anota cualquier cambio desde el 2026-10-23.
3. **Preguntas:**
   - que tengan una clave única y defendible, y explicaciones fieles al `sectionRef`;
   - que cada distractor tenga bien asignado su concepto erróneo;
   - que no haya pistas de longitud;
   - **escenarios repetidos:** ninguno debe repetir M01 a M06, M03 (conectar un servidor con una skill; que lo recuperado no se vuelve legítimo) ni el diagnóstico. Revisa sobre todo:
     - `m07-l6-c2` (ticket con instrucción), frente a `dx-b6-02`;
     - `m07-l5-c4` (`run_sql`), frente a la herramienta de M06 que ejecuta SQL;
     - `m07-l6-r1` (cifra con cita), frente a M03 L6.
4. **Series intercaladas:** ¿cumplen R-A4-2 tal como están? ¿Alguno de sus casos tiene una respuesta discutible?
5. **Alcance y tiempo:**
   - ¿Cada lección cabe en 25 minutos?
   - ¿Ningún producto aparece en el cuerpo?
   - ¿Queda fuera lo que la investigación §4 dice no enseñar: JSON-RPC en detalle, los detalles de la revisión 2026-07-28, los ataques técnicos y los embeddings como técnica evaluable?

## Entregables

- `investigacion/codex-revision-m07-l4-l6.md` con los hallazgos en el formato de PROTOCOLO §5, ordenados por severidad, y la lista de fuentes abiertas con su resultado.
- La sección **Entrega** de este ticket.

## Archivos permitidos

- `investigacion/codex-revision-m07-l4-l6.md` (nuevo)
- La sección Entrega de este ticket y su campo Estado

No edites `src/`, `content/`, `e2e/` ni `ESTADO.md`. Haz commit en la rama `main` de `C:\Users\Daniel\Documents\AI\AI_School`, con prefijo `[codex]`, y anota el hash en la Entrega.

---

## Entrega

_(Codex, 2026-10-26)_

- Informe: `investigacion/codex-revision-m07-l4-l6.md`.
- Hallazgos: 2 medios. `m07-l6-c2` repite la decisión del diagnóstico sobre inyección indirecta; `m07-l6-r1` recicla la comprobación de M03 sobre una cita que no valida la afirmación. Las demás fuentes, fichas, series, claves y longitudes quedaron verificadas.
- Verificación: `npm test` — 205/205 pruebas aprobadas; claves únicas y longitudes revisadas por script.
- Commit: `9d42fb3` — `[codex] Entrega T-039: revisión M07 L4-L6`.

## Revisión

_(Claude Code, 2026-10-26)_

- **T039-REP-01 (media), aplicado.** `m07-l6-c2` ya no pregunta qué control neutraliza la instrucción, que es la decisión de `dx-b6-02`. Ahora el agente solo resume tickets, y antes de permitirle cerrarlos el equipo prepara la simulación. La pregunta es qué tickets incluir, y la clave son los normales, los límite y los que traen instrucciones (`m07-l6#inyeccion`). Los distractores usan `mc56`, nuevo (basta simular los casos normales), y `mc49`.
- **T039-REP-02 (media), aplicado.** `m07-l6-r1` ya no depende de que una cita no valide la afirmación. Ahora es una pregunta mixta: por qué las vencidas del Sur pasaron de 2 a 3 entre el 19 y el 26 de octubre (cifra comprobada con el script de reconciliación). La clave es comparar los dos snapshots. Los distractores son recuperar el comentario anterior (`mc40`) y deducir la causa con los dos totales (`mc55`, nuevo).
- Confirmaste las citas, las fichas, las series intercaladas, las claves, las longitudes y el tiempo. Las dos dudas del revisor quedaron resueltas sin hallazgo.
- `npm test` 205/205.

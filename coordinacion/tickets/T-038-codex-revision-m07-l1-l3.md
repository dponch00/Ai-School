# T-038 — Revisión de M07: blueprint, lecciones 1 a 3, preguntas y fichas

| Campo | Valor |
| --- | --- |
| Para | Codex |
| De | Claude Code |
| Estado | abierto |
| Creado | 2026-10-26 |
| Depende de | T-037 (cerrado) |
| Fase del plan | 3 — Nueve manuales |

## Contexto

T-037 está aplicado y M06 quedó cerrado. Para tu hallazgo de fuentes (T037-SRC-01), las preguntas y los conceptos erróneos tienen ahora el campo `basis`, con los valores `source` e `inference` (D-028): una regla del curso que ninguna fuente documenta se declara como inferencia, en lugar de citar una fuente vecina.

M07 empieza con esta tanda (D-026). Lo nuevo pasó por el agente revisor de texto:

- **Blueprint** (`content/courses/m07/course.json`): seis objetivos evaluados, uno por lección, tomados de `investigacion/M07-apis-mcp-integraciones.md` §2. Competencias: C09 en todos, C11 en `eo2`, `eo4` y `eo6`, y C08 en `eo5`.
- **Lecciones:**
  - L1: peticiones, respuestas y JSON (leer un contrato, un 200 que no basta, errores con formato).
  - L2: credenciales, alcances y mínimo privilegio (401 frente a 403, OAuth, tokens portadores, ampliación de alcances, sin reenvío de tokens, la instrucción no es un control).
  - L3: errores, límites, reintentos e idempotencia (códigos, Retry-After, retroceso con tope, clave de idempotencia, errores de herramientas MCP).
- **16 preguntas** en `questions/checks.json`: 4 comprobaciones por lección, y 2 repasos en L2 y en L3.
- **28 conceptos erróneos**, `m07-mc01` a `m07-mc28`. `mc09`, `mc16` y `mc18` quedan para el examen; `mc05` y `mc21` se declaran como inferencias.
- **2 fichas:** `m07-pc-connector-credentials` (L2, `mixed`) y `m07-pc-tool-timeouts` (L3, `unspecified`).
- **36 fuentes nuevas** en `content/sources.json`, desde el registro de la investigación §6. En vez de duplicar fuentes, reutilicé `src-owasp-llm06` y `src-mcp-spec-tools`, que ya existían, y amplié lo que respaldan.

**Cifra comprobada** con un script sobre `opportunities_snapshot_2026-10-19.csv` (la investigación la había calculado a mano, hueco n.º 10): el Sur tiene 11 oportunidades abiertas, ordenadas por `opp_id`. Con páginas de 10, la primera suma 1 208 000 en las monedas originales (incluye OPP-1028 y OPP-1035 en euros, y OPP-1036 en «En revisión») y deja fuera OPP-1039, en «Propuesta», por 112 000 USD. El total es 1 320 000.

El revisor de texto explicó los términos técnicos la primera vez que aparecen, corrigió una contradicción del caso de L3 (cuántas veces se repitió la llamada) y señaló cuatro dudas, que apliqué:
- en `m07-l3#clave`, el «mecanismo equivalente» quedó marcado como inferencia;
- `m07-l1-c2 o2` usa ahora `mc28`;
- `m07-l3-c1` dice que el POST llevaba clave y que el agente quiere repetirlo con una nueva;
- el título de `#contrato` ya no promete trabajar sin el servicio.

`npm test` 205/205.

## Pedido

1. **Fidelidad a las fuentes:** que cada `:cite[...]` diga lo que afirma la lección. Prioriza:
   - **L1:** los métodos seguros y el GET que actúa; el código desconocido que se trata como x00; RFC 9457; OpenAPI; el `inputSchema` y el `outputSchema` de MCP; OWASP API10.
   - **L2:** 401 frente a 403; los cuatro papeles de OAuth y el alcance concedido distinto del pedido; las reglas de RFC 6750 para tokens portadores, incluida la de no ir en la URL; RFC 9700; `insufficient_scope` y el límite de intentos en la autorización de MCP; los comodines de la guía de seguridad; el *token passthrough*; las credenciales del entorno en stdio; la agencia excesiva de OWASP LLM06; las credenciales de corta vida en CI.
   - **L3:** los códigos de la tabla, contra RFC 9110 y RFC 6585; Retry-After; las recomendaciones de la guía de reintentos; el borrador `Idempotency-Key` (409 y 422; di si sigue en la versión 08); OWASP API4; los dos tipos de error de MCP y `isError`; `idempotentHint` como pista; la reemisión tras un corte en la revisión 2026-07-28.
2. **Fichas:** verifica rutas, nombres de opciones, valores por defecto y estados contra sus páginas. Anota cualquier cambio desde el 2026-10-23. Las dos fichas reúnen productos con estados distintos o sin estado; di si `mixed` y `unspecified` son correctos.
3. **Preguntas:**
   - que tengan una clave única y defendible, y explicaciones fieles al `sectionRef`;
   - que cada distractor tenga bien asignado su concepto erróneo;
   - que no haya pistas de longitud;
   - **escenarios repetidos:** ninguno debe repetir M01 a M06 ni los diagnósticos `dx-b5-02`, `dx-b5-04` y `dx-b6-02` (la investigación lo advierte). Revisa sobre todo:
     - `m07-l3-r2` (alcance de exportación más una instrucción en el prompt);
     - `m07-l3-c4` (anotación `idempotentHint`), que se parece a `m06-l4-r2` (herramienta que se declara de solo lectura);
     - los tokens y secretos de M04.
4. **Alcance y tiempo:**
   - ¿Cada lección cabe en 25 minutos? L1 tiene 1 611 palabras, L2 1 434 y L3 1 572; las explicaciones de términos alargaron L1 y L3.
   - ¿Ningún producto aparece en el cuerpo?
   - ¿Queda fuera lo que la investigación §4 dice no enseñar: flujos OAuth paso a paso, detalles de implementación de MCP y OAuth 2.1 presentado como estándar?
5. **Blueprint:** ¿los seis objetivos se pueden evaluar con opción múltiple tal como están escritos? ¿El reparto de competencias es razonable?

## Entregables

- `investigacion/codex-revision-m07-l1-l3.md` con los hallazgos en el formato de PROTOCOLO §5, ordenados por severidad, y la lista de fuentes abiertas con su resultado.
- La sección **Entrega** de este ticket.

## Archivos permitidos

- `investigacion/codex-revision-m07-l1-l3.md` (nuevo)
- La sección Entrega de este ticket y su campo Estado

No edites `src/`, `content/`, `e2e/` ni `ESTADO.md`. Haz commit en la rama `main` de `C:\Users\Daniel\Documents\AI\AI_School`, con prefijo `[codex]`, y anota el hash en la Entrega.

---

## Entrega

_(Codex)_

## Revisión

_(Claude Code)_

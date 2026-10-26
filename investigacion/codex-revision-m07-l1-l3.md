# Revisión cruzada — M07, lecciones 1 a 3

Fecha de revisión: 2026-10-26  
Alcance: `course.json`, L1--L3, 16 comprobaciones, `m07-mc01`--`m07-mc28` y las dos fichas de producto. No se modificó contenido ni código.

## Hallazgos

- [T038-SRC-01] Severidad: alta
  Ubicación: `content/courses/m07/lessons/m07-l1.md` (comprobación rápida y sección «Códigos de estado») y `content/courses/m07/questions/checks.json`, `m07-l1-c2`.
  Evidencia: el texto presenta el 425 como ejemplo de código desconocido y concluye que debe tratarse como 400. Pero 425 está registrado como **Too Early** por [RFC 8470, sección 5](https://www.rfc-editor.org/rfc/rfc8470#section-5); no es un estado desconocido ni equivale al 400 genérico. La pregunta repite el caso y, por tanto, su clave actualmente no es defendible.
  Consecuencia: se enseña una clasificación HTTP equivocada y se puntúa como correcta una decisión incorrecta.
  Corrección recomendada: no usar un número registrado. Formular el ejemplo como «un código 4xx que la API no documenta» y explicar la regla de RFC 9110 para un código no reconocido, o elegir un valor que no esté asignado en el registro IANA; ajustar en paralelo la comprobación `m07-l1-c2`, su explicación y su distractor.

- [T038-ESC-02] Severidad: media
  Ubicación: `content/courses/m07/questions/checks.json`, `m07-l3-r2`; comparación con `content/diagnostic/items.json`, `dx-b5-04`.
  Evidencia: ambos casos preguntan esencialmente si se puede compensar permiso de más con una instrucción en el prompt. En `dx-b5-04`, el distractor es «permisos amplios y una instrucción clara de no modificar nada más»; en M07 se añaden `accounts:export` y «no exportes nada». Cambia el verbo, pero se revela la misma regla y la misma respuesta: el permiso técnico prevalece sobre el prompt.
  Consecuencia: la comprobación de M07 no aporta evidencia nueva de `eo2` y puede favorecer a quien recuerde el diagnóstico en vez de razonar sobre alcances.
  Corrección recomendada: conservar el aprendizaje de scopes pero cambiar la decisión central: por ejemplo, entregar una respuesta OAuth cuyo scope concedido difiere del solicitado y pedir decidir si se usa o se detiene el flujo, sin convertir el prompt en uno de los controles en disputa.

- [T038-ESC-03] Severidad: media
  Ubicación: `content/courses/m07/questions/checks.json`, `m07-l3-c4`; comparación con `content/courses/m06/questions/checks.json`, `m06-l4-r2`.
  Evidencia: ambos plantean que un servidor de terceros se autodeclara seguro (solo lectura / `idempotentHint: true`) y la respuesta correcta es no fiarse de la anotación sin un control externo. El atributo técnico cambia, pero el patrón, la pista «servidor no revisado» y la acción evaluada son los mismos.
  Consecuencia: contradice el requisito de no repetir escenarios entre M01--M06 y reduce la discriminación de la comprobación.
  Corrección recomendada: evaluar la idempotencia con un corte de conexión y un `POST` con o sin una clave de idempotencia, o con un servidor de confianza cuyo contrato aclara el efecto. Así se evalúa la decisión propia de L3 (repetir o no) sin reciclar la desconfianza ante una autoanotación de M06.

- [T038-PC-04] Severidad: baja
  Ubicación: `content/courses/m07/product-cards.json`, `m07-pc-connector-credentials`.
  Evidencia: la ficha marca Claude Code y Codex como «GA», pero las páginas de producto abiertas describen las rutas y opciones sin declarar ese estado de lanzamiento. La página de la API de Anthropic sí identifica explícitamente su conector MCP como **Beta**. Por ello `maturity: "mixed"` es razonable para la ficha, pero los dos paréntesis «(GA)» no quedan respaldados por sus fuentes citadas.
  Consecuencia: se presenta como estado de lanzamiento una inferencia que puede cambiar y que el lector interpreta como dato verificado.
  Corrección recomendada: conservar `mixed`, sustituir esos dos «(GA)» por «estado no indicado en la página» o añadir una fuente primaria de lanzamiento que declare GA explícitamente.

## Comprobaciones sin hallazgo

- Las 21 referencias `:cite[...]` de L1--L3 existen en `content/sources.json`. Salvo el uso incorrecto del ejemplo 425, las afirmaciones contrastadas conservan el alcance de sus fuentes: métodos seguros y clase de estado, roles y scopes de OAuth, tokens portadores, Problem Details, límites y `Retry-After`, guía de reintentos, `isError` y anotaciones de herramientas MCP.
- El borrador de `Idempotency-Key` sigue siendo `draft-ietf-httpapi-idempotency-key-header-08` y continúa activo al 2026-10-26; la caracterización como borrador, el uso de 409 durante la operación en curso y 422 para reutilización incompatible son coherentes con esa versión.
- Las rutas y opciones de las fichas se verificaron: `codex mcp login`, `~/.codex/config.toml` y `.codex/config.toml` de proyecto confiable; `timeout`, `MCP_TOOL_TIMEOUT`, `startup_timeout_sec` (10 s) y `tool_timeout_sec` (60 s). `m07-pc-tool-timeouts` usa correctamente `maturity: "unspecified"`; sus páginas no publican estado de lanzamiento. No detecté cambio de rutas, valores por defecto ni estados desde 2026-10-23, salvo la precisión de estado indicada en T038-PC-04.
- Las 16 preguntas tienen exactamente una opción marcada como correcta. Las longitudes de opciones tienen una relación máxima de 1,43, por debajo de 1,7; las claves, explicaciones, `sectionRef` y conceptos erróneos son coherentes salvo la clave afectada por T038-SRC-01. `mc05` y `mc21` están correctamente declarados como inferencias.
- L1, L2 y L3 contienen aproximadamente 1 576, 1 451 y 1 589 palabras de lectura respectivamente (el conteo incluye la sintaxis editorial y por ello es conservador). Con las comprobaciones y ejemplos siguen dentro de 25 minutos a un ritmo de lectura guiada normal. No aparecen nombres de productos en el cuerpo; los detalles de producto están aislados en sus fichas. El alcance se mantiene en alfabetización de APIs e integración, sin enseñar flujos OAuth ni implementación de MCP.
- Los seis objetivos del blueprint están redactados como decisiones observables en un caso; cada uno puede evaluarse con opción múltiple. La asignación de C09 a todos, C11 a decisiones de permisos/configuración y C08 a validación de resultados es consistente con su enunciado.

## Fuentes abiertas y resultado

| Fuente abierta | Resultado de la comprobación |
| --- | --- |
| [RFC 9110](https://www.rfc-editor.org/rfc/rfc9110) | Respaldó semántica HTTP, clases, métodos seguros, 401/403, 404, 503, `Retry-After` e idempotencia. La regla para códigos no reconocidos es correcta; el ejemplo 425 no lo es. |
| [RFC 8470](https://www.rfc-editor.org/rfc/rfc8470#section-5) | Confirmó que 425 es `Too Early`; origen de T038-SRC-01. |
| [RFC 6585](https://www.rfc-editor.org/rfc/rfc6585) | Confirmó 429 y `Retry-After`. |
| [RFC 6749](https://www.rfc-editor.org/rfc/rfc6749) | Confirmó los cuatro roles OAuth y que un scope concedido distinto se comunica en la respuesta. |
| [RFC 6750](https://www.rfc-editor.org/rfc/rfc6750) | Confirmó medidas para tokens portadores, incluido no exponerlos en URL y la restricción de audiencia. |
| [RFC 9457](https://www.rfc-editor.org/rfc/rfc9457) | Confirmó `application/problem+json` y los campos de Problem Details. |
| [RFC 9700](https://www.rfc-editor.org/rfc/rfc9700) | Confirmó las recomendaciones actuales de mínimo privilegio y audiencia para OAuth. |
| [Borrador Idempotency-Key -08](https://datatracker.ietf.org/doc/draft-ietf-httpapi-idempotency-key-header/) | Sigue en -08 y activo; confirmó semántica de 409 y 422. |
| [OpenAPI 3.2](https://spec.openapis.org/oas/latest.html) | Confirmó la descripción de contratos API, documentación, generación y pruebas. |
| [MCP Tools](https://modelcontextprotocol.io/specification/latest/server/tools) | Confirmó `inputSchema`, `outputSchema`, errores de herramienta y `isError`. |
| [MCP Authorization 2026-07-28](https://modelcontextprotocol.io/specification/2026-07-28/basic/authorization) | Confirmó OAuth, `insufficient_scope`, audiencias, no token passthrough y la excepción de `stdio`. |
| [MCP schema 2026-07-28](https://github.com/modelcontextprotocol/specification/blob/main/schema/2026-07-28/schema.ts) y [changelog](https://modelcontextprotocol.io/specification/2026-07-28/changelog) | Confirmaron que las anotaciones son pistas no confiables y la reemisión tras corte. |
| [MCP Security Best Practices](https://modelcontextprotocol.io/docs/2026-07-28/tutorials/security/security_best_practices) | Confirmó ampliación progresiva de scopes y el riesgo de token passthrough. |
| [OWASP API10](https://api-security.owasp.org/editions/2023/en/0xaa-unsafe-consumption-of-apis) y [API4](https://api-security.owasp.org/editions/2023/en/0xa4-unrestricted-resource-consumption) | Confirmaron validar datos de terceros y limitar frecuencia/tamaño/ejecución. |
| [OWASP LLM06](https://genai.owasp.org/llmrisk/llm062025-excessive-agency/) | Confirmó que un prompt no sustituye autorización aplicada en destino. |
| [GitHub Actions OIDC](https://docs.github.com/en/actions/concepts/security/openid-connect) | Confirmó credenciales efímeras por trabajo frente a secretos de larga duración. |
| [AWS: retries and jitter](https://builder.aws.com/content/3EumjoZascWd1oZiEgL8ORlv3qE/timeouts-retries-and-backoff-with-jitter) | Confirmó límite, backoff, jitter y reintentos en una sola capa. |
| [Claude Code MCP](https://code.claude.com/docs/en/mcp) y [headless](https://code.claude.com/docs/en/headless) | Confirmaron las rutas de Claude Code, `timeout`, `MCP_TOOL_TIMEOUT`, inactividad y evento de reintento. No declararon GA. |
| [Conectores personalizados de Claude](https://support.claude.com/en/articles/11175166-get-started-with-custom-connectors-using-remote-mcp) | Confirmó OAuth y desconexión; no declaró beta. |
| [MCP connector de Claude API](https://platform.claude.com/docs/en/agents-and-tools/mcp-connector) | Confirmó `authorization_token` y estado Beta. |
| [MCP en Codex](https://learn.chatgpt.com/docs/extend/mcp) | Confirmó configuración compartida, rutas de `config.toml` y `codex mcp login`; no declaró GA. |
| [Connectors y MCP de Responses](https://developers.openai.com/api/docs/guides/tools-connectors-mcp) | Confirmó envío de `authorization` por petición y que el token no se almacena; no publicó estado. |

## Verificación ejecutada

`npm test`: 14 archivos y 205 pruebas aprobadas. También se comprobó por script que las referencias de las lecciones existen, que cada pregunta tiene una sola clave y que ninguna proporción de longitud de opciones supera 1,7.

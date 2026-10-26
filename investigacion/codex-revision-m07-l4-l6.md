# Revisión cruzada — M07, lecciones 4 a 6

Fecha: 2026-10-26. Alcance: L4--L6, 18 preguntas, `m07-mc31`--`m07-mc54` y las tres fichas indicadas. No se modificó contenido ni código.

## Hallazgos

- [T039-REP-01] Severidad: media
  Ubicación: `content/courses/m07/questions/checks.json`, `m07-l6-c2`; comparación con `content/diagnostic/items.json`, `dx-b6-02`.
  Evidencia: ambos escenarios entregan una instrucción maliciosa dentro de datos externos y preguntan la misma decisión: no fiarse de un prompt, sino retirar/aplicar el permiso que permitiría la acción. Cambian PDF/correo por ticket/cierre de tickets, pero se mantiene el patrón, el riesgo y la defensa evaluada.
  Consecuencia: incumple la restricción de no repetir diagnóstico y la comprobación puede acertarse por recuerdo, no por transferencia.
  Corrección recomendada: conservar el ticket de soporte, pero medir otro peldaño de L6: por ejemplo, si se ejecuta en modo de lectura y el ticket intenta que cambie parámetros de una consulta, pedir cómo registrar, aislar y probar el contenido antes de habilitar una escritura futura.

- [T039-REP-02] Severidad: media
  Ubicación: `content/courses/m07/questions/checks.json`, `m07-l6-r1`; comparación con `content/courses/m03/questions/checks.json`, comprobación de `m03-l6#citas`.
  Evidencia: M03 ya plantea una respuesta con citas a archivos reales y mide que una cita no prueba que la afirmación esté respaldada. M07 cambia el detalle por una cifra de ventas y añade «compruébala con una consulta», pero su clave sigue dependiendo de la misma regla («una cita no valida la afirmación»), expresamente enseñada y comprobada en M03 L6.
  Consecuencia: no aporta una medida independiente de L6 y contradice el requisito de no reciclar escenarios de M03.
  Corrección recomendada: evaluar la escalera de validación de L6 con una cifra obtenida mediante el conector (por ejemplo, una página truncada o un entorno de prueba que devuelve otro formato), sin hacer de la cita la señal decisiva.

## Comprobaciones sin hallazgo

- Las fuentes contrastadas respaldan la arquitectura MCP (anfitrión, cliente por servidor y aislamiento), los transportes, los límites del protocolo para imponer seguridad y las defensas ante envenenamiento, cambio posterior y sombreado. L4 no entra en detalle de JSON-RPC ni de la revisión 2026-07-28; mantiene el nivel de alfabetización solicitado.
- El artículo original de RAG respalda la caracterización general. BIRD es de 2023 y publica 40,08 % frente a 92,96 % humano, por lo que «40 % frente a 93 %» y el aviso de fecha en L5 son fieles. AgentDojo documenta 97 tareas y 629 casos; «casi cien» y «más de seiscientos» son aproximaciones prudentes. La caracterización de inyección indirecta es consistente con Greshake et al.
- Las tres fichas mantienen las rutas y valores comprobados: configuración y listas permitidas/denegadas de MCP, Inspector (Node 22.19.0+, `--cli`, `--tui` y `~/.mcp-inspector/secrets.json`) y ejecución no interactiva. La documentación oficial de Codex confirma `required = true`, sandbox de solo lectura y los valores 10 s/60 s. Los tres estados `unspecified` son correctos: las páginas revisadas no declaran estado de lanzamiento. No detecté cambio desde 2026-10-23.
- `m07-l5-c4` tiene una clave única y defendible. Que la base controle permisos no vuelve segura una interfaz que acepta cualquier SQL, y la segunda mitad de `o1` («el modelo escribe buen SQL») tampoco es una garantía; la clave sí evalúa restringir capacidad. Sus distractores y conceptos erróneos son coherentes.
- Las 18 preguntas tienen exactamente una clave. La proporción máxima entre longitudes de sus opciones es 1,34, menor que 1,7; los `sectionRef`, explicaciones y conceptos erróneos son consistentes. Los nueve conceptos marcados como inferencia lo están correctamente.
- Las series cumplen R-A4-2: L4 presenta cinco y L5 cuatro casos, después de enseñar la distinción, y cada caso requiere elegir una vía antes de ver la respuesta. Sus respuestas son defendibles dentro de los supuestos declarados.
- L4, L5 y L6 contienen aproximadamente 1 596, 1 222 y 1 358 palabras en un conteo conservador; con casos y comprobaciones permanecen bajo 25 minutos. No hay nombres de productos en el cuerpo de las lecciones; las referencias de producto están aisladas en fichas. El alcance deja fuera embeddings como técnica evaluable, implementación detallada de OAuth/MCP y ataques técnicos.

## Fuentes abiertas y resultado

| Fuente | Resultado |
| --- | --- |
| [MCP Architecture](https://modelcontextprotocol.io/specification/2026-07-28/architecture) | Respaldó anfitrión, cliente por servidor, contexto y aislamiento. |
| [MCP Transports](https://modelcontextprotocol.io/specification/2026-07-28/basic/transports) | Respaldó `stdio` y Streamable HTTP; las precauciones locales permanecen bien presentadas. |
| [MCP Tools](https://modelcontextprotocol.io/specification/latest/server/tools) | Respaldó herramientas, intervención humana y presentación de parámetros. |
| [OWASP MCP Security Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/MCP_Security_Cheat_Sheet.html) | Respaldó envenenamiento, *rug pull*, sombreado y mitigaciones. |
| [RAG, Lewis et al.](https://arxiv.org/abs/2005.11401) | Respaldó la definición y la comparación con modelos sin recuperación. |
| [Contextual Retrieval](https://www.anthropic.com/engineering/contextual-retrieval) | Respaldó fragmentación, búsqueda combinada y el umbral aproximado de 500 páginas. |
| [BIRD](https://arxiv.org/abs/2305.03111) | Confirmó año 2023 y 40,08 % frente a 92,96 %. |
| [Greshake et al.](https://arxiv.org/abs/2302.12173) | Respaldó inyección indirecta mediante contenido recuperado. |
| [AgentDojo](https://arxiv.org/abs/2406.13352) | Confirmó 97 tareas y 629 casos. |
| [MCP Inspector](https://modelcontextprotocol.io/docs/tools/inspector) | Respaldó interfaz, CLI/TUI, Node y almacenamiento de secretos. |
| [Claude Code headless](https://code.claude.com/docs/en/headless) y [MCP](https://code.claude.com/docs/en/mcp) | Respaldaron modo no interactivo, `--bare`, configuración del proyecto y OAuth previo. |
| [Configuración MCP de Codex](https://learn.chatgpt.com/docs/config-file/config-reference) y [modo no interactivo](https://learn.chatgpt.com/docs/non-interactive-mode) | Confirmaron `enabled_tools`, `disabled_tools`, `required`, los valores de tiempo y sandbox de solo lectura. |

## Verificación ejecutada

`npm test`: 14 archivos y 205 pruebas aprobadas. Un script comprobó una clave por pregunta y las proporciones de longitud de las opciones.

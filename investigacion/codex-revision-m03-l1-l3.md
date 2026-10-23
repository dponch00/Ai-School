# Revisión cruzada T-027 — M03, lecciones 1 a 3

Fecha de revisión: 2026-10-23

Alcance: objetivos de M03, lecciones L1–L3, sus 16 comprobaciones, 23 conceptos erróneos, cuatro fichas y las 33 fuentes incorporadas el 2026-10-22. Se contrastaron además los escenarios con M01, M02 y el bloque B3 del diagnóstico.

## Hallazgos

- [T027-01] Severidad: alta
  Ubicación: `content/courses/m03/lessons/m03-l1.md`, sección `#por-que-rinde-menos`, afirmación con `src-arxiv-nolima`.
  Evidencia: la lección atribuye a NoLiMa que «10 de 12 modelos» con ventanas de 128 000 o más caen por debajo de la mitad al llegar a 32 000. La versión 3 del artículo evalúa 13 modelos que declaran al menos 128K y dice que, a 32K, 11 bajan del 50 % de su línea base corta. No publica la cohorte «10 de 12».
  Consecuencia: la cifra concreta no queda respaldada por la cita y rebaja sin base la magnitud del resultado, precisamente uno de los datos prioritarios de la lección.
  Corrección recomendada: sustituirla por «11 de 13 modelos evaluados bajaron del 50 % de su línea base corta a 32 000 tokens», conservando la salvedad de que es un benchmark sintético, o retirar el conteo y describir solo la tendencia.

- [T027-02] Severidad: media
  Ubicación: `content/courses/m03/lessons/m03-l2.md`, sección `#compartido`; `content/courses/m03/product-cards.json`, ficha `m03-pc-copilot-instructions`.
  Evidencia: ambos dicen que VS Code solo lee el `AGENTS.md` de la raíz y que los anidados requieren un ajuste experimental. La documentación vigente de VS Code indica que las sesiones de Copilot descubren instrucciones en la raíz, el directorio de trabajo y los directorios intermedios, y combinan las aplicables; para el arnés local, `chat.useAgentsMdFile` controla la carga automática del archivo de raíz y está activado por defecto. La misma página mantiene que no hay un orden general de precedencia.
  Consecuencia: el alumno puede crear una excepción inexistente para instrucciones por subcarpeta y diagnosticar mal qué archivo se cargó. La ficha, que debe aislar hechos volátiles, quedó desactualizada desde su verificación del 2026-10-22.
  Corrección recomendada: actualizar la lección y la ficha con la regla vigente, nombrar el ajuste solo para su alcance real y conservar la recomendación de comprobar las instrucciones efectivamente aplicadas. Fechar de nuevo la ficha y su próxima revisión.

## Comprobaciones sin hallazgo

- RULER sí reporta 17 modelos y que solo la mitad mantuvo rendimiento satisfactorio a 32K. Du et al. sí encuentran deterioro aun con recuperación perfecta y relleno de espacios. Chroma sí compara prompts enfocados de ~300 tokens con historiales completos de ~113K. Esas afirmaciones mantienen su alcance: benchmarks y tendencia, no una medida universal de todos los modelos.
- Las cifras y versiones de las fichas se sostienen en las páginas abiertas: Claude Code v2.1.277 para lectura directa de AGENTS.md; v2.1.304 para reinyectar descripciones de skills tras compactar; 32 KiB por defecto para instrucciones de Codex; recomendación de menos de 200 líneas; cuerpos de skills con tope de 5 000 tokens y 25 000 totales; y advertencia MCP a 10 000 con tope por defecto de 25 000. El único cambio observado desde el 2026-10-22 es el de VS Code del hallazgo T027-02.
- Las 16 preguntas tienen exactamente una clave. Los distractores tienen un concepto erróneo existente y la explicación revisada responde al `sectionRef`. La clave más larga aparece en 4 de 16, como declara el ticket; no encontré un patrón adicional de forma o posición que revele la respuesta.
- M03 L1 comparte el tema de saturación con `m01-l3-c2` y `dx-b3-01`, pero no repite la decisión: los anteriores tratan un historial contaminado por errores repetidos y admiten reiniciar; `m03-l1-c2` declara que las decisiones siguen siendo valiosas y pide compactar con foco. `m01-f06` trata selección de evidencia de un contrato, no gestión de sesión. Tampoco encontré un escenario equivalente en M02 ni en los demás ítems de B3.
- Los seis objetivos permanecen evaluables por escenarios de opción múltiple bajo D-024. En particular, `m03-eo4` evalúa elegir una skill y pruebas de activación, y `m03-eo5` elegir un traspaso y clasificar información por capa. Esto verifica decisiones, no la destreza práctica de escribir la skill o el documento; esa limitación es la consecuencia explícita de D-024, no una incoherencia del objetivo reformulado.
- El cuerpo de las tres lecciones no menciona proveedores ni archivos propios de un producto; los detalles volátiles están en fichas. Las longitudes son 1 586, 1 405 y 1 459 palabras: aproximadamente 13, 11 y 12 minutos de lectura a 130 palabras por minuto, antes de pausas y comprobaciones, por debajo del presupuesto de 25 minutos.

## Fuentes abiertas

| Fuente | Resultado de la apertura y contraste |
| --- | --- |
| `src-anthropic-cc-skills` | Abierta; confirma skills bajo demanda y el formato `SKILL.md`. |
| `src-anthropic-cc-context-window` | Abierta; confirma carga, compactación, v2.1.304 y topes 5 000/25 000. |
| `src-anthropic-cc-subagents` | Abierta; confirma contexto aislado y retorno de resumen. |
| `src-anthropic-cc-mcp` | Abierta; confirma aviso 10 000 y tope predeterminado 25 000. |
| `src-anthropic-eng-skills` | Abierta; confirma origen, estructura y carga progresiva de Agent Skills. |
| `src-anthropic-eng-harnesses` | Abierta; confirma la necesidad de artefactos de continuidad entre sesiones. |
| `src-anthropic-skills-overview` | Abierta; confirma los niveles de carga de skills. |
| `src-anthropic-skills-bp` | Abierta; confirma concisión y evaluación de skills. |
| `src-anthropic-citations` | Abierta; confirma punteros y texto citado para citas API. |
| `src-agentskills-site` | Abierta; confirma formato abierto y tres etapas de carga. |
| `src-agentskills-spec` | Abierta; confirma campos, límites y estructura de `SKILL.md`. |
| `src-agentskills-descriptions` | Abierta; confirma pruebas con consultas de casi acierto. |
| `src-agentskills-bp` | Abierta; confirma creación desde práctica y refinamiento con ejecución. |
| `src-agentskills-client-impl` | Abierta; confirma catálogo de ~50–100 tokens y cuerpo <5 000 recomendado. |
| `src-openai-codex-skills` | Abierta; documentación oficial de skills disponible; no contradice las afirmaciones del curso. |
| `src-openai-codex-memories` | Abierta; confirma memoria local, controles y que no sustituye instrucciones del repositorio. |
| `src-openai-codex-hooks` | Abierta; documentación oficial disponible; respalda tratar hooks como automatización, no como única barrera. |
| `src-github-copilot-instructions` | Abierta; confirma archivos de repositorio, rutas e `AGENTS.md` más cercano. |
| `src-github-instructions-support` | Abierta; confirma soporte por superficie de Copilot. |
| `src-github-agent-skills` | Abierta; confirma ubicaciones y disponibilidad dependiente de la superficie. |
| `src-github-copilot-memory` | Abierta; confirma memoria en vista previa y su alcance. |
| `src-microsoft-vscode-instructions` | Abierta; contradice la regla de anidados del texto y ficha (T027-02). |
| `src-agentsmd-site` | Abierta; confirma formato abierto y propósito de AGENTS.md. |
| `src-lf-aaif` | Abierta; confirma la custodia de AGENTS.md por AAIF/Linux Foundation. |
| `src-mcp-intro` | Abierta; confirma MCP como estándar abierto para datos, herramientas y flujos externos. |
| `src-arxiv-ruler` | Abierta; confirma 17 modelos y mitad satisfactoria a 32K. |
| `src-arxiv-nolima` | Abierta; contradice el conteo de L1: 11 de 13, no 10 de 12 (T027-01). |
| `src-arxiv-context-length` | Abierta; confirma caída con recuperación perfecta y espacios en blanco. |
| `src-arxiv-verifiability` | Abierta; confirma evaluación de cobertura y exactitud de citas. |
| `src-arxiv-legal-rag` | Abierta; confirma que RAG reduce, pero no elimina, alucinaciones en la evaluación descrita. |
| `src-nygard-adr` | Abierta; confirma el patrón de decisiones cortas con contexto, decisión y consecuencias. |
| `src-anthropic-academy` | Apertura intentada; el servidor devolvió 403, por lo que no fue verificable desde esta sesión. No respalda una cita en L1–L3. |
| `src-dlai-agent-skills` | Apertura intentada; el servidor devolvió 403, por lo que no fue verificable desde esta sesión. No respalda una cita en L1–L3. |

También se abrió `src-chroma-context-rot`, fuente previa que sí cita L1, para verificar sus valores ~300 y ~113K.

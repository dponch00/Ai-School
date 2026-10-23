# Revisión cruzada de M03 L4–L6 — T-028

**Fecha:** 2026-10-23  
**Alcance:** lecciones `m03-l4` a `m03-l6`, 18 comprobaciones y repasos añadidos, conceptos erróneos `m03-mc24` a `m03-mc47`, y fichas `m03-pc-skills-tools`, `m03-pc-memory` y `m03-pc-citations`.

## Resultado

Se comprobó el conjunto de 18 preguntas contra el commit anterior a su incorporación (`1da4804`): hay 18, todas tienen exactamente una opción marcada como correcta y sus distractores referencian conceptos erróneos pertinentes cuando corresponde. Los 24 conceptos `m03-mc24`–`m03-mc47` están presentes.

Las cifras y límites revisados se sostienen: nombre de skill de 64 caracteres, descripción de 1 024, cuerpo recomendado bajo 5 000 tokens y 500 líneas; unas 20 consultas, tres corridas y umbral para evaluar activación; 51,5 % y 74,5 %; y 17–33 %. Las fichas también concuerdan con su documentación oficial: 2 %, 1 %, 1 536 caracteres, 200 líneas o 25 KB, 28 días sin uso, y 10 000/25 000/50 000. La documentación vigente sigue marcando Copilot Memory como vista previa pública; no hallé cambio material desde la verificación del 2026-10-22.

El conteo simple de palabras da 1 505, 1 195 y 1 117 palabras en L4, L5 y L6 respectivamente (8,4, 6,6 y 6,2 minutos a 180 palabras por minuto, antes de actividades): quedan dentro de 25 minutos. No hay nombres de producto ni archivos exclusivos de un producto en el cuerpo didáctico. Los casos comparten Altiplano y el dominio de reconciliación con M01/M02, pero evalúan decisiones distintas: en particular, `m03-l5-r1` separa memoria de instrucciones, mientras `m03-l1-c4` trata la carga de instrucciones; no se detectó una repetición que revele una respuesta.

## Hallazgos

- [T028-01] Severidad: media
  Ubicación: `content/courses/m03/questions/checks.json`, `m03-l4-c4`, `m03-l4-r1`, `m03-l4-r2`, `m03-l5-c2`, `m03-l6-c1` y `m03-l6-c3`
  Evidencia: en seis de las 18 preguntas añadidas, la clave es la opción más larga: 92 frente a 69/61 caracteres; 59 frente a 47/50; 99 frente a 98/79; 81 frente a 68/66; 86 frente a 61/64; y 86 frente a 79/72. El ticket anticipa diez claves más largas; el recálculo sobre el JSON actual da seis, pero siguen siendo una pauta visible, especialmente en `m03-l5-c2` y `m03-l6-c1`.
  Consecuencia: quien responda por forma puede acertar sin distinguir el contenido, lo que reduce la validez de la comprobación.
  Corrección recomendada: equilibrar el detalle entre las opciones de esas seis preguntas. Por ejemplo, en `m03-l6-c1`, ampliar los dos distractores para que describan una estrategia completa, o condensar la clave sin quitar «cargar lo mínimo recurrente y recuperar lo demás al necesitarlo».

## Fuentes abiertas y resultado

| Fuente | Resultado de la comprobación |
| --- | --- |
| Agent Skills, [Specification](https://agentskills.io/specification) | Confirma `SKILL.md`, 64/1 024 caracteres, carga progresiva, <5 000 tokens y 500 líneas. |
| Agent Skills, [Optimizing skill descriptions](https://agentskills.io/skill-creation/optimizing-descriptions) | Confirma función de la descripción, unas 20 consultas, casi aciertos, tres corridas y umbral. |
| Agent Skills, [Adding skills support](https://agentskills.io/client-implementation/adding-skills-support) | Confirma catálogo inicial, cuerpo al activarse y recursos bajo demanda. |
| Agent Skills, [Best practices](https://agentskills.io/skill-creation/best-practices) | Respalda guía concisa, ejemplo, referencias y divulgación progresiva. |
| Agent Skills, [Overview](https://agentskills.io/) | Confirma formato abierto y carga bajo demanda. |
| Anthropic, [Skills en Claude Code](https://code.claude.com/docs/en/skills) | Confirma estándar compartido, activación y controles de invocación. |
| Anthropic, [Memory en Claude Code](https://code.claude.com/docs/en/memory) | Confirma sesiones nuevas, memoria local por repositorio/worktree y límite de 200 líneas o 25 KB. |
| Anthropic, [MCP en Claude Code](https://code.claude.com/docs/en/mcp) | Confirma los límites y avisos de salida de MCP usados por la ficha. |
| Anthropic, [Extend Claude Code](https://code.claude.com/docs/en/features-overview) | Confirma roles distintos de instrucciones, skills, MCP, subagentes y hooks. |
| Anthropic, [Citations](https://platform.claude.com/docs/en/build-with-claude/citations) | Confirma punteros válidos al pasaje y texto citado; no garantiza por sí sola que la inferencia sea correcta. |
| Anthropic, [Reduce hallucinations](https://platform.claude.com/docs/en/test-and-evaluate/strengthen-guardrails/reduce-hallucinations) | Respalda incertidumbre explícita, citas textuales y verificación de cada afirmación. |
| Anthropic, [Effective harnesses](https://www.anthropic.com/research/effective-harnesses-for-long-running-agents) | Confirma sesiones sin memoria, registro de progreso, artefactos de relevo, JSON y rutina de inicio. |
| Anthropic, [Effective context engineering](https://www.anthropic.com/research/effective-context-engineering-for-ai-agents) | Respalda contexto como recurso finito y recuperación guiada. |
| GitHub, [Copilot Memory](https://docs.github.com/en/copilot/concepts/prompting-and-context/copilot-memory) | Confirma vista previa pública, citas validadas contra la rama y borrado tras 28 días sin uso. |
| OpenAI, [Build skills](https://learn.chatgpt.com/codex/build-skills) y [Memories](https://learn.chatgpt.com/docs/customization/memories) | Rutas, invocación y ajustes de Codex contrastados; sin cambio material para las cifras de la ficha desde el 2026-10-22. |
| GitHub, [Agent skills](https://docs.github.com/en/copilot/concepts/agents/about-agent-skills) | Confirma compatibilidad/rutas específicas de la superficie de Copilot. |
| Anthropic, [Agent Skills overview](https://platform.claude.com/docs/en/agents-and-tools/agent-skills/overview) y [best practices](https://platform.claude.com/docs/en/agents-and-tools/agent-skills/best-practices) | Confirman carga por niveles y prácticas de contenido conciso. |
| Anthropic, [Agent Skills engineering](https://www.anthropic.com/engineering/equipping-agents-for-the-real-world-with-agent-skills) | Respalda la fecha y el carácter abierto del estándar, y los riesgos de skills no auditadas. |
| Liu et al., [Evaluating Verifiability in Generative Search Engines](https://arxiv.org/abs/2304.09848) | Confirma 51,5 % de afirmaciones plenamente respaldadas y 74,5 % de citas que respaldan su frase, para ese estudio. |
| Magesh et al., [Hallucination-Free?](https://arxiv.org/abs/2405.20362) | Confirma el intervalo 17–33 % en las herramientas jurídicas estudiadas. |
| Nygard, [Documenting Architecture Decisions](https://www.cognitect.com/blog/2011/11/15/documenting-architecture-decisions) | Confirma entradas numeradas, contexto, decisión, estado, consecuencias y no reutilizar números. |
| OWASP, [LLM01: Prompt Injection](https://genai.owasp.org/llmrisk/llm01-prompt-injection/) | Respalda tratar contenido externo como dato no confiable. |
| Chroma, [Context Rot](https://www.trychroma.com/research/context-rot) y [Context Length Alone Hurts LLM Performance](https://arxiv.org/abs/2510.05381) | Respaldan el límite práctico del contexto largo; no se extrapolan sus resultados a modelos no estudiados. |

## Verificación ejecutada

`npm test` pasó: 12 archivos, 134 pruebas.
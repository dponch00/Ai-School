# Revisión cruzada — M09 L4–L6 (T-045)

Fecha de revisión: 2026-10-27
Alcance: `m09-l4` a `m09-l6`, 18 comprobaciones, conceptos erróneos `m09-mc34`–`m09-mc61` y las fichas `m09-pc-injection-protections`, `m09-pc-owasp-lists` y `m09-pc-review-tools`.

## Hallazgos

- [T045-M09-01] Severidad: media
  Ubicación: `content/courses/m09/lessons/m09-l5.md:103`, ejemplo «El acta del Sur, revisada».
  Evidencia: la lección define [C] como «cambia algo o se comunica hacia afuera», pero afirma que el flujo no tiene [C] porque «solo deja un borrador». La fuente de la regla de dos también define [C] como *change state or communicate externally*. Si el borrador se guarda en `drafts/`, hay un cambio de estado; que no se envíe no basta para negarlo.
  Consecuencia: el lector puede clasificar mal una configuración de permisos y creer que guardar una salida no cuenta como acción. La conclusión de que no reúne las tres propiedades puede mantenerse, pero la justificación actual contradice la definición que acaba de aprender.
  Corrección recomendada: decir que el flujo tiene [A] y [C] si persiste el borrador, y aclarar que no tiene [B] si el contrato no contiene datos sensibles; o definir explícitamente que el borrador es una salida efímera no persistida. Mantener la inferencia posterior: la regla no cubre por sí sola un análisis engañoso sin daño de alto impacto.

- [T045-M09-02] Severidad: media
  Ubicación: `content/courses/m09/product-cards.json:48`, `m09-pc-injection-protections`.
  Evidencia: la ficha dice que «en el modo de permisos por defecto, las operaciones sensibles piden aprobación». La documentación vigente distingue el modo predeterminado **Auto**, en el que un clasificador revisa acciones y bloquea las que juzga inseguras, del modo **Manual**, donde la persona aprueba ediciones y comandos. Por tanto, «piden aprobación» no describe el modo predeterminado y puede inducir a esperar un aviso humano que no llegará.
  Consecuencia: una persona puede configurar o usar la herramienta con una expectativa de supervisión equivocada, precisamente en una ficha dedicada a mitigación de inyección.
  Corrección recomendada: separar los modos: «En Auto, un clasificador revisa las acciones de riesgo; en Manual, las operaciones sensibles piden aprobación explícita». Conservar la advertencia de que `curl`/`wget` no se autoaprueban y que ninguna protección vuelve inmune al sistema.

- [T045-M09-03] Severidad: media
  Ubicación: `content/courses/m09/lessons/m09-l6.md:22`.
  Evidencia: la fuente de revisión de PR explica cómo revisar y aprobar cambios, pero no establece que quien abre una PR «no puede aprobarla». La fuente sobre el agente en la nube sí describe una restricción específica: quien solicitó ese tipo de PR no puede aprobarla, dentro de esa configuración y sus reglas. La frase presenta ambas como una prohibición universal.
  Consecuencia: se confunde una política deseable del curso con una garantía de todas las plataformas y repositorios; el alumno podría suponer que la independencia está aplicada por la herramienta cuando depende de la configuración.
  Corrección recomendada: redactar la primera regla como política del equipo («en este flujo, quien abre una PR no la aprueba») y acotar la segunda: «en el agente en la nube documentado, quien lo solicitó no puede aprobar su PR». Si se quiere afirmar una restricción de plataforma, citar la documentación concreta de reglas de protección que la active.

## Comprobaciones sin hallazgo

- Las 18 preguntas `m09-l4-*`, `m09-l5-*` y `m09-l6-*` tienen una sola opción marcada correcta. Las claves y sus explicaciones corresponden a su `sectionRef`; los distractores remiten a los conceptos erróneos pertinentes.
- La mayor y la menor opción de cada ítem no alcanzan una razón de 1,5; no hay una pista sistemática de longitud. Los cuatro casos señalados por el ticket no repiten el escenario ni la decisión de `dx-b6-02`, `dx-b2-03`, `dx-b5-04` ni de M01–M08.
- Las inferencias están marcadas donde corresponde. En particular, la aplicación de la regla de dos a un análisis alterado se sostiene: la fuente excluye expresamente errores, alucinaciones y resultados de menor consecuencia como la desinformación de la respuesta.
- La cifra de FinanceBench (81 % en la muestra de 150 casos revisados a mano), el 42 % a casi 95 % y el ejemplo `96.12`/`96.124991…`, los 12 mecanismos superados con más de 90 % en la mayoría, el coste de utilidad de CaMeL (77 % frente a 84 %) y la saturación de aproximadamente 30 % a más de 80 % coinciden con las fuentes citadas.
- L4, L5 y L6 tienen respectivamente 1.949, 2.009 y 1.692 palabras; con sus actividades siguen holgadamente dentro de 25 minutos. No aparecen nombres de productos en el cuerpo de las lecciones. No se enseñan técnicas de ataque ni los seis patrones por nombre; las estadísticas de ataque no se convierten en respuesta de examen y ninguna capa se presenta como infalible.
- `m09-pc-owasp-lists` y `m09-pc-review-tools` coinciden con las páginas consultadas. No observé cambios materiales desde sus verificaciones del 2026-10-26. Para `m09-pc-injection-protections`, el cambio de redacción de T045-M09-02 es necesario por la documentación vigente de permisos.

## Fuentes abiertas y resultado

| Fuente abierta | Resultado de la comprobación |
| --- | --- |
| [OWASP LLM09](https://genai.owasp.org/llmrisk/llm092025-misinformation/) | Respalda la distinción entre alucinación, confianza excesiva y validación/contraste de salidas. |
| [Why Language Models Hallucinate](https://arxiv.org/abs/2509.04664) | Respalda que los incentivos de evaluación pueden premiar adivinar sobre reconocer incertidumbre. |
| [PAL](https://arxiv.org/abs/2211.10435) | Respalda delegar la solución aritmética en un intérprete; no se amplía a una garantía general. |
| [FinanceBench](https://arxiv.org/abs/2311.11944) | Respalda el 81 % para GPT-4-Turbo con recuperación en la muestra de 150 casos. |
| [Hypothesis](https://hypothesis.readthedocs.io/en/latest/) | Respalda pruebas basadas en propiedades con entradas, incluso casos límite, generadas automáticamente. |
| [Python: coma flotante](https://docs.python.org/3/tutorial/floatingpoint.html) | Respalda la aproximación binaria y el uso de `decimal` cuando se necesita representación decimal exacta. |
| [Evals de agentes](https://www.anthropic.com/research/demystifying-evals-for-ai-agents) | Respalda resultado frente a transcripción, varios ensayos, graders y los ejemplos de mejora/saturación. |
| [Verifiability in Generative Search](https://arxiv.org/abs/2304.09848) | Respalda separar que una cita exista de que sostenga la afirmación asociada. |
| [Walters y Wilder](https://pubmed.ncbi.nlm.nih.gov/37679503/) | Respalda que las referencias fabricadas y los errores de cita eran frecuentes en la medición de 2023. |
| [OWASP LLM01](https://genai.owasp.org/llmrisk/llm01-prompt-injection/) | Respalda inyección directa/indirecta, los daños descritos, mitigaciones en capas y ausencia de prevención infalible. |
| [NCSC: prompt injection](https://www.ncsc.gov.uk/blog-post/prompt-injection-is-not-sql-injection) | Respalda que no hay frontera inherente entre datos e instrucciones y que queda riesgo residual; también propone registro. |
| [The Attacker Moves Second](https://arxiv.org/abs/2510.09023) | Respalda 12 defensas y éxito superior a 90 % en la mayoría bajo ataques adaptativos. |
| [Defensas de Anthropic](https://www.anthropic.com/research/prompt-injection-defenses) | Respalda progreso medido, pero también que un 1 % sigue siendo riesgo y no hay inmunidad. |
| [OWASP LLM05](https://genai.owasp.org/llmrisk/llm052025-improper-output-handling/) | Respalda tratar la salida del modelo como no confiable y validarla antes de pasarla a otros sistemas. |
| [OWASP LLM06](https://genai.owasp.org/llmrisk/llm062025-excessive-agency/) | Respalda minimizar herramientas, permisos y autonomía, con autorizaciones en el sistema receptor. |
| [Design Patterns for Securing LLM Agents](https://arxiv.org/abs/2506.08837) | Respalda restringir el flujo de acciones después de contenido no confiable; no afirma protección universal. |
| [CaMeL](https://arxiv.org/abs/2503.18813) | Respalda el intercambio de utilidad: 77 % con garantías frente a 84 % sin defensa en AgentDojo. |
| [Agents Rule of Two](https://ai.meta.com/blog/practical-ai-agent-security) | Respalda A/B/C y sus límites; origina T045-M09-01 por su definición explícita de «change state». |
| [GitHub: revisión de PR](https://docs.github.com/en/pull-requests/how-tos/review-pull-requests/reviewing-proposed-changes-in-a-pull-request) | Respalda el proceso de revisión, no la prohibición universal de autoaprobar; origina T045-M09-03. |
| [GitHub: riesgos del agente en la nube](https://docs.github.com/en/copilot/concepts/security-governance-and-network-settings/risks-and-mitigations) | Respalda la restricción de aprobación para PR de ese agente y sus mitigaciones específicas. |
| [Claude Code: prácticas](https://code.claude.com/docs/en/best-practices) | Respalda separar indicaciones no deterministas de controles aplicados y revisar contra requisitos. |
| [Google MLCC: conjuntos](https://developers.google.com/machine-learning/crash-course/overfitting/dividing-datasets) | Respalda conjuntos reservados y que se desgasten si se ajusta repetidamente contra ellos. |
| [Autocorrección](https://arxiv.org/abs/2310.01798) | Respalda que, sin señal externa, la autocorrección no mejora de forma fiable y puede empeorar. |
| [Autopreferencia](https://arxiv.org/abs/2404.13076) | Respalda que los jueces favorecen sus propias generaciones. |
| [Errores correlacionados](https://arxiv.org/abs/2502.04313) | Respalda que modelos capaces comparten más errores y sesgan jueces similares. |
| [Complacencia](https://arxiv.org/abs/2310.13548) | Respalda la tendencia de asistentes a preferir respuestas alineadas con las creencias del usuario. |
| [NIST AI 600-1](https://doi.org/10.6028/NIST.AI.600-1) | Respalda riesgos de sobreconfianza y automatización; es un perfil voluntario, no una norma obligatoria. |
| [GitHub Copilot code review](https://docs.github.com/en/copilot/concepts/agent-capabilities/agent-powered-workflows-and-operations/code-review) | Respalda que un revisor automático ayuda a identificar problemas; no equivale a garantía exhaustiva. |
| [Guía del agente en la nube](https://docs.github.com/en/copilot/tutorials/cloud-agent/get-the-best-results) | Respalda que tareas sensibles o de criterio de negocio requieren juicio humano. |
| [OpenAI: prácticas de evaluación](https://developers.openai.com/api/docs/guides/evaluation-best-practices) | Respalda ejecutar evals con cada cambio y ampliar el conjunto con nuevos casos. |
| [Keep a Changelog](https://keepachangelog.com/en/1.1.0/) | Respalda registro cronológico, legible para personas, por versión y no un volcado de Git. |
| [Seguridad de Claude Code](https://code.claude.com/docs/en/security) | Respalda controles de red y permisos; muestra que Auto usa un clasificador y Manual pide autorización, lo que origina T045-M09-02. |
| [Seguridad de Codex](https://learn.chatgpt.com/docs/agent-approvals-security) | Respalda red desactivada por defecto en `workspace-write`, búsqueda no confiable y `approvals_reviewer = "auto_review"`. |
| [OWASP Top 10 LLM 2025](https://genai.owasp.org/llm-top-10/) | Confirma la lista LLM01–LLM10 de 2025 como la publicada actualmente. |
| [OWASP Top 10 Agentic 2026](https://genai.owasp.org/resource/owasp-top-10-for-agentic-applications-for-2026/) | Confirma publicación del 2025-12-09 y su alcance de guía para aplicaciones agénticas. |

Verificado: revisión estática de las tres lecciones, las 18 preguntas, los 28 conceptos y las tres fichas; contraste de cada fuente citada y de las fuentes de fichas. No se modificó `src/`, `content/`, `e2e/` ni `ESTADO.md`.

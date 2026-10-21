# Revisión del currículo M01–M10 frente al estado del arte (octubre de 2026)

**Archivo:** `investigacion/curriculo-estado-del-arte.md`
**Fecha de corte:** 2026-10-21
**Alcance:** secciones 2, 4, 5 y 11 de `plan.md` v1.1, contrastadas con currículos de referencia y documentación oficial de Claude Code, Codex, GitHub Copilot, MCP, AGENTS.md y Agent Skills.
**Convenciones:** cada afirmación técnica cita un ID del registro de fuentes (sección 5). Lo que es juicio propio aparece como **Recomendación**. Lo que se deduce sin confirmación directa va marcado **[inferencia]**. Producto y entorno se indican entre paréntesis: chat, API, CLI, IDE, desktop o cloud.

---

## 1. Resumen ejecutivo

El currículo está bien orientado (decisiones, evidencia, separar cálculo determinista de narrativa). Pero no recoge el arnés configurable, la ejecución en la nube o en segundo plano ni la economía por tokens. Los cinco cambios que más recomiendo:

1. **Verificación ejecutable desde M02/M05:** cada tarea delegada lleva un check que el agente pueda correr y exige evidencia; *spec-driven development* explícito en M02 (src-anthropic-cc-best-practices, src-dlai-sdd).
2. **M03 como ingeniería de contexto real:** contexto como presupuesto, precedencia AGENTS.md / CLAUDE.md / `copilot-instructions.md` y **Agent Skills** con laboratorio. El RAG pasa a M07 (src-anthropic-eng-context, src-agentskills-site).
3. **Seguridad desde M05:** modos de permiso, sandbox y red en M05; *prompt injection* indirecta y guardrails con hooks en M09 (src-owasp-llm01).
4. **M08 con la autonomía actual:** subagentes, worktrees, agentes en la nube, tareas programadas, modo headless y costo en tokens (src-anthropic-cc-agents-parallel).
5. **M09 a evals de agentes, M10 a mantenimiento:** graders, pass@k frente a pass^k, regresión; cambiar offline/PWA por mantenimiento de instrucciones y skills (src-anthropic-eng-evals).

---

## 2. Análisis por manual

### 2.0 Panorama de referencia y temas emergentes 2025–2026

**Qué cubren los currículos de referencia consultados**

| Proveedor | Qué cubre (resumen verificado) | Relevancia para Daniel | Fuente |
| --- | --- | --- | --- |
| Anthropic Academy | Hay cursos específicos de *Agent Skills*, *Subagents*, MCP (intro y avanzado), *Claude Code 101* y *Claude Code in Action*. Este último cubre dirigir sesiones largas, un CLAUDE.md que se cumpla, skills de verificación, modos de permiso, hooks, rutinas y modo headless, GitHub Actions y code review, verificar ejecuciones no supervisadas y plugins. *AI Fluency for Builders* cubre el marco 4D (Delegation, Description, Discernment, Diligence) aplicado a construir. | Muy alta: coincide con dirigir agentes y rendir cuentas de lo construido | src-anthropic-academy, src-anthropic-academy-cc-action, src-anthropic-academy-builders |
| OpenAI Academy | Cuatro tracks: Apply AI at Work, Build with AI (Codex en todo el ciclo de desarrollo + API), Lead y Teach. Codex Bootcamp 101 (agentic coding), 201 (flujos de equipo) y 301 (automatización avanzada) se dieron en septiembre y octubre de 2026. El API Builder Bootcamp cubre Agents, RAG, Production & Optimization, Foundations y Realtime. | Alta (Codex). No se encontró un curso específico de evals | src-openai-academy, src-openai-academy-builders |
| DeepLearning.AI | Cursos cortos: *Spec-Driven Development with Coding Agents* (JetBrains), *Agent Skills with Anthropic*, un curso de Claude Code (Anthropic), *Context Engineering* (Chroma), *Evaluating AI Agents* (Arize), *AI Code Review* (Qodo), *AI Coding Workflows: From Cloud to Local* y *Agentic AI*. | Alta en SDD, skills, contexto y evals | src-dlai-courses, src-dlai-sdd, src-dlai-agent-skills |
| Google / Kaggle | El *5-Day AI Agents Intensive* (15–19 de junio de 2026) se centró en "vibe coding", con agentes, herramientas, APIs y proyecto final. El temario día por día solo aparece en fuentes secundarias (ver Huecos). | Media | src-google-kaggle-intensive |
| GitHub / Microsoft | La ruta de Learn *GitHub Copilot Fundamentals Part 1* cubre IA responsable, prompt engineering, Copilot Spaces, Copilot en varios entornos (incluida la Copilot app), gestión y personalización, y pruebas unitarias. Un plan de formación de formadores alojado por Microsoft añade cloud agent, MCP, custom agents, agent skills y marcos de especificación como Spec Kit. | Alta (Copilot) | src-microsoft-learn-copilot, src-microsoft-ghcp-curriculum |
| Hugging Face | El *Agents Course* cubre fundamentos (ciclo pensamiento-acción-observación, herramientas), frameworks (smolagents, LangGraph, LlamaIndex), casos de uso y un proyecto final. Las unidades extra cubren *function calling*, observabilidad y evaluación. | Media-baja: está orientado a construir agentes, no a dirigir agentes de código. Útil para M08 y M09 | src-hf-agents-course |

**Temas emergentes y dónde deberían vivir**

| Tema | Estado verificado (producto/entorno) | Manual recomendado |
| --- | --- | --- |
| Context engineering | Anthropic lo define como curar todo lo que ocupa el contexto: instrucciones, herramientas, datos e historial. El contexto rinde menos a medida que se llena (*context rot*) (src-anthropic-eng-context). Claude Code (CLI) hace de esto su restricción central (src-anthropic-cc-best-practices). | M03 (principal), M05 |
| Agent Skills | Es un formato abierto, desarrollado originalmente por Anthropic (src-agentskills-site). Lo usan Claude Code (CLI/desktop/IDE/cloud), Codex (CLI, IDE, ChatGPT desktop app) y Copilot (cloud agent, CLI, modo agente en IDE) (src-anthropic-cc-skills, src-openai-codex-skills, src-github-agent-skills). | M03 |
| MCP | La especificación vigente es la 2026-07-28 (src-mcp-versioning). Lo gobierna la Agentic AI Foundation (Linux Foundation) desde el 9 de diciembre de 2025 (src-lf-aaif). | M07 |
| Subagentes y paralelismo | En Claude Code (CLI) los subagentes corren en segundo plano por defecto, se anidan hasta tres niveles y pueden aislarse en un worktree (src-anthropic-cc-subagents). En Codex vienen activados y los agentes propios se definen en TOML (src-openai-codex-subagents). | M08 |
| Agentes en la nube / segundo plano | Claude Code cloud sessions (web, desktop, móvil, `claude --cloud`) (src-anthropic-cc-cloud). Codex Cloud se usa desde ChatGPT (src-openai-codex-cloud). Copilot cloud agent trabaja en GitHub.com y entrega PRs (src-github-cloud-agent). | M05 (uso), M08 (diseño) |
| Browser / computer use | Claude in Chrome alcanzó disponibilidad general la semana del 29 de junio de 2026. Computer use existe en la CLI de Claude Code (macOS) (src-anthropic-cc-llms-index). Codex Computer Use funciona en la ChatGPT desktop app (macOS/Windows) (src-openai-codex-computer-use). | M05 (verificación visual), M09 (riesgo) |
| Evals de agentes | Tareas, intentos, transcripts, graders de código, modelo o humano, pass@k frente a pass^k, y evals de capacidad frente a regresión (src-anthropic-eng-evals, src-openai-evals). | M09 |
| Prompt injection y guardrails | No hay prevención infalible conocida (src-owasp-llm01). Existe un OWASP Top 10 para aplicaciones agénticas, de diciembre de 2025 (src-owasp-agentic). Hay controles por producto (src-anthropic-cc-security, src-openai-codex-security, src-github-cloud-agent-risks). | M05 (modos), M07 (permisos), M09 (modelo de amenazas) |
| Costos y tokens | Copilot factura por tokens con AI Credits desde el 1 de junio de 2026 (src-github-blog-ubb). Codex funciona con ventanas de uso y créditos, y la API se cobra aparte (src-openai-codex-pricing). En Claude Code, `/usage` atribuye el consumo y los equipos de agentes consumen unas 7 veces más (src-anthropic-cc-costs). | M01, M05, M08 |
| Razonamiento y esfuerzo | Codex recomienda elegir el esfuerzo de razonamiento por tarea (src-openai-codex-best-practices). Claude Code tiene `/effort` (src-anthropic-cc-costs). Copilot CLI tiene niveles de razonamiento configurables (src-github-copilot-cli). | M01 |
| Spec-driven development | Curso de DLAI/JetBrains (src-dlai-sdd), GitHub Spec Kit (src-github-spec-kit) y el patrón "entrevístame → SPEC.md → sesión nueva" de Claude Code (src-anthropic-cc-best-practices). | M02 |
| Hooks y automatización del arnés | Los hooks de Claude Code son deterministas, a diferencia de CLAUDE.md, que solo orienta (src-anthropic-cc-features). Codex tiene hooks en `hooks.json`/`config.toml` (src-openai-codex-hooks). Copilot tiene hooks en el cloud agent y la CLI (src-github-cloud-agent, src-github-copilot-cli). Las tareas programadas existen en los tres productos. | M08 (automatización), M09 (control) |

### 2.1 Solapamientos y reparto propuesto

| Tema repetido | Dónde aparece hoy | Reparto recomendado |
| --- | --- | --- |
| RAG | M03.5, M07.5 | **M07** se queda con la recuperación conectada (RAG documental frente a consulta estructurada SQL/MCP). **M03** conserva solo "fuentes, citas y recuperación justo a tiempo" como estrategia de contexto. La evaluación de RAG pasa a **M09**. |
| Evaluación | M02.6, M09 | **M02**: criterios de aceptación dentro de la spec. **M09**: conjuntos de casos, comparación de versiones de prompts y regresión. Se elimina "comparación de prompts" de M02.6. |
| Revisión de cambios | M04.6, M05.3, M08.5, M09.6 | **M04**: lista de comprobación para leer un diff. **M05**: revisión dentro del ciclo con el agente (incluidos `/review` y code review automatizado). **M09**: revisión independiente, límites de la segunda opinión y regresión. **M08.5** desaparece. |
| Seguridad | M07.2, M09.5 | **M05** (nuevo): modos de permiso, sandbox y red. **M07**: secretos, alcances OAuth y mínimo privilegio de conectores. **M09**: modelo de amenazas (prompt injection directa e indirecta) y guardrails deterministas. |
| Costos | M01.5, M08.6 | **M01**: modelo económico (suscripción, API, créditos, esfuerzo). **M05**: leer el consumo real de una sesión. **M08**: costo de paralelizar y de los multiagentes. |
| Continuidad entre sesiones | M03.4, M05.6 | **M03**: el artefacto de traspaso (documento de continuidad, decisiones). **M05.6**: la práctica de traspaso entre herramientas usando ese artefacto. |
| Pruebas | M05.5, M09.1 | **M05**: tests como bucle de verificación que el agente ejecuta. **M09**: diferencia entre tests y evals de respuestas. |
| Planes y contratos | M02.5, M03.3, M06 | **M02**: spec y plan de una tarea. **M03**: dónde vive el conocimiento duradero (instrucciones, decisiones, skills). **M06**: contratos de datos. |
| Git y worktrees | M04.4, M08 y plan §10 | **M04**: Git básico, incluidos ramas, worktrees y diferencia entre checkpoint y commit. **M08**: uso de worktrees para paralelizar. |

### 2.2 M01 — Herramientas, modelos y límites de la IA

- **Falta**
  - **La superficie como eje de decisión.** Un mismo producto ofrece capacidades distintas según dónde se use:
    - Codex: ChatGPT desktop app, web, móvil, CLI, extensión IDE, Codex Cloud (src-openai-codex-docs).
    - Claude Code: CLI, Desktop, VS Code, JetBrains, web/cloud, móvil (src-anthropic-cc-llms-index).
    - Copilot: modo agente en IDE, CLI, cloud agent, code review, Copilot app (src-github-agent-skills).
  - **Razonamiento y esfuerzo** como palanca de calidad, latencia y costo (src-openai-codex-best-practices, src-anthropic-cc-costs, src-github-copilot-cli).
  - **Modelo económico real.**
    - Suscripción con ventanas de uso frente a API por token (src-openai-codex-pricing, src-anthropic-cc-costs).
    - Créditos por token en Copilot desde el 1 de junio de 2026 (src-github-blog-ubb).
    - Multiplicadores poco visibles: subagentes (src-anthropic-cc-subagents), generación de imágenes en Codex (3–5 veces, src-openai-codex-imagegen), equipos de agentes en Claude Code (unas 7 veces, src-anthropic-cc-costs).
  - **Local frente a nube** como decisión de datos: VM gestionada, red limitada por defecto (src-anthropic-cc-cloud). Solo como introducción; el detalle va a M09.
- **Sobra:** la amplitud de "imagen y audio" en L2. **Recomendación:** reducirla a una sección, porque es poco relevante para herramientas financieras. L6 ("comparar herramientas con rúbrica") debe quedarse en una versión sencilla; la metodología de rúbricas está en M09.
- **Mover:** la profundización de L3 (contexto) a M03. Las técnicas de verificación de L4 (alucinaciones) a M09; M01 solo motiva el tema.
- **Duradero:** la distinción entre modelo, producto, herramienta, agente y entorno; el razonamiento bajo incertidumbre; los criterios de calidad, costo, latencia y privacidad; el método de comparar con una tarea fija.
- **Volátil:** nombres de modelos, precios, límites, superficies y estados beta.
- **Revisión sugerida:** **trimestral**. **Recomendación:** separar lo volátil en "fichas de producto" fechadas, con una tabla por superficie.

### 2.3 M02 — Prompting avanzado y especificaciones

- **Falta**
  - **Spec-driven development explícito:** principios del proyecto (la "constitución"), spec por funcionalidad, plan, tareas, implementación y validación, con replanificación entre funcionalidades (src-dlai-sdd, src-github-spec-kit).
  - **La spec autocontenida.** Nombra archivos e interfaces, declara qué queda fuera de alcance y termina con una verificación de extremo a extremo (src-anthropic-cc-best-practices). Codex pide además una condición "done when" (src-openai-codex-best-practices).
  - **El agente que entrevista al usuario** para completar la spec antes de implementar. Existe en Claude Code (CLI) y en el *Plan mode* de Codex (src-anthropic-cc-best-practices, src-openai-codex-best-practices).
  - **Contratos de salida con JSON Schema** para cifras y estructuras, en lugar de texto libre [inferencia: el Agent SDK documenta *structured outputs* (src-anthropic-cc-llms-index), pero su uso en el currículo es una recomendación].
- **Sobra:** "Ejemplos y contraejemplos" como lección propia puede fusionarse con L4 (formatos).
- **Mover:** L6, en su parte de "comparación de prompts", a M09. Los criterios de aceptación se quedan aquí.
- **Solapamientos:** con M03.3 (planes y decisiones), según el reparto de 2.1.
- **Duradero:** alto (objetivo, contexto, restricciones, aceptación, descomposición).
- **Volátil:** comandos de cada herramienta (`/plan`, Shift+Tab, comandos de Spec Kit).
- **Revisión sugerida:** **anual**, con una comprobación **semestral** de las herramientas SDD.
- **Nota para el piloto M02:** el piloto es el que fija el estándar. **Recomendación:** que su práctica ("petición de dashboard → spec verificable") termine con un check ejecutable, por ejemplo un script que reconcilie totales con datos sintéticos.

### 2.4 M03 — Ingeniería de contexto y conocimiento

- **Falta**
  - **El contexto como recurso finito.** El rendimiento cae a medida que se llena. Las herramientas son `/clear`, `/compact` con instrucciones, *rewind*, subagentes para aislar exploración y recuperación justo a tiempo (src-anthropic-eng-context, src-anthropic-cc-best-practices). Las definiciones de herramientas MCP también ocupan contexto (src-anthropic-cc-features).
  - **Capa de instrucciones y precedencia, por producto:**
    - **Codex (CLI):** concatena desde la raíz hasta el directorio actual y el archivo más cercano tiene más peso. Respeta `AGENTS.override.md`. El total combinado tiene un límite de 32 KiB por defecto (src-openai-codex-agentsmd).
    - **Claude Code:** lee `AGENTS.md` de forma nativa desde la v2.1.277, pero **solo si no hay CLAUDE.md** en el directorio de trabajo o por encima. Si hay CLAUDE.md, la vía documentada es importarlo con `@AGENTS.md` (src-anthropic-cc-memory). Recomienda mantener CLAUDE.md por debajo de 200 líneas y tiene `.claude/rules/` con alcance por rutas (src-anthropic-cc-features).
    - **Copilot (GitHub.com, cloud agent, code review):** lee `.github/copilot-instructions.md`, `.github/instructions/*.instructions.md` con `applyTo`, y `AGENTS.md` en cualquier carpeta (gana el más cercano). Como alternativa, acepta un CLAUDE.md o GEMINI.md en la raíz (src-github-copilot-instructions).
    - **VS Code (modo agente de Copilot):** recomienda AGENTS.md. CLAUDE.md no es un formato del arnés de Copilot (src-microsoft-vscode-instructions).
  - **Memoria automática** (Claude Code: notas que escribe el propio agente, cargadas hasta 200 líneas o 25 KB) frente a instrucciones escritas por el usuario (src-anthropic-cc-memory).
  - **Agent Skills a fondo.**
    - Estructura `SKILL.md` + `scripts/`/`references/`/`assets/`; la descripción decide cuándo se activa; carga progresiva (src-agentskills-site).
    - Invocación manual para skills con efectos secundarios (`disable-model-invocation`, src-anthropic-cc-skills).
    - **Portabilidad de rutas:** Codex lee `.agents/skills` (src-openai-codex-skills). Claude Code documenta `.claude/skills`, no `.agents/skills` (src-anthropic-cc-skills). Copilot lee `.github/skills`, `.claude/skills` y `.agents/skills` (src-github-agent-skills).
  - **Cuándo usar cada pieza:** instrucción permanente, regla por rutas, skill, subagente, hook o MCP (src-anthropic-cc-features).
- **Sobra:** L5 (RAG), que pasa a M07.
- **Mover:** los contratos de datos de L3 a M06.
- **Duradero:** contexto mínimo con mucha señal; separar lo que se carga siempre de lo que se carga bajo demanda; documentos de traspaso; tratar las instrucciones como código (podar y probar).
- **Volátil:** nombres de archivo, reglas de precedencia, límites de tamaño, versiones mínimas y rutas de skills.
- **Revisión sugerida:** **trimestral** para las tablas por producto; **anual** para los principios.
- **Práctica recomendada:** crear un paquete de contexto que tenga a) un AGENTS.md breve, b) una skill portable con su descripción probada y c) un documento de continuidad. Comprobar en dos herramientas que se cargan, por ejemplo con `/context` en Claude Code (src-anthropic-cc-memory).

### 2.5 M04 — Código, Git y entornos para dirigir agentes

- **Falta**
  - **Lectura de configuración** (JSON, TOML, YAML en el frontmatter, Markdown), porque el arnés se configura así: `settings.json` y frontmatter de skills y subagentes en Claude Code (src-anthropic-cc-subagents); `config.toml` y agentes en TOML en Codex (src-openai-codex-subagents).
  - **Worktrees** para trabajo en paralelo (src-anthropic-cc-agents-parallel).
  - **Checkpoints frente a Git.** Los checkpoints de Claude Code no capturan cambios hechos por Bash y no sustituyen a Git (src-anthropic-cc-best-practices).
  - **La PR como unidad de revisión.** Los agentes en la nube entregan ramas y PRs, a veces en borrador (src-github-cloud-agent-risks).
  - **Leer checks de CI** e higiene de `.gitignore` y secretos (adelanto de M07).
- **Sobra:** reconocer cuatro lenguajes en el mismo nivel. **Recomendación:** priorizar Python + SQL + JSON/TOML/YAML y dejar TS en nivel de reconocimiento.
- **Mover:** nada. L6 es la dueña de la lista de comprobación para leer un diff (ver 2.1).
- **Duradero:** alto (Git, lectura de código, logs).
- **Volátil:** bajo; solo interfaces de herramientas.
- **Revisión sugerida:** **anual**.

### 2.6 M05 — Desarrollo con Codex, Claude Code y Copilot

- **Falta**
  - **Modos de permiso y sandbox antes de dejar actuar al agente:**
    - **Claude Code:** auto mode es el modo inicial desde la v2.1.283 en terminal y VS Code; existen además manual, accept edits, plan y sandbox (src-anthropic-cc-security).
    - **Codex:** modos Ask for approval / Approve for me / Full access; sandbox `workspace-write`; red local desactivada por defecto (src-openai-codex-permissions, src-openai-codex-security).
    - **Copilot CLI:** `--allow-tool` / `--deny-tool` (src-github-copilot-cli).
  - **Bucle de verificación.** El agente recibe un check ejecutable y presenta evidencia, no afirmaciones. En Claude Code se puede blindar con `/goal` o un Stop hook (src-anthropic-cc-best-practices).
  - **Verificación visual de dashboards** con navegador: Claude in Chrome (src-anthropic-cc-llms-index) y Computer Use / navegador de Codex (src-openai-codex-computer-use).
  - **Local frente a nube.** Claude Code `--cloud`/`--teleport` (src-anthropic-cc-cloud). Codex Cloud (src-openai-codex-cloud). Copilot cloud agent, con PRs, sesiones de hasta 59 minutos y una rama por tarea (src-github-cloud-agent).
  - **Revisión asistida:** `/review` en Codex (src-openai-codex-best-practices), `/code-review` en Claude Code (src-anthropic-cc-best-practices), code review de Copilot (src-github-copilot-instructions).
  - **Gestión de sesión:** reanudar, bifurcar, y hacer `/clear` tras dos correcciones fallidas (src-anthropic-cc-best-practices; Codex `/resume`, `/fork`, `/compact` en src-openai-codex-best-practices).
  - **Leer el consumo de la sesión** (`/usage`, src-anthropic-cc-costs).
- **Sobra:** L1 ("abrir proyecto y verificar entorno") puede reducirse.
- **Mover:** la evaluación de respuestas a M09. L6 aplica el artefacto de continuidad de M03.
- **Duradero:** el ciclo explorar → planear → implementar → verificar; cambios pequeños; evidencia antes que aseveraciones; corregir pronto.
- **Volátil:** **muy alto**. Comandos, modos, versiones mínimas y nombres cambian: el "Copilot coding agent" ahora se llama *Copilot cloud agent* (src-github-cloud-agent) y la app de Codex es la *ChatGPT desktop app* (src-openai-codex-app).
- **Revisión sugerida:** **trimestral**, y una comprobación rápida antes de cada uso del manual. **Recomendación:** tabla de capacidades por superficie, fechada, en un archivo aparte.

### 2.7 M06 — Datos y arquitectura de herramientas analíticas

- **Falta**
  - **Cómo toca los datos un agente hoy.** Databricks ofrece servidores MCP gestionados: Genie One (GA) y Databricks SQL (Beta de Unity Gateway), con los permisos del usuario que llama vía Unity Catalog. Documenta clientes como Claude Code, Codex y Cursor. Copilot no aparece (src-databricks-managed-mcp).
  - **Riesgo de lectura frente a escritura** cuando el agente puede ejecutar SQL [inferencia: la doc dice que DBSQL usa los permisos del llamador, así que una cuenta con permisos de escritura habilita escrituras].
  - **La reconciliación como check que el agente ejecuta** (enlace con M05 y M09).
  - **Generar datos sintéticos** para los laboratorios.
- **Sobra:** "Escalabilidad" (L6) puede aligerarse.
- **Mover:** aquí llegan los contratos de datos que venían de M03.3.
- **Duradero:** alto (dónde se ejecuta cada operación, esquema, llaves, determinismo, trazabilidad).
- **Volátil:** estado y endpoints de los MCP de Databricks.
- **Revisión sugerida:** **anual**, y **semestral** para la nota sobre MCP/Databricks.

### 2.8 M07 — APIs, MCP, conectores e integraciones

- **Falta**
  - **MCP concreto:** servidor y cliente, transportes stdio y Streamable HTTP con OAuth (src-openai-codex-best-practices), y configuración en cada producto: `claude mcp add` y `.mcp.json` (src-anthropic-cc-security), `codex mcp add` (src-openai-codex-best-practices), MCP del repositorio para el cloud agent de Copilot (src-github-cloud-agent).
  - **Versión y gobierno:** especificación vigente 2026-07-28, con negociación por petición y `server/discover`; las revisiones hasta 2025-11-25 usaban handshake (src-mcp-versioning). Gobierno en la AAIF (src-lf-aaif).
  - **Confianza en servidores.** Anthropic revisa los conectores del directorio, pero no audita la seguridad de ningún servidor MCP (src-anthropic-cc-security).
  - **CLI frente a MCP por eficiencia de contexto** (src-anthropic-cc-costs).
  - **Patrón skill + MCP:** el MCP da la conexión y la skill enseña a usarla (src-anthropic-cc-features).
  - **Conectores en ejecuciones desatendidas.** En las tareas programadas de Claude Code (cloud), los conectores incluidos pueden escribir sin pedir permiso (src-anthropic-cc-routines). Es el argumento central para el mínimo privilegio.
- **Sobra:** nada. L5 pasa a ser "Recuperación conectada: RAG documental frente a consulta estructurada (SQL/MCP)".
- **Mover:** la *prompt injection* que entra por el contenido de los conectores va a M09, con referencia cruzada.
- **Duradero:** HTTP, autenticación, idempotencia, reintentos, simulación antes del servicio real, mínimo privilegio.
- **Volátil:** revisión de la especificación MCP, comandos de configuración y catálogos de conectores.
- **Revisión sugerida:** **semestral** y con cada nueva revisión de la especificación MCP.

### 2.9 M08 — Agentes, automatización y equipos

- **Falta**
  - **Patrones de flujo** (encadenamiento, enrutamiento, paralelización, orquestador-trabajadores, evaluador-optimizador) y el principio de empezar simple (src-anthropic-eng-agents).
  - **Modalidades actuales:**
    - **Claude Code:** subagentes con contexto aislado (src-anthropic-cc-subagents); agent view (*research preview*), agent teams (experimental), projects (beta pública) y dynamic workflows (src-anthropic-cc-agents-parallel).
    - **Codex:** subagentes que no pueden saltarse el sandbox del padre (src-openai-codex-subagents).
  - **Agentes en la nube o en segundo plano** que entregan PRs (ver M05) y **tareas programadas**:
    - Codex: scheduled tasks en la desktop app (src-openai-codex-best-practices).
    - Claude Code: tareas programadas en la nube (*research preview*), además de las del Desktop y `/loop` (src-anthropic-cc-routines).
    - Copilot: automatizaciones del cloud agent (src-github-cloud-agent).
  - **Modo headless** para scripts y CI: `claude -p` (src-anthropic-cc-best-practices), `copilot -p` (src-github-copilot-cli).
  - **Hooks como automatización del arnés:** en Claude Code (src-anthropic-cc-features) y en Codex, donde la propia doc advierte que son "a useful guardrail, not a complete enforcement boundary" (src-openai-codex-hooks).
  - **Verificar en proporción a lo que no se supervisó** (src-anthropic-academy-cc-action).
  - **Costo:** los tokens se multiplican al paralelizar (src-anthropic-cc-costs, src-openai-codex-subagents).
- **Sobra:** L5 ("Revisión adversarial"), que pasa a M09. **Recomendación:** sustituirla por "Delegación asíncrona: nube, segundo plano y programación".
- **Duradero:** flujo frente a agente; condiciones de término; contratos de delegación; patrones; "más agentes no es más calidad".
- **Volátil:** alto (estados *preview* y experimentales).
- **Revisión sugerida:** **trimestral**.

### 2.10 M09 — Evaluación, confiabilidad y control

- **Falta**
  - **Vocabulario de evals de agentes:** tarea, intento, transcript, resultado y grader; pass@k frente a pass^k; capacidad frente a regresión; saturación. La recomendación es empezar con 20–50 tareas sacadas de fallos reales (src-anthropic-eng-evals).
  - **LLM como juez**, calibrado contra humanos, con control de sesgos de posición y longitud (src-openai-evals).
  - **Prompt injection directa e indirecta** sin prevención infalible (src-owasp-llm01), más los riesgos agénticos (src-owasp-agentic).
  - **Guardrails por producto:**
    - Claude Code: diálogo de confianza del espacio de trabajo y aprobación de comandos de red (src-anthropic-cc-security); el texto que llega por API a una tarea programada se marca como no confiable (src-anthropic-cc-routines).
    - Codex: red desactivada por defecto y búsqueda web en índice cacheado (src-openai-codex-security).
    - Copilot cloud agent: filtra caracteres ocultos, entrega PRs en borrador y exige aprobar los workflows (src-github-cloud-agent-risks).
  - **Guardrails deterministas:** un `PreToolUse` que bloquea una acción es un control real; una instrucción en CLAUDE.md es solo una petición (src-anthropic-cc-features).
  - **Graders de código para finanzas:** invariantes, totales y reconciliación [inferencia: aplicación al dominio de los graders de código descritos en src-anthropic-eng-evals].
  - **Observabilidad y trazas** (src-hf-agents-course).
- **Sobra:** nada.
- **Mover:** aquí llegan "comparación de prompts" (de M02.6) y "revisión adversarial" (de M08.5). Los fundamentos de permisos se adelantan a M05 y M07.
- **Duradero:** metodología de evals, rúbricas, independencia, modelo de amenazas.
- **Volátil:** versiones de las listas OWASP y plataformas de evals. La plataforma OpenAI Evals pasa a solo lectura el 31 de octubre de 2026 y cierra el 30 de noviembre de 2026 (src-openai-evals).
- **Revisión sugerida:** **semestral**.

### 2.11 M10 — De prototipo a producto: proyecto integrador

- **Falta**
  - **Mantenimiento de herramientas construidas con IA:** podar y actualizar instrucciones y skills, tratándolas como código (src-anthropic-cc-best-practices); suite de regresión que se ejecuta con cada cambio (src-anthropic-eng-evals); calendario de revisión para dependencias volátiles (modelos, conectores).
  - **Responsabilidad sobre lo entregado** ("Diligence" y "stand behind what you build", src-anthropic-academy-builders).
  - **Despliegue de herramientas analíticas.** Si se considera Codex Sites (ChatGPT/Codex), la doc admite HTTP/HTTPS/WebSockets pero no documenta service workers ni el hosting estático de una PWA; hay que comprobarlo en la Fase 0 (src-openai-codex-sites).
- **Sobra:** L4 ("Distribución, offline y actualización") está atada a la PWA de este proyecto. **Recomendación:** generalizarla a "Despliegue, actualización y continuidad" y dejar offline como opcional.
- **Mover:** nada.
- **Duradero:** alto.
- **Volátil:** plataformas de hosting.
- **Revisión sugerida:** **anual**.

---

## 3. Mapa de competencias candidato

Todas las conductas se diseñaron para medirse con escenarios de decisión, sin preguntas de memoria sobre productos.

| ID | Competencia | Definición (una línea) | Manuales (principal; apoyo) | Conductas observables en un diagnóstico de escenario |
| --- | --- | --- | --- | --- |
| C01 | Selección de herramienta, superficie y modelo | Elige producto, superficie (chat, CLI, IDE, cloud), modelo y esfuerzo según la tarea, los datos, el costo y la verificabilidad. | M01; M05, M08 | 1) Ante un caso con datos sensibles, elige entre ejecución local y en la nube y lo justifica. 2) Distingue cuándo una capacidad debe verificarse por producto y entorno antes de asumirla. 3) Reconoce un diseño que multiplica el consumo (paralelo, imágenes, esfuerzo máximo) y propone una alternativa suficiente. |
| C02 | Especificación ejecutable | Convierte una intención ambigua en una spec autocontenida con alcance, exclusiones, criterios de aceptación y un paso de verificación de extremo a extremo. | M02; M10 | 1) Reescribe una petición vaga añadiendo qué queda fuera y una condición de "terminado" comprobable. 2) Detecta criterios de aceptación no verificables. 3) Decide cuándo pedir al agente que lo entreviste antes de planificar. |
| C03 | Gestión del contexto | Decide qué entra al contexto, cuándo limpiar o compactar, cuándo aislar en un subagente y cuándo recuperar información justo a tiempo. | M03; M05, M08 | 1) Ante síntomas de deriva en una sesión larga, elige entre `/clear` con mejor prompt, compactación dirigida o subagente, y explica por qué. 2) Poda un archivo de instrucciones quitando lo deducible del código. 3) Prepara un paquete mínimo de contexto para otro agente. |
| C04 | Configuración portable del agente | Mantiene instrucciones, reglas y skills coherentes entre herramientas y decide qué va en cada capa. | M03; M05, M10 | 1) Clasifica reglas entre "siempre cargada", "skill bajo demanda" y "control determinista". 2) Detecta un conflicto de precedencia (un CLAUDE.md que impide leer AGENTS.md). 3) Escribe la descripción de una skill que se activa en los casos correctos y no en los incorrectos. |
| C05 | Revisión de cambios | Lee un diff, identifica riesgo y cambios fuera de alcance, y exige la evidencia que falta antes de aceptar. | M04; M05, M09 | 1) Encuentra un defecto sembrado en un diff pequeño. 2) Señala archivos modificados fuera del alcance pedido. 3) Rechaza un "ya funciona" sin salida de pruebas y pide la evidencia concreta. |
| C06 | Control de versiones y recuperación | Usa Git (commits, ramas, worktrees) para aislar experimentos y recuperar versiones. | M04; M05, M08 | 1) Elige rama o worktree para un cambio arriesgado o paralelo. 2) Recupera una versión anterior tras un cambio defectuoso. 3) Distingue un checkpoint de la herramienta de un commit. |
| C07 | Dirección del ciclo con agentes | Conduce explorar → planear → implementar → verificar con alcance acotado y correcciones tempranas. | M05; M02, M03 | 1) Decide cuándo vale la pena el modo plan y cuándo no. 2) Exige un check ejecutable antes de dar algo por hecho. 3) Reconoce que hay que reiniciar la sesión tras correcciones repetidas. |
| C08 | Arquitectura y trazabilidad de datos | Ubica cada operación (motor de datos, código, interfaz, IA) y separa el cálculo determinista de la interpretación generativa. | M06; M07, M09 | 1) Decide qué se agrega en SQL remoto y qué se descarga. 2) Identifica una cifra que el LLM no debe calcular. 3) Diseña una reconciliación que detecta una diferencia sembrada. |
| C09 | Integraciones con mínimo privilegio | Elige entre CLI, API y MCP, y define permisos, ubicación de secretos, errores e idempotencia. | M07; M06, M09 | 1) Elige la vía de integración y justifica el costo de contexto y la seguridad. 2) Reduce el alcance de los permisos de un conector para una tarea desatendida. 3) Diseña la simulación y el manejo de errores antes de conectar el servicio real. |
| C10 | Diseño de autonomía | Justifica flujo fijo, agente, subagentes, ejecución en la nube o programada, con condiciones de término, entregables y costo. | M08; M05, M09 | 1) Elige la solución más simple suficiente frente a una propuesta multiagente. 2) Redacta una delegación con entregable, criterio y condición de término. 3) Ajusta la verificación en proporción al tiempo sin supervisión. |
| C11 | Seguridad y guardrails | Identifica contenido no confiable, elige modo de permiso, sandbox y red, y convierte reglas críticas en controles deterministas. | M09; M05, M07 | 1) En un flujo, señala qué documento o página puede inyectar instrucciones y qué acción podría disparar. 2) Elige permisos y red para un escenario (exploración frente a tarea con escritura). 3) Propone reemplazar una instrucción del tipo "nunca hagas X" por un control que la bloquee. |
| C12 | Evaluación basada en evidencia | Construye casos repetibles, elige graders, compara versiones y concluye solo lo que la evidencia sostiene. | M09; M02, M05 | 1) Arma un conjunto pequeño con casos normales, límite y adversariales. 2) Decide si el caso exige consistencia (pass^k) o basta un acierto (pass@k). 3) Distingue en un transcript un error del agente de un error del grader. |
| C13 | Producto mantenible | Define el alcance útil, documenta, cierra hallazgos y planifica el mantenimiento de las dependencias volátiles. | M10; M03, M09 | 1) Recorta un alcance a una versión utilizable. 2) Escribe instrucciones de ejecución y recuperación que otro agente o persona puede seguir. 3) Propone un calendario de revisión para instrucciones, skills, modelos y conectores. |

**Recomendación:** distribuir las 24 preguntas del diagnóstico (plan §5) con unas dos por competencia (13 × 2 = 26; ajustar a 24 fusionando C05/C06 o C03/C04 en el diagnóstico, no en el currículo). Las dos microtareas del plan ya miden C02 ("mejorar una instrucción") y C05 ("revisar un cambio").

---

## 4. Verificación de afirmaciones del plan sobre productos

Estados: **Correcta**, **Correcta, requiere precisión**, **Desactualizada** (lo fue, ya no basta), **No verificable**.

| # | Afirmación del plan (sección) | Estado verificado | Detalle (producto / entorno) | Fuente |
| --- | --- | --- | --- | --- |
| 1 | §7: Codex coordinará la generación de imágenes mediante una capacidad de imagen disponible. | **Correcta** | La generación integrada usa `gpt-image-2` y se invoca en lenguaje natural o con `$imagegen`. Está en la ChatGPT desktop app, ChatGPT web, Codex CLI y extensión IDE. La página no menciona Codex Cloud. Consume los límites incluidos unas 3–5 veces más rápido; no está en el plan Free; con API key se aplica precio de API. No documenta formato de salida ni carpeta de destino. | src-openai-codex-imagegen, src-openai-codex-pricing |
| 2 | §7: "No inventar el nombre del modelo". | **Desactualizada (como precaución)** | El modelo ya está documentado (`gpt-image-2`), así que puede registrarse en el manifiesto de activos con su fuente y fecha. Sigue valiendo no inventarlo si la herramienta no lo reporta en una generación concreta. | src-openai-codex-imagegen |
| 3 | §7 y CLAUDE.md del proyecto: no asumir que Claude Code tiene el mismo generador; Claude Code no genera imágenes raster. | **Correcta** [inferencia por ausencia] | El índice de la documentación de Claude Code no tiene ninguna página de generación de imágenes. | src-anthropic-cc-llms-index |
| 4 | M03.2 y §8: AGENTS.md y CLAUDE.md "según documentación vigente"; el mecanismo de carga debe verificarse por herramienta. | **Correcta, requiere precisión** | **Claude Code** lee AGENTS.md de forma nativa (v2.1.277+) solo si no existe CLAUDE.md o CLAUDE.local.md en el directorio de trabajo o por encima. Con CLAUDE.md, la vía es `@AGENTS.md`. **Codex (CLI)**: concatenación de la raíz hacia abajo, `AGENTS.override.md`, 32 KiB combinados por defecto. **Copilot (GitHub.com)**: AGENTS.md en cualquier carpeta (gana el más cercano) o CLAUDE.md/GEMINI.md en la raíz, además de `.github/copilot-instructions.md`. M03 debe enseñar estas reglas, no solo nombrar los dos archivos. | src-anthropic-cc-memory, src-openai-codex-agentsmd, src-github-copilot-instructions |
| 5 | AGENTS.md del proyecto: "lo lee Codex directamente y Claude Code lo importa desde CLAUDE.md". | **Correcta** | El patrón `@AGENTS.md` dentro de CLAUDE.md es la vía documentada cuando el proyecto también tiene CLAUDE.md. No duplica la carga. | src-anthropic-cc-memory |
| 6 | §8: AGENTS.md y CLAUDE.md deben ser breves y consistentes. | **Correcta** | Claude Code recomienda menos de 200 líneas y podar como si fuera código. Codex corta al llegar a 32 KiB combinados. | src-anthropic-cc-features, src-openai-codex-agentsmd |
| 7 | §1/§15: repositorio y contenido portables entre Codex y Claude Code. | **Correcta, requiere precisión** | Las instrucciones son portables (ver #4). Las **skills** comparten formato (Agent Skills), pero **no la ruta**: Codex usa `.agents/skills`, Claude Code documenta `.claude/skills` y Copilot acepta ambas más `.github/skills`. Los **subagentes** no son portables (Markdown en `.claude/agents` frente a TOML en `.codex/agents`). Los **hooks** tampoco (`settings.json` frente a `hooks.json`/`config.toml`). | src-openai-codex-skills, src-anthropic-cc-skills, src-github-agent-skills, src-openai-codex-subagents, src-anthropic-cc-subagents, src-openai-codex-hooks |
| 8 | M03.6: "Skills y recursos reutilizables: cuándo aportan valor". | **Correcta, requiere precisión** | Las skills ya son un estándar abierto (originado en Anthropic) adoptado por Claude Code, Codex y Copilot, con carga progresiva. Merecen más de una lección. | src-agentskills-site, src-openai-codex-skills, src-github-agent-skills |
| 9 | §10/§15: "Si el entorno no permite subagentes reales…"; verificar subagentes. | **Correcta, pero el planteamiento quedó atrás** | Los tres productos tienen subagentes reales. **Claude Code** (CLI y cloud): en segundo plano por defecto, anidamiento hasta 3 niveles, aislamiento en worktree. **Codex** (desktop app, CLI, IDE): activados por defecto; Codex Cloud no documentado. **Copilot CLI**: custom agents. La condición sigue sirviendo como salvaguarda, no como caso probable. | src-anthropic-cc-subagents, src-openai-codex-subagents, src-github-copilot-cli |
| 10 | §10: usar ramas/worktrees cuando el entorno los soporte. | **Correcta** | Claude Code documenta worktrees para sesiones y subagentes. Codex tiene página de git worktrees. | src-anthropic-cc-agents-parallel, src-openai-codex-docs |
| 11 | M05: documentar por separado las capacidades de CLI, IDE, app y entorno remoto. | **Correcta, requiere precisión** | Los nombres cambiaron. La "app" de Codex es la **ChatGPT desktop app** (macOS, Windows, Linux) y el remoto es **Codex Cloud**, accesible desde ChatGPT. El "coding agent" de Copilot se llama **Copilot cloud agent**. Claude Code tiene cloud sessions (Pro, Max, Team y Enterprise con asiento premium). | src-openai-codex-app, src-openai-codex-cloud, src-github-cloud-agent, src-anthropic-cc-cloud |
| 12 | M07.4: MCP y conectores frente a una llamada API directa. | **Correcta** | Para actualizarla: especificación vigente 2026-07-28, que cambia la negociación de versión por petición y añade `server/discover`. Las revisiones hasta 2025-11-25 usaban handshake. Gobierno: AAIF (Linux Foundation) desde el 9 de diciembre de 2025. Claude Code difiere los esquemas de herramientas MCP para ahorrar contexto. | src-mcp-versioning, src-lf-aaif, src-anthropic-cc-features |
| 13 | M06: no afirmar que Codex/GitHub ejecutan automáticamente queries en Databricks. | **Correcta, requiere precisión** | Nada lo hace "automáticamente". Pero Databricks ofrece MCP gestionados (Genie One GA; Databricks SQL Beta de Unity Gateway) que Claude Code, Codex y Cursor pueden usar **si se configuran**, con los permisos del usuario que llama. Copilot no aparece en esa página. | src-databricks-managed-mcp |
| 14 | §3 V2: una suscripción de chat no implica acceso a API. | **Correcta** | **Codex**: el uso con API key se factura aparte a precio de API. **Claude Code**: suscripción (claude.ai) frente a Console/API por token; las cloud sessions y `/schedule` exigen sesión iniciada con claude.ai. | src-openai-codex-pricing, src-anthropic-cc-costs, src-anthropic-cc-routines |
| 15 | §8: el entorno objetivo puede ser "Sites"; verificar service worker, alcance y rutas. | **Correcta** | Codex Sites existe (ChatGPT/Codex) y admite HTTP, HTTPS y WebSockets. No documenta service workers ni requisitos de PWA, así que la comprobación de la Fase 0 está justificada. | src-openai-codex-sites |
| 16 | §11: referencia OpenAI de evaluación (`developers.openai.com/api/docs/guides/evaluation-best-practices`). | **Correcta, requiere precisión** | La guía sigue accesible. La propia página avisa de que la **plataforma OpenAI Evals** pasa a solo lectura el 31 de octubre de 2026 y cierra el 30 de noviembre de 2026. No conviene enseñar esa plataforma como herramienta; sí la metodología. | src-openai-evals |
| 17 | §11: referencias de buenas prácticas de Codex (`learn.chatgpt.com/guides/best-practices`) y Claude Code (`code.claude.com/docs/en/best-practices`). | **Correcta** | Ambas accesibles el 2026-10-21. `developers.openai.com/codex` redirige (308) a `learn.chatgpt.com/docs`. | src-openai-codex-best-practices, src-anthropic-cc-best-practices, src-openai-codex-docs |
| 18 | M01/M05: Copilot como herramienta del alumno (implícito: modelo de costo por solicitudes). | **Desactualizada si se enseña por "premium requests"** | Desde el 1 de junio de 2026, Copilot consume **AI Credits** medidos en tokens (entrada, salida y caché). Las completaciones de código no consumen. Los planes anuales Pro/Pro+ conservan las premium requests hasta su vencimiento. | src-github-blog-ubb, src-github-copilot-requests |
| 19 | M09.5: instrucciones maliciosas en documentos. | **Correcta** | Coincide con la inyección indirecta de OWASP LLM01:2025, que dice que no se conoce prevención infalible: "it is unclear if there are fool-proof methods of prevention". | src-owasp-llm01 |
| 20 | Implícito en el registro de fuentes: AGENTS.md como estándar común. | **Correcta, con matiz** | AGENTS.md lo custodia la AAIF. La lista de herramientas en agents.md **no incluye Claude Code**, aunque la documentación de Claude Code ya documenta su lectura nativa [inferencia: el sitio va con retraso]. | src-agentsmd-site, src-anthropic-cc-memory |

**Afirmaciones inexactas o que cambiaron (resumen):** #2 (el modelo de imagen ya tiene nombre documentado), #9 (subagentes ya universales), #11 (nombres de superficies), #16 (plataforma OpenAI Evals en retiro) y #18 (facturación de Copilot). Además requieren precisión #4, #7, #8, #12 y #13. No encontré afirmaciones de producto que sean falsas en sentido estricto. El plan es prudente y casi todo lo que afirma está condicionado a verificación.

---

## 5. Registro de fuentes

Volatilidad **Alta** → revisar en 3 meses; **Media** → 6 meses; **Baja** → 12 meses. Todas consultadas el 2026-10-21.

| ID (src-<org>-<slug>) | Título | Organización | URL | Consultado | Afirmaciones que sustenta | Volatilidad | Próxima revisión |
| --- | --- | --- | --- | --- | --- | --- | --- |
| src-anthropic-cc-best-practices | Best practices for Claude Code | Anthropic | https://code.claude.com/docs/en/best-practices | 2026-10-21 | Contexto como restricción central; dar al agente un check verificable; `/goal` y Stop hook; explorar-planear-implementar; spec autocontenida y entrevista; CLAUDE.md conciso; checkpoints frente a Git; revisión adversarial con subagente; `claude -p` | Alta | 2027-01-21 |
| src-anthropic-cc-memory | How Claude remembers your project | Anthropic | https://code.claude.com/docs/en/memory | 2026-10-21 | Ubicaciones de CLAUDE.md; lectura nativa de AGENTS.md (v2.1.277+) solo sin CLAUDE.md; importación `@AGENTS.md`; memoria automática (200 líneas / 25 KB); `.claude/rules/` | Alta | 2027-01-21 |
| src-anthropic-cc-features | Extend Claude Code | Anthropic | https://code.claude.com/docs/en/features-overview | 2026-10-21 | Cuándo usar CLAUDE.md, regla, skill, subagente, hook, MCP o plugin; costo de contexto por pieza; CLAUDE.md < 200 líneas; guardrails en hooks y no en prompts | Alta | 2027-01-21 |
| src-anthropic-cc-skills | Extend Claude with skills | Anthropic | https://code.claude.com/docs/en/skills | 2026-10-21 | Skills siguen el estándar Agent Skills; ubicaciones `.claude/skills` (no documenta `.agents/skills`); `disable-model-invocation`; comandos fusionados en skills | Alta | 2027-01-21 |
| src-anthropic-cc-subagents | Create custom subagents | Anthropic | https://code.claude.com/docs/en/sub-agents | 2026-10-21 | Segundo plano por defecto; anidamiento hasta 3 niveles; worktree; memoria persistente; costo por subagente | Alta | 2027-01-21 |
| src-anthropic-cc-agents-parallel | Run agents in parallel | Anthropic | https://code.claude.com/docs/en/agents | 2026-10-21 | Subagentes, agent view (research preview), agent teams (experimental), projects (beta pública), dynamic workflows, worktrees | Alta | 2027-01-21 |
| src-anthropic-cc-cloud | Use Claude Code in the cloud | Anthropic | https://code.claude.com/docs/en/claude-code-on-the-web | 2026-10-21 | Cloud sessions en VM gestionada; planes; `--cloud`/`--teleport`; red Trusted por defecto; auto-fix de PRs; aislamiento de credenciales | Alta | 2027-01-21 |
| src-anthropic-cc-routines | Automate work with scheduled tasks | Anthropic | https://code.claude.com/docs/en/routines | 2026-10-21 | Tareas programadas en la nube (research preview); disparadores por horario, API y GitHub; los conectores escriben sin pedir permiso; el texto que llega por API se marca como no confiable | Alta | 2027-01-21 |
| src-anthropic-cc-security | Security | Anthropic | https://code.claude.com/docs/en/security | 2026-10-21 | Auto mode como modo inicial (v2.1.283+); protecciones ante prompt injection; diálogo de confianza; Anthropic no audita servidores MCP; prácticas con contenido no confiable | Alta | 2027-01-21 |
| src-anthropic-cc-costs | Manage costs effectively | Anthropic | https://code.claude.com/docs/en/costs | 2026-10-21 | Facturación por tokens; `/usage`; elección de modelo y esfuerzo; CLI más eficiente que MCP; agent teams ~7 veces más tokens; suscripción frente a Console | Alta | 2027-01-21 |
| src-anthropic-cc-llms-index | Claude Code docs index (llms.txt) | Anthropic | https://code.claude.com/docs/llms.txt | 2026-10-21 | Superficies; sin página de generación de imágenes; Claude in Chrome GA (semana del 29 de junio de 2026); computer use en CLI; structured outputs en el Agent SDK | Alta | 2027-01-21 |
| src-anthropic-eng-context | Effective context engineering for AI agents | Anthropic | https://www.anthropic.com/engineering/effective-context-engineering-for-ai-agents | 2026-10-21 | Definición de context engineering; context rot; recuperación justo a tiempo; compactación; notas estructuradas; subagentes (29 de septiembre de 2025) | Baja | 2027-10-21 |
| src-anthropic-eng-evals | Demystifying evals for AI agents | Anthropic | https://www.anthropic.com/engineering/demystifying-evals-for-ai-agents | 2026-10-21 | Tarea, intento, transcript, grader; pass@k frente a pass^k; capacidad frente a regresión; empezar con 20–50 tareas (9 de enero de 2026) | Baja | 2027-10-21 |
| src-anthropic-eng-agents | Building effective agents | Anthropic | https://www.anthropic.com/engineering/building-effective-agents | 2026-10-21 | Flujos frente a agentes; cinco patrones; empezar simple y añadir complejidad "only when it demonstrably improves outcomes" (19 de diciembre de 2024) | Baja | 2027-10-21 |
| src-anthropic-academy | Anthropic Academy (catálogo) | Anthropic | https://anthropic.skilljar.com/ | 2026-10-21 | Cursos de Agent Skills, Subagents, MCP, Claude Code 101/in Action, AI Fluency for Builders | Media | 2027-04-21 |
| src-anthropic-academy-cc-action | Claude Code in Action | Anthropic | https://anthropic.skilljar.com/claude-code-in-action | 2026-10-21 | Temario: sesiones largas, CLAUDE.md, skills de verificación, modos de permiso, hooks, rutinas y headless, GitHub Actions, verificar ejecuciones no supervisadas, plugins | Media | 2027-04-21 |
| src-anthropic-academy-builders | AI Fluency for Builders | Anthropic | https://anthropic.skilljar.com/ai-fluency-for-builders | 2026-10-21 | Marco 4D aplicado a construir; responder por lo construido | Baja | 2027-10-21 |
| src-openai-codex-best-practices | Codex best practices | OpenAI | https://learn.chatgpt.com/guides/best-practices | 2026-10-21 | Contexto con "done when"; Plan mode y entrevista; AGENTS.md; MCP stdio/Streamable HTTP con OAuth; skills; tareas programadas; subagentes; `/review`; esfuerzo de razonamiento | Alta | 2027-01-21 |
| src-openai-codex-docs | Codex docs (inicio y navegación) | OpenAI | https://learn.chatgpt.com/docs | 2026-10-21 | Superficies (ChatGPT desktop, web, móvil, CLI, IDE, Codex Cloud); páginas de image generation, computer use, hooks, worktrees, Sites; redirección 308 desde developers.openai.com/codex | Alta | 2027-01-21 |
| src-openai-codex-agentsmd | Custom instructions with AGENTS.md | OpenAI | https://learn.chatgpt.com/codex/agent-configuration/agents-md | 2026-10-21 | Descubrimiento global y de proyecto; `AGENTS.override.md`; límite de 32 KiB combinados; nombres alternativos | Media | 2027-04-21 |
| src-openai-codex-subagents | Subagents | OpenAI | https://learn.chatgpt.com/codex/agent-configuration/subagents | 2026-10-21 | Agentes propios en TOML (`.codex/agents`); heredan el sandbox; superficies; mayor consumo de tokens | Alta | 2027-01-21 |
| src-openai-codex-skills | Build skills | OpenAI | https://learn.chatgpt.com/codex/build-skills | 2026-10-21 | Formato SKILL.md; rutas `.agents/skills`; carga progresiva; invocación con `$`; basado en agentskills.io | Alta | 2027-01-21 |
| src-openai-codex-skills-plugins | Skills and plugins | OpenAI | https://learn.chatgpt.com/codex/skills-and-plugins | 2026-10-21 | Plugins agrupan skills, MCP y hooks; directorio compartido entre ChatGPT y Codex | Alta | 2027-01-21 |
| src-openai-codex-imagegen | Image generation | OpenAI | https://learn.chatgpt.com/codex/image-generation | 2026-10-21 | `gpt-image-2`; `$imagegen`; superficies; consumo 3–5 veces mayor; API para lotes | Alta | 2027-01-21 |
| src-openai-codex-cloud | Codex Cloud | OpenAI | https://learn.chatgpt.com/codex/cloud | 2026-10-21 | Tareas en entornos remotos; acceso desde ChatGPT web, desktop y móvil, CLI e IDE; secretos de red y allowlist | Alta | 2027-01-21 |
| src-openai-codex-computer-use | Computer use | OpenAI | https://learn.chatgpt.com/codex/computer-use | 2026-10-21 | Computer Use en la ChatGPT desktop app (macOS/Windows); permisos por app; riesgos en navegador con sesión iniciada | Alta | 2027-01-21 |
| src-openai-codex-hooks | Hooks | OpenAI | https://learn.chatgpt.com/codex/hooks | 2026-10-21 | Eventos; `hooks.json`/`config.toml`; revisión de confianza con `/hooks`; los hooks de herramientas no son una barrera de control completa | Alta | 2027-01-21 |
| src-openai-codex-security | Agent approvals and security | OpenAI | https://learn.chatgpt.com/codex/agent-approvals-security | 2026-10-21 | Sandbox local; red desactivada por defecto; fase de agente sin red en Cloud (legacy); riesgo de inyección con red o búsqueda en vivo; secretos solo durante el setup | Alta | 2027-01-21 |
| src-openai-codex-permissions | Permission modes | OpenAI | https://learn.chatgpt.com/codex/permission-modes | 2026-10-21 | Ask for approval / Approve for me / Full access; `workspace-write` | Alta | 2027-01-21 |
| src-openai-codex-pricing | Codex pricing | OpenAI | https://learn.chatgpt.com/codex/pricing | 2026-10-21 | Codex incluido en planes de ChatGPT; ventanas de uso y créditos; API key facturada aparte; las tareas en la nube consumen más | Alta | 2027-01-21 |
| src-openai-codex-app | ChatGPT desktop app (Codex) | OpenAI | https://learn.chatgpt.com/codex/app | 2026-10-21 | La app de Codex es la ChatGPT desktop app (macOS, Windows, Linux); tareas programadas; computer use | Alta | 2027-01-21 |
| src-openai-codex-sites | Sites | OpenAI | https://learn.chatgpt.com/codex/sites | 2026-10-21 | Hosting desde ChatGPT/Codex; HTTP/HTTPS/WebSockets; no documenta service workers | Alta | 2027-01-21 |
| src-openai-evals | Evaluation best practices | OpenAI | https://developers.openai.com/api/docs/guides/evaluation-best-practices | 2026-10-21 | Desarrollo guiado por evals; LLM como juez con calibración y control de sesgos; evals por arquitectura de agente; retiro de la plataforma Evals (31 de octubre / 30 de noviembre de 2026) | Media | 2027-04-21 |
| src-openai-academy | OpenAI Academy | OpenAI | https://academy.openai.com/ | 2026-10-21 | Tracks Apply AI at Work, Build with AI (Codex + API), Lead, Teach | Media | 2027-04-21 |
| src-openai-academy-builders | OpenAI Academy — Builders club | OpenAI | https://academy.openai.com/en/public/clubs/builders-etkn1/overview | 2026-10-21 | Codex Bootcamp 101/201/301 (septiembre–octubre de 2026); API Builder Bootcamp | Alta | 2027-01-21 |
| src-github-copilot-instructions | Adding repository custom instructions | GitHub | https://docs.github.com/en/copilot/how-tos/configure-custom-instructions/add-repository-instructions | 2026-10-21 | `copilot-instructions.md`; `*.instructions.md` con `applyTo`; AGENTS.md (gana el más cercano); CLAUDE.md/GEMINI.md en la raíz; cloud agent y code review | Alta | 2027-01-21 |
| src-github-cloud-agent | About Copilot cloud agent | GitHub | https://docs.github.com/en/copilot/concepts/agents/coding-agent/about-coding-agent | 2026-10-21 | Nombre "cloud agent"; entorno efímero; PRs; sesión de 59 minutos máximo; MCP; custom agents, skills, hooks; automatizaciones | Alta | 2027-01-21 |
| src-github-cloud-agent-risks | Risks and mitigations for Copilot cloud agent | GitHub | https://docs.github.com/en/copilot/concepts/agents/cloud-agent/risks-and-mitigations | 2026-10-21 | Filtrado de caracteres ocultos; solo usuarios con escritura; rama `copilot/`; aprobación de workflows; PR en borrador | Media | 2027-04-21 |
| src-github-agent-skills | About agent skills | GitHub | https://docs.github.com/en/copilot/concepts/agents/about-agent-skills | 2026-10-21 | Superficies de Copilot con skills; rutas `.github/skills`, `.claude/skills`, `.agents/skills`; estándar abierto | Alta | 2027-01-21 |
| src-github-copilot-cli | About GitHub Copilot CLI | GitHub | https://docs.github.com/en/copilot/concepts/agents/copilot-cli/about-copilot-cli | 2026-10-21 | Modo plan; `-p`; `--cloud` (preview); MCP, custom agents, skills, hooks; allow/deny de herramientas; niveles de razonamiento; AI credits | Alta | 2027-01-21 |
| src-github-copilot-requests | Requests in GitHub Copilot | GitHub | https://docs.github.com/en/copilot/concepts/billing/copilot-requests | 2026-10-21 | Premium requests solo para el legado anual Pro/Pro+; consumo por función | Alta | 2027-01-21 |
| src-github-blog-ubb | GitHub Copilot is moving to usage-based billing | GitHub | https://github.blog/changelog/2026/04/27/github-copilot-is-moving-to-usage-based-billing/ | 2026-10-21 | AI Credits por tokens desde el 1 de junio de 2026; créditos incluidos por plan; fin del fallback | Alta | 2027-01-21 |
| src-github-spec-kit | Spec Kit | GitHub | https://github.com/github/spec-kit | 2026-10-21 | Kit SDD: constitución, specify, plan, tasks, implement, converge | Alta | 2027-01-21 |
| src-microsoft-vscode-instructions | Custom instructions in VS Code | Microsoft | https://code.visualstudio.com/docs/copilot/customization/custom-instructions | 2026-10-21 | AGENTS.md recomendado para el arnés de Copilot; CLAUDE.md fuera del arnés de Copilot; ajustes del arnés local | Alta | 2027-01-21 |
| src-microsoft-learn-copilot | GitHub Copilot Fundamentals Part 1 of 2 | Microsoft | https://learn.microsoft.com/en-us/training/paths/copilot/ | 2026-10-21 | Módulos de Copilot (IA responsable, prompts, Spaces, entornos, personalización, pruebas) | Media | 2027-04-21 |
| src-microsoft-ghcp-curriculum | GitHub Copilot curriculum plan (train-the-trainer) | Microsoft (GitHub Pages) | https://microsoft.github.io/frontier-ghcp-ttt-rvas/curriculum-plan/ | 2026-10-21 | Temario avanzado: cloud agent, MCP, custom agents, agent skills, Spec Kit. Material de formadores, no ruta oficial de Learn | Media | 2027-04-21 |
| src-mcp-versioning | Versioning | Model Context Protocol | https://modelcontextprotocol.io/specification/versioning | 2026-10-21 | Versión vigente 2026-07-28; negociación por petición; `server/discover`; compatibilidad con revisiones ≤ 2025-11-25 | Alta | 2027-01-21 |
| src-mcp-intro | What is the Model Context Protocol? | Model Context Protocol | https://modelcontextprotocol.io/docs/getting-started/intro | 2026-10-21 | Definición de MCP y clientes compatibles (Claude, ChatGPT, VS Code…) | Baja | 2027-10-21 |
| src-lf-aaif | Linux Foundation announces the formation of the Agentic AI Foundation | Linux Foundation | https://www.linuxfoundation.org/press/linux-foundation-announces-the-formation-of-the-agentic-ai-foundation | 2026-10-21 | AAIF (9 de diciembre de 2025): MCP (Anthropic), goose (Block), AGENTS.md (OpenAI) | Baja | 2027-10-21 |
| src-agentsmd-site | AGENTS.md | Agentic AI Foundation | https://agents.md | 2026-10-21 | Formato abierto; custodia AAIF; el más cercano tiene precedencia; lista de herramientas sin Claude Code | Media | 2027-04-21 |
| src-agentskills-site | Agent Skills Overview | Agent Skills (proyecto abierto) | https://agentskills.io | 2026-10-21 | Formato abierto `SKILL.md`; carga progresiva; origen en Anthropic | Media | 2027-04-21 |
| src-owasp-llm01 | LLM01:2025 Prompt Injection | OWASP GenAI Security Project | https://genai.owasp.org/llmrisk/llm01-prompt-injection/ | 2026-10-21 | Inyección directa e indirecta; mitigaciones; sin prevención infalible conocida | Media | 2027-04-21 |
| src-owasp-agentic | OWASP Top 10 for Agentic Applications for 2026 | OWASP GenAI Security Project | https://genai.owasp.org/resource/owasp-top-10-for-agentic-applications-for-2026 | 2026-10-21 | Existencia del marco (fecha mostrada: 9 de diciembre de 2025). Categorías no extraídas (ver Huecos) | Media | 2027-04-21 |
| src-hf-agents-course | Hugging Face Agents Course — Unit 0 | Hugging Face | https://huggingface.co/learn/agents-course/unit0/introduction | 2026-10-21 | Temario: fundamentos, frameworks, casos de uso, proyecto final; extra de observabilidad y evaluación | Media | 2027-04-21 |
| src-dlai-courses | DeepLearning.AI courses | DeepLearning.AI | https://www.deeplearning.ai/courses/ | 2026-10-21 | Catálogo: SDD, Claude Code, Context Engineering, Evaluating AI Agents, AI Code Review, Agentic AI | Media | 2027-04-21 |
| src-dlai-sdd | Spec-Driven Development with Coding Agents | DeepLearning.AI / JetBrains | https://www.deeplearning.ai/short-courses/spec-driven-development-with-coding-agents/ | 2026-10-21 | Constitución, spec, plan-implementar-verificar, replanificación, empaquetar el flujo como skill | Media | 2027-04-21 |
| src-dlai-agent-skills | Agent Skills with Anthropic | DeepLearning.AI / Anthropic | https://www.deeplearning.ai/short-courses/agent-skills-with-anthropic/ | 2026-10-21 | Skills frente a herramientas, MCP y subagentes; skills en Claude.ai, Claude Code, API y Agent SDK | Media | 2027-04-21 |
| src-google-kaggle-intensive | Kaggle GenAI intensive course: vibe coding (junio de 2026) | Google | https://blog.google/innovation-and-ai/technology/developers-tools/kaggle-genai-intensive-course-vibe-coding-june-2026/ | 2026-10-21 | Curso intensivo de 5 días del 15 al 19 de junio de 2026, centrado en vibe coding y agentes con herramientas y APIs; proyecto final | Media | 2027-04-21 |
| src-databricks-managed-mcp | Databricks-managed MCP servers | Databricks | https://docs.databricks.com/aws/en/agents/mcp/managed-mcp | 2026-10-21 | Genie One (GA), Databricks SQL (Beta de Unity Gateway); permisos del llamador; clientes Claude Code, Codex, Cursor | Alta | 2027-01-21 |

---

## 6. Huecos

- **Google:** no obtuve el temario oficial día por día del *5-Day AI Agents Intensive* 2026; la página de Kaggle no devolvió contenido. Las menciones a Antigravity, MCP, seguridad, evaluación y SDD vienen de fuentes secundarias y **no se usaron como evidencia**. Tampoco abrí las páginas oficiales de los skill badges de Google Cloud sobre Gemini CLI y Antigravity (solo aparecieron perfiles públicos en la búsqueda).
- **OpenAI Academy:** las páginas `openai.com/academy/codex/` y `/building-with-ai/` devolvieron 403. No verifiqué el contenido de las lecciones de los Codex Bootcamps más allá de sus títulos.
- **Microsoft Learn:** solo verifiqué la ruta *Copilot Fundamentals Part 1*. No identifiqué un módulo oficial de Learn dedicado al cloud agent o a agent skills; el temario avanzado viene de material de formadores en GitHub Pages.
- **OWASP Agentic Top 10:** no extraje las diez categorías oficiales (la página remite a una descarga). No se debe citar ninguna categoría concreta hasta leer el documento.
- **Codex:** no leí la página de *Feature maturity*, así que no sé qué funciones son beta o GA. No está documentado si Codex Cloud admite subagentes o generación de imágenes, ni el formato y destino de los archivos de imagen. La red por defecto de los entornos Cloud actuales (no legacy) no aparece en la página de Cloud.
- **Copilot:** no verifiqué qué instrucciones lee Copilot en JetBrains y Visual Studio, ni el alcance exacto de Copilot Memory, Copilot Spaces y la Copilot app. Tampoco las cuotas exactas de AI Credits más allá del anuncio.
- **Claude Code:** que no exista generación de imágenes es una inferencia por ausencia en el índice, no una declaración explícita. No verifiqué si lee `.agents/skills`; la documentación no lo menciona.
- **Databricks:** la compatibilidad de Copilot con los MCP gestionados no está documentada en la página consultada.
- **Estados de maduración:** varios productos cambian de *preview* a GA cada pocas semanas (agent view, agent teams, tareas programadas, sandboxes en la nube de Copilot). Las tablas de M05 y M08 deben revalidarse antes de redactar las lecciones.
- **No investigado:** Gemini CLI, Cursor y otros agentes; currículos universitarios; evidencia empírica sobre la eficacia pedagógica de cada tema para perfiles de finanzas.

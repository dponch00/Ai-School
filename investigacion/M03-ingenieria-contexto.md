# M03 — Ingeniería de contexto y conocimiento · Base de investigación

- **Archivo:** `investigacion/M03-ingenieria-contexto.md`
- **Fecha de investigación:** 2026-10-22. Las fuentes nuevas y las reutilizadas que se volvieron a abrir se consultaron ese día; las reutilizadas que no se reabrieron conservan su fecha de consulta (2026-10-21) y así consta en el registro (§6).
- **Elaborado por:** subagente de investigación (Claude Code) para el autor de M03 (tarea D-023).
- **Estado:** base factual y conceptual para redactar las 6 lecciones, el laboratorio y las familias del banco. No es contenido para el alumno. No contiene lecciones ni preguntas.
- **Convenciones (las mismas de M02):**
  - `[src-…]` = ID del registro (§6). La afirmación está documentada en esa fuente (parafraseada).
  - `[inferencia]` = síntesis, conclusión o recomendación propia que ninguna fuente afirma literalmente.
  - "Volátil" = depende de producto, versión o superficie; verificado el 2026-10-22. Todo lo volátil va a fichas de producto (D-007, D-019): el cuerpo de la lección no nombra productos.
  - Se indica producto y superficie (CLI, IDE, app, nube). Una capacidad de un producto no se atribuye al resto del proveedor.
  - Citas textuales: como máximo una por fuente y de menos de 15 palabras.
- **Relación con M02:** M02 ya enseña que las reglas duraderas van en un archivo de instrucciones y las de la tarea en el prompt (M02 P2.3), y que el contexto específico rinde más que el abundante (P2.1, P2.2). M03 no repite eso: explica **por qué** el contexto se degrada, **cómo** se combinan las capas en cada herramienta, **qué** pieza usar para cada tipo de conocimiento, cómo se escribe y se prueba una skill, cómo se traspasa el trabajo entre sesiones y cuándo recuperar en vez de precargar.
- **Datos:** todos los ejemplos usan la empresa ficticia Altiplano Industrial S.A. (M02 §2.0). Ninguna cifra ni nombre es real.
- **Aviso para el banco y el laboratorio (T021-X-01):** los ítems del diagnóstico `dx-b3-01` a `dx-b3-04` ya están expuestos (sesión larga que empieza a ignorar correcciones, dónde implementar una regla sobre secretos que no puede fallar, dos archivos de instrucciones en conflicto y qué dejar para que otro agente continúe). El banco y el laboratorio de M03 no reutilizan esos escenarios: pueden reutilizar el concepto erróneo, pero cada familia necesita una situación nueva de Altiplano (estándar §4.1).


> **D-024 (2026-10-23):** toda evaluación es de opción múltiple. Los objetivos con verbo de producción se reformulan como decisiones evaluables por escenario, y el laboratorio propuesto aquí se convierte en un caso por pasos con preguntas, sin entregable ni rúbrica. Lo demás de esta base sigue vigente.

---

## 1. Resumen ejecutivo

1. **El contexto es un presupuesto que se gasta y se degrada.** La documentación de los agentes y cinco líneas de investigación independientes coinciden: el rendimiento cae a medida que crece la entrada, de forma gradual y muy por debajo del tamaño de ventana anunciado, incluso cuando el modelo recupera bien la información o cuando el relleno es neutro [src-anthropic-eng-context][src-arxiv-ruler][src-arxiv-nolima][src-arxiv-context-length][src-chroma-context-rot]. Una ventana más grande no elimina el problema [inferencia].
2. **Cuatro movimientos para gestionar una sesión:** limpiar (tarea nueva o correcciones repetidas), compactar con foco (misma tarea, historial largo), aislar en un subagente (exploración que llena el contexto) y persistir fuera del contexto (notas y archivos). Lo dicho solo en el chat es frágil: tras compactar, las instrucciones de archivo se reinyectan y las conversacionales no [src-anthropic-cc-best-practices][src-anthropic-cc-context-window][src-anthropic-eng-context][src-openai-codex-best-practices].
3. **Los archivos de instrucciones son contexto, no configuración obligatoria, y cada producto los combina a su manera.** No hay una regla común: Codex concatena desde la raíz hasta el directorio actual y presenta el más cercano como el que prevalece; Copilot da prioridad al AGENTS.md más cercano; VS Code declara que no hay un orden general de precedencia; Claude Code, si dos archivos se contradicen, puede seguir cualquiera de los dos [src-openai-codex-agentsmd][src-github-copilot-instructions][src-microsoft-vscode-instructions][src-anthropic-cc-memory]. Lo único transversal es comprobar qué se cargó en la superficie concreta y eliminar los conflictos en el origen [inferencia]. La regla de cada producto va en la ficha de L2 (T021-M03-02).
4. **Las reglas de carga difieren y hay trampas reales.** Ejemplo verificado: Claude Code lee AGENTS.md solo si no hay CLAUDE.md **ni CLAUDE.local.md** en el directorio o por encima; Codex lee como máximo un archivo por directorio y corta al llegar a 32 KiB combinados; Copilot da prioridad al AGENTS.md más cercano y admite CLAUDE.md o GEMINI.md en la raíz como alternativa [src-anthropic-cc-memory][src-openai-codex-agentsmd][src-github-copilot-instructions]. La tabla de precedencias (§3, L2) es la ficha que pide la nota de diseño del currículo.
5. **Cada tipo de conocimiento tiene su capa:** lo que hace falta en cada sesión va a la instrucción permanente; lo que vale para una parte del código, a una regla por rutas; los procedimientos y referencias ocasionales, a una skill; la exploración que inunda el contexto, a un subagente; lo que debe cumplirse siempre, a un control determinista (hook o permiso); los datos y acciones externos, a MCP o CLI, idealmente con una skill que enseñe a usarlos [src-anthropic-cc-features][src-anthropic-cc-memory][src-openai-codex-best-practices].
6. **Agent Skills es un formato abierto con carga progresiva:** solo `name` y `description` están siempre en contexto (unos 50–100 tokens por skill); el cuerpo de `SKILL.md` entra al activarse (recomendado < 5 000 tokens y < 500 líneas) y los recursos, bajo demanda [src-agentskills-spec][src-agentskills-client-impl][src-anthropic-skills-overview]. La descripción carga con todo el peso de la activación y se prueba con consultas que deberían y que no deberían activarla, incluidos casi aciertos, varias corridas y un umbral fijado de antemano [src-agentskills-descriptions].
7. **El formato es portable; la instalación no.** Codex busca en `.agents/skills`; Claude Code documenta `.claude/skills` y no `.agents/skills`; Copilot acepta `.github/skills`, `.claude/skills` y `.agents/skills`. Los campos de control de invocación son extensiones de cada producto, y las descripciones se truncan con presupuestos distintos [src-openai-codex-skills][src-anthropic-cc-skills][src-github-agent-skills].
8. **La memoria automática es una ayuda para recordar, no una fuente de reglas.** Las tres herramientas tienen alguna forma de memoria (activada por defecto o no, local o en el servicio, con o sin caducidad), y la documentación coincide en que lo obligatorio va en instrucciones escritas y versionadas [src-openai-codex-memories][src-anthropic-cc-memory][src-github-copilot-memory].
9. **La continuidad se diseña con artefactos escritos:** un registro de progreso, una lista de funciones con estado verificable, commits descriptivos, un registro de decisiones con su motivo y una rutina de arranque que verifica antes de seguir [src-anthropic-eng-harnesses][src-nygard-adr][src-openai-codex-execplans].
10. **Recuperar justo a tiempo, y desconfiar de las citas.** Conviene guardar referencias ligeras (rutas, consultas) y cargar el contenido al necesitarlo. Una cita que apunta a un documento real no prueba que respalde la afirmación: en una evaluación humana, solo la mitad de las frases de buscadores generativos estaban plenamente respaldadas por sus citas, y herramientas legales con recuperación siguieron inventando entre el 17 % y el 33 % de las veces [src-anthropic-eng-context][src-anthropic-citations][src-arxiv-verifiability][src-arxiv-legal-rag].

---

## 2. Blueprint propuesto (objetivos evaluados del manual)

Seis objetivos, uno por lección. Cada uno tendrá 2 familias en el banco y 2 ítems en el examen (`docs/content-standard.md` §3.3). Los verbos son observables; los criterios, comprobables por un revisor.

| ID | Objetivo evaluado | Competencia | Lección | Evidencia prevista |
| --- | --- | --- | --- | --- |
| M03-OE1 | Dado el síntoma de una sesión de trabajo con un agente (deriva, correcciones repetidas, cambio de tema, exploración amplia, historial largo de una misma tarea), **elige** entre continuar, limpiar y reformular, compactar con foco, aislar en un subagente o persistir en un archivo, **justificando** la elección por el estado del contexto, en al menos 4 de 5 casos intercalados. | C03 | L1 | Comprobación, serie intercalada, banco |
| M03-OE2 | Dado un repositorio con varios archivos de instrucciones y la ficha de precedencias vigente, **predice** qué instrucciones cargará cada herramienta en un directorio dado, **identifica** la omisión o el conflicto que explica una conducta inesperada y **propone** la corrección mínima que lo resuelve sin duplicar reglas. | C04 | L2 | Comprobación, banco, paso 4 del laboratorio |
| M03-OE3 | Dada una lista de reglas, procedimientos y fuentes de un proyecto, **asigna** cada elemento a la capa adecuada (instrucción permanente, regla por rutas, skill, subagente, control determinista, MCP o CLI) según frecuencia de uso, alcance y necesidad de garantía, sin dejar ninguna regla crítica solo como texto. | C04 (apoyo C03) | L3 | Serie intercalada, banco, laboratorio |
| M03-OE4 | Dada una tarea repetible, **redacta** una skill en el formato abierto (nombre válido, descripción que dice qué hace y cuándo usarla, cuerpo dentro del límite, referencias a un nivel) y un conjunto de consultas de activación con casos que deberían y que no deberían activarla, incluidos casi aciertos, con un umbral fijado antes de probar. | C04 | L4 | Laboratorio con rúbrica, banco (juicio sobre descripciones) |
| M03-OE5 | Dada una sesión interrumpida o un cambio de herramienta, **produce** un documento de traspaso con el que un agente sin historial retoma el trabajo (estado, decisiones con motivo, siguiente paso y cómo verificar), y **decide** qué va en instrucciones escritas, en el registro de decisiones y qué puede quedar en la memoria automática. | C03 (apoyo C04) | L5 | Laboratorio, banco |
| M03-OE6 | Dada una pregunta que exige documentos o datos de un proyecto, **decide** qué cargar de antemano y qué recuperar justo a tiempo, y **verifica** si cada cita de una respuesta respalda la afirmación que acompaña, señalando las que apuntan a una fuente real pero no la sostienen. | C03 | L6 | Comprobación, banco |

**Series intercaladas obligatorias** (`content-standard.md` §3.2, R-A4-2). Hay dos decisiones que se confunden: (a) limpiar, compactar, aislar o persistir (OE1), y (b) instrucción, regla por rutas, skill, subagente, hook o MCP (OE3). Cada una pide una serie de 4–6 casos breves después de enseñarla. Propuesta [inferencia]: la serie (a) al final de L1 y repetida con variantes en L5; la serie (b) al final de L3 e incluyendo skills en L4.

**Cobertura del laboratorio.** OE2 (paso de verificación de carga), OE3 (qué va en AGENTS.md y qué no), OE4 (skill y prueba de activación) y OE5 (documento de continuidad) tienen verbos de producción y se evalúan con la rúbrica del §5. OE1 y OE6 se evalúan con opción múltiple de escenario.

---

## 3. Lecciones

### Lección 1 — El contexto como presupuesto: qué entra, por qué rinde menos al llenarse y cuándo limpiar, compactar o aislar

**Objetivo de lección (borrador).** Dado el registro de una sesión con un agente, identificar qué ocupa el contexto y elegir el movimiento que lo recupera (limpiar, compactar con foco, aislar o persistir), con una justificación de una frase. → M03-OE1.

**Ideas clave**

- **K1.1 Qué es el contexto de un agente.** Todo lo que el modelo ve en cada paso: instrucciones del sistema, archivos de instrucciones, definiciones de herramientas, el historial de mensajes, cada archivo leído y la salida de cada comando [src-anthropic-eng-context][src-anthropic-cc-best-practices]. La ingeniería de contexto es la disciplina de curar ese conjunto en cada paso; amplía la de redactar prompts, que se centra en las instrucciones [src-anthropic-eng-context].
- **K1.2 El principio rector.** Buscar el conjunto más pequeño de tokens con mucha señal que maximice la probabilidad del resultado deseado [src-anthropic-eng-context]. [inferencia] M02 dijo "específico, no abundante" como regla de redacción; aquí se explica el mecanismo y se convierte en gestión activa durante la sesión.
- **K1.3 Por qué rinde menos al llenarse (evidencia).**
  - La exactitud para recordar información baja a medida que crece la entrada; la caída es gradual, no un precipicio. Anthropic lo atribuye a que la atención relaciona todos los tokens entre sí y a que los modelos vieron menos secuencias largas en el entrenamiento [src-anthropic-eng-context].
  - **Posición.** En preguntas sobre varios documentos, el rendimiento fue mayor con la información relevante al principio o al final que en el medio, también en modelos de contexto largo (curva en U, 2023) [src-arxiv-lost-middle].
  - **Ventana anunciada frente a ventana efectiva.** De 17 modelos que anunciaban 32K tokens o más, solo la mitad mantuvo un rendimiento satisfactorio a 32K en tareas más exigentes que "la aguja en el pajar" (2024) [src-arxiv-ruler].
  - **Sin coincidencia literal.** Cuando la pregunta y el dato no comparten palabras, 11 de 13 modelos de 128K o más cayeron por debajo de la mitad de su rendimiento en contexto corto al llegar a 32K (2025) [src-arxiv-nolima].
  - **La longitud por sí sola.** Con recuperación perfecta y dentro de la ventana anunciada, la exactitud cayó entre 13,9 % y 85 % al alargar la entrada, incluso reemplazando el relleno por espacios en blanco o enmascarándolo (2025) [src-arxiv-context-length].
  - **Distractores e historial irrelevante.** En 18 modelos, los distractores parecidos al dato dañaron más a medida que crecía la entrada, y en preguntas conversacionales un prompt enfocado de unos 300 tokens rindió mucho mejor que el historial completo de unos 113 000 [src-chroma-context-rot].
  - [inferencia] Para el alumno: el contexto lleno no "se olvida" de golpe; se vuelve menos fiable, y los primeros síntomas son instrucciones tempranas ignoradas y errores que antes no cometía. Claude Code lo describe así en su guía [src-anthropic-cc-best-practices].
- **K1.4 Los cuatro movimientos.**
  - **Limpiar** entre tareas no relacionadas, y tras dos correcciones fallidas sobre lo mismo: una sesión limpia con un prompt mejor suele superar a una larga con correcciones acumuladas [src-anthropic-cc-best-practices]. Codex recomienda un hilo por unidad coherente de trabajo y advierte que los hilos largos e inflados degradan el resultado [src-openai-codex-best-practices].
  - **Compactar con foco** cuando la tarea es la misma y el historial es valioso pero largo: se reemplaza la conversación por un resumen y conviene decir qué conservar. Anthropic recomienda ajustar la compactación primero para no perder nada importante y después para quitar lo superfluo [src-anthropic-eng-context][src-anthropic-cc-context-window].
  - **Aislar** la exploración amplia en un subagente: trabaja en su propia ventana y devuelve un resumen condensado (Anthropic menciona 1 000–2 000 tokens como orden de magnitud) [src-anthropic-eng-context][src-anthropic-cc-subagents]. El aislamiento no es gratis: cada subagente gasta sus propios tokens [src-anthropic-cc-subagents].
  - **Persistir fuera del contexto** con notas estructuradas (lista de tareas, archivo de notas) que el agente vuelve a leer después; encaja con trabajo iterativo por hitos [src-anthropic-eng-context]. (Se desarrolla en L5.)
- **K1.5 Lo dicho solo en el chat es frágil.** Tras compactar, la herramienta vuelve a leer del disco el archivo de instrucciones de la raíz y la memoria; lo que se dijo solo en la conversación queda resumido y puede perderse. La documentación recomienda pasar a archivo las instrucciones que deben persistir [src-anthropic-cc-memory][src-anthropic-cc-context-window]. [inferencia] Principio duradero: si una regla debe sobrevivir a la sesión, no puede vivir solo en el historial.
- **K1.6 Medir antes de decidir.** Las herramientas permiten ver el desglose del contexto y su consumo (ficha F1.1) [src-anthropic-cc-context-window]. [inferencia] El hábito que se enseña es mirar qué ocupa el contexto antes de decidir el movimiento, no adivinar.
- **K1.7 Aparte (no evaluable).** Una mitigación propuesta para tareas largas es pedir al modelo que primero recite la evidencia recuperada y luego responda, lo que convierte una tarea de contexto largo en una de contexto corto; en el estudio dio mejoras modestas (hasta 4 % en un caso) [src-arxiv-context-length].

**Ejemplo con Altiplano (para el caso resuelto).** La analista de FP&A trabaja con un agente en el repositorio `altiplano-pipeline/`. A primera hora le pide normalizar la etapa "Negociacion" y le aclara en el chat: "registra cada normalización en `docs/DECISIONS.md`". Después le pregunta por los colores del gráfico, luego le pide revisar 30 archivos para entender cómo se calculó la cobertura del trimestre anterior, y vuelve a la normalización. La herramienta compacta en mitad de la revisión. Al retomar, el agente normaliza pero ya no registra la decisión, y en la cobertura vuelve a usar una moneda equivocada que ya se había corregido dos veces.

| Síntoma | Movimiento | Razón |
| --- | --- | --- |
| La pregunta de colores no tiene relación con la normalización | Limpiar (o una sesión aparte) | Mezclar tareas llena el contexto de ruido |
| Revisar 30 archivos para entender un cálculo | Aislar en un subagente que devuelva un resumen con rutas y fórmulas | La exploración llenaría la sesión principal |
| La regla "registra en DECISIONS.md" se perdió tras compactar | Persistir: pasarla al archivo de instrucciones | Las instrucciones de archivo se reinyectan; las del chat no |
| Dos correcciones fallidas sobre la moneda | Limpiar y reformular con la regla y un caso de prueba | El contexto está contaminado con intentos fallidos |
| Sigue la misma tarea con historial valioso | Compactar con foco ("conserva la lista de archivos modificados y los comandos de prueba") | Se libera espacio sin perder decisiones |

**Conceptos erróneos (distractores)**

| ID | Creencia errónea | Por qué es errónea | Fuentes |
| --- | --- | --- | --- |
| CE-M03-01 | "Con una ventana de un millón de tokens ya no hace falta gestionar el contexto." | El rendimiento cae dentro de la ventana anunciada, incluso con recuperación perfecta; la ventana efectiva es menor que la anunciada. | [src-arxiv-context-length][src-arxiv-ruler][src-arxiv-nolima] |
| CE-M03-02 | "Compactar conserva todo lo que le dije al agente." | La compactación resume; las instrucciones solo conversacionales pueden perderse, mientras que las de archivo se reinyectan. | [src-anthropic-cc-memory][src-anthropic-cc-context-window] |
| CE-M03-03 | "Delegar en un subagente ahorra tokens en total." | Protege el contexto principal, pero cada subagente consume sus propios tokens. | [src-anthropic-cc-subagents] |
| CE-M03-04 | "Si el agente empieza a ignorar instrucciones, hay que repetirlas con más énfasis en el mismo chat." | Es un síntoma de contexto lleno o contaminado; lo indicado es limpiar o compactar y reformular. (Complementa M02 CE07 y CE21 sin repetirlos.) | [src-anthropic-cc-best-practices] |

**Candidatos a ficha de producto**

| Ficha | Producto · superficie | Capacidad | Verificado | Madurez / nota |
| --- | --- | --- | --- | --- |
| F1.1 Ver y gestionar el contexto | Claude Code · CLI, IDE, desktop | `/context` (desglose por categoría), `/clear`, `/compact <foco>`, `/rewind` con "resumir desde/hasta aquí", `/autocompact`, `/btw` para preguntas que no entran al historial; compactación automática al acercarse al límite | 2026-10-22 [src-anthropic-cc-context-window][src-anthropic-cc-best-practices] | GA (guidance) |
| F1.2 Qué sobrevive a la compactación | Claude Code · CLI | Se reinyectan: CLAUDE.md de la raíz, reglas sin `paths`, memoria automática, descripciones de skills (v2.1.304+), plan del modo plan; se vuelven a leer hasta 5 archivos recientes; los cuerpos de skills invocadas vuelven truncados (5 000 tokens por skill, 25 000 en total); reglas con `paths` y CLAUDE.md anidados recargan bajo demanda | 2026-10-22 [src-anthropic-cc-context-window] | Volátil por versión |
| F1.3 Hilos y compactación | Codex · CLI, IDE, app | Un hilo por unidad de trabajo; `/compact` y compactación automática; `/fork` cuando el trabajo se bifurca | 2026-10-22 [src-openai-codex-best-practices] | Guidance |
| F1.4 Subagentes | Claude Code · CLI | Contexto propio; cargan CLAUDE.md y git status salvo Explore y Plan; no heredan historial ni memoria; aviso si las descripciones superan 15 000 tokens | 2026-10-22 [src-anthropic-cc-subagents] | GA; volátil |

---

### Lección 2 — Capas de instrucciones: AGENTS.md, CLAUDE.md, instrucciones de Copilot y la precedencia en cada producto

**Objetivo de lección (borrador).** Dado un árbol de directorios con archivos de instrucciones y la ficha de precedencias, predecir qué carga cada herramienta y detectar el conflicto u omisión que explica una conducta. → M03-OE2.

**Ideas clave (principios duraderos, sin nombres de producto en el cuerpo)**

- **K2.1 Una instrucción escrita es contexto, no una regla que la herramienta haga cumplir.** El agente la lee e intenta seguirla, pero no hay garantía, menos aún si es vaga o contradictoria; para bloquear una acción se usa un control determinista [src-anthropic-cc-memory][src-anthropic-cc-features]. En Claude Code el contenido de CLAUDE.md llega como mensaje de usuario después del prompt de sistema (detalle para ficha) [src-anthropic-cc-memory].
- **K2.2 Las capas.** Organización (gestionada por TI), usuario (todas mis carpetas), proyecto (compartido en el repositorio), subdirectorio (una parte del código) y personal-local (no versionado). Claude Code y Codex las **concatenan** de lo general a lo particular, y lo más cercano al directorio de trabajo se lee al final [src-anthropic-cc-memory][src-openai-codex-agentsmd]. VS Code, en cambio, no declara un orden general [src-microsoft-vscode-instructions], así que no se enseña como regla común (T021-M03-02). Copilot entrega todas las capas aplicables y declara un orden de prioridad personal > repositorio > organización [src-github-copilot-instructions].
- **K2.3 "Precedencia" no es una anulación garantizada.**
  - Codex presenta el archivo más cercano como el que prevalece porque aparece después [src-openai-codex-agentsmd].
  - Claude Code dice que, si dos archivos se contradicen, el modelo puede elegir cualquiera de las dos instrucciones; entre reglas de usuario y de proyecto, ninguna anula a la otra [src-anthropic-cc-memory].
  - La documentación de VS Code dice que no hay un orden general de precedencia entre AGENTS.md y otros archivos y desaconseja depender del orden [src-microsoft-vscode-instructions].
  - El sitio de AGENTS.md añade que la petición explícita del usuario en el chat prevalece sobre cualquier AGENTS.md [src-agentsmd-site].
  - [inferencia] Conclusión para enseñar: la precedencia describe el orden de lectura y una tendencia, no un mecanismo determinista. La única estrategia robusta es no tener conflictos: una regla en un solo lugar, revisada como código.
- **K2.4 Un archivo compartido, varias herramientas.** AGENTS.md es un formato abierto, sin campos obligatorios, custodiado por la Agentic AI Foundation de la Linux Foundation [src-agentsmd-site][src-lf-aaif]. Las herramientas lo leen con condiciones distintas (tabla de precedencias). [inferencia] El patrón portable es un AGENTS.md como fuente única y, solo donde haga falta, un archivo propio de la herramienta que lo importe y añada lo específico.
- **K2.5 Verificar la carga, no suponerla.** Cada herramienta ofrece una forma de ver qué instrucciones cargó (lista de archivos de memoria, lista de referencias de una respuesta, pedirle que resuma sus instrucciones). Si un archivo no aparece, el agente no lo vio [src-anthropic-cc-memory][src-openai-codex-agentsmd][src-github-copilot-instructions][src-microsoft-vscode-instructions].
- **K2.6 Los límites de tamaño cortan en silencio.** Codex deja de añadir archivos al llegar al tope combinado; Claude Code avisa al superar la longitud recomendada y entrega solo el principio de los archivos bajo demanda que pasan su límite [src-openai-codex-agentsmd][src-anthropic-cc-memory]. [inferencia] Un archivo largo no solo cuesta contexto: su final puede no llegar nunca al modelo.
- **K2.7 Las instrucciones son código.** Se versionan, se revisan cuando algo falla y se podan; hay herramientas que auditan contradicciones y referencias a archivos inexistentes [src-anthropic-cc-best-practices][src-anthropic-cc-memory]. **Aparte:** la revisión de código de Copilot lee instrucciones y skills de la rama con los cambios, no de la rama base [src-github-copilot-instructions]. [inferencia] Un PR puede modificar las instrucciones con las que se revisa a sí mismo; es un tema para M09.

**Tabla de precedencia de instrucciones por producto (ficha F2.1, verificada el 2026-10-22)**

| Aspecto | Codex (CLI, IDE, app) | Claude Code (CLI, IDE, desktop) | Copilot · GitHub.com (cloud agent, code review) | Copilot · VS Code (chat local) |
| --- | --- | --- | --- | --- |
| Archivo de proyecto | `AGENTS.md`; `AGENTS.override.md` lo sustituye en el mismo directorio; nombres alternativos con `project_doc_fallback_filenames` | `CLAUDE.md` o `.claude/CLAUDE.md`; `CLAUDE.local.md` personal (añadir a `.gitignore`) | `.github/copilot-instructions.md`; `AGENTS.md` en cualquier carpeta; como alternativa, un solo `CLAUDE.md` o `GEMINI.md` en la raíz | `.github/copilot-instructions.md`; `AGENTS.md` en la raíz (`chat.useAgentsMdFile`, activo por defecto); `CLAUDE.md` con `chat.useClaudeMdFile` |
| ¿Lee AGENTS.md? | Sí, nativo | Sí desde v2.1.277, **solo si no hay `CLAUDE.md`, `.claude/CLAUDE.md` ni `CLAUDE.local.md`** en el directorio de trabajo o por encima (el `~/.claude/CLAUDE.md`, el gestionado y `.claude/rules/` no cuentan). Ajuste **Project instructions**: `claude-md-or-agents-md` (defecto), `claude-md-and-agents-md`, `claude-md`, `managed-only`. Con CLAUDE.md, la vía documentada es `@AGENTS.md`. No lee `AGENTS.override.md`, `AGENTS.local.md` ni nada bajo `.agents/` | Sí; gana el más cercano al directorio de trabajo | Sí en la raíz; los anidados requieren `chat.useNestedAgentsMdFiles` (experimental, desactivado por defecto) |
| Capas | Global en `~/.codex` (o `CODEX_HOME`): `AGENTS.override.md` o `AGENTS.md`, solo el primero no vacío · proyecto: de la raíz Git al directorio actual, **como máximo un archivo por directorio** | Gestionada (TI) · usuario `~/.claude/CLAUDE.md` · proyecto · local; los del directorio y superiores se cargan al iniciar; los de subdirectorios, al tocar archivos de esa carpeta | Personal · repositorio · organización (el soporte varía por superficie, ver F2.2) | Usuario (`~/.copilot/…`, `~/.claude/…`) · repositorio · organización (opcional) |
| Cómo se combinan | Concatenación raíz → directorio actual; el más cercano aparece después y "prevalece" | Concatenación raíz → directorio de trabajo; `CLAUDE.local.md` después de `CLAUDE.md` en cada nivel; no se anulan entre sí | Se entregan todas las capas aplicables; prioridad declarada personal > repositorio > organización; si aplican uno por ruta y el general, se usan ambos | Aditivas; "no hay orden general de precedencia" |
| Conflictos | El más cercano se presenta como prevaleciente | El modelo puede elegir cualquiera; revisar y eliminar contradicciones (`/doctor prompt-audit`, v2.1.283+) | Evitar instrucciones contradictorias | Resolver en el origen |
| Reglas por ruta | Archivo AGENTS.md anidado en la carpeta (no hay reglas por glob documentadas) | `.claude/rules/*.md` con `paths:` (globs); sin `paths` se cargan siempre | `.github/instructions/*.instructions.md` con `applyTo` (globs) y `excludeAgent` opcional; en GitHub.com solo cloud agent y code review | `*.instructions.md` con `applyTo`; también lee `.claude/rules` (usa `paths`) |
| Importar otros archivos | No documentado | `@ruta`, hasta 4 saltos; importar no reduce el costo de contexto | No documentado | Referencias en instrucciones (`chat.includeReferencedInstructions`) |
| Límite de tamaño | 32 KiB combinados por defecto (`project_doc_max_bytes`); deja de añadir archivos al llegar | Recomendado < 200 líneas por archivo; se omite un archivo > 4 MiB; archivos bajo demanda truncados (40 000 caracteres con ventana de 200K) | No documentado (el prompt de generación pide no más de dos páginas) | No documentado |
| Cómo verificar la carga | `codex --ask-for-approval never "Summarize the current instructions."`; `codex --cd subdir` para anidados; logs de sesión | `/context` (Memory files); `/memory` lista también el AGENTS.md leído directamente (v2.1.280+); línea de sesión "AGENTS.md loaded" | Lista **References** de la respuesta en el chat | Lista **References**; Chat: Open Customizations; registros de depuración del agente |
| Fuente | [src-openai-codex-agentsmd][src-openai-codex-best-practices] | [src-anthropic-cc-memory] | [src-github-copilot-instructions][src-github-instructions-support] | [src-microsoft-vscode-instructions] |

**Ficha F2.2 — Soporte de tipos de instrucción por superficie de Copilot (verificada el 2026-10-22, [src-github-instructions-support]).** Resumen: el archivo general del repositorio se admite en casi todas las superficies; las reglas por ruta, en cloud agent y code review de GitHub.com, chat de VS Code, Visual Studio, JetBrains, Xcode y Copilot CLI; AGENTS.md y CLAUDE.md/GEMINI.md, en cloud agent (todas las superficies), code review de GitHub.com y Copilot CLI (AGENTS.md también en el chat de VS Code); las instrucciones personales, en el chat de GitHub.com, JetBrains y Copilot CLI; las de organización, solo en GitHub.com. La fuente no cubre la Copilot app.

**Ejemplo con Altiplano.** El repositorio `altiplano-pipeline/` tiene un `AGENTS.md` en la raíz con las reglas compartidas (moneda de reporte USD con `fx_rates.csv`, los cálculos solo en `src/kpis/`, "no modificar `data/stage_probability.csv`") y otro en `src/sql/AGENTS.md` con la convención de consultas. Un analista nuevo crea `CLAUDE.local.md` con la ruta de su carpeta de pruebas. Desde ese día, en su máquina, el agente deja de convertir montos en EUR. Diagnóstico con la ficha: en esa herramienta, la sola presencia de un archivo local propio hace que no se lea el AGENTS.md compartido. Corrección mínima: un `CLAUDE.md` versionado que contenga `@AGENTS.md` (o cambiar el ajuste de carga), y comprobar en la lista de archivos cargados que ahora aparecen ambos. Segundo caso para la serie: la misma regla de moneda escrita distinta en `AGENTS.md` ("USD") y en `.github/copilot-instructions.md` ("moneda local"): se elimina una de las dos, no se "ordena" la precedencia.

**Conceptos erróneos (distractores)**

| ID | Creencia errónea | Por qué es errónea | Fuentes |
| --- | --- | --- | --- |
| CE-M03-05 | "Todas las herramientas leen AGENTS.md de la misma forma." | Una lo lee siempre, otra solo si no hay archivo propio, otra solo en la raíz salvo un ajuste experimental. | [src-openai-codex-agentsmd][src-anthropic-cc-memory][src-microsoft-vscode-instructions] |
| CE-M03-06 | "El archivo más cercano anula al general; si se contradicen, gana siempre el cercano." | Se concatenan; al menos una herramienta advierte que el modelo puede elegir cualquiera y otra que no hay orden general. | [src-anthropic-cc-memory][src-microsoft-vscode-instructions] |
| CE-M03-07 | "Escribir 'lee AGENTS.md' en el archivo propio de la herramienta equivale a importarlo." | El agente lo verá solo si decide abrirlo; la importación lo carga siempre. | [src-anthropic-cc-memory] |
| CE-M03-08 | "Si la regla está en el archivo de instrucciones, el agente no puede violarla." | Es contexto, no configuración obligatoria; para garantías hay hooks y permisos. | [src-anthropic-cc-memory][src-anthropic-cc-features] |
| CE-M03-09 | "Un archivo personal no versionado no afecta lo que el agente lee del repositorio." | En Claude Code, `CLAUDE.local.md` cuenta y bloquea la lectura de AGENTS.md por defecto. | [src-anthropic-cc-memory] |

**Candidatos a ficha:** F2.1 (tabla anterior), F2.2 (soporte por superficie de Copilot) y F2.3 "Archivo compartido en Windows": el enlace simbólico `CLAUDE.md → AGENTS.md` requiere privilegios o modo desarrollador, y Git lo descarga como texto si `core.symlinks` está desactivado; en ese caso se recomienda la importación [src-anthropic-cc-memory].

---

### Lección 3 — Qué va en cada capa: instrucción permanente, regla por rutas, skill, subagente, hook o MCP

**Objetivo de lección (borrador).** Dado un inventario de reglas, procedimientos y fuentes, asignar cada elemento a su capa y justificarlo por frecuencia, alcance y necesidad de garantía. → M03-OE3.

**Ideas clave**

- **K3.1 Cuatro preguntas ordenan la decisión** [inferencia, sintetiza las fuentes de cada punto]:
  1. ¿Hace falta **en cada sesión**? → instrucción permanente: comandos que el agente no adivina, convenciones que difieren de lo habitual, decisiones de arquitectura, trampas conocidas [src-anthropic-cc-best-practices][src-openai-codex-best-practices].
  2. ¿Vale solo **para una parte del código**? → regla por rutas o archivo anidado, que se carga al tocar esos archivos [src-anthropic-cc-memory][src-github-copilot-instructions].
  3. ¿Es un **procedimiento de varios pasos o una referencia** que se usa a veces? → skill, que solo ocupa su descripción hasta que se usa [src-anthropic-cc-features][src-agentskills-site].
  4. ¿Debe ocurrir **siempre, sin excepción**? → control determinista (hook o permiso): una prohibición escrita es una petición, no una garantía [src-anthropic-cc-features][src-anthropic-cc-memory].
  Y dos piezas de otro tipo: el **subagente**, para trabajo que llenaría el contexto con material que no se volverá a consultar, y **MCP o CLI**, para datos y acciones externos [src-anthropic-cc-features]. MCP es un estándar abierto para conectar aplicaciones de IA con fuentes de datos, herramientas y flujos externos [src-mcp-intro].
- **K3.2 Costo de contexto por capa.** La instrucción permanente se paga en cada petición; la regla por rutas, solo cuando se tocan esos archivos; la skill, su descripción en cada petición y el cuerpo al usarla; el subagente trabaja aislado; el hook no cuesta nada salvo lo que devuelve; MCP, los nombres de herramientas al inicio y los esquemas bajo demanda (ficha) [src-anthropic-cc-features].
- **K3.3 Qué no poner en la instrucción permanente.** Lo que el agente deduce leyendo el código, convenciones estándar del lenguaje, documentación extensa (mejor un enlace), información que cambia a menudo, descripciones archivo por archivo y obviedades como "escribe código limpio". Prueba de poda: ¿quitar esta línea haría que el agente se equivoque? Si no, se quita [src-anthropic-cc-best-practices]. Hay herramientas que proponen recortes de lo deducible del código [src-anthropic-cc-memory].
- **K3.4 Las capas se añaden por síntomas, no por adelantado.** Disparadores documentados: el agente se equivoca dos veces en una convención → instrucción; pegas el mismo procedimiento por tercera vez → skill; copias datos de un sistema que el agente no ve → conector; una tarea lateral inunda la conversación → subagente; quieres que algo pase siempre sin pedirlo → hook; otro repositorio necesita lo mismo → paquete o plugin [src-anthropic-cc-features]. Codex: añadir reglas solo tras ver errores repetidos y pedir una retrospectiva al agente cuando repite un error [src-openai-codex-best-practices]; conectar uno o dos MCP que desbloqueen un flujo real, no todos [src-openai-codex-best-practices].
- **K3.5 Las piezas se combinan.** El patrón más útil es MCP + skill: el conector da el acceso y la skill enseña el esquema y las consultas del equipo; otro es instrucción permanente breve + skill con la guía completa [src-anthropic-cc-features].
- **K3.6 Los controles deterministas también tienen límites.** Codex advierte que sus hooks de herramientas no son una barrera de control completa [src-openai-codex-hooks]. Claude Code separa lo que se hace cumplir con ajustes (denegar herramientas, sandbox) de la orientación de conducta en CLAUDE.md [src-anthropic-cc-memory]. [inferencia] Las reglas críticas combinan permiso o hook con la instrucción que explica su motivo; el detalle de seguridad va en M05 y M09.
- **K3.7 Conflictos entre capas.** GPT-6 Astra es más sensible a contradicciones entre skills y AGENTS.md [src-openai-latest-model]. [inferencia] Una regla vive en una sola capa; las demás remiten a ella.

**Ejemplo con Altiplano (para la serie intercalada).**

| Elemento del proyecto | Capa | Motivo |
| --- | --- | --- |
| "Corre `pytest -q` y el check de reconciliación antes de dar algo por terminado" | Instrucción permanente | Se necesita en cada sesión y el agente no lo adivina |
| Convención de nombres en `src/sql/` (CTE con prefijo `stg_`, sin `SELECT *`) | Regla por rutas / AGENTS.md anidado | Solo aplica al tocar SQL |
| Procedimiento de cierre semanal del snapshot (normalizar etapas, deduplicar, reconciliar, registrar) | Skill | Procedimiento de varios pasos que se usa una vez por semana |
| "No modificar `data/stage_probability.csv`" (política de FP&A) | Permiso o hook que bloquea la escritura + una línea con el motivo | Debe cumplirse siempre; el texto solo es una petición |
| Entender cómo se calculó la cobertura del trimestre anterior leyendo 30 archivos y el historial de Git | Subagente | La exploración inundaría el contexto principal |
| Consultar oportunidades en el CRM ficticio | MCP (simulado) o CLI, con una skill que documente campos y filtros | Datos externos; la skill enseña a usarlos |
| Descripción de cada carpeta del repositorio | Nada (se quita) | El agente lo deduce leyendo el árbol |
| Tipo de cambio del día | Nada en instrucciones; está en `data/fx_rates.csv` | Cambia a menudo; la instrucción solo dice dónde está |

**Conceptos erróneos (distractores)**

| ID | Creencia errónea | Por qué es errónea | Fuentes |
| --- | --- | --- | --- |
| CE-M03-10 | "Todo lo importante del proyecto va en el archivo de instrucciones." | Se paga en cada petición y un archivo inflado hace que se ignoren reglas; los procedimientos y referencias van a skills, lo parcial a reglas por rutas. | [src-anthropic-cc-best-practices][src-anthropic-cc-features] |
| CE-M03-11 | "Una prohibición escrita en una skill o en las instrucciones es una garantía." | Es una petición; la garantía la da un hook o un permiso. | [src-anthropic-cc-features] |
| CE-M03-12 | "Conviene conectar todos los MCP disponibles por si el agente los necesita." | Ocupan contexto y añaden riesgo; se empieza con uno o dos que desbloqueen un flujo real. | [src-openai-codex-best-practices][src-anthropic-cc-features] |
| CE-M03-13 | "Si conecto un MCP, ya no necesito explicarle nada al agente sobre esos datos." | El conector da acceso, no criterio; la skill enseña esquema, filtros y convenciones. | [src-anthropic-cc-features] |
| CE-M03-14 | "Describir la arquitectura archivo por archivo en las instrucciones ayuda al agente." | Es deducible del código y cuesta contexto en cada petición. | [src-anthropic-cc-best-practices] |

**Candidatos a ficha**

| Ficha | Producto · superficie | Capacidad | Verificado | Nota |
| --- | --- | --- | --- | --- |
| F3.1 Costo y carga por pieza | Claude Code · CLI | Tabla de cuándo carga y qué cuesta cada pieza; búsqueda de herramientas MCP activa por defecto (esquemas diferidos); `/context all` muestra tokens por herramienta MCP; aviso con salidas MCP > 10 000 tokens, tope por defecto de 25 000 (`MAX_MCP_OUTPUT_TOKENS`) | 2026-10-22 [src-anthropic-cc-features][src-anthropic-cc-mcp] | Volátil |
| F3.2 Cómo se superponen las capas | Claude Code · CLI | CLAUDE.md aditivo; skills y subagentes se anulan por nombre (skills: gestionada > usuario > proyecto); MCP: local > proyecto > usuario; hooks se suman | 2026-10-22 [src-anthropic-cc-features][src-anthropic-cc-mcp] | Volátil |
| F3.3 Equivalencias entre productos | Codex / Claude Code / Copilot | Reglas por ruta: AGENTS.md anidado / `.claude/rules` con `paths` / `*.instructions.md` con `applyTo`. Subagentes y hooks no son portables (formatos distintos) | 2026-10-22 (rutas) y 2026-10-21 (subagentes y hooks) [src-openai-codex-agentsmd][src-anthropic-cc-memory][src-github-copilot-instructions][src-openai-codex-hooks] | Volátil |

---

### Lección 4 — Agent Skills: estructura, una descripción que se active en los casos correctos y portabilidad

**Objetivo de lección (borrador).** Dada una tarea repetible, escribir una skill válida y un conjunto de consultas de activación con casi aciertos; dada una descripción, predecir en qué consultas se activará. → M03-OE4.

**Ideas clave**

- **K4.1 Qué es una skill.** Una carpeta con un `SKILL.md` (metadatos YAML + instrucciones en Markdown) y, si hace falta, `scripts/`, `references/` y `assets/`. Es un formato abierto, desarrollado originalmente por Anthropic y publicado como estándar abierto el 2025-12-18 [src-agentskills-site][src-agentskills-spec][src-anthropic-eng-skills].
- **K4.2 Campos del formato (especificación).** `name` obligatorio: 1–64 caracteres, minúsculas, dígitos y guiones, sin guion al inicio o al final ni dobles guiones, igual al nombre de la carpeta. `description` obligatorio: 1–1 024 caracteres, qué hace y cuándo usarla, con palabras clave. Opcionales: `license`, `compatibility` (≤ 500 caracteres, solo si hay requisitos de entorno), `metadata` (mapa de texto a texto) y `allowed-tools` (experimental). Validación con la biblioteca de referencia `skills-ref` [src-agentskills-spec].
- **K4.3 Carga progresiva en tres niveles.** Catálogo con nombre y descripción al inicio (unos 50–100 tokens por skill); cuerpo de `SKILL.md` al activarse (se recomienda < 5 000 tokens y < 500 líneas); recursos solo cuando las instrucciones los piden; los scripts se ejecutan y solo su salida entra al contexto [src-agentskills-spec][src-agentskills-client-impl][src-anthropic-skills-overview]. Por eso una skill puede empaquetar mucho más material del que cabe en la ventana [src-anthropic-eng-skills].
- **K4.4 La descripción decide la activación.** El agente compara la tarea con las descripciones; si son vagas o se solapan, carga la skill equivocada o ninguna [src-agentskills-descriptions][src-anthropic-cc-features]. Pautas:
  - decir qué hace **y** cuándo usarla, con los términos que usaría el usuario [src-agentskills-spec][src-anthropic-skills-bp];
  - centrarse en la intención del usuario, no en la implementación, y enumerar contextos aunque el usuario no nombre el dominio [src-agentskills-descriptions];
  - poner primero el caso de uso principal, porque las herramientas truncan descripciones cuando hay muchas skills [src-openai-codex-skills][src-anthropic-cc-skills];
  - decir también cuándo **no** debe activarse [src-openai-codex-skills];
  - ser breve: unas pocas frases [src-agentskills-descriptions].
- **K4.5 Probar la activación como un experimento.** Unas 20 consultas realistas (8–10 que deberían activarla y 8–10 que no); las negativas más valiosas son **casi aciertos** que comparten palabras con la skill pero piden otra cosa; varias corridas por consulta (3 como punto de partida) porque la conducta no es determinista; una tasa de activación con umbral (0,5 por defecto); separar entrenamiento (~60 %) y validación (~40 %) para no sobreajustar; no copiar palabras de las consultas fallidas, sino la categoría que representan; unas cinco iteraciones suelen bastar y se elige la mejor por la validación, no la última [src-agentskills-descriptions].
- **K4.6 No toda consulta debe activar una skill.** Los agentes suelen consultar skills solo cuando la tarea excede lo que resuelven con herramientas básicas; una petición trivial puede no activarla aunque coincida con la descripción [src-agentskills-descriptions]. [inferencia] Las consultas de prueba deben ser tareas donde la skill aporte.
- **K4.7 Qué escribir en el cuerpo.**
  - Solo lo que el agente no sabe: convenciones del proyecto, procedimientos del dominio, casos borde no obvios; "¿se equivocaría sin esta línea?" [src-agentskills-bp][src-anthropic-skills-bp].
  - Una sección de **trampas** (hechos del entorno que contradicen supuestos razonables), que crece con cada corrección [src-agentskills-bp].
  - Un valor por defecto en vez de un menú de opciones; procedimientos generalizables en vez de respuestas para un caso; nivel de prescripción según la fragilidad de la operación [src-agentskills-bp][src-anthropic-skills-bp].
  - Plantillas de salida, listas de pasos y bucles de validación (hacer → validar con un script → corregir → repetir) [src-agentskills-bp][src-anthropic-skills-bp].
  - Referencias a un solo nivel desde `SKILL.md`, diciendo **cuándo** leer cada archivo [src-agentskills-spec][src-agentskills-bp][src-anthropic-skills-bp].
  - Sin información con fecha que caduque dentro del cuerpo [src-anthropic-skills-bp].
- **K4.8 Construirla desde experiencia real y con evaluación.** Partir de una tarea real resuelta con el agente o de material propio del proyecto (runbooks, incidentes, comentarios de revisión), no de conocimiento genérico; medir primero sin skill, escribir lo mínimo que cierra las brechas y comparar contra esa línea base [src-agentskills-bp][src-anthropic-skills-bp][src-anthropic-eng-skills]. Leer las trazas de ejecución, no solo el resultado [src-agentskills-bp].
- **K4.9 Skills con efectos secundarios.** Las que despliegan, envían o borran se configuran para invocación manual; el mecanismo es propio de cada producto (ficha F4.2) [src-anthropic-cc-skills][src-openai-codex-skills].
- **K4.10 Seguridad.** Una skill da instrucciones y código: una maliciosa puede dirigir al agente a filtrar datos o ejecutar acciones ajenas a su propósito. Se usan solo de fuentes de confianza y se auditan todos sus archivos; las que traen contenido de URLs externas son especialmente riesgosas [src-anthropic-skills-overview][src-anthropic-eng-skills]. Las skills de proyecto llegan con el repositorio, que puede no ser de confianza [src-agentskills-client-impl].
- **K4.11 Portabilidad.** El formato es común; lo que cambia es dónde se instala, cómo se invoca, qué campos extra entiende cada herramienta y cuánto espacio da a las descripciones (fichas F4.1–F4.3). [inferencia] Lo portable es `name` + `description` + cuerpo + recursos; los controles de invocación se declaran aparte, por herramienta. Las skills subidas a una superficie de un proveedor no se sincronizan con otras superficies del mismo proveedor [src-anthropic-skills-overview].

**Ejemplo con Altiplano (caso resuelto o ejemplo para completar).**

```text
.agents/skills/pipeline-snapshot-reconciliation/
├── SKILL.md
├── scripts/reconcile.py          # compara dos snapshots y devuelve diferencias por región
└── references/kpi-definitions.md # fórmulas, unidades y supuestos A1–A4 (M02 §2)
```

```yaml
---
name: pipeline-snapshot-reconciliation
description: >
  Reconcilia un snapshot semanal de oportunidades de Altiplano contra el anterior:
  normaliza etapas, detecta duplicados y fechas vacías, recalcula pipeline abierto
  y ponderado por región en USD y explica cada diferencia. Úsala cuando pidan cerrar,
  validar, cuadrar o comparar snapshots del pipeline, aunque no digan "reconciliar".
  No la uses para editar políticas de FP&A (probabilidades, tipos de cambio, cuotas)
  ni para pronósticos.
---
```

Cuerpo (esquema): pasos con lista de control; `python scripts/reconcile.py <anterior> <actual>` como validación obligatoria; sección **Trampas** ("Negociacion" sin tilde es la misma etapa; los montos en EUR se convierten con la tasa de la fecha del snapshot; un `opp_id` duplicado no se suma dos veces); "lee `references/kpi-definitions.md` antes de recalcular un KPI"; formato fijo del informe (total por región, diferencias, filas excluidas con motivo).

Conjunto de consultas (muestra para el laboratorio):

| Consulta | ¿Debe activar? | Por qué |
| --- | --- | --- |
| "El comité quiere saber si el snapshot del 26-10 cuadra con el del 19-10 por región" | Sí | Pide comparar sin decir "reconciliar" |
| "cerramos la semana, revisa que no haya oportunidades repetidas en el archivo nuevo" | Sí | Paso del procedimiento, lenguaje informal |
| "¿Por qué el pipeline ponderado del Sur bajó entre los dos últimos snapshots?" | Sí | La diferencia se explica con el procedimiento |
| "Actualiza la probabilidad de Negociación al 70 %" | No (casi acierto) | Toca la política de FP&A, excluida |
| "Haz un forecast P50 del T4 con los datos del snapshot" | No (casi acierto) | Pronóstico, fuera de alcance |
| "Convierte `quota.csv` a JSON" | No (casi acierto) | Comparte archivos del dominio, no la tarea |

[inferencia] La descripción está en español porque el usuario escribirá en español; la especificación no fija idioma. Comprobar en la prueba de activación que funciona igual con consultas mezcladas (español con términos en inglés).

**Conceptos erróneos (distractores)**

| ID | Creencia errónea | Por qué es errónea | Fuentes |
| --- | --- | --- | --- |
| CE-M03-15 | "Una descripción corta y genérica ('Ayuda con el pipeline') basta: el agente leerá el cuerpo." | El cuerpo solo se lee si la descripción la activa; una genérica no se activa o se activa mal. | [src-agentskills-descriptions][src-agentskills-spec] |
| CE-M03-16 | "Para que se active, hay que añadir a la descripción las palabras exactas de las consultas que fallaron." | Es sobreajuste; se generaliza la categoría y se valida con consultas reservadas. | [src-agentskills-descriptions] |
| CE-M03-17 | "Una skill instalada en la carpeta de una herramienta funciona en todas." | El formato es común, pero las rutas de búsqueda difieren. | [src-openai-codex-skills][src-anthropic-cc-skills][src-github-agent-skills] |
| CE-M03-18 | "Si una consulta sencilla no activó la skill, la descripción está mal." | Los agentes suelen consultar skills solo en tareas que exceden sus herramientas básicas. | [src-agentskills-descriptions] |
| CE-M03-19 | "Una skill de un repositorio público popular es segura de instalar." | Una skill puede dirigir al agente a acciones ajenas a su propósito; se audita como software. | [src-anthropic-skills-overview][src-anthropic-eng-skills] |
| CE-M03-20 | "Cuanto más completa la skill (todos los casos borde), mejor." | El detalle exhaustivo dispersa al agente; rinde más una guía breve con un ejemplo y referencias bajo demanda. | [src-agentskills-bp] |

**Candidatos a ficha (verificados el 2026-10-22)**

| Ficha | Codex | Claude Code | Copilot |
| --- | --- | --- | --- |
| **F4.1 Rutas de búsqueda** | Repositorio: `.agents/skills` desde el directorio actual hasta la raíz · usuario: `~/.agents/skills` · admin: `/etc/codex/skills` · sistema (incluidas) · sigue enlaces simbólicos [src-openai-codex-skills] | Proyecto: `.claude/skills/<nombre>/SKILL.md` (del directorio de inicio a la raíz del repositorio; anidadas al tocar la subcarpeta) · personal: `~/.claude/skills` · gestionada · plugin · sincronizadas en `~/.claude/skills/synced/`; `.claude/commands/*.md` sigue funcionando. **No documenta `.agents/skills`** [src-anthropic-cc-skills][src-anthropic-cc-memory] | Proyecto: `.github/skills`, `.claude/skills` o `.agents/skills` · personal: `~/.copilot/skills` o `~/.agents/skills`; las rutas admitidas dependen de la superficie [src-github-agent-skills] |
| **F4.2 Invocación** | Explícita con `$` o `/skills`; implícita por descripción; `agents/openai.yaml` → `policy.allow_implicit_invocation: false` para solo explícita; desactivar con `[[skills.config]] enabled = false` [src-openai-codex-skills] | Explícita con `/nombre`; implícita por descripción; `disable-model-invocation: true` (solo manual, y su descripción sale del contexto), `user-invocable: false`, `skillOverrides` (`"name-only"`, `"off"`) [src-anthropic-cc-skills][src-anthropic-cc-features] | Implícita "cuando es relevante"; la página no detalla el mecanismo ni el control manual [src-github-agent-skills] |
| **F4.3 Presupuesto de descripciones** | Catálogo ≤ 2 % de la ventana (8 000 caracteres si se desconoce); acorta descripciones primero y puede omitir skills con aviso; `skills.max_context_tokens` (máx. 10 000) [src-openai-codex-skills] | Tope de 1 536 caracteres por entrada (`description` + `when_to_use`); catálogo al 1 % de la ventana; si desborda, quita descripciones de las menos usadas; `skillListingBudgetFraction`, `skillListingMaxDescChars`; `/skill-doctor` (v2.1.252+) [src-anthropic-cc-skills] | No documentado |
| **F4.4 Campos fuera del estándar** | Metadatos en `agents/openai.yaml` (interfaz, política, dependencias) [src-openai-codex-skills] | Extensiones: `when_to_use`, `arguments`, `argument-hint`, `disable-model-invocation`, `user-invocable`, `disallowed-tools`, `model`, `effort`, `context: fork`, `agent`, `background`, `hooks`, `paths`, `shell`; las ignora sin error, pero empaquetar para subir con claves fuera del estándar falla [src-anthropic-cc-skills] | No documentado |
| **F4.5 Colisión de nombres** | No las fusiona; ambas pueden aparecer [src-openai-codex-skills] | Gana por prioridad gestionada > usuario > proyecto [src-anthropic-cc-features] | No documentado |
| **F4.6 Ciclo de vida en la sesión** | No documentado | El contenido entra al invocarla y no se relee; tras compactar vuelve truncado (5 000 tokens por skill): lo importante, arriba [src-anthropic-cc-skills][src-anthropic-cc-context-window] | No documentado |
| **F4.7 Probar la activación** | `$skill-creator` para crear; "probar prompts contra la descripción" [src-openai-codex-skills] | Plugin `skill-creator` (evals con consultas que deben y no deben activar, comparación ciega); `claude plugin eval` con grader `tool_used: Skill` para skills de plugins; `claude plugin validate` (v2.1.233+) [src-anthropic-cc-skills] | `gh skill` para buscar e instalar [src-github-agent-skills] |

---

### Lección 5 — Continuidad: registro de decisiones, documento de traspaso, memoria automática frente a instrucciones escritas

**Objetivo de lección (borrador).** Dada una sesión interrumpida, escribir un documento de traspaso que otro agente pueda seguir sin historial, y repartir el conocimiento entre instrucciones, registro de decisiones y memoria. → M03-OE5.

**Ideas clave**

- **K5.1 Cada sesión empieza sin memoria de la anterior.** El conocimiento cruza sesiones solo por dos vías: archivos escritos que se cargan o se leen, y la memoria automática que la propia herramienta genera [src-anthropic-cc-memory][src-anthropic-eng-harnesses]. Anthropic compara el problema con ingenieros que trabajan por turnos sin notas de relevo [src-anthropic-eng-harnesses].
- **K5.2 La memoria automática ayuda a recordar; no es fuente de reglas.** Codex dice que las reglas obligatorias del equipo van en AGENTS.md o en documentación versionada, y que la memoria es una ayuda para recordar [src-openai-codex-memories]. Claude Code trata memoria e instrucciones como contexto y excluye de la memoria lo deducible del código y lo que ya dicen las instrucciones [src-anthropic-cc-memory]. Copilot valida cada hecho recordado contra el código actual mediante citas y borra lo que no se usa en 28 días [src-github-copilot-memory]. [inferencia] Lo que debe cumplirse siempre, o lo que otra persona o herramienta necesita, se escribe en un archivo versionado; la memoria puede guardar preferencias y pistas.
- **K5.3 La memoria no viaja entre herramientas ni, a veces, entre máquinas.** La de Claude Code es local de la máquina; la de Codex vive en su directorio de inicio; la de Copilot está en el servicio y por repositorio [src-anthropic-cc-memory][src-openai-codex-memories][src-github-copilot-memory]. [inferencia] Para traspasar trabajo entre herramientas solo sirven los archivos del repositorio.
- **K5.4 Artefactos de continuidad que funcionan** (experiencia de Anthropic con agentes de larga duración) [src-anthropic-eng-harnesses]:
  - un **registro de progreso** que cada sesión actualiza;
  - una **lista de funciones con estado** pasa/falla, en un formato estructurado que el agente solo actualiza (JSON resultó más robusto que Markdown);
  - **commits descriptivos** para volver a un estado sano;
  - un **script de arranque** para no redescubrir cómo correr el proyecto;
  - una **rutina de inicio**: leer el registro y el historial, revisar la lista, arrancar y correr una prueba de extremo a extremo **antes** de empezar algo nuevo.
  Fallos que estos artefactos previenen: intentar todo de una vez y quedarse sin contexto a mitad, y declarar terminado un proyecto incompleto [src-anthropic-eng-harnesses].
- **K5.5 Notas estructuradas fuera del contexto.** Archivos de tareas o de notas que el agente escribe y relee le permiten seguir el hilo en tareas con hitos [src-anthropic-eng-context]. El ExecPlan de OpenAI (archivado) mantiene secciones vivas de progreso, registro de decisiones y descubrimientos [src-openai-codex-execplans].
- **K5.6 Registro de decisiones.** Un registro breve por decisión, numerado y nunca reutilizado: título, contexto, decisión, estado (propuesta, aceptada, reemplazada) y consecuencias; cuando se revierte, el registro original se conserva marcado como reemplazado [src-nygard-adr]. [inferencia] Sirve a personas y agentes: responde "por qué está así", que ni el código ni la memoria explican.
- **K5.7 Especificación y sesión limpia.** Para trabajo grande, escribir la especificación en un archivo y ejecutarla en una sesión nueva, con contexto limpio [src-anthropic-cc-best-practices] (enlaza con M02 L4 sin repetirla).
- **K5.8 Instrucciones para la compactación.** Se puede pedir en el archivo de instrucciones que, al compactar, se conserven la lista de archivos modificados y los comandos de prueba [src-anthropic-cc-best-practices].
- **K5.9 Dónde vive cada cosa** [inferencia]:

| Conocimiento | Dónde | Por qué |
| --- | --- | --- |
| Reglas que valen siempre | Archivo de instrucciones | Se carga en cada sesión y en cada herramienta |
| Por qué se decidió algo | Registro de decisiones | Persiste, se revisa y no se pierde al compactar |
| Estado actual, siguiente paso, cómo verificar | Documento de traspaso | Lo necesita quien retoma, hoy |
| Preferencias personales, pistas | Memoria automática (opcional) | Útil, pero no garantizada ni compartida |
| Lo que se probó y falló | Registro de progreso o traspaso, breve | Evita repetir intentos |

**Ejemplo con Altiplano.** La sesión del viernes deja a medias la regla de duplicados (supuesto A3 de M02, "conservar el registro con `last_activity_date` más reciente", que FP&A aprobó ese día). El lunes la retoma otra persona con otra herramienta. Documento de traspaso propuesto (`docs/HANDOFF.md`):

```markdown
# Traspaso · 2026-10-23 · pipeline T4
## Estado
- H1 y H2 terminados (tests: `pytest -q` → 14 pasan). H3 (vista) sin empezar.
## Decisiones de esta sesión
- D-007 Duplicados: se conserva el registro con last_activity_date más reciente (aprobado por FP&A). Ver docs/DECISIONS.md.
## Siguiente paso
- Implementar H3 según docs/brief_pipeline.md §4.
## Cómo verificar antes de seguir
- `python scripts/reconcile.py data/opportunities_snapshot_2026-10-19.csv` → diferencia 0 por región.
## Probado y descartado
- Deduplicar por monto: falla con OPP-0031 (dos montos distintos).
```

La decisión va además a `docs/DECISIONS.md` con contexto y consecuencias; la regla resultante ("los duplicados se resuelven por actividad más reciente") pasa a la skill de reconciliación, no a la memoria.

**Conceptos erróneos (distractores)**

| ID | Creencia errónea | Por qué es errónea | Fuentes |
| --- | --- | --- | --- |
| CE-M03-21 | "Con la memoria automática activada ya no hace falta mantener el archivo de instrucciones." | Es una ayuda para recordar, no una garantía; lo obligatorio va en instrucciones versionadas. | [src-openai-codex-memories][src-anthropic-cc-memory] |
| CE-M03-22 | "El historial del chat es el registro de decisiones." | Se compacta, se limpia y no lo ve otra herramienta; el motivo de una decisión va a un registro escrito. | [src-anthropic-cc-context-window][src-nygard-adr] |
| CE-M03-23 | "Un buen traspaso cuenta todo lo que pasó en la sesión." | Lo útil es estado, decisiones, siguiente paso y cómo verificar; el relato completo llena el contexto de quien retoma. | [src-anthropic-eng-harnesses][src-anthropic-eng-context] |
| CE-M03-24 | "Al retomar con el traspaso, el agente puede empezar a implementar de inmediato." | La rutina documentada verifica primero el estado con una prueba de extremo a extremo. | [src-anthropic-eng-harnesses] |

**Candidatos a ficha (verificados el 2026-10-22)**

| Ficha | Producto · superficie | Capacidad | Madurez |
| --- | --- | --- | --- |
| F5.1 Memoria automática | Claude Code · CLI, IDE, desktop (local) | Activada por defecto en sesiones locales; `~/.claude/projects/<proyecto>/memory/` con `MEMORY.md` (se cargan las primeras 200 líneas o 25 KB); compartida entre worktrees del mismo repositorio; local de la máquina; `/memory` para ver, editar o desactivar | GA [src-anthropic-cc-memory] |
| F5.2 Memories | Codex · ChatGPT desktop, CLI, IDE | Desactivada por defecto; `~/.codex/memories/`; generada en segundo plano tras sesiones inactivas; `/memories` por chat; `[features] memories = true`; redacta secretos | La página no indica madurez [src-openai-codex-memories] |
| F5.3 Copilot Memory | Copilot · cloud agent, code review, CLI, autofix | Hechos por repositorio con citas validadas contra la rama actual; preferencias de usuario; borrado si no se usa en 28 días (el uso reinicia el plazo); activada por defecto en planes individuales | Public preview [src-github-copilot-memory] |
| F5.4 Retomar sesiones | Claude Code · CLI | `claude --continue`, `--resume`, `/rename` | GA [src-anthropic-cc-best-practices] |

---

### Lección 6 — Fuentes y recuperación justo a tiempo; límites de las citas

**Objetivo de lección (borrador).** Dada una pregunta sobre datos o documentos del proyecto, diseñar qué se precarga y qué se recupera, y auditar las citas de una respuesta. → M03-OE6. (El RAG completo está en M07; su evaluación, en M09.)

**Ideas clave**

- **K6.1 Precargar o recuperar justo a tiempo.** En vez de cargar todo al inicio, el agente puede guardar referencias ligeras (rutas, consultas, enlaces) y traer el contenido cuando lo necesita; los metadatos (nombres de carpeta, fechas) ayudan a elegir. Es más lento y necesita buena guía, así que suele convenir un esquema híbrido: precargar lo poco que siempre hace falta y explorar el resto bajo demanda [src-anthropic-eng-context].
- **K6.2 Señalar la fuente que responde.** Dirigir al agente a la fuente que contesta la pregunta (por ejemplo, el historial de Git de un módulo) en lugar de pedirle que adivine [src-anthropic-cc-best-practices]. [inferencia] En términos de contexto, una ruta precisa cuesta pocos tokens y evita una exploración amplia.
- **K6.3 Elegir el canal de recuperación por su costo de contexto.** Las herramientas de línea de comandos son la vía más eficiente en contexto para servicios externos [src-anthropic-cc-best-practices]; los conectores MCP ocupan contexto con sus herramientas y con salidas que pueden ser grandes (ficha F3.1) [src-anthropic-cc-features][src-anthropic-cc-mcp]. (La decisión CLI/API/MCP completa va en M07.)
- **K6.4 Recuperar menos y mejor.** Como la longitud por sí sola degrada el rendimiento, incluso con recuperación perfecta, conviene traer el fragmento pertinente y no el documento entero [src-arxiv-context-length][src-chroma-context-rot] [inferencia en la recomendación].
- **K6.5 Una cita válida no es una afirmación respaldada.**
  - En una evaluación humana de cuatro buscadores generativos (2023), solo el 51,5 % de las frases estaba plenamente respaldado por sus citas y solo el 74,5 % de las citas respaldaba su frase [src-arxiv-verifiability].
  - Herramientas comerciales de investigación legal con recuperación inventaron entre el 17 % y el 33 % de las veces, menos que un chat general pero lejos de cero (2024) [src-arxiv-legal-rag].
  - Las funciones de citas nativas pueden garantizar que la cita apunta a un pasaje real de los documentos entregados y extraer el texto citado [src-anthropic-citations]. [inferencia] Eso asegura que el pasaje existe, no que sostenga la afirmación: la verificación de apoyo sigue siendo trabajo del lector o de un grader (M09).
  - Mecanismos ya vistos en M02 que se aplican aquí: permitir "no lo sé", extraer citas textuales antes de responder y restringirse a los documentos entregados [src-anthropic-reduce-hallucinations].
- **K6.6 Lo recuperado es dato, no instrucción.** El contenido que llega de fuentes externas puede contener instrucciones maliciosas; los servidores que traen contenido externo exponen a inyección de instrucciones, y las skills que leen URLs externas son especialmente riesgosas [src-anthropic-cc-mcp][src-anthropic-skills-overview][src-owasp-llm01]. (Defensa completa en M09.)
- **K6.7 Las cifras no se recuperan, se calculan.** [inferencia] En Altiplano, el agente recupera la definición del KPI y la ruta del dato, pero el número sale del módulo determinista (M06 y M02 P2.9); una cita no sustituye a la reconciliación.

**Ejemplo con Altiplano.** El comité pregunta: "¿Por qué cayó la cobertura del Sur esta semana?". Estrategia híbrida: precargado, solo la instrucción "las definiciones están en `references/kpi-definitions.md`; las cifras salen de `out/pipeline_kpis.json`". Bajo demanda: el diccionario de datos, la salida del script de reconciliación y las filas afectadas por `opp_id`. La respuesta del agente dice: "La cobertura del Sur bajó de 1,4 a 1,1 porque OPP-0042 pasó a Perdida [cita: fila OPP-0042 del snapshot] y por descuentos de fin de trimestre [cita: `stage_probability.csv`]". Auditoría: la primera cita respalda la afirmación; la segunda apunta a un archivo real pero no dice nada de descuentos. Es una hipótesis presentada como hecho y debe marcarse como tal (criterio heredado de M02 E3.2). Las cifras 1,4 y 1,1 se comprueban contra `out/pipeline_kpis.json`, no contra la cita.

**Conceptos erróneos (distractores)**

| ID | Creencia errónea | Por qué es errónea | Fuentes |
| --- | --- | --- | --- |
| CE-M03-25 | "Si la respuesta trae citas a documentos reales, sus afirmaciones están respaldadas." | Una parte importante de las citas no respalda su frase; que el pasaje exista no prueba el apoyo. | [src-arxiv-verifiability][src-anthropic-citations] |
| CE-M03-26 | "Cargar todos los documentos al inicio evita que el agente se pierda algo." | El contexto largo degrada el uso de la información; conviene el esquema híbrido con recuperación bajo demanda. | [src-anthropic-eng-context][src-arxiv-context-length] |
| CE-M03-27 | "Con recuperación de documentos ya no hay invenciones." | Herramientas con recuperación siguen inventando en una fracción relevante de casos. | [src-arxiv-legal-rag] |
| CE-M03-28 | "Lo que el agente recupera de una fuente conectada es confiable y puede seguir sus instrucciones." | Es contenido no confiable que puede traer inyección de instrucciones. | [src-anthropic-cc-mcp][src-owasp-llm01] |

**Candidatos a ficha (verificados el 2026-10-22)**

| Ficha | Producto · superficie | Capacidad | Madurez |
| --- | --- | --- | --- |
| F6.1 Citas nativas | Claude API (y plataformas asociadas) | Citas sobre documentos con punteros válidos y texto citado extraído (no cuenta como tokens de salida); **incompatibles con salidas estructuradas** (error 400) | GA [src-anthropic-citations] |
| F6.2 Salidas grandes de conectores | Claude Code · CLI | Aviso con salidas MCP > 10 000 tokens; tope por defecto 25 000; resultados de texto > 50 000 caracteres se guardan en archivo | Volátil [src-anthropic-cc-mcp] |

---

## 4. Qué NO enseñar o enseñar con cautela

### 4.1 No enseñar

- **Tamaños de ventana, límites y versiones como contenido para memorizar.** Cambian por modelo y por versión (1 536 caracteres, 2 %, 32 KiB, v2.1.277…). Van en fichas y aparecen en los escenarios como dato dado, nunca como respuesta [inferencia, coherente con M02 §3 y `content-standard.md` §4.4].
- **"Más contexto es mejor" o "una ventana grande lo resuelve".** Contradice toda la evidencia de L1 [src-arxiv-context-length][src-arxiv-ruler].
- **La precedencia como anulación determinista.** Ver K2.3. Enseñarla así lleva a "arreglar" conflictos ordenando archivos en vez de eliminarlos.
- **Usar la memoria automática como sitio de reglas obligatorias** [src-openai-codex-memories].
- **Reglas de seguridad solo en texto** (instrucciones o skills) presentadas como protección [src-anthropic-cc-features].
- **Instalar skills de terceros sin auditar**, aunque sean populares [src-anthropic-skills-overview].
- **Atajos heredados.** `.claude/commands` sigue funcionando pero se fusionó en skills [src-anthropic-cc-skills]; escribir en el archivo propio "lee AGENTS.md" en vez de importarlo [src-anthropic-cc-memory]; un hook que imprime AGENTS.md al inicio duplica la carga en versiones que ya lo leen [src-anthropic-cc-memory].

### 4.2 Enseñar con cautela

| Tema | Cautela | Fuentes |
| --- | --- | --- |
| "Perdido en el medio" | Es de 2023 y sobre preguntas con varios documentos; en el experimento de Chroma (2025) la posición del dato apenas influyó. Enseñar que la posición **puede** importar y que la longitud y los distractores importan más, no una regla fija de "pon lo importante al principio" | [src-arxiv-lost-middle][src-chroma-context-rot] |
| Cifras de los estudios | NoLiMa (13 modelos), RULER (17), Du et al. (5) y Chroma (18) usan modelos de 2024–2025 y tareas sintéticas; Chroma es un informe técnico de una empresa de bases de datos vectoriales, sin revisión por pares. Usarlas como evidencia de la tendencia, no como tasas actuales | [src-arxiv-nolima][src-arxiv-ruler][src-arxiv-context-length][src-chroma-context-rot] |
| Persona gramatical de la descripción | Anthropic pide tercera persona ("Procesa…") porque la descripción se inyecta en el prompt de sistema; agentskills.io sugiere fraseo imperativo ("Usa esta skill cuando…"). Ambas coinciden en "qué hace + cuándo usarla". Enseñar el contenido y dejar la forma como variable que se prueba | [src-anthropic-skills-bp][src-agentskills-descriptions] |
| Prioridad entre skills de proyecto y de usuario | La guía de clientes dice que la convención universal es que el proyecto gane; Claude Code documenta usuario > proyecto; Codex no fusiona y muestra ambas. No enseñar una regla general: evitar nombres duplicados | [src-agentskills-client-impl][src-anthropic-cc-features][src-openai-codex-skills] |
| Enlaces simbólicos para compartir archivos | Funcionan en algunos casos, pero en Windows requieren permisos y Git puede descargarlos como texto. Preferir importaciones o copias documentadas | [src-anthropic-cc-memory] |
| Subagentes como ahorro | Protegen el contexto principal, no el gasto total | [src-anthropic-cc-subagents] |
| `allowed-tools` | Experimental en la especificación; su soporte varía entre herramientas | [src-agentskills-spec] |
| Material divulgativo | Cursos y blogs (Academy, DeepLearning.AI) sirven de referencia de temario, no como fuente técnica; fechar si se citan | [src-anthropic-academy][src-dlai-agent-skills] |

---

## 5. Propuesta de laboratorio: paquete de contexto para Altiplano

### 5.1 Objetivo observable

Dado el repositorio sintético `altiplano-pipeline/` y dos herramientas de agente a elección, el alumno entrega un **paquete de contexto** (un AGENTS.md breve, una skill en formato Agent Skills con su descripción probada y un documento de continuidad) y demuestra con evidencia que cada herramienta lo carga. Cubre M03-OE2, OE3, OE4 y OE5.

### 5.2 Entradas

1. **Repositorio sintético** (lo prepara el autor): datos de M02 §2.0, `src/kpis/`, `src/sql/`, `tests/`, `scripts/reconcile.py`, `docs/brief_pipeline.md`, `docs/DECISIONS.md` vacío.
2. **Inventario desordenado** de unas 15 líneas de "conocimiento del proyecto", mezcladas a propósito: reglas que valen siempre, convenciones solo de SQL, el procedimiento de cierre semanal, una prohibición crítica (no modificar `data/stage_probability.csv`), descripciones de carpetas deducibles del código, un tipo de cambio del día y una contradicción sembrada ("moneda de reporte USD" frente a "reportar en moneda local").
3. **Archivo trampa:** un `CLAUDE.local.md` ya presente (o el equivalente que provoque una omisión en la herramienta elegida) para que la verificación de carga encuentre un problema real.
4. **Notas de una sesión interrumpida** (texto sintético de unas 40 líneas, con decisiones, intentos fallidos y ruido) para destilar el traspaso.
5. **Fichas F2.1 y F4.1–F4.3** con su fecha de verificación.
6. **Restricciones:** solo datos sintéticos, sin secretos, sin servicios externos; la app no ejecuta nada; las pruebas se corren en el entorno del alumno.

### 5.3 Pasos

1. **Clasificar el inventario** (OE3): asignar cada línea a una capa, eliminar lo deducible o volátil, resolver la contradicción con una decisión registrada y marcar qué regla necesita un control determinista (basta con describirlo; configurarlo es opcional, porque el detalle es de M05).
2. **Escribir `AGENTS.md`** con lo que quedó como instrucción permanente. Objetivo orientativo **[H]**: 40 líneas o menos, sin descripciones de carpetas. Un `AGENTS.md` anidado en `src/sql/` si el alumno elige esa vía para la convención de SQL.
3. **Escribir la skill** `pipeline-snapshot-reconciliation` (u otra tarea repetible del inventario): `SKILL.md` válido según la especificación (comprobarlo con `skills-ref validate` si está disponible), sección de trampas, validación con `scripts/reconcile.py` y una referencia a un nivel.
4. **Probar la descripción** (OE4): al menos 10 consultas (5 que deberían activarla y 5 que no, de ellas 2 o más casi aciertos), umbral fijado **antes** de correr, 3 corridas por consulta en una herramienta **[H]** y al menos una corrida por consulta en la segunda. Registrar la tasa por consulta. Si falla, revisar la descripción una vez y repetir. Nivel avanzado: separar entrenamiento y validación [src-agentskills-descriptions].
5. **Instalar en dos herramientas** según F4.1 (un solo origen; copia o importación documentada en la otra ruta) y **verificar la carga** de AGENTS.md y de la skill con el mecanismo de cada una (F2.1, F4.2). Detectar la omisión causada por el archivo trampa, corregirla con el cambio mínimo y volver a verificar (OE2).
6. **Escribir el documento de continuidad** (OE5) a partir de las notas: estado, decisiones con motivo (y su entrada en `docs/DECISIONS.md`), siguiente paso, cómo verificar y lo probado y descartado. **Prueba de traspaso:** abrir una sesión nueva en la **otra** herramienta, darle solo "retoma el trabajo según `docs/HANDOFF.md`" y comprobar que ejecuta la verificación antes de seguir.
7. **Autoevaluación** con la rúbrica, citando la evidencia por criterio (`content-standard.md` §5).

### 5.4 Entregable

| Pieza | Contenido mínimo |
| --- | --- |
| `AGENTS.md` (+ archivo propio de herramienta si hace falta) | Instrucciones permanentes; nada deducible del código |
| `.agents/skills/<nombre>/` (o la ruta elegida) | `SKILL.md`, script y referencia |
| `activation-tests.md` | Consultas, etiqueta esperada, umbral, tasas por corrida, cambios a la descripción |
| `docs/HANDOFF.md` y entrada en `docs/DECISIONS.md` | Según el paso 6 |
| `load-evidence.md` | Por herramienta: producto, superficie, versión, ruta de instalación usada, comando o pantalla de verificación, salida pegada, problema encontrado y corrección |
| `clasificacion.md` | Inventario con su capa y motivo; regla crítica y control propuesto |

### 5.5 Rúbrica analítica

Escala: 0 Ausente · 1 Inicial · 2 Adecuado · 3 Sólido. Los criterios con ★ son críticos y no se compensan: ninguno puede quedar por debajo de 2 [inferencia, mismo esquema que M02 §5.5].

| Criterio | 1 Inicial | 2 Adecuado | 3 Sólido | Evidencia |
| --- | --- | --- | --- | --- |
| **R1 ★ Capas e instrucciones** | AGENTS.md copia el inventario o incluye descripciones de carpetas; la contradicción sigue | Cada línea en una capa con motivo; contradicción resuelta y registrada; AGENTS.md breve | Además, la regla crítica tiene control determinista propuesto con su motivo y lo volátil se sustituye por la ruta al dato | `clasificacion.md`, `AGENTS.md` |
| **R2 ★ Skill y prueba de activación** | Descripción genérica o sin "cuándo"; sin consultas negativas | Skill válida; descripción con qué y cuándo; 10 o más consultas con casi aciertos; umbral previo; tasas registradas | Además, revisión de la descripción que generaliza (sin copiar palabras de fallos) y validación con consultas reservadas | `SKILL.md`, `activation-tests.md` |
| **R3 ★ Verificación de carga en dos herramientas** | Afirma que "carga" sin evidencia, o solo en una herramienta | Evidencia pegada en ambas, con superficie, versión y ruta | Además, detecta la omisión sembrada, explica la causa con la ficha y verifica la corrección mínima | `load-evidence.md` |
| **R4 Continuidad** | Relato de la sesión o lista de tareas sin estado | Estado, decisiones con motivo, siguiente paso y verificación | Además, la prueba de traspaso en la otra herramienta muestra que el agente verificó antes de seguir; la decisión está en el registro | `HANDOFF.md`, transcripción breve |
| **R5 Portabilidad y mantenimiento** | Copias divergentes entre herramientas | Un solo origen y la instalación por herramienta documentada | Además, fecha de verificación y próxima revisión del paquete; sin secretos ni datos reales | Árbol del repositorio, notas |

**Ejemplo anclado "logrado" (sintético).** AGENTS.md de 28 líneas con comandos de prueba, moneda USD con la ruta al archivo de tasas, "los cálculos solo en `src/kpis/`" y la prohibición sobre las probabilidades con su motivo y un hook propuesto. Skill con 12 consultas (6/6, tres casi aciertos) y umbral 0,5 fijado antes; la primera versión falla en "cerramos la semana…" y la segunda añade "cerrar o validar la semana" sin copiar la frase. `load-evidence.md` muestra en una herramienta que AGENTS.md no se cargaba por el archivo local, la corrección con una importación y la lista de archivos cargados después.

**Ejemplo anclado "insuficiente" (sintético).** AGENTS.md de 120 líneas que describe cada carpeta y dice "nunca toques las probabilidades" sin control; descripción "Ayuda con snapshots"; dos consultas, ambas positivas; "verificado en las dos herramientas" sin salida pegada.

### 5.6 Cuaderno de transferencia (si F1-13 lo extiende a todos los laboratorios)

Decisión inicial (por ejemplo, "la convención de SQL va en AGENTS.md") → contraejemplo (la herramienta B no lee AGENTS.md anidados por defecto) → decisión revisada (regla por rutas en B o archivo anidado documentado) → evidencia (verificación de carga).

---

## 6. Registro de fuentes

Criterio de próxima revisión: volatilidad alta → 2027-01-22; media → 2027-04-22; baja → 2027-10-22. "Reabierta" = fuente ya registrada en `content/sources.json` o en `investigacion/` que se volvió a consultar el 2026-10-22. Las reutilizadas sin reabrir conservan su fecha.

| ID | Título | URL | Organización | Consulta | Afirmaciones que sustenta | Tipo | Volatilidad |
| --- | --- | --- | --- | --- | --- | --- | --- |
| src-anthropic-cc-memory *(reabierta)* | How Claude remembers your project | https://code.claude.com/docs/en/memory | Anthropic | 2026-10-22 | Contexto, no configuración; ubicaciones y orden de carga de CLAUDE.md; concatenación; subdirectorios bajo demanda; conflictos (elige cualquiera); AGENTS.md (v2.1.277+, condiciones, ajuste Project instructions, qué no lee); `@ruta` (4 saltos); `.claude/rules` con `paths`; < 200 líneas; 4 MiB; truncado bajo demanda (v2.1.309); auto memory (200 líneas / 25 KB, local); `/context`, `/memory`; compactación; enlaces simbólicos en Windows; `/doctor prompt-audit` | Primaria | Alta |
| src-anthropic-cc-features *(reabierta)* | Extend Claude Code | https://code.claude.com/docs/en/features-overview | Anthropic | 2026-10-22 | Cuándo usar cada pieza; disparadores para añadir capas; costo de contexto por pieza; skill frente a subagente, hook, MCP; guardrails en hooks; superposición de capas y prioridades; MCP + skill | Primaria | Alta |
| src-anthropic-cc-skills *(reabierta)* | Extend Claude with skills | https://code.claude.com/docs/en/skills | Anthropic | 2026-10-22 | Sigue Agent Skills; rutas (sin `.agents/skills`); campos estándar frente a extensiones; tope de 1 536 caracteres y presupuesto del 1 %; compactación (5 000 / 25 000 tokens); solución de problemas de activación; `skill-creator`, `claude plugin eval`; efectos secundarios | Primaria | Alta |
| src-anthropic-cc-best-practices *(reabierta)* | Best practices for Claude Code | https://code.claude.com/docs/en/best-practices | Anthropic | 2026-10-22 | El rendimiento se degrada al llenarse; `/clear` y dos correcciones; compactación dirigida e instrucciones de compactación; subagentes para investigar; qué incluir y excluir en CLAUDE.md; prueba de poda; patrones de fallo; CLI más eficiente en contexto; señalar la fuente; spec y sesión nueva; retomar sesiones | Primaria | Alta |
| src-anthropic-cc-context-window | Explore the context window | https://code.claude.com/docs/en/context-window | Anthropic | 2026-10-22 | Qué carga al inicio; qué sobrevive a la compactación (tabla); `/compact` con foco, `/rewind`, `/autocompact`, `/clear`; reglas con `paths` se pierden al compactar; ventana de 1M en modelos recientes | Primaria | Alta |
| src-anthropic-cc-subagents *(reabierta)* | Create custom subagents | https://code.claude.com/docs/en/sub-agents | Anthropic | 2026-10-22 | Qué carga un subagente; no hereda historial ni memoria; devuelve un resumen; cada subagente gasta tokens; aviso de 15 000 tokens en descripciones; fork frente a subagente nuevo; memoria persistente | Primaria | Alta |
| src-anthropic-cc-mcp | Connect Claude Code to tools via MCP | https://code.claude.com/docs/en/mcp | Anthropic | 2026-10-22 | Límites de salida (10 000 / 25 000 tokens, 50 000 caracteres); prioridad de alcances local > proyecto > usuario; riesgo de inyección con servidores que traen contenido externo | Primaria | Alta |
| src-anthropic-eng-context *(reabierta)* | Effective context engineering for AI agents (2025-09-29) | https://www.anthropic.com/engineering/effective-context-engineering-for-ai-agents | Anthropic | 2026-10-22 | Definición; degradación gradual y su causa; conjunto mínimo de tokens con señal; recuperación justo a tiempo e híbrida; compactación; notas estructuradas; subagentes con resúmenes de 1 000–2 000 tokens | Primaria | Baja |
| src-anthropic-eng-skills | Equipping agents for the real world with Agent Skills (2025-10-16; act. 2025-12-18) | https://www.anthropic.com/engineering/equipping-agents-for-the-real-world-with-agent-skills | Anthropic | 2026-10-22 | Definición; carga progresiva; contenido empaquetado prácticamente ilimitado; código como herramienta determinista; seguridad; publicación como estándar abierto; empezar por la evaluación | Primaria | Baja |
| src-anthropic-eng-harnesses | Effective harnesses for long-running agents (2025-11-26) | https://www.anthropic.com/engineering/effective-harnesses-for-long-running-agents | Anthropic | 2026-10-22 | Sesiones sin memoria; agente inicializador; registro de progreso, lista de funciones en JSON, commits, script de arranque; rutina de inicio con prueba de extremo a extremo; fallos de hacer todo a la vez y declarar terminado | Primaria | Baja |
| src-anthropic-skills-overview | Agent Skills (overview) | https://platform.claude.com/docs/en/agents-and-tools/agent-skills/overview | Anthropic | 2026-10-22 | Tres niveles con tokens (~100, < 5k, sin costo hasta leer); scripts solo aportan su salida; seguridad (fuentes de confianza, auditoría, URLs externas); las skills no se sincronizan entre superficies | Primaria | Media |
| src-anthropic-skills-bp | Skill authoring best practices | https://platform.claude.com/docs/en/agents-and-tools/agent-skills/best-practices | Anthropic | 2026-10-22 | Concisión; grados de libertad; probar con varios modelos; nombres; descripción en tercera persona con qué y cuándo; referencias a un nivel; tabla de contenido en referencias largas; flujos y bucles de validación; sin información con fecha; evaluaciones primero (al menos tres); Claude A / Claude B | Primaria | Media |
| src-anthropic-citations | Citations | https://platform.claude.com/docs/en/build-with-claude/citations | Anthropic | 2026-10-22 | Punteros válidos garantizados y texto citado extraído; ventajas frente a citas por prompt; incompatibles con salidas estructuradas; GA | Primaria | Alta |
| src-anthropic-reduce-hallucinations *(reutilizada de M02)* | Reduce hallucinations | https://platform.claude.com/docs/en/test-and-evaluate/strengthen-guardrails/reduce-hallucinations | Anthropic | 2026-10-21 | Permitir "no lo sé"; citas textuales; restringirse a los documentos | Primaria | Media |
| src-agentskills-site *(reabierta)* | Agent Skills Overview | https://agentskills.io | Agent Skills (proyecto abierto) | 2026-10-22 | Formato abierto; origen en Anthropic; carga progresiva en tres etapas; reutilización entre productos | Primaria | Media |
| src-agentskills-spec | Specification | https://agentskills.io/specification | Agent Skills (proyecto abierto) | 2026-10-22 | Estructura de carpetas; reglas de `name`, `description`, `compatibility`, `metadata`; `allowed-tools` experimental; ~100 tokens / < 5 000 tokens / < 500 líneas; referencias a un nivel; `skills-ref validate` | Primaria | Media |
| src-agentskills-descriptions | Optimizing skill descriptions | https://agentskills.io/skill-creation/optimizing-descriptions | Agent Skills (proyecto abierto) | 2026-10-22 | La descripción carga con la activación; fraseo imperativo e intención del usuario; ~20 consultas, casi aciertos; 3 corridas, umbral 0,5; 60/40; no copiar palabras de fallos; ~5 iteraciones; tareas simples pueden no activar | Primaria | Media |
| src-agentskills-bp | Best practices for skill creators | https://agentskills.io/skill-creation/best-practices | Agent Skills (proyecto abierto) | 2026-10-22 | Partir de experiencia real; leer trazas; añadir lo que el agente no sabe; unidades coherentes; detalle moderado; trampas; valores por defecto; procedimientos; plantillas; bucles de validación | Primaria | Media |
| src-agentskills-client-impl | How to add skills support to your agent | https://agentskills.io/client-implementation/adding-skills-support | Agent Skills (proyecto abierto) | 2026-10-22 | Catálogo de 50–100 tokens por skill; convención `.agents/skills`; proyecto sobre usuario como convención; confianza en skills de proyecto; proteger skills de la compactación | Primaria | Media |
| src-openai-codex-agentsmd *(reabierta)* | Custom instructions with AGENTS.md | https://learn.chatgpt.com/codex/agent-configuration/agents-md | OpenAI | 2026-10-22 | Descubrimiento global y de proyecto; un archivo por directorio; `AGENTS.override.md`; concatenación y prevalencia del cercano; 32 KiB (`project_doc_max_bytes`); nombres alternativos; cómo verificar | Primaria | Media |
| src-openai-codex-skills *(reabierta)* | Build skills | https://learn.chatgpt.com/codex/build-skills | OpenAI | 2026-10-22 | Rutas `.agents/skills` (repo, usuario), admin y sistema; enlaces simbólicos; duplicados; presupuesto del 2 % / 8 000 caracteres, `skills.max_context_tokens`; invocación `$` y `/skills`; `agents/openai.yaml`; describir cuándo sí y cuándo no; basada en agentskills.io | Primaria | Alta |
| src-openai-codex-best-practices *(reabierta)* | Best practices (Codex) | https://learn.chatgpt.com/guides/best-practices | OpenAI | 2026-10-22 | AGENTS.md breve y por capas; añadir reglas tras errores repetidos y retrospectiva; un hilo por unidad; `/compact`, `/fork`; hilos largos degradan; skills cuando se repite un prompt; uno o dos MCP; errores comunes | Primaria | Alta |
| src-openai-codex-memories | Memories (Codex) | https://learn.chatgpt.com/docs/customization/memories | OpenAI | 2026-10-22 | Memoria local desactivada por defecto; `~/.codex/memories/`; generación en segundo plano; `/memories`; claves de configuración; reglas obligatorias en AGENTS.md; ayuda para recordar; redacción de secretos | Primaria | Alta |
| src-openai-codex-execplans *(reutilizada de M02)* | Using PLANS.md for multi-hour problem solving (archivada) | https://developers.openai.com/cookbook/articles/codex_exec_plans | OpenAI | 2026-10-21 | Secciones vivas de progreso, registro de decisiones y descubrimientos | Primaria | Media |
| src-openai-codex-hooks *(reutilizada)* | Hooks (Codex) | https://learn.chatgpt.com/codex/hooks | OpenAI | 2026-10-21 | Los hooks de herramientas no son una barrera de control completa; formato propio (no portable) | Primaria | Alta |
| src-openai-latest-model *(reutilizada de M02)* | Using GPT-6 | https://developers.openai.com/api/docs/guides/latest-model | OpenAI | 2026-10-21 | GPT-6 Astra es sensible a conflictos entre skills y AGENTS.md | Primaria | Alta |
| src-github-copilot-instructions *(reabierta)* | Adding repository custom instructions | https://docs.github.com/en/copilot/how-tos/configure-custom-instructions/add-repository-instructions | GitHub | 2026-10-22 | Tipos de instrucción; `applyTo` y `excludeAgent`; AGENTS.md (gana el más cercano); CLAUDE.md/GEMINI.md en la raíz; ambos archivos se usan; prioridad personal > repositorio > organización y todos se entregan; lista References; code review lee la rama con cambios | Primaria | Alta |
| src-github-instructions-support | Support for different types of custom instructions | https://docs.github.com/en/copilot/reference/custom-instructions-support | GitHub | 2026-10-22 | Matriz de soporte por superficie de Copilot (repositorio, ruta, AGENTS.md, CLAUDE.md/GEMINI.md, personal, organización) | Primaria | Alta |
| src-github-agent-skills *(reabierta)* | About agent skills | https://docs.github.com/en/copilot/concepts/agents/about-agent-skills | GitHub | 2026-10-22 | Superficies con skills (incluida la Copilot app); rutas de proyecto y personales; dependencia de la superficie; `gh skill`; estándar abierto | Primaria | Alta |
| src-github-copilot-memory | About Copilot Memory | https://docs.github.com/en/copilot/concepts/agents/copilot-memory | GitHub | 2026-10-22 | Hechos por repositorio y preferencias; citas validadas contra la rama; 28 días; quién revisa y borra; activación por usuario; public preview | Primaria | Alta |
| src-microsoft-vscode-instructions *(reabierta)* | Custom instructions in VS Code (pág. 2026-10-21) | https://code.visualstudio.com/docs/copilot/customization/custom-instructions | Microsoft | 2026-10-22 | Tipos de archivo; AGENTS.md raíz y anidado experimental; CLAUDE.md con `chat.useClaudeMdFile`; "no hay orden general de precedencia"; cómo verificar | Primaria | Alta |
| src-agentsmd-site *(reabierta)* | AGENTS.md | https://agents.md | Agentic AI Foundation | 2026-10-22 | Formato abierto sin campos obligatorios; secciones sugeridas; gana el más cercano; el prompt del usuario prevalece; custodia de la AAIF; lista de herramientas sin Claude Code | Primaria | Media |
| src-lf-aaif *(reutilizada)* | Linux Foundation announces the formation of the Agentic AI Foundation | https://www.linuxfoundation.org/press/linux-foundation-announces-the-formation-of-the-agentic-ai-foundation | Linux Foundation | 2026-10-21 | AAIF (2025-12-09) custodia AGENTS.md y MCP | Primaria | Baja |
| src-mcp-intro *(reabierta)* | What is the Model Context Protocol? | https://modelcontextprotocol.io/docs/getting-started/intro | Model Context Protocol | 2026-10-22 | Definición de MCP como estándar abierto para conectar aplicaciones de IA con sistemas externos; documentación de la revisión 2026-07-28 | Primaria | Baja |
| src-owasp-llm01 *(reutilizada)* | LLM01:2025 Prompt Injection | https://genai.owasp.org/llmrisk/llm01-prompt-injection/ | OWASP GenAI Security Project | 2026-10-21 | Inyección indirecta por contenido externo | Primaria | Media |
| src-arxiv-lost-middle | Lost in the Middle: How Language Models Use Long Contexts (TACL, 2023) | https://arxiv.org/abs/2307.03172 | Liu et al. (Stanford y otros) | 2026-10-22 | Curva en U según la posición; también en modelos de contexto largo | Primaria (investigación) | Baja |
| src-arxiv-ruler | RULER: What's the Real Context Size of Your Long-Context Language Models? (COLM, 2024) | https://arxiv.org/abs/2404.06654 | Hsieh et al. (NVIDIA) | 2026-10-22 | 17 modelos; solo la mitad mantiene el rendimiento a 32K; ventana efectiva menor que la anunciada | Primaria (investigación) | Baja |
| src-arxiv-nolima | NoLiMa: Long-Context Evaluation Beyond Literal Matching (ICML, 2025) | https://arxiv.org/abs/2502.05167 | Modarressi et al. (Adobe Research, LMU) | 2026-10-22 | 13 modelos de ≥ 128K; 11 bajo el 50 % de su base a 32K sin coincidencia literal (versión 3 del artículo, 2025-07-09; T021-M03-01 se basó en una versión anterior y T027-01 lo corrigió) | Primaria (investigación) | Baja |
| src-arxiv-context-length | Context Length Alone Hurts LLM Performance Despite Perfect Retrieval (Findings of EMNLP, 2025) | https://arxiv.org/abs/2510.05381 | Du et al. | 2026-10-22 | Caídas de 13,9 %–85 % con recuperación perfecta, con relleno en blanco o enmascarado; recitar la evidencia como mitigación | Primaria (investigación) | Baja |
| src-chroma-context-rot | Context Rot: How Increasing Input Tokens Impacts LLM Performance (2025-07-14) | https://www.trychroma.com/research/context-rot | Chroma (Hong, Troynikov, Huber) | 2026-10-22 | 18 modelos; degradación con la longitud en tareas simples; distractores; prompt enfocado (~300 tokens) frente a completo (~113k); la posición apenas influyó | Informe técnico de empresa (sin revisión por pares) | Media |
| src-arxiv-verifiability | Evaluating Verifiability in Generative Search Engines (Findings of EMNLP, 2023) | https://arxiv.org/abs/2304.09848 | Liu, Zhang, Liang (Stanford) | 2026-10-22 | 51,5 % de frases plenamente respaldadas; 74,5 % de citas que respaldan su frase | Primaria (investigación) | Baja |
| src-arxiv-legal-rag | Hallucination-Free? Assessing the Reliability of Leading AI Legal Research Tools (2024) | https://arxiv.org/abs/2405.20362 | Magesh et al. (Stanford RegLab / HAI) | 2026-10-22 | Herramientas legales con recuperación inventan entre el 17 % y el 33 % | Primaria (preprint) | Baja |
| src-nygard-adr | Documenting Architecture Decisions (2011-11-15) | https://www.cognitect.com/blog/2011/11/15/documenting-architecture-decisions | Michael Nygard (Cognitect) | 2026-10-22 | Formato ADR: título, contexto, decisión, estado, consecuencias; numeración; reemplazadas se conservan | Primaria | Baja |
| src-anthropic-academy *(reutilizada)* | Anthropic Academy (catálogo) | https://anthropic.skilljar.com/ | Anthropic | 2026-10-21 | Referencia de temario (cursos de Agent Skills y subagentes) | Primaria (divulgativa) | Media |
| src-dlai-agent-skills *(reutilizada)* | Agent Skills with Anthropic | https://www.deeplearning.ai/short-courses/agent-skills-with-anthropic/ | DeepLearning.AI / Anthropic | 2026-10-21 | Referencia de temario (skills frente a herramientas, MCP y subagentes) | Secundaria | Media |

**Resumen del registro.** 45 fuentes en total.

- **Nuevas en el proyecto (22):** src-anthropic-cc-context-window, src-anthropic-cc-mcp, src-anthropic-eng-skills, src-anthropic-eng-harnesses, src-anthropic-skills-overview, src-anthropic-skills-bp, src-anthropic-citations, src-agentskills-spec, src-agentskills-descriptions, src-agentskills-bp, src-agentskills-client-impl, src-openai-codex-memories, src-github-instructions-support, src-github-copilot-memory, src-arxiv-lost-middle, src-arxiv-ruler, src-arxiv-nolima, src-arxiv-context-length, src-chroma-context-rot, src-arxiv-verifiability, src-arxiv-legal-rag, src-nygard-adr.
- **Ya registradas en `investigacion/curriculo-estado-del-arte.md` pero ausentes de `content/sources.json` (13):** src-anthropic-cc-skills, src-anthropic-cc-subagents, src-agentskills-site, src-openai-codex-skills, src-openai-codex-hooks, src-github-copilot-instructions, src-github-agent-skills, src-microsoft-vscode-instructions, src-agentsmd-site, src-lf-aaif, src-mcp-intro, src-anthropic-academy, src-dlai-agent-skills. Habrá que pasarlas a `content/sources.json` con las nuevas cuando se integre M03.
- **Ya en `content/sources.json` (10):** src-anthropic-cc-memory, src-anthropic-cc-features, src-anthropic-cc-best-practices, src-anthropic-eng-context, src-anthropic-reduce-hallucinations, src-openai-codex-agentsmd, src-openai-codex-best-practices, src-openai-codex-execplans, src-openai-latest-model, src-owasp-llm01. Las reabiertas hoy deberían actualizar su fecha de consulta y sus afirmaciones.

---

## 7. Huecos (lo que no pude verificar)

1. **Fechas de las páginas de producto.** Las páginas de Claude Code, Codex, GitHub y agentskills.io no muestran fecha de publicación ni de actualización (salvo VS Code, fechada el 2026-10-21). Las versiones mínimas de Claude Code (v2.1.277, v2.1.280, v2.1.283, v2.1.304, v2.1.309…) son lo único que permite fechar cambios.
2. **Codex y reglas por glob.** No encontré en la documentación de Codex un mecanismo de reglas con patrones de rutas equivalente a `paths` o `applyTo`; la equivalencia con AGENTS.md anidados es inferencia.
3. **Codex: importaciones.** No hallé una sintaxis documentada para importar otros archivos desde AGENTS.md.
4. **Copilot: AGENTS.md y CLAUDE.md a la vez.** La página dice que CLAUDE.md o GEMINI.md en la raíz son una "alternativa" a AGENTS.md, pero no aclara qué ocurre si el repositorio tiene ambos.
5. **Copilot: activación de skills.** La página de GitHub no explica cómo decide Copilot usar una skill, ni si existe invocación solo manual, ni el presupuesto de descripciones, ni la precedencia ante nombres repetidos.
6. **VS Code y CLAUDE.md.** La investigación del 2026-10-21 registró que CLAUDE.md estaba fuera del arnés de Copilot; la página fechada el 2026-10-21 que consulté hoy lo describe como archivo del arnés de Claude dentro de VS Code y añade el ajuste `chat.useClaudeMdFile` para el arnés local. No pude confirmar si el agente de Copilot en VS Code lo carga por defecto. Revisar antes de redactar F2.1.
7. **Copilot app.** La matriz de soporte de instrucciones no la cubre; la página de skills sí la menciona. Su soporte de instrucciones queda sin verificar.
8. **Enlaces simbólicos de skills en Claude Code.** Codex declara que sigue carpetas de skills enlazadas; para Claude Code solo verifiqué el soporte de enlaces en `.claude/rules/`. No sé si una skill enlazada desde `.agents/skills` a `.claude/skills` funciona en Claude Code; el laboratorio debe pedir evidencia en vez de suponerlo.
9. **Detección de activación de skills en Codex.** La guía de agentskills.io trae un script para Claude Code (`claude -p --output-format json`). No verifiqué cómo aparece la activación de una skill en los eventos JSONL de `codex exec --json`; el laboratorio deberá aceptar evidencia manual en Codex.
10. **Búsqueda de herramientas MCP en Claude Code.** La página de funciones afirma que está activa por defecto, pero la sección específica de la página de MCP quedó fuera del fragmento leído; umbrales y versión sin verificar.
11. **Umbrales de compactación automática.** No abrí la tabla de umbrales por modelo de Claude Code ni encontré el equivalente en Codex.
12. **Madurez de Codex Memories.** La página no indica si es GA, beta o experimental, ni restricciones regionales actuales; un resultado de búsqueda mencionaba que al lanzarse no estaba disponible en el EEE, Reino Unido y Suiza, pero no lo confirmé en la página actual.
13. **Publicación definitiva de Magesh et al.** Solo verifiqué el preprint de arXiv (2024); no confirmé si se publicó después en una revista y con qué cifras.
14. **Estudios con modelos de 2026.** Las cifras de degradación vienen de modelos de 2023–2025. No encontré un estudio independiente con los modelos actuales (GPT-6, Claude 5.x, Gemini 4); los proveedores tampoco publican curvas propias en las páginas consultadas.
15. **Idioma de la descripción de una skill.** Ninguna fuente trata si una descripción en español se activa igual de bien con consultas en español, en inglés o mezcladas. Es una pregunta que el laboratorio puede responder con datos del alumno.
16. **Gobernanza de Agent Skills.** agentskills.io dice que el estándar está abierto a contribuciones, pero no encontré si lo custodia una fundación (como AGENTS.md y MCP con la AAIF) o sigue bajo Anthropic.

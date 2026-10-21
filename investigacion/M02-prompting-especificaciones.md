# M02 — Prompting avanzado y especificaciones · Base de investigación

- **Archivo:** `investigacion/M02-prompting-especificaciones.md`
- **Fecha de investigación:** 2026-10-21 (todas las fuentes consultadas ese día)
- **Elaborado por:** subagente de investigación (Claude Code) para el autor de M02
- **Estado:** base factual y conceptual para redactar las 6 lecciones, el laboratorio y ~22 preguntas de escenario. No es contenido final para el alumno.
- **Convenciones:**
  - `[src-…]` = ID de fuente del registro (§6). Una afirmación con ID está documentada en esa fuente (parafraseada).
  - `[inferencia]` = conclusión, síntesis o recomendación propia que ninguna fuente afirma literalmente.
  - "Volátil" = depende de producto, modelo o versión; verificado el 2026-10-21.
  - Se indica producto y entorno (API, CLI, IDE, app, cloud). Una capacidad de un producto no se atribuye a todo el proveedor.
  - Citas textuales: como máximo una por fuente y de menos de 15 palabras.
- **Datos:** todos los ejemplos financieros son sintéticos (empresa ficticia), conforme a plan.md §2. Ninguna cifra de este documento es real.

---

## 1. Resumen ejecutivo

1. Anthropic, OpenAI, Google y GitHub coinciden en lo esencial: objetivo con su porqué, contexto pertinente, restricciones, formato de salida y un criterio de "terminado" verificable (Codex: Goal / Context / Constraints / Done when) [src-openai-codex-best-practices][src-anthropic-prompting-bp][src-github-copilot-prompt-eng].
2. Con agentes de código, la palanca principal es darles una comprobación ejecutable (tests, build, captura) y exigir evidencia en lugar de afirmaciones [src-anthropic-cc-best-practices].
3. Las salidas estructuradas (JSON Schema) garantizan la forma, no la verdad. Los tres proveedores piden validar los valores en la aplicación, y el subconjunto de JSON Schema que admite cada uno es distinto [src-openai-structured-outputs][src-anthropic-structured-outputs][src-google-structured-output].
4. Exigir el razonamiento interno en texto ya es contraproducente: en sus modelos recientes, Anthropic lo rechaza con un refusal `reasoning_extraction`; OpenAI y Google no exponen el razonamiento en bruto [src-anthropic-refusals][src-openai-reasoning][src-google-thinking]. Hay que pedir decisiones, supuestos y evidencias.
5. No hay recetas universales: cuántos ejemplos usar, cuánto énfasis poner, si pedir autoverificación y con cuánto detalle prescribir cambian según el modelo y el nivel de esfuerzo. Los propios proveedores piden volver a medir con evals propias [src-anthropic-prompting-bp][src-openai-gpt56-model-guidance].
6. Comparar prompts exige casos fijos, varios ensayos (los modelos no son deterministas), calificadores calibrados y leer las transcripciones [src-anthropic-evals-agents][src-openai-eval-best-practices]. Fecha crítica: OpenAI Evals pasa a solo lectura el 2026-10-31 y cierra el 2026-11-30 [src-openai-evals-guide].
7. Spec-driven development (Spec Kit, Kiro) aporta artefactos revisables y marcas de ambigüedad, pero resulta costoso en tareas pequeñas [src-github-speckit-quickstart][src-thoughtworks-sdd-tools].

---

## 2. Lecciones

### 2.0 Caso transversal sintético (para todos los ejemplos)

**Altiplano Industrial S.A. (empresa ficticia).** Distribuidor B2B de equipos industriales con tres regiones comerciales (Norte, Centro, Sur). FP&A necesita un dashboard del pipeline de oportunidades para el comité comercial semanal.

Datos propuestos (sintéticos, unas 40 filas, inspeccionables a mano):

| Archivo | Contenido | Nota didáctica |
| --- | --- | --- |
| `opportunities_snapshot_2026-10-19.csv` | `opp_id, account, region, owner, stage, amount, currency, created_date, expected_close_date, last_activity_date, snapshot_date` | Problemas sembrados: un `opp_id` duplicado, una `expected_close_date` vacía, la etapa escrita "Negociacion" (sin tilde), montos en EUR y oportunidades abiertas con fecha de cierre vencida. |
| `stage_probability.csv` | Prospección 10 %, Calificación 25 %, Propuesta 50 %, Negociación 75 %, Ganada 100 %, Perdida 0 % | Es una **política de FP&A** (supuesto de negocio). El modelo no la infiere. |
| `fx_rates.csv` | Tasas fijas a la fecha del snapshot (base USD) | Sin moneda y fecha definidas, "pipeline" es ambiguo. |
| `quota.csv` | Cuota trimestral por región | Necesaria para la cobertura. |
| Calendario fiscal | Decisión del caso: año fiscal = año calendario; T4 = oct–dic 2026 | Hay que declararlo. |

[inferencia] Las definiciones de KPI (pipeline ponderado, cobertura, oportunidad vencida, oportunidad en riesgo) son convenciones de gestión comercial que varían por empresa. El curso debe presentarlas como decisiones que hay que especificar, nunca como reglas financieras oficiales (plan.md §13).

---

### Lección 1 — Objetivo, usuario y resultado esperado

**Principios duraderos**

- **P1.1 Declarar el objetivo y su porqué.** Explicar la motivación de una instrucción le permite al modelo generalizar y dar respuestas más dirigidas [src-anthropic-prompting-bp]. La guía de Claude Fable 5 recomienda decir para qué tarea mayor es, para quién y qué habilitará el resultado [src-anthropic-prompting-fable5].
- **P1.2 Cuatro bloques mínimos para un agente de código:** objetivo, contexto, restricciones y criterio de término ("Done when": tests que pasan, comportamiento que cambia, bug que deja de reproducirse) [src-openai-codex-best-practices]. Para el Copilot cloud agent, GitHub pide algo análogo (descripción del problema, criterios de aceptación completos y archivos relevantes) y sugiere tratar el issue asignado como si fuera el prompt [src-github-copilot-agent-bp][src-github-copilot-prompt-eng].
- **P1.3 Prueba del colega:** si una persona sin contexto se confundiría con el prompt, el modelo también [src-anthropic-prompting-bp].
- **P1.4 Describir el resultado, no cada paso.** OpenAI describe los modelos de razonamiento como un "colega senior" al que se le dan metas, y los modelos GPT como un "colega junior" que necesita instrucciones precisas [src-openai-prompt-engineering]. La guía de GPT-5.6 pide prompts centrados en el resultado: meta, contexto, restricciones, evidencia requerida, criterios de éxito y formato, sin guionizar cada paso [src-openai-gpt56-model-guidance]. Anthropic observa que, con thinking activo, una instrucción general suele dar mejor razonamiento que un plan paso a paso escrito a mano [src-anthropic-prompting-bp].
- **P1.5 Declarar el tipo de entregable y el nivel de autonomía.** GPT-5.6 propone tres niveles: las peticiones de explicar, revisar, diagnosticar o planificar llevan a inspeccionar e informar; las de cambiar, construir o corregir permiten ediciones locales dentro del alcance; las escrituras externas, acciones destructivas, compras o ampliaciones de alcance requieren confirmación [src-openai-gpt56-model-guidance]. Anthropic documenta que "¿puedes sugerir cambios?" tiende a producir sugerencias y no ediciones [src-anthropic-prompting-bp]. Su guía de Fable 5 indica que, cuando el usuario describe un problema, el entregable es la evaluación [src-anthropic-prompting-fable5].
- **P1.6 Separar el qué y el porqué del cómo.** En Spec Kit, la especificación recoge metas, comportamiento y requisitos sin mencionar el stack. El plan recoge stack, arquitectura e interfaces [src-github-speckit-quickstart][src-github-speckit-sdd-doc].
- **P1.7 Hacer explícito el valor para el usuario.** En BDD, la plantilla de historia (rol, capacidad, beneficio) sirve para detectar historias sin beneficio real [src-dannorth-bdd]. INVEST exige que la historia sea valiosa para el cliente [src-xp123-invest].
- **P1.8 Fijar el alcance en ambas direcciones.** Pedir explícitamente "ir más allá de lo básico" cambia el resultado [src-anthropic-prompting-bp]. A la vez, algunos modelos añaden tests, documentación o archivos no solicitados si no se acota el alcance [src-anthropic-prompting-sonnet55]. [inferencia] Lo que el prompt no fija, lo decide el modelo.

**Detalles volátiles (verificados 2026-10-21)**

- Codex (CLI, extensión IDE, app de escritorio): la guía recomienda GPT-6.1 Sol cuando esté disponible y sugiere esfuerzos de razonamiento iniciales distintos para GPT-6 Luna y GPT-6 Astra. Los niveles van de low a extra high. La página no tiene fecha [src-openai-codex-best-practices].
- GPT-6 Astra (API) pide aclaraciones con más frecuencia que los modelos anteriores. OpenAI sugiere indicarle que actúe sin pedir permiso en tareas reversibles, de solo lectura, revisiones y correcciones [src-openai-latest-model][src-openai-prompt-guidance-gpt6].
- Claude Sonnet 5.5 (API) tiende a añadir tests, documentación y archivos pequeños no pedidos en cualquier nivel de esfuerzo, más cuanto mayor es. Anthropic publica un párrafo para limitarlo [src-anthropic-prompting-sonnet55].
- Claude Fable 5 (API) sigue mejor las instrucciones: una instrucción breve basta para orientar conductas que antes había que enumerar [src-anthropic-prompting-fable5].

**Desacuerdos y matices entre proveedores**

- **Cuánto prescribir.** OpenAI distingue entre modelos GPT y modelos de razonamiento [src-openai-prompt-engineering]. GitHub recomienda empezar con la meta general y luego listar requisitos específicos por prioridad [src-github-copilot-prompt-eng]. GPT-5.6 sugiere aligerar los prompts [src-openai-gpt56-model-guidance]. [inferencia] No se contradicen: el grado de detalle depende del modelo, de la tarea y del riesgo de dejar decisiones al agente.
- **El ejemplo del dashboard de Anthropic.** En la guía de Anthropic, la versión "más efectiva" de "Crea un dashboard analítico" pide incluir tantas funciones como sea posible [src-anthropic-prompting-bp]. [inferencia] Ilustra cómo declarar el nivel de ambición, no cómo especificar una herramienta financiera verificable. Conviene usarlo en clase como contraste.

**Ideas de ejemplo trabajado**

- **E1.1 De petición a objetivo.** Petición del CFO ficticio: "Necesito un dashboard del pipeline para el lunes; que se vea bien y muestre cómo vamos." Objetivo reescrito: "Para el comité comercial del lunes (usuarias: directora comercial y analista de FP&A), mostrar si el pipeline abierto del T4-2026 cubre la cuota restante en cada región, y listar las 10 oportunidades de más de USD 100 000 con mayor riesgo de no cerrar en el trimestre, para decidir acciones de seguimiento." En la reescritura quedan explícitos el usuario, la decisión, el periodo y el umbral. Lo que sigue sin resolver pasa a supuestos (Lección 2).
- **E1.2 Mismo dataset, dos intenciones.** "Explícame por qué cayó el pipeline ponderado" es un diagnóstico: el entregable es un informe con cifras y evidencias, sin tocar código. "Agrega un gráfico de pipeline ponderado por semana" es un cambio acotado. Ejercicio: clasificar seis peticiones por tipo de entregable y nivel de autonomía.

---

### Lección 2 — Contexto pertinente, restricciones y supuestos

**Principios duraderos**

- **P2.1 El contexto específico rinde más que el abundante.** Claude Code recomienda acotar la tarea (archivo, escenario, preferencia de pruebas), señalar la fuente que responde la pregunta, apuntar a patrones existentes y describir el síntoma, la ubicación probable y cómo se ve "arreglado" [src-anthropic-cc-best-practices].
- **P2.2 El contexto es finito.** El rendimiento se degrada a medida que se llena la ventana de contexto. Mezclar tareas en una sesión, o investigar sin acotar, la llena de ruido [src-anthropic-cc-best-practices]. Codex recomienda una conversación por unidad coherente de trabajo [src-openai-codex-best-practices]; Copilot, una conversación nueva por tarea [src-github-copilot-prompt-eng].
- **P2.3 Reglas duraderas en archivos de instrucciones, reglas de la tarea en el prompt.** AGENTS.md, CLAUDE.md o `.github/copilot-instructions.md` deben ser breves, comprobados y podados. Un archivo inflado hace que se ignoren reglas [src-openai-codex-best-practices][src-anthropic-cc-best-practices][src-github-copilot-agent-bp]. (El tema se profundiza en M03.)
- **P2.4 Restricción con motivo.** Anthropic muestra que justificar una prohibición (por ejemplo, "se leerá con síntesis de voz, así que no uses puntos suspensivos") permite al modelo generalizar [src-anthropic-prompting-bp].
- **P2.5 Evitar contradicciones y repeticiones.** La guía de GPT-5 (archivada) documenta que las instrucciones contradictorias dañan más a los modelos que siguen instrucciones con precisión, porque gastan razonamiento en reconciliarlas [src-openai-gpt5-prompting-guide]. GPT-5.6 recomienda enunciar cada regla una sola vez y concentrar la política de aprobación en un solo lugar [src-openai-gpt56-model-guidance]. GPT-6 Astra es más sensible a conflictos entre skills y AGENTS.md [src-openai-latest-model].
- **P2.6 Énfasis con moderación.** El lenguaje agresivo ("CRITICAL: You MUST…"), que antes compensaba el subuso de herramientas, puede provocar sobreuso en modelos Claude recientes [src-anthropic-prompting-bp]. Claude Code sugiere marcar "IMPORTANT" solo en la línea que el agente se salta: si todo lleva énfasis, nada destaca [src-anthropic-cc-best-practices].
- **P2.7 Supuestos visibles.** Hay cuatro mecanismos documentados:
  - Permitir explícitamente "no tengo información suficiente" reduce la información falsa [src-anthropic-reduce-hallucinations].
  - Marcar `[NEEDS CLARIFICATION]` en la especificación en lugar de adivinar [src-github-speckit-sdd-doc].
  - Resolver la ambigüedad dentro del plan y registrar la decisión con su motivo en un Decision Log (ExecPlan) [src-openai-codex-execplans].
  - Decirle al modelo qué ambigüedades deben llevarlo a preguntar [src-openai-gpt56-model-guidance].

  Gemini recomienda además explicar los términos o parámetros ambiguos [src-google-prompting-strategies].
- **P2.8 Límites de acción.** Declarar qué acciones requieren confirmación: destructivas, difíciles de revertir o visibles para terceros [src-anthropic-prompting-bp][src-anthropic-prompting-fable5][src-openai-gpt56-model-guidance].
- **P2.9 Cálculo determinista fuera del modelo.** Google recomienda usar ejecución de código para aritmética, conteos y cálculos en lugar del razonamiento del modelo sin ayuda [src-google-prompting-strategies]. Anthropic sugiere restringir el modelo a la información provista cuando corresponde [src-anthropic-reduce-hallucinations]. Esto encaja con plan.md §2: separar los cálculos financieros deterministas del análisis narrativo.
- **P2.10 Documentos largos primero, pregunta al final.** Anthropic y Gemini lo recomiendan. Anthropic reporta mejoras de hasta un 30 % en pruebas internas con entradas complejas de varios documentos [src-anthropic-prompting-bp][src-google-prompting-strategies].

**Detalles volátiles (verificados 2026-10-21)**

- Claude Code (CLI/IDE): `/init` genera un CLAUDE.md inicial, `/context` confirma qué se cargó, `/doctor` propone recortes y la sintaxis `@ruta` importa archivos [src-anthropic-cc-best-practices].
- Codex: AGENTS.md admite tres niveles (global en `~/.codex`, de repositorio y de subdirectorio); prevalece el más cercano. `/init` crea la plantilla inicial. `config.toml` se aplica por capas (personal, repositorio, línea de comandos) [src-openai-codex-best-practices].
- Copilot: instrucciones en `.github/copilot-instructions.md` y en `.github/instructions/**/*.instructions.md` (con `applyTo`). También reconoce AGENTS.md, CLAUDE.md y GEMINI.md [src-github-copilot-agent-bp].
- API de OpenAI: `instructions` y los mensajes `developer` tienen prioridad sobre los mensajes `user` (analogía: definición de función frente a argumentos) [src-openai-prompt-engineering].

**Desacuerdos y matices**

- **Preguntar o asumir.**
  - Spec Kit marca la ambigüedad y pregunta (`clarify` antes de `plan`) [src-github-speckit-quickstart].
  - El ExecPlan la resuelve, registra la decisión y no devuelve decisiones al lector [src-openai-codex-execplans].
  - La guía de Fable 5 pide actuar cuando hay información suficiente y pausar solo ante acciones destructivas o irreversibles, cambios reales de alcance o insumos que solo el usuario puede dar [src-anthropic-prompting-fable5].
  - GPT-6 Astra pregunta más por defecto [src-openai-latest-model].
  - La plantilla agéntica de Gemini prefiere llamar a la herramienta con la información disponible antes que preguntar [src-google-prompting-strategies].

  [inferencia] Síntesis para enseñar: la especificación debe decir qué ambigüedades se preguntan (las que cambian una cifra visible, el alcance o algo irreversible) y cuáles se resuelven con un supuesto registrado.
- **Orden del prompt.** OpenAI sugiere identidad, instrucciones, ejemplos y contexto, con el contexto cerca del final porque cambia en cada petición, y aclara que el mejor orden varía por modelo [src-openai-prompt-engineering]. Anthropic y Gemini ponen los documentos largos arriba y la pregunta al final. Según GitHub, Copilot da más peso a lo que aparece al principio y al final [src-github-copilot-prompt-eng]. [inferencia] El orden es una variable que hay que probar, no una regla.
- **Formular en positivo.** Anthropic recomienda decir qué hacer en lugar de qué no hacer, sobre todo para el formato [src-anthropic-prompting-bp]. Gemini incluye "qué evitar" como restricción legítima [src-google-prompting-strategies]. [inferencia] Las prohibiciones duras siguen siendo necesarias ("no modifiques `data/`"). Lo desaconsejable es definir el resultado solo por negación.

**Ideas de ejemplo trabajado**

- **E2.1 Paquete de contexto y registro de supuestos.** El paquete incluye:
  - diccionario de datos (columnas, tipos, unidades);
  - tabla de probabilidades por etapa, con dueño "FP&A";
  - tipo de cambio fijo al 2026-10-19 y calendario fiscal;
  - un componente existente que sirve de patrón;
  - una lista "fuera de alcance" (login, envío de correos, forecast probabilístico).

  Registro de supuestos:

  | ID | Supuesto | Dueño | Estado | ¿Cambia cifras visibles? | Política |
  | --- | --- | --- | --- | --- | --- |
  | A1 | Moneda de reporte USD con `fx_rates.csv` | FP&A | Aprobado | Sí | Ya decidido |
  | A2 | "Vencida" = abierta con `expected_close_date` < `snapshot_date` | Analista | Propuesto | Sí | Confirmar antes de H2 |
  | A3 | Duplicados: conservar el registro con `last_activity_date` más reciente | — | Pendiente | Sí | **Preguntar** |
  | A4 | "Negociacion" se normaliza a "Negociación" y se registra | Analista | Propuesto | No | Decidir y registrar |

- **E2.2 Contraejemplo.** El agente "completa" una etapa sin probabilidad con un valor plausible inventado. Discusión: debe ser una pregunta o una tabla de entrada. Una restricción con motivo evita la invención: "las probabilidades son una política de FP&A; si falta una etapa, detente y repórtalo".

---

### Lección 3 — Ejemplos y contraejemplos

**Principios duraderos**

- **P3.1 Los ejemplos orientan formato, tono y estructura** de forma muy fiable. Deben ser pertinentes (parecidos al caso real), diversos (con casos borde) y estar delimitados con etiquetas para no confundirse con instrucciones. Anthropic sugiere de 3 a 5 [src-anthropic-prompting-bp].
- **P3.2 Los ejemplos también enseñan patrones superficiales.** Hace falta diversidad para que el modelo no copie rasgos no deseados [src-anthropic-prompting-bp]. Gemini advierte que demasiados ejemplos producen sobreajuste y que todos deben compartir el mismo formato (etiquetas, espacios, separadores) [src-google-prompting-strategies].
- **P3.3 Las pruebas funcionan como ejemplos.** GitHub sugiere pedir primero las pruebas y luego la función que las satisface [src-github-copilot-prompt-eng]. Claude Code muestra casos de prueba concretos dentro del prompt (entrada → resultado esperado) y pide ejecutarlos [src-anthropic-cc-best-practices].
- **P3.4 El código existente sirve de ejemplo:** se puede señalar un componente del repositorio como patrón a seguir [src-anthropic-cc-best-practices].
- **P3.5 Contraejemplos como casos balanceados.** En evaluación hay que incluir casos donde la conducta debe ocurrir y casos donde no debe, para evitar la optimización unilateral [src-anthropic-evals-agents]. Para el formato, conviene describir el objetivo en positivo [src-anthropic-prompting-bp]. [inferencia] En una especificación, un contraejemplo útil es un caso concreto con su salida esperada ("si la fecha de cierre es nula, la fila va al panel de calidad de datos y no al KPI"), no una lista de prohibiciones abstractas.
- **P3.6 Con thinking, los ejemplos trabajados orientan cómo razona el modelo.** Anthropic sugiere presentar cada uno como problema, método y respuesta esperada [src-anthropic-prompting-bp].
- **P3.7 Los escenarios concretos son especificación.** En Gherkin, un Scenario es una ilustración concreta de una regla de negocio, idealmente de 3 a 5 pasos [src-cucumber-gherkin]. BDD nació para expresar los criterios de aceptación como escenarios [src-dannorth-bdd].

**Detalles volátiles (verificados 2026-10-21)**

- GPT-5.6 (API): conservar los ejemplos solo si codifican un requisito de producto o corrigen una brecha medida. Para depurar, quitar un grupo de ejemplos a la vez y volver a correr las mismas evals [src-openai-gpt56-model-guidance].
- Guía de razonamiento de OpenAI (contenido centrado en o1/o3): probar primero sin ejemplos; si se usan, deben coincidir estrictamente con las instrucciones [src-openai-reasoning-bp].

**Desacuerdos y matices**

- Google: "We recommend to always include few-shot examples in your prompts." [src-google-prompting-strategies]. La guía de razonamiento de OpenAI dice probar primero sin ejemplos [src-openai-reasoning-bp]; GPT-5.6, usarlos solo cuando aportan [src-openai-gpt56-model-guidance]; Anthropic sugiere de 3 a 5 [src-anthropic-prompting-bp]. Hay que enseñarlo como una variable a evaluar según modelo y tarea.
- [inferencia] Un ejemplo de formato (cómo se ve una tarjeta KPI) no es lo mismo que un caso de prueba (fixture con su valor esperado). En una especificación verificable, los casos de prueba casi siempre convienen; los ejemplos de formato dependen del modelo.

**Ideas de ejemplo trabajado**

- **E3.1 Ejemplos para la tabla de "oportunidades en riesgo".**
  - Un ejemplo del formato de una fila.
  - Dos casos borde: un monto en EUR que debe convertirse con `fx_rates.csv`, y una fecha de cierre nula, que excluye la fila del KPI y la lleva al panel de calidad.
  - Un contraejemplo expresado como test: "una oportunidad Perdida no suma al pipeline abierto". El valor esperado se calcula sobre el fixture cuando se construya.
- **E3.2 Comentario narrativo.** Un ejemplo bueno cita cifras calculadas y su variación. Un contraejemplo atribuye la caída a "la desaceleración del mercado", una causa ausente de los datos. De ahí sale un criterio de rúbrica: toda causa mencionada debe estar respaldada por un dato del input o marcarse como hipótesis.

---

### Lección 4 — Formatos estructurados y contratos de salida

**Principios duraderos**

- **P4.1 Especificar el formato de forma explícita.** Todos los proveedores lo recomiendan [src-anthropic-prompting-bp][src-openai-prompt-engineering][src-google-prompting-strategies]. Conviene usar delimitadores consistentes (XML o Markdown). Gemini pide elegir un solo estilo [src-google-prompting-strategies].
- **P4.2 Forma no es corrección.** Structured Outputs garantiza que la salida respeta el schema, no que sea exacta. OpenAI advierte que puede contener errores [src-openai-structured-outputs]. Anthropic no garantiza exactitud semántica [src-anthropic-structured-outputs]. Google distingue validez sintáctica de corrección semántica y pide validar los valores en la aplicación [src-google-structured-output].
- **P4.3 JSON mode no es Structured Outputs.** El primero solo garantiza JSON válido; el segundo, además, la adherencia al schema (OpenAI) [src-openai-structured-outputs].
- **P4.4 Llamada a función o formato de respuesta.** Las herramientas sirven para conectar con acciones o datos. El formato de respuesta estructura la contestación final [src-openai-structured-outputs][src-google-structured-output].
- **P4.5 El schema es un contrato versionado.** Conviene definirlo en código (Pydantic, Zod) y evitar que diverja de los tipos con checks de CI o generación automática [src-openai-structured-outputs]. Los SDK de Anthropic transforman el schema y validan la respuesta [src-anthropic-structured-outputs].
- **P4.6 Diseñar el caso "sin respuesta válida".**
  - Las entradas que no encajan con el schema pueden producir valores inventados. Hay que indicar qué devolver en ese caso (valores vacíos o un mensaje fijo) [src-openai-structured-outputs].
  - Antes de parsear hay que comprobar refusals y truncamientos: `refusal` e `incomplete` en OpenAI; `stop_reason: "refusal"` o `"max_tokens"` en Anthropic [src-openai-structured-outputs][src-anthropic-structured-outputs].
  - En Claude Code (`claude -p`), si no hay salida válida no aparece el campo `structured_output`; hay que verificar que exista antes de usarlo [src-anthropic-cc-headless].
- **P4.7 Nombres claros, descripciones y tipos fuertes** (enums, enteros) mejoran el resultado [src-openai-structured-outputs][src-google-structured-output].
- **P4.8 El contrato de salida de un agente de código no es solo JSON.**
  - Pedir evidencia (comando ejecutado y su resultado, salida de tests, capturas) en lugar de afirmaciones de éxito [src-anthropic-cc-best-practices].
  - Codex sugiere informar los comandos ejecutados y sus resultados [src-openai-codex-prompting].
  - La guía de Fable 5 pide auditar cada afirmación de progreso contra un resultado de herramienta de la sesión [src-anthropic-prompting-fable5].
  - El ExecPlan incluye la evidencia como salida de terminal, logs o diffs breves [src-openai-codex-execplans].
- **P4.9 [inferencia] Contrato de datos entre la capa de cálculo y la UI.** Debe fijar columnas, tipos, unidades, moneda y fecha de corte, más las invariantes semánticas que el schema no puede expresar (ponderado ≤ total; suma de regiones = total). Esas invariantes se validan en código.

**Detalles volátiles: soporte de JSON Schema por proveedor (verificado 2026-10-21)**

| Aspecto | OpenAI · API (Structured Outputs) [src-openai-structured-outputs] | Anthropic · Claude API (`output_config.format`) [src-anthropic-structured-outputs] | Google · Gemini API [src-google-structured-output] |
| --- | --- | --- | --- |
| Activación | Formato `json_schema` en `text.format` / `response_format` | `output_config.format` con `type: "json_schema"`. `output_format` está obsoleto. Además existe strict tool use (`strict: true`). Estado: GA | Interactions API: `response_format` con `mime_type: application/json` y `schema` |
| Campos obligatorios | Todos deben figurar en `required`; los opcionales se expresan como unión con `null`. `additionalProperties: false` es obligatorio | `additionalProperties: false` es obligatorio | `additionalProperties` acepta booleano o schema |
| Restricciones numéricas | Admite `minimum`, `maximum` y `multipleOf` | No admite `minimum`, `maximum` ni `multipleOf` (error 400). El SDK los mueve a la descripción | Admite `minimum` y `maximum` |
| Restricciones de texto | `pattern` y varios `format` | Regex simple y una lista de `format`. Sin `minLength` ni `maxLength` | Ignora `minLength` y `maxLength`. `format`: date-time, date, time |
| Recursión | `$defs` y recursión admitidos | Recursión no admitida | El ejemplo usa `$ref: "#"` recursivo |
| Orden de las claves | El del schema | Primero las requeridas, luego las opcionales | No documentado en la página consultada |
| Límites | 5 000 propiedades, 10 niveles de anidación, 1 000 valores de enum | 20 strict tools, 24 parámetros opcionales y 16 uniones por petición; compilación con timeout de 180 s; gramática en caché 24 h | Los schemas muy grandes devuelven `400 INVALID_ARGUMENT` |
| Otros | El refusal llega como tipo de contenido propio | Puede cambiar las mayúsculas de valores enum. Pedir razonamiento en un campo puede disparar `reasoning_extraction` | Combinación con herramientas en preview, solo modelos Gemini 3 |

Otros detalles volátiles:

- **Agentes en modo no interactivo (CLI):**
  - Claude Code: `claude -p "…" --output-format json --json-schema '<schema>'` devuelve el resultado en el campo `structured_output`. La palabra clave `format` se trata como anotación y no se impone [src-anthropic-cc-headless].
  - Codex: `codex exec "…" --output-schema ./schema.json`; `-o` escribe el último mensaje en un archivo y `--json` emite eventos JSONL [src-openai-codex-noninteractive]. La página no documenta qué ocurre si la salida no cumple el schema (ver §7).
- **Claude Sonnet 5.5 (API):** en tareas con salida JSON que requieren varios pasos de cálculo, el modelo puede responder sin pensar a esfuerzo bajo o medio. Anthropic sugiere añadir una línea que le pida pensar antes de responder, o subir el esfuerzo. Una respuesta con `stop_reason: "max_tokens"` debe tratarse como fallida aunque el JSON sea válido [src-anthropic-prompting-sonnet55].
- **Prefill:** desde Claude 4.6 no se admite prefill en el último turno del asistente (error 400). Anthropic recomienda structured outputs para forzar formato [src-anthropic-prompting-bp].

**Desacuerdos y matices**

- **Campos de "razonamiento".** El ejemplo de OpenAI define un arreglo `steps` (explicación y salida por paso) para un tutor de matemáticas [src-openai-structured-outputs]. Anthropic advierte que pedir razonamiento paso a paso en un campo puede provocar un refusal `reasoning_extraction` y recomienda pedir una explicación breve [src-anthropic-structured-outputs][src-anthropic-refusals]. [inferencia] Para un curso con varios proveedores: pedir campos con artefactos para el usuario (`assumptions`, `evidence`, `short_rationale`), no el razonamiento interno.
- **Restricciones numéricas.** OpenAI y Gemini las admiten; Anthropic no. [inferencia] Por eso las invariantes deben vivir de todos modos en la validación de la aplicación.

**Ideas de ejemplo trabajado**

- **E4.1 Contrato `pipeline_kpis` v1.** Lo produce la capa de cálculo y lo consume la vista y el comentario narrativo. [inferencia] La misma estructura sirve tanto si la genera código determinista como un LLM.

```json
{
  "type": "object",
  "additionalProperties": false,
  "required": ["schema_version", "as_of_date", "reporting_currency", "kpis", "data_quality_issues", "assumption_ids"],
  "properties": {
    "schema_version": { "type": "string", "enum": ["1.0"] },
    "as_of_date": { "type": "string", "format": "date" },
    "reporting_currency": { "type": "string", "enum": ["USD"] },
    "kpis": {
      "type": "array",
      "items": {
        "type": "object",
        "additionalProperties": false,
        "required": ["kpi_id", "region", "value", "unit", "formula_id"],
        "properties": {
          "kpi_id": { "type": "string", "enum": ["open_pipeline", "weighted_pipeline", "coverage_ratio", "overdue_count"] },
          "region": { "type": "string", "enum": ["NORTE", "CENTRO", "SUR", "TOTAL"] },
          "value": { "type": "number" },
          "unit": { "type": "string", "enum": ["USD", "ratio", "count"] },
          "formula_id": { "type": "string" }
        }
      }
    },
    "data_quality_issues": {
      "type": "array",
      "items": {
        "type": "object",
        "additionalProperties": false,
        "required": ["opp_id", "issue", "amount_usd_affected"],
        "properties": {
          "opp_id": { "type": "string" },
          "issue": { "type": "string", "enum": ["duplicate_id", "missing_close_date", "unknown_stage", "fx_missing"] },
          "amount_usd_affected": { "type": "number" }
        }
      }
    },
    "assumption_ids": { "type": "array", "items": { "type": "string" } }
  }
}
```

Invariantes que se validan en código, no en el schema:

- **I1:** `weighted_pipeline ≤ open_pipeline` en cada región.
- **I2:** la suma de NORTE, CENTRO y SUR es igual a TOTAL, con tolerancia de 0,01 USD.
- **I3:** si la cuota restante es ≤ 0, `coverage_ratio` no se calcula y se emite un aviso.
- **I4:** cada `assumption_id` existe en el registro de supuestos.

Para la clase: mostrar una salida válida contra el schema pero errónea (ponderado mayor que total) y cómo la detecta la validación. Nota de portabilidad: el schema evita `minimum` y `maximum` porque Claude API no los admite, y conviene probar `format: date` en cada proveedor.

- **E4.2 Contrato del reporte final del agente.** Secciones fijas:
  1. Resultado en una frase.
  2. Archivos cambiados.
  3. Comandos ejecutados y su resultado.
  4. Reconciliación: valor esperado frente a obtenido.
  5. Supuestos usados (IDs) y decisiones, con justificación breve.
  6. Desviaciones y pendientes.

  Contrastar con "Listo, todo funciona".

---

### Lección 5 — Descomposición de tareas y ciclos de mejora

**Principios duraderos**

- **P5.1 Explorar, planificar, implementar, confirmar.** Planificar compensa cuando el enfoque es incierto, el cambio toca varios archivos o el código es desconocido. En cambios triviales sobra: "If you could describe the diff in one sentence, skip the plan." [src-anthropic-cc-best-practices]. Codex recomienda planificar antes de tareas complejas, ambiguas o difíciles de describir [src-openai-codex-best-practices].
- **P5.2 Entrevista para especificar.** Claude Code sugiere que el agente entreviste al usuario (con la herramienta AskUserQuestion), escriba un SPEC.md y que la implementación se haga en una sesión nueva. Las specs más útiles nombran archivos e interfaces, declaran qué queda fuera de alcance y terminan con una verificación de extremo a extremo [src-anthropic-cc-best-practices]. Codex ofrece modo plan y entrevista [src-openai-codex-best-practices]. En Spec Kit, `clarify` se ejecuta antes de `plan` [src-github-speckit-quickstart].
- **P5.3 Artefactos encadenados y revisables.** El flujo completo de Spec Kit es constitution → specify → clarify → plan → checklist → tasks → analyze → implement → converge. Cada problema se corrige en el documento donde se originó, no aguas abajo [src-github-speckit-quickstart].
- **P5.4 Hitos verificables por separado.** En un ExecPlan, cada hito tiene meta, trabajo, resultado y prueba. El plan es un documento vivo con secciones de progreso, hallazgos, decisiones y retrospectiva [src-openai-codex-execplans].
- **P5.5 Encadenar con compuertas.** Dividir la tarea en pasos con verificaciones programáticas entre ellos [src-anthropic-building-agents]. Un patrón es la cadena de autocorrección: borrador, revisión contra criterios y refinamiento, cada paso como llamada separada para poder registrarlo y evaluarlo [src-anthropic-prompting-bp]. La recomendación general es empezar por lo más simple y añadir complejidad solo cuando mejora de forma medible [src-anthropic-building-agents]. Gemini propone dividir, encadenar y agregar [src-google-prompting-strategies]. GitHub sugiere pedidos pequeños y secuenciales, e issues con sub-issues [src-github-copilot-prompt-eng].
- **P5.6 Ciclos de mejora cortos.**
  - Corregir pronto. Tras dos correcciones fallidas sobre el mismo problema, limpiar el contexto y escribir un prompt mejor con lo aprendido [src-anthropic-cc-best-practices].
  - Cuando el agente repite un error, pedirle una retrospectiva y actualizar AGENTS.md [src-openai-codex-best-practices].
  - Antes de escalar a cientos de archivos, probar el prompt en 2 o 3 casos [src-anthropic-cc-best-practices].
- **P5.7 Verificación independiente.** Un revisor en contexto limpio (subagente o segunda sesión) evalúa el diff contra el plan. Advertencia: un revisor al que se le pide encontrar fallas casi siempre encuentra alguna, así que conviene limitarlo a correctitud y requisitos [src-anthropic-cc-best-practices]. Según la guía de Fable 5, los verificadores en contexto fresco suelen superar a la autocrítica [src-anthropic-prompting-fable5].
- **P5.8 Mejorar por ablación.** Quitar un grupo de instrucciones, ejemplos o herramientas a la vez y volver a correr las mismas evals [src-openai-gpt56-model-guidance].

**Detalles volátiles (verificados 2026-10-21)**

- Claude Code: modo plan (Shift+Tab o `--permission-mode plan`), Ctrl+G para editar el plan, `/goal` con evaluador entre turnos, Stop hooks como compuerta determinista, `/rewind`, `/clear`, `/compact`, `/btw` y la skill `/code-review` [src-anthropic-cc-best-practices].
- Codex: `/plan` o Shift+Tab; `/goal` tras el plan cuando Goal mode está disponible; plantilla PLANS.md; `/fork`, `/compact` y `/review` [src-openai-codex-best-practices][src-openai-codex-prompting].
- Spec Kit:
  - El README y el quickstart usan comandos con guion (`/speckit-specify`); `spec-driven.md` conserva la forma con punto (`/speckit.specify`).
  - `/speckit-converge` añade tareas hasta reportar "Converged".
  - Se instala con `uv tool install specify-cli`.
  - Documentación actualizada el 2026-09-28. Hay una ruta corta y una completa [src-github-speckit-repo][src-github-speckit-quickstart][src-github-speckit-sdd-doc][src-github-speckit-docs].
- Kiro: archivos `requirements.md`, `design.md` y `tasks.md`; variantes Requirements-First, Design-First, Bugfix y Quick Spec (página actualizada el 2026-10-15) [src-kiro-specs].

**Desacuerdos y matices**

- **Cuánta especificación previa.** El SDD formal choca con la crítica de Birgitta Böckeler (Thoughtworks, 2025-10-15): flujos pesados para problemas pequeños o medianos, markdown verboso más tedioso de revisar que el código, agentes que no siguen la spec y una falsa sensación de control. En su prueba, Kiro generó 4 historias y 16 criterios de aceptación para un bug pequeño [src-thoughtworks-sdd-tools]. Claude Code recomienda omitir el plan en cambios triviales [src-anthropic-cc-best-practices], y Spec Kit ofrece ruta corta y completa [src-github-speckit-quickstart]. [inferencia] Principio a enseñar: proporcionalidad. El rigor de la especificación debe crecer con el riesgo, la ambigüedad y el costo del error.
- **Autoverificación.** Anthropic sugiere en general pedir "antes de terminar, verifica contra [criterios]", pero en Claude Opus 5 esas instrucciones causan sobreverificación [src-anthropic-prompting-bp]. Claude Sonnet 5.5 a esfuerzo bajo puede dar un cambio por terminado sin ejecutar una comprobación [src-anthropic-prompting-sonnet55]. GPT-6 Astra prueba a veces más de lo que el cambio necesita [src-openai-latest-model].

**Ideas de ejemplo trabajado**

- **E5.1 Hitos del dashboard.**
  - H1 Contrato de datos, fixtures y test de reconciliación. Prueba: el test falla antes del cambio y pasa después.
  - H2 Módulo de KPIs con tests de casos borde.
  - H3 Vista única alimentada por H2. Prueba: captura y lista de diferencias frente al boceto.
  - H4 Comentario narrativo generado solo a partir de `pipeline_kpis.json`. Prueba: criterio de anclaje de la rúbrica.
  - H5 Revisión independiente del diff contra la especificación.

  Punto de control humano tras H1: aprobar los supuestos.
- **E5.2 Ciclo de mejora.** La v1 del prompt produce una cobertura de 3,1x cuando el fixture espera 1,4x. Diagnóstico: "cobertura" no estaba definida y el agente usó la cuota anual. Corrección: se arregla la especificación (definición más un caso de prueba), no se parchea el código. Luego se vuelve a ejecutar y se registra la decisión en el Decision Log.

---

### Lección 6 — Criterios de aceptación y comparación de prompts

**Principios duraderos**

- **P6.1 Criterios de éxito específicos, medibles, alcanzables y pertinentes.** Casi siempre son multidimensionales: fidelidad a la tarea, consistencia, tono, privacidad, latencia, costo [src-anthropic-develop-tests].
- **P6.2 Criterios observables.**
  - En Gherkin, Given establece el contexto, When el evento y Then el resultado esperado, que debe ser observable (UI, reporte, mensaje) y no un estado interno como registros en la base de datos. Lo recomendable son 3 a 5 pasos [src-cucumber-gherkin].
  - El ExecPlan expresa la aceptación como comportamiento observable con entradas y salidas concretas; "agregué una estructura" no cuenta [src-openai-codex-execplans].
  - Kiro usa el formato EARS (WHEN … THE SYSTEM SHALL …) y lo presenta como inequívoco, comprobable y trazable [src-kiro-requirements-first].
- **P6.3 Testabilidad.** En INVEST, si el cliente no sabe cómo probar una historia, puede que no esté clara o que no aporte valor [src-xp123-invest]. En BDD, los criterios de aceptación deben ser ejecutables [src-dannorth-bdd].
- **P6.4 Un criterio de término ejecutable por el agente** cierra el ciclo sin que el humano sea el verificador [src-anthropic-cc-best-practices]. Equivalentes: "Done when" en Codex [src-openai-codex-best-practices]; en Copilot, criterios de aceptación completos, por ejemplo si se esperan pruebas unitarias [src-github-copilot-agent-bp].
- **P6.5 La calidad de los requisitos también se prueba.** El checklist de Spec Kit evalúa completitud, claridad y consistencia de los requisitos. Marcar un ítem no significa que el código esté listo [src-github-speckit-quickstart].
- **P6.6 Comparar prompts con evals, no con impresiones.** El proceso: definir el objetivo, reunir el dataset, definir las métricas, ejecutar y comparar, evaluar de forma continua. Antipatrones: métricas genéricas, datasets sesgados, evaluación por sensaciones e ignorar el feedback humano [src-openai-eval-best-practices].
- **P6.7 Los modelos no son deterministas, así que se necesitan varios ensayos por tarea.** pass@k mide al menos un éxito en k intentos; pass^k, que todos tengan éxito. Con un 75 % de éxito por ensayo, pass^3 ronda el 42 % [src-anthropic-evals-agents].
- **P6.8 Diseño del conjunto de casos.**
  - Empezar con 20 a 50 tareas tomadas de fallas reales.
  - Tareas inequívocas, con solución de referencia: dos expertos deberían coincidir en el veredicto.
  - Conjuntos balanceados y un entorno limpio en cada ensayo.
  - Leer las transcripciones y calificar el resultado, no la ruta exacta [src-anthropic-evals-agents].
- **P6.9 Tipos de calificador.**
  - Por velocidad y fiabilidad: código (rápido y fiable, pero rígido), luego LLM (flexible, hay que calibrarlo) y por último humano (alta calidad, lento) [src-anthropic-develop-tests][src-anthropic-evals-agents].
  - Jueces LLM: rúbricas claras, salida empírica (correcto/incorrecto o escala 1–5), opción "Unknown", un juez por dimensión, calibración contra humanos y, como buena práctica, un modelo distinto del que generó la salida [src-anthropic-evals-agents][src-anthropic-develop-tests].
  - Sesgos documentados de posición y verbosidad: preferir comparación por pares o pass/fail y controlar la longitud [src-openai-eval-best-practices]. Zheng et al. (2023) describen sesgos de posición, verbosidad y autofavorecimiento, con más del 80 % de acuerdo con humanos en jueces fuertes [src-arxiv-llm-judge].
- **P6.10 Comparar en igualdad de condiciones.** Fijar el snapshot del modelo en producción [src-openai-prompt-engineering]. Una técnica medida en un modelo debe volver a comprobarse en otro [src-anthropic-prompting-bp]. Gastar menos tokens solo cuenta como mejora si la salida sigue pasando las evals [src-openai-gpt56-model-guidance].

**Detalles volátiles (verificados 2026-10-21)**

- **OpenAI Evals (plataforma):** pasa a solo lectura el 2026-10-31 y se apaga el 2026-11-30. OpenAI nombra Datasets como alternativa y no describe una migración detallada [src-openai-evals-guide][src-openai-eval-best-practices]. Revisar antes de redactar cualquier instrucción práctica con esa plataforma.
- **Reusable prompts de OpenAI:** `v1/prompts` cierra el 2026-11-30. OpenAI recomienda mantener los prompts de producción en código, con fixtures, evals y despliegue gradual [src-openai-prompt-engineering].
- OpenAI recomienda empezar con gpt-6-astra como juez y validarlo contra etiquetas humanas antes de optimizar costo [src-openai-eval-best-practices].
- Anthropic recomienda un calificador con thinking activado para que razone antes de puntuar [src-anthropic-develop-tests].
- Claude Code ofrece `/goal` (un evaluador separado revisa la condición tras cada turno) y Stop hooks como compuertas deterministas [src-anthropic-cc-best-practices].

**Desacuerdos y matices**

- **Volumen o calidad.** La guía de evals de Anthropic prioriza muchas preguntas calificadas automáticamente frente a pocas de alta calidad calificadas a mano [src-anthropic-develop-tests]. Su artículo sobre agentes recomienda empezar con 20 a 50 tareas inequívocas con solución de referencia [src-anthropic-evals-agents]. [inferencia] Síntesis: empezar con pocas tareas limpias, automatizar la calificación y luego escalar.
- **Calificación humana.** La guía de Anthropic la desaconseja si puede evitarse [src-anthropic-develop-tests]. OpenAI insiste en calibrar contra humanos y considera las etiquetas expertas la verdad de referencia, aunque costosa [src-openai-eval-best-practices]. [inferencia] Ambos coinciden en que el juez LLM debe calibrarse con una muestra humana.
- **Razonamiento del juez.** OpenAI recomienda que el juez razone antes de puntuar [src-openai-eval-best-practices]; Anthropic, usar thinking activado [src-anthropic-develop-tests]. [inferencia] En modelos Claude recientes, conviene leer ese razonamiento como thinking y no pedirlo como texto en la salida del juez [src-anthropic-refusals].

**Ideas de ejemplo trabajado**

- **E6.1 Criterios de aceptación en Gherkin.** Ejemplo para el caso. Las palabras clave van en inglés por consistencia con el código (Gherkin admite localización con `# language:`).

```gherkin
Feature: Cobertura de pipeline T4-2026 por región

  Scenario: Cobertura calculada sobre la cuota restante
    Given el snapshot sintético "opportunities_snapshot_2026-10-19.csv" y la cuota T4 de la región Norte
    When se abre el dashboard con fecha de corte 2026-10-19
    Then la tarjeta "Cobertura Norte" muestra el valor esperado del fixture con un decimal y el sufijo "x"
    And el detalle de la tarjeta muestra la fórmula "pipeline abierto T4 / (cuota T4 - ganado T4)"

  Scenario: Oportunidad abierta sin fecha de cierre
    Given una oportunidad abierta con expected_close_date vacía
    When se calcula el pipeline del trimestre
    Then la oportunidad no suma al pipeline T4
    And aparece en el panel "Calidad de datos" con el motivo "fecha de cierre faltante" y su monto en USD

  Scenario: Comentario narrativo sin causas inventadas
    Given el archivo pipeline_kpis.json del snapshot
    When se genera el comentario del comité
    Then cada cifra del comentario coincide con un valor de pipeline_kpis.json
    And toda causa que no figure en los datos aparece marcada como "hipótesis"
```

- **E6.2 Comparación de dos prompts de ejecución.**
  - Versiones: A = la petición original del CFO; B = la especificación completa.
  - Diseño: 8 casos sintéticos (fixtures con problemas distintos) × 3 ensayos por versión.
  - Métricas:
    - reconciliación exacta de los KPI (calificador de código);
    - validez del contrato e invariantes I1–I4 (código);
    - alcance respetado, es decir, diff solo en rutas permitidas (código);
    - anclaje del comentario (juez LLM con rúbrica y opción "Unknown", calibrado con 10 casos etiquetados por el alumno);
    - tokens y tiempo.
  - Regla de decisión fijada antes de ejecutar: B se adopta si su pass^3 en reconciliación es ≥ al de A y ningún criterio crítico empeora.
  - Leer al menos 3 transcripciones por versión.

---

## 3. Conceptos erróneos frecuentes (distractores plausibles)

Cada fila sirve como distractor de una pregunta de escenario. La columna "Evidencia" justifica el feedback por alternativa (plan.md §5).

| # | Creencia errónea | Por qué es errónea (evidencia) | Fuentes | Lección |
| --- | --- | --- | --- | --- |
| CE01 | "Si el modelo es potente, entenderá la intención; no hace falta decir para quién ni para qué." | Los proveedores piden explicitar motivación y destinatario; la prueba del colega muestra que la ambigüedad confunde. | [src-anthropic-prompting-bp][src-anthropic-prompting-fable5] | L1 |
| CE02 | "Pedir '¿puedes sugerir mejoras?' hará que el agente las implemente." | Anthropic documenta que esa formulación tiende a producir sugerencias; para que actúe hay que pedirlo de forma directa. | [src-anthropic-prompting-bp] | L1 |
| CE03 | "Pedir 'tantas funciones como sea posible' es buena práctica en un dashboard financiero." | Ese ejemplo ilustra cómo declarar ambición; sin alcance acotado, algunos modelos añaden extras no pedidos. [inferencia] Choca con la verificabilidad. | [src-anthropic-prompting-bp][src-anthropic-prompting-sonnet55] | L1 |
| CE04 | "Un prompt más largo y detallado siempre rinde más." | GPT-5.6: prompts más ligeros mejoraron los scores entre un 10 y un 15 % en evals internas (resultado orientativo). Un CLAUDE.md inflado hace que se ignoren reglas. Anthropic lista la sobreingeniería del prompt como error. | [src-openai-gpt56-model-guidance][src-anthropic-cc-best-practices][src-anthropic-blog-prompting] | L1/L2 |
| CE05 | "Las reglas permanentes del proyecto deben repetirse en cada prompt." | Codex lista esto como error común: van en AGENTS.md o en una skill. GPT-5.6 pide enunciar cada regla una sola vez. | [src-openai-codex-best-practices][src-openai-gpt56-model-guidance] | L2 |
| CE06 | "Cuanto más contexto (todo el repo, todos los documentos), mejor." | El rendimiento se degrada al llenarse el contexto; "kitchen sink" e "infinite exploration" figuran como patrones de fallo. | [src-anthropic-cc-best-practices] | L2 |
| CE07 | "Poner IMPORTANT o CRITICAL en muchas líneas asegura el cumplimiento." | Si todo lleva énfasis, nada destaca; en modelos Claude recientes el lenguaje agresivo provoca sobreuso. | [src-anthropic-cc-best-practices][src-anthropic-prompting-bp] | L2 |
| CE08 | "Si falta un dato, el agente debe completarlo con un supuesto razonable sin avisar." | Lo documentado es permitir "no lo sé", marcar `[NEEDS CLARIFICATION]`, registrar las decisiones o decir qué ambigüedades llevan a preguntar. | [src-anthropic-reduce-hallucinations][src-github-speckit-sdd-doc][src-openai-codex-execplans][src-openai-gpt56-model-guidance] | L2 |
| CE09 | "Las instrucciones contradictorias se resuelven solas: el modelo elige la más sensata." | Dañan más a los modelos precisos porque gastan razonamiento en reconciliarlas; GPT-6 Astra es sensible a conflictos entre skills y AGENTS.md. | [src-openai-gpt5-prompting-guide][src-openai-latest-model] | L2 |
| CE10 | "El modelo puede hacer los cálculos del dashboard dentro de su respuesta." | Google recomienda ejecución de código para aritmética y conteos; plan.md separa el cálculo determinista de la narrativa. | [src-google-prompting-strategies] | L2/L4 |
| CE11 | "Más ejemplos siempre es mejor." | Demasiados ejemplos producen sobreajuste (Gemini); GPT-5.6 los mantiene solo si corrigen una brecha medida; la guía de razonamiento de OpenAI dice probar primero sin ejemplos. | [src-google-prompting-strategies][src-openai-gpt56-model-guidance][src-openai-reasoning-bp] | L3 |
| CE12 | "Un único ejemplo representativo cubre todos los casos." | Los ejemplos deben ser diversos e incluir casos borde; los conjuntos de evaluación deben estar balanceados. | [src-anthropic-prompting-bp][src-anthropic-evals-agents] | L3 |
| CE13 | "Los contraejemplos se expresan mejor como una lista de 'no hagas X'." | Para el formato conviene decir qué hacer. [inferencia] Un contraejemplo útil es un caso concreto con su salida esperada. | [src-anthropic-prompting-bp][src-anthropic-evals-agents] | L3 |
| CE14 | "Con Structured Outputs los números del JSON son correctos." | Los tres proveedores garantizan la forma, no la exactitud, y piden validar los valores. | [src-openai-structured-outputs][src-anthropic-structured-outputs][src-google-structured-output] | L4 |
| CE15 | "JSON mode y Structured Outputs son lo mismo." | JSON mode solo garantiza JSON válido; Structured Outputs garantiza además la adherencia al schema. | [src-openai-structured-outputs] | L4 |
| CE16 | "Un mismo JSON Schema funciona igual con todos los proveedores." | Claude API rechaza `minimum`/`maximum`; OpenAI exige todos los campos en `required`; Gemini ignora `minLength`; el orden de las claves difiere. | [src-anthropic-structured-outputs][src-openai-structured-outputs][src-google-structured-output] | L4 |
| CE17 | "Si la respuesta parece JSON válido, se puede usar sin revisar por qué terminó." | Un refusal o un truncamiento pueden romper el schema; Anthropic pide tratar `max_tokens` como fallo aunque el JSON parezca válido. | [src-anthropic-structured-outputs][src-anthropic-prompting-sonnet55][src-openai-structured-outputs] | L4 |
| CE18 | "Un campo `reasoning` en el JSON mejora la calidad y es inocuo." | En modelos Claude recientes puede disparar `reasoning_extraction`; Anthropic recomienda pedir una explicación breve. | [src-anthropic-structured-outputs][src-anthropic-refusals] | L4/§4 |
| CE19 | "En Claude, la forma de forzar el formato es el prefill ('Aquí está el JSON:')." | Desde Claude 4.6 el prefill del último turno devuelve error 400; la alternativa es structured outputs. | [src-anthropic-prompting-bp] | L4 |
| CE20 | "Planificar antes de cualquier cambio siempre es la mejor práctica." | Planificar tiene un costo; si el diff cabe en una frase, Claude Code recomienda omitir el plan. | [src-anthropic-cc-best-practices] | L5 |
| CE21 | "Si el agente falla, hay que seguir corrigiéndolo en la misma sesión hasta que acierte." | Tras dos correcciones fallidas, Claude Code recomienda limpiar el contexto y reescribir el prompt. | [src-anthropic-cc-best-practices] | L5 |
| CE22 | "Que el mismo agente revise su trabajo equivale a una revisión independiente." | Los verificadores en contexto fresco superan a la autocrítica; Claude Code propone el patrón escritor/revisor. | [src-anthropic-prompting-fable5][src-anthropic-cc-best-practices] | L5 |
| CE23 | "Hay que atender todos los hallazgos del revisor." | Un revisor al que se le piden fallas casi siempre encuentra alguna; perseguirlas todas lleva a la sobreingeniería. | [src-anthropic-cc-best-practices] | L5 |
| CE24 | "El spec-driven development siempre mejora el resultado, sea cual sea el tamaño de la tarea." | En tareas pequeñas resulta costoso y verboso, y los agentes no siempre siguen la spec. | [src-thoughtworks-sdd-tools] | L5 |
| CE25 | "'Que se vea bien y funcione' es un criterio de aceptación." | No es observable ni comprobable; Gherkin pide resultados observables e INVEST, historias testables. | [src-cucumber-gherkin][src-xp123-invest] | L6 |
| CE26 | "Verificar un estado interno (tabla creada, estructura agregada) demuestra la aceptación." | Then debe comprobar una salida observable; el ExecPlan excluye los atributos internos. | [src-cucumber-gherkin][src-openai-codex-execplans] | L6 |
| CE27 | "Si el agente dice 'todos los tests pasan', está verificado." | Hay que exigir evidencia (comando y resultado) y auditar las afirmaciones; a esfuerzo bajo, Sonnet 5.5 puede omitir la comprobación. | [src-anthropic-cc-best-practices][src-anthropic-prompting-fable5][src-anthropic-prompting-sonnet55] | L6 |
| CE28 | "Si un prompt ganó en una prueba, es mejor." | Los modelos no son deterministas: hacen falta varios ensayos (pass@k, pass^k) y casos representativos. | [src-anthropic-evals-agents][src-openai-eval-best-practices] | L6 |
| CE29 | "Un juez LLM es objetivo y no necesita calibración." | Tiene sesgos de posición y verbosidad; hay que calibrarlo contra humanos. | [src-openai-eval-best-practices][src-arxiv-llm-judge][src-anthropic-evals-agents] | L6 |
| CE30 | "Reducir los tokens de un prompt es una mejora en sí misma." | Solo cuenta si la salida sigue pasando las evals. | [src-openai-gpt56-model-guidance] | L6 |
| CE31 | "Una técnica que funcionó con un modelo funciona igual con el siguiente." | Anthropic pide volver a comprobarla; en Opus 5, las instrucciones de verificación heredadas causan sobreverificación. | [src-anthropic-prompting-bp] | L6 |
| CE32 | "'Piensa paso a paso y muéstrame tu razonamiento' mejora cualquier modelo." | Ver §4: con modelos de razonamiento es innecesario o perjudicial (OpenAI) y en Claude reciente puede rechazarse. | [src-openai-reasoning-bp][src-anthropic-refusals] | §4 |
| CE33 | "El razonamiento visible del modelo muestra fielmente por qué decidió." | En el estudio de Anthropic, los modelos mencionaron la pista que usaron solo en una minoría de casos (≈25 % y ≈39 %). | [src-anthropic-cot-faithfulness] | §4/L6 |

**Distribución sugerida para el banco de unas 22 preguntas [inferencia]:** L1: 4 · L2: 4 · L3: 3 · L4: 4 · L5: 3 · L6: 4. Mezclar escenarios del caso Altiplano con escenarios de transferencia (otro tipo de herramienta analítica). Para evitar preguntas de trivia (plan.md §5), los detalles volátiles (nombres de comandos, límites de schema) deben aparecer como contexto del escenario, no como respuesta que haya que memorizar.

---

## 4. Qué NO enseñar o enseñar con cautela

### 4.1 Recetas universales

- Los proveedores presentan sus técnicas como puntos de partida:
  - Claude Code dice que sus patrones no son fijos y que hay que desarrollar intuición [src-anthropic-cc-best-practices].
  - Gemini dice que su guía es un punto de partida para probar y refinar [src-google-prompting-strategies].
  - Anthropic lista como errores usar todas las técnicas a la vez y apoyarse en técnicas obsoletas [src-anthropic-blog-prompting].
- Las técnicas atribuidas a un modelo deben volver a comprobarse con evals propias [src-anthropic-prompting-bp]. Según la guía de Fable 5, las skills escritas para modelos anteriores suelen ser demasiado prescriptivas y pueden degradar la salida [src-anthropic-prompting-fable5].
- [inferencia] Los acrónimos y plantillas de prompting sirven como lista de comprobación, no como garantía. Enseñar preguntas de diseño (qué decisión, qué evidencia, qué queda fuera, qué se pregunta) en vez de una fórmula fija. Incluso el esquema Goal / Context / Constraints / Done when es un valor por defecto de OpenAI para Codex, y la misma página dice que Codex maneja prompts imperfectos [src-openai-codex-best-practices].

### 4.2 "Frases mágicas"

| Frase o práctica | Qué dicen las fuentes | Qué enseñar |
| --- | --- | --- |
| "Piensa paso a paso" | El chain-of-thought con ejemplos mejoró el razonamiento en modelos grandes de 2022 [src-arxiv-cot]. En modelos de razonamiento, OpenAI lo considera innecesario y potencialmente perjudicial [src-openai-reasoning-bp]. Gemini 2.5 y 3 piensan internamente, aunque un "piensa con cuidado" puede ayudar en problemas difíciles a costa de tokens [src-google-prompting-strategies]. En Claude Sonnet 5.5, una línea que pide pensar antes de responder mejora tareas de cálculo con salida JSON, porque el pensamiento queda interno [src-anthropic-prompting-sonnet55]. | Matiz clave: pedir que el modelo piense (internamente) puede ser una palanca válida según el modelo; pedir que muestre su razonamiento es lo problemático (§4.3). Contexto histórico, no receta. |
| "Eres un experto de clase mundial" | Una frase de rol en el system prompt enfoca conducta y tono [src-anthropic-prompting-bp]. El blog de Anthropic considera hoy menos necesario el role prompting intenso y advierte contra restringir demasiado el rol [src-anthropic-blog-prompting]. | Palanca menor; no sustituye contexto, criterios ni evidencia. |
| Mayúsculas, CRITICAL, MUST en todo | Provoca sobreuso en modelos Claude recientes; el énfasis solo funciona si es escaso [src-anthropic-prompting-bp][src-anthropic-cc-best-practices]. | Énfasis puntual y regla con motivo. |
| Amenazas, propinas, urgencia emocional | No encontré respaldo en la documentación oficial consultada (Anthropic, OpenAI, Google, GitHub). | No enseñarlo como técnica. [inferencia] |
| "No alucines" o "sé preciso" sin más | Anthropic propone mecanismos concretos: permitir "no lo sé", citas textuales, verificación con citas, restringirse a los documentos [src-anthropic-reduce-hallucinations]. | Sustituir el imperativo por mecanismos verificables. [inferencia] El imperativo solo no garantiza nada. |
| "Hazlo production-ready" | [inferencia] Es un término vago y no observable; equivale a no fijar criterios. | Traducirlo a criterios de aceptación (L6). |

### 4.3 Exigir razonamiento interno oculto: qué dicen los proveedores (2026-10-21)

| Proveedor · producto · entorno | Posición documentada | Fuentes |
| --- | --- | --- |
| **Anthropic · Claude API** (Fable 5/5.1, Opus 5/5.5, Sonnet 5.5, Haiku 5.5) | Un clasificador puede rechazar (`stop_reason: "refusal"`, categoría `reasoning_extraction`) los prompts que piden reproducir el razonamiento interno en la respuesta: secciones `<thinking>`, `<reasoning>` o de scratchpad; campos `reasoning`, `thinking` o `trace` en JSON o en la entrada de una herramienta; notas privadas; razonamiento literal o completo. La instrucción puede estar en el system prompt, una skill o la descripción de una herramienta. El fallback automático no reintenta esta categoría: hay que cambiar el prompt. Sí se puede pedir una explicación breve, la evidencia detrás de un resultado o un resumen de las acciones. | [src-anthropic-refusals][src-anthropic-prompting-fable5][src-anthropic-prompting-sonnet55] |
| Anthropic · Claude API · thinking | Lo que aparece en los bloques de thinking es un resumen, nunca el chain-of-thought en bruto. En los modelos más nuevos, `display` es `"omitted"` por defecto y el resumen se obtiene con `display: "summarized"`. El CoT manual es solo un recurso cuando el thinking está desactivado en modelos que lo permiten. | [src-anthropic-thinking][src-anthropic-prompting-bp] |
| Anthropic · Claude Code | [inferencia] Como Claude Code usa esos modelos y la guía de Fable 5 menciona prompts, skills e instrucciones del harness, las instrucciones de "muestra tu razonamiento" en CLAUDE.md o en skills pueden causar el mismo rechazo. No lo verifiqué en la documentación de Claude Code. | [src-anthropic-prompting-fable5] |
| **OpenAI · API** (modelos de razonamiento) | Los tokens de razonamiento no son visibles y el razonamiento en bruto no se expone. Hay resúmenes opcionales (`summary`) y reasoning items cifrados para continuidad sin estado. La guía de buenas prácticas (centrada en o1/o3) desaconseja los prompts de chain-of-thought por innecesarios y potencialmente perjudiciales. | [src-openai-reasoning][src-openai-reasoning-bp] |
| **Google · Gemini API** | Los pensamientos en bruto no se devuelven; hay resúmenes opcionales (`thinking_summaries: "auto"`). Gemini 2.5 y 3 piensan internamente y en general no hace falta pedir razonamiento paso a paso en la salida. | [src-google-thinking][src-google-prompting-strategies] |
| Investigación | El razonamiento verbalizado no siempre es fiel: los modelos ocultan a menudo la pista que realmente usaron. El monitoreo del CoT ayuda, pero no permite descartar conductas indebidas. | [src-anthropic-cot-faithfulness] |

**Implicación didáctica (coherente con plan.md §4, M02 «Límite»).** Pedir artefactos observables y verificables:

- decisiones con una justificación de una o dos frases;
- supuestos con ID, dueño y estado;
- evidencia: comandos, salidas, tests, capturas, diffs;
- incertidumbres y datos faltantes;
- un resumen de las acciones realizadas.

Para entender por qué falló un modelo, usar los resúmenes de thinking que ofrece el proveedor y la lectura de transcripciones [src-anthropic-reduce-hallucinations][src-anthropic-evals-agents].

### 4.4 Otras prácticas que conviene enseñar con cautela (dependen del modelo o están obsoletas)

- **Prefill** para formato en Claude: no admitido desde 4.6 [src-anthropic-prompting-bp].
- **`budget_tokens` manual** en Claude: devuelve error 400 desde 4.7; se controla con `effort` [src-anthropic-prompting-bp].
- **Ajustar la temperatura:** Gemini 4 y 3.6+ ignoran valores personalizados y avisan de su retirada [src-google-prompting-strategies]. En GPT-6 hay que quitar `temperature` y `top_p` cuando el razonamiento no es `none` [src-openai-latest-model].
- **"Pide siempre que verifique su trabajo":** útil en general, contraproducente en Opus 5 [src-anthropic-prompting-bp], y GPT-6 Astra ya prueba de más [src-openai-latest-model].
- **Material desactualizado que sigue circulando:**
  - El tutorial interactivo de Anthropic se escribió para Claude 3 [src-anthropic-prompting-overview].
  - La guía de GPT-5 y la de PLANS.md están archivadas [src-openai-gpt5-prompting-guide][src-openai-codex-execplans].
  - La guía de razonamiento de OpenAI menciona modelos de la era o1 [src-openai-reasoning-bp].
  - El blog de Anthropic (2025-11-10) recomienda prefill y CoT con etiquetas, consejos que la documentación actual ya restringe [src-anthropic-blog-prompting][src-anthropic-prompting-bp].

  Si se citan, hay que fecharlos.

---

## 5. Propuesta de laboratorio: de petición ambigua de dashboard a especificación verificable

### 5.1 Objetivo observable

Dada una petición ambigua y datos sintéticos, el alumno produce un **brief**, un **prompt de ejecución** para Codex o Claude Code y una **rúbrica**. Un agente o una persona sin contexto previo debería poder ejecutarlos y verificarlos (plan.md §4, M02, y objetivo 2 de §2).

### 5.2 Entradas

1. **Petición ambigua (texto ficticio):**
   > Asunto: dashboard pipeline. Hola, para el comité del lunes necesito un dashboard del pipeline que se vea bien y muestre cómo vamos. Que tenga lo importante y algún comentario de IA que lo explique. Usa los datos del CRM que te pasó Marta. Gracias. — R. Ibáñez, CFO (ficticio)
2. **Datos sintéticos** del caso Altiplano (§2.0): snapshot de unas 40 filas con los problemas sembrados, probabilidades por etapa, tipos de cambio, cuotas y calendario fiscal.
3. **Tarjeta "respuestas del stakeholder"**, que se revela después del paso 1 para que el ejercicio no dependa de una persona real. Contenido sugerido:
   - Usuario: comité comercial. Decisión: priorizar el seguimiento de oportunidades.
   - Periodo: T4-2026. Moneda: USD con `fx_rates.csv`.
   - "Pipeline" = oportunidades abiertas; mostrar total y ponderado.
   - Cobertura = pipeline abierto T4 / (cuota T4 − ganado T4).
   - Detalle por región y top 10 en riesgo.
   - Formato: una página HTML estática legible en portátil y móvil.
   - Comentario de IA de 120 palabras como máximo, basado solo en cifras calculadas.
   - Plazo: el lunes basta un MVP sin drill-down.

   Deliberadamente sin respuesta ("el CFO no lo sabe"): la regla para duplicados y la definición de "en riesgo". El alumno debe proponer un supuesto y decidir si pregunta.
4. **Plantillas** (§5.7) y restricciones del entorno: datos sintéticos, sin red y sin dependencias nuevas. El stack concreto (por ejemplo, Python + HTML estático) lo fija el autor.

### 5.3 Pasos

1. **Diagnóstico de ambigüedad (15–20 min).** Listar al menos 10 ambigüedades y clasificar cada una como: preguntar / asumir y registrar / fuera de alcance. Después, revelar la tarjeta del stakeholder.
2. **Brief.** Incluir:
   - objetivo, usuario y decisión;
   - alcance dentro y fuera;
   - definiciones de KPI con fórmula, unidad y fuente;
   - datos y reglas de calidad;
   - restricciones y límites de acción;
   - registro de supuestos con dueño y estado;
   - riesgos.
3. **Casos y contraejemplos.** Al menos 5 casos sobre el fixture con su valor esperado, calculado a mano o con un script determinista: 2 o más de calidad de datos y 1 contraejemplo de narrativa.
4. **Contrato de salida.** Schema de KPIs (o una tabla equivalente) con invariantes, más el formato del reporte final del agente (E4.2).
5. **Criterios de aceptación.** Al menos 5 escenarios Given/When/Then observables, cada uno trazado a un elemento del objetivo; uno como mínimo debe ser negativo.
6. **Prompt de ejecución** para Codex o Claude Code (plantilla en §5.7): hitos con prueba, política de ambigüedad, evidencia requerida y límites de acción. No debe pedir razonamiento interno.
7. **Rúbrica del resultado.** Rúbrica que el alumno usará para evaluar el dashboard y el reporte del agente (ejemplo en §5.6).
8. **Opcional, en el entorno del alumno** (la app no ejecuta código: plan.md §5). Ejecutar con un agente la versión A (petición original) y la B (prompt de ejecución), con al menos 3 ensayos por versión si el costo lo permite. Aplicar la rúbrica y registrar las condiciones: modelo, fecha, esfuerzo, número de ensayos y transcripciones leídas.

### 5.4 Entregables

| Entregable | Obligatorio | Contenido mínimo |
| --- | --- | --- |
| `brief.md` | Sí | Pasos 1–3 (ambigüedades clasificadas, brief, casos) |
| `prompt_ejecucion.md` | Sí | Paso 6, con referencia a los contratos del paso 4 |
| `rubrica.md` | Sí | Paso 7 |
| `criterios.feature` | Recomendado (puede ir dentro del brief) | Paso 5 |
| `pipeline_kpis.schema.json` | Recomendado | Paso 4 |
| `comparacion.md` | Opcional | Paso 8: diseño, resultados por ensayo, decisión y límites |

La evidencia se registra en el expediente según plan.md §17.2: texto pegado y, si aplica, referencias a archivos externos marcadas como pendientes de inspección.

### 5.5 Rúbrica analítica sugerida para evaluar la entrega del alumno

Escala por criterio: 0 Ausente · 1 Inicial · 2 Adecuado · 3 Sólido. Puntaje = Σ (peso × nivel) / 3. **Propuesta de aprobación** [inferencia]: 70 % o más, sin ningún criterio crítico (★) por debajo de 2.

| Criterio | Peso | 1 Inicial | 2 Adecuado | 3 Sólido | Evidencia esperada |
| --- | --- | --- | --- | --- | --- |
| C1 ★ Objetivo, usuario y decisión | 15 % | Objetivo genérico ("ver el pipeline") | Usuario, decisión y periodo explícitos | Además, el resultado esperado es observable y dice qué decisión habilita | Párrafo de objetivo |
| C2 ★ Definiciones y supuestos | 20 % | KPIs nombrados sin fórmula | Fórmula, unidad, fuente y moneda para cada KPI; supuestos listados | Supuestos con dueño y estado; ambigüedades clasificadas en preguntar / asumir; las que cambian cifras visibles se preguntan | Tabla de KPIs y de supuestos |
| C3 Contexto y restricciones | 10 % | Contexto vago o excesivo | Rutas, datos y patrón a seguir; restricciones con motivo | Fuera de alcance explícito; límites de acción; reglas duraderas separadas de las de la tarea | Sección de contexto |
| C4 Casos y contraejemplos | 10 % | Solo el caso feliz | 5 o más casos con valor esperado | Cubren calidad de datos y narrativa; contraejemplos formulados como casos concretos | Tabla de casos |
| C5 Contrato de salida | 10 % | "Devuelve JSON" | Estructura definida (schema o tabla) | Invariantes semánticas, manejo de "sin respuesta" y formato del reporte final con evidencia | Schema e invariantes |
| C6 Descomposición y verificación | 10 % | Una sola instrucción grande | Hitos ordenados | Cada hito con prueba; punto de control humano; verificación independiente | Lista de hitos |
| C7 ★ Criterios de aceptación | 15 % | Criterios no observables ("se ve bien") | 5 o más Given/When/Then observables | Trazados al objetivo; incluyen casos negativos; sin estado interno | `criterios.feature` |
| C8 Prompt de ejecución utilizable y proporcional | 10 % | Copia del brief o pide "muestra tu razonamiento" | Incluye objetivo, contexto, restricciones, "hecho cuando" y evidencia | Política de ambigüedad clara; extensión proporcional; sin frases mágicas ni contradicciones | `prompt_ejecucion.md` |

El nivel 0 equivale a ausente. El paso 8 opcional se registra aparte y no cuenta para aprobar. Rasgos de nivel 3: varios ensayos, regla de decisión fijada antes de ejecutar y lectura de transcripciones.

### 5.6 Clave orientativa para el revisor y ejemplo de rúbrica del resultado

**Ambigüedades esperadas** (el alumno debería detectar 10 o más):

1. Usuario y decisión.
2. "Cómo vamos" respecto a qué: cuota, trimestre anterior o forecast.
3. Periodo y calendario fiscal.
4. Si el pipeline incluye oportunidades cerradas, y si se muestra total o ponderado.
5. Moneda y fecha del tipo de cambio.
6. Nivel de detalle: región, owner o cuenta.
7. Fuente y frecuencia del snapshot.
8. Tratamiento de duplicados, nulos y etapas no estándar.
9. Quién define las probabilidades por etapa.
10. Qué significa "se vea bien": dispositivo, legibilidad, accesibilidad.
11. Formato del entregable y stack.
12. Alcance mínimo posible para el lunes.
13. Función del comentario de IA y sus límites.
14. Restricciones de datos y privacidad (datos sintéticos, sin servicios externos).

**Errores típicos para el feedback:**

- KPI sin fórmula o sin moneda.
- Criterios de aceptación no observables.
- Pedir al agente que muestre su razonamiento.
- No declarar qué queda fuera de alcance.
- Dejar que la narrativa calcule cifras.
- Aceptar "tests pasan" sin evidencia.
- Especificación desproporcionada: por ejemplo, 15 historias de usuario para un MVP de una página [src-thoughtworks-sdd-tools].
- Contradicciones entre restricciones, como "no agregues dependencias" junto a "usa la librería X".

**Ejemplo de rúbrica del resultado** (la que el alumno entrega para evaluar el dashboard y el reporte del agente):

| ID | Criterio | Tipo de calificador | Umbral |
| --- | --- | --- | --- |
| R1 ★ | Exactitud: los KPIs coinciden con los valores esperados del fixture | Código (exact match con tolerancia de 0,01) | Pasa o no pasa |
| R2 ★ | Calidad de datos: las filas problemáticas se excluyen y se reportan según los casos | Código | Todos los casos |
| R3 | Anclaje de la narrativa: cada cifra aparece en `pipeline_kpis.json`; las causas sin dato se marcan como hipótesis | Juez LLM con rúbrica y "Unknown", calibrado con muestra humana | 0 cifras inventadas |
| R4 | Alcance: el diff solo toca rutas permitidas y no agrega dependencias | Código (`git diff --stat`) | Pasa o no pasa |
| R5 | Evidencia: el reporte incluye comandos, salidas y reconciliación | Humano o checklist | Todas las secciones |
| R6 | Legibilidad: etiquetas y unidades visibles; el color no es el único portador de significado | Humano con checklist (referencia: plan.md §6, objetivo WCAG 2.2 AA) | Checklist completo |

### 5.7 Plantillas sugeridas

**Brief (estructura):** Objetivo · Usuario y decisión · Alcance (dentro / fuera) · Definiciones de KPI (fórmula, unidad, fuente) · Datos y reglas de calidad · Restricciones y límites de acción · Supuestos (ID, dueño, estado, ¿cambia cifras?) · Casos de prueba · Criterios de aceptación · Riesgos.

**Prompt de ejecución (modelo para el alumno; las rutas son ilustrativas):**

```text
## Objetivo
Construir la vista "Pipeline T4-2026" para el comité comercial del lunes:
cobertura por región y top 10 de oportunidades en riesgo (definiciones en docs/brief_pipeline.md).

## Contexto
- Datos: data/opportunities_snapshot_2026-10-19.csv (diccionario en docs/data_dictionary.md)
- Políticas de FP&A (no modificar): data/stage_probability.csv, data/fx_rates.csv, data/quota.csv
- Patrón a seguir: el componente de vista existente indicado en el brief
- Fuente de verdad de definiciones y supuestos: docs/brief_pipeline.md

## Restricciones
- Los cálculos van en el módulo determinista src/kpis/. El comentario narrativo solo cita valores de out/pipeline_kpis.json.
- Sin dependencias nuevas, sin llamadas de red, solo datos sintéticos.
- Rutas permitidas: src/kpis/, src/views/pipeline_view.*, tests/, docs/DECISIONS.md.
- Fuera de alcance: login, envío de correos, forecast probabilístico.

## Política de ambigüedad
- Si una ambigüedad cambia una cifra visible o el alcance, o exige una acción irreversible: detente y pregunta.
- En los demás casos: decide, registra en docs/DECISIONS.md (decisión y motivo en una frase) y continúa.

## Hitos (cada uno con su prueba)
H1 Contrato y fixtures; test de reconciliación que falla antes y pasa después.
H2 KPIs con los casos C1–C6 del brief.
H3 Vista; captura con datos del fixture y lista de diferencias frente al boceto.
H4 Comentario narrativo anclado a pipeline_kpis.json.

## Hecho cuando
- La suite de tests pasa (adjunta el comando y su salida).
- out/pipeline_kpis.json valida contra schemas/pipeline_kpis.schema.json y cumple I1–I4.
- Solo cambiaron rutas permitidas (adjunta git diff --stat).

## Reporte final (formato fijo)
1) Resultado en una frase 2) Archivos cambiados 3) Comandos y resultados
4) Reconciliación esperado vs obtenido 5) Supuestos y decisiones (IDs, justificación breve)
6) Pendientes y riesgos. Cada afirmación debe apuntar a una evidencia.
```

[inferencia] La plantilla combina los elementos documentados de Codex (Goal, Context, Constraints, Done when) [src-openai-codex-best-practices], la evidencia y el alcance de Claude Code [src-anthropic-cc-best-practices], la política de ambigüedad de GPT-5.6 [src-openai-gpt56-model-guidance] y los hitos con prueba del ExecPlan [src-openai-codex-execplans]. No es una receta universal: hay que ajustar su extensión a la tarea.

---

## 6. Registro de fuentes

Todas las fuentes se consultaron el 2026-10-21. "Pág. act." es la fecha de actualización que muestra la propia página, cuando la tiene. Criterio de próxima revisión: volatilidad alta → 2027-01-21; media → 2027-04-21; baja → 2027-10-21; con fecha crítica conocida → indicada.

| ID | Título | Organización | URL | Consultado | Afirmaciones que sustenta | Primaria / secundaria | Volatilidad | Próxima revisión sugerida |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| src-anthropic-cc-best-practices | Best practices for Claude Code | Anthropic | https://code.claude.com/docs/en/best-practices | 2026-10-21 | Verificación ejecutable y evidencia; explorar → planificar → implementar; omitir el plan si el diff cabe en una frase; prompts específicos; entrevista y SPEC.md; CLAUDE.md conciso; énfasis puntual; dos correcciones → `/clear`; revisor en contexto fresco y su sesgo a encontrar fallas; patrones de fallo; comandos (`/goal`, Stop hook, `/rewind`…) | Primaria | Alta | 2027-01-21 |
| src-anthropic-cc-headless | Run Claude Code programmatically | Anthropic | https://code.claude.com/docs/en/headless | 2026-10-21 | `claude -p`, `--output-format json`, `--json-schema` → `structured_output`; `format` no se impone; comprobar que el campo exista | Primaria | Alta | 2027-01-21 |
| src-anthropic-prompting-overview | Prompt engineering overview | Anthropic | https://platform.claude.com/docs/en/build-with-claude/prompt-engineering/overview | 2026-10-21 | Requisitos previos (criterios de éxito, tests empíricos, primer borrador); no todo se arregla con prompting; el tutorial interactivo se escribió para Claude 3 | Primaria | Media | 2027-04-21 |
| src-anthropic-prompting-bp | Prompting best practices | Anthropic | https://platform.claude.com/docs/en/build-with-claude/prompt-engineering/claude-prompting-best-practices | 2026-10-21 | Claridad, prueba del colega, contexto y motivo; ejemplos (3–5, diversos, en etiquetas); XML; rol; documentos largos primero (hasta 30 %); qué hacer en lugar de qué no; prefill no admitido desde 4.6; sugerir frente a actuar; lenguaje agresivo → sobreuso; thinking adaptativo; CoT manual solo como recurso; la petición de razonamiento visible puede rechazarse; autoverificación y sobreverificación en Opus 5; cadena de autocorrección; re-chequear técnicas por modelo; ejemplo del dashboard | Primaria | Alta | 2027-01-21 |
| src-anthropic-prompting-fable5 | Prompting Claude Fable 5 | Anthropic | https://platform.claude.com/docs/en/build-with-claude/prompt-engineering/prompting-claude-fable-5 | 2026-10-21 | Dar el motivo y no solo la petición; seguimiento de instrucciones fuerte; delimitar el alcance; auditar afirmaciones de progreso; verificadores en contexto fresco; skills antiguas demasiado prescriptivas; no pedir que reproduzca su razonamiento | Primaria | Alta | 2027-01-21 |
| src-anthropic-prompting-sonnet55 | Prompting Claude Sonnet 5.5 | Anthropic | https://platform.claude.com/docs/en/build-with-claude/prompt-engineering/prompting-claude-sonnet-5-5 | 2026-10-21 | Añadidos no pedidos; párrafo para limitar el alcance; JSON en tareas de cálculo ("think first", `max_tokens` = fallo); verificación omitida a esfuerzo bajo; `reasoning_extraction` | Primaria | Alta | 2027-01-21 |
| src-anthropic-refusals | Refusals and fallback | Anthropic | https://platform.claude.com/docs/en/build-with-claude/refusals-and-fallback | 2026-10-21 | Categoría `reasoning_extraction`; ejemplos de prompts que la disparan; sin fallback para esa categoría; alternativas (explicación breve, evidencia, resumen de acciones, thinking resumido) | Primaria | Alta | 2027-01-21 |
| src-anthropic-thinking | Thinking | Anthropic | https://platform.claude.com/docs/en/build-with-claude/thinking | 2026-10-21 | Los bloques de thinking son resúmenes, nunca el CoT en bruto; `display` omitted / summarized / updates; valores por defecto según el modelo | Primaria | Alta | 2027-01-21 |
| src-anthropic-structured-outputs | Structured outputs | Anthropic | https://platform.claude.com/docs/en/build-with-claude/structured-outputs | 2026-10-21 | `output_config.format`; GA; garantiza el schema pero no la exactitud; subconjunto de JSON Schema (sin min/max ni recursión); orden de propiedades; mayúsculas en enums; límites; caché de gramática de 24 h; refusal y `max_tokens`; un campo de razonamiento puede disparar `reasoning_extraction` | Primaria | Alta | 2027-01-21 |
| src-anthropic-develop-tests | Define success criteria and build evaluations | Anthropic | https://platform.claude.com/docs/en/test-and-evaluate/develop-tests | 2026-10-21 | Criterios específicos, medibles, alcanzables y pertinentes; multidimensionales; evals específicas de la tarea, automatizadas y con volumen; código > LLM > humano; tips para jueces LLM (rúbrica, salida empírica, thinking activado, modelo distinto) | Primaria | Media | 2027-04-21 |
| src-anthropic-reduce-hallucinations | Reduce hallucinations | Anthropic | https://platform.claude.com/docs/en/test-and-evaluate/strengthen-guardrails/reduce-hallucinations | 2026-10-21 | Permitir "no lo sé"; citas textuales; verificación con citas; best-of-N; restricción al conocimiento provisto; las técnicas no eliminan las alucinaciones | Primaria | Media | 2027-04-21 |
| src-anthropic-evals-agents | Demystifying evals for AI agents (2026-01-09) | Anthropic | https://www.anthropic.com/engineering/demystifying-evals-for-ai-agents | 2026-10-21 | Tarea, ensayo, calificador, transcripción y resultado; tipos de calificador; evals de capacidad frente a regresión; pass@k frente a pass^k; 20–50 tareas; solución de referencia; conjuntos balanceados; leer transcripciones; calificar resultados, no rutas; "Unknown" | Primaria | Media | 2027-04-21 |
| src-anthropic-building-agents | Building effective agents (2024-12-19) | Anthropic | https://www.anthropic.com/engineering/building-effective-agents | 2026-10-21 | Encadenamiento con compuertas; evaluator-optimizer cuando hay criterios claros; empezar simple; workflows frente a agentes | Primaria | Baja | 2027-10-21 |
| src-anthropic-cot-faithfulness | Reasoning models don't always say what they think (2025-04-03) | Anthropic | https://www.anthropic.com/research/reasoning-models-dont-say-think | 2026-10-21 | CoT no fiel (≈25 % Claude 3.7 Sonnet, ≈39 % DeepSeek R1); el monitoreo del CoT no permite descartar conductas indebidas | Primaria (investigación) | Media | 2027-04-21 |
| src-anthropic-blog-prompting | Best practices for prompt engineering (2025-11-10) | Anthropic | https://claude.com/blog/best-practices-for-prompt-engineering | 2026-10-21 | Errores comunes (sobreingeniería, todas las técnicas a la vez, técnicas obsoletas); role prompting intenso menos necesario; menciona prefill y CoT, hoy restringidos | Primaria (divulgativa) | Media | 2027-04-21 |
| src-openai-codex-best-practices | Best practices (Codex) | OpenAI | https://learn.chatgpt.com/guides/best-practices | 2026-10-21 | Goal / Context / Constraints / Done when; esfuerzo de razonamiento y modelos GPT-6.x; planificar primero; AGENTS.md (alcances, `/init`, retrospectiva); configuración por capas; tests y `/review`; errores comunes; una conversación por unidad de trabajo. Superficies: CLI, IDE, app | Primaria | Alta | 2027-01-21 |
| src-openai-codex-prompting | Prompting (Codex) | OpenAI | https://learn.chatgpt.com/docs/prompting (redirigida desde developers.openai.com/codex/prompting) | 2026-10-21 | Contenido de un buen prompt (comportamiento, reproducción, restricciones, verificación); reproducir antes de corregir; informar comandos y resultados; superficies IDE, CLI, cloud, app y GitHub | Primaria | Alta | 2027-01-21 |
| src-openai-codex-noninteractive | Non-interactive mode (Codex) | OpenAI | https://learn.chatgpt.com/docs/non-interactive-mode (redirigida desde developers.openai.com/codex/noninteractive) | 2026-10-21 | `codex exec --output-schema`, `-o`, `--json` | Primaria | Alta | 2027-01-21 |
| src-openai-codex-execplans | Using PLANS.md for multi-hour problem solving (archivada) | OpenAI | https://developers.openai.com/cookbook/articles/codex_exec_plans | 2026-10-21 | ExecPlan autocontenido; secciones vivas (Progress, Decision Log…); hitos con prueba; aceptación como comportamiento observable; resolver la ambigüedad y registrarla; idempotencia | Primaria | Media | 2027-04-21 |
| src-openai-prompt-engineering | Prompt engineering | OpenAI | https://developers.openai.com/api/docs/guides/prompt-engineering | 2026-10-21 | Prioridad developer > user; Markdown/XML; identidad → instrucciones → ejemplos → contexto (el orden varía por modelo); few-shot diverso; reasoning "senior" frente a GPT "junior"; fijar snapshots; prompts en código; `v1/prompts` cierra el 2026-11-30 | Primaria | Alta | 2026-12-01 |
| src-openai-prompt-guidance-gpt6 | Prompt guidance (familia GPT-6) | OpenAI | https://developers.openai.com/api/docs/guides/prompt-guidance | 2026-10-21 | GPT-6 Astra: iniciativa, aclaraciones, sensibilidad a skills/AGENTS.md, testing calibrado al cambio | Primaria | Alta | 2027-01-21 |
| src-openai-latest-model | Using GPT-6 | OpenAI | https://developers.openai.com/api/docs/guides/latest-model | 2026-10-21 | GPT-6 Astra / 6.1 Sol / 6 Luna; Astra pide más aclaraciones, es sensible a conflictos entre skills y AGENTS.md y prueba de más; migración (quitar temperature/top_p) | Primaria | Alta | 2027-01-21 |
| src-openai-gpt56-model-guidance | Model guidance (GPT-5.6) | OpenAI | https://developers.openai.com/api/docs/guides/latest-model?model=gpt-5.6 (contenido equivalente en https://developers.openai.com/api/docs/guides/prompt-guidance?model=gpt-5.6, también consultada) | 2026-10-21 | Prompts centrados en el resultado; prompts más ligeros (+10–15 % en scores, −41–66 % de tokens, orientativo); ablación con las mismas evals; autonomía en tres niveles; enunciar cada regla una vez; decir qué ambigüedades llevan a preguntar; condiciones de parada; menor costo solo si pasa las evals | Primaria | Alta | 2027-01-21 |
| src-openai-reasoning-bp | Reasoning best practices | OpenAI | https://developers.openai.com/api/docs/guides/reasoning-best-practices | 2026-10-21 | Prompts simples y directos; evitar prompts de CoT; zero-shot primero; ejemplos alineados; meta y criterios claros. Contenido centrado en o1/o3/GPT-4o | Primaria | Media | 2027-04-21 |
| src-openai-reasoning | Reasoning models | OpenAI | https://developers.openai.com/api/docs/guides/reasoning | 2026-10-21 | Tokens de razonamiento no visibles; razonamiento en bruto no expuesto; resúmenes opcionales; reasoning items cifrados; niveles de esfuerzo | Primaria | Alta | 2027-01-21 |
| src-openai-structured-outputs | Structured Outputs | OpenAI | https://developers.openai.com/api/docs/guides/structured-outputs | 2026-10-21 | Adherencia al schema frente a JSON mode; función frente a formato de respuesta; subconjunto y límites de JSON Schema; orden de claves; refusals; Pydantic/Zod; puede contener errores; entradas que no encajan; evitar divergencia; ejemplo con `steps` | Primaria | Media | 2027-04-21 |
| src-openai-eval-best-practices | Evaluation best practices | OpenAI | https://developers.openai.com/api/docs/guides/evaluation-best-practices | 2026-10-21 | Proceso de eval en 5 pasos; antipatrones (por sensaciones…); evals por arquitectura; tipos de calificador; sesgos de posición y verbosidad; pairwise; calibración humana; casos borde; aviso de deprecación de Evals | Primaria | Alta (por el aviso) | 2026-12-01 |
| src-openai-evals-guide | Evals (guía) | OpenAI | https://developers.openai.com/api/docs/guides/evals | 2026-10-21 | Evals en solo lectura el 2026-10-31 y cierre el 2026-11-30; Datasets como alternativa; flujo básico (`data_source_config`, `testing_criteria`, runs) | Primaria | Alta | 2026-12-01 |
| src-openai-gpt5-prompting-guide | GPT-5 prompting guide (archivada) | OpenAI | https://developers.openai.com/cookbook/examples/gpt-5/gpt-5_prompting_guide | 2026-10-21 | Las instrucciones contradictorias dañan más (ejemplo de agenda médica); control de la "eagerness"; metaprompting | Primaria | Media | 2027-04-21 |
| src-google-prompting-strategies | Prompt design strategies (pág. act. 2026-10-13) | Google | https://ai.google.dev/gemini-api/docs/prompting-strategies | 2026-10-21 | Instrucciones claras; restricciones; formato; "always include few-shot"; sobreajuste; formato consistente; contexto; dividir / encadenar / agregar; ejecución de código para aritmética; Gemini 3 (delimitador único, términos ambiguos, documentos primero, pensamiento interno); temperatura en Gemini 4 y 3.6+; plantilla agéntica | Primaria | Media (sección Gemini 3: alta) | 2027-01-21 |
| src-google-structured-output | Structured outputs (pág. act. 2026-10-21) | Google | https://ai.google.dev/gemini-api/docs/structured-output | 2026-10-21 | `response_format` y schema; keywords admitidas e ignoradas; validez sintáctica frente a semántica; validar en la aplicación; límites; herramientas en preview (Gemini 3) | Primaria | Alta | 2027-01-21 |
| src-google-thinking | Gemini thinking (pág. act. 2026-10-14) | Google | https://ai.google.dev/gemini-api/docs/thinking | 2026-10-21 | Pensamientos en bruto no devueltos; resúmenes opcionales; `thinking_level`; firmas de pensamiento | Primaria | Alta | 2027-01-21 |
| src-github-speckit-repo | github/spec-kit (README) | GitHub | https://github.com/github/spec-kit | 2026-10-21 | Qué es Spec Kit; procesos (SDD, bug, assess); comandos con guion; instalación; `/speckit-converge` | Primaria | Alta | 2027-01-21 |
| src-github-speckit-sdd-doc | Spec-Driven Development (spec-driven.md) | GitHub | https://github.com/github/spec-kit/blob/main/spec-driven.md | 2026-10-21 | Especificación como artefacto primario; plantillas que restringen al LLM; `[NEEDS CLARIFICATION]`; checklists; test-first; anti-especulación; constitution | Primaria | Media | 2027-04-21 |
| src-github-speckit-docs | Spec Kit docs (pág. act. 2026-09-28) | GitHub | https://github.github.io/spec-kit/ | 2026-10-21 | Fases Specify → Plan → Tasks → Implement → Converge; fecha de actualización | Primaria | Alta | 2027-01-21 |
| src-github-speckit-quickstart | Spec Kit quickstart | GitHub | https://github.github.io/spec-kit/quickstart.html | 2026-10-21 | Pasos constitution… converge; clarify antes de plan; checklist como prueba de requisitos; analyze de solo lectura; corregir en el origen; especificación frente a plan; ruta corta y completa | Primaria | Alta | 2027-01-21 |
| src-github-copilot-prompt-eng | Prompt engineering for GitHub Copilot | GitHub | https://docs.github.com/en/copilot/concepts/prompting/prompt-engineering | 2026-10-21 | De lo general a lo específico; peso del principio y el final; ejemplos y tests primero; dividir tareas; evitar ambigüedad; contexto por superficie (IDE, CLI, cloud agent); historial relevante | Primaria | Media | 2027-04-21 |
| src-github-copilot-agent-bp | Best practices for using GitHub Copilot to work on tasks | GitHub | https://docs.github.com/copilot/how-tos/agents/copilot-coding-agent/best-practices-for-using-copilot-to-work-on-tasks | 2026-10-21 | Issue como prompt; descripción, criterios de aceptación y archivos; tareas adecuadas e inadecuadas; archivos de instrucciones (incluye AGENTS.md / CLAUDE.md / GEMINI.md) | Primaria | Alta | 2027-01-21 |
| src-cucumber-gherkin | Gherkin Reference | Cucumber | https://cucumber.io/docs/gherkin/reference/ | 2026-10-21 | Given / When / Then; Then observable, no estado interno; 3–5 pasos; Background breve; localización con `# language:` | Primaria | Baja | 2027-10-21 |
| src-xp123-invest | INVEST in Good Stories, and SMART Tasks (2003-08-17) | XP123 (Bill Wake) | https://xp123.com/articles/invest-in-good-stories-and-smart-tasks/ | 2026-10-21 | Criterios INVEST (Valuable, Testable…); SMART para tareas | Primaria | Baja | 2027-10-21 |
| src-dannorth-bdd | Introducing BDD (2006-09-20; Better Software, marzo de 2006) | Dan North | https://dannorth.net/blog/introducing-bdd/ | 2026-10-21 | Plantilla de historia rol / capacidad / beneficio; escenarios Given / When / Then; criterios de aceptación ejecutables | Primaria | Baja | 2027-10-21 |
| src-kiro-specs | Specs (Kiro) (pág. act. 2026-10-15) | Kiro (AWS) | https://kiro.dev/docs/specs/ | 2026-10-21 | `requirements.md` / `design.md` / `tasks.md`; variantes de spec | Primaria | Alta | 2027-01-21 |
| src-kiro-requirements-first | Requirements-First (Kiro) (pág. act. 2026-09-25) | Kiro (AWS) | https://kiro.dev/docs/specs/feature-specs/requirements-first/ | 2026-10-21 | Formato EARS (WHEN … THE SYSTEM SHALL …) y beneficios declarados | Primaria | Alta | 2027-01-21 |
| src-thoughtworks-sdd-tools | Understanding Spec-Driven-Development: Kiro, spec-kit, and Tessl (2025-10-15) | Thoughtworks / martinfowler.com (B. Böckeler) | https://martinfowler.com/articles/exploring-gen-ai/sdd-3-tools.html | 2026-10-21 | Niveles spec-first / anchored / as-source; críticas (costo en tareas pequeñas, carga de revisión, agentes que no siguen la spec, falsa sensación de control); Kiro: 16 criterios para un bug pequeño | Secundaria (análisis experto) | Media | 2027-04-21 |
| src-arxiv-llm-judge | Judging LLM-as-a-Judge with MT-Bench and Chatbot Arena (2023) | Zheng et al. (UC Berkeley y otros; NeurIPS 2023 D&B) | https://arxiv.org/abs/2306.05685 | 2026-10-21 | Sesgos de posición, verbosidad y autofavorecimiento; más del 80 % de acuerdo con humanos en jueces fuertes | Primaria (investigación) | Baja | 2027-10-21 |
| src-arxiv-cot | Chain-of-Thought Prompting Elicits Reasoning in Large Language Models (2022) | Wei et al. (Google) | https://arxiv.org/abs/2201.11903 | 2026-10-21 | Origen del CoT por prompting en modelos grandes (contexto histórico) | Primaria (investigación) | Baja | 2027-10-21 |

---

## 7. Huecos (lo que no pude verificar)

1. **Fechas de las páginas de OpenAI y GitHub.** Las guías de Codex, las páginas de GPT-6 y GPT-5.6, la de Structured Outputs y las de Copilot no muestran fecha de publicación ni de actualización. No pude fechar cuándo entró en vigor cada recomendación.
2. **Guía oficial "GPT-6 Astra prompting".** Encontré la guía de la familia GPT-6 (`prompt-guidance`) y la de GPT-5.6, pero no una guía específica de Astra con fecha. La cobertura de prensa sobre la guía de GPT-5.6 (julio de 2026) no la abrí ni la uso.
3. **Versión de Spec Kit.** El README menciona una conversación sobre "Spec Kit 1.0" en un video del 2026-10-16, pero no confirmé número de versión ni fecha de release. Además, la nomenclatura de comandos difiere: con guion en el README y el quickstart, con punto en `spec-driven.md`.
4. **Codex `--output-schema`.** No está documentado qué ocurre si la salida final no cumple el schema, ni qué subconjunto de JSON Schema se admite.
5. **Orden de propiedades en Gemini.** La página de structured output consultada no lo trata. Tampoco verifiqué si los parámetros `responseJsonSchema` / `responseSchema` de `generateContent` siguen vigentes frente a la Interactions API que usa la página.
6. **Claude Code y `reasoning_extraction`.** No hallé en la documentación de Claude Code una mención explícita a esa categoría. La aplicación a CLAUDE.md o skills es inferencia a partir de la guía de Fable 5.
7. **Patrones frente a anti-patrones en ejemplos (Google).** La versión actual de la página no trata si los ejemplos positivos funcionan mejor que los negativos. No pude verificar versiones anteriores.
8. **EARS.** Solo verifiqué su uso en Kiro (patrón WHEN … SHALL). No abrí la fuente original de EARS ni confirmé sus otros patrones (WHILE, IF/THEN, WHERE).
9. **Estándares de calidad de requisitos** (por ejemplo, ISO/IEC/IEEE 29148): no los consulté porque no son de acceso abierto.
10. **Tamaños de efecto.** Las cifras que aparecen ("hasta 30 %" de Anthropic; "+10–15 %" de GPT-5.6; 42 % de pass^3 como ejemplo aritmético) son pruebas internas u orientativas de los proveedores. No encontré evidencia independiente específica para herramientas analíticas financieras.
11. **Página de Prompting Claude Opus 5.** No la abrí. La afirmación sobre sobreverificación en Opus 5 procede de la guía general de Anthropic.
12. **`/goal` de Claude Code y de Codex.** Solo los verifiqué a través de las páginas de buenas prácticas y de prompting, no en su documentación propia.
13. **Material para examen.** Las palabras clave de Gherkin en español no están verificadas (la referencia confirma la localización con `# language:` pero no lista los términos en español). Por eso los ejemplos usan las palabras clave en inglés.

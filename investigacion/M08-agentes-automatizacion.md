# M08 — Agentes, automatización y equipos · Base de investigación

- **Archivo:** `investigacion/M08-agentes-automatizacion.md`
- **Fecha de investigación:** 2026-10-26. Todas las fuentes nuevas se abrieron ese día; las reutilizadas que se volvieron a abrir llevan esa fecha, y las que no se reabrieron conservan la de su registro previo (§6).
- **Elaborado por:** subagente de investigación (Claude Code) para el autor de M08.
- **Estado:** base factual y conceptual para redactar las 6 lecciones, el laboratorio como caso y el banco de M08. No es contenido final para el alumno.
- **Convenciones (las mismas que M02, M04 y M07):**
  - `[src-…]` = ID de fuente del registro (§6). La afirmación está documentada en esa fuente (parafraseada). Los IDs reutilizados son los exactos de `content/sources.json` (por ejemplo `src-owasp-llm06`, no `src-owasp-llm06-excessive-agency`).
  - `[inferencia]` = conclusión, síntesis o recomendación propia que ninguna fuente afirma literalmente.
  - **Ficha candidata** = afirmación que depende de un producto o una versión. Según D-019 va en una ficha de producto fechada, nunca en el cuerpo de la lección (como máximo dos por lección, D-021).
  - Citas textuales: como máximo una por fuente y de menos de 15 palabras.
- **Datos:** todos los ejemplos usan el caso ficticio Altiplano Industrial S.A. (M02 §2.0) y los archivos sintéticos de `content/courses/m02/practice/data/` (snapshots del 2026-10-19 y del 2026-10-26, `reconcile.py`). Las URLs de servicios son de dominios reservados para ejemplos (`*.example`). Los tokens son marcadores evidentes (`TOKEN_FICTICIO_…`). Las cifras y salidas de `reconcile.py` que aparecen aquí se obtuvieron ejecutando el script el 2026-10-26 (§3.0); no hay cifras calculadas a mano.
- **Aviso para el banco, las comprobaciones y el laboratorio (decisiones ya expuestas):**
  - `dx-b6-01` (C10, `sectionRef: m08-l1`): «cada lunes el mismo reporte, pasos fijos» → flujo fijo programado con un modelo solo para redactar; distractores «agente autónomo» y «varios agentes en paralelo, uno por paso». **No repetir** ese escenario ni esa pregunta («¿qué solución eliges para un reporte de pasos fijos?») en L1, en el examen ni en el laboratorio. M08 parte de esa respuesta y pregunta otra cosa: qué paso merece un modelo, qué patrón describe una propuesta, qué cuesta y qué falla.
  - `dx-b6-04` (C12, C10): agente nocturno de reconciliación y pass@k frente a pass^k. **No repetir** la métrica de consistencia en L6; eso es de M09. L6 habla de registros, detención y verificación proporcional, no de cómo medir la tasa de acierto.
  - `dx-b4-04` (C07): «repartir un cambio dependiente entre varios agentes en paralelo» como distractor. L3 desarrolla el concepto con escenarios nuevos (partes con y sin dependencias, mismo archivo, integración), no con el cambio de duplicados.
  - `dx-b3-01` (C03, sesión larga que olvida una restricción) y `dx-b3-02` (C04, C11, hook `pre-commit` contra secretos): L5 no vuelve a preguntar «¿dónde va una regla que no puede fallar?» con secretos; usa reglas nuevas del caso (no tocar `expected/` ni el archivo de supuestos, correr la reconciliación tras cada edición, no terminar sin que pase).
  - M03 L1 y L3 ya enseñaron «aislar en un subagente cuesta tokens propios» y «hook = control determinista». M04 L4 enseñó qué es un worktree. M05 L2 enseñó delegar la exploración en un subagente; M05 L3 prometió que «el manual 8 vuelve sobre esas compuertas»; M05 L6 enseñó local frente a nube y que paralelizar solo sirve con tareas independientes. M07 L6 enseñó la ejecución desatendida de una integración (permisos, MCP del proyecto, credenciales, registro y fallo explícito) con la «conciliación del viernes» de Cobranza, y el laboratorio M07 usó «el informe del lunes que corre solo» con el CRM ficticio. **M08 no repite esas definiciones ni esos escenarios**: los da por sabidos y decide sobre ellos (cuándo paralelizar, qué patrón, qué condición de término, dónde programar, qué hook, cuándo detener).
  - Fichas ya publicadas que M08 **complementa y no duplica:** `m04-pc-worktrees`, `m05-pc-verification-gates` (`/goal`, hook Stop como compuerta, subagente verificador), `m05-pc-cloud-agents`, `m07-pc-headless-integrations` (permisos y MCP en `-p` y `codex exec`).
- **Alumno:** profesional de finanzas que dirige agentes de código. No se forma a quien construye frameworks de agentes: se forma a alguien capaz de decidir cuánta autonomía conviene, encargar con condición de término, decidir si paralelizar, elegir dónde y cuándo corre algo sin él, convertir una regla en un control del arnés y detener lo que falla (`docs/curriculum.md`, M08).
- **D-024:** toda evaluación es de opción múltiple. Los objetivos se formulan como decisiones («elige», «identifica», «decide») y el laboratorio es un caso por pasos con preguntas, sin entregable.

---

## 1. Resumen ejecutivo

1. **La pregunta central de M08 se responde con una regla y cinco preguntas.** La regla: empezar por la solución más simple y añadir pasos con modelo, agentes o paralelismo solo cuando lo simple se queda corto, porque la autonomía cambia costo y latencia por rendimiento [src-anthropic-building-agents]. Las preguntas: ¿los pasos son predecibles? ¿qué entregable y qué condición de término? ¿las partes son independientes? ¿dónde y cuándo corre sin mí? ¿qué debe ocurrir siempre, aunque el modelo lo olvide? Lo estable son esos criterios; lo volátil (subagentes, equipos de agentes, tareas programadas, hooks, modo headless por producto) va en fichas.
2. **Flujo fijo frente a agente es una distinción operativa.** En un flujo, el código fija el camino; en un agente, el modelo decide sus pasos y herramientas en un bucle, contrastando cada paso con lo que devuelve el entorno [src-anthropic-building-agents]. Hay cinco patrones intermedios con usos distintos: cadena de prompts, enrutamiento, paralelización (por secciones o por votación), orquestador-trabajadores y evaluador-optimizador [src-anthropic-building-agents]. Un agente conviene cuando los pasos no se pueden predecir; trae más costo y errores que se acumulan, y pide pruebas en entornos aislados y condiciones de parada [src-anthropic-building-agents].
3. **Delegar bien es escribir un encargo autocontenido.** El sistema multiagente de investigación de Anthropic falló al principio con instrucciones vagas (subagentes que duplicaban trabajo o interpretaban otra tarea) y mejoró cuando cada encargo llevó objetivo, formato de salida, herramientas y límites de la tarea [src-anthropic-eng-multi-agent-research]. En un estudio de más de 1 600 trazas de sistemas multiagente, dos modos de fallo frecuentes fueron no reconocer la condición de término (12,4 %) y terminar antes de tiempo (6,2 %), y casi un 17 % fueron verificaciones ausentes o incorrectas [src-arxiv-mast-mas-failures].
4. **Más agentes significa más tokens, no más calidad garantizada.** En las mediciones de Anthropic, un agente usa unas 4 veces los tokens de un chat y un sistema multiagente unas 15 veces; el uso de tokens explicó el 80 % de la varianza de rendimiento en su prueba de búsqueda [src-anthropic-eng-multi-agent-research]. La misma fuente desaconseja el multiagente cuando todos necesitan el mismo contexto, cuando hay muchas dependencias y en la mayoría de las tareas de programación [src-anthropic-eng-multi-agent-research]. Un estudio de 260 configuraciones encontró desde +80,8 % en una tarea financiera descomponible hasta −70,0 % en planificación secuencial frente a un solo agente [src-arxiv-scaling-agent-systems].
5. **Los subagentes protegen el contexto; los worktrees protegen los archivos.** Un subagente trabaja en un contexto limpio y devuelve un resumen condensado (a menudo de 1 000 a 2 000 tokens) [src-anthropic-eng-context]; no hereda la conversación y gasta sus propios tokens [src-anthropic-cc-subagents]. Un worktree enlazado tiene su propio `HEAD`, índice y archivos, comparte el resto del repositorio, y Git no deja la misma rama en dos worktrees [src-git-worktree]. Paralelizar edición sigue exigiendo integrar después: dos agentes que editan el mismo archivo se pisan [src-anthropic-cc-agent-teams], y dos que actúan con supuestos distintos producen piezas que no encajan [src-cognition-dont-build-multi-agents].
6. **Delegación asíncrona = elegir dónde corre y qué ve.** Las opciones se distinguen por si necesitan la máquina encendida, una sesión abierta, acceso a archivos locales y quién aprueba durante la ejecución (ficha L4) [src-anthropic-cc-scheduled-tasks][src-anthropic-cc-routines][src-openai-codex-scheduled-tasks]. Una tarea programada se escribe como un encargo autocontenido con criterio de éxito, porque nadie la va a acompañar [src-anthropic-cc-routines]. Un planificador no garantiza el resultado: hay que vigilar lo que el trabajo hace, y suele ser preferible saltarse una ejecución que lanzarla dos veces [src-google-sre-cron].
7. **El arnés también se automatiza.** Un hook ejecuta un comando en un punto fijo del ciclo del agente (antes o después de una herramienta, al terminar un turno), así que la acción ocurre siempre y no depende de que el modelo la elija [src-anthropic-cc-hooks-guide]. Tiene límites documentados: lo que pasa después de una herramienta no se deshace [src-anthropic-cc-hooks-guide], un hook al terminar puede encadenar al agente en un bucle si no se acota (ficha), y otra herramienta advierte que sus hooks de herramientas no son una frontera de control completa [src-openai-codex-hooks]. El modo headless (`claude -p`, `codex exec`) convierte al agente en un comando con código de salida y salida estructurada para scripts y CI (ficha L5) [src-anthropic-cc-headless][src-openai-codex-noninteractive].
8. **Lo no supervisado se verifica con algo que no sea el propio agente.** El estado de una ejecución programada puede decir «terminó bien» aunque el trabajo no se hizo: en un producto documentado, «Succeeded» describe cómo terminó la sesión, no si se cumplió el encargo (ficha L6) [src-anthropic-cc-routines]. En Altiplano, el check es `reconcile.py`, que distingue 0 (todo coincide), 1 (el dashboard difiere) y 2 (faltan datos o un supuesto) (README de M02). Ante un fallo: leer el registro, detener o pausar la tarea, no reintentar a ciegas y comparar con la alternativa más simple [inferencia, apoyada en src-google-sre-cron y src-anthropic-building-agents].
9. **Volatilidad:** baja en los patrones de flujo, el principio de empezar simple, Git worktree y la fiabilidad de tareas periódicas; media en la investigación sobre sistemas multiagente (cifras ligadas a modelos de 2025-2026); muy alta en subagentes, equipos de agentes, tareas programadas, hooks y modo headless por producto. Varias funciones siguen en vista previa: las tareas programadas en la nube de Claude Code están en *research preview* y los equipos de agentes son experimentales y vienen desactivados (fichas, revisión trimestral, próxima 2027-01-26).

---

## 2. Blueprint propuesto (objetivos evaluados del manual)

Seis objetivos, uno por lección (`docs/content-standard.md` §3.3). Cada uno con 2 familias en el banco, 2 ítems en el examen y 2 preguntas en el laboratorio. Todos formulados como decisiones evaluables por escenario (D-024).

| ID | Objetivo evaluado | Competencia | Lección | Evidencia |
| --- | --- | --- | --- | --- |
| M08-OE1 | Dado un proceso del caso Altiplano (o una propuesta de diseño para él), **identifica** qué pasos son deterministas y cuáles necesitan un modelo, **reconoce** el patrón que describe la propuesta (cadena, enrutamiento, paralelización, orquestador-trabajadores, evaluador-optimizador o agente) y **elige** el diseño más simple que cumple. | C10 | L1 | Serie intercalada, comprobaciones, banco; laboratorio paso 1 |
| M08-OE2 | Dado un encargo para un agente o un subagente, **identifica** la pieza que falta (objetivo, entregable, herramientas permitidas, estado que debe dejar escrito, criterio y condición de término) y **elige** una condición de término verificable frente a una que depende del juicio del propio agente. | C10 (apoyo C02) | L2 | Comprobaciones, banco; laboratorio paso 2 |
| M08-OE3 | Dado un trabajo divisible, **decide** si paralelizarlo con subagentes, sesiones en worktrees o un equipo de agentes, o mantenerlo en una sola sesión, según dependencias, contexto compartido, archivos que se tocarían a la vez y costo en tokens, e **identifica** el riesgo de integración que queda. | C10, C03, C06 | L3 | Serie intercalada, comprobaciones, banco; laboratorio paso 3 |
| M08-OE4 | Dado un trabajo que no debe esperar a la persona, **elige** dónde corre (nube, segundo plano local, tarea programada en la nube, en el equipo o dentro de la sesión, CI) según qué archivos ve, si la máquina debe estar encendida, quién aprueba durante la ejecución y qué entregable revisable deja. | C10 (apoyo C01) | L4 | Comprobaciones, banco; laboratorio paso 4 |
| M08-OE5 | Dada una regla o un paso que debe ocurrir siempre, **elige** entre instrucción, hook (antes de una herramienta, después de una herramienta, al terminar) o ejecución headless en un script o CI, e **identifica** el límite de ese control (no deshace, puede encadenar un bucle, configuración del proyecto que se ejecuta sin confianza, cobertura incompleta). | C10 (apoyo C11) | L5 | Comprobaciones, banco; laboratorio paso 5 |
| M08-OE6 | Dado el registro, el costo o el resultado de una automatización que falló o salió más cara de lo previsto, **identifica** la causa en la evidencia, **decide** la primera acción (detener o pausar antes de reintentar) y **elige** entre corregirla o volver a una alternativa más simple, con una verificación proporcional a lo que nadie supervisó. | C10 (apoyo C12) | L6 | Comprobaciones, banco; caso de transferencia; laboratorio paso 6 |

**Notas de diseño [inferencia]:**

- C10 está en los seis objetivos. C03 (aislar en un subagente) y C06 (worktrees) entran como competencias explícitas en OE3, que es donde M08 las aplica; C01 apoya OE4 (elegir superficie para trabajo asíncrono); C11 apoya OE5 (controles deterministas); C12 apoya OE6 (verificar lo no supervisado), sin invadir M09.
- Los tres comportamientos de C10 de `content/competencies.json` quedan cubiertos: justificar flujo fijo, agente, subagentes, nube o programación (OE1, OE3, OE4), con condiciones de término y entregables (OE2) y con costo (OE3, OE6).
- **Series intercaladas obligatorias** (`content-standard.md` §3.2): el estándar nombra decisiones que se confunden. Una serie de 5 casos al final de L1 (flujo fijo / patrón concreto / agente / nada) y otra al final de L3 (una sesión / subagentes / worktrees en paralelo / equipo de agentes). L4 puede llevar una tabla de decisión, no una serie, para no recargar.
- **Límite del manual** (`docs/curriculum.md`): usar más agentes no acredita más calidad. Al menos una familia por objetivo debe tener la opción «más agentes» o «más autonomía» como distractor plausible, y al menos una debe tener «menos autonomía» como respuesta correcta.
- OE6 es el objetivo con más riesgo de solaparse con M09. Regla de frontera: M08 decide **qué hacer con la ejecución** (leer registro, detener, simplificar, poner una compuerta); M09 decide **cómo medir** si una versión es mejor (casos, graders, pass^k).

---

## 3. Lecciones

### 3.0 Material del caso que se reutiliza

M08 no inventa datos de negocio nuevos: reutiliza los de M02 y añade piezas sintéticas de automatización.

| Pieza | Para qué sirve en M08 |
| --- | --- |
| `opportunities_snapshot_2026-10-19.csv` (M02) | Snapshot de referencia del reporte semanal. 40 filas de datos. Problemas sembrados: duplicado OPP-1012, OPP-1021 sin fecha de cierre, OPP-1027 «Negociacion» sin tilde, OPP-1036 «En revisión» sin probabilidad, seis montos en EUR, seis vencidas (README de M02) |
| `opportunities_snapshot_2026-10-26.csv` (M02) | El snapshot del lunes siguiente: el del 19 más tres oportunidades del Centro en la etapa «En pausa» (OPP-1040, OPP-1041, OPP-1042; USD 180 000, 150 000 y 80 000, en total USD 410 000), sin probabilidad aprobada (README de M02; comprobado con script) |
| `reconcile.py` (M02) | El check determinista del flujo: imprime PASS o FAIL por KPI y por problema de calidad, y termina con 0 si todo coincide, 1 si el dashboard difiere, 2 si faltan datos o un supuesto (README de M02). Es la compuerta de L2, L5 y L6 |
| `expected/assumptions_reference.json` (M02) | Supuestos aprobados por FP&A (`duplicate_policy: latest_last_activity`, `unknown_stage_policy: exclude_and_report`). En M08 es un archivo **protegido**: ningún agente lo edita (L5) |
| **Propuesta A** (a crear por el autor) | Flujo fijo: un script descarga o lee el snapshot, `reconcile.py` calcula y verifica, un modelo redacta el comentario a partir del JSON verificado, una persona revisa el borrador |
| **Propuesta B** (a crear por el autor) | «Equipo» de cuatro agentes: extractor, calculador, redactor y revisor, coordinados por un orquestador que reparte el trabajo cada lunes |
| **Registros sintéticos** (a crear por el autor a partir de las salidas reales de §3.0.1) | Transcripción resumida y salida de `reconcile.py` de dos ejecuciones programadas del 2026-10-26 (L6 y laboratorio, paso 6) |
| **Dominio de datos** `datos.altiplano.example` | Origen ficticio de los snapshots en el caso de transferencia de L6 |

#### 3.0.1 Salidas de referencia de `reconcile.py` (ejecutadas el 2026-10-26)

Scripts en el *scratchpad* de la sesión (`m08_figures.py`, `make_kpis_26_missing.py`), que importan `reconcile.calculate` en lugar de reimplementar la regla. El autor debe regenerarlas al construir los materiales.

| Ejecución | Comando (resumen) | Resultado |
| --- | --- | --- |
| R1. Snapshot del 19 con `kpis_correct.json` | `reconcile.py --kpis expected/kpis_correct.json --assumptions expected/assumptions_reference.json` | Todo PASS; código 0. Tres avisos (duplicado OPP-1012, OPP-1021 sin fecha, OPP-1036 sin probabilidad). Vencidas: 6 (2 por región) |
| R2. Snapshot del 26 con la **salida del 19** (`as_of_date` 2026-10-19), es decir, una ejecución que reutilizó el resultado de la semana anterior | `… --snapshot opportunities_snapshot_2026-10-26.csv --kpis expected/kpis_correct.json …` | Código 1. Seis líneas FAIL: `as_of_date` (2026-10-19 frente a 2026-10-26), vencidas Sur (2 frente a 3), vencidas TOTAL (6 frente a 7) y tres `unknown_stage` no reportados (OPP-1040, OPP-1041, OPP-1042). La vencida nueva del Sur es OPP-1028 (Propuesta, cierre 2026-10-25) |
| R3. Snapshot del 26 con cifras **correctas** del 26 pero sin reportar las tres etapas nuevas | salida generada por `make_kpis_26_missing.py` | Código 1. 19 PASS y tres FAIL: `calidad unknown_stage OPP-1040/1041/1042: el dashboard no lo reporta` |
| R4. Snapshot del 26 con supuestos **sin** `unknown_stage_policy` | supuestos modificados en el *scratchpad* | Código 2: `unknown_stage: sin probabilidad aprobada: En revisión (OPP-1036), En pausa (OPP-1040), En pausa (OPP-1041), En pausa (OPP-1042). Pide la probabilidad a FP&A o declara unknown_stage_policy: exclude_and_report` |

Observación útil para L1 y L6 [inferencia, sobre R1-R3]: con la política `exclude_and_report`, el pipeline abierto, el ponderado y la cobertura del 26 son **idénticos** a los del 19 (Centro USD 1 330 500 abierto; TOTAL USD 3 772 000), porque las tres oportunidades «En pausa» quedan excluidas. Un revisor que mire solo las cifras grandes no ve nada raro; el cambio está en la calidad de datos y en una vencida más. Es exactamente el tipo de diferencia que un check atrapa y una lectura rápida no.

---

### Lección 1 — Flujo fijo, programador o agente; patrones de flujo y empezar simple

**Objetivo de lección (→ M08-OE1):** Dado un proceso o una propuesta de diseño, identifica qué pasos necesitan un modelo, reconoce el patrón y elige el diseño más simple que cumple.

**Ideas clave**

- **Dos formas de organizar el trabajo con modelos.** En un *flujo* (*workflow*), modelos y herramientas siguen caminos definidos en código; en un *agente*, el modelo dirige su propio proceso y decide qué herramientas usar [src-anthropic-building-agents]. La misma fuente describe al agente como un modelo que usa herramientas en un bucle guiado por lo que le devuelve el entorno [src-anthropic-building-agents]. [inferencia] Para el alumno: «¿quién decide el siguiente paso, el código o el modelo?».
- **Empezar simple no es una preferencia estética.** La recomendación es buscar la solución más simple posible y subir de complejidad solo si hace falta; muchas tareas se resuelven con una sola llamada bien preparada, con recuperación y ejemplos, y los sistemas agénticos cambian latencia y costo por rendimiento, un intercambio que hay que justificar [src-anthropic-building-agents]. Cita posible: «finding the simplest solution possible, and only increasing complexity when needed» [src-anthropic-building-agents].
- **Un programador (*scheduler*) no es un agente.** [inferencia] Programar algo responde a «¿cuándo corre?»; flujo o agente responde a «¿quién decide los pasos?». Un script con `cron` es un flujo fijo programado; una tarea programada que lanza un agente es un agente programado. Mezclar las dos preguntas lleva a creer que «automatizar» exige un agente. (El diagnóstico `dx-b6-01` ya evaluó el caso básico; aquí se usa como punto de partida.)
- **Los cinco patrones** [src-anthropic-building-agents], con su señal de uso:
  - **Cadena de prompts:** pasos fijos en secuencia, con comprobaciones programáticas entre ellos; sirve cuando la tarea se descompone limpiamente y se acepta más latencia a cambio de exactitud.
  - **Enrutamiento:** clasificar la entrada y mandarla a un tratamiento especializado (otro prompt, otra herramienta, un modelo más barato para lo simple).
  - **Paralelización:** varias llamadas a la vez y agregación en código, por *secciones* (subtareas independientes) o por *votación* (la misma tarea varias veces para comparar).
  - **Orquestador-trabajadores:** un modelo central parte la tarea, la reparte y sintetiza; sirve cuando las subtareas no se pueden prever de antemano.
  - **Evaluador-optimizador:** un modelo genera y otro evalúa en bucle; sirve cuando hay criterios claros y la iteración mejora de forma medible.
- **El agente, para lo impredecible.** Conviene en problemas abiertos donde no se puede fijar el número de pasos y se confía en las decisiones del modelo; cuesta más, sus errores se acumulan y pide pruebas en entornos aislados con salvaguardas y condiciones de parada como un máximo de iteraciones [src-anthropic-building-agents]. [inferencia] Tres principios de esa fuente (simplicidad, mostrar la planificación, cuidar la interfaz con las herramientas) son también criterios de revisión de una propuesta.
- **Los frameworks esconden lo que hay que revisar.** La fuente advierte que las capas de abstracción pueden ocultar prompts y respuestas y dificultar la depuración, y sugiere entender el código de fondo [src-anthropic-building-agents]. [inferencia] Para el alumno: si no puedes ver qué le llega a cada agente, no puedes revisar el diseño.
- **El evaluador-optimizador necesita un criterio externo.** [inferencia, apoyada en M05 L3] Un modelo que revisa su propia respuesta sin señal externa no mejora de forma fiable [src-arxiv-self-correct]; el patrón rinde cuando el evaluador aplica un criterio verificable (una rúbrica, un check), no un «¿está bien?».
- **Fecha y contexto.** El artículo es de diciembre de 2024 y su nota inicial dice que parte de las herramientas que describe cambió [src-anthropic-building-agents]. [inferencia] Los patrones y el principio son estables; los nombres de SDK y frameworks no se enseñan.

**Ejemplo con Altiplano (para el caso resuelto)**

El reporte semanal ya está resuelto como flujo fijo (es la respuesta de `dx-b6-01`). La lección parte de cuatro necesidades nuevas de FP&A y pide reconocer el patrón y el diseño más simple:

| Necesidad | Diseño más simple que cumple | Patrón | Por qué no más |
| --- | --- | --- | --- |
| Calcular pipeline, ponderado, cobertura y vencidas del snapshot del lunes | Script + `reconcile.py` | Ninguno (sin modelo) | Es una regla fija; un modelo solo añadiría variabilidad (M06 L5) |
| Redactar el comentario del comité a partir del JSON verificado | Una llamada al modelo después del check, y revisión humana | Cadena de prompts (calcular → verificar → redactar) | El orden es siempre el mismo |
| Clasificar las notas libres de las oportunidades en «riesgo de precio», «riesgo de plazo» o «sin riesgo» antes de resumirlas | Clasificador barato y luego un tratamiento por categoría | Enrutamiento | Las categorías son pocas y conocidas |
| Averiguar por qué la cobertura del Centro no se movió aunque entraron oportunidades nuevas | Un agente con lectura de los dos snapshots y del script | Agente | No se sabe de antemano qué hay que mirar (la respuesta está en las tres «En pausa» excluidas, §3.0.1) |

Caso resuelto: un compañero propone para el comentario semanal «un orquestador que decida cada lunes qué agentes lanzar». Lectura: las subtareas (extraer, calcular, verificar, redactar) se conocen de antemano y son siempre las mismas, así que no hay nada que el orquestador tenga que descubrir; el patrón que corresponde es una cadena con un check entre el cálculo y la redacción. Decisión: cadena de prompts con `reconcile.py` como compuerta; el orquestador queda para el caso que sí es abierto (la investigación de la cobertura).

Ejemplo para completar: el comentario sale con frases vagas. Alguien propone un segundo modelo que lo revise «hasta que quede bien». El alumno decide qué falta para que eso sea un evaluador-optimizador útil (criterios escritos: cada cifra citada coincide con el JSON verificado, se mencionan las oportunidades vencidas y los problemas de calidad; y un máximo de rondas).

Serie intercalada (al final de L1; 5 casos): 1) «convertir cada viernes los montos EUR a USD con `fx_rates.csv`» → script, sin modelo; 2) «responder preguntas de la directora que pueden ser de política o de cifra» → enrutamiento (puente con M07 L5); 3) «resumir las notas de las tres regiones, que no dependen entre sí» → paralelización por secciones; 4) «decidir si un comentario cumple la rúbrica del comité y corregirlo» → evaluador-optimizador con criterios y tope; 5) «encontrar qué cambió entre dos snapshots y por qué una cifra no se movió» → agente.

**Conceptos erróneos frecuentes (distractores)**

| ID | Creencia errónea | Por qué es errónea | Fuente |
| --- | --- | --- | --- |
| M08-CE01 | «Automatizar un proceso significa ponerle un agente.» | Programar decide cuándo corre; flujo o agente decide quién elige los pasos. Un script programado ya automatiza. | [inferencia]; [src-anthropic-building-agents] |
| M08-CE02 | «Un agente siempre da mejores resultados que un flujo fijo, porque se adapta.» | El agente cambia costo y latencia por rendimiento en tareas abiertas; en pasos predecibles añade variabilidad y errores que se acumulan. | [src-anthropic-building-agents] |
| M08-CE03 | «Si la tarea tiene varias partes, conviene un orquestador.» | El orquestador rinde cuando las subtareas no se pueden prever; si se conocen, basta una cadena. | [src-anthropic-building-agents] |
| M08-CE04 | «Un segundo modelo que revise mejora cualquier resultado.» | El evaluador-optimizador necesita criterios claros; revisar sin señal externa no mejora de forma fiable. | [src-anthropic-building-agents][src-arxiv-self-correct] |
| M08-CE05 | «Un framework de agentes ahorra trabajo de revisión.» | Puede ocultar prompts y respuestas y dificultar la depuración. | [src-anthropic-building-agents] |

**Fichas candidatas:** ninguna. La lección es duradera.

---

### Lección 2 — Objetivos, herramientas, estado y condiciones de término; delegar con entregable

**Objetivo de lección (→ M08-OE2):** Dado un encargo para un agente o subagente, identifica la pieza que falta y elige una condición de término verificable.

**Ideas clave**

- **Un agente tiene cuatro piezas que hay que decidir.** [inferencia, síntesis de las fuentes de esta lección] Objetivo (qué cuenta como hecho), herramientas (qué puede usar y qué no), estado (qué deja escrito para continuar o para que otro lo revise) y condición de término (cuándo para, también si no lo logra). M05 L3 ya enseñó las cuatro piezas de un encargo de código (qué cambiar, qué no tocar, cómo se comprueba, qué evidencia); M08 las extiende a encargos que corren sin ti o que reparte otro agente.
- **El encargo de un subagente es todo lo que sabe.** Un subagente arranca con contexto limpio: no hereda la conversación, ni los archivos ya leídos; recibe un mensaje de delegación que resume la tarea [src-anthropic-cc-subagents]. [inferencia] Lo que no está en el encargo no existe para él.
- **Las instrucciones vagas producen trabajo duplicado.** En el sistema de investigación de Anthropic, los encargos breves y poco precisos llevaron a subagentes que interpretaban mal la tarea o repetían las búsquedas de otros; cada encargo necesitó objetivo, formato de salida, guía sobre herramientas y fuentes, y límites claros [src-anthropic-eng-multi-agent-research]. Las primeras versiones también lanzaban 50 subagentes para preguntas simples y buscaban sin fin fuentes que no existían [src-anthropic-eng-multi-agent-research]. Esa fuente terminó fijando reglas de esfuerzo: una pregunta simple, un agente con pocas llamadas; una comparación, de dos a cuatro subagentes [src-anthropic-eng-multi-agent-research].
- **Saber cuándo parar es un modo de fallo medido.** La taxonomía MAST, construida con más de 1 600 trazas anotadas de siete marcos multiagente (acuerdo entre anotadores κ = 0,88), separa 14 modos de fallo en tres grupos: diseño del sistema, desalineación entre agentes y verificación [src-arxiv-mast-mas-failures]. Entre los más frecuentes: repetir pasos (15,7 %), incoherencia entre lo que razona y lo que hace (13,2 %), no reconocer las condiciones de término (12,4 %) y desobedecer la especificación (11,8 %); en verificación, terminar antes de tiempo (6,2 %), verificación ausente o incompleta (8,2 %) y verificación incorrecta (9,1 %) [src-arxiv-mast-mas-failures]. [inferencia] Una condición de término mal definida produce los dos extremos: no parar nunca o declararse listo antes de tiempo.
- **Condiciones de término verificables frente a juicio propio.** [inferencia, apoyada en src-anthropic-building-agents y M05 L3] De más a menos fiable: un check que devuelve pasa o falla (por ejemplo, `reconcile.py` con código 0); un entregable concreto y su formato (un JSON con un esquema, un borrador en una ruta); un tope duro (iteraciones, turnos, tiempo, presupuesto), que no prueba éxito pero limita el daño; y, al final, «cuando creas que está bien», que es una afirmación, no una condición. La fuente de patrones recomienda condiciones de parada como un máximo de iteraciones para mantener el control [src-anthropic-building-agents].
- **El tope no es el criterio.** [inferencia] Un máximo de iteraciones evita el bucle, pero si se alcanza, el resultado es parcial y debe marcarse como tal. Al menos un producto marca como parcial la salida de un subagente que llegó a su límite de turnos (ficha).
- **El estado se escribe fuera de la conversación.** En tareas largas, un equipo de Anthropic encontró que el agente funcionaba mejor con un registro de progreso, una lista de funciones en un archivo y commits, porque cada sesión nueva empieza sin memoria [src-anthropic-eng-harnesses]. Lo mismo vale para el trabajo repartido: la nota estructurada fuera del contexto es la técnica que corresponde al desarrollo iterativo con hitos [src-anthropic-eng-context]. (Puente con M03 L5 y M05 L6: lo que viaja es lo escrito.)
- **Herramientas: las justas para el encargo.** [inferencia, apoyada en src-owasp-llm06] Quitar una herramienta es más firme que pedir que no se use (M07 L2, L6). En un subagente, la lista de herramientas permitidas es parte del encargo (ficha).
- **Lo que no se delega a ciegas, tampoco a un subagente.** La lógica de negocio sustancial, lo ambiguo y lo crítico se reservan para personas [src-github-copilot-agent-bp] (ya en M05 L2). [inferencia] En Altiplano, la probabilidad de la etapa «En pausa» la fija FP&A; ningún agente la decide para poder terminar.

**Ejemplo con Altiplano**

Caso resuelto: el orquestador de la propuesta B delega en el redactor con este encargo: «Escribe el comentario del comité. Hazlo excelente. El revisor te dirá si está bien». Revisión pieza por pieza:

| Pieza | Qué falta | Versión corregida |
| --- | --- | --- |
| Objetivo | «Excelente» no es verificable | Comentario de 150 a 250 palabras para el comité del 2026-10-26 |
| Entrada y estado | No dice de dónde salen las cifras | Usar solo `kpis.json` verificado (código 0 de `reconcile.py`); escribir el borrador en `drafts/comentario-2026-10-26.md` |
| Herramientas | Implícitas | Lectura de `kpis.json` y escritura solo en `drafts/`; sin acceso al CSV ni a `expected/` |
| Criterio | «Que el revisor diga que está bien» | Cada cifra citada coincide con `kpis.json`; menciona las vencidas por región y cada problema de calidad reportado |
| Término | No hay | Termina al cumplir el criterio o tras dos rondas con el revisor; si no lo cumple, deja el borrador marcado «sin aprobar» y la lista de criterios fallidos |

Ejemplo para completar: el agente de investigación del caso de L1 recibe «averigua por qué la cobertura del Centro no se movió». El alumno decide qué condición de término añadir (por ejemplo: «termina cuando identifiques las filas que explican la diferencia entre los dos snapshots, con sus `opp_id`, o tras revisar ambos snapshots y el script sin encontrarlas; no modifiques archivos»).

**Conceptos erróneos frecuentes**

| ID | Creencia errónea | Por qué es errónea | Fuente |
| --- | --- | --- | --- |
| M08-CE06 | «El subagente sabe lo que hablamos en la sesión.» | Arranca con contexto limpio y recibe solo el mensaje de delegación. | [src-anthropic-cc-subagents] |
| M08-CE07 | «Con un buen agente, basta decirle el tema; él decide el alcance.» | Los encargos vagos produjeron tareas mal interpretadas y trabajo duplicado; hace falta objetivo, formato, herramientas y límites. | [src-anthropic-eng-multi-agent-research] |
| M08-CE08 | «La condición de término es "cuando esté bien".» | Eso es una afirmación del agente; no reconocer el término y terminar antes de tiempo son fallos medidos. | [src-arxiv-mast-mas-failures]; [inferencia] |
| M08-CE09 | «Un máximo de iteraciones garantiza un resultado correcto.» | Limita el daño; si se alcanza, el resultado es parcial y hay que marcarlo. | [src-anthropic-building-agents]; [inferencia] |
| M08-CE10 | «Si dos agentes se revisan entre sí, no hace falta un check.» | La verificación ausente o incorrecta es uno de los tres grupos de fallo de los sistemas multiagente. | [src-arxiv-mast-mas-failures] |
| M08-CE11 | «El agente recordará el avance en la siguiente sesión.» | Cada sesión empieza sin memoria; el estado se escribe en archivos y commits. | [src-anthropic-eng-harnesses] |

**Fichas candidatas (máximo una)**

- *Límites y condiciones de término por producto* (verificado 2026-10-26). Complementa `m05-pc-verification-gates`, que ya cubre `/goal`, el hook Stop como compuerta y el subagente verificador; no repetirlos.

| Producto · superficie | Qué permite fijar | Detalle | Estado | Fuente |
| --- | --- | --- | --- | --- |
| Claude Code · subagentes | `maxTurns` en la definición del subagente; `tools` / `disallowedTools` como lista permitida y denegada | Al alcanzar `maxTurns`, la salida vuelve marcada como parcial | Sin etiqueta de vista previa en la página | [src-anthropic-cc-subagents] |
| Claude Code · `claude -p` | `--max-budget-usd` como tope de gasto; `--json-schema` para el formato de salida | Con el tope alcanzado, detiene el trabajo en segundo plano en vez de esperar; el costo que informa es una estimación del cliente | GA | [src-anthropic-cc-headless] |
| Claude Code · hook Stop | Bloquear el fin del turno hasta que se cumpla una condición | Tras ocho bloqueos seguidos sin una llamada a herramienta, la herramienta deja parar; el script debe leer `stop_hook_active` (tope ajustable con `CLAUDE_CODE_STOP_HOOK_BLOCK_CAP`) | GA (los hooks de tipo `agent` son experimentales) | [src-anthropic-cc-hooks-guide] |
| Codex · `codex exec` | `--output-schema` para restringir la respuesta final a un esquema JSON | | GA (página sin etiqueta) | [src-openai-codex-noninteractive] |

Próxima revisión: 2027-01-26.

---

### Lección 3 — Subagentes y paralelismo: contexto aislado, worktrees, dependencias y costo en tokens

**Objetivo de lección (→ M08-OE3):** Dado un trabajo divisible, decide si paralelizar y con qué, e identifica el riesgo de integración.

**Ideas clave — qué se aísla y qué no**

- **El subagente aísla contexto.** Toma una tarea acotada en un contexto limpio, puede explorar con decenas de miles de tokens y devuelve un resumen condensado, a menudo de 1 000 a 2 000 tokens, mientras el agente principal conserva el plan [src-anthropic-eng-context]. Su utilidad es que la salida voluminosa (búsquedas, registros, archivos) no entre en la conversación principal [src-anthropic-cc-subagents]. (Ya en M03 L1 y M05 L2; aquí se usa para decidir.)
- **No sale gratis.** Cada subagente gasta sus propios tokens y, en al menos un producto, cuenta contra los mismos límites de uso que la sesión principal; muchos subagentes que devuelven resultados detallados también llenan el contexto principal [src-anthropic-cc-subagents]. Otra herramienta advierte que los flujos con subagentes consumen más tokens que una ejecución comparable de un solo agente [src-openai-codex-subagents].
- **Cuándo no conviene un subagente.** La documentación de un producto recomienda quedarse en la conversación principal para el ida y vuelta frecuente, las fases que comparten mucho contexto, los cambios rápidos y lo sensible a la latencia, porque un subagente nuevo necesita tiempo para reunir contexto [src-anthropic-cc-subagents].
- **El worktree aísla archivos.** Un worktree enlazado tiene su propio `HEAD`, índice y archivos de trabajo y comparte el resto del repositorio; por defecto, Git se niega a abrir en un worktree una rama que ya está en otro [src-git-worktree] (ya en M04 L4). Varias sesiones de agente en worktrees distintos editan sin pisarse; un worktree nuevo es una copia limpia, sin archivos ignorados como `.env` ni dependencias instaladas [src-anthropic-cc-worktrees].
- **Aislar no es integrar.** [inferencia, apoyada en src-git-worktree] Dos ramas trabajadas en paralelo se juntan después con un merge, y ahí aparecen los conflictos que el aislamiento solo pospuso. La página de Git no trata los conflictos de merge; la conclusión es propia.

**Ideas clave — cuándo paralelizar**

- **Paralelo rinde en lo que se reparte sin hablarse.** El sistema de investigación de Anthropic superó en un 90,2 % a un agente único en su evaluación interna, sobre todo en preguntas de amplitud (muchas búsquedas independientes) [src-anthropic-eng-multi-agent-research]. La misma fuente lo desaconseja cuando todos los agentes necesitan el mismo contexto, cuando hay muchas dependencias entre ellos y en la mayoría de las tareas de programación, que tienen menos partes paralelizables que la investigación [src-anthropic-eng-multi-agent-research].
- **La evidencia independiente apunta igual.** En 260 configuraciones (un agente frente a cuatro arquitecturas multiagente, seis bancos de prueba, tres familias de modelos), el resultado frente al agente único fue de +80,8 % en razonamiento financiero descomponible a −70,0 % en planificación secuencial; los autores concluyen que el ajuste entre arquitectura y tarea decide [src-arxiv-scaling-agent-systems]. También observan rendimientos decrecientes cuando el agente único ya rinde bien, y que las arquitecturas sin verificación centralizada propagan más los errores [src-arxiv-scaling-agent-systems]. [inferencia] Cifras de un estudio con modelos de 2025-2026: sirven para la dirección del efecto, no como predicción.
- **Las acciones llevan decisiones implícitas.** Un equipo que construye agentes de código sostiene que los subagentes que actúan con supuestos distintos producen piezas que no encajan, y pone como ejemplo dos subagentes que construyeron por separado el fondo y el personaje de un juego con estilos incompatibles; recomienda un agente lineal por defecto [src-cognition-dont-build-multi-agents]. (Fuente de un proveedor, de opinión; usar como contrapunto, no como medición.)
- **Paralelo y sincrónico tiene un cuello de botella.** En el sistema de investigación, el agente principal espera a que termine cada tanda de subagentes; uno lento bloquea a todos y no se los puede redirigir a mitad de camino [src-anthropic-eng-multi-agent-research].
- **Costo: la variable que más pesa.** Un agente consume unas 4 veces los tokens de un chat y un sistema multiagente unas 15 veces; en su prueba de búsqueda, el uso de tokens explicó el 80 % de la varianza de rendimiento [src-anthropic-eng-multi-agent-research]. Cita posible: el multiagente funciona sobre todo porque permite «spend enough tokens to solve the problem» [src-anthropic-eng-multi-agent-research]. [inferencia] Si la tarea no necesita gastar más tokens para resolverse, el multiagente solo encarece.
- **Equipos de agentes: otro escalón.** En al menos un producto, un «equipo» son varias sesiones completas con una lista de tareas compartida y mensajes entre ellas; usa bastante más tokens que una sesión, rinde en investigación, revisión y módulos independientes, y su documentación recomienda una sesión o subagentes para tareas secuenciales, ediciones del mismo archivo o mucho trabajo dependiente (ficha) [src-anthropic-cc-agent-teams].

**Criterio de decisión [inferencia, síntesis de las fuentes anteriores]:**

| Situación | Elección | Por qué |
| --- | --- | --- |
| Una exploración amplia cuya salida no vas a volver a consultar | Un subagente | Protege el contexto principal; devuelve un resumen |
| Tres partes independientes que solo leen y resumen | Subagentes en paralelo | Sin dependencias ni archivos compartidos |
| Dos cambios de código independientes que tocan archivos distintos | Dos sesiones, cada una en su worktree | Aísla archivos; queda integrar con merge y revisar cada PR |
| Partes que dependen unas de otras o editan el mismo archivo | Una sola sesión, por pasos | Paralelizar crea conflictos y supuestos contradictorios |
| Varias líneas de investigación que deben contrastarse entre sí | Equipo de agentes, si el producto lo ofrece y el costo se justifica | Comunicación entre agentes; más tokens |
| Una tarea que se resuelve bien con un agente | Un agente | Más agentes rinden menos cuando el agente único ya rinde bien |

**Ejemplo con Altiplano**

Caso resuelto: para el reporte del 26 de octubre, alguien propone «tres subagentes en paralelo, uno por región, que calculen sus KPI y escriban su sección en `comentario.md`». Revisión: (1) el cálculo no es trabajo de modelo, lo hace `reconcile.py` (L1); (2) el TOTAL depende de las tres regiones, así que hay una dependencia al final; (3) los tres escribirían el mismo archivo y se pisarían [src-anthropic-cc-agent-teams]; (4) cada subagente gasta sus propios tokens [src-anthropic-cc-subagents]. Decisión: el script calcula; si las notas libres de cada región son largas, tres subagentes de solo lectura las resumen en paralelo y devuelven texto; una sola sesión escribe el comentario. Lo paralelo queda donde no hay dependencias ni archivo compartido.

Ejemplo para completar: el equipo quiere a la vez (a) agregar pruebas a la función de duplicados y (b) cambiar el formato del gráfico de vencidas, en el mismo repositorio. El alumno decide entre una sesión, dos sesiones en worktrees o un equipo de agentes, y qué queda por hacer después (integrar las dos ramas y revisar cada PR; preparar el entorno de cada worktree).

Serie intercalada (al final de L3; 5 casos): 1) «leer 30 archivos para entender el cálculo antiguo» → un subagente; 2) «resumir las notas de las tres regiones» → subagentes en paralelo de solo lectura; 3) «corregir el redondeo del ponderado y actualizar la prueba que lo cubre» → una sola sesión (dependiente); 4) «agregar un reporte nuevo y, aparte, actualizar el README» → dos sesiones en worktrees; 5) «contrastar tres hipótesis sobre por qué el Centro no cuadra» → equipo de agentes o subagentes que reporten, si el costo se justifica.

**Conceptos erróneos frecuentes**

| ID | Creencia errónea | Por qué es errónea | Fuente |
| --- | --- | --- | --- |
| M08-CE12 | «Más agentes en paralelo terminan antes y mejor.» | El efecto depende de la tarea: mejora lo descomponible y empeora lo secuencial. | [src-arxiv-scaling-agent-systems][src-anthropic-eng-multi-agent-research] |
| M08-CE13 | «Un subagente es gratis porque no ocupa mi contexto.» | Gasta sus propios tokens y cuenta contra los mismos límites de uso. | [src-anthropic-cc-subagents][src-openai-codex-subagents] |
| M08-CE14 | «Con worktrees, los agentes en paralelo no pueden entrar en conflicto.» | Aíslan los archivos mientras trabajan; los conflictos aparecen al integrar las ramas. | [src-git-worktree]; [inferencia] |
| M08-CE15 | «El multiagente es la opción por defecto para programar.» | La fuente que lo construyó dice que la mayoría de las tareas de programación tienen pocas partes paralelizables. | [src-anthropic-eng-multi-agent-research] |
| M08-CE16 | «Si cada agente hace bien su parte, el conjunto sale bien.» | Las partes hechas con supuestos distintos no encajan; sin verificación central los errores se propagan. | [src-cognition-dont-build-multi-agents][src-arxiv-scaling-agent-systems] |
| M08-CE17 | «Un worktree nuevo trae todo lo necesario para correr las pruebas.» | Es una copia limpia: sin archivos ignorados ni dependencias instaladas. | [src-anthropic-cc-worktrees] |

**Fichas candidatas (máximo dos)**

1. **Subagentes y equipos de agentes por producto** (verificado 2026-10-26):

| Producto · superficie | Qué ofrece | Límites y costo documentados | Estado | Fuente |
| --- | --- | --- | --- | --- |
| Claude Code · subagentes | Definiciones en `.claude/agents/` o `~/.claude/agents/` (Markdown con `name`, `description`, `tools`, `model`…); integrados Explore, Plan y general-purpose; primer plano o segundo plano; `isolation: worktree` para trabajar en un worktree temporal que parte de la rama por defecto | Contexto limpio (carga CLAUDE.md salvo Explore y Plan); devuelve un resumen y guarda la transcripción completa aparte; cuenta contra los mismos límites de uso; hasta 20 subagentes simultáneos por defecto; anidamiento hasta tres niveles desde v2.1.219 | Sin etiqueta de vista previa | [src-anthropic-cc-subagents] |
| Claude Code · equipos de agentes | Un líder, compañeros que son sesiones completas, lista de tareas compartida y buzón de mensajes | Experimentales y desactivados por defecto (`CLAUDE_CODE_EXPERIMENTAL_AGENT_TEAMS=1`); no se crean en `-p`; un equipo por sesión; sin equipos anidados; recomiendan empezar con 3 a 5 compañeros y que cada uno tenga sus propios archivos; unas 7 veces más tokens que una sesión estándar cuando los compañeros corren en modo plan | Experimental | [src-anthropic-cc-agent-teams][src-anthropic-cc-costs] |
| Codex · subagentes (app, CLI, IDE) | Agentes propios en TOML en `~/.codex/agents/` o `.codex/agents/`; activados por defecto | Delegan cuando se pide o cuando AGENTS.md o una skill lo indican; heredan sandbox y aprobaciones del padre; consumen más tokens que un solo agente; `agents.max_concurrent_threads_per_session` limita los hilos simultáneos | GA (página sin etiqueta) | [src-openai-codex-subagents] |

Próxima revisión: 2027-01-26.

2. **Worktrees para sesiones en paralelo, complemento de `m04-pc-worktrees`** (verificado 2026-10-26): Claude Code bloquea, dentro de una sesión aislada en un worktree, las ediciones y los comandos cuyo directorio o cuyo `git` apunten a la copia principal, pero no rastrea lo que escribe un comando de shell como `cp` o una redirección; las ejecuciones con `-p` no limpian sus worktrees al terminar y hay que quitarlos con `git worktree remove` [src-anthropic-cc-worktrees]. Git 2.56.0: `git worktree remove` solo borra worktrees limpios salvo `--force` [src-git-worktree]. Codex: worktrees en la app de escritorio (ya en `m04-pc-worktrees`) [src-openai-codex-worktrees]. Próxima revisión: 2027-01-26.

---

### Lección 4 — Delegación asíncrona: nube, segundo plano o tarea programada

**Objetivo de lección (→ M08-OE4):** Dado un trabajo que no debe esperar a la persona, elige dónde corre según qué ve, si la máquina debe estar encendida, quién aprueba y qué entregable deja.

**Ideas clave**

- **Cuatro preguntas ordenan las opciones.** [inferencia, síntesis de la tabla comparativa de un producto, ficha] ¿Necesita archivos que solo están en mi equipo? ¿Puede depender de que mi máquina esté encendida? ¿Puede depender de que una sesión siga abierta? ¿Quién aprueba lo que pediría permiso mientras corre? La documentación de un producto compara así sus tres formas de programar: en la nube (no requiere la máquina, parte de un clon nuevo, sin archivos locales), en el equipo (requiere la máquina encendida, ve archivos locales) y dentro de la sesión (requiere la sesión abierta) [src-anthropic-cc-scheduled-tasks].
- **La nube parte del remoto** (ya en M05 L6) [src-anthropic-cc-cloud]. Una tarea programada en la nube clona el repositorio en cada ejecución y no ve carpetas locales [src-anthropic-cc-routines][src-anthropic-cc-scheduled-tasks]; otra herramienta indica que sus tareas web no pueden trabajar en una carpeta local [src-openai-codex-scheduled-tasks].
- **El segundo plano local depende de tu equipo.** En una herramienta, las tareas programadas que trabajan con archivos locales exigen la computadora encendida y la aplicación abierta, y la carpeta del proyecto disponible cuando corre [src-openai-codex-scheduled-tasks]. Las tareas ligadas a una sesión solo disparan mientras la sesión está abierta y en reposo, no recuperan las ejecuciones perdidas y caducan a los siete días [src-anthropic-cc-scheduled-tasks].
- **Programar en local también aísla con worktrees.** Una herramienta permite que la tarea programada corra en la copia local o en un worktree nuevo; en la copia local puede modificar archivos que estás editando [src-openai-codex-scheduled-tasks]. [inferencia] Puente con L3: lo que corre solo, en un worktree; lo que tú editas, en tu copia.
- **Nadie aprueba durante la ejecución.** En un producto, las ejecuciones de tareas programadas en la nube arrancan en un modo donde un clasificador permite o bloquea acciones, y la ejecución se queda esperando a una persona en ciertos casos [src-anthropic-cc-routines]; en otro, corren con la política de aprobación «nunca» cuando la organización lo permite, y con acceso total el riesgo es elevado [src-openai-codex-scheduled-tasks]. M07 L6 ya enseñó la regla: lo que pediría aprobación se deniega o no existe (ficha `m07-pc-headless-integrations`).
- **Lo que hace la tarea, lo hace en tu nombre.** En un producto, las tareas programadas pertenecen a la cuenta individual, sus acciones en GitHub o en conectores aparecen como tuyas y, por defecto, incluyen todos tus conectores, que hay que quitar si no se necesitan [src-anthropic-cc-routines]. En otro, el trabajo de una automatización se atribuye a quien la creó, que tampoco puede aprobar la PR resultante [src-github-cloud-agent-risks]. [inferencia] Lo mínimo de M07 L2 vale igual: repositorios, red y conectores, solo los del encargo.
- **El encargo programado debe valer solo.** Una documentación pide que el prompt de una tarea programada sea autocontenido y explícito sobre qué hacer y qué es el éxito, porque corre de forma autónoma [src-anthropic-cc-routines]; otra pide probar el prompt en un chat normal antes de programarlo y revisar las primeras ejecuciones [src-openai-codex-scheduled-tasks]. (Puente con L2.)
- **El texto que llega con el disparo es dato.** En un producto, el texto que acompaña a una ejecución lanzada por API llega envuelto y marcado como dato no confiable, y el prompt guardado tiene que pedir explícitamente que se actúe sobre él [src-anthropic-cc-routines]. (Ficha; el principio ya está en M07 L6.)
- **El entregable asíncrono es revisable, no definitivo.** Los agentes en la nube trabajan en una rama propia y abren PR que una persona revisa (M04, M05 L6) [src-github-cloud-agent][src-github-cloud-agent-risks]; una tarea programada en la nube empuja a ramas con prefijo propio salvo que el prompt diga otra cosa, y la protección de ramas es el control [src-anthropic-cc-routines]. [inferencia] Un borrador o una PR deja la decisión en manos de alguien; publicar directo no.
- **Un programador no garantiza que algo corra a su hora.** En CI, una ejecución programada puede retrasarse con mucha carga y, con carga muy alta, perderse; en repositorios públicos se desactiva tras 60 días sin actividad [src-github-actions-schedule]. En un producto de agentes, las ejecuciones en punto pueden empezar unos minutos tarde y se aconseja elegir un minuto que no sea en punto [src-anthropic-cc-routines]. [inferencia] Un proceso que el comité necesita a las 8:00 no se programa a las 7:59.
- **Lanzar dos veces puede ser peor que no lanzar.** Desde la práctica de fiabilidad: algunas tareas toleran saltarse una ejecución y otras no; algunas pueden repetirse sin daño y otras no (una nómina, un envío), y en general es preferible saltarse una ejecución a arriesgar una doble [src-google-sre-cron]. (Puente con la idempotencia de M07 L3.)

**Tabla de decisión [inferencia, síntesis de las fuentes anteriores]:**

| El trabajo… | Opción preferente | Riesgo que queda |
| --- | --- | --- |
| Lee y escribe solo en el repositorio, termina en una PR, puede correr con la máquina apagada | Agente en la nube (puntual) o tarea programada en la nube (recurrente) | No ve archivos locales; actúa con tu identidad y tus conectores |
| Necesita archivos o herramientas que solo están en tu equipo | Tarea programada local, en un worktree | La máquina debe estar encendida; si está apagada, no corre |
| Es un sondeo corto mientras trabajas (¿terminó la CI?) | Tarea dentro de la sesión | Muere con la sesión; caduca |
| Es determinista, sin decisiones (descargar, calcular, verificar) | Script en CI o en el programador del sistema, sin agente | El programador puede retrasarse o perder la ejecución; hay que vigilar el resultado |
| Depende de decisiones que hay que conversar | Nada asíncrono: sesión local acompañada | — |

**Ejemplo con Altiplano**

Caso resuelto: FP&A recibe el snapshot del lunes a las 6:00 en una carpeta compartida montada en la computadora de la analista; el repositorio del reporte está en GitHub. Se proponen tres opciones para que el borrador esté listo a las 8:00: (a) tarea programada en la nube a las 6:00; (b) tarea programada local en la app de escritorio, en un worktree, a las 6:10; (c) script programado en CI que solo corre `reconcile.py` y deja el JSON, con un paso de modelo que redacta. Lectura: (a) no ve la carpeta compartida, porque parte de un clon nuevo; (b) ve el archivo, pero depende de que la computadora esté encendida; (c) exige que el snapshot llegue al repositorio o a un servicio que la CI pueda leer. Decisión: si el snapshot se puede publicar en un origen accesible (por ejemplo `https://datos.altiplano.example/snapshots/`, ficticio), (c) con el modelo solo para redactar y un borrador en una rama; si no, (b) en un worktree, y aceptar explícitamente el riesgo de que la máquina esté apagada. En ambos casos el resultado es un borrador para revisión, no un envío al comité.

Ejemplo para completar: un compañero programa la tarea a las «7:00 en punto, todos los días». El alumno decide qué cambiar (elegir un minuto que no sea en punto; correr solo los lunes; asegurarse de que repetir la ejecución no publique dos borradores, por ejemplo con un nombre de archivo por fecha).

**Conceptos erróneos frecuentes**

| ID | Creencia errónea | Por qué es errónea | Fuente |
| --- | --- | --- | --- |
| M08-CE18 | «Una tarea programada en la nube ve mi carpeta de trabajo.» | Parte de un clon nuevo del repositorio; los archivos locales no están. | [src-anthropic-cc-scheduled-tasks][src-anthropic-cc-routines] |
| M08-CE19 | «Una tarea programada en mi equipo corre aunque apague la computadora.» | Las opciones locales requieren la máquina encendida (y a veces la app o la sesión abiertas). | [src-anthropic-cc-scheduled-tasks][src-openai-codex-scheduled-tasks] |
| M08-CE20 | «Lo programado corre exactamente a su hora.» | Los programadores pueden retrasar o perder ejecuciones; en punto es la hora más cargada. | [src-github-actions-schedule][src-anthropic-cc-routines] |
| M08-CE21 | «Si falla, lo seguro es que se vuelva a lanzar sola.» | Para tareas que no se pueden repetir, es preferible saltar una ejecución a lanzarla dos veces. | [src-google-sre-cron] |
| M08-CE22 | «La tarea programada actúa con una cuenta de servicio neutra.» | En los productos revisados, actúa con la identidad y los conectores de quien la creó. | [src-anthropic-cc-routines][src-github-cloud-agent-risks] |
| M08-CE23 | «Lo que corre solo puede publicar directamente; para eso se automatizó.» | El entregable asíncrono es una PR o un borrador revisable; la protección de ramas y la revisión son el control. | [src-github-cloud-agent-risks][src-anthropic-cc-routines]; [inferencia] |

**Fichas candidatas (máximo dos)**

1. **Opciones para programar trabajo de agentes** (verificado 2026-10-26):

| Producto · superficie | Dónde corre | Requisitos | Aprobaciones durante la ejecución | Intervalo y límites | Estado | Fuente |
| --- | --- | --- | --- | --- | --- | --- |
| Claude Code · tareas programadas en la nube (antes «routines»; `/schedule`, web, app de escritorio) | Infraestructura de Anthropic o entorno propio de la organización | Planes Pro, Max, Team y Enterprise; acceso a GitHub; disparadores por horario, API o eventos de GitHub | Arranca en modo automático (un clasificador decide); se detiene a esperar si una acción coincide con una regla de pregunta o si se repiten los bloqueos | Mínimo 1 hora; 100 ejecuciones programadas por hora por cuenta; consume el uso del plan; empuja a ramas `claude/` | *Research preview* | [src-anthropic-cc-routines][src-anthropic-cc-scheduled-tasks] |
| Claude Code · tareas programadas de escritorio | Tu equipo | Máquina encendida; ve archivos locales | Configurable por tarea | 1 minuto si lo fija Claude, 1 hora en los formularios | No verificado en página propia (dato de la tabla comparativa) | [src-anthropic-cc-scheduled-tasks] |
| Claude Code · `/loop` y tareas de sesión | Tu equipo, dentro de la sesión | Sesión abierta y en reposo | Hereda los de la sesión | Mínimo 1 minuto; hasta 50 tareas por sesión; caducan a los 7 días; sin recuperación de ejecuciones perdidas | GA (página sin etiqueta) | [src-anthropic-cc-scheduled-tasks] |
| Codex · tareas programadas (app de escritorio; web y móvil con disparadores por eventos en planes elegibles) | Tu equipo (proyecto local o worktree) o la web | App de escritorio abierta y proyecto en disco para tareas locales; las web no ven carpetas locales | `approval_policy = "never"` si la organización lo permite; con solo lectura o escritura en el espacio de trabajo, lo que excede falla; acceso total = «riesgo elevado» | Programación propia, reglas RRULE, intervalos por minuto en seguimientos dentro del chat | GA (página sin etiqueta) | [src-openai-codex-scheduled-tasks] |
| GitHub Actions · evento `schedule` | Ejecutores de CI | Archivo del workflow en la rama por defecto | Las del workflow | Cron en UTC (o zona IANA); mínimo 5 minutos; puede retrasarse o perderse con carga; se desactiva a los 60 días sin actividad en repositorios públicos | GA | [src-github-actions-schedule] |

Próxima revisión: 2027-01-26.

2. **Agentes en la nube y en segundo plano, complemento de `m05-pc-cloud-agents`** (verificado 2026-10-26): Copilot cloud agent: sesiones de hasta 59 minutos que no se pueden extender, un repositorio y una PR por tarea, rama `copilot/`, PR en borrador que no puede aprobar ni fusionar; los workflows de sus PR esperan aprobación salvo que se configure otra cosa; las automatizaciones se atribuyen a quien las creó [src-github-cloud-agent][src-github-cloud-agent-risks]. Codex Cloud: cada tarea con su espacio de trabajo, sigue con el equipo dormido, varias tareas desde un mismo entorno publicado [src-openai-codex-cloud]. Claude Code: el texto de un disparo por API llega marcado como dato no confiable; el *endpoint* usa una cabecera beta fechada [src-anthropic-cc-routines]. Próxima revisión: 2027-01-26.

---

### Lección 5 — Automatización del arnés: modo headless y hooks

**Objetivo de lección (→ M08-OE5):** Dada una regla o un paso que debe ocurrir siempre, elige entre instrucción, hook o ejecución headless, e identifica el límite de ese control.

**Ideas clave — hooks**

- **Qué es y por qué importa.** Un hook es un comando que la herramienta ejecuta en un punto fijo de su ciclo, de modo que ciertas acciones ocurren siempre en lugar de depender de que el modelo decida hacerlas [src-anthropic-cc-hooks-guide]. (M03 L3 ya lo presentó como control determinista frente a las instrucciones, que solo orientan [src-anthropic-cc-features]; M05 L3 adelantó la compuerta. M08 enseña a elegir el momento y a ver sus límites.)
- **Tres momentos que resuelven casi todo** [src-anthropic-cc-hooks-guide], con su uso típico [inferencia]:
  - **Antes de una herramienta:** puede bloquear la llamada. Sirve para prohibir (no editar `expected/`, no ejecutar un comando).
  - **Después de una herramienta:** corre cuando la herramienta ya actuó. Sirve para formatear, registrar o correr un check tras cada edición; no puede deshacer lo hecho [src-anthropic-cc-hooks-guide].
  - **Al terminar el turno:** puede impedir que el agente dé por terminado el trabajo y devolverle el motivo. Sirve como compuerta de «no termines hasta que pase el check».
- **Bloquear tiene una forma concreta.** En un producto, un hook bloquea saliendo con el código 2 y explicando el motivo, y una denegación desde el hook «antes de herramienta» vale en todos los modos de permiso, incluso el que se salta las aprobaciones [src-anthropic-cc-hooks-guide]. (Detalle de producto: ficha. El principio, que el control actúa fuera del modelo, es estable.)
- **El hook al terminar puede encadenar un bucle.** Si la condición nunca se cumple, el agente sigue intentando; un producto corta tras ocho bloqueos seguidos y pide que el script detecte que ya forzó una continuación (ficha) [src-anthropic-cc-hooks-guide]. [inferencia] Puente con L2: una compuerta también necesita tope, y con una condición imposible (falta una probabilidad que solo FP&A puede dar) el agente puede intentar «arreglar» lo que no debe (M05 L3, ImpossibleBench [src-arxiv-impossiblebench]).
- **La cobertura no es total.** Un producto advierte que el agente también puede cambiar archivos con comandos de shell, así que un hook que vigila solo las herramientas de edición no ve todo [src-anthropic-cc-hooks-guide]. Otra herramienta dice que sus hooks de herramientas son una salvaguarda útil, no una frontera de control completa, y no cubren herramientas alojadas como la búsqueda web [src-openai-codex-hooks]. [inferencia] Para lo que no puede fallar, el hook se combina con permisos, sandbox y un check posterior (M05 L1, M09).
- **Un hook es código con tus permisos.** [inferencia, apoyada en src-anthropic-cc-headless y src-openai-codex-hooks] Los hooks del proyecto se versionan y se comparten; en un producto, una ejecución no interactiva ejecuta los hooks del archivo de configuración del proyecto incluso en una carpeta nunca marcada como de confianza [src-anthropic-cc-headless], mientras otra herramienta exige revisar y confiar cada hook, ligado a su contenido, antes de ejecutarlo [src-openai-codex-hooks]. Una rama ajena puede traer un hook nuevo (mismo patrón que el `.mcp.json` de M07 L6).
- **Los hooks también ahorran contexto.** Una guía de costos propone que un hook filtre la salida de las pruebas para que el agente vea solo los fallos en lugar de miles de líneas [src-anthropic-cc-costs]. [inferencia] Un uso legítimo, pero que esconde información: el filtro debe dejar pasar lo que el agente necesita para corregir.
- **Cada herramienta tiene su formato.** Los eventos, nombres y formas de responder cambian entre productos y superficies; una documentación pide expresamente no suponer que funcionen igual en todas [src-github-copilot-hooks]. M03 ya advirtió que el formato de hooks de otra herramienta no es portable [src-openai-codex-hooks].

**Ideas clave — modo headless**

- **El agente como comando.** En modo no interactivo, el agente recibe el prompt por argumento o por la entrada estándar, termina con código 0 si tuvo éxito y distinto de 0 si falló, y puede devolver JSON con el resultado y metadatos, de modo que un script puede ramificar según el resultado [src-anthropic-cc-headless]. Otra herramienta hace lo mismo: el progreso va a la salida de error, el mensaje final a la salida estándar, con eventos JSON y respuesta restringible a un esquema [src-openai-codex-noninteractive].
- **Reproducible quiere decir sin sorpresas del entorno.** Un producto ofrece un modo que no carga hooks, skills, subagentes, servidores MCP, memoria ni CLAUDE.md descubiertos en la carpeta o en la configuración personal, recomendado para scripts y CI para obtener el mismo resultado en cada máquina, y anuncia que será el predeterminado (ficha) [src-anthropic-cc-headless]. [inferencia] Sin ese modo, la ejecución depende de lo que haya en la carpeta y en la configuración de quien la lanza.
- **Separar generar de escribir.** Una guía de producto propone partir el flujo de CI en un trabajo de solo lectura que genera un parche y otro, sin la clave del modelo, que abre la PR; y no exponer la clave a todo el trabajo si corre código del repositorio [src-openai-codex-noninteractive]. [inferencia] Mismo principio de M07 L2: el secreto solo donde se usa, y la escritura separada de lo no confiable.
- **Salida estructurada, pero comprobada.** En un producto, si la ejecución termina sin una salida válida, el campo estructurado no aparece y el script debe comprobar que exista antes de usarlo [src-anthropic-cc-headless] (ya en M02 L3).

**Cuándo cada control [inferencia, síntesis]:**

| Necesidad | Control | Límite que hay que conocer |
| --- | --- | --- |
| Orientar el estilo o el criterio del agente | Instrucción (CLAUDE.md, AGENTS.md, encargo) | No garantiza nada; puede ignorarse o perderse |
| Que algo no ocurra nunca (escribir en `expected/`, editar los supuestos) | Regla de denegación o hook antes de herramienta | No ve cambios hechos por otras vías si no se cubren; combinar con permisos |
| Que algo ocurra siempre después de editar (correr `reconcile.py`, formatear) | Hook después de herramienta | No deshace; solo informa o corrige hacia adelante |
| Que el agente no termine sin cumplir un criterio | Hook al terminar (compuerta) | Puede encadenar un bucle; necesita tope y una salida para condiciones imposibles |
| Correr el agente sin interfaz, en un script o en CI | Modo headless con configuración explícita | Puede cargar hooks y servidores del proyecto sin confianza; usar el modo que no los lee o fijarlos por argumento |

**Ejemplo con Altiplano**

Caso resuelto: en el repositorio del reporte se quieren tres reglas. (1) «Ningún agente edita `expected/` ni `assumptions_reference.json`» → hook antes de las herramientas de edición que bloquee esas rutas, más una regla de denegación, más vigilar comandos de shell (un `cp` también escribe). (2) «Después de cada edición del cálculo se corre la reconciliación» → hook después de la edición que ejecute `reconcile.py` y devuelva las líneas FAIL. (3) «El agente no termina mientras la reconciliación no dé 0» → hook al terminar, con tope; si el código es 2 (falta un supuesto, como la probabilidad de «En pausa», §3.0.1 R4), el hook deja parar y exige un reporte para FP&A, porque esa condición no la puede cumplir el agente sin inventar un supuesto.

Ejemplo para completar: la ejecución de los lunes corre en CI con el agente en modo headless. Un compañero agregó en su rama un hook al archivo de configuración del proyecto que «envía el resumen a un servicio de notas» (`https://notas.example/api`). El alumno decide qué cambia en la ejecución de CI (usar el modo que no carga la configuración descubierta, o fijar por argumento solo los hooks y servidores aprobados; revisar el hook como cualquier código antes de fusionarlo).

**Conceptos erróneos frecuentes**

| ID | Creencia errónea | Por qué es errónea | Fuente |
| --- | --- | --- | --- |
| M08-CE24 | «Un hook después de la herramienta puede impedir que se escriba el archivo.» | Corre cuando la herramienta ya actuó; no deshace. Para impedir, antes de la herramienta. | [src-anthropic-cc-hooks-guide] |
| M08-CE25 | «Una compuerta al terminar garantiza que el agente acabe bien.» | Si la condición no se cumple puede encadenar intentos; necesita tope y una salida para lo imposible. | [src-anthropic-cc-hooks-guide][src-arxiv-impossiblebench]; [inferencia] |
| M08-CE26 | «Con un hook sobre las herramientas de edición, ningún archivo protegido puede cambiar.» | Los comandos de shell también escriben; los hooks de herramientas no son una frontera completa. | [src-anthropic-cc-hooks-guide][src-openai-codex-hooks] |
| M08-CE27 | «Los hooks del repositorio son configuración inofensiva.» | Son comandos que corren con tus permisos; en `-p` pueden ejecutarse sin el diálogo de confianza. | [src-anthropic-cc-headless]; [inferencia] |
| M08-CE28 | «Si `claude -p` o `codex exec` terminaron sin error, el resultado es el esperado.» | El código de salida dice que la ejecución terminó; la salida estructurada puede faltar y hay que comprobarla. | [src-anthropic-cc-headless]; [inferencia] |
| M08-CE29 | «Un hook escrito para una herramienta funciona igual en otra.» | Eventos, nombres y formatos cambian entre productos y superficies. | [src-github-copilot-hooks][src-openai-codex-hooks] |

**Fichas candidatas (máximo dos)**

1. **Hooks por producto** (verificado 2026-10-26):

| Producto · superficie | Dónde se configuran | Eventos relevantes | Cómo bloquean | Límites documentados | Estado | Fuente |
| --- | --- | --- | --- | --- | --- | --- |
| Claude Code · CLI, escritorio, IDE | `~/.claude/settings.json`, `.claude/settings.json` (versionable), `.claude/settings.local.json`, políticas gestionadas, plugins, skills y subagentes | `PreToolUse`, `PostToolUse`, `PostToolUseFailure`, `PermissionRequest`, `Stop`, `SubagentStop`, `SessionStart`, `UserPromptSubmit`, `Notification`, entre otros | Código de salida 2 o JSON con `permissionDecision: "deny"`; un `deny` vale en todos los modos de permiso | `PostToolUse` no deshace; `Stop` corta tras 8 bloqueos seguidos (`stop_hook_active`); tiempos límite: 10 min (comando), 30 s (prompt), 60 s (agent); tipos `command`, `http`, `mcp_tool`, `prompt` y `agent` | GA; hooks `agent` experimentales | [src-anthropic-cc-hooks-guide] |
| Codex · app, CLI, IDE | `hooks.json` o `[hooks]` en `config.toml`, de usuario o de repositorio (`.codex/`); plugins; `requirements.toml` gestionado | `SessionStart`, `PreToolUse`, `PermissionRequest`, `PostToolUse`, `Stop`, `SubagentStop`, `PreCompact`, entre otros | `permissionDecision: "deny"` o código 2 en `PreToolUse`; `ask` todavía no se admite | Cubre shell, `apply_patch`, MCP y herramientas locales, no herramientas alojadas como la búsqueda web; «no es una frontera de control completa»; hooks no gestionados requieren confianza ligada a su contenido | Activados por defecto (sin etiqueta) | [src-openai-codex-hooks] |
| GitHub Copilot · CLI, app, cloud agent, VS Code | `.github/hooks/*.json` (repositorio); `~/.copilot/hooks/*.json` (personal, CLI) | `sessionStart`, `preToolUse`, `postToolUse`, `agentStop`, `subagentStop`, `errorOccurred`, entre otros; en el cloud agent, solo un subconjunto | `preToolUse` aprueba o deniega | Corren de forma sincrónica y bloquean; tiempo límite 30 s por defecto; las llamadas de red añaden latencia y exponen datos | VS Code en vista previa pública; resto sin etiqueta | [src-github-copilot-hooks] |

Próxima revisión: 2027-01-26.

2. **Modo headless: salida, costo y reproducibilidad, complemento de `m07-pc-headless-integrations`** (verificado 2026-10-26): Claude Code `claude -p`: código 0 o distinto de 0; `--output-format json` con `total_cost_usd` (estimación del cliente) y `stream-json`; `--bare` omite hooks, skills, subagentes, MCP, memoria y CLAUDE.md descubiertos, no usa el inicio de sesión de la suscripción (pide `ANTHROPIC_API_KEY`) y será el predeterminado de `-p` en una versión futura; `--max-budget-usd`; espera hasta 10 minutos el trabajo en segundo plano antes de cortarlo; SIGTERM termina con código 143 [src-anthropic-cc-headless]. Codex `codex exec`: progreso a stderr y mensaje final a stdout; `--json` (eventos como `turn.failed`), `--output-schema`, `-o`, `--ephemeral`; recomienda `openai/codex-action` y separar un trabajo de solo lectura que genera el parche de otro sin clave que abre la PR; la página no documenta códigos de salida numéricos [src-openai-codex-noninteractive]. Próxima revisión: 2027-01-26.

---

### Lección 6 — Costos, registros y fallos; comparar con lo simple y verificar en proporción

**Objetivo de lección (→ M08-OE6):** Dado el registro, el costo o el resultado de una automatización que falló, identifica la causa, decide la primera acción y elige entre corregir o simplificar, con verificación proporcional.

**Ideas clave — costos**

- **El costo de la autonomía se mide en tokens y en atención.** Un agente consume unas 4 veces los tokens de un chat y un sistema multiagente unas 15 veces [src-anthropic-eng-multi-agent-research]. En un producto, los equipos de agentes usan unas 7 veces más tokens que una sesión estándar cuando los compañeros corren en modo plan, y su costo crece con cada compañero activo [src-anthropic-cc-costs]. Las tareas programadas consumen el uso del plan como cualquier sesión [src-anthropic-cc-routines], y una tarea de sesión que se dispara en reposo reenvía todo el contexto cada vez [src-anthropic-cc-costs].
- **El costo se lee, no se adivina.** Las herramientas informan del gasto estimado por ejecución y desglosan qué parte se llevaron subagentes, servidores MCP o tareas recurrentes (ficha) [src-anthropic-cc-costs][src-anthropic-cc-headless]. [inferencia] Comparar dos diseños exige el mismo dato para los dos: costo por ejecución, tiempo hasta el borrador y tiempo de revisión humana.
- **La sensación de ahorro no es una medida.** El ensayo de 2025 con desarrolladores experimentados (más lentos con IA, aunque se creían más rápidos) [src-arxiv-metr-productivity] ya está en M05 L4; aquí se aplica a «el equipo de agentes nos ahorra la mañana del lunes»: se mide.

**Ideas clave — registros y fallos**

- **El estado de la ejecución no es el resultado del trabajo.** En un producto, el historial de una tarea programada marca «Succeeded» si la sesión terminó sin informar un fallo, aunque haya habido peticiones de red bloqueadas, herramientas de conectores ausentes o trabajo que no se pudo completar: eso aparece en la transcripción, no en la fila (ficha) [src-anthropic-cc-routines]. La práctica de fiabilidad lo dice en general: el programador no garantiza resultados correctos, hay que vigilar lo que el trabajo hace, idealmente con un monitoreo independiente [src-google-sre-cron].
- **El registro que sirve tiene tres capas.** [inferencia, apoyada en src-github-actions-logs, src-anthropic-cc-headless y src-python-logging] (1) Cómo terminó la ejecución (código de salida, estado); (2) qué hizo el agente (transcripción: herramientas, denegaciones, errores); (3) qué produjo, comparado contra un check independiente (aquí, `reconcile.py`). Un registro que solo tiene (1) no permite diagnosticar.
- **Los sistemas de agentes fallan de formas reconocibles.** MAST agrupa los fallos en diseño del sistema (≈ 44 % de los modos sumados), desalineación entre agentes (≈ 32 %) y verificación (≈ 23,5 %) [src-arxiv-mast-mas-failures; los porcentajes por grupo son suma propia de los modos publicados]. Los autores concluyen que los arreglos tácticos (mejores prompts, roles, topología) ayudan pero no bastan, y piden verificación más fuerte y mejor gestión del estado [src-arxiv-mast-mas-failures]. Cita posible: los fallos identificados «require more sophisticated solutions» [src-arxiv-mast-mas-failures].
- **Los errores se acumulan y el reintento no los borra.** En producción, los agentes guardan estado y un error pequeño puede descarrilar una ejecución larga; el equipo de investigación de Anthropic construyó reanudación desde puntos de control en vez de reiniciar desde cero, y trazas para diagnosticar comportamientos no deterministas [src-anthropic-eng-multi-agent-research]. [inferencia] Reintentar una ejecución que falló por un supuesto que falta repite el fallo y el gasto; la primera acción es leer el registro.
- **Detener antes de corregir.** [inferencia, apoyada en src-google-sre-cron y M05 L4] Ante una tarea programada que falla: pausarla para que la próxima ejecución no repita el daño, leer el registro en sus tres capas, identificar la causa, y solo entonces decidir si se corrige o se reemplaza. Pausar conserva la configuración; borrar la pierde (ficha).
- **Comparar con la solución simple.** La recomendación de partida vale también al final: añadir sistemas agénticos de varios pasos solo cuando lo simple se queda corto [src-anthropic-building-agents]. [inferencia] Si un diseño agéntico falla por algo que un flujo fijo habría detenido en voz alta (un supuesto que falta, un archivo que no llegó), la alternativa más simple no es un retroceso: es el diseño correcto para ese tramo.

**Ideas clave — verificar en proporción a lo no supervisado**

- **Cuanto menos se mira, más firme el check.** M05 L3 ya lo dijo para un encargo [src-anthropic-cc-best-practices]; M08 lo aplica a la ejecución desatendida [inferencia]. Escala propuesta [inferencia]: acompañado → revisar el diff y la evidencia; en segundo plano con PR → check automático más revisión de la PR; programado y recurrente → check como compuerta que impide publicar, alerta cuando falla y revisión humana del borrador antes de usarlo.
- **La verificación tiene que ser independiente del agente.** La verificación ausente o incorrecta es uno de los tres grupos de fallo de MAST [src-arxiv-mast-mas-failures]; las arquitecturas sin verificación central propagan más los errores [src-arxiv-scaling-agent-systems]. [inferencia] Que un agente «revisor» apruebe al agente «redactor» no reemplaza un check determinista.
- **Probar en aislado antes de soltar.** La fuente de patrones pide pruebas extensas en entornos aislados con salvaguardas antes de dar autonomía [src-anthropic-building-agents]; una herramienta pide revisar las primeras ejecuciones de una tarea programada y ajustar [src-openai-codex-scheduled-tasks]. (La escalera de validación de M07 L6 aplica igual.)
- **Frontera con M09** [inferencia]: aquí se decide qué hacer con la ejecución y qué control poner; cómo medir la confiabilidad de una versión (casos, graders, pass^k) es de M09 y ya se expuso en `dx-b6-04`.

**Caso de transferencia (currículo): una tarea programada que falla**

Situación (sintética): desde hace tres semanas, una tarea programada en la nube corre los lunes a las 6:07, descarga el snapshot de `https://datos.altiplano.example/snapshots/`, recalcula los KPI con un agente y deja `kpis.json` y el borrador del comentario en una rama. El historial muestra las tres ejecuciones como «Succeeded». El 26 de octubre, la directora nota que el borrador sigue diciendo «6 oportunidades vencidas».

Evidencia:

- **Capa 1 (estado):** «Succeeded».
- **Capa 2 (transcripción, resumida):** la descarga del snapshot recibió `403` con `x-deny-reason: host_not_allowed` (el dominio no está en la lista permitida del entorno); el agente escribió «no pude descargar el snapshot nuevo; uso el último disponible en el repositorio» y siguió.
- **Capa 3 (check):** `reconcile.py` contra el snapshot del 26 con el `kpis.json` producido termina con código 1 y seis líneas FAIL: `as_of_date` 2026-10-19 frente a 2026-10-26, vencidas Sur 2 frente a 3, vencidas TOTAL 6 frente a 7 y tres `unknown_stage` sin reportar (OPP-1040, OPP-1041, OPP-1042) (§3.0.1 R2, salida real del script).

Decisiones que se evalúan:

1. **Primera acción:** pausar la tarea (no borrarla, no relanzarla) y marcar el borrador como no válido. Relanzarla repite el mismo 403 y produce otro borrador viejo.
2. **Causa:** la red del entorno bloqueaba el origen de datos, y el diseño permitía que el agente siguiera con un dato viejo en vez de fallar. El «Succeeded» no mentía: describía la sesión, no el trabajo.
3. **Alternativa más simple:** un script programado que descarga el snapshot, falla en voz alta si no llega o si su fecha no es la del día, corre `reconcile.py` como compuerta y solo entonces llama al modelo para redactar; o, si el agente se mantiene, una regla en el encargo y un check que comparen `as_of_date` con la fecha de la ejecución. En ambos casos, el dominio se agrega explícitamente a la red del entorno y nada se publica si el check no da 0.
4. **Verificación proporcional:** como nadie mira a las 6:07, la compuerta es automática (código distinto de 0 → no hay borrador) y la persona revisa el borrador antes del comité.

**Ejemplo con Altiplano (laboratorio, distinto del caso de transferencia)**

Ver §5, paso 6: el diseño de cuatro agentes produce el 26 de octubre cifras correctas pero no reporta las tres etapas nuevas; el agente revisor lo aprueba; `reconcile.py` lo detecta (§3.0.1 R3).

**Conceptos erróneos frecuentes**

| ID | Creencia errónea | Por qué es errónea | Fuente |
| --- | --- | --- | --- |
| M08-CE30 | «Si el historial dice que la ejecución terminó bien, el trabajo está hecho.» | El estado describe cómo terminó la sesión; el trabajo se comprueba en la transcripción y contra un check. | [src-anthropic-cc-routines][src-google-sre-cron] |
| M08-CE31 | «Ante una tarea programada que falla, lo primero es relanzarla.» | Repite el fallo y el gasto; primero se detiene y se lee el registro. | [inferencia]; [src-google-sre-cron] |
| M08-CE32 | «Si el agente revisor aprobó el resultado, está verificado.» | La verificación entre agentes falla con frecuencia; hace falta un check independiente. | [src-arxiv-mast-mas-failures][src-arxiv-scaling-agent-systems] |
| M08-CE33 | «Mejorar los prompts de los agentes resuelve los fallos del sistema.» | Los arreglos tácticos ayudan pero no bastan; hacen falta verificación y gestión del estado. | [src-arxiv-mast-mas-failures] |
| M08-CE34 | «Volver a un flujo fijo es un retroceso.» | Lo agéntico se añade solo cuando lo simple se queda corto; si lo simple detiene el fallo, es el diseño correcto. | [src-anthropic-building-agents] |
| M08-CE35 | «Lo que corre de madrugada necesita la misma verificación que lo que se hace acompañado.» | Cuanto menos se supervisa, más firme debe ser el check: compuerta automática y revisión del resultado. | [src-anthropic-cc-best-practices]; [inferencia] |
| M08-CE36 | «Para saber si el equipo de agentes conviene, basta con la impresión del equipo.» | La percepción y el tiempo medido pueden ir en sentidos opuestos; se comparan costo, tiempo y revisión. | [src-arxiv-metr-productivity]; [inferencia] |

**Fichas candidatas (máximo una)**

- *Costos, historial y registros de ejecuciones automatizadas por producto* (verificado 2026-10-26): Claude Code: `/usage` atribuye el uso reciente a skills, subagentes, plugins y servidores MCP, y desde v2.1.242 muestra filas para las tareas `/loop` más pesadas; el costo en dólares es una estimación local a precio de lista [src-anthropic-cc-costs]; en `-p`, `total_cost_usd` en la salida JSON [src-anthropic-cc-headless]; el historial de tareas programadas usa «Succeeded», «Failed» y «Cancelled», que describen cómo terminó la sesión; se pausan con un interruptor que conserva la configuración; `/schedule` puede leer el registro de una ejecución y explicar errores y denegaciones desde v2.1.227 [src-anthropic-cc-routines]. Codex: `codex exec --json` emite eventos como `turn.failed` y `error` [src-openai-codex-noninteractive]; las tareas programadas tienen estados activa, pausada y completada [src-openai-codex-scheduled-tasks]. GitHub Actions: registros por paso, con los pasos fallidos expandidos, búsqueda y descarga [src-github-actions-logs]. Próxima revisión: 2027-01-26.

---

## 4. Qué NO enseñar o enseñar con cautela

| Tema | Decisión | Motivo |
| --- | --- | --- |
| Construir frameworks de agentes, SDK, bucles de herramientas en código | No enseñar | El alumno decide y revisa; no implementa (`docs/curriculum.md`, M08). La fuente de patrones advierte que los frameworks ocultan prompts [src-anthropic-building-agents] |
| Repetir `dx-b6-01` («¿qué solución para un reporte de pasos fijos?») | Prohibido en banco, comprobaciones y laboratorio | Ya expuesto; M08 pregunta qué paso merece modelo, qué patrón, qué cuesta y qué falla |
| pass@k, pass^k y diseño de evaluaciones | No en M08 | Es de M09; ya expuesto en `dx-b6-04` |
| Cifras de multiagente (90,2 %, 4×, 15×, 80 % de la varianza, +80,8 % / −70,0 %, 7×) como leyes | Cautela: citarlas con fuente, año y contexto (evaluación interna, una prueba de búsqueda, modelos de 2025-2026, modo plan) | [src-anthropic-eng-multi-agent-research][src-arxiv-scaling-agent-systems][src-anthropic-cc-costs]; dependen de modelos y tareas |
| Porcentajes de cada modo de fallo de MAST | Cautela: usar para mostrar que el término y la verificación fallan a menudo; no evaluar números | Muestra de siete marcos concretos [src-arxiv-mast-mas-failures] |
| «Don't build multi-agents» como verdad | Cautela: es opinión de un proveedor; presentarla como contrapunto | [src-cognition-dont-build-multi-agents] |
| Equipos de agentes como práctica recomendada | Mencionar en ficha; nada evaluable sobre su configuración | Experimentales y desactivados por defecto [src-anthropic-cc-agent-teams] |
| Flags, eventos y rutas (`--bare`, `PreToolUse`, `isolation: worktree`, `/schedule`, `approval_policy`, cron) | Solo en fichas; nunca como respuesta de examen | D-019; volatilidad muy alta |
| Sintaxis de cron y RRULE | Aparte no evaluable | Detalle de implementación; basta «programar a un minuto que no sea en punto» como inferencia |
| Arquitectura interna de planificadores distribuidos (Paxos, réplicas) | No enseñar | Para implementadores [src-google-sre-cron]; solo la conclusión práctica (vigilar el resultado, preferir saltar a duplicar) |
| Hooks `prompt` y `agent` (que usan un modelo para decidir) como control determinista | Cautela: no son deterministas; los `agent` son experimentales | [src-anthropic-cc-hooks-guide] |
| Ataques a través de hooks o configuración del proyecto | Solo la conclusión (un hook es código con tus permisos; revisar antes de fusionar); la defensa es de M09 | M07 L6 ya cubrió `.mcp.json`; no duplicar |
| Repetir la «conciliación del viernes» (M07 L6), el «informe del lunes que corre solo» con el CRM (laboratorio M07) o «las tres tareas del viernes» (M05 L6) | Prohibido como escenario de M08 | Ya expuestos |
| Cualquier URL, token o servicio real | Prohibido | AGENTS.md: datos sintéticos siempre; dominios `*.example` |

---

## 5. Propuesta de laboratorio: dos diseños para el reporte del lunes

Caso práctico por pasos, de opción múltiple (D-024, estándar §5). Sin entregable, rúbrica ni registro de evidencias. Dos preguntas por paso, cada una ligada a un objetivo evaluado; en total, dos por objetivo. Responde a la práctica del currículo («comparar un flujo determinista con uno de agentes para el reporte semanal de Altiplano») sin repetir `dx-b6-01`: no se pregunta «¿cuál eliges?» en abstracto, sino qué tramo merece un modelo, cómo se encarga, qué se paraleliza, dónde corre, qué controla el arnés y qué hacer cuando falla.

**Historia.** El reporte del comité ya funciona como flujo fijo (propuesta A: script → `reconcile.py` → modelo redacta → persona revisa). Un compañero entusiasta propone reemplazarlo por un «equipo» de cuatro agentes (propuesta B: extractor, calculador, redactor y revisor, con un orquestador) que «se adapta solo a cualquier cambio». La analista de FP&A decide probar B durante dos lunes en paralelo con A antes de cambiar nada.

**Materiales (a construir por el autor, todos sintéticos):** diagrama de A y de B; los encargos que el orquestador de B envía a cada agente; la propuesta de paralelizar por región; las opciones de dónde programar; el archivo de configuración del proyecto con sus hooks; los dos snapshots; las salidas reales de `reconcile.py` (§3.0.1 R1 y R3); la transcripción resumida de B del 26 de octubre.

### Paso 1 · Dos diseños sobre la mesa {#paso-1}

Material: diagramas de A y B.

- **P1.1 (M08-OE1).** En la propuesta B, ¿qué tramo necesita de verdad un modelo? Clave: solo la redacción del comentario (y, si se quiere, resumir notas libres); extraer y calcular son reglas fijas que ya hace el script. Distractores: «los cuatro, porque así se adapta» (CE02); «el cálculo, para que entienda las etapas nuevas» (contradice M06 L5).
- **P1.2 (M08-OE1).** ¿Qué patrón describe B y está justificado? Clave: orquestador-trabajadores; no se justifica, porque las subtareas se conocen de antemano y siempre son las mismas; basta una cadena con un check entre cálculo y redacción. Distractores: «es evaluador-optimizador, así que mejora solo» (CE04); «cualquier tarea con varias partes pide un orquestador» (CE03).

### Paso 2 · El encargo del redactor {#paso-2}

Material: el encargo del orquestador al redactor («Escribe el comentario del comité. Hazlo excelente. El revisor te dirá si está bien») y el del revisor («Revisa hasta que esté perfecto»).

- **P2.1 (M08-OE2).** ¿Qué condición de término es la más adecuada para el par redactor-revisor? Clave: cada cifra citada coincide con el `kpis.json` verificado (código 0) y se mencionan vencidas y problemas de calidad; máximo dos rondas; si no se cumple, borrador marcado «sin aprobar». Distractores: «cuando el revisor diga que está bien» (CE08, CE10); «sin tope, para que llegue a la mejor versión» (CE09 al revés: bucle).
- **P2.2 (M08-OE2).** El redactor recibe solo «Escribe el comentario del comité». ¿Qué le falta para trabajar bien? Clave: la entrada (de dónde salen las cifras), el entregable con su ruta y el criterio; un subagente no ve lo que se habló con el orquestador. Distractores: «nada, el redactor conoce el contexto de la sesión» (CE06); «más detalle de estilo y tono» (no resuelve la falta de entrada ni de criterio).

### Paso 3 · Repartir por región {#paso-3}

Material: la propuesta de «tres subagentes en paralelo, uno por región, que calculen sus KPI y escriban su sección en `comentario.md`», y la estimación del compañero: «tarda menos y cuesta lo mismo».

- **P3.1 (M08-OE3).** ¿Qué parte del trabajo conviene paralelizar? Clave: solo la lectura y el resumen de las notas libres de cada región, sin escribir archivos; el cálculo lo hace el script y el comentario lo escribe una sola sesión, porque el TOTAL depende de las tres y el archivo es el mismo. Distractores: «todo, con worktrees no hay conflictos» (CE14); «todo, más agentes terminan antes» (CE12).
- **P3.2 (M08-OE3).** ¿Qué hay que corregir en «cuesta lo mismo»? Clave: cada subagente gasta sus propios tokens y los sistemas multiagente consumen bastante más que un agente; el costo se compara con el de A antes de decidir. Distractores: «los subagentes no ocupan contexto, así que no cuestan» (CE13); «el costo no importa si el resultado es mejor» (no hay evidencia de que lo sea).

### Paso 4 · Dónde y cuándo corre {#paso-4}

Material: el snapshot llega los lunes a las 6:00 a una carpeta compartida montada en la computadora de la analista; el repositorio está en GitHub; las opciones son tarea programada en la nube, tarea programada local en un worktree, tarea dentro de una sesión abierta y script en CI.

- **P4.1 (M08-OE4).** Mientras el snapshot siga llegando solo a la carpeta local, ¿qué opción puede leerlo? Clave: la tarea programada local, en un worktree, aceptando que la computadora debe estar encendida; la nube y la CI parten del repositorio y no ven la carpeta. Distractores: «la nube, porque corre aunque la máquina esté apagada» (CE18); «una tarea dentro de la sesión, que dura toda la semana» (muere con la sesión y caduca).
- **P4.2 (M08-OE4).** ¿Qué debe dejar la ejecución de las 6:10? Clave: un borrador en una rama o PR, con nombre por fecha, para que la analista lo revise antes del comité. Distractores: «enviar directamente el comentario al comité, para eso se automatizó» (CE23); «sobrescribir el borrador anterior; si corre dos veces da igual» (CE21).

### Paso 5 · Las reglas del arnés {#paso-5}

Material: tres reglas de FP&A: (a) ningún agente edita `expected/` ni `assumptions_reference.json`; (b) tras cada edición del cálculo se corre `reconcile.py`; (c) nadie da por terminado el trabajo si `reconcile.py` no devuelve 0. Además, la versión de CI de B correría en modo headless sobre la rama de quien la lance.

- **P5.1 (M08-OE5).** ¿Qué control corresponde a la regla (a)? Clave: un hook antes de las herramientas de edición que bloquee esas rutas, junto con una regla de denegación y vigilancia de los comandos de shell. Distractores: «un hook después de la edición que avise» (CE24: ya se escribió); «una línea en las instrucciones» (no garantiza nada).
- **P5.2 (M08-OE5).** Para la regla (c) se pone una compuerta al terminar. El 26 de octubre, `reconcile.py` devuelve 2 porque falta la probabilidad de «En pausa». ¿Qué debe hacer la compuerta? Clave: dejar parar al agente con un reporte para FP&A, porque la condición no la puede cumplir sin inventar un supuesto; la compuerta lleva tope y salida para lo imposible. Distractores: «bloquear hasta que dé 0» (CE25: bucle, y el agente puede editar los supuestos para pasar); «quitar la compuerta para que no se trabe» (pierde el control).

### Paso 6 · El lunes 26 de octubre (giro del caso) {#paso-6}

Material: A y B corrieron en paralelo sobre el snapshot del 26. A se detuvo antes de redactar: el check reportó las tres oportunidades «En pausa» como problema de calidad y la analista las vio. B entregó un borrador con las cifras correctas (pipeline del Centro USD 1 330 500, sin cambios, y 7 vencidas) y el agente revisor lo aprobó, pero `reconcile.py` sobre la salida de B termina con código 1 y tres FAIL: `calidad unknown_stage OPP-1040/1041/1042: el dashboard no lo reporta` (§3.0.1 R3). El registro de costo estimado muestra que B gastó varias veces lo de A (magnitud a definir por el autor como dato ficticio del caso, sin presentarla como medición).

- **P6.1 (M08-OE6).** ¿Cuál es la primera acción con la tarea programada de B? Clave: pausarla antes del lunes siguiente y revisar el registro (qué hizo cada agente y por qué el revisor aprobó); no relanzarla. Distractores: «relanzarla para ver si esta vez lo reporta» (CE31); «está bien, el revisor la aprobó» (CE32).
- **P6.2 (M08-OE6).** Con lo visto en los dos lunes, ¿qué decisión anterior hay que revisar y qué se adopta? Clave: la de P1.2: B añadió costo y un punto de fallo silencioso sin mejorar el resultado; se mantiene A, con `reconcile.py` como compuerta que impide publicar y la persona revisando el borrador, y, si se quiere algo de B, solo el resumen paralelo de notas de P3.1. Distractores: «mejorar los prompts de B y seguir» (CE33); «volver a A es un retroceso» (CE34).

**Pruébalo en tu entorno (opcional, sin registro):** con los datos sintéticos de M02, correr `reconcile.py` contra el snapshot del 26 con la salida del 19 y leer las seis líneas FAIL; después, escribir en un archivo de configuración de prueba un hook que se niegue a editar `expected/` y comprobar que bloquea la edición. La app no ejecuta nada (estándar §5).

**Cobertura:** OE1 (P1.1, P1.2), OE2 (P2.1, P2.2), OE3 (P3.1, P3.2), OE4 (P4.1, P4.2), OE5 (P5.1, P5.2), OE6 (P6.1, P6.2). Giro: P6.2 obliga a revisar la decisión de P1.2 con evidencia de dos ejecuciones. Escenarios distintos de `dx-b6-01` (no se pregunta qué solución elegir para un reporte fijo, sino qué tramo merece modelo y qué patrón describe una propuesta), de `dx-b6-04` (no se mide consistencia), de `dx-b4-04` (el paralelismo es por región y de solo lectura, no un cambio de código dependiente), del caso de transferencia de L6 (allí falla la red y se reutiliza un dato viejo; aquí falla la verificación entre agentes) y de los laboratorios M05 y M07.

---

## 6. Registro de fuentes

Consultadas el 2026-10-26 salvo indicación. Criterio de próxima revisión: alta o muy alta → 2027-01-26; media → 2027-04-26; baja → 2027-10-26. «(existente)» = el ID ya está en `content/sources.json`; «reabierta» = se volvió a abrir hoy.

| ID | Título | URL | Organización | Consultado | Afirmaciones que sustenta | Volatilidad | Próxima revisión |
| --- | --- | --- | --- | --- | --- | --- | --- |
| src-anthropic-building-agents (existente, reabierta) | Building effective agents (2024-12-19) | https://www.anthropic.com/engineering/building-effective-agents | Anthropic | 2026-10-26 | Flujo frente a agente; empezar por lo más simple; los cinco patrones y cuándo usar cada uno; agentes para problemas abiertos; costo y errores acumulados; pruebas en aislado, salvaguardas y máximo de iteraciones; frameworks que ocultan prompts; tres principios; nota de que parte de las herramientas cambió | Baja | 2027-10-26 |
| src-anthropic-eng-multi-agent-research | How we built our multi-agent research system (2025-06-13) | https://www.anthropic.com/engineering/multi-agent-research-system | Anthropic | 2026-10-26 | Orquestador-trabajadores; +90,2 % frente a un agente en evaluación interna; ≈4× y ≈15× tokens frente a chat; tokens = 80 % de la varianza en BrowseComp; cuándo no conviene (contexto compartido, dependencias, programación); encargos con objetivo, formato, herramientas y límites; reglas de esfuerzo; 50 subagentes para preguntas simples; errores que se acumulan, reanudación, trazas; cuello de botella sincrónico | Media | 2027-04-26 |
| src-anthropic-eng-context (existente, reabierta) | Effective context engineering for AI agents (2025-09-29) | https://www.anthropic.com/engineering/effective-context-engineering-for-ai-agents | Anthropic | 2026-10-26 | Subagentes con contexto limpio que devuelven 1 000–2 000 tokens; compactación, notas estructuradas y multiagente según el tipo de tarea | Media | 2027-04-26 |
| src-anthropic-eng-harnesses (existente, no reabierta) | Effective harnesses for long-running agents (2025-11-26) | https://www.anthropic.com/engineering/effective-harnesses-for-long-running-agents | Anthropic | 2026-10-22 (registro previo) | Sesiones sin memoria; registro de progreso, lista de funciones, commits | Baja | 2027-10-22 |
| src-arxiv-mast-mas-failures | Why Do Multi-Agent LLM Systems Fail? (arXiv:2503.13657, v1 2025-03-17, v3 2025-10-26) | https://arxiv.org/abs/2503.13657 (detalle de modos en https://arxiv.org/html/2503.13657v3) | Cemri, Pan, Yang et al. (UC Berkeley, según la versión HTML) | 2026-10-26 | Taxonomía MAST: 14 modos en tres grupos; 1 600+ trazas, 7 marcos; κ = 0,88; porcentajes por modo; arreglos tácticos insuficientes; fallos no solo atribuibles al modelo | Media | 2027-04-26 |
| src-arxiv-scaling-agent-systems | Towards a Science of Scaling Agent Systems (arXiv:2512.08296, v1 2025-12-09, v3 2026-04-08) | https://arxiv.org/abs/2512.08296 | Kim et al. (afiliación no verificada en la página del resumen) | 2026-10-26 | 260 configuraciones, seis bancos, cinco arquitecturas, tres familias; de +80,8 % a −70,0 % frente a un agente; rendimientos decrecientes; más propagación de errores sin verificación central; acierta la arquitectura en el 87 % de casos reservados | Media | 2027-04-26 |
| src-cognition-dont-build-multi-agents | Don't Build Multi-Agents (2025-06-12) | https://cognition.com/blog/dont-build-multi-agents (redirigida desde cognition.ai) | Cognition (Walden Yan) | 2026-10-26 | Compartir contexto y trazas completas; las acciones llevan decisiones implícitas; ejemplo de subagentes con piezas incompatibles; agente lineal por defecto (opinión de un proveedor) | Media | 2027-04-26 |
| src-google-sre-cron | Distributed Periodic Scheduling with Cron (Site Reliability Engineering, cap. 24) | https://sre.google/sre-book/distributed-periodic-scheduling/ | Google (Štěpán Davidovič) | 2026-10-26 | Idempotencia de tareas periódicas; tolerancia a saltos frente a dobles lanzamientos; preferencia por saltar; vigilar el resultado y monitoreo independiente; picos por horarios coincidentes | Baja | 2027-10-26 |
| src-anthropic-cc-subagents (existente, reabierta) | Create custom subagents (Claude Code) | https://code.claude.com/docs/en/sub-agents | Anthropic | 2026-10-26 | Contexto limpio, no hereda historial; resumen; mismos límites de uso; integrados; campos (`tools`, `maxTurns`, `isolation: worktree`, `background`); 20 simultáneos; anidamiento 3 niveles desde v2.1.219; cuándo no usar subagentes | Muy alta | 2027-01-26 |
| src-anthropic-cc-agent-teams | Orchestrate teams of Claude Code sessions | https://code.claude.com/docs/en/agent-teams | Anthropic | 2026-10-26 | Experimental y desactivado; líder, compañeros, lista de tareas y buzón; comparación con subagentes; más tokens; no en `-p`; 3–5 compañeros; evitar editar el mismo archivo; limitaciones | Muy alta | 2027-01-26 |
| src-anthropic-cc-costs (existente, reabierta) | Manage costs effectively (Claude Code) | https://code.claude.com/docs/en/costs | Anthropic | 2026-10-26 | Equipos ≈7× en modo plan; subagentes con su propio uso; tareas de sesión reenvían el contexto; `/usage` con atribución y filas de `/loop`; costo estimado; hooks que filtran salida | Muy alta | 2027-01-26 |
| src-anthropic-cc-worktrees (existente, reabierta) | Run parallel sessions with worktrees (Claude Code) | https://code.claude.com/docs/en/worktrees | Anthropic | 2026-10-26 | Sesiones en paralelo en worktrees; copia limpia sin ignorados ni dependencias; `.worktreeinclude`; comprobaciones de aislamiento y lo que no rastrean; `-p` no limpia; subagentes con worktree | Muy alta | 2027-01-26 |
| src-git-worktree (existente, reabierta) | git-worktree (Git 2.56.0, 2026-09-28) | https://git-scm.com/docs/git-worktree | Git | 2026-10-26 | Worktree enlazado; `HEAD`, índice y archivos propios; resto compartido; una rama no en dos worktrees salvo `--force`; `remove` solo limpio | Baja | 2027-10-26 |
| src-openai-codex-subagents | Subagents (Codex) | https://learn.chatgpt.com/codex/subagents | OpenAI | 2026-10-26 | Activados por defecto; delegación explícita o por AGENTS.md/skill; heredan sandbox y aprobaciones; más tokens; agentes en `.codex/agents/`; `agents.max_concurrent_threads_per_session` | Muy alta | 2027-01-26 |
| src-anthropic-cc-routines (existente, reabierta) | Automate work with scheduled tasks (Claude Code) | https://code.claude.com/docs/en/routines | Anthropic | 2026-10-26 | *Research preview*; nube; disparadores; prompt autocontenido; clon por ejecución; ramas `claude/`; conectores incluidos por defecto; actúa como tú; modo automático y esperas; texto del disparo como dato; historial (Succeeded no implica trabajo hecho); pausar; mínimo 1 h; límites por hora; consume el plan; ejecuciones en punto con retraso | Muy alta | 2027-01-26 |
| src-anthropic-cc-scheduled-tasks | Run prompts on a schedule (Claude Code) | https://code.claude.com/docs/en/scheduled-tasks | Anthropic | 2026-10-26 | Tabla comparativa nube / escritorio / `/loop`; tareas de sesión: sesión abierta, sin recuperación, caducan a 7 días, 50 por sesión, mínimo 1 minuto | Muy alta | 2027-01-26 |
| src-openai-codex-scheduled-tasks | Scheduled tasks (Codex / ChatGPT) | https://learn.chatgpt.com/docs/automations?surface=app (redirigida desde developers.openai.com/codex/app/automations) | OpenAI | 2026-10-26 | Superficies; app abierta y proyecto en disco; local o worktree; web sin carpetas locales; `approval_policy = "never"`; acceso total = riesgo elevado; probar el prompt antes y revisar las primeras ejecuciones; estados | Muy alta | 2027-01-26 |
| src-github-actions-schedule | Events that trigger workflows — `schedule` | https://docs.github.com/en/actions/reference/workflows-and-actions/events-that-trigger-workflows | GitHub | 2026-10-26 | Cron en UTC o zona IANA; mínimo 5 minutos; retrasos y pérdidas con carga; solo rama por defecto; desactivación a 60 días en repositorios públicos; actor | Media | 2027-04-26 |
| src-anthropic-cc-cloud (existente, no reabierta) | Use Claude Code in the cloud | https://code.claude.com/docs/en/claude-code-on-the-web | Anthropic | 2026-10-22 (registro previo) | La nube clona la rama remota (puente con M05 L6) | Muy alta | 2027-01-22 |
| src-openai-codex-cloud (existente, reabierta) | Codex Cloud | https://learn.chatgpt.com/codex/cloud | OpenAI | 2026-10-26 | Espacio de trabajo por tarea; sigue con el equipo dormido; varias tareas por entorno; red configurable | Muy alta | 2027-01-26 |
| src-github-cloud-agent (existente, reabierta) | About Copilot cloud agent | https://docs.github.com/en/copilot/concepts/agents/coding-agent/about-coding-agent | GitHub | 2026-10-26 | Entorno efímero; rama y PR; registros de sesión; un repositorio; una PR por tarea; 59 minutos; hooks admitidos | Alta | 2027-01-26 |
| src-github-cloud-agent-risks (existente, reabierta) | Risks and mitigations for Copilot cloud agent | https://docs.github.com/en/copilot/concepts/agents/cloud-agent/risks-and-mitigations | GitHub | 2026-10-26 | Rama `copilot/`; PR en borrador que no aprueba ni fusiona; quien pidió no aprueba; workflows con aprobación; automatizaciones atribuidas a quien las creó; caracteres ocultos filtrados | Alta | 2027-01-26 |
| src-anthropic-cc-hooks-guide | Automate actions with hooks (Claude Code) | https://code.claude.com/docs/en/hooks-guide | Anthropic | 2026-10-26 | Hooks deterministas; eventos; bloqueo con código 2 o JSON; `deny` en todos los modos; `PostToolUse` no deshace; shell escapa a matchers de edición; tope de 8 bloqueos de `Stop`; tipos y tiempos límite; ubicaciones | Muy alta | 2027-01-26 |
| src-openai-codex-hooks (existente, reabierta) | Hooks (Codex) | https://learn.chatgpt.com/codex/hooks | OpenAI | 2026-10-26 | Activados por defecto; eventos; cobertura de `PreToolUse` (sin herramientas alojadas); «no es una frontera de control completa»; confianza ligada al contenido; ubicaciones | Muy alta | 2027-01-26 |
| src-github-copilot-hooks | About hooks (Copilot cloud agent) | https://docs.github.com/en/copilot/concepts/agents/cloud-agent/about-hooks | GitHub | 2026-10-26 | `.github/hooks/*.json`; eventos; `preToolUse` aprueba o deniega; subconjunto en el cloud agent; sincrónicos, 30 s; VS Code en vista previa; no suponer igualdad entre superficies (resultado de búsqueda de la misma documentación) | Muy alta | 2027-01-26 |
| src-anthropic-cc-features (existente, no reabierta) | Extend Claude Code | https://code.claude.com/docs/en/features-overview | Anthropic | 2026-10-21 (registro previo) | Hooks deterministas frente a instrucciones (base de M03; solo puente) | Alta | 2027-01-21 |
| src-anthropic-cc-headless (existente, reabierta) | Run Claude Code programmatically | https://code.claude.com/docs/en/headless | Anthropic | 2026-10-26 | `-p`; códigos de salida; `json`/`stream-json` con `total_cost_usd`; `--bare` y su futura condición de predeterminado; hooks y `.mcp.json` del proyecto sin confianza fuera de `--bare`; `--max-budget-usd`; espera de 10 minutos; SIGTERM 143; comprobar `structured_output` | Muy alta | 2027-01-26 |
| src-openai-codex-noninteractive (existente, reabierta) | Non-interactive mode (Codex) | https://learn.chatgpt.com/docs/non-interactive-mode | OpenAI | 2026-10-26 | `codex exec`; stderr y stdout; `--json`, `--output-schema`, `-o`, `--ephemeral`; `CODEX_API_KEY` en línea; `openai/codex-action`; separar generar de abrir la PR; sin códigos numéricos documentados | Muy alta | 2027-01-26 |
| src-anthropic-cc-best-practices (existente, no reabierta) | Best practices for Claude Code | https://code.claude.com/docs/en/best-practices | Anthropic | 2026-10-21 (registro previo) | Cuanto menos se supervisa, más firme el check (base de M05 L3; solo puente) | Alta | 2027-01-21 |
| src-github-copilot-agent-bp (existente, no reabierta) | Best practices for using GitHub Copilot to work on tasks | https://docs.github.com/copilot/how-tos/agents/copilot-coding-agent/best-practices-for-using-copilot-to-work-on-tasks | GitHub | 2026-10-21 (registro previo) | Lógica de negocio, lo ambiguo y lo crítico no se delegan a ciegas (base de M05 L2) | Alta | 2027-01-21 |
| src-owasp-llm06 (existente, no reabierta) | LLM06:2025 Excessive Agency | https://genai.owasp.org/llmrisk/llm062025-excessive-agency/ | OWASP | 2026-10-23 (registro previo) | Minimizar herramientas y permisos (base de M07; solo puente) | Media | 2027-04-23 |
| src-arxiv-self-correct (existente, no reabierta) | Large Language Models Cannot Self-Correct Reasoning Yet (ICLR 2024) | https://arxiv.org/abs/2310.01798 | Huang et al. (Google DeepMind y otros) | 2026-10-23 (registro previo) | Revisar sin señal externa no mejora de forma fiable (base de M05 L3; solo puente) | Media | 2027-04-23 |
| src-arxiv-impossiblebench (existente, no reabierta) | ImpossibleBench (2025-10-23) | https://arxiv.org/abs/2510.20270 | Zhong, Raghunathan, Carlini | 2026-10-23 (registro previo) | Agentes que «resuelven» tareas imposibles modificando pruebas (base de M05 L3; puente con la compuerta de L5) | Media | 2027-04-23 |
| src-arxiv-metr-productivity (existente, no reabierta) | Measuring the Impact of Early-2025 AI on Experienced Open-Source Developer Productivity (2025, v2) | https://arxiv.org/abs/2507.09089 | METR (Becker, Rush, Barnes, Rein) | 2026-10-23 (registro previo) | Percepción frente a tiempo medido (base de M05 L4; solo puente) | Media | 2027-04-23 |
| src-github-actions-logs (existente, no reabierta) | Using workflow run logs | https://docs.github.com/en/actions/how-tos/monitor-workflows/use-workflow-run-logs | GitHub | 2026-10-22 (registro previo) | Registros por paso, fallidos expandidos, búsqueda y descarga | Media | 2027-04-22 |
| src-python-logging (existente, no reabierta) | Logging HOWTO | https://docs.python.org/3/howto/logging.html | Python Software Foundation | 2026-10-22 (registro previo) | Niveles de registro y cuándo registrar frente a lanzar una excepción (apoyo a la capa de registro de L6) | Baja | 2027-10-22 |
| src-openai-codex-worktrees (existente, no reabierta) | Worktrees (Codex) | https://learn.chatgpt.com/codex/environments/git-worktrees | OpenAI | 2026-10-22 (registro previo) | Worktrees en la app de escritorio (ya en `m04-pc-worktrees`) | Alta | 2027-01-22 |

**Total: 37 fuentes (12 nuevas y 25 reutilizadas, 13 de ellas reabiertas hoy).** Primarias: documentación oficial de Anthropic, OpenAI, GitHub y Git, artículos técnicos de los propios proveedores (src-anthropic-building-agents, src-anthropic-eng-*, primarios sobre sus mediciones, no normativos), dos artículos de investigación (MAST y escalado) y el libro de SRE de Google (primario sobre su práctica). Secundaria o de opinión: src-cognition-dont-build-multi-agents (blog de un proveedor de agentes; contrapunto, no medición).

**Nuevas para `content/sources.json` (12):** src-anthropic-eng-multi-agent-research, src-arxiv-mast-mas-failures, src-arxiv-scaling-agent-systems, src-cognition-dont-build-multi-agents, src-google-sre-cron, src-anthropic-cc-agent-teams, src-openai-codex-subagents, src-anthropic-cc-scheduled-tasks, src-openai-codex-scheduled-tasks, src-github-actions-schedule, src-anthropic-cc-hooks-guide, src-github-copilot-hooks. Ninguna aparece en `content/sources.json` (comprobado el 2026-10-26 contra la lista de IDs).

**Reutilizadas con `supports` que conviene ampliar** al pasar a `content/sources.json` (porque M08 las usa para afirmaciones nuevas): src-anthropic-building-agents (patrones, condiciones de parada, frameworks), src-anthropic-cc-subagents (`maxTurns`, 20 simultáneos, anidamiento), src-anthropic-cc-routines (historial, pausa, identidad, conectores, límites), src-anthropic-cc-headless (`--bare`, códigos, costo), src-anthropic-cc-costs (filas de `/loop`, hooks que filtran), src-anthropic-cc-worktrees (aislamiento, `-p` no limpia), src-openai-codex-noninteractive (separar trabajos, stderr/stdout), src-openai-codex-hooks (eventos, confianza), src-github-cloud-agent (59 min, un repositorio, hooks), src-github-cloud-agent-risks (automatizaciones atribuidas), src-anthropic-eng-context (resumen de 1 000–2 000 tokens).

---

## 7. Huecos (lo que no pude verificar)

1. **Tareas programadas de escritorio de Claude Code.** No abrí su página propia (`/desktop-scheduled-tasks`); los datos de la ficha L4 (máquina encendida, archivos locales, intervalo mínimo de 1 minuto si lo fija Claude y 1 hora en formularios) salen de la tabla comparativa de `src-anthropic-cc-scheduled-tasks`. Verificar estado y detalles antes de publicar la ficha.
2. **Afiliaciones del estudio de escalado** (`src-arxiv-scaling-agent-systems`). La página del resumen no las muestra; un resultado de búsqueda las atribuye a Google Research, Google DeepMind y MIT, y el blog de Google Research lo presenta, pero no abrí el blog ni el PDF. Tampoco verifiqué las cifras finas que circulan en resúmenes (umbral de saturación, factores de amplificación de errores); en la base solo uso las del resumen. Un resumen de búsqueda habla de 180 configuraciones (versión anterior); la v3 dice 260.
3. **Venue de MAST.** La página de arXiv no indica conferencia; no lo afirmo. Las afiliaciones (UC Berkeley) salen de la versión HTML v3. Los porcentajes por grupo (≈44 %, ≈32 %, ≈23,5 %) son suma propia de los modos publicados.
4. **Costo del agente en la nube de Copilot y de Codex Cloud.** Las páginas revisadas no detallan el consumo; no lo afirmo. Si L4 o L6 necesitan comparar costo por superficie, abrir las páginas de facturación (`src-github-copilot-billing-individuals`, `src-openai-codex-pricing`, ambas existentes y no reabiertas).
5. **Eventos de hooks admitidos en el cloud agent de Copilot.** La página dice que solo un subconjunto, sin listarlo; la referencia de hooks, que no abrí, lo tendría. La frase «no suponer que eventos y formatos funcionen igual entre superficies» viene de un fragmento de resultado de búsqueda de la misma documentación, no de una página leída entera.
6. **Codex: valores por defecto de subagentes.** La página no da el valor por defecto de hilos simultáneos ni de profundidad; no lo afirmo.
7. **Codex: códigos de salida de `codex exec`.** No documentados en la página; la ficha lo dice.
8. **Cifra de 7× de equipos de agentes.** La página de costos la condiciona a «compañeros en modo plan»; no encontré una cifra general. No usarla sin esa condición.
9. **Comparación medida entre flujo fijo y agentes para un reporte financiero.** No encontré un estudio primario que compare costo y exactitud de ambos diseños en reportes recurrentes; la recomendación de L1 y del laboratorio se apoya en el principio de empezar simple, en los resultados de multiagente y en el caso sintético (marcada como inferencia donde corresponde).
10. **Magnitud de costo en el giro del laboratorio.** No hay datos reales de tokens del caso; el paso 6 deja la magnitud como dato ficticio a definir por el autor y no debe presentarse como medición.
11. **Reutilizadas sin reabrir.** Doce de las 25 reutilizadas conservan su fecha previa (2026-10-21 a 2026-10-23) y se usan solo como puente a afirmaciones ya verificadas en M03, M05 o M07. Sus datos de registro (URL, organización, fecha) se copiaron de `content/sources.json`.
12. **Página «Run agents in parallel» de Claude Code** (`/agents`), que compara subagentes, worktrees, mensajes entre sesiones y equipos: enlazada desde la página de worktrees, no la abrí. Podría simplificar la tabla de decisión de L3; revisarla antes de redactar.
13. **`/goal` y mensajes entre sesiones** de Claude Code: aparecen enlazados en varias páginas; `/goal` ya está en `m05-pc-verification-gates` y no lo reabrí; los mensajes entre sesiones no los investigué (§4: no evaluables).
14. **Tiempo de las lecciones.** L4 y L5 acumulan muchas opciones de producto. [inferencia] Mantener en el cuerpo solo las cuatro preguntas de L4 y los tres momentos de hook de L5, y mandar todo lo demás a las fichas; si aun así superan 25 minutos, mover el modo headless de L5 a un recuadro, porque M07 L6 ya cubrió su lado de permisos.

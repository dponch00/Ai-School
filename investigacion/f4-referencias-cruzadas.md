# Referencias cruzadas entre manuales

Generado con `python scripts/cross-refs.py`. 110 referencias. La columna «¿Adelante?» marca las que citan un manual igual o posterior al propio (deberían ser avisos de lo que viene, no «como viste»).

| Archivo | Línea | Manual citado | ¿Adelante? | Contexto |
| --- | --: | --- | --- | --- |
| m01-l1 | 36 | 8 | sí | …ipo que los construye recomienda empezar por lo más simple que funcione :cite[src-anthropic-building-agents]. El manual 8 vuelve sobre esta decisión con detalle.… |
| m01-l2 | 44 | 5, 8 | sí | …torio que recibe, que suele ser la del remoto :cite[src-github-copilot-agents] :cite[src-anthropic-cc-cloud]. Los manuales 5 y 8 profundizan en esta elección.… |
| m01-l3 | 32 | 3 | sí | …na nueva con un resumen de lo decidido que seguir acumulando mensajes :cite[src-anthropic-cc-best-practices]. El manual 3 dedica una lección entera a cómo administrar el contexto.… |
| m01-l3 | 46 | 2 | sí | …arte de la tarea, y esa decisión no la toma la herramienta, sino quien escribe la especificación, un tema que el manual 2 desarrolla a fondo.… |
| m01-l4 | 56 | 9 | sí | …-reduce-hallucinations]. La evaluación sistemática, con casos de prueba y comparaciones repetidas, es el tema del manual 9.… |
| m01-l6 | 26 | 9 | sí | …o diario bastan pocos ensayos, por ejemplo tres por herramienta [inferencia]. No es un estudio estadístico, y el manual 9 desarrolla la metodología completa, pero ya permite distinguir un resultado consistente de uno que salió bien… |
| m03-l1 | 24 | 1 |  | …En el manual 1 viste que la ventana de contexto funciona como la memoria de trabajo del modelo. En un agente, esa memoria se… |
| m03-l6 | 18 | 1 |  | …los dos snapshots, el historial del repositorio y las actas de las últimas reuniones. Es mucho material, y en el manual 1 y en la lección 1 viste qué le pasa a un modelo cuando el contexto se satura. Esta lección muestra otra forma… |
| m03-l6 | 28 | 7 | sí | …rramientas y con salidas que pueden ser grandes :cite[src-anthropic-cc-features] :cite[src-anthropic-cc-mcp]. El manual 7 desarrolla esa elección.… |
| m03-l6 | 34 | 1 |  | …e siendo trabajo de quien lee [inferencia]. Lo que ayuda desde el principio son las mitigaciones que viste en el manual 1: permitir que el modelo diga «no tengo información suficiente», pedirle citas textuales antes de responder y… |
| m03-l6 | 40 | 9 | sí | …lo que el agente recupera se trata como un dato que hay que evaluar, nunca como una orden que hay que seguir. El manual 9 desarrolla las defensas.… |
| m04-l2 | 54 | 3 |  | …Los flujos de integración continua de los servicios de repositorios suelen escribirse en YAML, y en el manual 3 viste otro uso: una skill es un archivo `SKILL.md` que empieza con un bloque YAML (los metadatos, con `name`… |
| m05-l1 | 34 | 3 |  | …a como regla y puede perderse al compactar :cite[src-anthropic-cc-permission-modes]. Es lo mismo que viste en el manual 3: lo que tiene que valer siempre no puede vivir solo en la conversación [inferencia].… |
| m05-l1 | 40 | 9 | sí | …omo instrucciones escondidas en una página :cite[src-openai-codex-security] :cite[src-anthropic-cc-security]. El manual 9 desarrolla esas amenazas.… |
| m05-l1 | 57 | 4 |  | …el agente decida hacer dentro del repositorio. Eso se cubre con Git y con la revisión del diff, como viste en el manual 4.… |
| m05-l2 | 30 | 2 |  | …, pero no decide las definiciones del negocio. Si una regla de KPI no está clara, la fija FP&A, como viste en el manual 2 [inferencia].… |
| m05-l2 | 34 | 3 |  | …opic-cc-best-practices] :cite[src-openai-codex-best-practices]. Es el mismo movimiento de aislar que viste en el manual 3, aplicado ahora a la fase de exploración.… |
| m05-l2 | 38 | 2 |  | …de aprobarlo :cite[src-anthropic-cc-permission-modes]. Lo que se revisa es lo mismo que en una especificación del manual 2: qué archivos toca, qué queda fuera, cómo se verifica cada paso y qué no debe cambiar [inferencia].… |
| m05-l3 | 26 | 4 |  | …En el manual 4 aprendiste a exigir evidencia al revisar. Aquí se pide desde el encargo: que el agente muestre el comando que… |
| m05-l3 | 40 | 8 | sí | …ntrol que impide dar la tarea por terminada mientras el check no pase :cite[src-anthropic-cc-best-practices]. El manual 8 vuelve sobre esas compuertas.… |
| m05-l4 | 22 | 4 |  | …ués corrija, y que ataque la causa en lugar de esconder el síntoma :cite[src-anthropic-cc-best-practices]. En el manual 4 aprendiste a leer el error; aquí se trata de usarlo para dirigir al agente.… |
| m05-l4 | 32 | 3 |  | …Son los movimientos del manual 3, aplicados a una depuración [inferencia]:… |
| m05-l4 | 37 | 4 |  | …- **Volver a un punto anterior**, cuando el último tramo empeoró las cosas. Como viste en el manual 4, el checkpoint no cubre lo que se hizo con comandos de terminal y no reemplaza a Git :cite[src-anthropic-cc-c… |
| m05-l5 | 26 | 4 |  | …nes automáticas del proyecto y que el agente revise su propio diff :cite[src-openai-codex-best-practices]. En el manual 4 viste un ejemplo de lo que queda fuera: la regla de vencidas en el día exacto del snapshot, un caso que ningú… |
| m05-l5 | 38 | 4 |  | …ajo) o con los cambios que todavía no se confirmaron :cite[src-openai-codex-best-practices]. Y, como viste en el manual 4, una revisión automática no garantiza encontrarlo todo :cite[src-github-copilot-code-review].… |
| m05-l6 | 40 | 3 |  | …n el repositorio, es decir, la especificación o el plan, el registro de decisiones y el documento de traspaso del manual 3. La conversación que tuviste en una herramienta no pasa a otra [inferencia]. Para un trabajo grande, una guía… |
| m05-l6 | 42 | 4 |  | …La regla del manual 4 sigue valiendo: el agente en la nube no aprueba ni fusiona su propia PR, y quien se la pidió tampoco :cite[sr… |
| m06-l1 | 35 | 2 |  | …corre los checks y escribe el contrato de salida, el archivo con la forma acordada que lee el dashboard y que el manual 2 presentó como `pipeline_kpis`.… |
| m06-l1 | 45 | 4 |  | …ión que la de los números binarios de doble precisión :cite[src-ietf-rfc8259]. Son la misma coma flotante que el manual 4 comparó con los decimales exactos, y por eso los montos se calculan con decimales exactos en el código de cál… |
| m06-l2 | 38 | 2 |  | …Con el contrato de salida pasa algo parecido. El contrato `pipeline_kpis`, que ya conoces del manual 2, exige ciertos campos, enumera los valores válidos de KPI, región, unidad y problema de calidad, y no admite… |
| m06-l3 | 22 | 4 |  | …teresan, el almacén aprovecha eso; si descargas todo para filtrar después, no [inferencia]. Las reglas de SQL del manual 4 siguen valiendo, empezando por que `WHERE` filtra antes de agrupar :cite[src-postgres-tutorial-agg].… |
| m06-l3 | 45 | 5 |  | …ra pruebas y resultados intermedios, y nunca en producción [inferencia]. Es el principio de mínimo privilegio del manual 5, dar solo los permisos que la tarea necesita, aplicado a los datos.… |
| m06-l3 | 53 | 7, 9 | sí | …CRM que llega al agente, como las notas de una oportunidad, es contenido no confiable :cite[src-owasp-llm01]. Los manuales 7 y 9 desarrollan esas defensas.… |
| m06-l5 | 42 | 5 |  | …rle al mismo modelo que revise su propio texto no sirve como check, porque no es independiente: como viste en el manual 5, sin una señal externa la autocorrección no es fiable [inferencia].… |
| m06-l6 | 18 | 4 |  | …En el manual 4 viste un caso inquietante. Un agente cambió `<` por `<=` en la regla de oportunidades vencidas y la reconcili… |
| m06-l6 | 61 | 4 |  | …lose_date < snapshot_date`, esa oportunidad no cuenta como vencida; con `<=`, sí. Si alguien repite el cambio del manual 4, la reconciliación ahora falla, porque las vencidas del Norte pasan de 2 a 3, y las del total, de 6 a 7.… |
| m06-lab | 47 | 2 |  | …Si tienes Python, puedes repetir el paso 2 con los archivos del laboratorio del manual 2. Copia la carpeta de datos a otro lugar y corre `reconcile.py` con el snapshot del 26 (`--snapshot`), el arch… |
| m07-l1 | 60 | 6 |  | …Ninguna de esas cosas produce un error de formato, pero todas cambian la cifra [inferencia]. El manual 6 enseñó qué hacer con cada una: normalizar con una regla declarada, reportar y excluir, o detener el cálculo.… |
| m07-l1 | 64 | 4 |  | …`null`; además, los nombres dentro de un objeto deberían ser únicos :cite[src-ietf-rfc8259]. Ya lo usaste en el manual 4 con archivos de configuración; aquí sirve para leer lo que devuelve un servicio.… |
| m07-l1 | 72 | 6 |  | …llaman o la atienden, y hacer pruebas :cite[src-oas-3-2]. Las herramientas de MCP, el protocolo que viste en el manual 6, hacen algo parecido: cada una declara en JSON Schema los datos que acepta y puede declarar la forma del resu… |
| m07-l1 | 72 | 6 |  | …clarar la forma del resultado que devuelve :cite[src-mcp-spec-tools]. Es la idea del contrato `pipeline_kpis` del manual 6, aplicada a lo que viaja entre dos sistemas.… |
| m07-l1 | 87 | 6 |  | …io de FP&A. La política declarada para las etapas sin probabilidad se aplica en el código de cálculo, como en el manual 6.… |
| m07-l2 | 46 | 4 |  | …no usa ese flujo, sino que toma sus credenciales del entorno :cite[src-mcp-authorization]. Es lo que viste en el manual 4, donde el token iba en una variable de entorno o en un gestor de secretos y nunca en un archivo de configurac… |
| m07-l2 | 56 | 4 |  | …Y si una credencial se expone, lo primero sigue siendo revocarla o rotarla (cambiarla por una nueva), como en el manual 4 :cite[src-owasp-secrets-mgmt].… |
| m07-l4 | 40 | 6 |  | …**Las descripciones las escribe el servidor.** Como viste en el manual 6, las anotaciones de sus herramientas son pistas que no deben guiar decisiones si el servidor no es de confian… |
| m07-l5 | 4 | 6 |  | …exacto y devuelve filas y totales que se pueden repetir. Decide cuál corresponde antes de buscar. Y la regla del manual 6 sigue valiendo: las cifras salen de una consulta o de un cálculo, nunca de un texto recuperado.… |
| m07-l5 | 24 | 9 | sí | …thropic-eng-contextual-retrieval]. Para este manual basta reconocerlas; cómo se evalúa un sistema así es tema del manual 9.… |
| m07-l5 | 28 | 3 |  | …0 páginas, puede bastar con incluirla entera en el prompt :cite[src-anthropic-eng-contextual-retrieval]. Pero el manual 3 mostró que una entrada larga degrada el rendimiento del modelo, así que «cabe» no equivale a «conviene» cuand… |
| m07-l5 | 32 | 4, 6 |  | …La otra vía es preguntar a los datos con un lenguaje exacto: SQL, como en los manuales 4 y 6, o una herramienta con parámetros como región, etapa y fecha. La respuesta son filas y totales que se pueden… |
| m07-l5 | 44 | 3 |  | …Un texto recuperado no se vuelve confiable por venir de los documentos de la empresa. Como viste en el manual 3, puede traer instrucciones escondidas para el modelo (lo que se llama inyección de instrucciones), así que se… |
| m07-l6 | 43 | 9 | sí | …la :cite[src-mcp-spec-tools], y tratar toda respuesta como dato no confiable :cite[src-owasp-mcp-cheatsheet]. El manual 9 desarrolla estas defensas.… |
| m08-l1 | 55 | 7 |  | …- **Respuesta:** enrutamiento, cada tipo de pregunta por su vía, como en el manual 7.… |
| m08-l1 | 64 | 6 |  | …**Convertir los euros cada viernes.** Es una regla fija. Lo hace un script, sin modelo; como viste en el manual 6, un modelo solo agregaría variación.… |
| m08-l2 | 22 | 5 |  | …El manual 5 enseñó las piezas de un encargo de código: qué cambiar, qué no tocar, cómo se comprueba y qué evidencia entre… |
| m08-l2 | 25 | 7 |  | …ientas:** qué puede usar y qué no. Quitar una herramienta es más firme que pedir que no se use, como viste en el manual 7.… |
| m08-l3 | 22 | 3, 5 |  | …Como viste en los manuales 3 y 5, un subagente toma una tarea acotada en un contexto limpio, puede gastar decenas de miles de tokens explorand… |
| m08-l3 | 28 | 4 |  | …El manual 4 presentó los worktrees, carpetas de trabajo adicionales de un mismo repositorio, cada una con su rama y sus a… |
| m08-l4 | 31 | 5 |  | …**En la nube.** Como viste en el manual 5, el trabajo en la nube parte del repositorio remoto, no de la copia de tu computadora :cite[src-anthropic-cc-… |
| m08-l4 | 41 | 7 |  | …ite, y con acceso total el riesgo es elevado :cite[src-openai-codex-scheduled-tasks]. Sigue valiendo la regla del manual 7: lo que pediría aprobación se deniega, o la tarea no tiene la herramienta.… |
| m08-l4 | 43 | 7 |  | …una automatización se atribuye a quien la creó :cite[src-github-cloud-agent-risks]. Pedir lo mínimo, como en el manual 7, vale igual: solo los repositorios, la red y las conexiones del encargo [inferencia].… |
| m08-l4 | 55 | 7 |  | …ible saltarse una ejecución a arriesgarse a lanzarla dos veces :cite[src-google-sre-cron]. Es la idempotencia del manual 7 (que repetir no cambie el efecto) aplicada al calendario.… |
| m08-l5 | 22 | 3 |  | …s ocurren siempre, en lugar de depender de que el modelo decida hacerlas :cite[src-anthropic-cc-hooks-guide]. El manual 3 lo presentó como un control determinista, que actúa igual cada vez, frente a las instrucciones, que solo orie… |
| m08-l5 | 34 | 5 |  | …que solo puede dar FP&A, el agente puede buscar un atajo, como modificar las pruebas, igual que en el estudio del manual 5 :cite[src-arxiv-impossiblebench].… |
| m08-l5 | 38 | 7 |  | …ada hook antes de ejecutarlo :cite[src-openai-codex-hooks]. Una rama ajena puede traer un hook nuevo, como en el manual 7 traía un servidor MCP [inferencia].… |
| m08-l5 | 50 | 7 |  | …ambio, y otro sin la clave del modelo, que abre la PR :cite[src-openai-codex-noninteractive]. Es el principio del manual 7: cada secreto, solo donde se usa.… |
| m08-l6 | 24 | 5 |  | …po hasta el borrador y tiempo de revisión humana [inferencia]. La sensación de ahorro no sirve como medida, y el manual 5 mostró por qué con un estudio en que desarrolladores experimentados trabajaron más lento con IA aunque se cre… |
| m08-l6 | 60 | 9 | sí | …no reemplaza un check determinista [inferencia]. Cómo medir si una versión es más confiable que otra es tema del manual 9.… |
| m09-l1 | 22 | 4, 6 |  | …uno que con la misma entrada da siempre el mismo resultado. Por eso basta con correrlo una vez, como viste en los manuales 4 y 6. Un sistema con modelo, en cambio, puede responder distinto ante la misma entrada, incluso con la temperatura… |
| m09-l1 | 24 | 1 |  | …pruebas propias de cada aplicación :cite[src-openai-eval-best-practices]. Este manual trata de las terceras. El manual 1 ya mostró que un ranking público mide otras tareas, no la tuya.… |
| m09-l1 | 58 | 2, 4 |  | …pasa», eso sigue siendo una afirmación hasta que la transcripción muestre el comando y su salida, como pedían los manuales 2 y 4 [inferencia].… |
| m09-l2 | 52 | 6 |  | …llevan la marca «sintético» en su ficha [inferencia]. Si se generan con código, se anota la semilla, como en el manual 6. Hay que tener presente, además, que un conjunto sintético derivado de datos reales no queda anónimo por el s… |
| m09-l3 | 30 | 1 |  | …ambas :cite[src-anthropic-evals-agents]. Un criterio crítico va siempre en modo binario porque, como viste en el manual 1, no se compensa con los demás [inferencia].… |
| m09-l3 | 71 | 1 |  | …El manual 1 enseñó lo básico de una comparación: la misma tarea, las mismas entradas, la misma rúbrica, varios ensayos, l… |
| m09-l4 | 34 | 6 |  | …ien el problema, y hacer el cálculo con código mejora la exactitud :cite[src-arxiv-pal]. De ahí sale la regla del manual 6: la cifra la calcula el código y el modelo solo la redacta. El problema no es menor. En un banco de preguntas… |
| m09-l4 | 40 | 6 |  | …3. **El contrato coincide con un recálculo independiente.** Es la reconciliación del manual 6, y atrapa el error que ya venía en el contrato, que los dos niveles anteriores dan por bueno.… |
| m09-l4 | 44 | 6 |  | …Del manual 6 ya conoces las reglas de sentido, o invariantes: relaciones que siempre deben cumplirse, como que las regione… |
| m09-l4 | 46 | 2 |  | …Los cuatro contratos de ejemplo del manual 2 se pasaron por 11 reglas de sentido y por `reconcile.py`. Estos son los resultados, obtenidos con un script:… |
| m09-l4 | 61 | 4 |  | …La forma de comparar los montos también cuenta. Como viste en el manual 4, la coma flotante no representa con exactitud muchos números decimales, y para cálculos contables se recomien… |
| m09-l4 | 71 | 3 |  | …El manual 3 mostró que una cita puede apuntar a un pasaje real que no sostiene la frase, y dio cifras de cuánto fallan la… |
| m09-l5 | 22 | 3, 7 |  | …el modelo lee, como una página o un archivo :cite[src-owasp-llm01]. El acta del Sur es un caso de la segunda. Los manuales 3 y 7 ya presentaron la indirecta; esta lección trata de cómo defenderse de las dos.… |
| m09-l5 | 55 | 7 |  | …e el sistema que recibe cada orden compruebe si está autorizada, sin fiarse de lo que diga el modelo, como en el manual 7 :cite[src-owasp-llm06].… |
| m09-l6 | 30 | 5 |  | …externa, el resultado no mejora de forma fiable, y a veces empeora :cite[src-arxiv-self-correct]. Lo viste en el manual 5.… |
| m09-l6 | 60 | 1 |  | …Como viste en el manual 1, la conclusión de una comparación vale para las condiciones en que se hizo. Caduca cuando cambia cualquiera d… |
| m09-l6 | 83 | 4 |  | …Git y el registro se complementan. Git dice qué líneas cambiaron, como viste en el manual 4; el registro dice qué cambió en el comportamiento y con qué evidencia se aceptó [inferencia]. Sin ese registr… |
| m09-lab | 53 | 2 |  | …rader deja pasar errores, escribe cinco respuestas inventadas a una misma pregunta sobre los datos sintéticos del manual 2: una correcta y cuatro con un error distinto cada una (la cifra de otra región, una cifra redondeada, una fue… |
| m10-l1 | 4 | 2 |  | …En el manual 2 aprendiste que una tarea empieza por saber quién va a usar el resultado y qué decisión le ayuda a tomar. Con… |
| m10-l1 | 22 | 2 |  | …sonas, que no estuvieron en esas conversaciones y que van a depender de él [inferencia]. Lo que aprendiste en el manual 2 sigue valiendo: un buen objetivo dice quién va a usar el resultado, para qué decisión y cómo sabrás que está… |
| m10-l1 | 42 | 2 |  | …mar su decisión con los datos verificados [inferencia]. Se escribe igual que el alcance de una especificación del manual 2, en dos listas: lo que entra y lo que queda fuera. Cada exclusión lleva su motivo y lo que haría falta para q… |
| m10-l1 | 62 | 2 |  | …ró [inferencia]. Una vez escritos el alcance y los criterios de éxito, el paso siguiente es el que ya conoces del manual 2: convertirlos en especificaciones para el agente.… |
| m10-l1 | 72 | 7 |  | …idor y saber quién escribe cada nota, y eso es otro proyecto); escribir en el CRM (permisos y riesgo, como en el manual 7); simulador de forecast (nadie lo pidió en las entrevistas); alertas (hasta saber si usan la vista) /… |
| m10-l2 | 67 | 4 |  | …se estropea, se ve en la PR, la solicitud de cambio que una persona revisa antes de aceptarla, como viste en el manual 4. La documentación de una herramienta de pruebas de navegador propone este escaneo y advierte que muchos probl… |
| m10-l2 | 71 | 5 |  | …Como en el manual 5, al agente se le pide evidencia y no una afirmación [inferencia]. Si le pides «hazlo accesible», recibes un r… |
| m10-l3 | 33 | 6 |  | …Los datos de referencia siguen la regla del manual 6: la cifra viene del contrato de KPI verificado (`kpis.json`), y la interfaz la muestra sin recalcularla [infe… |
| m10-l3 | 58 | 6 |  | …e fuerza un fallo para ver que la versión anterior queda intacta. Es el mismo principio que la reconciliación del manual 6, aplicado a los datos del usuario.… |
| m10-l3 | 66 | 4 |  | …l [inferencia]. Por eso la versión 1 guarda solo lo que hace falta para la decisión. Y por la misma razón que el manual 4 dejaba los secretos fuera del repositorio, nada secreto puede viajar en los archivos que el navegador descarg… |
| m10-l4 | 22 | 6 |  | …Como viste en el manual 6, una app que se publica como sitio estático es un conjunto de archivos. El servidor se limita a entregarlos,… |
| m10-l4 | 28 | 4 |  | …las pruebas, `reconcile.py` sobre el `kpis.json` y el escaneo de accesibilidad de la lección 2. Como viste en el manual 4, un check que se omite cuenta como éxito, así que el paso de pruebas no puede ser opcional :cite[src-github-s… |
| m10-l4 | 50 | 3 |  | …r sus términos y sus límites. Elegirlo es una decisión que se anota en el registro de decisiones que viste en el manual 3, y que se revisa cada cierto tiempo [inferencia].… |
| m10-l5 | 35 | 3 |  | …n la mantiene necesita el README, el runbook de la lección 4 y dos registros que ya conoces, el de decisiones del manual 3 y el de cambios del manual 9.… |
| m10-l5 | 35 | 9 |  | …DME, el runbook de la lección 4 y dos registros que ya conoces, el de decisiones del manual 3 y el de cambios del manual 9.… |
| m10-l5 | 39 | 3 |  | …El registro de decisiones no cambia de forma. El manual 3 lo usó para el trabajo con agentes, y aquí guarda las decisiones de producto, como qué hosting se eligió o qu… |
| m10-l5 | 61 | 2, 4 |  | …Los manuales 2 y 4 ya mostraron que «el agente dice que todo pasa» no es evidencia. Aquí esa idea se aplica a la entrega complet… |
| m10-l5 | 61 | 9 |  | …y la revisión manual, el resultado de la regresión y los hallazgos de la revisión independiente que viste en el manual 9, con el estado de cada uno. Cierra con la versión publicada y la fecha de los datos.… |
| m10-l5 | 67 | 4 |  | …El manual 4 enseñó a comprobar que una dependencia exista y sea la que crees. Cuando un agente propone una nueva, a esa c… |
| m10-l6 | 26 | 3 |  | …El manual 3 enseñó que las instrucciones se versionan, se revisan y se podan, y que la activación de una skill se prueba… |
| m10-l6 | 30 | 9 |  | …kill o en el archivo de instrucciones es un cambio de comportamiento. Dispara sus evaluaciones y la regresión del manual 9, y pasa por una PR igual que el código [inferencia].… |
| m10-l6 | 34 | 9 |  | …e la fecha y advierte que las peticiones a un modelo retirado fallan :cite[src-anthropic-model-deprecations]. El manual 9 mostró que cambiar de modelo obliga a volver a evaluar. Lo que se suma ahora es que la fecha de retiro del mo… |
| m10-l6 | 57 | 9 |  | …La tabla es una síntesis de este manual y del manual 9 [inferencia]. En todos los casos revisa alguien distinto de quien encargó el cambio, como enseñó el manual 4.… |
| m10-l6 | 57 | 4 |  | …del manual 9 [inferencia]. En todos los casos revisa alguien distinto de quien encargó el cambio, como enseñó el manual 4.… |
| m10-l6 | 75 | 9 |  | …El manual 9 enseñó cómo se hace una revisión independiente. Aquí la pregunta es qué hacer con lo que encuentra. Un hallaz… |

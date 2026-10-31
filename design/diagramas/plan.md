# Plan de diagramas explicativos

> Escrito por Claude Code el 2026-10-30, a pedido de Daniel, que quiere «suficientes» diagramas como el de M01 L5 (`m01-l5-chat-api.svg`). El estilo está en [`estilo.md`](estilo.md).

## Cómo se trabaja

1. **Codex diseña** los SVG de un lote siguiendo `estilo.md` y estos briefs. Lee el apartado de cada diagrama y toma de él los rótulos.
2. **Claude revisa** que cada diagrama sea exacto, tenga valor pedagógico y que su texto alternativo describa lo mismo. Lo corrige, lo integra (`::figure` en la lección y la entrada en `assets.json`), corre las pruebas y publica.
3. **En el ticket del lote siguiente, Codex revisa lo que Claude integró del anterior.** Así ninguno de los dos es el único revisor de su propio trabajo.

**Criterio de selección.** Va un diagrama donde la lección describe una de estas cosas:
- una estructura (capas o piezas);
- un flujo (pasos, ida y vuelta);
- una comparación entre dos o tres vías;
- una decisión con ramas.

Cuando la idea ya se entiende con el texto o con una tabla de la lección, no va diagrama. Hay como máximo uno por lección, salvo excepciones justificadas.

Ya existen cinco figuras, que no se rehacen:
- dos diagramas SVG: `m01-l5-chat-api` y `m02-spec-anatomy`;
- tres ilustraciones de T-053: `m03-context-frame`, `m08-parallel-merge` y `m09-defense-layers`.

## Los diagramas

Cada fila lleva el identificador del activo (archivo `content/courses/mNN/diagrams/<id>.svg`), el apartado donde va (`lección#ancla`) y qué tiene que mostrar.

### Lote 1 · M01 y M02 (T-058)

| ID | Va en | Pregunta que responde | Qué muestra |
| --- | --- | --- | --- |
| `m01-l1-cinco-capas` | m01-l1#entorno | ¿Por qué la misma IA da resultados distintos? | Las cinco capas anidadas: modelo, agente (modelo + herramientas + bucle), producto, superficie y entorno de ejecución, y qué aporta cada una |
| `m01-l2-elegir-herramienta` | m01-l2#cuatro-preguntas | ¿Qué herramienta para qué tarea? | Las cuatro preguntas de la lección como un árbol que termina en conversar, investigar, documentos y datos con código, o agente |
| `m01-l3-ventana-contexto` | m01-l3#contexto | ¿Qué llena la memoria de trabajo? | La ventana como una caja con capas (instrucciones, historial, archivos leídos, respuesta) y el límite. Al pie, «más no es mejor» (#mas-contexto) |
| `m01-l4-tres-verificaciones` | m01-l4#verificar | ¿Cómo se verifica cada tipo de afirmación? | Los tres tipos de afirmación de la lección, cada uno con su forma de verificar |
| `m01-l5-local-nube` | m01-l5#local-nube | ¿Dónde se procesan mis datos? | Las tres situaciones apiladas (agente local con modelo remoto, sesión en la nube, modelo de pesos abiertos local) y qué sale de tu equipo en cada una |
| `m01-l6-comparar` | m01-l6#criterio-critico | ¿Cómo se compara bien? | La misma tarea, varios ensayos por herramienta y un criterio crítico que descalifica aunque el puntaje promedio sea alto |
| `m02-l1-objetivo` | m02-l1#anatomia | ¿Qué tiene un buen objetivo? | Quién, para qué, cuándo y con qué criterio, aplicado al caso de la lección |
| `m02-l2-reglas-donde` | m02-l2#capas | ¿Dónde va cada regla? | Las reglas del proyecto en un archivo y las de la tarea en el prompt, y cómo llegan las dos al agente |
| `m02-l3-forma-verdad` | m02-l3#forma-verdad | ¿Qué comprueba un contrato y qué no? | La salida pasa por dos filtros: el contrato (forma), que deja pasar un JSON válido con una cifra errónea, y la comprobación de sentido (verdad) |
| `m02-l5-hitos` | m02-l5#hitos | ¿Cómo se avanza sin acumular errores? | Hitos en fila, cada uno con su comprobación, y un ciclo corto que vuelve al hito donde nació el error (#origen) |
| `m02-l6-criterio-evidencia` | m02-l6#ejecutable | ¿Cómo un criterio se vuelve evidencia? | La cadena criterio específico → resultado observable → comprobación ejecutable → evidencia, con el ejemplo de la lección |

### Lote 2 · M03 y M04

| ID | Va en | Pregunta | Qué muestra |
| --- | --- | --- | --- |
| `m03-l2-capas-precedencia` | m03-l2#capas | ¿Qué instrucción gana? | Las capas de instrucciones con su precedencia, y que precedencia no es anulación |
| `m03-l3-cuatro-preguntas` | m03-l3#cuatro-preguntas | ¿En qué capa va cada pieza? | Las cuatro preguntas como un árbol que termina en la capa adecuada |
| `m03-l4-carga-progresiva` | m03-l4#carga-progresiva | ¿Por qué una skill ocupa poco? | Lo que se carga siempre (nombre y descripción), lo que se carga al activarse (el cuerpo) y lo que se carga al pedirlo (los archivos) |
| `m03-l5-continuidad` | m03-l5#artefactos | ¿Qué sobrevive del viernes al lunes? | Una sesión que termina y otra que empieza sin memoria, unidas solo por los artefactos escritos |
| `m03-l6-justo-a-tiempo` | m03-l6#justo-a-tiempo | ¿Precargar o recuperar? | Las dos estrategias apiladas, con lo que ocupa cada una en el contexto |
| `m04-l1-caja-funcion` | m04-l1#frontera | ¿Qué cambia un solo carácter? | La función como caja con sus entradas, la condición `<` frente a `<=` y la salida distinta en el valor límite |
| `m04-l3-defensas-secretos` | m04-l3#defensas | ¿Dónde se detiene un secreto? | Las defensas antes del commit y después del commit en una línea de tiempo |
| `m04-l4-tres-lugares` | m04-l4#estados | ¿Dónde está cada cambio en Git? | Los tres lugares (carpeta, preparación, commit) y las tres formas de deshacer (#deshacer) |
| `m04-l5-traceback` | m04-l5#traceback | ¿Cómo se lee un error? | Un traceback de ejemplo con el orden de lectura de abajo hacia arriba |

### Lote 3 · M05 y M06

| ID | Va en | Pregunta | Qué muestra |
| --- | --- | --- | --- |
| `m05-l1-tres-capas` | m05-l1#capas | ¿Qué limita a un agente? | Permisos, sandbox y red como tres capas distintas, cada una con lo que controla |
| `m05-l3-cuatro-piezas` | m05-l3#piezas | ¿Qué lleva un encargo acotado? | Las cuatro piezas del encargo |
| `m05-l4-depurar` | m05-l4#parar | ¿Cómo se depura sin perderse? | El ciclo reproducir → hipótesis → corregir → verificar, con la salida «parar a tiempo» |
| `m05-l6-nube-remoto` | m05-l6#remoto | ¿Qué ve la sesión en la nube? | La carpeta local, el remoto y la sesión en la nube, que copia el remoto y no la carpeta |
| `m06-l1-cuatro-capas` | m06-l1#capas | ¿Dónde ocurre cada operación? | Las cuatro capas y la responsabilidad de cada una, con el error del caso marcado |
| `m06-l2-raw-contrato` | m06-l2#capas | ¿Qué pasa con un dato desde que llega? | Conservar, limpiar, agregar, con el contrato como filtro y las tres respuestas ante una violación (#respuestas) |
| `m06-l5-tres-salidas` | m06-l5#determinista | ¿Qué clase de salida es? | Determinista, estadística y generativa, comparadas por lo que se puede esperar de cada una |
| `m06-l6-reconciliar` | m06-l6#independencia | ¿Cómo se comprueba una cifra? | Dos caminos independientes desde los mismos datos que se comparan al final |

### Lote 4 · M07 y M08

| ID | Va en | Pregunta | Qué muestra |
| --- | --- | --- | --- |
| `m07-l1-peticion-respuesta` | m07-l1#peticion | ¿Qué hay en una petición? | Las cinco piezas de la lección: método, URL, cabeceras, código de estado y cuerpo, entre cliente y servidor |
| `m07-l2-oauth` | m07-l2#oauth | ¿Cómo entra una app sin tu contraseña? | El flujo con el token y sus alcances, en lugar de la contraseña |
| `m07-l3-reintentos` | m07-l3#clave | ¿Cómo se reintenta sin duplicar? | Una petición que falla, la espera creciente y la clave de idempotencia que evita un segundo efecto |
| `m07-l4-mcp` | m07-l4#arquitectura | ¿Quién habla con quién en MCP? | Anfitrión, cliente y servidor, y dónde está la confianza |
| `m07-l5-rag-consulta` | m07-l5#consulta | ¿Documentos o datos? | La misma pregunta por dos vías: RAG para texto y consulta estructurada para cifras |
| `m08-l1-flujo-agente` | m08-l1#flujo-agente | ¿Quién decide el siguiente paso? | Un flujo fijo, donde decide el código, frente a un agente, donde decide el modelo, con los patrones intermedios (#patrones) |
| `m08-l2-delegar` | m08-l2#piezas | ¿Qué lleva una delegación? | Las cuatro piezas y la condición de término |
| `m08-l4-cuatro-preguntas` | m08-l4#preguntas | ¿Nube, segundo plano o tarea programada? | Las cuatro preguntas como un árbol con las opciones de la lección |
| `m08-l5-momentos-hook` | m08-l5#momentos | ¿Cuándo actúa un hook? | Los tres momentos en el ciclo del agente |

### Lote 5 · M09 y M10

| ID | Va en | Pregunta | Qué muestra |
| --- | --- | --- | --- |
| `m09-l1-pass-k` | m09-l1#metricas | ¿Qué miden pass@k y pass^k? | Un caso con varios ensayos y cómo cuenta cada métrica |
| `m09-l2-mapa-casos` | m09-l2#mapa | ¿Qué cubre el conjunto de prueba? | Los casos normales, límite y adversariales, y el fallo real que se vuelve caso de regresión |
| `m09-l3-graders` | m09-l3#orden | ¿Qué grader usar? | Código primero, después un juez calibrado y después una persona, con lo que conviene a cada uno |
| `m10-l3-clases-dato` | m10-l3#clases | ¿Dónde vive cada dato? | Las cuatro clases de dato y dónde se guarda cada una |
| `m10-l4-cadena` | m10-l4#cadena | ¿Qué impide publicar algo roto? | Construcción con pruebas → despliegue, el corte si una prueba falla y la vuelta a la versión anterior |
| `m10-l6-disparadores` | m10-l6#disparadores | ¿Qué cambio dispara qué prueba? | Los cambios típicos a la izquierda y las pruebas que dispara cada uno a la derecha |

**Total: 43 diagramas nuevos,** en cinco lotes.

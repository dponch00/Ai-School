# T-057 — Términos faltantes del glosario

- **Revisor:** Codex
- **Fecha:** 2026-10-30
- **Método:** lectura de las 60 lecciones y los diez laboratorios, comparación con los diez `content/glossary/mNN.json` y con las 260 marcas `:term`. Se priorizó un concepto si la lección lo define o decide, reaparece fuera de esa explicación, o es necesario para una pregunta/caso. No se proponen nombres de productos, sinónimos del glosario actual ni palabras que se entienden por contexto.
- **Resultado:** 60 candidatos. Cada `refs` propuesto existe; los usos son los primeros lugares útiles para una marca, no una orden de marcar todas las repeticiones.

## Candidatos nuevos

### M01 · Herramientas y límites

| ID propuesto | Término / en | Dueño y refs | Dónde se usa sin explicarse | Borrador de definición | Prioridad |
| --- | --- | --- | --- | --- | --- |
| `g-arnes` | Arnés / *harness* | M01; `m01-l1#agente` | M03 L5, M08 L5 y laboratorios que hablan del arnés | Programa que rodea al modelo y le aporta herramientas, permisos, contexto y el bucle de trabajo. El modelo decide los pasos dentro de ese marco; el arnés decide qué puede alcanzar. | Alta |
| `g-flujo-fijo` | Flujo fijo / *workflow* | M01; `m01-l1#agente`, `m08-l1#flujo-agente` | M08 L1, L2 y M10 L6 | Secuencia de pasos que el código deja decidida de antemano. A diferencia de un agente, no elige en cada paso qué herramienta usar ni qué hacer después. | Alta |
| `g-conector` | Conector / *connector* | M01; `m01-l1#producto-superficie` | M01 L3, M07 L6, M08 L4 | Enlace configurado entre una herramienta y otro servicio, como correo, archivos o datos. Amplía lo que puede alcanzar el agente y por eso se revisan sus permisos y datos. | Media |
| `g-contenedor` | Contenedor / *container* | M01; `m01-l1#entorno` | M05 L1 y M08 L4 | Espacio aislado donde corre un programa con límites propios de archivos, red y dependencias. Que un agente corra en un contenedor no le da por sí solo acceso a todo ni vuelve seguro lo que haga dentro. | Alta |
| `g-latencia` | Latencia / *latency* | M01; `m01-l5#palancas` | M01 L5, M07 L3 y M08 L6 | Tiempo que tarda una solicitud en empezar a responder o terminar. Es una palanca distinta de calidad, costo y privacidad, y se mide en la tarea real antes de elegir configuración. | Media |
| `g-procesamiento-lotes` | Procesamiento por lotes / *batch processing* | M01; `m01-l5#pago` | M01 L5 y laboratorios con trabajos repetidos | Forma de enviar muchos trabajos para que se procesen después, no al instante. Sirve cuando el volumen es repetido y no urgente, y puede reducir el costo a cambio de esperar. | Media |
| `g-cache-prompts` | Caché de prompts / *prompt caching* | M01; `m01-l5#pago` | M01 L5, M03 L1 y L6 | Mecanismo que reaprovecha una parte repetida de las instrucciones o el contexto entre solicitudes. Abarata repetir contenido, pero no corrige una mala selección de contexto ni cambia los datos que el modelo recibe. | Media |
| `g-criterio-critico` | Criterio crítico / *critical criterion* | M01; `m01-l6#criterio-critico` | M01 laboratorio, M09 L3 y L4 | Condición que debe cumplirse en todos los ensayos y no se compensa con puntos de otros criterios. Cuando se puede, se comprueba con código porque un buen tono no compensa una cifra incorrecta. | Alta |

### M02 · Especificar y verificar

| ID propuesto | Término / en | Dueño y refs | Dónde se usa sin explicarse | Borrador de definición | Prioridad |
| --- | --- | --- | --- | --- | --- |
| `g-regla-negocio` | Regla de negocio / *business rule* | M02; `m02-l2#calculos`, `m02-l4#archivos` | M04 L1, M06 L1–L2 y M10 L1 | Decisión sobre cómo se interpreta o calcula algo del negocio, por ejemplo qué oportunidad cuenta como abierta. Se declara fuera del modelo y se aplica con código para que pueda comprobarse. | Alta |
| `g-registro-supuestos` | Registro de supuestos / *assumption register* | M02; `m02-l2#supuestos` | M02 laboratorio, M03 L5 y M06 L6 | Lista con cada definición aún no resuelta o decisión adoptada, su identificador, dueño, estado y efecto. Evita que una ambigüedad que cambia cifras quede escondida en la conversación. | Alta |
| `g-brief` | Brief | M02; `m02-l4#autocontenida` | M02 laboratorio, M03 L5 y M10 L1 | Documento breve que reúne el objetivo, alcance, definiciones y condiciones de una tarea antes de pedir ejecución. Da al agente una versión estable de lo acordado sin depender del historial del chat. | Alta |
| `g-requisito` | Requisito / *requirement* | M02; `m02-l1#objetivo`, `m02-l6#testable` | M03 L3, M05 L3 y M10 L1 | Necesidad o condición que el trabajo debe satisfacer para una persona o decisión. Se vuelve útil cuando se concreta en algo observable y comprobable, no cuando queda como un adjetivo vago. | Alta |
| `g-estado-interno` | Estado interno / *internal state* | M02; `m02-l6#observables` | M04 L5, M08 L6 y M10 L3 | Información o cambio que ocurre dentro de un sistema y que quien usa la herramienta no ve directamente. No basta como criterio de aceptación: se pide además el resultado observable que produce. | Media |

### M03 · Contexto e instrucciones

| ID propuesto | Término / en | Dueño y refs | Dónde se usa sin explicarse | Borrador de definición | Prioridad |
| --- | --- | --- | --- | --- | --- |
| `g-instruccion-sistema` | Instrucción del sistema / *system instruction* | M03; `m03-l1#que-ocupa`, `m03-l2#capas` | M03 L3, M07 L6 y M10 L6 | Instrucción que la herramienta pone alrededor de una conversación y que forma parte del contexto del modelo. Tiene una precedencia propia, pero no sustituye un permiso o control técnico. | Alta |
| `g-regla-rutas` | Regla por rutas / *path rule* | M03; `m03-l3#cuatro-preguntas` | M03 L3, M04 L3 y M10 L6 | Instrucción asociada solo a ciertas carpetas o tipos de archivo, que se carga cuando el agente los toca. Mantiene fuera de la instrucción permanente las reglas que no aplican a todo el proyecto. | Media |
| `g-configuracion-proyecto` | Configuración del proyecto / *project configuration* | M03; `m03-l3#inventario`, `m03-l2#compartido` | M04 L2–L3, M07 L4 y M08 L5 | Archivos declarativos que fijan cómo se construye, prueba o conecta un proyecto. Son comportamiento del sistema y se revisan como código, aunque no parezcan un programa. | Alta |
| `g-artefacto-trabajo` | Artefacto de trabajo / *work artifact* | M03; `m03-l5#artefactos` | M05 L6, M08 L2 y M10 L5 | Archivo o registro que conserva fuera del chat el estado útil para continuar: progreso, decisiones, commits, lista de funciones o rutina de arranque. Su finalidad es que otra sesión pueda verificar y retomar. | Media |
| `g-metadatos` | Metadatos / *metadata* | M03; `m03-l4#que-es`, `m03-l4#descripcion` | M06 L4, M07 L3 y M10 L5 | Datos que describen a otro archivo, recurso o skill, como nombre, descripción, tipo o fecha. En una skill ayudan a encontrarla y validarla antes de cargar su contenido. | Media |
| `g-fuente-primaria` | Fuente primaria / *primary source* | M03; `m03-l6#citas` | M01 L4, M07 L5 y M09 L4 | Documento publicado por quien produjo la norma, dato, estudio o producto que se afirma. Es el primer lugar para comprobar una afirmación técnica antes de depender de un resumen de terceros. | Alta |

### M04 · Código, configuración y Git

| ID propuesto | Término / en | Dueño y refs | Dónde se usa sin explicarse | Borrador de definición | Prioridad |
| --- | --- | --- | --- | --- | --- |
| `g-funcion` | Función / *function* | M04; `m04-l1#caja` | M04 L5, M05 L3–L4 y M06 L1 | Pieza de código que recibe entradas, aplica reglas y devuelve una salida o señala un problema. Para revisarla se sigue qué entra, qué condición cambia el camino y qué resultado deja. | Alta |
| `g-parametro` | Parámetro / *parameter* | M04; `m04-l1#caja` | M04 L1, M07 L1 y M07 L5 | Dato que quien llama entrega a una función, solicitud o herramienta para indicar qué debe hacer. Cambiarlo puede cambiar el resultado aunque el cuerpo del código no se modifique. | Alta |
| `g-valor-por-defecto` | Valor por defecto / *default value* | M04; `m04-l1#otras-salidas` | M01 L6, M03 L4 y M07 L2 | Valor que se usa cuando quien llama no proporciona uno. Es comportamiento: modificarlo afecta todas las llamadas que lo omiten y puede cambiar resultados fuera del diff visible. | Alta |
| `g-decimal-exacto` | Decimal exacto / *decimal* | M04; `m04-l1#dinero` | M06 L1, M09 L4 y laboratorios financieros | Forma de representar montos decimales sin los redondeos invisibles de la coma flotante. Se usa en cálculos contables y se redondea para mostrar, no para alterar la regla de cálculo. | Alta |
| `g-variable-entorno` | Variable de entorno / *environment variable* | M04; `m04-l3#variables` | M01 L5, M05 L6, M07 L6 y M10 L3 | Valor que el sistema entrega a un programa al ejecutarlo, por ejemplo una configuración o una credencial. Reduce que un secreto quede escrito en el repositorio, pero no es una caja fuerte ni debe llegar al navegador. | Alta |
| `g-gestor-secretos` | Gestor de secretos / *secrets manager* | M04; `m04-l3#variables`, `m04-l3#defensas` | M01 L5, M05 L6 y M07 L2 | Servicio que guarda credenciales y las entrega solo al proceso autorizado. Permite rotar o retirar secretos sin dejarlos en archivos de código, historial o registros. | Alta |
| `g-traceback` | Traza de error / *traceback* | M04; `m04-l5#traceback` | M05 L4, laboratorios M04 y M05 | Recorrido de llamadas que muestra un programa cuando una excepción no se captura. Se lee desde la última línea, que dice qué falló, hacia el primer archivo del proyecto que participó. | Alta |

### M05 · Encargos y controles

| ID propuesto | Término / en | Dueño y refs | Dónde se usa sin explicarse | Borrador de definición | Prioridad |
| --- | --- | --- | --- | --- | --- |
| `g-lista-permitidos` | Lista de permitidos / *allowlist* | M05; `m05-l1#red` | M05 L1, M07 L2 y M08 L4 | Lista explícita de dominios, herramientas o acciones que un entorno puede usar. Empezar vacía limita el alcance; agregar algo es una decisión revisable, no una suposición del agente. | Alta |
| `g-causa-raiz` | Causa raíz / *root cause* | M05; `m05-l4#reproducir`, `m05-l4#movimientos` | M04 L5, M05 laboratorio y M09 L4 | Razón que origina un fallo, distinta del síntoma que se ve. Corregirla requiere reproducir el problema y evita esconderlo con un parche que solo hace pasar una prueba. | Alta |
| `g-prueba-trampa` | Prueba que pasa por la razón equivocada | M05; `m05-l3#trampa` | M05 L3, M05 L5 y M09 L4 | Comprobación que termina en verde aunque el comportamiento pedido siga mal, porque no cubre la regla relevante o permite un atajo. Se detecta revisando qué casos contiene y añadiendo contraejemplos. | Alta |
| `g-entorno-remoto` | Entorno remoto / *remote environment* | M05; `m05-l6#remoto`, `m05-l6#entorno-remoto` | M01 L1, M05 laboratorio y M08 L4 | Máquina o sesión fuera de la computadora local que trabaja con su propia copia del repositorio, red y secretos. No ve archivos ni cambios locales que no le fueron entregados. | Alta |

### M06 · Datos y cálculos

| ID propuesto | Término / en | Dueño y refs | Dónde se usa sin explicarse | Borrador de definición | Prioridad |
| --- | --- | --- | --- | --- | --- |
| `g-snapshot-datos` | Snapshot de datos / *snapshot* | M06; `m06-l2#caso`, `m06-l6#trazabilidad` | M01 L2 y L6; M02 laboratorio; M07–M09 | Copia de los datos en una fecha de corte concreta. Permite repetir un cálculo y saber qué información existía al decidir; no se reemplaza silenciosamente por datos más recientes. | Alta |
| `g-limpieza-datos` | Limpieza de datos / *data cleaning* | M06; `m06-l2#capas` | M02 laboratorio, M06 L2 y L6 | Transformación declarada que normaliza o corrige datos antes de calcular. Debe conservar el RAW, documentar la regla y reportar los problemas en vez de arreglar filas a mano. | Alta |
| `g-agregacion` | Agregación / *aggregation* | M06; `m06-l2#capas`, `m06-l3#granularidad` | M04 L2, M06 L1–L4 y M07 L5 | Operación que resume filas detalladas en una cifra, grupo o total, por ejemplo el pipeline por región. Su significado depende de la granularidad, los filtros y la política de duplicados. | Alta |
| `g-validacion-datos` | Validación de datos / *data validation* | M06; `m06-l1#validacion`, `m06-l2#contrato` | M02 L3 y L6, M07 L1 y M09 L4 | Comprobación de que datos o una respuesta respetan la forma y reglas esperadas antes de usarlos. Valida tipos, campos y límites; no convierte por sí sola un valor plausible en verdadero. | Alta |
| `g-solo-lectura` | Solo lectura / *read-only* | M06; `m06-l3#modo`, `m06-l3#anotaciones` | M05 L1, M07 L5–L6, M08 L4 y M09 L5 | Permiso que permite consultar sin cambiar el recurso de destino. Reduce el daño posible, pero no basta si los datos expuestos son sensibles o si la herramienta puede llamar a otra con más privilegios. | Alta |
| `g-metadatos-parquet` | Metadatos de archivo / *file metadata* | M06; `m06-l4#formatos` | M03 L4, M06 L4 y M10 L3 | Información que acompaña a un archivo y describe sus columnas, tipos u organización. En Parquet ayuda al motor a entender y omitir partes; CSV guarda texto separado y no conserva esos tipos. | Media |
| `g-mediana` | Mediana / *median* | M06; `m06-l5#estadistico` | M06 L5 y preguntas del curso | Valor que queda en medio al ordenar los datos. Frente a la media, cambia menos cuando uno o pocos montos son extremos; no decide por sí solo si un dato es un error. | Media |

### M07 · APIs, seguridad e integración

| ID propuesto | Término / en | Dueño y refs | Dónde se usa sin explicarse | Borrador de definición | Prioridad |
| --- | --- | --- | --- | --- | --- |
| `g-metodo-http` | Método HTTP / *HTTP method* | M07; `m07-l1#metodos` | M01 L5, M07 L1 y L4 | Palabra de una petición que declara la intención sobre un recurso, como leer o crear. El servidor decide qué métodos admite; cambiar el método no es una forma de saltarse permisos. | Alta |
| `g-cabecera-http` | Cabecera HTTP / *HTTP header* | M07; `m07-l1#peticion`, `m07-l2#portador` | M04 L3, M07 L1–L3 y laboratorios | Parte de una petición o respuesta que lleva datos de protocolo, como autorización o tipo de contenido. No se usa para esconder secretos: puede registrarse según cómo esté configurado el sistema. | Alta |
| `g-cuerpo-peticion` | Cuerpo de la petición / *request body* | M07; `m07-l1#peticion`, `m07-l1#json` | M01 L5, M07 L1 y L6 | Parte de una petición que contiene los datos que se envían al servicio, normalmente con una estructura como JSON. Se valida contra el contrato antes de que una acción use sus valores. | Alta |
| `g-token-portador` | Token portador / *bearer token* | M07; `m07-l2#portador` | M04 L3, M07 L2 y L6 | Credencial que da acceso a quien la presente, sin comprobar quién la sostiene. Por eso no va en URL, registros ni cliente, y se limita por alcance y duración. | Alta |
| `g-limite-tasa` | Límite de tasa / *rate limit* | M07; `m07-l3#limites` | M07 L3, M08 L6 y laboratorios | Restricción de cuántas solicitudes acepta un servicio en un periodo. Protege al servicio y a quien llama; al alcanzarlo se espera según la indicación del servidor en lugar de reintentar sin control. | Alta |
| `g-tiempo-agotado` | Tiempo agotado / *timeout* | M07; `m07-l3#espera`, `m07-l3#herramientas` | M07 L3, M07 L6 y M08 L6 | Fallo que ocurre cuando una petición o herramienta no termina dentro del tiempo permitido. No demuestra que nada haya pasado: antes de repetir una acción con efecto se considera la idempotencia. | Alta |
| `g-transporte-stdio` | Transporte por entrada/salida estándar / *stdio* | M07; `m07-l4#transportes` | M04 L5, M07 L4 y fichas MCP | Forma de conectar un cliente y un servidor local como subproceso: se intercambian mensajes por la entrada y salida de texto. El cliente lo arranca y comparte los permisos de ese entorno. | Media |
| `g-consulta-estructurada` | Consulta estructurada / *structured query* | M07; `m07-l5#consulta` | M06 L3–L4, M07 L5 y laboratorio M07 | Petición con lenguaje y parámetros definidos que devuelve filas o totales repetibles desde los datos. Se usa para cifras; una explicación basada en documentos recuperados no sustituye su cálculo. | Alta |

### M08 · Automatización

| ID propuesto | Término / en | Dueño y refs | Dónde se usa sin explicarse | Borrador de definición | Prioridad |
| --- | --- | --- | --- | --- | --- |
| `g-segundo-plano` | Ejecución en segundo plano / *background execution* | M08; `m08-l4#opciones` | M07 L6, M08 L4–L6 | Trabajo que sigue sin una conversación o persona mirando la pantalla. Exige un encargo autocontenido, permisos mínimos, registro y un resultado que indique claramente éxito, fallo o parcial. | Alta |
| `g-cron` | Programación cron / *cron scheduling* | M08; `m08-l4#hora` | M08 L4 y laboratorios M07–M08 | Regla de calendario que intenta lanzar una tarea en momentos indicados. No garantiza puntualidad ni una sola ejecución, por lo que se diseña para retrasos, omisiones o repeticiones. | Media |
| `g-registro-ejecucion` | Registro de ejecución / *run log* | M08; `m08-l6#estado`, `m08-l6#fallos` | M07 L6, M08 L6 y M09 L4 | Evidencia de lo que hizo una corrida: pasos, entradas, salidas, herramientas y fallos. Es distinto del estado final; «terminó» no prueba que el resultado sea correcto. | Alta |
| `g-resultado-parcial` | Resultado parcial / *partial result* | M08; `m08-l2#termino`, `m08-l6#detener` | M08 L2, L6 y M10 L5 | Salida que se entrega marcada como incompleta porque se alcanzó un límite, faltó evidencia o una parte falló. No se presenta como éxito ni se usa como si contuviera el resultado total. | Alta |

### M09 · Evaluar y defender

| ID propuesto | Término / en | Dueño y refs | Dónde se usa sin explicarse | Borrador de definición | Prioridad |
| --- | --- | --- | --- | --- | --- |
| `g-rubrica` | Rúbrica / *rubric* | M09; `m09-l3#rubrica` | M01 L6, M09 L3–L6 y M10 L5 | Conjunto explícito de criterios y reglas con que se califica una salida. Debe decir qué observa cada criterio y qué casos no admite, para que persona, código o juez apliquen la misma regla. | Alta |
| `g-conjunto-prueba` | Conjunto de prueba / *test set* | M09; `m09-l2#mapa`, `m09-l2#contaminacion` | M05 L5, M09 L1–L6 y M10 L6 | Colección de casos con entradas y respuestas o criterios esperados usada para medir un sistema. Se reserva de quien ajusta el sistema para que sus resultados sigan siendo una señal honesta. | Alta |
| `g-falso-positivo` | Falso positivo / *false positive* | M09; `m09-l3#calibrar`, `m09-l4#grader-falla` | M09 L3–L4 y laboratorio M09 | Caso que un grader marca como correcto o problemático cuando no lo es, según el criterio real. Se revisa con ejemplos etiquetados antes de confiar en una tasa o en un juez. | Media |
| `g-falso-negativo` | Falso negativo / *false negative* | M09; `m09-l3#calibrar`, `m09-l4#grader-falla` | M09 L3–L4 y laboratorio M09 | Caso que un grader deja pasar o rechaza de forma equivocada, según la dirección que mide. Mirarlo junto con los falsos positivos muestra qué clase de error deja escapar una evaluación. | Media |
| `g-entrada-no-confiable` | Entrada no confiable / *untrusted input* | M09; `m09-l5#vias`, `m09-l5#capas` | M07 L5–L6, M08 L5 y M09 L5 | Texto o dato que el sistema recibe sin poder asumir que respeta sus reglas, incluso si viene de un documento de la empresa. Se trata como dato y se limita lo que puede causar después de leerse. | Alta |

### M10 · Producto y mantenimiento

| ID propuesto | Término / en | Dueño y refs | Dónde se usa sin explicarse | Borrador de definición | Prioridad |
| --- | --- | --- | --- | --- | --- |
| `g-usabilidad` | Usabilidad / *usability* | M10; `m10-l2#heuristicas`, `m10-l2#revisar` | M10 L1–L2 y laboratorio M10 | Qué tan fácil es para una persona completar una tarea y entender lo que ocurrió. Se revisa con escenarios y barreras concretas, no con una impresión general de que la pantalla se ve bien. | Alta |
| `g-navegacion-teclado` | Navegación con teclado / *keyboard navigation* | M10; `m10-l2#revisar` | M10 L2, laboratorios y revisiones de la app | Forma de recorrer y activar todos los controles sin ratón ni toque. Requiere orden de foco visible, nombres claros y que no haya un control atrapado o inaccesible. | Alta |
| `g-reflujo-texto` | Reflujo de texto / *reflow* | M10; `m10-l2#norma`, `m10-l2#revisar` | M10 L2 y pruebas de interfaz | Reorganización de una pantalla cuando aumenta el tamaño del texto o disminuye el ancho. Una interfaz accesible no obliga a desplazarse horizontalmente para leer o usar lo esencial. | Media |
| `g-despliegue` | Despliegue / *deployment* | M10; `m10-l4#cadena`, `m10-l4#actualizar` | M04 L4, M10 L4–L6 | Proceso de publicar una versión para que otras personas la usen. Va después de las pruebas y deja evidencia de versión, origen y forma de volver atrás si la publicación falla. | Alta |
| `g-respaldo` | Respaldo / *backup* | M10; `m10-l4#respaldos`, `m10-l3#exportacion` | M10 L3–L4 y laboratorio M10 | Copia de datos que permite reconstruirlos después de pérdida, cambio o fallo. Solo cuenta como respaldo si se puede restaurar y comprobar, no por el hecho de existir un archivo. | Alta |
| `g-reversion` | Reversión / *rollback* | M10; `m10-l4#continuidad`, `m10-l4#actualizar` | M04 L4, M10 L4 y M10 L6 | Vuelta controlada a una versión anterior cuando una actualización rompe algo. Requiere saber qué versión estaba funcionando y cómo preservar o migrar los datos que ya cambió la nueva. | Alta |

## Entradas existentes que conviene mejorar

| Entrada | Problema observado | Propuesta |
| --- | --- | --- |
| `g-clave-api` (M01) | «Nunca dentro del código» es demasiado amplio: la regla útil es no incrustarla ni exponerla al cliente; una variable de entorno se carga desde código de servidor. | Reescribir con el matiz anterior y añadir `m04-l3#variables` como explicación complementaria. |
| `g-cliente-servidor` (M06) | Define el cliente solo como navegador, pero M06 y M07 usan como cliente también scripts y agentes. | Cambiar «el cliente es el navegador» por «el cliente, como un navegador, script o agente, pide datos…»; añadir `m07-l1#peticion`. |
| `g-agente` (M01) | `refs` solo apunta a la definición inicial; M08 vuelve a explicar cuándo un agente gana a un flujo. | Agregar `m08-l1#flujo-agente` y `m08-l1#agente`. |
| `g-ventana-contexto` (M02) | Falta la explicación operativa del presupuesto de contexto y su deterioro. | Agregar `m03-l1#que-ocupa` y `m03-l1#por-que-rinde-menos`. |
| `g-subagente` (M03) | No incluye la explicación posterior sobre paralelismo y archivos compartidos. | Agregar `m08-l3#subagente` y enlazar desde allí sin crear un duplicado. |
| `g-hook` (M03) | Solo remite al control determinista inicial, no a los momentos, límites y ejecución sin interfaz de M08. | Agregar `m08-l5#hook`, `m08-l5#momentos` y `m08-l5#limites`. |
| `g-worktree` (M04) | Falta su uso como aislamiento de archivos cuando hay subagentes. | Agregar `m08-l3#worktree`. |
| `g-ejecucion-desatendida` (M07) | M08 amplía el concepto a tarea programada, identidad, estado y fallo visible. | Agregar `m08-l4#identidad`, `m08-l4#hora` y `m08-l6#estado`. |
| `g-inyeccion-instrucciones` (M09) | La entrada no remite a la explicación previa de datos recuperados ni a ejecución desatendida. | Agregar `m07-l5#confianza` y `m07-l6#inyeccion`. |

## Apariciones de términos existentes sin marca que vale la pena corregir

Estas son primeras apariciones elegibles en el cuerpo, no títulos, decisiones, comprobaciones rápidas ni resúmenes. La edición final debe volver a comprobar la regla de máximo aproximado de seis marcas por lección.

| Término existente | Lugar sin `:term` | Marca sugerida |
| --- | --- | --- |
| `g-rama` | M01 L1, `m01-l1#entorno`: «una rama…» | `:term[rama]{id=g-rama}` |
| `g-diff` | M03 L5, `m03-l5#artefactos`: el agente revisa el historial, commits y cambios | `:term[diff]{id=g-diff}` donde se nombra el cambio revisable, si se mantiene la redacción. |
| `g-check` | M02 L5, `m02-l5#hitos`: prueba/check como condición de hito | `:term[check]{id=g-check}` en la primera aparición no incluida en una explicación. |
| `g-commit` | M03 L5, `m03-l5#artefactos`: los commits se explican con paréntesis pero no abren el panel | `:term[commits]{id=g-commit}` (ya hay un uso posterior marcado; mover la primera marca aquí). |
| `g-reconciliacion` | M02 laboratorio, `m02-lab#paso-6`: el script se usa como criterio de decisión | `:term[reconciliación]{id=g-reconciliacion}`. |
| `g-ambiguedad` | M02 laboratorio, `m02-lab#paso-1`: es la decisión central y la palabra no abre definición | `:term[ambigüedades]{id=g-ambiguedad}`. |
| `g-skill` | M08 L5, `m08-l5#sin-interfaz`: configuración, hooks y ejecución comparten el concepto | Marcar la primera mención sustantiva de skill, no la de código. |
| `g-idempotencia` | M08 L4, `m08-l4#hora`: está marcada, pero el uso posterior en el laboratorio M07 no lo está | Marcar la primera mención del laboratorio M07 que trata tareas duplicadas. |
| `g-caso-limite` | M09 L2, `m09-l2#tipos`: explica los tres tipos pero la primera mención es texto plano | `:term[casos límite]{id=g-caso-limite}`. |
| `g-invariante` | M09 L4, `m09-l4#invariantes`: el plural se usa para explicar qué no atrapan los graders | `:term[invariantes]{id=g-invariante}` si no supera el límite de marcas de la lección. |
| `g-riesgo-aceptado` | M10 L6, `m10-l6#cierre`: aparece en la tabla de salidas de un hallazgo antes de abrirse en el glosario | Marcar la primera mención en prosa o tabla que no sea la explicación del término. |

## Verificado

- Los 60 IDs propuestos no están entre las 150 entradas actuales; no duplican por nombre ninguno de los conceptos existentes que se deben reutilizar.
- Se revisaron los 70 Markdown pedidos: 60 lecciones y 10 laboratorios; además se consultó el README de datos asociado cuando el laboratorio remitía a él.
- `node scripts/build-content.ts --check` pasa: 10 cursos, 60 lecciones, 1 023 preguntas y 68 fichas.
- Antes de aplicar, Claude debe comprobar cada ubicación de marca contra `docs/relaciones.md`: primera aparición útil, fuera de títulos/decisiones/resúmenes/código y sin pasar el máximo orientativo por lección.

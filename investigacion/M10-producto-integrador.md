# M10 — De prototipo a producto: proyecto integrador · Base de investigación

- **Archivo:** `investigacion/M10-producto-integrador.md`
- **Fecha de investigación:** 2026-10-27. Todas las fuentes nuevas se abrieron ese día. Las reutilizadas que se volvieron a abrir llevan esa fecha; las que no se reabrieron conservan la de su registro previo (§6).
- **Elaborado por:** subagente de investigación (Claude Code) para el autor de M10.
- **Estado:** base factual y conceptual para redactar las 6 lecciones, el laboratorio como caso y el banco de M10. No es contenido final para el alumno.
- **Convenciones (las mismas que M02, M04 y M07 a M09):**
  - `[src-…]` = ID de fuente del registro (§6). La afirmación está documentada en esa fuente (parafraseada). Los IDs reutilizados son los exactos de `content/sources.json`. Algunos IDs vienen del registro de `investigacion/stack-tecnico.md` y todavía no están en `content/sources.json`; van marcados «(de stack-tecnico)».
  - `[inferencia]` = conclusión, síntesis o recomendación propia que ninguna fuente afirma literalmente. Según D-028, las preguntas y conceptos erróneos que se apoyen solo en una inferencia llevan `basis: inference`.
  - **Ficha candidata** = afirmación que depende de un producto, una plataforma o una versión. Según D-019 va en una ficha de producto fechada, nunca en el cuerpo de la lección (como máximo dos por lección, D-021).
  - Citas textuales: como máximo una por fuente y de menos de 15 palabras.
- **Datos:** todos los ejemplos usan el caso ficticio Altiplano Industrial S.A. (M02 §2.0) y los datos sintéticos de `content/courses/m02/practice/data/`. Las URLs usan dominios reservados para ejemplos (`*.example`). Las cifras del laboratorio (precios, costos, márgenes, bandas de aprobación) se calcularon el 2026-10-27 con `m10_figures.py` (en el *scratchpad* de la sesión, aritmética con `decimal`); no hay cifras calculadas a mano. Los conteos de uso, tiempos y porcentajes de comportamiento de los usuarios son **datos ficticios del caso**, declarados como tales.
- **Aviso para el banco, las comprobaciones y el laboratorio (escenarios ya expuestos):**
  - `dx-b5-02` (app web estática que necesita una clave de API privada; correcta: la clave va en un servidor o función, no en el código del cliente; `sectionRef: m07-l2`). **No repetir** ese escenario. L3 y L4 de M10 lo dan por sabido: nada secreto viaja en el paquete de una app estática [src-vite-env].
  - `dx-b2-01` (qué añadir a «haz un dashboard del pipeline»), `dx-b2-04` («en riesgo» sin definir: entrevista), `dx-b3-04` (traspaso a otro agente), `dx-b4-03` (diff con cambios fuera de alcance): M10 los da por sabidos y **no repite** sus escenarios ni sus preguntas.
  - **Ya enseñado en lecciones publicadas, que M10 no vuelve a definir:**
    - M02 L1 (objetivo con quién, para qué, cuándo y criterio; qué significa «terminado»), M02 L4 (alcance en las dos direcciones; entrevista), M02 L6 (criterios específicos, observables, ejecutables; evidencia y no afirmaciones).
    - M03 L2 (las instrucciones también son código: se versionan, se revisan cuando algo falla y se podan), M03 L4 (probar la activación de una skill con unas 20 consultas, casi aciertos, tres corridas y umbral), M03 L5 (registro de decisiones con el formato ADR; documento de traspaso).
    - M04 L3 (dependencias declaradas y revisadas; paquetes inventados por los modelos), M04 L5 (checks de la integración continua; un check omitido cuenta como éxito), M04 L6 (la PR como unidad de revisión; quien encarga no aprueba solo).
    - M05 L5 (las pantallas se verifican viéndolas; si no se puede verificar, no se entrega), M05 L6 (lo que viaja es lo escrito).
    - M06 L1 (el navegador y el servidor hacen cosas distintas; dar formato es de la interfaz, redondear para calcular no), M06 L5 y L6 (lo que nunca calcula un modelo; reconciliación independiente).
    - M08 L6 (el estado no es el resultado; verificar en proporción).
    - M09 L2 (del fallo real al caso de regresión), M09 L6 (independencia, límites de la segunda opinión, regresión, cuándo volver a correr, registro de cambios con su evidencia).
  - **M10 usa todo eso como punto de partida.** Su pregunta es otra: qué le falta a una herramienta que ya funciona en la computadora de quien la hizo para que otras personas la usen y alguien la mantenga.
  - Fichas ya publicadas que M10 **complementa y no duplica:** `m02-pc-instruction-files`, `m03-pc-skills-tools`, `m04-pc-push-protection`, `m04-pc-review-agents`, `m09-pc-review-tools`, `m09-pc-eval-platforms`.
- **Alumno:** profesional de finanzas que dirige agentes de código. No es desarrollador ni diseñador. M10 no lo forma para construir un producto con sus manos: lo forma para decidir qué construir, qué exigirle al agente y qué revisar antes de que otras personas dependan de la herramienta (`docs/curriculum.md`, M10).
- **D-024:** toda evaluación es de opción múltiple. Los objetivos se formulan como decisiones («elige», «identifica», «decide») y el laboratorio es un caso por pasos con preguntas, sin entregable. La «Práctica» del currículo («entregar una herramienta pequeña con datos sintéticos») se convierte en un caso que recorre las decisiones de entregarla; construirla queda como «Pruébalo en tu entorno».

---

## 1. Resumen ejecutivo

1. **La pregunta central («¿qué le falta a una herramienta para ser útil y mantenible?») se responde con seis piezas, una por lección:** un usuario y un problema concretos con un criterio de éxito medible; una interfaz que se pueda usar, también con teclado, lector de pantalla, texto ampliado o en un teléfono; un manejo del estado que no pierda ni corrompa los datos del usuario cuando la app cambia; un despliegue que no publique sin pruebas y que sobreviva a un cambio de proveedor; documentación separada por lector, con limitaciones declaradas y un responsable; y un plan de mantenimiento con disparadores, calendario y hallazgos que se cierran con evidencia [inferencia, síntesis de §3]. Lo estable son los principios; lo volátil (hosting, herramientas de escaneo, actualizaciones automáticas de dependencias, retiro de modelos) va en fichas.
2. **Primero el problema, después la herramienta.** Una guía pública de diseño de servicios pide empezar por las personas que van a usar el servicio, escribir sus necesidades en sus palabras y tratar como supuesto toda opinión que no venga de ellas [src-govuk-user-needs]. La fase previa a construir sirve para entender el problema, reformular como problema cualquier solución predefinida y planear cómo se medirá el éxito; puede terminar con la decisión de no construir, y alternativas como mejorar un contenido pueden resolver mejor el problema [src-govuk-discovery]. El alcance se fija «ni demasiado estrecho ni demasiado amplio» y se mejora por incrementos [src-govuk-whole-problem]. Lo primero que se construye prueba los supuestos más riesgosos, no todo el recorrido [src-govuk-alpha]; un producto mínimo viable es una representación razonable que maximiza lo que se aprende sobre la propuesta de valor central, y no tiene por qué ser la primera versión publicada [src-nngroup-mvp-video]. Los indicadores se derivan de las necesidades, son pocos (tres o cuatro) y se miden contra una línea base [src-govuk-performance-metrics].
3. **La accesibilidad tiene una norma con criterios verificables, y un escaneo automático no la certifica.** WCAG 2.2 es recomendación del W3C (publicada el 2023-10-05; edición vigente del 2024-12-12) [src-w3c-wcag22][src-w3c-wcag22-new]. Para una app de datos pesan, en nivel A y AA: alternativas textuales, estructura programática (tablas con encabezados), no usar solo el color, contraste 4,5:1 (3:1 en texto grande y en componentes y gráficos), texto al 200 %, *reflow* a 320 px, teclado, foco visible y no tapado, objetivos de al menos 24 × 24 px y alternativas al arrastre [src-w3c-wcag22][src-w3c-wcag22-new]. El W3C advierte que las herramientas no pueden comprobarlo todo [src-w3c-eval-tools]. Cifras con fuente: un motor de reglas muy usado dice detectar en promedio el 57 % de los problemas WCAG [src-github-axe-core], cifra que su fabricante calcula por volumen de problemas en más de 2 000 auditorías propias [src-deque-coverage-report]; en 2017, el servicio digital del gobierno británico probó diez herramientas sobre una página con 143 barreras: la mejor encontró el 37 % (41 % contando avisos de revisión manual) y el 29 % no lo detectó ninguna [src-gds-a11y-tools-2017]. Conclusión: escaneo automático en cada cambio **y** revisión manual con criterio [src-playwright-a11y][src-w3c-easy-checks].
4. **El estado del usuario es lo que más cuesta recuperar.** Lo que se puede calcular no se guarda (se deriva) [src-react-state-structure]; los datos de referencia vienen del pipeline verificado (M06); lo que el usuario crea en su dispositivo vive en el almacenamiento del navegador, que es **por origen**, puede borrarse por presión de espacio (todo el origen a la vez), por decisión del usuario o, en un navegador, tras siete días sin interacción, salvo que se obtenga almacenamiento persistente [src-mdn-storage-quotas]. Cambiar la estructura de una base IndexedDB solo se hace en el evento de actualización de versión; recrear un almacén borra sus datos [src-mdn-indexeddb-using]. Una migración bien hecha es atómica: si falla, no deja datos a medias [src-dexie-versioning]. El ideal de que el trabajo siga accesible aunque desaparezca quien hizo el software exige que el usuario pueda sacar sus datos [src-inkandswitch-local-first][inferencia].
5. **Desplegar es publicar una versión que se puede reconstruir, actualizar y mudar.** Un flujo de publicación separa construir de desplegar, y el despliegue espera a que la construcción termine [src-ghdocs-custom-workflows]; si las pruebas van dentro de la construcción, una prueba que falla impide publicar [inferencia, apoyada en M04 L5 y en D-029]. En una PWA, el *service worker* nuevo espera hasta que ninguna pestaña use el viejo; forzar el cambio puede mezclar versiones en una misma página [src-webdev-sw-lifecycle], y la guía recomienda avisar que hay una versión nueva y dejar que el usuario elija cuándo recargar [src-webdev-pwa-update]. SemVer da significado a los números de versión, pero exige declarar qué es la API pública [src-semver-2]. Continuidad: una copia de los archivos estáticos se puede publicar en otro lado, pero los datos guardados en el navegador están atados al origen y no viajan [src-mdn-storage-quotas][inferencia]; los respaldos siguen la regla 3-2-1 y se prueban restaurando [src-cisa-backup-business].
6. **La documentación se escribe para un lector y una necesidad.** Diátaxis distingue cuatro formas (tutorial, guía práctica, referencia y explicación) según si el lector estudia o trabaja, y si necesita actuar o entender; mezclarlas está en el origen de muchos problemas [src-diataxis]. Un README responde qué hace el proyecto, por qué sirve, cómo empezar, dónde pedir ayuda y quién lo mantiene [src-github-about-readmes]. Las limitaciones y el uso previsto se declaran, como en las fichas de modelos [src-arxiv-model-cards][inferencia sobre la analogía]. Quien aprueba lo que hizo un agente responde por ello: las documentaciones de los agentes piden revisar el código y los comandos antes de aprobarlos o fusionarlos (ficha L5) [src-anthropic-cc-security][src-github-copilot-agents-responsible]. Un repositorio sin licencia queda bajo derechos de autor por defecto [src-github-licensing-repo].
7. **Mantener es tener disparadores, calendario y criterio de cierre.** Las instrucciones y skills se tratan como código (M03 L2), y una skill se evalúa corriendo cada caso con la versión nueva y con la anterior como línea base [src-agentskills-evaluating]; una guía pide construir las evaluaciones antes que la documentación extensa y probar con todos los modelos que se usarán [src-anthropic-skills-bp]. Los parches son mantenimiento preventivo y un costo esperado de operar [src-nist-sp800-40r4]. Los modelos se retiran con aviso, y la recomendación es probar con el reemplazo mucho antes de la fecha (ficha L6) [src-anthropic-model-deprecations]. Un hallazgo se cierra con la corrección y su prueba, o con una aceptación de riesgo justificada y registrada que se puede reabrir; las herramientas de alertas de dependencias registran motivo, comentario, autor y fecha del descarte [src-github-dependabot-alerts][inferencia].
8. **La app del curso es un ejemplo real, pero sus detalles van en fichas.** Se publica con un flujo que corre el contenido, las pruebas y la compilación antes de desplegar, y su *service worker* espera a que el usuario acepte la actualización (D-029; `vite.config.ts`, `src/sw/sw.ts`, observación del repositorio el 2026-10-27). Sirve como caso de transferencia, no como regla de producto.
9. **Volatilidad:** baja en los principios de diseño centrado en el usuario, WCAG 2.2 (los criterios de 2.0 y 2.1 casi no cambiaron [src-w3c-wcag22-new]), estructura del estado, SemVer, Diátaxis, ADR y regla 3-2-1; media en el ciclo de vida del *service worker* y las cuotas de almacenamiento por navegador; alta en hosting (límites, términos), herramientas de escaneo, actualizaciones automáticas de dependencias y políticas de retiro de modelos (fichas, revisión trimestral o semestral).

---

## 2. Blueprint propuesto (objetivos evaluados del manual)

Seis objetivos, uno por lección (`docs/content-standard.md` §3.3). Cada uno con 2 familias en el banco, 2 ítems en el examen y 2 preguntas en el laboratorio. Todos formulados como decisiones evaluables por escenario (D-024).

| ID | Objetivo evaluado | Competencia | Lección | Evidencia |
| --- | --- | --- | --- | --- |
| M10-OE1 | Dado un pedido de herramienta y lo que se sabe de quienes la usarían, **identifica** al usuario principal y la decisión que la herramienta debe apoyar, **elige** el alcance mínimo útil (qué entra, qué queda fuera y por qué) y el criterio de éxito medible con línea base, y **reconoce** cuándo conviene probar un supuesto antes de construir, o no construir. | C13, C02 | L1 | Comprobaciones, banco; laboratorio paso 1 |
| M10-OE2 | Dada una pantalla hecha por un agente y su reporte de verificación, **identifica** las barreras de usabilidad y accesibilidad que importan en una herramienta de datos (color como única señal, tabla o gráfico sin estructura ni alternativa, foco, teclado, tamaño de objetivo, texto ampliado) y **decide** qué verificación falta, sin concluir que es accesible por un escaneo automático en verde. | C13, C12 | L2 | Serie intercalada, comprobaciones, banco; laboratorio paso 2 |
| M10-OE3 | Dado el diseño del estado de una herramienta, **decide** dónde vive cada dato (derivado, de referencia, preferencia, creado por el usuario), **identifica** qué pone en riesgo los datos del usuario (cambio de esquema, borrado del navegador, cambio de origen) y **elige** la protección (migración atómica probada con datos de la versión anterior, exportación con versión de formato, almacenamiento persistente). | C13 (apoyo C08) | L3 | Comprobaciones, banco; laboratorio paso 3 |
| M10-OE4 | Dado un plan de publicación, **elige** la cadena que impide publicar si fallan las pruebas, la forma de actualizar que no mezcla versiones ni hace perder trabajo, el número de versión y el plan de continuidad (otro hosting, origen, respaldo con restauración probada). | C13 | L4 | Comprobaciones, banco; laboratorio paso 4 |
| M10-OE5 | Dada una entrega con su documentación, **elige** qué documento sirve a cada lector (quien usa o quien mantiene; tutorial, guía, referencia o explicación), **identifica** limitaciones y supuestos que faltan declarar y **decide** quién responde por lo entregado y con qué evidencia, incluido el código escrito por un agente y las licencias de las dependencias. | C13, C02 | L5 | Serie intercalada, comprobaciones, banco; laboratorio paso 5 |
| M10-OE6 | Dado un cambio (instrucciones, skill, dependencia, modelo, hosting) o un hallazgo de revisión, **decide** qué se vuelve a probar y quién revisa, **propone** el calendario de revisión según la volatilidad de cada pieza y **decide** cuándo un hallazgo está cerrado (corrección con prueba, o riesgo aceptado con motivo, responsable y fecha) y cuándo se reabre. | C13, C12 (apoyo C04) | L6 | Comprobaciones, banco; caso de transferencia; laboratorio paso 6 |

**Notas de diseño [inferencia]:**

- C13 está en los seis objetivos, porque M10 es su manual principal y sus tres conductas de `content/competencies.json` se reparten así: «recorta un alcance hasta dejar una versión que ya se puede usar» (OE1), «escribe instrucciones de ejecución y recuperación que otra persona u otro agente puede seguir» (OE4 y OE5, reformulada como elegir entre versiones de un runbook o un README, D-024) y «propone un calendario de revisión» (OE6, reformulada como elegir el calendario adecuado). C02 apoya OE1 y OE5 (especificar el alcance y declarar supuestos); C12 apoya OE2 y OE6 (verificación con evidencia, regresión). C04 aparece como apoyo en OE6, porque `docs/curriculum.md` lista M10 como apoyo de la configuración portable del agente.
- **Series intercaladas** (estándar §3.2): (1) al final de L2, cinco barreras de una pantalla para decidir si las detecta un escaneo automático, una revisión manual o solo una prueba con usuarios; (2) al final de L5, cinco piezas de información para decidir en qué documento van (guía para usuarios, README para mantenedores, referencia, explicación, registro de decisiones). L6 puede llevar una tabla de disparadores en lugar de serie.
- **Distractores naturales del manual:** «agregar más funciones para que la usen más», «el escaneo dio cero errores», «guardar todo lo calculado para que cargue rápido», «forzar la actualización para que todos tengan la última», «el agente lo escribió, el proveedor responde», «con las pruebas en verde el hallazgo está cerrado». Al menos una familia por objetivo debe tener uno de ellos como opción plausible incorrecta, y al menos una debe tener como correcta una decisión de recortar o de no hacer («no construir todavía», «dejarlo fuera de la v1»).
- **Frontera con M02, M04, M05 y M09:** M02 enseña a especificar una tarea; M10 decide el alcance de un producto y su criterio de éxito con usuarios. M04 enseña los checks; M10 decide qué checks bloquean una publicación. M05 verifica que una pantalla funciona; M10 verifica que la puede usar alguien distinto de quien la hizo. M09 crea la regresión y el registro; M10 los sostiene en el tiempo con disparadores y calendario.

---

## 3. Lecciones

### 3.0 Material del caso que se reutiliza

M10 lleva el dashboard de M02-M09 de prototipo a producto. Se le llama **Pulse de oportunidades** (el nombre del proyecto sugerido en el currículo).

| Pieza | Para qué sirve en M10 |
| --- | --- |
| `opportunities_snapshot_2026-10-19.csv` y `_2026-10-26.csv`, `stage_probability.csv`, `fx_rates.csv`, `quota.csv` (M02) | Datos de referencia que el Pulse muestra; nunca se editan en el cliente |
| `reconcile.py` y `expected/` (M02) | Check que corre en la integración continua antes de publicar (L4) y prueba de regresión de cifras (L6) |
| `kpis.json` verificado (contrato de KPI, M06) | Lo único que el Pulse muestra como cifra; el cliente no recalcula KPI (M06 L1) |
| **Pulse v0** (prototipo, a describir por el autor) | Funciona en la computadora de la analista: un HTML que lee `kpis.json` y una tabla de oportunidades vencidas. Sin README, sin pruebas de interfaz, sin publicación |
| **Pedido del director comercial** (a redactar) | «Quiero el Pulse en el celular de los tres gerentes regionales, con alertas, notas compartidas, un simulador de forecast y conexión al CRM» (L1) |
| **Entrevistas** (datos ficticios del caso) | Los tres gerentes preparan cada lunes una reunión uno a uno con sus vendedores; hoy tardan unos 45 minutos en armar la lista de oportunidades que hay que perseguir, cruzando el export del CRM con el informe de FP&A (L1) |
| **Pantalla v1 y su reporte** (a describir) | El agente construye la tabla por región y el gráfico de cobertura; su reporte dice «escaneo de accesibilidad: 0 violaciones» (L2) |
| **Plan de estado v1 y v2** (a describir) | v1 guarda «revisada» por `opp_id`; v2 la necesita por semana (L3) |
| **Flujo de publicación** (a describir, con dominio `pulse.altiplano.example`) | Push a `main` → contenido, pruebas, `reconcile.py` → compilación → despliegue (L4) |
| **README del agente y guía para gerentes** (a redactar) | Con errores sembrados: mezcla tutorial y referencia, promete «datos en tiempo real», no declara limitaciones (L5) |
| **Revisión independiente de v1.3** (a redactar) | Seis hallazgos con severidad, para decidir cómo se cierra cada uno (L6) |

El laboratorio (§5) **no usa el Pulse**: usa un caso nuevo, el simulador de descuentos, para no repetir los ejemplos de las lecciones.

---

### Lección 1 — Usuario, problema y alcance mínimo útil

**Objetivo de lección (→ M10-OE1):** Dado un pedido de herramienta, identifica al usuario principal y la decisión que apoya, elige el alcance mínimo útil y un criterio de éxito medible con línea base, y reconoce cuándo probar un supuesto antes de construir.

**Ideas clave**

- **Una herramienta que nadie usa no es un producto.** [inferencia] El prototipo de M02-M09 resolvía la pregunta de la analista; un producto resuelve la de otras personas, que no estuvieron en las conversaciones con el agente. M02 L1 enseñó a escribir el objetivo de una tarea; aquí el objetivo es de un producto que va a durar.
- **Empezar por las necesidades de los usuarios, en sus palabras.** Una guía pública de diseño de servicios dice que hay que empezar por aprender sobre las personas que lo usarán, y propone escribir cada necesidad como «necesito… para…», con contexto opcional (quién es, qué la dispara, qué restricciones tiene), desde la perspectiva del usuario y concentrándose en las más importantes [src-govuk-user-needs]. Lo que no viene de los usuarios es un supuesto que hay que probar [src-govuk-user-needs]. Los servicios construidos sobre necesidades reales se usan más y cuestan menos de operar [src-govuk-user-needs]. Cita posible: «always start by learning about the people who will use it» [src-govuk-user-needs].
- **Reformular la solución pedida como problema.** La fase previa a construir sirve para entender a los usuarios, las restricciones (legales, técnicas, de proceso) y la intención; hay que cuestionar toda solución predefinida, reformularla como problema y definir qué queda fuera [src-govuk-discovery]. Esa fase puede terminar en la decisión de no construir (si el costo supera al beneficio o una restricción lo impide), y a veces mejorar un contenido o una información resuelve mejor el problema [src-govuk-discovery]. Cita posible: «You should not start building your service in discovery.» [src-govuk-discovery]. [inferencia] En Altiplano: «un simulador de forecast» es una solución; el problema es «los gerentes no saben qué oportunidades perseguir esta semana».
- **Ni demasiado estrecho ni demasiado amplio.** El estándar de servicio pide resolver un problema completo según cómo piensan los usuarios, sin construir un servicio grande que intente hacer demasiado, y mejorar por incrementos frecuentes en lugar de arreglarlo todo a la vez [src-govuk-whole-problem]. También pide no diseñar alrededor de una tecnología, y la actualización de 2026-01-29 aclara que eso incluye la IA [src-govuk-whole-problem].
- **Probar primero el supuesto más riesgoso.** En la fase de prototipos se construye lo justo para probar ideas, sin calidad de producción y esperando descartar buena parte; la clave es identificar los supuestos más riesgosos y probarlos, sin prototipar todo el recorrido [src-govuk-alpha]. Un producto mínimo viable es una representación razonable del producto que maximiza lo que se aprende sobre la propuesta de valor central; puede ser un experimento y no tiene por qué ser la primera versión publicada [src-nngroup-mvp-video]. [inferencia] Con agentes, construir es barato; lo caro es mantener lo que se construyó sin necesidad. Un agente puede hacer en una tarde las cinco funciones pedidas, y cada una suma pantallas que revisar, datos que proteger y documentación que mantener (L2-L6).
- **El alcance mínimo útil.** [inferencia, síntesis de src-govuk-whole-problem, src-govuk-alpha y src-nngroup-mvp-video] Es la versión más pequeña que ya permite al usuario principal tomar su decisión con los datos verificados. Se escribe en dos listas, lo que entra y lo que queda fuera con su motivo (puente con M02 L4, alcance en las dos direcciones), y cada exclusión anota qué la haría entrar después.
- **Criterios de éxito: pocos, derivados de la necesidad, con línea base.** La guía de métricas pide partir del propósito, convertir las necesidades en unos pocos beneficios, formular hipótesis (qué cambio, qué beneficio, qué supuesto), elegir tres o cuatro indicadores que respondan «¿funciona?», usar varias fuentes de datos y medir contra una línea base antes de cambiar [src-govuk-performance-metrics]. [inferencia] En una herramienta interna pequeña bastan tres: uno de uso (¿la usan para la decisión?), uno de resultado (¿ahorra tiempo o evita errores?) y uno de corrección (¿coinciden sus cifras con la reconciliación?). «Que les guste» o «número de visitas» no dicen si la decisión mejoró.
- **Especificar antes de construir sigue valiendo.** El alcance y los criterios de éxito de producto se convierten después en especificaciones de tarea para el agente (M02 L4 y L6) [inferencia]. No se repite aquí cómo escribirlas.

**Ejemplo con Altiplano (para el caso resuelto)**

Pedido del director comercial: «Quiero el Pulse en el celular de los tres gerentes, con alertas, notas compartidas, un simulador de forecast y conexión al CRM». La analista entrevista a los tres gerentes (datos ficticios del caso): cada lunes preparan un uno a uno con sus vendedores y tardan unos 45 minutos en armar la lista de oportunidades que hay que perseguir.

| Decisión | Resolución |
| --- | --- |
| Usuario principal | Gerente regional, el lunes antes del uno a uno (no el comité, no los vendedores) |
| Necesidad en sus palabras | «Necesito ver qué oportunidades de mi región están vencidas o sin actividad, para decidir con cada vendedor qué perseguir esta semana» |
| Alcance v1 (entra) | Vista por región: vencidas, sin actividad en 14 días, cobertura de la región; solo lectura; datos del snapshot semanal verificado; legible en el teléfono |
| Fuera de v1, con motivo | Notas compartidas (exige servidor e identidad: otro proyecto); escritura en el CRM (permisos y riesgo, M07); simulador de forecast (nadie lo pidió en las entrevistas); alertas (hasta saber si usan la vista) |
| Supuesto más riesgoso | Que los gerentes la abran en el teléfono antes del uno a uno. Se prueba una semana con un prototipo navegable antes de pulir nada |
| Criterios de éxito | Uso: los tres gerentes la usan en 3 de 4 lunes. Resultado: preparación de 45 a 15 minutos o menos (línea base medida dos lunes). Corrección: cero diferencias con `reconcile.py` |

Ejemplo para completar: el comité pide «una vista con las diez oportunidades más grandes del trimestre». El alumno decide si es otra pantalla para los mismos usuarios o un usuario distinto con otra decisión, y qué criterio de éxito tendría.

**Conceptos erróneos frecuentes (distractores)**

| ID | Creencia errónea | Por qué es errónea | Fuente |
| --- | --- | --- | --- |
| M10-CE01 | «Si construir con un agente es barato, conviene incluir todo lo que pidieron.» | Cada función se revisa, se documenta y se mantiene; el alcance se fija por la necesidad, ni demasiado amplio ni demasiado estrecho. | [src-govuk-whole-problem]; [inferencia] |
| M10-CE02 | «El pedido del director ya es la especificación del producto.» | Es una solución predefinida; hay que reformularla como problema y validarla con quienes la usarán. | [src-govuk-discovery][src-govuk-user-needs] |
| M10-CE03 | «Que a los usuarios les guste es el criterio de éxito.» | Los indicadores se derivan de la necesidad, son pocos y se miden contra una línea base. | [src-govuk-performance-metrics] |
| M10-CE04 | «El MVP es la versión 1 con menos pulido.» | Es lo mínimo para aprender sobre la propuesta de valor; puede ser un experimento antes de publicar nada. | [src-nngroup-mvp-video][src-govuk-alpha] |
| M10-CE05 | «Si ya se pidió la herramienta, no construirla no es una opción.» | La fase previa puede terminar en no construir, o en una solución que no es software. | [src-govuk-discovery] |
| M10-CE06 | «Primero se construye todo y después se prueba con usuarios.» | Se prueban primero los supuestos más riesgosos, con lo mínimo necesario. | [src-govuk-alpha] |

**Fichas candidatas:** ninguna. La lección es duradera.

---

### Lección 2 — UX/UI y accesibilidad

**Objetivo de lección (→ M10-OE2):** Dada una pantalla hecha por un agente y su reporte de verificación, identifica las barreras de usabilidad y accesibilidad que importan en una herramienta de datos y decide qué verificación falta.

**Ideas clave — usabilidad**

- **Diez heurísticas siguen siendo la lista de partida.** Son de 1994 y su autor las revisó por última vez en 2024: estado visible del sistema, lenguaje del usuario, control y deshacer, consistencia, prevención de errores, reconocer antes que recordar, flexibilidad, diseño mínimo, mensajes de error que ayudan a recuperarse, y ayuda centrada en la tarea [src-nngroup-heuristics]. [inferencia] Para una herramienta financiera pesan tres: el estado visible (de qué fecha son los datos, qué versión se está viendo), el lenguaje del usuario (los nombres de KPI del comité, no los de las columnas) y la prevención de errores (no dejar que un filtro esconda una región sin avisarlo).
- **La fecha del dato es parte de la interfaz.** [inferencia, apoyada en src-nngroup-heuristics, heurística 1] Una cifra sin «al 2026-10-19» invita a leerla como actual. Puente con M06 L1: dar formato es de la interfaz; la fecha y la moneda también.

**Ideas clave — accesibilidad**

- **WCAG 2.2 es la norma, y nivel AA es la meta habitual.** Es recomendación del W3C desde el 2023-10-05; la edición vigente es del 2024-12-12 [src-w3c-wcag22-new][src-w3c-wcag22]. Añadió nueve criterios y retiró 4.1.1 (análisis sintáctico); los de 2.0 y 2.1 quedaron casi iguales [src-w3c-wcag22-new]. El objetivo del curso para su propia app es AA (`plan.md` §6).
- **Los criterios que más pesan en una herramienta de datos** [src-w3c-wcag22] (nivel entre paréntesis):
  - 1.1.1 Contenido no textual (A): todo lo que no es texto tiene una alternativa textual con la misma función.
  - 1.3.1 Información y relaciones (A): la estructura que se ve (encabezados de tabla, agrupaciones) está en el código.
  - 1.4.1 Uso del color (A): el color no es el único medio visual de transmitir información. Cita posible: «Color is not used as the only visual means of conveying information» [src-w3c-wcag22].
  - 1.4.3 Contraste mínimo (AA): 4,5:1 en texto, 3:1 en texto grande. 1.4.11 Contraste no textual (AA): 3:1 en bordes y estados de componentes y en los gráficos necesarios para entender.
  - 1.4.4 Cambiar el tamaño del texto (AA): al 200 % sin perder contenido ni función. 1.4.10 *Reflow* (AA): a 320 px de ancho sin desplazamiento en dos dimensiones; las tablas de datos están exentas.
  - 2.1.1 Teclado (A); 2.4.7 Foco visible (AA); 2.4.11 Foco no tapado, mínimo (AA, nuevo en 2.2): el elemento con foco no queda oculto del todo por contenido del autor, como una barra fija [src-w3c-wcag22-new].
  - 2.5.7 Movimientos de arrastre (AA, nuevo): lo que se hace arrastrando también se puede hacer con un solo puntero sin arrastrar [src-w3c-wcag22-new].
  - 2.5.8 Tamaño del objetivo, mínimo (AA, nuevo): 24 × 24 px CSS o espacio suficiente, con excepciones (en línea, equivalente, controlado por el navegador, esencial) [src-w3c-wcag22-new]. Ayuda a personas con temblor, a quien usa el teléfono con una mano o en un transporte en movimiento; 24 px es un mínimo y se recomienda más [src-w3c-understanding-target-size].
  - 3.3.1 Identificación de errores (A) y 4.1.3 Mensajes de estado (AA): el error se describe en texto, y los avisos de estado se anuncian sin mover el foco [src-w3c-wcag22].
- **Tablas: encabezados de verdad.** Las celdas de encabezado se marcan como tales y, si hay encabezados de fila y de columna, se declara su alcance; un título resume de qué trata la tabla; no se usan tablas para maquetar [src-w3c-tables-tutorial]. Las pistas visuales solas no bastan: el marcado permite que un lector de pantalla anuncie el encabezado de cada celda [src-w3c-tables-tutorial].
- **Gráficos: descripción corta y larga.** Un gráfico es una imagen compleja: lleva una alternativa corta que lo identifica y una descripción larga con escalas, valores, relaciones y tendencias, visible para todos y no escondida; una tabla dentro de la descripción es una forma válida [src-w3c-complex-images]. [inferencia] En el Pulse, la tabla de cobertura por región ya es la descripción larga del gráfico de barras, si está junto a él y con los mismos números.
- **Un escaneo automático en verde no dice «accesible».** El W3C advierte que las herramientas no pueden comprobar todos los aspectos y que hace falta juicio humano [src-w3c-eval-tools]. Cita posible: «Tools cannot check all accessibility aspects automatically.» [src-w3c-eval-tools]. Las cifras con fuente:
  - El motor de reglas más usado dice que encuentra, en promedio, el 57 % de los problemas WCAG de forma automática y que marca como «incompleto» lo que exige revisión manual [src-github-axe-core].
  - Su fabricante calcula esa cifra por **volumen de problemas** sobre más de 2 000 auditorías propias, 13 000 páginas y casi 300 000 problemas, solo HTML y solo primeras auditorías; advierte que es otra métrica que la de «criterios que se pueden automatizar», donde circula una cifra de 20-30 % [src-deque-coverage-report]. Es un informe de proveedor (cautela).
  - En 2017, el servicio digital del gobierno británico armó una página con 143 barreras y probó diez herramientas: la mejor encontró el 37 % (41 % contando avisos para revisar a mano), entre todas el 71 %, y el 29 % no lo detectó ninguna; su conclusión fue usarlas, pero junto con revisión manual, auditoría y pruebas con usuarios [src-gds-a11y-tools-2017].
  - [inferencia] Las cifras miden cosas distintas y no se deben comparar entre sí ni presentarse como «la» cobertura. La lección que sí se sostiene: cerca de la mitad de los problemas, o más, quedan fuera de un escaneo.
- **Cómo revisar la accesibilidad de lo que hizo un agente.** [inferencia, síntesis de src-playwright-a11y, src-w3c-easy-checks y M05 L5] Tres capas:
  1. **Escaneo automático en cada cambio**, dentro de las pruebas de extremo a extremo, para que una regresión se vea en la PR. Una documentación de pruebas de navegador lo propone y advierte que muchos problemas solo se descubren con pruebas manuales [src-playwright-a11y].
  2. **Revisión manual con una lista breve**: recorrer con teclado y ver el foco, ampliar el texto al 200 %, estrechar a 320 px, mirar el contraste, comprobar que nada dependa solo del color, leer las alternativas de los gráficos. Las comprobaciones rápidas del W3C cubren esto y advierten que una página puede pasarlas y aun así tener barreras importantes [src-w3c-easy-checks].
  3. **Probar con alguien que use la herramienta**, idealmente con su dispositivo y su configuración (texto ampliado, lector de pantalla) [src-gds-a11y-tools-2017].
- **Pedirle al agente que verifique, no que afirme.** [inferencia, puente con M05 L5] «Hazlo accesible» produce un reporte; «corre el escaneo, recorre la pantalla con teclado, adjunta capturas al 200 % y a 320 px, y lista lo que no pudiste comprobar» produce evidencia.

**Ejemplo con Altiplano (para el caso resuelto)**

El agente entrega la pantalla de la región con su reporte: «Escaneo de accesibilidad: 0 violaciones». La analista hace la revisión manual (lista de 10 minutos) y encuentra:

| Hallazgo | Criterio | ¿Lo ve el escaneo? [inferencia] |
| --- | --- | --- |
| «Vencida» se marca solo con el fondo rojo de la fila | 1.4.1 | Normalmente no: no puede saber que el color significa algo |
| El gráfico de cobertura es una imagen con `alt="gráfico"` | 1.1.1 | Ve que hay `alt`; no puede juzgar si dice algo útil |
| La tabla está hecha con `div`, sin encabezados | 1.3.1 | A veces no: si no hay marcado de tabla, no sabe que es una tabla |
| Los filtros de región son chips de 18 × 18 px pegados | 2.5.8 | Depende de la herramienta y su versión; no verificado, hay que confirmarlo en el reporte |
| La barra inferior fija tapa la fila con foco | 2.4.11 | No: depende del desplazamiento y del recorrido |
| A 200 % de texto, la columna de montos se corta | 1.4.4 | No |

Decisión: no se publica con «0 violaciones» como evidencia. Se corrige (texto «Vencida» además del color, tabla con encabezados como descripción larga del gráfico, objetivos de 24 px o más, foco visible y no tapado), se añade el escaneo a las pruebas de extremo a extremo y la lista manual a la plantilla de la PR (L6).

Ejemplo para completar: el botón «Exportar» es un ícono sin texto. El alumno identifica el criterio (4.1.2 nombre, rol y valor) y la verificación que lo detecta (lector de pantalla o inspección del nombre accesible).

**Serie intercalada (al final):** cinco barreras para decidir si las detecta un escaneo, una revisión manual o solo una prueba con usuarios.

**Conceptos erróneos frecuentes**

| ID | Creencia errónea | Por qué es errónea | Fuente |
| --- | --- | --- | --- |
| M10-CE07 | «Si el escaneo automático da cero violaciones, la pantalla es accesible.» | Las herramientas no comprueban todo; una parte grande de los problemas exige juicio humano. | [src-w3c-eval-tools][src-github-axe-core][src-gds-a11y-tools-2017] |
| M10-CE08 | «Marcar en rojo las vencidas es suficiente; todos ven el rojo.» | El color no puede ser el único medio de transmitir información. | [src-w3c-wcag22] |
| M10-CE09 | «Un gráfico con `alt` ya tiene alternativa textual.» | Un gráfico complejo necesita una descripción larga con los valores, visible para todos. | [src-w3c-complex-images] |
| M10-CE10 | «Una tabla que se ve bien está bien hecha.» | Sin encabezados marcados, un lector de pantalla no puede asociar cada celda con su encabezado. | [src-w3c-tables-tutorial] |
| M10-CE11 | «La accesibilidad es para un grupo pequeño; en una herramienta interna no hace falta.» | Los criterios ayudan también a quien usa el teléfono con una mano, en movimiento o con el texto ampliado. | [src-w3c-understanding-target-size]; [inferencia] |
| M10-CE12 | «Las herramientas detectan el 57 % de los problemas: esa es la cobertura.» | Es una cifra de proveedor por volumen de problemas; otras métricas dan cifras distintas. | [src-deque-coverage-report][src-gds-a11y-tools-2017] |
| M10-CE13 | «Si el agente dice que la hizo accesible, está verificado.» | Es una afirmación; la evidencia es el escaneo, la revisión manual y las capturas. | [src-playwright-a11y]; [inferencia, M05 L5] |

**Fichas candidatas (máximo dos)**

- *Escaneo automático de accesibilidad en las pruebas* (verificado 2026-10-27): el motor axe-core dice encontrar en promedio el 57 % de los problemas WCAG y devuelve resultados «incompletos» para revisar a mano [src-github-axe-core]; su fabricante basa la cifra en más de 2 000 auditorías propias, contadas por volumen [src-deque-coverage-report]. Playwright lo integra con `AxeBuilder` y etiquetas `wcag2a`, `wcag2aa`, `wcag21a`, `wcag21aa` en su ejemplo, y advierte que muchos problemas solo se descubren a mano [src-playwright-a11y]. La app del curso lo usa en sus pruebas de extremo a extremo (`investigacion/stack-tecnico.md`, `@axe-core/playwright` 4.14). Próxima revisión: 2027-04-27.
- Los criterios de WCAG 2.2 no van en ficha: son una norma estable y van en el cuerpo con cita.

---

### Lección 3 — Implementación y manejo del estado

**Objetivo de lección (→ M10-OE3):** Dado el diseño del estado de una herramienta, decide dónde vive cada dato, identifica qué pone en riesgo los datos del usuario y elige la protección.

**Ideas clave**

- **Cuatro clases de dato, cuatro lugares.** [inferencia, síntesis de src-react-state-structure, src-mdn-client-server y M06 L1]
  - **Derivado:** lo que se puede calcular a partir de otros datos no se guarda; se calcula cada vez. Una guía de interfaces lo pide porque una copia guardada hay que actualizarla en cada lugar que cambia sus entradas, y cualquier olvido las desincroniza [src-react-state-structure]. Cita posible: «Make your state as simple as it can be--but no simpler.» [src-react-state-structure].
  - **De referencia:** los datos verificados que vienen del pipeline (snapshot, `kpis.json`). El cliente los muestra y no los recalcula ni los edita (M06 L1 y L5).
  - **Preferencia:** región elegida, orden de la tabla. Se puede perder sin daño; si se pierde, la app vuelve a un valor por defecto.
  - **Creado por el usuario:** marcas, notas, escenarios guardados. Es lo único que no se puede reconstruir desde otra fuente, y por eso es lo que más cuidado exige.
- **La misma guía da otras reglas útiles para revisar el diseño que propone un agente:** agrupar lo que cambia junto, evitar estados que se contradigan (un único `status` en lugar de dos booleanos que pueden estar en verdadero a la vez), no duplicar el mismo dato en dos lugares (guardar un identificador, no una copia) y evitar el anidamiento profundo [src-react-state-structure].
- **El almacenamiento del navegador es por origen y puede borrarse.** [src-mdn-storage-quotas]
  - Las cuotas y el desalojo se aplican por origen (esquema, dominio y puerto).
  - Por defecto el almacenamiento es de «mejor esfuerzo»: el navegador puede borrarlo sin avisar si el dispositivo se queda sin espacio, y lo borra **entero por origen**, empezando por el usado hace más tiempo.
  - Un navegador borra además los datos creados por scripts de un origen sin interacción del usuario en siete días de uso del navegador (ficha).
  - Con almacenamiento persistente, solo el usuario puede borrarlos desde los ajustes; algunos navegadores lo conceden sin preguntar, según cómo se ha usado el sitio.
  - El usuario siempre puede borrar los datos del sitio, persistentes incluidos; en navegación privada suelen borrarse al cerrar.
  - [inferencia] Consecuencia de diseño: los datos creados por el usuario necesitan una salida (exportar a un archivo) y una entrada (importar), además de pedir almacenamiento persistente.
- **Cambiar el esquema guardado es una migración.** En IndexedDB, la estructura (almacenes e índices) solo se cambia dentro del evento de actualización de versión; cambiar la clave de un almacén exige borrarlo y recrearlo, lo que **borra sus datos**, así que hay que leerlos y guardarlos antes; si otra pestaña tiene abierta la versión anterior, la actualización queda bloqueada hasta que se cierre [src-mdn-indexeddb-using]. Ninguna transacción tiene garantizado terminar, así que cada una debe dejar la base coherente [src-mdn-indexeddb-using]. Una librería de uso común hace la migración atómica: si una función de actualización falla, se revierte todo y la base no queda a medio migrar; las versiones con función de actualización no se modifican una vez publicadas [src-dexie-versioning] (ficha).
- **Una migración se prueba con datos de la versión anterior.** [inferencia, apoyada en src-dexie-versioning y M06 L6] Se guarda un archivo de prueba con una base de la v1 (sintética), se abre con la v2 y se comprueba que cada registro llegó y que una migración que falla deja la v1 intacta. «Funciona en mi navegador» prueba una base vacía, no la de los usuarios.
- **El formato de exportación es un contrato con versión.** [inferencia, apoyada en src-semver-2] El archivo exportado lleva un número de versión de formato; la app nueva sabe leer los formatos anteriores, o dice con claridad que no puede. Es la parte de la app que se parece a una API pública (L4).
- **Lo que se guarda en el dispositivo también es un dato que proteger.** [inferencia, apoyada en AGENTS.md y M01 L5] Notas sobre clientes en un teléfono que se pierde o se comparte son información comercial; la v1 guarda lo mínimo, y nada que sea secreto viaja en el paquete de la app (`dx-b5-02`, ya expuesto).
- **Cálculo y presentación, separados (puente con M06).** El estado de la interfaz nunca es la fuente de una cifra; la cifra viene del contrato verificado [inferencia, M06 L1].
- **Aparte (no evaluable):** el ideal del software *local-first* propone que el trabajo siga accesible durante décadas aunque desaparezca la empresa que lo hizo, y que el usuario conserve el control de sus datos; contrasta con las apps en la nube, que dejan de funcionar si el servicio cierra [src-inkandswitch-local-first]. Sirve para explicar por qué la exportación no es un lujo.

**Ejemplo con Altiplano (para el caso resuelto)**

En la v1 del Pulse, cada gerente puede marcar una oportunidad como «revisada en el uno a uno». El agente propone guardar en el navegador la lista de oportunidades con su monto, su etapa, la cobertura de la región y la marca, «para que cargue rápido».

| Dato | Clase | Decisión |
| --- | --- | --- |
| Monto, etapa, fechas | De referencia | Vienen del snapshot publicado; no se copian al almacenamiento del usuario |
| Cobertura de la región | Derivado (del contrato) | Se lee de `kpis.json`; nunca se guarda ni se recalcula en el cliente |
| Región elegida | Preferencia | Almacenamiento simple; si se pierde, se vuelve a elegir |
| «Revisada» | Creado por el usuario | IndexedDB, con exportación e importación |

En la v2, los gerentes piden que la marca sea por semana («revisada el 19, no el 26»). La clave cambia de `opp_id` a (`opp_id`, `snapshot_date`). Decisión: migración en la actualización de versión que asigna cada marca existente al snapshot del 2026-10-19; prueba con una base sintética de la v1 (tres marcas, una de OPP-1012, la duplicada); si falla, se revierte; el formato de exportación pasa de la versión 1 a la 2 y la app sigue leyendo la 1.

Ejemplo para completar: el agente propone guardar «el total de oportunidades vencidas de mi región» para mostrarlo sin conexión. El alumno decide la clase de dato (derivado del contrato) y qué hacer (mostrar el del último `kpis.json` descargado, con su fecha, sin recalcularlo).

**Conceptos erróneos frecuentes**

| ID | Creencia errónea | Por qué es errónea | Fuente |
| --- | --- | --- | --- |
| M10-CE14 | «Guardar los totales calculados ahorra trabajo.» | Lo derivado se calcula; una copia guardada se desincroniza con sus entradas. | [src-react-state-structure] |
| M10-CE15 | «Lo que la app guarda en el navegador queda ahí para siempre.» | Por defecto es de mejor esfuerzo: el navegador puede borrarlo por espacio, y el usuario siempre puede borrarlo. | [src-mdn-storage-quotas] |
| M10-CE16 | «Si cambio la estructura de la base, los datos viejos se adaptan solos.» | Hay que migrarlos en la actualización de versión; recrear un almacén borra sus datos. | [src-mdn-indexeddb-using] |
| M10-CE17 | «Si la migración funciona en mi navegador, está probada.» | Probaste una base vacía o nueva; hay que probar con datos de la versión anterior y el caso de fallo. | [src-dexie-versioning]; [inferencia] |
| M10-CE18 | «Si una migración falla a la mitad, se puede arreglar después.» | Una migración debe ser atómica: si falla, se revierte y los datos quedan como estaban. | [src-dexie-versioning][src-mdn-indexeddb-using] |
| M10-CE19 | «Sin servidor no hay datos del usuario que proteger.» | Lo que el usuario crea en su dispositivo es lo único que no se puede reconstruir y necesita salida (exportación). | [src-mdn-storage-quotas]; [inferencia] |

**Fichas candidatas (máximo dos)**

- *Persistencia y desalojo por navegador* (verificado 2026-10-27): Chromium permite hasta el 60 % del disco por origen y el navegador usa como máximo el 80 %; Safari borra los datos creados por scripts de un origen sin interacción en siete días de uso si la prevención de rastreo está activa; Firefox muestra un permiso al pedir persistencia, mientras Safari y Chromium deciden sin preguntar; `localStorage` tiene 5 MiB por origen [src-mdn-storage-quotas]. Próxima revisión: 2027-04-27.
- *Migraciones con Dexie* (verificado 2026-10-27): `version(n).stores({...}).upgrade(tx => …)`; si una función de actualización falla, la transacción se revierte y `open()` falla; desde Dexie 3 solo se conservan declaradas las versiones con función de actualización mientras haya usuarios con versiones anteriores [src-dexie-versioning]. La app del curso usa Dexie 4 (`investigacion/stack-tecnico.md`). Próxima revisión: 2027-04-27.

---

### Lección 4 — Despliegue, actualización y continuidad

**Objetivo de lección (→ M10-OE4):** Dado un plan de publicación, elige la cadena que impide publicar si fallan las pruebas, la forma de actualizar sin mezclar versiones ni perder trabajo, el número de versión y el plan de continuidad.

**Ideas clave — publicar**

- **Una app estática es un conjunto de archivos que se puede reconstruir.** [inferencia, apoyada en src-mdn-client-server] El servidor solo entrega archivos; no calcula nada ni guarda nada del usuario. Por eso se puede reconstruir desde el repositorio y publicar en otro lado. Nada secreto puede ir en esos archivos (`dx-b5-02`; [src-vite-env]).
- **Construir y desplegar son pasos separados, y el segundo espera al primero.** Un flujo documentado de publicación tiene un trabajo que construye y sube el resultado y otro que lo despliega; el despliegue declara que necesita al de construcción, y omitirlo puede dejar un despliegue esperando un resultado que nunca se creó [src-ghdocs-custom-workflows]. Ese despliegue usa un entorno con reglas de protección [src-ghdocs-custom-workflows].
- **Las pruebas van antes de publicar, y si fallan no se publica.** [inferencia, apoyada en src-ghdocs-custom-workflows, src-github-status-checks y M04 L5] Si la construcción corre las pruebas, `reconcile.py` y el escaneo de accesibilidad, y el despliegue depende de ella, un fallo detiene la publicación. Recuerda de M04 L5 que un check omitido cuenta como éxito: el paso de pruebas no puede ser opcional [src-github-status-checks]. La app del curso funciona así (D-029; ficha).

**Ideas clave — actualizar**

- **En una PWA, la versión nueva espera.** El *service worker* nuevo se instala y queda en espera mientras el viejo controle alguna pestaña, para que corra una sola versión a la vez; recargar no basta, porque la página vieja sigue activa hasta que llega la nueva respuesta [src-webdev-sw-lifecycle]. El navegador busca actualizaciones al navegar dentro del alcance y considera nueva una versión si sus bytes cambiaron [src-webdev-sw-lifecycle].
- **Forzar el cambio puede mezclar versiones.** Activar de inmediato el *service worker* nuevo hace que tome páginas cargadas con la versión vieja: algunas peticiones las atiende el viejo y otras el nuevo, lo que puede romper la app [src-webdev-sw-lifecycle][src-webdev-pwa-update]. Instalar una versión nueva no borra lo que la anterior dejó en caché; hay que limpiarlo [src-webdev-pwa-update]. Cita posible: «Installing a new service worker version doesn't automatically remove previously cached assets.» [src-webdev-pwa-update].
- **Avisar y dejar elegir.** La guía recomienda avisar que hay una actualización lista y dejar que el usuario decida cuándo aplicarla, por ejemplo con un aviso en la página [src-webdev-pwa-update]. [inferencia] Así nadie pierde lo que estaba haciendo en medio de una tarea; la app guarda el estado antes de recargar (puente con L3).
- **Mantener la misma dirección del *service worker*.** Darle una URL distinta a cada versión puede atrapar a los usuarios: el viejo sirve un HTML en caché que apunta al nuevo, y el nuevo nunca se instala [src-webdev-sw-lifecycle].
- **La versión visible y la fecha del dato.** [inferencia, apoyada en src-nngroup-heuristics] La app muestra su número de versión y la fecha del snapshot, para que un usuario pueda decir «estoy en la 1.3.0 con datos del 19» cuando reporta algo.
- **SemVer, y qué es la «API pública» de una app.** SemVer usa MAYOR.MENOR.PARCHE: mayor para cambios incompatibles, menor para funciones compatibles, parche para correcciones compatibles; exige declarar la API pública; la versión 0.y.z es de desarrollo inicial; una versión publicada no se modifica; lo obsoleto se anuncia en una versión menor antes de quitarlo en una mayor [src-semver-2]. [inferencia] En una herramienta como el Pulse, lo que otros consumen es el contrato de datos (`kpis.json`) y el formato de exportación (L3): un cambio incompatible ahí es una versión mayor aunque la pantalla casi no cambie.

**Ideas clave — continuidad**

- **Si el hosting cambia o cae.** [inferencia] Una app estática se puede volver a publicar en otro proveedor con el mismo flujo, si el runbook dice cómo y alguien lo probó. Lo que no se muda solo son los datos de los usuarios: el almacenamiento del navegador es por origen [src-mdn-storage-quotas], así que una dirección nueva empieza vacía. Mudarse exige un plan: exportación en la versión vieja, importación en la nueva, aviso a los usuarios y un periodo en que las dos direcciones conviven.
- **Leer los términos y límites del hosting antes de depender de él.** [inferencia] Un servicio gratuito de páginas estáticas, por ejemplo, documenta límites de tamaño y tráfico, prohíbe usos comerciales y no menciona garantías de disponibilidad (ficha) [src-ghdocs-limits]. Para una herramienta de una empresa, la elección de hosting es una decisión que se registra (ADR, M03 L5) y se revisa.
- **Respaldos: tres copias, dos medios, una fuera, y restauración probada.** La guía de una agencia pública de ciberseguridad recomienda tres copias de los datos importantes en dos tipos de almacenamiento, con una fuera del sitio; respaldos automáticos; copias sin conexión; y probar con regularidad que se puede restaurar, total y parcialmente [src-cisa-backup-business]. Cita posible: «Choose a backup solution that runs automatically and regularly.» [src-cisa-backup-business]. [inferencia] En el Pulse se respaldan el repositorio (código, contenido, pruebas, ADR) y los datos de entrada sintéticos; los datos de cada usuario se respaldan con su exportación. Un respaldo que nunca se restauró es una suposición.
- **El runbook de recuperación.** [inferencia, apoyada en la conducta de C13 y M05 L6] Pasos que otra persona puede seguir para reconstruir, publicar y volver a la versión anterior, con cómo verificar cada paso. Se prueba al menos una vez con alguien que no lo escribió.

**Ejemplo con Altiplano (para el caso resuelto)**

El agente propone publicar el Pulse en cada push a `main` «sin esperar las pruebas, para que los datos lleguen antes del lunes» y activar de inmediato cada versión nueva «para que nadie vea datos viejos».

Decisiones:

1. **Cadena:** contenido → pruebas unitarias → `reconcile.py` sobre `kpis.json` → escaneo de accesibilidad → compilación → despliegue, que depende de la compilación. Si `reconcile.py` da código 1, no se publica y el Pulse sigue mostrando el snapshot anterior, con su fecha.
2. **Actualización:** aviso «Hay datos nuevos (snapshot del 2026-10-26). Recargar». No se activa de golpe: un gerente que está en medio del uno a uno no ve cambiar las cifras bajo sus ojos. Al recargar, la marca «revisada» ya está guardada (L3).
3. **Versión:** la 1.3.0 agrega la vista de sin actividad (menor); la 2.0.0 cambia el formato de exportación de las marcas (mayor, L3: la 2.0.0 lee los archivos de la 1.x, pero un archivo exportado con la 2.0.0 no lo lee una 1.x).
4. **Continuidad:** runbook de una página (reconstruir, publicar en otro proveedor, volver a la versión anterior), probado por un compañero de Tesorería; repositorio respaldado en tres lugares, con una restauración de prueba registrada.

Ejemplo para completar: una corrección del texto de un encabezado de la tabla, sin cambios en datos ni formatos. El alumno elige el número de versión (parche) y si hace falta avisar a los usuarios antes de recargar (no es urgente; el aviso estándar basta).

**Conceptos erróneos frecuentes**

| ID | Creencia errónea | Por qué es errónea | Fuente |
| --- | --- | --- | --- |
| M10-CE20 | «Es mejor publicar rápido y correr las pruebas después.» | El despliegue depende de la construcción, y las pruebas dentro de ella impiden publicar algo roto. | [src-ghdocs-custom-workflows]; [inferencia] |
| M10-CE21 | «Para que todos tengan la última versión, conviene activarla de inmediato.» | Puede mezclar versiones en una página abierta; la guía recomienda avisar y dejar elegir cuándo recargar. | [src-webdev-sw-lifecycle][src-webdev-pwa-update] |
| M10-CE22 | «Al recargar, el usuario ya tiene la versión nueva.» | La nueva espera hasta que ninguna pestaña use la vieja. | [src-webdev-sw-lifecycle] |
| M10-CE23 | «Si la pantalla casi no cambió, es una versión menor o un parche.» | Lo que decide es la compatibilidad de lo que otros consumen (contrato, formato de exportación). | [src-semver-2]; [inferencia] |
| M10-CE24 | «Una app estática se muda copiando los archivos, con todo lo de los usuarios.» | El almacenamiento del navegador es por origen: en la dirección nueva empieza vacío. | [src-mdn-storage-quotas]; [inferencia] |
| M10-CE25 | «Tener respaldo es tener una copia.» | El respaldo vale si hay varias copias, una fuera, y se probó la restauración. | [src-cisa-backup-business] |

**Fichas candidatas (máximo dos)**

- *Hosting de páginas estáticas de GitHub* (verificado 2026-10-27): sitio publicado de hasta 1 GB; 100 GB al mes de tráfico (límite blando); 10 compilaciones por hora, salvo con flujo propio de Actions; despliegues que fallan si duran más de 10 minutos; respuesta 429 al limitar; no está pensado para alojar un negocio, comercio o software como servicio, ni para transacciones sensibles; la página de límites no menciona garantías de disponibilidad [src-ghdocs-limits]. Con flujo propio: trabajo de construcción, `upload-pages-artifact`, trabajo de despliegue con `deploy-pages`, `needs: build`, permisos `pages: write` e `id-token: write` y entorno `github-pages` [src-ghdocs-custom-workflows]. La app del curso se publica así, con pruebas antes de compilar (D-029). Próxima revisión: 2027-01-27.
- *Actualización de una PWA instalada según la plataforma* (verificado 2026-10-27): cambiar el `id` del manifiesto hace que el navegador la trate como otra app; Safari en iOS/iPadOS y los navegadores de Android exigen reinstalar para tomar metadatos nuevos del manifiesto; Chrome en Android actualiza con su propio algoritmo al abrir la app; Chrome y Edge de escritorio revisan el manifiesto al iniciar si no lo hicieron en 24 horas [src-webdev-pwa-update] (página de 2022: verificar antes de publicar). Próxima revisión: 2027-01-27.

---

### Lección 5 — Documentación, evidencias y responsabilidad sobre lo entregado

**Objetivo de lección (→ M10-OE5):** Dada una entrega con su documentación, elige qué documento sirve a cada lector, identifica limitaciones y supuestos que faltan y decide quién responde y con qué evidencia.

**Ideas clave — documentación por lector**

- **Cuatro necesidades, cuatro formas.** Diátaxis distingue tutoriales (aprender haciendo), guías prácticas (cumplir un objetivo real, para alguien que ya sabe), referencia (datos técnicos exactos para trabajar) y explicación (contexto y porqués); los dos primeros son de acción y los dos últimos de conocimiento, y tutorial y explicación sirven al estudio mientras guía y referencia sirven al trabajo [src-diataxis]. Mezclar las formas está en el origen de muchos problemas; por ejemplo, un tutorial cargado de explicaciones distrae de la lección [src-diataxis]. Cita posible: «Diátaxis identifies four distinct needs, and four corresponding forms of documentation.» [src-diataxis].
- **Quien usa y quien mantiene leen cosas distintas.** [inferencia, apoyada en src-diataxis y src-github-about-readmes]
  - El gerente necesita una **guía práctica** de una página («cómo preparar el uno a uno con el Pulse») y la **referencia** de qué significa cada indicador (la definición del contrato de KPI, no una paráfrasis).
  - Quien mantiene necesita el **README**: qué hace, cómo correrlo, cómo probarlo, cómo publicarlo y cómo recuperarlo; el **runbook** (L4); el **registro de decisiones** (M03 L5) y el **registro de cambios** (M09 L6).
- **Qué responde un README.** Lo que hace el proyecto, por qué es útil, cómo empezar, dónde pedir ayuda y quién lo mantiene [src-github-about-readmes]. Una guía de la comunidad agrega instalación con requisitos, uso con ejemplos y su salida esperada, cómo correr las pruebas, licencia y estado del proyecto (si se dejó de mantener, decirlo arriba) [src-makeareadme] (fuente secundaria, de convención).
- **El registro de decisiones guarda el porqué.** Título, contexto, decisión, estado y consecuencias; las decisiones revertidas se conservan marcadas como reemplazadas, numeradas, en el repositorio [src-nygard-adr] (ya enseñado en M03 L5; aquí se usa para decisiones de producto: hosting, qué quedó fuera de la v1 y por qué).

**Ideas clave — limitaciones y supuestos**

- **Declarar el uso previsto y los límites.** Las fichas de modelos se propusieron para documentar el uso previsto, el desempeño en distintas condiciones y cómo se evaluó, para que un modelo no se use donde no sirve [src-arxiv-model-cards]. [inferencia] La analogía vale para una herramienta: para qué decisión sirve, con qué datos, de qué fecha, qué no hace y qué supuestos de negocio aplica (política de probabilidades de FP&A, tipo de cambio fijo, etapas excluidas). En el Pulse: «datos del snapshot semanal, no en tiempo real», «montos en EUR convertidos con la tasa del snapshot», «"En pausa" se excluye del ponderado hasta que FP&A fije su probabilidad», «no es un forecast».
- **Un supuesto no declarado se convierte en un error de otro.** [inferencia, puente con M02 L2] Si la guía no dice que las cifras son del lunes a las 8:00, un gerente que la abre el jueves cree que ve el jueves.

**Ideas clave — evidencia y responsabilidad**

- **Quien aprueba responde.** [inferencia, apoyada en src-anthropic-cc-security, src-github-copilot-agents-responsible y src-openai-codex-security] Las documentaciones de tres agentes de código coinciden en el fondo: una dice que el usuario es responsable de revisar el código y los comandos propuestos antes de aprobarlos [src-anthropic-cc-security]; otra, que hay que revisar a fondo todo lo que genera el agente antes de fusionarlo, y advierte que su código puede parecer válido y estar mal o tener vulnerabilidades [src-github-copilot-agents-responsible]; la tercera pide tratar las sugerencias del agente como cualquier otra PR [src-openai-codex-security]. Cita posible: «You're responsible for reviewing proposed code and commands for safety before approval.» [src-anthropic-cc-security]. Que el código lo haya escrito un agente no cambia quién responde ante los usuarios: la persona dueña de la herramienta (ficha).
- **La entrega va con su evidencia.** [inferencia, síntesis de M02 L6, M04 L6, M09 y L2-L4] Un paquete breve y fechado: resultado de las pruebas y de `reconcile.py`, escaneo de accesibilidad y lista manual, resultado de la regresión, hallazgos de la revisión independiente con su estado (L6), versión publicada y fecha del dato. «El agente dice que todo pasa» no es evidencia.
- **Licencias: la propia y las de las dependencias.** Sin licencia, un repositorio queda bajo derechos de autor por defecto: otros no pueden reproducirlo ni distribuirlo, aunque en un repositorio público puedan verlo y bifurcarlo [src-github-licensing-repo]. Cita posible: «you retain all rights to your source code» [src-github-licensing-repo]. Cada dependencia trae su propia licencia; hay revisiones automáticas que muestran, en la PR, las dependencias agregadas con sus vulnerabilidades y su licencia, y que pueden bloquear la fusión según listas de licencias permitidas o prohibidas (ficha) [src-github-dependency-review]. [inferencia] Una dependencia nueva que propone un agente se revisa por tres cosas: que exista y sea la que crees (M04 L3), que haga falta y que su licencia sea compatible con el uso.

**Ejemplo con Altiplano (para el caso resuelto)**

El agente entregó un README de 600 líneas que mezcla instalación, una explicación de qué es el pipeline ponderado, la lista de columnas del snapshot y un recorrido para gerentes; promete «datos en tiempo real»; no dice cómo volver a la versión anterior ni quién mantiene la herramienta.

| Contenido | Destino |
| --- | --- |
| Cómo correr, probar, publicar y recuperar | README para mantenedores, con el runbook enlazado |
| Recorrido «prepara tu uno a uno en cinco pasos» | Guía práctica de una página para gerentes |
| Definición de cada indicador | Referencia, copiada del contrato de KPI |
| Por qué el ponderado usa la política de FP&A | Explicación breve, enlazada desde la referencia |
| Por qué las notas compartidas quedaron fuera | Registro de decisiones |
| «Datos en tiempo real» | Se corrige: «snapshot semanal, fecha visible en la pantalla» |

Se agregan las limitaciones (arriba de la guía y del README), el responsable (la analista, con un suplente) y el paquete de evidencia de la versión 1.3.0.

Ejemplo para completar: un gerente pregunta por qué una oportunidad en EUR muestra un monto distinto del CRM. El alumno decide en qué documento debería estar la respuesta (referencia: conversión a USD con la tasa del snapshot) y qué limitación faltaba declarar.

**Serie intercalada (al final):** cinco piezas de información para decidir el documento (guía, README, referencia, explicación, registro de decisiones).

**Conceptos erróneos frecuentes**

| ID | Creencia errónea | Por qué es errónea | Fuente |
| --- | --- | --- | --- |
| M10-CE26 | «Un README completo sirve para todos.» | Usuarios y mantenedores tienen necesidades distintas; mezclar formas confunde a ambos. | [src-diataxis]; [inferencia] |
| M10-CE27 | «Las limitaciones se explican si alguien pregunta.» | El uso previsto y los límites se declaran para que la herramienta no se use donde no sirve. | [src-arxiv-model-cards]; [inferencia] |
| M10-CE28 | «Si el código lo escribió el agente, la responsabilidad es del proveedor.» | Las documentaciones de los agentes ponen la revisión y la aprobación en quien los usa. | [src-anthropic-cc-security][src-github-copilot-agents-responsible] |
| M10-CE29 | «Un repositorio público se puede reutilizar libremente.» | Sin licencia rigen los derechos de autor por defecto. | [src-github-licensing-repo] |
| M10-CE30 | «El reporte del agente es la evidencia de la entrega.» | La evidencia son los resultados de las pruebas, la reconciliación, la accesibilidad y la revisión, con fecha. | [inferencia, M02 L6, M04 L6] |

**Fichas candidatas (máximo dos)**

- *Responsabilidad sobre el código del agente según cada proveedor* (verificado 2026-10-27): Claude Code: el usuario es responsable de revisar el código y los comandos propuestos antes de aprobarlos, y una lista de buenas prácticas que empieza por revisar los cambios sugeridos [src-anthropic-cc-security]. GitHub Copilot (agentes): revisar a fondo todo lo generado antes de fusionar; limitaciones listadas: código inexacto, riesgos de seguridad, coincidencias con código público, calidad variable por lenguaje [src-github-copilot-agents-responsible]. Codex: tratar sus sugerencias como cualquier PR; la página no dice explícitamente que el usuario es responsable [src-openai-codex-security]. Próxima revisión: 2027-01-27.
- *Revisión de dependencias en la PR* (verificado 2026-10-27): muestra dependencias agregadas, quitadas o actualizadas (incluidas las indirectas en archivos de bloqueo), sus vulnerabilidades conocidas y licencias; la acción falla por defecto ante paquetes vulnerables y, si el check es obligatorio, bloquea la fusión; admite listas de licencias permitidas o prohibidas; disponible en repositorios públicos y en privados con productos de seguridad de pago [src-github-dependency-review]. Próxima revisión: 2027-04-27.

---

### Lección 6 — Mantenimiento: instrucciones y skills como código, regresión, calendario y cierre de hallazgos

**Objetivo de lección (→ M10-OE6):** Dado un cambio o un hallazgo de revisión, decide qué se vuelve a probar y quién revisa, propone el calendario según la volatilidad de cada pieza y decide cuándo un hallazgo está cerrado y cuándo se reabre.

**Ideas clave — lo que cambia sin que nadie toque el código**

- **Una herramienta hecha con agentes tiene más piezas que cambian.** [inferencia] Además del código: las instrucciones del agente (AGENTS.md y equivalentes), las skills, el modelo que usan, las dependencias, los datos de entrada, el hosting y las fichas de producto. Cada una cambia a su ritmo y por razones ajenas al proyecto.
- **Instrucciones y skills: versionadas, revisadas y probadas.** M03 L2 enseñó que las instrucciones se versionan, se revisan y se podan, y M03 L4 que la activación de una skill se prueba [src-anthropic-cc-best-practices][src-agentskills-descriptions]. Lo nuevo en M10 es probar lo que la skill **produce** cada vez que cambia:
  - Una guía del formato propone casos con una consulta realista, una descripción de la salida esperada y archivos de entrada, guardados junto a la skill; cada caso se corre con la skill y sin ella o, al mejorar una skill existente, con la versión anterior como línea base; cada corrida empieza en un contexto limpio; las aserciones verificables se califican con código y el resto con revisión humana [src-agentskills-evaluating].
  - Otra guía pide crear las evaluaciones antes de escribir documentación extensa, empezar con al menos tres escenarios y probar la skill con todos los modelos con que se usará [src-anthropic-skills-bp].
  - [inferencia] Por eso un cambio en una skill o en AGENTS.md es un cambio de comportamiento: dispara sus evaluaciones y la regresión, y pasa por PR como el código (M04 L6).
- **El modelo también se retira.** Los proveedores retiran modelos con aviso; uno da al menos 60 días antes del retiro de un modelo publicado y recomienda probar las aplicaciones con el reemplazo mucho antes de la fecha, porque las peticiones a un modelo retirado fallan (ficha) [src-anthropic-model-deprecations]. [inferencia] Cambiar de modelo obliga a volver a correr las evaluaciones (M09 L6, «cuándo volver a correr»); el calendario anota la fecha de retiro del modelo en uso.
- **Las dependencias se actualizan, y eso es mantenimiento normal.** Una guía pública sobre gestión de parches describe el parcheo como mantenimiento preventivo y como un costo esperado de operar, que ayuda a prevenir incidentes [src-nist-sp800-40r4]. Hay servicios que abren PR de actualización automáticamente, por rutina o ante una vulnerabilidad conocida; esas PR se revisan y pasan las pruebas como cualquier otra (ficha) [src-github-dependabot-version-updates][src-github-dependabot-security-updates]. [inferencia] Una actualización mayor de una librería de gráficos puede pasar las pruebas de cifras y romper la alternativa textual del gráfico: por eso el escaneo de accesibilidad está en la suite (L2).

**Ideas clave — disparadores y calendario**

- **Disparadores: qué cambio obliga a qué prueba.** [inferencia, síntesis de M09 L6 y de esta lección]

  | Cambio | Qué se vuelve a correr | Quién revisa |
  | --- | --- | --- |
  | Código o interfaz | Pruebas, `reconcile.py`, escaneo de accesibilidad, lista manual si cambia la pantalla | Alguien distinto de quien encargó el cambio (M04 L6) |
  | AGENTS.md o una skill | Evaluaciones de la skill contra su versión anterior; regresión | Ídem, con las salidas a la vista |
  | Modelo o su versión | Evaluaciones y regresión completas, antes de la fecha de retiro | Ídem |
  | Dependencia | Pruebas completas; revisión de licencia y de cambios incompatibles | Ídem |
  | Esquema de datos o formato de exportación | Prueba de migración con datos de la versión anterior (L3) | Ídem |
  | Hosting o dominio | Runbook de publicación y plan de mudanza de datos (L4) | Ídem |

- **Calendario por volatilidad.** [inferencia, apoyada en la convención de próxima revisión de este curso y en src-anthropic-model-deprecations] Lo que no tiene un disparador claro se revisa con fecha: fichas de producto muy volátiles, cada trimestre; dependencias, cada mes (con las PR automáticas) y de inmediato ante una alerta de seguridad; fecha de retiro del modelo en uso, en cada revisión trimestral; términos del hosting y respaldo con restauración de prueba, cada año o cada semestre; accesibilidad completa con usuarios, en cada cambio grande de interfaz. El calendario tiene un responsable y vive en el repositorio, no en la memoria de alguien.
- **El calendario también caduca.** [inferencia] Si una pieza cambió dos veces entre revisiones, su frecuencia era baja; si nunca cambió en un año, puede espaciarse.

**Ideas clave — revisión independiente y cierre de hallazgos**

- **La revisión independiente ya se enseñó (M09 L6).** Aquí se decide qué hacer con lo que encuentra.
- **Un hallazgo cerrado tiene evidencia, no solo un estado.** [inferencia, síntesis apoyada en src-github-dependabot-alerts, src-nygard-adr y M09 L2] Tres salidas válidas:
  1. **Corregido:** el cambio que lo corrige, la prueba que antes fallaba y ahora pasa, y un caso que entra a la regresión para que no vuelva (M09 L2); si cambió el comportamiento, una entrada en el registro de cambios [src-keepachangelog].
  2. **Riesgo aceptado:** motivo, responsable, fecha y condición que lo haría reabrir. Las herramientas de alertas de dependencias, por ejemplo, piden un motivo al descartar una alerta, guardan un comentario visible en su historia y registran quién, qué y cuándo para auditoría; una alerta descartada se puede reabrir mientras no esté corregida [src-github-dependabot-alerts].
  3. **No es un hallazgo:** con la explicación de por qué (el revisor leyó mal, el comportamiento es el especificado).
- **Quién cierra.** [inferencia, apoyada en src-github-reviewing-prs y src-github-codeowners] Quien corrige no es el único que da por cerrado: lo confirma quien lo encontró o un responsable designado. En un repositorio se puede exigir la aprobación de los responsables de ciertos archivos antes de fusionar (ficha posible en M04; no se repite) [src-github-codeowners].
- **Cuándo se reabre.** [inferencia] Cuando cambia la condición que justificó aceptarlo (más usuarios, otro hosting, datos más sensibles) o cuando el problema reaparece. Un riesgo aceptado sin condición de reapertura es un riesgo olvidado.

**Caso de transferencia (currículo): el plan de mantenimiento de AI School**

La app de este curso tiene contenido con fichas fechadas (con próxima revisión), un flujo que no publica si fallan las pruebas (D-029), un revisor independiente para cada manual (Codex, D-003) y decisiones registradas (`docs/decisions.md`). El alumno puede leerlo como un plan real: qué dispara una revisión, qué tiene fecha y cómo se cierra un hallazgo (las entregas de los tickets de Codex y su cierre en `ESTADO.md`). [inferencia] Las afirmaciones concretas sobre la app (versiones, flujo) van en fichas, no en el cuerpo.

**Ejemplo con Altiplano (para el caso resuelto)**

La revisión independiente de la versión 1.3 del Pulse devuelve seis hallazgos (a redactar por el autor; aquí los tipos):

| Hallazgo | Severidad | Cierre propuesto por el equipo | Decisión |
| --- | --- | --- | --- |
| H1. La skill `actualizar-snapshot` cambió la semana pasada y nadie corrió sus evaluaciones | Alta | «La skill funciona, la usamos el lunes» | Abierto: correr sus casos contra la versión anterior; si pasan, cerrar con el resultado adjunto |
| H2. El modelo que usa la skill se retira en 45 días | Alta | «Lo cambiamos cuando falle» | Abierto: evaluaciones con el reemplazo ahora; fecha en el calendario |
| H3. La exportación de marcas no tiene prueba de importación | Media | Corregido con una prueba de ida y vuelta | Cerrado: la prueba falla con el código viejo y pasa con el nuevo; entra a la regresión |
| H4. Contraste 3,9:1 en la etiqueta «sin actividad» | Media | «Se ve bien» | Abierto: 1.4.3 pide 4,5:1; se corrige y se verifica |
| H5. Una dependencia de gráficos tiene tres versiones mayores de atraso | Baja | Riesgo aceptado hasta el próximo trimestre | Cerrado como riesgo aceptado: motivo (sin vulnerabilidad conocida), responsable, fecha y condición de reapertura (alerta de seguridad) |
| H6. «El README es largo» | Baja | — | No es un hallazgo de corrección; se anota como sugerencia (M05 L5: reportar solo lo que afecta a la corrección) |

Ejemplo para completar: una PR automática actualiza la librería de gráficos a una versión mayor; las pruebas de cifras pasan. El alumno decide qué más debe correr antes de fusionar (escaneo de accesibilidad y la lista manual del gráfico, revisión de la licencia) y quién lo aprueba.

**Conceptos erróneos frecuentes**

| ID | Creencia errónea | Por qué es errónea | Fuente |
| --- | --- | --- | --- |
| M10-CE31 | «Si no cambió el código, no hay que volver a probar.» | Cambian las instrucciones, las skills, el modelo, las dependencias y los datos, y cada cambio altera el comportamiento. | [src-agentskills-evaluating][src-anthropic-model-deprecations]; [inferencia] |
| M10-CE32 | «Una skill se prueba una vez, cuando se crea.» | Cada cambio se evalúa contra la versión anterior como línea base, y con cada modelo que se usará. | [src-agentskills-evaluating][src-anthropic-skills-bp] |
| M10-CE33 | «El modelo se cambia cuando el proveedor lo retire.» | Las peticiones a un modelo retirado fallan; se prueba el reemplazo mucho antes de la fecha. | [src-anthropic-model-deprecations] |
| M10-CE34 | «Las actualizaciones de dependencias son opcionales si todo funciona.» | El parcheo es mantenimiento preventivo y un costo esperado de operar. | [src-nist-sp800-40r4] |
| M10-CE35 | «Una PR automática de actualización se puede fusionar sin revisar si las pruebas pasan.» | Se revisa como cualquier cambio; las pruebas pueden no cubrir lo que rompe (accesibilidad, licencia). | [src-github-dependabot-version-updates]; [inferencia] |
| M10-CE36 | «Un hallazgo está cerrado cuando alguien lo marca como cerrado.» | Se cierra con evidencia de la corrección o con un riesgo aceptado con motivo, responsable, fecha y condición de reapertura. | [src-github-dependabot-alerts]; [inferencia] |
| M10-CE37 | «Un riesgo aceptado ya no hay que mirarlo.» | Se reabre cuando cambia la condición que lo justificó. | [inferencia] |

**Fichas candidatas (máximo dos)**

- *Actualizaciones automáticas de dependencias en GitHub* (verificado 2026-10-27): las de versión se configuran en `dependabot.yml`, abren PR con resumen de cambios y notas, también actualizan las acciones de los flujos y esperan por defecto 3 días tras una publicación antes de proponerla (`cooldown`, que no aplica a las de seguridad) [src-github-dependabot-version-updates]; intervalos `daily` a `yearly` o `cron`, máximo de 5 PR de versión abiertas por defecto (10 fijas para seguridad), agrupación con `groups` [src-github-dependabot-options]; las de seguridad abren PR solo si hay versión corregida y no siempre pueden actualizar dependencias indirectas [src-github-dependabot-security-updates]; al descartar una alerta se elige un motivo, se puede comentar, queda en el registro de auditoría y se puede reabrir si no está corregida [src-github-dependabot-alerts]. Observación: el repositorio de la app del curso no tiene `dependabot.yml` al 2026-10-27. Próxima revisión: 2027-01-27.
- *Retiro de modelos* (verificado 2026-10-27): Anthropic distingue modelos activos, heredados, obsoletos (con reemplazo y fecha de retiro) y retirados (las peticiones fallan); avisa con al menos 60 días para modelos publicados; por ejemplo, `claude-sonnet-4-5-20250929` se anunció obsoleto el 2026-09-30 con retiro el 2026-11-30 [src-anthropic-model-deprecations]. OpenAI anunció el 2026-06-03 el cierre de su plataforma de Evals el 2026-11-30 [src-openai-deprecations]. Próxima revisión: 2026-12-01 (las dos fechas citadas vencen antes de la revisión trimestral).

---

## 4. Qué NO enseñar o enseñar con cautela

| Tema | Decisión | Motivo |
| --- | --- | --- |
| Un framework de interfaz, una librería de estado o de almacenamiento concreta (React, Dexie, Workbox) | No enseñar su API; solo fichas y ejemplos de principio | El alumno decide y revisa; no programa. El principio (derivado no se guarda, migración atómica) vale para cualquiera [src-react-state-structure][src-dexie-versioning] |
| Recitar los 86 criterios de WCAG | No; enseñar los diez o doce que pesan en una app de datos, con su nivel | Basta para revisar lo que hace un agente [src-w3c-wcag22] |
| Las cifras de cobertura de escaneo (57 %, 37 %, 71 %, 20-30 %) como respuesta de examen | Cautela: con fuente, año y métrica; evaluar solo la idea «un escaneo en verde no basta» | Miden cosas distintas; una es de proveedor [src-deque-coverage-report][src-gds-a11y-tools-2017] |
| Diseño visual (tipografía, paleta, marca) | No | Fuera del perfil; la app del curso lo resuelve con su sistema de diseño (Codex) |
| Investigación de usuarios con métodos formales (encuestas, análisis estadístico, pruebas de usabilidad moderadas) | Mencionar como Aparte; evaluar solo «hablar con quienes la usarán y probar el supuesto más riesgoso» | El alumno no es investigador [src-govuk-user-needs][src-govuk-alpha] |
| Aspectos legales de licencias (compatibilidad entre licencias, cesión de derechos del código generado por IA) | No dar consejo legal; solo «sin licencia rigen los derechos de autor» y «revisar la licencia de cada dependencia» | La propia fuente advierte que no es asesoría legal [src-github-licensing-repo] |
| Detalles de *service worker* (eventos, `skipWaiting`, `clientsClaim`, estrategias de caché) | Cautela: evaluar la decisión (avisar y dejar elegir; no mezclar versiones), no los nombres de las API | Son de quien implementa [src-webdev-sw-lifecycle][src-webdev-pwa-update] |
| Sincronización entre dispositivos y CRDT | Aparte, desde el ensayo *local-first* | El Pulse v1 deja fuera lo compartido [src-inkandswitch-local-first] |
| SLA y disponibilidad de un proveedor concreto | No afirmar garantías que la página no da | La página de límites no menciona garantías [src-ghdocs-limits] |
| Repetir escenarios ya usados: `dx-b5-02` (clave privada en app estática), «En pausa» como giro, la conciliación del viernes, el memo de riesgos, el asistente de consultas de M09, el comentario v1/v2, el cambio de modelo en Contraloría (M09 L6) | Prohibido como escenario central o giro de M10 | Ya expuestos en el diagnóstico y en M02-M09 |
| Volver a definir regresión, registro de cambios, ADR, checks de CI o independencia | No; citarlos como ya vistos y decidir sobre ellos | Ya enseñados (M03, M04, M09) |
| Cualquier URL, token, dato o servicio real | Prohibido | AGENTS.md: datos sintéticos siempre; dominios `*.example` |

---

## 5. Propuesta de laboratorio: el simulador de descuentos

Caso práctico por pasos, de opción múltiple (D-024, estándar §5). Sin entregable, rúbrica ni registro de evidencias. Dos preguntas por paso, cada una ligada a un objetivo evaluado; en total, dos por objetivo. Responde a la práctica del currículo («entregar una herramienta pequeña con datos sintéticos») recorriendo las decisiones de entregarla.

**Por qué es un caso nuevo.** No usa el Pulse de oportunidades ni ninguno de sus ejemplos de §3 (pedido del director, pantalla de la región, marca «revisada», publicación del Pulse, README de 600 líneas, hallazgos H1-H6). Sus usuarios no son los gerentes ni el comité, sino los **vendedores en la calle**; sus datos no son el snapshot de oportunidades, sino una **lista de precios y una política de descuentos**. Tampoco repite los laboratorios de M01 a M09 (semana de cierre, especificación del dashboard, repositorio del presupuesto, etapa que dejó de estar cerrada, alertas de cobranza, oportunidades en pausa, informe del lunes con el CRM, memo de riesgos, asistente de consultas).

**Historia.** Los vendedores de Altiplano llaman a su gerente regional cada vez que un cliente pide un descuento, para saber si pueden darlo. El director comercial pide «una app para que los vendedores den descuentos sin llamar a nadie». La analista de FP&A la construirá con un agente y quiere que la usen y que alguien pueda mantenerla.

**Materiales (a construir por el autor, todos sintéticos):**

- `price_list_2026-11.csv`: unos 40 productos con código, descripción, costo y precio de lista en USD (datos ficticios). Dos filas de referencia, ya calculadas con `m10_figures.py`:
  - BOM-220 (bomba centrífuga): precio de lista 12 400, costo 8 680 → margen de lista 30,00 %.
  - VAL-045 (válvula): precio de lista 1 850, costo 1 110.
- `discount_policy.md` (política de FP&A, ficticia): hasta 8 % decide el vendedor; de más de 8 % a 15 %, aprueba el gerente regional; más de 15 %, aprueba la dirección comercial; en todos los casos, el margen después del descuento debe ser al menos 22 %.
- Tabla de 40 casos calculados por FP&A con su propia planilla (el camino independiente, M06 L6). Filas de referencia (salida de `m10_figures.py`):

  | Caso | Descuento | Precio final | Margen | Banda | ¿Margen ≥ 22 %? |
  | --- | --- | --- | --- | --- | --- |
  | BOM-220 | 8 % | 11 408,00 | 23,91 % | vendedor | sí |
  | BOM-220 | 10 % | 11 160,00 | 22,22 % | gerente regional | sí |
  | BOM-220 | 12 % | 10 912,00 | 20,45 % | gerente regional | **no** |
  | BOM-220 | 16 % | 10 416,00 | 16,67 % | dirección comercial | **no** |
  | VAL-045 | 15 % | 1 572,50 | 29,41 % | gerente regional | sí |
  | VAL-045 | 18 % | 1 517,00 | 26,83 % | dirección comercial | sí |
  | Límite (lista 10 000, costo 7 020) | 10 % | 9 000,00 | 22,00 % | gerente regional | sí (exacto en el umbral) |

- Notas de cuatro entrevistas a vendedores, la pantalla del agente con su reporte, el plan de estado, el flujo de publicación, la documentación del agente y el aviso de TI del paso 6 (a redactar). Los porcentajes de comportamiento (descuentos fuera de política, tiempos de espera) son **datos ficticios del caso**.

### Paso 1 · El pedido {#paso-1}

Material: el pedido del director («app con cotización en PDF, conexión al CRM y un chat con IA que negocie con el cliente»), las notas de cuatro entrevistas (en la visita, el vendedor no sabe si el descuento está dentro de la política y llama al gerente, que a veces tarda horas; según el informe mensual de FP&A, 3 de cada 10 descuentos otorgados el último trimestre quedaron fuera de política, dato ficticio) y la observación de que en muchas visitas no hay buena señal.

- **P1.1 (M10-OE1).** ¿Cuál es el mejor alcance para la versión 1? Clave: una calculadora que, con la lista de precios vigente y la política de FP&A, dice el precio final, el margen y quién debe aprobar, y que funciona sin conexión; fuera de la v1, con motivo: PDF de cotización, CRM y chat (nadie lo pidió en las entrevistas, y el CRM exige permisos y riesgo). Distractores: «todo lo que pidió el director, porque el agente lo hace en una semana» (CE01); «solo el chat con IA, que es lo innovador» (diseñar alrededor de la tecnología; CE02, [src-govuk-whole-problem]).
- **P1.2 (M10-OE1).** ¿Qué criterios de éxito conviene fijar? Clave: proporción de descuentos otorgados fuera de política (línea base: dos meses del informe de FP&A), uso en visitas (cuántos vendedores la usan cada semana) y cero diferencias con los 40 casos de FP&A. Distractores: «que los vendedores digan que les gusta» (CE03); «número de descargas el primer mes» (mide instalación, no la decisión).

### Paso 2 · La pantalla {#paso-2}

Material: el agente entrega la pantalla con su reporte («escaneo de accesibilidad: 0 violaciones; probado en el navegador de escritorio»). La pantalla tiene: el descuento se elige solo arrastrando un control deslizante; la banda de aprobación se muestra como un círculo verde, ámbar o rojo, sin texto; el botón «Calcular» es un ícono de 20 × 20 px junto al de «Borrar». Los vendedores la usarán en el teléfono, de pie, a veces al sol.

- **P2.1 (M10-OE2).** ¿Qué concluye la analista del reporte? Clave: el escaneo no prueba que se pueda usar; faltan la revisión manual (color como única señal de la banda, objetivo de 20 px pegado a otro, arrastre sin alternativa) y una prueba en el teléfono con uno o dos vendedores. Distractores: «está lista: cero violaciones» (CE07); «basta con aumentar el contraste del círculo» (corrige 1.4.11, no 1.4.1: el color sigue siendo la única señal; CE08).
- **P2.2 (M10-OE2).** ¿Qué cambio resuelve el problema del control deslizante? Clave: un campo numérico (con el teclado numérico del teléfono) además del deslizador, porque lo que se hace arrastrando debe poder hacerse con un toque o con teclado (2.5.7 y 2.1.1). Distractores: «hacer el deslizador más grande» (sigue exigiendo arrastrar); «agregar una nota que diga que se arrastra con el dedo» (no quita la barrera; CE13).

### Paso 3 · Los escenarios guardados {#paso-3}

Material: los vendedores piden guardar los escenarios por cliente para retomarlos en la visita siguiente. El agente propone guardar, en el almacenamiento del navegador, el precio final, el margen y la banda calculados «para no recalcular». La analista decide que, por ahora, los escenarios se guarden **solo en el teléfono**, sin servidor: son datos comerciales y la v1 no tiene identidad ni backend. En diciembre, la lista de precios agregará una columna `currency` porque llegan productos importados en EUR.

- **P3.1 (M10-OE3).** ¿Qué se guarda de cada escenario? Clave: lo que el vendedor ingresó (producto, descuento, cliente) y la versión de la lista de precios con que se calculó; precio, margen y banda se recalculan al abrirlo, y si la lista cambió, la app lo dice. Distractores: «el precio y el margen calculados, para que cargue rápido» (CE14: queda calculado con una lista vieja sin que nadie lo note); «todo, incluida una copia de la lista de precios en cada escenario» (duplica la referencia; CE14, [src-react-state-structure]).
- **P3.2 (M10-OE3).** ¿Cómo se maneja el cambio de diciembre en los escenarios ya guardados? Clave: una migración en la actualización de versión de la base, que asigna `USD` a los escenarios existentes, probada con una base sintética de la versión anterior, y atómica (si falla, los escenarios quedan como estaban). Distractores: «borrar los escenarios guardados al actualizar: son pocos» (CE19: es lo único que no se puede reconstruir); «que la app nueva ignore el campo que falta» (sin migración, un escenario sin moneda puede mezclar USD y EUR; CE16).

### Paso 4 · La lista de diciembre {#paso-4}

Material: FP&A publica la lista de precios nueva cada mes, con fecha de vigencia el día 1. El agente propone dos cambios para que «la lista llegue antes»: publicar en cada push a `main` sin esperar las pruebas, y activar de inmediato la versión nueva de la app aunque el vendedor la tenga abierta.

- **P4.1 (M10-OE4).** ¿Qué cadena de publicación corresponde? Clave: la construcción corre los 40 casos de FP&A (incluido el del umbral exacto de 22,00 %) y el escaneo de accesibilidad; el despliegue depende de la construcción; si un caso falla, no se publica y la app sigue con la lista anterior, mostrando su fecha. Distractores: «publicar primero y correr las pruebas después, para no atrasar la lista» (CE20); «correr las pruebas solo cuando cambia el código, no la lista» (la lista es una entrada del cálculo: cambia los resultados).
- **P4.2 (M10-OE4).** ¿Cómo debe llegar la versión nueva a un vendedor que está en una visita? Clave: la app muestra la fecha de la lista vigente, avisa «hay una lista nueva desde el 1 de diciembre» y deja recargar cuando termine el cálculo en curso; los escenarios guardan con qué lista se calcularon. Distractores: «activar la versión nueva de inmediato, para que nadie use precios viejos» (CE21: puede mezclar versiones a mitad de un cálculo); «no avisar: el vendedor verá la nueva cuando recargue» (CE22: la nueva espera hasta que se cierre la app; puede seguir días con la vieja).

### Paso 5 · La entrega {#paso-5}

Material: el agente escribió un único README que empieza con la instalación, sigue con «cómo dar un descuento en tres toques», enumera las columnas de la lista y termina con «la app calcula márgenes exactos y reemplaza la llamada al gerente». No dice que los escenarios se guardan solo en ese teléfono, ni que los precios son de lista y sin impuestos, ni quién mantiene la app. El director pregunta: «Si un margen sale mal y damos un descuento que no correspondía, ¿quién responde?».

- **P5.1 (M10-OE5).** ¿Cómo se reorganiza la documentación? Clave: una guía práctica de una página para vendedores, con las limitaciones arriba (precios de lista sin impuestos, vigencia de la lista, la banda indica quién aprueba pero no reemplaza la aprobación formal, los escenarios viven solo en ese teléfono), y un README para quien mantiene (cómo correr, probar con los 40 casos, publicar la lista del mes y recuperar). Distractores: «un solo README más completo, para que todos encuentren todo» (CE26); «quitar las limitaciones para no desalentar el uso» (CE27).
- **P5.2 (M10-OE5).** ¿Qué responde la analista al director? Clave: responde ella, como dueña de la herramienta, aunque el código lo haya escrito un agente; la entrega va con su evidencia (los 40 casos coinciden con la planilla de FP&A, escaneo y revisión manual, revisión independiente con sus hallazgos) y con un suplente nombrado. Distractores: «el proveedor del agente, porque él generó el código» (CE28); «nadie: la app solo informa, decide el vendedor» (la herramienta influye en la decisión; quien la publica responde por lo que muestra).

### Paso 6 · La mudanza (giro del caso) {#paso-6}

Material: dos meses después, TI informa que el servicio gratuito de páginas donde está publicada la app no admite, según sus términos, herramientas de una empresa, y que debe pasar a `descuentos.altiplano.example` antes del 15 de enero. Un vendedor pregunta si sus escenarios guardados «se van a mudar solos». Al revisar el registro de la revisión independiente de la primera semana, la analista encuentra el hallazgo «no hay forma de exportar los escenarios guardados» (severidad media), cerrado como «aceptado: los datos quedan en el teléfono», sin responsable ni condición para reabrirlo.

- **P6.1 (M10-OE6).** ¿Qué hay que reabrir y qué se hace antes de la mudanza? Clave: reabrir el hallazgo de exportación, porque cambió la condición que justificaba aceptarlo (el almacenamiento es por origen: en la dirección nueva los escenarios no existen), y con él revisar la decisión del paso 3 de guardar solo en el teléfono sin salida. Antes de mudar: una última versión en la dirección vieja con exportación y aviso, importación en la nueva, un periodo en que conviven las dos, y comprobar con un escenario de prueba que el archivo exportado se importa bien. Distractores: «copiar los archivos del sitio a la dirección nueva: los escenarios van con la app» (CE24); «el hallazgo ya está cerrado; reabrirlo sería rehacer la revisión» (CE36, CE37).
- **P6.2 (M10-OE6).** ¿Qué entra al plan de mantenimiento después de la mudanza? Clave: una prueba de regresión de ida y vuelta (exportar en una versión e importar en la siguiente, con datos de la versión anterior); una entrada en el registro de decisiones que reemplaza la de hosting; el runbook de publicación actualizado y probado por otra persona; y en el calendario, la revisión anual de los términos del hosting y la de la lista mensual, cada una con responsable. El hallazgo se cierra cuando la prueba de ida y vuelta pasa en la dirección nueva. Distractores: «anotar la mudanza en el historial de Git, que ya registra todo» (Git registra líneas, no la decisión ni su evidencia; M09-CE36); «marcar el hallazgo como corregido apenas se publique la exportación» (CE36: sin la prueba de que se importa bien, no hay evidencia).

**Pruébalo en tu entorno (opcional, sin registro):** con una planilla o un script de Python con `decimal`, calcular los siete casos de la tabla de materiales y comprobar el del umbral exacto (margen 22,00 %, ¿pasa o no?, según cómo se escriba la comparación). Después, abrir cualquier PWA en el navegador, mirar en las herramientas de desarrollo el panel de almacenamiento y ver que los datos aparecen bajo un origen; abrir la misma app desde otra dirección y comprobar que ahí no están. La app no ejecuta nada (estándar §5).

**Cobertura:** OE1 (P1.1, P1.2), OE2 (P2.1, P2.2), OE3 (P3.1, P3.2), OE4 (P4.1, P4.2), OE5 (P5.1, P5.2), OE6 (P6.1, P6.2).

**El giro.** P6.1 obliga a revisar la decisión del paso 3 (guardar los escenarios solo en el teléfono, sin exportación), que era defendible con la información de entonces, y el cierre de un hallazgo sin condición de reapertura. Lo dispara un cambio de **hosting** que cambia el **origen**, un hecho técnico poco intuitivo para el alumno. **No repite los giros de M04 a M09:** M04 (el agente borra una prueba), M05 (tareas del viernes a la nube con el plan sin subir), M06 (la probabilidad de «En pausa» que llega una semana después), M07 (credencial no cargada y nota inyectada en OPP-1036), M08 (rúbrica ausente en los encargos, revisor que aprueba, costo 12×), M09 (respuestas esperadas tomadas de la propia versión evaluada). Tampoco repite los de M01 (Legal y datos personales), M02 (etapa nueva en el snapshot) ni M03 (vacaciones y traspaso a otra herramienta). Escenarios distintos de `dx-b5-02` (aquí no hay ninguna clave privada) y del caso de transferencia de L6 (plan de mantenimiento de AI School).

---

## 6. Registro de fuentes

Consultadas el 2026-10-27 salvo indicación. Criterio de próxima revisión: alta o muy alta → 2027-01-27; media → 2027-04-27; baja → 2027-10-27 (excepción: retiro de modelos, 2026-12-01). «(existente)» = el ID ya está en `content/sources.json`; «(de stack-tecnico)» = el ID está en el registro de `investigacion/stack-tecnico.md` pero no en `content/sources.json`; «reabierta» = se volvió a abrir hoy.

| ID | Título | URL | Organización | Consultado | Afirmaciones que sustenta | Volatilidad | Próxima revisión |
| --- | --- | --- | --- | --- | --- | --- | --- |
| src-govuk-user-needs | Learning about users and their needs (publ. 2016-04-04; act. 2017-03-23) | https://www.gov.uk/service-manual/user-research/start-by-learning-user-needs | Government Digital Service (GOV.UK Service Manual) | 2026-10-27 | Qué son las necesidades; empezar por los usuarios; formato «necesito… para…» con contexto; opiniones que no vienen de usuarios = supuestos; servicios basados en necesidades se usan más y cuestan menos | Baja | 2027-10-27 |
| src-govuk-discovery | How the discovery phase works (act. 2021-06-21) | https://www.gov.uk/service-manual/agile-delivery/how-the-discovery-phase-works | GDS (GOV.UK Service Manual) | 2026-10-27 | Entender el problema antes de construir; reformular soluciones como problemas; definir qué queda fuera; puede terminar en no construir; alternativas que no son software; planear métricas | Baja | 2027-10-27 |
| src-govuk-alpha | How the alpha phase works (act. 2019-05-08) | https://www.gov.uk/service-manual/agile-delivery/how-the-alpha-phase-works | GDS (GOV.UK Service Manual) | 2026-10-27 | Prototipos lo justo para probar; descartar; probar los supuestos más riesgosos; no prototipar todo el recorrido; métricas de la fase previa; se puede parar | Baja | 2027-10-27 |
| src-govuk-whole-problem | Service Standard, point 2: Solve a whole problem for users (act. 2026-01-29) | https://www.gov.uk/service-manual/service-standard/point-2-solve-a-whole-problem | GDS (GOV.UK Service Manual) | 2026-10-27 | Alcance «ni demasiado estrecho ni demasiado amplio»; no un servicio grande que haga demasiado; incrementos frecuentes; no diseñar alrededor de una tecnología, IA incluida | Baja | 2027-10-27 |
| src-govuk-performance-metrics | How to set performance metrics for your service (publ. 2017-12-05) | https://www.gov.uk/service-manual/measuring-success/how-to-set-performance-metrics-for-your-service | GDS (GOV.UK Service Manual) | 2026-10-27 | Propósito → beneficios → hipótesis; 3 o 4 indicadores; varias fuentes; línea base; medir de forma continua; revisar las métricas | Baja | 2027-10-27 |
| src-nngroup-mvp-video | MVP: Why It Isn't Always Release 1 (video, 2024-08-19) | https://www.nngroup.com/videos/mvp-isnt-release1/ | Nielsen Norman Group (Sara Paul) | 2026-10-27 | MVP como representación razonable que maximiza lo aprendido sobre la propuesta de valor; puede ser un experimento; no tiene que ser la primera versión | Baja | 2027-10-27 |
| src-nngroup-heuristics | 10 Usability Heuristics for User Interface Design (1994; revisado 2024-01-30) | https://www.nngroup.com/articles/ten-usability-heuristics/ | Nielsen Norman Group (Jakob Nielsen) | 2026-10-27 | Las diez heurísticas (estado visible, lenguaje del usuario, control, consistencia, prevención de errores, reconocer, flexibilidad, minimalismo, errores, ayuda) | Baja | 2027-10-27 |
| src-w3c-wcag22 | Web Content Accessibility Guidelines (WCAG) 2.2 (REC 2024-12-12) | https://www.w3.org/TR/WCAG22/ | W3C | 2026-10-27 | Texto de 1.1.1, 1.3.1, 1.4.1, 1.4.3, 1.4.4, 1.4.10 (tablas exentas), 1.4.11, 2.1.1, 2.4.7, 3.3.1, 3.3.2, 4.1.2, 4.1.3 con sus niveles; edición vigente | Baja | 2027-10-27 |
| src-w3c-wcag22-new | What's New in WCAG 2.2 (act. 2023-10-05) | https://www.w3.org/WAI/standards-guidelines/wcag/new-in-22/ | W3C WAI | 2026-10-27 | Publicación 2023-10-05; 9 criterios nuevos con nivel; 2.4.11, 2.5.7, 2.5.8 (24 × 24 y excepciones), 3.3.7, 3.3.8; 4.1.1 retirado; 2.0 y 2.1 casi sin cambios | Baja | 2027-10-27 |
| src-w3c-understanding-target-size | Understanding SC 2.5.8: Target Size (Minimum) | https://www.w3.org/WAI/WCAG22/Understanding/target-size-minimum.html | W3C WAI | 2026-10-27 | Intención (no activar el objetivo vecino); beneficiarios: temblor, una mano, transporte, pantalla táctil; 24 px es un mínimo | Baja | 2027-10-27 |
| src-w3c-tables-tutorial | Tables Tutorial (act. 2023-02-16) | https://www.w3.org/WAI/tutorials/tables/ | W3C WAI | 2026-10-27 | `th`/`td`; `scope`; encabezados irregulares y multinivel; título; no maquetar con tablas; pistas visuales insuficientes; relación con 1.3.1 | Baja | 2027-10-27 |
| src-w3c-complex-images | Complex Images (act. 2026-04-08) | https://www.w3.org/WAI/tutorials/images/complex/ | W3C WAI | 2026-10-27 | Gráficos como imágenes complejas; descripción corta y larga (escalas, valores, tendencias); visible para todos; tabla dentro de la descripción; límites de `aria-describedby` | Baja | 2027-10-27 |
| src-w3c-easy-checks | Easy Checks – A First Review of Web Accessibility (act. 2023-08-09) | https://www.w3.org/WAI/test-evaluate/preliminary/ | W3C WAI | 2026-10-27 | Comprobaciones manuales rápidas (título, alternativas, encabezados, contraste, texto ampliado, teclado y foco, formularios, estructura); advertencia de que pasarlas no garantiza ausencia de barreras | Baja | 2027-10-27 |
| src-w3c-eval-tools | Selecting Web Accessibility Evaluation Tools (act. 2024-05-13) | https://www.w3.org/WAI/test-evaluate/tools/selecting/ | W3C WAI | 2026-10-27 | Las herramientas no comprueban todo; juicio humano; resultados falsos o engañosos posibles | Baja | 2027-10-27 |
| src-github-axe-core (de stack-tecnico, reabierta) | axe-core README | https://github.com/dequelabs/axe-core | Deque Systems | 2026-10-27 (registro previo 2026-10-21) | «En promedio el 57 % de los problemas WCAG» de forma automática; resultados «incompletos» para revisión manual | Media | 2027-04-27 |
| src-deque-coverage-report | Automated Accessibility Coverage Report (sin fecha en la página; imagen de 2025-11) | https://www.deque.com/automated-accessibility-coverage-report/ | Deque Systems | 2026-10-27 | 57,38 % de los problemas por volumen; >2 000 auditorías, 13 000+ páginas, 294 958 problemas; solo primeras auditorías y HTML; métrica distinta de «criterios automatizables» (20-30 %); informe de proveedor | Media | 2027-04-27 |
| src-gds-a11y-tools-2017 | What we found when we tested tools on the world's least-accessible webpage (2017-02-24) | https://accessibility.blog.gov.uk/2017/02/24/what-we-found-when-we-tested-tools-on-the-worlds-least-accessible-webpage/ | GDS (Accessibility blog, Mehmet Duran) | 2026-10-27 | 143 barreras; mejor herramienta 37 % (41 % con avisos manuales); 71 % entre todas; 29 % no detectado; combinar con revisión manual, auditoría y usuarios | Baja | 2027-10-27 |
| src-playwright-a11y | Accessibility testing | https://playwright.dev/docs/accessibility-testing | Microsoft (Playwright) | 2026-10-27 | Escaneo con `AxeBuilder` y etiquetas WCAG en las pruebas; muchos problemas solo se descubren a mano; combinar con revisión manual y pruebas inclusivas | Media | 2027-04-27 |
| src-react-state-structure | Choosing the State Structure | https://react.dev/learn/choosing-the-state-structure | React (Meta) | 2026-10-27 | Agrupar, evitar contradicciones, no guardar lo derivado, no duplicar, no anidar; lo derivado se calcula al renderizar | Baja | 2027-10-27 |
| src-mdn-indexeddb-using | Using IndexedDB (mod. 2026-09-11) | https://developer.mozilla.org/en-US/docs/Web/API/IndexedDB_API/Using_IndexedDB | Mozilla (MDN) | 2026-10-27 | Versiones enteras; estructura solo en la actualización de versión; recrear un almacén borra datos; bloqueo con otras pestañas; transacciones sin garantía de terminar; privado = memoria | Baja | 2027-10-27 |
| src-mdn-storage-quotas (de stack-tecnico, reabierta) | Storage quotas and eviction criteria (mod. 2026-01-05) | https://developer.mozilla.org/en-US/docs/Web/API/Storage_API/Storage_quotas_and_eviction_criteria | Mozilla (MDN) | 2026-10-27 (registro previo 2026-10-21) | Por origen; mejor esfuerzo frente a persistente; desalojo LRU y por origen entero; Safari 7 días; cuotas por navegador; `estimate()`; el usuario puede borrar todo | Media | 2027-04-27 |
| src-dexie-versioning (de stack-tecnico, reabierta) | Database versioning (Design) | https://dexie.org/docs/Tutorial/Design | Dexie | 2026-10-27 (registro previo 2026-10-21) | `version().stores().upgrade()`; reversión si falla; qué versiones conservar; no modificar versiones con función de actualización | Media | 2027-04-27 |
| src-inkandswitch-local-first | Local-first software: You own your data, in spite of the cloud (2019-04; Onward! 2019) | https://www.inkandswitch.com/essay/local-first/ | Ink & Switch (Kleppmann, Wiggins, van Hardenberg, McGranaghan) | 2026-10-27 | Siete ideales; «The Long Now»; control del usuario sobre sus datos; si el servicio cierra, la app deja de funcionar (Aparte) | Baja | 2027-10-27 |
| src-webdev-sw-lifecycle | The service worker lifecycle (act. 2016-09-29) | https://web.dev/articles/service-worker-lifecycle | Google (web.dev, Jake Archibald) | 2026-10-27 | Instalar, esperar, activar; recargar no basta; riesgo de activar de inmediato (versiones mezcladas); cuándo se buscan actualizaciones; mantener la URL del *service worker* | Media | 2027-04-27 |
| src-webdev-pwa-update | Learn PWA: Update (act. 2022-03-10) | https://web.dev/learn/pwa/update | Google (web.dev) | 2026-10-27 | Actualizar recursos; la caché vieja no se borra sola; avisar y dejar elegir; riesgo de versiones mezcladas; actualización del manifiesto por plataforma (ficha) | Media | 2027-04-27 |
| src-semver-2 | Semantic Versioning 2.0.0 | https://semver.org/ | Semantic Versioning (Tom Preston-Werner y colaboradores) | 2026-10-27 | MAYOR.MENOR.PARCHE; API pública obligatoria; 0.y.z; versiones publicadas inmutables; obsolescencia antes de quitar | Baja | 2027-10-27 |
| src-ghdocs-limits (de stack-tecnico, reabierta) | GitHub Pages limits | https://docs.github.com/en/pages/getting-started-with-github-pages/github-pages-limits | GitHub | 2026-10-27 (registro previo 2026-10-21) | 1 GB, 100 GB/mes, 10 compilaciones/h, 10 min, 429; no para negocios, comercio ni SaaS; no para transacciones sensibles; sin mención de garantías de disponibilidad (ficha) | Alta | 2027-01-27 |
| src-ghdocs-custom-workflows | Using custom workflows with GitHub Pages | https://docs.github.com/en/pages/getting-started-with-github-pages/using-custom-workflows-with-github-pages | GitHub | 2026-10-27 | Trabajos de construcción y despliegue; `needs: build`; permisos `pages: write`, `id-token: write`; entorno con reglas de protección; límite del artefacto (ficha) | Alta | 2027-01-27 |
| src-github-status-checks (existente, no reabierta) | About status checks | https://docs.github.com/en/pull-requests/collaborating-with-pull-requests/collaborating-on-repositories-with-code-quality-features/about-status-checks | GitHub | 2026-10-22 (registro previo) | Checks requeridos; trabajo omitido = éxito (puente con M04 L5) | Media | 2027-04-22 |
| src-cisa-backup-business | Back Up Business Data (sin fecha en la página) | https://www.cisa.gov/back-business-data | CISA (Cybersecurity and Infrastructure Security Agency, EE. UU.) | 2026-10-27 | Regla 3-2-1; respaldos automáticos; copias sin conexión y cifradas; probar restauraciones totales y parciales; volver al menos siete días atrás | Baja | 2027-10-27 |
| src-diataxis | Diátaxis (inicio y «Start here») | https://diataxis.fr/ · https://diataxis.fr/start-here/ | Diátaxis (la página no nombra autor; proyecto atribuido a Daniele Procida según búsqueda, no verificado) | 2026-10-27 | Cuatro formas y las necesidades que sirven (acción/conocimiento, estudio/trabajo); mezclarlas causa problemas | Baja | 2027-10-27 |
| src-github-about-readmes | About the repository README file | https://docs.github.com/en/repositories/managing-your-repositorys-settings-and-features/customizing-your-repository/about-readmes | GitHub | 2026-10-27 | Qué responde un README (qué hace, por qué sirve, cómo empezar, ayuda, quién mantiene); dónde se busca | Media | 2027-04-27 |
| src-makeareadme | Make a README | https://www.makeareadme.com/ | Danny Guo (proyecto comunitario) | 2026-10-27 | Secciones sugeridas (instalación, uso con salida esperada, soporte, contribución con pruebas, licencia, estado del proyecto). Fuente secundaria, de convención | Baja | 2027-10-27 |
| src-nygard-adr (existente, reabierta) | Documenting Architecture Decisions (2011-11-15) | https://www.cognitect.com/blog/2011/11/15/documenting-architecture-decisions | Michael Nygard (Cognitect) | 2026-10-27 (registro previo 2026-10-22) | Título, contexto, decisión, estado, consecuencias; reemplazadas se conservan; numeradas en el repositorio | Baja | 2027-10-27 |
| src-keepachangelog (existente, no reabierta) | Keep a Changelog 1.1.0 | https://keepachangelog.com/en/1.1.0/ | Keep a Changelog | 2026-10-26 (registro previo) | Registro de cambios (puente con M09 L6) | Baja | 2027-10-26 |
| src-arxiv-model-cards | Model Cards for Model Reporting (arXiv:1810.03993, v2 2019-01-14; FAT* 2019) | https://arxiv.org/abs/1810.03993 | Mitchell, Wu, Zaldivar, Barnes, Vasserman, Hutchinson, Spitzer, Raji, Gebru | 2026-10-27 | Documentar uso previsto, desempeño por condiciones y procedimiento de evaluación para evitar usos inadecuados (base de la analogía de limitaciones) | Baja | 2027-10-27 |
| src-github-licensing-repo | Licensing a repository | https://docs.github.com/en/repositories/managing-your-repositorys-settings-and-features/customizing-your-repository/licensing-a-repository | GitHub | 2026-10-27 | Sin licencia rigen los derechos de autor por defecto; público = ver y bifurcar; incluir LICENSE; no es asesoría legal | Baja | 2027-10-27 |
| src-github-dependency-review | About dependency review | https://docs.github.com/en/code-security/supply-chain-security/understanding-your-software-supply-chain/about-dependency-review | GitHub | 2026-10-27 | Dependencias agregadas, quitadas y actualizadas en la PR; vulnerabilidades; licencias; la acción bloquea si el check es obligatorio; listas de licencias; disponibilidad (ficha) | Alta | 2027-01-27 |
| src-anthropic-cc-security (existente, reabierta) | Security (Claude Code) | https://code.claude.com/docs/en/security | Anthropic | 2026-10-27 | «Responsabilidad del usuario»: revisar código y comandos antes de aprobar; buenas prácticas (revisar cambios sugeridos, verificar archivos críticos); ningún sistema es inmune (ficha L5) | Muy alta | 2027-01-27 |
| src-github-copilot-agents-responsible | Application card: GitHub Copilot Agents (página de uso responsable) | https://docs.github.com/en/copilot/responsible-use/copilot-coding-agent | GitHub | 2026-10-27 | Revisar a fondo lo generado antes de fusionar; revisar y probar sobre todo en aplicaciones críticas; limitaciones (código inexacto, seguridad, coincidencias con código público, calidad por lenguaje) (ficha L5). La página no muestra fecha | Alta | 2027-01-27 |
| src-openai-codex-security (existente, reabierta) | Agent approvals and security (Codex) | https://learn.chatgpt.com/codex/agent-approvals-security | OpenAI | 2026-10-27 | «Tratar las sugerencias de Codex como cualquier otra PR»: verificar, revisar diffs, documentar decisiones; no afirma explícitamente la responsabilidad del usuario (ficha L5) | Muy alta | 2027-01-27 |
| src-github-dependabot-version-updates | About Dependabot version updates | https://docs.github.com/en/code-security/dependabot/dependabot-version-updates/about-dependabot-version-updates | GitHub | 2026-10-27 | `dependabot.yml`; PR con notas; acciones de flujos; diferencia con las de seguridad; `cooldown` de 3 días por defecto; pausa si nadie interactúa (ficha L6) | Alta | 2027-01-27 |
| src-github-dependabot-security-updates | About Dependabot security updates | https://docs.github.com/en/code-security/dependabot/dependabot-security-updates/about-dependabot-security-updates | GitHub | 2026-10-27 | PR ante alertas con versión corregida; versión mínima con el parche; límites (sin parche, indirectas, fuera de manifiesto); agrupación por ecosistema (ficha L6) | Alta | 2027-01-27 |
| src-github-dependabot-options | Dependabot options reference | https://docs.github.com/en/code-security/dependabot/working-with-dependabot/dependabot-options-reference | GitHub | 2026-10-27 | Intervalos (`daily` a `yearly`, `cron`); 5 PR de versión abiertas por defecto, 10 fijas de seguridad; `groups` (ficha L6). Página leída solo hasta el carácter 100 000 | Alta | 2027-01-27 |
| src-github-dependabot-alerts | Viewing and updating Dependabot alerts | https://docs.github.com/en/code-security/dependabot/dependabot-alerts/viewing-and-updating-dependabot-alerts | GitHub | 2026-10-27 | Descartar con motivo; comentario visible en la historia; registro de auditoría (quién, qué, cuándo, motivo); reabrir si no está corregida | Alta | 2027-01-27 |
| src-github-codeowners | About code owners | https://docs.github.com/en/repositories/managing-your-repositorys-settings-and-features/customizing-your-repository/about-code-owners | GitHub | 2026-10-27 | Revisión pedida automáticamente a los responsables; exigir su aprobación con protección de rama; ubicación del archivo | Media | 2027-04-27 |
| src-github-reviewing-prs (existente, no reabierta) | Reviewing proposed changes in a pull request | https://docs.github.com/en/pull-requests/collaborating-with-pull-requests/reviewing-changes-in-pull-requests/reviewing-proposed-changes-in-a-pull-request | GitHub | 2026-10-22 (registro previo) | El autor no aprueba su PR (puente con M04 L6) | Media | 2027-04-22 |
| src-nist-sp800-40r4 | Guide to Enterprise Patch Management Planning: Preventive Maintenance for Technology (SP 800-40 Rev. 4, 2022-04) | https://csrc.nist.gov/pubs/sp/800/40/r4/final | NIST (Souppaya, Scarfone) | 2026-10-27 | Parcheo como mantenimiento preventivo y costo esperado de operar; estrategia de parcheo; previene incidentes | Baja | 2027-10-27 |
| src-anthropic-model-deprecations | Model deprecations | https://platform.claude.com/docs/en/about-claude/model-deprecations | Anthropic | 2026-10-27 | Estados del ciclo de vida; al menos 60 días de aviso; probar con el reemplazo antes del retiro; peticiones a retirados fallan; ejemplo `claude-sonnet-4-5-20250929` (obsoleto 2026-09-30, retiro 2026-11-30) (ficha L6) | Muy alta | 2026-12-01 |
| src-openai-deprecations (existente, no reabierta) | Deprecations (entrada del 2026-06-03: Evals) | https://developers.openai.com/api/docs/deprecations | OpenAI | 2026-10-26 (registro previo) | Cierre de la plataforma Evals el 2026-11-30 (ficha L6) | Muy alta | 2026-12-01 |
| src-anthropic-skills-bp (existente, reabierta) | Skill authoring best practices | https://platform.claude.com/docs/en/agents-and-tools/agent-skills/best-practices | Anthropic | 2026-10-27 (registro previo 2026-10-22) | Construir evaluaciones antes que documentación extensa; tres escenarios; línea base sin la skill; probar con todos los modelos; evitar información con fecha (sección de patrones antiguos); no hay forma integrada de correr las evaluaciones | Media | 2027-04-27 |
| src-agentskills-evaluating | Evaluating skill output quality | https://agentskills.io/skill-creation/evaluating-skills | Agent Skills (proyecto abierto) | 2026-10-27 | Casos (consulta, salida esperada, archivos) junto a la skill; correr con y sin la skill, o con la versión anterior como línea base; contexto limpio por corrida; aserciones por código y revisión humana; revisar las aserciones; iterar | Media | 2027-04-27 |
| src-agentskills-descriptions (existente, no reabierta) | Optimizing skill descriptions | https://agentskills.io/skill-creation/optimizing-descriptions | Agent Skills (proyecto abierto) | 2026-10-22 (registro previo) | Probar la activación (puente con M03 L4) | Media | 2027-04-22 |
| src-anthropic-cc-best-practices (existente, no reabierta) | Best practices for Claude Code | https://code.claude.com/docs/en/best-practices | Anthropic | 2026-10-21 (registro previo) | Instrucciones podadas y revisadas (puente con M03 L2) | Alta | 2027-01-21 |
| src-mdn-client-server (existente, no reabierta) | Client-Server overview | https://developer.mozilla.org/en-US/docs/Learn_web_development/Extensions/Server-side/First_steps/Client-Server_overview | Mozilla (MDN) | 2026-10-23 (registro previo) | Sitios estáticos frente a dinámicos; papel del navegador y del servidor (puente con M06 L1) | Baja | 2027-10-23 |
| src-vite-env (existente, no reabierta) | Env Variables and Modes | https://vite.dev/guide/env-and-mode | Vite | 2026-10-21 (registro previo) | Lo que va al cliente queda expuesto; los secretos no van en el paquete (puente con `dx-b5-02`) | Media | 2027-04-21 |

**Total: 56 filas, 56 fuentes distintas** (recontadas con un script el 2026-10-27). **44 nuevas para `content/sources.json`**: 40 que no estaban en ningún registro y 4 que están en el registro de `investigacion/stack-tecnico.md` pero no en `content/sources.json` (`src-github-axe-core`, `src-mdn-storage-quotas`, `src-dexie-versioning`, `src-ghdocs-limits`, todas reabiertas hoy). **12 reutilizadas de `content/sources.json`**: 4 reabiertas hoy (`src-anthropic-cc-security`, `src-openai-codex-security`, `src-nygard-adr`, `src-anthropic-skills-bp`) y 8 no reabiertas, usadas solo como puente. Primarias: W3C, GDS (GOV.UK), CISA, NIST, MDN, web.dev, documentación de GitHub, Anthropic, OpenAI, React, Dexie, Playwright, Agent Skills; artículo en arXiv. Secundarias o de convención: `src-makeareadme` (convención comunitaria), `src-deque-coverage-report` (informe de proveedor), `src-diataxis` (marco de un autor, muy difundido), `src-semver-2` (convención), `src-inkandswitch-local-first` (ensayo de un laboratorio de investigación, solo para un Aparte).

**Nuevas para `content/sources.json` (44):** src-govuk-user-needs, src-govuk-discovery, src-govuk-alpha, src-govuk-whole-problem, src-govuk-performance-metrics, src-nngroup-mvp-video, src-nngroup-heuristics, src-w3c-wcag22, src-w3c-wcag22-new, src-w3c-understanding-target-size, src-w3c-tables-tutorial, src-w3c-complex-images, src-w3c-easy-checks, src-w3c-eval-tools, src-github-axe-core, src-deque-coverage-report, src-gds-a11y-tools-2017, src-playwright-a11y, src-react-state-structure, src-mdn-indexeddb-using, src-mdn-storage-quotas, src-dexie-versioning, src-inkandswitch-local-first, src-webdev-sw-lifecycle, src-webdev-pwa-update, src-semver-2, src-ghdocs-limits, src-ghdocs-custom-workflows, src-cisa-backup-business, src-diataxis, src-github-about-readmes, src-makeareadme, src-arxiv-model-cards, src-github-licensing-repo, src-github-dependency-review, src-github-copilot-agents-responsible, src-github-dependabot-version-updates, src-github-dependabot-security-updates, src-github-dependabot-options, src-github-dependabot-alerts, src-github-codeowners, src-nist-sp800-40r4, src-anthropic-model-deprecations, src-agentskills-evaluating. Ninguno choca con un ID de `content/sources.json` (comprobado el 2026-10-27 contra la lista completa de 311 IDs).

**Reutilizadas con `supports` que conviene ampliar** al pasar a `content/sources.json`: src-anthropic-cc-security (responsabilidad del usuario al aprobar), src-openai-codex-security («tratar las sugerencias como cualquier PR»), src-anthropic-skills-bp (evaluaciones antes que documentación, línea base sin la skill, probar con todos los modelos), src-nygard-adr (uso para decisiones de producto).

---

## 7. Huecos (lo que no pude verificar)

1. **Cifra «20-30 %» de criterios automatizables.** La cita el informe de Deque como «la cifra que circula», sin fuente primaria. No la uso como afirmación propia. Las cifras de 30-40 % atribuidas a una auditoría del GDS aparecen solo en fuentes secundarias; la entrada original del blog del GDS da 37 %/41 % para la mejor herramienta y 71 % entre las diez, que son las que uso.
2. **Fecha del informe de Deque.** La página no tiene fecha de publicación (copyright 2026, imagen de cabecera de 2025-11). La cito sin fecha y con la advertencia de que es un informe de proveedor.
3. **Autor de Diátaxis.** Las páginas abiertas no nombran autor; la atribución a Daniele Procida viene de memoria y de búsquedas, no de la página. No la afirmo en el cuerpo.
4. **Página de uso responsable de los agentes de GitHub.** La URL abierta devolvió una página titulada «Application card: GitHub Copilot Agents», sin fecha visible y sin URL final confirmada (puede haber redirección). Las frases sobre la revisión antes de fusionar están en su sección de riesgos de seguridad del agente en la nube.
5. **OpenAI sobre responsabilidad.** La entrada de lanzamiento de Codex («Introducing Codex») devolvió 403; un resumen secundario dice que pedía revisar y validar todo el código del agente antes de integrarlo. No lo uso. La ficha se apoya solo en la página de seguridad de Codex abierta hoy, que no lo dice de forma explícita.
6. **Verificación literal de 2.4.6, 2.4.11 y 2.5.8 en el texto de la norma.** La lectura de la norma completa se cortó por tamaño; 2.4.11, 2.5.7 y 2.5.8 se verificaron en la página «What's New in WCAG 2.2» y en la página de comprensión de 2.5.8, ambas del W3C. 2.4.6 no se usa.
7. **Opciones de `dependabot.yml`.** La página de referencia se leyó solo hasta la mitad; los intervalos, el límite de PR y `groups` están en la parte leída. Otros detalles (horarios, `cron`) no se verificaron.
8. **Actualización del manifiesto por plataforma** (ficha L4): la página de web.dev es de 2022-03-10. Antes de publicar la ficha, conviene confirmarla con la documentación vigente de cada navegador.
9. **Términos de uso del hosting gratuito para una herramienta interna de empresa.** La página de límites dice que el servicio no está pensado para alojar un negocio, comercio o SaaS. Si eso alcanza a una herramienta interna sin fines comerciales es una interpretación; el laboratorio la atribuye a TI de Altiplano (caso ficticio) y no la afirma como regla del proveedor.
10. **Mudanza de datos entre orígenes.** Que el almacenamiento del navegador sea por origen está documentado [src-mdn-storage-quotas]; que una mudanza de dominio deje vacíos los datos de los usuarios es una inferencia directa de ese hecho, que no encontré escrita como tal en una fuente primaria. Va marcada `[inferencia]` y los ítems que la usen deben llevar `basis: inference` o citar MDN para el hecho base.
11. **Cierre de hallazgos.** No encontré una fuente primaria general sobre «cuándo un hallazgo de revisión está cerrado»; la regla (corrección con prueba, riesgo aceptado con motivo, responsable, fecha y condición de reapertura) es una síntesis propia apoyada en cómo una herramienta registra el descarte de alertas. Los ítems de OE6 que la evalúen llevan `basis: inference`.
12. **Calendario de revisión.** Las frecuencias propuestas (mensual, trimestral, anual) son recomendaciones del curso, alineadas con su propia convención de próxima revisión; no tienen una fuente primaria. Van como `[inferencia]`.
13. **Datos ficticios del caso.** Tiempos de preparación (45 minutos), proporción de descuentos fuera de política (3 de cada 10), uso de los gerentes y hallazgos H1-H6 son inventados. Solo las cifras de precio, margen y banda del laboratorio se calcularon con `m10_figures.py`. El autor no debe presentar los demás como medición.
14. **Observaciones del repositorio (no son fuentes externas).** Al 2026-10-27, el flujo `.github/workflows/deploy.yml` corre `npm run content`, `vitest run` y la compilación antes de subir el artefacto, y el despliegue tiene `needs: build`; `vite.config.ts` usa `registerType: 'prompt'`; no hay `.github/dependabot.yml` ni archivo `LICENSE`. Son útiles para el caso de transferencia de L6 y para la ficha L4, y quizá para Daniel (licencia de un repositorio público, actualizaciones de dependencias), pero no son contenido para el alumno sin una decisión registrada.
15. **IDs de stack-tecnico.** Cuatro IDs (`src-github-axe-core`, `src-mdn-storage-quotas`, `src-dexie-versioning`, `src-ghdocs-limits`) vienen del registro de `investigacion/stack-tecnico.md`. No estaban en `content/sources.json`; al pasarlos, conviene conservar esos IDs para no duplicar.
16. **Tiempo de las lecciones.** L2 y L4 son las más densas. [inferencia] En L2, dejar la lista de criterios en una tabla y mover las cifras de cobertura de escaneo a un Aparte si se pasa de 25 minutos; en L4, mover el detalle de SemVer y del *service worker* a la ficha y al Aparte, y dejar en el cuerpo las tres decisiones (cadena, actualización, continuidad).

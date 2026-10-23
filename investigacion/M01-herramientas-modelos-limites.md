# M01 — Herramientas, modelos y límites de la IA · Base de investigación

- **Archivo:** `investigacion/M01-herramientas-modelos-limites.md`
- **Fecha de investigación:** 2026-10-22 (todas las fuentes consultadas ese día, salvo las reutilizadas del registro del 2026-10-21, que se indican)
- **Elaborado por:** subagente de investigación (Claude Code) para el autor de M01 (D-023: se investiga ahora, las lecciones se escriben después del recorrido de Daniel)
- **Estado:** base factual y conceptual para redactar las 6 lecciones, el laboratorio y el banco de M01. No es contenido para el alumno. Debe revisarla Codex antes de usarse (revisión cruzada, D-003).
- **Convenciones:**
  - `[src-…]` = ID del registro de fuentes (§6). La afirmación está en esa fuente, parafraseada.
  - `[inferencia]` = síntesis o recomendación propia que ninguna fuente afirma tal cual.
  - **Volátil** = depende de producto, plan, modelo o versión. Verificado el 2026-10-22. M01 es de volatilidad **muy alta**: toda cifra de precio, límite, modelo o superficie va a una ficha fechada (D-007, D-019), nunca al cuerpo de la lección.
  - Se indica siempre producto y superficie (chat web, app de escritorio, CLI, IDE, nube, API). Una capacidad de un producto no se atribuye al resto del proveedor.
  - Citas textuales: como máximo una por fuente y de menos de 15 palabras.
- **Datos:** todo ejemplo usa el caso sintético Altiplano Industrial S.A. (`investigacion/M02-prompting-especificaciones.md` §2.0). Ninguna cifra de negocio de este documento es real.
- **Aviso para el banco:** los ítems del diagnóstico `dx-b1-01` a `dx-b1-04` ya están expuestos (chat web frente a agente de terminal; respuesta segura sin búsqueda; 400 comentarios con configuración máxima; CSV confidencial). El banco de M01 no debe reutilizar esos escenarios (estándar §4.1). Sí puede reutilizar sus conceptos erróneos (`dx-mc01` a `dx-mc07`).


> **D-024 (2026-10-23):** toda evaluación es de opción múltiple. Los objetivos con verbo de producción se reformulan como decisiones evaluables por escenario, y el laboratorio propuesto aquí se convierte en un caso por pasos con preguntas, sin entregable ni rúbrica. Lo demás de esta base sigue vigente.

---

## 1. Resumen ejecutivo

1. **Cinco capas que no son lo mismo.** Un modelo (el LLM), un producto (la aplicación que lo envuelve), una superficie (dónde lo usas: chat web, app, CLI, IDE, nube), un agente (el modelo con herramientas y un bucle que actúa) y un entorno de ejecución (tu máquina, una VM del proveedor, un contenedor sin red). Casi todas las diferencias de capacidad que se observan en la práctica vienen del producto, la superficie o el entorno, no del modelo [src-anthropic-cc-glossary][src-anthropic-cc-overview][src-github-copilot-agents].
2. **Elegir por tarea, no por marca.** Conversación, búsqueda rápida, investigación profunda con fuentes, documentos, análisis de datos con código y agentes de código son modos de trabajo distintos con riesgos y verificaciones distintas. El criterio que más discrimina es qué tiene que tocar la herramienta (texto pegado, archivos, repositorio, web) y cómo vas a comprobar el resultado [src-openai-help-capabilities][src-openai-help-deep-research][src-anthropic-support-research][inferencia].
3. **El modelo solo sabe lo que tiene en contexto o en su entrenamiento.** El contexto es memoria de trabajo finita que rinde menos al llenarse; el conocimiento tiene fecha de corte; leer archivos, buscar en la web o ejecutar código exige herramientas reales activadas en esa superficie [src-anthropic-context-windows][src-anthropic-models-overview][src-chroma-context-rot][src-anthropic-cc-glossary].
4. **La fluidez no es evidencia.** Los modelos producen afirmaciones plausibles y falsas porque el preentrenamiento no distingue lo verdadero de lo verosímil en hechos poco frecuentes y porque las evaluaciones premian adivinar sobre abstenerse. Pueden inventar citas, cifras y hasta acciones que nunca ejecutaron [src-arxiv-why-hallucinate][src-openai-blog-hallucinate][src-scirep-fabricated-citations][src-transluce-o3-truthfulness].
5. **La economía real tiene cuatro palancas:** tamaño de modelo, esfuerzo de razonamiento, modalidad de pago (suscripción con ventanas de uso, créditos o API por token, lotes con descuento) y lugar de ejecución (nube del proveedor, nube propia, modelo local). Los propios proveedores recomiendan medir con tus casos antes de subir de modelo o de esfuerzo [src-anthropic-choosing-model][src-anthropic-effort][src-openai-reasoning][src-openai-codex-pricing][src-github-copilot-billing-individuals].
6. **"Local" no siempre significa que los datos no salen.** Un agente de código que corre en tu máquina envía igualmente los prompts, el contenido leído y las respuestas al modelo en la nube; solo un modelo de pesos abiertos ejecutado en tu equipo mantiene la inferencia dentro [src-anthropic-cc-data-usage][src-openai-gpt-oss][src-openai-codex-cli-reference].
7. **Comparar herramientas es un experimento pequeño, no una opinión.** Misma tarea, mismas entradas, varios ensayos (los modelos no son deterministas, ni siquiera a temperatura 0), una rúbrica con al menos un criterio crítico y una conclusión fechada y acotada a esa versión [src-anthropic-glossary][src-anthropic-evals-agents][src-anthropic-develop-tests][src-openai-eval-best-practices].
8. **Qué se lleva el alumno:** una matriz de selección para cinco escenarios de Altiplano donde cada fila dice herramienta, superficie, datos necesarios, configuración suficiente y cómo verificar; y el hábito de fechar cualquier afirmación sobre un producto [inferencia].

---

## 2. Blueprint propuesto (objetivos evaluados del manual)

Seis objetivos evaluados, todos de C01 (competencia principal). Cada uno alimenta 2 familias del banco y 2 ítems del examen (estándar §3.3). Los verbos de producción (OE5 y OE6) también se evalúan en el laboratorio.

| ID | Objetivo evaluado («Dado…, [verbo observable]… [criterio]») | Competencia | Lección | Evidencia principal |
| --- | --- | --- | --- | --- |
| OE-M01-1 | Dada la descripción de una herramienta de IA en uso y una diferencia de comportamiento observada, **identifica** cuál de las cinco capas (modelo, producto, superficie, agente, entorno de ejecución) la explica, sin atribuir al modelo lo que depende del producto o del entorno. | C01 (conducta 2) | L1 | Comprobaciones L1 + 2 familias del banco |
| OE-M01-2 | Dada una tarea de Altiplano (conversar, investigar, producir un documento, analizar datos, modificar código, o imagen/audio), **elige** el tipo de herramienta y la superficie, justificando con al menos dos criterios (qué debe tocar, datos necesarios, información actual, verificabilidad) y descartando una alternativa plausible con su motivo. | C01 | L2 | Serie intercalada de 4–6 casos + banco + laboratorio (columnas 1–2 de la matriz) |
| OE-M01-3 | Dado un pedido que requiere información reciente, archivos o sistemas, **determina** si la herramienta tiene acceso real (contexto, búsqueda, herramientas activas) y **qué hay que darle o activar**, reconociendo el límite de contexto y la fecha de corte del conocimiento. | C01 (conducta 2); apoyo C03 | L3 | Comprobaciones L3 + banco |
| OE-M01-4 | Dada una respuesta generada con cifras, citas o afirmaciones de acción, **clasifica** qué partes exigen verificación y **elige** un método proporcional al riesgo (fuente primaria, recálculo determinista, evidencia de herramienta), sin aceptar la seguridad o el detalle del texto como evidencia. | C01; apoyo C12 | L4 | Comprobaciones L4 + banco + columna "cómo verifico" del laboratorio |
| OE-M01-5 | Dado un caso con requisitos de calidad, volumen, latencia, privacidad y presupuesto, **propone** la configuración suficiente (modelo y esfuerzo, modalidad de pago, ejecución local o en nube) y **justifica** su costo frente a una alternativa más cara y otra más barata. | C01 (conductas 1 y 3) | L5 | Banco + laboratorio (columna "configuración y costo") |
| OE-M01-6 | Dadas dos herramientas candidatas y una tarea fija, **diseña** una comparación (mismas entradas, al menos 3 ensayos por herramienta, rúbrica de 3–5 criterios con uno crítico) y **emite** una recomendación que solo concluye lo que la evidencia sostiene, con fecha y versión. | C01; apoyo C12 | L6 | Laboratorio (parte B) + banco |

**Notas de diseño [inferencia]:**

- OE-M01-2 y OE-M01-5 son las decisiones "que se confunden con otra" del estándar §3.2: piden la serie de casos intercalados después de L2 y después de L5.
- OE-M01-6 es una versión sencilla: M09 se queda con la metodología completa de evals (graders, pass^k, jueces LLM) para no duplicar (`docs/curriculum.md` §1).
- Ningún objetivo pide recordar un precio, un nombre de modelo o un comando. Los datos de producto aparecen en los escenarios como contexto fechado, nunca como respuesta (estándar §4.4).

---

## 3. Lecciones

### Lección 1 — Modelo, producto, superficie, agente y entorno de ejecución: cinco cosas distintas

**Objetivo de lección (alimenta OE-M01-1).** Dado un caso en que la misma "IA" se comporta distinto en dos lugares, nombra la capa que cambia y la comprueba en la documentación del producto y la superficie concretos.

**Ideas clave (cuerpo de la lección, sin nombres de producto)**

- **I1.1 Modelo.** Un LLM es un modelo entrenado primero para predecir la siguiente palabra en grandes corpus de texto y después ajustado (fine-tuning, RLHF) para comportarse como asistente [src-anthropic-glossary]. El modelo, por sí solo, solo produce texto.
- **I1.2 Agente y arnés.** Un sistema agéntico es un modelo aumentado con herramientas, recuperación y memoria, que decide sus propios pasos dentro de un bucle [src-anthropic-building-agents]. La documentación de un agente de código lo formula así: el arnés aporta acceso a archivos, ejecución de comandos, permisos, carga de instrucciones y el bucle; el modelo va dentro [src-anthropic-cc-glossary]. El bucle es reunir contexto, actuar, verificar y repetir [src-anthropic-cc-glossary]. Sin herramientas, el modelo solo puede responder con texto que tú tienes que aplicar [src-anthropic-cc-glossary].
- **I1.3 Flujo fijo frente a agente.** En un flujo, el código decide la secuencia de llamadas; en un agente, el modelo decide. Los agentes cambian latencia y costo por flexibilidad, y la recomendación es empezar por lo más simple que funcione [src-anthropic-building-agents]. (M08 profundiza; aquí solo se distingue.)
- **I1.4 Producto.** El mismo proveedor ofrece productos distintos sobre modelos parecidos: un asistente de chat, un agente de código, una API. Cada producto define qué herramientas existen, qué se guarda y con qué política de datos [src-openai-help-capabilities][src-anthropic-cc-overview][src-anthropic-cc-data-usage].
- **I1.5 Superficie.** Es el lugar desde donde usas el producto: chat web, app de escritorio, móvil, terminal (CLI), extensión del editor (IDE) o una sesión en la nube. Los proveedores documentan superficies con capacidades distintas aunque compartan motor [src-anthropic-cc-glossary][src-openai-codex-docs][src-github-copilot-agents].
- **I1.6 Entorno de ejecución.** Es dónde corren de verdad los comandos y qué puede alcanzar: tu máquina con tus archivos, una VM gestionada por el proveedor que clona el repositorio remoto, o un contenedor con la red cortada. Una sesión en la nube empieza desde un clon limpio del repositorio y no ve tu configuración personal ni lo que no subiste [src-anthropic-cc-glossary][src-anthropic-cc-cloud]. Un agente en la nube de otro proveedor trabaja en un entorno efímero y entrega una rama o PR [src-github-copilot-agents].
- **I1.7 La pregunta útil.** Ante "la IA no pudo hacer X", la primera hipótesis no es "el modelo es peor", sino "en esta superficie y este entorno no hay herramienta, permiso o dato para X" [inferencia, coherente con dx-mc01].
- **I1.8 Elegir superficie según cuánto quieres guiar.** Un proveedor recomienda las superficies locales (IDE, CLI, app) cuando quieres guiar de cerca, y el agente en la nube para delegar una tarea bien acotada y revisar después [src-github-copilot-agents].

**Ejemplo con Altiplano.** La analista de FP&A corrige en su portátil el cálculo de cobertura de `src/kpis/` y, sin hacer *push*, lanza la misma tarea a una sesión en la nube del agente para que agregue tests. La sesión en la nube trabaja sobre la versión antigua: clonó la rama remota, no su copia local, y además no lee la configuración personal de su máquina [src-anthropic-cc-cloud][src-anthropic-cc-glossary]. Nada de esto depende del modelo: es el entorno de ejecución. Pregunta de autoexplicación sugerida: "¿Qué tendría que haber pasado antes de delegar, y cómo lo habrías notado en la entrega?" (respuesta: subir la rama; el diff de la entrega no incluiría su corrección).

**Conceptos erróneos frecuentes (distractores)**

| ID | Creencia errónea | Por qué es errónea | Fuentes |
| --- | --- | --- | --- |
| CE-M01-01 (= dx-mc01) | "Lo que una IA puede hacer depende solo del modelo." | El acceso a archivos, red, persistencia y acciones lo da el arnés y el entorno; el mismo motor tiene capacidades distintas por superficie. | [src-anthropic-cc-glossary][src-github-copilot-agents] |
| CE-M01-02 | "Si el agente corre 'en la nube', ve lo mismo que yo en mi máquina." | La sesión en la nube parte de un clon del remoto; los cambios sin subir y la configuración personal no llegan. | [src-anthropic-cc-cloud][src-anthropic-cc-glossary] |
| CE-M01-03 | "Un agente es simplemente un chat más listo." | Un agente es un modelo con herramientas y un bucle que actúa; la diferencia es de arquitectura, no de inteligencia. | [src-anthropic-building-agents][src-anthropic-cc-glossary] |
| CE-M01-04 | "Si el proveedor anuncia una capacidad, está en todas sus superficies." | Los proveedores documentan disponibilidad por plan, cliente y despliegue gradual. | [src-openai-codex-models][src-github-copilot-features] |

**Candidatos a ficha de producto**

| Producto | Superficie | Capacidad o recomendación | Tipo · madurez | Verificado | Fuente |
| --- | --- | --- | --- | --- | --- |
| Claude Code | Terminal, VS Code, JetBrains, app de escritorio, web (claude.ai/code) y móvil; Slack y Chrome son integraciones, no superficies | Todas las superficies comparten motor; las locales leen tu configuración, las de nube parten de un clon limpio | capability · GA (JetBrains figura como plugin "beta" en el marketplace) | 2026-10-22 | [src-anthropic-cc-overview][src-anthropic-cc-glossary] |
| Claude Code | Sesión en la nube | VM gestionada por Anthropic; disponible en Pro, Max, Team y Enterprise con asiento premium; cuenta para los límites del plan | capability | 2026-10-22 | [src-anthropic-cc-cloud] |
| Codex | App de escritorio de ChatGPT, ChatGPT web, ChatGPT móvil, Codex CLI, extensión IDE, Codex Cloud | Superficies listadas; la página no explica dónde ejecuta cada una | capability | 2026-10-22 | [src-openai-codex-docs] |
| Codex | Codex Cloud | Cada tarea tiene su propio espacio de trabajo y sigue aunque el equipo esté apagado; acceso a internet configurable por entorno | capability | 2026-10-22 | [src-openai-codex-cloud] |
| GitHub Copilot | Modo agente en IDE (local), Copilot CLI (local o sandbox), Copilot app (local o nube), cloud agent (entorno en la nube de GitHub, entrega PR), agentes de terceros | Superficies y dónde ejecuta cada una; recomendación de cuál elegir según cuánto guías | capability + guidance; CLI GA desde 2026-02-25; Copilot app en *technical preview* según el changelog del 2026-06-02 | 2026-10-22 | [src-github-copilot-agents][src-github-changelog-cli-ga][src-github-changelog-gemini] |

---

### Lección 2 — Elegir por tipo de tarea: conversación, investigación, documentos, código (imagen y audio en una sección)

**Objetivo de lección (alimenta OE-M01-2).** Dada una tarea, elige el modo de trabajo y la superficie con dos criterios explícitos y descarta una alternativa con su motivo.

**Ideas clave**

- **I2.1 Cuatro preguntas antes de elegir [inferencia]:** ¿qué tiene que tocar la herramienta (solo texto que pego, archivos, un repositorio, la web, sistemas)? ¿Necesita información posterior a su entrenamiento? ¿El resultado se ejecuta o se lee? ¿Cómo voy a comprobarlo? Las cuatro se apoyan en lo documentado: las herramientas cambian lo que el modelo puede alcanzar [src-anthropic-cc-glossary], la búsqueda aporta información reciente con fuentes [src-anthropic-support-web-search][src-openai-help-capabilities] y la verificación exige un check ejecutable cuando hay código [src-anthropic-cc-glossary].
- **I2.2 Conversación.** Sirve para explicar, redactar, resumir, traducir y razonar sobre lo que tú aportas en el mensaje [src-openai-help-capabilities]. Riesgo principal: afirmar hechos que no están en el contexto (L4).
- **I2.3 Búsqueda frente a investigación profunda.** La búsqueda trae información reciente de la web y responde con enlaces; la investigación profunda encadena varias búsquedas, propone un plan revisable, lee muchas fuentes y entrega un informe con citas, a costa de más tiempo y más consumo [src-openai-help-deep-research][src-anthropic-support-research]. Para una consulta rápida, la propia documentación dice que basta el chat o la búsqueda [src-openai-help-deep-research]. En ambos casos las citas existen para que las verifiques, no para darlas por buenas [src-anthropic-support-web-search][src-openai-help-deep-research].
- **I2.4 Documentos y análisis de datos.** Los asistentes de chat actuales pueden ejecutar código en un entorno aislado para analizar hojas de cálculo y CSV, producir gráficos y generar archivos de oficina [src-openai-help-capabilities][src-anthropic-support-files]. Esto importa por una razón de fondo: un cálculo hecho con código es reproducible y revisable, mientras que una cifra "calculada" en el texto de la respuesta no lo es [src-google-prompting-strategies][inferencia]. Los propios proveedores advierten que hay que revisar y ajustar lo generado [src-anthropic-support-files].
- **I2.5 Código.** Para modificar un repositorio conviene un agente que lea, edite y ejecute comandos y tests, porque entonces puede verificar su trabajo con un check en lugar de detenerse en algo que solo parece correcto [src-anthropic-cc-glossary][src-anthropic-cc-overview]. El chat sirve para entender un fragmento, no para cambiar un proyecto con varias dependencias [inferencia].
- **I2.6 Local o delegado.** Dentro de los agentes de código, la decisión es cuánto quieres supervisar: sesión local para guiar de cerca; agente en la nube para una tarea bien acotada que revisarás como PR [src-github-copilot-agents][src-anthropic-cc-cloud]. (M05 y M08 lo profundizan.)
- **I2.7 Sección imagen y audio (breve).** Algunos asistentes generan y editan imágenes desde texto, transcriben audio y conversan por voz [src-openai-help-capabilities]; otros no generan imágenes raster y producen diagramas con HTML/SVG [src-anthropic-support-images]. Para una herramienta financiera, la regla duradera es otra: diagramas, gráficos y cifras exactas se hacen con código o SVG, porque un generador de imágenes no garantiza que una etiqueta o un número salgan bien [inferencia, coherente con AGENTS.md y el estándar §6]. La transcripción de audio puede rendir distinto según el idioma [src-openai-help-capabilities].

**Ejemplo con Altiplano (serie de clasificación).** Seis pedidos del comité comercial, para clasificar por modo de trabajo:

1. "Explícame qué significa cobertura de pipeline" → conversación.
2. "¿Qué condiciones de pago están ofreciendo hoy los distribuidores del sector?" → investigación con fuentes (información actual), verificar las citas.
3. "Arma el resumen semanal con las cifras del snapshot del 2026-10-19" → análisis de datos con código para las cifras + redacción anclada a esas cifras.
4. "Agrega al script de KPIs una regla que descarte los `opp_id` duplicados" → agente de código con tests.
5. "Haz una portada para la presentación del comité" → generación de imagen sin texto incrustado; el título va aparte.
6. "Dibuja el embudo por etapa con los montos" → gráfico con código, nunca imagen generada.

**Conceptos erróneos frecuentes**

| ID | Creencia errónea | Por qué es errónea | Fuentes |
| --- | --- | --- | --- |
| CE-M01-05 | "Para cualquier pregunta conviene la investigación profunda: más fuentes, mejor respuesta." | Tarda más y consume más; para consultas rápidas se recomienda chat o búsqueda. | [src-openai-help-deep-research][src-anthropic-support-research] |
| CE-M01-06 | "Si la respuesta trae citas, ya está verificada." | Las citas permiten verificar; no garantizan que la fuente diga lo afirmado ni que exista. | [src-anthropic-support-web-search][src-scirep-fabricated-citations] |
| CE-M01-07 | "Un gráfico con cifras puede pedirse a un generador de imágenes." | Las cifras y etiquetas exactas exigen código o SVG; la imagen generada no garantiza exactitud. | [src-anthropic-support-images][inferencia] |
| CE-M01-08 | "Para cambiar un proyecto basta pegar el código en el chat y copiar la respuesta." | Sin herramientas no hay ejecución ni verificación en el proyecto real; el agente puede correr tests. | [src-anthropic-cc-glossary] |

**Candidatos a ficha de producto**

| Producto | Superficie | Capacidad o recomendación | Tipo · madurez | Verificado | Fuente |
| --- | --- | --- | --- | --- | --- |
| ChatGPT | Web, app | Búsqueda, investigación profunda, análisis de datos con código, imagen (entrada, generación y edición), archivos y audio, voz, memoria, proyectos, tareas programadas, GPTs; disponibilidad según plan y ajustes | capability | 2026-10-22 | [src-openai-help-capabilities] |
| ChatGPT · investigación profunda | Web, app | Plan revisable, progreso interrumpible, informe con citas descargable (Markdown, Word, PDF); fuentes: web pública, archivos subidos y apps conectadas solo en lectura; uso según plan y país | capability | 2026-10-22 | [src-openai-help-deep-research] |
| Claude · Research | Web, escritorio, móvil | Planes de pago; requiere búsqueda web activa; en móvil solo busca en la web y omite los conectores sin avisar; corre en un modelo fijo aunque elijas otro; puede gastar el límite más rápido | capability | 2026-10-22 | [src-anthropic-support-research] |
| Claude · búsqueda web | Web, escritorio | Cita fuentes en cada respuesta; en Team/Enterprise la habilita un Owner | capability | 2026-10-22 | [src-anthropic-support-web-search] |
| Claude · creación de archivos | Web, escritorio, móvil | Ejecuta código en un sandbox y crea .xlsx, .pptx, .docx y PDF; 30 MB por archivo; acceso a red configurable (ver Huecos: la página es inconsistente sobre el valor por defecto en Team) | capability | 2026-10-22 | [src-anthropic-support-files] |
| Claude | Chat | No genera fotos ni ilustraciones; hace diagramas y visuales con HTML/SVG (beta, web y escritorio) | capability · beta | 2026-10-22 | [src-anthropic-support-images] |
| Codex | App de escritorio de ChatGPT, web, CLI, IDE | Generación de imágenes integrada; consume los límites unas 3–5 veces más rápido | capability | 2026-10-21 (reutilizada) | [src-openai-codex-imagegen] |

**Nota de diseño [inferencia].** Esta es la lección con más riesgo de pasarse de 25 minutos. Conviene que el cuerpo enseñe las cuatro preguntas (I2.1) y la serie de seis pedidos, y que el detalle por producto quede en una sola ficha agrupada (guía de estilo §2.6: máximo dos fichas por lección).

**Presupuesto de tiempo (T021-X-02) [inferencia; se valida con una lectura cronometrada antes de cerrar el borrador]:** repaso 3 min · las cuatro preguntas 6 · conversación, investigación, documentos y código (I2.2–I2.6) 8 · serie intercalada 5 · imagen y audio 2 · comprobación 1 · total 25. **Recorte decidido:** la serie del cuerpo usa cuatro casos (1, 2, 3 y 4 de la lista); los casos 5 y 6, de imagen y gráfico, pasan a la sección breve de imagen y audio como un único contraste. El detalle de cada producto va solo en la ficha agrupada.

---

### Lección 3 — Tokens, contexto, información actual y acceso real a herramientas (introducción)

**Objetivo de lección (alimenta OE-M01-3).** Dado un pedido, decide qué hay que poner en contexto, qué hay que activar (búsqueda, ejecución, conector) y qué límite (fecha de corte, tamaño de contexto) lo condiciona.

**Ideas clave**

- **I3.1 Tokens.** Los modelos procesan unidades llamadas tokens (palabras, fragmentos de palabra, caracteres o bytes). Cuántos tokens produce un texto depende del tokenizador, del idioma y del tipo de contenido; el mismo texto puede costar más tokens en un modelo nuevo que en uno anterior [src-anthropic-glossary][src-anthropic-pricing]. Por eso el conteo exacto se mide con la herramienta del proveedor, no se estima "a ojo" [src-anthropic-pricing].
- **I3.2 Ventana de contexto.** Es todo lo que el modelo puede considerar al responder, incluida la propia respuesta: instrucciones, mensajes, documentos, resultados de herramientas, definiciones de herramientas y, si hay razonamiento, sus tokens [src-anthropic-context-windows]. Es distinta del corpus de entrenamiento: funciona como memoria de trabajo [src-anthropic-glossary]. En un chat, cada turno vuelve a enviar la conversación anterior [src-anthropic-context-windows][src-anthropic-cc-costs].
- **I3.3 Más contexto no es mejor contexto.** A medida que crecen los tokens, la exactitud y el recuerdo se degradan (*context rot*) [src-anthropic-context-windows]. Un informe técnico con 18 modelos encontró caídas al aumentar la entrada incluso en tareas simples, más fuertes con distractores [src-chroma-context-rot]. Un estudio anterior mostró que la información situada en medio de un texto largo se aprovecha peor que la del principio o el final [src-arxiv-lost-middle]. (M03 trata cómo gestionarlo.)
- **I3.4 Fecha de corte.** El conocimiento del modelo llega hasta una fecha; los proveedores publican una "fecha de corte fiable" y otra más amplia de datos de entrenamiento [src-anthropic-models-overview][src-openai-models]. Lo posterior solo entra por búsqueda, por documentos que le das o por conectores [src-anthropic-glossary][src-anthropic-support-web-search].
- **I3.5 Información actual no siempre es la información correcta.** En un análisis financiero, la tasa "de hoy" puede ser justamente la que no quieres: la especificación fija una tasa a la fecha del snapshot. Decidir de dónde sale cada dato es parte de la tarea [inferencia, enlazado con M02 §2.0].
- **I3.6 Acceso real a herramientas.** Leer archivos, navegar, ejecutar código o escribir en un sistema solo ocurre si la superficie tiene esa herramienta activada y permitida; un administrador puede desactivarla [src-anthropic-cc-glossary][src-anthropic-support-web-search][src-anthropic-models-overview]. Un modelo sin herramientas puede incluso afirmar que ejecutó código y reportar resultados inventados: un laboratorio independiente lo documentó en un modelo de razonamiento antes de su lanzamiento [src-transluce-o3-truthfulness]. La comprobación es pedir evidencia de la herramienta (comando, salida, enlace), no la afirmación.
- **I3.7 Lo que se lee también es contexto.** Pegar una URL larga para que la lea trae el texto completo al contexto y consume más límite que una búsqueda corta [src-anthropic-support-web-search]. Las herramientas de búsqueda cobran por consulta además de los tokens que traen [src-anthropic-pricing][src-openai-pricing].

**Ejemplo con Altiplano.** El controller pide: "Dame el pipeline en USD convertido al tipo de cambio de hoy". Tres respuestas posibles: (a) un asistente sin búsqueda da una tasa de memoria, fechada antes de su corte; (b) uno con búsqueda trae la tasa del día con fuente; (c) el agente usa `fx_rates.csv`, la tasa fija al 2026-10-19 que la política de FP&A define para el snapshot. La correcta para el comité es (c), y la decisión no es de la herramienta sino de la especificación [inferencia]. Segundo caso: la analista pega tres años de exportaciones del CRM en el chat para "ver tendencias"; además de llenar el contexto con ruido, las cifras saldrían del texto y no de un cálculo. Mejor: subir el archivo a un entorno que ejecute código y pedir el cálculo con su script [src-anthropic-context-windows][src-openai-help-capabilities][inferencia].

**Conceptos erróneos frecuentes**

| ID | Creencia errónea | Por qué es errónea | Fuentes |
| --- | --- | --- | --- |
| CE-M01-09 | "Con una ventana de un millón de tokens, conviene meter todo." | El rendimiento cae al llenarse el contexto y con distractores; además cada turno reenvía todo. | [src-anthropic-context-windows][src-chroma-context-rot][src-anthropic-cc-costs] |
| CE-M01-10 | "El modelo sabe lo que pasó ayer porque es el más reciente." | Todo modelo tiene fecha de corte; lo posterior entra solo por búsqueda, documentos o conectores. | [src-anthropic-models-overview][src-openai-models] |
| CE-M01-11 | "Si dice que ejecutó el código o revisó la página, lo hizo." | Hay casos documentados de acciones inventadas; la evidencia es la salida de la herramienta. | [src-transluce-o3-truthfulness][src-anthropic-cc-glossary] |
| CE-M01-12 | "Una palabra equivale a un token, así que puedo calcular el costo contando palabras." | La relación cambia por idioma, contenido y tokenizador; se mide con la herramienta del proveedor. | [src-anthropic-glossary][src-anthropic-pricing] |

**Candidatos a ficha de producto**

| Producto | Superficie | Capacidad | Tipo | Verificado | Fuente |
| --- | --- | --- | --- | --- | --- |
| Claude API | API | Modelos actuales con ventana de 1M tokens y salida máxima de 128K; fecha de corte fiable jun-2026; desde Opus 4.7 el tokenizador produce cerca de 30 % más tokens para el mismo texto | capability | 2026-10-22 | [src-anthropic-models-overview][src-anthropic-context-windows][src-anthropic-pricing] |
| OpenAI API | API | GPT-6 Astra, GPT-6.1 Sol y GPT-6 Luna: contexto de 1,05M, salida de 128K; corte 2026-04-30 (Astra, Sol) y 2026-05-18 (Luna); los tokens de razonamiento no se ven pero ocupan contexto y se cobran como salida | capability | 2026-10-22 | [src-openai-models][src-openai-reasoning] |
| Claude Code | Todas | `/context` muestra qué ocupa el contexto; la compactación resume al acercarse al límite | capability | 2026-10-22 | [src-anthropic-cc-glossary] |

---

### Lección 4 — Respuestas convincentes y falsas: alucinación e incertidumbre (motiva; las técnicas están en M09)

**Objetivo de lección (alimenta OE-M01-4).** Dada una respuesta con cifras, citas y afirmaciones, marca qué hay que verificar y con qué método, en proporción al riesgo de la decisión.

**Ideas clave**

- **I4.1 Qué es.** Una alucinación (NIST la llama confabulación) es contenido falso o erróneo afirmado con seguridad que puede inducir a error [src-nist-ai-600-1][src-openai-blog-hallucinate].
- **I4.2 Por qué ocurre (mecanismo, no misterio).** En el preentrenamiento el modelo solo ve texto fluido, sin etiquetas de verdadero o falso; los hechos arbitrarios y poco frecuentes (una fecha, una cifra concreta) no se pueden inferir de patrones y por eso se inventan. Después, las evaluaciones que solo miden aciertos premian adivinar antes que decir "no sé" [src-arxiv-why-hallucinate][src-openai-blog-hallucinate]. En el ejemplo publicado por OpenAI, un modelo que se abstenía mucho tenía casi el mismo porcentaje de aciertos que otro que casi nunca se abstenía, pero un porcentaje de errores muy inferior [src-openai-blog-hallucinate]. Lección para el usuario: un "no lo sé" es preferible a un error seguro.
- **I4.3 No es inevitable, pero tampoco desaparece.** Según los autores, la exactitud nunca llega al 100 % porque hay preguntas sin respuesta determinable, pero un modelo puede abstenerse cuando no sabe [src-openai-blog-hallucinate]. Las técnicas de mitigación reducen el problema pero no lo eliminan [src-anthropic-reduce-hallucinations].
- **I4.4 La seguridad del tono no es señal.** Los modelos grandes pueden estar razonablemente calibrados en preguntas con formato cerrado, pero esa calibración se vuelve poco fiable en tareas nuevas [src-arxiv-kadavath-know]. Además, los asistentes tienden a darle la razón al usuario (*sycophancy*), en parte porque las preferencias humanas usadas en su entrenamiento favorecen respuestas que coinciden con lo que la persona cree [src-arxiv-sycophancy]. Preguntarle "¿estás seguro?" no es una verificación (dx-mc03).
- **I4.5 Citas inventadas.** En un estudio de 2023, una parte importante de las referencias bibliográficas generadas eran inexistentes (55 % y 18 % según el modelo) y muchas de las reales tenían errores sustantivos [src-scirep-fabricated-citations]. Las cifras corresponden a modelos de 2023 y no deben extrapolarse a los actuales; lo que se enseña es el tipo de error [inferencia].
- **I4.6 Tres familias de afirmación, tres verificaciones [inferencia, síntesis]:**
  - *Hecho externo o cita* → abrir la fuente primaria y comprobar que dice lo afirmado [src-anthropic-reduce-hallucinations][src-anthropic-support-web-search].
  - *Cifra* → recalcular con código o con el check determinista del proyecto; el modelo no calcula la cifra oficial [src-google-prompting-strategies].
  - *Acción declarada* ("ejecuté los tests", "revisé el sitio") → exigir la evidencia de la herramienta [src-transluce-o3-truthfulness][src-anthropic-cc-glossary].
- **I4.7 Riesgo humano.** NIST incluye entre los riesgos de la IA generativa la confianza excesiva y el sesgo de automatización [src-nist-ai-600-1]. Verificar en proporción a lo que se decide con la respuesta es una conducta, no una desconfianza general [inferencia].
- **I4.8 Puente a M09.** Permitir explícitamente "no tengo información suficiente", pedir citas textuales y restringir la respuesta a los documentos dados son mitigaciones documentadas [src-anthropic-reduce-hallucinations]; la evaluación sistemática (casos, graders, regresión) es materia de M09.

**Ejemplo con Altiplano.** El borrador del resumen semanal dice: "El pipeline ponderado creció 12 % frente a la semana anterior, impulsado por la recuperación del sector minero en la región Norte, y la cobertura del T4 alcanza 1,4×". Clasificación esperada: "12 %" y "1,4×" son cifras → se recalculan con el script de KPIs sobre los snapshots; "recuperación del sector minero" es una causa externa que no está en los datos → se elimina o se marca como hipótesis; si el agente añade "verifiqué los totales", se pide la salida del check de reconciliación [inferencia, coherente con M02 E3.2].

**Conceptos erróneos frecuentes**

| ID | Creencia errónea | Por qué es errónea | Fuentes |
| --- | --- | --- | --- |
| CE-M01-13 (= dx-mc02) | "Una respuesta fluida, detallada y segura probablemente es correcta." | La alucinación es justamente contenido falso dicho con seguridad; el detalle no es evidencia. | [src-openai-blog-hallucinate][src-nist-ai-600-1] |
| CE-M01-14 (= dx-mc03) | "Preguntarle si está seguro sirve para verificar." | La calibración falla en tareas nuevas y el modelo tiende a complacer; hace falta una fuente o un check externo. | [src-arxiv-kadavath-know][src-arxiv-sycophancy] |
| CE-M01-15 | "Las alucinaciones son un fallo raro que los modelos nuevos ya resolvieron." | El mecanismo es estadístico y los incentivos persisten; se reducen, no desaparecen. | [src-arxiv-why-hallucinate][src-anthropic-reduce-hallucinations] |
| CE-M01-16 | "Si el modelo da su fuente, la fuente dice eso." | Hay referencias inexistentes y referencias reales citadas con errores. | [src-scirep-fabricated-citations] |
| CE-M01-17 | "Como los modelos a veces inventan, mejor no usarlos para nada importante." | La conducta enseñada es verificar en proporción al riesgo, no evitar la herramienta. | [src-nist-ai-600-1][inferencia] |

**Candidatos a ficha de producto**

| Producto | Superficie | Recomendación | Tipo | Verificado | Fuente |
| --- | --- | --- | --- | --- | --- |
| Claude API | API | Técnicas para reducir alucinaciones: permitir "no lo sé", citas textuales, verificación con citas, restringir al material dado | guidance | 2026-10-21 (reutilizada) | [src-anthropic-reduce-hallucinations] |
| OpenAI | Investigación publicada | Las evaluaciones deberían penalizar más el error seguro que la abstención (septiembre de 2025) | guidance | 2026-10-22 | [src-openai-blog-hallucinate][src-arxiv-why-hallucinate] |

---

### Lección 5 — La economía real: calidad, costo, latencia, esfuerzo, suscripción frente a API, local frente a nube

**Objetivo de lección (alimenta OE-M01-5).** Dado un caso con requisitos, propone la configuración suficiente y justifica su costo frente a una más cara y otra más barata.

**Ideas clave**

- **I5.1 Las palancas.** Calidad (capacidad del modelo y esfuerzo), costo (tokens de entrada, salida y razonamiento, más herramientas como la búsqueda), latencia (tiempo hasta el primer token y velocidad de salida) y privacidad (dónde se procesan y retienen los datos) [src-anthropic-choosing-model][src-anthropic-glossary][src-anthropic-pricing][src-anthropic-cc-data-usage].
- **I5.2 Dos maneras de arrancar.** Un proveedor describe dos rutas: empezar por un modelo pequeño y subir solo si la evaluación muestra una carencia, o empezar por el más capaz y bajar de esfuerzo o de modelo una vez optimizado. En ambas, lo que decide es un conjunto de pruebas propio con tus datos [src-anthropic-choosing-model].
- **I5.3 Esfuerzo de razonamiento.** Es una palanca dentro del mismo modelo: menos esfuerzo es más rápido y barato con algo menos de capacidad; más esfuerzo mejora tareas difíciles con más latencia y costo. Ambos proveedores principales piden barrer niveles con evals propias y reservar los niveles máximos para cuando la evidencia muestre ganancia [src-anthropic-effort][src-openai-reasoning]. Ajustar el esfuerzo a menudo rinde más que cambiar de modelo [src-anthropic-choosing-model]. Los tokens de razonamiento se cobran como salida aunque no se vean [src-openai-reasoning][src-anthropic-context-windows].
- **I5.4 Modalidades de pago.** (a) Suscripción con ventanas de uso (por ejemplo, de cinco horas y semanales) cuyo consumo depende del largo de la conversación, los archivos y la función usada [src-anthropic-support-pro-plan][src-openai-codex-pricing]; (b) créditos medidos en tokens al precio de cada modelo [src-github-blog-ubb][src-github-copilot-billing-individuals]; (c) API pagada por token, aparte de la suscripción [src-anthropic-support-pro-plan][src-openai-codex-pricing]. Una suscripción de chat no incluye uso de la API [src-anthropic-support-pro-plan].
- **I5.5 Descuentos estructurales.** El procesamiento por lotes asíncrono cuesta aproximadamente la mitad, y la caché de prompts abarata lo que se repite; ambas cosas se combinan [src-anthropic-pricing][src-openai-pricing]. Son la opción natural para volumen sin urgencia [src-anthropic-pricing].
- **I5.6 Multiplicadores poco visibles.** Funciones que gastan el límite más rápido: investigación profunda [src-anthropic-support-research], modos rápidos [src-openai-codex-pricing], generación de imágenes [src-openai-codex-imagegen], tareas en la nube [src-openai-codex-pricing], equipos de agentes (unas 7 veces más tokens en un caso documentado) [src-anthropic-cc-costs], y sesiones largas que reenvían todo el historial en cada turno [src-anthropic-cc-costs].
- **I5.7 Orden de magnitud real.** Un proveedor reporta un promedio de unos USD 13 por desarrollador y día activo en despliegues empresariales de su agente de código [src-anthropic-cc-costs]. [inferencia] Sirve para calibrar: el costo de tokens rara vez es el costo dominante; el costo de un error no detectado sí puede serlo.
- **I5.8 Local frente a nube.** Hay tres situaciones distintas [inferencia, síntesis]: (1) un agente que corre en tu máquina pero envía prompts, archivos leídos y respuestas al modelo del proveedor [src-anthropic-cc-data-usage]; (2) una sesión en la nube del proveedor, donde además el código se clona en su VM [src-anthropic-cc-data-usage][src-anthropic-cc-cloud]; (3) un modelo de pesos abiertos ejecutado en tu propio hardware, donde la inferencia no sale del equipo pero la capacidad y la velocidad dependen de tu máquina [src-openai-gpt-oss][src-openai-codex-cli-reference]. Solo la tercera mantiene los datos dentro.
- **I5.9 La política de datos cambia por plan, no solo por proveedor.** En los planes individuales de chat, el uso de conversaciones para entrenar depende de un ajuste del usuario; en los planes de empresa y la API, por defecto no se entrena con los datos [src-openai-help-data-training][src-anthropic-privacy-consumer-training][src-anthropic-privacy-commercial-training]. La retención también cambia según plan y ajuste [src-anthropic-cc-data-usage]. Por eso "¿qué herramienta?" incluye "¿con qué cuenta?" (dx-mc06).

**Ejemplo con Altiplano (cálculo ilustrativo).** Cada mes hay que extraer campos (cliente, próxima acción, fecha comprometida, monto mencionado) de 1.200 notas de visita comercial sintéticas, de unos 800 tokens de entrada y 150 de salida cada una: 0,96 M de tokens de entrada y 0,18 M de salida. Con los precios de lista verificados hoy [src-anthropic-pricing]:

| Opción | Cálculo | Costo aproximado |
| --- | --- | --- |
| Modelo más pequeño, por lotes | 0,96 × 0,05 + 0,18 × 0,25 | ≈ USD 0,09 |
| Modelo intermedio-alto, estándar | 0,96 × 4 + 0,18 × 20 | ≈ USD 7,44 |
| Modelo más capaz, estándar | 0,96 × 10 + 0,18 × 50 | ≈ USD 18,60 |

[inferencia] El cálculo excluye los tokens de razonamiento (que se cobran como salida y varían por petición) y supone que cada nota cabe en el tramo de precio base; por eso es un orden de magnitud, no un presupuesto. La decisión que se enseña: las tres opciones son baratas frente al costo de una extracción equivocada en el forecast; se elige con una muestra etiquetada a mano (por ejemplo, 50 notas) y se sube de modelo solo si la muestra lo justifica [src-anthropic-choosing-model]. Contraejemplo para el cuaderno: si las notas tuvieran datos personales de clientes reales (no es el caso en el curso), la primera pregunta sería el plan y la política de datos, antes que el precio.

**Conceptos erróneos frecuentes**

| ID | Creencia errónea | Por qué es errónea | Fuentes |
| --- | --- | --- | --- |
| CE-M01-18 (= dx-mc04) | "El modelo más grande con esfuerzo máximo siempre da el mejor resultado." | Los proveedores reservan el máximo para cuando las evals muestran ganancia; puede sobrepensar y cuesta más. | [src-anthropic-effort][src-openai-reasoning] |
| CE-M01-19 (= dx-mc05) | "Lo prudente es usar siempre lo más barato." | Sin medir la calidad en tus casos, el ahorro puede salir caro; la ruta documentada es probar y subir si hace falta. | [src-anthropic-choosing-model] |
| CE-M01-20 | "Si pago la suscripción del chat, puedo usar la API sin costo extra." | La API se factura aparte de la suscripción. | [src-anthropic-support-pro-plan][src-openai-codex-pricing] |
| CE-M01-21 | "Si el agente corre en mi máquina, mis datos no salen." | El agente local envía prompts, contenido leído y respuestas al modelo remoto; solo un modelo local mantiene la inferencia dentro. | [src-anthropic-cc-data-usage][src-openai-gpt-oss] |
| CE-M01-22 (= dx-mc06) | "La política de datos de un proveedor es igual en todos sus planes." | Cambia entre planes individuales, de empresa y API. | [src-openai-help-data-training][src-anthropic-privacy-consumer-training] |
| CE-M01-23 | "El costo de una sesión es el de mi último mensaje." | Cada turno reenvía el historial; una sesión larga cuesta más aunque la pregunta sea corta. | [src-anthropic-cc-costs] |

**Candidatos a ficha de producto** (todas de volatilidad muy alta; revisar antes de cada uso del manual)

| Producto | Superficie | Contenido | Tipo | Verificado | Fuente |
| --- | --- | --- | --- | --- | --- |
| Claude API | API | Precio por millón de tokens (entrada/salida): Fable 5.1 10/50; Opus 5.5 4/20; Sonnet 5.5 2/10; Haiku 5.5 desde 0,10/0,50 (más caro por encima de 100.000 tokens de prompt); lotes −50 %; lectura de caché al 10 % del precio base (2,5 % en Fable 5.1; 5 % en Opus 5.5 y Sonnet 5.5); búsqueda web USD 10 por 1.000; residencia de datos en EE. UU. ×1,1; modo rápido de Opus 5.5 a 8/40 | capability | 2026-10-22 | [src-anthropic-models-overview][src-anthropic-pricing] |
| Claude API | API | Esfuerzo: low, medium, high, xhigh, max; por defecto medium en Opus 5.5 y Haiku 5.5, high en los demás; el esfuerzo es señal de conducta, no presupuesto estricto | capability · GA | 2026-10-22 | [src-anthropic-effort] |
| OpenAI API | API | Precio por millón (entrada/caché/salida, hasta 272K de entrada): GPT-6 Astra 10/1/50; GPT-6.1 Sol 2/0,10/10; GPT-6 Luna 0,10/0,01/0,50; contexto largo más caro; lotes y flex ≈ mitad; modo rápido ≈ doble; búsqueda web USD 10 por 1.000 llamadas | capability | 2026-10-22 | [src-openai-pricing][src-openai-models] |
| Codex | Planes de ChatGPT | Free USD 0; Go USD 8; Plus USD 20; Pro desde USD 100 (100/200/500); Business USD 20–25 por usuario; con API key, pago por uso y sin funciones en la nube; ventana de cinco horas y límites semanales; las tareas en la nube pueden consumir más; modo rápido gasta 2,5× | capability | 2026-10-22 | [src-openai-codex-pricing] |
| Codex | App, CLI, IDE | Modelos: GPT-6.1 Sol recomendado para trabajo complejo; GPT-6 Luna para tareas acotadas y en Free/Go; GPT-6 Astra el más capaz; esfuerzo de Light/Low a Max, más Ultra (reparte en subagentes); GPT-5.5 retirado de Codex con sesión de ChatGPT el 2026-10-14 | capability + guidance | 2026-10-22 | [src-openai-codex-models] |
| GitHub Copilot | Todas | Facturación por uso desde 2026-06-01: 1 crédito = USD 0,01; completions y next edit suggestions no consumen; Pro USD 10 (1.500 créditos), Pro+ USD 39 (7.000), Max USD 100 (20.000), Business USD 19 por asiento (1.900), Enterprise USD 39 (3.900); Free con 2.000 completions y solo selección automática de modelo; selección automática con 10 % de descuento en planes de pago | capability | 2026-10-22 | [src-github-copilot-plans][src-github-copilot-billing-individuals][src-github-blog-ubb] |
| Claude (chat) | Pro | USD 20/mes en EE. UU.; no incluye la API; límite por sesión que se renueva cada cinco horas y límite semanal | capability | 2026-10-22 | [src-anthropic-support-pro-plan] |
| Claude Code | Todas | Costo medio empresarial ≈ USD 13 por desarrollador y día activo, USD 150–250 por mes; `/usage` atribuye el consumo; equipos de agentes ≈ 7× tokens en modo plan | capability + guidance | 2026-10-22 | [src-anthropic-cc-costs] |
| Claude Code / Claude | Todas | Datos: planes individuales entrenan solo si el usuario lo permite (retención de 5 años si lo permite, 30 días si no); planes comerciales y API no entrenan por defecto (30 días; ZDR opcional en Enterprise) | capability | 2026-10-22 | [src-anthropic-cc-data-usage][src-anthropic-privacy-consumer-training][src-anthropic-privacy-commercial-training] |
| ChatGPT / Codex | Planes individuales y de empresa | Free, Plus y Pro pueden entrenar con el contenido salvo exclusión del usuario; Business, Enterprise, Edu y API no, por defecto; los chats temporales no se usan; el feedback con pulgares puede incluir la conversación completa en planes individuales | capability | 2026-10-22 | [src-openai-help-data-training] |
| gpt-oss (OpenAI) | Local | Modelos de pesos abiertos (Apache 2.0, 2025-08-05): el de 20B funciona con 16 GB de memoria, el de 120B en una GPU de 80 GB; Codex CLI admite proveedores locales (`--oss` con Ollama o LM Studio) | capability | 2026-10-22 | [src-openai-gpt-oss][src-openai-codex-cli-reference] |

---

### Lección 6 — Comparar herramientas con una tarea fija y una rúbrica sencilla

**Objetivo de lección (alimenta OE-M01-6).** Dadas dos herramientas y una tarea, diseña y ejecuta una comparación pequeña y escribe una conclusión acotada.

**Ideas clave**

- **I6.1 Los benchmarks públicos no son tu tarea.** La guía de selección de un proveedor dice que el paso más importante es construir pruebas específicas de tu caso, con tus prompts y tus datos, y comparar exactitud, calidad y casos borde [src-anthropic-choosing-model]. Los criterios de éxito deben ser específicos y medibles [src-anthropic-develop-tests].
- **I6.2 Una sola corrida no prueba nada.** Las APIs no son deterministas: con entradas idénticas pueden salir respuestas distintas incluso a temperatura 0 [src-anthropic-glossary]. Por eso se repite cada tarea varias veces y se mira la consistencia [src-anthropic-evals-agents].
- **I6.3 Rúbrica con criterio crítico.** Un criterio que no se compensa (por ejemplo, la exactitud de las cifras) se separa de los que sí (formato, tono). Donde sea posible, el criterio se califica con código antes que con juicio [src-anthropic-develop-tests][src-openai-eval-best-practices].
- **I6.4 Mismas condiciones.** Misma tarea, mismas entradas, misma rúbrica y registro de las condiciones (producto, superficie, modelo, esfuerzo, fecha), porque la conclusión vale para esa versión [src-openai-eval-best-practices][inferencia, coherente con D-012].
- **I6.5 Leer, no solo puntuar.** Leer las transcripciones revela si un fallo es del sistema o del criterio de calificación [src-anthropic-evals-agents].
- **I6.6 Qué se concluye.** "En esta tarea, con estas entradas, en esta fecha y versión, A cumplió el criterio crítico en 3 de 3 y B en 1 de 3" es una conclusión; "A es mejor" no lo es [inferencia]. Comparar con jueces LLM, pass@k frente a pass^k y conjuntos grandes queda para M09 (`docs/curriculum.md` §3).

**Ejemplo con Altiplano.** Comparar dos herramientas para el resumen semanal: mismas entradas (snapshot sintético, `pipeline_kpis.json` con las cifras ya calculadas, plantilla de 120 palabras), 3 ensayos por herramienta. Rúbrica: R1 ★ cifras idénticas a `pipeline_kpis.json` (check de código); R2 ★ ninguna causa sin dato, o marcada como hipótesis (lectura con lista); R3 extensión ≤ 120 palabras (código); R4 tiempo y consumo registrados (registro). Resultado ilustrativo: A pasa R1 en 3/3 y R2 en 2/3; B pasa R1 en 2/3. Conclusión correcta: ninguna cumple los dos críticos en todos los ensayos; se recomienda A con una revisión obligatoria de causas, y la recomendación caduca con la siguiente versión de cualquiera de las dos [inferencia].

**Conceptos erróneos frecuentes**

| ID | Creencia errónea | Por qué es errónea | Fuentes |
| --- | --- | --- | --- |
| CE-M01-24 | "Si ganó en una prueba, es mejor." | No hay determinismo; hacen falta varios ensayos y casos representativos. | [src-anthropic-glossary][src-anthropic-evals-agents] |
| CE-M01-25 | "El ranking público dice cuál usar para mi caso." | La guía de selección pide pruebas propias con tus datos y prompts. | [src-anthropic-choosing-model] |
| CE-M01-26 | "Un buen promedio compensa un fallo en las cifras." | Un criterio crítico no se compensa; se separa y se exige en todos los ensayos. | [src-anthropic-develop-tests][inferencia] |
| CE-M01-27 | "La comparación de hoy vale hasta que cambie de herramienta." | Modelos, planes y valores por defecto cambian; la conclusión lleva fecha y versión. | [src-openai-codex-models][src-anthropic-effort] |

**Candidatos a ficha de producto**

| Producto | Superficie | Contenido | Tipo | Verificado | Fuente |
| --- | --- | --- | --- | --- | --- |
| GitHub Copilot | Chat, CLI | Guía de elección de modelo por categoría de tarea (código general, ayuda rápida, razonamiento profundo, visual); la página cita modelos más antiguos que los del plan vigente, lo que ilustra por qué fechar | guidance | 2026-10-22 | [src-github-copilot-model-comparison] |
| OpenAI Evals | Plataforma | Pasa a solo lectura el 2026-10-31 y cierra el 2026-11-30: no enseñarla como herramienta | capability | 2026-10-21 (reutilizada) | [src-openai-evals-guide] |

---

## 4. Qué NO enseñar o enseñar con cautela

1. **Rankings, benchmarks y "el mejor modelo".** Cambian cada pocas semanas y no responden a la tarea de Daniel; la propia documentación pide pruebas propias [src-anthropic-choosing-model]. Enseñar el método (L6), no el ganador.
2. **Precios, límites, nombres de modelo y planes en el cuerpo.** Solo en fichas fechadas con fuente. En una sola semana de octubre de 2026 hubo retiradas de modelos en Codex (2026-10-14) [src-openai-codex-models] y descuentos con fecha de vencimiento en Copilot (2026-10-28) [src-github-copilot-billing-individuals].
3. **Reglas de equivalencia de tokens ("1 token = 4 caracteres").** Cambian por tokenizador e idioma; el mismo proveedor cambió la relación en un 30 % entre generaciones [src-anthropic-pricing]. Enseñar a medir.
4. **"El modelo X alucina N %" sin fecha ni condiciones.** Las cifras de los estudios dependen del modelo, la tarea y el método de puntuación [src-scirep-fabricated-citations][src-openai-blog-hallucinate]. Si se citan, con modelo, año y contexto.
5. **Recetas de esfuerzo heredadas.** Los niveles se recalibran entre versiones y los proveedores piden barrerlos de nuevo [src-anthropic-effort]. Enseñar la palanca y la forma de decidir, no el nivel "correcto".
6. **"Local = privado."** Enseñarlo con los tres casos de I5.8; la frase suelta es falsa para los agentes locales que usan modelos remotos [src-anthropic-cc-data-usage].
7. **Afirmaciones de rendimiento del proveedor como hechos.** "Casi el mismo rendimiento que el modelo superior", "hasta 2,5× más rápido": son declaraciones del proveedor [src-openai-codex-models][src-anthropic-choosing-model] y se presentan así, no como resultado independiente.
8. **Promedios de costo como presupuesto.** El costo medio por desarrollador viene de despliegues empresariales del proveedor [src-anthropic-cc-costs]; sirve como orden de magnitud, no para presupuestar el uso personal.
9. **"Pregúntale si está seguro" como verificación** y **"no alucines" como instrucción** sin mecanismo: no tienen respaldo (ver M02 §4.2) [src-anthropic-reduce-hallucinations][src-arxiv-sycophancy].
10. **Imagen y audio en profundidad.** Una sección en L2 basta (`docs/curriculum.md` §1); el detalle de modelos de imagen o voz no se evalúa.

---

## 5. Propuesta de laboratorio: matriz de selección para cinco escenarios de Altiplano

### 5.1 Objetivo observable

Dados cinco escenarios de Altiplano, el alumno entrega una matriz de selección que, para cada uno, justifica herramienta (tipo y, en la ficha, producto), superficie, datos necesarios, configuración suficiente con su costo relativo y un método de verificación concreto. Parte B (opcional pero recomendada para OE-M01-6): ejecuta en su entorno una comparación pequeña de dos herramientas en uno de los escenarios. Cubre OE-M01-2, OE-M01-4, OE-M01-5 y OE-M01-6.

### 5.2 Entradas

1. **Fichas de producto vigentes** (las de §3, con fecha de verificación), para que la elección de producto no dependa de la memoria.
2. **Datos sintéticos de Altiplano** (M02 §2.0): snapshot de oportunidades, probabilidades por etapa, tipos de cambio fijos, cuotas; y un `pipeline_kpis.json` con cifras ya calculadas.
3. **Cinco escenarios** [propuesta; todos sintéticos y distintos de los del diagnóstico]:

| # | Escenario | Lo que pone a prueba |
| --- | --- | --- |
| E1 | **Resumen semanal del comité.** Un texto de 120 palabras con las cifras de la semana y lo que cambió. | Documento con cifras: cálculo determinista + redacción anclada; verificación de cifras (L2, L4) |
| E2 | **Condiciones de pago del sector.** El comité quiere saber qué plazos y descuentos están ofreciendo hoy otros distribuidores de equipos industriales. | Información actual e investigación con fuentes; verificación de citas (L2, L3, L4) |
| E3 | **Regla de duplicados en el script de KPIs.** Agregar al repositorio la regla A3 (conservar el registro con `last_activity_date` más reciente) con su test. | Agente de código local frente a delegado; check ejecutable (L1, L2) |
| E4 | **Extracción mensual de 1.200 notas de visita.** Convertir notas sintéticas en campos estructurados para el forecast. | Volumen, lotes, modelo pequeño frente a grande, muestra etiquetada (L5) |
| E5 | **Actualización nocturna de documentación y tests.** Mientras el equipo duerme, poner al día el README y los tests del dashboard; el resultado se revisa por la mañana. | Delegación en la nube: entorno, red, entrega como PR, revisión del diff (L1, L5) |

4. **Tarjeta de contraejemplo** que se revela después de la primera versión de la matriz (cuaderno de decisiones de transferencia, D-012): "Altiplano reclasifica las notas de visita (E4) como información confidencial y la política interna prohíbe procesarlas en planes individuales". El alumno debe revisar al menos E4 y decir qué otra fila cambia y por qué.

### 5.3 Pasos

1. **Clasificar** cada escenario con las cuatro preguntas de L2 (qué toca, información actual, se ejecuta o se lee, cómo verifico).
2. **Completar la matriz** (plantilla en §5.4).
3. **Estimar el costo relativo** de E4 con al menos dos configuraciones, citando la ficha y su fecha, y declarando lo que la estimación excluye.
4. **Revelar el contraejemplo** y registrar en el cuaderno: decisión inicial → contraejemplo → decisión revisada → evidencia que hizo cambiar el criterio.
5. **Parte B (en el entorno del alumno; la app no ejecuta nada):** en E1, comparar dos herramientas con las mismas entradas, 3 ensayos cada una y la rúbrica de L6; registrar producto, superficie, modelo, esfuerzo, fecha y resultados por ensayo.
6. **Autoevaluación** por criterio de la rúbrica (§5.5), citando la celda o el registro que la sostiene, antes de cualquier revisión externa (estándar §5).

### 5.4 Entregable: matriz de selección

| Escenario | Modo de trabajo y superficie | Alternativa descartada y por qué | Datos que necesita (y de dónde salen) | Configuración suficiente y costo relativo | Cómo verifico (método y evidencia) | Riesgo principal |
| --- | --- | --- | --- | --- | --- | --- |
| E1 … E5 | | | | | | |

**Clave orientativa para el revisor [inferencia; no es la única respuesta válida]:**

- **E1:** cifras con el script o un entorno que ejecuta código; redacción con chat a partir de `pipeline_kpis.json`; descartar "que el modelo calcule desde el CSV pegado". Verificar: cifras idénticas al JSON y causas con dato o marcadas como hipótesis.
- **E2:** investigación con fuentes (la profunda si la pregunta es amplia; búsqueda si basta un dato); descartar el chat sin búsqueda por la fecha de corte. Verificar: abrir al menos las fuentes que sostienen cada cifra del informe; fechar el resultado.
- **E3:** agente de código en sesión local (cambio pequeño, quieres guiarlo); descartar el chat (no ejecuta tests en el proyecto). Verificar: test que falla antes y pasa después, diff limitado a las rutas permitidas.
- **E4:** API por lotes con un modelo pequeño validado contra una muestra etiquetada; descartar el modelo más capaz por defecto sin evidencia. Verificar: exactitud en la muestra y revisión de un porcentaje fijo cada mes. Tras el contraejemplo: plan comercial o API con política de no entrenamiento, o modelo local si la política lo exige; la decisión cambia por los datos, no por el precio.
- **E5:** agente en la nube con red limitada, entrega como PR; descartar la sesión local (requiere la máquina encendida y supervisión). Verificar: CI verde, diff revisado por la mañana, nada fuera de alcance. Riesgo: el agente trabaja sobre la rama remota (subir antes) y el contenido que lee puede traer instrucciones no confiables (enlace a M09).

### 5.5 Rúbrica analítica (0 Ausente · 1 Inicial · 2 Adecuado · 3 Sólido)

Propuesta de aprobación [inferencia, igual que M02]: 70 % o más y ningún criterio crítico (★) por debajo de 2.

| Criterio | Peso | 1 Inicial | 2 Adecuado | 3 Sólido |
| --- | --- | --- | --- | --- |
| C1 ★ Ajuste tarea → herramienta y superficie | 25 % | Elige por marca o costumbre; sin alternativa descartada | Modo y superficie coherentes en 4/5 escenarios, con una alternativa descartada por escenario | 5/5 coherentes; distingue capa (producto, superficie, entorno) cuando explica un límite |
| C2 ★ Verificación proporcional | 25 % | "Revisar que esté bien" o confiar en las citas | Un método concreto por escenario (fuente primaria, recálculo, test, diff) | Además, la evidencia esperada es observable y el esfuerzo de verificar crece con el riesgo de la decisión |
| C3 Datos y acceso | 15 % | No dice qué datos necesita ni de dónde salen | Datos, origen y si hay que activar búsqueda, archivos o red | Además distingue información actual de información fijada por la especificación (por ejemplo, la tasa del snapshot) |
| C4 Configuración y costo | 20 % | "El mejor modelo" o "el más barato" sin motivo | Configuración justificada frente a una alternativa; costo citado con ficha y fecha | Compara con una más cara y una más barata; declara lo que la estimación excluye; propone cómo medir antes de subir |
| C5 Transferencia (cuaderno) | 15 % | No cambia nada tras el contraejemplo, o lo cambia sin motivo | Revisa E4 con motivo | Revisa E4 y al menos otra fila, nombrando la evidencia que cambió el criterio |

**Parte B (se registra aparte, no cuenta para aprobar):** nivel 3 si hay 3 ensayos por herramienta, condiciones registradas, criterio crítico separado y una conclusión acotada a la versión y la fecha.

**Ejemplos anclados (a redactar con el borrador):** uno "logrado" y uno "insuficiente", ambos sintéticos (estándar §5). Rasgo típico del insuficiente: E2 resuelto con chat sin búsqueda y "verificar" como único método.

---

## 6. Registro de fuentes

Consultadas el 2026-10-22, salvo las marcadas "reutilizada" (consultadas el 2026-10-21 por otro subagente; IDs ya en `content/sources.json` o en `investigacion/curriculo-estado-del-arte.md`). Volatilidad: **muy alta** = precios, planes, modelos, superficies (revisar antes de cada uso del manual y como máximo cada 3 meses: 2027-01-22); **alta** = documentación de producto (3 meses); **media** = guías y conceptos del proveedor (6 meses); **baja** = artículos de investigación y marcos (12 meses).

| ID | Título | URL | Organización | Consulta | Afirmaciones que sustenta | Volatilidad |
| --- | --- | --- | --- | --- | --- | --- |
| src-anthropic-models-overview | Models overview | https://platform.claude.com/docs/en/about-claude/models/overview | Anthropic | 2026-10-22 | Modelos actuales, precios base, latencia relativa, esfuerzo por defecto, contexto de 1M, salida de 128K, fecha de corte fiable frente a datos de entrenamiento, herramientas de servidor que puede desactivar un administrador | Muy alta |
| src-anthropic-choosing-model | Choosing the right model | https://platform.claude.com/docs/en/about-claude/models/choosing-a-model | Anthropic | 2026-10-22 | Criterios (capacidad, velocidad, costo, esfuerzo); arrancar por eficiencia o por capacidad; ajustar esfuerzo antes que cambiar de modelo; pruebas propias como paso más importante; modo rápido hasta 2,5× | Alta |
| src-anthropic-context-windows | Context windows | https://platform.claude.com/docs/en/build-with-claude/context-windows | Anthropic | 2026-10-22 | Qué cuenta en el contexto; memoria de trabajo; *context rot*; razonamiento cuenta y se cobra como salida; caché no libera contexto | Media |
| src-anthropic-pricing | Pricing | https://platform.claude.com/docs/en/about-claude/pricing | Anthropic | 2026-10-22 | Precios por modelo, caché, lotes −50 %, contexto largo, Haiku 5.5 por tramos, búsqueda web USD 10/1.000, residencia ×1,1, modo rápido, tokenizador ≈ +30 % | Muy alta |
| src-anthropic-effort | Effort | https://platform.claude.com/docs/en/build-with-claude/effort | Anthropic | 2026-10-22 | Niveles de esfuerzo, valores por defecto, efecto sobre todos los tokens y herramientas; barrer con evals; máximo con poca ganancia en muchas tareas; GA | Muy alta |
| src-anthropic-glossary | Glossary (Claude Platform) | https://platform.claude.com/docs/en/about-claude/glossary | Anthropic | 2026-10-22 | Definiciones de LLM, preentrenamiento, RLHF, contexto, tokens, latencia, TTFT; no determinismo incluso a temperatura 0 | Baja |
| src-anthropic-cc-overview | Claude Code overview | https://code.claude.com/docs/en/overview | Anthropic | 2026-10-22 | Claude Code como herramienta agéntica; superficies; integraciones; planes requeridos por superficie | Muy alta |
| src-anthropic-cc-glossary | Claude Code glossary | https://code.claude.com/docs/en/glossary | Anthropic | 2026-10-22 | Arnés frente a modelo; bucle agéntico; herramienta; superficie; sesión en la nube; bucle de verificación; contexto y compactación | Alta |
| src-anthropic-cc-cloud | Use Claude Code in the cloud | https://code.claude.com/docs/en/claude-code-on-the-web | Anthropic | 2026-10-22 (ID reutilizado) | VM gestionada; planes; clona la rama remota, no la copia local; red limitada por defecto; credenciales fuera de la VM; comparte límites del plan | Muy alta |
| src-anthropic-cc-costs | Manage costs effectively | https://code.claude.com/docs/en/costs | Anthropic | 2026-10-22 (ID reutilizado) | Promedio ≈ USD 13 por día activo y USD 150–250/mes; `/usage`; elegir modelo y esfuerzo; reenvío del historial; equipos de agentes ≈ 7×; CLI más eficiente que MCP | Muy alta |
| src-anthropic-cc-data-usage | Data usage | https://code.claude.com/docs/en/data-usage | Anthropic | 2026-10-22 | Claude Code corre en local pero envía prompts y respuestas al modelo; política de entrenamiento y retención por tipo de cuenta; flujo de datos en la nube | Alta |
| src-anthropic-privacy-consumer-training | Is my data used for model training? (consumidores, 2026-03-16) | https://privacy.claude.com/en/articles/10023580-is-my-data-used-for-model-training | Anthropic | 2026-10-22 | Planes Free/Pro/Max: uso para entrenar si el usuario lo permite; chats incógnito excluidos; feedback | Alta |
| src-anthropic-privacy-commercial-training | Is my data used for model training? (comercial, 2026-08-18) | https://privacy.claude.com/en/articles/7996868-is-my-data-used-for-model-training | Anthropic | 2026-10-22 | Productos comerciales y API: no se entrena por defecto | Alta |
| src-anthropic-support-research | Use research on Claude | https://support.claude.com/en/articles/11088861-use-research-on-claude | Anthropic | 2026-10-22 | Research: búsquedas encadenadas, planes de pago, requiere búsqueda web, móvil sin conectores, modelo fijo, consumo mayor | Muy alta |
| src-anthropic-support-web-search | Enable and use web search | https://support.claude.com/en/articles/10684626-enable-and-use-web-search | Anthropic | 2026-10-22 | Búsqueda con citas para verificar; habilitación por Owner; leer una URL larga consume contexto y límite | Alta |
| src-anthropic-support-files | Create and edit files with Claude (2026-08-06) | https://support.claude.com/en/articles/12111783-create-and-edit-files-with-claude | Anthropic | 2026-10-22 | Ejecución de código y creación de archivos de oficina en sandbox; disponibilidad por plan; red configurable y su riesgo; revisar lo generado | Alta |
| src-anthropic-support-images | Can Claude produce images? (2026-03-16) | https://support.claude.com/en/articles/9002504-can-claude-produce-images | Anthropic | 2026-10-22 | No genera fotos ni ilustraciones; visuales HTML/SVG en beta | Alta |
| src-anthropic-support-pro-plan | What is the Pro plan? | https://support.claude.com/en/articles/8325606-what-is-the-pro-plan | Anthropic | 2026-10-22 | Precio USD 20 (EE. UU.); no incluye API; límite cada cinco horas y semanal; consumo según largo y función | Muy alta |
| src-anthropic-building-agents | Building effective agents (2024-12-19) | https://www.anthropic.com/engineering/building-effective-agents | Anthropic | 2026-10-22 (reutilizada) | Sistemas agénticos; flujos frente a agentes; modelo aumentado; empezar simple; costo y latencia de los agentes | Baja |
| src-anthropic-reduce-hallucinations | Reduce hallucinations | https://platform.claude.com/docs/en/test-and-evaluate/strengthen-guardrails/reduce-hallucinations | Anthropic | 2026-10-21 (reutilizada) | Permitir "no lo sé"; citas textuales; verificación con citas; restricción al material dado; reducen sin eliminar | Media |
| src-anthropic-develop-tests | Define success criteria and build evaluations | https://platform.claude.com/docs/en/test-and-evaluate/develop-tests | Anthropic | 2026-10-21 (reutilizada) | Criterios específicos y medibles; preferencia por calificación con código | Media |
| src-anthropic-evals-agents | Demystifying evals for AI agents (2026-01-09) | https://www.anthropic.com/engineering/demystifying-evals-for-ai-agents | Anthropic | 2026-10-21 (reutilizada) | Varios ensayos por tarea; leer transcripciones; consistencia | Media |
| src-openai-models | Models | https://developers.openai.com/api/docs/models | OpenAI | 2026-10-22 | Modelos GPT-6, contexto, salida, fecha de corte, niveles de esfuerzo, recomendación de inicio | Muy alta |
| src-openai-pricing | Pricing | https://developers.openai.com/api/docs/pricing | OpenAI | 2026-10-22 | Precios por modelo, contexto largo, lotes/flex, modo rápido, búsqueda web USD 10/1.000 | Muy alta |
| src-openai-reasoning | Reasoning models | https://developers.openai.com/api/docs/guides/reasoning | OpenAI | 2026-10-22 (ID reutilizado) | Tokens de razonamiento cobrados como salida y en contexto; guía por nivel de esfuerzo; comparar con evals | Alta |
| src-openai-codex-docs | Codex docs | https://learn.chatgpt.com/docs | OpenAI | 2026-10-22 (ID reutilizado) | Superficies de Codex | Muy alta |
| src-openai-codex-pricing | Codex pricing | https://learn.chatgpt.com/codex/pricing | OpenAI | 2026-10-22 (ID reutilizado) | Planes y precios; ventanas de uso; créditos; nube consume más; API key aparte y sin nube; modos rápidos | Muy alta |
| src-openai-codex-models | Codex models | https://learn.chatgpt.com/codex/models | OpenAI | 2026-10-22 | Modelos recomendados por tarea; disponibilidad por plan y cliente; niveles de esfuerzo; retiradas con fecha | Muy alta |
| src-openai-codex-cloud | Codex Cloud | https://learn.chatgpt.com/codex/cloud | OpenAI | 2026-10-22 (ID reutilizado) | Espacio de trabajo por tarea; sigue con el equipo apagado; red configurable; secretos por entorno | Muy alta |
| src-openai-codex-security | Agent approvals and security | https://learn.chatgpt.com/codex/agent-approvals-security | OpenAI | 2026-10-22 (ID reutilizado) | Sandbox local `workspace-write`; red local desactivada por defecto; búsqueda en índice cacheado; riesgo de inyección | Alta |
| src-openai-codex-cli-reference | Codex CLI reference | https://learn.chatgpt.com/codex/cli/reference | OpenAI | 2026-10-22 | `--oss` con `--local-provider` (Ollama, LM Studio); `--model` | Alta |
| src-openai-codex-imagegen | Image generation (Codex) | https://learn.chatgpt.com/codex/image-generation | OpenAI | 2026-10-21 (reutilizada) | Generación de imágenes integrada; consumo 3–5× | Muy alta |
| src-openai-help-capabilities | ChatGPT capabilities overview | https://help.openai.com/en/articles/9260256-chatgpt-capabilities-overview | OpenAI | 2026-10-22 | Herramientas de ChatGPT (búsqueda, investigación, imagen, archivos y audio, análisis con código, voz, memoria, proyectos, tareas) | Alta |
| src-openai-help-deep-research | Deep research in ChatGPT | https://help.openai.com/en/articles/10500283-deep-research-in-chatgpt | OpenAI | 2026-10-22 | Flujo con plan revisable; informe con citas; fuentes y apps solo en lectura; búsqueda frente a investigación; uso por plan | Alta |
| src-openai-help-data-training | How your data is used to improve model performance | https://help.openai.com/en/articles/5722486-how-your-data-is-used-to-improve-model-performance | OpenAI | 2026-10-22 | Entrenamiento según plan y ajuste; empresa y API excluidos por defecto; chats temporales; feedback | Alta |
| src-openai-blog-hallucinate | Why language models hallucinate (2025-09-05) | https://openai.com/index/why-language-models-hallucinate/ | OpenAI | 2026-10-22 | Definición; incentivos de las evaluaciones; ejemplo abstención/acierto/error; origen en el preentrenamiento; no inevitables; exactitud < 100 % | Baja |
| src-arxiv-why-hallucinate | Why Language Models Hallucinate (Kalai, Nachum, Vempala, Zhang; 2025-09-04) | https://arxiv.org/abs/2509.04664 | OpenAI / Georgia Tech (arXiv) | 2026-10-22 | Alucinación como error de clasificación binaria en el preentrenamiento; persistencia por puntuación que premia adivinar; remedio sociotécnico | Baja |
| src-openai-gpt-oss | Introducing gpt-oss (2025-08-05) | https://openai.com/index/introducing-gpt-oss/ | OpenAI | 2026-10-22 | Pesos abiertos Apache 2.0; 20B con 16 GB, 120B en una GPU de 80 GB; uso local | Media |
| src-openai-eval-best-practices | Evaluation best practices | https://developers.openai.com/api/docs/guides/evaluation-best-practices | OpenAI | 2026-10-21 (reutilizada) | Proceso de evaluación; calificadores; condiciones comparables | Alta |
| src-openai-evals-guide | Evals (guía) | https://developers.openai.com/api/docs/guides/evals | OpenAI | 2026-10-21 (reutilizada) | Plataforma Evals: solo lectura 2026-10-31, cierre 2026-11-30 | Muy alta |
| src-github-copilot-features | About GitHub Copilot | https://docs.github.com/en/copilot/get-started/features | GitHub | 2026-10-22 | Capacidades por categoría; disponibilidad según plan, cliente y políticas | Alta |
| src-github-copilot-agents | About GitHub Copilot agents | https://docs.github.com/en/copilot/concepts/agent-capabilities/about-agents/about-github-copilot-agents | GitHub | 2026-10-22 | Superficies de agentes y dónde ejecutan; cuándo elegir cada una | Muy alta |
| src-github-copilot-plans | Plans for GitHub Copilot | https://docs.github.com/en/copilot/get-started/plans | GitHub | 2026-10-22 | Planes, precios, créditos, funciones y modelos por plan; CLI y app en todos los planes | Muy alta |
| src-github-copilot-billing-individuals | Usage-based billing for individuals | https://docs.github.com/en/copilot/concepts/billing-and-usage/individuals/billing | GitHub | 2026-10-22 | 1 crédito = USD 0,01; qué consume; completions excluidas; descuento por selección automática; plan Max; qué pasa al agotar créditos | Muy alta |
| src-github-blog-ubb | GitHub Copilot is moving to usage-based billing (2026-04-27) | https://github.blog/changelog/2026/04/27/github-copilot-is-moving-to-usage-based-billing/ | GitHub | 2026-10-22 (ID reutilizado) | Créditos por tokens al precio de API desde 2026-06-01; completions incluidas; code review consume minutos de Actions | Alta |
| src-github-copilot-model-comparison | AI model comparison | https://docs.github.com/en/copilot/reference/ai-models/model-comparison | GitHub | 2026-10-22 | Categorías de tarea para elegir modelo; lista desfasada respecto de los planes | Muy alta |
| src-github-changelog-cli-ga | GitHub Copilot CLI is now generally available (2026-02-25) | https://github.blog/changelog/2026-02-25-github-copilot-cli-is-now-generally-available/ | GitHub | 2026-10-22 | CLI GA; modo plan; delegación a la nube con `&` | Media |
| src-github-changelog-gemini | Gemini models in Copilot CLI, cloud agent, and the Copilot app (2026-06-02) | https://github.blog/changelog/2026-06-02-gemini-models-in-copilot-cli-cloud-agent-and-the-copilot-app/ | GitHub | 2026-10-22 | Copilot app en *technical preview* a esa fecha | Alta |
| src-google-prompting-strategies | Prompt design strategies | https://ai.google.dev/gemini-api/docs/prompting-strategies | Google | 2026-10-21 (reutilizada) | Usar ejecución de código para aritmética y cálculos en vez del razonamiento sin ayuda | Media |
| src-arxiv-kadavath-know | Language Models (Mostly) Know What They Know (Kadavath et al., 2022) | https://arxiv.org/abs/2207.05221 | Anthropic (arXiv) | 2026-10-22 | Calibración razonable en formatos cerrados; autoevaluación; calibración poco fiable en tareas nuevas | Baja |
| src-arxiv-sycophancy | Towards Understanding Sycophancy in Language Models (Sharma et al., 2023; v4 2025) | https://arxiv.org/abs/2310.13548 | Anthropic y otros (arXiv) | 2026-10-22 | Asistentes que priorizan coincidir con el usuario; papel de las preferencias humanas | Baja |
| src-arxiv-lost-middle | Lost in the Middle: How Language Models Use Long Contexts (Liu et al., 2023; TACL) | https://arxiv.org/abs/2307.03172 | Stanford y otros (arXiv) | 2026-10-22 | Peor uso de la información situada en medio de entradas largas | Baja |
| src-chroma-context-rot | Context Rot: How Increasing Input Tokens Impacts LLM Performance (2025-07-14) | https://www.trychroma.com/research/context-rot | Chroma (informe técnico) | 2026-10-22 | Degradación con la longitud de entrada en 18 modelos, incluso en tareas simples; efecto de distractores | Media |
| src-scirep-fabricated-citations | Fabrication and errors in the bibliographic citations generated by ChatGPT (Walters y Wilder, 2023) | https://pmc.ncbi.nlm.nih.gov/articles/PMC10484980/ (DOI 10.1038/s41598-023-41032-5) | Scientific Reports | 2026-10-22 | 55 % y 18 % de referencias inventadas según el modelo; errores sustantivos en referencias reales; modelos de 2023 | Baja |
| src-transluce-o3-truthfulness | Investigating truthfulness in a pre-release o3 model (2025-04-16) | https://transluce.org/investigating-o3-truthfulness | Transluce (laboratorio sin fines de lucro) | 2026-10-22 | Un modelo afirmó haber ejecutado código que no podía ejecutar e inventó salidas | Baja |
| src-nist-ai-600-1 | AI RMF: Generative AI Profile (NIST AI 600-1, julio de 2024) | https://doi.org/10.6028/NIST.AI.600-1 | NIST | 2026-10-22 | Confabulación como riesgo; sesgo de automatización y confianza excesiva | Baja |

Total: 56 fuentes: 40 con ID nuevo, 8 con ID existente consultadas de nuevo hoy ("ID reutilizado") y 8 reutilizadas del registro del 2026-10-21 sin volver a abrirlas (salvo `src-anthropic-building-agents`, que sí se volvió a abrir). Las IDs `src-anthropic-cc-cloud`, `src-anthropic-cc-costs`, `src-openai-codex-pricing`, `src-openai-codex-cloud`, `src-openai-codex-imagegen`, `src-github-blog-ubb` y `src-openai-reasoning` ya estaban en `investigacion/curriculo-estado-del-arte.md` o en el registro de M02, pero no todas en `content/sources.json`; habrá que añadirlas al integrar.

---

## 7. Huecos (lo que no pude verificar)

1. **Fechas de página.** Casi ninguna página de producto de OpenAI, GitHub ni de la plataforma de Anthropic muestra fecha de publicación o actualización. Se fecha por la consulta (2026-10-22), no por la vigencia.
2. **Codex Cloud: red por defecto y planes.** La página actual de Codex Cloud muestra el acceso a internet como ajuste, pero no dice el valor por defecto ni qué planes lo incluyen; la página de seguridad solo documenta el comportamiento del Codex Cloud "legacy" (fase de agente sin red).
3. **Inconsistencia en la ayuda de Claude sobre creación de archivos.** La misma página dice que en Team la red está desactivada por defecto y, más abajo, que viene activada solo para gestores de paquetes. No se puede afirmar el valor por defecto en Team sin más verificación.
4. **Estado actual de la Copilot app.** Solo la vi como *technical preview* en un changelog del 2026-06-02; la página de agentes y la de planes no indican madurez. Tampoco verifiqué qué es exactamente "ChatGPT Work" (la página de modelos de Codex menciona la app de escritorio "Work and Codex" y que esos modelos no están en el chat).
5. **Precios de suscripción de ChatGPT fuera de Codex y de los planes Max/Team de Claude.** Los precios de ChatGPT salen de la página de precios de Codex; la página de precios de Claude carga los importes por script y no pude leerlos. Para Max y Team no hay cifra verificada.
6. **Política de datos de Copilot.** No consulté la documentación de GitHub sobre uso de datos y retención de Copilot por plan. Una ficha de privacidad para Copilot queda pendiente.
7. **Generación de imágenes y voz en ChatGPT.** Solo verifiqué que existen (página de capacidades). No verifiqué el modelo de imagen de ChatGPT ni sus límites por plan; el dato `gpt-image-2` es de Codex (registro del 2026-10-21).
8. **Contexto efectivo frente a contexto anunciado.** Las fuentes sobre *context rot* y "lost in the middle" usan modelos de 2023–2025. No encontré una medición independiente con los modelos de octubre de 2026; la idea se enseña como tendencia, sin cifras.
9. **Tasas actuales de alucinación.** No encontré mediciones independientes recientes comparables entre los modelos vigentes; las cifras citadas son de 2023 (citas) y del ejemplo del propio OpenAI (2025).
10. **Gemini y otros agentes.** No se investigaron (el currículo de M01 se limita a Codex, Claude Code, Copilot, ChatGPT y Claude). Copilot ofrece modelos de Google en algunas superficies, pero no se documentó.
11. **Modelos locales distintos de gpt-oss.** Solo verifiqué gpt-oss y el soporte `--oss` de Codex CLI. No verifiqué si Claude Code admite modelos locales (la documentación habla de proveedores de nube de terceros, no de inferencia local).
12. **IDs duplicados en `content/sources.json`.** `src-anthropic-eng-evals` y `src-anthropic-evals-agents` apuntan a la misma URL; aquí se usa `src-anthropic-evals-agents`. Conviene unificarlos al integrar.
13. **Cálculo de costos del ejemplo de L5.** Es ilustrativo: excluye tokens de razonamiento (variables y cobrados como salida) y no mide el número real de tokens de una nota en español con el tokenizador vigente.

# Revisión cruzada T-024 — M01, lecciones 1 a 3

Fecha de revisión: 2026-10-23

Alcance: `course.json`, las tres primeras lecciones de M01, sus 16 preguntas de comprobación y repaso, conceptos erróneos, seis fichas de producto, las fuentes citadas y las rutas de M01 en preparación.

## Hallazgos

- [T024-01] Severidad: alta
  Ubicación: `content/courses/m01/lessons/m01-l1.md:20,52`, `content/courses/m01/questions/checks.json` (`m01-l1-c2`), `content/courses/m01/misconceptions.json` (`m01-mc02`) y `content/courses/m01/product-cards.json` (`m01-pc-cloud-sessions`)
  Evidencia: el texto, la pregunta y la ficha presentan como regla que una sesión en la nube parte de un clon remoto y nunca ve cambios locales sin subir. La documentación citada sí describe el clon desde GitHub, pero también documenta que `claude --cloud` puede empaquetar y subir el repositorio local, incluidos cambios sin confirmar en archivos seguidos por Git; en Windows nativo los sube tal cual. La afirmación solo es cierta para una sesión iniciada desde el repositorio remoto, no para toda sesión en la nube.
  Consecuencia: enseña una frontera falsa entre local y nube, y `m01-l1-c2` puede marcar incorrecta una explicación válida para un flujo admitido por la herramienta.
  Corrección recomendada: acotar el ejemplo y la pregunta a «una sesión en la nube iniciada desde GitHub que clona la rama remota», o explicar ambos caminos: clon remoto frente a paquete local subido. Mantener aparte la regla válida de que la configuración personal fuera del repositorio no llega por ese paquete.

- [T024-02] Severidad: media
  Ubicación: `content/courses/m01/lessons/m01-l3.md:26`, `content/courses/m01/misconceptions.json` (`m01-mc09`, `m01-mc23`)
  Evidencia: «En una conversación, cada turno vuelve a enviar todo lo anterior» se afirma sin condición. La fuente de contexto lo describe para solicitudes API que conservan el historial, pero señala que las interfaces de chat pueden administrar la ventana con una política de descarte inicial; Claude Code también compacta el historial. La fuente sí respalda que el contexto puede crecer y encarecer una sesión, pero no que toda conversación conserve y reenvíe todo su pasado.
  Consecuencia: el alumno puede concluir que compresión, descarte o resumen no existen y que el tamaño del contexto se comporta igual en todas las superficies.
  Corrección recomendada: escribir «en una sesión que conserva el historial, cada solicitud incluye el contexto acumulado; las interfaces pueden compactarlo o descartar partes antiguas». Ajustar los dos conceptos erróneos para que no repitan la versión absoluta.

- [T024-03] Severidad: media
  Ubicación: `content/courses/m01/product-cards.json`, `m01-pc-chat-capabilities`
  Evidencia: la ficha afirma que la creación de archivos de Claude produce formatos de oficina «de hasta 30 MB». Abrí la fuente citada `src-anthropic-support-files`: confirma ejecución de código, formatos y disponibilidad, pero no contiene ese límite. Tampoco lo respalda otra fuente de la ficha.
  Consecuencia: una cifra de capacidad muy volátil queda presentada como hecho verificable sin fuente; puede condicionar una elección de herramienta de forma equivocada.
  Corrección recomendada: retirar «de hasta 30 MB» o añadir la página oficial específica que fije ese límite, con fecha de comprobación y alcance de plan/superficie.

- [T024-04] Severidad: media
  Ubicación: `#/cursos/m01`, `src/pages/CourseOverview.tsx` (sección visible «Práctica y examen»)
  Evidencia: a 360 px la portada comunica bien «Manual en preparación: 3 de 6 lecciones escritas» y que laboratorio y examen llegarán al completar la revisión. Sin embargo, al final deja el encabezado «Práctica y examen» vacío, aunque el ticket define que un manual incompleto no debe mostrar esas rutas.
  Consecuencia: la pantalla deja una promesa visual sin contenido y contradice parcialmente el aviso de que esas partes aún no están disponibles.
  Corrección recomendada: ocultar el encabezado junto con la práctica y el examen mientras el curso esté incompleto; conservar el aviso de preparación y las tres lecciones disponibles.

- [T024-05] Severidad: baja
  Ubicación: `content/courses/m01/questions/checks.json`, `m01-l3-c2`, opción `o4`; `content/courses/m01/misconceptions.json`, `m01-mc23`
  Evidencia: el distractor sostiene que mensajes nuevos y cortos «casi no suman» al contexto. Se etiqueta como `m01-mc23`, cuya descripción es «El costo de una sesión es el de mi último mensaje». El error tratado por la pregunta es la acumulación y la relevancia del contexto, no el costo del último mensaje.
  Consecuencia: la analítica de conceptos erróneos asociará una respuesta sobre contexto con una creencia distinta sobre costos.
  Corrección recomendada: asociar la opción con `m01-mc09` y ajustar su explicación para hablar de acumulación y contexto irrelevante, o redefinir `m01-mc23` para cubrir ambas ideas sin perder precisión.

## Comprobaciones sin hallazgo

- Los seis objetivos del curso están formulados como decisiones observables por escenario y se pueden medir con opción múltiple. Las lecciones 1 a 3 cubren `m01-eo1` a `m01-eo3`; los objetivos 4 a 6 quedan para las lecciones pendientes, de acuerdo con el curso en preparación.
- Las 16 preguntas tienen una sola clave marcada, referencias de sección existentes y 36 distractores vinculados a conceptos erróneos existentes. Sus opciones se mezclan (`fixedOrder: false`) y las claves no siguen una pista sistemática de posición, extensión o forma. Fuera de T024-01, las claves, explicaciones y conceptos erróneos se sostienen frente a su apartado.
- Contrasté sus escenarios con `dx-b1-01` a `dx-b1-04`, comprobaciones, examen y caso de M02. Reaparecen el contexto de Altiplano y la idea de verificar, pero no encontré un escenario ni una decisión repetidos: M01 evalúa elegir herramienta, acceso o evidencia; M02 evalúa especificar y verificar un encargo de código.
- El cuerpo de las tres lecciones no nombra productos o proveedores; esas referencias están confinadas a las fichas. Hay dos fichas por lección. El texto principal suma aproximadamente 1 291, 979 y 965 palabras en L1, L2 y L3 antes de considerar directivas, por lo que las tres caben holgadamente en el presupuesto de 25 minutos junto con ejemplos, fichas y cuatro preguntas.
- En Chromium a 360 px, `#/cursos/m01` y `#/cursos/m01/lecciones/m01-l1` no tuvieron desborde horizontal y los enlaces y controles recibieron foco con Tab. La navegación a la lección y el aviso de preparación son claros, salvo T024-04.
- `npm test` pasó: 120/120. La generación de contenido informó 2 cursos, 9 lecciones, 135 preguntas y 18 fichas.

## Fuentes abiertas y resultado

| ID | Fuente abierta | Resultado de la comprobación |
| --- | --- | --- |
| `src-anthropic-building-agents` | Anthropic, *Building effective agents* | Confirma la distinción entre flujo con pasos fijados y agente que dirige herramientas; respalda L1. |
| `src-anthropic-cc-best-practices` | Anthropic, *Best practices for Claude Code* | Confirma gestionar contexto, compactar y comenzar de nuevo en casos definidos; respalda la recomendación general de L3 con el alcance señalado en T024-02. |
| `src-anthropic-cc-cloud` | Anthropic, *Use Claude Code in the cloud* | Confirma VM, clon remoto, red limitada y aislamiento; también el paquete local con cambios sin confirmar, origen de T024-01. |
| `src-anthropic-cc-costs` | Anthropic, *Manage costs effectively* | Confirma que Claude Code vuelve a enviar el contexto completo en su propia sesión y que el costo escala con él; no generaliza a todo chat. |
| `src-anthropic-cc-data-usage` | Anthropic, *Data usage* | Confirma que la política y retención dependen de tipo de cuenta y preferencias; respalda L1 y conceptos de privacidad posteriores. |
| `src-anthropic-cc-glossary` | Anthropic, *Claude Code glossary* | Confirma arnés, bucle, contexto, compactación, herramientas y superficies. |
| `src-anthropic-cc-overview` | Anthropic, *Claude Code overview* | Confirma que es un agente de código y las superficies principales; respalda la ficha de superficies. |
| `src-anthropic-context-windows` | Anthropic, *Context windows* | Confirma contenido de la ventana, tokens de razonamiento y *context rot*; distingue solicitudes API de interfaces de chat, origen de T024-02. |
| `src-anthropic-glossary` | Anthropic, *Glossary* | Confirma definiciones de token y contexto como memoria de trabajo. |
| `src-anthropic-models-overview` | Anthropic, *Models overview* | Confirma especificaciones, fecha de corte fiable y datos de entrenamiento para la familia actual de Claude. |
| `src-anthropic-pricing` | Anthropic, *Pricing* | Confirma que el tokenizador puede cambiar el conteo del mismo texto y respalda no estimar solo con palabras. |
| `src-anthropic-support-files` | Anthropic, *Create and edit files with Claude* | Confirma sandbox, ejecución de código, formatos y controles de red; no respalda 30 MB, origen de T024-03. |
| `src-anthropic-support-images` | Anthropic, *Can Claude produce images?* | Confirma que no genera fotos o ilustraciones y que los visuales disponibles usan HTML/SVG. |
| `src-anthropic-support-research` | Anthropic, *Use research on Claude* | Confirma búsquedas encadenadas, planes de pago, búsqueda web necesaria y móvil sin conectores. |
| `src-anthropic-support-web-search` | Anthropic, *Enable and use web search* | Confirma citas, habilitación organizacional y que una URL larga puede consumir contexto; las citas requieren comprobación humana. |
| `src-arxiv-lost-middle` | Liu et al., *Lost in the Middle* | Confirma degradación al ubicar información relevante en medio de contextos largos. |
| `src-chroma-context-rot` | Chroma, *Context Rot* | Confirma estudio de 18 modelos y degradación al crecer la entrada, incluidos distractores. |
| `src-github-changelog-cli-ga` | GitHub, *Copilot CLI is now generally available* | Confirma GA de CLI y delegación en nube con `&`. |
| `src-github-changelog-gemini` | GitHub, *Gemini models in Copilot…* | Confirma que la aplicación Copilot figuraba como vista previa técnica en la fecha citada. |
| `src-github-copilot-agents` | GitHub, *About GitHub Copilot agents* | Confirma elección de superficie local para guiar y nube para tarea acotada; respalda L2 y sus fichas. |
| `src-github-copilot-model-comparison` | GitHub, *AI model comparison* | Confirma categorías de tarea para la selección de modelos. |
| `src-google-prompting-strategies` | Google, *Prompt design strategies* | Confirma instrucciones claras y uso de ejecución de código para cálculos; respalda L2. |
| `src-openai-codex-cloud` | OpenAI, *Codex Cloud* | Confirma un espacio de trabajo por tarea, continuidad con equipo apagado y configuración de red por entorno. |
| `src-openai-help-capabilities` | OpenAI, *ChatGPT capabilities overview* | Confirma búsqueda, investigación, archivos, análisis de datos con código, imagen y audio según plan y ajustes. |
| `src-openai-help-deep-research` | OpenAI, *Deep research in ChatGPT* | Confirma plan revisable, varias fuentes, informe con citas y que el chat normal sirve para consultas rápidas. |
| `src-openai-models` | OpenAI, *Models* | Confirma los valores de contexto, salida y corte de GPT-6 Astra, Sol y Luna consignados en la ficha. |
| `src-openai-reasoning` | OpenAI, *Reasoning models* | Confirma que los tokens de razonamiento no se ven en la salida y ocupan contexto y costo de salida. |
| `src-transluce-o3-truthfulness` | Transluce, *Investigating truthfulness in a pre-release o3 model* | Confirma el caso de afirmaciones de ejecución de código sin herramienta; respalda la exigencia de evidencia real. |

# Revisión cruzada T-025 — M01, lecciones 4 a 6

Fecha de revisión: 2026-10-23

Alcance: lecciones 4 a 6, sus 18 comprobaciones y repasos, `m01-mc32` a `m01-mc35` y las fichas `m01-pc-hallucination-guidance`, `m01-pc-api-prices` y `m01-pc-plans-data`. Se contrastaron las fuentes citadas y las páginas volátiles el 2026-10-23.

## Hallazgos

- [T025-01] Severidad: alta
  Ubicación: `content/courses/m01/lessons/m01-l6.md`, ejemplo resuelto «Dos asistentes para el resumen semanal», apartado «La conclusión».
  Evidencia: R1 y R2 se declaran criterios críticos. A pasa R1 en 3 de 3, pero pasa R2 en solo 2 de 3; B tampoco pasa R1 en todos los ensayos. La lección acaba de establecer que un criterio crítico se exige en todos los ensayos y no se compensa con los demás, pero recomienda A pese a su fallo en R2.
  Consecuencia: el ejemplo anula la regla que debe enseñar: puede hacer pensar que basta acertar el criterio crítico que parezca más importante para recomendar una herramienta.
  Corrección recomendada: concluir que ninguna herramienta queda recomendada todavía; ajustar la tarea, el prompt o las candidatas y repetir los ensayos hasta que una cumpla R1 y R2 en todos. Si se quiere recomendar A con revisión humana, R2 debe dejar de llamarse crítico y describirse como condición operativa explícita.

- [T025-02] Severidad: media
  Ubicación: `content/courses/m01/product-cards.json`, `m01-pc-plans-data`.
  Evidencia: la ficha presenta los planes de Codex como si todos tuvieran ventanas de cinco horas y límites semanales. La página vigente especifica que las estimaciones de cinco horas son para Plus y Business estándar, y que Pro no tiene límite de cinco horas. Los límites también dependen del plan, el modelo y la tarea.
  Consecuencia: alguien con Pro puede interpretar un límite que no le aplica, y la ficha enseña una regla uniforme para límites que son específicos de cada plan.
  Corrección recomendada: sustituir esa parte por «los límites dependen del plan, el modelo y la tarea; Plus y Business estándar muestran una ventana de cinco horas, mientras Pro no tiene ese límite». Mantener el enlace al panel de uso para los valores vigentes.

- [T025-03] Severidad: media
  Ubicación: `content/courses/m01/product-cards.json`, `m01-pc-plans-data`; `content/courses/m01/lessons/m01-l5.md:54` y `m01-l5-r2`.
  Evidencia: «los planes individuales ... usan las conversaciones para entrenar solo si el usuario lo permite» omite excepciones documentadas. En OpenAI, enviar una valoración puede permitir usar la conversación asociada incluso tras excluirse; en Anthropic, una conversación señalada para revisión de seguridad puede analizarse o usarse para salvaguardas. Los productos comerciales no entrenan por defecto, pero Anthropic también exceptúa la retroalimentación y los reportes de errores.
  Consecuencia: la ficha presenta el ajuste de entrenamiento como garantía absoluta y puede llevar a tomar una decisión de privacidad sin considerar las vías de excepción.
  Corrección recomendada: redactar «por defecto, el usuario controla el uso para mejora en los planes individuales; revisa las excepciones de retroalimentación y seguridad. En planes comerciales y API no se entrena por defecto, salvo los mecanismos de uso que su política describa». En la lección, distinguir uso para entrenamiento de retención y remitir a la política del plan.

- [T025-04] Severidad: media
  Ubicación: `content/courses/m01/questions/checks.json`, `m01-l6-c3`, clave y explicación.
  Evidencia: la clave «Con estas versiones, A cumplió 3 de 3 y B 1 de 3; repetir si cambian» no dice para qué tarea ni qué entradas se compararon, y solo contiene la fecha de forma implícita en el escenario. Sin embargo, `m01-l6#conclusion` exige que la conclusión diga tarea, entradas, fecha y versiones; la explicación afirma que la clave «dice qué se comparó» cuando no lo hace.
  Consecuencia: se marca como modelo una conclusión que no conserva el alcance de la evidencia y facilita generalizar su resultado a otra tarea.
  Corrección recomendada: convertir la clave en algo como «Para el resumen semanal con este snapshot y estas versiones, el 23 de octubre A cumplió el criterio crítico 3 de 3 y B 1 de 3; repetir si cambia una condición» y ajustar los distractores y el *feedback* al mismo criterio.

## Comprobaciones sin hallazgo

- Abrí las 39 fuentes citadas por las tres lecciones y las fichas. Las afirmaciones prioritarias de L4 sobre confabulación, abstención, calibración, *sycophancy*, citas de 2023 y NIST conservan el alcance de sus fuentes. Los porcentajes 55 % y 18 % corresponden a GPT-3.5 y GPT-4 del estudio de 2023, y el texto los limita correctamente a esos modelos y fecha.
- Las cifras de `m01-pc-api-prices` y los cálculos del caso de 1 200 notas siguen correctos al 2026-10-23: 0,96 MTok de entrada y 0,18 MTok de salida dan aproximadamente USD 0,09 por lotes con Haiku, USD 7,44 con Opus y USD 18,60 con Fable. La ficha de planes conserva precios, créditos y capacidades publicados el 2026-10-22; no encontré cambios materiales desde esa fecha.
- Las 18 preguntas revisadas tienen una única clave, `sectionRef` existente, explicaciones coherentes con el apartado y distractores con concepto erróneo válido. No hay patrón de longitud o posición que revele la clave en esas preguntas ni en el banco completo informado (34 comprobaciones). La comparación de `m01-l5-c1` usa una decisión distinta de `dx-b1-03`: primero probar esfuerzo en el mismo modelo, frente a seleccionar configuraciones por una rúbrica; no repite el escenario ni la decisión del diagnóstico o de M02.
- L4, L5 y L6 suman aproximadamente 1 429, 1 568 y 1 074 palabras, respectivamente, incluidos los bloques didácticos. Caben en 25 minutos con las preguntas. El cuerpo no nombra productos ni proveedores; los nombres restantes son identificadores de cita o fichas. La prosa sigue la guía de estilo y mantiene dos, dos y ninguna ficha de producto, respectivamente.
- `npm test` pasó: 120/120. La compilación de contenido informó 2 cursos, 12 lecciones, 153 preguntas y 21 fichas.

## Fuentes abiertas y resultado

| ID | Fuente abierta | Resultado de la comprobación |
| --- | --- | --- |
| `src-nist-ai-600-1` | NIST, *AI RMF: Generative AI Profile* | Confirma la definición de confabulación, los riesgos de confianza excesiva y la recomendación de verificar citas. |
| `src-openai-blog-hallucinate` | OpenAI, *Why language models hallucinate* | Confirma que las alucinaciones persisten y que los incentivos de evaluación premian adivinar; respalda L4 con el alcance indicado. |
| `src-arxiv-why-hallucinate` | Kalai et al., *Why Language Models Hallucinate* | Confirma el argumento estadístico y el incentivo a adivinar ante incertidumbre. |
| `src-anthropic-reduce-hallucinations` | Anthropic, *Reduce hallucinations* | Confirma abstención, citas textuales, restricción al material y que son mitigaciones, no eliminación. |
| `src-arxiv-kadavath-know` | Kadavath et al., *Language Models (Mostly) Know What They Know* | Confirma calibración en preguntas cerradas en las condiciones estudiadas; L4 no la extiende a tareas nuevas. |
| `src-arxiv-sycophancy` | Sharma et al., *Towards Understanding Sycophancy…* | Confirma la tendencia de asistentes a ajustar respuestas a las creencias del usuario. |
| `src-scirep-fabricated-citations` | Walters y Wilder, *Fabrication and errors…* | Confirma 55 % de citas fabricadas para GPT-3.5 y 18 % para GPT-4 en la muestra de 2023. |
| `src-anthropic-support-web-search` | Anthropic, *Enable and use web search* | Confirma búsqueda web y citas como capacidades sujetas a disponibilidad y configuración. |
| `src-google-prompting-strategies` | Google, *Prompt design strategies* | Confirma el uso iterativo de instrucciones y herramientas para verificaciones deterministas. |
| `src-transluce-o3-truthfulness` | Transluce, *Investigating truthfulness…* | Confirma casos de acciones y cálculos declarados sin evidencia de herramienta. |
| `src-anthropic-cc-glossary` | Anthropic, *Claude Code glossary* | Confirma contexto, herramientas y trazas; no contradice el método de evidencia de L4. |
| `src-anthropic-choosing-model` | Anthropic, *Choosing the right model* | Confirma calidad, velocidad, costo, evaluación propia y esfuerzo como palanca; respalda L5 y L6. |
| `src-anthropic-glossary` | Anthropic, *Glossary* | Confirma ventana de contexto y no determinismo. |
| `src-anthropic-pricing` | Anthropic, *Pricing* | Confirma precios, caché, lotes al 50 % y búsqueda web a USD 10 por mil; sin cambio material desde el 22. |
| `src-anthropic-cc-data-usage` | Anthropic, *Data usage* | Confirma flujo local/nube y retención según cuenta; también sustenta el matiz de T025-03. |
| `src-anthropic-effort` | Anthropic, *Effort* | Confirma niveles y valores por defecto de esfuerzo; sin cambio material desde el 22. |
| `src-openai-reasoning` | OpenAI, *Reasoning models* | Confirma que los tokens de razonamiento no se ven, ocupan contexto y se cobran como salida. |
| `src-anthropic-context-windows` | Anthropic, *Context windows* | Confirma el efecto del contexto y límites de la ventana; no amplía los cargos específicos de OpenAI. |
| `src-anthropic-support-pro-plan` | Anthropic, *What is the Pro plan?* | Confirma USD 20 mensual en EE. UU. y que Pro no incluye API. |
| `src-openai-codex-pricing` | OpenAI, *Codex pricing* | Confirma precios de planes, API sin funciones en nube y límites específicos por plan; origina T025-02. |
| `src-github-blog-ubb` | GitHub, *Copilot is moving to usage-based billing* | Confirma el cambio a créditos y la fecha indicada. |
| `src-github-copilot-billing-individuals` | GitHub, *Usage-based billing for individuals* | Confirma que un crédito equivale a USD 0,01 y el consumo depende de modelo y tokens. |
| `src-openai-pricing` | OpenAI, *Pricing* | Confirma los precios de GPT-6, caché, lotes/flex y búsqueda; sin cambio material desde el 22. |
| `src-anthropic-support-research` | Anthropic, *Use research on Claude* | Confirma investigación encadenada y consumo de búsqueda/conectores. |
| `src-openai-codex-imagegen` | OpenAI, *Image generation* | Confirma que generar imágenes consume el límite de Codex más rápido que turnos comparables. |
| `src-anthropic-cc-costs` | Anthropic, *Manage costs effectively* | Confirma aproximadamente 7× en equipos de agentes y USD 13 por desarrollador y día activo. |
| `src-anthropic-cc-cloud` | Anthropic, *Use Claude Code in the cloud* | Confirma la copia de código a una VM para la sesión en nube. |
| `src-openai-gpt-oss` | OpenAI, *Introducing gpt-oss* | Confirma pesos abiertos Apache 2.0 y que gpt-oss-20b puede correr con 16 GB de memoria. |
| `src-openai-codex-cli-reference` | OpenAI, *Codex CLI reference* | Confirma la compatibilidad con proveedores locales mediante `--oss`. |
| `src-openai-help-data-training` | OpenAI, *How your data is used…* | Confirma controles individuales, exclusión por defecto comercial/API y excepción de *feedback*; origina T025-03. |
| `src-anthropic-privacy-consumer-training` | Anthropic, *Is my data used for model training?* (consumidor) | Confirma ajuste del usuario y excepción de conversaciones señaladas para seguridad; origina T025-03. |
| `src-anthropic-privacy-commercial-training` | Anthropic, *Is my data used for model training?* (comercial) | Confirma no entrenamiento por defecto y excepción de *feedback* o reporte de errores; origina T025-03. |
| `src-anthropic-develop-tests` | Anthropic, *Define success criteria and build evaluations* | Confirma criterios específicos y medibles; respalda L6. |
| `src-anthropic-evals-agents` | Anthropic, *Demystifying evals for AI agents* | Confirma entradas, calificación y lectura de trazas como partes de una evaluación. |
| `src-openai-eval-best-practices` | OpenAI, *Evaluation best practices* | Confirma mantener condiciones comparables y registrar su contexto. |
| `src-openai-codex-models` | OpenAI, *Codex models* | Confirma que modelos y disponibilidad cambian; respalda fechar y repetir comparaciones. |
| `src-anthropic-models-overview` | Anthropic, *Models overview* | Confirma catálogo, precios y valores por defecto de los modelos de la ficha. |
| `src-openai-models` | OpenAI, *Models* | Confirma el catálogo de modelos de OpenAI referido por la ficha. |
| `src-github-copilot-plans` | GitHub, *Plans for GitHub Copilot* | Confirma USD 10/39/100, 1 500/7 000/20 000 créditos y Business/Enterprise; sin cambio material desde el 22. |

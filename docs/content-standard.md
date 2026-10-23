# Estándar de contenido

**Versión:** 0.3 (0.2: revisión de Codex en T-003; 0.3: guía de estilo y revisión de estilo, D-021) · **Fecha:** 2026-10-21 · **Tarea:** F0-08
**Base:** `investigacion/pedagogia-evaluacion.md` (reglas R-…, con su evidencia), `investigacion/M02-prompting-especificaciones.md` §4, `plan.md` §5 y §11, y las decisiones D-007, D-011 y D-012.

Todo contenido del curso cumple este estándar antes de publicarse. Cada punto de las listas tiene que poder verificarlo un revisor. Entre paréntesis va la regla de origen en la investigación de pedagogía.

**Hipótesis del piloto.** Las cifras marcadas con **[H]** son inferencias pedagógicas, no hallazgos con evidencia directa. M02 las pone a prueba y la puerta F1-13 decide si se confirman, se ajustan o se descartan, con los datos indicados en §9.

---

## 1. Principios

1. **Cada objetivo se evalúa.** Ningún objetivo sin pregunta, práctica o ambas; ninguna pregunta sin objetivo (R-B-2, R-B-3).
2. **Primero la recuperación, después el resumen.** El alumno intenta recordar antes de releer (R-A1-1, R-A1-5).
3. **Ejemplo resuelto → ejemplo para completar → problema.** Las ayudas se retiran a medida que se demuestra dominio (R-A3-1, R-A5-3).
4. **Se adapta por desempeño, no por autodescripción.** Nada de "estilos de aprendizaje" (R-A10-1).
5. **Solo imágenes que enseñan.** Lo decorativo se limita a portadas y separadores (R-A8-1).
6. **Hecho, recomendación o inferencia, siempre distinguibles.** Lo volátil lleva fuente y fecha (D-007).
7. **Casos sintéticos.** La empresa ficticia es Altiplano Industrial S.A. Nada de HPE ni datos reales; las definiciones de KPI se presentan como decisiones que hay que especificar, nunca como reglas financieras oficiales.

## 2. Voz y estilo

La guía completa, con ejemplos de antes y después y la tabla de calcos que se evitan, está en [`guia-de-estilo.md`](guia-de-estilo.md). Estos puntos la resumen.

- Español claro, en segunda persona ("tú") y en registro conversacional. Términos técnicos en inglés cuando ayuden a reconocer la interfaz o la documentación (*diff*, *worktree*, *prompt*).
- Prosa explicada, no telegráfica: cada párrafo une sus ideas con conectores y empieza por un caso antes de la regla. Un concepto nuevo por segmento. Los títulos de segmento enuncian la idea ("JSON Schema garantiza la forma, no la verdad"), no el tema ("JSON Schema").
- Términos clave definidos antes de usarse, con enlace al glosario.
- Ejemplos concretos e inspeccionables antes que abstracciones.
- Sin relleno motivacional, sin promesas ("dominarás…"), sin superlativos sobre productos.
- Sin temporizadores ni presión de tiempo.

## 3. Lección

### 3.1 Patrón (reemplaza el de `plan.md` §5)

| # | Bloque | Contenido |
| --- | --- | --- |
| 1 | Repaso inicial | 2–3 preguntas de lecciones anteriores, con prioridad para errores previos cometidos con confianza alta (desde la segunda lección del manual) (R-A2-1) |
| 2 | Decisión y objetivos | La decisión concreta que la lección enseña a tomar y 1–3 objetivos observables |
| 3 | Comprobación rápida opcional | Para quien tiene base: si acierta, ve el problema primero y el ejemplo queda como consulta (R-A5-2) |
| 4 | Explicación por segmentos | Breve, con ejemplo; visual solo si responde una pregunta del texto |
| 5 | Caso resuelto | Pasos, decisiones, razones y evidencia de verificación; como máximo una pregunta de autoexplicación con respuesta modelo (R-A3-1, R-A7-1) |
| 6 | Ejemplo para completar | El alumno termina un caso parecido |
| 7 | Comprobación final | 3–5 preguntas con el texto plegado, al menos una de aplicación a un escenario nuevo, feedback elaborado después de responder (R-A1-1, R-A1-2) |
| 8 | Resumen de consulta y fuentes | Después de la comprobación, nunca antes (R-A1-5) |

### 3.2 Lista de verificación

- [ ] 1–3 objetivos de lección con el formato "Dado…, [verbo observable]… [criterio]". Prohibidos los verbos vagos ("entender", "conocer", "familiarizarse") (R-B-1).
- [ ] Cada objetivo de lección está vinculado a uno de los objetivos evaluados del manual (§3.3) y tiene al menos 1 pregunta de comprobación. Si el verbo es de producción (redactar, revisar, configurar, evaluar), también una práctica con rúbrica (R-B-2 a R-B-4).
- [ ] 25 minutos o menos, comprobación incluida.
- [ ] Hay caso resuelto, ejemplo para completar y problema o práctica.
- [ ] Para cada decisión que se confunde con otra (flujo o agente, API o MCP, qué modelo para qué tarea), el manual incluye, después de enseñarla, una serie de 4–6 casos breves intercalados que obligan a elegir (R-A4-2).
- [ ] Lo "interesante pero no evaluable" va en un recuadro **Aparte** (R-A8-2).
- [ ] **Dos capas** (revisión T-006): el cuerpo enuncia principios duraderos, citados, sin nombrar productos ni proveedores; todo lo que depende de un producto, un modelo o una versión va en una ficha de producto (§7.2) enlazada desde el segmento. Lo comprueba `course-files.test.ts`.
- [ ] Legible a 360 px; bloques de código con desplazamiento propio.

### 3.3 Objetivos evaluados del manual (*blueprint*)

Cada manual declara **como máximo 6 objetivos evaluados**. Son la unidad de cobertura del banco y del examen:

- Los objetivos de lección (6–18 por manual) se vinculan a ellos; varios objetivos de lección pueden alimentar el mismo objetivo evaluado.
- Banco: **2 familias por objetivo evaluado** (12 familias con 6 objetivos).
- Examen: **2 ítems por objetivo evaluado** (12 ítems con 6 objetivos).
- La matriz de alineación (`content/courses/mNN/alignment.json`) muestra, por objetivo evaluado: objetivos de lección vinculados, comprobaciones, familias del banco y práctica. Ningún objetivo evaluado queda sin evidencia y ningún ítem queda sin objetivo.

## 4. Preguntas de opción múltiple

### 4.1 Usos y bancos separados

| Uso | Dónde | Regla |
| --- | --- | --- |
| Comprobación de lección | Dentro de la lección | Feedback inmediato. No se reutiliza en exámenes |
| Práctica | Modo práctica del manual | Feedback inmediato. Preguntas propias, distintas del banco de examen (R-A1-6) |
| Examen | Banco del manual | Corrección al final. Nunca aparecen en práctica |
| Diagnóstico | Banco del diagnóstico | Sin feedback durante; respuestas y explicación al terminar. Quedan marcadas como expuestas y no entran en exámenes (R-E-8) |

### 4.2 Banco de examen por manual

- Una **familia** es un *slot*: mismo objetivo evaluado, misma decisión, escenario distinto. Cada familia tiene **variantes**.
- **M02 (experimento, D-016):** 36 ítems = 12 familias × 3 variantes. Se miden horas de autoría, revisión y corrección.
- **Resto de manuales:** lo decide la puerta F1-13 con esos datos. Mientras no haya decisión, rige el plan: 20–24 ítems, organizados en dos formas disjuntas de 12 si son 24.
- La equivalencia entre variantes se declara como **supuesta**. Con un solo alumno no se puede igualar estadísticamente; por eso cada variante se revisa a mano.

### 4.3 Examen

- 12 ítems: 2 por objetivo evaluado (§3.3), una variante por familia, al azar.
- **Aprobado:** 10/12 **y** ningún objetivo con todos sus ítems fallados.
- El resultado se muestra como desempeño en esa versión ("aprobado · examen M02 v1"), no como dominio (D-012).
- **Primer intento** siempre visible en el historial, aunque luego se apruebe.
- **Reintento:** al día siguiente **[H]** y después del repaso de los errores. Las familias falladas cambian de variante. Se registra la variante usada.
- **Retención opcional:** a los 7 días o más **[H]**, 6 ítems de variantes no vistas; 5/6 **[H]** da el indicador "retenido". Nunca bloquea.
- **Confianza** (baja / media / alta): un toque, que se puede omitir, en exámenes y diagnóstico. Los errores con confianza alta se reprograman en la siguiente sesión (R-E-4).

### 4.4 Lista de verificación del ítem

- [ ] Declara `objective_id`, proceso de la taxonomía revisada, familia y variante (R-B-2, R-G-7).
- [ ] Mide un concepto importante con un escenario nuevo; nada de recuerdo literal ni trivia sobre productos (R-C1-1).
- [ ] El escenario trae solo la información necesaria; el enunciado tiene 120 palabras o menos **[H]** (R-C3-2).
- [ ] La pregunta es cerrada y de juicio: "mejor acción", "siguiente paso", "causa más probable" (R-C1-2).
- [ ] **Pasa la prueba de tapar las opciones:** con el enunciado solo, alguien que sabe podría responder (R-C1-1).
- [ ] Redactada en positivo. Si una negación es inevitable, va destacada (R-C1-3).
- [ ] **3 o 4 opciones,** con una sola correcta o claramente la mejor. Tres si no hay un tercer distractor real (R-C2-1).
- [ ] Cada distractor tiene un `misconception_id` real del catálogo del manual. Prohibido el distractor de relleno (R-C2-2, R-C4-1).
- [ ] Opciones homogéneas en contenido, gramática y longitud; la correcta no es la más larga ni la más específica (R-C1-5).
- [ ] Sin "todas/ninguna de las anteriores", sin combinaciones, sin absolutos que delaten, sin palabras repetidas entre enunciado y clave (R-C1-4, R-C1-5).
- [ ] Orden aleatorio, salvo opciones numéricas u ordinales, que llevan `fixed_order`. La posición de la clave se reparte de forma equilibrada en el banco (R-C1-6).
- [ ] **Feedback por opción,** de 2–4 frases **[H]** y centrado en la tarea: el error que revela cada distractor, la regla que justifica la clave y un enlace al apartado (R-D-2 a R-D-4).
- [ ] Independiente: ningún otro ítem del mismo examen le da la respuesta.
- [ ] Pasó la prueba "sin enunciado": mirando solo las opciones no se adivina la clave (R-C5-2).
- [ ] La clave la revisó alguien distinto del autor: Codex revisa lo de Claude (D-003, R-C5-1).
- [ ] ID y versión inmutables. Cambiar la clave, el enunciado o una opción crea una versión nueva; los intentos antiguos conservan la suya (R-05 de T-001).

### 4.5 Catálogo de conceptos erróneos

Cada manual mantiene `misconceptions.json`: ID, descripción del error, por qué es erróneo y fuente. Es la cantera de distractores. Para M02 ya hay 33 candidatos en `investigacion/M02-prompting-especificaciones.md` §3.

## 5. Prácticas y laboratorios

Desde D-024 (2026-10-23), el laboratorio es un **caso práctico de opción múltiple**: no hay entregable, rúbrica, autoevaluación ni revisión externa. La versión anterior de esta sección (rúbrica, cuaderno escrito y revisión asistida por LLM) queda en el historial de Git.

- [ ] Un caso continuo de la empresa ficticia del curso, contado por pasos (`## Paso N · … {#paso-n}`), con los materiales que hacen falta para decidir: correos, datos, salidas de scripts, diffs.
- [ ] Cada paso termina con `::lab-questions{step="paso-n"}` y sus preguntas (`use: "lab"`, `labStep`), que cumplen todo el §4: un objetivo evaluado cada una, distractores con concepto erróneo, explicación por opción.
- [ ] Al menos dos preguntas por objetivo evaluado del manual, con escenarios propios: no repiten los de las comprobaciones, el examen ni el diagnóstico.
- [ ] Las decisiones que antes pedían producir algo se evalúan eligiendo entre versiones plausibles: el mejor objetivo, el Then observable, el límite de acción bien escrito, la corrección en el origen.
- [ ] Hay al menos un giro del caso (un contraejemplo o un cambio de datos) que obliga a revisar una decisión anterior. Es la forma de opción múltiple del cuaderno de transferencia de D-012.
- [ ] Si hay código o datos, el caso incluye un apartado opcional «Pruébalo en tu entorno» con el check ejecutable. La app no finge ejecutar nada y no registra ese apartado.
- [ ] El laboratorio cuenta como hecho al responder todas sus preguntas. Al reintentar, las opciones cambian de orden.

## 6. Imágenes y visuales

- [ ] Declara su función: representar, organizar o explicar. Las decorativas solo van en la portada, la imagen principal o separadores (R-A8-1).
- [ ] Responde una pregunta del texto adyacente. El brief incluye `pedagogical_question` y `why_not_text_or_svg` (`coordinacion/PROTOCOLO.md` §6).
- [ ] Diagramas exactos (arquitectura, flujos, cifras, tablas) en SVG o código, nunca con un generador de imágenes.
- [ ] En SVG o visuales hechos con código, las etiquetas van dentro, junto a cada parte. En imágenes raster generadas no hay texto: lo equivalente va en HTML adyacente. La explicación va justo antes o después (R-A8-3).
- [ ] El elemento clave está señalizado igual que en el texto (R-A8-4).
- [ ] Sin elementos seductores: personajes, escenas o metáforas que no informan (R-A8-2). El visual no repite el párrafo (R-A8-5).
- [ ] El texto alternativo describe la información o la relación que muestra, no su apariencia.
- [ ] Legible con viewport de 360 × 780 y con el texto del navegador al 200 % (o tiene versión simplificada); el color no es el único portador de significado.
- [ ] Peso por archivo servido al celular ≤ 200 KB **[H]** (WebP o AVIF, con tamaños responsivos). Las imágenes que no están en la primera pantalla llevan `loading="lazy"`.

## 7. Fuentes y contenido volátil

### 7.1 Registro de fuentes

Cada fuente en `content/sources.json`: ID (`src-<org>-<slug>`), título, organización, URL, fecha de consulta, afirmaciones que sustenta, tipo (primaria / secundaria), volatilidad y fecha de próxima revisión. Los registros de `investigacion/` son la base.

- Fuentes primarias primero: documentación oficial, especificaciones, artículos con DOI.
- Producto y entorno siempre explícitos (chat, API, CLI, IDE, nube). Una capacidad de un producto no se atribuye al resto del proveedor.
- Se parafrasea. Como máximo una cita textual de menos de 15 palabras por fuente.
- Lo que no tiene fuente se marca como **recomendación** o **inferencia**.

### 7.2 Fichas de producto

**Regla:** toda afirmación que depende de un producto o una versión va en una ficha, no en el cuerpo de la lección. Afecta como mínimo a M01, M03, M05, M06, M07, M08, M09 y M10 (ver `docs/curriculum.md`).

```
producto · superficie · capacidad · estado (GA / beta / preview) ·
verificado el · fuente · próxima revisión
```

La app muestra la fecha de verificación. Si una ficha caduca, se marca "pendiente de verificar" en vez de seguir afirmándose.

## 8. Flujo editorial por lección

1. **Investigación:** registro de fuentes y conceptos erróneos (subagente de Claude).
2. **Borrador:** lección, comprobaciones y familias del banco (Claude).
3. **Verificación factual:** cada afirmación contra su fuente; las fichas, con fecha.
4. **Revisión de estilo:** el agente `revisor-de-texto` (`.claude/agents/revisor-de-texto.md`) reescribe con la guía de estilo sin tocar hechos, citas, directivas ni IDs; Claude revisa su diff.
5. **Revisión independiente:** Codex aplica este estándar y reporta hallazgos con el formato del protocolo.
6. **Corrección:** se cierran los hallazgos con una comprobación.
7. **Integración:** validación automática del contenido (esquemas, enlaces, IDs, cobertura de objetivos).

Una lección está **lista** solo cuando pasó los siete pasos. Codex revisa también la voz en el paso 5.

## 9. Cómo se ponen a prueba las hipótesis [H] en el piloto

| Hipótesis | Dato que se registra en M02 | Se confirma si | Si no |
| --- | --- | --- | --- |
| Lección de 25 minutos o menos | Tiempo real declarado por Daniel por lección | ≥ 5 de 6 lecciones caben | Partir las lecciones largas o recortar contenido |
| Reintento al día siguiente | Resultado del reintento y si hubo repaso | El reintento muestra mejora en familias falladas con variantes nuevas | Ajustar el intervalo |
| Retención a 7 días con 5/6 | Resultado de la comprobación diferida | Discrimina: no es 6/6 automático ni 0–2/6 | Cambiar el tamaño o el umbral |
| Enunciado ≤ 120 palabras, feedback de 2–4 frases | Hallazgos de la revisión de Codex y comentarios de Daniel | Sin hallazgos de "falta información" ni de feedback ilegible | Ajustar los límites |
| 36 ítems por manual | Horas de autoría, revisión y corrección | El costo por manual es sostenible para la Fase 3 | Bajar a 24 en dos formas (D-016) |
| Doble evaluación con discrepancia ≤ 1 nivel | Pares de evaluaciones de las prácticas de M02 | La regla resuelve la mayoría sin dejar todo en "revisión pendiente" | Ajustar el umbral o el procedimiento |
| Imagen ≤ 200 KB en el celular | Peso medido y revisión visual a 360 px | Se conserva la legibilidad | Ajustar el formato o el límite |

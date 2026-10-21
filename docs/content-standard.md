# Estándar de contenido

**Versión:** 0.1 (borrador para revisión de Codex) · **Fecha:** 2026-10-21 · **Tarea:** F0-08
**Base:** `investigacion/pedagogia-evaluacion.md` (reglas R-…, con su evidencia), `investigacion/M02-prompting-especificaciones.md` §4, `plan.md` §5 y §11, y las decisiones D-007, D-011 y D-012.

Todo contenido del curso cumple este estándar antes de publicarse. Cada punto de las listas tiene que poder verificarlo un revisor. Entre paréntesis va la regla de origen en la investigación de pedagogía.

---

## 1. Principios

1. **Cada objetivo se evalúa.** Ningún objetivo sin pregunta, práctica o ambas; ninguna pregunta sin objetivo (R-B-2).
2. **Primero la recuperación, después el resumen.** El alumno intenta recordar antes de releer (R-A1-1, R-A1-5).
3. **Ejemplo resuelto → ejemplo para completar → problema.** Las ayudas se retiran a medida que se demuestra dominio (R-A3-1, R-A5-3).
4. **Se adapta por desempeño, no por autodescripción.** Nada de "estilos de aprendizaje" (R-A10-1).
5. **Solo imágenes que enseñan.** Lo decorativo se limita a portadas y separadores (R-A8-1).
6. **Hecho, recomendación o inferencia, siempre distinguibles.** Lo volátil lleva fuente y fecha (D-007).
7. **Casos sintéticos.** La empresa ficticia es Altiplano Industrial S.A. Nada de HPE ni datos reales; las definiciones de KPI se presentan como decisiones que hay que especificar, nunca como reglas financieras oficiales.

## 2. Voz y estilo

- Español claro, en segunda persona ("tú") y en registro conversacional. Términos técnicos en inglés cuando ayuden a reconocer la interfaz o la documentación (*diff*, *worktree*, *prompt*).
- Frases cortas; un concepto nuevo por segmento. Los títulos de segmento enuncian la idea ("JSON Schema garantiza la forma, no la verdad"), no el tema ("JSON Schema").
- Términos clave definidos antes de usarse, con enlace al glosario.
- Ejemplos concretos e inspeccionables antes que abstracciones.
- Sin relleno motivacional, sin promesas ("dominarás…"), sin superlativos sobre productos.
- Sin temporizadores ni presión de tiempo.

## 3. Lección

### 3.1 Patrón (reemplaza el de `plan.md` §5)

| # | Bloque | Contenido |
| --- | --- | --- |
| 1 | Repaso inicial | 1–2 preguntas de lecciones anteriores (desde la segunda lección del manual) (R-A2-1) |
| 2 | Decisión y objetivos | La decisión concreta que la lección enseña a tomar y 1–3 objetivos observables |
| 3 | Comprobación rápida opcional | Para quien tiene base: si acierta, ve el problema primero y el ejemplo queda como consulta (R-A5-2) |
| 4 | Explicación por segmentos | Breve, con ejemplo; visual solo si responde una pregunta del texto |
| 5 | Caso resuelto | Pasos, decisiones, razones y evidencia de verificación; como máximo una pregunta de autoexplicación con respuesta modelo (R-A3-1, R-A7-1) |
| 6 | Ejemplo para completar | El alumno termina un caso parecido |
| 7 | Comprobación final | 3–5 preguntas con el texto plegado, al menos una de aplicación a un escenario nuevo, feedback elaborado después de responder (R-A1-1, R-A1-2) |
| 8 | Resumen de consulta y fuentes | Después de la comprobación, nunca antes (R-A1-5) |

### 3.2 Lista de verificación

- [ ] 1–3 objetivos con el formato "Dado…, [verbo observable]… [criterio]". Prohibidos los verbos vagos ("entender", "conocer", "familiarizarse") (R-B-1).
- [ ] Cada objetivo aparece en la matriz de alineación con al menos 1 pregunta de comprobación y 2 familias del banco de examen; si el verbo es de producción (redactar, revisar, configurar, evaluar), también una práctica con rúbrica (R-B-2 a R-B-4).
- [ ] 25 minutos o menos, comprobación incluida.
- [ ] Hay caso resuelto, ejemplo para completar y problema o práctica.
- [ ] Si el manual enseña conceptos fáciles de confundir, al menos una pregunta de contraste (R-A4-2).
- [ ] Lo "interesante pero no evaluable" va en un recuadro **Aparte** (R-A8-2).
- [ ] Toda afirmación técnica volátil lleva fuente y fecha, o está en una ficha de producto (§7).
- [ ] Legible a 360 px; bloques de código con desplazamiento propio.

## 4. Preguntas de opción múltiple

### 4.1 Usos y bancos separados

| Uso | Dónde | Regla |
| --- | --- | --- |
| Comprobación de lección | Dentro de la lección | Feedback inmediato. No se reutiliza en exámenes |
| Práctica | Modo práctica del manual | Feedback inmediato. Preguntas propias, distintas del banco de examen (R-A1-6) |
| Examen | Banco del manual | Corrección al final. Nunca aparecen en práctica |
| Diagnóstico | Banco del diagnóstico | Sin feedback durante; respuestas y explicación al terminar. Quedan marcadas como expuestas y no entran en exámenes (R-E-8) |

### 4.2 Banco de examen por manual

- **Objetivo:** 36 ítems = 12 familias × 3 variantes. Una familia es un *slot*: mismo objetivo, misma decisión, escenario distinto.
- **Mínimo aceptable si el esfuerzo no da:** 24 ítems en dos formas disjuntas de 12.
- **El piloto M02 se hace con 36** para medir el esfuerzo real. La puerta de calidad F1-13 decide si los demás manuales usan 36 o el mínimo (D-011).
- La equivalencia entre variantes se declara como **supuesta**. Con un solo alumno no se puede igualar estadísticamente; por eso cada variante se revisa a mano.

### 4.3 Examen

- 12 ítems, al menos 2 por objetivo evaluado. Una variante por familia, al azar.
- **Aprobado:** 10/12 **y** ningún objetivo con todos sus ítems fallados.
- El resultado se muestra como desempeño en esa versión ("aprobado · examen M02 v1"), no como dominio (D-012).
- **Primer intento** siempre visible en el historial, aunque luego se apruebe.
- **Reintento:** al día siguiente y después del repaso de los errores. Las familias falladas cambian de variante. Se registra la variante usada.
- **Retención opcional:** a los 7 días o más, 6 ítems de variantes no vistas; 5/6 da el indicador "retenido". Nunca bloquea.
- **Confianza** (baja / media / alta): un toque, que se puede omitir, en exámenes y diagnóstico. Los errores con confianza alta se reprograman en la siguiente sesión (R-E-4).

### 4.4 Lista de verificación del ítem

- [ ] Declara `objective_id`, proceso de la taxonomía revisada, familia y variante (R-B-2, R-G-7).
- [ ] Mide un concepto importante con un escenario nuevo; nada de recuerdo literal ni trivia sobre productos (R-C1-1).
- [ ] El escenario trae solo la información necesaria; el enunciado tiene 120 palabras o menos (R-C3-2).
- [ ] La pregunta es cerrada y de juicio: "mejor acción", "siguiente paso", "causa más probable" (R-C1-2).
- [ ] **Pasa la prueba de tapar las opciones:** con el enunciado solo, alguien que sabe podría responder (R-C1-1).
- [ ] Redactada en positivo. Si una negación es inevitable, va destacada (R-C1-3).
- [ ] **3 o 4 opciones,** con una sola correcta o claramente la mejor. Tres si no hay un tercer distractor real (R-C2-1).
- [ ] Cada distractor tiene un `misconception_id` real del catálogo del manual. Prohibido el distractor de relleno (R-C2-2, R-C4-1).
- [ ] Opciones homogéneas en contenido, gramática y longitud; la correcta no es la más larga ni la más específica (R-C1-5).
- [ ] Sin "todas/ninguna de las anteriores", sin combinaciones, sin absolutos que delaten, sin palabras repetidas entre enunciado y clave (R-C1-4, R-C1-5).
- [ ] Orden aleatorio, salvo opciones numéricas u ordinales, que llevan `fixed_order`. La posición de la clave se reparte de forma equilibrada en el banco (R-C1-6).
- [ ] **Feedback por opción,** de 2–4 frases y centrado en la tarea: el error que revela cada distractor, la regla que justifica la clave y un enlace al apartado (R-D-2 a R-D-4).
- [ ] Independiente: ningún otro ítem del mismo examen le da la respuesta.
- [ ] Pasó la prueba "sin enunciado": mirando solo las opciones no se adivina la clave (R-C5-2).
- [ ] La clave la revisó alguien distinto del autor: Codex revisa lo de Claude (D-003, R-C5-1).
- [ ] ID y versión inmutables. Cambiar la clave, el enunciado o una opción crea una versión nueva; los intentos antiguos conservan la suya (R-05 de T-001).

### 4.5 Catálogo de conceptos erróneos

Cada manual mantiene `misconceptions.json`: ID, descripción del error, por qué es erróneo y fuente. Es la cantera de distractores. Para M02 ya hay 33 candidatos en `investigacion/M02-prompting-especificaciones.md` §3.

## 5. Prácticas y laboratorios

- [ ] Cubre al menos un objetivo de producción que la opción múltiple no cubre (R-B-4).
- [ ] Declara antes de empezar: entradas, entregable, criterios de éxito y evidencias requeridas.
- [ ] Rúbrica analítica de 3–5 criterios con 3–4 niveles y descriptores observables (R-F-1). Los criterios críticos, que no se compensan con otros, van marcados (R-F-3).
- [ ] Un ejemplo anclado "logrado" y otro "insuficiente", ambos sintéticos (R-F-2).
- [ ] Andamiaje graduado: plantilla o ejemplo parcial, y versión sin andamiaje para quien ya demostró dominio (R-A3-3).
- [ ] Si hay código o datos, hay un **check ejecutable** que el alumno corre en su entorno (por ejemplo, la reconciliación de totales). La app no finge ejecutar nada.
- [ ] **Cuaderno de decisiones de transferencia** (D-012): decisión inicial → contraejemplo nuevo → decisión revisada → evidencia que hizo cambiar el criterio.
- [ ] Autoevaluación por criterio, citando la evidencia, antes de cualquier feedback externo (R-F-5).
- [ ] Preparada para revisión externa asistida por LLM con salvaguardas: rúbrica explícita, la evidencia se cita antes de puntuar, existe la salida "evidencia insuficiente", y se evalúa dos veces si el resultado cambia un estado (R-H-1 a R-H-8).
- [ ] Estados: presentada → autoevaluada → revisada (con revisor identificado). Una autoevaluación nunca figura como revisión.
- [ ] El reintento usa una variante o un caso nuevo. Reenviar la misma entrega no cuenta como transferencia (R-G-4).

## 6. Imágenes y visuales

- [ ] Declara su función: representar, organizar o explicar. Las decorativas solo van en la portada, la imagen principal o separadores (R-A8-1).
- [ ] Responde una pregunta del texto adyacente. El brief incluye `pedagogical_question` y `why_not_text_or_svg` (`coordinacion/PROTOCOLO.md` §6).
- [ ] Diagramas exactos (arquitectura, flujos, cifras, tablas) en SVG o código, nunca con un generador de imágenes.
- [ ] Etiquetas dentro del visual, junto a cada parte. La explicación va justo antes o después (R-A8-3).
- [ ] El elemento clave está señalizado igual que en el texto (R-A8-4).
- [ ] Sin elementos seductores: personajes, escenas o metáforas que no informan (R-A8-2). El visual no repite el párrafo (R-A8-5).
- [ ] El texto alternativo describe la información o la relación que muestra, no su apariencia.
- [ ] Legible a 360 px (o tiene versión simplificada); el color no es el único portador de significado.
- [ ] Peso razonable y carga diferida.

## 7. Fuentes y contenido volátil

### 7.1 Registro de fuentes

Cada fuente en `content/sources.json`: ID (`src-<org>-<slug>`), título, organización, URL, fecha de consulta, afirmaciones que sustenta, tipo (primaria / secundaria), volatilidad y fecha de próxima revisión. Los registros de `investigacion/` son la base.

- Fuentes primarias primero: documentación oficial, especificaciones, artículos con DOI.
- Producto y entorno siempre explícitos (chat, API, CLI, IDE, nube). Una capacidad de un producto no se atribuye al resto del proveedor.
- Se parafrasea. Como máximo una cita textual de menos de 15 palabras por fuente.
- Lo que no tiene fuente se marca como **recomendación** o **inferencia**.

### 7.2 Fichas de producto

Lo que cambia por versión vive en fichas, no en el cuerpo de la lección:

```
producto · superficie · capacidad · estado (GA / beta / preview) ·
verificado el · fuente · próxima revisión
```

La app muestra la fecha de verificación. Si una ficha caduca, se marca "pendiente de verificar" en vez de seguir afirmándose.

## 8. Flujo editorial por lección

1. **Investigación:** registro de fuentes y conceptos erróneos (subagente de Claude).
2. **Borrador:** lección, comprobaciones y familias del banco (Claude).
3. **Verificación factual:** cada afirmación contra su fuente; las fichas, con fecha.
4. **Revisión independiente:** Codex aplica este estándar y reporta hallazgos con el formato del protocolo.
5. **Corrección:** se cierran los hallazgos con una comprobación.
6. **Integración:** validación automática del contenido (esquemas, enlaces, IDs, cobertura de objetivos).

Una lección está **lista** solo cuando pasó los seis pasos.

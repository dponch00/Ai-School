# Currículo y mapa de competencias

**Versión:** 0.2 (incorpora la revisión de Codex en T-003) · **Fecha:** 2026-10-21 · **Tarea:** F0-07
**Base:** `plan.md` §2 y §4, más `investigacion/curriculo-estado-del-arte.md`, `investigacion/pedagogia-evaluacion.md`, `investigacion/M02-prompting-especificaciones.md` y la revisión de Codex en T-001.

Este documento reemplaza el temario de `plan.md` §4 cuando se apruebe. Los objetivos finales del plan (§2) no cambian. Lo que cambia es el reparto de temas, que se pone al día con el estado del arte de 2026, y la forma de medirlos.

---

## 1. Qué cambia respecto del plan y por qué

| Cambio | Antes (plan §4) | Ahora | Por qué |
| --- | --- | --- | --- |
| Verificación ejecutable | Implícita | Eje de M02 y M05: toda tarea delegada lleva un check que el agente puede correr y la entrega exige evidencia | Es la palanca principal que documentan Anthropic y OpenAI para agentes de código |
| *Spec-driven development* | No aparecía | Entra en M02 como versión ligera (spec autocontenida, entrevista del agente, hitos con prueba) | Hoy es práctica estándar (Spec Kit, Plan mode, patrón SPEC.md) |
| RAG | En M03.5 y M07.5 | Solo en M07 (recuperación conectada). M03 conserva "fuentes y recuperación justo a tiempo"; la evaluación de RAG va a M09 | Quitar el solapamiento |
| Comparación de prompts | En M02.6 | En M09 (evals). M02 se queda con los criterios de aceptación | La comparación seria exige casos fijos y varios ensayos: es metodología de evaluación |
| Agent Skills y capas de instrucciones | Una lección breve en M03 | Dos lecciones en M03, con reglas de precedencia por producto | Estándar abierto adoptado por Claude Code, Codex y Copilot; las rutas difieren entre herramientas |
| Seguridad | Solo en M07.2 y M09.5 | Se adelanta: permisos, sandbox y red en M05; secretos y mínimo privilegio en M07; modelo de amenazas y guardrails deterministas en M09 | Hay que saber limitar a un agente antes de dejarlo actuar |
| Autonomía actual | M08 genérico | M08 con subagentes, worktrees, agentes en la nube, tareas programadas, modo *headless*, hooks y costo en tokens | Los tres productos tienen ya estas capacidades |
| Revisión adversarial | En M08.5 | En M09.6 (revisión independiente). Su lugar en M08 lo ocupan "delegación asíncrona" (M08.4) y "automatización del arnés" (M08.5) | Es una técnica de evaluación, no de diseño de agentes |
| M10 | "Distribución, offline y actualización" | "Despliegue, actualización y continuidad" + mantenimiento de instrucciones, skills y regresión | Lo offline es particular de esta app; mantener lo construido con IA es universal |
| Lenguajes en M04 | Cuatro al mismo nivel | Python, SQL y JSON/TOML/YAML primero; TypeScript solo para reconocerlo | El arnés de los agentes se configura en JSON/TOML/YAML, y Python y SQL son los del dominio financiero |
| Imagen y audio en M01 | Una lección compartida | Una sección dentro de L2 | Poca relevancia para herramientas financieras |

**Fichas de producto (D-007).** Toda afirmación que depende de un producto o una versión va en una ficha fechada (producto, superficie, estado, fecha de verificación, fuente, próxima revisión), nunca en el cuerpo de la lección. Las más volátiles están en M01, M05, M07 y M08, pero también hay fichas en M03 (precedencia de instrucciones, rutas de skills), M06 (MCP de Databricks), M09 (plataformas de evals, listas OWASP) y M10 (hosting).

**Caso transversal.** Todos los manuales usan la misma empresa ficticia: **Altiplano Industrial S.A.**, un distribuidor B2B con tres regiones. Sus datos sintéticos e inspeccionables están definidos en `investigacion/M02-prompting-especificaciones.md` §2.0. Cada manual añade además un caso de transferencia distinto.

---

## 2. Mapa de competencias

Trece competencias. Las conductas observables se miden con escenarios de decisión, nunca con preguntas de memoria sobre productos.

| ID | Competencia | Qué demuestra quien la tiene | Manual principal; apoyo | Objetivo final (plan §2) |
| --- | --- | --- | --- | --- |
| C01 | Selección de herramienta, superficie y modelo | Elige producto, superficie (chat, CLI, IDE, nube), modelo y esfuerzo según tarea, datos, costo y verificabilidad | M01; M05, M08 | 1 |
| C02 | Especificación ejecutable | Convierte una intención ambigua en una spec autocontenida con alcance, exclusiones, criterios de aceptación y verificación de extremo a extremo | M02; M10 | 2 |
| C03 | Gestión del contexto | Decide qué entra al contexto, cuándo limpiar o compactar, cuándo aislar en un subagente y cuándo recuperar justo a tiempo | M03; M05, M08 | 3 |
| C04 | Configuración portable del agente | Mantiene instrucciones, reglas y skills coherentes entre herramientas y decide qué va en cada capa | M03; M05, M10 | 3 |
| C05 | Revisión de cambios | Lee un diff, identifica riesgos y cambios fuera de alcance, y exige la evidencia que falta | M04; M05, M09 | 4 |
| C06 | Control de versiones y recuperación | Usa Git (commits, ramas, worktrees) para aislar experimentos y recuperar versiones | M04; M05, M08 | 4 |
| C07 | Dirección del ciclo con agentes | Conduce explorar → planear → implementar → verificar con alcance acotado y correcciones tempranas | M05; M02, M03 | 5 |
| C08 | Arquitectura y trazabilidad de datos | Ubica cada operación y separa el cálculo determinista de la interpretación generativa | M06; M07, M09 | 6 |
| C09 | Integraciones con mínimo privilegio | Elige entre CLI, API y MCP, y define permisos, secretos, errores e idempotencia | M07; M06, M09 | 7 |
| C10 | Diseño de autonomía | Justifica flujo fijo, agente, subagentes, nube o programación, con condiciones de término, entregables y costo | M08; M05, M09 | 8 |
| C11 | Seguridad y guardrails | Identifica contenido no confiable, elige permisos y sandbox, y convierte reglas críticas en controles deterministas | M09; M05, M07 | 7, 9 |
| C12 | Evaluación basada en evidencia | Construye casos repetibles, elige graders, compara versiones y concluye solo lo que la evidencia sostiene | M09; M02, M05 | 9 |
| C13 | Producto mantenible | Define alcance útil, documenta, cierra hallazgos y planifica el mantenimiento de dependencias volátiles | M10; M03, M09 | 10 |

Conductas observables de cada competencia: `investigacion/curriculo-estado-del-arte.md` §3. Pasarán a `content/competencies.json` en F0-09.

### 2.1 Bloques del diagnóstico

Con 24 preguntas no se pueden distinguir 13 competencias (2 ítems por competencia no dan precisión). El diagnóstico informa por **6 bloques de 4 ítems** (2 de base + 2 de juicio avanzado), con conteos e incertidumbre explícita, nunca con porcentajes ni niveles (`investigacion/pedagogia-evaluacion.md` §4). Esto reemplaza el «reporte por competencia» de `plan.md` §5 (D-015). Las 13 competencias siguen siendo el mapa del currículo; el diagnóstico no certifica ninguna.

| Bloque | Competencias | Manuales | Microtarea |
| --- | --- | --- | --- |
| B1 Herramientas y límites | C01 | M01 | — |
| B2 Especificación | C02 | M02 | Mejorar una instrucción |
| B3 Contexto y configuración | C03, C04 | M03 | — |
| B4 Código, Git y dirección de agentes | C05, C06, C07 | M04, M05 | Revisar un cambio |
| B5 Datos e integraciones | C08, C09 | M06, M07 | — |
| B6 Autonomía, seguridad y evaluación | C10, C11, C12 | M08, M09 | — |

C13 (M10) no se diagnostica: es el resultado de las demás.

---

## 3. Los diez manuales

Cada manual: pregunta central, 6 lecciones, práctica con entregable, competencias, volatilidad y frecuencia de revisión. Las lecciones siguen el patrón de `docs/content-standard.md`.

### M01 — Herramientas, modelos y límites de la IA

**Pregunta central:** ¿qué herramienta usaría para esta tarea y cómo comprobaría su resultado?
**Competencias:** C01 (principal) · **Volatilidad:** muy alta · **Revisión:** trimestral

1. Modelo, producto, superficie, agente y entorno de ejecución: cinco cosas distintas.
2. Elegir por tipo de tarea: conversación, investigación, documentos, código (imagen y audio en una sección).
3. Tokens, contexto, información actual y acceso real a herramientas (introducción; se profundiza en M03).
4. Respuestas convincentes y falsas: alucinación e incertidumbre (motiva el tema; las técnicas están en M09).
5. La economía real: calidad, costo, latencia, esfuerzo de razonamiento, suscripción frente a API, local frente a nube.
6. Comparar herramientas con una tarea fija y una rúbrica sencilla.

**Práctica:** cinco escenarios de Altiplano; justificar herramienta, superficie, datos necesarios y cómo verificar. **Entregable:** matriz de selección. **Fichas de producto:** tabla de capacidades por superficie (Codex, Claude Code, Copilot, ChatGPT, Claude), fechada.

### M02 — Prompting avanzado y especificaciones (piloto)

**Pregunta central:** ¿cómo convierto una idea ambigua en una tarea ejecutable y verificable?
**Competencias:** C02 (principal), C07, C12 · **Volatilidad:** baja en principios, media en herramientas · **Revisión:** anual; semestral para las herramientas SDD

1. Objetivo, usuario y resultado esperado: qué significa "terminado".
2. Contexto pertinente, restricciones, supuestos y política de ambigüedad.
3. Ejemplos, contraejemplos y contratos de salida (JSON Schema garantiza la forma, no la verdad).
4. La especificación autocontenida: alcance, exclusiones, archivos e interfaces, y cuándo pedir al agente que te entreviste.
5. Descomposición en hitos verificables y ciclos de mejora.
6. Criterios de aceptación y verificación ejecutable: evidencia, no afirmaciones.

**Práctica:** el comité comercial de Altiplano pide "un dashboard del pipeline". Convertir esa petición en una spec verificable, con supuestos declarados (moneda, fecha de corte, política de probabilidades), hitos con prueba y un check de reconciliación ejecutable sobre los datos sintéticos. Incluye el cuaderno de decisiones de transferencia (D-012). **Entregable:** brief, spec, prompt de ejecución, rúbrica y cuaderno.
**No se enseña:** recetas universales, "frases mágicas" ni pedir el razonamiento interno del modelo. Se piden decisiones, supuestos y evidencias (`investigacion/M02-prompting-especificaciones.md` §4).

### M03 — Ingeniería de contexto y conocimiento

**Pregunta central:** ¿qué necesita saber el agente para trabajar bien sin saturarse?
**Competencias:** C03, C04 (principales) · **Volatilidad:** alta en tablas por producto, baja en principios · **Revisión:** trimestral las tablas, anual los principios

1. El contexto como presupuesto: qué entra, por qué rinde menos al llenarse, y cuándo limpiar, compactar o aislar.
2. Capas de instrucciones: AGENTS.md, CLAUDE.md, instrucciones de Copilot, y la precedencia en cada producto.
3. Qué va en cada capa: instrucción permanente, regla por rutas, skill, subagente, hook o MCP.
4. Agent Skills: estructura, una descripción que se active en los casos correctos, y portabilidad entre herramientas.
5. Continuidad: registro de decisiones, documento de traspaso, memoria automática frente a instrucciones escritas.
6. Fuentes y recuperación justo a tiempo; límites de las citas (el RAG completo está en M07).

**Práctica:** un paquete de contexto para Altiplano con un AGENTS.md breve, una skill en formato Agent Skills con su descripción probada y un documento de continuidad. Se verifica la carga en dos herramientas. **Entregable:** el paquete y, por cada herramienta, superficie, versión, ruta de instalación usada y evidencia de carga. El formato de la skill es portable; la instalación es específica de cada producto.
**Nota de diseño:** M03.2 se apoya en una tabla de precedencias por producto ya preparada (ficha), para que la lección quepa en 25 minutos.

### M04 — Código, Git y entornos para dirigir agentes

**Pregunta central:** ¿cómo reviso y recupero un cambio que hizo la IA?
**Competencias:** C05, C06 (principales) · **Volatilidad:** baja · **Revisión:** anual

1. Leer funciones, condiciones, entradas y salidas (en Python primero).
2. Reconocer Python, SQL y JSON/TOML/YAML; TypeScript a nivel de reconocimiento.
3. Carpetas, dependencias, entorno, configuración y secretos (`.gitignore`, variables de entorno).
4. Git: diffs, commits, ramas, worktrees y recuperación; un checkpoint de la herramienta no es un commit.
5. Leer errores, logs y checks de CI para orientar la depuración.
6. Qué revisar antes de aceptar un cambio: lista para leer un diff; la PR como unidad de revisión.

**Práctica:** localizar un error sembrado en el código de Altiplano, revisar la corrección propuesta y recuperar una versión anterior. **Entregable:** revisión comentada y evidencia de la recuperación.
**Alcance:** alfabetización técnica aplicada, no un curso de programación.

### M05 — Desarrollo con Codex, Claude Code y Copilot

**Pregunta central:** ¿cómo dirijo una mejora de principio a fin, con el agente bajo control?
**Competencias:** C07 (principal), C01, C03, C11 · **Volatilidad:** muy alta · **Revisión:** trimestral, y una comprobación rápida antes de usar el manual

1. Antes de dejar actuar al agente: superficie, modo de permisos, sandbox y acceso a red (practicando un solo escenario; el resto en la ficha).
2. Explorar y planear según la complejidad (modo plan, entrevista, cuándo no hace falta).
3. Cambios acotados con verificación ejecutable: el agente presenta evidencia, no afirmaciones.
4. Depurar reproduciendo el fallo. Cuando las correcciones no funcionan: detenerse, reproducir y elegir entre limpiar, compactar, bifurcar o reiniciar la sesión según el producto. Leer el consumo de la sesión.
5. Pruebas, verificación visual con navegador y revisión asistida.
6. Local frente a nube, y traspaso entre herramientas con el artefacto de continuidad de M03.

**Práctica:** implementar una mejora en la herramienta del laboratorio. **Entregable:** cambio funcional, diff, salida de las comprobaciones y explicación breve. **Fichas de producto:** modos de permiso y comandos por herramienta y superficie, fechados.

### M06 — Datos y arquitectura de herramientas analíticas

**Pregunta central:** ¿dónde se ejecuta cada operación y cómo sé que los números son correctos?
**Competencias:** C08 (principal), C09 · **Volatilidad:** baja; media en la nota sobre MCP de Databricks · **Revisión:** anual; semestral esa nota

1. Frontend, backend y motor de datos: dónde ocurre cada operación.
2. RAW, normalización, esquema, llaves y contratos de datos.
3. SQL y Databricks: filtrar y agregar cerca de los datos; cómo toca los datos un agente hoy (MCP gestionado, permisos del usuario, lectura frente a escritura).
4. Python, DuckDB y Parquet, cada uno en su función.
5. Determinista, estadístico y generativo: qué cifra nunca debe calcular un LLM.
6. Reconciliación y trazabilidad como checks ejecutables; generar datos sintéticos.

**Práctica:** diseñar el flujo de snapshots de Altiplano hasta el dashboard, justificando qué se consulta en remoto y qué se descarga. **Entregable:** diagrama exacto, contrato de datos y reconciliación ejecutable.
**Límite:** nada se conecta a Databricks "automáticamente": se identifican conexión, permisos, runtime y lugar de ejecución.

### M07 — APIs, MCP, conectores e integraciones

**Pregunta central:** ¿quién se conecta a qué, con qué permisos y para qué?
**Competencias:** C09 (principal), C11 · **Volatilidad:** media; sigue las revisiones de la especificación MCP · **Revisión:** semestral

1. Peticiones, respuestas, endpoints y JSON.
2. Autenticación, secretos, alcances OAuth y mínimo privilegio.
3. Errores, límites, reintentos e idempotencia.
4. MCP: cliente y servidor, transportes, configuración y confianza; cuándo CLI, API o MCP (incluido su costo de contexto).
5. Recuperación conectada: RAG documental frente a consulta estructurada (SQL o MCP).
6. Simular antes de conectar; conectores en ejecuciones desatendidas.

**Práctica:** diseñar y probar un intercambio simulado con datos sintéticos de Altiplano: contrato, alcances OAuth, manejo de un error y un contenido no confiable que llega por el conector. **Entregable:** contrato de integración, simulación y explicación de permisos.
**Límite:** ninguna clave privada en el HTML, el bundle ni el repositorio.

### M08 — Agentes, automatización y equipos

**Pregunta central:** ¿qué autonomía aporta valor y qué complejidad introduce?
**Competencias:** C10 (principal), C03, C06 · **Volatilidad:** alta (muchas funciones en *preview*) · **Revisión:** trimestral

1. Flujo fijo, scheduler o agente; patrones de flujo y el principio de empezar simple.
2. Objetivos, herramientas, estado y condiciones de término; delegar con entregable, criterio y condición de término.
3. Subagentes y paralelismo: contexto aislado, worktrees, dependencias y costo en tokens.
4. Delegación asíncrona: cuándo mandar trabajo a la nube, al segundo plano o a una tarea programada.
5. Automatización del arnés: modo *headless* y hooks (con ficha por producto, superficie y estado).
6. Costos, registros y fallos; comparar con la solución simple y verificar en proporción a lo que no se supervisó.

**Práctica:** comparar un flujo determinista con uno de agentes para el reporte semanal de Altiplano. **Entregable:** diseño, responsabilidades y evaluación de ambas alternativas.
**Caso de transferencia:** una tarea programada que falla. Hay que revisar el registro, detenerla y elegir una alternativa más simple.
**Límite:** usar más agentes no acredita más calidad; el beneficio se justifica.

### M09 — Evaluación, confiabilidad y control

**Pregunta central:** ¿qué evidencia demuestra que una versión es mejor y es segura?
**Competencias:** C12, C11 (principales), C05 · **Volatilidad:** media (listas OWASP, plataformas de evals) · **Revisión:** semestral

1. Tests de software frente a evals de respuestas y de agentes: tarea, intento, transcript, grader; pass@k frente a pass^k.
2. Casos normales, límite y adversariales. El laboratorio empieza con casos sintéticos etiquetados como tales; después se añaden fallos reales con su procedencia y se convierten en regresión (la guía de referencia recomienda 20–50 casos tomados de fallos reales).
3. Rúbricas, LLM como juez calibrado y comparación de versiones de prompts.
4. Consistencia numérica, fuentes y resultados inventados; graders de código para finanzas (invariantes, totales, reconciliación).
5. Seguridad: inyección de instrucciones directa e indirecta, para la que no existe defensa infalible. Defensa en capas: mínimo privilegio, aprobaciones, controles deterministas, revisión de salidas, y los límites de cada capa.
6. Revisión independiente, límites de la segunda opinión, regresión y registro de cambios.

**Práctica:** detectar errores sembrados y evaluar dos versiones de un prompt de análisis de Altiplano. **Entregable:** conjunto de casos, resultados y recomendación sustentada.
**Nota:** se enseña la metodología, no una plataforma concreta. La plataforma OpenAI Evals cierra el 2026-11-30.

### M10 — De prototipo a producto: proyecto integrador

**Pregunta central:** ¿qué le falta a una herramienta para ser útil y mantenible?
**Competencias:** C13 (principal), C02, C12 · **Volatilidad:** baja; media en plataformas de hosting · **Revisión:** anual

1. Usuario, problema y alcance mínimo útil.
2. UX/UI y accesibilidad.
3. Implementación y manejo del estado.
4. Despliegue, actualización y continuidad.
5. Documentación, evidencias y responsabilidad sobre lo entregado.
6. Mantenimiento: instrucciones y skills tratadas como código, suite de regresión y calendario de revisión; revisión independiente y cierre de hallazgos.

**Práctica:** entregar una herramienta pequeña con datos sintéticos. **Entregable:** app funcional, documentación, resultados de pruebas y revisión. **Proyecto sugerido:** mini Pulse de oportunidades de Altiplano, o una alternativa de utilidad personal con exigencia equivalente.

---

## 4. Especialización posterior

Igual que el plan: forecasting probabilístico, calibración, P10/P50/P90, conversión por etapa y analítica agéntica financiera forman una segunda colección.

## 5. Preguntas resueltas en la revisión (T-003)

- **¿Fusionar competencias?** No. C03 decide el contexto y C04 dónde viven reglas y skills; C05 revisa la corrección de un cambio y C06 aísla o recupera historial. Son conductas distintas. En el diagnóstico sí se agrupan por bloque, sin resultados individuales.
- **¿Lecciones demasiado cargadas?** M03.2 se apoya en una tabla preparada, M05.1 practica un solo escenario y la antigua M08.5 se partió en dos (M08.4 delegación asíncrona y M08.5 automatización del arnés), fusionando las antiguas M08.2 y M08.3. El piloto M02 mide la duración real (`docs/content-standard.md` §9).
- **¿Basta Altiplano?** Sí para M07, que suma contrato, OAuth, error y contenido no confiable, y para el caso principal de M08. M08 añade un caso de transferencia propio (la tarea programada que falla).

# T-001 · Revisión independiente del plan

**Revisión:** 2026-10-21. **Alcance:** `plan.md` v1.1, `AGENTS.md`, `coordinacion/PROTOCOLO.md` y decisiones D-001–D-010. Los hallazgos son riesgos o inferencias editoriales, salvo donde se cita documentación oficial. No cambian decisiones aceptadas; proponen una comprobación o un ajuste para el dueño correspondiente.

## Hallazgos (ordenados por severidad)

- [R-01] **Severidad: alta**  
  **Ubicación:** `plan.md:75–94`, `plan.md:311–323`, `plan.md:343–359`, `plan.md:809–1069`; D-010.  
  **Evidencia:** V1 exige diez manuales completos (50–60 lecciones), bancos de 20–24 preguntas por manual (200–240 preguntas), trece pantallas, offline, búsqueda, respaldo y el expediente exportable. D-010 reduce el piloto, pero no fija una puerta de calidad antes de escalar los otros nueve cursos.  
  **Consecuencia:** la amplitud puede desplazar revisión de fuentes, calidad de distractores y prácticas auténticas. Una V1 “completa” podría tardar tanto que las fichas de producto caduquen antes de publicar.  
  **Corrección recomendada:** hacer de M02 un patrón medido: publicar una matriz objetivo→lección→actividad→evidencia y una revisión independiente cerrada antes de autorizar cada bloque posterior. Estimar esfuerzo real tras el piloto y recortar funciones de apoyo antes que reducir objetivos o calidad editorial.

- [R-02] **Severidad: alta**  
  **Ubicación:** `plan.md:311–323`, `plan.md:325–332`, `plan.md:1033–1043`.  
  **Evidencia:** 10/12 preguntas correctas se llama “aprobación conceptual” y basta para el estado “examen aprobado”; con 20–24 reactivos por manual, los reintentos pueden reutilizar una fracción grande del banco. El plan reconoce que repetir preguntas conocidas no demuestra mejora.  
  **Consecuencia:** el alumno puede aprobar por familiaridad con ítems sin demostrar transferencia, sobre todo en competencias de diseño, verificación y arquitectura.  
  **Corrección recomendada:** etiquetar el resultado como desempeño en esa versión del examen; exigir en la rúbrica de dominio una tarea de transferencia nueva y evidencia de decisiones. Establecer cobertura mínima por objetivo y revisar equivalencia de escenarios antes de anunciar reintentos “equivalentes”.

- [R-03] **Severidad: alta**  
  **Ubicación:** `coordinacion/PROTOCOLO.md:19–44`, `coordinacion/PROTOCOLO.md:47–67`, `AGENTS.md:16–25`.  
  **Evidencia:** Daniel debe reenviar tickets y avisos de entrega; a la vez ambos agentes trabajan en la misma carpeta y las dos entregas actuales deben editar filas del mismo `ESTADO.md`. El protocolo prohíbe editar archivos “en curso”, pero la tabla no ofrece reserva de filas ni control de cambios concurrentes.  
  **Consecuencia:** una actualización de estado puede sobrescribir otra, o una revisión quedar pendiente hasta el siguiente traspaso manual aunque el artefacto ya esté disponible.  
  **Corrección recomendada:** asignar un solo escritor para `ESTADO.md` durante cada ventana de entrega; el receptor actualiza únicamente su fila después de releer el archivo justo antes de guardar. Hacer commits por ticket y usar el commit como punto de traspaso; Daniel conserva la decisión de cuándo pedir la revisión.

- [R-04] **Severidad: media**  
  **Ubicación:** `plan.md:821–843`, `plan.md:868–920`, `plan.md:954–1006`; D-006.  
  **Evidencia:** el expediente puede incluir contexto profesional, texto libre, respuestas y código pegado; se exporta a HTML autocontenido. La decisión de repo público distingue datos locales, pero no define un filtro de contenido del reporte previo a compartir ni un control de tamaño para código/notas.  
  **Consecuencia:** un usuario podría incorporar sin querer datos sensibles en una exportación o en ejemplos del repo, aun si el código escapa HTML correctamente.  
  **Corrección recomendada:** en el piloto, vista previa por secciones con exclusión explícita, aviso sobre texto libre, límites de longitud y prueba con datos sintéticos. Antes de publicación, inspeccionar los archivos versionados buscando ejemplos reales y secretos.

- [R-05] **Severidad: media**  
  **Ubicación:** `plan.md:313–323`, `plan.md:541–575`, `plan.md:625–636`.  
  **Evidencia:** se exigen preguntas con feedback por alternativa y fuentes, pero todavía no se especifica cómo se versionan enunciado, opciones, clave, explicación y vínculo a fuente cuando una ficha volátil cambia. La sección 17 exige preservar claves históricas.  
  **Consecuencia:** una corrección editorial podría reinterpretar intentos antiguos o dejar feedback que remite a una versión distinta de la lección.  
  **Corrección recomendada:** en F0-08/F0-09 definir un identificador y versión inmutables del ítem publicado, referencia a versión de contenido y política de retiro/reemplazo; validar el reporte contra esa instantánea histórica.

- [R-06] **Severidad: media**  
  **Ubicación:** `plan.md:384–466`, `coordinacion/PROTOCOLO.md:84–95`.  
  **Evidencia:** el flujo permite hasta 17 imágenes raster, pero la prueba de si una imagen explica mejor que texto/SVG aparece tarde, durante la revisión de activos. El plan ya reserva diagramas exactos para código.  
  **Consecuencia:** podría invertirse tiempo en portadas decorativas mientras faltan visuales que aclaren modelos mentales complejos.  
  **Corrección recomendada:** exigir en cada brief una pregunta pedagógica concreta y una comparación rápida con texto o SVG antes de generar. Mantener una portada solo si ayuda a orientación/identidad, sin presentarla como explicación técnica.

- [R-07] **Severidad: media**  
  **Ubicación:** `AGENTS.md:3`, `plan.md:161`, `plan.md:539`.  
  **Evidencia:** “lo lee Codex directamente” resume comportamientos de superficies distintas. La documentación oficial indica que `AGENTS.md` es una convención opcional reconocida por Codex y describe explícitamente cómo **Codex CLI** reúne archivos e inyecta instrucciones; no acredita que cada entorno futuro tenga idéntico mecanismo. En esta sesión el contenido de `AGENTS.md` llegó como instrucción de repositorio y además se leyó el archivo. [Fuente 1](https://developers.openai.com/cookbook/examples/codex/iterating-development-workflows-with-codex), [fuente 2](https://developers.openai.com/cookbook/examples/gpt-5/codex_prompting_guide). Consultadas 2026-10-21.  
  **Consecuencia:** una lección M03 podría enseñar como universal un detalle de carga que depende de la superficie o versión.  
  **Corrección recomendada:** en la ficha de producto separar “convención reconocida” de “mecanismo observado en CLI” y pedir verificación de instrucciones cargadas al abrir cada entorno. No encontré evidencia para afirmar que la frase actual sea falsa en esta sesión.

- [R-08] **Severidad: baja**  
  **Ubicación:** `coordinacion/PROTOCOLO.md:86–92`, `plan.md:454–466`.  
  **Evidencia:** se pide registrar herramienta/modelo real y variantes fuera de git. La capacidad de imagen visible en esta sesión se presenta como `image_gen.imagegen`, sin identificador de modelo ni controles de tamaño; la documentación de la API enumera modelos y opciones de **la API**, que no son prueba de la configuración del generador integrado de Codex. [Documentación oficial de imagen](https://developers.openai.com/api/docs/guides/tools-image-generation), consultada 2026-10-21.  
  **Consecuencia:** se podría atribuir un modelo o tamaño configurable que el entorno no reportó.  
  **Corrección recomendada:** aceptar `modelo: no expuesto por la herramienta` y registrar dimensiones observadas del archivo. Mantener aparte las capacidades documentadas de la API y las comprobadas en la sesión.

## Idea propia: cuaderno de decisiones de transferencia

**Propuesta/inferencia.** Crear para cada manual un “antes y después” de una decisión realista con datos sintéticos: el alumno guarda una primera solución, recibe un contraejemplo nuevo, revisa la decisión y explica qué evidencia le hizo cambiar de criterio. Los cuestionarios comprueban conceptos; este cuaderno comprueba si puede aplicar y corregir el criterio en situaciones nuevas. El HTML de evaluación ya previsto puede exportar esas cuatro piezas (decisión inicial, contraejemplo, revisión y evidencia), sin añadir una pantalla nueva si se incorpora al laboratorio. Probarlo primero en M02 con una solicitud de dashboard ambigua.

## Fuentes de producto consultadas

- OpenAI, [Iterating Development Workflows with Codex](https://developers.openai.com/cookbook/examples/codex/iterating-development-workflows-with-codex), consultada 2026-10-21: `AGENTS.md` opcional y reconocido.
- OpenAI, [Codex Prompting Guide, “Using agents.md”](https://developers.openai.com/cookbook/examples/gpt-5/codex_prompting_guide), consultada 2026-10-21: mecanismo de carga descrito para Codex CLI.
- OpenAI, [Image generation tool](https://developers.openai.com/api/docs/guides/tools-image-generation), consultada 2026-10-21: controles y modelos de la API; no certifica el modelo de esta herramienta integrada.

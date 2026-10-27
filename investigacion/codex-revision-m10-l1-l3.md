# Revisión cruzada — M10 L1–L3 (T-047)

Fecha de revisión: 2026-10-27  
Alcance: blueprint, lecciones `m10-l1` a `m10-l3`, 16 comprobaciones, conceptos erróneos `m10-mc01` a `m10-mc30` y las fichas `m10-pc-a11y-scan`, `m10-pc-storage-eviction` y `m10-pc-db-migrations`.

## Hallazgos

- [T047-M10-01] Severidad: baja
  Ubicación: `content/courses/m10/lessons/m10-l1.md:28`, «La forma “necesito… para…” obliga a decir qué decisión se va a tomar».
  Evidencia: la guía de GOV.UK sí prescribe expresar la necesidad desde la persona y explicar qué quiere hacer y por qué. No afirma que toda necesidad tenga que formular una decisión: puede describir una acción u otro resultado del usuario. Convertirlo en decisión es una buena adaptación para este curso, pero no es lo que dice la fuente y el verbo «obliga» lo presenta como regla universal.
  Consecuencia: se puede confundir una necesidad con la decisión que una herramienta apoya y descartar necesidades válidas que no tienen esa forma.
  Corrección recomendada: escribir «La forma “necesito… para…” obliga a decir qué quiere lograr la persona; en este curso lo traducimos a la decisión que la herramienta apoyará» y marcar esa segunda parte como inferencia del curso.

- [T047-M10-02] Severidad: baja
  Ubicación: `content/courses/m10/lessons/m10-l2.md:55`, «El motor de reglas más usado dice detectar…».
  Evidencia: el README de axe-core respalda su afirmación de detectar en promedio el 57 % de los problemas WCAG y de devolver resultados «incomplete» para revisión manual. No aporta una medición de adopción que permita llamarlo «el más usado»; la fuente de Deque tampoco lo prueba, pues mide su propia muestra de auditorías.
  Consecuencia: el curso convierte una cifra declarada por el proveedor en una afirmación comparativa de mercado que no está sustentada.
  Corrección recomendada: sustituir «El motor de reglas más usado» por «El motor de reglas axe-core» o «Un motor de reglas», y conservar la atribución explícita de la cifra al propio fabricante.

## Comprobaciones sin hallazgo

- Las 16 preguntas tienen una sola clave marcada, ancla de sección localizable, fuentes existentes y distractores ligados a conceptos erróneos existentes. La razón máxima entre longitudes de opciones es 1,25; no hay pista de longitud. Las claves indicadas por el ticket son defendibles: `m10-l2-r2` concluye correctamente no construir el tablero, `m10-l3-c2` comunica la posibilidad de borrado sin exagerarla y `m10-l2-c4` aplica los 24 × 24 píxeles junto con el espacio como alternativa.
- No aparece una repetición material de los escenarios del diagnóstico ni de M01–M09: las preguntas reutilizan el dominio de crédito/cobranza del caso continuo, pero conservan decisiones distintas a M02 L1/L4/L6, M05 L5, M06 L1 y los bloques de diagnóstico.
- WCAG 2.2 confirma la duda del ticket: A, AA y AAA son niveles acumulativos de conformidad; A es el mínimo y AAA el más exigente. También coinciden los nueve criterios añadidos, la retirada de 4.1.1, los diez criterios seleccionados en la tabla, el mínimo de 24 × 24 CSS px con sus excepciones, y los límites de los escaneos automáticos.
- Las cifras y su alcance están bien acotados: axe-core atribuye a sí mismo el 57 %; el informe de Deque lo calcula como 57,38 % del volumen de incidencias de auditorías iniciales; la prueba de GDS usó 143 barreras y diez herramientas, con 29 % no detectado. La lección advierte que son métricas distintas y que la del proveedor no es independiente.
- Las tres fichas siguen coincidiendo con sus páginas: axe-core y Playwright mantienen el escaneo con revisión manual; MDN mantiene cuotas/borrado por origen y los comportamientos de persistencia descritos; Dexie mantiene `version().stores().upgrade()` y la reversión de una actualización fallida. No observé cambios materiales desde la verificación fechada el 2026-10-27.
- L1, L2 y L3 tienen aproximadamente 1.574, 2.162 y 1.616 palabras; caben en 25 minutos con sus actividades. No usan nombres de producto en el cuerpo, no enseñan la API de una librería ni pretenden recitar WCAG o diseño visual. Los seis objetivos del blueprint se pueden evaluar con opción múltiple mediante decisiones situadas; `m10-eo6` trata la repetición de pruebas, cadencia y cierre de hallazgos, mientras `m09-eo6` trataba la independencia y límites de quien revisa, por lo que no se solapan.

## Fuentes abiertas y resultado

| Fuente abierta | Resultado de la comprobación |
| --- | --- |
| [GOV.UK: necesidades de usuario](https://www.gov.uk/service-manual/user-research/start-by-learning-user-needs) | Respalda empezar por usuarios, formato «I need… so that…», contexto y tratar propuestas ajenas como supuestos; origina T047-M10-01 por no exigir una decisión. |
| [GOV.UK: discovery](https://www.gov.uk/service-manual/agile-delivery/how-the-discovery-phase-works) | Respalda entender y reformular el problema antes de construir, alcance y restricciones. |
| [GOV.UK: problema completo](https://www.gov.uk/service-manual/service-standard/point-2-solve-a-whole-problem) | Respalda el alcance ni estrecho ni amplio y no diseñar alrededor de IA o tecnología. |
| [GOV.UK: alpha](https://www.gov.uk/service-manual/agile-delivery/how-the-alpha-phase-works) | Respalda probar supuestos riesgosos con lo mínimo y descartar prototipos. |
| [NN/g: MVP](https://www.nngroup.com/videos/mvp-isnt-release1/) | Respalda MVP como representación razonable que maximiza aprendizaje, no necesariamente release 1. |
| [GOV.UK: métricas](https://www.gov.uk/service-manual/measuring-success/how-to-set-performance-metrics-for-your-service) | Respalda propósito, beneficios, hipótesis, 3–4 métricas y línea base. |
| [NN/g: heurísticas](https://www.nngroup.com/articles/ten-usability-heuristics/) | Respalda las diez heurísticas y la fecha de revisión indicada. |
| [WCAG 2.2](https://www.w3.org/TR/WCAG22/) | Respalda los criterios, niveles y requisitos de la tabla. |
| [W3C: novedades de WCAG 2.2](https://www.w3.org/WAI/standards-guidelines/wcag/new-in-22/) | Respalda nueve criterios nuevos y la retirada de 4.1.1. |
| [W3C: tamaño de objetivo](https://www.w3.org/WAI/WCAG22/Understanding/target-size-minimum.html) | Respalda 24 × 24 CSS px, espaciado y excepciones. |
| [W3C: tablas](https://www.w3.org/WAI/tutorials/tables/) | Respalda `th`/`td` y las relaciones programáticas de encabezados. |
| [W3C: imágenes complejas](https://www.w3.org/WAI/tutorials/images/complex/) | Respalda descripción corta y larga, valores/tendencias y disponibilidad para todas las personas. |
| [W3C: herramientas de evaluación](https://www.w3.org/WAI/test-evaluate/tools/selecting/) | Respalda que los escaneos ayudan, pero no determinan accesibilidad ni sustituyen juicio humano. |
| [axe-core README](https://github.com/dequelabs/axe-core) | Respalda 57 % e «incomplete»; no respalda que sea el motor más usado, T047-M10-02. |
| [Deque: coverage report](https://www.deque.com/automated-accessibility-coverage-report/) | Respalda 57,38 %, volumen de incidencias y el carácter de informe del proveedor. |
| [GDS: prueba de herramientas](https://accessibility.blog.gov.uk/2017/02/24/what-we-found-when-we-tested-tools-on-the-worlds-least-accessible-webpage/) | Respalda 143 barreras, diez herramientas, 29 % no detectado y las tres capas de revisión. |
| [Playwright: accesibilidad](https://playwright.dev/docs/accessibility-testing) | Respalda AxeBuilder, etiquetas WCAG y combinar automatización, revisión manual y usuarios. |
| [W3C: comprobaciones rápidas](https://www.w3.org/WAI/test-evaluate/preliminary/) | Respalda teclado, foco, zoom, contraste y que no son una evaluación completa. |
| [React: estructura de estado](https://react.dev/learn/choosing-the-state-structure) | Respalda no guardar estado derivado ni duplicado y evitar contradicciones. |
| [MDN: cuotas y borrado](https://developer.mozilla.org/en-US/docs/Web/API/Storage_API/Storage_quotas_and_eviction_criteria) | Respalda origen, mejor esfuerzo/persistencia, cuota, borrado, navegación privada y decisiones de navegador. |
| [MDN: IndexedDB](https://developer.mozilla.org/en-US/docs/Web/API/IndexedDB_API/Using_IndexedDB) | Respalda estructura sólo en actualización de versión, recrear `keyPath` borra, y bloqueo entre pestañas. |
| [Dexie: diseño](https://dexie.org/docs/Tutorial/Design) | Respalda declaraciones de versión, `upgrade`, reversión atómica y conservar actualizadores. |
| [Semantic Versioning 2.0.0](https://semver.org/) | Respalda API pública, versiones inmutables y cambios incompatibles. |
| [Ink & Switch: local-first](https://www.inkandswitch.com/essay/local-first/) | Respalda control del usuario, conservación y el riesgo de que un servicio cerrado deje datos inaccesibles. |

Verificado: contraste de cada cita con su fuente, comprobación estructural de 16 preguntas y revisión de blueprint, alcance, tiempo y fichas. No se modificó `src/`, `content/`, `e2e/` ni `ESTADO.md`.

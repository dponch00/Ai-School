# T-024 — Revisión temprana de M01: lecciones 1 a 3, comprobaciones y fichas

| Campo | Valor |
| --- | --- |
| Para | Codex |
| De | Claude Code |
| Estado | entregado |
| Creado | 2026-10-23 |
| Depende de | T-023 (cerrado) |
| Fase del plan | 3 — Nueve manuales |

## Contexto

Es el primer manual nuevo después de D-024, así que conviene revisar el patrón temprano, como se hizo con M02 en T-006, antes de escribir las lecciones 4 a 6, el banco de examen y el laboratorio.

Claude escribió, a partir de `investigacion/M01-herramientas-modelos-limites.md` (que revisaste en T-021):

- **`content/courses/m01/course.json`:** seis objetivos evaluados, reformulados para opción múltiple según D-024. Los verbos de producción pasaron a «identifica», «elige», «determina» y «reconoce».
- **Lecciones 1 a 3** (`content/courses/m01/lessons/`):
  - L1: modelo, producto, superficie, agente y entorno.
  - L2: elegir la herramienta por el tipo de tarea, con los cuatro casos y la imagen en una sección breve, como pide el presupuesto de T021-X-02.
  - L3: tokens, contexto, fecha de corte y acceso real.
  - Las tres pasaron por el agente revisor de texto (D-021).
- **16 preguntas** en `content/courses/m01/questions/checks.json`: 4 comprobaciones por lección y 2 de repaso para L2 y L3.
- **31 conceptos erróneos** en `misconceptions.json`: los 27 de la investigación, más 28, 29 y 31, que salieron al escribir las preguntas. El 30 no existe.
- **Seis fichas de producto** en `product-cards.json`, dos por lección y todas fechadas el 2026-10-22.
- **46 fuentes nuevas** en `content/sources.json`, tomadas del registro de la investigación. Las que ya existían no se duplicaron.

**Cambio en la app:** un manual sin todas sus lecciones, su laboratorio y su banco de examen se puede abrir por su enlace como «En preparación», pero no figura como disponible ni muestra la práctica ni el examen. `npm test` 120/120.

## Pedido

1. **Fidelidad a las fuentes (revisión cruzada):** comprueba que cada afirmación con `:cite[...]` diga lo que dice su fuente, sin ampliar el alcance. Prioriza:
   - L1: arnés y bucle; la sesión en la nube no ve los cambios sin subir ni la configuración personal; Research en el celular sin conectores.
   - L2: investigación profunda frente a búsqueda; ejecución de código para la aritmética.
   - L3: *context rot*; 18 modelos; «perdido en el medio»; fecha de corte fiable; el caso de Transluce; empezar una sesión nueva con un resumen (citado a `src-anthropic-cc-best-practices`).
   - Las seis fichas, que son de volatilidad muy alta.
2. **Preguntas:**
   - Clave única y defendible.
   - Distractores plausibles con su concepto erróneo bien asignado.
   - Explicación fiel al apartado de `sectionRef`.
   - Sin pistas de longitud ni de forma.
   - Que ninguna repita un escenario del diagnóstico (`dx-b1-01` a `dx-b1-04`) ni de M02.
3. **Objetivos:** ¿los seis objetivos reformulados se pueden evaluar bien con opción múltiple? ¿Alguno perdió algo importante al dejar de pedir producción?
4. **Estilo y tiempo:** ¿cada lección se lee en 25 minutos? ¿Cumplen `docs/guia-de-estilo.md` y la regla de dos capas, sin nombres de producto en el cuerpo?
5. **Interfaz:** a 360 px, revisa la portada de M01 en preparación y una lección. ¿Se entiende que el manual no está completo?

## Entregables

- `investigacion/codex-revision-m01-l1-l3.md` con los hallazgos en el formato de PROTOCOLO §5, ordenados por severidad. Incluye la lista de fuentes que abriste y el resultado de cada una.
- La sección **Entrega** de este ticket.

## Archivos permitidos

- `investigacion/codex-revision-m01-l1-l3.md` (nuevo)
- `design/qa/T-024/**`
- La sección Entrega de este ticket y su campo Estado

No edites `src/`, `content/`, `e2e/` ni `ESTADO.md`.

---

## Entrega

_(Codex · 2026-10-23)_

- Informe: `investigacion/codex-revision-m01-l1-l3.md`.
- Hallazgos: uno alto (la afirmación de que una sesión en la nube siempre clona el remoto), tres medios (alcance del reenvío de contexto, límite de 30 MB sin fuente y encabezado vacío de Práctica y examen) y uno bajo (concepto erróneo mal asignado).
- Verificado: 28 fuentes abiertas y contrastadas; 16 preguntas, objetivos y referencias; interfaz M01 a 360 px con teclado; `npm test` 120/120.
- Siguiente acción: Claude aplica los hallazgos en `content/` y `src/`, y completa la sección Revisión.

## Revisión

_(Claude Code)_

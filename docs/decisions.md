# Registro de decisiones

Una entrada por decisión. Estados: **aceptada**, **propuesta** (espera a Daniel), **reemplazada** (indica por cuál). Lo que no está aquí sigue lo que dice `plan.md`.

---

## D-001 · Producto: PWA modular

- **Estado:** aceptada (viene de `plan.md` §1) · 2026-10-21
- **Decisión:** app web modular instalable como PWA. Un HTML único queda como edición derivada opcional (V1.1); app nativa solo si aparece una necesidad concreta (V3).

## D-002 · Git local desde el día 1

- **Estado:** aceptada · 2026-10-21
- **Decisión:** repositorio git en `main`, sin remoto por ahora. Prefijo de autor en cada commit (`[claude]`, `[codex]`, `[daniel]`).
- **Por qué:** dos agentes escriben en la misma carpeta; git es la red de seguridad y el registro de quién cambió qué.

## D-003 · Roles y revisión cruzada entre modelos

- **Estado:** aceptada por Daniel · 2026-10-21
- **Decisión:** Claude Code coordina, investiga, escribe contenido y evaluaciones, e implementa. Codex lleva dirección visual, imágenes y propuestas de UI, y **revisa de forma independiente** el contenido y los exámenes de Claude. Claude revisa el valor pedagógico de las imágenes de Codex. Detalle en `coordinacion/PROTOCOLO.md`.
- **Por qué:** el plan (§10) advierte que un mismo modelo con otro rol no garantiza diversidad de criterio. Tener dos modelos distintos sí la da; es la mayor ventaja de trabajar juntos.

## D-004 · Comunicación por tickets en archivos

- **Estado:** aceptada · 2026-10-21
- **Decisión:** los agentes se comunican con tickets en `coordinacion/tickets/`. Daniel los enruta. Nada depende de la memoria de un chat.

## D-005 · Stack: React + TypeScript + Vite

- **Estado:** aceptada por Daniel · 2026-10-21
- **Decisión:** la del plan §8. Versiones y librerías concretas (PWA, IndexedDB, Markdown, búsqueda, pruebas) se fijan con `investigacion/stack-tecnico.md`.
- **Por qué no vanilla como Python GO o MKompact:** esta app tiene 13 pantallas, estado versionado en IndexedDB, exámenes reproducibles y exportaciones; con tipos y componentes eso se mantiene mejor. Ventaja extra: la propia app sirve de material real para M04 (leer TypeScript) y M05 (dirigir cambios).

## D-006 · Hosting candidato: GitHub Pages

- **Estado:** aceptada por Daniel (repo público) · 2026-10-21
- **Decisión:** GitHub Pages en `dponch-00.github.io/<repo>/`, como Python GO y MKompact. Se valida con la prueba de hosting de la Fase 0 (service worker en subpath, rutas, instalación, offline) antes de comprometer la arquitectura.
- **Implicación:** Pages gratis exige repositorio público. Los datos personales (perfil, respuestas) viven solo en el navegador, pero los documentos del repo serían públicos: antes de publicar hay que revisar `plan.md` y los perfiles de ejemplo.
- **Antes de cada publicación:** crear el remoto y desplegar siguen necesitando el visto bueno de Daniel en el chat (también para la prueba de hosting F0-11).

## D-007 · Contenido volátil separado del duradero

- **Estado:** aceptada (deriva de `plan.md` §11) · 2026-10-21
- **Decisión:** cada lección distingue **principios duraderos** de **fichas de producto** (capacidades de Codex, Claude Code, Copilot, etc.). Las fichas llevan producto, entorno (chat/API/CLI/IDE/nube), fecha de verificación, fuente y fecha de próxima revisión, y la app las muestra como tales.
- **Por qué:** M01, M05 y M07 dependen de productos que cambian cada mes; sin esta separación el contenido envejece sin que se note.

## D-008 · Idioma

- **Estado:** aceptada · 2026-10-21
- **Decisión:** contenido y documentación del proyecto en español; código, IDs, nombres de archivo y esquemas en inglés.

## D-009 · Programa de Educación como contexto del perfil

- **Estado:** aceptada por Daniel · 2026-10-21
- **Decisión:** el programa `Documents/AI/Educacion` (Claude Code, de 62 a 80) sigue separado. Su evaluación entra al perfil inicial de Daniel como evidencia previa, marcada como tal (ni "declarado" ni "observado en la app"), y AI School no duplica sus sesiones.
- **Cuidado:** esa evaluación habla de repos reales; en el repo de AI School solo entra el resumen de competencias, no rutas, código ni datos de esos proyectos.

## D-010 · Sección 17 delgada en el piloto

- **Estado:** aceptada por Daniel · 2026-10-21
- **Decisión:** el piloto implementa solo el recorrido mínimo de `plan.md` §17.10: perfil, respuestas individuales con revisión y explicación, HTML de evaluación, pegar feedback y aplicar una acción a la ruta. La importación estructurada de feedback (JSON) y las métricas de evolución (§17.8) pasan a la Fase 2.
- **Por qué:** la sección 17 es casi un segundo producto; el piloto debe fijar el estándar de contenido y del ciclo, no agotar todas sus funciones.

## D-011 · Puerta de calidad antes de cada bloque

- **Estado:** aceptada (hallazgo R-01 de Codex en T-001) · 2026-10-21
- **Decisión:** ningún bloque de manuales empieza hasta que el anterior pase su puerta:
  1. Matriz objetivo → lección → actividad → evidencia completa, sin objetivos sin evaluar.
  2. Revisión independiente (Codex) con todos sus hallazgos críticos y altos cerrados y comprobados.
  3. Esfuerzo real medido y comparado con lo estimado.
- **Si falta tiempo:** se recortan funciones de apoyo de la app antes que objetivos de aprendizaje o calidad editorial.
- **Primera puerta:** el piloto M02 (F1-13).

## D-012 · Aprobar un examen no es dominar

- **Estado:** aceptada (hallazgo R-02 y propuesta de Codex en T-001) · 2026-10-21
- **Decisión:**
  - El resultado del examen se muestra como desempeño en esa versión del examen ("aprobado · examen M02 v1"), no como dominio.
  - El dominio exige además una **tarea de transferencia** nueva: un **cuaderno de decisiones** en el laboratorio de cada manual. Tiene cuatro piezas: decisión inicial → contraejemplo nuevo → decisión revisada → evidencia que hizo cambiar el criterio. Va en el HTML de evaluación.
  - Cada objetivo tiene una cobertura mínima en el banco. Antes de anunciar reintentos "equivalentes" se revisa que los escenarios lo sean de verdad.
- **Se prueba primero en** el laboratorio M02 (F1-05). El estándar de contenido (F0-08) lo vuelve obligatorio si funciona.

## D-013 · Origen propio: organización gratuita de GitHub

- **Estado:** aceptada por Daniel · 2026-10-21 · **ajusta D-006**
- **Decisión:** AI School se publica en GitHub Pages bajo una **organización gratuita** (`<org>.github.io`, `base: '/'`), no en `dponch-00.github.io/<repo>/`. El nombre de la org puede esperar al nombre de la app; se crea en la prueba de hosting (F0-11), con visto bueno de Daniel.
- **Por qué:** `dponch-00.github.io` ya aloja Python GO y MKompact, y sus service workers borran toda caché ajena del mismo origen (verificado en sus `sw.js`). Además, un origen compartido comparte IndexedDB, cuota y "borrar datos del sitio". El origen es definitivo: cambiarlo después obliga a exportar e importar.
- **Regla para nuestro SW:** borrar solo cachés con prefijo `ais-`.

## D-014 · Stack concreto verificado

- **Estado:** aceptada (concreta D-005 con `investigacion/stack-tecnico.md`) · 2026-10-21
- **Decisión:** Node 24 LTS · React 19.3 · Vite 8.3 · **TypeScript 6.0** (no 7: sin API y typescript-eslint exige <6.1) · vite-plugin-pwa 2.0 (`injectManifest`, `registerType: 'prompt'`) sobre Workbox 7.4 · Dexie 4.4 · React Router 8.5 con `createHashRouter` · unified/remark/rehype + Zod 4.6 · MiniSearch 7.2 con stemmer español · Vitest 5 + Playwright 1.64 + axe-core 4.14. Versiones exactas fijadas por lockfile al crear el proyecto.
- **Notas de implementación:** cada curso en su propia caché (`ais-course-<id>-<hash>`) fuera del precache, descargada con verificación de integridad y estado en IndexedDB; con hash routing las anclas internas de lección necesitan desplazamiento propio; el reporte HTML se construye con DOM + `textContent`, JSON en `<pre>` y CSP sin scripts.
- **Riesgos vigilados:** fork anunciado de Workbox por vite-plugin-pwa; Workbox en mantenimiento mínimo (aislar la lógica de descargas de su API); GitHub Pages sin encabezados propios y `max-age=600`.

## D-015 · El diagnóstico informa por bloques, no por competencia

- **Estado:** aceptada (hallazgo REV-01 de Codex en T-003) · 2026-10-21 · **reemplaza** el "reporte por competencia" de `plan.md` §5
- **Decisión:** el diagnóstico de 24 preguntas + 2 microtareas da señales para 6 bloques de 4 ítems (`docs/curriculum.md` §2.1), con conteos e incertidumbre explícita. No emite niveles, porcentajes ni resultados por competencia. Las 13 competencias son el mapa del currículo.
- **Por qué:** con 2–3 ítems por competencia no hay precisión para concluir nada (`investigacion/pedagogia-evaluacion.md` §4).

## D-016 · 36 ítems en M02 como experimento

- **Estado:** aceptada (hallazgo REV-03 de Codex en T-003) · 2026-10-21
- **Decisión:** el banco de M02 tiene 36 ítems (12 familias × 3 variantes) **como experimento**. Se registran las horas de autoría, revisión y corrección. La puerta F1-13 decide para el resto de manuales: 36, o 24 en dos formas disjuntas de 12. Hasta entonces rige el plan (20–24).
- **Por qué:** con 24 ítems, un examen de 12 más un reintento ya los agotan, y reutilizar ítems infla el puntaje sin demostrar transferencia. Pero triplicar variantes tiene un costo editorial alto que hay que medir antes de comprometerlo.

## D-017 · *Blueprint*: máximo 6 objetivos evaluados por manual

- **Estado:** aceptada (hallazgo REV-02 de Codex en T-003) · 2026-10-21
- **Decisión:** cada manual declara como máximo 6 objetivos evaluados; los objetivos de lección se vinculan a ellos. Banco: 2 familias por objetivo evaluado. Examen: 2 ítems por objetivo evaluado. Detalle en `docs/content-standard.md` §3.3.
- **Por qué:** con 6–18 objetivos de lección y 2 familias por cada uno, un banco de 12 familias no podía cubrirlos; la matriz no habría sido auditable.

## D-018 · Dirección visual: D1 · Atlas de criterio

- **Estado:** aceptada por Daniel · 2026-10-21
- **Decisión:** la identidad visual es D1 (collage de papel con rutas e hitos; Source Serif 4, Fraunces e IBM Plex Mono; paleta marfil, azul tinta, ocre y verde azulado). Detalle en `design/direcciones/D1-atlas-de-criterio/README.md`; el sistema completo lo propone Codex en T-005.
- **Riesgo vigilado:** que diez paisajes se repitan. Cada portada varía terreno, hora y un motivo central propio del manual.

## D-019 · Lecciones en dos capas

- **Estado:** aceptada (recomendación de Codex en T-006) · 2026-10-21 · **concreta D-007**
- **Decisión:** el cuerpo de una lección enuncia principios duraderos, citados, sin nombrar productos ni proveedores. Todo lo que depende de un producto, un modelo o una versión va en una ficha de producto enlazada desde el segmento. Las fichas distinguen recomendaciones (`guidance`) de capacidades con estado de lanzamiento (`capability` + `maturity`).
- **Cómo se hace cumplir:** `src/domain/course-files.test.ts` falla si el cuerpo de una lección nombra un producto o proveedor.

## D-020 · Contenido compilado en el build

- **Estado:** aceptada · 2026-10-21 · concreta F1-02
- **Decisión:** `scripts/build-content.ts` valida todo `content/` contra los contratos y genera `src/generated/content.json` (lecciones ya convertidas a bloques HTML saneados, preguntas, fichas, activos y fuentes) y `src/generated/tokens.css`. Corre antes de `dev`, `build`, `test` y `typecheck`; si algo no cumple el contrato, el build falla. Lo generado no se versiona.
- **Por qué:** el contenido llega validado y saneado al navegador, sin parsear Markdown en el cliente.
- **Deuda conocida (resuelta en F2-05, 2026-10-22):** el contenido de cada curso va en su propio paquete (`public/courses/<curso>.<hash>.json`, con SRI) y se descarga para el modo offline por curso. El paquete principal conserva el índice de los cursos, el diagnóstico, el glosario y el índice de búsqueda; su tamaño restante se debe sobre todo a las librerías.

## D-021 · Guía de estilo y agente revisor de texto

- **Estado:** aceptada (pedido de Daniel tras leer la lección 1 en la app) · 2026-10-21 · **concreta** el §2 del estándar de contenido
- **Decisión:** las lecciones se escriben con la voz de un autor de libros de aprendizaje para adultos, según [`docs/guia-de-estilo.md`](guia-de-estilo.md): explicar en vez de enumerar, el caso antes que la regla, sin calcos del inglés, términos explicados la primera vez, como máximo dos fichas de producto por lección y al final de su apartado. Antes de la revisión de Codex, cada lección pasa por el agente `revisor-de-texto` (`.claude/agents/revisor-de-texto.md`), que reescribe sin tocar hechos, citas, directivas ni IDs.
- **Por qué:** la primera versión de M02 era correcta pero sonaba a texto generado: frases telegráficas, negritas en cada línea, calcos («qué habilitará el resultado») y hasta seis fichas cortando la explicación.
- **Cómo se hace cumplir:** `course-files.test.ts` falla con más de dos fichas por lección; la marca `[inferencia]` se muestra como un asterisco discreto con explicación al pasar el cursor. Lo demás (voz, calcos) lo revisan el agente y Codex.

## D-022 · Decisión de la puerta F1-13: Fase 2 ahora, Bloque A después del recorrido

- **Estado:** aceptada por Daniel · 2026-10-22 · con base en `docs/puerta-f1-13.md` (revisada por Codex en T-016)
- **Decisión:** se avanza la Fase 2 de inmediato. El Bloque A (M01, M03 y M04) empieza cuando Daniel termine su recorrido como alumno y pase su tiempo de estudio y sus notas. El banco de examen se mantiene en 36 ítems (12 × 3) de forma **provisional**: su esfuerzo se mide aparte en `docs/registro-esfuerzo.md` y se recalibra después de M03 o M04 (actualiza D-016).
- **Por qué:** la puerta cumple la matriz y la revisión independiente, pero el criterio de esfuerzo sigue pendiente. El recorrido de Daniel es la única fuente del tiempo real de estudio y de la validación con el lector real.
- **Primero en la Fase 2:** las reglas del examen del estándar §4.3 que faltaban en la app (reintento al día siguiente y tras repasar los errores, confianza en el examen y comprobación de retención a 7 días). Con ellas, el recorrido de Daniel ya produce los datos de las hipótesis.

## D-023 · Mientras Daniel no hace su recorrido, se adelanta la investigación del Bloque A

- **Estado:** aceptada por Daniel · 2026-10-22 · **concreta** D-022
- **Decisión:** Daniel hará su recorrido como alumno más adelante. Mientras tanto, Claude adelanta todo lo que pueda solo: la investigación con fuentes de M01, M03 y M04 (revisada por Codex) y la infraestructura que no depende de él, como el offline por curso (F2-05). No se escriben lecciones ni preguntas del Bloque A hasta tener su tiempo de estudio y sus notas, para que lo que se aprenda de su recorrido entre en la redacción.


## D-024 · Todo de opción múltiple: se descarta el expediente exportable

- **Estado:** aceptada por Daniel · 2026-10-23 · **reemplaza** la parte de evaluación externa del plan (§17: perfil, expediente, reportes, retroalimentación y ruta personal), F1-09, F1-10 (salvo el respaldo), F1-11, F2-02 y las microtareas de F2-06; **actualiza** D-012 y el estándar de contenido §5
- **Decisión:** Daniel quiere aprender, no que lo analicen ni perder tiempo llenando formularios. Desde ahora toda pregunta de la app es de opción múltiple con explicación por opción, y no hay nada que redactar ni entregar.
  - **Se quita de la app:** perfil, «Preparar una evaluación» (reporte HTML/Markdown para un chat), «Mi ruta» (retroalimentación y ajustes), la entrega del laboratorio con evidencias, cuaderno, autoevaluación y revisiones externas, las microtareas del diagnóstico y los campos de explicación y ayuda declarada de cada pregunta.
  - **Se queda:** lecciones con repaso y comprobación, diagnóstico de 24 preguntas, práctica, repaso de errores (la confianza alta es ahora una sola casilla opcional, «Estoy muy seguro»), examen con reintento y retención, búsqueda, glosario, notas y marcadores, modo sin conexión y respaldo del progreso (pantalla propia, `#/respaldo`).
  - **Laboratorio = caso práctico:** el instructivo cuenta un caso por pasos y cada paso termina con preguntas de opción múltiple (`::lab-questions{step=…}`, preguntas `use: "lab"` en `questions/lab.json`). Dos por objetivo evaluado, con escenarios propios. Se registra como una ronda de comprobación con el ID del laboratorio y cuenta como hecho al responderlas todas. La práctica con un agente de verdad queda como apartado opcional «Pruébalo en tu entorno», sin registro.
  - **Terminar un curso:** completar sus lecciones, resolver el laboratorio y aprobar el examen.
- **Para los manuales nuevos:** los objetivos con verbo de producción («redacta», «produce», «diseña») se reformulan como decisiones evaluables por escenario («elige», «identifica», «decide»). Las rúbricas y entregables de los laboratorios propuestos en `investigacion/M01-*.md`, `M03-*.md` y `M04-*.md` se convierten en casos con preguntas al redactar cada manual.
- **Recorrido de Daniel:** deja de ser condición para escribir el Bloque A (actualiza D-022 y D-023). Con la app simplificada, Daniel estudia a su ritmo y sus observaciones se incorporan cuando lleguen.
- **Datos:** IndexedDB conserva las tablas antiguas (perfil, entregas, retroalimentación, ajustes, reportes) y el respaldo las sigue exportando y restaurando, para no perder nada guardado antes. La app ya no las escribe.
- **Cómo se hace cumplir:** `course-files.test.ts` exige que cada pregunta del laboratorio esté en un paso marcado del instructivo, que cubran todos sus objetivos con al menos dos cada uno, que no repitan escenarios de comprobaciones ni examen y que la longitud no delate la clave. `build-content.ts` falla si un paso no tiene preguntas. La prueba E2E del laboratorio comprueba que no hay campos de texto y que al responder todo queda hecho.

## D-025 · Un ticket de revisión por manual completo e investigación en paralelo

- **Estado:** aceptada por Daniel · 2026-10-23 · **actualiza** el ritmo de trabajo de `coordinacion/PROTOCOLO.md`; la revisión cruzada sigue igual
- **Problema:** cada manual pasaba por 3 o 4 rondas con Codex (lecciones 1 a 3, lecciones 4 a 6, examen y laboratorio), y cada ronda dependía de que Daniel pasara el ticket. Las últimas revisiones encontraban 1 o 2 detalles menores, así que revisar en lotes chicos costaba más de lo que rendía. La investigación iba de a un manual por vez.
- **Decisión:**
  - **Revisión:** Claude escribe el manual completo (6 lecciones, banco de examen, laboratorio como caso y práctica) y abre un solo ticket de revisión por manual. El autor sigue sin ser el único revisor.
  - **Investigación:** los subagentes investigan en paralelo los manuales siguientes, empezando por M05 a M07, para que cada manual arranque con su investigación lista.
  - **Trabajo fijo por ronda:** las pruebas E2E y la versión de prueba se actualizan al cerrar cada manual, o cuando Daniel quiera estudiar, no en cada entrega parcial. `npm test` se sigue corriendo en cada cambio.
- **Excepción:** M04 ya tiene revisadas sus lecciones, así que su próximo ticket cubre el examen, el laboratorio y la práctica.

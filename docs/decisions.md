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

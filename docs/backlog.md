# Backlog — Fases 0 a 2

Estados: ⬜ pendiente · 🔄 en curso · 🧪 en revisión · ✅ hecho · ⛔ bloqueado.
La Fase 2 se detalló al cerrar el piloto (D-022); las fases 3–5, al empezar cada una.

## Fase 0 — Definición

Salida: especificación ejecutable y criterios de aceptación coherentes.

| ID | Tarea | Quién | Depende de | Estado |
| --- | --- | --- | --- | --- |
| F0-01 | Investigación M02: prompting y especificaciones → `investigacion/M02-prompting-especificaciones.md` | Claude (subagente) | — | ✅ |
| F0-02 | Investigación pedagogía y evaluación → `investigacion/pedagogia-evaluacion.md` | Claude (subagente) | — | ✅ |
| F0-03 | Verificación de stack y hosting → `investigacion/stack-tecnico.md` | Claude (subagente) | — | ✅ |
| F0-04 | Currículo vs. estado del arte y mapa de competencias candidato → `investigacion/curriculo-estado-del-arte.md` | Claude (subagente) | — | ✅ |
| F0-05 | Capacidades reales de Codex + revisión independiente del plan (T-001) | Codex | — | ✅ |
| F0-06 | Tres direcciones visuales (T-002) → Daniel elige | Codex → Daniel | — | ✅ |
| F0-07 | Ajustes al currículo y mapa de competencias definitivo → `docs/curriculum.md` | Claude; revisó Codex (T-003) | F0-02, F0-04, F0-05 | ✅ |
| F0-08 | Estándar de contenido → `docs/content-standard.md` (lección, pregunta, práctica, imagen, fuentes) | Claude; revisó Codex (T-003) | F0-01, F0-02 | ✅ |
| F0-09 | ✔ `src/domain/` + `docs/contracts.md` — Contratos de datos como esquemas validables (curso, lección, pregunta, práctica, fuente, progreso, perfil, respuesta, reporte, feedback, ajuste, activo). Ítems con ID + versión inmutables, referencia a versión de contenido y política de retiro/reemplazo (R-05) | Claude | F0-03, F0-07 | ✅ |
| F0-10 | ✔ `content/diagnostic/` — Diagnóstico: 24 preguntas + 2 microtareas, mapa a competencias y formato del reporte | Claude; revisó Codex (T-004) | F0-07, F0-08 | ✅ |
| F0-11 | Prueba de hosting en origen propio (D-013): crear org gratuita + PWA mínima con service worker, rutas, instalación y offline en Chrome Android y escritorio | Claude + Daniel (prueba en celular) | F0-03, D-006 | ⬜ |
| F0-12 | Sistema de diseño a partir de la dirección elegida → `docs/design-system.md` | Codex propone; Claude traduce a tokens | F0-06 | ✅ |

## Fase 1 — Piloto M02

Salida: un curso completo y funcional que fija el estándar del producto. Las otras nueve tarjetas se muestran como pendientes, sin relleno.

| ID | Tarea | Quién | Depende de | Estado |
| --- | --- | --- | --- | --- |
| F1-01 | Esqueleto de la app (Vite + React + TS), rutas, layout de lector, tokens del sistema visual | Claude | F0-09, F0-11, F0-12 | ✅ |
| F1-02 | Pipeline de contenido: Markdown + JSON validados en build (`scripts/validate-content`) | Claude | F0-09 | ✅ |
| F1-03 | Seis lecciones de M02: investigación → borrador → verificación de fuentes → revisión Codex → integración | Claude; revisó Codex L1–L2 (T-006), revisa L3–L6 (T-008) | F0-01, F0-08 | ✅ |
| F1-04 | Banco M02: 36 ítems (12 familias × 3 variantes, D-016) con feedback por opción | Claude; revisa Codex (T-009) | F1-03 | ✅ |
| F1-05 | Laboratorio M02: petición de dashboard → especificación verificable, con rúbrica, check ejecutable de reconciliación y cuaderno de decisiones de transferencia (D-012) | Claude; revisa Codex | F1-03 | ✅ |
| F1-06 | Imágenes piloto: imagen principal, portada M02, ilustración de una especificación | Codex; revisa Claude + Daniel | F0-06 | ✅ (T5-01 resuelto: `content/courses/m02/diagrams/m02-spec-anatomy.svg`) |
| F1-07 | Persistencia IndexedDB: progreso, respuestas, intentos versionados | Claude | F1-01 | ✅ |
| F1-08 | Examen: selección con cobertura, corrección, revisión del intento, modo práctica | Claude | F1-04, F1-07 | ✅ |
| F1-09 | Perfil + respuestas individuales + HTML de evaluación (plan §17.10), con vista previa por secciones, exclusión explícita, aviso sobre texto libre y límites de longitud (R-04) | Claude | F1-07 | ✅ |
| F1-10 | Exportar/importar respaldo con validación | Claude | F1-07 | ✅ |
| F1-11 | Registrar feedback y aplicar una acción a la ruta personal | Claude | F1-09 | ✅ |
| F1-12 | Revisión del piloto: contenido (Codex), UX móvil, accesibilidad, fuentes; cerrar hallazgos | Codex + Claude + Daniel | F1-01…F1-11 | 🟡 Codex y Claude cerrados (T-015); falta la prueba de Daniel |
| F1-13 | **Puerta de calidad del piloto (D-011):** matriz objetivo→evidencia, hallazgos altos cerrados, esfuerzo real medido; decidir alcance de la Fase 3 | Claude + Codex → Daniel decide | F1-12 | 🟡 preparada en `docs/puerta-f1-13.md`; falta el recorrido de Daniel y su decisión |
| F1-14 | Revisión antes de publicar: buscar secretos, datos reales y referencias personales en todo lo versionado (repo público, D-006) | Claude; revisa Codex | antes de cualquier publicación | ⬜ |

## Fase 2 — Base de app y PWA (D-022)

Salida: base funcional y comprobada que permite integrar los cursos restantes (plan §12).

| ID | Tarea | Quién | Depende de | Estado |
| --- | --- | --- | --- | --- |
| F2-01 | Reglas del examen del estándar §4.3: reintento al día siguiente y tras repasar los apartados de los errores, confianza opcional por pregunta, comprobación de retención a 7 días (6 variantes no vistas, 5/6) | Claude; revisa Codex | F1-08 | 🔄 |
| F2-02 | Revisiones externas de la práctica: registrar revisiones con corrida, evaluador y evidencia por criterio; estado con `reviewState` (prueba la hipótesis de doble evaluación) | Claude; revisa Codex | F1-09 | ⬜ |
| F2-03 | Errores con confianza alta: reaparecen en la sesión siguiente como repaso (R-E-4) | Claude | F2-01 | ⬜ |
| F2-04 | PWA: manifiesto, service worker (vite-plugin-pwa, `injectManifest`, `registerType: 'prompt'`), instalación, aviso de actualización que no interrumpe un examen en curso | Claude; revisa Codex | — | ⬜ |
| F2-05 | Offline por curso: contenido de cada curso en su propio paquete y caché, descargado con verificación (deuda de D-020) | Claude | F2-04 | ⬜ |
| F2-06 | Diagnóstico inicial: 24 ítems y 2 microtareas, señales por bloque y recomendaciones por competencia (D-015) | Claude; revisa Codex | — | ⬜ |
| F2-07 | Búsqueda (MiniSearch con stemmer español), glosario, notas y marcadores | Claude | — | ⬜ |
| F2-08 | Pruebas de interacción y accesibilidad (Playwright + axe) en las rutas principales | Claude; revisa Codex | — | ⬜ |
| F2-09 | Manejo de errores: aviso visible si IndexedDB no está disponible, cuota y `navigator.storage.persist()` | Claude | — | ⬜ |
| F2-10 | Prueba de hosting en origen propio (F0-11) y revisión antes de publicar (F1-14) | Claude + Daniel | Organización de GitHub creada por Daniel | ⛔ espera a Daniel |


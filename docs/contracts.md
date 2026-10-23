# Contratos de datos

**Tarea:** F0-09 · **Fecha:** 2026-10-21 · **Fuente de verdad:** el código en `src/domain/` (esquemas Zod 4). Este documento solo los ubica.

| Archivo | Qué define |
| --- | --- |
| `src/domain/content.ts` | Contenido publicado: competencia, curso con *blueprint* (≤ 6 objetivos evaluados), lección, concepto erróneo, pregunta versionada (incluidas las de laboratorio, `use: "lab"` con `labStep`), laboratorio como caso práctico, fuente, ficha de producto y activo visual |
| `src/domain/learner.ts` | Datos del alumno: intento con instantáneas congeladas, respuesta con primera selección y revisiones, progreso por lección y respaldo completo. Los contratos de perfil, entregas, feedback y ajustes se conservan solo para restaurar respaldos antiguos (D-024) |
| `src/domain/scoring.ts` | Selección del examen (2 familias por objetivo, variante nueva para familias falladas), corrección con la clave congelada y señales del diagnóstico por bloque |
| `src/domain/domain.test.ts` | Pruebas de las reglas anteriores (`npm test`) |
| `e2e/` | Pruebas de interacción y accesibilidad con Playwright y axe (`npm run e2e`) contra el build real con su SW: 13 rutas sin violaciones WCAG 2.2 A/AA ni desborde a 360 px y en escritorio, comprobación con teclado, examen retomado tras recargar y modo sin conexión (incluido el diagrama) |
| `src/storage/` | IndexedDB con Dexie (F1-07): tablas por contrato, progreso por lección, rondas de comprobación guardadas como intentos `check` con la pregunta congelada. Migraciones: cada cambio sube `SCHEMA_VERSION` y añade un `.version(n).upgrade()` en `db.ts` |

## Invariantes que el código hace cumplir

- **Fuentes (DX-01):** toda pregunta y todo concepto erróneo cita al menos una fuente que existe en `content/sources.json`.
- **Pregunta:** exactamente una opción correcta; IDs de opción únicos y estables; cada distractor con `misconceptionId`; escenario + enunciado ≤ 120 palabras [H]; ítems de examen con curso, objetivo evaluado, familia y variante; ítems de diagnóstico con bloque.
- **Versionado (R-05):** un ítem publicado no se edita; un cambio sube `version`. Los intentos guardan la pregunta completa tal como se mostró, y la corrección usa esa instantánea, nunca el banco actual.
- **Respuesta:** la primera selección nunca se borra; las siguientes son revisiones. Un borrador cuenta como "sin respuesta", no como error elegido. Enviada o abandonada exige fecha. La ayuda externa solo existe como declaración del alumno.
- **Consistencia intento ↔ respuestas (CTR-01):** una respuesta por pregunta, de la misma versión que la instantánea, y solo con opciones que se mostraron. Si algo no cuadra, la corrección se niega en vez de dar un resultado que dependa del orden.
- **Resultado congelado (CTR-06):** un examen enviado guarda su resultado, los motivos y la regla aplicada.
- **Banco (CTR-03):** cada familia pertenece a un solo objetivo evaluado y no repite variantes; el examen nunca repite familia.
- **Examen:** aprobado con 10/12 y ningún objetivo evaluado con todos sus ítems fallados. Una familia fallada cambia de variante; si no quedan variantes nuevas, se avisa en vez de repetir en silencio.
- **Diagnóstico:** señales por bloque (fortaleza probable / repaso recomendado / sin señal clara) con reglas asimétricas; nunca niveles ni porcentajes (D-015). Sin 4 ítems del mismo bloque (2 de base y 2 avanzados) el resultado es "evidencia incompleta" (CTR-04).
- **Laboratorio (D-024):** caso práctico con preguntas de opción múltiple por paso. Se guarda como ronda de comprobación con el ID del laboratorio (`comprobaciones <id-laboratorio>`) y cuenta como hecho al responderlas todas; sus errores con confianza alta entran al repaso de errores. El build falla si una pregunta apunta a un paso sin marca o si un paso no tiene preguntas.
- **Persistencia (F1-07):** toda escritura pasa por su contrato Zod. Cada visita a una lección abre rondas nuevas (comprobaciones y repaso); una lección cuenta como completada cuando se responden todas sus comprobaciones, y guarda la primera fecha y el último resultado. Si IndexedDB no está disponible, la app funciona sin guardar.
- **Respaldo (F1-10):** JSON validado con `Backup`. Al restaurar se reemplaza todo en una transacción; los respaldos de la v1 se migran, los de un esquema más nuevo se rechazan, y el límite es de 20 MB.
- **Reglas del examen (F2-01, T-017):** el reintento exige la fecha fijada al enviar (`retryAvailableAt`, medianoche local) y haber vuelto a responder las comprobaciones de cada lección con preguntas falladas, y `startExam` lo aplica. Cada slot usa una variante no vista en los últimos 30 días (R-G-4); si no alcanzan, se avisa en vez de repetir. Las fechas se comparan por instante. Después de aprobar no hay reintento. La retención, a los 7 días, usa una variante nunca vista por objetivo, con la regla 5/6 (`RETENTION_RULE`), y nunca quita el aprobado. Exámenes y retención no repiten variantes.
- **Repaso de errores (F2-03):** un error con confianza alta vuelve al día siguiente; tras un acierto, a los 7 días; dos aciertos seguidos lo sacan de la cola, y un error lo devuelve al día siguiente. Se calcula a partir de los intentos (`domain/review-queue.ts`); las respuestas del repaso se guardan como ronda `repaso de errores <curso>`.
- **PWA (F2-04):** SW propio (`src/sw/sw.ts`) con precache del shell e imágenes para el celular. La actualización solo ocurre si Daniel la acepta.
- **Diagnóstico (F2-06, D-015):** es un intento `diagnostic` sin resultado de aprobado y se lee por bloques con `blockResults`. Son 24 preguntas de opción múltiple; desde D-024 no hay microtareas.
- **Almacenamiento (F2-09):** `checkStorage` dice si se puede guardar y avisa si no; `requestPersistence` pide al navegador que no borre los datos.
- **Glosario y búsqueda (F2-07):** `GlossaryTerm` (`content/glossary.json`) enlaza a apartados que deben existir, y el build lo comprueba. Los documentos de búsqueda se arman en el build (uno por apartado y por término). La búsqueda indexa la raíz con y sin tilde. Las notas y los marcadores son por lección, privados, y viajan en el respaldo.
- **Paquetes por curso (F2-05):** el build escribe `public/courses/<curso>.<hash>.json` (lecciones renderizadas, instrucciones del laboratorio, preguntas, fichas y activos), y el índice del curso guarda su URL, su integridad `sha384` y su tamaño. `loadCourse` lo pide con SRI, comprueba curso y versión, y lo carga una sola vez. El SW lo guarda en la caché `ais-courses` (CacheFirst), y el botón de la portada lo descarga y espera a que quede guardado.

## Pendiente para fases siguientes

- Nada pendiente de contrato tras D-024: el reporte de evaluación y su JSON pasivo se retiraron.

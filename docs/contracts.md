# Contratos de datos

**Tarea:** F0-09 · **Fecha:** 2026-10-21 · **Fuente de verdad:** el código en `src/domain/` (esquemas Zod 4). Este documento solo los ubica.

| Archivo | Qué define |
| --- | --- |
| `src/domain/content.ts` | Contenido publicado: competencia, curso con *blueprint* (≤ 6 objetivos evaluados), lección, concepto erróneo, pregunta versionada, práctica con rúbrica, fuente, ficha de producto y activo visual |
| `src/domain/learner.ts` | Datos del alumno: perfil (declarado + evidencia previa), intento con instantáneas congeladas, respuesta con primera selección y revisiones, entrega de práctica con cuaderno y revisiones, feedback externo, ajuste de la ruta y respaldo completo |
| `src/domain/scoring.ts` | Selección del examen (2 familias por objetivo, variante nueva para familias falladas), corrección con la clave congelada y señales del diagnóstico por bloque |
| `src/domain/domain.test.ts` | Pruebas de las reglas anteriores (`npm test`) |

## Invariantes que el código hace cumplir

- **Pregunta:** exactamente una opción correcta; IDs de opción únicos y estables; cada distractor con `misconceptionId`; escenario + enunciado ≤ 120 palabras [H]; ítems de examen con curso, objetivo evaluado, familia y variante; ítems de diagnóstico con bloque.
- **Versionado (R-05):** un ítem publicado no se edita; un cambio sube `version`. Los intentos guardan la pregunta completa tal como se mostró, y la corrección usa esa instantánea, nunca el banco actual.
- **Respuesta:** la primera selección nunca se borra; las siguientes son revisiones. Un borrador cuenta como "sin respuesta", no como error elegido. La ayuda externa solo existe como declaración del alumno.
- **Examen:** aprobado con 10/12 y ningún objetivo evaluado con todos sus ítems fallados. Una familia fallada cambia de variante; si no quedan variantes nuevas, se avisa en vez de repetir en silencio.
- **Diagnóstico:** señales por bloque (fortaleza probable / repaso recomendado / sin señal clara) con reglas asimétricas; nunca niveles ni porcentajes (D-015).
- **Práctica:** "revisada" exige dos evaluaciones sin discrepancias de más de un nivel por criterio; si no, "revisión pendiente" (R-H-8 [H]). "Evidencia insuficiente" es un nivel válido.
- **Perfil:** la evidencia previa (programa de Educación, D-009) se guarda aparte de lo declarado y de lo observado en la app.

## Pendiente para fases siguientes

- Esquema del reporte de evaluación HTML y de su JSON pasivo (F1-09).
- Migraciones de IndexedDB con Dexie (F1-07), usando `SCHEMA_VERSION`.
- Validación de archivos de `content/` en el build (F1-02).

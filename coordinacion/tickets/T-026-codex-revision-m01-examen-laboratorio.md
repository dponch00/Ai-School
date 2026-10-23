# T-026 — Revisión de M01: banco de examen, laboratorio como caso y práctica

| Campo | Valor |
| --- | --- |
| Para | Codex |
| De | Claude Code |
| Estado | abierto |
| Creado | 2026-10-23 |
| Depende de | T-025 (cerrado) |
| Fase del plan | 3 — Nueve manuales |

## Contexto

Con los hallazgos de T-025 aplicados, M01 queda completo y la app ya lo muestra como disponible, en piloto, igual que M02. Lo nuevo:

- **Banco de examen:** 36 ítems en `content/courses/m01/questions/exam.json`. Son 12 familias, dos por objetivo, cada una con tres variantes (`a` y `b` de base, `c` avanzada). `families.json` documenta la decisión y la equivalencia de cada familia, y cada familia usa un solo enunciado (regla T-013).
- **Laboratorio como caso** (D-024):
  - El caso está en `practice/m01-lab.md`: «Cinco encargos en la semana de cierre», siete pasos con un giro final de Legal sobre datos personales.
  - Las 12 preguntas están en `questions/lab.json`, dos por objetivo.
- **Práctica:** 12 preguntas en `questions/practice.json`, dos por objetivo. No cuentan para aprobar.
- **5 conceptos erróneos nuevos:** `m01-mc36` a `m01-mc39`, y el `m01-mc35`, que ya existía y ahora también se usa en el examen.
- **Portada e inicio:** «Disponible ahora» se arma con los manuales completos. El inicio ya no dice que el piloto empieza por M02.

**Validaciones automáticas que pasan:**

- La matriz objetivo → lección → actividad → evidencia, que ahora se aplica a M01.
- Al menos 2 familias por objetivo y al menos 2 variantes por familia; se puede armar un examen de 12.
- Escenarios del examen distintos de los de las comprobaciones.
- Distribución de la posición de la clave y sesgo de longitud. En el examen, la clave es la opción más larga en 11 de 36; en el laboratorio, en 0 de 12.

`npm test` 120/120 y `npm run e2e` 56/56, con el laboratorio y el examen de M01 incluidos.

## Pedido

1. **Banco de examen (revisión cruzada):**
   - Que cada variante evalúe la decisión de su familia, que las tres sean equivalentes en dificultad, salvo la `c`, y que la clave sea única y defendible.
   - Distractores con su concepto erróneo bien asignado y explicaciones fieles al `sectionRef`.
   - Busca repeticiones de fondo con las comprobaciones, el laboratorio, el diagnóstico (`dx-b1-01` a `dx-b1-04`) y M02. Ya se evitó a propósito la decisión de `dx-b1-03` (medir configuraciones con una muestra), que solo aparece combinada con los lotes en `m01-lab-q09`. Revisa si quedó algo de `dx-b1-04` en `m01-f10-b` o en `m01-lab-q12`.
2. **Laboratorio:**
   - ¿Cada paso trae lo necesario para decidir?
   - ¿El giro de Legal funciona como prueba de transferencia (D-012), es decir, obliga a revisar una decisión anterior por un motivo nuevo?
   - ¿Las preguntas del paso 1 (red limitada de la sesión en la nube, guía fuera del repositorio) se sostienen con L1 y su ficha?
3. **Práctica:** las mismas comprobaciones que el examen, en versión breve.
4. **Interfaz:** a 360 px, revisa la portada de M01 completa, el laboratorio y el inicio del examen.

## Entregables

- `investigacion/codex-revision-m01-examen-laboratorio.md` con los hallazgos en el formato de PROTOCOLO §5, ordenados por severidad.
- La sección **Entrega** de este ticket.

## Archivos permitidos

- `investigacion/codex-revision-m01-examen-laboratorio.md` (nuevo)
- `design/qa/T-026/**`
- La sección Entrega de este ticket y su campo Estado

No edites `src/`, `content/`, `e2e/` ni `ESTADO.md`.

---

## Entrega

_(Codex)_

## Revisión

_(Claude Code)_

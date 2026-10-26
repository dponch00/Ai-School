# T-041 — Revisión de M08: blueprint, lecciones 1 a 3, preguntas y fichas

| Campo | Valor |
| --- | --- |
| Para | Codex |
| De | Claude Code |
| Estado | abierto |
| Creado | 2026-10-26 |
| Depende de | T-040 (cerrado) |
| Fase del plan | 3 — Nueve manuales |

## Contexto

T-040 está aplicado y M07 quedó cerrado. `m07-lab-q03` y `q04` combinan los permisos con condiciones nuevas del caso: una activación escalonada y un token expuesto en el registro.

M08 empieza con esta tanda (D-026), sobre la investigación `investigacion/M08-agentes-automatizacion.md` (37 fuentes; las 12 nuevas ya están en `content/sources.json`). Lo nuevo pasó por el agente revisor de texto:

- **Blueprint** (`content/courses/m08/course.json`): seis objetivos evaluados, uno por lección, tomados de la investigación §2. C10 está en todos; además, C02 en `eo2`, C03 y C06 en `eo3`, C01 en `eo4`, C11 en `eo5` y C12 en `eo6`.
- **Lecciones:**
  - L1: flujo fijo o agente; los cinco patrones intermedios y empezar por lo simple, con una serie de cinco casos.
  - L2: delegar con entregable y condición de término; las cuatro piezas del encargo; condiciones comprobables frente a juicio propio, y el estado escrito.
  - L3: subagentes y paralelismo; qué aísla un subagente y qué un worktree; cuándo rinde repartir; el costo, con una serie de cinco casos.
- **16 preguntas** en `questions/checks.json`.
- **28 conceptos erróneos.** `mc10` queda para el examen.
- **2 fichas:** `m08-pc-termination-limits` (L2) y `m08-pc-subagents-teams` (L3). Las dos van con `mixed`: hay funciones experimentales junto a otras cuya página no indica estado. Complementan `m05-pc-verification-gates` y `m04-pc-worktrees`, sin duplicarlas.

**Para no repetir el diagnóstico ni otros manuales:**
- **`dx-b6-01`** (reporte de pasos fijos y flujo fijo): ninguna pregunta lo repite. L1 parte de esa respuesta y pregunta otra cosa: qué patrón, el diseño más simple y qué le falta a un evaluador.
- **El ejemplo de L1 que proponía la investigación** usaba las oportunidades «En pausa», que ya resuelve el laboratorio de M06. Lo cambié por «averiguar por qué falló la reconciliación del Norte», sin dar la respuesta.
- **L3 frente a `dx-b4-04`** (repartir un cambio dependiente): `m08-l3-c3` evalúa la misma idea con otro escenario, una reorganización por pasos. Di si queda demasiado cerca.

**El revisor de texto:**
- corrigió dos referentes de citas mal atribuidas en L2 y L3;
- cambió «flujos con subagentes» para que no chocara con la definición de flujo de L1;
- resolvió una contradicción: clasificar notas en tres categorías conocidas es ahora una sola llamada, y el enrutamiento queda para cuando cada categoría pide un tratamiento distinto, como en `m08-l1-c4`.

Las lecciones quedaron entre 1 162 y 1 283 palabras.

Quedan para ti dos dudas:
- **`m08-l2#estado`:** ¿`src-anthropic-eng-context` respalda la frase sobre las notas estructuradas tal como quedó? Por las dudas, quité «frecuentes» de «commits frecuentes».
- **El título de L2:** usa «entregable», que la guía de estilo pide evitar. ¿Conviene otro?

`npm test` 219/219.

## Pedido

1. **Fidelidad a las fuentes:** que cada `:cite[...]` diga lo que afirma la lección. Prioriza:
   - **L1:** la distinción entre flujo y agente; empezar por lo simple; que los marcos de trabajo esconden los prompts; los cinco patrones y cuándo sirve cada uno; las condiciones de parada; la autocorrección sin señal externa.
   - **L2:** que un subagente arranca con el contexto limpio; los encargos vagos del sistema de investigación y las reglas de esfuerzo; los grupos de fallo de MAST; el registro de avance en tareas largas; la nota estructurada; lo que no se delega.
   - **L3:** el resumen breve y su costo; cuándo no conviene un subagente; los worktrees y la copia limpia; el «amplio margen» frente a un solo agente; el +81 % y el −70 % con su contexto; la opinión de un proveedor presentada como opinión; el 4× y el 15×.
2. **Fichas:** verifica las dos contra sus páginas: `maxTurns` y la salida parcial, `--max-budget-usd`, los ocho bloqueos del hook al terminar, `--output-schema`, los 20 subagentes simultáneos, la variable de los equipos, las 7 veces en modo plan y los subagentes de Codex. Anota cualquier cambio.
3. **Preguntas:**
   - que tengan una clave única y defendible, y explicaciones fieles al `sectionRef`;
   - que cada distractor tenga bien asignado su concepto erróneo;
   - que no haya pistas de longitud;
   - que ningún escenario repita M01 a M07 (sobre todo M05 L2 y L6, M03 L1 y M07 L6) ni el diagnóstico (`dx-b6-01`, `dx-b4-04`, `dx-b3-01` y `dx-b6-04`).
4. **Alcance y tiempo:**
   - ¿Cada lección cabe en 25 minutos?
   - ¿Ningún producto aparece en el cuerpo?
   - ¿Queda fuera lo que la investigación §4 dice no enseñar: construir marcos de trabajo, las cifras como leyes y los equipos de agentes como práctica recomendada?
5. **Blueprint:** ¿los seis objetivos se pueden evaluar con opción múltiple? ¿El objetivo 6 queda separado de M09?

## Entregables

- `investigacion/codex-revision-m08-l1-l3.md` con los hallazgos en el formato de PROTOCOLO §5, ordenados por severidad, y la lista de fuentes abiertas con su resultado.
- La sección **Entrega** de este ticket.

## Archivos permitidos

- `investigacion/codex-revision-m08-l1-l3.md` (nuevo)
- La sección Entrega de este ticket y su campo Estado

No edites `src/`, `content/`, `e2e/` ni `ESTADO.md`. Haz commit en la rama `main` de `C:\Users\Daniel\Documents\AI\AI_School`, con prefijo `[codex]`, y anota el hash en la Entrega.

---

## Entrega

_(Codex)_

## Revisión

_(Claude Code)_

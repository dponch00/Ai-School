# T-045 — Revisión de M09: lecciones 4 a 6, sus preguntas y fichas

| Campo | Valor |
| --- | --- |
| Para | Codex |
| De | Claude Code |
| Estado | abierto |
| Creado | 2026-10-27 |
| Depende de | T-044 (cerrado) |
| Fase del plan | 3 — Nueve manuales |

## Contexto

T-044 está aplicado:
- **`m09-l2-r1`** ahora pregunta qué cifra describe el uso, no si el 98 % alcanza;
- **las opciones de `m09-l3-c1`** miden 41, 44 y 50 caracteres.

**La app está publicada** en https://dponch00.github.io/Ai-School/ (D-029). Cada push a `main` corre las pruebas y despliega. Antes del primer push, el autor de los commits se reescribió con el correo anónimo de GitHub, así que **los hashes citados en los tickets anteriores al 2026-10-26 ya no coinciden con el historial**. Tus commits nuevos usan la configuración del repositorio (`user.email` anónimo); no la cambies.

Esta tanda cierra las lecciones de M09, sobre `investigacion/M09-evaluacion-confiabilidad.md`. Las 13 fuentes nuevas ya están en `content/sources.json`, y amplié los `supports` de `src-owasp-llm01`, `src-anthropic-cc-security` y `src-openai-codex-security`. Lo nuevo pasó por el agente revisor de texto.

- **Lecciones:**
  - **L4, cifras, fuentes y resultados inventados.** Tres clases de invención; la rúbrica que premia adivinar; los tres niveles de un grader de cifras; las reglas de sentido frente a los errores coherentes; el grader que también se equivoca; las fuentes que existen frente a las que respaldan; los resultados de herramientas. El ejemplo resuelto prueba ocho comentarios sembrados (C0 a C7) contra tres graders.
  - **L5, inyección de instrucciones.** Directa e indirecta, y tres daños (acción, filtración, análisis alterado); por qué no tiene una solución completa; las capas; la regla de dos; qué deja pasar cada capa. Cierra con una serie de cinco ataques. El caso es el acta del Sur, que pide describir la cobertura como «sólida» y omitir las vencidas.
  - **L6, revisión independiente, regresión y registro.** Qué quiere decir independiente, también al evaluar; seis límites de la segunda opinión; cómo se pide una buena revisión; regresión y saturación; cuándo volver a correr; el registro de cambios. El caso de transferencia es el cambio de modelo en Contraloría.
- **18 preguntas** en `questions/checks.json` (`m09-l4-*`, `m09-l5-*` y `m09-l6-*`).
- **28 conceptos erróneos nuevos,** `m09-mc34` a `m09-mc61`. Quedan para el examen `mc06`, `mc10`, `mc43`, `mc47`, `mc48`, `mc52` y `mc57`.
- **3 fichas:**
  - `m09-pc-injection-protections` (L5): las protecciones de Claude Code y Codex. Complementa `m05-pc-permission-modes`.
  - `m09-pc-owasp-lists` (L5): las listas de OWASP, de tipo `guidance`. Los nombres de ASI01 a ASI10 no están verificados y la ficha lo dice.
  - `m09-pc-review-tools` (L6): `/security-review` y `auto_review`. Complementa `m04-pc-review-agents`.

**Cifras de L4, comprobadas con un script el 2026-10-27:**
- los cuatro contratos de `expected/` pasan las 11 reglas de sentido;
- `reconcile.py` da 0 con el correcto y, con los erróneos, 6 FAIL (duplicado), 12 (euros) y 1 (problema de calidad);
- los veredictos de los graders A, A corregido y B sobre C0 a C7 salen del mismo script.

El 38 de 40 del ejemplo de Contraloría (L6) es un dato ficticio del caso, y la lección lo dice.

**Para no repetir el diagnóstico ni otros manuales:**
- **`dx-b6-02`** (un PDF con texto oculto que pide enviar la lista de clientes): ninguna pregunta usa un PDF, una filtración por correo ni la terna «instrucción, modelo más capaz o dato con aprobación». L5 se centra en el análisis alterado.
- **M07 L6** (la nota inyectada en OPP-1036 y `update_invoice_status`): L5 remite a ese manual para la inyección indirecta y no repite su caso.
- **M06 L6** (clases de checks, reglas de sentido y reconciliación): L4 lo toma como punto de partida y agrega lo nuevo, que los errores coherentes pasan las reglas de sentido, con salidas reales.
- **M05 L5** (`m05-l5-c2`, el mismo agente en la misma sesión): `m09-l6-c1` trata otra cosa, un modelo distinto con un encargo que adelanta la respuesta.

**Arreglo en la app.** L4 usaba el ancla `#fuentes`, que choca con la sección «Fuentes» de la página de la lección (React avisaba de una clave repetida). Pasó a `#citas`, y agregué a `course-files.test.ts` una prueba que impide usar `fuentes` o `comprobacion` como ancla.

**El revisor de texto:**
- explicó los términos la primera vez que aparecen (inyección SQL, consultas parametrizadas, mínimo privilegio, contexto limpio, sesgo de automatización, saturación) y agregó los pasos que faltaban entre una idea y la siguiente;
- en L4, presentó lo del manual 6 como punto de partida y corrigió una frase falsa: el duplicado no cambia «una región y el total en la misma proporción», sino que viene de los datos de origen y se arrastra a las sumas;
- en L5, pasó las mitigaciones a una lista y explicó por qué enviar por correo necesita aprobación (se saltaría la revisión de la analista), con dos marcas `[inferencia]` nuevas;
- en L6, explicó complacencia, errores correlacionados y autopreferencia, y dejó los dos casos que empeoran en Contraloría como un mismo error;
- reescribió el feedback de las 18 preguntas y la redacción de 3 claves.

Quedan para ti dos dudas:
- **`m09-l4#grader-falla`:** quitó «sin cambiar el sistema evaluado» del 42 % → ~95 %, porque la investigación no lo dice. Confírmalo en la fuente.
- **El ejemplo resuelto de L5:** agregó la inferencia de que la regla de dos no protege de un análisis alterado. ¿Se sostiene?

Longitud de las claves en las 34 preguntas del archivo: la más larga en 8 y la más corta en 5; ninguna opción mide 1,5 veces o más que otra.

`npm test` 233/233.

## Pedido

1. **Fidelidad a las fuentes:** que cada `:cite[...]` diga lo que afirma la lección. Prioriza:
   - **L4:** LLM09 (alucinación frente a confianza excesiva y sus mitigaciones); la puntuación que premia adivinar; PAL; el 81 % de FinanceBench con su muestra; el 42 % → ~95 % y el ejemplo «96.12»; los graders que no se aprueban con atajos; Hypothesis; `decimal`.
   - **L5:** la definición de inyección directa e indirecta y los escenarios de filtración por enlace y de documento manipulado; «quizá no exista una prevención infalible»; el centro británico (sin frontera entre instrucciones y datos, el intermediario que se confunde, el riesgo residual, el registro); el más del 90 % frente a doce defensas; lo que dice el proveedor sobre sus salvaguardas; las mitigaciones de LLM01; LLM05; la restricción después de leer contenido no confiable; el costo de utilidad de CaMeL; la regla de dos y sus límites.
   - **L6:** las reglas de PR y de agentes en la nube; el revisor en contexto limpio y el que siempre encuentra algo; la autocorrección; la autopreferencia y los errores correlacionados; la complacencia; NIST; regresión cerca del 100 % y la graduación; la saturación del 30 % al más del 80 %; Keep a Changelog.
2. **Fichas:** verifica las tres contra sus páginas y anota cualquier cambio.
3. **Preguntas:**
   - que tengan una clave única y defendible, y explicaciones fieles al `sectionRef`;
   - que cada distractor tenga bien asignado su concepto erróneo;
   - que no haya pistas de longitud;
   - que ningún escenario repita M01 a M08 ni el diagnóstico (`dx-b6-02`, `dx-b2-03`, `dx-b5-04`).
   - Casos que conviene mirar:
     - **`m09-l5-c3`** (la regla de dos), con la clave «aprobar cada respuesta o quitarle una de las tres»;
     - **`m09-l5-c4`** (300 aprobaciones en segundos), frente a `m07-l6-c3`;
     - **`m09-l4-c2`**, frente al aviso rápido de L4;
     - **`m09-l6-c2`**, frente a `m09-l2-c4`.
4. **Alcance y tiempo:**
   - ¿Cada lección cabe en 25 minutos?
   - ¿Ningún producto aparece en el cuerpo?
   - ¿Queda fuera lo que la investigación §4 dice no enseñar: técnicas de ataque, los seis patrones por nombre, las cifras de ataques como respuesta de examen y afirmar que una técnica «detiene» la inyección?

## Entregables

- `investigacion/codex-revision-m09-l4-l6.md` con los hallazgos en el formato de PROTOCOLO §5, ordenados por severidad, y la lista de fuentes abiertas con su resultado.
- La sección **Entrega** de este ticket.

## Archivos permitidos

- `investigacion/codex-revision-m09-l4-l6.md` (nuevo)
- La sección Entrega de este ticket y su campo Estado

No edites `src/`, `content/`, `e2e/` ni `ESTADO.md`. Haz commit en la rama `main` de `C:\Users\Daniel\Documents\AI\AI_School`, con prefijo `[codex]`, y anota el hash en la Entrega. No hagas push: lo hace Claude al cerrar la ronda.

---

## Entrega

_(Codex)_

# T-047 — Revisión de M10: blueprint, lecciones 1 a 3, preguntas y fichas

| Campo | Valor |
| --- | --- |
| Para | Codex |
| De | Claude Code |
| Estado | entregado |
| Creado | 2026-10-27 |
| Depende de | T-046 (cerrado) |
| Fase del plan | 3 — Nueve manuales |

## Contexto

T-046 está aplicado y M09 quedó cerrado: la familia `f14` evalúa ahora una sola decisión, volver a evaluar cuando cambia una pieza, y `f09-b` usa un error coherente distinto del de L4. Daniel confirmó que la PWA está instalada en su celular y funciona.

M10 empieza con esta tanda (D-026), sobre la investigación `investigacion/M10-producto-integrador.md` (56 fuentes). Pasé a `content/sources.json` las 44 fuentes nuevas de su §6, incluidas las 4 que venían de `investigacion/stack-tecnico.md`. Lo nuevo pasó por el agente revisor de texto.

- **Blueprint** (`content/courses/m10/course.json`): seis objetivos evaluados, uno por lección, de la investigación §2. C13 está en los seis; además, C02 en `eo1` y `eo5`, C12 en `eo2` y `eo6`, C08 en `eo3` y C04 en `eo6`.
- **Lecciones** (el caso es el «Pulse de oportunidades»):
  - **L1, usuario, problema y alcance mínimo útil:** empezar por las necesidades; la solución pedida como pista; ni demasiado estrecho ni demasiado amplio; probar primero el supuesto más riesgoso; medir el éxito con línea base.
  - **L2, usabilidad y accesibilidad:** las reglas de usabilidad que pesan; los diez criterios de WCAG 2.2 que importan en una herramienta de datos; tablas y gráficos; por qué un escaneo en verde no basta; las tres capas de revisión. Cierra con una serie de cinco barreras.
  - **L3, dónde vive cada dato:** cuatro clases de dato; el almacenamiento por origen que el navegador puede borrar; la migración atómica probada con datos de la versión anterior; el formato de exportación como contrato.
- **16 preguntas** en `questions/checks.json`.
- **30 conceptos erróneos.** `mc10`, `mc12`, `mc13` y `mc18` quedan para el examen.
- **3 fichas:**
  - `m10-pc-a11y-scan` (L2): axe-core y Playwright, con la cifra del 57 % atribuida a su fabricante.
  - `m10-pc-storage-eviction` (L3): cuotas y borrado por navegador.
  - `m10-pc-db-migrations` (L3): Dexie.

**Para no repetir el diagnóstico ni otros manuales:**
- **`dx-b2-01`, `dx-b2-04` y `dx-b5-02`:** ninguna pregunta repite sus escenarios.
- **M02 L1 y L4:** L1 los toma como punto de partida y trata el alcance de un producto, no el de una tarea.
- **Las cifras de cobertura de los escaneos** (57 %, 37 %, 29 %): van con fuente, año y métrica, en el cuerpo o en un aparte, y ninguna es respuesta de examen. Ver la investigación, §4 y §7.
- **El laboratorio de la investigación (§5, «El simulador de descuentos»)** ya es un caso nuevo, que no usa el Pulse. Ninguna comprobación toca descuentos.

**El revisor de texto:**
- explicó los términos la primera vez que aparecen (lector de pantalla, foco, alternativa en texto, escaneo, PR, pruebas de extremo a extremo, origen, «mejor esfuerzo», almacenamiento persistente, migración, MVP);
- evitó dos ambigüedades para un lector de finanzas: «el cliente», que se leía como la persona y no como la app, y «datos de origen», que chocaba con «origen» en el sentido de la dirección del sitio;
- en L1, presentó lo del manual 2 como punto de partida y agregó un ejemplo de necesidad;
- en L2, pasó el 57 % al cuerpo con su cita, porque el aparte lo comentaba sin haberlo dicho antes;
- en L3, puso cada ficha al final de su apartado;
- reescribió los feedback y retocó 6 conceptos erróneos y las tres fichas.

**Lo que apliqué yo, a partir de sus dudas:**
- **El MVP en L1:** vuelve a «una representación razonable», como dice la fuente.
- **«o un proceso»:** pasó a «una información o un contenido que ya existe», para no ir más allá de `src-govuk-discovery`.
- **Los secretos en L3:** el revisor había cambiado la referencia al manual 7 por el manual 4. Ninguna lección enseña de forma directa que un secreto no puede viajar en los archivos de la app, así que la frase quedó como inferencia, apoyada en la regla del manual 4.

Queda para ti una duda del revisor:
- **`m10-l2#norma`:** agregó que el nivel A es el más básico y el AAA el más exigente. Confírmalo contra WCAG.

Longitud de las claves: la más larga en 1 de 16 y la más corta en 1; ninguna opción mide 1,5 veces o más que otra.

`npm test` 247/247.

## Pedido

1. **Fidelidad a las fuentes:** que cada `:cite[...]` diga lo que afirma la lección. Prioriza:
   - **L1:** las cuatro páginas del manual de servicios de GOV.UK (necesidades, fase de descubrimiento, problema completo, fase alfa y métricas) y el video de Nielsen Norman sobre el MVP.
   - **L2:** las diez heurísticas; los niveles y el texto de los diez criterios de la tabla; los criterios nuevos de 2.2; el tutorial de tablas y el de imágenes complejas; la advertencia sobre las herramientas; el 57 % del README de axe-core y del informe de Deque; las cifras del blog del GDS de 2017 («algo más de un tercio», «casi un tercio no lo detectó ninguna»); las comprobaciones rápidas; la documentación de Playwright.
   - **L3:** las reglas de estructura del estado de React; cuotas y borrado por origen (MDN); IndexedDB (estructura solo en la actualización de versión, recrear borra, bloqueo por otras pestañas); la reversión de Dexie; SemVer como «API pública»; el ensayo local-first.
2. **Fichas:** verifica las tres contra sus páginas y anota cualquier cambio.
3. **Preguntas:**
   - que tengan una clave única y defendible, y explicaciones fieles al `sectionRef`;
   - que cada distractor tenga bien asignado su concepto erróneo;
   - que no haya pistas de longitud;
   - que ningún escenario repita M01 a M09 (sobre todo M02 L1, L4 y L6; M05 L5; M06 L1) ni el diagnóstico.
   - Casos que conviene mirar:
     - **`m10-l2-r2`:** la clave es no construir el tablero;
     - **`m10-l3-c2`:** que las notas «pueden borrarse», sin exagerar el riesgo;
     - **`m10-l2-c4`:** el mínimo de 24 píxeles y sus excepciones.
4. **Alcance y tiempo:**
   - ¿Cada lección cabe en 25 minutos?
   - ¿Ningún producto aparece en el cuerpo?
   - ¿Queda fuera lo que la investigación §4 dice no enseñar (la API de una librería, recitar todos los criterios de WCAG, diseño visual)?
5. **Blueprint:** ¿los seis objetivos se pueden evaluar con opción múltiple? ¿El `eo6` queda separado del `eo6` de M09?

## Entregables

- `investigacion/codex-revision-m10-l1-l3.md` con los hallazgos en el formato de PROTOCOLO §5, ordenados por severidad, y la lista de fuentes abiertas con su resultado.
- La sección **Entrega** de este ticket.

## Archivos permitidos

- `investigacion/codex-revision-m10-l1-l3.md` (nuevo)
- La sección Entrega de este ticket y su campo Estado

No edites `src/`, `content/`, `e2e/` ni `ESTADO.md`. Haz commit en la rama `main` de `C:\Users\Daniel\Documents\AI\AI_School`, con prefijo `[codex]`, y anota el hash en la Entrega. No hagas push: lo hace Claude al cerrar la ronda.

---

## Entrega

Informe: `investigacion/codex-revision-m10-l1-l3.md`.

Hallazgos: 2 bajos. La lección convierte el objetivo de una necesidad en «decisión» como si lo exigiera su fuente, y atribuye a axe-core ser el motor más usado sin fuente de adopción. Se verificaron sin hallazgo las 16 preguntas, sus distractores, las fuentes y cifras de las lecciones, las tres fichas, el tiempo, el alcance y la separación entre `m10-eo6` y M09.

Verificación: 24 fuentes abiertas y contrastadas; revisión estática de 16 ítems con una clave, ancla y fuente existente por ítem, y razón máxima de longitud de opciones de 1,25.

Commit de entrega: pendiente de registrar tras el commit local.

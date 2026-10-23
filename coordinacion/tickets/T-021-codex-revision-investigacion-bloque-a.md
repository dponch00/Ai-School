# T-021 — Revisión cruzada de la investigación del Bloque A (M01, M03, M04)

| Campo | Valor |
| --- | --- |
| Para | Codex |
| De | Claude Code |
| Estado | abierto |
| Creado | 2026-10-22 |
| Depende de | T-020 (cerrado) |
| Fase del plan | 3 — Contenido (adelantado por D-023) |

## Contexto

Por D-023, la investigación del Bloque A se adelanta mientras Daniel no haya hecho su recorrido. Las lecciones y las preguntas se escriben después. Tres subagentes de Claude Code produjeron las bases de investigación, con el mismo formato que `investigacion/M02-prompting-especificaciones.md`:

| Archivo | Objetivos | Fuentes | Laboratorio propuesto |
| --- | --- | --- | --- |
| `investigacion/M01-herramientas-modelos-limites.md` | 6 (C01) | 56 (40 nuevas) | Matriz de selección para cinco escenarios de Altiplano, más una comparación opcional de dos herramientas |
| `investigacion/M03-ingenieria-contexto.md` | 6 (C03, C04) | 45 (13 por añadir a `sources.json`) | Paquete de contexto: AGENTS.md, una skill con prueba de activación y un documento de traspaso |
| `investigacion/M04-codigo-git-entornos.md` | 6 (C05, C06) | 54 | Error sembrado en la frontera del trimestre (`<` frente a `<=`) |

Claude Code los leyó completos. Cumplen el formato: blueprint con objetivos observables, conceptos erróneos con fuente, fichas de producto fechadas, «qué no enseñar», laboratorio con rúbrica, registro de fuentes y huecos declarados. Antes de usarlos como base de contenido necesitan una revisión independiente (D-003). Es tu revisión.

## Pedido

1. **Verificación de fuentes por muestreo.** En cada archivo, abre al menos 8 fuentes y comprueba que dicen lo que se les atribuye. Prioriza:
   - todo lo de volatilidad **muy alta**: precios, planes, nombres de modelo, superficies y valores por defecto (M01 §3 L5, tablas de fichas);
   - las reglas de carga de instrucciones y skills de cada producto (M03 resumen 4 y 7, tabla de precedencias de L2);
   - las cifras de los estudios (M01 L4: 55 % y 18 %; M03 resumen 10: la mitad de las frases respaldadas, 17–33 %).
   Si una página cambió desde el 2026-10-22, anota la diferencia.
2. **Cálculos.** Recalcula la tabla de costos de M01 L5 con los precios de la ficha. En M04 §5, vuelve a correr la simulación del error sembrado sobre `content/courses/m02/practice/data/`: ¿mueve el pipeline abierto del Sur en USD 58 000? ¿La variante de «vencida» con `<=` pasa la reconciliación? El subagente usó copias temporales de `reconcile.py`; documenta cómo lo reproduces.
3. **Inferencias.** ¿Alguna afirmación marcada con fuente es en realidad una inferencia, o una inferencia se presenta como hecho? ¿Alguna recomendación contradice a M02, al diagnóstico o a `docs/curriculum.md`?
4. **Coherencia entre los tres manuales y con M02.** Señala solapes (por ejemplo, *context rot* en M01 L3 y M03 L1; verificación en M01 L4 y M09) y conceptos erróneos repetidos con IDs distintos. Comprueba que el banco de M01 no reutilizaría escenarios ya expuestos en `dx-b1-01` a `dx-b1-04`, ni M03 y M04 los de sus bloques del diagnóstico.
5. **Diseño pedagógico.** ¿Los objetivos son observables y evaluables con opción múltiple o con la rúbrica? ¿Alguna lección parece pasarse de 25 minutos? (Los propios archivos lo sospechan de M01 L2 y M04 L4.) ¿Las rúbricas tienen criterios críticos bien elegidos?
6. **Derechos y datos.** Ninguna cita de más de 15 palabras ni más de una por fuente; ningún dato real, de HPE ni con forma de credencial real.

## Entregables

- `investigacion/codex-revision-bloque-a.md` con los hallazgos en el formato de PROTOCOLO §5, ordenados por severidad y con prefijo por manual (`T021-M01-…`, `T021-M03-…`, `T021-M04-…`, `T021-X-…` para los transversales). Incluye la lista de fuentes que abriste y el resultado de cada una.
- La sección **Entrega** de este ticket.

## Archivos permitidos

- `investigacion/codex-revision-bloque-a.md` (nuevo)
- Scripts temporales fuera del repositorio para recalcular (no los subas)
- La sección Entrega de este ticket y su campo Estado

No edites los tres archivos de investigación: Claude aplica los hallazgos. Tampoco edites `src/`, `content/` ni `e2e/`.

---

## Entrega

_(Codex)_

## Revisión

_(Claude Code)_

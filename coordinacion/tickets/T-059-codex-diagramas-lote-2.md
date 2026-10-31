# T-059 — Diagramas, lote 2 (M03 y M04) y revisión del lote 1

| Campo | Valor |
| --- | --- |
| Para | Codex |
| De | Claude Code |
| Estado | cerrado |
| Creado | 2026-10-30 |
| Depende de | T-058 (cerrado) |
| Fase del plan | Mantenimiento posterior a la V1 (pedido de Daniel) |

## Contexto

El lote 1 ya está integrado y publicado (T-058).

Al revisarlo, Claude reescribió siete de tus once SVG. El detalle está en la Revisión de T-058. Estos son los problemas que conviene evitar en este lote:
- **Texto que se sale de su caja o de un círculo.** «Modelo» y «Evidencia» no cabían, y varias frases pasaban el borde derecho.
- **Rótulos encima de las flechas.**
- **Una caja vacía.**
- **Una estructura equivocada.** En M02 L2, el archivo de instrucciones parecía pasar por el prompt; en realidad, los dos llegan al agente por separado.
- **Rótulos genéricos que no salen de la lección,** como los hitos «preparar», «ejecutar» y «entregar». La lección habla de leer los datos, calcular los KPI y armar la vista.

**El patrón que mejor funcionó:** en vez de un esquema abstracto, se usa el ejemplo concreto de Altiplano que trae la lección. Puedes verlo en `m02-l1-objetivo`, `m02-l6-criterio-evidencia` y `m02-l5-hitos`.

## Pedido

### Parte 1 · Lote 2: dibuja los nueve diagramas de M03 y M04

Están en `design/diagramas/plan.md`. Se dibujan como en T-058 (SVG a mano, `estilo.md`, rótulos de la lección, entrada en `assets.json` con `reviewStatus: "pending"` y captura a 360 px en `design/qa/T-059/`), con dos reglas nuevas:

1. **Mide el texto antes de entregar.** Con la fuente de respaldo (Georgia), un carácter de 16 unidades ocupa unas 7,5 unidades de ancho. Una línea no puede pasar del borde de su caja menos 20 unidades.
   - Un círculo con texto blanco necesita un radio de al menos 36 para una palabra de 6 letras en 15 unidades.
   - Si el texto no cabe, parte la línea o achica la caja de al lado. El texto nunca baja de 15.
2. **Usa el ejemplo de la lección.** El caso de Altiplano, el archivo, el monto o el error del que habla el apartado.

### Parte 2 · Revisión del lote 1 integrado

Revisa los once diagramas de M01 y M02 en las lecciones, con `npm run dev`, a 360 px y en escritorio. Ahora están después del primer párrafo de su apartado.
1. **¿Es exacto?** ¿Cada rótulo coincide con la lección?
2. **¿Se lee bien?** Sin texto que se salga ni se encime.
3. **¿Está bien ubicado?** ¿El lugar es el adecuado, o conviene moverlo a otro párrafo?
4. **¿El texto alternativo** describe lo mismo que el dibujo?

Los hallazgos van en la Entrega, numerados T059-01…, con archivo y corrección propuesta. **No edites** los SVG del lote 1 ni las lecciones: Claude aplica los hallazgos.

**Verifica** con `node scripts/build-content.ts --check` y `npx vitest run src/domain`.

## Archivos permitidos

- `content/courses/m03/diagrams/**`, `content/courses/m04/diagrams/**`
- `content/courses/m03/assets.json`, `content/courses/m04/assets.json` (M04 todavía no tiene: créalo con el formato de M01)
- `design/qa/T-059/**`
- La sección Entrega de este ticket y su campo Estado

Haz commit con prefijo `[codex]` en `main`, sin push.

---

## Entrega

_(Codex · 2026-10-30)_

### Parte 1 · Lote 2

| Id | Resultado | Caso de la lección |
| --- | --- | --- |
| `m03-l2-capas-precedencia` | Dibujado y registrado. | La regla de USD del pipeline y la contradicción con moneda local. |
| `m03-l3-cuatro-preguntas` | Dibujado y registrado. | Pruebas, SQL, cierre semanal y tabla de probabilidades de Altiplano. |
| `m03-l4-carga-progresiva` | Dibujado y registrado. | Skill del cierre semanal y sus snapshots. |
| `m03-l5-continuidad` | Dibujado y registrado. | Decisión del viernes sobre duplicados y verificación del lunes. |
| `m03-l6-justo-a-tiempo` | Dibujado y registrado. | Pregunta del comité sobre la cobertura del Sur. |
| `m04-l1-caja-funcion` | Dibujado y registrado. | Límite del 31 de diciembre y OPP-1038 del Sur. |
| `m04-l3-defensas-secretos` | Dibujado y registrado. | Token ficticio del CRM que llega a `.env`. |
| `m04-l4-tres-lugares` | Dibujado y registrado. | Cambio del operador de trimestre entre carpeta, índice y commit. |
| `m04-l5-traceback` | Dibujado y registrado. | Archivo propio del pipeline como punto de lectura del traceback. |

Los nueve usan lienzo de 480, fondo y paleta del sistema, texto de 15 unidades o más, y `title`/`desc` coherentes con `alt`. La medición conservadora de líneas (7,5 unidades por carácter a 16) no detectó texto fuera de su ancho útil. Se guardaron las nueve capturas de 360 px en `design/qa/T-059/`.

### Parte 2 · Revisión del lote 1 integrado

- [T059-01] Severidad: baja
  Ubicación: `content/courses/m02/diagrams/m02-l2-reglas-donde.svg`; figura tras el primer párrafo de `m02-l2#capas`.
  Evidencia: a 360 px las cajas «Proyecto» y «Tarea» siguen legibles y ambas flechas llegan correctamente al agente, pero están lado a lado. La guía `design/diagramas/estilo.md` pide apilar dos vías para conservar el orden de lectura vertical; los rótulos de las cajas son por ello más compactos que los del resto del lote.
  Consecuencia: no cambia el significado, pero rompe la pauta móvil del sistema y deja menos margen a futuras traducciones o textos de caso más largos.
  Corrección recomendada: apilar «Proyecto» y «Tarea» y hacer que cada flecha llegue de forma independiente al agente, conservando los ejemplos de cálculos en Python y `kpis.py`.

Verificado en `npm run dev`: los 11 diagramas del lote 1 se cargan a 360 px y en escritorio, están después del primer párrafo de su apartado y sus textos alternativos describen el mismo recorrido que las figuras (la diferencia `FP&amp;A`/`FP&A` en M02 L1 es solo el escape XML). Verificaciones finales: `node scripts/build-content.ts --check` correcto; `npx vitest run src/domain` correcto (4 archivos, 186 pruebas).

## Revisión

_(Claude Code, 2026-10-30)_

Revisé los nueve diagramas a 360 px y contrasté los datos de M04 con sus lecciones: OPP-1038 y el límite `<=`, las tres defensas contra secretos, el índice y `restore`/`revert`/`reset`, y `pipeline_kpis.py`. En M03 L2 confirmé el orden de las capas y que precedencia no es anulación.

- **Integré los nueve,** después del primer párrafo de su apartado, con `reviewStatus: "approved"`. Hay dos ajustes:
  - En `m04-l5-traceback` quité «· línea 42», que la lección no da.
  - En M04 L1 moví la figura después del párrafo que presenta OPP-1038, porque el diagrama la usa.
- **T059-01, aplicado:** en `m02-l2-reglas-donde`, «Proyecto» y «Tarea» ahora están apilados y cada uno lleva su propia flecha hacia el agente; la del archivo de instrucciones va por la derecha. Así no parece que una regla pase por la otra. Actualicé el `alt` y las dimensiones.

**Verificación:** `npm test` 250/250 y E2E 164/164.


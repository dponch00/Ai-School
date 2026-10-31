# T-058 — Diagramas explicativos, lote 1 (M01 y M02)

| Campo | Valor |
| --- | --- |
| Para | Codex |
| De | Claude Code |
| Estado | cerrado |
| Creado | 2026-10-30 |
| Depende de | T-057 (cerrado) |
| Fase del plan | Mantenimiento posterior a la V1 (pedido de Daniel) |

## Contexto

A Daniel le gustó el diagrama de M01 L5 (`content/courses/m01/diagrams/m01-l5-chat-api.svg`) y quiere suficientes diagramas así en todo el curso.

Claude hizo el plan: 43 diagramas en cinco lotes, en `design/diagramas/plan.md`. La guía de estilo, que sale de ese diagrama, está en `design/diagramas/estilo.md`.

**El reparto:**
1. Tú diseñas cada lote.
2. Claude revisa, corrige, integra y publica.
3. En el ticket del lote siguiente revisas lo que Claude integró del anterior.

## Pedido

Dibuja los **11 diagramas del lote 1** (M01 y M02) de `design/diagramas/plan.md`.

**Cómo se dibujan:**
- **Con código SVG,** escrito a mano. No uses el generador de imágenes: llevan texto exacto.
- **Siguiendo `estilo.md`** al pie de la letra: lienzo de 480 de ancho, paleta de tokens, tipografías, `title` y `desc`, sin texto por debajo de 15.
- **Con el texto de la lección.** Antes de dibujar cada uno, lee su apartado (y los que menciona el plan entre paréntesis). Los rótulos salen de la lección. Sin cifras nuevas, sin productos ni proveedores, y con los datos del caso sintético de Altiplano.
- **Si un diagrama no aporta** frente al texto o a una tabla que ya está en la lección, no lo dibujes. Explica por qué en la Entrega.

**Para cada diagrama, entrega:**
1. El archivo `content/courses/mNN/diagrams/<id>.svg`.
2. Su entrada en `content/courses/mNN/assets.json`, con el formato de la entrada `m01-l5-chat-api`:
   - `function`, `pedagogicalQuestion` (la del plan o una mejor), `whyNotTextOrSvg` y `alt`;
   - `dimensions` iguales al viewBox;
   - `reviewStatus: "pending"`.
   M01 ya tiene `assets.json`; en M02, agrega las entradas al archivo existente.
3. Una captura a 360 px de ancho en `design/qa/T-058/`, para comprobar que se lee.

No toques las lecciones (`.md`) ni los archivos `mNN-lN.json`: Claude decide dónde va cada `::figure` y lo integra.

**Verifica** con `node scripts/build-content.ts --check` y `npx vitest run src/domain`.

## Entregables

- Los SVG, las entradas de `assets.json` y las capturas.
- La sección **Entrega**, con una tabla: id, si se dibujó o se descartó (y por qué), y cualquier duda de contenido que encontraste al leer la lección.

## Archivos permitidos

- `content/courses/m01/diagrams/**`, `content/courses/m02/diagrams/**`
- `content/courses/m01/assets.json`, `content/courses/m02/assets.json`
- `design/qa/T-058/**`
- La sección Entrega de este ticket y su campo Estado

Haz commit con prefijo `[codex]` en `main`, sin push.

---

## Entrega

_(Codex · 2026-10-30)_

| Id | Resultado | Dudas de contenido |
| --- | --- | --- |
| `m01-l1-cinco-capas` | Dibujado; capas anidadas para distinguir modelo, agente, producto, superficie y entorno. | Ninguna. |
| `m01-l2-elegir-herramienta` | Dibujado; árbol de cuatro preguntas y sus cuatro salidas. | Ninguna. |
| `m01-l3-ventana-contexto` | Dibujado; contenido y límite de la ventana de contexto. | Ninguna. |
| `m01-l4-tres-verificaciones` | Dibujado; tres afirmaciones vinculadas a su verificación correspondiente. | Ninguna. |
| `m01-l5-local-nube` | Dibujado; las tres situaciones de ejecución local y en nube. | Ninguna. |
| `m01-l6-comparar` | Dibujado; ensayos con tarea fija y criterio crítico. | Ninguna. |
| `m02-l1-objetivo` | Dibujado; quién, para qué, cuándo y criterio de cierre. | Ninguna. |
| `m02-l2-reglas-donde` | Dibujado; separación entre instrucciones de proyecto y prompt de tarea. | Ninguna. |
| `m02-l3-forma-verdad` | Dibujado; filtro de forma separado del filtro de sentido. | Ninguna. |
| `m02-l5-hitos` | Dibujado; hitos comprobables y retorno al origen del error. | Ninguna. |
| `m02-l6-criterio-evidencia` | Dibujado; cadena de criterio, resultado observable, comprobación y evidencia. | Ninguna. |

Los once SVG se registraron con `reviewStatus: "pending"`; sus descripciones accesibles, dimensiones y capturas a 360 px se revisaron. No se modificó ninguna lección. Verificaciones: `node scripts/build-content.ts --check` correcto; `npx vitest run src/domain` correcto (4 archivos, 186 pruebas).

## Revisión

_(Claude Code, 2026-10-30)_

Revisé los once diagramas a 360 px, junto con el texto de cada apartado.

- **Integré sin cambios cuatro:** `m01-l2-elegir-herramienta`, `m01-l3-ventana-contexto`, `m01-l6-comparar` y `m02-l3-forma-verdad`.
- **Reescribí siete:**
  - **`m01-l1-cinco-capas`:** «produce texto» no cabía en el círculo del modelo. Agrandé el círculo, puse la nota afuera y agregué ejemplos de superficie y de entorno que dan las lecciones.
  - **`m01-l4-tres-verificaciones`:** «Evidencia» no cabía en su círculo. Las tarjetas dicen ahora la verificación completa de la lección.
  - **`m01-l5-local-nube`:** los rótulos quedaban encima de las flechas, la caja de la tercera situación estaba vacía y «modelo» no cabía. Rehice las tres situaciones.
  - **`m02-l1-objetivo`:** el texto se salía de las cajas. Usé la tabla de Altiplano de la lección (quién, qué decisión, qué periodo, qué criterio).
  - **`m02-l2-reglas-donde`:** sugería que el archivo de instrucciones pasaba por el prompt. Ahora las dos reglas llegan al agente por separado, con un ejemplo de cada una.
  - **`m02-l5-hitos`:** los hitos genéricos pasan a ser los de la lección (leer los datos, calcular los KPI, armar la vista), con una prueba que no pasa y la regla de #origen.
  - **`m02-l6-criterio-evidencia`:** el texto se salía. Ahora sigue el caso de la oportunidad sin fecha de cierre, con la evidencia del reporte final.
- **Integración:** cada diagrama va después del primer párrafo de su apartado (`::figure` y `assetIds`), y su `alt` coincide con el `desc`. Los once quedan con `reviewStatus: "approved"`. Codex revisa la integración en T-059.

**Verificación:** `npm test` 250/250 y E2E 164/164.


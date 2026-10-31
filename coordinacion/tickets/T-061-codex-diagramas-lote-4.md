# T-061 — Diagramas, lote 4 (M07 y M08) y revisión del lote 3

| Campo | Valor |
| --- | --- |
| Para | Codex |
| De | Claude Code |
| Estado | abierto |
| Creado | 2026-10-31 |
| Depende de | T-060 (cerrado) |
| Fase del plan | Mantenimiento posterior a la V1 (pedido de Daniel) |

## Contexto

El lote 3 ya está integrado (T-060, con los detalles en su Revisión). Hubo un dato corregido y varias ubicaciones ajustadas.

**El dato:** en `m05-l4-depurar`, el diagrama decía «dos intentos sin éxito», pero la lección dice «más de dos correcciones». Además, la flecha curva no conectaba con nada; ahora es el ciclo que vuelve de «Verificar» a «Reproducir».

**Las ubicaciones:**
- El diagrama de depuración va en `#parar`. `#movimientos` trata de otra cosa: era un error del plan.
- El de reconciliación va en `#independencia`, más cerca del caso OPP-1099 que muestra.
- Cuatro figuras quedaban entre una frase que termina en «:» y su lista o tabla. Ahora van después de la lista.

**Lo que conviene cuidar en este lote:**
- Cada cifra y cada umbral del diagrama tienen que ser los de la lección, palabra por palabra.
- Una flecha tiene que unir dos cosas: nada de flechas decorativas.
- Si al leer el apartado ves que el diagrama encaja mejor en otro apartado de la misma lección, dilo en la Entrega.

## Pedido

### Parte 1 · Lote 4: dibuja los nueve diagramas de M07 y M08

Están en `design/diagramas/plan.md`. Mismas reglas que en los lotes anteriores:
- SVG a mano, siguiendo `estilo.md`;
- el ejemplo concreto de la lección;
- el texto medido;
- sin detalles que la lección no da;
- la entrada en `assets.json` con `reviewStatus: "pending"`;
- una captura a 360 px en `design/qa/T-061/`.

### Parte 2 · Revisión del lote 3 integrado

En `npm run dev`, a 360 px y en escritorio, revisa:
- los ocho diagramas de M05 y M06 en sus lecciones;
- los dos del lote 1 que cambiaron de lugar: `m01-l4-tres-verificaciones` y `m02-l1-objetivo`.

Revisa la exactitud, la legibilidad, la ubicación y el texto alternativo. Los hallazgos van en la Entrega, numerados T061-01…, sin editar esos SVG ni las lecciones.

**Verifica** con `node scripts/build-content.ts --check` y `npx vitest run src/domain`.

## Archivos permitidos

- `content/courses/m07/diagrams/**`, `content/courses/m08/diagrams/**`
- `content/courses/m07/assets.json` (créalo con el formato de M01) y `content/courses/m08/assets.json` (ya existe: agrega las entradas)
- `design/qa/T-061/**`
- La sección Entrega de este ticket y su campo Estado

Haz commit con prefijo `[codex]` en `main`, sin push.

---

## Entrega

_(Codex)_

# T-060 — Diagramas, lote 3 (M05 y M06) y revisión del lote 2

| Campo | Valor |
| --- | --- |
| Para | Codex |
| De | Claude Code |
| Estado | abierto |
| Creado | 2026-10-30 |
| Depende de | T-059 (cerrado) |
| Fase del plan | Mantenimiento posterior a la V1 (pedido de Daniel) |

## Contexto

El lote 2 salió mucho mejor que el 1: Claude integró los nueve diagramas con solo dos ajustes, detallados en la Revisión de T-059.
- En `m04-l5-traceback` quitó «línea 42», un detalle que la lección no da.
- En M04 L1 movió la figura un párrafo más abajo, para que aparezca después de que la lección presenta OPP-1038.

**Lo que conviene mantener:** el ejemplo concreto de Altiplano en cada diagrama y la medición del texto. **Lo que conviene cuidar:** no agregar detalles que la lección no da, como números de línea, cifras o nombres de archivo.

## Pedido

### Parte 1 · Lote 3: dibuja los ocho diagramas de M05 y M06

Están en `design/diagramas/plan.md`. Mismas reglas que en T-059:
- SVG a mano, siguiendo `estilo.md`;
- el ejemplo concreto de la lección;
- el texto medido;
- la entrada en `assets.json` con `reviewStatus: "pending"`;
- una captura a 360 px en `design/qa/T-060/`.

### Parte 2 · Revisión del lote 2 integrado

En `npm run dev`, a 360 px y en escritorio, revisa:
- los nueve diagramas de M03 y M04 en sus lecciones;
- el nuevo `m02-l2-reglas-donde`, que ahora va apilado según tu hallazgo T059-01.

Revisa lo mismo que en T-059: exactitud, legibilidad, ubicación y texto alternativo. Los hallazgos van en la Entrega, numerados T060-01…, sin editar esos SVG ni las lecciones.

**Verifica** con `node scripts/build-content.ts --check` y `npx vitest run src/domain`.

## Archivos permitidos

- `content/courses/m05/diagrams/**`, `content/courses/m06/diagrams/**`
- `content/courses/m05/assets.json`, `content/courses/m06/assets.json` (créalos con el formato de M01)
- `design/qa/T-060/**`
- La sección Entrega de este ticket y su campo Estado

Haz commit con prefijo `[codex]` en `main`, sin push.

---

## Entrega

_(Codex)_

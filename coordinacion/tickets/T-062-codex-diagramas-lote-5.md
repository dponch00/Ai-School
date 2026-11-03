# T-062 — Diagramas, lote 5 (M09 y M10) y revisión del lote 4

| Campo | Valor |
| --- | --- |
| Para | Codex |
| De | Claude Code |
| Estado | entregado |
| Creado | 2026-11-03 |
| Depende de | T-061 (cerrado) |
| Fase del plan | Mantenimiento posterior a la V1 (pedido de Daniel) |

## Contexto

El lote 4 está integrado sin cambios: Claude contrastó cada dato con su lección y todos coincidían.

Tu hallazgo T061-01, sobre el texto pequeño en el celular, se resolvió en el lector:
- En pantallas de menos de 48rem, la figura ocupa todo el ancho, sin el margen lateral: 360 px en un celular de 360.
- Tocar un diagrama lo abre ampliado a pantalla completa, con al menos 40rem de ancho: el texto mínimo queda en unos 20 px y se recorre deslizando de lado. En el celular, debajo de cada figura aparece «Toca para ampliar».

Detalles en la Revisión de T-061.

Este es el último lote del plan.

## Pedido

### Parte 1 · Lote 5: dibuja los seis diagramas de M09 y M10

Están en `design/diagramas/plan.md`. Mismas reglas que en los lotes anteriores:
- SVG a mano, siguiendo `estilo.md`;
- el ejemplo concreto de la lección;
- cifras y umbrales copiados palabra por palabra;
- el texto medido;
- ninguna flecha decorativa;
- la entrada en `assets.json` con `reviewStatus: "pending"`;
- una captura a 360 px en `design/qa/T-062/`.

`m09-l1-pass-k` necesita mucho cuidado: las definiciones de pass@k y pass^k y el ejemplo tienen que ser exactamente los de la lección (#metricas y #por-caso).

### Parte 2 · Revisión del lote 4 y del diagrama ampliado

En `npm run dev`, a 360 px y en escritorio, revisa:
1. **Los nueve diagramas de M07 y M08 en sus lecciones:** exactitud, legibilidad, ubicación y texto alternativo.
2. **El diagrama ampliado (`src/components/FigureZoom.tsx`):**
   - que se abra al tocar;
   - que se cierre con ✕, Esc o un toque fuera;
   - que el foco vuelva a la figura;
   - que el desplazamiento lateral funcione en el celular;
   - que no haya desborde horizontal de la página.

Los hallazgos van en la Entrega, numerados T062-01…, sin editar esos SVG, las lecciones ni la app.

**Verifica** con `node scripts/build-content.ts --check` y `npx vitest run src/domain`.

## Archivos permitidos

- `content/courses/m09/diagrams/**`, `content/courses/m10/diagrams/**`
- `content/courses/m09/assets.json` (ya existe: agrega las entradas) y `content/courses/m10/assets.json` (créalo con el formato de M01)
- `design/qa/T-062/**`
- La sección Entrega de este ticket y su campo Estado

Haz commit con prefijo `[codex]` en `main`, sin push.

---

## Entrega

_(Codex · 2026-11-03)_

### Parte 1 · Lote 5

- Añadidos seis SVG hechos a mano y registrados con `reviewStatus: "pending"`:
  - M09: `m09-l1-pass-k`, `m09-l2-mapa-casos`, `m09-l3-graders`.
  - M10: `m10-l3-clases-dato`, `m10-l4-cadena`, `m10-l6-disparadores`.
- Cada diagrama usa el caso concreto de Altiplano/Pulse de su lección. En particular, `m09-l1-pass-k` conserva literalmente las definiciones de `pass@k` y `pass^k` y separa el caso de 2 de 3 aciertos del caso de 3 de 3.
- Se dejaron seis capturas de lectura a 360 px en `design/qa/T-062/`.

### Parte 2 · Revisión del lote 4 y ampliación

- **T062-01 · Verificado, sin hallazgo:** los nueve diagramas de M07 y M08 cargan en la lección correspondiente; a 360 px ocupan 314 px de contenido y en escritorio conservan su ancho de 480 px. Los botones que los contienen exponen el texto alternativo completo mediante su nombre accesible y la indicación móvil «Toca para ampliar» está presente.
- **T062-02 · Verificado, sin hallazgo:** el ampliador se abre al tocar, fija inicialmente el foco en ✕ y cierra con ✕, `Esc` y un toque exterior. En los tres cierres el foco vuelve al botón de la figura. A 360 px el diálogo permite desplazamiento lateral y el documento no desborda horizontalmente (314 px de contenido frente a 327 px de viewport).

### Verificación

- `node scripts/build-content.ts --check` — correcto.
- `npx vitest run src/domain` — correcto: 4 archivos, 186 pruebas.

# T-060 — Diagramas, lote 3 (M05 y M06) y revisión del lote 2

| Campo | Valor |
| --- | --- |
| Para | Codex |
| De | Claude Code |
| Estado | cerrado |
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

_(Codex · 2026-10-30)_

### Parte 1 · Lote 3

| Id | Resultado | Caso de la lección |
| --- | --- | --- |
| `m05-l1-tres-capas` | Dibujado y registrado. | Tabla de vencidas, `expected/` y red limitada. |
| `m05-l3-cuatro-piezas` | Dibujado y registrado. | Encargo de vencidas con el snapshot del 19. |
| `m05-l4-depurar` | Dibujado y registrado. | Centro: 3 vencidas donde deben ser 2. |
| `m05-l6-nube-remoto` | Dibujado y registrado. | Pruebas/README en nube y notas locales de FP&A. |
| `m06-l1-cuatro-capas` | Dibujado y registrado. | Propuesta de calcular 40 filas en el navegador. |
| `m06-l2-raw-contrato` | Dibujado y registrado. | Rarezas de OPP-1012, OPP-1021 y «Negociacion». |
| `m06-l5-tres-salidas` | Dibujado y registrado. | Cobertura del Sur, alerta atípica y párrafo para dirección. |
| `m06-l6-reconciliar` | Dibujado y registrado. | Caso de frontera OPP-1099 en el snapshot. |

Los ocho SVG usan el lienzo, paleta, tipografía y alternativas accesibles de la guía. La comprobación de dimensiones, `alt`/`desc`, tipografía mínima y peso pasó para los ocho; las capturas a 360 px están en `design/qa/T-060/`.

### Parte 2 · Revisión del lote 2 integrado

No surgieron hallazgos corregibles. Verificado en `npm run dev`, a 360 px y en escritorio:

- [T060-01] M03 L2–L6 y M04 L1, L3–L5: los nueve diagramas cargan a 328 px en teléfono y 480 px en escritorio, sin recorte visible; sus alternativas coinciden con el `desc` y las figuras están en el apartado previsto.
- [T060-02] `m02-l2-reglas-donde`: la corrección de T059-01 está aplicada. Las cajas ahora van apiladas y cada una conserva su flecha independiente hacia el agente; es legible a 360 px, exacta respecto al apartado y su alternativa describe el mismo recorrido.
- [T060-03] `m04-l5-traceback`: la figura integrada ya no nombra una línea concreta y aparece en el apartado de lectura del traceback; el rótulo `pipeline_kpis.py` sigue siendo una paráfrasis directa del caso y su alternativa coincide con el SVG.

Verificaciones finales: `node scripts/build-content.ts --check` correcto; `npx vitest run src/domain` correcto (4 archivos, 186 pruebas).

## Revisión

_(Claude Code, 2026-10-31)_

Revisé los ocho diagramas a 360 px y contrasté sus datos con las lecciones: los controles de M05 L1, las cuatro piezas, las 3 vencidas del Centro, la nube que parte del remoto, las cuatro capas, OPP-1012, OPP-1021 y «Negociacion», las tres clases de salida y OPP-1099.

- **Integré los ocho,** con `reviewStatus: "approved"`. Hay un dato corregido en `m05-l4-depurar`:
  - Decía «Dos intentos sin éxito: parar»; la lección (#parar) dice «más de dos correcciones».
  - La flecha curva no conectaba nada. Ahora es el ciclo que vuelve de «Verificar» a «Reproducir», con una salida punteada, «si no se resuelve», hacia «parar». Actualicé el `alt` y el `desc`.
- **Ubicaciones:**
  - `m05-l4-depurar` va en `#parar`, porque `#movimientos` trata de limpiar, compactar, bifurcar y volver atrás. El error era del plan, que también corregí.
  - `m06-l6-reconciliar` va en `#independencia`, más cerca del caso OPP-1099.
  - `m06-l1-cuatro-capas`, `m01-l4-tres-verificaciones` y `m02-l1-objetivo` quedaban entre una frase que termina en «:» y su lista o tabla. Ahora van después.
- **Tu revisión del lote 2:** sin hallazgos. La tomé como confirmación.

**Verificación:** `npm test` 250/250 y E2E 164/164.


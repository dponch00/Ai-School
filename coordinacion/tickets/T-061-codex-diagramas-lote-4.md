# T-061 — Diagramas, lote 4 (M07 y M08) y revisión del lote 3

| Campo | Valor |
| --- | --- |
| Para | Codex |
| De | Claude Code |
| Estado | entregado |
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

_(Codex · 2026-11-03)_

### Parte 1 · Lote 4

- Dibujados nueve SVG de 480 unidades de ancho, con `title`, `desc`, fondo propio y rótulos del caso Altiplano: cinco para M07 (`m07-l1-peticion-respuesta` a `m07-l5-rag-consulta`) y cuatro para M08 (`m08-l1-flujo-agente`, `m08-l2-delegar`, `m08-l4-cuatro-preguntas` y `m08-l5-momentos-hook`). Todas las flechas unen dos elementos; se retiró un separador que podía leerse como conexión sin destino.
- Registrados con `reviewStatus: "pending"` en `content/courses/m07/assets.json` (nuevo) y `content/courses/m08/assets.json`.
- Capturas a 360 px: `design/qa/T-061/` (una por los nueve diagramas). Se revisaron también directamente en el lector a 360 px y a 1280 px.

### Parte 2 · Revisión de integración del lote 3 y figuras trasladadas

- [T061-01] Severidad: media
  Ubicación: lector de lecciones a 360 px; las ocho figuras de M05/M06 y `m01-l4-tres-verificaciones`, `m02-l1-objetivo`.
  Evidencia: en el lector real cada figura mide 282 px de ancho a viewport de 360 px, frente a 480 px en escritorio. El mínimo de 15 unidades del SVG se muestra a unas 8,8 px CSS; las capturas de los SVG aislados a 360 px sí son legibles, pero no representan ese ancho efectivo dentro del lector.
  Consecuencia: el texto de las figuras integradas queda demasiado pequeño para la lectura móvil que pide `design/diagramas/estilo.md`.
  Corrección recomendada: en el lector móvil, dar a `figure` el ancho disponible de la pantalla (u ocultar/replegar el elemento que estrecha la columna) antes de integrar los lotes siguientes; conservar el máximo de 480 px en escritorio.

- Verificado: los ocho SVG del lote 3 muestran sus casos y cifras correctamente. En particular, `m05-l4-depurar` dice «Más de dos correcciones: parar» y su vuelta une «Verificar» con «Reproducir»; `m06-l6-reconciliar` queda tras la explicación de independencia, junto al caso OPP-1099. Sus textos alternativos describen el mismo orden que los dibujos.
- Verificado: `m01-l4-tres-verificaciones` está después de los tres tipos de afirmación y antes de «Verificar en proporción al riesgo»; `m02-l1-objetivo` está después de la tabla de las cuatro preguntas. Ambos conservan contenido y texto alternativo coherentes. Ninguna de las diez figuras revisadas encaja mejor en otro apartado.

### Comprobación

- `node scripts/build-content.ts --check` — correcto: 10 cursos, 60 lecciones, 1.023 preguntas, 68 fichas.
- `npx vitest run src/domain` — correcto: 186/186 pruebas.
- Commit: `d62e78c` (se actualizará al enmendar esta anotación).

# T-056 — Revisión: «Qué es una API» (M01 L5), glosario de los diez manuales y panel lateral de relaciones

| Campo | Valor |
| --- | --- |
| Para | Codex |
| De | Claude Code |
| Estado | cerrado |
| Creado | 2026-10-30 |
| Depende de | T-055 (cerrado) |
| Fase del plan | Mantenimiento posterior a la V1 (pedido de Daniel) |

## Contexto

Daniel pidió dos cosas:
- Que M01 L5 explique bien qué es una API, porque la lección la usaba sin definirla.
- Que las definiciones y las referencias a otros manuales se abran en un panel lateral, sin salir de la lección, para recordar o anticipar ideas. En sus palabras: «volvamos inteligente el manual».

Lo hizo Claude Code, con cinco subagentes para el glosario y las marcas de los diez manuales. Tú revisas como autor independiente: lo escribió Claude, así que el autor no puede ser el único revisor (PROTOCOLO, revisión cruzada).

**Qué cambió** (commits `fe4a92b`, `5384f12` y `05369d8`):

1. **M01 L5:**
   - Una sección nueva, `#api` («Qué es una API»): la solicitud y la respuesta, el ejemplo de las 1 200 notas, y qué es la clave de API y cómo se cuida.
   - Un diagrama SVG nuevo, `content/courses/m01/diagrams/m01-l5-chat-api.svg`.
   - Una pregunta nueva, `m01-l5-c5`, un concepto erróneo nuevo, `m01-mc40`, y una línea más en el resumen.
   - Cuatro fuentes nuevas en `content/sources.json`. La investigación que las respalda está en `investigacion/M01-l5-api.md`.
2. **Glosario:** ahora hay un archivo por manual (`content/glossary/mNN.json`), con 150 términos en total; antes eran 25, todos de M02.
3. **Marcas en las lecciones** (las reglas están en `docs/relaciones.md`):
   - `:term[…]{id=g-…}`: 260 marcas.
   - `:ref[…]{to=mNN-lN#ancla}`: 216 referencias, que reemplazan a las menciones de texto plano «como viste en el manual N».
   - Una pasada final con script agregó 54 marcas de términos de otros manuales.
4. **Panel lateral** (`src/components/RelationPanel.tsx`):
   - **Qué abre:**
     - un término: su definición, dónde se explica y en qué otras lecciones aparece;
     - una referencia: el apartado completo, la decisión y el resumen de una lección, o las lecciones de un manual, con «Para recordar» o «Para anticipar»;
     - una cita: la fuente.
   - **Comportamiento:** las relaciones se encadenan, con ← para volver. «Atrás», Esc o un toque fuera lo cierran. «Ir a la lección» reemplaza la entrada del historial.
   - **Ancho:** 92 % en el celular, 50 % en la tableta táctil y un 45 % con topes en escritorio.

## Pedido

### Parte 1 · M01 L5 (contenido)

Revisa la sección `#api` y la pregunta `m01-l5-c5`, como en tus revisiones de lecciones:
1. **¿Se entiende qué es una API** para alguien que no programa, y conecta con lo que la lección dice después (pago, lotes, caché, política de datos)?
2. **Cada afirmación citada, ¿la sostiene su fuente?** Revisa sobre todo las de la clave de API: la investigación anota que no se pudo abrir un artículo de OpenAI.
3. **La pregunta:** la clave, que no repita el escenario del diagnóstico `dx-b5-02` ni el de M07 L2, y que el feedback sea de dos frases.
4. **El diagrama:** si es exacto y legible a 360 px, y si el texto alternativo dice lo mismo que el dibujo.

### Parte 2 · Glosario y marcas (muestra)

No hace falta revisar las 476 marcas. Revisa una muestra:
1. **Glosario:** lee los diez archivos `content/glossary/mNN.json`.
   - ¿Hay definiciones que digan algo que su lección no dice, que nombren productos o que dupliquen otro término?
   - Los subagentes señalaron estos pares para revisar: `g-caso-limite` y el viejo «caso borde», `g-servidor-herramientas` y `g-anfitrion-mcp`, y `g-alcance` y `g-alcance-permisos`.
2. **Referencias:** en M01, M05 y M09, ¿cada `:ref` apunta al apartado que trata esa idea? `python scripts/cross-refs.py` sigue listando las menciones a otros manuales; ahora llevan su marca.
3. **Destinos dudosos que anotaron los subagentes:**
   - en m03-l2 y m03-l1, los destinos elegidos entre varios apartados posibles;
   - en m09-l4, m09-lab y m06-lab, referencias que apuntan al manual completo porque el destino real es un laboratorio;
   - en m10-l6, la referencia a `m03-l4#probar`;
   - en m07-l5, m09-l1 y m10-l1, los `:ref` dentro de una `:::decision`;
   - las menciones a dos manuales, que quedaron partidas en dos enlaces de un solo número.
4. **Ruido:** ¿alguna lección quedó con demasiadas marcas o con marcas que distraen?

### Parte 3 · Panel lateral (experiencia de uso)

Recórrelo con `npm run dev` o `npm run preview`, en 360 px, en 768 px con emulación táctil y en escritorio, en modo claro y oscuro:
1. **Comportamiento:** la animación, el foco al abrir y al cerrar, «atrás» en el celular, Esc, la flecha ← y «Ir a la lección».
2. **Lectura:** el texto dentro del panel, las tablas y listas de un apartado completo, y los enlaces anidados.
3. **Distinguir las marcas:** ¿se distingue un término (subrayado de puntos) de una referencia (subrayado de rayas) y de un enlace normal?
4. **Lo que falta:** un apartado abierto en el panel no muestra sus figuras ni sus fichas de producto, solo el texto. Di si te parece aceptable.

Guarda las capturas en `design/qa/T-056/`.

## Entregables

- `investigacion/codex-revision-relaciones-api.md`, con los hallazgos numerados (T056-01…). Cada hallazgo lleva archivo y línea, gravedad (alta, media o baja) y la corrección propuesta.
- Las capturas en `design/qa/T-056/`.
- La sección **Entrega** de este ticket.

## Archivos permitidos

- `investigacion/codex-revision-relaciones-api.md` y `design/qa/T-056/**`
- La sección Entrega de este ticket y su campo Estado

No edites el contenido, la app ni `ESTADO.md`: Claude aplica los hallazgos. Haz commit con prefijo `[codex]` en `main`, sin push.

---

## Entrega

_(Codex, 2026-10-30)_

- Informe: `investigacion/codex-revision-relaciones-api.md`.
- Capturas de API, marcas y panel en 360 px, 768 px táctil, escritorio y oscuro: `design/qa/T-056/`.
- Resultado: tres hallazgos bajos (precisión de la regla de clave, formato del feedback y aviso de contenido visual omitido); fuentes, diagrama, glosarios, marcas, destinos y recorridos del panel verificados.
- Pruebas: `npm test` — 15 archivos, 250 pruebas aprobadas.

## Revisión

_(Claude Code, 2026-10-30)_

Apliqué los tres hallazgos:
- **T056-01:** M01 L5 y `g-clave-api` ahora dicen que la clave no se incrusta en el código ni se expone en el cliente, y que se carga en el servidor desde una variable de entorno o un gestor de secretos. Es el alcance exacto de las dos fuentes.
- **T056-02:** el feedback de la opción correcta de `m01-l5-c5` queda en dos frases.
- **T056-03:** cuando el apartado que se abre en el panel tiene una figura o una ficha, el panel avisa que se ven en la lección. No carga las imágenes en el panel.

**Verificación:** `npm test` 250/250 y E2E 162/162. Comprobé en el navegador que el aviso aparece en M01 L5 `#api`, que tiene diagrama.


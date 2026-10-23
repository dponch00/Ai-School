# T-025 — Revisión de M01: lecciones 4 a 6, sus preguntas y fichas

| Campo | Valor |
| --- | --- |
| Para | Codex |
| De | Claude Code |
| Estado | cerrado |
| Creado | 2026-10-23 |
| Depende de | T-024 (cerrado) |
| Fase del plan | 3 — Nueve manuales |

## Contexto

Con los hallazgos de T-024 aplicados, M01 tiene ahora sus seis lecciones. Faltan el banco de examen y el laboratorio como caso, que vienen en el siguiente ticket. Lo nuevo:

- **Lecciones 4 a 6** (`content/courses/m01/lessons/`), pasadas por el agente revisor de texto:
  - L4: respuestas convincentes y falsas.
  - L5: la economía real; calidad, costo, latencia y privacidad.
  - L6: comparar herramientas con una tarea fija.
- **18 preguntas nuevas** en `questions/checks.json`: 4 comprobaciones por lección y los repasos de L3, L4 y L5 (2 cada uno), que se muestran al empezar la lección siguiente. El banco de comprobaciones de M01 queda en 34.
- **4 conceptos erróneos nuevos** (`m01-mc32` a `m01-mc35`).
- **3 fichas nuevas:** `m01-pc-hallucination-guidance` (L4), y `m01-pc-api-prices` y `m01-pc-plans-data` (L5). L6 no tiene ficha.

Cifras de producto que conviene volver a abrir: los precios por token de las dos API, los niveles y valores por defecto del esfuerzo, los planes de Codex y de Copilot, el precio de Claude Pro, el promedio de unos USD 13 por desarrollador y día, y las políticas de datos por plan. En el caso resuelto de L5, el cuerpo da órdenes de magnitud («menos de un dólar», «unos 7», «unos 19») que salen de la ficha de precios. Ya recalculaste esos montos en T-021.

`npm test` 120/120.

## Pedido

1. **Fidelidad a las fuentes:** que cada `:cite[...]` diga lo que dice su fuente, sin ampliar el alcance. Prioriza:
   - L4: el mecanismo de las alucinaciones (Kalai et al.), el ejemplo de abstención, Kadavath, sycophancy, el 55 % y el 18 % de 2023, y el NIST AI 600-1.
   - L5: «ajustar el esfuerzo a menudo rinde más que cambiar de modelo»; lotes a la mitad; las siete veces más tokens del equipo de agentes; los tres casos de «local».
   - L6: no determinismo incluso con temperatura mínima; «el paso más importante es construir pruebas propias».
2. **Fichas:** verifica las cifras contra sus páginas y anota cualquier cambio desde el 2026-10-22.
3. **Preguntas:**
   - Clave única y defendible.
   - Distractores plausibles con su concepto erróneo bien asignado.
   - Explicación fiel al `sectionRef`.
   - Sin pistas de longitud ni de forma (en todo el banco de M01, la clave es la opción más larga en 9 de 34 y la más corta en 10).
   - Ningún escenario repetido del diagnóstico ni de M02. Atención a `m01-l5-c1` frente a `dx-b1-03`: los dos tratan de configurar un modelo con una muestra, pero se buscó que la decisión fuera otra, el esfuerzo antes que cambiar de modelo.
4. **Estilo y tiempo:** 25 minutos por lección, guía de estilo y ningún nombre de producto en el cuerpo.

## Entregables

- `investigacion/codex-revision-m01-l4-l6.md` con los hallazgos en el formato de PROTOCOLO §5, ordenados por severidad, y la lista de fuentes abiertas con su resultado.
- La sección **Entrega** de este ticket.

## Archivos permitidos

- `investigacion/codex-revision-m01-l4-l6.md` (nuevo)
- La sección Entrega de este ticket y su campo Estado

No edites `src/`, `content/`, `e2e/` ni `ESTADO.md`.

---

## Entrega

_(Codex · 2026-10-23)_

- Informe: `investigacion/codex-revision-m01-l4-l6.md`.
- Hallazgos: uno alto (el ejemplo de L6 recomienda una herramienta que falla un criterio crítico) y tres medios (límite de cinco horas generalizado, excepciones de privacidad omitidas y conclusión de comparación incompleta).
- Verificado: 39 fuentes abiertas; cifras de las tres fichas contrastadas sin cambios materiales desde 2026-10-22; 18 preguntas, referencias, escenarios, estilo y tiempo revisados; `npm test` 120/120.
- Siguiente acción: Claude corrige los hallazgos en `content/` y completa la sección Revisión.

## Revisión

**Claude Code · 2026-10-23 · Veredicto: aceptado, ticket cerrado.** Los 4 hallazgos son válidos y están aplicados:

- **T025-01 (alta):** el caso resuelto de L6 ya no recomienda A. Concluye que ninguna cumple los dos criterios críticos y que hay que ajustar la tarea (por ejemplo, pedir en el prompt que toda causa sin dato se marque como hipótesis) y repetir los ensayos. Explica además por qué elegir A convertiría a R2 en un criterio que se compensa. Se completó el resultado de B en R2 para que el caso no tenga huecos.
- **T025-02 (media):** `m01-pc-plans-data` ya no generaliza la ventana de cinco horas. Los límites dependen del plan, el modelo y la tarea, y Pro no tiene esa ventana.
- **T025-03 (media):** la ficha y L5 §datos mencionan las excepciones de las políticas: la valoración con pulgar en ChatGPT, la revisión por seguridad en Claude y la retroalimentación en los planes comerciales. La lección remite a leer la política del plan. Se ajustó la explicación de `m01-l5-r2`.
- **T025-04 (media):** la clave de `m01-l6-c3` (v2) dice tarea, entradas, versiones, fecha y cuándo repetir, y el escenario da esos datos. Los distractores se alargaron para que la clave no se delate por su longitud. En todo el banco, la clave es la opción más larga en 10 de 34.

`npm test` 120/120.

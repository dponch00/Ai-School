# T-056 — Revisión cruzada: API, relaciones y panel lateral

- **Revisor:** Codex
- **Fecha:** 2026-10-30
- **Alcance:** sección `#api` de M01 L5, `m01-l5-c5`, diagrama, los diez glosarios, marcas `:term`/`:ref` y el panel de relaciones. No se modificó contenido ni código.

## Resultado

La explicación de la API funciona para el público previsto: empieza por el intercambio visible (solicitud y respuesta), contrasta un chat con trabajo repetido y enlaza sin salto con precio, lotes, caché y política de datos. El diagrama reproduce exactamente ese contraste y su alternativa textual describe las dos vías y los cuatro campos de salida. Hay dos correcciones pequeñas de precisión/formato y una mejora de orientación para el panel.

## Hallazgos

- [T056-01] Severidad: baja
  Ubicación: `content/courses/m01/lessons/m01-l5.md:42`; `content/glossary/m01.json:16` (`g-clave-api`).
  Evidencia: la documentación de OpenAI pide no exponer la clave en código del cliente (navegador o app) y cargarla desde una variable de entorno o un gestor en el servidor. La de Anthropic pide un gestor de secretos, rotación y desactivar o borrar una clave filtrada. El texto actual dice, sin ese límite, «nunca dentro del código» y lo presenta como parte de ambas citas. La recomendación es buena, pero la formulación amplía el alcance exacto de la fuente y puede confundir una referencia a una variable de entorno en código de servidor con incrustar el secreto.
  Consecuencia: un alumno puede extraer una regla técnicamente más amplia que la respaldada y aplicar mal la distinción entre código de servidor y secreto incrustado.
  Corrección recomendada: sustituir en ambos lugares por «nunca la incrustes en el código ni la expongas en el cliente; cárgala en el servidor desde una variable de entorno o un gestor de secretos». Mantiene la regla práctica y coincide con las dos fuentes.

- [T056-02] Severidad: baja
  Ubicación: `content/courses/m01/questions/checks.json:1301` (`m01-l5-c5`, opción correcta).
  Evidencia: el ticket exige retroalimentación de dos frases; la opción correcta tiene tres: «Correcta.»; «Es un volumen…»; «Se paga…». La clave es única, los tres textos de opción tienen longitud comparable y el caso de clasificación semanal no repite la decisión de `dx-b5-02` (dónde guardar una clave) ni las comprobaciones de M07 L2 (autorización, alcance y token portador).
  Consecuencia: incumple una restricción editorial menor; no altera la decisión evaluada.
  Corrección recomendada: dejar dos frases: «Correcta: es un volumen repetido con las mismas instrucciones, justo lo que la API resuelve sin que nadie intervenga. Se paga por tokens y la clave se guarda como secreto.»

- [T056-03] Severidad: baja
  Ubicación: `src/components/RelationPanel.tsx:30-35, 122-128` (comportamiento observado; no modificado).
  Evidencia: al abrir un apartado, el panel extrae solo bloques HTML. Por diseño omite figuras y fichas de producto, pero no avisa que la vista es textual; la captura `design/qa/T-056/panel-ref-360-claro.png` muestra un apartado legible y completo en texto, mientras que una figura o ficha asociada solo aparece tras «Ir a la lección».
  Consecuencia: para recordar una regla basada en una figura, alguien puede creer que ya vio todo el apartado sin saber que omitió un apoyo visual. Para definiciones, decisiones y texto explicativo la omisión es aceptable: conserva la lectura breve y evita duplicar un bloque pesado.
  Corrección recomendada: solo cuando el destino contenga una figura o ficha, añadir antes del botón un aviso breve, por ejemplo «Este resumen no incluye la figura ni la ficha de la lección», y conservar «Ir a la lección». No cargaría las imágenes dentro del panel.

## Comprobaciones sin hallazgo

- **Fuentes y alcance.** Abrí las seis fuentes pertinentes. La guía de inicio de Anthropic documenta modelo, mensajes y variable de entorno; su guía de autenticación documenta clave estática por solicitud, identidad, gestor/rotación/desactivación; la guía de texto de OpenAI documenta `model`, `input` e `instructions`; su referencia confirma clave secreta, sin código cliente y variable/gestor en servidor; MDN confirma la analogía de solicitud/respuesta HTTP; las dos páginas de precios muestran columnas separadas de entrada y salida por millón de tokens. Salvo T056-01, las afirmaciones citadas de `#api` no amplían su fuente. La nota de investigación sobre el artículo de ayuda de OpenAI no se usa como respaldo en la lección.
- **Diagrama.** El SVG `m01-l5-chat-api.svg` es exacto: arriba persona ↔ chat ↔ modelo; abajo notas → script con clave → solicitud/respuesta → planilla. A 360 px se renderiza a 328 × 547 px, con texto legible, sin recorte ni solapamiento (`design/qa/T-056/api-diagrama-360-espera.png`). El `alt` de `assets.json:9` coincide con los dos flujos, las 1 200 notas y los cuatro campos.
- **Glosario.** Leí los diez JSON: 150 entradas, IDs únicos, ninguna definición supera 400 caracteres ni nombra proveedor/producto. `g-caso-limite` no duplica el viejo uso «caso borde»: lo normaliza; `g-servidor-herramientas` (M06) y `g-anfitrion-mcp` (M07) cubren capas distintas; `g-alcance` (alcance del encargo) y `g-alcance-permisos` (scope de token) no se solapan. Las definiciones revisadas remiten a secciones existentes.
- **Marcas y destinos.** El recorrido estático de los 71 Markdown de curso encontró 260 `:term` (todos con ID existente), 216 `:ref` y cero anclas rotas. La muestra de M01, M05 y M09 apunta a la sección que desarrolla la idea. Los destinos anotados como dudosos se sostienen: M03 L1/L2 apuntan a contexto y controles, M10 L6 a `m03-l4#probar`, y los laboratorios que solo pueden abrirse como manual llevan al manual correspondiente. Las referencias dentro de decisiones y los dos números separados se interpretan y se abren correctamente.
- **Panel lateral.** Probado localmente en 360 px claro y oscuro, 768 px con emulación táctil y 1280 px. El cajón ocupa respectivamente 92 %, 50 % y 45 % (576 px) sin corte; término = subrayado punteado y referencia = discontinuo, también distinguibles en oscuro (`design/qa/T-056/marcas-m01-l5-claro.png`). Al abrir, el foco llega a «Cerrar el panel»; Esc lo cierra y devuelve el foco al vínculo de origen; tocar fuera y Atrás cierran sin salir de la lección; la flecha ← recupera la relación previa; «Ir a la lección» llega al ancla de destino. La animación respeta `prefers-reduced-motion`.

## Fuentes abiertas

| Fuente | Resultado de la comprobación |
| --- | --- |
| [Anthropic · Get started](https://platform.claude.com/docs/en/get-started) | Confirma cuenta/clave, `ANTHROPIC_API_KEY`, modelo, mensajes y primera llamada. |
| [Anthropic · Authentication](https://platform.claude.com/docs/en/manage-claude/authentication) | Confirma secreto estático por petición, identidad, rotación, caducidad y desactivación. |
| [OpenAI · Text generation](https://developers.openai.com/api/docs/guides/text) | Confirma `model`, `input`, `instructions` y la respuesta de la API. |
| [OpenAI · API reference overview](https://developers.openai.com/api/reference/overview) | Confirma que la clave es secreta, no va al cliente y se carga en servidor. Base de T056-01. |
| [MDN · Client-server overview](https://developer.mozilla.org/en-US/docs/Learn_web_development/Extensions/Server-side/First_steps/Client-Server_overview) | Confirma el ciclo HTTP de solicitud/respuesta usado como analogía. |
| [Anthropic · Pricing](https://platform.claude.com/docs/en/about-claude/pricing) | Confirma precios de entrada/salida por MTok y caché. |
| [OpenAI · Pricing](https://developers.openai.com/api/docs/pricing) | Página oficial de precio actual, coherente con cobro por tokens citado por la sección. |

## Evidencia de ejecución

- `npm test`: 15 archivos y 250 pruebas aprobadas.
- Construcción de contenido previa a la prueba: 10 cursos, 60 lecciones, 1 023 preguntas y 68 fichas.
- Capturas: `design/qa/T-056/`.

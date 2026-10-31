# M01 · L5 — «Qué es una API» · Base de investigación

- **Archivo:** `investigacion/M01-l5-api.md`
- **Fecha de consulta:** 2026-10-30 (todas las fuentes nuevas abiertas ese día; las reutilizadas se volvieron a abrir el mismo día para confirmar que siguen sirviendo)
- **Elaborado por:** subagente de investigación (Claude Code) para la sección nueva de M01 lección 5.
- **Estado:** base factual, no es contenido para el alumno. Debe revisarla Codex antes de usarse (revisión cruzada, D-003).
- **Público:** alguien que no programa. La sección debe explicar el concepto, no enseñar a escribir código.
- **Convenciones:** `[src-…]` = ID del registro (§4), afirmación parafraseada de esa fuente. `[inferencia]` = síntesis propia que ninguna fuente dice tal cual. **Volátil** = depende de producto o versión; verificado el 2026-10-30. Como el resto de M01, nombres de modelo, cabeceras, precios y tipos de clave van a ficha fechada, no al cuerpo de la lección (D-007, D-019).
- **Datos:** ningún ejemplo de este archivo usa datos reales; si la lección necesita un caso, usar Altiplano Industrial S.A.

---

## 1. Resumen

1. **Una API de modelo es una puerta para programas, no para personas.** Un programa envía una solicitud HTTP al servicio del proveedor con el modelo elegido, las instrucciones y los mensajes, y recibe una respuesta estructurada (JSON) con el texto generado y el conteo de tokens usados. No hay ventana de chat: quien "conversa" es el programa [src-anthropic-get-started][src-anthropic-api-overview][src-openai-quickstart][src-openai-text-generation].
2. **La API no recuerda la conversación por sí sola** (al menos en la Messages API de Anthropic): el programa reenvía todo el historial en cada solicitud [src-anthropic-working-with-messages]. Es la diferencia más tangible con una app de chat, que guarda el hilo por ti [inferencia].
3. **Hace falta una clave de API**, que se crea en la consola del proveedor, identifica a la cuenta (o a una persona o cuenta de servicio dentro de la organización) y viaja en cada solicitud [src-anthropic-get-api-key][src-anthropic-authentication][src-openai-api-reference-overview].
4. **La clave es un secreto.** Ambos proveedores piden guardarla en una variable de entorno o un gestor de secretos, no compartirla y no ponerla en código que corre en el navegador o en una app móvil; Anthropic añade rotarla, ponerle caducidad y desactivarla si se sospecha una fuga [src-anthropic-authentication][src-anthropic-get-api-key][src-openai-api-reference-overview]. La regla de no subirla a repositorios está en el artículo de ayuda de OpenAI, que no se pudo abrir (ver §3, punto 2c) y ya está respaldada en el curso por `src-owasp-secrets-mgmt`.
5. **Se paga por uso, en tokens de entrada y de salida, con precios distintos.** `src-anthropic-pricing` y `src-openai-pricing` siguen sirviendo; la propia respuesta de la API informa los tokens consumidos [src-anthropic-pricing][src-openai-pricing][src-anthropic-get-started].

---

## 2. Matiz para el redactor [inferencia salvo donde se cita]

- **"Sin interfaz de chat" con un matiz:** la API en sí no tiene pantalla, pero la consola de Anthropic ofrece un *playground* para probar llamadas desde el navegador antes de programar [src-anthropic-api-overview]. Conviene decir «la API no es una app de chat; los proveedores dan una página de pruebas aparte».
- **"Nunca en el cliente" con un matiz:** Anthropic documenta un mecanismo (App Attest) para que apps de iOS y macOS llamen a la API sin llevar la clave dentro, usando credenciales de corta vida emitidas a instalaciones verificadas [src-anthropic-authentication]. No contradice la regla: la clave fija nunca va al cliente. Para el público de M01 basta la regla; el matiz pertenece a M07.
- **No fijar nombres de cabecera en la lección:** Anthropic hoy prefiere `Authorization: Bearer` y trata `x-api-key` como alternativa heredada [src-anthropic-api-overview][src-anthropic-authentication], mientras su propia guía de inicio sigue usando `x-api-key` en el ejemplo de cURL [src-anthropic-get-started]. Esto cambia por versión: ficha fechada o nada.
- **Coordinación con M07:** M07 L2 ya cubre secretos, OAuth y mínimo privilegio, y el diagnóstico `dx-b5-02` ya evalúa «clave en app estática». La sección de M01 debe quedarse en el concepto (qué es la clave y por qué es secreta) y no repetir ese escenario en preguntas.

---

## 3. Afirmaciones y respaldo

### 3.1 Qué es y cómo se usa una API de modelo

| # | Afirmación (parafraseada) | Fuente | Volátil |
| --- | --- | --- | --- |
| 1a | La API de Claude es una API REST que da acceso programático a los modelos; requiere una cuenta en la consola y una clave. | [src-anthropic-api-overview] | Media |
| 1b | La primera llamada es una solicitud `POST` a la Messages API que indica el modelo, un tope de tokens de salida y una lista de mensajes con su rol; la respuesta es un JSON con el mensaje del asistente, el motivo de parada y el uso de tokens de entrada y salida. | [src-anthropic-get-started] | Alta (nombres de modelo y versión) |
| 1c | Las instrucciones generales van en un campo `system` aparte de los mensajes. | [src-anthropic-working-with-messages] | Media |
| 1d | La Messages API no guarda estado: el programa envía el historial completo en cada llamada. | [src-anthropic-working-with-messages] | Media |
| 1e | En OpenAI, el inicio rápido usa la Responses API: el programa crea un cliente, llama indicando `model` e `input` y lee el texto generado de la respuesta. | [src-openai-quickstart] | Alta |
| 1f | La Responses API acepta un parámetro `instructions` con pautas de alto nivel que tienen prioridad sobre el `input`; la entrada puede ser texto o una lista de mensajes con roles; la respuesta trae un arreglo `output` con los elementos generados. | [src-openai-text-generation] | Alta |
| 1g | Se puede usar una biblioteca oficial o llamar a la API HTTP desde cualquier entorno capaz de hacer solicitudes HTTP. | [src-openai-api-reference-overview] | Baja |
| 1h | Para alguien que no programa: la API es la vía por la que una aplicación (una hoja de cálculo con macros, un bot, un sistema interno) usa el modelo sin que una persona escriba en un chat. | [inferencia] | — |

### 3.2 La clave de API

| # | Afirmación (parafraseada) | Fuente | Volátil |
| --- | --- | --- | --- |
| 2a | La clave se crea en la página de claves de la consola; se muestra completa una sola vez y, si se pierde, hay que crear otra. | [src-anthropic-get-api-key] | Media |
| 2b | Una clave actúa como una identidad: una clave personal actúa como su dueño, con sus permisos; una de cuenta de servicio, como esa cuenta. Cada solicitud se ejecuta como esa identidad y la clave deja de funcionar cuando la identidad sale de la organización. | [src-anthropic-authentication][src-anthropic-get-api-key] | Alta (tipos de clave) |
| 2c | La clave se usa poniéndola en la variable de entorno `ANTHROPIC_API_KEY` (los SDK la leen solos) o en la cabecera de autorización de la solicitud. En OpenAI, la variable es `OPENAI_API_KEY`. | [src-anthropic-get-api-key][src-openai-quickstart] | Media |
| 2d | Anthropic recomienda guardar las claves en un gestor de secretos, rotarlas periódicamente, fijar caducidad para limitar el daño de una fuga y desactivar o borrar cualquier clave sospechosa. Aclara que la caducidad no sustituye la higiene de secretos. | [src-anthropic-authentication] | Media |
| 2e | OpenAI declara que la clave es secreta, pide no compartirla ni exponerla en código del lado del cliente (navegadores, apps), guardarla en el servidor y cargarla desde una variable de entorno o un servicio de gestión de claves. | [src-openai-api-reference-overview] | Baja |
| 2f | Una clave revocada en OpenAI deja de funcionar en segundos. | [src-openai-api-reference-overview] | Media |
| 2g | Recomendaciones adicionales de OpenAI (una clave por persona, no subirla a repositorios, vigilar el uso y rotar si hay fuga): **no verificadas en la página**. El artículo de ayuda `help.openai.com/en/articles/5112595` devolvió HTTP 403 a la herramienta de lectura (dos URL probadas); solo se vio el resumen del buscador. No se propone para `content/sources.json` hasta que alguien lo abra en un navegador. «No subir claves a repositorios» ya está respaldado por `src-owasp-secrets-mgmt` (existente). | — (pendiente) | — |
| 2h | Quien tiene la clave puede gastar a cargo de la cuenta; por eso una fuga es un problema de dinero, no solo de seguridad. | [inferencia] a partir de 2b y 3a | — |

### 3.3 Cobro por tokens

| # | Afirmación (parafraseada) | Fuente | Volátil |
| --- | --- | --- | --- |
| 3a | Anthropic publica el precio por millón de tokens, con columnas separadas para tokens de entrada y de salida; la salida cuesta más. | [src-anthropic-pricing] (existente; reabierta el 2026-10-30, sigue sirviendo) | Muy alta |
| 3b | OpenAI publica precios por millón de tokens, con entrada y salida en columnas separadas; la salida cuesta más en todas las filas cobradas por token (algunos productos se cobran por carácter, minuto o llamada). | [src-openai-pricing] (existente; reabierta el 2026-10-30, sigue sirviendo) | Muy alta |
| 3c | Cada respuesta de la Messages API trae el número de tokens de entrada y de salida que consumió. | [src-anthropic-get-started][src-anthropic-working-with-messages] | Baja |

**Sugerencia:** no hace falta tocar `supports` de las dos fuentes de precios para esta sección; ya cubren «precio por modelo». Si se quiere explícito, se podría añadir la frase «Precio por millón de tokens, separado en entrada y salida» a ambas (decisión del coordinador; este subagente no edita `content/sources.json`).

### 3.4 Cliente y servidor

| # | Afirmación (parafraseada) | Fuente | Volátil |
| --- | --- | --- | --- |
| 4a | El cliente envía una solicitud HTTP con URL, método, cabeceras y, a veces, un cuerpo; el servidor contesta con un código de estado, cabeceras y un cuerpo. | [src-mdn-client-server] (existente; reabierta el 2026-10-30, última modificación 2026-09-10, sigue sirviendo) | Baja |
| 4b | Llamar a una API de modelo es el mismo intercambio: tu programa hace de cliente y el servicio del proveedor de servidor; la diferencia es que el cuerpo de la solicitud y de la respuesta es JSON en vez de una página web. | [inferencia] a partir de 4a, 1b y 1g | — |

**Sugerencia:** `src-mdn-client-server` sirve tal cual. Su `supports` actual habla de navegador y servidor; si se cita para L5, se podría añadir «Solicitud HTTP con método, cabeceras y cuerpo; respuesta con código de estado y cuerpo».

---

## 4. Registro de fuentes

| ID | Título | URL | Organización | Consulta | Afirmaciones | Volatilidad | Kind | Próxima revisión |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| src-anthropic-get-started | Get started with Claude | https://platform.claude.com/docs/en/get-started | Anthropic | 2026-10-30 | 1b, 3c | high | primary | 2027-01-30 |
| src-anthropic-working-with-messages | Using the Messages API | https://platform.claude.com/docs/en/build-with-claude/working-with-messages | Anthropic | 2026-10-30 | 1c, 1d, 3c | high | primary | 2027-01-30 |
| src-anthropic-api-overview | API overview | https://platform.claude.com/docs/en/api/overview | Anthropic | 2026-10-30 | 1a, matiz del playground, matiz de cabeceras | high | primary | 2027-01-30 |
| src-anthropic-get-api-key | Get your Claude API key | https://platform.claude.com/docs/en/get-api-key | Anthropic | 2026-10-30 | 2a, 2b, 2c | high | primary | 2027-01-30 |
| src-anthropic-authentication | Authentication | https://platform.claude.com/docs/en/manage-claude/authentication | Anthropic | 2026-10-30 | 2b, 2d, matiz App Attest, matiz de cabeceras | high | primary | 2027-01-30 |
| src-openai-quickstart | Developer quickstart | https://developers.openai.com/api/docs/quickstart | OpenAI | 2026-10-30 | 1e, 2c | high | primary | 2027-01-30 |
| src-openai-text-generation | Text generation | https://developers.openai.com/api/docs/guides/text | OpenAI | 2026-10-30 | 1f | high | primary | 2027-01-30 |
| src-openai-api-reference-overview | API Overview (API reference) | https://developers.openai.com/api/reference/overview | OpenAI | 2026-10-30 | 1g, 2e, 2f | medium | primary | 2027-04-30 |
| *(pendiente, no proponer)* | Best Practices for API Key Safety | https://help.openai.com/en/articles/5112595-best-practices-for-api-key-safety | OpenAI | 2026-10-30, **no abierta** (HTTP 403) | 2g | — | primary | Abrir en navegador antes de citar |
| src-anthropic-pricing *(existente)* | Pricing | https://platform.claude.com/docs/en/about-claude/pricing | Anthropic | Reabierta 2026-10-30 | 3a | very-high | primary | 2027-01-22 (sin cambios) |
| src-openai-pricing *(existente)* | Pricing | https://developers.openai.com/api/docs/pricing | OpenAI | Reabierta 2026-10-30 | 3b | very-high | primary | 2027-01-22 (sin cambios) |
| src-mdn-client-server *(existente)* | Client-Server overview | https://developer.mozilla.org/en-US/docs/Learn_web_development/Extensions/Server-side/First_steps/Client-Server_overview | Mozilla (MDN) | Reabierta 2026-10-30 | 4a | low | secondary | 2027-10-23 (sin cambios) |

**Cita textual usada (una, menos de 15 palabras):** la referencia de OpenAI recuerda al lector que su clave «is a secret» [src-openai-api-reference-overview]. Todo lo demás está parafraseado.

**Comprobación de duplicados:** se buscaron en `content/sources.json` las URL y los ID propuestos; ninguno existe. Ninguna fuente actual cubre la guía de inicio, la autenticación ni las claves de API de ningún proveedor.

---

## 5. Objetos propuestos para `content/sources.json`

Solo fuentes nuevas y abiertas. Volatilidad según el enum `Volatility` de `src/domain/content.ts` (`low`, `medium`, `high`, `very-high`). No se incluye el artículo de ayuda de OpenAI (no se pudo abrir).

```json
[
  {
    "id": "src-anthropic-get-started",
    "title": "Get started with Claude",
    "organization": "Anthropic",
    "url": "https://platform.claude.com/docs/en/get-started",
    "accessedAt": "2026-10-30",
    "supports": [
      "La primera llamada es un POST a la Messages API con modelo, tope de tokens y mensajes con rol",
      "La respuesta es un JSON con el mensaje del asistente, el motivo de parada y los tokens de entrada y salida",
      "La clave se exporta como variable de entorno ANTHROPIC_API_KEY antes de llamar"
    ],
    "kind": "primary",
    "volatility": "high",
    "nextReview": "2027-01-30"
  },
  {
    "id": "src-anthropic-working-with-messages",
    "title": "Using the Messages API",
    "organization": "Anthropic",
    "url": "https://platform.claude.com/docs/en/build-with-claude/working-with-messages",
    "accessedAt": "2026-10-30",
    "supports": [
      "La Messages API no guarda estado: el programa reenvía el historial completo en cada llamada",
      "Las instrucciones generales van en el campo system, aparte de los mensajes",
      "Cada respuesta informa los tokens de entrada y de salida consumidos"
    ],
    "kind": "primary",
    "volatility": "high",
    "nextReview": "2027-01-30"
  },
  {
    "id": "src-anthropic-api-overview",
    "title": "API overview",
    "organization": "Anthropic",
    "url": "https://platform.claude.com/docs/en/api/overview",
    "accessedAt": "2026-10-30",
    "supports": [
      "La API de Claude es una API REST de acceso programático a los modelos",
      "Para usarla hacen falta una cuenta en la consola y una clave de API",
      "La consola ofrece un playground para probar la API en el navegador antes de crear claves",
      "La cabecera Authorization Bearer es la vía principal; x-api-key queda como alternativa heredada"
    ],
    "kind": "primary",
    "volatility": "high",
    "nextReview": "2027-01-30"
  },
  {
    "id": "src-anthropic-get-api-key",
    "title": "Get your Claude API key",
    "organization": "Anthropic",
    "url": "https://platform.claude.com/docs/en/get-api-key",
    "accessedAt": "2026-10-30",
    "supports": [
      "La clave se crea en la página de claves de la consola y se muestra completa una sola vez",
      "Si se pierde una clave no se puede volver a ver: hay que crear otra",
      "Guardarla en un lugar seguro, como un gestor de secretos, y usarla desde la variable ANTHROPIC_API_KEY",
      "Clave personal para desarrollo propio; clave de cuenta de servicio para lo compartido"
    ],
    "kind": "primary",
    "volatility": "high",
    "nextReview": "2027-01-30"
  },
  {
    "id": "src-anthropic-authentication",
    "title": "Authentication",
    "organization": "Anthropic",
    "url": "https://platform.claude.com/docs/en/manage-claude/authentication",
    "accessedAt": "2026-10-30",
    "supports": [
      "La clave de API es un secreto fijo que viaja en cada solicitud y actúa como una identidad de la organización",
      "Guardar las claves en un gestor de secretos, rotarlas y desactivar o borrar cualquier clave sospechosa de fuga",
      "La caducidad limita cuánto dura una clave filtrada, pero no sustituye la higiene de secretos",
      "Apps de iOS y macOS pueden llamar a la API con credenciales de corta vida sin llevar la clave dentro"
    ],
    "kind": "primary",
    "volatility": "high",
    "nextReview": "2027-01-30"
  },
  {
    "id": "src-openai-quickstart",
    "title": "Developer quickstart",
    "organization": "OpenAI",
    "url": "https://developers.openai.com/api/docs/quickstart",
    "accessedAt": "2026-10-30",
    "supports": [
      "La clave se crea en el panel y se exporta como variable de entorno OPENAI_API_KEY",
      "La primera solicitud usa la Responses API indicando model e input",
      "El programa lee el texto generado de la respuesta"
    ],
    "kind": "primary",
    "volatility": "high",
    "nextReview": "2027-01-30"
  },
  {
    "id": "src-openai-text-generation",
    "title": "Text generation",
    "organization": "OpenAI",
    "url": "https://developers.openai.com/api/docs/guides/text",
    "accessedAt": "2026-10-30",
    "supports": [
      "La Responses API recibe model, input y un parámetro opcional instructions con prioridad sobre el input",
      "La entrada puede ser texto o una lista de mensajes con roles developer, user y assistant",
      "La respuesta trae un arreglo output con los elementos generados"
    ],
    "kind": "primary",
    "volatility": "high",
    "nextReview": "2027-01-30"
  },
  {
    "id": "src-openai-api-reference-overview",
    "title": "API Overview (API reference)",
    "organization": "OpenAI",
    "url": "https://developers.openai.com/api/reference/overview",
    "accessedAt": "2026-10-30",
    "supports": [
      "La clave de API es secreta: no compartirla ni exponerla en código de navegador o apps",
      "Guardar la clave en el servidor y cargarla desde una variable de entorno o un servicio de gestión de claves",
      "La credencial viaja en la cabecera Authorization como Bearer",
      "Se puede llamar a la API HTTP desde cualquier entorno capaz de hacer solicitudes HTTP"
    ],
    "kind": "primary",
    "volatility": "medium",
    "nextReview": "2027-04-30"
  }
]
```

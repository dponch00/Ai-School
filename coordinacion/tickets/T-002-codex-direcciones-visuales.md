# T-002 — Tres direcciones visuales para que Daniel elija

| Campo | Valor |
| --- | --- |
| Para | Codex |
| De | Claude Code |
| Estado | entregado |
| Creado | 2026-10-21 |
| Depende de | — (puede hacerse junto con T-001) |
| Fase del plan | 0 → 1 (sistema visual del piloto) |

## Contexto

El plan (§6 y §7) pide una estética **editorial limpia, profesional y cálida**, pensada para lectura prolongada, con imágenes originales de una misma familia visual. Antes de hacer los activos piloto (imagen principal, portada M02, ilustración de una especificación bien definida), Daniel necesita ver opciones reales y elegir una.

**Quién la usa:** Daniel, profesional de finanzas, nivel intermedio-alto en IA aplicada. Lee en escritorio (índice lateral) y en celular (Chrome Android, 360 px de ancho). Sesiones de 20–30 minutos de lectura más laboratorios.

**Qué debe transmitir:** criterio, claridad y oficio; sentir que se aprende algo serio sin que sea frío. La app tiene diez manuales: herramientas y límites, prompting y especificaciones, contexto, código y Git, desarrollo con agentes, datos y arquitectura, APIs/MCP, agentes y automatización, evaluación y confiabilidad, de prototipo a producto.

**Evitar los clichés de "IA":** cerebros brillantes, robots, circuitos, hologramas azules, manos humanas tocando manos robóticas, neón sobre negro.

Lee: `AGENTS.md`, `coordinacion/PROTOCOLO.md` §6, `plan.md` §6 y §7.

## Pedido

Propón **tres direcciones visuales realmente distintas** (no cambios de color de una misma idea). Para cada una:

1. **Nombre y concepto** (2–3 líneas) y por qué ayuda a aprender.
2. **Paleta** en tokens para modo claro: `bg`, `surface`, `text`, `text-muted`, `accent`, `accent-ink` (texto sobre acento), `border`, `success`, `warning`, `danger`, `info`. Hex de cada uno y **razón de contraste calculada** (no estimada) para cada par de texto/fondo. Objetivo WCAG 2.2 AA: 4.5:1 texto normal, 3:1 texto grande y componentes de interfaz. Opcional: propuesta de modo oscuro.
3. **Tipografía:** lectura, títulos y monoespaciada para código. Fuentes con licencia libre (OFL o similar) que se puedan alojar en la app (sin CDN en producción), con soporte completo de español (á, é, ñ, ü, ¿, ¡).
4. **Estilo de ilustración:** técnica, nivel de abstracción, luz, textura y reglas que mantengan coherencia en 10 portadas y hasta 6 ilustraciones conceptuales.
5. **Imagen de prueba generada de verdad** con tu herramienta de imagen: concepto de **imagen principal de la academia**, 16:9, sin texto. Guarda variantes en `design/images/raw/T-002/` y la elegida de cada dirección en `design/direcciones/<id>/`. Registra el prompt exacto y la herramienta/modelo tal como el entorno lo reporta.
6. **Deseable:** una segunda imagen de prueba en la misma dirección — **portada M02**: una solicitud difusa que se transforma en instrucciones ordenadas y criterios verificables (ver el prompt de ejemplo del plan §7). Sirve para ver si el sistema escala a las portadas.
7. **Riesgos** de la dirección (legibilidad, envejecimiento, dificultad para mantener coherencia).

Y una **comparativa visual**: `design/direcciones/comparativa.html`, autocontenida, que muestre las tres direcciones lado a lado con sus imágenes, paletas, tipografías y una muestra de página de lección (título, párrafo largo, bloque de código, una pregunta con cuatro opciones y un aviso). Para esta comparativa puedes cargar fuentes desde Google Fonts; en producción se alojarán localmente.

**Opcional:** 3–5 ideas de nombre para la academia que encajen con cada dirección (el nombre está por definirse).

## Entregables

- `design/direcciones/D1-<slug>/`, `D2-<slug>/`, `D3-<slug>/`, cada una con `README.md` (puntos 1–4 y 7), imágenes elegidas y prompts.
- `design/direcciones/comparativa.html`
- Variantes en `design/images/raw/T-002/` (fuera de git).

## Criterios de aceptación

- [ ] Las tres direcciones se distinguen a simple vista en concepto, color, tipografía e ilustración.
- [ ] Cada dirección tiene al menos una imagen generada de verdad, con prompt exacto y herramienta reportada. Si no puedes generar imágenes, marca el ticket como `bloqueado` y entrega lo demás; no uses placeholders presentados como resultado.
- [ ] Ninguna imagen contiene texto, números, logos de proveedores ni personas reales.
- [ ] Todas las razones de contraste están calculadas y los pares de texto cumplen AA (o se marca cuál no y por qué).
- [ ] `comparativa.html` se abre localmente y se lee bien a 360 px sin desplazamiento horizontal.

## Archivos permitidos

- `design/direcciones/**` (nuevo)
- `design/images/raw/T-002/**` (nuevo)
- Sección Entrega de este ticket
- Tu fila de tickets en `ESTADO.md`

## Fuera de alcance

Activos finales, iconos de instalación, `docs/design-system.md` (se escribe cuando Daniel elija) y código de la app.

---

## Entrega

**Fecha:** 2026-10-21.

- **Qué hice:** tres direcciones distintas: D1, collage editorial de rutas; D2, bodegón escultórico de módulos; D3, fotografía de archivo físico. Generé para cada una una imagen principal y una portada M02. Documenté concepto, paleta, tipografía, reglas de ilustración, riesgos y los seis prompts exactos. La comparativa incluye las seis imágenes, paletas, muestras tipográficas y la misma lección con párrafo, código, pregunta de cuatro opciones y aviso.
- **Archivos:** [`design/direcciones/comparativa.html`](../../design/direcciones/comparativa.html) (imágenes incrustadas), [`D1-atlas-de-criterio/`](../../design/direcciones/D1-atlas-de-criterio/), [`D2-taller-modular/`](../../design/direcciones/D2-taller-modular/), [`D3-archivo-vivo/`](../../design/direcciones/D3-archivo-vivo/). Los seis candidatos se copiaron a `design/images/raw/T-002/`, ruta ignorada por git. Los seis elegidos sí se versionan en sus direcciones.
- **Cómo lo verifiqué (contraste, 360 px):** inspeccioné visualmente cada imagen: no observé texto, cifras, logos ni personas. Confirmé 1672 × 941 px por archivo (razón 1.7768, aproximación entera de 16:9). Calculé las razones con la fórmula sRGB de [WCAG 2.2](https://www.w3.org/TR/WCAG22/): el mínimo de texto usado sobre fondo/superficie es 4.85:1 (D1), 5.33:1 (D2) y 5.42:1 (D3); el mínimo de contornos funcionales es 3.25:1, 3.21:1 y 3.30:1. Un verificador estático comprobó las tres columnas, seis imágenes incrustadas con texto alternativo, `viewport`, una columna bajo 700 px, contenedores con `min-width:0` y desplazamiento **interno** del bloque de código. **No pude comprobar en navegador** la ausencia real de desplazamiento horizontal a 360 px: la herramienta de navegador rechazó la URL `file://` por política de seguridad y prohibió vías alternativas para esa misma acción. Queda como prueba manual pendiente; no la marco superada.
- **Herramientas/modelos usados (tal como los reporta el entorno):** generador integrado `image_gen.imagegen`; el entorno **no expone el nombre del modelo**. Python/Pillow 12.3.0 se usó solo para reducir copias incrustadas en el HTML; los PNG elegidos no se editaron. PowerShell y un verificador Python comprobaron archivos y contrastes.
- **Limitaciones o bloqueos:** prueba visual real a 360 px pendiente por la política del navegador. La comparativa contiene imágenes y CSS dentro del HTML; Google Fonts se carga solo como mejora de la muestra, con fuentes alternativas locales si no hay conexión. En producción habría que alojar las fuentes OFL localmente y repetir la prueba con los archivos elegidos.
- **Recomendación de Codex (cuál elegirías y por qué):** **D1, Atlas de criterio**. Es la más reconocible y cálida; la metáfora de caminos sirve al currículo y puede variar entre diez portadas sin confundirla con arquitectura técnica exacta. Mantendría su papel recortado, pero usaría los diagramas de SVG/código para explicar relaciones precisas.
- **Preguntas abiertas:** Daniel elige dirección visual. En la revisión, abrir `comparativa.html` a 360 px reales y registrar si hay desplazamiento horizontal o problemas de lectura; Claude revisa si las portadas aportan orientación pedagógica y el texto alternativo.

## Revisión

_(La llena Claude Code; Daniel elige la dirección.)_

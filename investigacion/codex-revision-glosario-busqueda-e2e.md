# Revisión independiente — Glosario, búsqueda, notas y E2E de M02

**Ticket:** T-020  
**Fecha:** 2026-10-22  
**Revisor:** Codex

## Alcance y método

Revisé las 22 entradas de `content/glossary.json` contra los apartados indicados en cada `ref`, las lecciones de M02 y sus fuentes ya registradas. Las definiciones son paráfrasis fieles: no encontré una afirmación técnica nueva ni una cita cuyo alcance se hubiera ampliado. También cumplen, en general, la guía de estilo: explican el término con una frase completa, usan español claro y aclaran los anglicismos que conservan.

Probé la app compilada en escritorio y a 360 px. `reconciliación` y `reconciliacion`, `supuestos` y `output contract` devuelven resultados útiles; la búsqueda conserva el enlace al apartado y los fragmentos se entienden. En las notas, el texto de privacidad se entiende, el marcador se puede cambiar con `Espacio`, la nota se guarda con `Enter` y ambos aparecen en `#/notas` sin desborde a 360 px.

## Hallazgos

### Media

- [T020-01] Severidad: media
  Ubicación: `src/search/index.ts:18-31`; `src/search/index.test.ts:26-31`
  Evidencia: La configuración declara `fuzzy: 0.2` y la prueba se titula «tolera ... errores pequeños», pero en la interfaz `invariabte` (transposición de `an`) e `invariantte` (una letra de más) muestran «Sin resultados». La sustitución `evidensia` sí encuentra `Evidencia`, por lo que la suite cubre solo una clase de error y permite el problema.
  Consecuencia: Una errata común en un término que se busca para comprender la lección impide llegar a la explicación, pese a la expectativa que comunica el producto.
  Corrección recomendada: Definir qué errores de una palabra se prometen y conservar también tokens sin stem para la búsqueda difusa, o ajustar la transformación y el umbral para admitir inserciones y transposiciones de términos largos. Añadir casos de interfaz para `invariabte` e `invariantte`, además de la sustitución ya cubierta.

- [T020-02] Severidad: media
  Ubicación: `content/glossary.json`; `content/courses/m02/lessons/m02-l6.md` (reconciliación)
  Evidencia: El glosario tiene 22 términos y define «Reporte final» usando «la reconciliación», pero no ofrece una entrada para ese concepto. Es central al cierre del laboratorio, las lecciones y las preguntas; una búsqueda de `reconciliación` encuentra apartados, aunque no una definición breve. «Ambigüedad» y «prompt» también aparecen como vocabulario recurrente sin una entrada propia.
  Consecuencia: El lector que desconoce la palabra no dispone de la explicación corta que espera del glosario y debe deducirla de resultados extensos.
  Corrección recomendada: Añadir al menos «Reconciliación», con enlaces al apartado de L6 que explica cómo contrastar las cifras. Evaluar «Ambigüedad» y «prompt» con el mismo criterio de frecuencia y necesidad para un lector nuevo; cada nueva entrada debe enlazar al apartado que ya la explica.

- [T020-03] Severidad: media
  Ubicación: `e2e/flujos.spec.ts:59-67`
  Evidencia: El flujo crea una nota y un marcador y confirma que aparecen en «Mis notas», pero nunca genera un reporte ni comprueba que el texto distintivo de la nota esté ausente de HTML, Markdown y JSON. La promesa «no entra en los reportes» es una propiedad de privacidad, no solo una etiqueta de interfaz.
  Consecuencia: Una regresión que incluya notas privadas en una exportación de evaluación pasaría las pruebas E2E actuales.
  Corrección recomendada: Tras guardar una nota con un texto sintético único, generar el reporte de evaluación y comprobar que no aparece en ninguna de sus tres representaciones. Incluir también un ciclo de respaldo/restauración para confirmar que las notas y marcadores persisten solo donde se promete.

### Baja

- [T020-04] Severidad: baja
  Ubicación: `e2e/rutas.spec.ts:19-32`; `e2e/flujos.spec.ts:49-56`
  Evidencia: Las rutas con `?q=invariante` y `?termino=g-invariante` solo exigen que exista un `h1`, que axe no encuentre violaciones y que no haya desborde. La única prueba de búsqueda abre un resultado de lección; no comprueba el resultado del glosario, el foco en el término solicitado ni sus enlaces de referencia.
  Consecuencia: Una regresión que ignore los parámetros, deje el glosario vacío o rompa sus referencias podría seguir dejando una página con título y superar estas comprobaciones.
  Corrección recomendada: Afirmar en E2E que la búsqueda presenta el término del glosario y que su enlace abre `#/glosario?termino=…`; allí comprobar que el término objetivo recibe el foco y que cada referencia lleva al apartado correspondiente.

## Cobertura y revisión manual de accesibilidad

La suite cubre 16 rutas en escritorio y móvil, y cinco flujos principales en ambos tamaños. Vi los 42 casos completar como correctos después de instalar el Chromium que requería Playwright. Axe y la comprobación de desborde son una base útil, pero no sustituyen estas revisiones manuales:

- Orden de tabulación, foco visible y retorno de foco al abrir enlaces de búsqueda y referencias del glosario.
- Anuncio por lector de pantalla del conteo de resultados, del guardado de una nota y del estado del marcador.
- Reflujo y legibilidad con zoom de texto al 200 %, colores forzados y preferencias de alto contraste.
- Tamaño y separación de los objetivos táctiles en un teléfono real, incluida la zona del marcador y los enlaces consecutivos de referencias.

## Validación ejecutada

- `npm test`: 14 archivos y 154 pruebas correctas.
- `npm run e2e`: 42 recorridos de Playwright (escritorio y 360 px) completados correctamente. Fue necesario instalar el Chromium de Playwright; la primera ejecución no pudo iniciar por faltar ese binario.
- `npm run build`: correcto; generó la PWA y su service worker. Vite conserva la advertencia existente por un chunk de más de 500 kB.

# AI School · Candidata de entrega V1

> Fecha: 2026-10-27. Preparado por Claude Code para la fase 4 (F4-09). Este documento resume qué se entrega, con qué evidencia y con qué límites. No reemplaza a `ESTADO.md`, que sigue siendo el tablero vivo.

## Qué se entrega

- **La app:** una PWA instalable, publicada en https://dponch00.github.io/Ai-School/ (D-029). Funciona sin conexión desde la primera carga, porque el service worker guarda la app y los diez manuales. El progreso queda solo en el dispositivo y se puede respaldar en un archivo.
- **El contenido:**

| Pieza | Cantidad |
| --- | --: |
| Manuales | 10 |
| Lecciones | 60 |
| Preguntas (comprobaciones, examen, práctica y laboratorio) | 1 022 |
| Laboratorios como caso, de 12 preguntas cada uno | 10 |
| Fichas de producto fechadas | 68 |
| Conceptos erróneos ligados a distractores | 683 |
| Fuentes registradas | 355 |
| Ítems del diagnóstico inicial | 24 |

- **El código fuente y su lockfile:** el repositorio público `dponch00/Ai-School`. Las instrucciones para correrlo, probarlo y publicarlo están en `README.md`; el flujo de publicación, en `.github/workflows/deploy.yml`.

## Evidencia

| Qué | Cómo se comprobó | Resultado |
| --- | --- | --- |
| Contratos del contenido | `npm test`: esquemas, referencias cruzadas, anclas, citas, fichas, conceptos erróneos, longitudes y posición de las claves, feedback de dos frases, familias del examen | 247/247 |
| Rutas y flujos | `npm run e2e`: axe (WCAG 2.2 A/AA), sin desborde horizontal, flujos de lección, examen, laboratorio, búsqueda, notas, subrayados, respaldo y modo sin conexión, en perfiles de celular y escritorio | 158/158 |
| Letra grande | Las 90 rutas de los diez manuales a 320 px, y con la letra al 200 % a 360 px (F4-05); seis rutas quedaron como E2E | Sin desborde |
| Revisión independiente | Codex revisó cada manual en tres tandas, y después todo junto (T-050, T-051) | Hallazgos aplicados y tickets cerrados (T-001 a T-051) |
| Referencias entre manuales | `scripts/cross-refs.py` y verificación de Codex (T-050) | 110/110 correctas |
| Inferencias declaradas | D-028 aplicada en los diez manuales; en M01 a M05, hacia atrás (F4-04, T-051) | 20 preguntas marcadas en M01 a M05 |
| Publicación | Cada push a `main` corre el contenido, las pruebas y la compilación; si algo falla, no publica (D-029) | En uso desde el 2026-10-26 |
| Instalación | Daniel la instaló en su celular y la usa sin wifi | Confirmado el 2026-10-27 |

## Límites conocidos

**Lo que no se comprobó, o se comprobó solo en parte:**
- **Lectores de pantalla y teclado.** Las pruebas automáticas de axe pasan en todas las rutas probadas, y los E2E responden una comprobación con teclado. No hubo un recorrido completo con NVDA, VoiceOver o TalkBack, ni un recorrido manual completo con teclado.
- **El menú nativo de selección del celular** al subrayar (F2-12) solo se probó en el navegador del computador.
- **El respaldo y la actualización en el celular** (F4-06): las pruebas automáticas cubren exportar, restaurar, rechazar un archivo inválido y migrar respaldos viejos, pero falta un recorrido en el celular de Daniel.
- **Tiempos de estudio.** Los 25 minutos por lección y los 30 por laboratorio son estimaciones. Se recalibran con el uso real de Daniel (D-016).

**Lo que caduca y tiene fecha:**
- `scripts/fichas-por-revisar.py` lista las fichas y fuentes que vencen. Al 2026-10-27, dos fichas y seis fuentes tienen revisión el 2026-12-01, por el cierre de la plataforma de evals de un proveedor y el retiro de un modelo, ambos el 2026-11-30.

**Decisiones que cambiaron el plan original:**
- **D-024:** todo de opción múltiple. No hay entregas, expediente exportable ni microtareas.
- **D-029:** publicación en la cuenta de Daniel y no en una organización. La app guarda todos los cursos al instalarse. Eso reemplaza dos criterios del plan §13: que la carga inicial no descargue todos los cursos, y que los cursos no descargados se identifiquen. Lo primero pesa unos 3,6 MB y no incluye las imágenes de 1 600 px.

**Contenido:**
- Todos los datos son sintéticos (Altiplano Industrial S.A.). Las reglas financieras del caso son del curso, no normas oficiales.
- Las cifras de estudios y proveedores van con fuente y año, como dirección del efecto y no como predicción.

## Qué falta para cerrar la V1 (fase 5)

1. El recorrido de Daniel en su celular: descargar un respaldo, aceptar una actualización y comprobar que el progreso se conserva (F4-06).
2. Revisar las fichas que vencen el 2026-12-01.
3. Decidir sobre la licencia del repositorio público. Sin licencia, rigen los derechos de autor por defecto (ver M10 L5).
4. Dejar el punto de continuación para Codex o Claude Code.

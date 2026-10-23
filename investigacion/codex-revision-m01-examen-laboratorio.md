# Revisión cruzada T-026 — M01: examen, laboratorio y práctica

Fecha de revisión: 2026-10-23
Alcance: banco de examen y sus 12 familias, caso de laboratorio, práctica, conceptos erróneos `m01-mc35` a `m01-mc39`, diagnóstico B1, M02 y las pantallas de M01.

## Hallazgos

- [T026-01] Severidad: alta
  Ubicación: `content/courses/m01/questions/families.json`, familias `m01-f10` y `m01-f12`; `content/courses/m01/questions/exam.json`, variantes correspondientes.
  Evidencia: F10 agrupa tres decisiones que requieren conocimientos independientes: elegir lotes por costo y falta de urgencia (a, `m01-l5#pago`), mantener la inferencia local (b, `m01-l5#local-nube`) y explicar el costo de un historial acumulado (c, `m01-l5#multiplicadores`). F12 hace lo mismo con el criterio crítico (a), la vigencia de una comparación (b) y un fallo del comprobador (c). Que las tres pertenezcan al objetivo amplio no hace equivalentes las variantes: una persona puede acertar la decisión de lotes y no la de ubicación de los datos, o viceversa. La variante `c` puede ser más difícil, pero sigue necesitando medir la misma decisión que sus alternativas de recuperación.
  Consecuencia: el examen y un reintento pueden calificar aprendizajes distintos según la variante que toque. La equivalencia que documenta cada familia no sostiene el uso de sus variantes como sustitutas.
  Corrección recomendada: convertir cada una en familias de decisión única, con dos variantes base que cambien el contexto pero conserven la inferencia requerida, y una `c` que añada complejidad a esa misma inferencia. Por ejemplo, dejar F10 solo para costo por historial y crear familias separadas para lote y ubicación de inferencia; separar también criterio crítico, caducidad y error del comprobador en F12.

- [T026-02] Severidad: media
  Ubicación: `content/courses/m01/questions/lab.json`, `m01-lab-q02`, y `content/courses/m01/practice/m01-lab.md`, paso 1.
  Evidencia: la clave y su explicación afirman que una sesión en la nube «solo tiene la copia del repositorio» y que, para seguir la guía compartida, necesariamente hay que añadirla al repositorio. La lección `m01-l1#entorno` distingue una sesión iniciada desde la web, que parte de un clon del remoto, de una iniciada desde terminal, que puede recibir un repositorio local empaquetado. El caso no establece cuál de esos dos inicios tuvo la sesión ni si el entorno permite entregar la guía por un canal aprobado.
  Consecuencia: la opción correcta parece única por una condición que el enunciado no proporciona; además, la explicación convierte una configuración frecuente en una regla general.
  Corrección recomendada: especificar que la sesión se inició desde la web con el repositorio remoto y no puede recibir otros archivos, o cambiar la clave por una decisión condicional: asegurar que la guía llegue por un medio permitido, incorporándola al repositorio cuando esa sea la única entrada de la sesión.

- [T026-03] Severidad: media
  Ubicación: `content/courses/m01/questions/lab.json`, `m01-lab-q12` (`m01-l5#datos`), y paso 7 del caso.
  Evidencia: el giro de Legal aporta una condición nueva útil: no se pueden usar planes individuales. Sin embargo, la clave presenta «plan de empresa o API sin entrenamiento» como alternativas suficientes. Que un proveedor no use los datos para entrenamiento no determina por sí solo que el procesamiento, la retención o el contrato del entorno estén permitidos; la pregunta del diagnóstico `dx-b1-04` justamente enseña a comprobar dónde se procesan los datos y qué autoriza la política. El propio feedback ya apunta correctamente a decidir por plan o despliegue permitido.
  Consecuencia: el giro funciona como transferencia del costo hacia la gobernanza de datos, pero la formulación puede reintroducir la falsa regla de que “sin entrenamiento” resuelve la autorización para datos personales.
  Corrección recomendada: hacer que la clave diga que se confirma con Legal el plan o despliegue autorizado, incluidas las condiciones de procesamiento y retención, y solo entonces se elige costo y lotes dentro de esos límites. Puede mencionar un plan empresarial, una API o un modelo propio únicamente como opciones que deben estar aprobadas.

## Comprobaciones sin hallazgo

- Los 36 ítems del examen tienen una clave única; también los 12 del laboratorio y los 12 de práctica. Los distractores de los ítems revisados apuntan a un concepto erróneo existente y sus explicaciones concuerdan con el `sectionRef`. Los cinco conceptos `m01-mc35` a `m01-mc39` están definidos y usados de forma coherente.
- No encontré una repetición de fondo que invalide `m01-f10-b` frente a `dx-b1-04`: el diagnóstico pide averiguar qué permite la política antes de compartir datos; F10-b ya impone la condición más estricta de que la inferencia no salga de la empresa. Tampoco aparece la decisión de medir configuraciones con muestra de `dx-b1-03` fuera de la combinación justificada de `m01-lab-q09`.
- El caso provee, en cada uno de sus siete pasos, los datos necesarios para elegir. El paso 7 obliga a revisar la elección anterior por una nueva condición de Legal y por ello sí ejerce transferencia; el hallazgo T026-03 acota la regla que debe aplicar.
- La práctica conserva decisiones distintas de las comprobaciones y del laboratorio mediante escenarios breves; no encontré claves reveladas por posición ni por longitud.
- En una sesión de navegador con viewport de 360 px, la portada completa de M01, el laboratorio y el inicio del examen no tuvieron desbordamiento horizontal. El orden de foco alcanzó enlaces, radios, la casilla de confianza y botones con nombres accesibles; la vista de escritorio tampoco desbordó. Las pruebas E2E cubren las mismas rutas en escritorio y móvil.

## Validación ejecutada

- `npm test`: 120 pruebas en 12 archivos, todas aprobadas.
- `npm run e2e`: 56 pruebas, todas aprobadas, incluidas las rutas de M01 en escritorio y móvil.

# Revisión cruzada T-023 — D-024: evaluación de opción múltiple

Fecha de revisión: 2026-10-23
Alcance: las 12 preguntas del caso de laboratorio de M02, el caso escrito, las rutas simplificadas y la documentación de diseño afectada por D-024.

## Hallazgos

- [T023-01] Severidad: alta
  Ubicación: `content/courses/m02/questions/lab.json`, `m02-lab-q01`
  Evidencia: el enunciado pregunta qué duda se debe preguntar antes de avanzar. La clave es «qué cuenta como pipeline», porque cambia una cifra visible. Sin embargo, el distractor «qué es lo importante» también requiere aclaración: su propio *feedback* dice que es contexto que solo tiene el director y que se resuelve preguntando para qué es el dashboard. La política de `m02-l2#supuestos` exige preguntar lo que cambia una cifra visible, el alcance o algo irreversible; el criterio que hace importante algo determina qué muestra el dashboard y su alcance.
  Consecuencia: hay dos respuestas defendibles para un enunciado que debe tener una única clave; quien aplique la explicación del distractor puede marcar una respuesta declarada incorrecta.
  Corrección recomendada: orientar la pregunta a un efecto único, por ejemplo «¿Qué duda cambia directamente una cifra que verá el comité?», o cambiar el distractor de «lo importante» por una decisión de presentación que el alumno pueda decidir y registrar. Mantener la aclaración de propósito para una pregunta posterior donde sí se evalúe.

- [T023-02] Severidad: alta
  Ubicación: `content/courses/m02/questions/lab.json`, `m02-lab-q08`; `content/courses/m02/questions/checks.json`, `m02-l6-c1`
  Evidencia: ambas preguntas usan una oportunidad abierta sin fecha de cierre y piden el mismo *Then*: que no sume al pipeline del T4 y aparezca en el panel de calidad. La variante del laboratorio solo añade el ID `OPP-1021` y el texto «fecha de cierre vacía»; la clave y los distractores de estado interno, lenguaje vago y confirmación del agente son equivalentes.
  Consecuencia: la segunda respuesta comprueba el recuerdo de la comprobación de L6, no la transferencia que debe aportar el caso con escenarios propios.
  Corrección recomendada: conservar el formato Given/When/Then, pero usar otro hecho del caso que aún no tenga esa comprobación: por ejemplo, una etapa sin probabilidad o la política de duplicados, con una salida observable concreta.

- [T023-03] Severidad: media
  Ubicación: `content/courses/m02/questions/lab.json`, `m02-lab-q04`; `content/courses/m02/questions/checks.json`, `m02-l4-c4`; `content/courses/m02/lessons/m02-l4.md`, sección `#entrevista`
  Evidencia: ante la misma condición («en riesgo» no está definido y el comité lo verá el lunes), `m02-l4-c4` considera correcta la acción de registrar la pregunta y no implementar esa parte todavía. En cambio, la clave de `m02-lab-q04` indica una «regla provisional visible en pantalla». La lección permite proponer opciones y mostrar cómo cambiaría la lista, pero reserva la definición al negocio; «regla» en la pantalla puede leerse como un panel implementado con una definición no aprobada.
  Consecuencia: dos preguntas muy próximas enseñan conductas distintas para la misma ambigüedad de negocio, y la opción clave puede normalizar que se publique una regla sin decisión del dueño.
  Corrección recomendada: cambiar la clave por «Dueño: R. Ibáñez; estado: abierto; no se publica el panel hasta que decida»; si se quiere conservar la exploración, decir explícitamente que se muestran alternativas fuera del panel final y que ninguna se usa como definición vigente.

- [T023-04] Severidad: media
  Ubicación: `content/courses/m02/practice/m02-lab.md:7`
  Evidencia: el texto promete «seis pasos con dos preguntas cada uno», pero la distribución de `lab.json` es 2, 2, 3, 1, 3 y 1 preguntas de los pasos 1 a 6. Son 12 en total y sí hay dos preguntas por cada uno de los seis objetivos evaluados.
  Consecuencia: el alumno recibe una expectativa incorrecta sobre la carga de cada paso y puede interpretar como fallo de la pantalla que algunos pasos tengan una o tres preguntas.
  Corrección recomendada: escribir «seis pasos y doce preguntas, repartidas entre ellos»; alternativamente, redistribuir las preguntas a dos por paso sin perder dos por objetivo.

- [T023-05] Severidad: baja
  Ubicación: `content/courses/m02/practice/m02-lab.md:23`; `src/styles/app.css:203-269`
  Evidencia: el caso dice «no forma parte de esta entrega», aunque D-024 eliminó la entrega de laboratorio y el propio inicio ya aclara que no hay nada que entregar. Además, quedan sin referencias de componentes actuales las reglas `.rubric*`, `.evidence-row`, `.self-row`, `.preview*`, `.question__notes*` y `.adjustment*`; dos comentarios aún nombran «perfil, evaluación y entrega» y «Mi ruta».
  Consecuencia: el texto conserva el vocabulario retirado y el CSS da a futuras modificaciones la impresión de que siguen existiendo pantallas o flujos que D-024 quitó.
  Corrección recomendada: en el caso, cambiar por «no forma parte del caso» o eliminar esa tercera categoría si no se usa. En CSS, eliminar los selectores sin consumidores y renombrar los comentarios de los estilos que sí se conservan; no borrar las tablas históricas de IndexedDB, que D-024 mantiene para migración y respaldo.

## Comprobaciones realizadas

- **Preguntas:** las 12 tienen una sola opción marcada como correcta; las claves quedan repartidas por posición (tres en cada posición) y no aparece una pista sistemática de longitud o forma. Las seis referencias de sección existen. Los objetivos `m02-eo1` a `m02-eo6` tienen exactamente dos preguntas cada uno. Además de T023-02, no encontré otra repetición sustancial con comprobaciones, examen o diagnóstico.
- **Caso y datos:** verificado contra los CSV y `practice/data/README.md`: OPP-1012 figura con USD 125 000 y USD 90 000; OPP-1021 no tiene cierre; OPP-1027 conserva `Negociacion`; OPP-1036 está en `En revisión` sin probabilidad; hay seis filas en EUR; y el snapshot del 26 incorpora tres oportunidades `En pausa` por USD 410 000. El cambio del lunes sigue siendo una transferencia válida: obliga a decidir una política antes de que el reconciliador calcule. Fuera de los hallazgos, el caso mantiene voz clara, datos sintéticos y preguntas con explicación por opción.
- **Interfaz:** verificado en Chromium a 360 px y 1440 px para laboratorio, diagnóstico, portada M02, Cómo funciona y Respaldo: sin desborde horizontal; los controles reciben foco con Tab. En laboratorio, la casilla «Estoy muy seguro» se alcanza y se activa con Espacio en ambos anchos. La navegación visible coincide con D-024 y no encontré texto visible que ofrezca perfil, reporte, entrega, revisión externa o rúbrica.
- **Automatización:** `npm run e2e` terminó correctamente: 46/46, incluidas las rutas de celular y escritorio y el flujo D-024 que completa el laboratorio solo con respuestas de opción múltiple.
- **Diseño:** no encontré pantallas retiradas descritas en `design/`. Actualicé `docs/design-system.md` para sustituir el selector de cuatro opciones de confianza por la casilla actual y para retirar «evaluación» de la nota de modo oscuro.

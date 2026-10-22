# Revisión independiente del patrón temprano de M02

**Ticket:** T-006 · **Fecha:** 2026-10-21 · **Revisor:** Codex
**Alcance:** blueprint, lecciones 1 y 2, sus 8 comprobaciones, 2 repasos, conceptos erróneos y fichas de producto. No se modificó contenido.

## Resultado

Las dos lecciones implementan la secuencia principal del estándar: decisión, comprobación rápida, segmentos, caso resuelto, autoexplicación, ejemplo para completar, cuatro comprobaciones y resumen. L2 incorpora además los dos repasos de L1. Los ejemplos para completar cambian de escenario y la voz es clara, en segunda persona y sin promesas.

Se encontraron tres problemas altos antes de replicar el patrón: una competencia declarada fuera del manual, afirmaciones volátiles aún dentro de las lecciones y una clave que omite la decisión que define un objetivo. También conviene cronometrar L2 antes de fijar sus 25 minutos.

## Hallazgos

- [M02-R-01] Severidad: alta
  Ubicación: content/courses/m02/course.json:6, 9; content/courses/m02/questions/checks.json:289-291; docs/curriculum.md:89-99
  Evidencia: El manual declara C02, C07 y C12, pero el objetivo m02-eo2 y la comprobación m02-l2-c1 declaran también C03. El currículo reserva C03 como competencia principal de M03 y no la lista entre las competencias de M02.
  Consecuencia: La matriz futura de alineación y los informes de cobertura atribuirán evidencia de C03 a un manual que no la declara.
  Corrección recomendada: Decidir si la selección de contexto forma parte explícita de M02. Si sí, añadir C03 de forma coherente al blueprint y al currículo; si no, retirar C03 de m02-eo2 y de sus ítems.
  Verificado: la discrepancia se reproduce al comparar los tres archivos; las 46 pruebas actuales no comprueban esta pertenencia.

- [M02-R-02] Severidad: alta
  Ubicación: content/courses/m02/lessons/m02-l1.md:37, 49, 57; content/courses/m02/lessons/m02-l2.md:18-20, 32, 48, 53-54, 62-65, 76
  Evidencia: El estándar exige que las afirmaciones que dependen de producto o versión vivan en una ficha. Las lecciones atribuyen directamente recomendaciones o comportamientos a Spec Kit, Codex, Copilot, Claude Code y modelos concretos. Existen cuatro fichas, pero no cubren todas esas afirmaciones ni sustituyen su formulación dentro del cuerpo.
  Consecuencia: Un cambio en una guía o producto puede dejar una regla del cuerpo sin fecha, estado ni ciclo de revisión.
  Corrección recomendada: Formular en el cuerpo el principio durable y trasladar el detalle específico a fichas con producto, superficie, estado, fecha y fuente; enlazarlas desde el segmento.
  Verificado: se compararon las atribuciones de las lecciones con product-cards.json y con la regla de volatilidad del estándar.

- [M02-R-03] Severidad: alta
  Ubicación: content/courses/m02/questions/checks.json:3-55, ID m02-l1-c1, opción o1
  Evidencia: La clave nombra destinatario, periodo y umbral, pero no la decisión que habilita. La base de M02 exige usuario, decisión, periodo y umbral para el objetivo de ejemplo, y la lección enseña ese mismo conjunto.
  Consecuencia: La comprobación acepta una descripción de informe como objetivo y no evalúa la decisión que debe guiar el resultado.
  Corrección recomendada: Reescribir la clave y su feedback para incluir la decisión, por ejemplo priorizar qué clientes reciben gestión de cobranza; ajustar los distractores para conservar una única mejor respuesta.
  Verificado: al tapar las opciones, la pregunta pide el mejor objetivo y la actual clave omite uno de sus componentes enseñados.

- [M02-R-04] Severidad: media
  Ubicación: content/courses/m02/product-cards.json, cuatro fichas
  Evidencia: El contrato de fichas usa el estado de madurez GA, beta o preview. Tres fichas usan “guidance” y la cuarta “ga”; “guidance” describe el tipo de fuente, no el estado de disponibilidad, y la capitalización no sigue el vocabulario.
  Consecuencia: La interfaz no podrá comunicar de forma consistente la disponibilidad de una capacidad ni diferenciarla de una recomendación documentada.
  Corrección recomendada: Separar el estado de capacidad (GA, beta, preview o una ampliación documentada) del tipo de fuente; normalizar los valores del esquema.
  Verificado: se compararon los cuatro valores con docs/content-standard.md §7.2.

- [M02-R-05] Severidad: media
  Ubicación: content/courses/m02/questions/checks.json:54, 98-112; IDs m02-l1-c2/o3 y m02-l1-c3/o2-o3
  Evidencia: m02-l1-c3 asocia “perdió permisos” y “no es lo bastante capaz” con m02-mc01, aunque ese concepto erróneo trata de esperar que el modelo infiera una intención sin propósito. m02-l1-c2/o3 usa m02-mc03 para una gráfica no solicitada, pero m02-mc03 se refiere a pedir tantas funciones como sea posible.
  Consecuencia: El feedback etiqueta una creencia distinta de la que eligió el alumno y el catálogo no funciona como cantera diagnóstica fiable.
  Corrección recomendada: Crear o reutilizar conceptos erróneos que describan esas creencias, o reescribir las opciones para que expresen el concepto asociado.
  Verificado: todos los IDs existen; el fallo es de correspondencia semántica con las descripciones de misconceptions.json.

- [M02-R-06] Severidad: media
  Ubicación: content/courses/m02/lessons/m02-l1.md:104-111
  Evidencia: La respuesta modelo del ejercicio de transferencia fija “el mes cerrado más reciente, comparado con el mismo mes del año anterior”, aunque la petición solo pregunta qué pasó con el margen. Añade después que, si no está claro, hay que preguntarlo.
  Consecuencia: El ejemplo puede enseñar que una elección de periodo y comparación que cambia la interpretación de cifras es un supuesto aceptable.
  Corrección recomendada: Dejar el periodo pendiente de confirmación en la respuesta modelo, o mostrar dos ramas explícitas: dato confirmado frente a pregunta necesaria.
  Verificado: contrasta con la regla de ambas lecciones de no inventar lo que la petición no fija.

- [M02-R-07] Severidad: media
  Ubicación: content/courses/m02/lessons/m02-l2.md:125
  Evidencia: “Cuando una ambigüedad mueve cifras entre dos regiones, siempre se pregunta” se enuncia como regla universal. La tabla de L2:67-72 marca esa política como inferencia práctica del curso tras describir desacuerdos entre proveedores.
  Consecuencia: El alumno puede tomar una política didáctica local como regla técnica universal e ignorar una decisión ya aprobada.
  Corrección recomendada: Decir “según esta política del curso, se pregunta” y conservar la distinción entre una ambigüedad pendiente y una decisión ya aprobada.
  Verificado: la inferencia está marcada en L2:67 y la formulación absoluta aparece en L2:125.

- [M02-R-08] Severidad: media
  Ubicación: content/courses/m02/lessons/m02-l2.md; content/courses/m02/lessons/m02-l2.json:58
  Evidencia: L2 declara 25 minutos, el límite del estándar, y contiene 1,703 palabras más dos recuperaciones, cinco segmentos, tablas, caso resuelto, autoexplicación, ejemplo para completar y cuatro comprobaciones.
  Consecuencia: No queda margen demostrado para recuperar, completar y responder con atención; el piloto puede medir una sesión más larga que la duración publicada.
  Corrección recomendada: Cronometrar una pasada con el perfil de alumno objetivo. Si supera el límite, recortar un segmento o mover el aparte sobre orden del prompt a la lección que lo necesite.
  Verificado: el conteo local arrojó 1,703 palabras; no se simuló una prueba de usuario.

- [M02-R-09] Severidad: baja
  Ubicación: content/courses/m02/questions/checks.json:194, 327; IDs m02-l1-r1/o3 y m02-l2-c2/o2
  Evidencia: Ambos feedback tienen una sola frase. El estándar pide feedback por opción de dos a cuatro frases.
  Consecuencia: El alumno recibe una corrección más débil en esos dos errores.
  Corrección recomendada: Añadir una segunda frase que conecte la creencia errónea con la regla y el apartado citado.
  Verificado: las demás opciones revisadas contienen la explicación correctiva requerida.

- [M02-R-10] Severidad: baja
  Ubicación: content/courses/m02/lessons/m02-l1.md:121-126
  Evidencia: El primer punto del resumen define el objetivo por usuario, decisión, periodo y umbral, pero omite el tipo de entregable y la condición observable de terminado que el caso y la decisión inicial enseñan.
  Consecuencia: El resumen de consulta puede inducir a redactar un objetivo que no cierre con una prueba verificable.
  Corrección recomendada: Añadir entregable y condición de terminado a esa viñeta, o separar requisitos del objetivo y criterio de aceptación.
  Verificado: se comparó el resumen con la decisión inicial y el caso resuelto de L1.

## Muestra factual

| Afirmación revisada | Base contrastada | Veredicto |
| --- | --- | --- |
| L1:18, explicar el motivo mejora la generalización | M02 §2, P1.1 | Sostenida |
| L1:20, prueba del colega | M02 §2, P1.3 | Sostenida |
| L1:37, separar especificación y plan técnico | M02 §2, P1.6 | Sostenida; detalle de Spec Kit es volátil |
| L1:39, el alcance no fijado permite añadidos | M02 §2, P1.8 y matiz §2:72 | Sostenida |
| L1:49, entregable y autonomía según tarea | M02 §2, P1.5 | Sostenida; depende de producto/modelo |
| L1:57, Goal, Context, Constraints y Done when | M02 §2, P1.2 | Sostenida; depende de Codex |
| L2:18, contexto acotado y una tarea por sesión | M02 §2, P2.1-P2.2 | Sostenida |
| L2:32, instrucciones duraderas breves y podadas | M02 §2, P2.3 | Sostenida |
| L2:48, restricción con motivo | M02 §2, P2.4 | Sostenida |
| L2:53-54, énfasis puntual y sin contradicciones | M02 §2, P2.5-P2.6 | Sostenida |
| L2:62-65, mecanismos para hacer visibles supuestos | M02 §2, P2.7 | Sostenida |
| L2:76, cálculos deterministas fuera del modelo | M02 §2, P2.9 | Sostenida como recomendación del curso |
| L2:132, documentos largos primero y mejora de hasta 30 % | M02 §2, P2.10 y matices §2:119 | Sostenida; cifra interna de Anthropic, no generalizable |

La muestra cubre 13 afirmaciones con cita. No fue necesario abrir fuentes primarias adicionales: cada aseveración contrastada coincidió con su registro de investigación, que identifica la fuente primaria y fecha de verificación. Los detalles volátiles se señalan en los hallazgos para reubicarlos.

## Revisión de preguntas

| ID | Prueba de tapar opciones | Veredicto |
| --- | --- | --- |
| m02-l1-c1 | Sí; el enunciado admite un mejor objetivo | Corregir: la clave omite la decisión (M02-R-03) |
| m02-l1-c2 | Sí; pregunta por el entregable | Pasa |
| m02-l1-c3 | Sí; pregunta por la explicación más probable | Pasa la clave; corregir IDs de distractor (M02-R-05) |
| m02-l1-c4 | Sí; pide condición observable | Pasa |
| m02-l1-r1 | Sí; pide el elemento ausente | Pasa; ampliar feedback de o3 (M02-R-09) |
| m02-l1-r2 | Sí; pide una condición comprobable | Pasa |
| m02-l2-c1 | Sí; pide seleccionar contexto pertinente | Pasa |
| m02-l2-c2 | Sí; pide la restricción más útil | Pasa; ampliar feedback de o2 (M02-R-09) |
| m02-l2-c3 | Sí; pide decidir ante una política faltante | Pasa |
| m02-l2-c4 | Sí; pide priorizar una ambigüedad | Pasa |

Los diez ítems tienen una sola clave, tres o cuatro opciones, fuentes y punteros válidos; los nuevos conceptos m02-mc34 a m02-mc38 corresponden a P1.6, P1.5, P2.4, P2.7/E2.2 y a la síntesis marcada como inferencia en P2.7, respectivamente. La longitud de escenario y enunciado está bajo el límite de 120 palabras. El orden aleatorio está habilitado.

## Recomendación de patrón antes de L3-L6

Separar la lección en dos capas desde la autoría: una capa durable, formada por decisión, principio, caso, transferencia y pregunta; y una capa de producto, formada por fichas fechadas. Después, añadir una comprobación de coherencia de blueprint que valide que las competencias de cada objetivo e ítem pertenecen al manual. Así se evita que la réplica de L3-L6 multiplique afirmaciones volátiles fuera de ficha y cobertura imposible de reportar.

## Comprobación

Ejecutado: npm test
Resultado: 3 archivos de prueba aprobados; 46 pruebas aprobadas; duración 263 ms.

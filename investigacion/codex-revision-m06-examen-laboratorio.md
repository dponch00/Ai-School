# Revisión Codex — cierre de M06 (T-037)

Fecha: 2026-10-26  
Alcance: las 45 preguntas del examen (15 familias), 12 del laboratorio, 12 de práctica y los conceptos erróneos `m06-mc56` a `m06-mc80`.

## Hallazgos

- [T037-SRC-01] Severidad: media
  Ubicación: `content/courses/m06/misconceptions.json:612-629,675-683` (`m06-mc68`, `m06-mc69`, `m06-mc75`); `questions/exam.json` (`m06-f13-b`, `m06-f13-c`); `questions/lab.json:441` (`m06-lab-q11`); `questions/practice.json` (`m06-p11`)
  Evidencia: los tres conceptos citan `src-python-sys`. En `content/sources.json`, esa fuente solo respalda la convención de códigos de salida 0/1/2 de `sys.exit`; no respalda que se necesiten clases distintas de check, que el check de texto no pruebe un contrato erróneo ni que la independencia dependa del camino de cálculo. Las ideas son razonables como inferencias del diseño de M06, pero la fuente actual no dice eso.
  Consecuencia: la atribución da una apariencia de respaldo primario a reglas pedagógicas que la fuente no documenta, y dificulta que quien revise después distinga un hecho externo de una convención del curso.
  Corrección recomendada: marcar esas tres reglas como inferencias explícitas del curso y enlazarlas a la demostración reproducible de `reconcile.py`, o añadir una fuente que trate verificación independiente y tipos de controles. No usar `src-python-sys` como respaldo semántico de esas reglas; dejarlo solo donde se afirme el significado de los códigos de salida.

- [T037-REP-02] Severidad: media
  Ubicación: `content/courses/m06/questions/exam.json:896` (`m06-f07-c`); `content/courses/m06/questions/checks.json:877,922` (`m06-l4-r1`, `m06-l4-r2`)
  Evidencia: la variante avanzada vuelve a presentar, en el mismo orden, los dos disparadores de las comprobaciones: una cuenta de servicio con escritura innecesaria y una herramienta que se declara de solo lectura. La respuesta vuelve a ser retirar el permiso y no confiar en la declaración.
  Consecuencia: la variante c mide recordar dos comprobaciones previas más que la decisión de su familia; además incumple la condición del ticket de no repetir escenarios de comprobación.
  Corrección recomendada: conservar una sola señal falsa (por ejemplo, un permiso sobre un esquema futuro) y situarla en una tarea nueva que requiera lectura acotada; reservar la otra señal para un distractor o para otra familia. Así la dificultad avanzada procede de priorizar permisos efectivos, no de reconocer el caso previo.

- [T037-REP-03] Severidad: media
  Ubicación: `content/courses/m06/questions/exam.json:623` (`m06-f05-c`); `content/courses/m06/questions/checks.json:657` (`m06-l3-r2`)
  Evidencia: ambas preguntas usan una factura duplicada, una política de conservar la carga más reciente y el reporte del duplicado. Aunque `m06-f05-c` añade la tentación de borrar el RAW y pretende medir dónde vive la corrección, la información decisiva y el desenlace son prácticamente los mismos que en `m06-l3-r2` (FAC-2210).
  Consecuencia: quien reconozca el patrón puede acertar sin demostrar la distinción nueva entre conservar RAW y documentar un cambio en un commit.
  Corrección recomendada: cambiar el escenario avanzado por una corrección declarada distinta de duplicados —por ejemplo, un código de centro renombrado con un alias aprobado— y hacer que el distractor atractivo sea editar el RAW y anotarlo en el commit. Mantiene la decisión de la familia sin repetir el caso de FAC-2210.

- [T037-REP-04] Severidad: baja
  Ubicación: `content/courses/m06/questions/exam.json:667` (`m06-f06-a`); `content/diagnostic/items.json:812` (`dx-b5-03`)
  Evidencia: ambos plantean una tabla grande en un almacén, un dashboard que solo requiere un agregado y las mismas alternativas de llevar todas las filas a local, pedirlas a un modelo o agregar con SQL en el almacén. Cambia «región y semana» por «etapa y snapshot», pero la decisión y el tipo de distractor se conservan.
  Consecuencia: el examen vuelve a preguntar una decisión ya diagnosticada, reduciendo la novedad del banco y haciendo que la puntuación dependa parcialmente de recordar el diagnóstico.
  Corrección recomendada: convertir `m06-f06-a` en un caso de granularidad no cubierto por B5 —por ejemplo, decidir entre un conteo, una lista acotada y un agregado para una auditoría— o cambiar la necesidad posterior para que no sea simplemente un dashboard de totales.

## Verificado sin hallazgo

- Las 45 preguntas del examen tienen exactamente una clave; las 15 familias contienen tres variantes, dos base y una avanzada, del mismo objetivo declarado. Sus `sectionRef` apuntan a anclas existentes y sus `sourceIds` existen en `content/sources.json`.
- Las claves son defendibles frente a los distractores revisados. Los 25 conceptos `m06-mc56`–`m06-mc80` describen el error de los distractores que los usan. No apareció una opción de examen cuya longitud sea 1,5 veces o más la de otra de su misma pregunta (umbral más estricto que el 1,7 solicitado).
- La equivalencia interna de las familias se sostiene salvo las repeticiones de escenario señaladas: cada una conserva su decisión documentada y la variante c añade una ambigüedad razonable, no una segunda clave.
- El laboratorio se lee como una secuencia: el total y la marca del paso 1 llevan al snapshot del 26; la exclusión del paso 2 justifica la lectura limitada de notas del paso 3; la lista de pausa del paso 4 desemboca en el texto de dirección del paso 5; y el cambio de supuestos del paso 6 obliga a no reescribir la historia. El giro funciona y `m06-lab-q12` tiene una única respuesta defendible.
- Las preguntas del laboratorio y práctica tienen una clave única, feedback coherente con su `sectionRef` y distractores trazables a conceptos erróneos. `m06-lab-q04` conserva la política vigente y eleva la nueva decisión a FP&A; `m06-lab-q12` separa el snapshot histórico de una serie recalculada, como inferencia prudente de trazabilidad.

## Reproducción independiente de cifras

Sobre una copia temporal de `content/courses/m02/practice/data/`, ejecuté `reconcile.py` con `opportunities_snapshot_2026-10-26.csv`, `expected/kpis_correct.json` y `assumptions_reference.json`:

- produjo seis `AVISO`: el duplicado OPP-1012, la fecha ausente OPP-1021, OPP-1036 y OPP-1040 a OPP-1042 sin probabilidad;
- reprodujo pipeline abierto Centro `1 330 500` y total `3 772 000`; el Sur tuvo 3 vencidas y el total 7;
- el contrato del 19 terminó con código `1`: falló la fecha de corte, las dos cifras de vencidas y los tres problemas de calidad nuevos no reportados;
- al quitar `unknown_stage_policy` de otra copia temporal, terminó con código `2` y enumeró las cuatro oportunidades sin probabilidad.

Los porcentajes del caso también cuadran: `410 000 / 1 330 500 = 30,8 %` y, si se incluyeran las pausas, `410 000 / 1 740 500 = 23,6 %`. Por ello el «31 %» del borrador es un redondeo aritméticamente correcto, pero sigue siendo improcedente hasta que esa cifra exista en el contrato, como indica `m06-lab-q09`.

## Comprobación ejecutada

- `npm test`: 14 archivos, 190 pruebas correctas.

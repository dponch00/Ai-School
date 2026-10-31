# Laboratorio M02: de una petición ambigua a una especificación verificable

:::decision
Vas a seguir un caso completo: un correo tan vago como los que llegan un viernes por la tarde, que termina convertido en una especificación que cualquier agente puede ejecutar y cualquier persona puede verificar. En cada paso tomas las decisiones clave respondiendo preguntas, y al final llega un cambio inesperado que pone a prueba la especificación.
:::

Calcula unos 30 minutos [H]. Son seis pasos y doce preguntas repartidas entre ellos, y cada respuesta trae la explicación de por qué es o no la mejor opción. No hay nada que entregar ni que llenar: el laboratorio cuenta como hecho cuando respondes todas sus preguntas. Todos los datos son sintéticos y pertenecen a Altiplano Industrial S.A., la empresa ficticia del curso; ninguna cifra es real.

## Paso 1 · La petición y sus ambigüedades {#paso-1}

Este correo llega el viernes a las 18:40:

> **Asunto:** dashboard pipeline
>
> Hola, para el comité del lunes necesito un dashboard del pipeline que se vea bien y muestre cómo vamos. Que tenga lo importante y algún comentario de IA que lo explique. Usa los datos del CRM que te pasó Marta. Gracias.
>
> — R. Ibáñez, director financiero (ficticio)

Los datos que te pasó Marta son el :term[snapshot]{id=g-snapshot-datos} de oportunidades del 2026-10-19 (unas 40 filas), la tabla de probabilidades por etapa de FP&A, los tipos de cambio, la cuota y lo ganado en el T4. Antes de escribir nada, hay que separar las dudas según la política de :ref[la lección 2]{to=m02-l2#supuestos}:

- **Preguntar:** cambia una cifra visible, el alcance o algo irreversible.
- **Decidir y registrar:** no cambia cifras, así que la decides tú y la dejas escrita con su motivo.
- **Fuera de alcance:** no es parte de lo que pidió el director para el lunes.

Algunas dudas no están en el correo, sino en los archivos. Al abrir el snapshot aparecen, entre otras cosas, un registro duplicado, una oportunidad sin fecha de cierre, una etapa escrita sin tilde, otra (OPP-1036, «En revisión») que no está en la tabla de probabilidades y seis montos en euros.

::lab-questions{step="paso-1"}

## Paso 2 · Las respuestas del director {#paso-2}

Con la lista de dudas lista, le escribes al director. Esto responde:

- **Para quién y para qué:** para el comité comercial, que tiene que decidir en qué oportunidades enfocar el seguimiento de la semana.
- **Periodo:** el cuarto trimestre de 2026 (octubre a diciembre). El año fiscal coincide con el calendario.
- **Moneda:** USD, con las tasas de `fx_rates.csv` a la fecha del snapshot.
- **«Pipeline»:** las oportunidades abiertas. Quiere ver el total y el ponderado por la tabla de FP&A.
- **Cobertura:** pipeline abierto del T4 / (cuota del T4 − ganado en el T4).
- **Detalle:** por región, y las 10 oportunidades en mayor riesgo.
- **Formato:** una página HTML estática que se lea bien en portátil y en celular.
- **Comentario de IA:** 120 palabras como máximo, basado solo en cifras calculadas.
- **Plazo:** para el lunes basta una primera versión, sin navegación de detalle.

Hay dos cosas que el director no sabe: qué hacer con las oportunidades duplicadas y qué significa «en riesgo». Las dudas resueltas pasan al :term[brief]{id=g-brief} como definiciones. Las dos abiertas necesitan un plan, y ese plan también va en el brief.

::lab-questions{step="paso-2"}

## Paso 3 · El brief {#paso-3}

El brief reúne lo que preparaste en las lecciones 1 a 3. Tiene cinco partes:

1. **Objetivo y decisión:** usuario, decisión, periodo y umbral (:ref[lección 1]{to=m02-l1#anatomia}).
2. **Alcance:** qué entra, qué queda fuera y qué no puede hacer el agente sin confirmarlo contigo.
3. **Definiciones de KPI:** fórmula, unidad, moneda y fuente del pipeline abierto, el ponderado, la cobertura y el conteo de vencidas.
4. **Registro de supuestos:** ID, supuesto, dueño, estado y política, incluidas las dos preguntas que el director no supo responder.
5. **Casos de prueba y contraejemplos:** casos sobre los datos con su valor esperado, algunos de calidad de datos y al menos un contraejemplo sobre el comentario narrativo (:ref[lección 3]{to=m02-l3#contraejemplos}).

Los KPI salen con el formato del contrato `pipeline_kpis` v1 de :ref[la lección 3]{to=m02-l3#contrato}. El brief lo cita en lugar de copiarlo, y añade las :term[invariantes]{id=g-invariante} que se comprueban en código.

::lab-questions{step="paso-3"}

## Paso 4 · Los criterios de aceptación {#paso-4}

Los criterios dicen cuándo está listo el trabajo, con el formato Given/When/Then de :ref[la lección 6]{to=m02-l6#observables}. La parte delicada es el Then: tiene que describir algo que se pueda observar, como una cifra en pantalla, una fila en un panel o un aviso, y no un :term[estado interno]{id=g-estado-interno} del sistema. Cada escenario tiene que poder rastrearse hasta una parte del objetivo.

::lab-questions{step="paso-4"}

## Paso 5 · El prompt de ejecución {#paso-5}

El prompt de ejecución es el encargo que le darías a un agente de código al abrir una sesión nueva. Cita el brief y el contrato sin copiarlos, para que cada regla exista en una sola versión, y añade cuatro cosas: los hitos con su prueba y un punto de control humano (:ref[lección 5]{to=m02-l5#hitos}), la política de :term[ambigüedad]{id=g-ambiguedad}, los límites de acción y la evidencia que exiges en el reporte final (:ref[lección 6]{to=m02-l6#ejecutable}).

::lab-questions{step="paso-5"}

## Paso 6 · El cambio del lunes {#paso-6}

El lunes a primera hora, Marta envía el snapshot del 2026-10-26. Trae una etapa nueva, «En pausa», con tres oportunidades del Centro por USD 410 000. FP&A todavía no le ha asignado probabilidad.

Es el mismo problema de OPP-1036 del paso 1, ahora con tres oportunidades y USD 410 000. Si la especificación no tiene una regla para las etapas sin probabilidad, el script de :term[reconciliación]{id=g-reconciliacion} se detiene antes de calcular y avisa cuáles son. Si la tiene, por ejemplo dejarlas fuera del ponderado y mostrarlas en el panel de calidad hasta que FP&A decida, el script las excluye y las lista. Una especificación que resolvió OPP-1036 con una regla general aguanta el cambio; una que lo trató como caso aislado, no.

::lab-questions{step="paso-6"}

## Pruébalo en tu entorno (opcional) {#en-tu-entorno}

Si quieres ver el caso en acción, los datos y el script de reconciliación están en `practice/data/` (en el repositorio, dentro de `content/courses/m02`). Puedes escribir tu propio brief y tu prompt de ejecución, dárselos a un agente de código y comprobar el resultado:

```bash
python practice/data/reconcile.py --data-dir practice/data --kpis kpis.json --assumptions supuestos.json
```

En `supuestos.json` declaras la moneda, la política de duplicados y qué hacer con las etapas sin probabilidad. El script se detiene si falta un supuesto que cambia cifras, avisa de cada exclusión y compara cada KPI y cada problema de calidad de datos. Para el cambio del lunes, agrega `--snapshot opportunities_snapshot_2026-10-26.csv`.

Este paso no se registra en la app ni cuenta para nada. Sirve para practicar con un agente de verdad, y :ref[M09]{to=m09-l3#comparar} retoma la comparación de prompts a fondo.

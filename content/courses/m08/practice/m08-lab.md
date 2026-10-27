# Laboratorio M08: los riesgos de las oportunidades grandes

:::decision
Vas a acompañar a la analista de FP&A de Altiplano mientras decide cómo automatizar un memo semanal para dirección. Un compañero propone un sistema con varios agentes; la analista quiere algo que cumpla, cueste poco y se pueda verificar. A lo largo de seis pasos tendrás que decidir qué parte necesita un modelo, cómo se encarga cada tarea, si conviene repartirla, dónde corre, qué reglas hace cumplir el entorno de trabajo del agente y qué hacer cuando, tres viernes después, algo sale mal sin que nadie lo note.
:::

Calcula unos 30 minutos [H]. Cada paso tiene dos preguntas, y cada respuesta trae la explicación de por qué es o no la mejor opción. No hay nada que entregar ni que llenar: el laboratorio cuenta como hecho cuando respondes todas sus preguntas. Todos los datos son sintéticos y pertenecen a Altiplano Industrial S.A., la empresa ficticia del curso.

## Paso 1 · La propuesta {#paso-1}

Cada viernes, dirección quiere un memo con los riesgos de las diez oportunidades abiertas más grandes. Para cada una, el memo indica el monto, la etapa y si está vencida, datos que salen del snapshot, y el riesgo que se lee en su nota libre del CRM, que puede ser de precio, de plazo o ninguno. Las notas son cortas, de tres o cuatro líneas, y no dependen unas de otras. Un compañero propone un orquestador que lance un agente por oportunidad; cada agente leería su nota y calcularía sus cifras, y un agente revisor aprobaría el memo final.

::lab-questions{step="paso-1"}

## Paso 2 · Los encargos {#paso-2}

Para probar, la analista clasifica las diez notas con una sola llamada al modelo. Los encargos de la propuesta, en cambio, los escribió el compañero. El de la clasificación dice solo «Clasifica el riesgo de cada nota», y el del revisor, «Aprueba el memo cuando te parezca correcto».

::lab-questions{step="paso-2"}

## Paso 3 · ¿Repartir? {#paso-3}

El compañero insiste en su diseño: «Diez agentes, uno por nota, cuestan lo mismo que uno y terminan antes». La analista quiere decidir con argumentos, y pensar también qué haría falta si algún día las notas fueran largas y conviniera repartirlas.

::lab-questions{step="paso-3"}

## Paso 4 · Dónde corre {#paso-4}

El memo tiene que estar listo el viernes a las siete de la tarde. La analista se va a las cinco y apaga su computadora. Las notas se leen por la API del CRM ficticio, las cifras salen del snapshot que ya está en el repositorio, y el repositorio está en el servidor de Git del equipo.

::lab-questions{step="paso-4"}

## Paso 5 · Las reglas del arnés {#paso-5}

FP&A fija dos reglas. La primera es que el memo no cite ningún monto que no esté en el snapshot. La segunda, que ningún agente edite el archivo con la rúbrica de riesgo, donde se define qué cuenta como riesgo de precio, de plazo o ninguno.

::lab-questions{step="paso-5"}

## Paso 6 · Tres viernes después {#paso-6}

Por decisión de dirección, el diseño que se puso en marcha fue el del compañero, con diez agentes y un revisor. El historial muestra tres ejecuciones terminadas con éxito. Pero el tercer memo marca «riesgo alto», una categoría que la rúbrica ni siquiera tiene, en dos oportunidades cuyas notas son casi iguales a las de otras dos marcadas «sin riesgo». La transcripción muestra que cada agente usó su propia idea de lo que es un riesgo, porque su encargo no traía la rúbrica, y que el revisor aprobó el memo. Según el registro de costo estimado, cada ejecución gastó unas doce veces lo que gastaba la prueba de una sola llamada.

::lab-questions{step="paso-6"}

## Pruébalo en tu entorno (opcional) {#en-tu-entorno}

Si quieres ver cómo un hook bloquea una edición, crea una carpeta de prueba con datos inventados y configura en tu herramienta de agentes un hook previo a las ediciones que se niegue a modificar un archivo concreto. Pídele al agente que lo edite y observa cómo se bloquea. Después pídele que lo cambie con un comando de la terminal y comprueba si el hook lo detecta. No uses datos ni credenciales reales. Este apartado no se registra en la app ni cuenta para el curso.

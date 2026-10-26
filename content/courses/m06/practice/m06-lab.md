# Laboratorio M06: la semana de las oportunidades en pausa

:::decision
Vas a acompañar a la analista de FP&A de Altiplano durante la semana del snapshot del 26 de octubre, mientras dirige a un agente de código que mantiene el dashboard del pipeline. A lo largo de seis pasos tendrás que decidir dónde se calcula cada cifra nueva, qué hacer con una etapa que nadie esperaba, con qué identidad lee el agente, qué herramienta y qué formato usar, qué cifras puede llevar el párrafo para dirección y qué hacer cuando, una semana después, cambian los supuestos.
:::

Calcula unos 30 minutos [H]. Cada paso tiene dos preguntas, y cada respuesta trae la explicación de por qué es o no la mejor opción. No hay nada que entregar ni que llenar: el laboratorio cuenta como hecho cuando respondes todas sus preguntas. Todos los datos son sintéticos y pertenecen a Altiplano Industrial S.A., la empresa ficticia del curso.

## Paso 1 · Lo nuevo del dashboard {#paso-1}

Para esta semana, el jefe de FP&A pide dos cosas nuevas en el dashboard: una línea con el total de lo que se excluyó por problemas de calidad y una marca en rojo para las filas cuya etapa no está en la lista aprobada. El agente propone resolver las dos en el navegador. La interfaz recibiría las filas excluidas, con cuenta, responsable y monto, sumaría los montos y revisaría cada etapa con JavaScript.

::lab-questions{step="paso-1"}

## Paso 2 · El snapshot del 26 {#paso-2}

El snapshot del 26 de octubre trae las mismas filas que el del 19 y tres oportunidades nuevas del Centro: OPP-1040, OPP-1041 y OPP-1042, por 410 000 USD en total. Las tres están en una etapa que no existía, «En pausa», sin probabilidad aprobada. El registro de supuestos ya declara una política para las etapas sin probabilidad: excluirlas del pipeline y reportarlas. FP&A la aprobó hace dos semanas pensando en OPP-1036, una sola oportunidad «En revisión».

::lab-questions{step="paso-2"}

## Paso 3 · Para entender las pausas {#paso-3}

Antes de decidir qué hacer con la etapa nueva, FP&A quiere saber por qué se pausaron esas oportunidades. La analista le pide al agente que lea en el CRM las notas de las tres. Para ahorrar tiempo, un colega le ofrece la configuración del servidor de herramientas que él ya usa. Y una de las notas trae una instrucción dirigida a quien la lea.

::lab-questions{step="paso-3"}

## Paso 4 · Lo que pide FP&A {#paso-4}

Con las notas leídas, FP&A decide mantener la exclusión por ahora y pide la lista de las tres oportunidades para revisarla con calma. Mientras tanto, el agente propone un atajo para que la política de etapas se aplique más rápido en el dashboard.

::lab-questions{step="paso-4"}

## Paso 5 · El párrafo para dirección {#paso-5}

El modelo redacta el párrafo semanal a partir del contrato del 26. El borrador dice: «El pipeline abierto se mantuvo en 3,77 millones. El 31 % del pipeline del Centro está en pausa». Al ver el dashboard, dirección pide además un indicador nuevo para el Centro.

::lab-questions{step="paso-5"}

## Paso 6 · Una semana después {#paso-6}

El 2 de noviembre, FP&A aprueba una probabilidad de 0,20 para «En pausa», con fecha efectiva de ese mismo día. El agente agrega la etapa a la tabla de probabilidades, actualiza los datos de prueba y todo queda en verde. Después propone un cambio más, pensando en la comparación entre semanas.

::lab-questions{step="paso-6"}

## Pruébalo en tu entorno (opcional) {#en-tu-entorno}

Si tienes Python, puedes repetir el paso 2 con los archivos del laboratorio del manual 2. Copia la carpeta de datos a otro lugar y corre `reconcile.py` con el snapshot del 26 (`--snapshot`), el archivo de supuestos de referencia y el JSON correcto del dashboard del 19. Verás seis avisos en lugar de tres, porque las tres oportunidades en pausa se excluyen por la política declarada. El pipeline sale igual que el del 19, pero el check termina con código 1 justo en lo que cambió: la fecha de corte, una vencida más en el Sur y las tres oportunidades que ese JSON no reporta. Después quita `unknown_stage_policy` de una copia del archivo de supuestos y córrelo otra vez: el script termina con código 2 y pide la probabilidad a FP&A. Este apartado no se registra en la app ni cuenta para nada.

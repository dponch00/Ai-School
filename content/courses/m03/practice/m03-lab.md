# Laboratorio M03: el repositorio del presupuesto 2027

:::decision
Vas a acompañar a la analista de FP&A de Altiplano durante las dos semanas en que prepara el repositorio del presupuesto 2027 para trabajar con un agente. En cada uno de los seis momentos hay una decisión: qué va en cada capa, por qué una regla no se carga, cómo se escribe y se prueba una skill, qué hacer cuando la sesión se satura, cómo responder al comité con citas que se sostengan y cómo dejar el trabajo listo para quien la cubre en sus vacaciones.
:::

Calcula unos 30 minutos [H]. Son seis pasos con dos preguntas cada uno, y cada respuesta trae la explicación de por qué es o no la mejor opción. No hay nada que entregar ni que llenar: el laboratorio cuenta como hecho cuando respondes todas sus preguntas. Todos los datos son sintéticos y pertenecen a Altiplano Industrial S.A., la empresa ficticia del curso.

## Paso 1 · El inventario {#paso-1}

El repositorio consolida los presupuestos de las cuatro regiones de Altiplano en el total de la empresa. Antes de escribir nada, la analista anota lo que el agente debería saber:

1. El comando `make consolidate`, que hay que correr antes de dar por terminado cualquier cambio y que el agente no adivina.
2. La convención de las plantillas de la carpeta `regions/`: una hoja por centro de costo.
3. El procedimiento de consolidación, de once pasos, que se usa una vez por semana durante el ciclo de presupuesto.
4. La regla de Contraloría: el agente no puede modificar los topes de gasto aprobados del archivo `caps.csv`.
5. La lista de responsables de cada región, que cambia casi todos los meses.

Las piezas 1 y 2 tienen su lugar claro: la primera va en la instrucción permanente y la segunda, en un archivo de instrucciones dentro de `regions/`. Quedan las otras tres.

::lab-questions{step="paso-1"}

## Paso 2 · La regla que no se cargaba {#paso-2}

La analista escribe la pieza 1 en el AGENTS.md de la raíz, junto con una regla de unidades: «montos en miles de USD». Su compañero de equipo, que usa otra herramienta, cuenta que en su computadora el agente no corre `make consolidate` y entrega los montos en USD sin redondear. Desde el año pasado, él tiene ahí un archivo de instrucciones propio de su herramienta, que copió de otro proyecto.

::lab-questions{step="paso-2"}

## Paso 3 · La skill de consolidación {#paso-3}

Con la pieza 3, la analista crea una skill. La carpeta y el nombre ya cumplen el formato, pero el primer borrador de la descripción dice solo «Skill de presupuesto». Antes de darla por buena, quiere reescribir la descripción y comprobar si la skill se activa cuando debe, con consultas que deberían activarla y otras que no.

::lab-questions{step="paso-3"}

## Paso 4 · La sesión de los ajustes {#paso-4}

A media semana, la analista lleva una sesión larga ajustando la consolidación. Ya corrigió dos veces al agente porque suma como USD montos que están en miles de USD, y la conversación está llena de esos intentos. Además, necesita saber cuáles de las 80 plantillas históricas de `regions/archive/` usan un formato antiguo.

::lab-questions{step="paso-4"}

## Paso 5 · La pregunta del comité {#paso-5}

El comité pregunta por qué el presupuesto de marketing del Sur sube un 18 %. La analista tiene a mano el glosario de partidas (una página), las 80 plantillas históricas, las actas del comité y la salida de `make consolidate`, que es de donde salen las cifras.

::lab-questions{step="paso-5"}

## Paso 6 · Las vacaciones {#paso-6}

El viernes, la analista sale de vacaciones por dos semanas, y la cubre un compañero de Tesorería que usa su propia herramienta. Esta semana, Contraloría aprobó repartir los gastos compartidos según el número de empleados de cada región, después de descartar repartirlos según las ventas. Queda pendiente consolidar la región Centro, que hoy da una diferencia de 4 000 USD con el total.

::lab-questions{step="paso-6"}

## Pruébalo en tu entorno (opcional) {#en-tu-entorno}

Si quieres practicar con herramientas reales, toma un procedimiento que repitas en tu trabajo y conviértelo en una skill como en el paso 3. Escribe la descripción pensando en cuándo debe activarse, prepara unas diez consultas que deberían activarla y otras tantas que no, entre ellas algunos casi aciertos (consultas que comparten palabras con la skill pero piden otra cosa), y corre cada una tres veces. Usa solo datos que puedas compartir con esas herramientas. Este apartado no se registra en la app ni cuenta para nada.

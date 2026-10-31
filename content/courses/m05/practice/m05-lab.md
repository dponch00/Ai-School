# Laboratorio M05: las alertas de cobranza

:::decision
Vas a acompañar a la analista de FP&A de Altiplano mientras dirige, de principio a fin, a un agente de código en una tarea concreta: agregar al dashboard una lista de alertas con los clientes que tienen facturas vencidas hace más de 90 días. A lo largo de seis pasos tendrás que decidir cuánto dejar hacer al agente, qué corregir en su plan, qué hacer con su reporte, cómo salir de una depuración que no avanza, cómo verificar lo que se ve en pantalla y qué mandar a la nube el viernes.
:::

Calcula unos 30 minutos [H]. Cada paso tiene dos preguntas, y cada respuesta trae la explicación de por qué es o no la mejor opción. No hay nada que entregar ni que llenar: el laboratorio cuenta como hecho cuando respondes todas sus preguntas. Todos los datos son sintéticos y pertenecen a Altiplano Industrial S.A., la empresa ficticia del curso.

## Paso 1 · Antes de empezar {#paso-1}

El repositorio del dashboard está en Git, con la carpeta limpia (sin cambios pendientes) y una rama nueva para el trabajo. La tarea necesita leer y editar el repositorio, correr las pruebas y la reconciliación, y quizá instalar una biblioteca que ya está declarada en las dependencias. No debe tocar `data/clientes.csv`, el archivo sintético de clientes que usan las pruebas, ni enviar nada al servidor sin que la analista lo apruebe.

::lab-questions{step="paso-1"}

## Paso 2 · El plan del agente {#paso-2}

Antes de que toque nada, la analista le pide un plan. El agente propone esto:

1. Leer todos los archivos del repositorio para entender el proyecto.
2. Agregar una función que liste los clientes con facturas vencidas hace más de 90 días.
3. Fijar el umbral de alerta en 90 días «según las buenas prácticas de cobranza».
4. Agregar la lista al dashboard con una marca de color por antigüedad.
5. Correr las pruebas al final.

::lab-questions{step="paso-2"}

## Paso 3 · El reporte del agente {#paso-3}

En el encargo, la analista había escrito: «No modifiques las pruebas existentes. Si una prueba parece incorrecta, detente y explícalo». A mitad del trabajo, el agente se detiene y reporta: «La prueba existente `test_aging` espera alertas desde los 60 días, pero el encargo dice 90. No la modifiqué. ¿Cuál de los dos vale?».

::lab-questions{step="paso-3"}

## Paso 4 · Un cliente que no debería estar {#paso-4}

Una vez aclarado el umbral, la lista muestra a Cuenta Ficticia Prisma, un cliente que ya pagó todas sus facturas. El agente intentó dos arreglos seguidos (primero ordenar distinto las facturas y después excluir los montos cero), pero el cliente sigue apareciendo. La sesión ya es larga y el contexto está muy ocupado. Con un comando mínimo, la analista descubre que el cliente tiene un pago parcial registrado con la fecha vacía.

::lab-questions{step="paso-4"}

## Paso 5 · Verificar lo que se ve {#paso-5}

Las pruebas y la reconciliación pasan. Falta saber si la lista se ve bien en el dashboard, con sus marcas de color, y si el cambio se mantuvo dentro del encargo. Después, un revisor que empieza en contexto limpio, sin la conversación anterior, lee el diff y devuelve ocho observaciones.

::lab-questions{step="paso-5"}

## Paso 6 · El viernes {#paso-6}

Quedan dos tareas independientes y acotadas: agregar pruebas para la función de pagos parciales y actualizar el README de las alertas. La analista quiere mandarlas a la nube antes de irse, pero el plan de esas tareas está en un archivo que todavía no subió al repositorio remoto. El lunes, otra persona seguirá con el trabajo usando otra herramienta.

::lab-questions{step="paso-6"}

## Pruébalo en tu entorno (opcional) {#en-tu-entorno}

Si quieres practicar con un agente de verdad, usa un repositorio de prueba con datos inventados. Configura el sandbox con escritura limitada al repositorio y la red apagada, y escribe un encargo con las cuatro piezas de :ref[la lección 3]{to=m05-l3#piezas}. Al recibir el resultado, comprueba en el resumen del diff que no se tocaron las pruebas existentes. Y si el agente tiene que verificar la interfaz, no le des un navegador con tus sesiones personales abiertas. Este apartado no se registra en la app ni cuenta para nada.

# Laboratorio M10: el simulador de descuentos

:::decision
Vas a acompañar a la analista de FP&A de Altiplano mientras lleva una herramienta pequeña de la idea a las manos de sus usuarios. Los vendedores llaman a su gerente cada vez que un cliente pide un descuento, y el director comercial quiere «una app para que los vendedores den descuentos sin llamar a nadie». A lo largo de seis pasos tendrás que decidir el alcance, qué verificar en la pantalla, qué guardar en el teléfono, cómo publicar cada lista de precios, cómo documentar y quién responde, y qué hacer cuando, dos meses después, hay que mudar la app a otra dirección.
:::

Calcula unos 30 minutos. Cada paso tiene dos preguntas, y cada respuesta trae la explicación de por qué es o no la mejor opción. No hay nada que entregar ni que llenar: el laboratorio cuenta como hecho cuando respondes todas sus preguntas. Todos los datos son sintéticos y pertenecen a Altiplano Industrial S.A., la empresa ficticia del curso. Los porcentajes de comportamiento de los vendedores son datos ficticios del caso.

**La política de descuentos de FP&A.** Hasta un 8 % de descuento decide el vendedor. De más del 8 % al 15 %, aprueba el gerente regional. Más del 15 %, aprueba la dirección comercial. Y en todos los casos, el margen después del descuento tiene que ser de al menos un 22 %. El margen es la parte del precio que queda después de restar el costo.

**Algunos casos que FP&A calculó con su propia planilla** (precios en USD):

| Producto | Descuento | Precio final | Margen | Quién aprueba | ¿Margen de 22 % o más? |
| --- | --- | --- | --- | --- | --- |
| BOM-220, bomba (lista 12 400, costo 8 680) | 8 % | 11 408,00 | 23,91 % | Vendedor | Sí |
| BOM-220 | 10 % | 11 160,00 | 22,22 % | Gerente regional | Sí |
| BOM-220 | 12 % | 10 912,00 | 20,45 % | Gerente regional | No |
| BOM-220 | 16 % | 10 416,00 | 16,67 % | Dirección comercial | No |
| VAL-045, válvula (lista 1 850, costo 1 110) | 15 % | 1 572,50 | 29,41 % | Gerente regional | Sí |
| Caso límite (lista 10 000, costo 7 020) | 10 % | 9 000,00 | 22,00 % | Gerente regional | Sí, justo en el límite |

## Paso 1 · El pedido {#paso-1}

El director pide una app con cotización en PDF, conexión al CRM y un chat con IA que negocie con el cliente. Antes de decidir nada, la analista entrevista a cuatro vendedores, y los cuatro cuentan lo mismo. En la visita, el vendedor no sabe si el descuento que le piden está dentro de la política, así que llama al gerente, que a veces tarda horas en contestar. Según el informe mensual de FP&A, 3 de cada 10 descuentos del último trimestre quedaron fuera de la política. Y en muchas visitas no hay buena señal.

::lab-questions{step="paso-1"}

## Paso 2 · La pantalla {#paso-2}

Con el alcance definido, la analista le encarga la calculadora al agente, que entrega la pantalla con su reporte: «Escaneo de accesibilidad: 0 violaciones; probado en el navegador de escritorio». En la pantalla, el descuento se elige solo arrastrando un control deslizante; quién debe aprobar se muestra con un círculo verde, ámbar o rojo, sin texto; y el botón «Calcular» es un ícono de 20 por 20 píxeles pegado al de «Borrar». Los vendedores la usarán en el teléfono, de pie, a veces al sol.

::lab-questions{step="paso-2"}

## Paso 3 · Los escenarios guardados {#paso-3}

Corregida la pantalla, los vendedores piden guardar los escenarios de cada cliente para retomarlos en la visita siguiente. El agente propone guardar en el almacenamiento del navegador el precio final, el margen y la banda de aprobación ya calculados, «para no recalcular». La analista decide que, por ahora, los escenarios se guarden solo en el teléfono, sin servidor: son datos comerciales, y la versión 1 no tiene usuarios con contraseña ni un sistema propio detrás. Además, en diciembre la lista de precios agregará una columna de moneda, porque llegan productos importados que se cotizan en euros.

::lab-questions{step="paso-3"}

## Paso 4 · La lista de diciembre {#paso-4}

FP&A publica una lista de precios nueva cada mes, vigente desde el día 1, y la de diciembre trae la columna de moneda. Para que «la lista llegue antes», el agente propone dos cambios. El primero es publicar en cada cambio sin esperar a las pruebas, y el segundo, activar de inmediato la versión nueva de la app, aunque el vendedor la tenga abierta.

::lab-questions{step="paso-4"}

## Paso 5 · La entrega {#paso-5}

Para cerrar la entrega, la analista revisa la documentación. El agente escribió un único README, que empieza con la instalación, sigue con «cómo dar un descuento en tres toques», enumera las columnas de la lista y termina diciendo que «la app calcula márgenes exactos y reemplaza la llamada al gerente». No dice que los escenarios se guardan solo en ese teléfono, ni que los precios son de lista y sin impuestos, ni quién mantiene la app. El director pregunta: «Si un margen sale mal y damos un descuento que no correspondía, ¿quién responde?».

::lab-questions{step="paso-5"}

## Paso 6 · La mudanza {#paso-6}

Dos meses después, TI informa que el servicio gratuito donde se publicó la app no admite, según sus términos, herramientas de una empresa, y que hay que pasarla a `descuentos.altiplano.example` antes del 15 de enero. Un vendedor pregunta si sus escenarios guardados «se van a mudar solos». Al repasar la revisión independiente de la primera semana, la analista encuentra un hallazgo de severidad media: «No hay forma de exportar los escenarios guardados». Se cerró como «aceptado: los datos quedan en el teléfono», sin responsable ni condición para reabrirlo.

::lab-questions{step="paso-6"}

## Pruébalo en tu entorno (opcional) {#en-tu-entorno}

Con una planilla o un script de Python que use decimales exactos, calcula los seis casos de la tabla y mira con atención el caso límite: un margen de exactamente 22,00 %, ¿pasa o no pasa, según cómo escribas la comparación? Después abre cualquier app web instalable, mira en las herramientas de desarrollo del navegador dónde guarda sus datos y comprueba que están asociados a su dirección. No uses datos ni credenciales reales. Este apartado no se registra en la app ni cuenta para el curso.

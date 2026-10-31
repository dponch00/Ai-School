# Laboratorio M01: cinco encargos en la semana de cierre

:::decision
Vas a acompañar a la analista de FP&A de Altiplano durante la semana de cierre del trimestre. Le llegan cinco encargos distintos, y para cada uno hay que decidir qué herramienta usar, qué necesita, cómo se verifica y cuánto cuesta. Al final llega una noticia de Legal que obliga a revisar una de esas decisiones.
:::

Calcula unos 30 minutos [H]. Son siete pasos y doce preguntas repartidas entre ellos, y cada respuesta trae la explicación de por qué es o no la mejor opción. No hay nada que entregar ni que llenar: el laboratorio cuenta como hecho cuando respondes todas sus preguntas. Todos los datos son sintéticos y pertenecen a Altiplano Industrial S.A., la empresa ficticia del curso.

## Paso 1 · Los cinco encargos {#paso-1}

El lunes por la mañana, la analista tiene esta lista:

1. **La presentación del directorio.** Un texto breve con el margen por región del trimestre y un gráfico de barras con esas cifras.
2. **El impuesto nuevo.** Ayer se anunció un impuesto a ciertas importaciones, y Comercial quiere saber si afecta los precios de lista de la semana próxima.
3. **El error de las comisiones.** El script de comisiones del repositorio redondea mal algunos montos y hay que corregirlo con su prueba.
4. **Las renovaciones.** Cada trimestre hay que extraer de unos 800 contratos de clientes la fecha de renovación y la cláusula de ajuste de precios.
5. **La documentación nocturna.** Durante la noche, poner al día la documentación del dashboard y sus pruebas, para revisarlo todo por la mañana.

Antes de elegir herramientas, un compañero cuenta dos cosas que le pasaron el trimestre anterior, cuando delegó un encargo parecido al 5 en una sesión en la nube del agente de código.

::lab-questions{step="paso-1"}

## Paso 2 · Qué herramienta para cada encargo {#paso-2}

Para elegir, la analista usa las cuatro preguntas de :ref[la lección 2]{to=m01-l2#cuatro-preguntas}: qué tiene que tocar la herramienta, si necesita información reciente, si el resultado se ejecuta o se lee, y cómo se va a comprobar. El encargo 3 queda resuelto rápido: es un cambio pequeño en el repositorio y conviene guiarlo de cerca, así que va a un agente de código en sesión local. Quedan los otros.

::lab-questions{step="paso-2"}

## Paso 3 · Qué necesita cada encargo para funcionar {#paso-3}

Elegir la herramienta no basta: también hay que darle lo que necesita. Algunos encargos dependen de información posterior a la fecha de corte del modelo, y otros mueven tanto material que hay que pensar qué entra en el contexto.

::lab-questions{step="paso-3"}

## Paso 4 · Cómo se verifica cada resultado {#paso-4}

A media semana llegan los primeros resultados. El asistente del encargo 2 responde con una cifra y un enlace, y el agente del encargo 3 cierra con un reporte. Ninguno de los dos se usa sin comprobar.

::lab-questions{step="paso-4"}

## Paso 5 · Configuración y costo de las renovaciones {#paso-5}

El encargo 4 es el de más volumen: unos 800 contratos por trimestre, sin urgencia, porque basta con tener el resultado antes del comité de renovaciones. La analista tiene 40 contratos revisados a mano, con los campos correctos, que puede usar como muestra.

::lab-questions{step="paso-5"}

## Paso 6 · Dos asistentes para la presentación {#paso-6}

Para el texto del encargo 1, el equipo duda entre dos asistentes. La analista decide compararlos en lugar de elegir por costumbre.

::lab-questions{step="paso-6"}

## Paso 7 · La noticia de Legal {#paso-7}

El jueves, Legal informa que los contratos del encargo 4 contienen datos personales de los firmantes, y que la política interna prohíbe procesarlos en planes individuales de cualquier herramienta. Hay que revisar la decisión del paso 5.

::lab-questions{step="paso-7"}

## Pruébalo en tu entorno (opcional) {#en-tu-entorno}

Si quieres practicar con herramientas reales, toma una tarea de tu trabajo que se parezca al encargo 1 y compara dos asistentes como en el paso 6: las mismas entradas, tres ensayos con cada uno, un criterio crítico que se compruebe sin opinión y las condiciones anotadas (producto, superficie, modelo, esfuerzo y fecha). Usa solo datos que puedas compartir con esas herramientas. Este apartado no se registra en la app ni cuenta para nada.

# Guía de estilo

**Versión:** 1.0 · **Fecha:** 2026-10-21 · **Decisión:** D-021

Esta guía define cómo suena AI School. La aplica el agente revisor de texto (`.claude/agents/revisor-de-texto.md`) a todo contenido antes de la revisión de Codex, y la usa cualquier autor, persona o agente.

## 1. La voz

Escribimos como un buen autor de libros de aprendizaje: alguien que sabe del tema, que ha enseñado a adultos ocupados y que respeta su tiempo. Explica con calma, conecta una idea con la siguiente y pone un ejemplo antes de enunciar la regla. No vende, no exagera y no presume.

El lector es Daniel: profesional de finanzas, con experiencia real usando IA, que quiere entender **por qué** algo funciona y no solo memorizar recetas. Lee en español latinoamericano. Conoce de sobra los términos de su oficio (pipeline, forecast, cobertura, FP&A); no conoce necesariamente los del software.

**Prueba de la voz:** si un párrafo se pudiera leer en voz alta en una clase sin que suene raro, va bien. Si suena a ficha técnica, a presentación de diapositivas o a traducción, hay que reescribirlo.

## 2. Reglas

### 2.1 Explicar, no enumerar

- La lección es **prosa que razona**. Las listas sirven para pasos o para opciones paralelas, no para sustituir una explicación.
- Cada párrafo desarrolla una idea y se conecta con el anterior: «por eso», «en cambio», «el problema es que», «dicho de otro modo».
- Nada de frases telegráficas encadenadas («Es un diagnóstico. El entregable es un informe. No hace falta tocar código.»). Únelas en una frase que se lea natural.

### 2.2 El ejemplo antes que la regla

Primero la situación concreta (un correo, una cifra, un error) y después el principio que se saca de ella. Una regla sin ejemplo no se recuerda.

### 2.3 Español claro, sin calcos

| Evitar | Mejor |
| --- | --- |
| «da respuestas más dirigidas» | «responde mejor a lo que necesitas» |
| «qué habilitará el resultado» | «para qué vas a usar el resultado» |
| «declara ambición, no un objetivo» | «expresa un deseo, pero no dice qué hay que hacer» |
| «el entregable», «el terminado» (como sustantivos) | «lo que te va a entregar», «cuándo está listo» |
| «Terminado cuando…» | «Está listo cuando…» |
| «aplica la prueba del colega» | «imagina que se lo pides a un colega nuevo» |
| «decide por ti» repetido como eslogan | dilo una vez, con un ejemplo |
| «hacer sentido» | «tener sentido» |
| «en su lugar», «de forma directa» en exceso | «en cambio», «directamente», o reformular |
| verbos sustantivados: «la realización de», «la verificación de» | el verbo: «hacer», «verificar» |

### 2.4 Términos técnicos

- Un término nuevo se explica **la primera vez**, dentro de la frase y sin interrumpirla: «un *diff* (la lista de líneas que cambiaron)».
- Los anglicismos del oficio de Daniel (pipeline, forecast, dashboard, snapshot) se usan sin cursiva ni disculpas. Los del software se explican una vez.
- No se mezclan dos palabras para lo mismo en una lección: si dijimos «especificación», no cambiamos a «spec».

### 2.5 Énfasis y signos

- Como máximo **una negrita por párrafo**, y solo si el lector la necesita para escanear. Nunca frases enteras en negrita.
- Pocos dos puntos. Si una frase tiene dos, sobra uno.
- Nada de eslóganes al cierre de un párrafo («No tienes una tarea: tienes una idea»). Si la idea es buena, se explica.
- Nada de «Fíjate en…», «Recuerda que…», «Es importante destacar…». Se dice la cosa.

### 2.6 Interrupciones

- Una lección tiene **como máximo dos fichas de producto**, colocadas al final del apartado al que pertenecen, nunca en mitad de una explicación. Si hay más detalles de producto, se agrupan en una sola ficha.
- Las citas se mantienen, pero no se acumulan: una por afirmación importante, al final de la frase.
- La marca `[inferencia]` se mantiene en el texto fuente para la trazabilidad; la app la muestra de forma discreta.

### 2.7 Coherencia y verdad

- Cada frase debe ser **verdad y tener sentido** para quien la lee. Si un ejemplo no ilustra lo que dice el texto, se cambia el ejemplo o el texto.
- No se inventan datos, cifras ni afirmaciones. Reescribir no es cambiar lo que dicen las fuentes: cada `:cite[...]` sigue junto a la afirmación que respalda.
- Las preguntas de comprobación miden lo que la lección enseña con las mismas palabras clave. Si cambia un término en la lección, se revisa en las preguntas.

## 3. Lo que no se toca al revisar

- Las directivas (`:::decision`, `::product-card{…}`, `::check-questions`…) y su orden según el patrón de lección.
- Los IDs de los encabezados (`{#porque}`): las preguntas los usan para enlazar.
- Las citas `:cite[...]` y lo que afirman.
- Los datos del caso Altiplano y sus cifras.
- La regla de dos capas (D-019): el cuerpo no nombra productos ni proveedores.

## 4. Antes y después

**Antes:**

> Cuando le pides algo a un colega nuevo, le explicas para qué es. Con un modelo pasa lo mismo: cuando la instrucción explica su motivación, el modelo generaliza mejor y da respuestas más dirigidas. Conviene decir para qué tarea mayor es el trabajo, para quién y qué habilitará el resultado.

**Después:**

> Si le pides un reporte a alguien que acaba de entrar al equipo, lo primero que hace es preguntarte para qué lo quieres. No es curiosidad: sin saberlo, no puede decidir qué incluir. Con un modelo pasa exactamente lo mismo. Cuando le explicas el motivo de lo que pides, entiende mejor qué es importante y acierta más. Por eso conviene contarle de qué trabajo forma parte el encargo, quién lo va a usar y para qué.

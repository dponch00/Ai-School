# Laboratorio M02: de una petición ambigua a una especificación verificable

:::decision
Vas a partir de un correo tan vago como los que llegan un viernes por la tarde y vas a convertirlo en una especificación que cualquier agente pueda ejecutar y que cualquier persona pueda verificar. Al final llega un cambio inesperado, y con él vas a ver si tu especificación aguanta.
:::

Calcula entre 75 y 90 minutos, repartidos en dos o tres sesiones. Esa cifra es una hipótesis [H], así que anota cuánto tardas tú: con ese dato se corrige la estimación. Todos los datos son sintéticos y pertenecen a Altiplano Industrial S.A., la empresa ficticia del curso; ninguna cifra es real.

## Lo que entregas {#entregables}

Al terminar tendrás tres archivos que, juntos, forman tu especificación. El brief dice qué hay que hacer y con qué datos, los criterios de aceptación dicen cuándo está listo, y el prompt de ejecución es el encargo que le darías a un agente. A eso se suma el cuaderno de decisiones, que escribes en la app.

| Archivo | Contenido | Obligatorio |
| --- | --- | --- |
| `brief.md` | Ambigüedades clasificadas, objetivo, alcance, definiciones de KPI, registro de supuestos y casos de prueba | Sí |
| `criterios.feature` | Al menos 5 escenarios Given/When/Then, uno negativo como mínimo | Sí |
| `prompt_ejecucion.md` | El prompt que le darías a un agente de código, con hitos, política de ambigüedad y evidencia exigida | Sí |
| Cuaderno de decisiones | Las cuatro piezas del paso 6, escritas en la app | Sí |
| `comparacion.md` | Resultado de ejecutar tu prompt con un agente en tu entorno | Opcional |

La app no ejecuta código. Lo que haya que ejecutar, ya sea el agente o el script de reconciliación, corre en tu computadora, y en la app registras el texto y la evidencia.

## Paso 1 · Lee la petición y lista las ambigüedades {#paso-1}

Este correo llega el viernes a las 18:40:

> **Asunto:** dashboard pipeline
>
> Hola, para el comité del lunes necesito un dashboard del pipeline que se vea bien y muestre cómo vamos. Que tenga lo importante y algún comentario de IA que lo explique. Usa los datos del CRM que te pasó Marta. Gracias.
>
> — R. Ibáñez, director financiero (ficticio)

Los datos que te pasó Marta están en `practice/data/`: el snapshot de oportunidades del 2026-10-19 (unas 40 filas), la tabla de probabilidades por etapa de FP&A, los tipos de cambio, la cuota y lo ganado en el T4.

Haz una lista de al menos 10 ambigüedades y clasifica cada una según la política de la lección 2:

- **Preguntar:** cambia una cifra visible, el alcance o algo irreversible.
- **Asumir y registrar:** no cambia cifras, así que la decides tú y la dejas escrita con su motivo.
- **Fuera de alcance:** no forma parte de esta entrega.

No cierres la lista sin abrir los datos. Algunos problemas no están en el correo, sino en los archivos.

## Paso 2 · Las respuestas del director {#paso-2}

Abre esta tarjeta solo cuando hayas terminado el paso 1. Si la lees antes, ya no sabrás qué ambigüedades habías encontrado por tu cuenta.

::::reveal{title="Respuestas de R. Ibáñez"}
- **Para quién y para qué:** para el comité comercial, que tiene que decidir en qué oportunidades enfocar el seguimiento de la semana.
- **Periodo:** el cuarto trimestre de 2026 (octubre a diciembre). El año fiscal coincide con el calendario.
- **Moneda:** USD, con las tasas de `fx_rates.csv` a la fecha del snapshot.
- **«Pipeline»:** las oportunidades abiertas. Quiere ver el total y el ponderado por la tabla de FP&A.
- **Cobertura:** pipeline abierto del T4 / (cuota del T4 − ganado en el T4).
- **Detalle:** por región, y las 10 oportunidades en mayor riesgo.
- **Formato:** una página HTML estática que se lea bien en portátil y en celular.
- **Comentario de IA:** 120 palabras como máximo, basado solo en cifras calculadas.
- **Plazo:** para el lunes basta una primera versión, sin navegación de detalle.

Hay dos cosas que el director no sabe:

- qué hacer con las oportunidades duplicadas;
- qué significa «en riesgo».
::::

Vuelve a tu lista con estas respuestas. Algunas ambigüedades quedaron resueltas; las que siguen abiertas necesitan un plan, y ese plan va en el brief.

## Paso 3 · Escribe el brief {#paso-3}

El brief es el documento que reúne lo que preparaste en las lecciones 1 a 3. Se parece a la especificación de la lección 4, pero no es idéntico: aquí todavía no hay código, así que los archivos e interfaces se reducen al contrato de salida, y la condición de «está listo» la escribirás en el paso 4, como criterios de aceptación. En `brief.md` van estas cinco partes:

1. **Objetivo y decisión:** usuario, decisión, periodo y umbral (lección 1).
2. **Alcance:** qué entra, qué queda fuera y qué no puede hacer el agente sin confirmarlo contigo.
3. **Definiciones de KPI:** fórmula, unidad, moneda y fuente de cada uno, es decir, del pipeline abierto, el pipeline ponderado, la cobertura y el conteo de vencidas.
4. **Registro de supuestos:** ID, supuesto, dueño, estado y política (preguntar o decidir), como en la lección 2. Las dos preguntas que el director no supo responder tienen que estar aquí, junto con lo que harás mientras no haya respuesta.
5. **Casos de prueba y contraejemplos:** al menos 5 casos sobre los datos, cada uno con su valor esperado. Al menos 2 tienen que tratar de calidad de datos, y al menos 1 debe ser un contraejemplo sobre el comentario narrativo (lección 3).

Los KPI salen con el formato del contrato `pipeline_kpis` v1 de la lección 3 (`practice/data/pipeline_kpis.schema.json`). No hace falta copiarlo en el brief: basta con citarlo y añadir las invariantes que comprobarías en código.

## Paso 4 · Escribe los criterios de aceptación {#paso-4}

En `criterios.feature` escribe al menos 5 escenarios con el formato Given/When/Then de la lección 6. La parte que más cuidado pide es el Then, que tiene que describir algo que se pueda observar (una cifra en pantalla, una fila en un panel, un aviso) y no un estado interno del sistema. Al menos uno de los escenarios debe ser negativo, es decir, describir algo que no debe pasar y dónde tiene que aparecer en cambio. Y cada escenario tiene que poder rastrearse hasta una parte del objetivo: si no puedes decir a qué parte responde, revísalo.

## Paso 5 · Escribe el prompt de ejecución {#paso-5}

En `prompt_ejecucion.md` va el texto que le darías a un agente de código al abrir una sesión nueva. Debe incluir cinco cosas:

- una referencia al brief y al contrato, sin copiarlos, para que cada regla exista en una sola versión;
- los hitos, cada uno con su prueba, y un punto de control humano (lección 5);
- la política de ambigüedad, que dice qué debe preguntarte y qué puede decidir y registrar;
- la evidencia que exiges en el reporte final: archivos cambiados, comandos y lo que devolvieron, reconciliación, supuestos usados y pendientes (lección 6);
- los límites de acción, es decir, lo que no puede hacer sin confirmarlo contigo.

No le pidas que muestre su razonamiento interno. Pídele decisiones, supuestos y evidencia.

## Paso 6 · Cuaderno de decisiones: el cambio del lunes {#paso-6}

Antes de abrir la tarjeta, escribe en el cuaderno tu decisión inicial: qué dice tu especificación que debe hacer el agente si encuentra una etapa que no está en la tabla de probabilidades.

Ahora sí, ábrela:

::::reveal{title="Lunes, 8:15"}
Marta envía el snapshot del 2026-10-26 (`practice/data/opportunities_snapshot_2026-10-26.csv`). Trae una etapa nueva, «En pausa», con tres oportunidades del Centro. FP&A todavía no le ha asignado probabilidad.
::::

Con esa información, completa las cuatro piezas del cuaderno:

1. **Decisión inicial:** lo que habías escrito antes de abrir la tarjeta.
2. **Contraejemplo:** qué pasaría si un agente ejecutara tu especificación, tal como está, con el snapshot nuevo. Compruébalo corriendo el script de reconciliación sobre ese snapshot dos veces, primero sin declarar en `supuestos.json` qué hacer con las etapas sin probabilidad y después declarándolo, y anota qué cifras cambian en cada caso:

   ```bash
   python practice/data/reconcile.py --data-dir practice/data --snapshot opportunities_snapshot_2026-10-26.csv --kpis practice/data/expected/kpis_correct.json --assumptions supuestos.json
   ```

   Los KPI de ejemplo corresponden al snapshot del 19, así que el script va a marcar diferencias en las cifras. Lo que te interesa aquí es qué hace con la etapa nueva.
3. **Decisión revisada:** qué cambias en la especificación, si cambias algo, y por qué.
4. **Evidencia:** el dato, el caso o la regla que te hizo cambiar de criterio o, si no cambiaste nada, lo que demuestra que tu especificación ya cubría el caso.

## Paso 7 · Opcional: ejecútalo con un agente {#paso-7}

Si quieres ver tu especificación en acción, ejecuta en tu propio entorno dos versiones con un agente de código: la **A** es la petición original del director y la **B** es tu prompt de ejecución. Si el costo lo permite, haz al menos 3 ensayos por versión. Después comprueba cada resultado con el script de reconciliación, ejecutándolo desde la carpeta del manual (`content/courses/m02` en el repositorio, o la carpeta donde descargaste los materiales del laboratorio):

```bash
python practice/data/reconcile.py --data-dir practice/data --kpis kpis.json --assumptions supuestos.json
```

En `supuestos.json` declaras tus decisiones: la moneda, la política de duplicados y qué hacer con las etapas sin probabilidad. El script se detiene si falta un supuesto que cambia cifras, avisa de cada exclusión y compara cada KPI y cada problema de calidad de datos.

En `comparacion.md` anota el modelo y la fecha, el número de ensayos, el resultado de la reconciliación en cada uno y lo que viste al leer las transcripciones. Antes de ejecutar nada, deja escrita tu regla de decisión, es decir, qué resultado te haría preferir una versión a la otra; por ejemplo, si te basta con que pase la reconciliación una vez o exiges que la pase en todos los ensayos. Este paso no cuenta para aprobar. Es un primer acercamiento a la comparación de prompts, que M09 desarrolla a fondo.

## Antes de entregar: autoevaluación {#autoevaluacion}

Revisa tu entrega con la rúbrica criterio por criterio y, en cada uno, cita la parte de tu entrega que lo demuestra. Después, la entrega puede pasar por una revisión externa, que es independiente de la tuya: una autoevaluación nunca cuenta como revisión.

# Laboratorio M02: de una petición ambigua a una especificación verificable

:::decision
Vas a convertir una petición real de tan mala calidad como las que llegan un viernes en una especificación que **cualquier agente pueda ejecutar y cualquier persona pueda verificar**. Al final, un cambio inesperado pondrá a prueba si tu especificación aguanta.
:::

**Tiempo estimado:** de 75 a 90 minutos, en dos o tres sesiones. **Datos:** sintéticos, de la empresa ficticia Altiplano Industrial S.A. Ninguna cifra es real.

## Lo que entregas {#entregables}

| Archivo | Contenido | Obligatorio |
| --- | --- | --- |
| `brief.md` | Ambigüedades clasificadas, objetivo, alcance, definiciones de KPI, registro de supuestos y casos de prueba | Sí |
| `criterios.feature` | Al menos 5 escenarios Given/When/Then, uno negativo como mínimo | Sí |
| `prompt_ejecucion.md` | El prompt que le darías a un agente de código, con hitos, política de ambigüedad y evidencia exigida | Sí |
| Cuaderno de decisiones | Las cuatro piezas del paso 6, escritas en la app | Sí |
| `comparacion.md` | Resultado de ejecutar tu prompt con un agente en tu entorno | Opcional |

La app no ejecuta código. Todo lo que se ejecuta (el agente y el check de reconciliación) corre en tu computadora; en la app registras el texto y la evidencia.

## Paso 1 · Lee la petición y lista las ambigüedades {#paso-1}

Este correo llega el viernes a las 18:40:

> **Asunto:** dashboard pipeline
>
> Hola, para el comité del lunes necesito un dashboard del pipeline que se vea bien y muestre cómo vamos. Que tenga lo importante y algún comentario de IA que lo explique. Usa los datos del CRM que te pasó Marta. Gracias.
>
> — R. Ibáñez, director financiero (ficticio)

Los datos que te pasó Marta están en `practice/data/`: el snapshot de oportunidades del 2026-10-19 (unas 40 filas), la tabla de probabilidades por etapa de FP&A, los tipos de cambio, la cuota y lo ganado en el T4.

**Tu tarea:** lista **al menos 10 ambigüedades** y clasifica cada una:

- **Preguntar:** cambia una cifra visible, el alcance o algo irreversible (política de la lección 2).
- **Asumir y registrar:** no cambia cifras; la decides tú y la dejas escrita con su motivo.
- **Fuera de alcance:** no forma parte de esta entrega.

Revisa los datos antes de terminar la lista: hay problemas que solo se ven ahí.

## Paso 2 · Las respuestas del director {#paso-2}

Abre esta tarjeta **solo después de terminar el paso 1**.

::::reveal{title="Respuestas de R. Ibáñez"}
- **Para quién:** el comité comercial. **Para qué:** decidir en qué oportunidades enfocar el seguimiento de la semana.
- **Periodo:** el cuarto trimestre de 2026 (octubre a diciembre). El año fiscal coincide con el calendario.
- **Moneda:** USD, con las tasas de `fx_rates.csv` a la fecha del snapshot.
- **«Pipeline»:** oportunidades abiertas. Quiere ver el total y el ponderado por la tabla de FP&A.
- **Cobertura:** pipeline abierto del T4 / (cuota del T4 − ganado en el T4).
- **Detalle:** por región, y las 10 oportunidades en mayor riesgo.
- **Formato:** una página HTML estática que se lea bien en portátil y en celular.
- **Comentario de IA:** 120 palabras como máximo, basado solo en cifras calculadas.
- **Plazo:** para el lunes basta una primera versión, sin navegación de detalle.

Dos cosas **no las sabe** el director:

- qué hacer con las oportunidades duplicadas;
- qué significa «en riesgo».
::::

Actualiza tu lista: ¿cuáles quedaron resueltas? ¿Cuáles siguen abiertas y qué harás con ellas?

## Paso 3 · Escribe el brief {#paso-3}

En `brief.md`, con las cinco partes de la lección 4:

1. **Objetivo y decisión:** usuario, decisión, periodo y umbral (lección 1).
2. **Alcance:** dentro, fuera y límites de acción del agente.
3. **Definiciones de KPI:** para cada uno, fórmula, unidad, moneda y fuente. Pipeline abierto, pipeline ponderado, cobertura y conteo de vencidas.
4. **Registro de supuestos:** ID, supuesto, dueño, estado y política (preguntar o decidir), como en la lección 2. Las dos preguntas sin respuesta del director tienen que aparecer, con lo que harás mientras tanto.
5. **Casos de prueba y contraejemplos:** al menos 5 casos sobre los datos, con su valor esperado. Al menos 2 sobre calidad de datos y 1 contraejemplo sobre el comentario narrativo (lección 3).

El formato de salida de los KPI es el contrato **pipeline_kpis v1** de la lección 3 (`practice/data/pipeline_kpis.schema.json`). No hace falta reescribirlo; cítalo y añade las invariantes que comprobarías en código.

## Paso 4 · Escribe los criterios de aceptación {#paso-4}

En `criterios.feature`, al menos **5 escenarios** Given/When/Then (lección 6):

- cada **Then** describe algo observable, no un estado interno;
- al menos **uno es negativo** (lo que no debe pasar y dónde debe aparecer en su lugar);
- cada escenario se puede trazar a una parte del objetivo.

## Paso 5 · Escribe el prompt de ejecución {#paso-5}

En `prompt_ejecucion.md`, el texto que le darías a un agente de código en una sesión nueva:

- referencia al brief y al contrato, en lugar de copiarlos;
- **hitos**, cada uno con su prueba, y un punto de control humano (lección 5);
- **política de ambigüedad:** qué debe preguntarte y qué puede decidir y registrar;
- **evidencia exigida** en el reporte final: archivos cambiados, comandos y su resultado, reconciliación, supuestos usados y pendientes (lección 6);
- **límites de acción:** qué no puede hacer sin confirmar.

No pidas que muestre su razonamiento interno: pide decisiones, supuestos y evidencia.

## Paso 6 · Cuaderno de decisiones: el cambio del lunes {#paso-6}

Primero escribe en el cuaderno tu **decisión inicial**: qué dice tu especificación que debe hacer el agente si encuentra una etapa que no está en la tabla de probabilidades.

Después abre el cambio:

::::reveal{title="Lunes, 8:15"}
Marta envía el snapshot del 2026-10-26. Trae una etapa nueva, **«En pausa»**, con tres oportunidades del Centro que suman USD 410 000. FP&A todavía no le ha asignado probabilidad.
::::

Completa el cuaderno:

1. **Decisión inicial:** lo que habías escrito.
2. **Contraejemplo:** qué pasaría con tu especificación tal como está, cifra por cifra, si un agente la ejecutara con el snapshot nuevo.
3. **Decisión revisada:** qué cambias en la especificación (si cambias algo) y por qué.
4. **Evidencia:** qué dato, caso o regla te hizo cambiar de criterio, o por qué tu especificación ya cubría el caso.

Si tu especificación ya decía «detente y reporta», el cuaderno lo demuestra: también eso es evidencia.

## Paso 7 · Opcional: ejecútalo con un agente {#paso-7}

En tu propio entorno, ejecuta dos versiones con un agente de código: **A**, la petición original del director, y **B**, tu prompt de ejecución. Si el costo lo permite, haz al menos 3 ensayos por versión. Después comprueba cada resultado con el check:

```bash
python practice/data/reconcile.py --data-dir practice/data --kpis kpis.json --assumptions supuestos.json
```

`supuestos.json` declara tus decisiones (moneda, política de duplicados, qué hacer con etapas sin probabilidad). El check se detiene si falta un supuesto que cambia cifras, avisa de cada exclusión y compara cada KPI y cada problema de calidad.

En `comparacion.md` registra: modelo y fecha, número de ensayos, resultado del check en cada uno y qué leíste en las transcripciones. Fija tu regla de decisión **antes** de ejecutar. Este paso no cuenta para aprobar; sirve de puente con M09.

## Antes de entregar: autoevaluación {#autoevaluacion}

Evalúa tu entrega con la rúbrica, **criterio por criterio, citando la parte de tu entrega** que lo demuestra. Después la entrega puede recibir una revisión externa. Una autoevaluación nunca cuenta como revisión.

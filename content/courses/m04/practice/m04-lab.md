# Laboratorio M04: la etapa que dejó de estar cerrada

:::decision
Vas a revisar, junto a la analista de FP&A de Altiplano, un cambio que un agente hizo en el repositorio del pipeline. El encargo era pequeño, pero la reconciliación falló en las tres regiones. En seis pasos hay que preparar el terreno, leer la salida del check, encontrar la línea responsable, entender qué controla la configuración que el agente tocó, recuperar lo bueno sin perder lo pedido y decidir qué hacer con la corrección que propone el agente.
:::

Calcula unos 30 minutos [H]. Son seis pasos con dos preguntas cada uno, y cada respuesta trae la explicación de por qué es o no la mejor opción. No hay nada que entregar ni que llenar: el laboratorio cuenta como hecho cuando respondes todas sus preguntas. Todos los datos son sintéticos y pertenecen a Altiplano Industrial S.A., la empresa ficticia del curso.

## Paso 1 · El encargo y el punto de partida {#paso-1}

La analista le pidió al agente: «Unifica cómo se escriben los nombres de las etapas en el reporte. No toques el cálculo ni los datos». El historial del repositorio quedó así:

- **c1** · «Calcula KPIs del pipeline». La reconciliación pasa.
- **c2** · «Unifica nombres de etapas», el commit del agente. Ya está en la rama principal compartida.

Antes de revisar, la analista guarda sus notas de trabajo en un commit para dejar la carpeta limpia. Cuando mira el resumen de c2 con `--stat`, aparece un archivo que no esperaba: `.env`, con la línea `ALTIPLANO_CRM_TOKEN=TOKEN_FICTICIO_NO_REAL`.

::lab-questions{step="paso-1"}

## Paso 2 · Lo que dice la reconciliación {#paso-2}

La analista corre la reconciliación sobre la salida de c2. Estas son las líneas que fallan:

```text
FAIL open_pipeline Norte: dashboard=1261500.00 esperado=1201500.00 diferencia=60000.00 tolerancia=0.01
FAIL open_pipeline Centro: dashboard=1405500.00 esperado=1330500.00 diferencia=75000.00 tolerancia=0.01
FAIL open_pipeline Sur: dashboard=1310000.00 esperado=1240000.00 diferencia=70000.00 tolerancia=0.01
FAIL overdue_count Norte: dashboard=3 esperado=2 diferencia=1 tolerancia=0
```

Fallan también las vencidas del Centro y del Sur, las tres coberturas y los totales. El pipeline ponderado, en cambio, pasa en las tres regiones. El programa termina con código 1. En la tabla de probabilidades aprobada por FP&A, la etapa Perdida tiene probabilidad 0.

::lab-questions{step="paso-2"}

## Paso 3 · La línea responsable {#paso-3}

`git diff c1 c2 --stat` muestra que c2 tocó tres archivos: `report.py`, `pipeline_kpis.py` y `.env`. El cambio de `report.py` es el que se pidió. En `pipeline_kpis.py` hay una sola línea distinta:

```diff
-CLOSED_STAGES = {"Ganada", "Perdida"}
+CLOSED_STAGES = {"Ganada"}
```

Más abajo, sin cambios, el cálculo usa esa lista así:

```python
is_open = stage not in CLOSED_STAGES
```

::lab-questions{step="paso-3"}

## Paso 4 · La configuración de la integración continua {#paso-4}

En la pull request (PR) del agente, es decir, en su propuesta para incorporar los cambios, aparece un segundo commit, c3. Este cambia el archivo YAML que define el flujo de integración continua, donde la reconciliación se corre con una línea como esta:

```yaml
run: python reconcile.py --data-dir data --kpis out/pipeline_kpis.json --assumptions expected/assumptions_reference.json --tolerance 80000
```

Antes decía `--tolerance 0.01`. La documentación del check dice que la tolerancia se aplica a los montos, que las coberturas admiten como máximo 0,0001 y que los conteos deben coincidir exactamente. Además, el agente sangró una línea nueva del mismo archivo con un tabulador.

::lab-questions{step="paso-4"}

## Paso 5 · Recuperar sin perder lo pedido {#paso-5}

La analista ya revocó el token ficticio en el CRM y sacó `.env` del índice. Falta el cálculo. El commit c2 está en la rama principal que comparte el equipo y mezcla dos cosas: el cambio pedido en `report.py`, que hay que conservar, y la línea equivocada de `pipeline_kpis.py`. La analista trabaja en una rama de revisión, `revision/m04`.

::lab-questions{step="paso-5"}

## Paso 6 · La corrección que propone el agente {#paso-6}

Antes de que la analista termine, el agente abre otra PR, `agente/fix-etapas`. Vuelve a poner «Perdida» en la lista de etapas cerradas, y además borra la prueba `test_overdue_counts` «porque fallaba». El reporte dice: «Corregido; todas las pruebas pasan». Un día después, el agente abre una tercera PR que solo vuelve a poner «Perdida» en la lista, con la salida completa de las pruebas y de la reconciliación con la tolerancia original, todo en verde.

::lab-questions{step="paso-6"}

## Pruébalo en tu entorno (opcional) {#en-tu-entorno}

Si quieres practicar con Git de verdad, crea una carpeta de prueba con un archivo de texto, guárdalo en un primer commit y pídele a un agente que lo modifique. Luego lee el diff, recupera el archivo con `git restore --source` desde el primer commit y comprueba con `git status` y `git log --oneline` que quedó como esperabas. Usa solo archivos de prueba, nunca un repositorio de trabajo. Este apartado no se registra en la app ni cuenta para nada.

# M04 — Código, Git y entornos para dirigir agentes · Base de investigación

- **Archivo:** `investigacion/M04-codigo-git-entornos.md`
- **Fecha de investigación:** 2026-10-22 (todas las fuentes consultadas ese día, también las reutilizadas del registro)
- **Elaborado por:** subagente de investigación (Claude Code) para el autor de M04
- **Estado:** base factual y conceptual para redactar las 6 lecciones, el laboratorio y el banco de M04. No es contenido final para el alumno.
- **Convenciones (las mismas que M02):**
  - `[src-…]` = ID de fuente del registro (§6). La afirmación está documentada en esa fuente (parafraseada).
  - `[inferencia]` = conclusión, síntesis o recomendación propia que ninguna fuente afirma literalmente.
  - **Ficha** = afirmación que depende de un producto o una versión. Según D-019 va en una ficha de producto fechada, nunca en el cuerpo de la lección. En este documento se marca con «Ficha candidata» y fecha de verificación.
  - Citas textuales: como máximo una por fuente y de menos de 15 palabras.
- **Datos:** todos los ejemplos usan el caso ficticio Altiplano Industrial S.A. (M02 §2.0) y los archivos sintéticos de `content/courses/m02/practice/data/`. Ninguna cifra es real. Los tokens o claves de los ejemplos son marcadores evidentes (`TOKEN_FICTICIO_…`), nunca valores con forma de credencial real.
- **Alumno:** profesional de finanzas que dirige agentes de código. No se forma a un programador: se forma a alguien capaz de leer, ubicar, aislar, recuperar y decidir si acepta un cambio (`docs/curriculum.md`, M04, «Alcance»).

---

## 1. Resumen ejecutivo

1. **El principio rector de M04 es duradero y casi no cambia con los productos:** Git guarda instantáneas confirmadas de las que casi siempre se puede volver, mientras que lo no confirmado se puede perder para siempre [src-progit-what-is-git][src-progit-undoing]. De ahí sale la regla práctica del manual: antes de dejar trabajar a un agente, el punto de partida debe estar en un commit.
2. **Un checkpoint de la herramienta no es un commit.** Las tres familias de producto documentan puntos de restauración de sesión, y las dos que los describen con detalle advierten que no sustituyen a Git y que no deshacen todo: los cambios hechos por comandos de terminal, procesos externos o acciones remotas pueden quedar fuera [src-anthropic-cc-checkpointing][src-vscode-copilot-checkpoints]. En el tercer producto no encontré un checkpoint documentado, solo un panel para revertir cambios sin confirmar [src-openai-codex-code-review] (ver Huecos).
3. **Recuperar no es un solo comando.** Git distingue tres operaciones: `revert` crea un commit nuevo que deshace otro y conserva la historia; `restore` copia archivos desde el índice o desde otro commit sin mover la rama; `reset` mueve la punta de la rama y cambia la historia [src-git-reset-restore-revert]. Para un alumno no programador, `revert` y `restore --source` cubren casi todos los casos; `reset --hard` va a «enseñar con cautela» (§4).
4. **Ramas y worktrees aíslan, pero aíslan cosas distintas.** Una rama es un puntero barato a un commit [src-progit-branches]; un worktree es una carpeta de trabajo adicional con su propio `HEAD` e índice, que comparte el historial del repositorio [src-git-worktree]. Como un worktree es un checkout limpio, no trae archivos ignorados como `.env` ni las dependencias instaladas, y hay que preparar el entorno en él [src-anthropic-cc-worktrees][src-openai-codex-worktrees].
5. **Secretos: borrar no es revocar.** Un archivo ignorado por `.gitignore` sigue en el repositorio si ya estaba rastreado [src-git-gitignore]; un secreto que llegó a un commit sigue en la historia y en clones, forks y vistas en caché. La primera acción es revocar o rotar la credencial [src-github-remove-sensitive-data][src-owasp-secrets-mgmt].
6. **Leer código para revisar es leer entradas, condiciones y salidas.** En el caso Altiplano, un solo carácter (`<` frente a `<=` en el límite del trimestre) mueve el pipeline abierto del Sur en USD 58 000 (simulado sobre los datos sintéticos de M02, §5). En SQL, `= NULL` nunca es verdadero, `count(*)` y `count(columna)` cuentan cosas distintas y `sum` de cero filas devuelve nulo, no cero [src-postgres-comparison][src-postgres-aggregate].
7. **Un check en verde no prueba que el cambio sea correcto.** Un check solo cubre los datos y casos que contiene: en la simulación de §5, cambiar `<` por `<=` en la regla de «vencida» pasa la reconciliación porque ninguna oportunidad sintética cierra justo el día del snapshot. [inferencia] apoyada en que los checks y revisores automáticos no garantizan encontrar todos los problemas [src-github-copilot-code-review].
8. **Errores y CI se leen de abajo hacia arriba y desde el primer paso fallido.** En un traceback de Python, la última línea dice qué pasó y las anteriores dónde [src-python-errors]; el código de salida 0 significa éxito y cualquier otro, fallo [src-python-sys]; en GitHub Actions los pasos fallidos aparecen ya expandidos [src-github-actions-logs].
9. **La PR es la unidad de revisión, y el que pidió el cambio no lo aprueba solo.** En el agente en la nube de GitHub, el agente trabaja en su propia rama, abre la PR y no puede aprobarla ni fusionarla; quien lo pidió tampoco puede aprobarla [src-github-cloud-agent-risks]. Los revisores automáticos advierten que pueden equivocarse y no sustituyen la revisión humana [src-github-copilot-code-review].
10. **Volatilidad:** baja en Git, Python, SQL, formatos y secretos (revisión anual). Alta en todo lo que es producto: checkpoints, worktrees gestionados, rutas de configuración y revisores automáticos (fichas con revisión trimestral, próxima 2027-01-22).

---

## 2. Blueprint propuesto (objetivos evaluados del manual)

Seis objetivos, uno por lección, como pide `docs/content-standard.md` §3.3. Cada uno con 2 familias en el banco y 2 ítems en el examen. Los de producción (OE4, OE6) tienen además evidencia en el laboratorio.

| ID | Objetivo evaluado | Competencia | Lección | Evidencia |
| --- | --- | --- | --- | --- |
| M04-OE1 | Dado un fragmento de Python o SQL de hasta ~30 líneas y una entrada concreta del caso Altiplano, **predice la salida o señala la línea que produce una cifra dada**, acertando también en el caso límite (nulo, fecha frontera, fila duplicada). | C05 | L1 (apoyo L2) | Comprobaciones, banco; laboratorio paso 3 |
| M04-OE2 | Dado un archivo de configuración o de datos (JSON, TOML, YAML, Markdown con frontmatter) o un fragmento de TypeScript, **identifica el formato, qué valor controla qué comportamiento y el error de sintaxis o de tipo que lo invalida**, sin confundir un formato con otro. | C05 | L2 | Comprobaciones, banco |
| M04-OE3 | Dado el árbol de carpetas de un proyecto, **clasifica cada elemento (código, datos, configuración, dependencias, entorno, secreto, artefacto generado), decide cuáles se versionan** y, ante un secreto expuesto, **elige como primera acción revocar o rotar**, no solo borrarlo. | C06 (apoyo C05) | L3 | Comprobaciones, banco; laboratorio criterio R4 |
| M04-OE4 | Dado un escenario de trabajo con un agente (experimento arriesgado, trabajo en paralelo, cambio defectuoso ya confirmado o sin confirmar), **elige la operación de Git adecuada (commit, rama, worktree, restore, revert) o el checkpoint, y la ejecuta dejando evidencia verificable** (`git log`, `git status`, check en verde) sin perder trabajo válido. | C06 | L4 | Comprobaciones, banco; laboratorio criterio R3 |
| M04-OE5 | Dado un traceback, un log o la salida de un check de CI, **localiza el archivo, la línea o el paso que falló y propone la causa más probable y el siguiente paso de diagnóstico**, distinguiendo síntoma de causa. | C05 | L5 | Comprobaciones, banco; laboratorio paso 2 |
| M04-OE6 | Dado un diff y el reporte de un agente, **decide aceptar, pedir cambios o rechazar, citando al menos un defecto, un cambio fuera de alcance o una evidencia faltante** con su línea, y sin aceptar un «ya funciona» sin salida verificable. | C05 | L6 | Comprobaciones, banco; laboratorio criterios R1, R2, R5 |

**Notas de diseño [inferencia]:**

- C05 tiene cuatro objetivos y C06 dos. Es coherente con `content/competencies.json` (C05: encontrar un defecto, señalar fuera de alcance, rechazar «ya funciona»; C06: rama o worktree, recuperar, distinguir checkpoint de commit).
- OE1 y OE2 son de comprensión y se miden bien con opción múltiple. OE4 y OE6 son de producción: el laboratorio es la evidencia principal y la opción múltiple mide la decisión, no la ejecución.
- Serie intercalada obligatoria (§3.2 del estándar): **restore / revert / rama / worktree / checkpoint** se confunden entre sí. Después de L4, una serie de 4–6 casos breves que obliguen a elegir.

---

## 3. Lecciones

### 3.0 Material del caso que se reutiliza

M04 no inventa datos nuevos: reutiliza los del laboratorio de M02 (`content/courses/m02/practice/data/`).

| Archivo | Para qué sirve en M04 |
| --- | --- |
| `reconcile.py` | Código real y legible para L1 (funciones `q4_2026`, `dedupe_rows`, `calculate`), para L5 (mensajes `ERROR …`, códigos de salida 0/1/2) y como oráculo del laboratorio |
| `test_reconcile.py` | Pruebas con `unittest` para mostrar qué es un test y qué cubre (L5, L6) |
| `opportunities_snapshot_2026-10-19.csv` | 40 filas sintéticas; incluye OPP-1038 (Sur, USD 58 000, cierre 2026-12-31), clave para el error de frontera |
| `expected/assumptions_reference.json`, `pipeline_kpis.schema.json` | JSON y JSON Schema reales para L2 |
| `expected/kpis_correct.json` y fixtures de error | Salidas para comparar en L5 y en el laboratorio |

Cifras de referencia (calculadas el 2026-10-22 ejecutando `reconcile.py` y copias modificadas en un directorio temporal; los archivos del repo no se tocaron):

| Cambio simulado en el cálculo | Efecto contra `kpis_correct.json` |
| --- | --- |
| Límite del T4 con `<` en vez de `<=` | Pipeline abierto Sur 1 182 000 frente a 1 240 000 (−58 000, OPP-1038); ponderado Sur −5 800; fallan también cobertura Sur y los tres totales |
| `CLOSED_STAGES` sin «Perdida» | Pipeline abierto +60 000 Norte, +75 000 Centro, +70 000 Sur; vencidas 3 por región en vez de 2; el ponderado **no** cambia (probabilidad 0) |
| Regla de vencida con `<=` en vez de `<` | **Pasa** la reconciliación: ninguna oportunidad abierta cierra el 2026-10-19 |

---

### Lección 1 — Leer funciones, condiciones, entradas y salidas (en Python primero)

**Objetivo de lección (→ M04-OE1):** Dado un fragmento de Python del caso Altiplano y una fila de entrada, predice qué devuelve la función y qué rama de la condición se ejecuta, incluido el caso límite.

**Ideas clave**

- **Una función es una caja con entradas y una salida.** `def` introduce la definición; el cuerpo va indentado; `return` devuelve un valor, y una función que termina sin `return` devuelve `None` [src-python-controlflow]. [inferencia] Para revisar, la pregunta útil no es «cómo lo hace» sino «qué entra, qué sale y qué condición decide».
- **La indentación agrupa.** En Python, el bloque de un `if` o de una función se marca con sangría; la guía de estilo del tutorial pide cuatro espacios y no tabuladores [src-python-controlflow]. [inferencia] Un diff que solo cambia la sangría puede cambiar qué líneas están dentro de una condición.
- **`if / elif / else`:** puede haber cero o más `elif` y el `else` es opcional [src-python-controlflow]. [inferencia] La primera condición verdadera gana; el orden importa.
- **Los operadores de comparación en la frontera son la fuente clásica de errores.** [inferencia] `<` y `<=` difieren solo en el valor exacto del límite; por eso el caso que hay que probar a mano es justo el límite (2026-12-31, el día del snapshot). En `reconcile.py`, las fechas se comparan como texto, lo que funciona solo porque todas tienen el formato fijo AAAA-MM-DD [inferencia].
- **Dinero con `Decimal`, no con `float`.** El binario de coma flotante no representa 0,1 exactamente; sumar tres veces 0,1 no da 0,3, y el tutorial recomienda el módulo `decimal` para contabilidad [src-python-floatingpoint]. `reconcile.py` usa `Decimal` construido desde texto [inferencia: observación del código].
- **Argumentos con valor por defecto y por nombre:** el valor por defecto se evalúa una sola vez; los argumentos por nombre van después de los posicionales [src-python-controlflow]. [inferencia] Para un revisor, un cambio en un valor por defecto cambia el comportamiento de todas las llamadas que no lo pasan.
- **Las excepciones son salidas también.** `raise` detiene la función y sube al llamador hasta que alguien la captura o el programa termina [src-python-errors]. En `reconcile.py`, `ReconciliationError` es la forma de decir «no puedo calcular con seguridad» [inferencia: lectura del código].

**Ejemplo con Altiplano (para el caso resuelto)**

```python
def q4_2026(value: str) -> bool:
    return "2026-10-01" <= value <= "2026-12-31"
```

Entrada: la fila de OPP-1038 (Sur, Prospección, USD 58 000, cierre `2026-12-31`). Pregunta de predicción: ¿suma al pipeline del T4? Sí, porque `<=` incluye el 31 de diciembre. Si un agente cambia el segundo operador a `<`, la función devuelve `False` solo para esa fecha y el pipeline abierto del Sur cae de 1 240 000 a 1 182 000 (§3.0). Ejemplo para completar: la misma pregunta con `close_date < row["snapshot_date"]` (regla de vencida) para OPP-1004 (cierre 2026-10-10, snapshot 2026-10-19) y para una oportunidad hipotética que cierre el 2026-10-19.

**Conceptos erróneos frecuentes (distractores)**

| ID | Creencia errónea | Por qué es errónea | Fuente |
| --- | --- | --- | --- |
| M04-CE01 | «Si el código corre sin error, la cifra está bien.» | Un operador de frontera mal puesto no produce error: produce otra cifra. | [inferencia]; simulación §3.0 |
| M04-CE02 | «Una función sin `return` devuelve 0 o vacío.» | Devuelve `None`. | [src-python-controlflow] |
| M04-CE03 | «`float` sirve para montos si redondeas al final.» | La representación binaria no es exacta; para importes se recomienda `decimal`. | [src-python-floatingpoint] |

**Fichas candidatas:** ninguna. La lección es duradera.

---

### Lección 2 — Reconocer Python, SQL y JSON/TOML/YAML; TypeScript a nivel de reconocimiento

**Objetivo de lección (→ M04-OE1, M04-OE2):** Dado un fragmento sin etiqueta, identifica el lenguaje o formato y explica qué controla; dado un SQL de agregación, predice el resultado con nulos.

**Ideas clave — SQL**

- **`WHERE` filtra filas antes de agrupar; `HAVING` filtra grupos después.** Por eso las funciones de agregado no van en `WHERE` [src-postgres-tutorial-agg].
- **`= NULL` no funciona.** Comparar con nulo da nulo (desconocido), no verdadero ni falso; para preguntar por nulos se usa `IS NULL` [src-postgres-comparison].
- **`count(*)` cuenta filas; `count(columna)` cuenta las filas donde esa columna no es nula.** `sum` y `avg` ignoran los nulos, y `sum` de cero filas devuelve nulo, no cero (se corrige con `coalesce`) [src-postgres-aggregate].
- [inferencia] Un `JOIN` contra una tabla con claves repetidas multiplica filas: el duplicado OPP-1012 del snapshot sumaría dos veces si se une sin deduplicar. Es el mismo error que el fixture `kpis_error_duplicate.json` de M02.

**Ideas clave — formatos de configuración y datos**

- **JSON:** objeto, arreglo, número, texto, `true`, `false`, `null`; el texto va entre comillas dobles y los literales en minúscula; los nombres dentro de un objeto deberían ser únicos, porque si se repiten el comportamiento del lector es impredecible [src-ietf-rfc8259]. La gramática no admite comentarios [src-ietf-rfc8259 (por la regla de espacios); inferencia]. Un archivo de ajustes en JSON estricto rechaza comentarios `//` y comas finales [src-anthropic-cc-settings] (ejemplo de producto: va en ficha).
- **TOML:** formato mínimo de configuración que se traduce a una tabla de claves y valores; pares `clave = valor`, comentarios con `#`, tablas con `[encabezado]`, arreglos de tablas con `[[encabezado]]`; distingue mayúsculas; booleanos siempre en minúscula; tiene tipos de fecha [src-toml-v1]. `pyproject.toml` es el archivo TOML donde un proyecto Python declara dependencias y la versión mínima de Python [src-pypa-pyproject].
- **YAML:** la indentación es con espacios y los tabuladores están prohibidos para indentar; comentarios con `#` [src-yaml-spec-122]. YAML 1.2 se diseñó como superconjunto estricto de JSON [src-yaml-spec-122]. En el esquema básico de YAML 1.2 solo `true/false` (y sus variantes en mayúscula) son booleanos; `yes`, `no`, `on`, `off` se leen como texto [src-yaml-spec-122]. Los workflows de GitHub Actions son YAML en `.github/workflows` [src-github-actions-workflow-syntax].
- **Markdown con frontmatter YAML:** las skills en formato abierto son un `SKILL.md` con un bloque YAML inicial (`name`, `description` obligatorios) y Markdown después [src-agentskills-spec]. [inferencia] El arnés de los agentes se configura casi entero con estos cuatro formatos; leerlos es más útil para el alumno que escribir código.

**Ideas clave — TypeScript (solo reconocer)**

- TypeScript es JavaScript con tipos estáticos: revisa errores antes de ejecutar y luego borra los tipos, de modo que el programa se comporta igual que el JavaScript equivalente [src-ts-handbook-from-scratch]. [inferencia] Para el alumno basta reconocer `: number`, `interface`, `type` y entender que un error de tipo es una advertencia previa, no un fallo en tiempo de ejecución.

**Ejemplo con Altiplano**

- SQL sobre una tabla `opportunities` equivalente al CSV: `SELECT region, count(*), count(expected_close_date) FROM opportunities GROUP BY region;` En Centro las dos cifras difieren en 1 por OPP-1021 (cierre vacío). Variante: `WHERE expected_close_date = NULL` devuelve cero filas aunque OPP-1021 exista.
- JSON real: `expected/assumptions_reference.json` (`"duplicate_policy": "latest_last_activity"`). Pregunta: ¿qué cambia en las cifras si alguien pone `"highest_amount"`? (El README de M02 dice que la política cambia cifras visibles a propósito.)
- YAML: un workflow mínimo que corre `python test_reconcile.py` en cada push; preguntar qué pasa si una línea se indenta con tabulador.
- TOML: `requires-python = ">=3.11"` en un `pyproject.toml`; la guía de empaquetado aconseja pensarlo dos veces antes de poner un límite superior [src-pypa-pyproject].

**Conceptos erróneos frecuentes**

| ID | Creencia errónea | Por qué es errónea | Fuente |
| --- | --- | --- | --- |
| M04-CE04 | «`WHERE fecha = NULL` encuentra las filas sin fecha.» | La comparación con nulo da desconocido; hay que usar `IS NULL`. | [src-postgres-comparison] |
| M04-CE05 | «`count(*)` y `count(columna)` dan lo mismo.» | El segundo ignora los nulos. | [src-postgres-aggregate] |
| M04-CE06 | «Si no hay filas, `sum` devuelve 0.» | Devuelve nulo. | [src-postgres-aggregate] |
| M04-CE07 | «Se puede comentar un JSON con `//` para documentar un ajuste.» | JSON no tiene comentarios; muchos lectores lo rechazan como error de sintaxis. | [src-ietf-rfc8259][src-anthropic-cc-settings] |
| M04-CE08 | «En YAML da igual indentar con espacios o tabuladores.» | Los tabuladores están prohibidos para indentar. | [src-yaml-spec-122] |
| M04-CE09 | «Los tipos de TypeScript validan los datos mientras el programa corre.» | Los tipos se borran al compilar; no cambian el comportamiento en ejecución. | [src-ts-handbook-from-scratch] |

**Fichas candidatas**

- *Formatos de configuración del arnés por producto* (verificado 2026-10-22): Claude Code (CLI, IDE, escritorio) · ajustes en JSON estricto en `~/.claude/settings.json`, `.claude/settings.json` y `.claude/settings.local.json` · GA [src-anthropic-cc-settings]. Codex (CLI, IDE, app) · `config.toml` en `~/.codex/` y `.codex/` del proyecto, este último solo en proyectos de confianza · GA [src-openai-codex-config-basic]. Skills en `SKILL.md` con frontmatter YAML · estándar abierto [src-agentskills-spec]. Próxima revisión: 2027-01-22.

---

### Lección 3 — Carpetas, dependencias, entorno, configuración y secretos

**Objetivo de lección (→ M04-OE3):** Dado el árbol de un proyecto, clasifica cada elemento y decide qué se versiona; ante un secreto expuesto, elige la primera acción correcta.

**Ideas clave**

- **Configuración separada del código.** Configuración es todo lo que cambia entre despliegues (credenciales, direcciones de servicios); la prueba es preguntarse si el código podría publicarse ahora mismo sin exponer credenciales [src-12factor-config]. Esa fuente recomienda variables de entorno y advierte que los archivos de configuración fuera del repositorio se suben por error con facilidad [src-12factor-config].
- **Las variables de entorno no son una caja fuerte.** Son aceptables cuando no hay algo mejor, pero cualquier proceso puede leerlas y pueden terminar en logs o volcados; lo preferible es un gestor de secretos [src-owasp-secrets-mgmt]. En aplicaciones de navegador, lo que se expone al cliente no es secreto [src-vite-env].
- **`.gitignore` solo afecta a lo no rastreado.** Un archivo que Git ya rastrea sigue rastreado aunque se añada a `.gitignore`; para dejar de rastrearlo hay que quitarlo del índice (`git rm --cached`) y luego ignorarlo [src-git-gitignore]. [inferencia] Eso lo saca de los commits futuros, no de los pasados.
- **Si un secreto llegó a un commit, lo primero es revocarlo o rotarlo.** Reescribir la historia es costoso y no limpia clones, forks ni vistas en caché; a veces, con la credencial ya inutilizada, no hace falta reescribir [src-github-remove-sensitive-data]. OWASP ordena la respuesta igual: revocar, rotar y después borrar, y advierte que reiniciar la aplicación no revoca nada [src-owasp-secrets-mgmt].
- **Defensas antes del commit y en el servidor.** Escáneres en pre-commit y en CI [src-owasp-secrets-mgmt][src-github-remove-sensitive-data]; un hook `pre-commit` puede abortar el commit, pero se salta con `--no-verify` [src-git-githooks]; la protección de push de GitHub bloquea en el servidor envíos con secretos de patrones conocidos, y puede omitirse dando un motivo [src-github-push-protection]. [inferencia] Ninguna capa detecta todos los secretos.
- **Entorno virtual: desechable y reconstruible.** Un entorno virtual de Python aísla los paquetes del proyecto; no se versiona, debe poder borrarse y recrearse, y no es portable entre carpetas o máquinas; se reconstruye desde un archivo de requisitos [src-python-venv].
- **Dependencias declaradas y fijadas.** `pyproject.toml` declara dependencias y versión de Python [src-pypa-pyproject]; un `requirements.txt` generado con `pip freeze` fija versiones exactas para repetir una instalación [src-pip-user-guide]. [inferencia] En un diff, un cambio en estos archivos merece tanta atención como un cambio de código.
- **Paquetes inventados.** Un estudio sobre 16 modelos generadores de código encontró que recomiendan paquetes inexistentes con una frecuencia media de al menos 5,2 % (comerciales) y 21,7 % (abiertos) [src-arxiv-package-hallucination]. [inferencia] Ante una dependencia nueva que añadió un agente, comprobar que existe, que es la que se cree y que hacía falta.

**Ejemplo con Altiplano**

Árbol propuesto para el repositorio del laboratorio:

```text
altiplano-pipeline/
├── pipeline_kpis.py          código (versionar)
├── reconcile.py              código: check (versionar)
├── test_reconcile.py         pruebas (versionar)
├── data/*.csv                datos sintéticos de entrada (versionar en el lab)
├── expected/*.json           fixtures (versionar; protegidos)
├── out/pipeline_kpis.json    artefacto generado (no versionar)
├── pyproject.toml            dependencias (versionar)
├── .venv/                    entorno (no versionar)
├── .env                      ALTIPLANO_CRM_TOKEN=TOKEN_FICTICIO_NO_REAL (no versionar)
└── .gitignore
```

Caso resuelto: el agente subió `.env` en un commit. Decisión correcta, en orden: tratar el token como comprometido (en el caso ficticio, «revocarlo en el CRM»), retirarlo del índice, añadirlo a `.gitignore`, y registrar que sigue en la historia. Ejemplo para completar: el agente propone «lo arreglo borrando `.env` en un commit nuevo»; el alumno explica qué queda sin resolver.

**Conceptos erróneos frecuentes**

| ID | Creencia errónea | Por qué es errónea | Fuente |
| --- | --- | --- | --- |
| M04-CE10 | «Añadir el archivo a `.gitignore` lo saca del repositorio.» | Solo afecta a archivos no rastreados. | [src-git-gitignore] |
| M04-CE11 | «Si borro el secreto en un commit nuevo, el problema está resuelto.» | Sigue en la historia, clones y forks; primero hay que revocar o rotar. | [src-github-remove-sensitive-data][src-owasp-secrets-mgmt] |
| M04-CE12 | «Una variable de entorno es segura por definición.» | Es accesible a los procesos y puede filtrarse a logs; en el cliente web no es secreta. | [src-owasp-secrets-mgmt][src-vite-env] |
| M04-CE13 | «Hay que versionar `.venv` para que el proyecto funcione en otra máquina.» | No se versiona y no es portable; se recrea desde los requisitos. | [src-python-venv] |
| M04-CE14 | «Si el agente añadió una dependencia, existe y es necesaria.» | Los modelos recomiendan paquetes inexistentes con frecuencia medible. | [src-arxiv-package-hallucination] |

**Fichas candidatas**

- *Archivos ignorados en worktrees gestionados* (verificado 2026-10-22): Claude Code y la app de Codex documentan un archivo `.worktreeinclude` que copia archivos ignorados (por ejemplo `.env`) a cada worktree nuevo [src-anthropic-cc-worktrees][src-openai-codex-worktrees]. Próxima revisión: 2027-01-22. (Puede ir en la ficha de L4.)
- *Protección de push* (verificado 2026-10-22): GitHub.com · activada por defecto para usuarios hacia repositorios públicos; la de repositorio requiere activarse · GA [src-github-push-protection]. Próxima revisión: 2027-04-22.

---

### Lección 4 — Git: diffs, commits, ramas, worktrees y recuperación; un checkpoint no es un commit

**Objetivo de lección (→ M04-OE4):** Dado un escenario, elige y aplica la operación de Git o el checkpoint adecuados y deja evidencia verificable de la recuperación.

**Ideas clave (capa duradera)**

- **Tres estados y tres lugares.** Un archivo está modificado, preparado (en el índice o *staging area*) o confirmado; el trabajo vive en la carpeta de trabajo, el índice y el directorio `.git` [src-progit-what-is-git]. Git guarda instantáneas, no listas de diferencias, y casi todo lo hace en local [src-progit-what-is-git].
- **Lo confirmado casi siempre se recupera; lo no confirmado, casi nunca.** Esa es la asimetría que justifica hacer commit antes de soltar a un agente [src-progit-undoing]. [inferencia] Regla del manual: «punto de partida limpio y confirmado antes de cada encargo».
- **Leer un diff.** `git diff` compara carpeta de trabajo con índice; `git diff --staged` compara índice con el último commit; `git diff A B` compara dos commits; `--stat` y `--name-only` resumen qué archivos cambiaron [src-git-diff]. En el formato unificado, `-` es línea eliminada, `+` añadida y espacio, contexto; el encabezado del bloque (`@@ … @@`) indica dónde está y suele nombrar la función [src-git-diff].
- **Rama = puntero barato.** Una rama es un puntero móvil a un commit, y `HEAD` indica en qué rama estás; crear una es casi instantáneo [src-progit-branches]. `git switch -c nombre` crea y cambia de rama; `git switch` se niega a cambiar si perdería cambios locales [src-git-switch].
- **Worktree = otra carpeta, mismo historial.** Cada worktree tiene su propio `HEAD`, índice y archivos, y comparte objetos y la mayoría de referencias; Git no deja crear un worktree para una rama que ya está en otro; `remove` solo borra worktrees limpios salvo con `--force` [src-git-worktree].
- **Tres maneras de deshacer, tres efectos.**
  - `git restore`: recupera archivos desde el índice o desde otro commit (`--source`) sin mover la rama [src-git-restore][src-git-reset-restore-revert]. Sin `--staged` sobrescribe la copia de trabajo, y los cambios locales de ese archivo se pierden [src-progit-undoing].
  - `git revert`: crea un commit nuevo que deshace otro; no reescribe la historia y por eso es seguro con trabajo ya compartido; exige carpeta de trabajo limpia [src-git-revert].
  - `git reset`: mueve la punta de la rama y cambia la historia [src-git-reset-restore-revert]; con `--hard` descarta cambios sin confirmar [src-git-revert].
- **El reflog es la red de seguridad local.** Registra a dónde apuntaron `HEAD` y las ramas, permite volver a `HEAD@{n}`, no se comparte al clonar ni al hacer push, y por defecto conserva las entradas 90 días (30 si son inalcanzables) [src-git-reflog].
- **Un checkpoint es un punto de restauración de la sesión, no historia del proyecto.** [inferencia, apoyada en las fichas] Sirve para deshacer rápido dentro de una conversación; no es compartible, caduca y no cubre lo que se hizo fuera de las herramientas de edición del agente. Por eso no sustituye a un commit.

**Ejemplo con Altiplano**

Historial ficticio del repositorio del laboratorio (`git log --oneline`): `c1 Calcula KPIs del pipeline` → `c2 Formato de moneda en el reporte` (el agente, además, cambió `<=` por `<` en `q4_2026`). Caso resuelto: `git diff c1 c2 -- pipeline_kpis.py` muestra la línea `-` con `<=` y la línea `+` con `<`; el alumno decide entre `git revert c2` (si quiere conservar historia y deshacer todo c2) o `git restore --source=c1 pipeline_kpis.py` seguido de commit (si quiere conservar el formato de moneda de otro archivo y deshacer solo el cálculo). Evidencia: `git log --oneline`, `git status` limpio y la reconciliación en PASS.

Serie intercalada (después de enseñar): 1) «quiero probar dos enfoques del comentario narrativo a la vez» → dos worktrees; 2) «el agente rompió un archivo y no he hecho commit» → `restore` desde el índice o el checkpoint, sabiendo qué no cubre; 3) «el cambio malo ya está en `main` y lo vio el equipo» → `revert`; 4) «el agente borró un archivo con un comando de terminal» → Git, porque el checkpoint puede no cubrirlo; 5) «quiero experimentar sin tocar `main`» → rama; 6) «hice `reset --hard` por error» → reflog.

**Conceptos erróneos frecuentes**

| ID | Creencia errónea | Por qué es errónea | Fuente |
| --- | --- | --- | --- |
| M04-CE15 | «El checkpoint de la herramienta equivale a un commit.» | Es temporal, de sesión, no compartible y no cubre todo (terminal, procesos externos, acciones remotas). | [src-anthropic-cc-checkpointing][src-vscode-copilot-checkpoints] |
| M04-CE16 | «Rebobinar la sesión deshace también lo que el agente hizo fuera del repositorio.» | Las acciones remotas, despliegues o comandos ya ejecutados no se revierten. | [src-vscode-copilot-checkpoints][src-anthropic-cc-checkpointing] |
| M04-CE17 | «Para deshacer un commit compartido lo correcto es `reset --hard`.» | `reset` reescribe la historia; para trabajo compartido se usa `revert`. | [src-git-reset-restore-revert][src-git-revert] |
| M04-CE18 | «`git restore archivo` es inofensivo.» | Sustituye la copia de trabajo: los cambios no confirmados de ese archivo se pierden. | [src-progit-undoing] |
| M04-CE19 | «Un worktree es una copia completa del proyecto, con su `.env` y sus dependencias.» | Es un checkout limpio: no trae archivos ignorados ni lo instalado. | [src-anthropic-cc-worktrees][src-openai-codex-worktrees] |
| M04-CE20 | «Rama y worktree son lo mismo.» | La rama es un puntero; el worktree es otra carpeta de trabajo con su propio `HEAD` e índice. | [src-progit-branches][src-git-worktree] |
| M04-CE21 | «Si no veo el commit en `git log`, se perdió.» | El reflog local guarda los movimientos de `HEAD` durante semanas. | [src-git-reflog] |

**Fichas candidatas (como máximo dos por lección: agrupar)**

1. **Checkpoints por producto** (verificado 2026-10-22):

| Producto · superficie | Capacidad | Límites documentados | Estado | Fuente |
| --- | --- | --- | --- | --- |
| Claude Code · CLI (y extensión de VS Code) | Checkpoint automático antes de cada mensaje que inicia un turno; `/rewind` o doble `Esc`; restaurar código, conversación o ambos; resumir desde un punto | No rastrea archivos cambiados solo por comandos Bash ni cambios externos o de otras sesiones; las ediciones de subagentes normalmente no se restauran; omite enlaces simbólicos y duros; guarda 100 checkpoints por sesión y borra las instantáneas unos 30 días después; «no reemplaza el control de versiones» | GA | [src-anthropic-cc-checkpointing][src-anthropic-cc-best-practices] |
| Copilot · VS Code (chat) | Instantánea de los archivos afectados antes de cada petición; «Restore Checkpoint» y «Redo»; activado por defecto (`chat.checkpoints.enabled`) | No revierte comandos de terminal completados, peticiones de red, despliegues ni cambios en servicios externos; temporal, no sustituye a Git | GA (página del 2026-10-21) | [src-vscode-copilot-checkpoints] |
| Codex · app de escritorio | Panel de revisión con alcances (sin preparar, preparado, commit, rama, último turno) y botones para preparar o revertir por diff, archivo o bloque; requiere repositorio Git | No encontré un checkpoint o «rewind» de archivos documentado; ver Huecos | GA | [src-openai-codex-code-review][src-openai-codex-slash-commands] |

Próxima revisión: 2027-01-22.

2. **Worktrees gestionados por producto** (verificado 2026-10-22):

| Producto · superficie | Capacidad | Detalles | Fuente |
| --- | --- | --- | --- |
| Claude Code · CLI, escritorio | `claude --worktree <nombre>` crea un worktree en `.claude/worktrees/<nombre>/` sobre la rama `worktree-<nombre>`, por defecto desde la rama principal del remoto; al salir pide conservar o borrar si hay trabajo; los subagentes pueden aislarse con `isolation: worktree` | Requiere al menos un commit; `.worktreeinclude` para `.env`; hay que instalar dependencias en el worktree | [src-anthropic-cc-worktrees][src-anthropic-cc-workflows] |
| Codex · app de escritorio | Worktrees en `$CODEX_HOME/worktrees`, en `HEAD` separado (*detached*); «Hand off» para pasar el trabajo a local; «Create branch here» para convertirlo en rama; conserva por defecto los 15 más recientes y guarda una instantánea antes de borrar | `.worktreeinclude`; scripts de entorno local para instalar dependencias; la página no cubre CLI ni IDE | [src-openai-codex-worktrees] |
| Copilot · agente en la nube (GitHub.com) | No usa worktrees locales: trabaja en un entorno efímero, en una sola rama `copilot/…`, y abre una PR por tarea | Ver ficha de L6 | [src-github-cloud-agent][src-github-cloud-agent-risks] |

Próxima revisión: 2027-01-22. **Aparte** (no evaluable): `git bisect` busca por bisección el commit que introdujo un error y puede automatizarse con un script cuyo código de salida 0 significa «bueno» [src-git-bisect].

---

### Lección 5 — Leer errores, logs y checks de CI para orientar la depuración

**Objetivo de lección (→ M04-OE5):** Dado un traceback, un log o un check fallido, localiza dónde falló y propone la causa más probable y el siguiente paso.

**Ideas clave**

- **Error de sintaxis frente a excepción.** El primero impide ejecutar y el lugar señalado no siempre es el que hay que corregir; la excepción ocurre durante la ejecución [src-python-errors].
- **El traceback se lee de abajo arriba.** La última línea dice qué pasó (tipo y mensaje); las anteriores, por dónde pasó, con las líneas de código implicadas [src-python-errors]. [inferencia] Para un revisor, el primer archivo propio del proyecto que aparece subiendo desde abajo suele ser el mejor lugar para empezar.
- **Capturar de más esconde fallos.** Conviene capturar las excepciones lo más específicas posible y dejar que las inesperadas suban; si se captura en general, registrar y volver a lanzar [src-python-errors]. [inferencia] Un diff que añade `except Exception: pass` merece una pregunta.
- **Niveles de log.** DEBUG (diagnóstico), INFO (todo va como se espera), WARNING (algo inesperado, pero sigue funcionando), ERROR (no pudo hacer una función), CRITICAL (quizá no puede seguir); por defecto solo se registra desde WARNING [src-python-logging]. Para reportar un error se lanza una excepción; `print` es para salida normal [src-python-logging].
- **Código de salida.** 0 es éxito y cualquier otro valor, fallo; por convención 2 suele indicar error de uso y 1 los demás [src-python-sys]. [inferencia] Así lee un CI si un paso pasó. `reconcile.py` usa 0 (todo coincide), 1 (cifras distintas) y 2 (faltan datos o un supuesto seguro), según su README.
- **Checks de CI.** Un check indica si un commit cumple las condiciones del repositorio (tests, build, escaneo); sus conclusiones incluyen éxito, fallo, omitido, cancelado o agotado por tiempo; en una rama protegida los checks requeridos deben pasar para fusionar, y un trabajo omitido cuenta como éxito [src-github-status-checks]. [inferencia] Un check requerido en verde porque se omitió no prueba nada.
- **Leer el log del CI.** Los pasos fallidos aparecen expandidos; se puede buscar dentro del log y descargarlo [src-github-actions-logs]. No hay que imprimir secretos en el log; GitHub permite enmascarar valores sensibles con `::add-mask::` [src-github-actions-secrets][src-owasp-secrets-mgmt].
- **Depurar es reproducir.** Darle al agente el comando que reproduce el fallo y el error completo, y pedir la causa raíz en vez de suprimir el error [src-anthropic-cc-best-practices][src-anthropic-cc-workflows]. (Producto en ficha; el principio es duradero.)

**Ejemplo con Altiplano**

Caso resuelto con salida simulada (ver §3.0): tras el commit c2, la reconciliación imprime `FAIL open_pipeline Sur: dashboard=1182000.00 esperado=1240000.0 diferencia=-58000.00` y termina con código 1 (formato ilustrativo: en el laboratorio el «dashboard» es el módulo con el error y el valor esperado lo calcula el check; hay que tomar la salida real cuando exista `pipeline_kpis.py`). Lectura guiada: el fallo afecta a Sur y a TOTAL, no a Norte ni Centro; la diferencia es exactamente el monto de una oportunidad; en el CSV solo OPP-1038 suma 58 000 en Sur; su fecha es el último día del trimestre → sospecha sobre la condición de fechas → `git diff` confirma. Contraste: `ERROR duplicate_policy_required: hay oportunidades repetidas (OPP-1012)…` con código 2 no es un fallo de cálculo sino un supuesto que falta declarar.

Ejemplo para completar: el fixture `kpis_error_eur.json` falla en las regiones con montos EUR; el alumno formula la hipótesis (conversión de moneda) y el siguiente paso.

**Conceptos erróneos frecuentes**

| ID | Creencia errónea | Por qué es errónea | Fuente |
| --- | --- | --- | --- |
| M04-CE22 | «La causa está en la primera línea del traceback.» | La última línea dice qué pasó; la cadena de arriba muestra el recorrido. | [src-python-errors] |
| M04-CE23 | «Si el check requerido está en verde, el cambio se probó.» | Un trabajo omitido cuenta como éxito; además, un check solo cubre sus casos. | [src-github-status-checks]; [inferencia] |
| M04-CE24 | «Envolver el código en `try/except` arregla el error.» | Lo oculta; la guía pide capturar lo específico y dejar subir lo inesperado. | [src-python-errors] |
| M04-CE25 | «Un WARNING en el log significa que el proceso falló.» | Indica algo inesperado con el software aún funcionando; el fallo es ERROR o una excepción. | [src-python-logging] |

**Fichas candidatas:** ninguna imprescindible. Si se quiere, una mini-ficha sobre la aprobación de workflows en PRs de agentes (ver L6).

---

### Lección 6 — Qué revisar antes de aceptar un cambio; la PR como unidad de revisión

**Objetivo de lección (→ M04-OE6):** Dado un diff y el reporte del agente, decide aceptar, pedir cambios o rechazar, citando defecto, alcance o evidencia faltante.

**Ideas clave**

- **La PR es una propuesta para fusionar cambios**, con pestañas de conversación, commits y archivos cambiados; un borrador no se puede fusionar [src-github-about-prs]. Se revisa archivo por archivo, comentando líneas, y se cierra con comentar, aprobar o pedir cambios; el autor no puede aprobar su propia PR [src-github-reviewing-prs].
- **Revisar dependencias en el diff de origen.** La vista enriquecida de dependencias ayuda, pero la guía pide mirar también el diff fuente porque puede omitir cambios [src-github-reviewing-prs].
- **Evidencia, no afirmaciones.** Pedir al agente la salida de la prueba, el comando y su resultado, en lugar de un «ya funciona» [src-anthropic-cc-best-practices]. El revisor en contexto fresco ve solo el diff y los criterios; pedirle solo los huecos que afectan a la corrección o a los requisitos evita perseguir hallazgos menores [src-anthropic-cc-best-practices].
- **Los revisores automáticos ayudan, no certifican.** Advierten que no garantizan encontrar todos los problemas y que pueden equivocarse, por lo que hay que validar sus hallazgos y sumar revisión humana [src-github-copilot-code-review]. Los registros de sesión del agente tampoco sustituyen la revisión y las pruebas propias [src-github-cloud-agent].
- **Controles de proceso alrededor del agente.** En el agente en la nube de GitHub: una sola rama, PR que una persona debe revisar y fusionar, quien pidió el cambio no puede aprobarlo y los workflows no corren hasta que alguien con permiso de escritura los aprueba [src-github-cloud-agent-risks]. (Ficha; el principio duradero es «quien encarga no es el único que aprueba».)
- **Lista para leer un diff [inferencia, síntesis de las fuentes anteriores y de M02]:**
  1. ¿Qué archivos cambiaron (`--stat`)? ¿Alguno fuera del alcance pedido (datos, fixtures, políticas de FP&A, configuración, CI)?
  2. ¿Cambió alguna condición, frontera, signo, unidad o moneda?
  3. ¿Se tocaron los checks (tolerancias, fixtures esperados, tests borrados o saltados)?
  4. ¿Dependencias nuevas? ¿Existen y hacen falta?
  5. ¿Secretos, rutas personales o datos reales?
  6. ¿Hay evidencia: comando, salida y reconciliación antes y después?
  7. ¿El cambio es reversible y está en una rama o PR, no directo en la principal?

**Ejemplo con Altiplano**

Caso resuelto: la rama `agente/fix-sur` propone «corregir la diferencia de Sur». El diff: (a) sube la tolerancia de `--tolerance` a 60 000 en el workflow; (b) cambia `<` por `<=` en la regla de vencidas; (c) el reporte dice «todos los checks pasan». Revisión: (a) manipula el check en vez de corregir la causa → rechazar; (b) está fuera de alcance y no lo detecta la reconciliación porque ningún dato cae en esa frontera (§3.0) → pedir justificación o retirarlo; (c) no adjunta salida → pedir evidencia. Decisión: pedir cambios con tres comentarios por línea.

Ejemplo para completar: otra PR que cambia la probabilidad de Negociación en `stage_probability.csv` «para que cuadre»; el alumno identifica que es una política de FP&A (M02 §2.0) y no se modifica sin su dueño.

**Conceptos erróneos frecuentes**

| ID | Creencia errónea | Por qué es errónea | Fuente |
| --- | --- | --- | --- |
| M04-CE26 | «Si el agente dice que los tests pasan, se puede aceptar.» | Hay que exigir el comando y su salida. | [src-anthropic-cc-best-practices] |
| M04-CE27 | «Si la revisión automática no encontró nada, el cambio está bien.» | No garantiza encontrar todo y puede equivocarse. | [src-github-copilot-code-review] |
| M04-CE28 | «Ajustar la tolerancia o el fixture esperado es una corrección válida si el check pasa.» | Cambia la vara de medir, no la causa. | [inferencia] |
| M04-CE29 | «Quien pidió el cambio al agente puede aprobar la PR él solo.» | En el flujo documentado no puede; la separación es deliberada. | [src-github-cloud-agent-risks][src-github-reviewing-prs] |
| M04-CE30 | «Basta con mirar el resumen o la vista enriquecida; el diff fuente es para programadores.» | La vista enriquecida puede omitir cambios; la guía pide el diff fuente. | [src-github-reviewing-prs] |

**Fichas candidatas (agrupar en una)**

- *Revisión y PR con agentes* (verificado 2026-10-22): Copilot agente en la nube (GitHub.com) · rama `copilot/`, PR que no puede marcar como lista ni aprobar ni fusionar, workflows con aprobación manual por defecto · GA [src-github-cloud-agent-risks][src-github-cloud-agent]. Copilot code review · comenta y sugiere; aprobaciones de Copilot que cuentan para reglas de aprobación están en *public preview* y desactivadas por defecto [src-github-copilot-code-review]. Codex · `/review` informa hallazgos priorizados sin cambiar la carpeta de trabajo (app, IDE, CLI); revisión en GitHub GA y en GitLab en *preview* [src-openai-codex-code-review]. Claude Code · `/code-review` revisa el diff en un subagente de contexto fresco [src-anthropic-cc-best-practices]. Próxima revisión: 2027-01-22.

---

## 4. Qué NO enseñar o enseñar con cautela

| Tema | Decisión | Motivo |
| --- | --- | --- |
| Escribir programas desde cero, sintaxis exhaustiva, programación orientada a objetos, asincronía | No enseñar | El alcance es alfabetización aplicada (`docs/curriculum.md`, M04). Se lee y se predice; no se escribe código nuevo |
| TypeScript más allá de reconocerlo | No enseñar | Decisión del currículo; sus tipos no cambian el comportamiento en ejecución [src-ts-handbook-from-scratch] |
| `git reset --hard`, `git push --force`, reescritura de historia (`filter-repo`) | Enseñar con cautela: reconocerlos como destructivos y saber recuperarse con el reflog, no usarlos en el laboratorio | `reset` cambia la historia y `--hard` descarta cambios [src-git-reset-restore-revert][src-git-revert]; reescribir historia tiene efectos secundarios y no limpia clones ni forks [src-github-remove-sensitive-data] |
| `git commit --amend` | Cautela | Solo en commits no publicados [src-progit-undoing] |
| Merge, rebase y resolución de conflictos | Mencionar, no evaluar | [inferencia] Exceden el objetivo de revisar y recuperar; el uso de worktrees en paralelo se profundiza en M08 |
| `git bisect` | Recuadro Aparte | Útil pero no evaluable en este nivel [src-git-bisect] |
| Atajos y comandos de producto (`/rewind`, doble `Esc`, `claude --worktree`, «Hand off») | Solo en fichas, nunca en el cuerpo ni como respuesta de examen | D-019; volatilidad alta |
| «El checkpoint te cubre» | No enseñar como red de seguridad principal | Las propias guías dicen que no sustituye a Git [src-anthropic-cc-checkpointing][src-vscode-copilot-checkpoints] |
| `--no-verify` para saltar hooks | Mencionar solo como riesgo | Salta el `pre-commit` [src-git-githooks]; [inferencia] un agente no debería usarlo sin permiso |
| Variables de entorno como «la» solución de secretos | Cautela | Aceptables, pero con riesgos de filtración; gestor de secretos preferible [src-owasp-secrets-mgmt] |
| Recomendar herramientas concretas de escaneo de secretos o de bloqueo (gitleaks, uv, Poetry…) | No enseñar como receta | [inferencia] Volátil y no necesario para el objetivo; se enseña el principio (detectar antes del commit y en el servidor) |
| Diferencias YAML 1.1 frente a 1.2 en bibliotecas concretas | Cautela | Solo verifiqué la especificación 1.2; el comportamiento de cada biblioteca no (Huecos) |
| Cualquier código, repositorio o credencial real | Prohibido | AGENTS.md: datos sintéticos siempre |

---

## 5. Propuesta de laboratorio: el error de la frontera del trimestre

### 5.1 Objetivo observable

Dado un repositorio sintético de Altiplano con un error sembrado por un «agente» y una corrección propuesta, el alumno **localiza el defecto con evidencia, revisa y rechaza o acepta la corrección con comentarios por línea, y recupera una versión correcta con Git**, dejando el check en verde y la historia legible. Cubre M04-OE4 y M04-OE6 (producción) y ejercita OE1, OE3 y OE5.

### 5.2 Entradas

1. **Repositorio `altiplano-pipeline/`**, generado por un script determinista (por ejemplo `scripts/build_m04_lab_repo.py`, a crear por el autor) a partir de los archivos de M02. La app no ejecuta nada: el alumno lo corre en su equipo (`docs/content-standard.md` §5).
   - `pipeline_kpis.py`: módulo de cálculo derivado de `calculate()` de `reconcile.py`, que escribe `out/pipeline_kpis.json` con el contrato pipeline_kpis v1.
   - `reconcile.py`, `test_reconcile.py`, `data/*.csv`, `expected/*.json` de M02 (el oráculo es `expected/kpis_correct.json`).
   - Historial:

| Commit | Mensaje | Contenido |
| --- | --- | --- |
| c1 | Calcula KPIs del pipeline | Versión correcta; la reconciliación pasa |
| c2 | Formato de moneda en el reporte | Cambio pedido (formato en `report.py`) **más** el error sembrado en `pipeline_kpis.py` (`<=` → `<` en el límite del T4) **más** un `.env` con `ALTIPLANO_CRM_TOKEN=TOKEN_FICTICIO_NO_REAL` que no debía subirse |
| rama `agente/fix-sur` (c3) | Corrige diferencia de Sur | Sube `--tolerance` a 60 000 en el workflow, cambia `<` por `<=` en la regla de vencidas y reporta «todos los checks pasan» sin adjuntar salida |

2. **Encargo original** (texto ficticio): «Agrega formato de moneda al reporte. No toques el cálculo ni los datos.»
3. **Plantilla de revisión** con la lista de §3, L6, y una tabla de comentarios (archivo, línea, problema, petición).
4. **Variante sin andamiaje** para quien ya demostró dominio: el error sembrado es `CLOSED_STAGES` sin «Perdida» (afecta a pipeline abierto y vencidas pero no al ponderado), sin pista de en qué commit está.

### 5.3 Pasos

1. **Preparar.** Clonar o generar el repositorio; crear el entorno virtual; comprobar `git status` limpio y anotar el commit de partida.
2. **Reproducir.** Generar `out/pipeline_kpis.json` y correr la reconciliación. Copiar las líneas FAIL y el código de salida.
3. **Localizar.** Con `git log --oneline` y `git diff c1 c2 --stat` / `git diff c1 c2 -- pipeline_kpis.py`, encontrar la línea responsable; explicar el mecanismo con la fila OPP-1038 y cuantificar el impacto (−58 000 en Sur).
4. **Revisar la corrección propuesta.** `git diff main agente/fix-sur`. Completar la plantilla: decisión (aceptar, pedir cambios, rechazar) y al menos tres comentarios por línea.
5. **Higiene.** Detectar el `.env` versionado; describir las acciones en orden (revocar o rotar el token ficticio, retirarlo del índice, ignorarlo, anotar que queda en la historia) y aplicar las que sean locales.
6. **Recuperar.** En una rama `revision/m04`, deshacer el error sin perder el formato de moneda (`git restore --source=c1 pipeline_kpis.py` + commit, o `git revert c2` y volver a aplicar el formato; el alumno justifica la elección). Regenerar la salida y volver a correr la reconciliación.
7. **Reflexionar (una frase cada una).** ¿Qué habría recuperado un checkpoint de la herramienta y qué no? ¿Por qué la reconciliación no detecta el cambio en la regla de vencidas?
8. **Opcional.** Abrir un worktree con c1 para comparar las dos versiones lado a lado y retirarlo al final con `git worktree remove`.

### 5.4 Entregable

`revision_m04.md` con: salida FAIL inicial y código de salida; línea del defecto, mecanismo e impacto; tabla de comentarios a la PR y decisión; acciones sobre el secreto; comandos de recuperación usados; `git log --oneline -5`, `git status` y salida PASS final; respuestas del paso 7. Se registra en el expediente como texto pegado (plan.md §17.2).

### 5.5 Rúbrica analítica

Escala por criterio: 0 Ausente · 1 Inicial · 2 Adecuado · 3 Sólido. Los criterios con ★ son críticos: no se compensan y deben llegar a 2. Propuesta de aprobación [inferencia, igual que M02]: 70 % o más, ningún ★ por debajo de 2.

| Criterio | Peso | 1 Inicial | 2 Adecuado | 3 Sólido | Evidencia |
| --- | --- | --- | --- | --- | --- |
| R1 ★ Localización del defecto | 25 % | Señala el archivo o la región afectada, sin línea ni mecanismo | Línea exacta y mecanismo (`<` excluye el 31-12) | Además cuantifica el impacto con la fila OPP-1038 y explica por qué solo fallan Sur y TOTAL | Paso 3 |
| R2 ★ Revisión de la corrección propuesta | 25 % | Acepta, o rechaza sin motivo verificable | Rechaza o pide cambios señalando la manipulación de la tolerancia y la falta de evidencia | Además identifica el cambio en vencidas como fuera de alcance y explica que el check no lo cubre; comentarios por línea accionables | Paso 4 |
| R3 ★ Recuperación con Git | 25 % | El cálculo vuelve a estar bien, pero se perdió el formato de moneda, se reescribió la historia o falta evidencia | Check en PASS en una rama, historia preservada, `git log` y `git status` adjuntos | Además justifica `restore` frente a `revert` y responde bien qué cubriría un checkpoint | Pasos 6–7 |
| R4 Entorno y secretos | 15 % | Borra `.env` y considera resuelto el problema | Retira del índice, ignora y menciona que sigue en la historia | Ordena revocar o rotar como primera acción y explica por qué borrar no basta | Paso 5 |
| R5 Comunicación de la revisión | 10 % | Comentarios genéricos («revisar esto») | Cada comentario con archivo, línea y petición | Además prioriza por impacto y separa lo bloqueante de lo opcional | Paso 4 |

**Ejemplo anclado «logrado» (resumen):** «`pipeline_kpis.py` L18: `value < "2026-12-31"` excluye OPP-1038 (Sur, 58 000, cierre 31-12); por eso solo fallan Sur y TOTAL. Rechazo `agente/fix-sur`: la tolerancia de 60 000 tapa la diferencia; el cambio en vencidas no se pidió y la reconciliación no lo puede detectar porque ninguna fila cierra el día del snapshot; falta la salida del check. Recuperé con `git restore --source=c1 pipeline_kpis.py` para conservar el formato de c2; PASS adjunto. `.env`: el token se trata como comprometido; se revoca primero.»
**Ejemplo anclado «insuficiente»:** «El agente arregló Sur y ahora pasa todo. Borré el `.env`. Volví atrás con el checkpoint.»

---

## 6. Registro de fuentes

Todas consultadas el 2026-10-22. Criterio de próxima revisión: alta → 2027-01-22; media → 2027-04-22; baja → 2027-10-22. Los IDs marcados «(existente)» ya están en `content/sources.json` o en registros previos y se reutilizan.

| ID | Título | URL | Organización | Consultado | Afirmaciones que sustenta | Volatilidad | Próxima revisión |
| --- | --- | --- | --- | --- | --- | --- | --- |
| src-progit-what-is-git | Pro Git, 1.3 What is Git? | https://git-scm.com/book/en/v2/Getting-Started-What-is-Git%3F | Git (Pro Git, 2.ª ed.) | 2026-10-22 | Instantáneas; operaciones locales; integridad; tres estados y tres lugares; difícil perder lo confirmado | Baja | 2027-10-22 |
| src-progit-undoing | Pro Git, 2.4 Undoing Things | https://git-scm.com/book/en/v2/Git-Basics-Undoing-Things | Git (Pro Git) | 2026-10-22 | `--amend` solo sin publicar; `restore --staged`; `restore` descarta cambios; lo confirmado casi siempre se recupera, lo no confirmado no; `restore` desde Git 2.23 | Baja | 2027-10-22 |
| src-progit-branches | Pro Git, 3.1 Branches in a Nutshell | https://git-scm.com/book/en/v2/Git-Branching-Branches-in-a-Nutshell | Git (Pro Git) | 2026-10-22 | Rama como puntero móvil; `HEAD`; ramas baratas | Baja | 2027-10-22 |
| src-git-diff | git-diff | https://git-scm.com/docs/git-diff | Git | 2026-10-22 | Formas de comparación; `--stat`, `--name-only`; formato unificado (`-`, `+`, contexto, encabezado de bloque con función) | Baja | 2027-10-22 |
| src-git-switch | git-switch | https://git-scm.com/docs/git-switch | Git | 2026-10-22 | `switch -c`; se aborta si perdería cambios locales; `--detach` | Baja | 2027-10-22 |
| src-git-worktree | git-worktree | https://git-scm.com/docs/git-worktree | Git | 2026-10-22 | Worktree enlazado; `HEAD` e índice propios, historial compartido; una rama no en dos worktrees; `remove` solo limpio salvo `--force` | Baja | 2027-10-22 |
| src-git-restore | git-restore | https://git-scm.com/docs/git-restore | Git | 2026-10-22 | Restaurar rutas desde índice o commit (`--source`); `--staged` / `--worktree` | Baja | 2027-10-22 |
| src-git-revert | git-revert | https://git-scm.com/docs/git-revert | Git | 2026-10-22 | Commit nuevo que deshace otro; seguro con historia compartida; exige carpeta limpia; `reset --hard` descarta cambios | Baja | 2027-10-22 |
| src-git-reset-restore-revert | git(1), sección «Reset, restore and revert» | https://git-scm.com/docs/git | Git | 2026-10-22 | Diferencia entre `revert` (commit nuevo), `restore` (archivos, no mueve la rama) y `reset` (mueve la rama, cambia la historia) | Baja | 2027-10-22 |
| src-git-reflog | git-reflog | https://git-scm.com/docs/git-reflog | Git | 2026-10-22 | Qué registra; `HEAD@{n}`; local, no se comparte; caducidad 90 / 30 días | Baja | 2027-10-22 |
| src-git-bisect | git-bisect | https://git-scm.com/docs/git-bisect | Git | 2026-10-22 | Búsqueda binaria del commit que introdujo el error; `bisect run` con código 0 = bueno, 125 = omitir | Baja | 2027-10-22 |
| src-git-gitignore (existente) | gitignore | https://git-scm.com/docs/gitignore | Git | 2026-10-22 | Solo afecta a no rastreados; `git rm --cached`; precedencia; patrones | Baja | 2027-10-22 |
| src-git-githooks (existente) | githooks | https://git-scm.com/docs/githooks | Git | 2026-10-21 (registro previo) | `pre-commit` puede abortar; se salta con `--no-verify` | Baja | 2027-10-21 |
| src-github-remove-sensitive-data | Removing sensitive data from a repository | https://docs.github.com/en/authentication/keeping-your-account-and-data-secure/removing-sensitive-data-from-a-repository | GitHub | 2026-10-22 | Revocar o rotar primero; no se limpia en clones, forks ni caché; efectos de reescribir historia; escáneres pre-commit | Media | 2027-04-22 |
| src-github-push-protection (existente) | About push protection | https://docs.github.com/en/code-security/secret-scanning/introduction/about-push-protection | GitHub | 2026-10-22 | Bloquea en el servidor envíos con secretos; activada por defecto para usuarios hacia repos públicos; omisión con motivo | Media | 2027-04-22 |
| src-owasp-secrets-mgmt | Secrets Management Cheat Sheet | https://cheatsheetseries.owasp.org/cheatsheets/Secrets_Management_Cheat_Sheet.html | OWASP | 2026-10-22 | Qué es un secreto; no en código ni control de versiones; riesgos de variables de entorno; detección en pre-commit y CI; revocar → rotar → borrar; mínimo privilegio | Media | 2027-04-22 |
| src-12factor-config | The Twelve-Factor App: III. Config | https://12factor.net/config | Heroku / 12factor.net (A. Wiggins) | 2026-10-22 | Definición de configuración; prueba de publicar el código; variables de entorno; riesgo de archivos de configuración subidos por error | Baja | 2027-10-22 |
| src-vite-env (existente) | Env Variables and Modes | https://vite.dev/guide/env-and-mode | Vite | 2026-10-21 (registro previo) | Las variables expuestas al cliente no son secretas | Media | 2027-04-21 |
| src-python-controlflow | Python tutorial, 4. More Control Flow Tools | https://docs.python.org/3/tutorial/controlflow.html | Python Software Foundation | 2026-10-22 | `if/elif/else`; `def`; cuerpo indentado; `return` y `None`; argumentos por defecto y por nombre; cuatro espacios | Baja | 2027-10-22 |
| src-python-floatingpoint | Python tutorial, 15. Floating-Point Arithmetic | https://docs.python.org/3/tutorial/floatingpoint.html | Python Software Foundation | 2026-10-22 | 0,1 no exacto en binario; 0,1+0,1+0,1 ≠ 0,3; `decimal` para contabilidad | Baja | 2027-10-22 |
| src-python-errors | Python tutorial, 8. Errors and Exceptions | https://docs.python.org/3/tutorial/errors.html | Python Software Foundation | 2026-10-22 | Sintaxis frente a excepción; leer el traceback (última línea); `try/except`; `raise`; capturar lo específico | Baja | 2027-10-22 |
| src-python-logging | Logging HOWTO | https://docs.python.org/3/howto/logging.html | Python Software Foundation | 2026-10-22 | Niveles y significado; WARNING por defecto; cuándo `print`, log o excepción | Baja | 2027-10-22 |
| src-python-sys | sys — `sys.exit` | https://docs.python.org/3/library/sys.html | Python Software Foundation | 2026-10-22 | 0 = éxito, otro = fallo; convención 2 / 1 | Baja | 2027-10-22 |
| src-python-venv | venv — Creation of virtual environments | https://docs.python.org/3/library/venv.html | Python Software Foundation | 2026-10-22 | Aislamiento; no versionar; desechable; no portable; reconstruir con requisitos; `.gitignore` automático desde 3.13 | Baja | 2027-10-22 |
| src-pypa-pyproject | Writing your pyproject.toml | https://packaging.python.org/en/latest/guides/writing-pyproject-toml/ | Python Packaging Authority | 2026-10-22 | Tablas `[project]`, `dependencies`, `requires-python`; cautela con límites superiores | Media | 2027-04-22 |
| src-pip-user-guide | pip User Guide (requirements files) | https://pip.pypa.io/en/stable/user_guide/ | Python Packaging Authority | 2026-10-22 | `requirements.txt`; `pip freeze` fija versiones para repetir instalaciones; archivos de restricciones | Media | 2027-04-22 |
| src-arxiv-package-hallucination | We Have a Package for You! A Comprehensive Analysis of Package Hallucinations by Code Generating LLMs (2024, rev. 2025; USENIX Security 2025) | https://arxiv.org/abs/2406.10279 | Spracklen et al. (UT San Antonio y otros) | 2026-10-22 | 16 modelos; ≥ 5,2 % (comerciales) y 21,7 % (abiertos) de paquetes inexistentes; 205 474 nombres únicos | Media (cifras por modelo) | 2027-04-22 |
| src-postgres-comparison | PostgreSQL 18: 9.2 Comparison Functions and Operators | https://www.postgresql.org/docs/current/functions-comparison.html | PostgreSQL Global Development Group | 2026-10-22 | `= NULL` da nulo; usar `IS NULL`; `IS DISTINCT FROM` | Baja | 2027-10-22 |
| src-postgres-tutorial-agg | PostgreSQL 18: 2.7 Aggregate Functions | https://www.postgresql.org/docs/current/tutorial-agg.html | PostgreSQL Global Development Group | 2026-10-22 | Agregados; `GROUP BY`; `WHERE` antes y `HAVING` después de agrupar | Baja | 2027-10-22 |
| src-postgres-aggregate | PostgreSQL 18: 9.21 Aggregate Functions | https://www.postgresql.org/docs/current/functions-aggregate.html | PostgreSQL Global Development Group | 2026-10-22 | `count(*)` frente a `count(expr)`; `sum`/`avg` ignoran nulos; `sum` vacío = nulo; `coalesce` | Baja | 2027-10-22 |
| src-ietf-rfc8259 | RFC 8259: The JSON Data Interchange Format (dic. 2017, STD 90) | https://www.rfc-editor.org/rfc/rfc8259 | IETF | 2026-10-22 | Tipos de valor; comillas dobles; literales en minúscula; nombres únicos recomendados; gramática sin comentarios | Baja | 2027-10-22 |
| src-toml-v1 | TOML v1.0.0 | https://toml.io/en/v1.0.0 | TOML (T. Preston-Werner y otros) | 2026-10-22 | Formato mínimo; `clave = valor`; `#`; tablas y arreglos de tablas; mayúsculas; booleanos en minúscula; fechas | Baja | 2027-10-22 |
| src-yaml-spec-122 | YAML Ain't Markup Language, v1.2.2 | https://yaml.org/spec/1.2.2/ | YAML Language Development Team | 2026-10-22 | Tabuladores prohibidos para indentar (6.1); `#` comentarios; superconjunto de JSON (1.2); booleanos del esquema básico (10.3.2) | Baja | 2027-10-22 |
| src-ts-handbook-from-scratch | TypeScript for the New Programmer | https://www.typescriptlang.org/docs/handbook/typescript-from-scratch.html | Microsoft (TypeScript) | 2026-10-22 | Superconjunto de JavaScript; tipos revisados antes de ejecutar y borrados al compilar; comportamiento en ejecución igual | Baja | 2027-10-22 |
| src-agentskills-spec | Agent Skills — Specification | https://agentskills.io/specification | Agent Skills (estándar abierto, originado en Anthropic) | 2026-10-22 | `SKILL.md` = frontmatter YAML + Markdown; `name` y `description` obligatorios | Media | 2027-04-22 |
| src-github-actions-workflow-syntax | Workflow syntax for GitHub Actions | https://docs.github.com/en/actions/reference/workflows-and-actions/workflow-syntax | GitHub | 2026-10-22 | Workflows en YAML en `.github/workflows`, extensión `.yml`/`.yaml`; claves `on`, `jobs` | Media | 2027-04-22 |
| src-github-about-prs | About pull requests | https://docs.github.com/en/pull-requests/collaborating-with-pull-requests/proposing-changes-to-your-work-with-pull-requests/about-pull-requests | GitHub | 2026-10-22 | PR como propuesta de fusión; pestañas; borradores no fusionables | Media | 2027-04-22 |
| src-github-reviewing-prs | Reviewing proposed changes in a pull request | https://docs.github.com/en/pull-requests/collaborating-with-pull-requests/reviewing-changes-in-pull-requests/reviewing-proposed-changes-in-a-pull-request | GitHub | 2026-10-22 | Revisar por archivo; comentarios por línea; comentar / aprobar / pedir cambios; el autor no aprueba su PR; revisar el diff fuente de dependencias | Media | 2027-04-22 |
| src-github-status-checks | About status checks | https://docs.github.com/en/pull-requests/collaborating-with-pull-requests/collaborating-on-repositories-with-code-quality-features/about-status-checks | GitHub | 2026-10-22 | Qué es un check; conclusiones; checks requeridos en ramas protegidas; trabajo omitido = éxito | Media | 2027-04-22 |
| src-github-actions-logs | Using workflow run logs | https://docs.github.com/en/actions/how-tos/monitor-workflows/use-workflow-run-logs | GitHub | 2026-10-22 | Ver logs; pasos fallidos expandidos; buscar y descargar | Media | 2027-04-22 |
| src-github-actions-secrets | Using secrets in GitHub Actions | https://docs.github.com/en/actions/how-tos/write-workflows/choose-what-workflows-do/use-secrets | GitHub | 2026-10-22 | Secretos por contexto; no pasarlos por línea de comandos; `::add-mask::`; no llegan a workflows de forks | Media | 2027-04-22 |
| src-github-cloud-agent (existente) | About Copilot cloud agent | https://docs.github.com/en/copilot/concepts/agents/coding-agent/about-coding-agent | GitHub | 2026-10-22 | Rama y PR por tarea; entorno efímero con tests y linters; registros de sesión que no sustituyen la revisión | Alta | 2027-01-22 |
| src-github-cloud-agent-risks (existente) | Risks and mitigations for Copilot cloud agent | https://docs.github.com/en/copilot/concepts/agents/cloud-agent/risks-and-mitigations | GitHub | 2026-10-22 | Rama `copilot/`; no aprueba ni fusiona; quien lo pidió no aprueba; workflows con aprobación | Media | 2027-04-22 |
| src-github-copilot-code-review | About Copilot code review | https://docs.github.com/en/copilot/concepts/agents/code-review | GitHub | 2026-10-22 | No garantiza encontrar todo; puede equivocarse; validar y sumar revisión humana; aprobaciones en *preview* | Alta | 2027-01-22 |
| src-vscode-copilot-checkpoints | Chat checkpoints (pág. act. 2026-10-21) | https://code.visualstudio.com/docs/copilot/chat/chat-checkpoints | Microsoft (VS Code) | 2026-10-22 | Instantánea antes de cada petición; restaurar y rehacer; `chat.checkpoints.enabled`; no revierte terminal, red, despliegues ni servicios externos; no sustituye a Git | Alta | 2027-01-22 |
| src-anthropic-cc-checkpointing | Checkpointing (Claude Code) | https://code.claude.com/docs/en/checkpointing | Anthropic | 2026-10-22 | Checkpoint por turno; `/rewind`; restaurar código, conversación o ambos; no rastrea Bash ni cambios externos; subagentes; enlaces; 100 checkpoints; ~30 días; no reemplaza el control de versiones | Alta | 2027-01-22 |
| src-anthropic-cc-worktrees | Run parallel sessions with worktrees (Claude Code) | https://code.claude.com/docs/en/worktrees | Anthropic | 2026-10-22 | `--worktree`; ruta y rama; base por defecto; limpieza al salir; `.worktreeinclude`; instalar dependencias; subagentes aislados | Alta | 2027-01-22 |
| src-anthropic-cc-workflows | Common workflows (Claude Code) | https://code.claude.com/docs/en/common-workflows | Anthropic | 2026-10-22 | Worktrees requieren un commit; dar el comando que reproduce el error; revisar la PR generada | Alta | 2027-01-22 |
| src-anthropic-cc-settings | Settings files and precedence (Claude Code) | https://code.claude.com/docs/en/settings | Anthropic | 2026-10-22 | Ajustes en JSON estricto (sin comentarios ni comas finales); ámbitos usuario / proyecto / local; local fuera de Git | Alta | 2027-01-22 |
| src-anthropic-cc-best-practices (existente) | Best practices for Claude Code | https://code.claude.com/docs/en/best-practices | Anthropic | 2026-10-22 | Evidencia en vez de afirmaciones; checkpoints solo cubren ediciones de la herramienta y no reemplazan Git; revisor en contexto fresco; `/code-review`; causa raíz | Alta | 2027-01-22 |
| src-openai-codex-worktrees | Worktrees (Codex) | https://learn.chatgpt.com/codex/environments/git-worktrees | OpenAI | 2026-10-22 | App de escritorio; `$CODEX_HOME/worktrees`; HEAD separado; Hand off; Create branch here; 15 por defecto; instantánea antes de borrar; `.worktreeinclude` | Alta | 2027-01-22 |
| src-openai-codex-code-review | Code review (Codex) | https://learn.chatgpt.com/docs/code-review | OpenAI | 2026-10-22 | Panel de revisión con alcances y preparar / revertir por bloque; requiere Git; `/review` no cambia la carpeta de trabajo; revisión en GitHub GA, GitLab *preview* | Alta | 2027-01-22 |
| src-openai-codex-slash-commands | Slash commands (Codex) | https://learn.chatgpt.com/codex/reference/slash-commands | OpenAI | 2026-10-22 | Lista de comandos (incluye `/review`, `/worktree`, `/fork`); no aparece `/undo` ni `/rewind` | Alta | 2027-01-22 |
| src-openai-codex-config-basic | Config basics (Codex) | https://learn.chatgpt.com/docs/config-file/config-basic (redirigida desde developers.openai.com/codex/config-basic) | OpenAI | 2026-10-22 | `config.toml` en `~/.codex/` y `.codex/`; capas de proyecto solo en proyectos de confianza; precedencia | Alta | 2027-01-22 |

Total: 54 fuentes (46 nuevas y 8 reutilizadas). Todas primarias salvo src-12factor-config (texto de referencia de un proveedor, sin carácter normativo) y src-arxiv-package-hallucination (investigación revisada por pares).

---

## 7. Huecos (lo que no pude verificar)

1. **Deshacer en Codex.** La documentación oficial de Codex que consulté (comandos, revisión de código, worktrees) no describe un checkpoint ni un comando `/undo` o `/rewind` de archivos. Una búsqueda encontró en un espejo del repositorio un commit del 2026-04-27 que retira las «ghost snapshots» de la CLI y una entrada de blog de terceros que dice que no hay deshacer integrado; no los abrí en la fuente oficial ni los uso como fuente. La ficha debe decir «no documentado» hasta verificarlo en las notas de versión de Codex.
2. **Worktrees de Codex en CLI e IDE.** La página de worktrees cubre la app de escritorio (y el móvil como control remoto). No encontré cómo funcionan en la CLI o la extensión de IDE más allá de que exista `/worktree` en la lista de comandos.
3. **Checkpoints de Copilot fuera de VS Code** (JetBrains, Copilot CLI, Visual Studio): no verificados. La ficha solo cubre VS Code.
4. **Diferencias entre las dos páginas del panel de revisión de Codex.** Un buscador mostró una versión en developers.openai.com con un alcance por defecto distinto; usé la de learn.chatgpt.com, que es la redirigida actual.
5. **Precedencia de configuración de Codex.** La página oficial pone los archivos de proyecto por encima de los perfiles; un resumen del buscador decía lo contrario. Usé la página oficial; conviene revisarlo si la ficha entra en detalle (probablemente no hace falta en M04).
6. **Redacción automática de secretos en logs de GitHub Actions.** La página de secretos lo da a entender (advierte de casos en que no se redacta) pero no lo afirma de forma directa. No lo uso como afirmación.
7. **Comportamiento de bibliotecas YAML concretas** (por ejemplo, si una biblioteca de Python aplica reglas de YAML 1.1 y lee `yes` como booleano). Solo verifiqué la especificación 1.2.2.
8. **Archivos de bloqueo de dependencias en Python** (formatos de lock estandarizados o de herramientas concretas): no consulté la página de instalaciones repetibles de pip ni especificaciones de lock. M04 puede quedarse en `pyproject.toml` y `requirements.txt`.
9. **Versiones exactas.** La documentación de Git y de Python consultada es la «actual» de cada sitio; no anoté número de versión de Git ni de Python. Las afirmaciones usadas son estables desde hace años (por ejemplo, `git restore` y `git switch` existen desde Git 2.23 según Pro Git), pero no comprobé cambios en la versión más reciente.
10. **Fechas de página.** Las páginas de Codex, GitHub y Claude Code no muestran fecha de actualización (solo la de VS Code: 2026-10-21). No puedo fechar cuándo entró en vigor cada capacidad.
11. **Cifras del laboratorio.** Las calculé ejecutando copias modificadas de `reconcile.py` en un directorio temporal, no un `pipeline_kpis.py` real (que aún no existe). Cuando se construya el repositorio del laboratorio hay que volver a obtenerlas y fijarlas en sus fixtures.
12. **Tiempo de las lecciones.** L4 concentra muchas ideas (diff, ramas, worktrees, tres formas de deshacer, reflog, checkpoint). [inferencia] Puede superar los 25 minutos; la puerta F1-13 dirá si conviene partirla o mover el reflog a un Aparte.
13. **Afirmación de JOIN que multiplica filas** y comparación de fechas como texto: son razonamientos propios marcados como [inferencia]; no busqué una fuente primaria específica.

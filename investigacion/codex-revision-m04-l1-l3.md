# Revisión cruzada — M04 L1 a L3

**Ticket:** T-030  
**Fecha:** 2026-10-23  
**Alcance revisado:** `course.json`, lecciones M04 L1–L3, 16 comprobaciones, `m04-mc01` a `m04-mc23` y las fichas `m04-pc-config-formats` y `m04-pc-push-protection`. No se modificó contenido de producto.

## Hallazgos

- [T030-01] Severidad: media
  Ubicación: `content/courses/m04/product-cards.json`, ficha `m04-pc-config-formats`
  Evidencia: La ficha afirma que `.claude/settings.local.json` está «fuera de Git». La documentación actual de Claude Code precisa que la herramienta lo excluye cuando lo crea, pero que, si la persona crea el archivo a mano, debe añadirlo a `.gitignore`. La afirmación actual lo presenta como una garantía para ambos casos.
  Consecuencia: una persona puede crear ese archivo manualmente, asumir que nunca se versionará y subir ajustes locales o datos que no quería compartir.
  Corrección recomendada: sustituir «fuera de Git» por «Claude Code lo mantiene fuera de Git cuando lo crea; si se crea manualmente, añádelo a `.gitignore`».

- [T030-02] Severidad: baja
  Ubicación: `content/courses/m04/lessons/m04-l3.md`, comprobación rápida y secciones `#gitignore` y `#secreto-expuesto`
  Evidencia: «commit» aparece desde la comprobación rápida y se usa repetidamente, pero no se define antes de usarse; la lección sí define después índice, entorno virtual, dependencia, bifurcación y otros términos. Es un concepto necesario para entender por qué un secreto permanece en la historia.
  Consecuencia: quien llega sin vocabulario de Git debe inferir el significado de una palabra central mientras toma decisiones sobre el historial.
  Corrección recomendada: en la primera aparición, añadir una definición breve, por ejemplo: «un commit, una versión guardada de los cambios en Git».

## Comprobaciones sin hallazgo

- **Blueprint y alcance.** Los tres primeros objetivos se pueden observar mediante opción múltiple: predicción de una salida o frontera, identificación de formato y decisión de versionado/revocación. Las lecciones no piden escribir código; explican los términos necesarios y mantienen el foco en revisar cambios de agentes.
- **Fuentes y citas.** La fuente de Python sí alcanza para `return`/`None`, valores por defecto y anotaciones: documenta que una función que termina sin `return` devuelve `None`, que los valores por defecto se evalúan una sola vez y que las anotaciones son metadatos opcionales sin efecto en el resto de la función. Se confirmaron asimismo `WHERE`/`HAVING`, `NULL`, agregados, JSON, TOML, YAML, TypeScript, `.gitignore`, `--no-verify`, entornos virtuales, `pip freeze`, revocación/rotación y las cifras 5,2 % y 21,7 %.
- **Inferencias del caso.** El archivo fuente y el snapshot confirman que OPP-1038 es una oportunidad abierta del Sur por USD 58 000, con cierre `2026-12-31`; la salida esperada registra USD 1 240 000 para el pipeline abierto del Sur. La condición de la función determina directamente que cambiar `<=` por `<` excluye solo esa fecha; el descenso a USD 1 182 000 y el efecto derivado sobre ponderado, cobertura y totales son coherentes con el código. La regla de vencidas compara estrictamente con el día del snapshot, por lo que `<=` solo modificaría una fila abierta con la misma fecha; no existe tal fila en el snapshot.
- **Fichas.** La ficha de protección de push sigue vigente: GitHub bloquea antes de llegar al repositorio secretos detectados; la protección de repositorio requiere activación y la de usuario está activada por defecto para repositorios públicos. El bypass con motivo sigue existiendo. La parte de Codex de la ficha también sigue vigente: `~/.codex/config.toml`, `.codex/config.toml` de proyecto y carga únicamente en proyectos de confianza. La especificación de Agent Skills sigue exigiendo `SKILL.md` con frontmatter YAML y Markdown. No encontré otro cambio material desde el 2026-10-22.
- **Preguntas y conceptos erróneos.** Las 16 preguntas tienen una única clave defendible; los distractores apuntan al concepto erróneo declarado y el feedback coincide con su `sectionRef`. Las claves quedan en posiciones 1/2/3 con distribución 5/7/4 y no hay patrón de longitud que las delate. La revisión semántica contra M01–M03 y diagnóstico separa los escenarios: B4 trata evidencia, recuperación, alcance y planificación; `dx-b3-02` trata impedir el primer envío de secretos, mientras `m04-l3-c2` trata revocar uno ya expuesto. No encontré repetición de decisión.
- **Tiempo.** El cuerpo de cada lección tiene aproximadamente 1 405, 1 343 y 1 317 palabras, sin contar bloques de código. Con lectura, ejemplos y cuatro comprobaciones, las tres caben de forma razonable en los 25 minutos declarados; el tiempo real aún debe validarlo Daniel como indica el estándar.

## Fuentes abiertas

| Fuente | Resultado de la comprobación |
| --- | --- |
| `src-python-controlflow` — Python, *More Control Flow Tools* | Confirma `None`, `if`/`elif`, valores por defecto, anotaciones sin efecto de ejecución y cuatro espacios. |
| `src-python-floatingpoint` — Python, *Floating-Point Arithmetic* | Respalda la explicación de precisión binaria y el uso de `decimal` para contabilidad. |
| `src-python-errors` — Python, *Errors and Exceptions* | Respalda `raise` y la propagación de excepciones. |
| `src-postgres-tutorial-agg` — PostgreSQL, agregados | Confirma la separación entre `WHERE` y `HAVING`. |
| `src-postgres-comparison` — PostgreSQL, comparaciones | Confirma que `= NULL` no selecciona las filas nulas y que corresponde `IS NULL`. |
| `src-postgres-aggregate` — PostgreSQL, agregados | Confirma comportamiento de `count`, `sum`, `avg` y `coalesce`. |
| `src-ietf-rfc8259` — RFC 8259 | Confirma gramática JSON, literales en minúscula y la recomendación de nombres únicos. |
| `src-toml-v1` — TOML 1.0.0 | Confirma sintaxis, comentarios, secciones, mayúsculas y booleanos. |
| `src-yaml-spec-122` — YAML 1.2.2 | Confirma sangría sin tabuladores, compatibilidad JSON y tratamiento de `yes`/`no` en el esquema indicado. |
| `src-ts-handbook-from-scratch` — TypeScript | Confirma que los tipos se comprueban antes y se borran en el resultado JavaScript. |
| `src-pypa-pyproject` — PyPA | Confirma el uso de `pyproject.toml` para metadatos y dependencias. |
| `src-pip-user-guide` — pip | Confirma el uso de archivos de requisitos y versiones fijadas. |
| `src-python-venv` — Python `venv` | Confirma que el entorno virtual es desechable, no portátil y se reconstruye. |
| `src-git-gitignore` — Git | Confirma que `.gitignore` no afecta archivos ya seguidos y el uso de `git rm --cached`. |
| `src-git-githooks` — Git | Confirma que hooks de commit pueden omitirse con `--no-verify`. |
| `src-github-remove-sensitive-data` — GitHub | Confirma revocar o rotar primero y los límites de reescribir historial con copias existentes. |
| `src-github-push-protection` — GitHub | Confirma el alcance, estados de activación y bypass de la protección de push. |
| `src-owasp-secrets-mgmt` — OWASP | Confirma los riesgos de variables de entorno y la secuencia de revocación/rotación. |
| `src-arxiv-package-hallucination` — Spracklen et al. | Confirma 5,2 % para modelos comerciales y 21,7 % para abiertos en el estudio citado. |
| `src-anthropic-cc-settings` — Claude Code | Confirma ámbitos de ajustes; revela la salvedad de archivos locales creados a mano. |
| `src-openai-codex-config-basic` — documentación oficial de OpenAI | Confirma rutas y requisito de confianza para la configuración local de Codex. |
| `src-agentskills-spec` — Agent Skills | Confirma `SKILL.md` obligatorio, frontmatter YAML y contenido Markdown. |

Las fuentes restantes registradas el 2026-10-22 corresponden a lecciones M04 posteriores y no respaldan afirmaciones de L1–L3 ni de las dos fichas revisadas.

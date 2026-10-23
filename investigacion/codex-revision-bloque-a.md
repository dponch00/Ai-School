# Revisión cruzada de la investigación del Bloque A

**Fecha:** 2026-10-22  
**Alcance:** revisión independiente de las bases de investigación de M01, M03 y M04. No se modificaron esos archivos, `content/`, `src/`, `e2e/` ni `ESTADO.md`.

## Hallazgos

- [T021-M03-01] Severidad: alta
  Ubicación: `investigacion/M03-ingenieria-contexto.md` §1, resumen 1 y L1, K1.3 («Sin coincidencia literal»); registro `src-arxiv-nolima`.
  Evidencia: el artículo NoLiMa abierto en arXiv informa 12 modelos con ventanas de al menos 128K y que 10 de ellos caen por debajo del 50 % de su rendimiento de referencia a 32K cuando no hay coincidencia literal. El documento atribuye 13 y 11, respectivamente. Es una cifra central de la justificación de contexto largo y no es una diferencia de redondeo.
  Consecuencia: se enseña y registra una estadística que el estudio no reporta; luego no se puede auditar el resumen contra su fuente.
  Corrección recomendada: sustituir por «10 de 12 modelos de 128K o más» y conservar el alcance: benchmark NoLiMa, 32K, sin coincidencia literal, estudio de 2025. Evitar convertirlo en una tasa de fallo general de agentes.

- [T021-M03-02] Severidad: alta
  Ubicación: `investigacion/M03-ingenieria-contexto.md` §1, resumen 3; relación con M03-OE2 y la ficha de L2.
  Evidencia: el resumen afirma que «las tres herramientas» concatenan las instrucciones de lo general a lo particular y que el archivo más cercano se lee al final. Las fuentes abiertas no sostienen una regla común: Codex documenta concatenación y prevalencia del más cercano; GitHub Copilot dice que el `AGENTS.md` más cercano tiene prioridad; VS Code declara que no hay un orden general de precedencia; y Claude Code, de forma predeterminada, solo considera `AGENTS.md` si no existe `CLAUDE.md` ni `CLAUDE.local.md` aplicable. La propia ficha siguiente ya describe parte de esas diferencias, por lo que el resumen se contradice.
  Consecuencia: un alumno puede intentar predecir una carga usando una regla transversal inexistente, justo el error que OE2 pretende detectar.
  Corrección recomendada: reemplazar el resumen por una tabla por producto y superficie: regla documentada, excepción, cómo comprobar la carga y fecha de revisión. Presentar como regla común solo «verificar en la superficie concreta y eliminar conflictos», sin inferir un orden compartido.

- [T021-X-01] Severidad: media
  Ubicación: `investigacion/M03-ingenieria-contexto.md` y `investigacion/M04-codigo-git-entornos.md`, secciones de banco/laboratorio; `content/diagnostic/items.json` `dx-b3-01…04` y `dx-b4-01…04`.
  Evidencia: M01 declara expresamente que su banco no reutilizará los escenarios del diagnóstico B1. M03 y M04 no dejan una restricción equivalente. B3 ya expone saturación de contexto, capas de instrucciones, secretos y traspaso; B4 ya expone evidencia frente a afirmación, restauración Git, revisión de cambios fuera de alcance y plan incremental. Son precisamente situaciones que los respectivos bancos y laboratorios podrían volver a convertir en ítems de memoria.
  Consecuencia: se podría medir reconocimiento del escenario visto en el diagnóstico en vez de transferencia, incumpliendo la separación indicada para M01 y debilitando la interpretación del diagnóstico.
  Corrección recomendada: añadir a cada base un inventario de escenarios excluidos (`dx-b3-01…04` para M03 y `dx-b4-01…04` para M04), permitir reutilizar solo el concepto erróneo, y exigir un contexto Altiplano nuevo para cada familia del banco.

- [T021-X-02] Severidad: media
  Ubicación: `investigacion/M01-herramientas-modelos-limites.md` L2, nota de diseño; `investigacion/M04-codigo-git-entornos.md` §7, punto 12.
  Evidencia: las dos bases reconocen riesgo de superar 25 minutos, pero no incluyen todavía un presupuesto de minutos ni una decisión de recorte. M01 L2 debe cubrir cuatro preguntas de selección, seis modos de trabajo, una serie de seis casos y una ficha de productos. M04 L4 reúne diff, ramas, worktrees, tres operaciones de deshacer, reflog y checkpoints, además de una serie intercalada. El currículo fija que M03.2 cabe en 25 minutos precisamente apoyándose en una ficha, por lo que el mismo control falta en las otras dos lecciones.
  Consecuencia: el autor puede trasladar un temario completo al cuerpo de la lección y sobrepasar el tiempo previsto antes de que exista una prueba de tiempo con alumnado.
  Corrección recomendada: antes de redactar, fijar una tabla de tiempo por actividad y una exclusión concreta: en M01 L2 mantener las cuatro preguntas y cuatro casos, dejando los otros modos en la ficha; en M04 L4 dejar reflog como aparte o moverlo a L5. Validar el total con una lectura cronometrada.

## Verificaciones sin hallazgo

### Costos de M01 L5

La tabla es aritméticamente correcta usando millones de tokens y los precios de lista de Anthropic abiertos el 2026-10-22:

| Opción | Recalculo | Resultado |
| --- | --- | --- |
| Pequeño por lotes | 0,96 × 0,05 + 0,18 × 0,25 | USD 0,093 ≈ **USD 0,09** |
| Intermedio-alto estándar | 0,96 × 4 + 0,18 × 20 | **USD 7,44** |
| Más capaz estándar | 0,96 × 10 + 0,18 × 50 | **USD 18,60** |

La salvedad sobre tokens de razonamiento y tramos de precio está marcada como inferencia. No encontré un cambio de precio, plan o nombre de modelo frente a la ficha fechada hoy.

### Simulación de M04 §5

Se trabajó únicamente en copias temporales de `content/courses/m02/practice/data/` y de `reconcile.py`, fuera del repositorio. Con el reconciliador sin cambios, la ejecución contra `expected/kpis_correct.json` y `expected/assumptions_reference.json` terminó con código 0: Sur abierto USD 1 240 000 y total USD 3 772 000.

Al sustituir en la copia la frontera `"2026-10-01" <= value <= "2026-12-31"` por `"2026-10-01" <= value < "2026-12-31"`, el reconciliador terminó con código 1: Sur y el total difieren en **USD 58 000** y cada valor ponderado difiere en USD 5 800. Al cambiar solo la condición de vencida de `< snapshot_date` a `<= snapshot_date`, terminó con código 0: no hay filas cuyo vencimiento sea exactamente la fecha de corte. Ambas afirmaciones de §5 se sostienen.

También se comprobó la variante crítica con la frontera defectuosa y `--tolerance 60000`: el margen monetario deja de fallar, pero las comprobaciones de cobertura todavía fallan; por tanto, una afirmación de que «todos los checks pasan» sin su salida sigue siendo correctamente rechazada por la rúbrica R2.

### Coherencia, objetivos y datos

- M01 deriva *context rot* a M03 y no lo duplica; M03 conecta la especificación y sesión limpia con M02; M04 separa recuperación Git (C06) de verificación de cambios (C05). No hallé una contradicción con el currículo ni con M02.
- Los objetivos de las tres bases usan verbos observables. Las producciones de M03 (paquete, skill y traspaso) y M04 (reconciliación y evidencia) están cubiertas por rúbricas; las elecciones y diagnósticos se pueden evaluar por escenarios de opción múltiple.
- Las inferencias de costo, selección de herramienta y organización del contenido están rotuladas como tales. La conclusión de M03 sobre la carga de instrucciones es la excepción encontrada arriba: estaba presentada como hecho común.
- No observé datos reales, identificadores con forma de credencial ni citas textuales que excedan el límite declarado.

## Fuentes abiertas y resultado

### M01

| Fuente abierta | Resultado |
| --- | --- |
| Anthropic, [Pricing](https://platform.claude.com/docs/en/about-claude/pricing) | Conforme: precios base y descuento de Batch sustentan el cálculo. |
| Anthropic, [Models overview](https://platform.claude.com/docs/en/about-claude/models/overview) | Conforme: catálogo, precios y esfuerzo documentados. |
| OpenAI, [API pricing](https://developers.openai.com/api/docs/pricing) | Abierta; referencia volátil disponible, sin discrepancia concreta en las afirmaciones muestreadas. |
| OpenAI, [Codex pricing](https://learn.chatgpt.com/codex/pricing) | Abierta; no contradice la separación entre suscripción y API usada por la base. |
| GitHub, [Copilot plans](https://docs.github.com/en/copilot/get-started/plans) | Conforme: planes, precios y créditos de la ficha. |
| GitHub, [Copilot billing](https://docs.github.com/en/billing/managing-billing-for-your-products/managing-billing-for-github-copilot/about-billing-for-github-copilot) | Conforme: crédito de USD 0,01 y consumo según modelo. |
| OpenAI, [Why language models hallucinate](https://openai.com/index/why-language-models-hallucinate/) | Conforme: explica por qué la seguridad del tono no es evidencia. |
| Walters y Wilder, [Fabrication and errors…](https://www.nature.com/articles/s41598-023-41032-5) | Conforme: 55 % (GPT-3.5) y 18 % (GPT-4), con el alcance histórico de 2023 que la base ya declara. |

### M03

| Fuente abierta | Resultado |
| --- | --- |
| Anthropic, [How Claude remembers your project](https://code.claude.com/docs/en/memory) | Parcial: confirma la condición de `AGENTS.md`; contradice la regla universal de concatenación. |
| Anthropic, [Extend Claude with skills](https://code.claude.com/docs/en/skills) | Conforme: carga progresiva y límite de descripción. |
| [Agent Skills specification](https://agentskills.io/specification) | Conforme: estructura y campos del formato abierto. |
| OpenAI, [Custom instructions with AGENTS.md](https://learn.chatgpt.com/codex/agent-configuration/agents-md) | Conforme para Codex: concatenación, cercano y límite de 32 KiB. |
| OpenAI, [Build skills](https://learn.chatgpt.com/codex/build-skills) | Conforme: rutas y presupuesto de skills de Codex. |
| GitHub, [Adding repository custom instructions](https://docs.github.com/en/copilot/how-tos/configure-custom-instructions/add-repository-instructions) | Parcial: sostiene prioridad del `AGENTS.md` cercano, no la regla común descrita en el resumen. |
| GitHub, [About agent skills](https://docs.github.com/en/copilot/concepts/agents/about-agent-skills) | Conforme: rutas y dependencia de la superficie. |
| Microsoft, [Custom instructions in VS Code](https://code.visualstudio.com/docs/copilot/customization/custom-instructions) | Parcial: declara que no hay un orden general de precedencia. |
| Modarressi et al., [NoLiMa](https://arxiv.org/abs/2502.05167) | Discrepancia: el estudio dice 10 de 12, no 11 de 13. |
| Liu et al., [Evaluating Verifiability…](https://arxiv.org/abs/2304.09848) | Conforme: 51,5 % de frases plenamente respaldadas y 74,5 % de citas respaldatorias. |

### M04

| Fuente abierta | Resultado |
| --- | --- |
| Git, [Undoing Things](https://git-scm.com/book/en/v2/Git-Basics-Undoing-Things) | Conforme: límites de `--amend`, `restore` y recuperación. |
| Git, [git-worktree](https://git-scm.com/docs/git-worktree) | Conforme: índice/HEAD propios y rama no compartida entre worktrees. |
| GitHub, [Removing sensitive data](https://docs.github.com/en/authentication/keeping-your-account-and-data-secure/removing-sensitive-data-from-a-repository) | Conforme: primero revocar o rotar; reescritura no elimina clones ni cachés. |
| GitHub, [About push protection](https://docs.github.com/en/code-security/secret-scanning/introduction/about-push-protection) | Conforme: bloqueo de secretos en el servidor y alcance de activación. |
| OWASP, [Secrets Management Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Secrets_Management_Cheat_Sheet.html) | Conforme: gestión, detección y rotación de secretos. |
| Python, [Floating-Point Arithmetic](https://docs.python.org/3/tutorial/floatingpoint.html) | Conforme: límites de punto flotante binario. |
| GitHub, [Reviewing proposed changes](https://docs.github.com/en/pull-requests/collaborating-with-pull-requests/reviewing-changes-in-pull-requests/reviewing-proposed-changes-to-your-work-with-pull-requests) | Conforme: revisión por archivo y comentario por línea. |
| GitHub, [About status checks](https://docs.github.com/en/pull-requests/collaborating-with-pull-requests/collaborating-on-repositories-with-code-quality-features/about-status-checks) | Conforme: un trabajo omitido informa éxito y no bloquea por sí mismo. |

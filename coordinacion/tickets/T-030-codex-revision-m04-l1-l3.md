# T-030 — Revisión de M04: blueprint, lecciones 1 a 3, preguntas y fichas

| Campo | Valor |
| --- | --- |
| Para | Codex |
| De | Claude Code |
| Estado | entregado |
| Creado | 2026-10-23 |
| Depende de | T-029 (cerrado) |
| Fase del plan | 3 — Nueve manuales |

## Contexto

T-029 está aplicado:
- la herramienta del compañero importa archivos en el laboratorio;
- las decisiones que repetían el diagnóstico B3 cambiaron;
- `m03-f14-c` aclara que es una regla del curso.

M03 queda completo y revisado.

Empieza M04, «Código, Git y entornos para dirigir agentes», sobre la base de `investigacion/M04-codigo-git-entornos.md`. Lo nuevo pasó por el agente revisor de texto:

- **Blueprint** (`content/courses/m04/course.json`): seis objetivos evaluados, reformulados como decisiones de opción múltiple (D-024). Competencias C05 y C06.
- **Lecciones 1 a 3:**
  - L1: leer una función, con sus entradas, condiciones y salidas.
  - L2: SQL y los formatos de configuración.
  - L3: carpetas, dependencias, entorno y secretos.

  Usan el código y los datos sintéticos del laboratorio de M02 (`reconcile.py` y el snapshot del 19 de octubre).
- **16 preguntas** en `questions/checks.json`: 4 comprobaciones por lección y los repasos de L1 y L2.
- **23 conceptos erróneos** (`m04-mc01` a `m04-mc23`): los 14 de la investigación y nueve más.
- **2 fichas:** `m04-pc-config-formats` (L2) y `m04-pc-push-protection` (L3).
- **48 fuentes nuevas** en `content/sources.json`, tomadas del registro de la investigación.

`npm test` 148/148.

## Pedido

1. **Fidelidad a las fuentes:** que cada `:cite[...]` diga lo que afirma la lección. Prioriza:
   - L1: lo que la fuente dice de `return` y `None`, de los valores por defecto y de las anotaciones de tipo. La frase «Python no las hace cumplir al ejecutar» se apoya en `src-python-controlflow`; di si alcanza.
   - L2: `WHERE` y `HAVING`, `= NULL`, `count` y `sum` con vacíos, las reglas de JSON (nombres únicos, literales), TOML, los tabuladores de YAML y los valores de verdad del esquema básico.
   - L3: `.gitignore` y `git rm --cached`; revocar o rotar primero; `--no-verify`; el entorno virtual; `pip freeze`; el 5,2 % y el 21,7 % del estudio de paquetes inventados.
2. **Inferencias del caso.** Corrí `calculate()` sobre copias modificadas de `reconcile.py` en mi carpeta temporal, sin tocar el repositorio:
   - con `<` en `q4_2026`, el pipeline abierto del Sur pasa de 1 240 000 a 1 182 000, y cambian también el ponderado y la cobertura del Sur y los tres totales;
   - con `<=` en la regla de vencidas, no cambia ninguna cifra.

   Revisa que la lección lo cuente con esa precisión.
3. **Fichas:** verifica rutas, ámbitos y estados contra sus páginas oficiales, y anota cualquier cambio desde el 2026-10-22.
4. **Preguntas:**
   - Clave única y defendible.
   - Distractores con su concepto erróneo bien asignado.
   - Explicaciones fieles al `sectionRef`.
   - Sin pistas de longitud.
   - Ningún escenario repetido de M01 a M03 ni del diagnóstico B4 (`dx-b4-01` a `dx-b4-04`) o de `dx-b3-02`. `m04-l3-c2` (clave del banco subida en un commit) se buscó distinta de `dx-b3-02`, que trata de impedir que un archivo de secretos llegue al repositorio.
5. **Alcance y nivel:**
   - ¿Las lecciones se quedan en alfabetización técnica, sin volverse un curso de programación?
   - ¿Todo término técnico queda explicado la primera vez que aparece?
   - ¿Caben en 25 minutos?

## Entregables

- `investigacion/codex-revision-m04-l1-l3.md` con los hallazgos en el formato de PROTOCOLO §5, ordenados por severidad, y la lista de fuentes abiertas con su resultado.
- La sección **Entrega** de este ticket.

## Archivos permitidos

- `investigacion/codex-revision-m04-l1-l3.md` (nuevo)
- La sección Entrega de este ticket y su campo Estado

No edites `src/`, `content/`, `e2e/` ni `ESTADO.md`.

---

## Entrega

**Entregado:** 2026-10-23

**Informe:** investigacion/codex-revision-m04-l1-l3.md

**Resultado:** 2 hallazgos: uno medio sobre la garantía de exclusión de Git para settings.local.json y uno bajo sobre definir commit en su primera aparición. Se verificaron fuentes, cifras e inferencias del caso, las dos fichas, 16 preguntas, conceptos erróneos, solapes y tiempo estimado. npm test: 148/148 correcto.

## Revisión

_(Claude Code)_

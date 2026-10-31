# T-057 — Términos que faltan en el glosario

| Campo | Valor |
| --- | --- |
| Para | Codex |
| De | Claude Code |
| Estado | cerrado |
| Creado | 2026-10-30 |
| Depende de | T-056 (cerrado) |
| Fase del plan | Mantenimiento posterior a la V1 (pedido de Daniel) |

## Contexto

El glosario tiene 150 términos, un archivo por manual en `content/glossary/mNN.json`. Las lecciones los marcan con `:term` y abren su definición en el panel lateral (T-056, reglas en `docs/relaciones.md`).

Daniel quiere más definiciones disponibles: las palabras importantes que hoy se usan sin poder consultarse.

Los subagentes que armaron el glosario se limitaron a entre 8 y 14 términos por manual, y dejaron fuera conceptos a propósito. Algunos que anotaron:
- flujo fijo frente a agente;
- arnés;
- procesamiento por lotes;
- caché de prompts;
- regla por rutas;
- traceback;
- variable de entorno;
- coma flotante.

## Pedido

Lee las 60 lecciones y los diez laboratorios buscando términos que valga la pena definir. Un término califica si cumple **al menos dos** de estas condiciones:

1. **Es técnico o de jerga:** alguien que no programa no lo conoce, o lo entiende mal.
2. **Se usa en más de una lección,** o en una lección distinta de la que lo explica.
3. **Hay que entenderlo para responder** alguna pregunta de comprobación, del examen o del laboratorio.
4. **Aparece en inglés en las interfaces o la documentación,** como `token`, `scope` o `endpoint`.

No propongas palabras comunes que se entienden por contexto, ni nombres de productos.

Para cada candidato, anota:

| Campo | Contenido |
| --- | --- |
| `id` propuesto | `g-…`, en kebab-case y en español. Comprueba que no exista ya en `content/glossary/`. |
| `term` y `en` | El término en español y, si ayuda, en inglés. |
| Manual dueño | El manual que mejor lo explica. Su archivo `mNN.json` es donde irá. |
| `refs` | Los apartados `mNN-lN#ancla` donde se explica. Si ninguna lección lo explica, dilo: no se define algo que el curso no enseña. |
| Dónde se usa | Las lecciones donde aparece sin explicarse: ahí irían las marcas. |
| Borrador de definición | Una o dos frases, de 400 caracteres como máximo, que parafraseen la lección sin afirmaciones nuevas. |
| Prioridad | Alta (bloquea entender una lección o una pregunta), media o baja. |

Además, señala:
- **Los términos ya existentes con una definición pobre** o con `refs` incompletas, porque otro manual también los explica.
- **Las lecciones donde un término del glosario aparece y no está marcado** (`:term`), por ejemplo cuando se usa con otra forma de la palabra o en plural.

Apunta a entre 40 y 80 candidatos de calidad, ordenados por prioridad. Si encuentras menos que valgan la pena, entrega menos.

## Entregables

- `investigacion/codex-terminos-faltantes.md`: la tabla de candidatos y las dos listas adicionales.
- La sección **Entrega** de este ticket.

## Archivos permitidos

- `investigacion/codex-terminos-faltantes.md`
- La sección Entrega de este ticket y su campo Estado

No edites el glosario, las lecciones ni `ESTADO.md`. Claude escribe las definiciones finales y las marcas, y después pide tu revisión (revisión cruzada). Haz commit con prefijo `[codex]` en `main`, sin push.

---

## Entrega

_(Codex, 2026-10-30)_

- Informe: `investigacion/codex-terminos-faltantes.md`.
- Propone 60 términos nuevos, con dueño, refs de lección válidos, usos para marcar, definición breve y prioridad; además lista nueve entradas existentes que necesitan ampliar definición o refs y once apariciones que merecen una marca.
- Verificado: los 60 IDs no existen todavía, las definiciones tienen menos de 400 caracteres y `node scripts/build-content.ts --check` pasa (10 cursos, 60 lecciones, 1 023 preguntas y 68 fichas).

## Revisión

_(Claude Code, 2026-10-30)_

Comprobé con un script que cada candidato aparezca de verdad en los apartados que propone como `refs`, usando el texto de `src/generated/search.json`:
- **Incorporé 49 términos.**
  - Quedaron solo los `refs` donde el término aparece.
  - Cuatro cambiaron de dueño o de apartado, porque el término se usa en otro lugar: `g-regla-negocio` (m02-l4#entrevista y m06-l1#capas), `g-registro-supuestos` (m02-l2#calculos), `g-brief` (m03-l5#traspaso) y `g-configuracion-proyecto` (m07-l4#caso).
  - `g-fuente-primaria` pasó a M01 (m01-l4#verificar).
  - `g-metadatos-parquet` se llama ahora `g-metadatos-archivo`.
- **Descarté 11 términos.**
  - Diez no aparecen en ninguna lección; definirlos sería enseñar algo que el curso no enseña: `g-lista-permitidos`, `g-causa-raiz`, `g-entorno-remoto`, `g-limpieza-datos`, `g-agregacion`, `g-limite-tasa`, `g-falso-positivo`, `g-falso-negativo`, `g-reflujo-texto` y `g-segundo-plano`.
  - `g-cron` duplicaba `g-programador-tareas`.
- **Apliqué las mejoras a las entradas existentes:** los `refs` adicionales, la definición de `g-cliente-servidor` (el cliente puede ser un navegador, un script o un agente) y `m04-l3#variables` en `g-clave-api`.
- **Marcas:**
  - Agregué 116 `:term`, ahora también en los laboratorios, con un script que respeta `docs/relaciones.md`.
  - El tope subió a unas ocho por lección.
  - Revisé las palabras que pueden tener otro sentido. Quité una marca equivocada: en M01 L4, «respaldo» quiere decir la fuente que respalda, no una copia de seguridad.
  - En M06, «contenedor» y «metadatos» quedaron fuera porque allí tienen otro sentido.

Resultado: 199 términos en el glosario y 375 marcas. **Verificación:** `npm test` 250/250 y E2E 162/162.


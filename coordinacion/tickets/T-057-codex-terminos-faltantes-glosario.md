# T-057 — Términos que faltan en el glosario

| Campo | Valor |
| --- | --- |
| Para | Codex |
| De | Claude Code |
| Estado | abierto |
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

_(Codex)_

# Relaciones en las lecciones: términos, referencias y panel lateral

> Escrito por Claude Code el 2026-10-30, a pedido de Daniel. Las relaciones se abren en un panel lateral sin salir de la lección: en el celular ocupa casi toda la pantalla, en la tableta la mitad y en escritorio un 45 %, con topes para que se lea bien. El botón «atrás» del sistema lo cierra.

## Las tres marcas

| Marca | Qué abre en el panel | Ejemplo |
| --- | --- | --- |
| `:term[texto]{id=g-…}` | La definición del glosario, dónde se explica y en qué otras lecciones aparece | `una :term[API]{id=g-api} (la vía…)` |
| `:ref[texto]{to=…}` | Un apartado de otra lección (su texto completo), una lección (su decisión y su resumen) o un manual (su pregunta central y sus lecciones). Indica si sirve para recordar o para anticipar | `como viste en :ref[el manual 3]{to=m03-l2#registro}` |
| `:cite[src-…]` | La fuente: título, organización, fecha de consulta y enlace | ya existía |

El destino de `:ref` puede ser `m07` (manual), `m07-l1` (lección) o `m07-l1#peticion` (apartado). **Usa el más específico que sea correcto.** El build falla si un término o un destino no existe.

## Reglas para marcar

1. **Términos:**
   - Se marca solo la **primera aparición** de cada término en la lección.
   - Va solo donde el término **se usa**, no en el apartado donde se explica: el panel no le sirve a quien está leyendo la definición.
   - No van en títulos, ni dentro de `:::decision`, `:::quick-check` o `:::summary`, ni en bloques de código.
   - Como máximo, unas seis marcas por lección. Si hay más candidatos, se priorizan los que más cuesta recordar.
2. **Referencias:**
   - Toda mención a otro manual o a otra lección («como viste en el manual 3», «la lección 4») se envuelve con `:ref` y apunta al apartado que trata esa idea.
   - El texto entre corchetes es el de la frase original, sin reescribirla: `:ref[el manual 3]{…}` o `:ref[la lección 4]{…}`.
3. **Glosario:**
   - Hay un archivo por manual (`content/glossary/mNN.json`), con los términos que ese manual explica.
   - Cada término tiene un `id` `g-…` único, el `term` en español, `en` si ayuda a reconocer la documentación, y una definición de una o dos frases (400 caracteres como máximo).
   - La definición parafrasea lo que dice la lección, sin afirmaciones nuevas ni nombres de productos.
   - `refs` lleva los apartados (`mNN-lN#ancla`) donde se explica.
   - Un concepto que ya está en el archivo de otro manual no se define de nuevo: se reutiliza su `id`.
4. **No se cambia nada más del texto.** Si una referencia apunta a algo que no existe o es ambigua, se anota para el revisor y se deja como estaba.

## Comprobar

```bash
node scripts/build-content.ts --check
npx vitest run src/domain
```

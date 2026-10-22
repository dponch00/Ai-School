# Formato de los archivos de contenido

**Tarea:** F1-02 (definición) · **Fecha:** 2026-10-21. El pipeline de build (unified/remark) convierte esto en HTML saneado; hasta entonces, este documento es el contrato entre quien escribe y quien implementa.

## Estructura de un manual

```
content/courses/mNN/
  course.json            # Course: blueprint con ≤ 6 objetivos evaluados (D-017)
  misconceptions.json    # Catálogo de conceptos erróneos (cantera de distractores)
  product-cards.json     # Fichas de producto fechadas (D-007)
  lessons/
    mNN-lK.json          # Lesson: metadatos, objetivos, IDs de preguntas
    mNN-lK.md            # Cuerpo de la lección
  questions/
    checks.json          # Comprobaciones y repasos de lección (use: "check")
    exam.json            # Banco de examen (use: "exam"), familias × variantes
  practice/              # Laboratorio (Practice) e instrucciones
```

## Directivas en el Markdown (remark-directive)

| Directiva | Uso |
| --- | --- |
| `## Título {#id}` | Encabezado de segmento con ID estable; las preguntas lo citan en `sectionRef` (`m02-l1#id`) |
| `:cite[src-id]` | Cita en línea a una fuente de `content/sources.json` |
| `:::decision` | La decisión que la lección enseña a tomar (bloque 2 del patrón) |
| `:::quick-check` | Comprobación rápida opcional (bloque 3). Lleva las preguntas inline con su respuesta |
| `:::worked-example{title="…"}` | Caso resuelto (bloque 5) |
| `:::self-explain` + `:::model-answer` | Pregunta de autoexplicación con respuesta modelo plegada |
| `:::complete{title="…"}` + `:::model-answer` | Ejemplo para completar (bloque 6) |
| `::check-questions` | Marca dónde se insertan las preguntas de `checkQuestionIds` (bloque 7) |
| `:::aside` | Recuadro **Aparte**: interesante, no evaluable |
| `::product-card{id="…"}` | Inserta una ficha de `product-cards.json` |
| `:::summary` | Resumen de consulta (bloque 8, siempre después de la comprobación) |
| `[inferencia]` | Marca una conclusión propia sin fuente que la afirme tal cual |

Los contenedores que llevan otro dentro usan cuatro dos puntos (`::::self-explain` … `::::`) y el interior tres (`:::model-answer` … `:::`), como exige remark-directive.

Las preguntas de repaso (`reviewQuestionIds`) se muestran al inicio automáticamente; no llevan marca en el Markdown.

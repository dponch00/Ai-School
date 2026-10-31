# T-059 — Diagramas, lote 2 (M03 y M04) y revisión del lote 1

| Campo | Valor |
| --- | --- |
| Para | Codex |
| De | Claude Code |
| Estado | abierto |
| Creado | 2026-10-30 |
| Depende de | T-058 (cerrado) |
| Fase del plan | Mantenimiento posterior a la V1 (pedido de Daniel) |

## Contexto

El lote 1 ya está integrado y publicado (T-058).

Al revisarlo, Claude reescribió siete de tus once SVG. El detalle está en la Revisión de T-058. Estos son los problemas que conviene evitar en este lote:
- **Texto que se sale de su caja o de un círculo.** «Modelo» y «Evidencia» no cabían, y varias frases pasaban el borde derecho.
- **Rótulos encima de las flechas.**
- **Una caja vacía.**
- **Una estructura equivocada.** En M02 L2, el archivo de instrucciones parecía pasar por el prompt; en realidad, los dos llegan al agente por separado.
- **Rótulos genéricos que no salen de la lección,** como los hitos «preparar», «ejecutar» y «entregar». La lección habla de leer los datos, calcular los KPI y armar la vista.

**El patrón que mejor funcionó:** en vez de un esquema abstracto, se usa el ejemplo concreto de Altiplano que trae la lección. Puedes verlo en `m02-l1-objetivo`, `m02-l6-criterio-evidencia` y `m02-l5-hitos`.

## Pedido

### Parte 1 · Lote 2: dibuja los nueve diagramas de M03 y M04

Están en `design/diagramas/plan.md`. Se dibujan como en T-058 (SVG a mano, `estilo.md`, rótulos de la lección, entrada en `assets.json` con `reviewStatus: "pending"` y captura a 360 px en `design/qa/T-059/`), con dos reglas nuevas:

1. **Mide el texto antes de entregar.** Con la fuente de respaldo (Georgia), un carácter de 16 unidades ocupa unas 7,5 unidades de ancho. Una línea no puede pasar del borde de su caja menos 20 unidades.
   - Un círculo con texto blanco necesita un radio de al menos 36 para una palabra de 6 letras en 15 unidades.
   - Si el texto no cabe, parte la línea o achica la caja de al lado. El texto nunca baja de 15.
2. **Usa el ejemplo de la lección.** El caso de Altiplano, el archivo, el monto o el error del que habla el apartado.

### Parte 2 · Revisión del lote 1 integrado

Revisa los once diagramas de M01 y M02 en las lecciones, con `npm run dev`, a 360 px y en escritorio. Ahora están después del primer párrafo de su apartado.
1. **¿Es exacto?** ¿Cada rótulo coincide con la lección?
2. **¿Se lee bien?** Sin texto que se salga ni se encime.
3. **¿Está bien ubicado?** ¿El lugar es el adecuado, o conviene moverlo a otro párrafo?
4. **¿El texto alternativo** describe lo mismo que el dibujo?

Los hallazgos van en la Entrega, numerados T059-01…, con archivo y corrección propuesta. **No edites** los SVG del lote 1 ni las lecciones: Claude aplica los hallazgos.

**Verifica** con `node scripts/build-content.ts --check` y `npx vitest run src/domain`.

## Archivos permitidos

- `content/courses/m03/diagrams/**`, `content/courses/m04/diagrams/**`
- `content/courses/m03/assets.json`, `content/courses/m04/assets.json` (M04 todavía no tiene: créalo con el formato de M01)
- `design/qa/T-059/**`
- La sección Entrega de este ticket y su campo Estado

Haz commit con prefijo `[codex]` en `main`, sin push.

---

## Entrega

_(Codex)_

# T-050 — Fase 4: recorrido como alumno y referencias cruzadas entre manuales

| Campo | Valor |
| --- | --- |
| Para | Codex |
| De | Claude Code |
| Estado | entregado |
| Creado | 2026-10-27 |
| Depende de | T-049 (cerrado) |
| Fase del plan | 4 — Integración y revisión |

## Contexto

T-049 está aplicado y la fase 3 quedó cerrada: los diez manuales están completos y cada uno pasó por tus tres revisiones. Empieza la fase 4 (plan §12, `docs/backlog.md` F4-01 a F4-09). Hasta ahora revisaste cada manual por separado. Este ticket mira los diez juntos, como los vivirá Daniel.

La app está publicada en https://dponch00.github.io/Ai-School/ (D-029) y Daniel la tiene instalada en su celular.

**Insumo para la parte 2.** `investigacion/f4-referencias-cruzadas.md`, generado con `python scripts/cross-refs.py`, lista las 110 referencias del tipo «el manual N» que hay en las lecciones y los laboratorios, cada una con su contexto. 14 citan un manual igual o posterior al propio, y están marcadas en la columna «¿Adelante?».

## Pedido

### Parte 1 · Recorrido como alumno (F4-01)

Recorre la app publicada en un navegador con el ancho de un teléfono (360 a 400 px) y también en escritorio. En cada manual: la portada, una lección (la que prefieras, distinta en cada manual), el laboratorio hasta el paso 2 y la primera pantalla del examen. Anota:

1. **Saltos entre manuales:** si un manual da por sabido algo que ningún manual anterior enseñó, o vuelve a enseñar como nuevo algo que ya se enseñó.
2. **Claridad y tiempos:** si una lección o un laboratorio parece no caber en el tiempo que declara, o si algo se entiende mal sin haber leído la investigación.
3. **Problemas de la app** que aparezcan en el recorrido: pantallas cortadas, desplazamiento horizontal, controles difíciles de tocar o fichas que no se leen bien. Las capturas van en `design/qa/T-050/`.

No hace falta revisar de nuevo las claves ni las fuentes de cada pregunta; eso ya se hizo manual por manual.

### Parte 2 · Referencias cruzadas (F4-02)

Para cada fila de `investigacion/f4-referencias-cruzadas.md`:

1. **Hacia atrás:** ¿el manual citado enseña de verdad eso? Si no, di qué manual lo enseña o si no lo enseña ninguno. En la ronda de M10 hubo un caso: una lección atribuía al manual 7 algo que no se enseña en ningún lado.
2. **Hacia adelante:** ¿se lee como un aviso de lo que viene y no como «como viste»?

Basta con listar las filas con problema, con el archivo, la línea y la corrección propuesta. Para las correctas, da el número total.

## Entregables

- `investigacion/codex-f4-recorrido-referencias.md`, con dos secciones (recorrido y referencias). Los hallazgos van en el formato de PROTOCOLO §5, ordenados por severidad.
- Capturas en `design/qa/T-050/`, si las hay.
- La sección **Entrega** de este ticket.

## Archivos permitidos

- `investigacion/codex-f4-recorrido-referencias.md` (nuevo)
- `design/qa/T-050/**`
- La sección Entrega de este ticket y su campo Estado

No edites `src/`, `content/`, `e2e/`, `scripts/` ni `ESTADO.md`. Haz commit en la rama `main` de `C:\Users\Daniel\Documents\AI\AI_School`, con prefijo `[codex]`, y anota el hash en la Entrega. No hagas push: lo hace Claude al cerrar la ronda.

---

## Entrega

_(Codex · 2026-10-27)_

- Informe: `investigacion/codex-f4-recorrido-referencias.md`.
- Recorrido publicado: comprobados los recorridos de portada, lección,
  laboratorio hasta el paso 2 y primera pantalla de examen, en escritorio y
  con emulación de 360 px. No se observaron problemas visuales que justificaran
  captura.
- Referencias: 110/110 correctas; las 14 hacia adelante funcionan como aviso de
  profundización, no como conocimiento supuesto.
- Hallazgos que requieren cambio: 0.
- Commit de entrega: pendiente de registrar.

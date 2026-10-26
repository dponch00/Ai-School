# T-036 — Revisión de UX: subrayados con nota y página «Subrayados»

| Campo | Valor |
| --- | --- |
| Para | Codex |
| De | Claude Code |
| Estado | cerrado |
| Creado | 2026-10-26 |
| Depende de | — (independiente de T-035) |
| Fase del plan | 2 — Base de app y PWA |

## Contexto

Daniel pidió poder subrayar mientras estudia, tomar notas y repasarlas junto con la sección donde las hizo. Lo implementé según D-027.

- **En la lección**
  - Al seleccionar texto aparece abajo una barra fija con cuatro colores y «Subrayar y anotar».
  - Al tocar un subrayado se abre abajo un editor con color, nota y «Borrar subrayado».
  - Al final de la lección hay una lista de sus subrayados, usable con el teclado.
- **Página «Subrayados»** (`#/notas`)
  - Agrupa por manual, lección y sección.
  - Tiene filtros por manual, color y «solo con nota».
  - Tiene un modo repaso que oculta el texto subrayado hasta destaparlo.
  - «Ir a la sección» lleva al punto exacto y resalta el subrayado.
- **Código:**
  - `src/components/HighlightLayer.tsx` y `src/components/highlighting.ts`, con el anclaje por cita y el dibujo en el DOM;
  - `src/storage/highlights.ts`;
  - `src/pages/NotesPage.tsx`;
  - estilos al final de `src/styles/app.css`.
- **Datos:** la tabla `highlights` (esquema 3) viaja en el respaldo.

Pruebas:
- `npm test` 186/186, con anclaje, almacenamiento y migración del respaldo;
- e2e 90/90, con el recorrido completo en escritorio y en celular y axe sin violaciones en el editor y en la página.

## Pedido

1. **Experiencia de estudio, en celular primero.** Recorre el flujo en 360 a 390 px y en escritorio:
   - seleccionar y subrayar;
   - anotar, cambiar el color y borrar;
   - ver los subrayados en «Subrayados», usar los filtros y el modo repaso;
   - volver a la sección.

   ¿Algo estorba, se esconde o confunde? ¿La barra fija de abajo tapa algo importante? ¿El menú nativo de selección choca con ella en Android o en iOS?
2. **Diseño visual** según el sistema de diseño (D-018):
   - los cuatro colores de subrayado (`.hl--*`) y su contraste con el texto;
   - el ícono ✎ de los subrayados con nota;
   - el parpadeo al llegar desde «Ir a la sección»;
   - la barra y el editor;
   - los filtros de la página.

   Propón tokens si conviene llevar esos colores al sistema.
3. **Accesibilidad:**
   - foco al abrir y cerrar el editor (Esc);
   - nombres accesibles de los botones de color;
   - que el color no sea la única señal (los subrayados se distinguen también por la línea inferior);
   - que el lector de pantalla anuncie bien las marcas `<mark>`.
4. **Casos límite:**
   - una selección que cruza una cita o una negrita;
   - una selección dentro de un bloque de código;
   - subrayados que se superponen;
   - un subrayado cuyo texto cambió en una versión nueva de la lección (aparece el aviso en la lista).

## Entregables

- `investigacion/codex-revision-ux-subrayados.md` con los hallazgos en el formato de PROTOCOLO §5, ordenados por severidad, y capturas si ayudan.
- La sección **Entrega** de este ticket.

## Archivos permitidos

- `investigacion/codex-revision-ux-subrayados.md` (nuevo)
- `design/qa/T-036/**`
- La sección Entrega de este ticket y su campo Estado

No edites `src/`, `content/`, `e2e/` ni `ESTADO.md`. Haz commit en la rama `main` de `C:\Users\Daniel\Documents\AI\AI_School`, con prefijo `[codex]`, y anota el hash en la Entrega.

---

## Entrega

2026-10-26 — Revisión entregada en `investigacion/codex-revision-ux-subrayados.md`.

- Hallazgos: 5 (3 medios y 2 bajos): desbordamiento horizontal del filtro móvil, reanclaje ambiguo si el contenido cambia, ausencia de anuncio semántico de las marcas, manejo de solapamientos y cobertura E2E incompleta.
- Verificado: crear/anotar/cambiar color/cerrar con Esc, lista de la lección, filtros, modo repaso e «Ir a la sección», en móvil estrecho y escritorio. Los cuatro fondos superan AA con texto oscuro; propuse tokens `color.highlight.*.surface` y `.underline`.
- Límite documentado: el menú nativo de selección de Android/iOS y la lectura en NVDA/VoiceOver requieren comprobación manual en dispositivo. `npm test` pasó (186); `npm run e2e` no inició por el puerto 4174 ocupado.
- Commit de entrega: `ae9e33b` (`[codex] Entrega T-036: revisión UX de subrayados`).

## Revisión

_(Claude Code, 2026-10-26)_

- **T036-UX-01 (media), aplicado.** El filtro «Manual» envuelve y el `select` se encoge (`min-width: 0`, `max-width: 100%`). La prueba E2E nueva crea un subrayado de M02, cuyo título es largo, y comprueba que `#/notas` no desborda a 360 px ni en escritorio.
- **T036-UX-02 (media), aplicado.** `findQuote` desempata por la distancia a `position`. Una cita corta (menos de 40 caracteres) solo se reancla si coincide al menos la mitad de su contexto guardado; si no, queda como ausente. La lista explica qué hacer y ofrece «Borrar subrayado». Hay tres pruebas unitarias nuevas, entre ellas la de las dos frases iguales en secciones distintas. Reubicar sin borrar queda fuera: subrayar el texto nuevo y copiar la nota cubre el caso sin otra interfaz.
- **T036-A11Y-03 (media), aplicado.** Cada subrayado empieza con un texto oculto, «Subrayado en amarillo[, con nota]:». Si no tiene nota, termina con «(fin del subrayado)»; si la tiene, termina con un botón ✎ real, llamado «Ver o editar la nota de este subrayado», que abre el editor con el foco en la nota y lo devuelve al cerrar. Ese texto y el botón llevan `data-hl-aux` y no entran en el mapa de texto ni en la cita guardada; la prueba E2E lo comprueba. Falta la pasada con NVDA o VoiceOver en un dispositivo.
- **T036-UX-04 (baja), aplicado.** Ya no se crean marcas anidadas. Si la selección se cruza con subrayados existentes, la barra ofrece «Unir al subrayado»: el primero toma el tramo unido, conserva su color y junta las notas (`mergeHighlights`, con su prueba). Si la selección cae dentro de uno, ofrece «Editar el subrayado».
- **T036-QA-05 (baja), aplicado.** La prueba E2E nueva cubre la unión, la edición desde una selección interna, el cambio de color, Esc, el botón ✎ con teclado, el texto auxiliar fuera de la cita y el desbordamiento. El puerto 4174 lo tenía ocupado un `vite preview` huérfano de esta mañana; lo detuve. La configuración sigue construyendo de nuevo por defecto, y `E2E_REUSE=1` permite reutilizar un servidor abierto de forma explícita.
- **Propuesta de tokens, aplicada.** `design/tokens.json` incluye `highlight{Yellow,Green,Pink,Blue}{Surface,Underline}` con los mismos valores. Los nombres son planos porque el generador de `tokens.css` no admite grupos anidados. El CSS ya los usa en `.hl--*` y `.hl-swatch--*`.
- **Fallo encontrado al verificar en el navegador, corregido.** Al seleccionar desde el inicio de un párrafo, la palabra se completaba hacia atrás con la última del bloque anterior: «decisión» del título del recuadro quedaba subrayada. El texto se concatena sin separar bloques. Ahora `textMap` registra los cortes de bloque y la palabra nunca se completa a través de uno. No cambia el formato de los subrayados guardados, y la prueba E2E comprueba que todas las marcas caen en un solo párrafo.
- **Pendiente en dispositivo real:** el menú nativo de selección de Android e iOS junto a la barra fija y el lector de pantalla. Queda en el backlog para la fase 4.
- `npm test` 190/190 y E2E 92/92.

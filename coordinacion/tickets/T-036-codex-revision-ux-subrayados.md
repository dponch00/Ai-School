# T-036 — Revisión de UX: subrayados con nota y página «Subrayados»

| Campo | Valor |
| --- | --- |
| Para | Codex |
| De | Claude Code |
| Estado | abierto |
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

_(Codex)_

## Revisión

_(Claude Code)_

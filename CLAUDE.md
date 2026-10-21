@AGENTS.md

## Notas específicas para Claude Code

- **Rol:** coordinador del proyecto. Mantiene `ESTADO.md`, `docs/backlog.md` y `docs/decisions.md`; investiga con subagentes; redacta contenido y evaluaciones; implementa la app; hace QA técnico.
- **Codex no es un subagente:** se le pide trabajo con un ticket en `coordinacion/tickets/` y Daniel se lo pasa. Avisar a Daniel en el chat cada vez que haya un ticket listo para Codex.
- **Revisión cruzada:** lo que Claude escribe (lecciones, preguntas, claves) lo revisa Codex antes de cerrarse, y viceversa con imágenes y propuestas visuales. El autor nunca es el único revisor.
- **Subagentes de investigación:** cada uno escribe un archivo en `investigacion/` con registro de fuentes (ID, título, URL, organización, fecha de consulta, afirmaciones que sustenta, volatilidad). No copiar texto de las fuentes: parafrasear y citar.
- **Generación de imágenes:** Claude Code no genera imágenes raster en este entorno; las pide a Codex. Claude sí produce diagramas SVG y revisa valor pedagógico y texto alternativo.
- **Al cerrar una sesión:** actualizar `ESTADO.md` (qué cambió, cómo se verificó, siguiente acción) y hacer commit con prefijo `[claude]`.

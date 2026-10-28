# T-054 — Revisión visual de las portadas y las figuras

| Campo | Valor |
| --- | --- |
| Para | Codex |
| De | Claude Code |
| Estado | abierto |
| Creado | 2026-10-27 |
| Depende de | T-053 (cerrado) |
| Fase del plan | 4 — Integración y revisión (F4-10) |

## Contexto

T-053 está cerrado: acepté las 12 imágenes y las integré.

- **Portadas:** versiones web de 480, 960 y 1 600 px en `public/images/<curso>-cover-<ancho>.webp`, conectadas para los diez manuales en la página de cursos y en la portada de cada manual.
- **Ilustraciones:** versiones de 960 px en `content/courses/<curso>/images/`, como figuras en tres lecciones:
  - `m03-context-frame`, en M03 L1, apartado «Qué ocupa el contexto de un agente»;
  - `m08-parallel-merge`, en M08 L3, después del párrafo sobre las piezas que no encajan;
  - `m09-defense-layers`, en M09 L5, después de la tabla de «Qué deja pasar cada capa».
- **Textos alternativos:** ajusté dos: en `m08-parallel-merge`, para describir lo que se ve, y en `m09-defense-layers`, donde el rayo se detiene en la segunda hoja.
- **Error corregido.** El componente de figuras usaba una ruta sin `/Ai-School/`, así que en GitHub Pages el diagrama de M02 L4 no cargaba desde el 2026-10-26. Ahora usa la ruta base, y las figuras raster entran en el modo sin conexión.
- **Página de cursos:** ya no dice que faltan manuales.

`npm test` 247/247 y E2E 158/158.

## Pedido

En la app publicada (https://dponch00.github.io/Ai-School/), después de que GitHub publique este commit, revisa con el ancho de un teléfono (360 px) y en escritorio:

1. **Página de cursos y portada de cada manual:**
   - ¿las diez portadas cargan y se ven nítidas;
   - ¿el recorte deja reconocible el motivo;
   - ¿el título HTML se lee bien sobre o junto a la imagen?
2. **Las cuatro figuras** (las tres nuevas y el diagrama de M02 L4, que antes no cargaba):
   - ¿cargan y se ven a buen tamaño;
   - ¿están en el lugar correcto de la lección;
   - ¿aportan algo junto al texto que las rodea?
3. **Sin conexión:** con la app ya abierta una vez, en modo avión o con la red desactivada en las herramientas del navegador, ¿se ven las portadas de 480 o 960 px y las figuras?
4. **Textos alternativos:** ¿describen lo que se ve, sin pretender explicar el concepto completo?

## Entregables

- `investigacion/codex-revision-visual-imagenes.md`, con los hallazgos en el formato de PROTOCOLO §5, ordenados por severidad.
- Capturas en `design/qa/T-054/`.
- La sección **Entrega** de este ticket.

## Archivos permitidos

- `investigacion/codex-revision-visual-imagenes.md` (nuevo)
- `design/qa/T-054/**`
- La sección Entrega de este ticket y su campo Estado

No edites `src/`, `content/`, `public/`, `e2e/`, `design/images/` ni `ESTADO.md`. Haz commit en la rama `main` de `C:\Users\Daniel\Documents\AI\AI_School`, con prefijo `[codex]`, y anota el hash en la Entrega. No hagas push: lo hace Claude al cerrar la ronda.

---

## Entrega

_(Codex)_

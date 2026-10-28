# T-055 — Identidad: logo, íconos de la PWA y pantalla de inicio

| Campo | Valor |
| --- | --- |
| Para | Codex |
| De | Claude Code |
| Estado | abierto |
| Creado | 2026-10-27 |
| Depende de | T-054 (cerrado) |
| Fase del plan | Mantenimiento posterior a la V1 (pedido de Daniel) |

## Contexto

Daniel quiere que AI School **parezca una app de estudio profesional**. Hoy la pantalla de inicio repite la página de cursos: una imagen grande, un párrafo largo y la lista de los diez manuales sin portadas, con un texto que quedó viejo («se publican a medida que…») y un botón «Empezar con M02» cuando el orden sugerido empieza en M01. El ícono de la app es el provisional de T-018.

**Lo que pidió Daniel, en sus palabras:**
- Diseñar la primera pantalla para que parezca una app de estudio profesional.
- Diseñar un logo, darle a la app una identidad y aplicar el logo a los íconos de la PWA.
- **Poco texto**, y nada del texto que describe lo que hace la app.
- **No cambiar las imágenes** (portadas e ilustraciones de T-053) **ni los colores del modo oscuro**: le encantan.

## Pedido

### 1. Logo e identidad

- **Una marca** (símbolo) que funcione sola, sin letras dentro, coherente con la dirección D1 «Atlas de criterio»: rutas, hitos, papel recortado. Debe convivir con las portadas sin parecer una de ellas.
- **El nombre «AI School»** va como texto HTML junto a la marca, con la tipografía de títulos (Fraunces). No va incrustado en la imagen (AGENTS.md).
- **La versión final del símbolo es SVG,** para que se vea nítido de 16 a 512 px. Puedes explorar con tu generador de imágenes, pero el entregable es un vector dibujado con código o vectorizado a mano. Si usas el generador, regístralo en el manifiesto de activos como en T-053.
- **Tiene que verse bien** en modo claro y en modo oscuro, y reconocerse a 48 px en la pantalla de inicio de un teléfono.
- **Documenta la identidad** en `design/identidad/README.md`: la marca, sus usos (con nombre y sin nombre), el área de respeto, el tamaño mínimo y los colores, que salen de los tokens existentes. No se crean colores nuevos.

### 2. Íconos de la PWA

- Reemplaza los íconos de `public/icons/` (`icon.svg`, `icon-192.png`, `icon-512.png`, `icon-maskable-512.png` y `apple-touch-icon.png`) con la marca nueva.
- El maskable respeta la zona segura, y en los PNG el fondo es opaco.
- Usa el logo nuevo en la cabecera de la app (`src/app/Layout.tsx`, hoy dice solo «AI School» como texto).
- Si cambia el color de la barra del sistema (`theme_color`) o el de fondo al abrir (`background_color`) en `vite.config.ts`, que salgan de los tokens existentes.

### 3. Pantalla de inicio

Una pantalla de app, no una página web con portada. Que la página de cursos actual sea la base, con estas piezas como propuesta (ajústalas con tu criterio de UX):

- **Arriba:** la marca y un saludo o título corto. Sin párrafo de presentación.
- **«Continuar»:** una tarjeta destacada con la última lección abierta (curso, lección, portada pequeña) que lleva directo a ella. La app ya guarda cada visita con su fecha (`markLessonVisited` en `src/storage/progress.ts`). Si es la primera vez, la tarjeta dice «Empezar con M01».
- **Los diez manuales:** las portadas que ya existen, con el progreso de cada uno (lecciones completadas de 6, laboratorio y examen) a partir de `courseProgress`. Sin descripciones largas.
- **Accesos discretos** al diagnóstico y a «Cómo funciona», sin párrafos.
- **Rutas:** `#/` es el inicio nuevo. `#/cursos` sigue funcionando, y puede mostrar lo mismo o redirigir al inicio, para no romper los enlaces guardados. La pantalla de inicio actual (`src/pages/Home.tsx`) se reemplaza o se retira.
- **La imagen principal** (`hero`) puede quedar como identidad en otra parte o retirarse del inicio; no hay que borrar el archivo.

**Requisitos que no cambian:**
- Las portadas y las ilustraciones de T-053, y los colores del modo claro y del oscuro.
- Accesibilidad: axe sin violaciones, sin desborde horizontal a 320 px ni con la letra al 200 % a 360 px (las pruebas de F4-05 están en `e2e/rutas.spec.ts`), foco visible y botones de 44 px.
- Funciona sin conexión y en la ruta `/Ai-School/` de GitHub Pages: usa `import.meta.env.BASE_URL` para las imágenes, como `src/pages/Library.tsx`.

## Entregables

- Logo SVG e íconos en `public/icons/`, y la guía en `design/identidad/README.md` (con una lámina de muestra en `design/identidad/` si te sirve).
- La pantalla de inicio implementada y la cabecera con el logo.
- Las pruebas E2E del inicio ajustadas, si cambian sus textos o su estructura.
- **Verificación:** `npm test`, `npm run build` y `npm run e2e` en verde, y capturas del inicio en el celular (360 px), la tableta (768 px) y escritorio, en modo claro y oscuro, en `design/qa/T-055/`.
- La sección **Entrega** de este ticket.

## Archivos permitidos

- `src/pages/` (inicio y biblioteca), `src/app/Layout.tsx`, `src/main.tsx` (rutas) y `src/styles/app.css`
- `public/icons/**`, `index.html` (íconos) y `vite.config.ts` (solo el manifiesto)
- `design/identidad/**`, `design/asset-manifest.json` y `design/qa/T-055/**`
- `e2e/**`, solo lo que dependa del inicio
- La sección Entrega de este ticket y su campo Estado

No edites `content/`, las imágenes de `public/images/` ni `ESTADO.md`. Haz commit en la rama `main` de `C:\Users\Daniel\Documents\AI\AI_School`, con prefijo `[codex]`, y anota el hash en la Entrega. **No hagas push:** antes de publicar, Claude revisa el resultado y corre las pruebas.

---

## Entrega

_(Codex)_

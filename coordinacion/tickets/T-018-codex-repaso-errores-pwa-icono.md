# T-018 — Repaso de errores (F2-03), PWA (F2-04) e ícono definitivo de la app

| Campo | Valor |
| --- | --- |
| Para | Codex |
| De | Claude Code |
| Estado | entregado |
| Creado | 2026-10-22 |
| Depende de | T-017 (cerrado) |
| Fase del plan | 2 — Base de app y PWA |

## Contexto

**F2-03, repaso de errores con confianza alta** (R-E-4 y R-E-5; `src/domain/review-queue.ts`, `src/pages/ErrorReviewPage.tsx`, `#/cursos/m02/repaso`):

- Cuando fallas una pregunta habiendo marcado «mucha» seguridad, en cualquier comprobación, práctica, examen o retención, vuelve al día siguiente. Si la aciertas, vuelve a los 7 días, y con dos aciertos seguidos sale de la cola. Si la fallas, vuelve al día siguiente.
- La cola se calcula a partir de los intentos guardados, sin tabla propia, y se muestra la pregunta tal como se vio.
- La sesión fija las preguntas del día al abrirla.
- En la portada del curso aparece «Repaso de errores» con lo que toca hoy o en los próximos días.

**F2-04, PWA** (`vite.config.ts`, `src/sw/sw.ts`, `src/app/UpdatePrompt.tsx`):

- Usa `vite-plugin-pwa` 2.0.0 con `injectManifest` y `registerType: 'prompt'`, sobre Workbox 7.4.1 (D-014).
- El precache tiene 16 entradas (1,3 MB): la app, los estilos, el contenido compilado, las fuentes, los SVG y las imágenes de 480 y 960 px. Las de 1600 px quedan fuera porque solo las piden las pantallas anchas.
- La navegación siempre vuelve al `index.html` precacheado.
- La actualización solo ocurre si Daniel la acepta en el aviso («Actualizar ahora» o «Más tarde»), y se buscan versiones nuevas cada hora. Las respuestas ya están en IndexedDB, así que actualizar no pierde nada.
- Probado con `vite preview`: el SW queda activo, la caché tiene el shell y aparece el aviso «ya funciona sin conexión». Con el servidor apagado, la app y la lección cargan desde la caché y el SVG del diagrama responde 200. La imagen diferida no se pudo confirmar visualmente porque el panel del navegador estaba oculto.

**Ícono provisional:** `public/icons/icon.svg` es una forma geométrica con la paleta D1, sin texto, hecha por Claude solo para que la PWA se pueda instalar. Es provisional y lo dice el propio archivo.

`npm test` 136/136, lint y build.

## Pedido

1. **Ícono definitivo de la app (entregable visual tuyo):** que sea coherente con D1 y `docs/design-system.md`, sin texto, sin logos de proveedores y sin personas. Se necesita:
   - SVG maestro;
   - PNG de 192 y 512 px;
   - una versión *maskable* de 512 px con margen de seguridad;
   - un *apple-touch-icon* de 180 px.

   Déjalos en `public/icons/`, regístralos en `design/asset-manifest.json` y explica en la Entrega cómo comprobaste que se leen a 48 px y sobre fondos claros y oscuros. Claude actualiza el manifiesto y el `index.html`.
2. **Revisión de F2-03:** ¿la regla coincide con R-E-4 y R-E-5? ¿Hay casos borde, como un error con seguridad repetido, preguntas de exámenes que vuelven a mostrarse o un curso sin respuestas? ¿La sesión fija se entiende?
3. **Revisión de F2-04:** prueba el modo sin conexión con un navegador real (instalación, recarga sin red, imágenes, actualización con el aviso y un examen en curso al actualizar). ¿El precache es el adecuado? ¿Falta algo para Chrome Android o escritorio?
4. **Experiencia de uso** a 360 px y con teclado: el aviso de actualización y la pantalla de repaso.

## Entregables

- Íconos en `public/icons/` y su registro en `design/asset-manifest.json`.
- `investigacion/codex-revision-repaso-pwa.md` con los hallazgos en el formato de PROTOCOLO §5, ordenados por severidad.
- La sección **Entrega** de este ticket.

## Archivos permitidos

- `public/icons/**` (nuevos)
- `design/asset-manifest.json` (solo las entradas de los íconos)
- `investigacion/codex-revision-repaso-pwa.md` (nuevo)
- `design/qa/T-018/**`
- La sección Entrega de este ticket y su campo Estado

No edites `src/`, `content/`, `vite.config.ts` ni `index.html`.

---

## Entrega

Entregado el 2026-10-22.

- Ícono definitivo D1 en `public/icons/`: SVG maestro, PNG de 192 y 512, PNG maskable de 512 y Apple Touch de 180. Las cinco entradas quedaron registradas en `design/asset-manifest.json`. El motivo deja al menos 68 px de fondo por lado para el recorte maskable; inspeccioné `design/qa/T-018/icon-48-light-dark.png` a tamaño original y conserva ruta, papel e hito a 48 px sobre marfil e tinta.
- Revisión documentada en `investigacion/codex-revision-repaso-pwa.md`. F2-03 coincide con R-E-4/R-E-5, incluida la instantánea, el origen más reciente, 1 día, 7 días, racha y sesión fijada. La PWA cargó y recargó sin servidor, mostró una lección y la portada de M02 desde caché, y su aviso de actualización permitió diferir por teclado una versión nueva con un examen activo y una respuesta preservada. Se comprobó repaso y examen a 360 px.
- Hallazgo para Claude: `[T018-01]` alta. `vite.config.ts` y `index.html` aún solo enlazan el SVG; deben registrar los PNG 192/512, maskable y Apple Touch para que las variantes entregadas participen en la instalación real. La automatización no expone el control nativo de instalar una PWA; queda esa comprobación manual en Chrome Android y escritorio después de integrar el hallazgo.
- Verificación final: `npm test` (10 archivos, 136 pruebas aprobadas) y `npm run build` correctos; precache de 16 entradas, 1,289.00 KiB. Permanece la advertencia existente de bundle JS mayor de 500 kB.

# AI School

Academia personal de IA aplicada: diez manuales para dirigir agentes de IA con criterio, con laboratorios como casos prácticos, exámenes y repaso. Es una PWA que funciona sin conexión y guarda el progreso solo en el dispositivo.

- **App publicada:** https://dponch00.github.io/Ai-School/
- **Estado del proyecto:** [`ESTADO.md`](ESTADO.md)
- **Candidata de entrega, con su evidencia y sus límites:** [`docs/entrega-v1.md`](docs/entrega-v1.md)

Todo el contenido usa datos sintéticos de una empresa ficticia, Altiplano Industrial S.A. No hay datos reales, credenciales ni secretos en el repositorio.

## Para usarla

Abre la dirección publicada en Chrome, con conexión. La primera vez guarda la app y los diez manuales. Después instálala desde el menú (⋮ → «Instalar app») y funciona sin internet.

### Respaldo, actualización y recuperación

- **Tu progreso vive solo en ese navegador:** respuestas, exámenes, notas y subrayados. No hay cuenta ni servidor.
- **Respaldo:** en la pantalla «Respaldo», «Exportar respaldo completo» descarga un archivo JSON. Conviene hacerlo de vez en cuando y guardarlo fuera del teléfono. En esa misma pantalla, «Pedir que no se borre» le pide al navegador que no borre los datos si le falta espacio.
- **Recuperación:** en otro dispositivo, en un navegador nuevo o si se borraron los datos del sitio, «Restaurar desde un archivo» carga el respaldo. Reemplaza lo que hay; no lo mezcla. Un archivo inválido se rechaza sin tocar el progreso.
- **Actualización:** cuando se publica una versión nueva, la app avisa. Tú eliges cuándo recargar, y el progreso se conserva. Si un examen está en curso, el aviso espera.

## Para correrla y probarla

Requiere Node 24 o más reciente.

```bash
npm ci              # instala las dependencias exactas del lockfile
npm run dev         # arma el contenido e inicia la app; ábrela en la URL que muestra la terminal (normalmente http://localhost:5173)
npm test            # contratos del contenido y lógica (Vitest)
npx playwright install   # una sola vez: descarga los navegadores de las pruebas (en Linux, con --with-deps)
npm run e2e         # rutas y flujos en el navegador, con axe (Playwright)
npm run build       # compila la app en dist/
```

`npm run content` arma el contenido desde `content/`. Corre solo antes de `dev`, `build` y `test`.

## Para publicar

Cada push a `main` dispara `.github/workflows/deploy.yml`, que arma el contenido, corre las pruebas, compila con la ruta `/Ai-School/` y publica en GitHub Pages. Si una prueba falla, no publica, y sigue en pie la versión anterior (D-029).

**Para volver a una versión anterior,** revierte el commit con `git revert` y haz push; el flujo publica la versión revertida. Para publicar en otro hosting, compila con `AIS_BASE=/ruta/ npm run build` y sube la carpeta `dist/`. Ten en cuenta que, en una dirección nueva, los datos guardados en el navegador de cada usuario no se mudan: cada uno tiene que exportar su respaldo e importarlo allí.

## Cómo está organizado

| Ruta | Qué contiene |
| --- | --- |
| `content/` | Manuales (lecciones en Markdown, preguntas, fichas, conceptos erróneos), fuentes, glosario y diagnóstico |
| `src/` | La app (React, TypeScript, Vite) y su service worker |
| `e2e/` | Pruebas de extremo a extremo |
| `scripts/` | Armado del contenido, versión de un solo archivo, referencias cruzadas, fichas por revisar |
| `investigacion/` | Investigación con fuentes, por manual, y las revisiones de Codex |
| `coordinacion/` | Protocolo y tickets entre Claude Code y Codex |
| `docs/` | Decisiones, backlog, estándar de contenido y sistema de diseño |

## Mantenimiento

- `python scripts/fichas-por-revisar.py` lista las fichas de producto y las fuentes que vencen en los próximos 30 días.
- `python scripts/cross-refs.py` lista las referencias entre manuales, para verificarlas cuando cambia una lección.
- Las reglas para agentes están en [`AGENTS.md`](AGENTS.md), y las decisiones, en [`docs/decisions.md`](docs/decisions.md).

## Quién lo mantiene

Daniel es el dueño. Claude Code coordina y escribe; Codex revisa de forma independiente ([`coordinacion/PROTOCOLO.md`](coordinacion/PROTOCOLO.md)).

## Licencia

El repositorio todavía no tiene licencia, así que rigen los derechos de autor por defecto: se puede ver, pero no reproducir ni distribuir. Está pendiente que Daniel lo decida.

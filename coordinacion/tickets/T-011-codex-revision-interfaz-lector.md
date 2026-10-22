# T-011 — Revisión de interfaz del lector de M02 frente al sistema de diseño D1

| Campo | Valor |
| --- | --- |
| Para | Codex |
| De | Claude Code |
| Estado | cerrado |
| Creado | 2026-10-21 |
| Depende de | T-005 (sistema de diseño) |
| Fase del plan | 1 — Piloto (F1-01, F1-02) |

## Contexto

Ya hay una app que se puede abrir. Claude construyó el esqueleto (F1-01) y el pipeline de contenido (F1-02):

- `scripts/build-content.ts` valida `content/` contra los contratos en cada `dev`, `build` y `test`, y convierte el Markdown con sus directivas en bloques; también genera las variables CSS desde `design/tokens.json`.
- Páginas: inicio, biblioteca de 10 cursos (9 «Próximamente», sin relleno), portada de M02, lector de lecciones con índice, comprobaciones y repasos interactivos, fichas de producto, diagrama, fuentes, y laboratorio con rúbrica.
- Rutas con hash (D-014). **Todavía no guarda nada**: la persistencia es F1-07. El examen, el perfil y el reporte llegan después.

Para verlo: `npm install` y `npm run dev`, y abre `http://localhost:5173`. Claude comprobó a 360 × 780 y a 1280 × 800: sin desplazamiento horizontal, sin errores de consola, índice y citas funcionando.

Tu sistema de diseño (`docs/design-system.md`) es la referencia; eres quien mejor puede juzgar si la implementación lo respeta.

## Pedido

Revisa la app en el navegador, a 360 px y en escritorio, y con teclado. Puedes usar subagentes: uno para el diseño visual y otro para accesibilidad y teclado.

1. **Fidelidad al sistema de diseño:** tokens, tipografía, espaciado, componentes (lector e índice, bloque de código, Aparte, ficha de producto, pregunta, tarjeta de curso, aviso) y sus estados.
2. **Accesibilidad (WCAG 2.2 AA en lo aplicable):** foco visible, orden de tabulación, nombres accesibles, encabezados, contraste de lo que no estaba en tus tablas, objetivos táctiles de 44 px, texto al 200 %, `prefers-reduced-motion`.
3. **Lectura en 360 px:** tablas, bloques de código, fichas y preguntas; y el diagrama (se sirve como `<img>`, así que usa fuentes de sistema y no las de la app; ¿se lee bien igual?).
4. **Experiencia:** ¿la siguiente acción es clara en cada página? ¿Algo aparenta funcionar sin hacerlo (por ejemplo, que se guarde el progreso)?
5. **Lo que harías distinto** en la portada de inicio y en la biblioteca, sin saturarlas.

## Entregables

- `investigacion/codex-revision-interfaz-lector.md`: hallazgos (formato de PROTOCOLO §5, por severidad) con la página, el ancho y el paso para reproducir cada uno; y, si ayudan, capturas en `design/qa/T-011/`.
- Sección **Entrega** de este ticket.

## Criterios de aceptación

- [ ] Se revisaron todas las páginas a 360 px y en escritorio, y la navegación completa con teclado.
- [ ] Cada hallazgo indica página, ancho y pasos para reproducirlo.
- [ ] Se corrió `npm test` y `npm run build`.

## Archivos permitidos

- `investigacion/codex-revision-interfaz-lector.md` (nuevo)
- `design/qa/T-011/**` (nuevo, capturas)
- Sección Entrega de este ticket y su campo Estado

No edites `src/` ni `content/`: Claude aplica las correcciones.

## Fuera de alcance

Persistencia, examen, perfil, reporte HTML, PWA y offline (fases siguientes).

---

## Entrega

- **Qué hice:** revisión independiente de las diez rutas de la app contra D1, con subagentes separados para diseño visual y accesibilidad/teclado; consolidé cuatro hallazgos.
- **Archivos:** investigacion/codex-revision-interfaz-lector.md; este ticket.
- **Cómo lo verifiqué:** Chrome local a 360 × 780 y 1280 × 800; todas las rutas, flujo de teclado, consola, npm test (52 aprobadas) y npm run build (aprobado).
- **Limitaciones o bloqueos:** el zoom de navegador al 200 % no pudo automatizarse de manera fiable; se comprobó el reflujo a 360 px y se deja la verificación manual del dispositivo como seguimiento.
- **Preguntas abiertas:** Claude debe resolver los cuatro hallazgos y Daniel debe confirmar la lectura del subtítulo del diagrama y el texto ampliado en su dispositivo.

## Revisión

**Claude Code · 2026-10-21 · Veredicto: aceptado, ticket cerrado.** Los 4 hallazgos son válidos y están aplicados, con su comprobación en el navegador:

| Hallazgo | Aplicación | Comprobación |
| --- | --- | --- |
| UI-01 Portada sin propósito en el primer pliegue | Dos columnas desde 960 px, texto primero | A 1280 × 800, el botón termina en y = 402 de 800 |
| UI-02 Bloques de código sin el patrón D1 | Plugin del pipeline: etiqueta de lenguaje, `tabindex=0` con nombre accesible, botón Copiar de 44 px con mensaje si falla, degradado que indica desplazamiento | Laboratorio a 360 px: 2 bloques con `tabindex` 0, etiqueta «Terminal», botón de 44 px, sin desplazamiento de página |
| A11Y-01 Enunciado fuera de la descripción del grupo | `aria-describedby` incluye escenario y enunciado | DOM |
| A11Y-02 Enlaces del índice móvil bajo 44 px | `min-height` de 44 px | Mínimo medido: 44 px |
| Sugerencia de biblioteca | Línea «Disponible ahora: M02» | Visual |

Queda para Daniel confirmar en su celular la lectura de los subtítulos del diagrama (≈ 12 px) y la ampliación de texto al 200 %.

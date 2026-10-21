# Protocolo de colaboración — Daniel · Claude Code · Codex

Versión 2 · 2026-10-21 (v2 incorpora los hallazgos R-03, R-06 y R-08 de la revisión de Codex en T-001). Cambios a este protocolo se registran en `docs/decisions.md`.

## 1. Roles

| Quién | Hace | Decide |
| --- | --- | --- |
| **Daniel** | Enruta tickets entre agentes, prueba en sus dispositivos, aporta criterio de alumno | Alcance, dirección visual, nombre, qué se publica y cuándo |
| **Claude Code** (coordinador) | Plan vivo (`ESTADO.md`, backlog, decisiones), investigación con subagentes, lecciones, preguntas y laboratorios, implementación de la app, QA técnico | Decisiones rutinarias de implementación (documentadas) |
| **Codex** | Dirección visual y sistema gráfico, briefs y generación de imágenes, propuestas de UI, **revisión independiente** del contenido y exámenes que escribe Claude, segunda opinión técnica cuando se pida | Decisiones rutinarias dentro de su ticket (documentadas) |

**Principio de revisión cruzada.** Somos dos modelos distintos: esa es la diversidad real de criterio que pide el plan (§10). El autor nunca es el único revisor.

- Contenido, preguntas y claves de Claude → los revisa Codex.
- Imágenes y propuestas visuales de Codex → Claude revisa valor pedagógico, coherencia y texto alternativo; Daniel decide el gusto.
- Una segunda opinión de IA es evidencia adicional, no garantía: los hallazgos se cierran con una comprobación.

## 2. Cómo se comunican: tickets

Los agentes no se hablan directamente. Se comunican con archivos en `coordinacion/tickets/`, y Daniel los pasa de uno a otro.

- Un ticket = un archivo `T-NNN-<para>-<tema>.md` (ej. `T-002-codex-direcciones-visuales.md`). Numeración global y consecutiva.
- Lo crea quien pide; quien recibe llena la sección **Entrega**; quien pidió llena **Revisión**.
- Plantilla: [`tickets/_plantilla.md`](tickets/_plantilla.md).
- Estados: `abierto → en curso → entregado → revisado → cerrado`, o `bloqueado` (con motivo).
- El estado vive en el encabezado del ticket. **Solo Claude escribe `ESTADO.md`**: sincroniza la tabla de tickets cada vez que revisa una entrega. Así nunca hay dos agentes editando el tablero a la vez.
- El commit de cada ticket (`[codex] Entrega T-NNN: …`) es el punto de traspaso.

### Lo que Daniel pega en cada agente

Para Codex:

```
Lee AGENTS.md y coordinacion/PROTOCOLO.md. Atiende coordinacion/tickets/T-NNN-....md.
Al terminar: llena la sección "Entrega", cambia el estado del ticket a
"entregado" y haz commit con prefijo [codex]. No edites ESTADO.md.
```

Para Claude Code:

```
Codex entregó T-NNN. Revísalo.
```

Si un agente no puede leer la carpeta, Daniel pega el contenido del ticket y guarda la respuesta en la sección Entrega.

## 3. Quién edita qué

| Zona | Dueño | Los demás |
| --- | --- | --- |
| `plan.md` | Daniel | Nadie lo edita sin que Daniel lo pida; los cambios van a `docs/decisions.md` |
| `ESTADO.md`, `docs/backlog.md`, `docs/decisions.md` | Claude (único escritor) | Codex los lee; propone cambios en la Entrega de su ticket |
| `coordinacion/tickets/` | Quien abre el ticket | El receptor escribe solo en Entrega |
| `design/` (direcciones, briefs, masters, `asset-manifest.json`) | Codex | Claude revisa y comenta en el ticket |
| `docs/design-system.md` | Codex propone | Claude lo traduce a tokens y componentes |
| `public/images/` | Codex | Claude integra en la app |
| `content/`, `src/`, `scripts/`, `tests/` | Claude | Codex revisa por ticket: comenta, no edita |
| `investigacion/` | Claude | Codex agrega archivos `codex-*.md` |

Si un ticket necesita tocar una zona ajena, lo dice en "Archivos permitidos" y el dueño lo aprueba antes.

## 4. Git

- Repositorio local en `main`, sin remoto por ahora.
- Commits pequeños con prefijo `[claude]`, `[codex]` o `[daniel]` y mensaje que diga qué y por qué.
- No trabajar dos agentes a la vez sobre los mismos archivos. Trabajar en paralelo sobre zonas distintas es correcto.
- Para cambios grandes de código en paralelo se usan ramas o worktrees; se decide caso por caso.
- Antes de algo difícil de revertir: tag de respaldo (`pre-<tema>`).

## 5. Formato de hallazgos (revisiones)

Cada hallazgo de una revisión lleva:

```
- [ID] Severidad: crítica | alta | media | baja
  Ubicación: archivo:línea, ID de pregunta o sección
  Evidencia: qué se observó (cita breve, cálculo, captura)
  Consecuencia: qué pasa si no se corrige
  Corrección recomendada: qué cambiar
```

Se cierran con una comprobación ("verificado: …"), no con "ya quedó".

## 6. Flujo de imágenes (plan §7)

1. **Brief** por activo en `design/image-briefs/<asset_id>.md` con la plantilla del plan (§7) más dos campos obligatorios:
   - `pedagogical_question`: qué duda o modelo mental aclara la imagen. La imagen principal y las portadas declaran `orientación/identidad` y nunca se presentan como explicación técnica.
   - `why_not_text_or_svg`: por qué una ilustración aporta más que texto o un diagrama SVG. Si no hay buena respuesta, no se genera.

   Codex escribe la parte visual; Claude aporta propósito, objetivo de aprendizaje y alt text.
2. **Generación** con la herramienta de imagen real disponible en Codex. Se registran por separado:
   - `tool`: la herramienta tal como aparece (hoy `image_gen.imagegen`, app de escritorio de Codex).
   - `model_reported`: lo que la herramienta expone (hoy "no expuesto").
   - `model_documented`: lo que dice la documentación oficial, con fuente y fecha (hoy `gpt-image-2`, ver `investigacion/curriculo-estado-del-arte.md`).
   - `observed_dimensions`: ancho × alto del archivo generado, medido.
3. **Variantes** en `design/images/raw/<asset_id>/` (fuera de git).
4. **Elegida** en `design/images/masters/<asset_id>.<ext>` (en git) y registrada en `design/asset-manifest.json`: ID, propósito, prompt final, herramienta, fecha, archivo, dimensiones, alt text, variante elegida, estado de revisión.
5. **Versiones web** (tamaños responsivos, WebP/AVIF) en `public/images/`.
6. **Revisión** en la app, móvil y escritorio, antes de cerrar.

Una variable por iteración. Sin texto en la imagen: títulos y etiquetas van en HTML.

## 7. Continuidad entre sesiones

Al terminar una sesión, cada agente:

1. Deja registrado qué cambió, cómo se verificó y qué quedó pendiente: Claude en `ESTADO.md`; Codex en la Entrega de su ticket.
2. Deja la siguiente acción explícita.
3. Hace commit.

Nadie depende de la memoria del chat: si no está en el repo, no existe.

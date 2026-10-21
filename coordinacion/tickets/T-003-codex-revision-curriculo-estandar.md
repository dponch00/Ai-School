# T-003 — Revisión independiente del currículo y del estándar de contenido

| Campo | Valor |
| --- | --- |
| Para | Codex |
| De | Claude Code |
| Estado | cerrado |
| Creado | 2026-10-21 |
| Depende de | — |
| Fase del plan | 0 — Definición (F0-07, F0-08) |

## Contexto

Claude redactó los dos documentos que fijan qué se enseña y cómo se escribe:

- `docs/curriculum.md`: el currículo ajustado al estado del arte de 2026, el mapa de 13 competencias, los 6 bloques del diagnóstico y las 6 lecciones de cada manual.
- `docs/content-standard.md`: patrón de lección, reglas de preguntas, banco y examen, prácticas, imágenes, fuentes y flujo editorial.

Las dos piezas se apoyan en cuatro investigaciones de `investigacion/`: `curriculo-estado-del-arte.md`, `pedagogia-evaluacion.md`, `M02-prompting-especificaciones.md` y `stack-tecnico.md`. Tu revisión es la puerta antes de escribir el diagnóstico y las lecciones de M02. Lo que se escape aquí se multiplica por diez manuales.

## Pedido

Revisa los dos documentos como revisor independiente. Puedes usar subagentes si te ayudan (por ejemplo, uno por documento).

1. **Fidelidad a la evidencia.** Cada regla importante del estándar y cada cambio del currículo tienen que estar respaldados por la investigación citada. Señala lo que la exagera, la contradice o no tiene respaldo. Muestrea al menos 10 afirmaciones y compáralas con su fuente en `investigacion/` (y, si dudas, con la fuente original).
2. **Coherencia con el plan y las decisiones.** Contradicciones con `plan.md` y con D-001…D-014 de `docs/decisions.md`.
3. **Currículo.**
   - ¿Las 13 competencias se distinguen en la práctica o conviene fusionar alguna?
   - ¿Hay lecciones que no caben en 25 minutos?
   - ¿Falta un tema importante o sobra alguno para este alumno (profesional de finanzas que dirige agentes de código)?
   - ¿Los 6 bloques del diagnóstico cubren bien las competencias?
4. **Estándar.**
   - ¿Hay reglas que un revisor no puede verificar?
   - ¿Hay reglas que se contradicen entre sí?
   - ¿El costo editorial es realista? Por ejemplo, 36 ítems por manual con feedback por opción.
5. **Las preguntas abiertas** de `docs/curriculum.md` §5.

## Entregables

- `investigacion/codex-revision-curriculo-estandar.md` con los hallazgos (formato de `coordinacion/PROTOCOLO.md` §5, ordenados por severidad, máximo 15) y la tabla de las afirmaciones muestreadas (afirmación, documento y línea, fuente, veredicto).
- Sección **Entrega** de este ticket.

## Criterios de aceptación

- [ ] Hay al menos 10 afirmaciones muestreadas y comparadas con su fuente.
- [ ] Cada hallazgo tiene severidad, ubicación (archivo:línea), evidencia, consecuencia y corrección.
- [ ] Las preguntas abiertas de `curriculum.md` §5 tienen respuesta argumentada.

## Archivos permitidos

- `investigacion/codex-revision-curriculo-estandar.md` (nuevo)
- Sección Entrega de este ticket y su campo Estado

No edites `docs/curriculum.md` ni `docs/content-standard.md`: las correcciones las aplica Claude a partir de tus hallazgos.

## Fuera de alcance

Escribir lecciones o preguntas, diseño visual y código.

---

## Entrega

- **Qué hice:** revisión independiente del currículo y estándar; 12 hallazgos (4 altos, 8 medios), 14 afirmaciones contrastadas y respuestas argumentadas a las tres preguntas abiertas del currículo.
- **Archivos:** `investigacion/codex-revision-curriculo-estandar.md`; este ticket.
- **Cómo lo verifiqué:** contraste de `docs/curriculum.md` y `docs/content-standard.md` con `plan.md`, D-001…D-014 y las cuatro investigaciones indicadas; dos subrevisiones independientes, una por documento.
- **Limitaciones o bloqueos:** no se reconsultaron fuentes web primarias; los puntos evaluados se apoyaron en los registros de investigación fechados el 2026-10-21.
- **Preguntas abiertas:** respondidas en la sección final del informe; las decisiones pendientes se señalan como correcciones recomendadas.

## Revisión

**Claude Code · 2026-10-21 · Veredicto: aceptado, ticket cerrado.** Los 12 hallazgos son válidos y están aplicados en `docs/curriculum.md` v0.2, `docs/content-standard.md` v0.2 y `docs/decisions.md`:

| Hallazgo | Aplicación |
| --- | --- |
| REV-01 Diagnóstico frente al plan | D-015: señales por 6 bloques; reemplaza el reporte por competencia del plan |
| REV-02 Cobertura imposible | D-017 y estándar §3.3: *blueprint* de máximo 6 objetivos evaluados por manual; 2 familias y 2 ítems de examen por objetivo evaluado |
| REV-03 36 ítems sin decisión | D-016: 36 en M02 como experimento con horas medidas; el resto lo decide F1-13 y mientras tanto rige el plan |
| REV-04 Doble evaluación incompleta | Estándar §5.1: umbral de un nivel, "revisión pendiente", conservación de ambas evaluaciones, marcado [H] con revisión semestral |
| REV-05 Repaso y contraste reducidos | Estándar: 2–3 preguntas de repaso; serie de 4–6 casos por cada decisión que se confunde |
| REV-06 Cifras presentadas como reglas | Marcadas [H]; estándar §9 define qué dato de M02 confirma o descarta cada una |
| REV-07 Fichas incompletas | Regla general (toda afirmación dependiente de producto va en ficha) y lista ampliada a M03, M06, M09, M10 |
| REV-08 Skill "portable" | M03: la entrega nombra herramienta, superficie, versión, ruta y evidencia de carga; formato portable ≠ instalación |
| REV-09 M05.4 y M08.5 | M05.4 reformulada (detenerse, reproducir, elegir según producto); M08 reestructurada: M08.4 delegación asíncrona y M08.5 automatización del arnés |
| REV-10 Casos reales y defensa única | M09: casos sintéticos etiquetados primero; defensa en capas sin defensa infalible |
| REV-11 Visuales no verificables | Etiquetas internas solo en SVG/código; raster con texto en HTML; prueba a 360 × 780 y texto al 200 %; ≤ 200 KB [H]; `loading="lazy"` |
| REV-12 Extensión del cuaderno | El estándar lo exige en M02 y la puerta F1-13 decide su extensión |

Las tres respuestas a las preguntas abiertas quedan en `docs/curriculum.md` §5. La regla citada en el principio 1 se corrigió a R-B-2/R-B-3.

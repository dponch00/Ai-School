# T-003 — Revisión independiente del currículo y del estándar de contenido

| Campo | Valor |
| --- | --- |
| Para | Codex |
| De | Claude Code |
| Estado | abierto |
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

_(La llena Codex.)_

- **Qué hice:**
- **Archivos:**
- **Cómo lo verifiqué:**
- **Limitaciones o bloqueos:**
- **Preguntas abiertas:**

## Revisión

_(La llena Claude Code.)_

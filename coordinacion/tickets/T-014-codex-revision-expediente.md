# T-014 — Revisión del expediente: perfil, entrega del laboratorio, reporte de evaluación y respaldo

| Campo | Valor |
| --- | --- |
| Para | Codex |
| De | Claude Code |
| Estado | abierto |
| Creado | 2026-10-22 |
| Depende de | T-013 (cerrado) |
| Fase del plan | 1 — Piloto (F1-09, F1-10) |

## Contexto

Ya funciona el ciclo del plan §17, salvo registrar el feedback (F1-11).

- **Perfil** (`#/perfil`): campos declarados con límites de longitud, autoevaluación por competencia y evidencia previa, con un aviso para no escribir datos reales. No se precarga nada sobre Daniel (regla del repo).
- **Explicación opcional** en comprobaciones y práctica: antes de comprobar se puede escribir el porqué, la confianza y la ayuda declarada. Todo se guarda con la respuesta.
- **Entrega del laboratorio** (`#/cursos/m02/laboratorio`, al final): texto, evidencias (con «incluir en el reporte»), cuaderno de decisiones y autoevaluación por criterio. El estado lo calcula `reviewState`, no lo elige el alumno.
- **Reporte de evaluación** (`#/evaluacion`):
  - Se elige el alcance (curso o expediente, con periodo opcional), las actividades y los campos del perfil.
  - La vista previa muestra la fecha de corte, los conteos, la cobertura por competencia, lo que queda fuera y el tamaño, y el reporte completo en un iframe con `sandbox`.
  - Se descarga un HTML autocontenido con las 11 secciones de §17.4 y se puede copiar el Markdown.
  - El generador es `src/report/build.ts`, una función pura con 8 pruebas que cubren el escape, las exclusiones, la conciliación del JSON con el detalle y las evidencias no incluidas.
  - El HTML lleva una CSP `default-src 'none'`, no tiene scripts y deja el JSON escapado dentro de un `<pre>`.
- **Respaldo** (en el perfil): exporta un JSON validado y restaura con confirmación, reemplazando todo. Migra respaldos de la v1, rechaza con mensaje claro y tiene un límite de 20 MB.
- **Esquema v2:** se agregó la tabla `reports` (Dexie `version(2)`), con una prueba que abre una base v1 con datos.
- **Competencias C01–C13** en `content/competencies.json`, validadas contra el contrato y los cursos.

`npm test` 94/94, lint y build. Claude probó el recorrido de §17.10 en el navegador: perfil, cuatro respuestas (una con explicación inyectada), entrega del laboratorio, reporte, descarga, segundo reporte con «Evolución», respaldo y restauración. También a 375 px.

## Pedido

Eres el revisor independiente. Puedes usar un subagente para la seguridad del reporte y otro para la experiencia de uso.

1. **Privacidad (R-04).** ¿Hay algún camino por el que algo excluido llegue al HTML, al Markdown o al JSON? ¿Los avisos sobre el texto libre son suficientes y están donde hacen falta? ¿Falta algún límite de longitud?
2. **Seguridad del HTML.** Intenta romper el escape con texto en el perfil, las explicaciones, la entrega, las evidencias y las preguntas para el evaluador (etiquetas, comillas, `</pre>`, `</textarea>`, Unicode). ¿La CSP es correcta? ¿El iframe de la vista previa queda bien aislado?
3. **Contenido del reporte frente a §17.4 y §17.9.** ¿Separa bien lo declarado, lo observado y lo que interpreta el evaluador? ¿Un evaluador podría trabajar sin abrir la app? ¿El resumen concilia con el detalle? ¿Algo engaña (por ejemplo, conteos que parecen niveles)?
4. **Experiencia de uso** a 360 px y en escritorio, con teclado: perfil, entrega del laboratorio, preparar la evaluación y respaldo. ¿Se entiende qué se comparte y qué no? ¿El estado de la entrega explica lo que falta?
5. **Respaldo.** ¿La restauración es suficientemente explícita? ¿Hay algún caso de pérdida de datos?

## Entregables

- `investigacion/codex-revision-expediente.md` con los hallazgos en el formato de PROTOCOLO §5, ordenados por severidad, con pasos para reproducir cada uno.
- La sección **Entrega** de este ticket.

## Criterios de aceptación

- [ ] Se generó al menos un reporte con texto hostil en cada campo libre y se inspeccionó el HTML resultante.
- [ ] Se probaron la exportación y la restauración del respaldo, y una importación inválida.
- [ ] Se corrieron `npm test` y `npm run build`.

## Archivos permitidos

- `investigacion/codex-revision-expediente.md` (nuevo)
- `design/qa/T-014/**` (capturas, si ayudan)
- La sección Entrega de este ticket y su campo Estado

No edites `src/` ni `content/`: Claude aplica las correcciones.

## Fuera de alcance

Registrar el feedback y la ruta personal (F1-11), y la PWA y el modo offline (Fase 2).

---

## Entrega

_(Codex)_

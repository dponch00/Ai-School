# T-015 — Revisión completa del piloto M02 (F1-12), incluida la ruta personal (F1-11)

| Campo | Valor |
| --- | --- |
| Para | Codex |
| De | Claude Code |
| Estado | entregado |
| Creado | 2026-10-22 |
| Depende de | T-014 (cerrado) |
| Fase del plan | 1 — Piloto (F1-11, F1-12) |

## Contexto

El piloto de M02 ya está completo en la app. Esta es la revisión de conjunto antes de la puerta de calidad (F1-13, D-011).

**Lo nuevo desde T-014 (F1-11, sin revisar todavía): «Mi ruta» (`#/ruta`).**

- Para registrar una retroalimentación se elige el reporte evaluado, quién evaluó (herramienta de IA o persona) y se pega el texto completo (límite de 100 000 caracteres). Si el texto trae un bloque JSON con `schema_version` (plantilla en `src/domain/feedback.ts`), la app lo valida, muestra las discrepancias (reporte desconocido o ajeno, objetivos o competencias que no existen) y convierte las recomendaciones en propuestas. Si el bloque no es válido, solo se guarda el texto.
- El registro es idempotente por un hash SHA-256 del texto, y nunca toca respuestas ni puntuaciones.
- Las propuestas y los ajustes se aceptan, se empiezan, se completan, se posponen o se descartan; cada cambio queda en el historial y se puede deshacer. Hay ajustes manuales (repaso, ejercicio, tema nuevo, nota) que no modifican el currículo oficial.
- En la portada del curso, una lección con un repaso aceptado muestra «En tu ruta: repasar».
- La navegación quedó en Cursos, Perfil, Evaluación y Mi ruta; la marca lleva al inicio.

Claude lo probó en el navegador: reporte, retroalimentación con un bloque que incluía un objetivo inexistente, propuestas, aceptar, descartar y deshacer, duplicado no registrado, ajuste manual y portada del curso. También a 360 px. `npm test` 105/105, lint y build.

## Pedido

Eres el revisor independiente del piloto completo. Usa subagentes: por ejemplo, uno para la ruta personal y la privacidad, otro para la experiencia móvil y la accesibilidad, y otro para el recorrido de §17.10.

1. **F1-11 (lo nuevo):** seguridad y privacidad del texto pegado (se muestra dentro de `<pre>`, nunca como HTML) y validación del bloque. ¿La idempotencia es correcta? ¿Las propuestas se aplican solo con una acción explícita? ¿Deshacer funciona en todos los estados? ¿Se entiende la diferencia entre una calificación oficial y una evaluación externa?
2. **Recorrido de §17.10, de principio a fin**, con datos sintéticos: perfil, tres preguntas con explicación y ayuda declarada, una práctica breve, reporte, retroalimentación pegada, aceptar una acción, otro ejercicio y un segundo reporte que muestre «Evolución» y «Retroalimentación previa». Señala cada paso que confunda o falle.
3. **Criterios de §17.9:** marca cada uno como cumplido, parcial o no cumplido, con la evidencia (ruta, archivo o prueba).
4. **Experiencia móvil y accesibilidad (WCAG 2.2 AA, en lo que aplique)** en todas las rutas, a 360 px y con teclado: foco visible, orden, nombres accesibles, contraste, objetivos de 44 px y texto al 200 %. Las rutas son inicio, cursos, portada de M02, las seis lecciones, laboratorio, práctica, examen, perfil, evaluación y mi ruta.
5. **Coherencia del piloto:** ¿hay algo que aparente funcionar sin hacerlo? ¿Algún texto de la interfaz contradice lo que hace la app?

## Entregables

- `investigacion/codex-revision-piloto.md`, con los hallazgos en el formato de PROTOCOLO §5, ordenados por severidad, y la tabla de §17.9 con su estado y evidencia.
- La sección **Entrega** de este ticket.

## Criterios de aceptación

- [ ] El recorrido de §17.10 se completó entero, con dos reportes.
- [ ] Se revisaron todas las rutas a 360 px y con teclado.
- [ ] La tabla de §17.9 está completa.
- [ ] Se corrieron `npm test` y `npm run build`.

## Archivos permitidos

- `investigacion/codex-revision-piloto.md` (nuevo)
- `design/qa/T-015/**` (capturas, si ayudan)
- La sección Entrega de este ticket y su campo Estado

No edites `src/` ni `content/`: Claude aplica las correcciones.

## Fuera de alcance

La PWA y el modo offline (Fase 2), el diagnóstico inicial y la puerta F1-13 (la prepara Claude con tu informe).

---

## Entrega

_(Codex, 2026-10-22)_

- Informe: `investigacion/codex-revision-piloto.md`.
- Recorrido §17.10 completado con datos sintéticos: dos reportes, feedback estructurado, propuesta aceptada y comparación de evolución/feedback previo en el segundo HTML.
- Revisadas las 15 rutas a 360 px y mediante teclado; se documentan cuatro hallazgos (uno alto y tres medios), además de la limitación de zoom del navegador integrado.
- Tabla completa de criterios §17.9 incluida en el informe.
- Verificación: `npm test` y `npm run build` ejecutados correctamente.

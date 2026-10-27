# T-048 — Revisión de M10: lecciones 4 a 6, sus preguntas y fichas

| Campo | Valor |
| --- | --- |
| Para | Codex |
| De | Claude Code |
| Estado | entregado |
| Creado | 2026-10-27 |
| Depende de | T-047 (cerrado) |
| Fase del plan | 3 — Nueve manuales |

## Contexto

T-047 está aplicado:
- **L1:** la forma «necesito… para…» dice qué quiere lograr la persona; traducirlo a una decisión queda como inferencia del curso.
- **L2:** el 57 % se atribuye a «un motor de reglas de código abierto, según su propio fabricante», sin afirmar que sea el más usado.

Esta tanda cierra las lecciones de M10, sobre `investigacion/M10-producto-integrador.md`. Todas sus fuentes ya están en `content/sources.json`. Lo nuevo pasó por el agente revisor de texto.

- **Lecciones:**
  - **L4, publicar, actualizar y seguir funcionando:** la app estática que se puede reconstruir; construir y desplegar como pasos separados, con las pruebas antes; la versión nueva que espera y el riesgo de forzarla; avisar y dejar elegir; el versionado semántico y lo que es «público» en una herramienta; el cambio de hosting y los datos que no se mudan; respaldos 3-2-1 con restauración probada; el runbook.
  - **L5, documentación, evidencia y quién responde:** las cuatro formas de documentación; quien usa frente a quien mantiene; el README; declarar el uso y los límites; quien aprueba responde; el paquete de evidencia; las licencias. Cierra con una serie de cinco piezas.
  - **L6, mantenimiento:** las piezas que cambian sin tocar el código; skills evaluadas contra su versión anterior; el retiro de modelos; el parcheo de dependencias; la tabla de disparadores; el calendario; las tres salidas de un hallazgo; cuándo se reabre; el plan de este mismo curso como caso de transferencia.
- **18 preguntas** en `questions/checks.json` (`m10-l4-*`, `m10-l5-*` y `m10-l6-*`).
- **32 conceptos erróneos nuevos,** `m10-mc31` a `m10-mc62`. Quedan para el examen `mc10`, `mc12`, `mc18`, `mc35` y `mc45`.
- **5 fichas:**
  - `m10-pc-static-hosting` (L4);
  - `m10-pc-agent-responsibility` (L5, tipo `guidance`; la página de Codex no dice de forma explícita que el usuario sea responsable, y la ficha lo aclara);
  - `m10-pc-dependency-review` (L5);
  - `m10-pc-model-retirement` (L6, con fechas que vencen el 2026-11-30 y próxima revisión el 2026-12-01);
  - `m10-pc-dependency-updates` (L6).

**Relación con el laboratorio.** El laboratorio propuesto por la investigación, «El simulador de descuentos», tiene su giro en una mudanza de hosting en la que los datos del navegador no viajan. L3 y L4 enseñan ese hecho, así que en el laboratorio no será una sorpresa conceptual, sino una aplicación: el caso obliga a revisar una decisión anterior y a reabrir un hallazgo aceptado sin condición. Ninguna comprobación de esta tanda usa descuentos, almacenamiento solo en el teléfono como riesgo aceptado, ni hosting cuyos términos no admitan uso comercial, para no anticipar el caso. Dime si conviene cambiar algo antes de escribir el laboratorio.

**El revisor de texto:**
- explicó los términos la primera vez que aparecen (construcción, despliegue, service worker, versionado semántico, parche, hosting, README, licencia, vulnerabilidad, línea base, PR automática, riesgo aceptado);
- cambió por su razón las frases de eslogan al cierre de los párrafos;
- reescribió la definición de «disparador» en la decisión de L6;
- en el ejemplo de L4, dejó las pruebas dentro de la construcción, como dice la lección;
- en L5 y L6, presentó como punto de partida lo que enseñaron los manuales 2, 3, 4 y 9;
- reescribió los feedback;
- en `m10-l5-c3`, el escenario dice ahora que la analista es la dueña de la herramienta, que la clave daba por hecho.

**Lo que apliqué yo:**
- `m10-mc52` citaba `src-github-about-readmes`, que no habla de capturas como evidencia. Quedó como inferencia, sin fuente.

Quedan para ti dos dudas del revisor:
- **L6:** dos explicaciones nuevas son inferencia, pero no llevan marca propia porque están dentro de párrafos que ya la tienen: «una skill puede activarse bien y entregar algo peor» y «nadie abre una PR cuando cambian los términos del hosting». ¿Se acepta así?
- **«biblioteca» o «librería»:** M04 dice «biblioteca» y M10, «librería». Lo anoto para unificarlo en la fase 4; si tienes preferencia, dila.

Longitud de las claves en las 34 preguntas: la más larga en 1 y la más corta en 6; la mayor proporción entre opciones de una misma pregunta es 1,46.

`npm test` 247/247.

## Pedido

1. **Fidelidad a las fuentes:** que cada `:cite[...]` diga lo que afirma la lección. Prioriza:
   - **L4:** el flujo con construcción y despliegue separados (`needs`); el ciclo de vida del service worker (la espera, recargar no basta, forzar mezcla versiones); que la caché vieja no se borra sola; avisar y dejar elegir; SemVer (API pública, inmutabilidad, obsolescencia); la regla 3-2-1 de CISA con la restauración probada.
   - **L5:** Diátaxis (las cuatro formas y el riesgo de mezclarlas); qué responde un README; Make a README; Nygard; model cards; las frases sobre responsabilidad de Claude Code y Copilot; sin licencia rigen los derechos de autor; la revisión de dependencias.
   - **L6:** la evaluación de skills contra la versión anterior en contexto limpio; las evaluaciones antes que la documentación y con todos los modelos; los 60 días de aviso y que las peticiones a un modelo retirado fallan; NIST SP 800-40r4 (el parcheo como mantenimiento preventivo y costo esperado); las PR automáticas; el descarte de alertas con motivo, comentario, registro y reapertura; CODEOWNERS.
2. **Fichas:** verifica las cinco contra sus páginas y anota cualquier cambio.
3. **Preguntas:**
   - que tengan una clave única y defendible, y explicaciones fieles al `sectionRef`;
   - que cada distractor tenga bien asignado su concepto erróneo;
   - que no haya pistas de longitud;
   - que ningún escenario repita M01 a M09 ni el diagnóstico (`dx-b5-02` sobre todo).
   - Casos que conviene mirar:
     - **`m10-l4-c3`:** 2.0.0 por un cambio en el formato de exportación;
     - **`m10-l4-c2`:** por qué el gerente no ve la versión nueva;
     - **`m10-l5-c3`:** quién responde;
     - **`m10-l6-c4`:** la reapertura del riesgo aceptado.
4. **Alcance y tiempo:**
   - ¿Cada lección cabe en 25 minutos?
   - ¿Ningún producto aparece en el cuerpo?
   - ¿Queda fuera lo que la investigación §4 dice no enseñar (nombres de API del service worker, consejo legal sobre licencias, garantías de disponibilidad de un proveedor)?

## Entregables

- `investigacion/codex-revision-m10-l4-l6.md` con los hallazgos en el formato de PROTOCOLO §5, ordenados por severidad, y la lista de fuentes abiertas con su resultado.
- La sección **Entrega** de este ticket.

## Archivos permitidos

- `investigacion/codex-revision-m10-l4-l6.md` (nuevo)
- La sección Entrega de este ticket y su campo Estado

No edites `src/`, `content/`, `e2e/` ni `ESTADO.md`. Haz commit en la rama `main` de `C:\Users\Daniel\Documents\AI\AI_School`, con prefijo `[codex]`, y anota el hash en la Entrega. No hagas push: lo hace Claude al cerrar la ronda.

---

## Entrega

_(Codex, 2026-10-27)_

- Informe: `investigacion/codex-revision-m10-l4-l6.md`.
- Alcance revisado: L4–L6, 18 preguntas, conceptos erróneos `m10-mc31`–`m10-mc62` y las cinco fichas asignadas; se contrastaron las citas y fuentes prioritarias, las fechas/capacidades de las fichas, claves, distractores, longitudes, alcance y tiempo.
- Hallazgos: dos de severidad baja, sobre condicionar «recargar no basta» a la existencia de clientes antiguos y unificar «biblioteca» frente a «librería». Sin claves ambiguas, repeticiones materiales, nombres de producto en el cuerpo ni desviación de alcance.
- Verificación: el informe documenta fuentes abiertas, incluido el contraste alternativo oficial de CISA por 403 del URL registrado.
- Commit de entrega: `ac7ef92549c396fd45c4d33339485e4b50743e61` (`[codex] Entrega T-048: revisión M10 L4-L6`).

# T-052 — Fase 4: revisión de la candidata de entrega y del README

| Campo | Valor |
| --- | --- |
| Para | Codex |
| De | Claude Code |
| Estado | cerrado |
| Creado | 2026-10-27 |
| Depende de | T-051 (cerrado) |
| Fase del plan | 4 — Integración y revisión |

## Contexto

T-051 está aplicado:
- Quité la marca de inferencia de `m04-l1-c1`, `m04-f01-b` y `m04-p01`, cuyas claves respalda la fuente.
- La agregué a `m04-f06-b`.
- F4-04 queda en 20 preguntas marcadas, y F4-05 no tuvo hallazgos.

Con eso cerré lo que me tocaba de la fase 4:

- **F4-03, términos:** un script contó las variantes de los términos clave en los diez manuales («grader», «snapshot», «PR», «repositorio», «biblioteca», «check», «commit», «dashboard», «pipeline»…), y son consistentes. Hice dos retoques: «biblioteca» en lugar de «librería» en el laboratorio de M05, y en M01 L1 la «solicitud de cambios» ahora dice que en inglés se llama *pull request* o PR, el nombre que usan M04 en adelante.
- **F4-06:** las pruebas automáticas cubren el respaldo (exportar, restaurar, rechazar un archivo inválido, migrar versiones viejas), el modo sin conexión y la recarga. D-029 registra los dos criterios del plan §13 que reemplaza. Falta el recorrido de Daniel en el celular.
- **F4-07:** las imágenes pesan 712 KB en total, y la app solo guarda las de 480 y 960 px.
- **F4-08:** `scripts/fichas-por-revisar.py` lista lo que vence. Hoy son dos fichas y seis fuentes, el 2026-12-01.
- **F4-09:** `docs/entrega-v1.md` resume qué se entrega, con qué evidencia y con qué límites.
- **El repositorio no tenía `README.md`.** Lo escribí: qué es, cómo usarlo, cómo correrlo, probarlo y publicarlo, cómo volver atrás, cómo está organizado, el mantenimiento y la licencia pendiente.

## Pedido

Esta es la última revisión independiente antes de la fase 5.

1. **`docs/entrega-v1.md`:**
   - ¿Cada cifra y cada afirmación de la tabla de evidencia se puede comprobar en el repositorio?
   - ¿Falta algún límite conocido, o alguno está dicho con más seguridad de la que hay?
   - ¿La lista «qué falta para cerrar» está completa?
2. **`README.md`:** síguelo como lo haría alguien que llega nuevo al repositorio:
   - **De principio a fin:** `npm ci`, `npm test`, `npm run build` y, si puedes, `npm run e2e`. ¿Funciona tal cual? ¿Falta algún paso o requisito?
   - **Volver atrás y cambiar de hosting:** ¿se entiende sin leer nada más?
3. **Los dos retoques de términos y los dos scripts** (`scripts/cross-refs.py` y `scripts/fichas-por-revisar.py`): ¿hacen lo que dicen? En tu sesión, Python no arranca; si no puedes correrlos, revisa el código y dilo.

## Entregables

- `investigacion/codex-f4-candidata-entrega.md`, con los hallazgos en el formato de PROTOCOLO §5, ordenados por severidad.
- La sección **Entrega** de este ticket.

## Archivos permitidos

- `investigacion/codex-f4-candidata-entrega.md` (nuevo)
- La sección Entrega de este ticket y su campo Estado

No edites `src/`, `content/`, `e2e/`, `scripts/`, `docs/`, `README.md` ni `ESTADO.md`. Haz commit en la rama `main` de `C:\Users\Daniel\Documents\AI\AI_School`, con prefijo `[codex]`, y anota el hash en la Entrega. No hagas push: lo hace Claude al cerrar la ronda.

---

## Entrega

Entregado por Codex el 2026-10-27.

- Informe: `investigacion/codex-f4-candidata-entrega.md`.
- Verificado: Node 24.17.0; `npm ci`; `npm test` 247/247; `npm run build`;
  `npm run e2e` 158/158.
- Hallazgos: 3 medios (ventana de 30 días frente a vencimientos del 1 de
  diciembre, tamaño offline desactualizado y requisito de navegador Playwright
  ausente en README) y 1 bajo (el script `dev` no abre el navegador por sí
  mismo). Los conteos, flujo de despliegue, scripts y retoques terminológicos
  se comprobaron sin otro hallazgo.
- Python quedó bloqueado por el alias de Windows sin acceso; los scripts se
  revisaron estáticamente y sus conteos se reprodujeron con PowerShell.
- Commit de entrega: `405802e` (`[codex] Entrega T-052: candidata de entrega`).

## Revisión

_(Claude Code, 2026-10-27)_

Apliqué los cuatro hallazgos:

- **T052-E01:** la candidata ya no dice que el script lista hoy lo de diciembre. Ahora dice que entra en su ventana de 30 días el 2026-11-01, y que para verlo antes se corre con 35 días.
- **T052-E02:** lo que guarda la app al instalarse pesa unos 4,1 MiB (42 archivos, medido con el build del 2026-10-27), y no 3,6 MB. También lo corregí en D-029.
- **T052-R01:** el README agrega `npx playwright install` antes de `npm run e2e`.
- **T052-R02:** `npm run dev` ahora «inicia la app» y dice dónde abrirla.

Además corregí un error que el informe dejó a la vista: las 1 022 preguntas de la candidata incluían las 24 del diagnóstico, que la tabla ya listaba aparte. Las de los cursos son 998.

**Verificación:** `npm test` 247/247. Ticket cerrado; la fase 4 queda cerrada salvo el recorrido de Daniel en el celular (F4-06).

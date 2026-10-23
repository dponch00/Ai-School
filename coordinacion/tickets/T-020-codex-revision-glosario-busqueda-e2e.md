# T-020 — Revisión del glosario, la búsqueda y las notas (F2-07), y de las pruebas E2E (F2-08)

| Campo | Valor |
| --- | --- |
| Para | Codex |
| De | Claude Code |
| Estado | entregado |
| Creado | 2026-10-22 |
| Depende de | T-019 (cerrado) |
| Fase del plan | 2 — Base de app y PWA |

## Contexto

**F2-07:**

- **Glosario** (`content/glossary.json`, `#/glosario`): 22 términos de M02 escritos por Claude. Cada definición parafrasea lo que ya dice su lección, sin afirmaciones nuevas, y enlaza a los apartados donde se explica (`refs`). El build falla si un `ref` apunta a un apartado que no existe.
- **Búsqueda** (`src/search/index.ts`, `#/buscar`): usa MiniSearch 7.2 con el *stemmer* español de Orama (D-014). Indexa la raíz con y sin tilde, para que «reconciliacion» encuentre «reconciliación», y busca por prefijo con tolerancia a errores pequeños. Los documentos se arman en el build, uno por apartado de lección y del laboratorio y uno por término del glosario, y cada resultado lleva a su apartado.
- **Notas y marcadores:** al final de cada lección hay un marcador y una nota personal (límite de 10 000 caracteres, no entra en los reportes); se juntan en «Mis notas» (`#/notas`) y viajan en el respaldo. En la cabecera hay un enlace «Buscar», y en el pie, enlaces al diagnóstico, el glosario y «Mis notas».

**F2-08** (`e2e/`, `npm run e2e`):

- Playwright 1.64 y axe 4.14 corren contra el build real con su SW, a 360 px y en escritorio.
- 16 rutas sin violaciones WCAG 2.2 A/AA ni desborde horizontal.
- Flujos: comprobación con teclado y persistencia, examen retomado, modo sin conexión con el diagrama, búsqueda hasta el apartado, y nota y marcador.
- La primera corrida destapó dos problemas, ya corregidos: tablas que no se podían alcanzar con el teclado y un radio del examen que parpadeaba.

`npm test` 154/154 y `npm run e2e` 42/42.

## Pedido

1. **Glosario (contenido de Claude, revisión cruzada):** ¿cada definición es fiel a su lección y a sus fuentes? ¿Alguna exagera o se queda corta? ¿Cumple `docs/guia-de-estilo.md`? ¿Falta algún término de M02 que un lector buscaría?
2. **Búsqueda:** prueba consultas reales de un alumno, con y sin tildes, en plural, con errores de tipeo y con términos en inglés. ¿Los primeros resultados son los útiles? ¿El fragmento se entiende?
3. **Notas y marcadores:** ¿se entiende que son privados y no van al reporte? Revisa la experiencia a 360 px y con teclado.
4. **Pruebas E2E:** ¿qué recorrido importante falta? ¿Alguna prueba pasa por la razón equivocada? Recuerda que axe detecta solo una parte de los problemas de WCAG; señala los que requieran revisión manual.

## Entregables

- `investigacion/codex-revision-glosario-busqueda-e2e.md` con los hallazgos en el formato de PROTOCOLO §5, ordenados por severidad.
- La sección **Entrega** de este ticket.

## Archivos permitidos

- `investigacion/codex-revision-glosario-busqueda-e2e.md` (nuevo)
- `design/qa/T-020/**`
- La sección Entrega de este ticket y su campo Estado

No edites `src/`, `content/` ni `e2e/`.

---

## Entrega

- Informe: `investigacion/codex-revision-glosario-busqueda-e2e.md`.
- Revisión cruzada: las 22 definiciones son fieles a las lecciones y sus fuentes, y cumplen la guía de estilo. Se señalan cuatro hallazgos: tolerancia insuficiente ante dos erratas comunes, ausencia de «Reconciliación» como término, falta de prueba E2E de privacidad de notas y cobertura E2E superficial de glosario y sus referencias.
- Verificación: `npm test` (154/154), `npm run e2e` (42 recorridos completados en escritorio y 360 px) y `npm run build` correctos. Para E2E se instaló el Chromium requerido por Playwright; Vite mantiene su advertencia de chunk grande.
- Siguiente acción: priorizar T020-01 y T020-03 antes de ampliar la búsqueda y las exportaciones.

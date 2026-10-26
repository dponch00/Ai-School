# T-033 — Revisión de M05 completo: lecciones, preguntas, examen, laboratorio y práctica

| Campo | Valor |
| --- | --- |
| Para | Codex |
| De | Claude Code |
| Estado | cerrado |
| Creado | 2026-10-23 |
| Depende de | — (T-032 sigue abierto; es independiente de este) |
| Fase del plan | 3 — Nueve manuales |

## Contexto

Es el primer ticket por manual completo (D-025). M05, «Desarrollo con agentes de código», se escribió sobre `investigacion/M05-desarrollo-con-agentes.md` y pasó por dos revisores de texto en paralelo. Contiene:

- **Blueprint** (`content/courses/m05/course.json`): seis objetivos en opción múltiple. Competencias C07 (principal), C01, C03 y C11.
- **Seis lecciones:**
  1. permisos, sandbox y red;
  2. explorar y planear;
  3. encargos acotados con un check ejecutable;
  4. depurar y saber cuándo parar;
  5. pruebas, navegador y revisión;
  6. local o nube, y traspaso entre herramientas.
- **Preguntas:**
  - 34 comprobaciones;
  - banco de examen de 14 familias, con 42 ítems y un enunciado por familia;
  - laboratorio «Las alertas de cobranza», con 6 pasos y 12 preguntas, y un giro en el paso 3: el agente se detiene ante una prueba que contradice el encargo;
  - 12 preguntas de práctica.
- **52 conceptos erróneos, 6 fichas y 17 fuentes nuevas** en `content/sources.json`.

`npm test` 162/162.

## Pedido

1. **Fidelidad a las fuentes:** que cada `:cite[...]` diga lo que afirma la lección. Prioriza:
   - el 84 % del sandbox (uso interno de un proveedor, fechado);
   - el ensayo de productividad: 16 desarrolladores, 246 tareas, +19 % frente al −20 % percibido;
   - lo que el estudio de pruebas imposibles dice de las pruebas de solo lectura, de la instrucción de detenerse y de la salida para consultar;
   - la autocorrección sin señal externa;
   - la regla de dos correcciones fallidas: es de un solo proveedor y la lección lo dice;
   - que compactar sea una petición grande y limpiar no cueste;
   - los requisitos del traspaso de la nube a la terminal.
2. **Fichas:** verifica cada una contra sus páginas oficiales. Anota cualquier cambio desde el 2026-10-23, sobre todo:
   - los modos de permiso y sus versiones;
   - la red por defecto de cada nube;
   - los 59 minutos del agente en la nube;
   - si los estados de lanzamiento que la ficha da como GA están documentados así. La investigación (§7.8) advierte que muchas páginas no lo indican; di si conviene cambiar a «estado no indicado».
3. **Preguntas** (las 100):
   - Clave única y defendible.
   - Distractores con su concepto erróneo bien asignado.
   - Explicaciones fieles al `sectionRef`.
   - Sin pistas de longitud.
   - Revisa tres frases que agregó el revisor y que no estaban en el original: `m05-f02-b` o1, `m05-f05-c` o2 y `m05-lab-q04` o2.
4. **Repeticiones** con el diagnóstico (`dx-b4-01`, `dx-b4-04`, `dx-b3-01`, `dx-b3-04`, `dx-b6-02`, `dx-b1-01`) y con M03 y M04. Las más cercanas son:
   - `m05-f08-a` y `m05-l4-c1`: sesión nueva tras correcciones fallidas, como `m03-f01-a`;
   - `m05-f06-a`: prueba modificada;
   - `m05-l3-c1` y `m05-f05`: elegir el encargo.

   Di cuáles revelan la respuesta.
5. **Laboratorio:**
   - ¿Cada paso trae lo necesario para decidir?
   - ¿El giro del paso 3 obliga de verdad a revisar el paso 2?
6. **Alcance y tiempo:**
   - ¿Ningún producto aparece en el cuerpo de las lecciones?
   - ¿Cada lección cabe en 25 minutos?
   - **Interfaz:** revisa a 360 px la portada de M05, una lección, el laboratorio y el inicio del examen.

## Entregables

- `investigacion/codex-revision-m05.md` con los hallazgos en el formato de PROTOCOLO §5, ordenados por severidad, y la lista de fuentes abiertas con su resultado.
- La sección **Entrega** de este ticket.

## Archivos permitidos

- `investigacion/codex-revision-m05.md` (nuevo)
- `design/qa/T-033/**`
- La sección Entrega de este ticket y su campo Estado

No edites `src/`, `content/`, `e2e/` ni `ESTADO.md`. Haz commit en la rama `main` de `C:\Users\Daniel\Documents\AI\AI_School`, con prefijo `[codex]`.

---

## Entrega

_(Codex, 2026-10-23)_

- Informe: `investigacion/codex-revision-m05.md`.
- Hallazgos: 0 críticos, 0 altos, 2 medios y 2 bajos. Prioridades: estados de lanzamiento de fichas, pistas de longitud en 11 ítems y un solape que adelanta una respuesta del examen.
- Verificación: `npm test` pasó (12 archivos, 162 pruebas); revisión de 360 px y escritorio sin desbordamiento, con selección por teclado en laboratorio y examen.
- Commit de entrega: `ad33012f34d82a5d461f4cdd0baeb62bb6ee1ba4` (`[codex] Entrega T-033: revisión integral de M05`).

## Revisión

_(Claude Code, 2026-10-25)_

- **T033-M05-01 (media), aplicado.** El esquema de fichas admite dos estados nuevos: `unspecified` («estado no indicado por el proveedor») y `mixed` («estados distintos según la capacidad»). Las fichas de permisos y de agentes en la nube pasan a `mixed` y dicen qué capacidad es experimental o está en vista previa. Las de modo plan, movimientos de sesión y navegador pasan a `unspecified`.
- **T033-M05-02 (media), aplicado.** Las once claves señaladas se reescribieron con frases paralelas a las otras opciones, sin agregar pistas. Revisé además con la misma medida todo el banco y corregí cinco preguntas más (`m05-l2-c4`, `m05-l6-c2`, `m05-l6-c4`, `m05-f08-c` y `m05-lab-q09`). Ninguna queda con una proporción de 1,7 o más.
- **T033-M05-03 (baja), aplicado.** `m05-f05-c` dice ahora «en el estudio, agregar la instrucción de detenerse… redujo mucho los atajos».
- **T033-M05-04 (baja), aplicado.** `m05-f08-a` trae un caso nuevo: un comando mínimo muestra la causa (la coma decimal) después de tres intentos. La decisión es llevar esa causa a una sesión nueva frente a darla en la misma sesión o compactar. Ya no repite `m03-f01-a` ni `m05-l4-c1`.
- `npm test` 162/162.

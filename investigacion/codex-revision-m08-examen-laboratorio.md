# Revisión cruzada — M08: examen, laboratorio y práctica

Fecha de revisión: 2026-10-26  
Alcance: 42 ítems del examen, sus 14 familias, 12 preguntas de laboratorio,
12 de práctica, conceptos erróneos `m08-mc56` a `m08-mc75` y los añadidos de
`m08-l3#cuando` y `m08-l4#hora`.

## Hallazgos

- [T043-01] Severidad: media
  Ubicación: `content/courses/m08/questions/exam.json`, `m08-f13-b`; `content/courses/m08/questions/checks.json`, `m08-l6-c2`.
  Evidencia: ambos presentan una tarea programada que falla repetidamente y
  evalúan la misma primera decisión: pausarla, leer el registro y corregir
  antes del siguiente lanzamiento. Cambian el número de noches y el motivo
  concreto, pero no la decisión ni el razonamiento del alumnado.
  Consecuencia: una comprobación ya acertada revela la clave de una variante
  base del examen; deja de aportar evidencia independiente sobre `m08-eo6`.
  Corrección recomendada: conservar en el examen la decisión de detener ante
  una repetición, pero cambiar el caso por una ejecución que no falla y cuyo
  registro muestra un resultado incompleto; pedir distinguir entre estado de
  la sesión y validez de la salida.

- [T043-02] Severidad: media
  Ubicación: `content/courses/m08/questions/exam.json`, `m08-f10-b`; `content/courses/m08/questions/checks.json`, `m08-l4-c4`.
  Evidencia: las dos preguntas describen una tarea que hereda accesos que no
  necesita y tienen la misma clave práctica: quitar conexiones/permisos y
  conservar solo el mínimo. El cambio de «correo y calendario» a «sueldos» no
  cambia la decisión evaluada.
  Consecuencia: la comprobación adelanta la respuesta de una variante base del
  examen y comprime la cobertura real de `m08-eo4`.
  Corrección recomendada: convertir `m08-f10-b` en una decisión distinta de la
  familia, por ejemplo pedir qué evidencia de identidad y de acceso debe dejar
  el registro de una tarea ya limitada; mantener `m08-l4-c4` como el único
  ítem sobre retirar conexiones por defecto.

- [T043-03] Severidad: media
  Ubicación: `content/courses/m08/questions/exam.json`, `m08-f14-a`; `content/courses/m08/questions/checks.json`, `m08-l6-c4`.
  Evidencia: ambos casos pasan exactamente de un borrador acompañado a uno
  nocturno/no supervisado enviado a un destinatario, y ambos tienen la misma
  clave: compuerta automática, alerta y revisión humana. Solo cambian la hora
  y el destinatario.
  Consecuencia: la variante del examen mide el recuerdo literal de la
  comprobación, no una aplicación nueva de la verificación proporcional.
  Corrección recomendada: usar en `m08-f14-a` un proceso que antes tenía una
  revisión de muestreo y ahora modifica un dato operativo; pedir elegir una
  señal independiente y una escalación proporcional, sin reutilizar la terna
  «compuerta, alerta y revisión humana».

- [T043-04] Severidad: media
  Ubicación: `content/courses/m08/questions/lab.json`, `m08-lab-q05`; `content/courses/m08/questions/exam.json`, `m08-f08-b`.
  Evidencia: los dos ítems preguntan la misma tesis («varios agentes cuestan
  lo mismo que uno») y la rechazan con la misma razón: cada agente consume
  tokens y contexto propios. El laboratorio usa diez notas y el examen cinco
  agentes, pero no añade una variable decisoria nueva.
  Consecuencia: quien complete el laboratorio recibe la respuesta de una
  variante de examen y el caso pierde espacio para evaluar la continuidad de
  sus propias decisiones.
  Corrección recomendada: en `m08-lab-q05`, preguntar qué condición permitiría
  repartir las notas si crecieran (independencia, rúbrica común e integración),
  y dejar la equivalencia de costo en `m08-f08-b`.

## Comprobaciones sin hallazgo

- Las 42 preguntas del examen tienen exactamente una opción marcada correcta.
  Las tres variantes de cada una de las 14 familias conservan la decisión que
  declara `families.json`; los casos señalados `f02-c`, `f07-c`, `f09-c`,
  `f04-a`, `f05-c`, `f12-c`, `f13-c` y `f14-b` tienen clave defendible y
  feedback coherente con su `sectionRef`.
- Todos los distractores de examen, práctica y laboratorio apuntan a un
  concepto erróneo existente. Las opciones no alcanzan una relación de
  longitud de 1,7:1, incluida la selección de claves acortadas.
- Las preguntas con `basis: inference` expresan reglas derivadas explícitas
  del curso (no inventan un comportamiento de producto): no delegar un
  supuesto de negocio, probar el conjunto integrado, evitar un agente cuando
  el proceso es fijo, dejar un borrador revisable y detener/investigar antes
  de repetir un fallo.
- El laboratorio mantiene un único caso de las diez oportunidades: propuesta,
  encargos, reparto, lugar de ejecución, controles y giro. Sus doce preguntas
  siguen dos por paso, no nombran productos y el giro recupera los errores de
  los pasos 2 y 3.
- `m08-l3#cuando` presenta los rendimientos decrecientes como resultado
  contextual de un estudio y no como promesa general. `m08-l4#hora` coincide
  con la documentación de GitHub: el inicio de cada hora es un periodo de alta
  carga en el que un trabajo programado puede retrasarse o descartarse.

## Fuentes abiertas

| Fuente | Resultado de la comprobación |
| --- | --- |
| [Anthropic — Building effective agents](https://www.anthropic.com/research/building-effective-agents) | Respalda distinguir flujos predefinidos de agentes que deciden dinámicamente y empezar por el diseño más simple. |
| [Anthropic — Multi-agent research system](https://www.anthropic.com/research/multi-agent-research-system) | Respalda usar varios agentes para trabajo independiente y abierto, no para dependencias/contexto compartido; informa aproximadamente 4× tokens para agentes y 15× para sistemas multiagente frente a chat. |
| [Anthropic — Scheduled tasks](https://code.claude.com/docs/en/routines) | Respalda el encargo autosuficiente, el alcance de repositorios/conectores y que las acciones con identidades conectadas aparecen como la persona. |
| [Anthropic — Hooks guide](https://code.claude.com/docs/en/hooks-guide) | Respalda que un hook previo puede bloquear la edición de un archivo protegido y que un hook posterior no reemplaza ese control. |
| [GitHub Actions — schedule](https://docs.github.com/en/actions/reference/workflows-and-actions/events-that-trigger-workflows#schedule) | Confirma retrasos, posibles descartes y alta carga al comienzo de cada hora. |
| [Google SRE — Distributed Periodic Scheduling with Cron](https://sre.google/sre-book/distributed-periodic-scheduling/) | Respalda tratar por separado reintentos, ejecuciones dobles y verificación de trabajos periódicos. |
| `content/courses/m08/lessons/m08-l3.md`, `m08-l4.md`, `content/sources.json` y las fuentes declaradas por ítem | Contrastados contra los `sectionRef` y `sourceIds` de examen, laboratorio y práctica. |

## Verificación ejecutada

`npm test`: 14 archivos y 219 pruebas correctas. No se ejecutó Python, conforme
al alcance del ticket.

# Revisión cruzada — cierre de M07

Fecha: 2026-10-26. Alcance: examen, familias, laboratorio, práctica, conceptos `m07-mc57`--`m07-mc82` y la nueva frase de L6. No se modificó contenido ni código.

## Hallazgos

- [T040-REP-01] Severidad: media
  Ubicación: `content/courses/m07/questions/lab.json`, `m07-lab-q03` y `m07-lab-q04`; comparación con `m07-l2-c1` y `m07-l4-r2` en `questions/checks.json`.
  Evidencia: `q03` vuelve a pedir elegir los dos scopes mínimos frente a permisos amplios, la misma decisión de L2; `q04` vuelve a pedir una credencial efímera por ejecución frente a una de larga duración, la misma decisión que el repaso de L4/L2. El contexto narrativo cambió, pero la información decisiva y la respuesta correcta no.
  Consecuencia: contradice el requisito de no repetir las 34 comprobaciones y consume dos de doce decisiones del caso sin producir transferencia nueva.
  Corrección recomendada: mantener los permisos como antecedentes del paso, pero usar una pregunta que exija combinarlos con una condición nueva del caso; por ejemplo, decidir cómo separar la credencial que lee oportunidades de la que crea tareas cuando el informe cambia de solo lectura a escritura.

## Comprobaciones sin hallazgo

- Las 42 preguntas del examen, 12 del laboratorio y 12 de práctica tienen exactamente una clave marcada. Las claves de `m07-f01-c`, `f03-c`, `f05-c` y `f12-a` son defendibles: una respuesta 200 inconsistente se revisa; no se amplía un scope no necesario; la autorización efectiva debe estar en el CRM; y `COUNT(columna)` omite nulos.
- Los distractores de los casos señalados corresponden al concepto erróneo descrito. Las tres variantes de cada una de las 14 familias conservan la decisión declarada en `families.json`; no detecté mezcla de objetivos en una familia.
- `m07-l5-c4` no se replica de forma sustantiva: M06 trataba la autoanotación de una herramienta SQL; M07 examina reducir una interfaz que acepta SQL arbitrario. `m07-f07-a` y `m07-f09-b` retoman conceptos, pero cambian el contexto y la decisión de familia sin copiar una comprobación.
- El laboratorio mantiene una secuencia inteligible: contrato → permisos → vía → duplicados → preguntas → operación real. El giro de OAuth en navegador funciona porque conecta con el error previo de usar sesión personal y exige recuperar la credencial de servicio. `lab-q12` es correctamente una inferencia del curso: las fuentes sustentan el riesgo de inyección, pero que el código fije la lista de tareas es un control de diseño recomendado, no un hecho atribuido a una fuente.
- Los datos comprobados contra `opportunities_snapshot_2026-10-19.csv` coinciden: Centro tiene 11 oportunidades abiertas; OPP-1021 no tiene fecha de cierre; OPP-1015 y OPP-1020 están en EUR; y las seis vencidas son OPP-1004, 1009, 1022, 1025, 1032 y 1035.
- Las demás preguntas con `basis: inference` expresan decisiones del curso (validar, limitar o hacer fallar visiblemente) y no se presentan como afirmaciones de una fuente. Las referencias de preguntas cubren el estándar o investigación pertinente.

## Verificación ejecutada

Lectura independiente del CSV y de los seis pasos del laboratorio; revisión de familias, claves y conceptos erróneos por script. `npm test`: 14 archivos y 205 pruebas aprobadas.

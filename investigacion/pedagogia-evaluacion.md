# Pedagogía y evaluación: de la evidencia a reglas para AI School

> Investigación de apoyo para `docs/content-standard.md`, el diseño del diagnóstico y los exámenes (plan §2, §5, §13 y §17).
> Fecha de consulta de todas las fuentes: 2026-10-21. Autor: subagente de investigación de Claude Code.
> Estado: borrador para revisión cruzada. No modifica `plan.md` ni otros archivos.

**Cómo leer este documento**

- **Solidez de la evidencia.** **Alta:** varios metaanálisis o revisiones que coinciden, con evidencia también en contextos educativos reales. **Media:** metaanálisis con mucha heterogeneidad, pocos estudios aplicados o estudios sólidos pero aislados en su contexto. **Debatida:** resultados contradictorios o disputa teórica abierta. **Preliminar:** uno o pocos estudios, o evidencia indirecta.
- `[inferencia]` marca una conclusión, cifra o regla mía que las fuentes no establecen directamente.
- Tamaños de efecto (g, d): por convención, 0.2 es pequeño, 0.5 mediano y 0.8 grande. Son promedios con mucha variación: no predicen el efecto en una persona concreta.
- Las reglas tienen ID (`R-A1-1`, …) para poder citarlas desde el estándar de contenido. Las fuentes se citan con su ID `src-*` (tabla de la §6).
- Las inferencias suponen el contexto del plan: un adulto que estudia solo, en sesiones de 20–30 minutos, en escritorio y celular, con base técnica desigual (plan §2).

---

## 1. Resumen ejecutivo

1. Recuperación sin texto visible y espaciado: las técnicas con más respaldo, también en aulas reales. El intercalado sirve para distinguir casos parecidos, no para leer.
2. Base desigual: adaptar el andamiaje por competencia según desempeño (reversión de la pericia), no por autodescripción ni "estilos de aprendizaje" (mito).
3. Lección: ejemplo resuelto → ejemplo para completar → problema propio; solo imágenes instructivas, sin detalles seductores.
4. Opción múltiple: 3 opciones bien hechas miden igual que 4; la cuarta solo con otro error real. Feedback elaborado por opción: respaldo fuerte.
5. Con un solo alumno no hay fiabilidad ni análisis de ítems: 24 ítems dan señales por bloque, con incertidumbre explícita.
6. 10/12 es razonable pero ruidoso (dominio real del 75 % aprueba el 39 % de las veces) y los reintentos lo inflan: cobertura, espera, banco por familias y comprobación diferida.
7. LLM evaluador: útil con sesgos documentados (orden, longitud, autopreferencia, complacencia, inyección); exige rúbrica, evidencia antes del puntaje y doble corrida si cambia estados.

---

## 2. Hallazgos y reglas por tema

### A. Aprendizaje

#### A1. Práctica de recuperación

**Hallazgo.** Intentar recordar o aplicar lo estudiado retiene más que releer o volver a estudiar. El efecto se mantiene en aulas: una revisión de 222 estudios con más de 48 mil estudiantes estimó g ≈ 0.50. El efecto fue mayor con feedback correctivo, con varias repeticiones y cuando el formato y el material de la práctica coincidían con los de la evaluación final.

- En laboratorio, las pruebas de recuerdo benefician más que las de reconocimiento.
- Aun así, una opción múltiple con alternativas plausibles y competitivas también activa recuperación productiva, y en tres de cuatro experimentos rindió igual que la respuesta corta. Lo decisivo es lograr recuperaciones exitosas.
- La transferencia a preguntas distintas existe (d ≈ 0.40), pero es frágil. Es mayor hacia preguntas de aplicación o inferencia y cuando la práctica pide elaborar. Tras corregir el sesgo de publicación, casi desaparece si faltan esas condiciones.
- Releer, resaltar y resumir tienen baja utilidad.

**Solidez:** alta para la retención; media para la transferencia.

**Fuentes:** src-dunlosky-tecnicas-aprendizaje, src-rowland-efecto-testing, src-adesope-pruebas-practica, src-yang-quizzing-aula, src-agarwal-recuperacion-aulas, src-pan-transferencia-testing, src-smith-formatos-recuperacion, src-little-mc-exonerated, src-butler-mc-aprendizaje.

**Reglas:**

- **R-A1-1.** Cada lección termina con 3–5 preguntas de recuperación. El texto de la lección queda plegado mientras se responde y el feedback aparece después de responder.
- **R-A1-2.** Al menos una de esas preguntas aplica el concepto a un escenario nuevo, sin reutilizar frases del texto.
- **R-A1-3.** Si el objetivo es explicar, se añade una pregunta abierta breve ("explica en 1–2 frases…") con una respuesta modelo para comparar. No puntúa.
- **R-A1-4.** La práctica debe ser retadora pero con éxito frecuente. Meta orientativa: 70–85 % de acierto en las comprobaciones [inferencia: la cifra es mía; las fuentes solo establecen que el éxito en la recuperación importa].
- **R-A1-5.** El botón "Repasar" abre preguntas, no el texto. El resumen de consulta se muestra después de la comprobación, no antes.
- **R-A1-6.** Las preguntas de práctica y de comprobación no son ítems de examen (ver G).

#### A2. Espaciado y reaprendizaje sucesivo

**Hallazgo.** Distribuir la práctica en el tiempo retiene más que concentrarla.

- El intervalo óptimo crece con el plazo durante el que se quiere recordar. En un estudio con más de 1,350 personas, el mejor intervalo fue cerca del 20–40 % del plazo para una prueba a una semana, y del 5–10 % para una prueba a un año.
- Espaciar los episodios de recuperación tuvo un efecto grande frente a hacerlos seguidos (g ≈ 0.74). Los intervalos crecientes no superaron a los uniformes.
- El reaprendizaje sucesivo consiste en practicar hasta acertar y volver a acertar en sesiones posteriores. Mejoró exámenes reales y la retención a largo plazo. Una prescripción empírica fue llegar a 3 recuerdos correctos al inicio y reaprender 3 veces con intervalos amplios.

**Solidez:** alta para el espaciado; media para los parámetros exactos y para el reaprendizaje sucesivo en adultos profesionales.

**Fuentes:** src-cepeda-practica-distribuida, src-cepeda-espaciado-curva, src-latimier-recuperacion-espaciada, src-rawson-cuanto-basta, src-rawson-reaprendizaje-2013, src-rawson-reaprendizaje-2022.

**Reglas:**

- **R-A2-1.** Cada sesión empieza con 2–3 preguntas de repaso de lecciones anteriores. Tienen prioridad los errores previos, sobre todo los cometidos con confianza alta.
- **R-A2-2.** Calendario simple: un concepto se vuelve a preguntar entre 1 y 3 días y entre 1 y 3 semanas después de estudiarlo [inferencia: para retener unos 6 meses, la proporción de Cepeda 2008 sugiere intervalos de días a un par de semanas]. En la V1 no hace falta un algoritmo de intervalos crecientes.
- **R-A2-3.** Un concepto fallado pasa a "recuperado" solo si se acierta en al menos 2 sesiones distintas, no dos veces seguidas en la misma [inferencia adaptada de Rawson y Dunlosky 2011].
- **R-A2-4.** El "repaso según competencias falladas" del plan (§3) usa preguntas de práctica o variantes, nunca ítems de examen.

#### A3. Ejemplos resueltos y desvanecimiento (fading)

**Hallazgo.** Para novatos, estudiar ejemplos resueltos rinde más que resolver desde cero; un metaanálisis en matemáticas (55 estudios) halló g ≈ 0.48.

- La transición recomendada es retirar pasos resueltos poco a poco hasta que el alumno resuelve solo.
- Combinar ese retiro gradual con preguntas que piden identificar el principio de cada paso mejoró la transferencia cercana y la lejana sin alargar el tiempo.
- Desvanecer según la comprensión mostrada superó al desvanecimiento fijo, y ambos superaron a resolver sin ejemplos.
- En matemáticas, los ejemplos correctos rindieron más que los incorrectos, solos o combinados.

**Solidez:** alta para el efecto en novatos y dominios estructurados; media para el desvanecimiento adaptativo y para dominios menos estructurados, como el prompting.

**Fuentes:** src-barbieri-ejemplos-resueltos, src-renkl-transicion-ejemplos, src-atkinson-desvanecimiento, src-salden-desvanecimiento-adaptativo, src-sweller-carga-cognitiva-20-anios.

**Reglas:**

- **R-A3-1.** El caso resuelto muestra cada paso, la decisión tomada y su razón. En casos con IA, también la evidencia que verificó el resultado.
- **R-A3-2.** Secuencia dentro de la lección: ejemplo completo, luego ejemplo para completar (1–2 pasos en blanco) y luego problema o práctica propia.
- **R-A3-3.** Desvanecimiento adaptativo: si el alumno completa bien el ejemplo parcial, se le ofrece pasar al problema; si falla, ve otro ejemplo completo del mismo tipo.
- **R-A3-4.** Los ejemplos con errores ("¿qué falla en este prompt o diff?") van después de un ejemplo correcto y con el error explicado al final, sobre todo en objetivos de revisión, como el objetivo 4 del plan [inferencia: la evidencia sobre ejemplos incorrectos viene de matemáticas].

#### A4. Intercalado

**Hallazgo.** Mezclar ejemplos o problemas de categorías distintas, en vez de agruparlos por tema, mejora el aprendizaje inductivo con efecto moderado (59 estudios, g ≈ 0.42).

- Funciona mejor cuando las categorías se parecen entre sí y son variadas por dentro, y con material complejo.
- Con textos expositivos el resultado fue ambiguo, y con listas de palabras convino agrupar (g ≈ −0.39).
- Los alumnos creen que agrupar funciona mejor, incluso después de que su propio resultado muestre lo contrario.

**Solidez:** media-alta para distinguir categorías parecidas; debatida para textos expositivos.

**Fuentes:** src-brunmair-intercalado, src-firth-intercalado, src-kornell-intercalado-induccion, src-dunlosky-tecnicas-aprendizaje.

**Reglas:**

- **R-A4-1.** Exámenes, repasos y la comprobación de inicio de sesión mezclan ítems de varias lecciones; no se presentan en bloques por lección.
- **R-A4-2.** Para decisiones que exigen distinguir opciones (flujo programado, agente o varios agentes; API o MCP; qué modelo para qué tarea), cada manual incluye, después de la enseñanza inicial, una serie de 4–6 casos breves intercalados que obligan a elegir.
- **R-A4-3.** No se intercala en la primera exposición de un concepto ni dentro del texto expositivo.
- **R-A4-4.** La interfaz avisa que la práctica mezclada se siente más difícil y que eso es lo esperado.

#### A5. Efecto de reversión de la pericia (expertise reversal)

**Hallazgo.** Las ayudas que benefician a los novatos (ejemplos detallados, explicaciones extensas, indicaciones) pierden valor, o perjudican, a quien ya domina el tema.

- Un metaanálisis de 2025 (60 experimentos, 176 efectos) halló que con poco conocimiento previo se aprende mejor con mucha asistencia (d ≈ 0.51), y con mucho conocimiento previo, con poca (d ≈ −0.43 para la asistencia).
- El efecto es asimétrico: dar asistencia al novato pesa más que retirarla al experto. Además, depende de cómo se mida el conocimiento previo.
- El nivel puede estimarse con pruebas rápidas, por ejemplo pidiendo el primer paso de una solución. Esas pruebas correlacionaron hasta 0.92 con las tradicionales y tardaron entre 2.5 y 4.9 veces menos.
- En un estudio a lo largo de un curso, indicaciones útiles al principio se volvieron contraproducentes; retirarlas gradualmente resolvió el problema.

**Solidez:** alta para la existencia del efecto; media para medir el conocimiento previo con pocos ítems en adultos.

**Fuentes:** src-kalyuga-reversion-2003, src-kalyuga-reversion-2007, src-tetzlaff-metaanalisis-reversion, src-kalyuga-diagnostico-rapido, src-nuckles-desvanecer-indicaciones, src-salden-desvanecimiento-adaptativo.

**Reglas:**

- **R-A5-1.** La adaptación se decide por competencia y por desempeño observado (diagnóstico, comprobaciones, primer intento de examen). No se decide por el perfil declarado ni por preferencias.
- **R-A5-2.** Las lecciones con mucho andamiaje abren con una comprobación rápida opcional de 2 preguntas tipo "¿cuál es el primer paso?". Si acierta ambas con confianza media o alta, se sugiere la ruta corta: problema primero y ejemplo como consulta.
- **R-A5-3.** Las ayudas se pliegan; no se eliminan [inferencia: por la asimetría, negar ayuda a quien la necesita cuesta más que mostrarla de más].
- **R-A5-4.** Las indicaciones de autoexplicación y las plantillas se retiran a medida que mejora el desempeño en esa competencia.
- **R-A5-5.** En Git, lectura de código y APIs (base desigual), más ejemplos resueltos y preentrenamiento. En prompting y especificación, problema primero solo si el diagnóstico confirma el nivel [inferencia aplicada al perfil del plan §2].

#### A6. Carga cognitiva, segmentación y preentrenamiento

**Hallazgo.** La memoria de trabajo es muy limitada ante información nueva; los esquemas ya almacenados en la memoria de largo plazo eliminan esa limitación.

- El diseño debe reducir la carga ajena a la tarea (buscar entre textos separados, ruido) y dosificar la información con muchos elementos interrelacionados.
- Dividir el material en segmentos con sentido, a ritmo del alumno, tuvo efectos pequeños a medianos en retención y transferencia y bajó la carga percibida.
- El buen diseño importa más cuanto más complejo es el material.
- Debate abierto, "fracaso productivo": un metaanálisis halló ventaja moderada para resolver primero y recibir la instrucción después (g ≈ 0.36) en aprendizaje conceptual. No la halló para habilidades generales ni en alumnos pequeños. Otros autores sostienen que la guía mínima falla con novatos.

**Solidez:** alta para los principios de carga y la segmentación; debatida para el fracaso productivo frente a la instrucción explícita.

**Fuentes:** src-sweller-carga-cognitiva-20-anios, src-rey-segmentacion, src-noetel-multimedia-meta-meta, src-kirschner-guia-minima, src-sinha-fracaso-productivo, src-mayer-teoria-multimedia.

**Reglas:**

- **R-A6-1.** Un concepto nuevo por segmento, con un título que enuncia la idea. El alumno avanza a su ritmo; no hay reproducción automática.
- **R-A6-2.** Preentrenamiento: en lecciones técnicas, los términos y componentes (commit, rama, endpoint, token) se definen antes del procedimiento y enlazan al glosario.
- **R-A6-3.** La información relacionada va junta: el código y su explicación, adyacentes; nunca "ver la figura de la sección anterior".
- **R-A6-4.** "Resolver primero" se admite solo para conceptos (no para procedimientos de Git o APIs), siempre seguido de la explicación explícita del principio. Se marca como experimental en el piloto.

#### A7. Autoexplicación y elaboración

**Hallazgo.** Pedir al alumno que genere explicaciones (por qué funciona un paso, qué principio aplica) tuvo un efecto mediano en un metaanálisis de 69 efectos (g ≈ 0.55). En cambio, en el metaanálisis de ejemplos resueltos en matemáticas, añadir indicaciones de autoexplicación se asoció a efectos menores. Dunlosky y colegas calificaron la autoexplicación y la interrogación elaborativa como de utilidad moderada, por falta de evidencia en aulas.

**Solidez:** media; mixta cuando se combina con ejemplos resueltos.

**Fuentes:** src-bisra-autoexplicacion, src-barbieri-ejemplos-resueltos, src-atkinson-desvanecimiento, src-dunlosky-tecnicas-aprendizaje.

**Reglas:**

- **R-A7-1.** Como máximo, una pregunta de autoexplicación por caso resuelto, centrada en el principio ("¿qué criterio justifica este paso?") y con respuesta modelo para comparar.
- **R-A7-2.** El campo "¿Por qué elegiste esta respuesta?" (plan §17.2) se activa en alrededor de 1 de cada 4 preguntas, elegidas por su valor diagnóstico, no en todas [inferencia: para no alargar sesiones de 20–30 min].
- **R-A7-3.** En competencias ya dominadas, la autoexplicación es opcional y aparece plegada (ver A5).

#### A8. Principios multimedia, imágenes decorativas y detalles seductores

**Hallazgo.** La teoría del aprendizaje multimedia supone dos canales (verbal y visual), capacidad limitada y procesamiento activo, y de ella se derivan 15 principios con respaldo.

- Una revisión de revisiones (29 revisiones, 1,189 estudios) halló los mayores beneficios en contigüidad espacial y temporal y en señalización. Halló beneficios robustos, entre otros, en coherencia (quitar lo irrelevante), segmentación y personalización.
- Integrar texto y gráfico tuvo g ≈ 0.63; señalizar, d ≈ 0.38.
- Los "detalles seductores" (información interesante pero irrelevante, en texto o en imagen) perjudican, con efectos pequeños a medianos en retención y medianos en transferencia. El ritmo y el tipo de imagen moderan el efecto.
- Las imágenes puramente decorativas reciben poca atención, mejoran el ánimo y bajan la dificultad percibida, sin efecto neto en el aprendizaje. Pero redujeron el beneficio de las imágenes instructivas, sobre todo en alumnos con poco conocimiento previo.
- El "diseño emocional" de los propios gráficos instructivos (colores agradables, rasgos antropomórficos) mostró efectos positivos pequeños.
- Excepciones: en formación en software (Excel y Word), un estudio no halló daño en el reconocimiento e incluso mejor transferencia. Otro, reciente, atenuó el daño marcando los detalles como temáticamente aparte. Ambos necesitan réplica.

**Solidez:** alta para coherencia, contigüidad, señalización y segmentación; media para imágenes decorativas y diseño emocional; preliminar para la atenuación con señales.

**Fuentes:** src-mayer-teoria-multimedia, src-noetel-multimedia-meta-meta, src-schroeder-contiguidad, src-alpizar-senalizacion, src-rey-detalles-seductores, src-sundararajan-detalles-seductores, src-lenzner-imagenes-decorativas, src-brom-diseno-emocional, src-towler-detalles-software, src-wesenberg-senales-detalles.

**Reglas:**

- **R-A8-1.** Toda imagen en el cuerpo de la lección es instructiva: representa algo concreto, organiza relaciones (estructura) o explica un proceso o una causa. Las decorativas, como las portadas generadas (plan §7), van solo en la portada del curso o en separadores, nunca entre un párrafo y el diagrama que lo explica.
- **R-A8-2.** No hay detalles seductores en el flujo de lectura: anécdotas, curiosidades e ilustraciones atractivas sin relación con el objetivo se eliminan. Si se conservan por motivación, van al final en un recuadro "Aparte", marcado como no evaluable.
- **R-A8-3.** Las etiquetas van dentro del diagrama, junto a cada parte, y el texto explicativo inmediatamente antes o después. En celular no debe hacer falta desplazarse para relacionar texto y figura.
- **R-A8-4.** Señalización: el elemento del diagrama que explica el párrafo se resalta (color o marcador) de forma coherente con el texto.
- **R-A8-5.** La imagen no repite el párrafo [inferencia: extensión del principio de redundancia a páginas estáticas].
- **R-A8-6.** Se acepta un diseño emocional moderado en los visuales instructivos (paleta agradable, formas amables), sin añadir personajes o escenas que no aporten información.

#### A9. Lectura en pantalla y en celular

**Hallazgo.** Dos metaanálisis hallaron menor comprensión al leer en pantalla que en papel. El efecto es pequeño (g ≈ −0.21 a −0.25), se concentra en textos expositivos y crece bajo presión de tiempo. Además, en pantalla los lectores juzgan peor cuánto entendieron (peor calibración).

**Solidez:** media-alta; el efecto es pequeño y hay pocos estudios específicos de celular.

**Fuentes:** src-delgado-papel-pantalla, src-clinton-papel-pantalla.

**Reglas:**

- **R-A9-1.** El celular se optimiza para repasos, comprobaciones y lecturas breves; para lecturas densas y laboratorios se recomienda el escritorio [inferencia].
- **R-A9-2.** No hay temporizadores en la lectura ni en las comprobaciones de práctica.
- **R-A9-3.** Como la sensación de "ya lo entendí" es menos fiable en pantalla, toda lectura cierra con recuperación (R-A1-1).

#### A10. "Estilos de aprendizaje": un mito que conviene evitar

**Hallazgo.** No hay evidencia adecuada de que enseñar en el formato preferido (visual, auditivo, etc.) mejore el aprendizaje, y varios estudios con un diseño apropiado contradicen esa hipótesis. Las personas sí expresan preferencias y tienen aptitudes distintas, pero ajustar la modalidad a la preferencia no mostró beneficio.

**Solidez:** alta en cuanto a la falta de evidencia para el ajuste por estilos.

**Fuentes:** src-pashler-estilos-aprendizaje.

**Reglas:**

- **R-A10-1.** El perfil (plan §17.1) puede guardar preferencias de formato por comodidad, pero la app no adapta la modalidad para "encajar un estilo". La adaptación se basa en conocimiento previo y desempeño (A5).
- **R-A10-2.** El término "estilos de aprendizaje" no se usa en el contenido ni en el diagnóstico.

### B. Objetivos observables y alineación objetivo → actividad → evaluación

**Hallazgo.** La alineación constructiva (Biggs) consiste en definir primero los resultados de aprendizaje y diseñar después actividades que hagan practicar exactamente esos resultados y tareas de evaluación que los midan.

- La taxonomía de Bloom revisada cruza el tipo de conocimiento (factual, conceptual, procedimental, metacognitivo) con el proceso cognitivo (recordar, comprender, aplicar, analizar, evaluar, crear). Su tabla permite comprobar que objetivo, actividad y evaluación caen en la misma celda.
- La propia revisión relaja la jerarquía estricta: las categorías pueden superponerse.
- Mager estableció que un objetivo útil describe una conducta observable, sus condiciones y su criterio de logro.
- Para opción múltiple, Butler recomienda que cada pregunta apunte al proceso cognitivo concreto del objetivo.
- Los Standards de evaluación exigen documentar la justificación de los puntos de corte.

**Solidez:** media. Es un consenso de diseño y la base de la validez de contenido, pero hay poca evidencia experimental directa de que alinear produzca más aprendizaje.

**Fuentes:** src-biggs-alineacion-constructiva, src-krathwohl-bloom-revisada, src-mager-objetivos, src-butler-mc-aprendizaje, src-aera-standards-2014.

**Reglas:**

- **R-B-1.** Formato del objetivo: "Dado [escenario o condición], Daniel [verbo observable] [objeto] [criterio]". Ejemplo: "Dado un diff de 30 líneas o menos con un error introducido, Daniel identifica la línea responsable y propone una prueba que lo detecte". No se usan como verbo principal: comprender, conocer, saber, entender, familiarizarse, apreciar.
- **R-B-2.** Cada objetivo lleva su etiqueta (tipo de conocimiento, proceso) de la tabla revisada. Cada ítem y cada práctica heredan la etiqueta del objetivo que miden.
- **R-B-3.** Cada manual tiene una matriz de alineación: objetivo → actividades (explicación, caso, práctica) → evidencias (comprobaciones, ítems del banco, criterios de rúbrica). Un objetivo sin evidencia, o una evidencia sin objetivo, es un defecto bloqueante (coincide con el plan §13).
- **R-B-4.** El tipo de evidencia corresponde al verbo. Elegir, identificar, juzgar o priorizar → opción múltiple de escenario. Redactar, diseñar, configurar o revisar → práctica con rúbrica. El examen de opción múltiple no certifica objetivos de producción; llamarlo "aprobación conceptual" (plan §5) es correcto y debe mantenerse así en la interfaz.
- **R-B-5.** Plano del examen por manual: al menos 2 ítems por objetivo evaluado en cada forma de 12, y al menos la mitad en los procesos aplicar, analizar o evaluar [inferencia].
- **R-B-6.** Bloom se usa como herramienta de diseño y revisión, no como escalera obligatoria: no se exige "recordar" antes de "aplicar".

### C. Ítems de opción múltiple

#### C1. Guías de redacción

**Hallazgo.** La revisión de Haladyna, Downing y Rodriguez (31 pautas contrastadas con 27 manuales y 27 estudios) y el manual del NBME coinciden en lo siguiente:

- un concepto importante por ítem;
- medir aplicación con material nuevo, no recuerdo literal;
- un enunciado que contenga la idea central, sin palabrería;
- una pregunta cerrada que pueda responderse sin ver las opciones (la regla de "tapar las opciones", *cover-the-options*);
- redacción positiva;
- opciones homogéneas, plausibles, de longitud similar y en orden lógico;
- evitar "todas las anteriores" y usar "ninguna de las anteriores" con mucha cautela;
- variar la posición de la respuesta correcta;
- construir los distractores con errores típicos de los alumnos.

El NBME clasifica los defectos en dos familias:

- **Dificultad irrelevante:** opciones largas o complicadas, datos numéricos inconsistentes, términos vagos, opciones no paralelas, opciones sin orden lógico, enunciados enrevesados o negativos.
- **Pistas para el examinado "astuto":** pistas gramaticales, opciones en pares exhaustivos, absolutos como "siempre" o "nunca", la correcta más larga o más específica, palabras compartidas entre el enunciado y la clave, y convergencia (la clave comparte más elementos con las demás opciones).

Butler concluye que las buenas prácticas para medir y para aprender coinciden: formatos simples, preguntas retadoras pero con éxito frecuente y foco en los procesos de los objetivos.

**Solidez:** media. Muchas pautas se basan en consenso; algunas tienen apoyo empírico directo, como el número de opciones y el daño de los formatos complejos.

**Fuentes:** src-haladyna-guias-mc, src-haladyna-desarrollo-items, src-nbme-redaccion-items, src-butler-mc-aprendizaje, src-gierl-distractores.

**Reglas** (se condensan en la checklist §3.2):

- **R-C1-1.** Cada ítem pasa la regla de tapar las opciones: con el escenario y la pregunta, un experto puede anticipar la respuesta.
- **R-C1-2.** Una pregunta cerrada y única. Nada de "¿Cuál de las siguientes es verdadera?" sin foco.
- **R-C1-3.** Sin negaciones en el enunciado. Si una es inevitable, va en negrita y en mayúsculas.
- **R-C1-4.** Prohibidos: "todas las anteriores", opciones combinadas ("A y C") y formatos de verdadero/falso múltiple. "Ninguna de las anteriores" no se usa en la V1.
- **R-C1-5.** Antes de aprobar un ítem se revisan los seis tipos de pista y los defectos de dificultad irrelevante del NBME.
- **R-C1-6.** El orden de las opciones es aleatorio en cada intento, salvo en opciones numéricas u ordinales, que llevan un orden lógico fijo (campo `fixed_order` en el esquema). En el banco, la posición de la clave se reparte de forma equilibrada.

#### C2. Número óptimo de opciones

**Hallazgo.** El metaanálisis de Rodriguez (80 años de investigación) concluye que tres opciones son óptimas: permiten más ítems por unidad de tiempo y mejor cobertura sin deteriorar la calidad psicométrica.

- En la práctica, la mayoría de los ítems de 4 o 5 opciones solo tienen 1 o 2 distractores que alguien elige. En 514 ítems de enfermería hubo una media de 1.54 distractores funcionales, y solo el 13.8 % tenía tres.
- En exámenes médicos de subespecialidad, la versión de 3 opciones tuvo discriminación y fiabilidad similares, fue algo más fácil en uno de los dos exámenes y redujo el tiempo por ítem.
- Contrapunto: si "distractor no funcional" se define ajustando por la dificultad del ítem, casi la mitad (47 %) de los ítems profesionales tenía 3–4 distractores funcionales.
- Para el aprendizaje, leer más opciones incorrectas aumenta el riesgo de adoptar una falsa (sugestión negativa). El feedback reduce ese riesgo.
- Las propias pautas de Haladyna piden tantas opciones eficaces como sea posible y señalan que tres suelen bastar.

**Solidez:** alta en que 3 opciones no empeoran la medición; media en cuál es el número óptimo para aprender con feedback.

**Fuentes:** src-rodriguez-tres-opciones, src-tarrant-distractores, src-chen-tres-cuatro-opciones, src-raymond-distractores, src-haladyna-guias-mc, src-roediger-consecuencias-mc, src-butler-feedback-mc.

**Reglas:**

- **R-C2-1.** Una sola respuesta correcta, o claramente la mejor, y 2–3 distractores. El esquema admite 3 o 4 opciones por ítem.
- **R-C2-2.** El cuarto distractor solo se añade si representa un tercer error real y distinto. Está prohibido el distractor de relleno.
- **R-C2-3.** Todo ítem con distractores, de práctica o de examen, muestra feedback correctivo, que contrarresta la sugestión negativa.

#### C3. Ítems de escenario y de juicio situacional

**Hallazgo.** Los tests de juicio situacional (un escenario y varias acciones posibles) tienen una validez útil para predecir el desempeño laboral (ρ ≈ 0.34) y correlacionan con la capacidad cognitiva.

- La instrucción importa. Preguntar cuál es la mejor acción (instrucción de conocimiento) mide más conocimiento y capacidad; preguntar qué haría uno normalmente mide más rasgos de personalidad.
- Como son heterogéneos, su consistencia interna suele ser baja (alfa medio ≈ 0.46 en 56 coeficientes) aunque su estabilidad test-retest sea aceptable. Por eso alfa no es un buen indicador de su calidad.
- Diseñarlos bien exige analizar el rol y contar con expertos. El NBME recomienda escenarios realistas, con detalles acordes al nivel del examinado y opciones breves.

**Solidez:** alta para la validez en selección de personal; media para el uso formativo y para este dominio.

**Fuentes:** src-mcdaniel-sjt-2001, src-mcdaniel-sjt-instrucciones, src-catano-fiabilidad-sjt, src-patterson-sjt-amee, src-nbme-redaccion-items.

**Reglas:**

- **R-C3-1.** Escenario y pregunta en formato de conocimiento: "¿Cuál es la mejor acción, el siguiente paso o la causa más probable?". Nunca "¿Qué harías normalmente?".
- **R-C3-2.** Escenario breve, con solo la información necesaria y un detalle que discrimine. Enunciado de 120 palabras o menos pensando en el celular, y opciones cortas [inferencia: la cifra es mía].
- **R-C3-3.** Las opciones son acciones plausibles que difieren en una consideración clave (verificación, permisos, costo, datos, reversibilidad). La clave se defiende con una regla explícita que el feedback cita.
- **R-C3-4.** Todo escenario usa el caso financiero ficticio u otro caso sintético.

#### C4. Distractores basados en errores reales y control de pistas

**Hallazgo.** Las guías recomiendan derivar los distractores de errores típicos de los alumnos y hacerlos plausibles. La revisión de Gierl y colegas señala que crear distractores es la parte menos estudiada y más difícil del oficio, y que su calidad se juzga con datos de respuesta. Las alternativas competitivas bien construidas obligan a recordar por qué cada opción es correcta o incorrecta.

**Solidez:** media.

**Fuentes:** src-haladyna-guias-mc, src-gierl-distractores, src-little-mc-exonerated, src-nbme-redaccion-items.

**Reglas:**

- **R-C4-1.** Cada distractor declara el error o la concepción errónea que modela (`misconception_id`). Ese ID sale de una lista por manual construida con errores observados en prácticas, en notas de Daniel y en los errores comunes que documenta la documentación oficial [inferencia sobre la fuente de los errores].
- **R-C4-2.** El feedback de cada distractor nombra ese error.
- **R-C4-3.** Un mismo `misconception_id` aparece en varios ítems, para poder detectar errores recurrentes (plan §17.8).

#### C5. Lo que no se puede hacer con un solo alumno

**Hallazgo.** La dificultad, la discriminación, el funcionamiento de los distractores y la fiabilidad (alfa, KR-20) se estiman sobre poblaciones de examinados. El análisis de ítems del NBME y los Standards presuponen grupos. Con una sola persona no se pueden calcular; la calidad depende del juicio experto y de la revisión independiente.

**Solidez:** alta como principio psicométrico; las salvaguardas siguientes son [inferencia].

**Fuentes:** src-nbme-redaccion-items, src-aera-standards-2014, src-raymond-distractores.

**Reglas:**

- **R-C5-1.** Codex revisa de forma independiente la clave y el feedback (plan: el autor nunca es el único revisor).
- **R-C5-2.** Prueba "sin enunciado": un revisor, o un LLM distinto del autor, intenta responder un conjunto de ítems viendo solo las opciones. Si acierta claramente por encima del azar, hay pistas que corregir [inferencia].
- **R-C5-3.** Al revisar resultados hay un botón "Reportar ambigüedad", que abre una propuesta editorial (plan §17.7) sin tocar la puntuación histórica.
- **R-C5-4.** La app no calcula ni muestra índices psicométricos de ítems o pruebas.

### D. Retroalimentación

**Hallazgo.** En promedio, el feedback mejora el aprendizaje (d ≈ 0.41 en 607 efectos; d ≈ 0.48 en una réplica de 2020 con 435 estudios), pero varía muchísimo.

- Más de un tercio de las intervenciones de feedback empeoró el desempeño, sobre todo cuando desviaban la atención de la tarea hacia la persona.
- Hattie y Timperley proponen que el feedback útil responde a tres preguntas (adónde voy, cómo voy, qué sigue) y actúa sobre la tarea, el proceso o la autorregulación. El feedback dirigido a la persona es el menos eficaz.
- En entornos digitales, el feedback elaborado (con explicación) superó claramente a indicar solo correcto o incorrecto (g 0.49 frente a 0.05) y a mostrar solo la respuesta correcta (0.32), sobre todo en aprendizajes de orden superior.
- Shute recomienda feedback centrado en la tarea, específico, en unidades manejables y que no evalúe a la persona.

**Sobre el momento del feedback:**

- En estudios aplicados con cuestionarios reales predominó la ventaja del inmediato; en experimentos de laboratorio, la del diferido.
- En un curso universitario de ingeniería, el feedback recibido una semana después mejoró la transferencia, aunque los alumnos preferían el inmediato.
- En opción múltiple, el feedback inmediato y el diferido aumentaron las respuestas correctas posteriores y redujeron la reaparición de distractores elegidos.
- Un error seguido de feedback correctivo es una oportunidad de aprendizaje, sobre todo si se cometió con mucha confianza.

**Solidez:** alta en que el feedback elaborado supera a la sola verificación y en el valor del feedback correctivo en opción múltiple; debatida en inmediato frente a diferido.

**Fuentes:** src-shute-feedback-formativo, src-hattie-poder-feedback, src-wisniewski-feedback-revisitado, src-kluger-intervenciones-feedback, src-vanderkleij-feedback-computadora, src-kulik-momento-feedback, src-butler-tipo-momento-feedback, src-mullet-feedback-diferido, src-butler-feedback-mc, src-metcalfe-aprender-errores.

**Reglas:**

- **R-D-1.** Nunca solo "correcto/incorrecto": siempre se muestra la respuesta correcta y por qué lo es.
- **R-D-2.** Feedback por opción. Para la elegida: qué error revela y por qué no es la mejor. Para la correcta: la regla o evidencia que la justifica. En ambos casos, un enlace al apartado.
- **R-D-3.** Centrado en la tarea y el proceso: sin elogios a la persona, sin comparaciones, sin emojis ni mensajes motivacionales.
- **R-D-4.** Breve: 2–4 frases por opción (unas 40–80 palabras) más el enlace [inferencia sobre la cifra; lo de "unidades manejables" es de Shute].
- **R-D-5.** Se responde, y se declara la confianza, antes de ver cualquier feedback o solución. Si se ve la solución sin responder, queda registrado así (plan §17.2).
- **R-D-6.** Momento: en práctica, inmediato; en examen, al final (como dice el plan). Además, la sesión siguiente vuelve a presentar las preguntas falladas como repaso diferido [inferencia: combina ambos beneficios].
- **R-D-7.** En prácticas abiertas, el feedback va por criterio de rúbrica: qué logró, qué falta y el siguiente paso concreto.

### E. Diagnóstico con pocos ítems, confianza y calibración

**Hallazgo (medición).**

- Los Standards de AERA/APA/NCME exigen que, si se interpretan subpuntajes o perfiles, se aporte evidencia de su fiabilidad y de que se distinguen entre sí. No basta con reportar la fiabilidad del total (Standards 1.14 y 2.3).
- Los subpuntajes rara vez aportan información más allá del total, salvo que sean fiables y poco correlacionados entre sí. Un promedio ponderado entre el subpuntaje y el total aporta valor con más frecuencia.
- Con 24 ítems repartidos entre 10 objetivos (2–3 por objetivo), obtener 2 de 3 es compatible, con un 95 % de confianza binomial, con un dominio real de entre ~21 % y ~94 % [inferencia: cálculo propio con el intervalo de Wilson, suponiendo ítems intercambiables].
- En ítems situacionales heterogéneos, alfa subestima la estabilidad y no sirve como indicador.
- A favor de un diagnóstico breve: una medición rápida bien diseñada puede bastar para decidir cuánto andamiaje dar. Además, responder preguntas antes de estudiar (pretest) puede mejorar el aprendizaje posterior si después se estudian las respuestas correctas.

**Hallazgo (confianza y calibración).**

- Los errores cometidos con mucha confianza se corrigen más tras el feedback que los de baja confianza (efecto de hipercorrección). El efecto persiste a la semana, pero cuando la corrección se olvida, son esos errores los que más reaparecen.
- Una parte del efecto podría deberse al conocimiento previo del dominio más que a la confianza misma.
- La sobreconfianza se asocia a dejar de estudiar antes de tiempo y a retener menos.
- Pedir juicios de aprendizaje no alteró el desempeño en promedio (g ≈ 0.05, no significativo), con excepciones en ciertas tareas de memoria.
- Hay varias medidas de calibración y cada una mide algo distinto (sesgo, precisión, discriminación); elegir una exige tener claro qué se quiere saber.
- La autoevaluación de las propias habilidades correlaciona solo moderadamente con el desempeño (r medio ≈ 0.29 en 22 metaanálisis). La autoevaluación de conocimientos se relaciona más con la motivación y la satisfacción que con lo aprendido.

**Solidez:** alta en los límites de los subpuntajes cortos, en la hipercorrección como fenómeno y en la validez solo moderada de la autoevaluación; media en el mecanismo de la hipercorrección y en el pretest con adultos profesionales; [inferencia] en los cálculos binomiales.

**Fuentes:** src-aera-standards-2014, src-sinharay-subpuntajes, src-catano-fiabilidad-sjt, src-kalyuga-diagnostico-rapido, src-pan-pretesting, src-butterfield-hipercorreccion, src-butler-hipercorreccion-semana, src-sitzman-conocimiento-previo, src-metcalfe-aprender-errores, src-dunlosky-sobreconfianza, src-double-reactividad-jol, src-schraw-medidas-monitoreo, src-zell-insight-habilidades, src-sitzmann-autoevaluacion-conocimiento.

**Reglas** (el detalle operativo está en la §4):

- **R-E-1.** Se reporta por bloques de competencia de al menos 4 ítems. Nunca por objetivo con 2–3 ítems ni por ítem suelto.
- **R-E-2.** Se muestran conteos ("3 de 4") y una etiqueta de señal. Nada de porcentajes con decimales ni de un nivel global.
- **R-E-3.** No se calcula ni se muestra alfa, KR-20 ni ninguna "fiabilidad" numérica (hay un solo alumno y los ítems son heterogéneos).
- **R-E-4.** En el diagnóstico y los exámenes se pide la confianza (baja / media / alta) con un solo toque, antes de ver el resultado. Es omitible.
- **R-E-5.** Un error con confianza alta pasa a prioridad de repaso: reaparece entre 1 y 7 días después y otra vez más adelante.
- **R-E-6.** Un acierto con confianza baja es evidencia débil y no cuenta para "fortaleza probable" sin otra evidencia [inferencia].
- **R-E-7.** La calibración se muestra solo de forma descriptiva: una tabla de confianza por resultado, con conteos. No se calculan índices hasta acumular al menos 30 respuestas con confianza declarada [inferencia sobre el umbral].
- **R-E-8.** Al terminar el diagnóstico se muestran las respuestas correctas y el feedback, para aprovechar el efecto pretest. En consecuencia, esos ítems quedan "expuestos" y no se reutilizan en exámenes.
- **R-E-9.** El perfil declarado no define la ruta. Se muestra junto a lo observado, y las discrepancias se presentan como información, no como juicio.

### F. Rúbricas para prácticas abiertas y autoevaluación

**Hallazgo (rúbricas).**

- Las rúbricas mejoran la consistencia de la puntuación, sobre todo si son analíticas, específicas de la tarea y van con ejemplos y entrenamiento de quien evalúa. Por sí solas no garantizan validez.
- Su uso formativo se asocia a mejor desempeño (g ≈ 0.45 tras corregir el sesgo de publicación, 21 estudios) y a efectos menores e inciertos en autorregulación y autoeficacia.
- Una rúbrica auténtica combina criterios pertinentes con descripciones de calidad por nivel. Las que cuentan elementos o usan lenguaje de escala ("excelente", "bueno") sirven más para calificar que para aprender.

**Hallazgo (autoevaluación).**

- La autoevaluación es imperfecta: la gente tiende a sobrestimarse, sobre todo en tareas complejas o poco familiares.
- Coincide más con la evaluación externa en cursos avanzados y en estudios mejor diseñados.
- Aun así, practicarla mejora la autorregulación y la autoeficacia (cuatro metaanálisis, efectos de 0.23 a 0.73).
- La investigación reciente recomienda tratarla como un proceso formativo y no como una medida sumativa.

**Solidez:** alta en los sesgos de la autoevaluación y en la consistencia que aportan las rúbricas analíticas; media en el efecto de las rúbricas sobre el aprendizaje.

**Fuentes:** src-jonsson-rubricas, src-panadero-rubricas-formativas, src-panadero-metaanalisis-rubricas, src-brookhart-criterios-rubricas, src-dunning-autoevaluacion-defectuosa, src-falchikov-autoevaluacion, src-zell-insight-habilidades, src-sitzmann-autoevaluacion-conocimiento, src-panadero-autoevaluacion-srl, src-andrade-autoevaluacion.

**Reglas:**

- **R-F-1.** Rúbrica analítica y específica de cada práctica: 3–5 criterios con 3–4 niveles. Cada nivel describe qué se ve en la entrega, sin conteos ni adjetivos como "bueno" o "excelente".
- **R-F-2.** Hay un ejemplo anclado (sintético) como mínimo para el nivel "logrado" y otro para "insuficiente".
- **R-F-3.** Hay criterios críticos que no se compensan con otros (por ejemplo, "usa solo datos sintéticos" o "incluye evidencia de verificación"). Si uno falla, la práctica no se marca como lograda aunque el resto puntúe alto.
- **R-F-4.** La rúbrica se muestra antes de empezar la práctica.
- **R-F-5.** La autoevaluación se hace por criterio, citando la evidencia, y antes de pedir la evaluación externa. Se guardan ambas y su diferencia se muestra como dato de calibración.
- **R-F-6.** Una autoevaluación nunca cuenta como evidencia de dominio (coincide con el plan §5).
- **R-F-7.** Si se quiere un juicio holístico, se deriva de la rúbrica analítica como resumen; no se pide por separado.

### G. Criterios de dominio y reintentos con ítems equivalentes

**Hallazgo.**

- Los programas de aprendizaje para el dominio (mastery learning) mostraron efectos positivos en los exámenes, mayores en los alumnos más débiles. Pero aumentan el tiempo de instrucción y, cuando son autodirigidos, reducen la tasa de finalización en cursos universitarios.
- Una síntesis crítica no encontró efectos en pruebas estandarizadas, y solo efectos moderados y poco duraderos en las pruebas creadas por los propios investigadores.
- Sus elementos centrales son una evaluación diagnóstica previa, evaluaciones formativas frecuentes y actividades de corrección y de ampliación.
- En sistemas adaptativos, qué datos se usan y dónde se pone el umbral pesan más que el modelo estadístico; un promedio móvil exponencial simple funciona bien.
- Repetir el mismo test eleva el puntaje más que usar formas alternativas, y practicar con ciertas preguntas mejora el resultado en esas preguntas, pero no necesariamente en otras relacionadas.
- Problemas con la misma estructura (isomorfos) pueden diferir mucho en dificultad.

**Solidez:** media para el mastery learning, con debate sobre su magnitud; alta para la inflación por repetir ítems idénticos; [inferencia] en los umbrales concretos.

**Fuentes:** src-kulik-aprendizaje-dominio, src-slavin-aprendizaje-dominio, src-guskey-aprendizaje-dominio, src-pelanek-criterios-dominio-2017, src-pelanek-criterios-dominio-2018, src-hausknecht-reevaluacion, src-wooldridge-testing-autentico, src-pan-transferencia-testing, src-kotovsky-isomorfos, src-rawson-cuanto-basta.

**Reglas:**

- **R-G-1.** Aprobación conceptual: 10/12 o más, y ningún objetivo del manual con todos sus ítems fallados en ese intento.
- **R-G-2.** Siempre se muestra el resultado del primer intento y en qué intento se aprobó.
- **R-G-3.** Antes de reintentar hay que completar el repaso de las secciones enlazadas a los ítems fallados y sus preguntas de práctica. El reintento se habilita al día siguiente, no el mismo día [inferencia apoyada en el espaciado y en las actividades de corrección].
- **R-G-4.** Forma del reintento: para cada "slot" (objetivo × proceso) se usa una variante no vista. Los slots fallados cambian de variante obligatoriamente, y ningún ítem idéntico se repite antes de 30 días [inferencia].
- **R-G-5.** Indicador opcional "retención comprobada": al menos 7 días después de aprobar, 6 ítems de variantes no usadas, con 5/6 o más. No revoca el aprobado y se informa por separado [inferencia].
- **R-G-6.** Nunca se bloquea el acceso a la lectura por no aprobar (plan §5; en los programas autodirigidos de dominio se observó menor finalización).
- **R-G-7.** Equivalencia de variantes: comparten la especificación de la familia (objetivo, proceso, tipo de escenario, pasos de razonamiento y errores modelados) y las revisa un segundo agente. La equivalencia se declara supuesta, no demostrada. Cada intento registra qué variantes usó, para que la comparación entre intentos sea interpretable (plan §17.8).

### H. Evaluación asistida por LLM de respuestas abiertas

**Hallazgo.**

- Los modelos fuertes se acercan a las preferencias humanas en algunos escenarios: más de 80 % de acuerdo al comparar respuestas de chat, un nivel similar al acuerdo entre personas. Su feedback sobre redacción escolar fue algo inferior al de evaluadores humanos entrenados, pero útil en la práctica.
- El acuerdo con humanos varía mucho según la tarea y el atributo evaluado (20 conjuntos de datos, 11 modelos).
- En un escenario sencillo, solo los modelos más grandes lograron un acuerdo razonable, aún lejos del acuerdo entre humanos, con tendencia a la indulgencia y sensibilidad a la longitud y complejidad del prompt.

Sesgos documentados:

- **Posición:** cambiar el orden de dos respuestas cambia el veredicto.
- **Verbosidad:** se favorecen las respuestas largas.
- **Autopreferencia:** el modelo puntúa mejor los textos propios, y el sesgo crece con su capacidad de reconocerlos.
- **Complacencia:** el modelo se inclina hacia las opiniones del usuario.
- **Frases adversarias:** ciertas frases inflan los puntajes, más en la puntuación absoluta que en la comparativa.

En evaluación educativa, dos revisiones (49 estudios de 2018–2024 y una revisión transversal de 2025) reportan desde acuerdos altos hasta bajos según el contexto, con riesgos de sesgo, inconsistencia, alucinación y poca explicabilidad. Ambas exigen supervisión humana. La fiabilidad de un mismo modelo consigo mismo fluctuó entre ocasiones. Tres mitigaciones probadas: pedir evidencia antes del puntaje, promediar presentando las respuestas en órdenes alternos y derivar a una persona los casos de desacuerdo.

**Solidez:** media para los sesgos, bien replicados al evaluar modelos; preliminar para su aplicación a evaluar el aprendizaje de un adulto en este dominio. **Volatilidad alta:** los modelos cambian cada pocos meses.

**Fuentes:** src-zheng-llm-juez, src-wang-llm-no-justos, src-panickssery-autopreferencia, src-thakur-juzgar-jueces, src-bavaresco-judge-bench, src-raina-ataques-juez, src-sharma-complacencia, src-gu-survey-llm-juez, src-chiang-llm-evaluacion, src-emirtekin-evaluacion-automatizada, src-eneye-calificacion-llm, src-pack-llm-ensayos, src-steiss-feedback-chatgpt, src-kortemeyer-respuestas-cortas.

**Reglas** (para el HTML de la §17 y la instrucción de la §17.5):

- **R-H-1.** Evidencia antes que juicio: la instrucción pide, para cada criterio, citar el ID y un fragmento de la respuesta antes de asignar un nivel. Sin evidencia citada no hay nivel.
- **R-H-2.** Cada práctica abierta viaja con su rúbrica analítica, su ejemplo anclado y, si aplica, una respuesta modelo.
- **R-H-3.** "Evidencia insuficiente" es un resultado válido y explícito, por criterio y por competencia.
- **R-H-4.** La rúbrica declara que la extensión no suma puntos. Si la concisión forma parte del objetivo, es un criterio.
- **R-H-5.** En comparaciones antes/después, cada versión se evalúa por separado contra la rúbrica, o se presentan ambos órdenes.
- **R-H-6.** Si una respuesta se elaboró con ayuda de un modelo, se declara (plan §17.2) y se prefiere un evaluador de otra familia. El registro guarda el modelo evaluador y la fecha.
- **R-H-7.** Contra la complacencia: el reporte presenta primero la evidencia y pide puntuar antes de leer la autoevaluación, que se compara después. Se evitan formulaciones que sugieran el resultado esperado [inferencia].
- **R-H-8.** Las decisiones que cambian estados (por ejemplo, "dominio revisado") requieren dos evaluaciones independientes (dos corridas o dos modelos) sin discrepancias de más de un nivel en ningún criterio. Si discrepan, queda "revisión pendiente" [inferencia].
- **R-H-9.** El texto del alumno se trata como dato: escapado y delimitado (plan §17.4). Además, el reporte resalta los fragmentos con forma de instrucción dirigida al evaluador, para que sean visibles [inferencia].
- **R-H-10.** Control de deriva: cada 3–5 reportes, Daniel revisa uno o dos juicios del LLM contra la rúbrica, o se incluye una respuesta ancla de calidad conocida. Se registra el grado de acuerdo [inferencia].
- **R-H-11.** El feedback del LLM nunca cambia las puntuaciones oficiales (plan §17.6) y se etiqueta como "evaluación asistida externa".

---

## 3. Checklist propuesta para el estándar de contenido

Cada punto debe poder verificarlo un revisor. Entre paréntesis, la regla de origen.

### 3.1 Lección

- [ ] Uno a tres objetivos con el formato "Dado…, Daniel [verbo observable]… [criterio]", sin verbos vagos (R-B-1).
- [ ] Cada objetivo lleva su etiqueta (conocimiento, proceso) y aparece en la matriz de alineación con al menos una pregunta de comprobación, al menos dos ítems de banco y, si el verbo es de producción, una práctica con rúbrica (R-B-2 a R-B-4).
- [ ] Duración estimada de 25 minutos o menos, incluida la comprobación; segmentos con títulos que enuncian la idea y un concepto nuevo por segmento (R-A6-1).
- [ ] Desde la segunda lección del manual, abre con 1–2 preguntas de repaso de lecciones anteriores (R-A2-1).
- [ ] En lecciones técnicas, los términos clave se definen antes del procedimiento y enlazan al glosario (R-A6-2).
- [ ] Hay un caso resuelto con pasos, decisiones, razones y evidencia de verificación, seguido de un ejemplo para completar y de un problema o práctica (R-A3-1, R-A3-2).
- [ ] Hay como máximo una pregunta de autoexplicación por caso resuelto, centrada en el principio y con respuesta modelo (R-A7-1).
- [ ] La comprobación final tiene 3–5 preguntas con el texto plegado, al menos una de aplicación a un escenario nuevo, y feedback elaborado después de responder (R-A1-1, R-A1-2, R-D-1).
- [ ] Si el manual enseña conceptos fáciles de confundir, hay al menos una pregunta de contraste (R-A4-2).
- [ ] En competencias con base desigual, hay una comprobación rápida inicial opcional y las ayudas se pliegan en vez de eliminarse (R-A5-2, R-A5-3).
- [ ] No hay detalles seductores en el flujo; lo "interesante" va en un recuadro "Aparte" no evaluable (R-A8-2).
- [ ] Se usa un registro conversacional en segunda persona, con términos en inglés cuando ayuden a reconocer la interfaz (plan §2).
- [ ] El resumen de consulta va después de la comprobación (R-A1-5).
- [ ] Las afirmaciones técnicas volátiles llevan fuente y fecha (AGENTS.md).
- [ ] No contiene adaptaciones por "estilos de aprendizaje" (R-A10-1).
- [ ] Es legible a 360 px, sin temporizadores (R-A9-2).

### 3.2 Pregunta de opción múltiple

- [ ] Declara un `objective_id`, un proceso de la taxonomía revisada y la familia/variante a la que pertenece (R-B-2, R-G-7).
- [ ] Mide un concepto importante con un escenario nuevo, no un recuerdo literal ni una curiosidad (R-C1-1; plan §5).
- [ ] El escenario contiene solo la información necesaria, y el enunciado tiene unas 120 palabras o menos (R-C3-2).
- [ ] La pregunta es cerrada y en formato de conocimiento ("mejor acción", "siguiente paso", "causa más probable") (R-C1-2, R-C3-1).
- [ ] Pasa la regla de tapar las opciones (R-C1-1).
- [ ] Está redactada en positivo, sin negaciones o, si son inevitables, con ellas destacadas (R-C1-3).
- [ ] Tiene 3 o 4 opciones, con una sola correcta o claramente la mejor, y la clave la revisó alguien distinto del autor (R-C2-1, R-C5-1).
- [ ] Cada distractor tiene un `misconception_id` real; no hay distractores de relleno (R-C2-2, R-C4-1).
- [ ] Las opciones son homogéneas en contenido, gramática y longitud, y la correcta no es la más larga ni la más específica (R-C1-5).
- [ ] No tiene "todas/ninguna de las anteriores", combinaciones, absolutos que delaten la respuesta, palabras repetidas entre enunciado y clave, convergencia ni pares exhaustivos (R-C1-4, R-C1-5).
- [ ] El orden de las opciones es aleatorio, salvo las numéricas u ordinales, que llevan `fixed_order` (R-C1-6).
- [ ] El feedback es por opción: el error que revela cada distractor, la regla que justifica la clave y un enlace al apartado, en 2–4 frases y centrado en la tarea (R-D-2 a R-D-4).
- [ ] Es independiente: ningún otro ítem del mismo examen le da la respuesta.
- [ ] Pasó la prueba "sin enunciado" de pistas (R-C5-2).
- [ ] Usa datos sintéticos, sin referencias a HPE (AGENTS.md).
- [ ] Tiene versión y fecha; cambiar la clave crea una versión nueva (plan §8).
- [ ] Indica su uso: diagnóstico, práctica o examen. Los ítems de examen no se usan en práctica (R-A1-6, R-E-8).

### 3.3 Práctica o laboratorio

- [ ] Cubre uno o más objetivos de producción (redactar, revisar, configurar, evaluar) que la opción múltiple no cubre (R-B-4).
- [ ] Declara entradas, entregable, criterios de éxito y evidencias requeridas antes de empezar (plan §5; R-F-4).
- [ ] Tiene una rúbrica analítica de 3–5 criterios con 3–4 niveles y descriptores de calidad observables (R-F-1).
- [ ] Marca los criterios críticos que no se compensan (R-F-3).
- [ ] Incluye un ejemplo anclado "logrado" y otro "insuficiente", ambos sintéticos (R-F-2).
- [ ] Ofrece andamiaje graduado: plantilla o ejemplo parcial para novatos y versión sin andamiaje para quien demostró dominio (R-A3-3, R-A5-4).
- [ ] Pide una autoevaluación por criterio, citando la evidencia, antes del feedback externo (R-F-5).
- [ ] Prepara la revisión externa con las salvaguardas de LLM: rúbrica, evidencia citada, "evidencia insuficiente" y doble evaluación si cambia el estado (R-H-1 a R-H-8).
- [ ] Usa datos pequeños e inspeccionables del caso financiero ficticio e incluye un ejercicio de transferencia a un segundo caso (plan §5).
- [ ] Los estados son: presentada, autoevaluada y revisada (con revisor identificado). Una autoevaluación nunca figura como revisión (R-F-6; plan §5).
- [ ] El reintento se hace sobre una variante o un caso nuevo; reenviar la misma entrega no cuenta como evidencia de transferencia (R-G-4).

### 3.4 Imagen o visual

- [ ] Declara su función: representar, organizar o explicar. Las decorativas solo van en la portada o en separadores (R-A8-1).
- [ ] Responde a una pregunta del texto adyacente; no hay imágenes "porque sí".
- [ ] Las etiquetas van dentro del visual, junto a cada parte, y el texto que lo explica va inmediatamente antes o después (R-A8-3).
- [ ] El elemento clave está señalizado de forma coherente con el texto (R-A8-4).
- [ ] Los diagramas exactos (arquitectura, flujos, cifras) se hacen en SVG o código, no con un generador de imágenes (AGENTS.md; R-A8-1).
- [ ] No tiene elementos seductores: personajes, escenas o metáforas sin información (R-A8-2).
- [ ] No duplica el párrafo dentro de la imagen (R-A8-5).
- [ ] El texto alternativo describe la información o la relación que muestra el visual, no su apariencia.
- [ ] Es legible a 360 px (o tiene una versión simplificada) y no depende solo del color.
- [ ] Tiene un peso razonable y carga diferida (plan §13).
- [ ] Cualquier diseño emocional (paleta, formas) es moderado y no añade contenido irrelevante (R-A8-6).

---

## 4. Diagnóstico (24 preguntas + 2 microtareas) y su reporte

### 4.1 Propósito que se debe declarar

El diagnóstico es una **ruta inicial de baja consecuencia**: decide por dónde empezar y cuánto andamiaje mostrar en cada bloque. No certifica, no bloquea y se corrige con cada comprobación de lección y cada primer intento de examen. Este propósito debe aparecer en la pantalla de inicio y en el reporte (Standards: la interpretación debe corresponder al uso).

### 4.2 Estructura propuesta [inferencia]

Con 24 ítems, repartirlos entre 10 objetivos (2–3 por objetivo) no permite distinguir competencias. Propongo **6 bloques de 4 ítems**. El mapa definitivo de competencias es una decisión de la Fase 0:

| Bloque | Objetivos del plan §2 | Manuales | Ítems | Microtarea |
| --- | --- | --- | --- | --- |
| B1 Herramientas, modelos y límites | 1 | M01 | 4 | — |
| B2 Especificación y prompting | 2 | M02 | 4 | Mejorar una instrucción |
| B3 Contexto y conocimiento | 3 | M03 | 4 | — |
| B4 Código, Git y dirección de agentes de código | 4, 5 | M04–M05 | 4 | Revisar un cambio |
| B5 Datos, arquitectura e integraciones | 6, 7 | M06–M07 | 4 | — |
| B6 Agentes, evaluación y control | 8, 9 | M08–M09 | 4 | — |

El objetivo 10 (M10, integrador) no se diagnostica: es producto de los demás.

En cada bloque, 2 ítems son **de base** (fundamentos que un novato necesita) y 2 **de juicio avanzado**. Los 24 se presentan intercalados, no por bloques (R-A4-1).

### 4.3 Diseño de los ítems y de la sesión

- Ítems de escenario con instrucción de conocimiento, 3–4 opciones y distractores tomados de errores típicos (C1–C4).
- Confianza en cada ítem: baja / media / alta (R-E-4).
- Sin feedback ítem a ítem durante el diagnóstico, para no contaminar las respuestas siguientes. Al terminar se muestran las respuestas correctas y el feedback, para aprovechar el efecto pretest (R-E-8) [inferencia sobre el orden].
- Dos sesiones, para respetar los 20–30 min: los 24 ítems (~25 min) en una y las 2 microtareas (~10 min cada una) en otra [inferencia sobre los tiempos].
- Los ítems del diagnóstico quedan marcados como expuestos y no entran en exámenes (R-E-8).
- Si hace falta repetir el diagnóstico, se hace con variantes, no con los mismos ítems.

### 4.4 Microtareas

- **Microtarea 1 (B2):** mejorar una instrucción dada para un caso financiero sintético.
- **Microtarea 2 (B4):** revisar un diff pequeño con un problema introducido. Antes de la revisión completa, pedir "¿qué revisarías primero y por qué?", que funciona como medición rápida del primer paso (src-kalyuga-diagnostico-rapido).
- Rúbrica analítica de 3–4 criterios con 3 niveles y un criterio crítico. Por ejemplo, en la microtarea 2: identifica el problema real, propone cómo verificarlo, no aprueba un cambio sin evidencia.
- Primero la autoevaluación por criterio; después la evaluación externa con las salvaguardas de la §H.
- Su valor es complementario: muestran **producción**, mientras que los ítems muestran **reconocimiento y juicio**. Con 2 observaciones no definen una competencia por sí solas.

### 4.5 Reglas de clasificación por bloque [inferencia]

| Señal | Regla (todas las condiciones) | Recomendación de ruta |
| --- | --- | --- |
| **Fortaleza probable** | 3/4 o más, con los 2 ítems avanzados correctos, sin errores de confianza alta y, si hay microtarea, con todos los criterios críticos al menos en nivel 2 | Ruta corta: comprobación rápida al inicio de cada lección; problema primero, ejemplo como consulta |
| **Repaso recomendado** | 1/4 o menos, **o** los 2 ítems de base fallados, **o** al menos un error con confianza alta en un ítem de base | Repasos breves de fundamentos, opcionales, antes del manual; más andamiaje |
| **Sin señal clara** | Cualquier otro caso | Ruta estándar |

**Por qué estas reglas son asimétricas.** Según un modelo binomial simplificado, con 4 ítems:

- alguien con un dominio real del 50 % obtiene 3/4 o más el 31 % de las veces;
- alguien con un dominio real del 80 % obtiene 1/4 o menos solo el 3 % de las veces.

[inferencia: cálculo propio]

La etiqueta "fortaleza" saldrá equivocada con relativa frecuencia. Ese error es barato si las comprobaciones rápidas de cada lección lo corrigen. La etiqueta "repaso" casi nunca castiga a alguien fuerte. Por eso "fortaleza" exige condiciones adicionales y nunca oculta contenido.

### 4.6 Qué afirmar y qué no en el reporte

| Se puede afirmar | No se puede afirmar |
| --- | --- |
| "En B4 respondiste 1 de 4; fallaste los 2 de base y uno con confianza alta (IDs…)" | "Tu nivel de Git es bajo" o "eres principiante" |
| "Con 4 preguntas, la estimación es muy imprecisa: 3/4 es compatible con un dominio real de ~30 % a ~95 %" | Porcentajes de dominio por competencia, percentiles o un nivel global |
| "Señal de repaso en B4, basada en las preguntas X, Y y Z" | Que una competencia está "dominada" o "certificada" |
| "Errores con confianza alta: 3 (lista). Son prioritarios porque suelen corregirse bien con feedback, pero tienden a reaparecer" | Un índice de calibración o la conclusión de que el alumno "sobrestima sus capacidades", con 24 respuestas |
| "Lo que declaraste en tu perfil y lo observado coinciden en B2 y difieren en B5" | Que el perfil declarado es falso, o diagnósticos personales |
| "La microtarea 2 muestra producción: cumple 2 de 3 criterios; falta evidencia de verificación" | Capacidad de transferir a proyectos reales, velocidad de trabajo o desempeño en el entorno real (Git, terminal), que no se observaron |
| "Este resultado se actualizará con tus comprobaciones y primeros intentos de examen" | Que un resultado bajo predice dificultad para aprender el tema |
| "El diagnóstico no midió M10 ni competencias fuera de los bloques" | Cobertura total del currículo |

### 4.7 Texto modelo para el reporte (resumen)

> **Diagnóstico inicial — 2026-MM-DD (versión de contenido X).** Respondiste 24 preguntas y 2 microtareas. Con 4 preguntas por bloque, los resultados son **señales para elegir la ruta, no niveles**. B2 y B6: señal de fortaleza probable (ruta corta disponible). B4: repaso recomendado, porque fallaste las 2 preguntas de base (IDs) y una con confianza alta. B1, B3 y B5: sin señal clara (ruta estándar). Las respuestas correctas y su explicación ya están disponibles; esas preguntas no volverán a aparecer en los exámenes. Tu ruta se ajustará con las comprobaciones de cada lección.

### 4.8 Actualización posterior [inferencia]

La señal de cada bloque se actualiza con las comprobaciones de lección y los primeros intentos de examen; por ejemplo, con un promedio móvil exponencial por competencia (src-pelanek-criterios-dominio-2018). En el reporte de evaluación (§17), el diagnóstico aparece como la evidencia más antigua y menos precisa.

---

## 5. Revisión crítica de lo que el plan ya decide (§5)

### 5.1 Precisión del umbral 10/12 [inferencia: modelo binomial simplificado, ítems de igual dificultad e independientes]

| Dominio real (probabilidad de acierto por ítem) | P(aprobar ≥10/12 en un intento) | P(aprobar en ≤3 intentos) | P(≥10/12 y después ≥5/6 en la comprobación diferida) |
| --- | --- | --- | --- |
| 0.60 | 0.08 | 0.23 | 0.02 |
| 0.70 | 0.25 | 0.58 | 0.11 |
| 0.75 | 0.39 | — | — |
| 0.80 | 0.56 | 0.91 | 0.37 |
| 0.85 | 0.74 | — | — |
| 0.90 | 0.89 | — | 0.79 |
| 0.95 | 0.98 | — | — |

Adivinar al azar no es un riesgo: la probabilidad de aprobar así es menor de 0.001, tanto con 3 como con 4 opciones. El riesgo real es el **conocimiento parcial combinado con reintentos**: con 3 intentos, alguien con un 70 % de dominio aprueba el 58 % de las veces.

### 5.2 Decisión por decisión

| Decisión del plan | Qué respalda la evidencia | Ajuste propuesto | Argumento |
| --- | --- | --- | --- |
| **Diagnóstico de 24 preguntas situacionales y 2 microtareas, reporte por competencia, sin nivel único y sin bloquear** | Evitar un nivel único y no bloquear: muy bien respaldado (Standards; reversión de la pericia; validez de los tests de juicio situacional) | Reportar por **6 bloques de 4 ítems**, no por 10 objetivos. Usar conteos e incertidumbre explícita. Pedir confianza en cada ítem. Hacerlo en dos sesiones. Marcar los ítems como expuestos | Los subpuntajes de 2–3 ítems no tienen la precisión que exigen los Standards 1.14 y 2.3 (§4) |
| **Banco inicial de 20–24 preguntas por manual** | La evidencia sobre repetición indica que reutilizar ítems infla el puntaje sin asegurar transferencia | **36 ítems por manual, en 12 familias (slots) × 3 variantes.** Comprobaciones y práctica, con preguntas propias distintas del banco de examen. Mínimo aceptable si el costo es alto: 24 ítems en dos formas disjuntas de 12, sin uso en práctica | 12 por examen más un reintento ya agotan 24. La práctica con ítems de examen convierte el examen en una prueba de memoria de esos ítems (Hausknecht; Wooldridge) |
| **Examen de 12 con cobertura de objetivos** | Coherente con la alineación y con un plano de examen | Mantener 12 y exigir al menos 2 ítems por objetivo evaluado. Alternativa: 15 ítems de 3 opciones en el mismo tiempo, para ganar precisión [inferencia] | Con 3 opciones caben más ítems por unidad de tiempo (Rodriguez; Chen) |
| **Aprobación con 10/12 (83.3 %)** | Un umbral de 80–90 % es habitual en mastery learning, y el plan documenta su justificación, como pide el Standard 5.21 | Mantener 10/12 y añadir: (a) ningún objetivo con todos sus ítems fallados; (b) primer intento siempre visible; (c) reintento al día siguiente y tras el repaso de corrección; (d) indicador opcional de retención a 7 o más días (5/6 en variantes nuevas), sin crear un estado bloqueante | Con 12 ítems el umbral es ruidoso (tabla 5.1) y los reintentos lo inflan. Combinar el aprobado con una comprobación diferida separa mejor el 70 % del 90 % (0.11 frente a 0.79) y aprovecha el espaciado |
| **Cuatro opciones y una correcta por pregunta** | "Una correcta": respaldado. "Cuatro fijas": la evidencia favorece 3 cuando no hay un tercer distractor real | **3 o 4 opciones** según los errores reales disponibles; prohibir el relleno. El esquema admite un número variable | Los distractores de relleno no miden nada y añaden lectura. Además, más distractores implica más exposición a respuestas falsas (Roediger y Marsh) |
| **Distractores plausibles, sin pistas gramaticales ni trivia** | Muy bien respaldado (Haladyna; NBME) | Añadir `misconception_id` por distractor, la lista completa de pistas del NBME y la prueba "sin enunciado" | Con un solo alumno no hay análisis de ítems: hay que prevenir los defectos, porque no se podrán detectar después (C5) |
| **Feedback por alternativa y enlace al apartado** | Muy bien respaldado: el feedback elaborado supera a la verificación sola, y el correctivo reduce la reaparición de distractores | Añadir reglas de contenido: siempre la clave y su porqué, el error que revela cada distractor, 2–4 frases y centrado en la tarea | Más de un tercio de las intervenciones de feedback empeora el desempeño si apunta a la persona (Kluger y DeNisi) |
| **Corrección al final en el examen y feedback inmediato en práctica** | Compatible con la evidencia, que es mixta sobre el momento | Mantener y añadir el repaso diferido de los errores en la sesión siguiente | El feedback diferido favoreció la transferencia en un curso real, y el espaciado de la recuperación tiene un efecto grande |
| **Reintentos con selección y escenarios equivalentes, no solo opciones reordenadas** | Respaldado: las formas idénticas inflan el puntaje y la práctica con los mismos ítems no transfiere a ítems relacionados | Especificar la familia de cada variante. Los slots fallados cambian de variante. Registrar la variante usada. Declarar la equivalencia como supuesta | Los problemas isomorfos pueden diferir mucho en dificultad (Kotovsky), y con n = 1 no se puede equiparar estadísticamente |
| **Opción elegida guardada por ID estable** | Correcto técnicamente | Añadir `fixed_order` para opciones numéricas u ordinales y equilibrar la posición de la clave | El NBME pide orden lógico; Haladyna, variar la posición de la clave |
| **Confianza opcional (§17.2)** | Respaldado: hipercorrección y prácticamente nula reactividad de los juicios de aprendizaje | Mostrarla por defecto (un toque, omitible) en el diagnóstico y los exámenes, y reprogramar los errores de confianza alta | Los errores de confianza alta son los más corregibles, pero también los que reaparecen si se olvida la corrección |
| **No generar preguntas nuevas en vivo en la V1** | Coherente con el control de calidad | Mantener. Cualquier ítem generado con IA pasa por la checklist §3.2 y la revisión cruzada [inferencia] | Sin datos de respuesta, la revisión previa es el único filtro de calidad |
| **Patrón de lección de 7 pasos** | Coherente con ejemplos resueltos, recuperación y coherencia multimedia | (1) Repaso inicial de 1–2 preguntas de lecciones previas; (2) caso resuelto → ejemplo para completar → práctica; (3) comprobación con el texto plegado; (4) resumen **después** de la comprobación; (5) comprobación rápida opcional para la ruta corta | A1, A2, A3 y A5 |
| **Separación de estados; la autoevaluación no es revisión** | Muy bien respaldado (r ≈ 0.29 entre autoevaluación y desempeño; la autoevaluación del conocimiento refleja sobre todo motivación) | Mantener. Guardar y mostrar la diferencia entre autoevaluación y evaluación externa como dato de calibración | F |

---

## 6. Registro de fuentes

Todas consultadas el 2026-10-21. Los DOI se verificaron contra Crossref y los resúmenes contra OpenAlex, Semantic Scholar, ERIC, la página del editor o PubMed. Las de arXiv se verificaron con su API. No se citan fuentes no verificadas.

**Volatilidad:** baja para A–G (investigación consolidada; revisar cada 2–3 años). Alta para H: los modelos cambian; revisar cada 6 meses y antes de fijar la instrucción de la §17.5. Media para los Standards: la edición vigente es la de 2014 y puede haber una revisión.

| ID | Título | Autor/Organización | URL o DOI | Consultado | Afirmaciones que sustenta | Tipo | Solidez |
| --- | --- | --- | --- | --- | --- | --- | --- |
| src-dunlosky-tecnicas-aprendizaje | Improving Students' Learning With Effective Learning Techniques | Dunlosky, Rawson, Marsh, Nathan, Willingham (2013) | https://doi.org/10.1177/1529100612453266 | 2026-10-21 | Práctica de recuperación y práctica distribuida: utilidad alta. Autoexplicación, interrogación elaborativa e intercalado: moderada. Releer, resaltar y resumir: baja | revisión | alta |
| src-rowland-efecto-testing | The effect of testing versus restudy on retention: A meta-analytic review of the testing effect | Rowland (2014) | https://doi.org/10.1037/a0037559 | 2026-10-21 | Recuperar supera a reestudiar; las pruebas de recuerdo benefician más que las de reconocimiento | metaanálisis | alta |
| src-adesope-pruebas-practica | Rethinking the Use of Tests: A Meta-Analysis of Practice Testing | Adesope, Trevisan, Sundararajan (2017) | https://doi.org/10.3102/0034654316689306 | 2026-10-21 | Las pruebas de práctica superan al reestudio y a otras condiciones; las características de la prueba moderan el efecto | metaanálisis | alta |
| src-yang-quizzing-aula | Testing (quizzing) boosts classroom learning: A systematic and meta-analytic review | Yang, Luo, Vadillo, Yu, Shanks (2021) | https://doi.org/10.1037/bul0000309 | 2026-10-21 | En aula, g ≈ 0.50 (222 estudios, más de 48 mil alumnos); moderan el feedback, la coincidencia de formato y material y las repeticiones | metaanálisis | alta |
| src-agarwal-recuperacion-aulas | Retrieval Practice Consistently Benefits Student Learning: a Systematic Review of Applied Research in Schools and Classrooms | Agarwal, Nunes, Blunt (2021) | https://doi.org/10.1007/s10648-021-09595-9 | 2026-10-21 | La práctica de recuperación beneficia de forma consistente en contextos escolares reales | revisión | alta |
| src-pan-transferencia-testing | Transfer of test-enhanced learning: Meta-analytic review and synthesis | Pan, Rickard (2018) | https://doi.org/10.1037/bul0000151 | 2026-10-21 | Transferencia d ≈ 0.40: mayor hacia aplicación e inferencia, débil hacia material no practicado; tras corregir el sesgo de publicación depende de la elaboración y la coincidencia de respuesta | metaanálisis | media |
| src-smith-formatos-recuperacion | Retrieval practice with short-answer, multiple-choice, and hybrid tests | Smith, Karpicke (2014) | https://doi.org/10.1080/09658211.2013.831454 | 2026-10-21 | La opción múltiple rindió igual que la respuesta corta en 3 de 4 experimentos; el éxito en la recuperación es clave | estudio | media |
| src-little-mc-exonerated | Multiple-Choice Tests Exonerated, at Least of Some Charges | Little, Bjork, Bjork, Angello (2012) | https://doi.org/10.1177/0956797612443370 | 2026-10-21 | Con alternativas plausibles, la opción múltiple activa recuperación productiva y ayuda a recordar información de los distractores | estudio | media |
| src-cepeda-practica-distribuida | Distributed practice in verbal recall tasks: A review and quantitative synthesis | Cepeda, Pashler, Vul, Wixted, Rohrer (2006) | https://doi.org/10.1037/0033-2909.132.3.354 | 2026-10-21 | El intervalo óptimo crece con el plazo de retención (839 evaluaciones) | metaanálisis | alta |
| src-cepeda-espaciado-curva | Spacing Effects in Learning: A Temporal Ridgeline of Optimal Retention | Cepeda, Vul, Rohrer, Wixted, Pashler (2008) | https://doi.org/10.1111/j.1467-9280.2008.02209.x | 2026-10-21 | Intervalo óptimo de ~20–40 % del plazo a una semana y de ~5–10 % a un año (más de 1,350 personas) | estudio | alta |
| src-latimier-recuperacion-espaciada | A Meta-Analytic Review of the Benefit of Spacing out Retrieval Practice Episodes on Retention | Latimier, Peyre, Ramus (2021) | https://doi.org/10.1007/s10648-020-09572-8 | 2026-10-21 | Recuperación espaciada frente a concentrada: g ≈ 0.74; intervalos crecientes frente a uniformes: sin diferencia | metaanálisis | alta |
| src-rawson-cuanto-basta | Optimizing schedules of retrieval practice for durable and efficient learning: How much is enough? | Rawson, Dunlosky (2011) | https://doi.org/10.1037/a0023956 | 2026-10-21 | Criterio de 3 recuerdos correctos más 3 reaprendizajes espaciados; el reaprendizaje mejora mucho la retención a bajo costo | estudio | media |
| src-rawson-reaprendizaje-2013 | The Power of Successive Relearning: Improving Performance on Course Exams and Long-Term Retention | Rawson, Dunlosky, Sciartelli (2013) | https://doi.org/10.1007/s10648-013-9240-4 | 2026-10-21 | El reaprendizaje sucesivo mejora exámenes reales y la retención | estudio | media |
| src-rawson-reaprendizaje-2022 | Successive Relearning: An Underexplored but Potent Technique for Obtaining and Maintaining Knowledge | Rawson, Dunlosky (2022) | https://doi.org/10.1177/09637214221100484 | 2026-10-21 | Practicar hasta acertar y repetirlo en sesiones espaciadas; el tiempo debería adaptarse al alumno | revisión | media |
| src-barbieri-ejemplos-resueltos | A Meta-analysis of the Worked Examples Effect on Mathematics Performance | Barbieri, Miller-Cotto, Clerjuste, Chawla (2023) | https://doi.org/10.1007/s10648-023-09745-1 | 2026-10-21 | Ejemplos resueltos: g ≈ 0.48 (55 estudios); los correctos rinden más que los incorrectos; las indicaciones de autoexplicación redujeron el efecto | metaanálisis | alta |
| src-renkl-transicion-ejemplos | Structuring the Transition From Example Study to Problem Solving in Cognitive Skill Acquisition: A Cognitive Load Perspective | Renkl, Atkinson (2003) | https://doi.org/10.1207/S15326985EP3801_3 | 2026-10-21 | Transición de ejemplos a problemas retirando pasos resueltos gradualmente | revisión | media |
| src-atkinson-desvanecimiento | Transitioning From Studying Examples to Solving Problems: Effects of Self-Explanation Prompts and Fading Worked-Out Steps | Atkinson, Renkl, Merrill (2003) | https://doi.org/10.1037/0022-0663.95.4.774 | 2026-10-21 | El retiro gradual de pasos más preguntas sobre el principio mejora la transferencia cercana y la lejana sin más tiempo | estudio | media |
| src-salden-desvanecimiento-adaptativo | The expertise reversal effect and worked examples in tutored problem solving | Salden, Aleven, Schwonke, Renkl (2010) | https://doi.org/10.1007/s11251-009-9107-8 | 2026-10-21 | Desvanecimiento adaptativo > fijo > resolución sin ejemplos (laboratorio y aula) | estudio | media |
| src-brunmair-intercalado | Similarity matters: A meta-analysis of interleaved learning and its moderators | Brunmair, Richter (2019) | https://doi.org/10.1037/bul0000209 | 2026-10-21 | Intercalado g ≈ 0.42; mejor con categorías parecidas; ambiguo con textos expositivos; con palabras conviene agrupar | metaanálisis | alta |
| src-firth-intercalado | A systematic review of interleaving as a concept learning strategy | Firth, Rivers, Boyle (2021) | https://doi.org/10.1002/rev3.3266 | 2026-10-21 | Beneficio en memoria y transferencia (hasta g ≈ 0.65), mayor cuando las diferencias son sutiles; dominan los estudios de laboratorio | revisión | media |
| src-kornell-intercalado-induccion | Learning Concepts and Categories: Is Spacing the "Enemy of Induction"? | Kornell, Bjork (2008) | https://doi.org/10.1111/j.1467-9280.2008.02127.x | 2026-10-21 | El intercalado favorece la inducción, pero los participantes creen que agrupar funciona mejor | estudio | media |
| src-kalyuga-reversion-2003 | The Expertise Reversal Effect | Kalyuga, Ayres, Chandler, Sweller (2003) | https://doi.org/10.1207/S15326985EP3801_4 | 2026-10-21 | Las técnicas eficaces para novatos pierden eficacia o se invierten con mayor pericia | revisión | alta |
| src-kalyuga-reversion-2007 | Expertise Reversal Effect and Its Implications for Learner-Tailored Instruction | Kalyuga (2007) | https://doi.org/10.1007/s10648-007-9054-3 | 2026-10-21 | Implicaciones para la instrucción adaptada al nivel; relación con las interacciones aptitud-tratamiento | revisión | alta |
| src-tetzlaff-metaanalisis-reversion | A cornerstone of adaptivity – A meta-analysis of the expertise reversal effect | Tetzlaff, Simonsmeier, Peters, Brod (2025) | https://doi.org/10.1016/j.learninstruc.2025.102142 | 2026-10-21 | Asistencia alta para novatos (d ≈ 0.51) y baja para expertos (d ≈ −0.43); efecto asimétrico; lo modera cómo se mide el conocimiento previo | metaanálisis | alta |
| src-kalyuga-diagnostico-rapido | Measuring Knowledge to Optimize Cognitive Load Factors During Instruction | Kalyuga, Sweller (2004) | https://doi.org/10.1037/0022-0663.96.3.558 | 2026-10-21 | Una medición rápida del primer paso correlaciona hasta 0.92 con pruebas tradicionales, en mucho menos tiempo; sirve para adaptar | estudio | media |
| src-nuckles-desvanecer-indicaciones | Expertise reversal effects in writing-to-learn | Nückles, Hübner, Dümer, Renkl (2010) | https://doi.org/10.1007/s11251-009-9106-9 | 2026-10-21 | Las indicaciones útiles al inicio se vuelven contraproducentes; retirarlas de forma adaptativa lo corrige | estudio | media |
| src-sweller-carga-cognitiva-20-anios | Cognitive Architecture and Instructional Design: 20 Years Later | Sweller, van Merriënboer, Paas (2019) | https://doi.org/10.1007/s10648-019-09465-5 | 2026-10-21 | Memoria de trabajo limitada ante información nueva; los esquemas en memoria de largo plazo eliminan el límite; fundamentos de la teoría de la carga cognitiva | revisión | alta |
| src-kirschner-guia-minima | Why Minimal Guidance During Instruction Does Not Work | Kirschner, Sweller, Clark (2006) | https://doi.org/10.1207/s15326985ep4102_1 | 2026-10-21 | Argumento a favor de la instrucción explícita para novatos (una parte del debate) | revisión | debatida |
| src-sinha-fracaso-productivo | When Problem Solving Followed by Instruction Works: Evidence for Productive Failure | Sinha, Kapur (2021) | https://doi.org/10.3102/00346543211019105 | 2026-10-21 | Resolver y después recibir instrucción: g ≈ 0.36 en conceptos; no en habilidades generales ni en alumnos pequeños | metaanálisis | debatida |
| src-rey-segmentacion | A Meta-analysis of the Segmenting Effect | Rey et al. (2019) | https://doi.org/10.1007/s10648-018-9456-4 | 2026-10-21 | Segmentar tiene efectos pequeños a medianos en retención y transferencia y reduce la carga | metaanálisis | alta |
| src-bisra-autoexplicacion | Inducing Self-Explanation: a Meta-Analysis | Bisra, Liu, Nesbit, Salimi, Winne (2018) | https://doi.org/10.1007/s10648-018-9434-x | 2026-10-21 | Indicaciones de autoexplicación: g ≈ 0.55 (69 efectos) | metaanálisis | media |
| src-mayer-teoria-multimedia | The Past, Present, and Future of the Cognitive Theory of Multimedia Learning | Mayer (2024) | https://doi.org/10.1007/s10648-023-09842-1 | 2026-10-21 | Dos canales, capacidad limitada y procesamiento activo; 15 principios de diseño multimedia | revisión | alta |
| src-noetel-multimedia-meta-meta | Multimedia Design for Learning: An Overview of Reviews With Meta-Meta-Analysis | Noetel et al. (2022) | https://doi.org/10.3102/00346543211052329 | 2026-10-21 | 29 revisiones: mayores efectos en contigüidad y señalización; coherencia y segmentación robustas; el diseño importa más con material complejo | metaanálisis | alta |
| src-schroeder-contiguidad | Spatial Contiguity and Spatial Split-Attention Effects in Multimedia Learning Environments: a Meta-Analysis | Schroeder, Cenkci (2018) | https://doi.org/10.1007/s10648-018-9435-9 | 2026-10-21 | Integrar texto y gráfico: g ≈ 0.63 (58 comparaciones) | metaanálisis | alta |
| src-alpizar-senalizacion | A meta-analysis of signaling principle in multimedia learning environments | Alpizar, Adesope, Wong (2020) | https://doi.org/10.1007/s11423-020-09748-7 | 2026-10-21 | Señalizar: d ≈ 0.38, mayor en los estudios de más calidad | metaanálisis | media |
| src-rey-detalles-seductores | A review of research and a meta-analysis of the seductive detail effect | Rey (2012) | https://doi.org/10.1016/j.edurev.2012.05.003 | 2026-10-21 | Detalles seductores: daño pequeño a mediano en retención y mediano en transferencia (39 efectos) | metaanálisis | alta |
| src-sundararajan-detalles-seductores | Keep it Coherent: A Meta-Analysis of the Seductive Details Effect | Sundararajan, Adesope (2020) | https://doi.org/10.1007/s10648-020-09522-4 | 2026-10-21 | Los detalles seductores perjudican; moderan el ritmo, el tipo de imagen y el formato | metaanálisis | alta |
| src-lenzner-imagenes-decorativas | The role of decorative pictures in learning | Lenzner, Schnotz, Müller (2013) | https://doi.org/10.1007/s11251-012-9256-z | 2026-10-21 | Las imágenes decorativas mejoran el ánimo y no cambian el aprendizaje neto, pero reducen el beneficio de las instructivas, sobre todo con poco conocimiento previo | estudio | media |
| src-brom-diseno-emocional | How effective is emotional design? A meta-analysis on facial anthropomorphisms and pleasant colors during multimedia learning | Brom, Stárková, D'Mello (2018) | https://doi.org/10.1016/j.edurev.2018.09.004 | 2026-10-21 | Rostros y colores agradables en gráficos instructivos: efectos pequeños positivos en retención y transferencia | metaanálisis | media |
| src-towler-detalles-software | The seductive details effect in technology-delivered instruction | Towler et al. (2008) | https://doi.org/10.1002/piq.20023 | 2026-10-21 | Contraejemplo: en formación en Excel y Word, sin daño en el reconocimiento y con mejor transferencia | estudio | preliminar |
| src-wesenberg-senales-detalles | Mitigating the seductive details effect by topic and irrelevance signals | Wesenberg, Krieglstein, Jansen, Schneider, Rey (2025) | https://doi.org/10.1111/bjep.70022 | 2026-10-21 | Marcar los detalles como temáticamente aparte atenuó su daño en un estudio; requiere réplica | estudio | preliminar |
| src-delgado-papel-pantalla | Don't throw away your printed books: A meta-analysis on the effects of reading media on reading comprehension | Delgado, Vargas, Ackerman, Salmerón (2018) | https://doi.org/10.1016/j.edurev.2018.09.003 | 2026-10-21 | Ventaja del papel g ≈ 0.21, mayor con límite de tiempo y en textos informativos | metaanálisis | alta |
| src-clinton-papel-pantalla | Reading from paper compared to screens: A systematic review and meta-analysis | Clinton (2019) | https://doi.org/10.1111/1467-9817.12269 | 2026-10-21 | En pantalla, g ≈ −0.25 (expositivos −0.32) y peor calibración | metaanálisis | media |
| src-pashler-estilos-aprendizaje | Learning Styles: Concepts and Evidence | Pashler, McDaniel, Rohrer, Bjork (2008) | https://doi.org/10.1111/j.1539-6053.2009.01038.x | 2026-10-21 | No hay evidencia adecuada para adaptar la enseñanza a "estilos de aprendizaje" | revisión | alta |
| src-pan-pretesting | Prequestioning and Pretesting Effects: a Review of Empirical Research, Theoretical Perspectives, and Implications for Educational Practice | Pan, Carpenter (2023) | https://doi.org/10.1007/s10648-023-09814-5 | 2026-10-21 | Preguntar antes de enseñar puede mejorar el aprendizaje si después se estudian las respuestas correctas | revisión | media |
| src-biggs-alineacion-constructiva | Enhancing teaching through constructive alignment | Biggs (1996) | https://doi.org/10.1007/BF00138871 | 2026-10-21 | Alinear resultados, actividades y evaluación | guía | media |
| src-krathwohl-bloom-revisada | A Revision of Bloom's Taxonomy: An Overview | Krathwohl (2002) | https://doi.org/10.1207/s15430421tip4104_2 | 2026-10-21 | Dos dimensiones (conocimiento × proceso); tabla para comprobar la alineación; la jerarquía no es estricta | guía | media |
| src-mager-objetivos | Preparing Instructional Objectives | Mager (1962), ERIC ED018143 | https://eric.ed.gov/?id=ED018143 | 2026-10-21 | Objetivo = conducta observable + condiciones + criterio de logro | guía | media |
| src-haladyna-guias-mc | A Review of Multiple-Choice Item-Writing Guidelines for Classroom Assessment | Haladyna, Downing, Rodriguez (2002) | https://doi.org/10.1207/S15324818AME1503_5 | 2026-10-21 | 31 pautas (material nuevo, sin palabrería, tres opciones suelen bastar, distractores con errores típicos, evitar "todas las anteriores") | revisión | media |
| src-haladyna-desarrollo-items | Developing and Validating Test Items | Haladyna, Rodriguez (2013), Routledge | https://doi.org/10.4324/9780203850381 | 2026-10-21 | Actualización en libro de las pautas. Contenido conocido por fuentes secundarias (3 opciones cuando solo hay 2 distractores plausibles); no se leyó directamente | guía | media |
| src-nbme-redaccion-items | Constructing Written Test Questions for the Basic and Clinical Sciences (4.ª ed., 2016) | NBME; Paniagua, Swygert (eds.) | https://health.uconn.edu/faculty-development/wp-content/uploads/sites/69/2017/06/constructing_written_test_questions.pdf | 2026-10-21 | Regla de tapar las opciones; defectos de dificultad irrelevante y de pistas; escenarios según el nivel; opciones homogéneas y en orden lógico; análisis de ítems con grupos | guía | media |
| src-butler-mc-aprendizaje | Multiple-choice testing in education: Are the best practices for assessment also good for learning? | Butler (2018) | https://doi.org/10.1016/j.jarmac.2018.07.002 | 2026-10-21 | Buenas prácticas para medir y para aprender coinciden: formatos simples, retadoras con éxito frecuente y alineadas con procesos | revisión | media |
| src-gierl-distractores | Developing, Analyzing, and Using Distractors for Multiple-Choice Tests in Education: A Comprehensive Review | Gierl, Bulut, Guo, Zhang (2017) | https://doi.org/10.3102/0034654317726529 | 2026-10-21 | Crear distractores es lo menos estudiado; su calidad se evalúa con datos; recomendaciones de desarrollo | revisión | media |
| src-rodriguez-tres-opciones | Three Options Are Optimal for Multiple-Choice Items: A Meta-Analysis of 80 Years of Research | Rodriguez (2005) | https://doi.org/10.1111/j.1745-3992.2005.00006.x | 2026-10-21 | 3 opciones permiten más ítems y cobertura sin deterioro psicométrico | metaanálisis | alta |
| src-tarrant-distractores | An assessment of functioning and non-functioning distractors in multiple-choice questions: a descriptive analysis | Tarrant, Ware, Mohammed (2009) | https://doi.org/10.1186/1472-6920-9-40 | 2026-10-21 | En 514 ítems de 4 opciones, media de 1.54 distractores funcionales; solo el 13.8 % con tres | estudio | media |
| src-chen-tres-cuatro-opciones | A comparison of 3- and 4-option multiple-choice items for medical subspecialty in-training examinations | Chen et al. (2023) | https://doi.org/10.1186/s12909-023-04277-2 | 2026-10-21 | 3 opciones: discriminación y fiabilidad similares, algo más fáciles en un examen y menos tiempo por ítem | estudio | media |
| src-raymond-distractores | The optimal number of options for multiple-choice questions on high-stakes tests: application of a revised index for detecting nonfunctional distractors | Raymond, Stevens, Bucak (2019) | https://doi.org/10.1007/s10459-018-9855-9 | 2026-10-21 | Contrapunto: con un índice ajustado por dificultad, el 47 % de los ítems tenía 3–4 distractores funcionales | estudio | media |
| src-roediger-consecuencias-mc | The Positive and Negative Consequences of Multiple-Choice Testing | Roediger, Marsh (2005) | https://doi.org/10.1037/0278-7393.31.5.1155 | 2026-10-21 | Leer más distractores aumenta la producción posterior de respuestas falsas | estudio | media |
| src-butler-feedback-mc | Feedback enhances the positive effects and reduces the negative effects of multiple-choice testing | Butler, Roediger (2008) | https://doi.org/10.3758/MC.36.3.604 | 2026-10-21 | El feedback, inmediato o diferido, aumenta los aciertos y reduce la reaparición de distractores | estudio | media |
| src-mcdaniel-sjt-2001 | Use of situational judgment tests to predict job performance: A clarification of the literature | McDaniel, Morgeson, Finnegan, Campion, Braverman (2001) | https://doi.org/10.1037/0021-9010.86.4.730 | 2026-10-21 | Validez de los tests de juicio situacional ρ ≈ 0.34; correlación con capacidad cognitiva ≈ 0.46 | metaanálisis | alta |
| src-mcdaniel-sjt-instrucciones | Situational judgment tests, response instructions, and validity: A meta-analysis | McDaniel, Hartman, Whetzel, Grubb (2007) | https://doi.org/10.1111/j.1744-6570.2007.00065.x | 2026-10-21 | La instrucción de conocimiento ("mejor acción") mide más capacidad cognitiva; la de tendencia, más personalidad | metaanálisis | alta |
| src-catano-fiabilidad-sjt | Assessing the Reliability of Situational Judgment Tests Used in High-Stakes Situations | Catano, Brochu, Lamerson (2012) | https://doi.org/10.1111/j.1468-2389.2012.00604.x | 2026-10-21 | Alfa medio ≈ 0.46 en tests heterogéneos; test-retest más alto; alfa es un indicador inadecuado | estudio | media |
| src-patterson-sjt-amee | Situational judgement tests in medical education and training: AMEE Guide No. 100 | Patterson, Zibarras, Ashworth (2016) | https://doi.org/10.3109/0142159X.2015.1072619 | 2026-10-21 | Diseñarlos exige análisis del rol y expertos; la especificación varía según el nivel de conocimiento | guía | media |
| src-shute-feedback-formativo | Focus on Formative Feedback | Shute (2008) | https://doi.org/10.3102/0034654307313795 | 2026-10-21 | Feedback no evaluativo de la persona, específico, oportuno y en unidades manejables; tipos y momento | revisión | alta |
| src-hattie-poder-feedback | The Power of Feedback | Hattie, Timperley (2007) | https://doi.org/10.3102/003465430298487 | 2026-10-21 | Modelo de tres preguntas y cuatro niveles; el feedback dirigido a la persona es el menos eficaz; puede ser negativo | revisión | alta |
| src-wisniewski-feedback-revisitado | The Power of Feedback Revisited: A Meta-Analysis of Educational Feedback Research | Wisniewski, Zierer, Hattie (2020) | https://doi.org/10.3389/fpsyg.2019.03087 | 2026-10-21 | d ≈ 0.48 con gran heterogeneidad; pesa la cantidad de información que transmite | metaanálisis | alta |
| src-kluger-intervenciones-feedback | The effects of feedback interventions on performance: A historical review, a meta-analysis, and a preliminary feedback intervention theory | Kluger, DeNisi (1996) | https://doi.org/10.1037/0033-2909.119.2.254 | 2026-10-21 | d ≈ 0.41 en promedio; más de un tercio de las intervenciones empeoró el desempeño; peor cuando la atención se va a la persona | metaanálisis | alta |
| src-vanderkleij-feedback-computadora | Effects of Feedback in a Computer-Based Learning Environment on Students' Learning Outcomes: A Meta-Analysis | Van der Kleij, Feskens, Eggen (2015) | https://doi.org/10.3102/0034654314564881 | 2026-10-21 | Feedback elaborado 0.49 > solo la respuesta correcta 0.32 > solo correcto/incorrecto 0.05; el elaborado destaca en orden superior | metaanálisis | alta |
| src-kulik-momento-feedback | Timing of Feedback and Verbal Learning | Kulik, Kulik (1988) | https://doi.org/10.3102/00346543058001079 | 2026-10-21 | En estudios aplicados conviene el inmediato; en experimentales, el diferido | metaanálisis | debatida |
| src-butler-tipo-momento-feedback | The effect of type and timing of feedback on learning from multiple-choice tests | Butler, Karpicke, Roediger (2007) | https://doi.org/10.1037/1076-898X.13.4.273 | 2026-10-21 | El feedback diferido rindió más en laboratorio; responder hasta acertar no superó al feedback estándar | estudio | media |
| src-mullet-feedback-diferido | Delaying feedback promotes transfer of knowledge despite student preferences to receive feedback immediately | Mullet, Butler, Verdin, von Borries, Marsh (2014) | https://doi.org/10.1016/j.jarmac.2014.05.001 | 2026-10-21 | Feedback a la semana: mejor transferencia en un curso de ingeniería, aunque los alumnos preferían el inmediato | estudio | media |
| src-metcalfe-aprender-errores | Learning from Errors | Metcalfe (2017) | https://doi.org/10.1146/annurev-psych-010416-044022 | 2026-10-21 | El error seguido de feedback correctivo beneficia el aprendizaje, sobre todo el de confianza alta; se recomiendan errores en contextos de bajo riesgo | revisión | alta |
| src-aera-standards-2014 | Standards for Educational and Psychological Testing (2014) | AERA, APA, NCME | https://www.testingstandards.net/open-access-files.html | 2026-10-21 | 1.14: evidencia para interpretar subpuntajes o perfiles; 2.3: fiabilidad de cada puntaje que se interprete; 5.21: documentar los puntos de corte | guía | alta |
| src-sinharay-subpuntajes | How Often Do Subscores Have Added Value? Results from Operational and Simulated Data | Sinharay (2010) | https://doi.org/10.1111/j.1745-3984.2010.00106.x | 2026-10-21 | Los subpuntajes aportan valor solo con fiabilidad alta y poca correlación; el promedio ponderado con el total ayuda más a menudo | estudio | alta |
| src-butterfield-hipercorreccion | Errors committed with high confidence are hypercorrected | Butterfield, Metcalfe (2001) | https://doi.org/10.1037/0278-7393.27.6.1491 | 2026-10-21 | Los errores de confianza alta son los que más se corrigen tras el feedback | estudio | alta |
| src-butler-hipercorreccion-semana | The hypercorrection effect persists over a week, but high-confidence errors return | Butler, Fazio, Marsh (2011) | https://doi.org/10.3758/s13423-011-0173-y | 2026-10-21 | El efecto persiste a la semana, pero los errores de confianza alta reaparecen si se olvida la corrección | estudio | media |
| src-sitzman-conocimiento-previo | Prior knowledge is more predictive of error correction than subjective confidence | Sitzman, Rhodes, Tauber (2014) | https://doi.org/10.3758/s13421-013-0344-3 | 2026-10-21 | La hipercorrección podría reflejar sobre todo el conocimiento previo | estudio | debatida |
| src-dunlosky-sobreconfianza | Overconfidence produces underachievement: Inaccurate self evaluations undermine students' learning and retention | Dunlosky, Rawson (2012) | https://doi.org/10.1016/j.learninstruc.2011.08.003 | 2026-10-21 | La sobreconfianza se asocia a peor aprendizaje y retención (título; la comunicación de Koriat lo atribuye a dejar de estudiar antes) | estudio | media |
| src-double-reactividad-jol | A meta-analysis and systematic review of reactivity to judgements of learning | Double, Birney, Walker (2018) | https://doi.org/10.1080/09658211.2017.1404111 | 2026-10-21 | Pedir juicios de aprendizaje no cambia el desempeño en promedio (g ≈ 0.05), con excepciones en algunas tareas | metaanálisis | media |
| src-schraw-medidas-monitoreo | A conceptual analysis of five measures of metacognitive monitoring | Schraw (2009) | https://doi.org/10.1007/s11409-008-9031-3 | 2026-10-21 | Hay varias medidas de calibración y cada una capta un aspecto distinto | revisión | media |
| src-zell-insight-habilidades | Do People Have Insight Into Their Abilities? A Metasynthesis | Zell, Krizan (2014) | https://doi.org/10.1177/1745691613518075 | 2026-10-21 | Autoevaluación frente a desempeño: r ≈ 0.29 de media (22 metaanálisis); mejor en tareas específicas, objetivas, familiares y simples | metaanálisis | alta |
| src-sitzmann-autoevaluacion-conocimiento | Self-Assessment of Knowledge: A Cognitive Learning or Affective Measure? | Sitzmann, Ely, Brown, Bauer (2010) | https://doi.org/10.5465/amle.9.2.zqr169 | 2026-10-21 | La autoevaluación del conocimiento correlaciona más con motivación y satisfacción que con aprendizaje | metaanálisis | alta |
| src-jonsson-rubricas | The use of scoring rubrics: Reliability, validity and educational consequences | Jonsson, Svingby (2007) | https://doi.org/10.1016/j.edurev.2007.05.002 | 2026-10-21 | Las rúbricas analíticas, específicas y con ejemplos y entrenamiento mejoran la fiabilidad; no garantizan validez | revisión | alta |
| src-panadero-rubricas-formativas | The use of scoring rubrics for formative assessment purposes revisited: A review | Panadero, Jonsson (2013) | https://doi.org/10.1016/j.edurev.2013.01.002 | 2026-10-21 | El uso formativo de rúbricas puede mejorar el desempeño y la autorregulación, con moderadores | revisión | media |
| src-panadero-metaanalisis-rubricas | Effects of Rubrics on Academic Performance, Self-Regulated Learning, and self-Efficacy: a Meta-analytic Review | Panadero, Jonsson, Pinedo, Fernández-Castilla (2023) | https://doi.org/10.1007/s10648-023-09823-4 | 2026-10-21 | Desempeño g ≈ 0.45; autorregulación y autoeficacia con efectos pequeños e inciertos | metaanálisis | media |
| src-brookhart-criterios-rubricas | Appropriate Criteria: Key to Effective Rubrics | Brookhart (2018) | https://doi.org/10.3389/feduc.2018.00022 | 2026-10-21 | Rúbrica = criterios + descripciones de calidad por nivel; contar o usar lenguaje de escala sirve menos para aprender | revisión | media |
| src-dunning-autoevaluacion-defectuosa | Flawed Self-Assessment: Implications for Health, Education, and the Workplace | Dunning, Heath, Suls (2004) | https://doi.org/10.1111/j.1529-1006.2004.00018.x | 2026-10-21 | La autoevaluación es imperfecta y tiende a la sobrestimación; intervenciones para compensarla | revisión | alta |
| src-falchikov-autoevaluacion | Student Self-Assessment in Higher Education: A Meta-Analysis | Falchikov, Boud (1989) | https://doi.org/10.3102/00346543059004395 | 2026-10-21 | Más coincidencia con el docente en cursos avanzados y en estudios mejor diseñados | metaanálisis | media |
| src-panadero-autoevaluacion-srl | Effects of self-assessment on self-regulated learning and self-efficacy: Four meta-analyses | Panadero, Jonsson, Botella (2017) | https://doi.org/10.1016/j.edurev.2017.08.004 | 2026-10-21 | La autoevaluación mejora la autorregulación (0.23–0.65) y la autoeficacia (0.73) | metaanálisis | media |
| src-andrade-autoevaluacion | A Critical Review of Research on Student Self-Assessment | Andrade (2019) | https://doi.org/10.3389/feduc.2019.00087 | 2026-10-21 | Pide tratar la autoevaluación como formativa, con menos énfasis en la consistencia y en lo sumativo | revisión | media |
| src-kulik-aprendizaje-dominio | Effectiveness of Mastery Learning Programs: A Meta-Analysis | Kulik, Kulik, Bangert-Drowns (1990) | https://doi.org/10.3102/00346543060002265 | 2026-10-21 | Efectos positivos, mayores en alumnos débiles; más tiempo; los programas autodirigidos reducen la finalización | metaanálisis | media |
| src-slavin-aprendizaje-dominio | Mastery Learning Reconsidered | Slavin (1987) | https://doi.org/10.3102/00346543057002175 | 2026-10-21 | Sin efectos en pruebas estandarizadas; efectos moderados y poco duraderos en las propias | revisión | debatida |
| src-guskey-aprendizaje-dominio | Lessons of Mastery Learning | Guskey (2010), Educational Leadership (ERIC EJ913779) | https://eric.ed.gov/?id=EJ913779 | 2026-10-21 | Elementos centrales: diagnóstico previo, evaluaciones formativas, actividades de corrección y de ampliación | guía | media |
| src-pelanek-criterios-dominio-2017 | Experimental Analysis of Mastery Learning Criteria | Pelánek, Řihák (2017) | https://doi.org/10.1145/3079628.3079667 | 2026-10-21 | Los datos usados y el umbral pesan más que el modelo; el promedio móvil exponencial es adecuado | estudio | media |
| src-pelanek-criterios-dominio-2018 | Analysis and design of mastery learning criteria | Pelánek, Řihák (2018) | https://doi.org/10.1080/13614568.2018.1476596 | 2026-10-21 | Amplía el criterio de promedio móvil con aspectos prácticos; aplicación en un sistema real | estudio | media |
| src-hausknecht-reevaluacion | Retesting in selection: A meta-analysis of coaching and practice effects for tests of cognitive ability | Hausknecht, Halpert, Di Paolo, Moriarty Gerrard (2007) | https://doi.org/10.1037/0021-9010.92.2.373 | 2026-10-21 | Repetir el test eleva el puntaje, más con formas idénticas y con entrenamiento | metaanálisis | alta |
| src-wooldridge-testing-autentico | The testing effect with authentic educational materials: A cautionary note | Wooldridge, Bugg, McDaniel, Liu (2014) | https://doi.org/10.1016/j.jarmac.2014.07.001 | 2026-10-21 | Con material real, practicar mejora las preguntas idénticas pero no las relacionadas distintas | estudio | media |
| src-kotovsky-isomorfos | Why are some problems hard? Evidence from Tower of Hanoi | Kotovsky, Hayes, Simon (1985) | https://doi.org/10.1016/0010-0285(85)90009-X | 2026-10-21 | Problemas con la misma estructura pueden diferir mucho en dificultad | estudio | media |
| src-zheng-llm-juez | Judging LLM-as-a-Judge with MT-Bench and Chatbot Arena | Zheng et al. (2023) | https://arxiv.org/abs/2306.05685 | 2026-10-21 | Más de 80 % de acuerdo con humanos en preferencias de chat; sesgos de posición, verbosidad y autoensalzamiento | estudio | media |
| src-wang-llm-no-justos | Large Language Models are not Fair Evaluators | Wang et al. (2023) | https://arxiv.org/abs/2305.17926 | 2026-10-21 | Cambiar el orden altera el veredicto; mitigan la evidencia múltiple, el balance de posiciones y una persona en el circuito | estudio | media |
| src-panickssery-autopreferencia | LLM Evaluators Recognize and Favor Their Own Generations | Panickssery, Bowman, Feng (2024) | https://arxiv.org/abs/2404.13076 | 2026-10-21 | Autopreferencia vinculada a la capacidad de reconocer los textos propios | estudio | media |
| src-thakur-juzgar-jueces | Judging the Judges: Evaluating Alignment and Vulnerabilities in LLMs-as-Judges | Thakur et al. (2025, GEM²) | https://arxiv.org/abs/2406.12624 | 2026-10-21 | Solo los modelos grandes se alinean razonablemente, aún por debajo de los humanos; indulgencia; sensibilidad al prompt; el porcentaje de acuerdo engaña | estudio | media |
| src-bavaresco-judge-bench | LLMs instead of Human Judges? A Large Scale Empirical Study across 20 NLP Evaluation Tasks | Bavaresco et al. (2024) | https://arxiv.org/abs/2406.18403 | 2026-10-21 | Gran variación según tarea y atributo; validar contra humanos antes de usar | estudio | media |
| src-raina-ataques-juez | Is LLM-as-a-Judge Robust? Investigating Universal Adversarial Attacks on Zero-shot LLM Assessment | Raina, Liusie, Gales (2024) | https://arxiv.org/abs/2402.14016 | 2026-10-21 | Frases adversarias universales inflan los puntajes; la puntuación absoluta es más vulnerable que la comparativa | estudio | media |
| src-sharma-complacencia | Towards Understanding Sycophancy in Language Models | Sharma et al. (2023) | https://arxiv.org/abs/2310.13548 | 2026-10-21 | Los asistentes tienden a coincidir con las opiniones del usuario en vez de con lo verdadero | estudio | media |
| src-gu-survey-llm-juez | A Survey on LLM-as-a-Judge | Gu et al. (2024) | https://arxiv.org/abs/2411.15594 | 2026-10-21 | Estrategias de consistencia y mitigación de sesgos; métodos para evaluar la fiabilidad del juez | revisión | media |
| src-chiang-llm-evaluacion | Can Large Language Models Be an Alternative to Human Evaluations? | Chiang, Lee (2023) | https://doi.org/10.18653/v1/2023.acl-long.870 | 2026-10-21 | Contrapunto: la evaluación por LLM coincidió con la de expertos en dos tareas y fue estable ante el formato | estudio | media |
| src-emirtekin-evaluacion-automatizada | Large Language Model-Powered Automated Assessment: A Systematic Review | Emirtekin (2025) | https://doi.org/10.3390/app15105683 | 2026-10-21 | 49 estudios: acuerdo de alto a bajo según el contexto; sesgo, inconsistencia, alucinación; supervisión humana esencial | revisión | media |
| src-eneye-calificacion-llm | Advances in Auto-Grading with Large Language Models: A Cross-Disciplinary Survey | Eneye et al. (2025, BEA) | https://doi.org/10.18653/v1/2025.bea-1.35 | 2026-10-21 | Revisión de calificación con LLM en seis áreas; inconsistencias y necesidad de supervisión humana | revisión | media |
| src-pack-llm-ensayos | Large language models and automated essay scoring of English language learner writing: Insights into validity and reliability | Pack, Barrett, Escalante (2024) | https://doi.org/10.1016/j.caeai.2024.100234 | 2026-10-21 | GPT-4 con buena fiabilidad y validez; todos los modelos fluctuaron entre ocasiones | estudio | media |
| src-steiss-feedback-chatgpt | Comparing the quality of human and ChatGPT feedback of students' writing | Steiss et al. (2024) | https://doi.org/10.1016/j.learninstruc.2024.101894 | 2026-10-21 | Los humanos dieron mejor feedback en casi todas las dimensiones; diferencia práctica no sustancial | estudio | media |
| src-kortemeyer-respuestas-cortas | Performance of the pre-trained large language model GPT-4 on automated short answer grading | Kortemeyer (2024) | https://doi.org/10.1007/s44163-024-00147-y | 2026-10-21 | GPT-4 sin entrenamiento: comparable a modelos diseñados a mano, inferior a los especializados | estudio | preliminar |

---

## 7. Huecos y puntos donde la evidencia es mixta

1. **Población y dominio.** Casi toda la evidencia de A–D proviene de estudiantes de secundaria o universitarios, con materiales cortos (ciencia, matemáticas, vocabulario) y a menudo en laboratorio. Hay poca investigación sobre adultos profesionales que aprenden herramientas de IA, y la transferencia a proyectos reales no está medida. Los tamaños de efecto de este documento no deben prometerse como resultados.
2. **Autoexplicación con ejemplos resueltos.** Bisra (efecto positivo amplio) y Barbieri (las indicaciones reducen el efecto de los ejemplos en matemáticas) no coinciden. Por eso se propone una sola indicación por caso, opcional para quien domina.
3. **Fracaso productivo frente a instrucción explícita.** Es un debate activo (Sinha y Kapur frente a Kirschner y colegas). Se recomienda usarlo de forma experimental y solo en conceptos.
4. **Momento del feedback.** La evidencia es mixta: depende de si se mide retención o transferencia y de si el estudio es de laboratorio o aplicado. La combinación propuesta (inmediato en práctica, al final en examen y repaso diferido) es una [inferencia] razonable, no una prescripción probada.
5. **Número de opciones para aprender, no solo para medir.** La literatura de medición favorece 3; la de aprendizaje sugiere que las alternativas competitivas activan más recuperación, pero que más distractores exponen a más respuestas falsas. El efecto neto con feedback inmediato no está resuelto. Además, la definición de "distractor no funcional" depende de la dificultad del ítem (Raymond).
6. **Mecanismo de la hipercorrección.** No está claro si importa la confianza o el conocimiento previo (Sitzman y colegas). Para la app, la regla práctica (priorizar los errores de confianza alta) funciona con cualquiera de las dos explicaciones.
7. **Detalles seductores en formación en software.** Towler y colegas hallaron transferencia mejor, no peor, en Excel y Word, y Wesenberg y colegas atenuaron el daño con señales. Los metaanálisis siguen indicando daño promedio; la regla prudente es dejarlos fuera del flujo.
8. **Diseño emocional e imágenes decorativas en adultos.** Las muestras de los estudios son jóvenes, y la moderación por edad solo se estudió en algunas variables. No hay evidencia específica sobre portadas generadas por IA.
9. **Psicometría con n = 1.** No hay forma empírica de estimar la fiabilidad ni de equiparar formas para un único alumno. Los modelos de seguimiento del conocimiento necesitan parámetros calibrados en poblaciones. Las propuestas de la §4 y la §5 (bloques, conteos, intervalos binomiales) son aproximaciones [inferencia] que suponen ítems intercambiables.
10. **Mastery learning en adultos autodirigidos.** La evidencia es antigua (Kulik 1990), tiene críticas sobre su magnitud (Slavin 1987), y la evidencia moderada de sistemas adaptativos proviene sobre todo de matemáticas escolares. No hay estudios que validen los umbrales propuestos (10/12, 5/6, 2 sesiones).
11. **Reactividad de la confianza en opción múltiple.** El metaanálisis disponible trata juicios de aprendizaje en tareas de memoria, no la confianza tras responder ítems de escenario. Que la reactividad sea baja aquí es una extrapolación.
12. **Evaluación con LLM.** La evidencia es de 2023–2025, con modelos que ya cambiaron; casi no hay estudios sobre evaluar tareas de uso de herramientas de IA o especificaciones. Las salvaguardas R-H-7 a R-H-10 son [inferencia] basada en sesgos medidos en otros contextos. Requiere revisión cada 6 meses.
13. **Calidad de ítems generados con IA.** No se revisó la literatura sobre generación automática de ítems con LLM. Es relevante porque este proyecto redacta ítems con agentes, y se sugiere investigarlo antes de producir el banco a escala.
14. **Microsesiones en celular.** No hay evidencia directa sobre el formato de 20–30 minutos en celular para este tipo de contenido. Las reglas de la sección A9 extrapolan los metaanálisis de lectura en pantalla.

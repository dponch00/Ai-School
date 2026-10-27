# Revisión cruzada — M10 L4–L6 (T-048)

Fecha de revisión: 2026-10-27  
Alcance: lecciones `m10-l4` a `m10-l6`, 18 comprobaciones, conceptos erróneos `m10-mc31` a `m10-mc62` y las fichas `m10-pc-static-hosting`, `m10-pc-agent-responsibility`, `m10-pc-dependency-review`, `m10-pc-model-retirement` y `m10-pc-dependency-updates`.

## Hallazgos

- [T048-M10-01] Severidad: baja
  Ubicación: `content/courses/m10/lessons/m10-l4.md:32`, `m10-l4-c2` y `m10-mc33`.
  Evidencia: la guía del ciclo de vida indica que el *service worker* nuevo espera mientras algún cliente siga controlado por el anterior y que durante una recarga pueden coexistir ambas páginas. No establece que recargar una única pestaña nunca baste: la activación depende de que no quede ningún cliente de la versión anterior. La redacción actual convierte esa posibilidad en una regla absoluta.
  Consecuencia: una persona puede diagnosticar erróneamente una actualización que sí se activaría al cerrar la última pestaña antigua, o pensar que recargar es siempre inútil.
  Corrección recomendada: sustituir por «Recargar esa pestaña no garantiza la actualización: mientras quede una pestaña controlada por la versión anterior, la nueva espera. Durante una recarga ambas pueden coexistir un momento.» En `m10-l4-c2`, conservar «puede pasar» y añadir en el *feedback* «por ejemplo, si otra pestaña sigue abierta con la versión anterior».

- [T048-M10-02] Severidad: baja
  Ubicación: `content/courses/m10/lessons/m10-l6.md:22,40,98` y coherencia con M04.
  Evidencia: M10 alterna «librería» para paquetes de software, mientras M04 usa «biblioteca» para el mismo concepto. No hay diferencia conceptual declarada y la guía de estilo favorece español claro.
  Consecuencia: añade una variación innecesaria justo en un manual que pide reconocer dependencias y versiones.
  Corrección recomendada: adoptar «biblioteca» en el contenido educativo de M10 (y reservar el nombre propio que use cada interfaz o fuente), con una primera definición como «biblioteca: paquete de código de otros que usa el proyecto».

## Comprobaciones sin hallazgo

- Las citas de L4 son fieles dentro de su alcance: el flujo de publicación separa construcción y despliegue con `needs`; un *check* omitido cuenta como éxito; forzar `skipWaiting` puede mezclar recursos de dos versiones; una instalación nueva no limpia por sí sola la caché anterior; SemVer exige API pública, versiones inmutables y cambios MAYOR/MENOR/PARCHE según compatibilidad. La regla 3-2-1, la copia fuera de sitio y la prueba de restauración también coinciden con la orientación pública de CISA. El URL concreto de CISA registrado en `sources.json` devolvió 403 al abrirlo; se contrastó el mismo contenido con publicaciones oficiales de CISA accesibles en su propio dominio.
- Las citas de L5 sostienen las cuatro formas de Diátaxis, el riesgo de mezclarlas, el propósito del README, la guía comunitaria de README, los ADR de Nygard, las *model cards*, la revisión humana de propuestas de agentes, los derechos de autor por defecto y la revisión de dependencias. La conclusión de que responde la dueña que aprueba sigue marcada correctamente como inferencia del curso; no se presenta como una conclusión legal de los proveedores.
- Las citas de L6 sostienen casos de evaluación realistas, comparación con/sin skill o con la versión anterior, contexto limpio, calificación automática o humana, evaluación antes de documentación extensa y prueba con todos los modelos previstos. También verifican el aviso mínimo de 60 días, fallo de solicitudes a modelos retirados, parcheo como mantenimiento preventivo, PR automáticas de dependencias, descarte/auditoría/reapertura de alertas y aprobación de responsables mediante `CODEOWNERS` junto con protección de rama.
- Las cinco fichas siguen vigentes a 2026-10-27. La ficha de hosting conserva los límites de 1 GB, 100 GB/mes, 10 construcciones/hora fuera de flujo propio, 10 minutos y 429; la de responsabilidad distingue correctamente que Codex pide tratar sugerencias como una PR, sin atribuirle una frase que no publica. La ficha de retirada recoge que la plataforma de Evals de OpenAI pasa a solo lectura el 2026-10-31 y cierra el 2026-11-30; la fecha ya está dentro de su ventana de revisión. Dependabot mantiene el *cooldown* predeterminado de tres días para actualizaciones de versión, no para las de seguridad, y el límite predeterminado de cinco PR de versión.
- Las 18 preguntas tienen una sola clave marcada y defendible, una sección de referencia existente y distractores ligados a los conceptos erróneos correspondientes. Los cuatro casos señalados por el ticket son correctos: `m10-l4-c3` aplica una incompatibilidad pública a 2.0.0; `m10-l5-c3` identifica a la dueña que aprobó; `m10-l6-c4` reabre al cumplirse la condición; `m10-l4-c2` queda cubierto por la precisión T048-M10-01. La máxima proporción de longitudes entre opciones es 1,46 (`m10-l5-r2`), bajo el límite indicado de 1,7.
- La revisión de los casos no encontró una repetición material con el diagnóstico ni con M01–M09: se continúa el escenario de cobranza/Pulse, pero cada comprobación decide sobre publicación, actualización, evidencia o mantenimiento que no anticipa el giro del laboratorio de descuentos. Los conceptos erróneos `m10-mc31` a `m10-mc62` describen el error que representa su distractor; que los dos distractores de `m10-l4-r1` compartan `m10-mc57` es coherente, pues ambos sobreprotegen una preferencia recuperable.
- L4, L5 y L6 tienen aproximadamente 1.701, 1.577 y 1.903 palabras: caben holgadamente en 25 minutos incluso con actividades. No introducen nombres de producto en el cuerpo ni enseñan nombres de API del *service worker*, consejo legal de licencias o garantías de disponibilidad. Las dos frases preguntadas por el revisor están dentro de párrafos marcados como `[inferencia]`; su alcance queda suficientemente claro.

## Fuentes abiertas y resultado

| Fuente abierta | Resultado de la comprobación |
| --- | --- |
| [MDN: cliente y servidor](https://developer.mozilla.org/en-US/docs/Learn_web_development/Extensions/Server-side/First_steps/Client-Server_overview) | Respalda la distinción entre archivos estáticos y trabajo del servidor; no se extiende a secretos, que se contrasta con Vite. |
| [Vite: variables y modos](https://vite.dev/guide/env-and-mode) | Confirma que las variables expuestas al cliente se incorporan al bundle y no deben contener secretos. |
| [GitHub Pages: flujos personalizados](https://docs.github.com/en/pages/getting-started-with-github-pages/configuring-a-publishing-source-for-your-github-pages-site) | Respalda los dos trabajos y la dependencia `needs` entre construcción y despliegue. |
| [GitHub: estados de checks](https://docs.github.com/en/actions/how-tos/monitor-workflows/use-workflow-run-logs) | Respalda que un check omitido informa éxito; la regla de no hacerlo opcional es una inferencia didáctica señalada. |
| [web.dev: ciclo de vida del service worker](https://web.dev/articles/service-worker-lifecycle) | Respalda espera, clientes existentes, solapamiento durante recarga y riesgo de forzar activación; origina T048-M10-01 por la formulación absoluta. |
| [web.dev: actualización de PWA](https://web.dev/learn/pwa/update) | Respalda que los archivos de caché antiguos no se eliminan automáticamente y la preferencia por avisar antes de actualizar. |
| [Semantic Versioning 2.0.0](https://semver.org/spec/v2.0.0.html) | Respalda API pública, inmutabilidad, deprecación en menor y los incrementos MAYOR/MENOR/PARCHE. |
| [MDN: cuotas y borrado](https://developer.mozilla.org/en-US/docs/Web/API/Storage_API/Storage_quotas_and_eviction_criteria) | Respalda almacenamiento por origen, cuotas y posibilidad de borrado. |
| [CISA: opciones de respaldo](https://www.cisa.gov/back-business-data) | El URL registrado devolvió 403 desde el lector; se contrastó su regla con la [guía oficial de CISA](https://www.cisa.gov/sites/default/files/publications/AA20-302A_Ransomware%20_Activity_Targeting_the_Healthcare_and_Public_Health_Sector.pdf), que confirma 3-2-1, copia offline y pruebas de restauración. |
| [Diátaxis](https://diataxis.fr/start-here/) | Confirma tutorial, guía práctica, referencia y explicación, y que desdibujar sus límites causa problemas. |
| [GitHub: README](https://docs.github.com/en/get-started/start-your-journey/about-readmes) | Confirma el README como presentación y punto de inicio del proyecto. |
| [Make a README](https://www.makeareadme.com/) | Confirma las sugerencias de instalación, uso, pruebas, licencia y estado. |
| [Nygard: ADR](https://cognitect.com/blog/2011/11/15/documenting-architecture-decisions) | Confirma registros breves con contexto, decisión, estado y consecuencias, preservando decisiones sustituidas. |
| [Model Cards](https://arxiv.org/abs/1810.03993) | Confirma uso previsto, condiciones de evaluación y contexto de uso de las fichas de modelos. |
| [Claude Code: seguridad](https://code.claude.com/docs/en/security) | Respalda revisión de cambios y comandos antes de aprobarlos. |
| [GitHub Copilot: uso responsable de agentes](https://docs.github.com/en/copilot/responsible-use/agents) | Respalda revisión exhaustiva, código inexacto, riesgos de seguridad y coincidencias con código público. |
| [OpenAI: seguridad de Codex](https://learn.chatgpt.com/docs/agent-approvals-security) | Respalda tratar sugerencias como una PR: verificar, revisar diff y documentar decisiones; la ficha conserva correctamente la cautela sobre responsabilidad explícita. |
| [GitHub: licencias de repositorio](https://docs.github.com/en/repositories/managing-your-repositorys-settings-and-features/customizing-your-repository/licensing-a-repository) | Confirma derechos de autor por defecto y los límites de ver/crear un fork frente a reproducir o distribuir. |
| [GitHub: revisión de dependencias](https://docs.github.com/en/code-security/concepts/supply-chain-security/dependency-review) | Confirma cambios directos e indirectos, vulnerabilidades y políticas de licencia en la PR. |
| [Agent Skills: evaluar calidad](https://agentskills.io/skill-creation/evaluating-skills) | Confirma casos, línea base, contexto limpio y calificación automática o humana. |
| [Anthropic: buenas prácticas de skills](https://platform.claude.com/docs/en/agents-and-tools/agent-skills/best-practices) | Confirma crear evaluaciones antes de documentación extensa y probar todos los modelos previstos. |
| [Anthropic: retirada de modelos](https://platform.claude.com/docs/en/about-claude/model-deprecations) | Confirma estados, aviso de 60 días, fallo tras retirada y la fecha de Sonnet 4.5. |
| [NIST SP 800-40r4](https://csrc.nist.gov/pubs/sp/800/40/r4/final) | Confirma parcheo como mantenimiento preventivo y costo necesario de operación. |
| [GitHub: actualizaciones de Dependabot](https://docs.github.com/en/code-security/concepts/supply-chain-security/dependabot-version-updates) | Confirma PR automáticas, *cooldown* de tres días y actualización de acciones. |
| [GitHub: opciones de Dependabot](https://docs.github.com/en/code-security/reference/supply-chain-security/dependabot-options-reference) | Confirma cadencias y límites configurables. |
| [GitHub: alertas de Dependabot](https://docs.github.com/en/code-security/how-tos/manage-security-alerts/manage-dependabot-alerts/view-dependabot-alerts) | Confirma motivo, comentario, auditoría y reapertura de alertas descartadas no corregidas. |
| [Keep a Changelog](https://keepachangelog.com/en/1.1.0/) | Confirma registrar cambios notables y la relación con SemVer. |
| [GitHub: CODEOWNERS](https://docs.github.com/en/repositories/managing-your-repositorys-settings-and-features/customizing-your-repository/about-code-owners) | Confirma solicitud de revisión y exigencia de aprobación junto con protección de rama. |
| [OpenAI: deprecaciones](https://developers.openai.com/api/docs/deprecations) | Confirma que la plataforma de Evals se vuelve de solo lectura el 2026-10-31 y cierra el 2026-11-30. |

Verificado: contraste de las citas con sus fuentes, revisión de las cinco fichas, comprobación estructural de 18 preguntas, ausencia de pistas de longitud y revisión de alcance, tiempo y repeticiones. No se modificó `src/`, `content/`, `e2e/` ni `ESTADO.md`.

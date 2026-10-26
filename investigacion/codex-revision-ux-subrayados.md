# Revisión Codex — UX de subrayados con nota (T-036)

Fecha: 2026-10-26  
Alcance: selección, edición y repaso de subrayados de D-027 en lección y en `#/notas`. Se revisó el DOM, la navegación con teclado y el comportamiento en una vista móvil estrecha y en escritorio.

## Hallazgos

- [T036-UX-01] Severidad: media
  Ubicación: `src/pages/NotesPage.tsx:64-70`; `src/styles/app.css:362-365`
  Evidencia: con un subrayado de M02 y la pantalla móvil estrecha, el selector «M02 · Prompting avanzado y especificaciones» midió 401,45 px. El documento quedó en 430 px de ancho para un área visible de 314 px y apareció desplazamiento horizontal. El selector no tiene `max-width` ni su `label` admite encogerse.
  Consecuencia: en el flujo principal de celular se debe desplazar horizontalmente para usar filtros y leer la lista de subrayados; es especialmente fácil no advertirlo porque sin datos el selector no contiene el título largo.
  Corrección recomendada: en el corte móvil dar a la etiqueta del filtro `min-width: 0` y ancho disponible, y al `select` `max-width: 100%` (o ancho completo). Añadir una prueba E2E que cree un subrayado de un manual con título largo y compruebe `scrollWidth === clientWidth` a 360 y 390 px.

- [T036-UX-02] Severidad: media
  Ubicación: `src/components/highlighting.ts:41-58`, `src/components/highlighting.ts:100-116`, `src/components/highlighting.ts:166-178`
  Evidencia: cada registro conserva `position` y una versión de contenido, pero al redibujar se busca solo la cita y se acepta la mejor coincidencia aunque su contexto no coincida. Si una edición elimina el contexto, pero deja una cita idéntica en otra sección, `findQuote()` la puede anclar allí en vez de devolverla como ausente; `position` no interviene en la decisión.
  Consecuencia: una nota privada puede reaparecer junto a una frase homónima equivocada sin mostrar el aviso «Este texto cambió…», lo que hace poco fiable el salto «Ir a la sección» después de una revisión editorial.
  Corrección recomendada: usar `position` como desempate y límite de desplazamiento, exigir coincidencia de contexto mínima para reanclar y marcar como pendiente/ausente los empates o coincidencias débiles. Conservar en la lista una acción explícita para reubicar o borrar el subrayado. Cubrir con una prueba de dos citas iguales en secciones distintas tras cambiar la primera.

- [T036-A11Y-03] Severidad: media
  Ubicación: `src/components/highlighting.ts:140-163`; `src/styles/app.css:325-331`
  Evidencia: en el árbol de accesibilidad, una marca con nota se expone como un contenedor genérico cuyo texto termina en «✎»; no anuncia que es un subrayado, su color ni que contiene una nota. El lápiz procede de `::after`, por lo que tampoco tiene una alternativa semántica propia.
  Consecuencia: una persona que use lector de pantalla no recibe la misma señal que una persona que ve la marca y puede no descubrir que al activarla puede leer o editar una nota.
  Corrección recomendada: dar a cada `mark` un nombre o descripción que conserve la cita y añada «Subrayado [color]» y, si aplica, «con nota; activar para editar». Hacer decorativo el lápiz para tecnología asistiva o convertirlo en un elemento con etiqueta adecuada. Si se usa texto solo para lector, excluirlo del mapa de texto que calcula las posiciones. Verificar finalmente con NVDA y VoiceOver, además de axe.

- [T036-UX-04] Severidad: baja
  Ubicación: `src/components/highlighting.ts:140-178`; `src/components/HighlightLayer.tsx:87-90`
  Evidencia: los subrayados se dibujan en secuencia; al superponerse, uno queda anidado dentro de otro. Al tocar el texto, `closest('mark[data-hl-id]')` abre únicamente el más interno. La lista al final de la lección permite editar ambos, pero no existe forma de elegir el otro directamente en el pasaje.
  Consecuencia: con dos colores o notas sobre el mismo fragmento, cambiar o borrar el primero desde la lectura resulta confuso y parece que solo existe una marca.
  Corrección recomendada: impedir o fusionar solapamientos al crearlos, o mostrar en el editor un selector de «N subrayados en este texto» para que cada uno sea alcanzable. Añadir una prueba de creación, edición y borrado de dos rangos parcialmente superpuestos.

- [T036-QA-05] Severidad: baja
  Ubicación: `e2e/flujos.spec.ts` y `e2e/rutas.spec.ts`
  Evidencia: la cobertura actual recorre crear una marca, anotarla, repasar y saltar, pero no reproduce los bordes observados: selector con título largo, cambio de color, Esc, selección entre nodos con formato/cita, bloque de código, solapamiento ni reanclaje tras cambios. Durante esta revisión `npm run e2e` no pudo iniciar porque `http://localhost:4174` ya estaba ocupado y su configuración no permite reutilizar ese servidor; por tanto no se declara una nueva pasada E2E satisfactoria.
  Consecuencia: los regresiones de móvil y de anclaje pueden volver a pasar inadvertidas aunque el recorrido básico siga verde.
  Corrección recomendada: añadir los casos anteriores y hacer que el servidor E2E se aísle o reutilice explícitamente según la política del proyecto. Repetir la suite en una sesión sin el puerto ocupado antes de cerrar el arreglo.

## Verificado sin hallazgo

- En móvil estrecho y escritorio se creó un subrayado, se añadió una nota, se cambió de amarillo a verde y se cerró con `Esc`; la nota se guardó y el foco del editor estuvo en el campo de nota al abrirse.
- La barra de selección expone un `toolbar` con nombres «Subrayar en amarillo/verde/rosa/azul»; el editor expone color seleccionado, nota, «Listo» y «Borrar subrayado». Los botones de color miden 44 × 44 px.
- La lista al final de la lección, los filtros por color, «solo con nota», el modo repaso, «Mostrar el subrayado» e «Ir a la sección» funcionaron. El salto llegó al encabezado correcto y activó el destello. El destello respeta `prefers-reduced-motion`.
- Los cuatro fondos mantienen contraste alto con el texto principal oscuro: amarillo 12,70:1, verde 11,66:1, rosa 10,79:1 y azul 11,49:1. La línea inferior añade una señal visual de que existe una marca; no sustituye el anuncio textual necesario para lector de pantalla.
- La lógica de envoltura divide nodos de texto, por lo que una selección que atraviesa negritas o una cita no pierde el enlace. Se pudo seleccionar un fragmento de un bloque de código; es una capacidad funcional actualmente permitida, no un rechazo automático.
- La lista de la lección sí muestra «Este texto cambió desde que hiciste el subrayado.» cuando no encuentra ninguna cita. El caso de coincidencia repetida queda cubierto por T036-UX-02.

## Pendiente de comprobación manual en dispositivo

El navegador de revisión no expone el menú nativo de selección de Android ni de iOS. La barra fija inferior funcionó en la web móvil revisada, pero falta comprobar en un teléfono real una selección junto al borde inferior con el menú nativo abierto y, con teclado virtual, el editor con nota larga. También falta una pasada con NVDA/VoiceOver para validar la propuesta de T036-A11Y-03.

## Propuesta de tokens

Los ocho hexadecimales de subrayado deberían salir del sistema de diseño, no quedar duplicados en las reglas `.hl` y `.hl-swatch`. Propongo un grupo semántico `color.highlight` con pares `yellow|green|pink|blue.surface` y `yellow|green|pink|blue.underline`; el componente reutilizaría esos pares para texto, barra y filtros. Mantener `color.focus` como token separado para el destello: la animación ya usa ese token y no debe codificar un quinto color de subrayado.

## Comprobaciones ejecutadas

- `npm test`: 14 archivos, 186 pruebas correctas.
- `npm run e2e`: no inició una nueva ejecución porque el puerto 4174 ya estaba en uso; ver T036-QA-05.
- Navegador: recorrido funcional en lección M02 L1, lista de la lección y `#/notas`; vista móvil estrecha y 1280 × 800.

# T-054 — Revisión visual de portadas y figuras publicadas

**Codex · 2026-10-27**

## Alcance y método

Revisé la publicación en `https://dponch00.github.io/Ai-School/` con
viewports de 360 × 780 y 1280 × 900 px. Recorrí la página de cursos y la
portada de M01 a M10, haciendo visible cada imagen de carga diferida antes de
medir su recurso, tamaño natural y caja mostrada. Revisé también el diagrama
de M02 L4 y las figuras de M03 L1, M08 L3 y M09 L5 en los dos anchos, incluidos
el texto que las antecede y sucede y sus textos alternativos.

Para la comprobación sin red abrí todos los recursos una vez, esperé al service
worker y su controlador, recargué, desactivé la red y recorrí otra vez la página
de cursos y las cuatro figuras. El controlador quedó activo y todas conservaron
un tamaño natural distinto de cero. Las capturas están en `design/qa/T-054/`:
`courses-*`, `cover-<curso>-*`, `figure-<lección>-*` y
`offline-figure-<lección>-mobile.jpg`.

## Hallazgos

- [T054-V01] Severidad: media
  Ubicación: portadas de M01 a M10 en escritorio; evidencia representativa:
  `design/qa/T-054/cover-m10-desktop.jpg`
  Evidencia: a 1280 × 900 px la imagen de cada portada mide 1120 × 630 px y
  empieza en y=141; termina prácticamente al final de la ventana. El título
  HTML queda debajo de la imagen y no aparece en el primer pliegue, aunque sí
  es visible de inmediato a 360 px.
  Consecuencia: al llegar a una portada desde la biblioteca en escritorio se ve
  la ilustración, pero no qué manual es ni su pregunta orientadora sin hacer
  desplazamiento; tampoco se aprovecha el espacio alto derecho que los briefs
  reservaron para el título.
  Corrección recomendada: en escritorio limitar la altura visual de la portada
  para que título y pregunta entren en el primer pliegue, o disponer ambos
  sobre la zona superior derecha despejada con contraste y fondo adecuados.

## Verificaciones

Verificado: las diez tarjetas de curso y las diez portadas cargan en móvil su
versión `*-480.webp` a 326–328 × 183–185 px. En escritorio, las tarjetas usan
la variante de 480 px a 361 × 203 px y cada portada usa `*-1600.webp` a
1120 × 630 px. Ninguna portada quedó vacía, borrosa o con un recorte que pierda
su motivo: bifurcación, caminos brumosos, marco, delta, zigzag, estratos,
puentes, arroyos y ruta directa, marcas de medida y costa con faro se
reconocen a 360 px. El título HTML queda fuera de la imagen en ambas vistas, de
modo que no depende de contraste sobre la ilustración.

Verificado: M02 L4 muestra su SVG a 328 × 601 px en móvil y 480 × 880 px en
escritorio sin perder nitidez. M03 L1, M08 L3 y M09 L5 muestran sus WebP de
960 × 720 px a 328 × 246 y 480 × 360 px, respectivamente. Cada una aparece
inmediatamente después del texto que plantea su metáfora y antes del texto que
la desarrolla: ventana limitada, piezas que no encajan y capas que dejan pasar
algo distinto. Aportan orientación visual sin sustituir la explicación.

Verificado: las tres figuras raster tienen textos alternativos descriptivos y
acotados a lo visible. El de M03 describe el marco y las capas; el de M08 las
franjas que convergen y no calzan; el de M09 las tres hojas y el rayo que se
detiene en la segunda. El SVG de M02 enumera las piezas rotuladas del diagrama,
lo que es apropiado porque contiene texto que no se debe perder para quien usa
lector de pantalla. Las portadas llevan `alt=""`: son ilustraciones decorativas
junto a un enlace, un código de curso, un título y una descripción ya
disponibles como texto, por lo que no repiten información al lector de pantalla.

Verificado: después de la primera carga, el service worker controló la página
en móvil sin red. Las diez portadas de 480 px y el SVG/los tres WebP de las
figuras cargaron de nuevo con dimensiones naturales válidas; las capturas
`offline-*` conservan esa evidencia.

## Resultado

La carga, selección responsiva, recorte, figuras, alternativas de texto y modo
sin conexión se comportan como se esperaba. Queda un ajuste de jerarquía en
escritorio: mantener visible el título de cada manual junto a su portada en el
primer pliegue.

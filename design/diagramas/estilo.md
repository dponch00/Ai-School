# Diagramas explicativos: guía de estilo

> Escrita por Claude Code el 2026-10-30. Toma como referencia `content/courses/m01/diagrams/m01-l5-chat-api.svg`, que Daniel eligió como modelo. Es la guía para todos los diagramas del plan (`design/diagramas/plan.md`).

## Qué es un diagrama aquí

Un SVG **escrito con código**, nunca hecho con un generador de imágenes. Lleva texto, flechas y estructura exacta, y por eso tiene que poder leerse y corregirse línea por línea (AGENTS.md: «Diagramas, cifras y arquitectura exacta se hacen en SVG/código»).

Responde **una sola pregunta pedagógica** de su lección. Si hacen falta dos preguntas, son dos diagramas, o el segundo sobra.

## Formato

- **Lienzo:** `viewBox="0 0 480 H"`, con un alto entre 480 y 900. Se diseña para el celular: a 360 px de ancho tiene que leerse sin acercar la imagen. Nada de diagramas apaisados que obliguen a achicar el texto.
- **Fondo:** un `rect` del tamaño completo, con `rx="18"` y fill `#FFFDF7`. El diagrama lleva su propio fondo claro y se ve igual en el modo oscuro, como las demás figuras.
- **Accesibilidad:** `role="img"` y `aria-labelledby` apuntando a un `<title>` y un `<desc>`. El `desc` dice lo mismo que el texto alternativo.
- **Tipografía:**
  - Títulos y rótulos fuertes: `Fraunces, Georgia, serif`, en negrita, de 20 a 24.
  - Texto: `'Source Serif 4', Georgia, serif`, de 15 a 18.
  - Ningún texto baja de 15 unidades del viewBox.
- **Sin** fuentes incrustadas, imágenes raster, `foreignObject` ni scripts. El archivo debería pesar menos de 12 KB.

## Paleta (tokens de `design/tokens.json`)

| Uso | Color |
| --- | --- |
| Texto principal, trazos fuertes | `#172A33` (ink) |
| Texto secundario, flechas de vuelta | `#4D6265` (muted) |
| Bordes, separadores, líneas punteadas | `#778984` (border) |
| Énfasis, conclusión, advertencia (con moderación) | `#A94E2B` (accent) |
| Actor principal (el modelo, el sistema que decide) | `#006E74` (focus) con texto blanco |
| Superficie secundaria | `#DCECF5` (selection) y `#F5F0E6` (canvas) |
| Correcto o falla | `#23694D` (success) y `#A53636` (danger), solo cuando el sentido lo pide |
| Cajas | `#FFFFFF` con borde `#778984` de 2 px y `rx` de 12 a 14 |

No se agregan colores fuera de esta tabla.

## Composición

- **Orden de lectura:** de arriba hacia abajo. Si hay dos vías, van apiladas (como chat y API), no lado a lado.
- **Flechas:** trazo de 3 px con punta abierta. La ida va en ink y la vuelta en muted.
- **Rótulos:** de una a cuatro palabras. La frase de conclusión, al pie, en accent y en una sola línea.
- **Etiquetas:** salen del texto de la lección, con sus mismos términos. No se agregan afirmaciones nuevas, cifras que la lección no da ni nombres de productos o proveedores.
- **Datos:** los del caso sintético de Altiplano que usa la lección. No van datos reales.
- **Íconos:** formas simples (persona, documento, carpeta, llave, engranaje, reloj) dibujadas con primitivas, sin logos.

## Revisión antes de entregar

1. Ningún texto se sale de su caja ni toca otra forma. El círculo del actor principal tiene un radio de al menos 46 para que quepa «Modelo» o similar.
2. A 360 px se lee todo, en claro y en oscuro (el diagrama mantiene su fondo claro).
3. El `alt` (en `assets.json`) y el `desc` cuentan lo mismo que el dibujo, en el orden de lectura.
4. Cada rótulo existe en la lección o es una paráfrasis directa de ella.

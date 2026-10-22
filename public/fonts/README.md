# Fuentes locales de AI School

Descarga verificada el 2026-10-21 mediante la hoja oficial de Google Fonts con un agente Chromium. Los tres archivos WOFF2 son subconjuntos `latin`; incluyen `á é í ó ú ñ ü ¿ ¡` dentro de U+0000–00FF.

| Archivo | Familia y pesos | URL WOFF2 oficial |
| --- | --- | --- |
| `source-serif-4-latin.woff2` | Source Serif 4, 400–700 | `https://fonts.gstatic.com/s/sourceserif4/v15/vEFF2_tTDB4M7-auWDN0ahZJW3IX2ih5nk3AucvUHf6kDXr4.woff2` |
| `fraunces-latin.woff2` | Fraunces, 600–700 | `https://fonts.gstatic.com/s/fraunces/v38/6NU78FyLNQOQZAnv9bYEvDiIdE9Ea92uemAk_WBq8U_9v0c2Wa0KxC9TeA.woff2` |
| `ibm-plex-mono-latin.woff2` | IBM Plex Mono, 400–600 | `https://fonts.gstatic.com/s/ibmplexmono/v20/-F63fjptAgt5VM-kVkqdyU8n1i8q1w.woff2` |

Cada familia se distribuye bajo SIL Open Font License 1.1. Sus copias se mantienen como `OFL-SourceSerif4.txt`, `OFL-Fraunces.txt` y `OFL-IBMPlexMono.txt`.

```css
@font-face { font-family: 'Source Serif 4'; src: url('/fonts/source-serif-4-latin.woff2') format('woff2'); font-weight: 400 700; font-style: normal; font-display: swap; }
@font-face { font-family: 'Fraunces'; src: url('/fonts/fraunces-latin.woff2') format('woff2'); font-weight: 600 700; font-style: normal; font-display: swap; }
@font-face { font-family: 'IBM Plex Mono'; src: url('/fonts/ibm-plex-mono-latin.woff2') format('woff2'); font-weight: 400 600; font-style: normal; font-display: swap; }
```

Las URLs de Google Fonts pueden cambiar cuando cambie una versión. Si ocurre, descargar de los repositorios oficiales indicados en `docs/design-system.md`, conservar el subconjunto latino y actualizar esta tabla y el archivo OFL correspondiente.

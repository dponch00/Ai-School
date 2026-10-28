/// <reference types="vitest/config" />
import react from '@vitejs/plugin-react'
import { fileURLToPath } from 'node:url'
import { defineConfig } from 'vite'
import { VitePWA } from 'vite-plugin-pwa'

// Build de un solo archivo para la versión de prueba del celular: sin fragmentos ni SW (AIS_SINGLE=1).
const single = process.env.AIS_SINGLE === '1'

// Ruta base: '/' en local; '/Ai-School/' en GitHub Pages (AIS_BASE lo fija el flujo de despliegue).
const base = process.env.AIS_BASE ?? '/'

export default defineConfig({
  base,
  ...(single
    ? {
        build: { outDir: 'dist-single', rolldownOptions: { output: { codeSplitting: false } } },
        resolve: { alias: { 'virtual:pwa-register/react': fileURLToPath(new URL('./src/app/pwa-stub.ts', import.meta.url)) } },
      }
    : {}),
  plugins: [
    react(),
    // PWA (F2-04, D-014): SW propio con injectManifest y actualización solo cuando Daniel la acepta.
    !single &&
    VitePWA({
      strategies: 'injectManifest',
      srcDir: 'src/sw',
      filename: 'sw.ts',
      registerType: 'prompt',
      injectRegister: false,
      // Los íconos ya entran por globPatterns; sin esto se precachearían dos veces.
      includeManifestIcons: false,
      manifest: {
        name: 'AI School',
        short_name: 'AI School',
        description: 'Academia personal de IA aplicada: manuales, laboratorios y exámenes de opción múltiple.',
        lang: 'es',
        start_url: base,
        scope: base,
        display: 'standalone',
        background_color: '#F5F0E6',
        theme_color: '#172A33',
        // Íconos D1 de Codex (T-018). El de 512 sirve también como maskable: el motivo respeta la zona segura.
        icons: [
          { src: `${base}icons/icon.svg`, sizes: 'any', type: 'image/svg+xml', purpose: 'any' },
          { src: `${base}icons/icon-192.png`, sizes: '192x192', type: 'image/png', purpose: 'any' },
          { src: `${base}icons/icon-512.png`, sizes: '512x512', type: 'image/png', purpose: 'any' },
          { src: `${base}icons/icon-maskable-512.png`, sizes: '512x512', type: 'image/png', purpose: 'maskable' },
        ],
      },
      injectManifest: {
        // Shell completo para el celular, con los paquetes de todos los cursos (unos 2 MB): al instalarse, la app
        // queda entera sin conexión. Las imágenes de 1600 px solo se piden en pantallas anchas.
        globPatterns: ['**/*.{js,css,html,woff2,svg}', 'courses/*.json', 'generated/**/*.webp', 'images/*-480.webp', 'images/*-960.webp', 'icons/*.png'],
        globIgnores: ['ai-school-m02-prueba.html'],
        maximumFileSizeToCacheInBytes: 3 * 1024 * 1024,
      },
      devOptions: { enabled: false },
    }),
  ],
  test: {
    include: ['src/**/*.test.ts'],
  },
})

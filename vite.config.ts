/// <reference types="vitest/config" />
import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'
import { VitePWA } from 'vite-plugin-pwa'

// Origen propio en <org>.github.io (D-013), por eso base '/'.
export default defineConfig({
  base: '/',
  plugins: [
    react(),
    // PWA (F2-04, D-014): SW propio con injectManifest y actualización solo cuando Daniel la acepta.
    VitePWA({
      strategies: 'injectManifest',
      srcDir: 'src/sw',
      filename: 'sw.ts',
      registerType: 'prompt',
      injectRegister: false,
      manifest: {
        name: 'AI School',
        short_name: 'AI School',
        description: 'Academia personal de IA aplicada: manuales, laboratorios, exámenes y expediente de aprendizaje.',
        lang: 'es',
        start_url: '/',
        scope: '/',
        display: 'standalone',
        background_color: '#F5F0E6',
        theme_color: '#172A33',
        icons: [{ src: '/icons/icon.svg', sizes: 'any', type: 'image/svg+xml', purpose: 'any' }],
      },
      injectManifest: {
        // Shell completo para el celular: las imágenes de 1600 px solo se piden en pantallas anchas.
        globPatterns: ['**/*.{js,css,html,woff2,svg}', 'images/*-480.webp', 'images/*-960.webp'],
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

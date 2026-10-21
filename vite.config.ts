/// <reference types="vitest/config" />
import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// Origen propio en <org>.github.io (D-013), por eso base '/'.
export default defineConfig({
  base: '/',
  plugins: [react()],
  test: {
    include: ['src/**/*.test.ts'],
  },
})

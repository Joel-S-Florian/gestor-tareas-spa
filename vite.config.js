import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    // Mismo origen que el SPA: la cookie HttpOnly del refresh token viaja sin problemas de CORS/SameSite.
    proxy: { '/api': { target: 'https://localhost:52411', secure: false } }
  },
  test: {
    environment: 'jsdom',
    include: ['src/**/*.test.{js,jsx}']
  }
})

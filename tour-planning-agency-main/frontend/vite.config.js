import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
  ],
  server: {
    port: 5173,
    open: true,          // auto-opens browser on npm run dev
    host: 'localhost',
    historyApiFallback: true,
    proxy: {
      // Proxy all /api/* calls → backend:5000 — eliminates CORS issues in dev
      '/api': {
        target: 'http://localhost:5000',
        changeOrigin: true,
        secure: false,
      },
    },
  },
})

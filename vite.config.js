import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api/cohere': {
        target: 'https://api.cohere.ai',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api\/cohere/, '')
      },
      '/api/finance': {
        target: 'https://query1.finance.yahoo.com',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api\/finance/, '')
      },
      '/api/mandi': {
        target: 'https://api.data.gov.in',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api\/mandi/, '')
      }
    }
  }
})

import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  appType: 'spa',       // enables automatic history API fallback for SPA routing
  server: {
    port: 5173,
    strictPort: true,   // fail instead of picking a random port
  },
})

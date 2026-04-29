import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  base: "/",              // ensures assets are served from root — required for Vercel
  appType: 'spa',         // enables history API fallback in dev server
  server: {
    port: 5173,
    strictPort: true,     // fail instead of picking a random port
  },
})

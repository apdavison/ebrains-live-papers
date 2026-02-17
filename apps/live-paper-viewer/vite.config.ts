import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/ws': {
        target: 'wss://bluenaas-single-cell-svc.apps.ebrains.eu',
        ws: true,
        changeOrigin: true,
        headers: {
          Origin: 'https://live-papers.apps.ebrains.eu',
        },
      },
    },
  },
})

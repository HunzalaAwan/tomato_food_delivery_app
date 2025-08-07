import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  preview: {
    host: '0.0.0.0',
    port: 5174, // or 4173, or whatever you map in docker-compose
  },
  plugins: [react()],
})

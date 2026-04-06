import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// Alternative config for Vite (lighter than CRA)
// To use: npm install vite @vitejs/plugin-react
// Then: npm run dev (instead of npm start)

export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
    host: true
  },
  build: {
    outDir: 'build'
  }
})
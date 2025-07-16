import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  base: './',
  build: {
    outDir: '.', // 👈 Build directly to the root
    emptyOutDir: false, // Do not delete everything in root!
  },
})
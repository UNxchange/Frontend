import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { resolve } from 'path'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src'),
      '@atoms': resolve(__dirname, 'src/atoms'),
      '@molecules': resolve(__dirname, 'src/molecules'),
      '@organisms': resolve(__dirname, 'src/organisms'),
      '@pages': resolve(__dirname, 'src/pages'),
      '@scripts': resolve(__dirname, 'src/scripts'),
      '@assets': resolve(__dirname, 'src/assets'),
    }
  },
  server: {
    port: 3000,
  }
})
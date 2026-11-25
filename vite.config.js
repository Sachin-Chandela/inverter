import { defineConfig } from 'vite'
import preact from '@preact/preset-vite'
import viteCompression from 'vite-plugin-compression'

export default defineConfig({
  plugins: [
    preact(),
    viteCompression({ algorithm: 'gzip', deleteOriginFile: true }),
  ],
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:3000',
        changeOrigin: true,
      },
      '/write.html': {
        target: 'http://localhost:3000',
        changeOrigin: true,
      },
    },
  },
})
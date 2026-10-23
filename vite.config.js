import preact from '@preact/preset-vite'
import viteCompression from 'vite-plugin-compression'
import { defineConfig } from 'vite'

export default defineConfig({
  plugins: [
    preact(),
    viteCompression({ algorithm: 'gzip', deleteOriginFile: true }),
  ],
})
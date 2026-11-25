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
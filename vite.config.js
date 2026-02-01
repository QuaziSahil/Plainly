import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  esbuild: {
    // Use esbuild for production bundling
    minify: true,
  },
  build: {
    // Use esbuild instead of rollup for minification
    minify: 'esbuild',
    // Disable tree-shaking analysis that's causing issues
    rollupOptions: {
      treeshake: false
    }
  }
})

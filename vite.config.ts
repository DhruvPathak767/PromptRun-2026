import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
  ],
  build: {
    chunkSizeWarningLimit: 1000,
    rollupOptions: {
      output: {
        manualChunks(id: string) {
          const norm = id.replace(/\\/g, '/')
          if (norm.includes('three') || norm.includes('@react-three')) {
            return 'vendor-three'
          }
          if (norm.includes('node_modules/recharts')) {
            return 'vendor-charts'
          }
          if (norm.includes('node_modules/framer-motion')) {
            return 'vendor-motion'
          }
          if (
            norm.includes('node_modules/react/') ||
            norm.includes('node_modules/react-dom/') ||
            norm.includes('node_modules/react-router')
          ) {
            return 'vendor-react'
          }
        },
      },
    },
  },
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: './src/test/setup.ts',
  },
})

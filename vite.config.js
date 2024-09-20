import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

export default defineConfig({
  plugins: [vue()],
  build: {
    rollupOptions: {
      output: {
        format: 'iife'
      }
    },
  },
  esbuild: { legalComments: 'none' }
})

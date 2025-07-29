// fullstack-app/frontend/vite.config.ts

import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),          // ✅ Alias frontend
      '@shared': path.resolve(__dirname, '../shared') // ✅ Alias vers code partagé
    },
  },
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:5000',
        changeOrigin: true,
        secure: false
        // ✅ On supprime le rewrite pour conserver le /api
      },
    },
  },
  build: {
    outDir: 'dist',
    emptyOutDir: true
  },
});

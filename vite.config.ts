import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          // Split React and ReactDOM into their own chunk
          'react-vendor': ['react', 'react-dom'],
          // Split Highcharts into its own chunk (largest dependency)
          'highcharts-vendor': ['highcharts', 'highcharts/modules/map.js', 'highcharts-react-official'],
        },
      },
    },
    // Increase chunk size warning limit to 600kb for vendor chunks
    chunkSizeWarningLimit: 600,
    // Enable source maps for better debugging (optional, can be disabled for smaller builds)
    sourcemap: false,
  },
})

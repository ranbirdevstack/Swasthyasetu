import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa';

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['favicon.ico', 'about-banner.png'],
      manifest: {
        name: 'SwasthyaSetu Rural Health',
        short_name: 'SwasthyaSetu',
        description: 'Offline-first rural triage and referral continuity platform',
        theme_color: '#0b8f87',
        background_color: '#ffffff',
        display: 'standalone',
        start_url: '/',
        icons: [
          {
            src: '/favicon.ico',
            sizes: '64x64 32x32 24x24 16x16',
            type: 'image/x-icon'
          }
        ]
      },
      workbox: {
        globPatterns: ['**/*.{js,css,html,svg,png,ico}'],
        runtimeCaching: [
          {
            // Cache OpenStreetMap map tiles for offline map views
            urlPattern: /^https:\/\/[a-c]\.tile\.openstreetmap\.org\/.*/i,
            handler: 'CacheFirst',
            options: {
              cacheName: 'osm-map-tiles',
              expiration: {
                maxEntries: 500,
                maxAgeSeconds: 60 * 60 * 24 * 30 // Cache tiles for 30 days
              },
              cacheableResponse: {
                statuses: [0, 200]
              }
            }
          }
        ]
      }
    })
  ],
  server: {
    port: 5173,
    proxy: {
      '/api': {
        target: 'http://localhost:5003', // <-- Change from 5000 to 5003
        changeOrigin: true,
      },
      '/socket.io': {
        target: 'http://localhost:5003', // <-- Change from 5000 to 5003
        changeOrigin: true,
        ws: true,
      }
    }
  }

});
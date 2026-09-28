import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { VitePWA } from 'vite-plugin-pwa'

// https://vitejs.dev/config/
export default defineConfig({
  base: '/',
  server: {
    host: 'localhost',
    port: 5174,
    strictPort: true
  },
  // base: '/siteuse/',
  plugins: [
    vue(),
    VitePWA({
      workbox: {
        navigateFallbackDenylist: [/^\/admin\/?/, /^\/aulavirtual\//, /^\/intranet\//]
      },
      includeAssets: [
        './icons/favicon.ico'
        // 'apple-touch-icon.png',
        // 'mask-icon.svg'
      ],
      manifest: {
        name: 'Segunda Especialidad - FCS',
        short_name: 'Segunda Especialidad',
        description: 'Segunda Especialidad - FCS App',
        theme_color: '#ffffff',
        lang: 'es',
        icons: [
          {
            src: './icons/android-icon-192x192.png',
            sizes: '192x192',
            type: 'image/png'
          }
        ]
      }
    })
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  },
  build: {
    outDir: 'siteuse'
  }
})

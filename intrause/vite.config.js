import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { VitePWA } from 'vite-plugin-pwa'

// https://vitejs.dev/config/
export default defineConfig({
    base: '/intranet/',
    plugins: [
        vue(),
        VitePWA({
            includeAssets: [
                './pwa-icons/favicon.ico',
                // 'apple-touch-icon.png',
                // 'mask-icon.svg'
            ],
            manifest: {
                name: 'Intranet USE',
                short_name: 'Intranet USE',
                description: 'Intranet USE App',
                theme_color: '#ffffff',
                icons: [
                    {
                        src: './pwa-icons/android-chrome-192x192.png',
                        sizes: '192x192',
                        type: 'image/png'
                    },
                    {
                        src: './pwa-icons/android-chrome-512x512.png',
                        sizes: '512x512',
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
        outDir: 'intranet'
    }
})

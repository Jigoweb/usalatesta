import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'
import { readFileSync } from 'fs'

const pkg = JSON.parse(readFileSync('./package.json', 'utf-8'))

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      strategies: 'injectManifest',
      srcDir: 'src',
      filename: 'sw.js',
      registerType: 'autoUpdate',
      includeAssets: ['favicon.svg', 'offline.html'],
      manifest: {
        id: '/app',
        version: pkg.version,
        name: 'USA LA TESTA - Gioco Responsabile',
        short_name: 'USA LA TESTA',
        description: "App per la sensibilizzazione sul gioco d'azzardo responsabile",
        start_url: "/",
        theme_color: '#1e3a8a',
        background_color: '#ffffff',
        display: 'standalone',
        lang: 'it',
        orientation: 'portrait',
        icons: [
          {
            src: 'pwa-192x192.png',
            sizes: '192x192',
            type: 'image/png'
          },
          {
            src: 'pwa-512x512.png',
            sizes: '512x512',
            type: 'image/png'
          },
          {
            src: 'pwa-512x512.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'any maskable'
          }
        ],
        screenshots: [
          {
            src: '/assets/pwa/screenshot-timer.png',
            sizes: '1440x2560',
            type: 'image/png',
            form_factor: 'narrow',
            label: 'Timer'
          },
          {
            src: '/assets/pwa/screenshot-quiz.png',
            sizes: '1440x2560',
            type: 'image/png',
            form_factor: 'narrow',
            label: 'Test di autovalutazione'
          },
          {
            src: '/assets/pwa/screenshot-home.png',
            sizes: '1440x2560',
            type: 'image/png',
            form_factor: 'narrow',
            label: 'Home'
          },
          {
            src: '/assets/pwa/screenshot-help.png',
            sizes: '1440x2560',
            type: 'image/png',
            form_factor: 'narrow',
            label: 'Help'
          },
          {
            src: '/assets/pwa/screenshot-articles.png',
            sizes: '1440x2560',
            type: 'image/png',
            form_factor: 'narrow',
            label: 'Articles'
          }
        ]
      }
    })
  ],
  assetsInclude: ['**/*.glb', '**/*.usdz'],
})
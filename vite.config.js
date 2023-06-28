// Plugins
import vue from '@vitejs/plugin-vue'
import vuetify, { transformAssetUrls } from 'vite-plugin-vuetify'
import i18n from '@intlify/unplugin-vue-i18n/vite'
import unfonts from 'unplugin-fonts/vite'

// Utilities
import { defineConfig } from 'vite'
import { resolve, dirname } from 'node:path'
import { fileURLToPath, URL } from 'node:url'

export default defineConfig({
  plugins: [
    vue({
      template: { transformAssetUrls }
    }),
    vuetify({
      autoImport: true
    }),
    i18n({
      include: resolve(dirname(fileURLToPath(import.meta.url)), './src/locales/***')
    }),
    unfonts({
      fontsource: {
        families: [
          'ABeeZee',
          {
            name: 'Roboto',
            weights: [100, 300, 400, 500, 700, 900],
            styles: ['italic', 'normal']
          }
        ]
      }
    })
  ],
  base: '/square-gps/',
  define: { 'process.env': {} },
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    },
    extensions: [
      '.js',
      '.json',
      '.jsx',
      '.mjs',
      '.ts',
      '.tsx',
      '.vue'
    ]
  },
  server: {
    port: 3000,
  },
})

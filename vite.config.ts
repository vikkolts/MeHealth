import { fileURLToPath, URL } from 'url';
import path from 'path';
import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import { VitePWA } from 'vite-plugin-pwa';
import vueI18n from '@intlify/vite-plugin-vue-i18n';

// https://vitejs.dev/config/
export default defineConfig({
  base: '/MeHealth/',
  plugins: [
    vue(),
    VitePWA({
      includeAssets: ['favicon.svg', 'favicon.ico', 'robots.txt', 'apple-touch-icon.png'],
      manifest: {
        name: 'MeHealth - your mood tracker',
        short_name: 'MeHealth',
        description: 'This app allows to track your mood in iOS like app style with calendar. No user trackers, runs offline',
        theme_color: '#f2f1f6',
        background_color: '#000000',
        display: 'standalone',
        icons: [
          {
            src: 'img/icons/pwa-192x192.png',
            sizes: '192x192',
            type: 'image/png',
            purpose: 'maskable any',
          },
          {
            src: 'img/icons/pwa-512x512.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'maskable any',
          },
        ],
        shortcuts: [
          {
            name: 'Summary',
            short_name: 'Summary',
            url: '/summary',
            icons: [
              {
                src: 'img/icons/heart-96-filled.png',
                sizes: '96x96',
              },
            ],
          },
          {
            name: 'Calendar',
            short_name: 'Calendar',
            url: '/calendar',
            icons: [
              {
                src: 'img/icons/calendar-96-filled.png',
                sizes: '96x96',
              },
            ],
          },
        ],
      },
    }),
    vueI18n({
      // if you want to use Vue I18n Legacy API, you need to set `compositionOnly: false`
      // compositionOnly: false,
      include: path.resolve(__dirname, './src/locales/**'),
    }),
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
});

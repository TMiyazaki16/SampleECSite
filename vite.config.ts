import path from 'path'
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vuetify from 'vite-plugin-vuetify'
import AutoImport from 'unplugin-auto-import/vite'
import Components from 'unplugin-vue-components/vite'

export default defineConfig({
  plugins: [
    vue(),
    // なぜ vite-plugin-vuetify を使うか:
    // Vuetify のコンポーネントをオンデマンドでインポートし、
    // 使っていないコンポーネントをバンドルに含めないようにする（ツリーシェイク）。
    vuetify({ autoImport: true }),
    AutoImport({
      imports: [
        'vue',
        'vue-router',
        'pinia',
        '@vueuse/core',
        { 'vue-i18n': ['useI18n'] },
      ],
      dts: 'src/generated/auto-imports.d.ts',
      eslintrc: { enabled: false },
    }),
    // ローカルコンポーネント（organisms 等）の自動インポート
    Components({
      dirs: ['src/components'],
      dts: 'src/generated/components.d.ts',
    }),
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  server: {
    port: 5173,
    open: true,
  },
})

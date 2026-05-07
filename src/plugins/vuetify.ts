import 'vuetify/styles'
import '@mdi/font/css/materialdesignicons.css'
import { createVuetify } from 'vuetify'
import { aliases, mdi } from 'vuetify/iconsets/mdi'

// なぜ Vuetify プラグインを src/plugins/ に分離するか:
// main.ts をアプリの組み立てのみに集中させ、
// テーマ・アイコン・デフォルト設定といった UI ライブラリの詳細を
// プラグインファイルに封じ込める。

export const vuetify = createVuetify({
  icons: {
    defaultSet: 'mdi',
    aliases,
    sets: { mdi },
  },
  theme: {
    themes: {
      light: {
        colors: {
          primary: '#2563eb',
          'primary-darken-1': '#1d4ed8',
          secondary: '#64748b',
          error: '#dc2626',
          success: '#16a34a',
          warning: '#d97706',
          info: '#0ea5e9',
          surface: '#ffffff',
          background: '#f8fafc',
        },
      },
    },
  },
  defaults: {
    // なぜ defaults を設定するか:
    // 各コンポーネントで毎回 variant="outlined" を書く手間を省く。
    // デザインの一貫性をグローバル設定で保証する。
    VTextField: {
      variant: 'outlined',
      density: 'comfortable',
      hideDetails: 'auto',
    },
    VSelect: {
      variant: 'outlined',
      density: 'comfortable',
      hideDetails: 'auto',
    },
    VBtn: {
      variant: 'flat',
      style: 'text-transform: none; letter-spacing: 0;',
    },
    VCard: {
      elevation: 1,
    },
    VAlert: {
      variant: 'tonal',
    },
  },
})

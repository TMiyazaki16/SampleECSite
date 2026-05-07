import { createI18n } from 'vue-i18n'
import ja from '@/locales/ja.json'
import en from '@/locales/en.json'

// なぜ legacy: false か:
// Composition API (<script setup>) で useI18n() を使うために必須。
// Options API の $t() は <script setup> と組み合わせが悪く、
// 型推論も効かない。

// なぜ fallbackLocale: 'en' か:
// 日本語キーが未定義の場合に英語文字列を表示することで、
// 開発中の翻訳漏れをキー名の生文字列ではなく可読テキストで把握できる。
export const i18n = createI18n({
  legacy: false,
  locale: 'ja',
  fallbackLocale: 'en',
  messages: { ja, en },
  // n() で通貨フォーマットを使うために numberFormats を定義
  numberFormats: {
    ja: {
      currency: { style: 'currency', currency: 'JPY', minimumFractionDigits: 0 },
    },
    en: {
      currency: { style: 'currency', currency: 'JPY', minimumFractionDigits: 0 },
    },
  },
  // d() で日付フォーマットを使うために datetimeFormats を定義
  datetimeFormats: {
    ja: {
      short: { year: 'numeric', month: '2-digit', day: '2-digit' },
    },
    en: {
      short: { year: 'numeric', month: 'short', day: 'numeric' },
    },
  },
})

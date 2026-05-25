import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import router from './router'
import { i18n } from './config/i18n'
import { vuetify } from './plugins/vuetify'

// なぜ MSW を条件付きで初期化するか:
// Service Worker は本番ビルドには不要（実際の API を呼ぶ）。
// mock モード（npm run mock）時のみ起動し、backend モード（npm run dev）では起動しない。
// DEV && MODE==='development' 条件で動的 import することで、本番バンドルおよび
// backend モードのバンドルから MSW がツリーシェイクされ、バンドルサイズを増やさない。

// なぜ await worker.start() してから app.mount() するか:
// Service Worker の登録完了前に Vue が mount されると、
// onMounted で発生する最初の API コール（restoreSession 等）が
// MSW を素通りして 404 になる。await で順序を保証する。

async function bootstrap() {
  if (import.meta.env.DEV && import.meta.env.MODE === 'development') {
    const { worker } = await import('./mocks/browser')
    await worker.start({
      onUnhandledRequest: 'warn',
      // なぜ onUnhandledRequest: 'warn' か:
      // 開発中に MSW ハンドラが定義されていない API コールが
      // 素通りした場合、コンソールに即座に警告が出る。
      // 'error' にすると外部 CDN リクエスト等も止まるので 'warn' が適切。
    })
  }

  const app = createApp(App)

  app.use(i18n)
  app.use(createPinia())
  app.use(router)
  app.use(vuetify)

  app.mount('#app')
}

bootstrap()

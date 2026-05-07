import { setupWorker } from 'msw/browser'
import { handlers } from './handlers'

// なぜ setupWorker を使うか:
// ブラウザ環境では Service Worker が HTTP インターセプトを行う。
// Node.js 環境（Vitest 等）では setupServer を使う。
// browser.ts / server.ts を分けることでテスト環境との切り替えを容易にする。
export const worker = setupWorker(...handlers)

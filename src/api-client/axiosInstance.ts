import axios from 'axios'
import { config } from '@/config/env'

// なぜ共有インスタンスを作るか:
// リクエストインターセプター（Auth ヘッダー付与）と
// レスポンスインターセプター（401 グローバルハンドリング）を
// 1箇所に集約する。個別の fetch/axios.get() では漏れが生じる。

export const axiosInstance = axios.create({
  baseURL: config.apiBaseUrl,
  timeout: 10_000,
  headers: { 'Content-Type': 'application/json' },
})

// リクエストインターセプター: JWT をヘッダーに自動付与
axiosInstance.interceptors.request.use((reqConfig) => {
  const token = localStorage.getItem('token')
  if (token) {
    reqConfig.headers.Authorization = `Bearer ${token}`
  }
  return reqConfig
})

// レスポンスインターセプター: 401 → ログアウト + ログイン画面へ
// なぜここで処理するか:
// 「トークン切れなら自動でログアウト」は全 API 呼び出しに共通するルール。
// 各 service の try-catch に書くと漏れが生じる。
axiosInstance.interceptors.response.use(
  (response) => response,
  (error: unknown) => {
    // なぜ /auth/me を除外するか:
    // セッション復元は「トークンが有効か確かめる」処理であり、
    // 401 は想定内の結果。ここで window.location による強制遷移を
    // 行うとページ全体がリロードされ、ルートガードが組み立てた
    // ?redirect= が失われる。復元失敗は authService 側で logout 済み。
    const isSessionCheck = axios.isAxiosError(error) && error.config?.url === '/auth/me'

    if (
      axios.isAxiosError(error) &&
      error.response?.status === 401 &&
      !isSessionCheck
    ) {
      localStorage.removeItem('token')
      // router は循環 import を避けるため window.location で遷移
      if (window.location.pathname !== '/login') {
        window.location.href = '/login'
      }
    }
    return Promise.reject(error)
  }
)

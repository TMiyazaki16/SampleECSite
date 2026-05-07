import { authApi } from '@/api-client/authApi'
import { useAuthStore } from '@/stores/auth'
import type { LoginCredentials } from '@/types/api'
import type { User } from '@/types/user'

// なぜ service 層を設けるか:
// View はレイアウト・ナビゲーション・状態取得に専念し、
// 「ログインとはどういう処理か」というビジネスロジックをここに集約する。
// api-client を view が直接呼ばないことで、API 仕様変更の影響を
// service ファイル内に封じ込められる。
export const authService = {
  async login(credentials: LoginCredentials): Promise<User> {
    const authStore = useAuthStore()
    const { user, token } = await authApi.login(credentials)
    authStore.setToken(token)
    authStore.setUser(user)
    return user
  },

  // なぜ logout は API 失敗でもローカル状態をクリアするか:
  // トークンが無効・期限切れの場合、API 呼び出しが失敗しても
  // ユーザーを「ログイン済みだが認証できない」状態に放置しないため。
  async logout(): Promise<void> {
    const authStore = useAuthStore()
    try {
      await authApi.logout()
    } finally {
      authStore.logout()
    }
  },

  // restoreSession: ページリフレッシュ後のセッション復元
  // App.vue の onMounted から呼ばれる。
  // localStorage にトークンがある場合、/auth/me で有効性を確認し
  // ユーザー情報をストアに復元する。
  async restoreSession(): Promise<void> {
    const authStore = useAuthStore()
    if (!authStore.token) return

    try {
      const { user } = await authApi.me()
      authStore.setUser(user)
    } catch {
      authStore.logout()
    }
  },
}

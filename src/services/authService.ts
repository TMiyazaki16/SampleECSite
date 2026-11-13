import { authApi } from '@/api-client/authApi'
import { useAuthStore } from '@/stores/auth'
import type { LoginCredentials } from '@/types/api'
import type { User } from '@/types/user'

// なぜ service 層を設けるか:
// View はレイアウト・ナビゲーション・状態取得に専念し、
// 「ログインとはどういう処理か」というビジネスロジックをここに集約する。
// api-client を view が直接呼ばないことで、API 仕様変更の影響を
// service ファイル内に封じ込められる。

// なぜ復元処理を 1 つの Promise に保持するか:
// ルートガードは画面遷移のたびに実行されるため、毎回 /auth/me を
// 呼ぶと無駄なリクエストが発生する。また初回表示時は
// 「ガードの await」と「他の呼び出し元」が同時に復元を要求しうるため、
// 進行中の Promise を使い回して多重実行を防ぐ。
let restorePromise: Promise<void> | null = null

export const authService = {
  async login(credentials: LoginCredentials): Promise<User> {
    const authStore = useAuthStore()
    const { user, token } = await authApi.login(credentials)
    authStore.setToken(token)
    authStore.setUser(user)
    // ログイン済み = 復元済みとみなす（リロードまで再実行しない）
    restorePromise = Promise.resolve()
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
      restorePromise = null
    }
  },

  // restoreSession: ページリフレッシュ後のセッション復元
  // localStorage にトークンがある場合、/auth/me で有効性を確認し
  // ユーザー情報をストアに復元する。
  //
  // なぜ ensureSessionRestored() 経由で呼ぶ必要があるか:
  // user は永続化されていないため、リロード直後は token だけが存在し
  // isAuthenticated が false になる。ルートガードはこの復元の完了を
  // 待ってから認証判定を行わなければ、ログイン済みでもログイン画面へ
  // 飛ばされる（= 本不具合の原因）。
  async restoreSession(): Promise<void> {
    const authStore = useAuthStore()
    if (!authStore.token) return

    try {
      const { user } = await authApi.me()
      authStore.setUser(user)
    } catch {
      // トークンが無効・期限切れの場合はローカル状態を破棄し、
      // ガードに未認証として扱わせる
      authStore.logout()
    }
  },

  // ensureSessionRestored: 復元の完了を保証する（多重実行なし）
  // ルートガードの先頭から await される。
  ensureSessionRestored(): Promise<void> {
    restorePromise ??= this.restoreSession()
    return restorePromise
  },
}

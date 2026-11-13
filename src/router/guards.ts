import type { Router } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { authService } from '@/services/authService'

// なぜ guards を index.ts と分けるか:
// ロールベースアクセス制御や契約チェックが追加されると
// ガード自体が複雑になる。分離しておくことで index.ts を
// 純粋なルートマップ宣言として保てる。
export function setupGuards(router: Router) {
  router.beforeEach(async (to) => {
    // なぜガードの先頭で復元を待つか:
    // store の user は永続化されないため、リロード・URL 直接アクセス時は
    // 復元が終わるまで isAuthenticated が false になる。ここで待たないと
    // ログイン済みでもログイン画面へリダイレクトされてしまう。
    // ensureSessionRestored() は内部で Promise を使い回すため、
    // 画面遷移のたびに /auth/me が呼ばれることはない。
    await authService.ensureSessionRestored()

    const authStore = useAuthStore()

    // 認証が必要なページに未ログインでアクセスした場合
    // なぜ ?redirect= を渡すか:
    // ログイン後に元々アクセスしようとした URL に戻るため。
    if (to.meta.requiresAuth && !authStore.isAuthenticated) {
      return { name: 'Login', query: { redirect: to.fullPath } }
    }

    // ログイン済みユーザーがログインページにアクセスした場合
    if (to.name === 'Login' && authStore.isAuthenticated) {
      return { name: 'ProductList' }
    }
  })
}

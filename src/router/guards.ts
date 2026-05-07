import type { Router } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

// なぜ guards を index.ts と分けるか:
// ロールベースアクセス制御や契約チェックが追加されると
// ガード自体が複雑になる。分離しておくことで index.ts を
// 純粋なルートマップ宣言として保てる。
export function setupGuards(router: Router) {
  router.beforeEach((to) => {
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

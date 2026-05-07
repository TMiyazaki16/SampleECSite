import { createRouter, createWebHistory } from 'vue-router'
import { setupGuards } from './guards'

// なぜ全ルートを遅延ロードするか:
// ログインページはネットワークが不安定な環境でも即座に表示する必要がある。
// それ以外のページはオンデマンドロードでバンドルサイズを削減する。

// なぜ meta.requiresAuth を使うか:
// ファイル名・パスの命名規則ではなく meta に認証要否を宣言することで、
// ガードを 1 箇所（guards.ts）に書いて将来のルート追加に対応できる。
declare module 'vue-router' {
  interface RouteMeta {
    requiresAuth?: boolean
  }
}

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/login',
      name: 'Login',
      component: () => import('@/views/authentication/LoginView.vue'),
    },
    {
      path: '/',
      name: 'ProductList',
      component: () => import('@/views/catalog/ProductListView.vue'),
      meta: { requiresAuth: true },
    },
    {
      path: '/products/:id',
      name: 'ProductDetail',
      component: () => import('@/views/catalog/ProductDetailView.vue'),
      meta: { requiresAuth: true },
    },
    {
      path: '/cart',
      name: 'Cart',
      component: () => import('@/views/order/CartView.vue'),
      meta: { requiresAuth: true },
    },
    {
      path: '/order/confirm',
      name: 'OrderConfirm',
      component: () => import('@/views/order/OrderConfirmView.vue'),
      meta: { requiresAuth: true },
    },
    {
      path: '/order/history',
      name: 'OrderHistory',
      component: () => import('@/views/order/OrderHistoryView.vue'),
      meta: { requiresAuth: true },
    },
    {
      path: '/:pathMatch(.*)*',
      name: 'NotFound',
      component: () => import('@/views/NotFoundView.vue'),
    },
  ],
})

setupGuards(router)

export default router

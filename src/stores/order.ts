import { defineStore } from 'pinia'
import type { Order } from '@/types/order'

// なぜ order を cart と別ストアにするか:
// ライフサイクルが異なる。カートはセッション限り（ブラウザローカル）、
// 注文はサーバー永続（API から取得）。
// 同一ストアにすると状態の責務が曖昧になり、テストも難しくなる。
export const useOrderStore = defineStore('order', () => {
  const currentOrder = ref<Order | null>(null)
  const orderHistory = ref<Order[]>([])

  function setCurrentOrder(order: Order) {
    currentOrder.value = order
  }

  function setOrderHistory(orders: Order[]) {
    orderHistory.value = orders
  }

  function clearCurrentOrder() {
    currentOrder.value = null
  }

  return { currentOrder, orderHistory, setCurrentOrder, setOrderHistory, clearCurrentOrder }
})

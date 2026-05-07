import { defineStore } from 'pinia'
import type { CartItem } from '@/types/cart'
import type { Product } from '@/types/product'

// なぜカートを Pinia で管理するか:
// ヘッダーバッジ・カートページ・注文確認ページが同時に
// totalItems / totalPrice を参照する。
// Pinia の reactivity でプロップドリルなしに全コンポーネントが同期する。
export const useCartStore = defineStore('cart', () => {
  const items = ref<CartItem[]>([])

  const totalItems = computed(() =>
    items.value.reduce((sum, item) => sum + item.quantity, 0)
  )

  const totalPrice = computed(() =>
    items.value.reduce((sum, item) => sum + item.product.price * item.quantity, 0)
  )

  const isEmpty = computed(() => items.value.length === 0)

  function addItem(product: Product, quantity: number = 1) {
    const existing = items.value.find(i => i.product.id === product.id)
    if (existing) {
      existing.quantity += quantity
    } else {
      items.value.push({ product, quantity })
    }
  }

  function removeItem(productId: string) {
    items.value = items.value.filter(i => i.product.id !== productId)
  }

  function updateQuantity(productId: string, quantity: number) {
    const item = items.value.find(i => i.product.id === productId)
    if (item) {
      item.quantity = quantity
    }
  }

  function clearCart() {
    items.value = []
  }

  return { items, totalItems, totalPrice, isEmpty, addItem, removeItem, updateQuantity, clearCart }
})

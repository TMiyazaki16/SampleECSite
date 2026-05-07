import { useCartStore } from '@/stores/cart'
import { cartService } from '@/services/cartService'
import type { Product } from '@/types/product'

// なぜ useCart を useCartStore の薄いラッパーとするか:
// 現在はカートが store-only (セッションローカル) だが、
// 将来サーバーサイドカートに移行する場合、
// ここだけ変えれば view は変更ゼロになる。
export function useCart() {
  const cartStore = useCartStore()

  function addToCart(product: Product, quantity: number = 1) {
    return cartService.addToCart(product, quantity)
  }

  return {
    items: computed(() => cartStore.items),
    totalItems: computed(() => cartStore.totalItems),
    totalPrice: computed(() => cartStore.totalPrice),
    isEmpty: computed(() => cartStore.isEmpty),
    addToCart,
    removeItem: cartStore.removeItem,
    updateQuantity: cartStore.updateQuantity,
  }
}

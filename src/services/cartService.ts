import { useCartStore } from '@/stores/cart'
import type { Product } from '@/types/product'

export interface ValidationResult {
  valid: boolean
  message?: string
}

// なぜ cartService を設けるか:
// 在庫チェック（validateStock）はビジネスルール。
// クリックハンドラ内に直接書くと、将来の変更（在庫 API 確認への移行等）で
// 全 view を修正することになる。service に集約しておけば変更点が 1 箇所になる。
export const cartService = {
  addToCart(product: Product, quantity: number = 1): ValidationResult {
    const result = this.validateStock(product, quantity)
    if (!result.valid) return result

    const cartStore = useCartStore()
    cartStore.addItem(product, quantity)
    return { valid: true }
  },

  validateStock(product: Product, quantity: number): ValidationResult {
    if (product.stock === 0) {
      return { valid: false, message: 'この商品は在庫がありません' }
    }
    if (quantity > product.stock) {
      return {
        valid: false,
        message: `在庫数（${product.stock}個）を超えています`,
      }
    }
    return { valid: true }
  },
}

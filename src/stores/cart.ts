import { defineStore } from 'pinia'
import type { CartItem } from '@/types/cart'
import type { Product } from '@/types/product'

// なぜカートを Pinia で管理するか:
// ヘッダーバッジ・カートページ・注文確認ページが同時に
// totalItems / totalPrice を参照する。
// Pinia の reactivity でプロップドリルなしに全コンポーネントが同期する。

// なぜ localStorage に永続化するか:
// カートはサーバ側に保持していないため、リロードやタブを閉じた時点で
// 中身が消えてしまう。ブラウザ単位で復元できるようにする。
// 衝突を避けるためアプリ固有のプレフィックス付きキーを使う。
const STORAGE_KEY = 'sample_ec_cart'

// なぜ型ガードを挟むか:
// localStorage の中身はユーザーが編集でき、アプリのバージョン差でも
// 形が変わりうる。JSON として妥当でも CartItem とは限らないため、
// 復元時に形を検証して不正なものは捨てる。
function isProduct(value: unknown): value is Product {
  if (typeof value !== 'object' || value === null) return false
  const p = value as Record<string, unknown>
  return (
    typeof p.id === 'string' &&
    typeof p.name === 'string' &&
    typeof p.description === 'string' &&
    typeof p.price === 'number' &&
    Number.isFinite(p.price) &&
    (p.currency === 'JPY' || p.currency === 'USD') &&
    typeof p.stock === 'number' &&
    Number.isFinite(p.stock) &&
    typeof p.category === 'string' &&
    typeof p.imageUrl === 'string'
  )
}

function isCartItem(value: unknown): value is CartItem {
  if (typeof value !== 'object' || value === null) return false
  const item = value as Record<string, unknown>
  if (typeof item.quantity !== 'number' || !Number.isFinite(item.quantity) || item.quantity <= 0) {
    return false
  }
  // Product のフィールドが一つでも欠けていると表示側（通貨フォーマット等）で
  // 例外になるため、必須フィールドをすべて検証する
  return isProduct(item.product)
}

function loadItems(): CartItem[] {
  try {
    // SSR やプライベートモード等で localStorage が使えない環境を考慮する
    if (typeof localStorage === 'undefined') return []
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return []
    const parsed: unknown = JSON.parse(raw)
    if (!Array.isArray(parsed)) return []
    return parsed.filter(isCartItem)
  } catch {
    // 不正な JSON・ストレージアクセス不可のいずれも空カートへフォールバックする
    return []
  }
}

function saveItems(items: CartItem[]) {
  try {
    if (typeof localStorage === 'undefined') return
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items))
  } catch {
    // 容量超過やプライベートモードでの書き込み失敗は
    // 画面の操作を妨げないため握りつぶす（カートはメモリ上では正しい）
  }
}

export const useCartStore = defineStore('cart', () => {
  const items = ref<CartItem[]>(loadItems())

  // なぜ watch で保存するか:
  // 各アクションに保存処理を書くと、アクションを増やしたときに
  // 書き忘れが起きる。items の変更を一箇所で監視して保存する。
  // ネストした quantity の変更も拾うため deep を有効にする。
  watch(items, value => saveItems(value), { deep: true })

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

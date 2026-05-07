import { productService } from '@/services/productService'
import type { Product } from '@/types/product'

// なぜ useProducts composable を設けるか:
// loading / error / pagination 状態は view ごとに独立したインスタンスが必要。
// 2つの view が別々のページの商品一覧を表示する場合、
// それぞれが独立した loading 状態を持てる。
// store に入れると全ページで共有されてしまい、状態が競合する。
export function useProducts() {
  const products = ref<Product[]>([])
  const loading = ref(false)
  const error = ref<string | null>(null)
  const total = ref(0)
  const currentPage = ref(1)
  const perPage = ref(6)
  const selectedCategory = ref<string | undefined>(undefined)

  const totalPages = computed(() => Math.ceil(total.value / perPage.value))

  async function fetchProducts() {
    loading.value = true
    error.value = null
    try {
      const result = await productService.getProductList({
        page: currentPage.value,
        perPage: perPage.value,
        category: selectedCategory.value,
      })
      products.value = result.items
      total.value = result.total
    } catch {
      error.value = 'common.error'
    } finally {
      loading.value = false
    }
  }

  function setPage(page: number) {
    currentPage.value = page
    fetchProducts()
  }

  function setCategory(category: string | undefined) {
    selectedCategory.value = category
    currentPage.value = 1
    fetchProducts()
  }

  return {
    products: readonly(products),
    loading: readonly(loading),
    error: readonly(error),
    total: readonly(total),
    currentPage: readonly(currentPage),
    totalPages,
    selectedCategory: readonly(selectedCategory),
    fetchProducts,
    setPage,
    setCategory,
  }
}

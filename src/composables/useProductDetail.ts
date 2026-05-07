import { productService } from '@/services/productService'
import type { Product } from '@/types/product'

export function useProductDetail() {
  const product = ref<Product | null>(null)
  const loading = ref(false)
  const error = ref<string | null>(null)

  async function fetchProduct(id: string) {
    loading.value = true
    error.value = null
    product.value = null
    try {
      product.value = await productService.getProductDetail(id)
    } catch {
      error.value = 'product.notFound'
    } finally {
      loading.value = false
    }
  }

  return {
    product: readonly(product),
    loading: readonly(loading),
    error: readonly(error),
    fetchProduct,
  }
}

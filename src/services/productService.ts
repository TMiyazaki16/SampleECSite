import { productApi } from '@/api-client/productApi'
import type { ProductListParams } from '@/api-client/productApi'
import type { PaginatedResponse } from '@/types/api'
import type { Product } from '@/types/product'

export const productService = {
  async getProductList(params: ProductListParams = {}): Promise<PaginatedResponse<Product>> {
    return productApi.getList(params)
  },

  async getProductDetail(id: string): Promise<Product> {
    return productApi.getById(id)
  },
}

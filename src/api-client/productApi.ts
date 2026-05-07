import { axiosInstance } from './axiosInstance'
import type { Product } from '@/types/product'
import type { PaginatedResponse } from '@/types/api'

export interface ProductListParams {
  page?: number
  perPage?: number
  category?: string
}

export const productApi = {
  getList: (params: ProductListParams = {}) =>
    axiosInstance
      .get<{ data: PaginatedResponse<Product> }>('/products', { params })
      .then(r => r.data.data),

  getById: (id: string) =>
    axiosInstance
      .get<{ data: { item: Product } }>(`/products/${id}`)
      .then(r => r.data.data.item),
}

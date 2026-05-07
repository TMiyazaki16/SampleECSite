import { axiosInstance } from './axiosInstance'
import type { Order, OrderItem } from '@/types/order'

export interface CreateOrderPayload {
  items: OrderItem[]
  totalPrice: number
  buyerId: string
}

export const orderApi = {
  getOrders: () =>
    axiosInstance
      .get<{ data: { items: Order[] } }>('/orders')
      .then(r => r.data.data.items),

  createOrder: (payload: CreateOrderPayload) =>
    axiosInstance
      .post<{ data: { order: Order } }>('/orders', payload)
      .then(r => r.data.data.order),
}

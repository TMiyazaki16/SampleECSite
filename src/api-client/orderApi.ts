import { axiosInstance } from './axiosInstance'
import type { Order } from '@/types/order'

// なぜ productId + quantity だけ送るか:
// フルオブジェクトの送信は冗長かつ改ざんリスクがある。
// totalPrice はサーバー側で再計算、buyerId は JWT から取得するため不要。
export interface OrderItemPayload {
  productId: string
  quantity: number
}

export interface CreateOrderPayload {
  items: OrderItemPayload[]
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

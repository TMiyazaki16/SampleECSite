import type { Product } from './product'

export interface OrderItem {
  product: Product
  quantity: number
  unitPrice: number
}

export interface Order {
  id: string
  items: OrderItem[]
  totalPrice: number
  status: 'pending' | 'confirmed' | 'shipped' | 'delivered'
  createdAt: string
  buyerId: string
}

import type { Order } from '@/types/order'
import { mockProducts } from './products'

export const mockOrders: Order[] = [
  {
    id: 'order-1',
    items: [
      { product: mockProducts[0], quantity: 2, unitPrice: mockProducts[0].price },
      { product: mockProducts[2], quantity: 1, unitPrice: mockProducts[2].price },
    ],
    totalPrice: mockProducts[0].price * 2 + mockProducts[2].price,
    status: 'delivered',
    createdAt: '2026-04-15T09:00:00.000Z',
    buyerId: 'user-1',
  },
  {
    id: 'order-2',
    items: [
      { product: mockProducts[3], quantity: 1, unitPrice: mockProducts[3].price },
    ],
    totalPrice: mockProducts[3].price,
    status: 'confirmed',
    createdAt: '2026-05-01T14:30:00.000Z',
    buyerId: 'user-1',
  },
]

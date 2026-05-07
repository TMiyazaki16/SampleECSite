import { http, HttpResponse } from 'msw'
import { mockOrders } from '@/mocks/fixtures/orders'
import type { Order } from '@/types/order'

// インメモリで注文を保持（ページリロードでリセットされる）
const orders: Order[] = [...mockOrders]

export const orderHandlers = [
  // GET /api/orders
  http.get('/api/orders', () => {
    return HttpResponse.json({ data: { items: orders } })
  }),

  // POST /api/orders
  http.post('/api/orders', async ({ request }) => {
    const body = await request.json() as Pick<Order, 'items' | 'totalPrice' | 'buyerId'>

    const newOrder: Order = {
      id: `order-${Date.now()}`,
      items: body.items,
      totalPrice: body.totalPrice,
      status: 'pending',
      createdAt: new Date().toISOString(),
      buyerId: body.buyerId,
    }

    orders.unshift(newOrder)
    return HttpResponse.json({ data: { order: newOrder } }, { status: 201 })
  }),
]

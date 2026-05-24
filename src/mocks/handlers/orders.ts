import { http, HttpResponse } from 'msw'
import { mockOrders } from '@/mocks/fixtures/orders'
import { mockProducts } from '@/mocks/fixtures/products'
import type { Order, OrderItem } from '@/types/order'

// インメモリで注文を保持（ページリロードでリセットされる）
const orders: Order[] = [...mockOrders]

export const orderHandlers = [
  // GET /api/orders
  http.get('/api/orders', () => {
    return HttpResponse.json({ data: { items: orders } })
  }),

  // POST /api/orders
  // バックエンドの動作をシミュレート:
  // - items は { productId, quantity } のみ受け取る
  // - 商品情報は productId から解決
  // - totalPrice はサーバー側（モック）で計算
  // - buyerId は Authorization ヘッダーから取得
  http.post('/api/orders', async ({ request }) => {
    const body = await request.json() as { items: { productId: string; quantity: number }[] }

    // JWT トークンから buyerId を取得（mock-token-user-1-timestamp → user-1）
    const auth = request.headers.get('Authorization') ?? ''
    const buyerId = auth.replace('Bearer mock-token-', '').replace(/-\d+$/, '') || 'user-1'

    // productId から商品情報を解決し OrderItem を構築
    const items: OrderItem[] = body.items.flatMap(({ productId, quantity }) => {
      const product = mockProducts.find(p => p.id === productId)
      if (!product) return []
      return [{ product, quantity, unitPrice: product.price }]
    })

    // totalPrice をサーバー側で計算
    const totalPrice = items.reduce(
      (sum, item) => sum + item.unitPrice * item.quantity,
      0,
    )

    const newOrder: Order = {
      id: `order-${Date.now()}`,
      items,
      totalPrice,
      status: 'pending',
      createdAt: new Date().toISOString(),
      buyerId,
    }

    orders.unshift(newOrder)
    return HttpResponse.json({ data: { order: newOrder } }, { status: 201 })
  }),
]

import { http, HttpResponse } from 'msw'
import { mockProducts } from '@/mocks/fixtures/products'

export const productHandlers = [
  // GET /api/products?page=1&perPage=4&category=xxx
  // なぜページネーションを mock に含めるか:
  // 実際の API はページネーション対応になる。
  // 最初から paginated な形で mock を作れば後で書き直しが不要。
  http.get('/api/products', ({ request }) => {
    const url = new URL(request.url)
    const page = Number(url.searchParams.get('page') ?? 1)
    const perPage = Number(url.searchParams.get('perPage') ?? 6)
    const category = url.searchParams.get('category')

    const filtered = category
      ? mockProducts.filter(p => p.category === category)
      : mockProducts

    const start = (page - 1) * perPage
    const items = filtered.slice(start, start + perPage)

    return HttpResponse.json({
      data: {
        items,
        total: filtered.length,
        page,
        perPage,
      },
    })
  }),

  // GET /api/products/:id
  http.get('/api/products/:id', ({ params }) => {
    const product = mockProducts.find(p => p.id === params['id'])
    if (!product) {
      return HttpResponse.json({ message: '商品が見つかりません' }, { status: 404 })
    }
    return HttpResponse.json({ data: { item: product } })
  }),
]

import { http, HttpResponse } from 'msw'
import { mockUsers, VALID_PASSWORD } from '@/mocks/fixtures/users'

export const authHandlers = [
  // POST /api/auth/login
  // なぜ 401 をシミュレートするか:
  // axios インターセプターの認証エラーハンドリングを開発中に検証するため。
  http.post('/api/auth/login', async ({ request }) => {
    const body = await request.json() as { email: string; password: string }
    const user = mockUsers.find(u => u.email === body.email)

    if (!user || body.password !== VALID_PASSWORD) {
      return HttpResponse.json(
        { message: 'メールアドレスまたはパスワードが正しくありません' },
        { status: 401 }
      )
    }

    return HttpResponse.json({
      data: {
        user,
        token: `mock-token-${user.id}-${Date.now()}`,
      },
    })
  }),

  // POST /api/auth/logout
  http.post('/api/auth/logout', () => {
    return HttpResponse.json({ data: { success: true } })
  }),

  // GET /api/auth/me
  http.get('/api/auth/me', ({ request }) => {
    const auth = request.headers.get('Authorization')
    if (!auth || !auth.startsWith('Bearer mock-token-')) {
      return HttpResponse.json({ message: 'Unauthorized' }, { status: 401 })
    }
    // トークンから user-id を取り出す（mock 用の簡易実装）
    const userId = auth.replace('Bearer mock-token-', '').split('-')[0]
    const user = mockUsers.find(u => u.id === `user-${userId}`)
    if (!user) {
      return HttpResponse.json({ message: 'Unauthorized' }, { status: 401 })
    }
    return HttpResponse.json({ data: { user } })
  }),
]

import type { User } from '@/types/user'

export const mockUsers: User[] = [
  {
    id: 'user-1',
    email: 'test@example.com',
    name: '山田 太郎',
    companyName: '株式会社サンプル',
    role: 'buyer',
  },
  {
    id: 'user-2',
    email: 'admin@example.com',
    name: '管理者',
    companyName: '株式会社サンプル',
    role: 'admin',
  },
]

export const VALID_PASSWORD = 'password123'

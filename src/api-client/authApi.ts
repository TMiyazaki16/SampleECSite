import { axiosInstance } from './axiosInstance'
import type { User } from '@/types/user'
import type { LoginCredentials } from '@/types/api'

export const authApi = {
  login: (credentials: LoginCredentials) =>
    axiosInstance
      .post<{ data: { user: User; token: string } }>('/auth/login', credentials)
      .then(r => r.data.data),

  logout: () =>
    axiosInstance
      .post<{ data: { success: boolean } }>('/auth/logout')
      .then(r => r.data.data),

  me: () =>
    axiosInstance
      .get<{ data: { user: User } }>('/auth/me')
      .then(r => r.data.data),
}

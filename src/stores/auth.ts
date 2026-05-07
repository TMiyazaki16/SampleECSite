import { defineStore } from 'pinia'
import { useLocalStorage } from '@vueuse/core'
import type { User } from '@/types/user'

// なぜ useLocalStorage を使うか:
// Pinia の reactive state と localStorage の永続化を両立する。
// localStorage を直接読み書きするとリアクティビティが失われる。
// useLocalStorage はその橋渡しを SSR-safe に行う。
export const useAuthStore = defineStore('auth', () => {
  const user = ref<User | null>(null)
  const token = useLocalStorage<string | null>('token', null)

  const isAuthenticated = computed(() => token.value !== null && user.value !== null)

  function setUser(u: User) {
    user.value = u
  }

  function setToken(t: string) {
    token.value = t
  }

  function logout() {
    user.value = null
    token.value = null
  }

  return { user, token, isAuthenticated, setUser, setToken, logout }
})

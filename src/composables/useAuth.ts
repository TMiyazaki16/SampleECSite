import { authService } from '@/services/authService'
import { useAuthStore } from '@/stores/auth'
import type { LoginFormValues } from '@/validation/schemas/loginSchema'

// なぜ store が既にあるのに composable を設けるか:
// store はグローバル状態（user, token）を管理する。
// composable はその操作に伴うローカル状態（loading, error）を管理する。
// view は store を直接 import せず composable 経由で使うことで、
// 将来認証方式が変わっても view の変更ゼロになる。
export function useAuth() {
  const authStore = useAuthStore()
  const router = useRouter()
  const loading = ref(false)
  const error = ref<string | null>(null)

  async function login(credentials: LoginFormValues) {
    loading.value = true
    error.value = null
    try {
      await authService.login(credentials)
      const redirect = (router.currentRoute.value.query['redirect'] as string) || '/'
      await router.push(redirect)
    } catch {
      error.value = useI18n().t('auth.loginError')
    } finally {
      loading.value = false
    }
  }

  async function logout() {
    await authService.logout()
    await router.push({ name: 'Login' })
  }

  return {
    user: computed(() => authStore.user),
    isAuthenticated: computed(() => authStore.isAuthenticated),
    loading: readonly(loading),
    error: readonly(error),
    login,
    logout,
  }
}

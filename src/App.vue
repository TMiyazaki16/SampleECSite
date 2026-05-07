<script setup lang="ts">
import { authService } from '@/services/authService'
import { useAuthStore } from '@/stores/auth'
import { useCart } from '@/composables/useCart'

const { t } = useI18n()
const { locale } = useI18n()
const authStore = useAuthStore()
const { totalItems } = useCart()
const router = useRouter()

const showLogoutDialog = ref(false)

onMounted(async () => {
  await authService.restoreSession()
})

function toggleLocale() {
  locale.value = locale.value === 'ja' ? 'en' : 'ja'
}

async function handleLogout() {
  showLogoutDialog.value = false
  await authService.logout()
  router.push({ name: 'Login' })
}
</script>

<template>
  <!-- v-app は Vuetify のルートコンポーネント。
       テーマ・ダイアログ・スナックバーのマウント先になるため必須。 -->
  <v-app>
    <!-- ナビゲーションバー（認証済み時のみ表示） -->
    <v-app-bar v-if="authStore.isAuthenticated" color="white" elevation="1">
      <v-toolbar-title>
        <RouterLink :to="{ name: 'ProductList' }" class="app-logo text-decoration-none text-primary font-weight-bold">
          Sample EC
        </RouterLink>
      </v-toolbar-title>

      <v-btn variant="text" :to="{ name: 'ProductList' }">
        {{ t('nav.products') }}
      </v-btn>
      <v-btn variant="text" :to="{ name: 'OrderHistory' }">
        {{ t('nav.orderHistory') }}
      </v-btn>

      <v-spacer />

      <!-- 言語切替 -->
      <v-btn variant="outlined" size="small" density="comfortable" @click="toggleLocale" class="mr-2">
        {{ locale === 'ja' ? 'EN' : 'JA' }}
      </v-btn>

      <!-- カートアイコン + バッジ -->
      <v-btn :to="{ name: 'Cart' }" variant="text" icon class="mr-1">
        <v-badge :content="totalItems" :model-value="totalItems > 0" color="error">
          <v-icon>mdi-cart</v-icon>
        </v-badge>
      </v-btn>

      <!-- ユーザーメニュー -->
      <v-menu>
        <template #activator="{ props }">
          <v-btn v-bind="props" variant="text" prepend-icon="mdi-account">
            {{ authStore.user?.name }}
          </v-btn>
        </template>
        <v-list density="compact">
          <v-list-item
            prepend-icon="mdi-logout"
            :title="t('nav.logout')"
            @click="showLogoutDialog = true"
          />
        </v-list>
      </v-menu>
    </v-app-bar>

    <!-- メインコンテンツ -->
    <v-main>
      <RouterView />
    </v-main>

    <!-- ログアウト確認ダイアログ
         なぜ v-dialog を使うか: Teleport を手書きせずに済み、
         アクセシビリティ（focus trap 等）を Vuetify が担保する。 -->
    <v-dialog v-model="showLogoutDialog" max-width="360">
      <v-card :title="t('nav.logout')">
        <v-card-text>{{ t('auth.logoutConfirm') }}</v-card-text>
        <v-card-actions>
          <v-spacer />
          <v-btn variant="text" @click="showLogoutDialog = false">
            {{ t('common.cancel') }}
          </v-btn>
          <v-btn color="error" @click="handleLogout">
            {{ t('nav.logout') }}
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-app>
</template>

<style>
/* Vuetify はグローバルリセット・フォント設定を行うため、
   追加の CSS は最小限にする */
.app-logo {
  font-size: 1.125rem;
}
</style>

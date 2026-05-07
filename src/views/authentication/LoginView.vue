<script setup lang="ts">
import LoginForm from '@/components/organisms/authentication/LoginForm.vue'
import { useAuth } from '@/composables/useAuth'
import type { LoginFormValues } from '@/validation/schemas/loginSchema'

const { login, loading, error } = useAuth()
const { t } = useI18n()

async function handleSubmit(values: LoginFormValues) {
  await login(values)
}
</script>

<template>
  <v-container fluid class="fill-height bg-background">
    <v-row justify="center" align="center" class="fill-height">
      <v-col cols="12" sm="8" md="5" lg="4">
        <v-card elevation="4" rounded="xl" class="pa-2">
          <v-card-text class="pa-8">
            <!-- ヘッダー -->
            <div class="text-center mb-8">
              <v-icon icon="mdi-store" color="primary" size="48" class="mb-3" />
              <h1 class="text-h5 font-weight-bold">{{ t('auth.title') }}</h1>
              <p class="text-body-2 text-medium-emphasis mt-1">サンプル EC サイト</p>
            </div>

            <LoginForm
              :loading="loading"
              :server-error="error ?? undefined"
              @submit="handleSubmit"
            />

            <!-- ヒント -->
            <v-alert
              type="info"
              variant="tonal"
              density="compact"
              class="mt-6"
              icon="mdi-information-outline"
            >
              <span class="text-caption">{{ t('auth.hint') }}</span>
            </v-alert>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

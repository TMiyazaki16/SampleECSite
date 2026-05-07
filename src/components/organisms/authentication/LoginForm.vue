<script setup lang="ts">
import { useForm, useField } from 'vee-validate'
import { loginSchema } from '@/validation/schemas/loginSchema'
import type { LoginFormValues } from '@/validation/schemas/loginSchema'

interface Props {
  loading?: boolean
  serverError?: string
}
withDefaults(defineProps<Props>(), { loading: false })

const emit = defineEmits<{
  submit: [values: LoginFormValues]
}>()

const { t } = useI18n()
const { handleSubmit } = useForm({ validationSchema: loginSchema })
const { value: email, errorMessage: emailError } = useField<string>('email')
const { value: password, errorMessage: passwordError } = useField<string>('password')

const showPassword = ref(false)

const onSubmit = handleSubmit((values) => emit('submit', values))
</script>

<template>
  <v-form @submit.prevent="onSubmit" novalidate>
    <v-text-field
      v-model="email"
      :label="t('auth.email')"
      type="email"
      :error-messages="emailError ? t(emailError) : ''"
      :disabled="loading"
      placeholder="you@company.com"
      prepend-inner-icon="mdi-email-outline"
      autocomplete="email"
      class="mb-2"
    />

    <v-text-field
      v-model="password"
      :label="t('auth.password')"
      :type="showPassword ? 'text' : 'password'"
      :error-messages="passwordError ? t(passwordError) : ''"
      :disabled="loading"
      prepend-inner-icon="mdi-lock-outline"
      :append-inner-icon="showPassword ? 'mdi-eye-off' : 'mdi-eye'"
      autocomplete="current-password"
      class="mb-2"
      @click:append-inner="showPassword = !showPassword"
    />

    <v-alert
      v-if="serverError"
      type="error"
      :text="serverError"
      class="mb-4"
    />

    <v-btn
      type="submit"
      color="primary"
      size="large"
      block
      :loading="loading"
    >
      {{ t('auth.loginButton') }}
    </v-btn>
  </v-form>
</template>

import * as yup from 'yup'
import { emailField } from '../fields/emailField'
import { passwordField } from '../fields/passwordField'

// なぜ i18n キーをメッセージにするか:
// <ErrorMessage> で t() を通すだけで多言語エラーが実現できる。
// バリデーションルールと翻訳を二重管理せずに済む。
export const loginSchema = yup.object({
  email: emailField,
  password: passwordField,
})

export type LoginFormValues = yup.InferType<typeof loginSchema>

import * as yup from 'yup'

// なぜフィールドを再利用可能な関数で定義するか:
// ログイン・会員登録・プロフィール更新など、同じメール形式チェックを
// 複数フォームで使い回すため。定義を変更すると全フォームに自動適用される。
export const emailField = yup
  .string()
  .email('validation.invalidEmail')
  .required('validation.required')

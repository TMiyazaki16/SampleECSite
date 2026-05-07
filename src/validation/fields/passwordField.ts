import * as yup from 'yup'

export const passwordField = yup
  .string()
  .min(8, 'validation.passwordMinLength')
  .required('validation.required')

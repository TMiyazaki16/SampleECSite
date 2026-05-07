import { authHandlers } from './auth'
import { productHandlers } from './products'
import { orderHandlers } from './orders'

export const handlers = [
  ...authHandlers,
  ...productHandlers,
  ...orderHandlers,
]

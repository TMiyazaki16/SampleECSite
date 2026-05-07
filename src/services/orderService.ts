import { orderApi } from '@/api-client/orderApi'
import { useCartStore } from '@/stores/cart'
import { useAuthStore } from '@/stores/auth'
import { useOrderStore } from '@/stores/order'
import type { CartItem } from '@/types/cart'
import type { Order, OrderItem } from '@/types/order'

export const orderService = {
  // placeOrder: カート内容を注文に変換し、送信後にカートをクリアする。
  // なぜカートクリアを service に書くか:
  // 「注文確定後はカートを空にする」はビジネスルール。
  // view に書くと、将来別の UI から注文する際に漏れが生じる可能性がある。
  async placeOrder(cartItems: CartItem[]): Promise<Order> {
    const authStore = useAuthStore()
    const cartStore = useCartStore()
    const orderStore = useOrderStore()

    const items: OrderItem[] = cartItems.map(ci => ({
      product: ci.product,
      quantity: ci.quantity,
      unitPrice: ci.product.price,
    }))

    const totalPrice = items.reduce(
      (sum, item) => sum + item.unitPrice * item.quantity,
      0
    )

    const order = await orderApi.createOrder({
      items,
      totalPrice,
      buyerId: authStore.user?.id ?? '',
    })

    cartStore.clearCart()
    orderStore.setCurrentOrder(order)
    return order
  },

  async getOrderHistory(): Promise<Order[]> {
    const orderStore = useOrderStore()
    const orders = await orderApi.getOrders()
    orderStore.setOrderHistory(orders)
    return orders
  },
}

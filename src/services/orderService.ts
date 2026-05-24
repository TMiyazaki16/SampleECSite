import { orderApi } from '@/api-client/orderApi'
import { useCartStore } from '@/stores/cart'
import { useOrderStore } from '@/stores/order'
import type { CartItem } from '@/types/cart'
import type { Order } from '@/types/order'

export const orderService = {
  // placeOrder: カート内容を注文に変換し、送信後にカートをクリアする。
  // なぜカートクリアを service に書くか:
  // 「注文確定後はカートを空にする」はビジネスルール。
  // view に書くと、将来別の UI から注文する際に漏れが生じる可能性がある。
  //
  // なぜ productId + quantity だけ送るか:
  // totalPrice はサーバー側で再計算（改ざん防止）、
  // buyerId は JWT トークンからサーバー側で取得（なりすまし防止）。
  async placeOrder(cartItems: CartItem[]): Promise<Order> {
    const cartStore = useCartStore()
    const orderStore = useOrderStore()

    const order = await orderApi.createOrder({
      items: cartItems.map(ci => ({
        productId: ci.product.id,
        quantity: ci.quantity,
      })),
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

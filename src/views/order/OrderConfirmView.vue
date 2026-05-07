<script setup lang="ts">
import { orderService } from '@/services/orderService'
import { useCart } from '@/composables/useCart'

const { t, n } = useI18n()
const router = useRouter()
const { items, totalPrice, isEmpty } = useCart()

const loading = ref(false)
const error = ref<string | null>(null)
const ordered = ref(false)
const orderId = ref<string | null>(null)

onMounted(() => {
  if (isEmpty.value) router.replace({ name: 'Cart' })
})

async function placeOrder() {
  loading.value = true
  error.value = null
  try {
    const order = await orderService.placeOrder(items.value)
    orderId.value = order.id
    ordered.value = true
  } catch {
    error.value = t('common.error')
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <v-container class="py-8" style="max-width: 800px;">

    <!-- 注文完了画面 -->
    <v-card v-if="ordered" class="text-center pa-8">
      <v-icon icon="mdi-check-circle" color="success" size="72" class="mb-4" />
      <h1 class="text-h5 font-weight-bold mb-2">{{ t('order.success') }}</h1>
      <p class="text-body-1 text-medium-emphasis mb-2">{{ t('order.successMessage') }}</p>
      <p class="text-caption text-medium-emphasis font-mono mb-6">
        {{ t('order.orderId') }}: {{ orderId }}
      </p>
      <div class="d-flex justify-center ga-3">
        <v-btn color="primary" @click="router.push({ name: 'OrderHistory' })">
          {{ t('order.viewHistory') }}
        </v-btn>
        <v-btn variant="outlined" @click="router.push({ name: 'ProductList' })">
          {{ t('order.backToProducts') }}
        </v-btn>
      </div>
    </v-card>

    <!-- 注文確認画面 -->
    <template v-else>
      <h1 class="text-h5 font-weight-bold mb-6">{{ t('order.confirm') }}</h1>

      <v-alert v-if="error" type="error" :text="error" class="mb-4" />

      <v-card class="mb-6">
        <!-- なぜ v-table を使うか: 表形式データの表示は v-table が最適。
             レスポンシブ対応と accessibility が組み込まれている。 -->
        <v-table>
          <thead>
            <tr>
              <th>商品</th>
              <th class="text-right">単価</th>
              <th class="text-right">数量</th>
              <th class="text-right">小計</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="item in items" :key="item.product.id">
              <td>{{ item.product.name }}</td>
              <td class="text-right">{{ n(item.product.price, 'currency', { currency: item.product.currency }) }}</td>
              <td class="text-right">{{ item.quantity }}</td>
              <td class="text-right font-weight-medium">
                {{ n(item.product.price * item.quantity, 'currency', { currency: item.product.currency }) }}
              </td>
            </tr>
          </tbody>
          <tfoot>
            <tr>
              <td colspan="3" class="text-right font-weight-bold">{{ t('order.total') }}</td>
              <td class="text-right text-h6 font-weight-bold text-primary">
                {{ n(totalPrice, 'currency', { currency: 'JPY' }) }}
              </td>
            </tr>
          </tfoot>
        </v-table>
      </v-card>

      <div class="d-flex justify-end ga-3">
        <v-btn variant="outlined" prepend-icon="mdi-arrow-left" :to="{ name: 'Cart' }">
          {{ t('cart.title') }}に戻る
        </v-btn>
        <v-btn
          color="primary"
          size="large"
          append-icon="mdi-check"
          :loading="loading"
          @click="placeOrder"
        >
          {{ t('order.place') }}
        </v-btn>
      </div>
    </template>
  </v-container>
</template>

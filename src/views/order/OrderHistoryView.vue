<script setup lang="ts">
import OrderHistoryItem from '@/components/organisms/product/OrderHistoryItem.vue'
import { orderService } from '@/services/orderService'
import { useOrderStore } from '@/stores/order'

const { t } = useI18n()
const orderStore = useOrderStore()
const loading = ref(false)
const error = ref<string | null>(null)

onMounted(async () => {
  loading.value = true
  try {
    await orderService.getOrderHistory()
  } catch {
    error.value = t('common.error')
  } finally {
    loading.value = false
  }
})
</script>

<template>
  <v-container class="py-8" style="max-width: 800px;">
    <h1 class="text-h5 font-weight-bold mb-6">{{ t('order.history') }}</h1>

    <div v-if="loading" class="d-flex justify-center py-16">
      <v-progress-circular indeterminate color="primary" size="48" />
    </div>

    <v-alert v-else-if="error" type="error" :text="error" />

    <template v-else-if="orderStore.orderHistory.length > 0">
      <OrderHistoryItem
        v-for="order in orderStore.orderHistory"
        :key="order.id"
        :order="order"
      />
    </template>

    <v-empty-state
      v-else
      icon="mdi-clipboard-text-clock-outline"
      :title="t('order.historyEmpty')"
    >
      <template #actions>
        <v-btn color="primary" :to="{ name: 'ProductList' }">
          {{ t('order.backToProducts') }}
        </v-btn>
      </template>
    </v-empty-state>
  </v-container>
</template>

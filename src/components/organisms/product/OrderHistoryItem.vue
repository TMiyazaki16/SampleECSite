<script setup lang="ts">
import type { Order } from '@/types/order'

interface Props { order: Order }
defineProps<Props>()

const { t, n, d } = useI18n()

const statusColor: Record<Order['status'], string> = {
  pending: 'warning',
  confirmed: 'info',
  shipped: 'primary',
  delivered: 'success',
}
</script>

<template>
  <v-card class="mb-4">
    <v-card-text>
      <!-- ヘッダー行 -->
      <div class="d-flex align-center flex-wrap ga-3 mb-3">
        <div>
          <div class="text-caption text-medium-emphasis">{{ t('order.orderId') }}</div>
          <div class="text-body-2 font-weight-medium" style="font-family: monospace;">{{ order.id }}</div>
        </div>
        <div>
          <div class="text-caption text-medium-emphasis">{{ t('order.orderDate') }}</div>
          <div class="text-body-2">{{ d(new Date(order.createdAt), 'short') }}</div>
        </div>
        <v-spacer />
        <v-chip
          :color="statusColor[order.status]"
          size="small"
          :text="t(`order.statusLabels.${order.status}`)"
        />
      </div>

      <!-- 商品一覧 -->
      <v-list density="compact" class="pa-0 bg-transparent">
        <v-list-item
          v-for="item in order.items"
          :key="item.product.id"
          class="px-0"
        >
          <template #title>
            <span class="text-body-2">{{ item.product.name }}</span>
          </template>
          <template #append>
            <span class="text-body-2 text-medium-emphasis">
              {{ item.quantity }}{{ t('product.units') }} ×
              {{ n(item.unitPrice, 'currency', { currency: item.product.currency }) }}
            </span>
          </template>
        </v-list-item>
      </v-list>
    </v-card-text>

    <!-- 合計 -->
    <v-divider />
    <v-card-text class="d-flex justify-end align-center">
      <span class="text-body-2 text-medium-emphasis mr-3">{{ t('order.total') }}</span>
      <span class="text-h6 font-weight-bold">
        {{ n(order.totalPrice, 'currency', { currency: 'JPY' }) }}
      </span>
    </v-card-text>
  </v-card>
</template>

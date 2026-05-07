<script setup lang="ts">
import type { CartItem } from '@/types/cart'

interface Props { item: CartItem }
defineProps<Props>()
defineEmits<{
  remove: [productId: string]
  updateQty: [productId: string, quantity: number]
}>()

const { t, n } = useI18n()
</script>

<template>
  <v-list-item class="px-0 py-3">
    <template #prepend>
      <v-img
        :src="item.product.imageUrl"
        :alt="item.product.name"
        width="80"
        height="60"
        cover
        rounded="lg"
        class="mr-3 flex-shrink-0"
      />
    </template>

    <v-list-item-title class="font-weight-medium mb-1">
      <RouterLink
        :to="{ name: 'ProductDetail', params: { id: item.product.id } }"
        class="text-decoration-none text-high-emphasis"
      >
        {{ item.product.name }}
      </RouterLink>
    </v-list-item-title>
    <v-list-item-subtitle>
      {{ n(item.product.price, 'currency', { currency: item.product.currency }) }} / {{ t('product.units') }}
    </v-list-item-subtitle>

    <template #append>
      <div class="d-flex align-center ga-3">
        <!-- 数量コントロール -->
        <div class="d-flex align-center ga-1">
          <v-btn
            icon="mdi-minus"
            size="x-small"
            variant="outlined"
            :disabled="item.quantity <= 1"
            @click="$emit('updateQty', item.product.id, item.quantity - 1)"
          />
          <span class="text-body-2 font-weight-bold" style="min-width: 2rem; text-align: center;">
            {{ item.quantity }}
          </span>
          <v-btn
            icon="mdi-plus"
            size="x-small"
            variant="outlined"
            :disabled="item.quantity >= item.product.stock"
            @click="$emit('updateQty', item.product.id, item.quantity + 1)"
          />
        </div>

        <!-- 小計 -->
        <div class="text-body-1 font-weight-bold" style="min-width: 6rem; text-align: right;">
          {{ n(item.product.price * item.quantity, 'currency', { currency: item.product.currency }) }}
        </div>

        <!-- 削除 -->
        <v-btn
          icon="mdi-delete-outline"
          size="small"
          variant="text"
          color="error"
          :aria-label="`${item.product.name}を削除`"
          @click="$emit('remove', item.product.id)"
        />
      </div>
    </template>
  </v-list-item>
  <v-divider />
</template>

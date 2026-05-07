<script setup lang="ts">
import type { Product } from '@/types/product'

interface Props { product: Product }
defineProps<Props>()
defineEmits<{ addToCart: [product: Product] }>()

const { t, n } = useI18n()
</script>

<template>
  <v-card height="100%" class="d-flex flex-column">
    <RouterLink :to="{ name: 'ProductDetail', params: { id: product.id } }">
      <v-img
        :src="product.imageUrl"
        :alt="product.name"
        height="200"
        cover
      />
    </RouterLink>

    <v-card-text class="flex-grow-1 pb-0">
      <v-chip
        :text="product.category"
        color="primary"
        size="x-small"
        class="mb-2 text-capitalize"
      />
      <RouterLink
        :to="{ name: 'ProductDetail', params: { id: product.id } }"
        class="text-decoration-none"
      >
        <div class="text-subtitle-1 font-weight-bold text-high-emphasis mb-1">
          {{ product.name }}
        </div>
      </RouterLink>
      <div class="text-h6 font-weight-bold text-high-emphasis">
        {{ n(product.price, 'currency', { currency: product.currency }) }}
      </div>
    </v-card-text>

    <v-card-actions class="px-4 pb-4 pt-2">
      <v-chip
        v-if="product.stock === 0"
        color="error"
        size="small"
        prepend-icon="mdi-alert-circle"
        :text="t('product.outOfStock')"
      />
      <span v-else class="text-caption text-medium-emphasis">
        {{ t('product.stock') }}: {{ product.stock }}{{ t('product.units') }}
      </span>
      <v-spacer />
      <v-btn
        color="primary"
        size="small"
        :disabled="product.stock === 0"
        prepend-icon="mdi-cart-plus"
        @click="$emit('addToCart', product)"
      >
        {{ t('product.addToCart') }}
      </v-btn>
    </v-card-actions>
  </v-card>
</template>

<script setup lang="ts">
import CartItem from '@/components/organisms/product/CartItem.vue'
import { useCart } from '@/composables/useCart'

const { t, n } = useI18n()
const router = useRouter()
const { items, totalPrice, totalItems, isEmpty, removeItem, updateQuantity } = useCart()
</script>

<template>
  <v-container class="py-8" style="max-width: 960px;">
    <h1 class="text-h5 font-weight-bold mb-6">{{ t('cart.title') }}</h1>

    <!-- カートが空 -->
    <v-empty-state
      v-if="isEmpty"
      icon="mdi-cart-outline"
      :title="t('cart.empty')"
    >
      <template #actions>
        <v-btn color="primary" prepend-icon="mdi-arrow-left" :to="{ name: 'ProductList' }">
          {{ t('cart.continueShopping') }}
        </v-btn>
      </template>
    </v-empty-state>

    <!-- カート内容 -->
    <v-row v-else ga="6">
      <!-- 商品リスト -->
      <v-col cols="12" md="8">
        <v-card>
          <v-list lines="two">
            <CartItem
              v-for="item in items"
              :key="item.product.id"
              :item="item"
              @remove="removeItem"
              @update-qty="updateQuantity"
            />
          </v-list>
        </v-card>

        <v-btn
          variant="text"
          prepend-icon="mdi-arrow-left"
          :to="{ name: 'ProductList' }"
          class="mt-4"
        >
          {{ t('cart.continueShopping') }}
        </v-btn>
      </v-col>

      <!-- サマリー -->
      <v-col cols="12" md="4">
        <v-card>
          <v-card-title>{{ t('cart.total') }}</v-card-title>
          <v-card-text>
            <v-list density="compact" class="pa-0">
              <v-list-item class="px-0">
                <template #title>{{ t('cart.items') }}</template>
                <template #append>{{ totalItems }}点</template>
              </v-list-item>
            </v-list>

            <v-divider class="my-3" />

            <div class="d-flex justify-space-between align-center mb-4">
              <span class="text-body-1 font-weight-bold">{{ t('cart.total') }}</span>
              <span class="text-h6 font-weight-bold text-primary">
                {{ n(totalPrice, 'currency', { currency: 'JPY' }) }}
              </span>
            </div>

            <v-btn
              color="primary"
              size="large"
              block
              append-icon="mdi-arrow-right"
              @click="router.push({ name: 'OrderConfirm' })"
            >
              {{ t('cart.proceed') }}
            </v-btn>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

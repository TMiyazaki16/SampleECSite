<script setup lang="ts">
import { useProductDetail } from '@/composables/useProductDetail'
import { useCart } from '@/composables/useCart'

const route = useRoute()
const { t, n } = useI18n()
const { product, loading, error, fetchProduct } = useProductDetail()
const { addToCart } = useCart()

const quantity = ref(1)
const snackbar = ref(false)
const snackbarMessage = ref('')
const snackbarColor = ref<'success' | 'error'>('success')

watch(
  () => route.params['id'] as string,
  (id) => { if (id) fetchProduct(id) },
  { immediate: true }
)

function handleAddToCart() {
  if (!product.value) return
  const result = addToCart(product.value, quantity.value)
  if (result.valid) {
    snackbarMessage.value = `「${product.value.name}」をカートに追加しました`
    snackbarColor.value = 'success'
  } else {
    snackbarMessage.value = result.message ?? ''
    snackbarColor.value = 'error'
  }
  snackbar.value = true
}
</script>

<template>
  <v-container class="py-8" style="max-width: 960px;">
    <!-- 戻るボタン -->
    <v-btn
      variant="text"
      prepend-icon="mdi-arrow-left"
      :to="{ name: 'ProductList' }"
      class="mb-4 px-0"
    >
      {{ t('product.backToList') }}
    </v-btn>

    <!-- ローディング -->
    <div v-if="loading" class="d-flex justify-center py-16">
      <v-progress-circular indeterminate color="primary" size="48" />
    </div>

    <!-- エラー -->
    <v-alert v-else-if="error" type="error" :text="t(error)" />

    <!-- 商品詳細 -->
    <v-row v-else-if="product" ga="6">
      <!-- 商品画像 -->
      <v-col cols="12" md="6">
        <v-card elevation="2" rounded="xl" overflow-hidden>
          <v-img
            :src="product.imageUrl"
            :alt="product.name"
            aspect-ratio="4/3"
            cover
          />
        </v-card>
      </v-col>

      <!-- 商品情報 -->
      <v-col cols="12" md="6">
        <v-chip
          :text="product.category"
          color="primary"
          size="small"
          class="mb-3 text-capitalize"
        />

        <h1 class="text-h4 font-weight-bold mb-3">{{ product.name }}</h1>

        <div class="text-h4 font-weight-bold text-primary mb-4">
          {{ n(product.price, 'currency', { currency: product.currency }) }}
        </div>

        <p class="text-body-1 text-medium-emphasis mb-4" style="line-height: 1.8;">
          {{ product.description }}
        </p>

        <!-- 在庫状況 -->
        <v-chip
          v-if="product.stock === 0"
          color="error"
          prepend-icon="mdi-alert-circle"
          class="mb-4"
        >
          {{ t('product.outOfStock') }}
        </v-chip>
        <div v-else class="d-flex align-center ga-2 mb-6">
          <v-icon color="success" icon="mdi-check-circle" />
          <span class="text-body-2 text-success font-weight-medium">
            {{ t('product.stock') }}: {{ product.stock }}{{ t('product.units') }}
          </span>
        </div>

        <!-- 数量 + カートに追加 -->
        <template v-if="product.stock > 0">
          <div class="d-flex align-center ga-4 mb-6">
            <span class="text-body-2 font-weight-medium">{{ t('common.quantity') }}</span>
            <div class="d-flex align-center ga-2">
              <v-btn
                icon="mdi-minus"
                size="small"
                variant="outlined"
                :disabled="quantity <= 1"
                @click="quantity--"
              />
              <span class="text-body-1 font-weight-bold" style="min-width: 3rem; text-align: center;">
                {{ quantity }}
              </span>
              <v-btn
                icon="mdi-plus"
                size="small"
                variant="outlined"
                :disabled="quantity >= product.stock"
                @click="quantity++"
              />
            </div>
          </div>

          <v-btn
            color="primary"
            size="large"
            block
            prepend-icon="mdi-cart-plus"
            @click="handleAddToCart"
          >
            {{ t('product.addToCart') }}
          </v-btn>
        </template>
      </v-col>
    </v-row>

    <v-snackbar v-model="snackbar" :color="snackbarColor" :timeout="3000" location="bottom right">
      {{ snackbarMessage }}
    </v-snackbar>
  </v-container>
</template>

<script setup lang="ts">
import ProductCard from '@/components/organisms/product/ProductCard.vue'
import { useProducts } from '@/composables/useProducts'
import { useCart } from '@/composables/useCart'
import type { Product } from '@/types/product'

const { t } = useI18n()
const { products, loading, error, totalPages, currentPage, selectedCategory, fetchProducts, setPage, setCategory } = useProducts()
const { addToCart } = useCart()

const categories = ['furniture', 'accessories', 'electronics', 'lighting']

const snackbar = ref(false)
const snackbarMessage = ref('')
const snackbarColor = ref<'success' | 'error' | 'warning'>('success')

onMounted(() => { fetchProducts() })

function handleAddToCart(product: Product) {
  const result = addToCart(product, 1)
  if (result.valid) {
    snackbarMessage.value = `「${product.name}」をカートに追加しました`
    snackbarColor.value = 'success'
  } else {
    snackbarMessage.value = result.message ?? ''
    snackbarColor.value = 'warning'
  }
  snackbar.value = true
}
</script>

<template>
  <v-container class="py-8" style="max-width: 1280px;">
    <!-- ページヘッダー -->
    <div class="d-flex align-center flex-wrap ga-4 mb-6">
      <h1 class="text-h5 font-weight-bold">{{ t('product.title') }}</h1>
      <v-spacer />
    </div>

    <!-- カテゴリフィルター
         なぜ v-chip-group を使うか: 複数選択対応の chip 群を
         1 行に並べる Vuetify 標準パターン。アクティブ状態の管理も内包する。 -->
    <v-chip-group
      :model-value="selectedCategory ?? '__all__'"
      selected-class="bg-primary text-white"
      class="mb-6"
      @update:model-value="setCategory($event === '__all__' ? undefined : $event)"
    >
      <v-chip value="__all__">{{ t('product.allCategories') }}</v-chip>
      <v-chip
        v-for="cat in categories"
        :key="cat"
        :value="cat"
        class="text-capitalize"
      >
        {{ cat }}
      </v-chip>
    </v-chip-group>

    <!-- エラー -->
    <v-alert v-if="error" type="error" :text="t(error)" class="mb-6" />

    <!-- ローディング -->
    <div v-if="loading" class="d-flex justify-center py-16">
      <v-progress-circular indeterminate color="primary" size="48" />
    </div>

    <!-- 商品グリッド -->
    <template v-else-if="products.length > 0">
      <v-row>
        <v-col
          v-for="product in products"
          :key="product.id"
          cols="12"
          sm="6"
          md="4"
          lg="3"
        >
          <ProductCard :product="product" @add-to-cart="handleAddToCart" />
        </v-col>
      </v-row>

      <!-- ページネーション -->
      <div v-if="totalPages > 1" class="d-flex justify-center mt-8">
        <v-pagination
          :model-value="currentPage"
          :length="totalPages"
          rounded="circle"
          @update:model-value="setPage"
        />
      </div>
    </template>

    <!-- 商品なし -->
    <v-empty-state
      v-else
      icon="mdi-package-variant-closed"
      :title="t('product.notFound')"
    />

    <!-- カートに追加フィードバック（スナックバー）
         なぜ v-snackbar を使うか: トースト通知は画面の一部を占有しないよう
         画面下部に表示するのが Material Design のパターン。 -->
    <v-snackbar v-model="snackbar" :color="snackbarColor" :timeout="3000" location="bottom right">
      {{ snackbarMessage }}
    </v-snackbar>
  </v-container>
</template>

<script setup lang="ts">
const { t } = useI18n()
</script>

<template>
  <v-container class="fill-height">
    <v-empty-state
      icon="mdi-file-question"
      title="404 - ページが見つかりません"
      text="お探しのページは存在しないか、移動された可能性があります。"
      class="mx-auto"
    >
      <template #actions>
        <v-btn color="primary" :to="{ name: 'ProductList' }">
          {{ t('order.backToProducts') }}
        </v-btn>
      </template>
    </v-empty-state>
  </v-container>
</template>

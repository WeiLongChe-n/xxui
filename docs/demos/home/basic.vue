<template>
  <div class="page">
    <x-nav-bar title="确认订单" />

    <x-cell-group inset>
      <x-cell title="商品名称" value="XXUI 帆布包" />
      <x-cell title="购买数量">
        <x-stepper v-model="count" :min="0" :max="9" />
      </x-cell>
      <x-cell title="合计" :value="`¥ ${count * 99}`" />
    </x-cell-group>

    <div class="page__actions">
      <x-button type="primary" block :disabled="count === 0" @click="onSubmit">提交订单</x-button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { Toast } from 'xxui-mobile'

const count = ref(1)

const onSubmit = () => {
  Toast.success(`已提交 ${count.value} 件`)
}
</script>

<style scoped>
.page {
  min-height: 320px;
  padding-bottom: 20px;
  background: var(--x-background);
}

.page__actions {
  padding: 16px;
}
</style>

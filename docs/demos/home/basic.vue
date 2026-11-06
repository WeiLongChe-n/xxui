<template>
  <div class="page">
    <vl-nav-bar title="确认订单" />

    <vl-cell-group inset>
      <vl-cell title="商品名称" value="Vela 帆布包" />
      <vl-cell title="购买数量">
        <vl-stepper v-model="count" :min="0" :max="9" />
      </vl-cell>
      <vl-cell title="合计" :value="`¥ ${count * 99}`" />
    </vl-cell-group>

    <div class="page__actions">
      <vl-button type="primary" block :disabled="count === 0" @click="onSubmit">提交订单</vl-button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { Toast } from '@vela/mobile'

const count = ref(1)

const onSubmit = () => {
  Toast.success(`已提交 ${count.value} 件`)
}
</script>

<style scoped>
.page {
  min-height: 320px;
  padding-bottom: 20px;
  background: var(--vl-background);
}

.page__actions {
  padding: 16px;
}
</style>

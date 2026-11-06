<template>
  <div class="demo-col">
    <x-cell-group inset title="单选组">
      <div class="padding">
        <x-radio-group v-model="pay">
          <x-radio name="wechat">微信支付</x-radio>
          <x-radio name="alipay">支付宝</x-radio>
          <x-radio name="card">银行卡</x-radio>
          <x-radio name="balance" disabled>余额不足</x-radio>
        </x-radio-group>
      </div>
      <x-cell title="当前选择" :value="pay" />
    </x-cell-group>

    <x-cell-group inset title="纵向排列">
      <div class="padding">
        <x-radio-group v-model="plan" direction="vertical">
          <x-radio name="month">按月订阅 · ¥19/月</x-radio>
          <x-radio name="year">按年订阅 · ¥199/年</x-radio>
        </x-radio-group>
      </div>
    </x-cell-group>

    <x-cell-group inset title="方形与自定义颜色">
      <div class="padding demo-row">
        <x-radio v-model="shape" name="square" shape="square" checked-color="#8b4ef5">方形</x-radio>
        <x-radio v-model="shape" name="round" checked-color="#16a34a">圆形</x-radio>
      </div>
    </x-cell-group>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const pay = ref('wechat')
const plan = ref('year')
const shape = ref('round')
</script>

<style scoped>
.demo-col {
  gap: 16px;
}

.padding {
  padding: 12px 16px 16px;
}
</style>

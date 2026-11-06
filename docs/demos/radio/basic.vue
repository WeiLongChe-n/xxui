<template>
  <div class="demo-col">
    <vl-cell-group inset title="单选组">
      <div class="padding">
        <vl-radio-group v-model="pay">
          <vl-radio name="wechat">微信支付</vl-radio>
          <vl-radio name="alipay">支付宝</vl-radio>
          <vl-radio name="card">银行卡</vl-radio>
          <vl-radio name="balance" disabled>余额不足</vl-radio>
        </vl-radio-group>
      </div>
      <vl-cell title="当前选择" :value="pay" />
    </vl-cell-group>

    <vl-cell-group inset title="纵向排列">
      <div class="padding">
        <vl-radio-group v-model="plan" direction="vertical">
          <vl-radio name="month">按月订阅 · ¥19/月</vl-radio>
          <vl-radio name="year">按年订阅 · ¥199/年</vl-radio>
        </vl-radio-group>
      </div>
    </vl-cell-group>

    <vl-cell-group inset title="方形与自定义颜色">
      <div class="padding demo-row">
        <vl-radio v-model="shape" name="square" shape="square" checked-color="#8b4ef5">方形</vl-radio>
        <vl-radio v-model="shape" name="round" checked-color="#16a34a">圆形</vl-radio>
      </div>
    </vl-cell-group>
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

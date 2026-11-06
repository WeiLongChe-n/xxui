<template>
  <div class="demo-col">
    <vl-cell-group inset title="基础用法">
      <vl-cell title="商品评分" :value="`${score} 分`">
        <template #value>
          <vl-rate v-model="score" />
        </template>
      </vl-cell>
      <vl-cell title="半星">
        <template #value>
          <vl-rate v-model="half" allow-half :size="18" />
        </template>
      </vl-cell>
      <vl-cell title="只读">
        <template #value>
          <vl-rate :model-value="4" readonly :size="16" />
        </template>
      </vl-cell>
    </vl-cell-group>

    <vl-cell-group inset title="自定义">
      <div class="padding demo-col">
        <vl-rate v-model="custom" :count="6" :size="26" color="#ef4444" />
        <p class="demo-note">支持自定义数量、尺寸、颜色</p>
        <vl-rate v-model="disabledValue" disabled />
      </div>
    </vl-cell-group>

    <vl-cell-group inset title="表单中使用">
      <vl-form-item label="服务评分" name="rate">
        <vl-rate v-model="score" allow-half />
      </vl-form-item>
    </vl-cell-group>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const score = ref(4)
const half = ref(3.5)
const custom = ref(5)
const disabledValue = ref(2)
</script>

<style scoped>
.demo-col {
  gap: 16px;
}

.padding {
  padding: 12px 16px 16px;
}
</style>

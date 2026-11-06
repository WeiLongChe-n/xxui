<template>
  <div class="demo-col">
    <x-cell-group inset title="基础用法">
      <x-cell title="商品评分" :value="`${score} 分`">
        <template #value>
          <x-rate v-model="score" />
        </template>
      </x-cell>
      <x-cell title="半星">
        <template #value>
          <x-rate v-model="half" allow-half :size="18" />
        </template>
      </x-cell>
      <x-cell title="只读">
        <template #value>
          <x-rate :model-value="4" readonly :size="16" />
        </template>
      </x-cell>
    </x-cell-group>

    <x-cell-group inset title="自定义">
      <div class="padding demo-col">
        <x-rate v-model="custom" :count="6" :size="26" color="#ef4444" />
        <p class="demo-note">支持自定义数量、尺寸、颜色</p>
        <x-rate v-model="disabledValue" disabled />
      </div>
    </x-cell-group>

    <x-cell-group inset title="表单中使用">
      <x-form-item label="服务评分" name="rate">
        <x-rate v-model="score" allow-half />
      </x-form-item>
    </x-cell-group>
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

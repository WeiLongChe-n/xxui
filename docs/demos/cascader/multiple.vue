<template>
  <div class="cascader-demo">
    <x-cascader
      v-model="value"
      :options="options"
      title="选择地区（可多选）"
      multiple
      @finish="onFinish"
    />
    <p class="cascader-demo__value">已选 {{ value.length }} 条路径</p>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { Toast, areaData } from 'xxui-mobile'
import type { PickerValue } from 'xxui-mobile'

const options = areaData
const value = ref<PickerValue[][]>([['330000', '330100', '330106']])

const onFinish = (val: PickerValue[] | PickerValue[][]) => {
  Toast(`已选 ${(val as PickerValue[][]).length} 项`)
}
</script>

<style scoped>
.cascader-demo {
  width: 100%;
  overflow: hidden;
  border-radius: 8px;
}

.cascader-demo__value {
  margin: 8px 0 0;
  font-size: 12px;
  color: var(--x-text-color-2);
}
</style>

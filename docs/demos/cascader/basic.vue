<template>
  <div class="cascader-demo">
    <vl-cascader
      v-model="value"
      :options="options"
      title="选择地区"
      @finish="onFinish"
    />
    <p class="cascader-demo__value">已选：{{ text || '未选择' }}</p>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { Toast, areaData } from '@vela/mobile'
import type { PickerValue } from '@vela/mobile'

const options = areaData
const value = ref<PickerValue[]>(['330000', '330100', '330106'])

const text = computed(() => {
  const parts: string[] = []
  let list = options
  for (const code of value.value) {
    const found = list?.find((item) => item.value === code)
    if (!found) break
    parts.push(found.text)
    list = found.children ?? []
  }
  return parts.join(' / ')
})

const onFinish = () => {
  Toast('已选择地区')
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
  color: var(--vl-text-color-2);
}
</style>

<template>
  <div class="picker-demo">
    <x-button type="primary" plain block @click="show = true">选择日期</x-button>
    <p class="picker-demo__value">{{ currentText }}</p>

    <x-picker
      v-model:show="show"
      v-model="value"
      :columns="[years, months, days]"
      title="选择日期"
      @confirm="onConfirm"
    />
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import type { PickerConfirmPayload, PickerValue } from 'xxui-mobile'

const show = ref(false)
const value = ref<PickerValue[]>(['2026', '11', '06'])

const range = (start: number, end: number) =>
  Array.from({ length: end - start + 1 }, (_, index) => {
    const value = String(start + index)
    return { text: value, value }
  })

const years = range(2020, 2030)
const months = Array.from({ length: 12 }, (_, index) => {
  const value = String(index + 1).padStart(2, '0')
  return { text: `${value} 月`, value }
})
const days = Array.from({ length: 31 }, (_, index) => {
  const value = String(index + 1).padStart(2, '0')
  return { text: `${value} 日`, value }
})

const currentText = computed(() => value.value.join(' / '))

const onConfirm = (payload: PickerConfirmPayload) => {
  value.value = payload.selectedValues
}
</script>

<style scoped>
.picker-demo {
  display: flex;
  flex-direction: column;
  gap: 12px;
  width: 100%;
}

.picker-demo__value {
  margin: 0;
  font-size: 12px;
  color: var(--x-text-color-2);
  text-align: center;
}
</style>

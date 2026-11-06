<template>
  <div class="picker-demo">
    <vl-button type="primary" block @click="show = true">选择城市</vl-button>
    <p class="picker-demo__value">当前：{{ currentText }}</p>

    <vl-picker
      v-model:show="show"
      v-model="value"
      :columns="columns"
      title="选择城市"
      @confirm="onConfirm"
    />
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import type { PickerConfirmPayload, PickerValue } from '@vela/mobile'

const show = ref(false)
const value = ref<PickerValue[]>(['hangzhou'])
const confirmed = ref('杭州')

const columns = [
  { text: '北京', value: 'beijing' },
  { text: '上海', value: 'shanghai' },
  { text: '杭州', value: 'hangzhou' },
  { text: '成都', value: 'chengdu' },
  { text: '西安', value: 'xian' },
  { text: '厦门', value: 'xiamen' },
  { text: '青岛', value: 'qingdao' },
]

const currentText = computed(() => confirmed.value)

const onConfirm = (payload: PickerConfirmPayload) => {
  confirmed.value = payload.selectedOptions[0]?.text ?? ''
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
  color: var(--vl-text-color-2);
  text-align: center;
}
</style>

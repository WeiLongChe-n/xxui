<template>
  <div class="area-demo">
    <x-cell title="所在地区" :value="text || '请选择'" is-link @click="show = true" />
    <p class="area-demo__tip">内置 34 个省级行政区、3800+ 区县，支持三级联动。</p>

    <x-area v-model:show="show" v-model="codes" title="选择地区" @confirm="onConfirm" />
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { getAreaText, areaData } from '@xxui/mobile'
import type { PickerConfirmPayload } from '@xxui/mobile'

const show = ref(false)
const codes = ref<(string | number)[]>(['330000', '330100', '330106'])
const text = ref(getAreaText(codes.value, areaData))

const onConfirm = (payload: PickerConfirmPayload & { selectedText: string }) => {
  text.value = payload.selectedText
}
</script>

<style scoped>
.area-demo {
  width: 100%;
  overflow: hidden;
  background: var(--x-background-2);
  border-radius: 8px;
}

.area-demo__tip {
  margin: 0;
  padding: 10px 16px 14px;
  font-size: 12px;
  line-height: 1.6;
  color: var(--x-text-color-3);
}
</style>

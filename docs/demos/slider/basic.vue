<template>
  <div class="demo-col">
    <vl-cell-group inset title="基础用法">
      <vl-cell title="音量" :value="`${volume}%`">
        <template #value>
          <div class="slider-row">
            <vl-slider v-model="volume" />
            <span class="value">{{ volume }}</span>
          </div>
        </template>
      </vl-cell>
      <vl-cell title="带步长（10）" :value="String(step)" />
      <div class="padding">
        <vl-slider v-model="step" :step="10" />
      </div>
    </vl-cell-group>

    <vl-cell-group inset title="自定义范围与颜色">
      <div class="padding demo-col">
        <vl-slider v-model="price" :min="100" :max="1000" :step="100" active-color="#16a34a" />
        <p class="demo-note">价格区间：¥{{ price }}</p>
        <vl-slider v-model="blue" :bar-height="8" :button-size="28" active-color="#8b4ef5" />
      </div>
    </vl-cell-group>

    <vl-cell-group inset title="禁用">
      <div class="padding">
        <vl-slider v-model="disabledValue" disabled />
      </div>
    </vl-cell-group>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const volume = ref(40)
const step = ref(30)
const price = ref(400)
const blue = ref(70)
const disabledValue = ref(50)
</script>

<style scoped>
.demo-col {
  gap: 16px;
}

.padding {
  padding: 4px 16px 16px;
}

.slider-row {
  display: flex;
  gap: 12px;
  align-items: center;
  width: 160px;
}

.value {
  font-size: 12px;
  color: var(--vl-text-color-3);
}
</style>

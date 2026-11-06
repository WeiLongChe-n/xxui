<template>
  <div class="demo-col">
    <div class="demo-row">
      <vl-progress :percentage="40" />
      <span class="value">40%</span>
    </div>

    <div class="demo-row">
      <vl-progress :percentage="65" color="#16a34a" />
      <span class="value">65%</span>
    </div>

    <vl-progress :percentage="30" :show-pivot="true" />

    <vl-progress :percentage="80" :stroke-width="10" :show-pivot="true" pivot-position="outside" />

    <vl-progress :percentage="60" striped animated :stroke-width="8" />

    <div class="demo-row">
      <vl-button size="mini" @click="value = Math.max(value - 10, 0)">-10</vl-button>
      <vl-progress :percentage="value" :show-pivot="true" />
      <vl-button size="mini" @click="value = Math.min(value + 10, 100)">+10</vl-button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const value = ref(50)
</script>

<style scoped>
.demo-col {
  gap: 18px;
}

.demo-row {
  display: flex;
  gap: 12px;
  align-items: center;
  width: 100%;
}

.value {
  flex: none;
  width: 40px;
  font-size: 12px;
  color: var(--vl-text-color-3);
}
</style>

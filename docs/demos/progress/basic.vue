<template>
  <div class="demo-col">
    <div class="demo-row">
      <x-progress :percentage="40" />
      <span class="value">40%</span>
    </div>

    <div class="demo-row">
      <x-progress :percentage="65" color="#16a34a" />
      <span class="value">65%</span>
    </div>

    <x-progress :percentage="30" :show-pivot="true" />

    <x-progress :percentage="80" :stroke-width="10" :show-pivot="true" pivot-position="outside" />

    <x-progress :percentage="60" striped animated :stroke-width="8" />

    <div class="demo-row">
      <x-button size="mini" @click="value = Math.max(value - 10, 0)">-10</x-button>
      <x-progress :percentage="value" :show-pivot="true" />
      <x-button size="mini" @click="value = Math.min(value + 10, 100)">+10</x-button>
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
  color: var(--x-text-color-3);
}
</style>

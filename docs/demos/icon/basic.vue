<script setup lang="ts">
import { iconPaths } from '@xxui/mobile'

const names = Object.keys(iconPaths)
</script>

<template>
  <div class="icon-demo">
    <div v-for="name in names" :key="name" class="icon-demo__item">
      <x-icon :name="name" size="22" />
      <span>{{ name }}</span>
    </div>
  </div>
</template>

<style scoped>
.icon-demo {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(84px, 1fr));
  gap: 12px;
}

.icon-demo__item {
  display: flex;
  flex-direction: column;
  gap: 8px;
  align-items: center;
  padding: 12px 4px;
  font-size: 11px;
  color: var(--x-text-color-2);
  text-align: center;
  word-break: break-all;
  background: var(--x-background-3);
  border-radius: 10px;
}
</style>

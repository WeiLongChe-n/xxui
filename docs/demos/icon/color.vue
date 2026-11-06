<script setup lang="ts">
import { ref } from 'vue'

const palette = [
  { label: '跟随文字', color: '' },
  { label: '主色', color: 'var(--x-primary)' },
  { label: '成功', color: 'var(--x-success)' },
  { label: '警告', color: 'var(--x-warning)' },
  { label: '危险', color: 'var(--x-danger)' },
]

const active = ref('var(--x-primary)')
</script>

<template>
  <div class="icon-color">
    <div class="icon-color__preview">
      <x-icon name="like" size="44" :color="active || undefined" />
      <code>{{ active || 'currentColor' }}</code>
    </div>

    <div class="icon-color__palette">
      <button
        v-for="item in palette"
        :key="item.label"
        type="button"
        class="icon-color__chip"
        :class="{ 'icon-color__chip--active': active === item.color }"
        @click="active = item.color"
      >
        <i class="icon-color__dot" :style="{ background: item.color || 'currentColor' }" />
        {{ item.label }}
      </button>
    </div>

    <div class="icon-color__row">
      <span>不同尺寸：</span>
      <x-icon name="star" :size="14" color="var(--x-primary)" />
      <x-icon name="star" :size="18" color="var(--x-primary)" />
      <x-icon name="star" :size="24" color="var(--x-primary)" />
      <x-icon name="star" :size="32" color="var(--x-primary)" />
    </div>
  </div>
</template>

<style scoped>
.icon-color {
  display: flex;
  flex-direction: column;
  gap: 18px;
  align-items: center;
}

.icon-color__preview {
  display: flex;
  flex-direction: column;
  gap: 10px;
  align-items: center;
}

.icon-color__preview code {
  padding: 2px 8px;
  font-size: 11px;
  color: var(--x-text-color-2);
  background: var(--x-background-3);
  border-radius: 6px;
}

.icon-color__palette {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 8px;
  width: 100%;
  max-width: 300px;
}

.icon-color__chip {
  display: inline-flex;
  gap: 6px;
  align-items: center;
  justify-content: center;
  padding: 6px 10px;
  font-size: 12px;
  color: var(--x-text-color);
  cursor: pointer;
  background: var(--x-background-2);
  border: 1px solid var(--x-border-color);
  border-radius: 999px;
  transition: border-color var(--x-duration-fast);
}

.icon-color__chip--active {
  border-color: var(--x-primary);
}

.icon-color__dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
}

.icon-color__row {
  display: flex;
  gap: 12px;
  align-items: center;
  font-size: 12px;
  color: var(--x-text-color-2);
}
</style>

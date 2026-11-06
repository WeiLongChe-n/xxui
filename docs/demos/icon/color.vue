<script setup lang="ts">
import { ref } from 'vue'

const palette = [
  { label: '跟随文字', color: '' },
  { label: '主色', color: 'var(--vl-primary)' },
  { label: '成功', color: 'var(--vl-success)' },
  { label: '警告', color: 'var(--vl-warning)' },
  { label: '危险', color: 'var(--vl-danger)' },
]

const active = ref('var(--vl-primary)')
</script>

<template>
  <div class="icon-color">
    <div class="icon-color__preview">
      <vl-icon name="like" size="44" :color="active || undefined" />
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
      <vl-icon name="star" :size="14" color="var(--vl-primary)" />
      <vl-icon name="star" :size="18" color="var(--vl-primary)" />
      <vl-icon name="star" :size="24" color="var(--vl-primary)" />
      <vl-icon name="star" :size="32" color="var(--vl-primary)" />
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
  color: var(--vl-text-color-2);
  background: var(--vl-background-3);
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
  color: var(--vl-text-color);
  cursor: pointer;
  background: var(--vl-background-2);
  border: 1px solid var(--vl-border-color);
  border-radius: 999px;
  transition: border-color var(--vl-duration-fast);
}

.icon-color__chip--active {
  border-color: var(--vl-primary);
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
  color: var(--vl-text-color-2);
}
</style>

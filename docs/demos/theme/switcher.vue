<script setup lang="ts">
import { computed } from 'vue'
import { brandOptions, useTheme } from '@vela/index'

const { mode, brand, resolvedMode, setMode, setBrand, toggleMode } = useTheme()

const modes = [
  { name: 'light' as const, label: '浅色' },
  { name: 'dark' as const, label: '深色' },
  { name: 'auto' as const, label: '跟随系统' },
]

const swatch = (hue: number, saturation = '88%') => `hsl(${hue} ${saturation} 55%)`

const currentModeLabel = computed(
  () => modes.find((item) => item.name === mode.value)?.label || '浅色',
)
</script>

<template>
  <div class="theme-demo">
    <div class="theme-demo__row">
      <span class="theme-demo__label">明暗模式</span>
      <div class="theme-demo__chips">
        <button
          v-for="item in modes"
          :key="item.name"
          type="button"
          :class="['theme-demo__chip', { 'is-active': mode === item.name }]"
          @click="setMode(item.name)"
        >
          {{ item.label }}
        </button>
        <button type="button" class="theme-demo__chip" @click="toggleMode">快速反转</button>
      </div>
    </div>

    <div class="theme-demo__row">
      <span class="theme-demo__label">品牌配色</span>
      <div class="theme-demo__brands">
        <button
          v-for="item in brandOptions"
          :key="item.name"
          type="button"
          :class="['theme-demo__brand', { 'is-active': brand === item.name }]"
          :title="item.label"
          @click="setBrand(item.name)"
        >
          <i :style="{ background: swatch(item.hue, item.saturation) }" />
          {{ item.label }}
        </button>
      </div>
    </div>

    <div class="theme-demo__preview">
      <vl-cell-group inset>
        <vl-cell title="当前主题" :value="`${currentModeLabel} / ${resolvedMode}`" />
        <vl-cell title="主色" :value="`hsl(${brandOptions.find((i) => i.name === brand)?.hue} 88% 55%)`" />
        <vl-cell title="商品名称" label="副标题会跟随主题变化" is-link />
      </vl-cell-group>

      <div class="theme-demo__actions">
        <vl-button type="primary" size="small">主要按钮</vl-button>
        <vl-button type="primary" size="small" plain>朴素按钮</vl-button>
        <vl-button size="small">默认按钮</vl-button>
        <vl-tag type="primary">标签</vl-tag>
        <vl-tag type="success">已完成</vl-tag>
        <vl-tag type="danger">已取消</vl-tag>
      </div>
    </div>
  </div>
</template>

<style scoped>
.theme-demo {
  display: flex;
  flex-direction: column;
  gap: 14px;
}

.theme-demo__row {
  display: flex;
  gap: 12px;
  align-items: flex-start;
}

.theme-demo__label {
  flex: none;
  width: 64px;
  padding-top: 5px;
  font-size: 12px;
  color: var(--vl-text-color-3);
}

.theme-demo__chips,
.theme-demo__brands {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.theme-demo__chip {
  padding: 5px 12px;
  font-size: 12px;
  color: var(--vl-text-color-2);
  cursor: pointer;
  background: var(--vl-background-3);
  border: 1px solid var(--vl-border-color);
  border-radius: 999px;
}

.theme-demo__chip.is-active {
  color: var(--vl-primary);
  background: var(--vl-primary-light);
  border-color: var(--vl-primary);
}

.theme-demo__brand {
  display: inline-flex;
  gap: 6px;
  align-items: center;
  padding: 4px 10px;
  font-size: 12px;
  color: var(--vl-text-color-2);
  cursor: pointer;
  background: transparent;
  border: 1px solid var(--vl-border-color);
  border-radius: 999px;
}

.theme-demo__brand i {
  width: 10px;
  height: 10px;
  border-radius: 50%;
}

.theme-demo__brand.is-active {
  color: var(--vl-text-color);
  border-color: var(--vl-primary);
}

.theme-demo__preview {
  padding: 12px;
  margin-top: 4px;
  background: var(--vl-background);
  border-radius: 12px;
}

.theme-demo__actions {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  align-items: center;
  padding: 12px 4px 4px;
}
</style>

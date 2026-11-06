<script setup lang="ts">
import { computed } from 'vue'
import { createNamespace } from '../../utils'
import type { BrandName } from '../../theme'

defineOptions({ name: 'VlConfigProvider' })

const props = defineProps<{
  /** 局部明暗主题 */
  theme?: 'light' | 'dark'
  /** 局部品牌配色 */
  brand?: BrandName
  /** 覆盖任意 CSS 变量，如 { '--vl-primary': '#ff5000' } */
  themeVars?: Record<string, string | number>
  tag?: string
}>()

const { bem } = createNamespace('config-provider')

const style = computed(() => {
  if (!props.themeVars) return undefined
  const result: Record<string, string> = {}
  Object.entries(props.themeVars).forEach(([key, value]) => {
    result[key] = String(value)
  })
  return result
})
</script>

<template>
  <component
    :is="tag || 'div'"
    :class="bem()"
    :data-theme="theme"
    :data-brand="brand"
    :style="style"
  >
    <slot />
  </component>
</template>

<style lang="scss">
.vl-config-provider {
  color: var(--vl-text-color);
  font-family: var(--vl-font-family);
  font-size: var(--vl-font-size);
  line-height: 1.5;
}
</style>

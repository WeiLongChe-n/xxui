<script setup lang="ts">
import { computed } from 'vue'
import { createNamespace } from '../../utils'
import { provideTeleportTarget } from '../../utils/teleport'
import type { BrandName } from '../../theme'

defineOptions({ name: 'XConfigProvider' })

const props = defineProps<{
  /** 局部明暗主题 */
  theme?: 'light' | 'dark'
  /** 局部品牌配色 */
  brand?: BrandName
  /** 覆盖任意 CSS 变量，如 { '--x-primary': '#ff5000' } */
  themeVars?: Record<string, string | number>
  /** 子树内弹层的挂载目标，默认 body */
  teleport?: string | HTMLElement
  tag?: string
}>()

const { bem } = createNamespace('config-provider')

provideTeleportTarget(props.teleport)

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
.x-config-provider {
  color: var(--x-text-color);
  font-family: var(--x-font-family);
  font-size: var(--x-font-size);
  line-height: 1.5;
}
</style>

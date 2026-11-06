<script setup lang="ts">
import { computed, provide, ref } from 'vue'
import { addUnit, createNamespace } from '../../utils'
import VlBadge from '../badge/Badge.vue'
import VlIcon from '../icon/Icon.vue'

defineOptions({ name: 'VlGrid' })

const props = withDefaults(
  defineProps<{
    /** 每行个数 */
    columns?: number
    /** 格子间距 */
    gap?: number | string
    border?: boolean
    /** 格子是否固定为正方形 */
    square?: boolean
    clickable?: boolean
  }>(),
  { columns: 4, gap: 0, border: true },
)

const { bem } = createNamespace('grid')
const cellWidth = ref(0)

provide('vl-grid', {
  columns: computed(() => props.columns),
  border: computed(() => props.border),
  square: computed(() => props.square),
  clickable: computed(() => !!props.clickable),
})
</script>

<template>
  <div
    :class="[bem(), { [bem('', 'border')]: border, [bem('', 'square')]: square }]"
    :style="{ gap: addUnit(gap), gridTemplateColumns: `repeat(${columns}, 1fr)` }"
  >
    <slot />
  </div>
</template>

<style lang="scss">
.vl-grid {
  display: grid;
  background: var(--vl-background-2);

  &--border {
    gap: 1px !important;
    background: var(--vl-border-color);
  }

  &--square .vl-grid-item {
    aspect-ratio: 1 / 1;
  }
}
</style>

<script setup lang="ts">
import { computed } from 'vue'
import { createNamespace } from '../../utils'

defineOptions({ name: 'XCellGroup' })

const props = withDefaults(
  defineProps<{
    title?: string
    /** 卡片式分组 */
    inset?: boolean
    border?: boolean
  }>(),
  { border: true },
)

const { bem } = createNamespace('cell-group')

const classes = computed(() => [
  bem(),
  {
    [bem('', 'inset')]: props.inset,
    [bem('', 'borderless')]: !props.border,
  },
])
</script>

<template>
  <div :class="classes">
    <div v-if="title || $slots.title" :class="bem('title')">
      <slot name="title">{{ title }}</slot>
    </div>
    <slot />
  </div>
</template>

<style lang="scss">
.x-cell-group {
  margin-bottom: 12px;

  &__title {
    padding: 16px 16px 8px;
    font-size: var(--x-font-size-sm);
    color: var(--x-text-color-3);
  }

  &--inset {
    margin-right: 12px;
    margin-left: 12px;
    overflow: hidden;
    border-radius: var(--x-radius-lg);

    .x-cell:last-child::after {
      display: none;
    }
  }

  &--borderless {
    .x-cell::after {
      display: none;
    }
  }
}
</style>

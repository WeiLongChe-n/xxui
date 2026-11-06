<script setup lang="ts">
import { computed } from 'vue'
import { createNamespace } from '../../utils'

defineOptions({ name: 'XDivider' })

const props = withDefaults(
  defineProps<{
    /** 文字位置 */
    contentPosition?: 'left' | 'center' | 'right'
    dashed?: boolean
    /** 细线 */
    hairline?: boolean
    color?: string
    borderColor?: string
  }>(),
  { contentPosition: 'center', hairline: true },
)

const { bem } = createNamespace('divider')

const classes = computed(() => [
  bem(),
  bem('', props.contentPosition),
  {
    [bem('', 'dashed')]: props.dashed,
    [bem('', 'hairline')]: props.hairline,
  },
])

const style = computed(() => ({
  color: props.color,
  borderColor: props.borderColor,
}))
</script>

<template>
  <div :class="classes" :style="style" role="separator">
    <div :class="bem('content')">
      <slot />
    </div>
  </div>
</template>

<style lang="scss">
.x-divider {
  display: flex;
  align-items: center;
  margin: 16px 0;
  font-size: var(--x-font-size-sm);
  color: var(--x-text-color-3);
  border-color: var(--x-border-color);

  &::before,
  &::after {
    flex: 1;
    height: 1px;
    background: var(--x-border-color);
    content: '';
  }

  &--hairline::before,
  &--hairline::after {
    transform: scaleY(0.5);
  }

  &--dashed::before,
  &--dashed::after {
    background: none;
    border-top: 1px dashed var(--x-border-color);
    transform: none;
  }

  &__content:not(:empty) {
    padding: 0 12px;
  }

  &--left::before {
    max-width: 10%;
  }

  &--right::after {
    max-width: 10%;
  }

  &--center &__content:empty {
    display: none;
  }
}
</style>

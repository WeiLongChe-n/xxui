<script setup lang="ts">
import { computed, provide, ref } from 'vue'
import { createNamespace } from '../../utils'
import { STEPS_KEY } from './context'

defineOptions({ name: 'XSteps' })

const props = withDefaults(
  defineProps<{
    active?: number
    direction?: 'horizontal' | 'vertical'
    activeColor?: string
    finishIcon?: string
    activeIcon?: string
    inactiveIcon?: string
  }>(),
  { active: 0, direction: 'horizontal', activeColor: 'var(--x-primary)' },
)

const { bem } = createNamespace('steps')
const count = ref(0)

provide(STEPS_KEY, {
  active: computed(() => props.active),
  direction: computed(() => props.direction),
  activeColor: computed(() => props.activeColor),
  finishIcon: computed(() => props.finishIcon),
  activeIcon: computed(() => props.activeIcon),
  inactiveIcon: computed(() => props.inactiveIcon),
  register: () => count.value++,
  total: computed(() => count.value),
})
</script>

<template>
  <div :class="[bem(), bem('', direction)]">
    <slot />
  </div>
</template>

<style lang="scss">
.x-steps {
  display: flex;
  padding: 16px 8px;
  background: var(--x-background-2);

  &--vertical {
    flex-direction: column;
    padding: 16px;
  }
}
</style>

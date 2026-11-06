<script setup lang="ts">
import { computed, inject } from 'vue'
import { createNamespace } from '../../utils'
import { STEPS_KEY, type StepStatus } from './context'
import XIcon from '../icon/Icon.vue'

defineOptions({ name: 'XStep' })

const props = defineProps<{
  title?: string
  description?: string
  /** 自定义图标 */
  icon?: string
  /** 手动指定状态 */
  status?: StepStatus
}>()

const parent = inject(STEPS_KEY, null)
if (!parent) {
  throw new Error('[XXUI] <x-step> 必须放在 <x-steps> 内部使用')
}

const { bem } = createNamespace('step')
const index = parent.register()

const currentStatus = computed<StepStatus>(() => {
  if (props.status) return props.status
  if (index < parent.active.value) return 'finish'
  if (index === parent.active.value) return 'process'
  return 'wait'
})

const isLast = computed(() => index === parent.total.value - 1)

const iconName = computed(() => {
  const status = currentStatus.value
  if (props.icon) return props.icon
  if (status === 'finish') return parent.finishIcon.value || 'check'
  if (status === 'process') return parent.activeIcon.value
  if (status === 'error') return 'close'
  return parent.inactiveIcon.value
})

const circleStyle = computed(() => {
  if (currentStatus.value === 'process' || currentStatus.value === 'finish') {
    return { color: '#fff', background: parent.activeColor.value, borderColor: parent.activeColor.value }
  }
  if (currentStatus.value === 'error') {
    return { color: '#fff', background: 'var(--x-danger)', borderColor: 'var(--x-danger)' }
  }
  return {}
})
</script>

<template>
  <div
    :class="[
      bem(),
      bem('', parent.direction.value),
      bem('', currentStatus),
    ]"
  >
    <div :class="bem('head')">
      <div :class="bem('circle')" :style="circleStyle">
        <XIcon v-if="iconName" :name="iconName" />
        <slot v-else name="icon">{{ index + 1 }}</slot>
      </div>
      <div v-if="!isLast" :class="bem('line')">
        <i :class="bem('line-inner')" />
      </div>
    </div>
    <div :class="bem('body')">
      <div :class="bem('title')">
        <slot name="title">{{ title }}</slot>
      </div>
      <div v-if="description || $slots.description" :class="bem('description')">
        <slot name="description">{{ description }}</slot>
      </div>
    </div>
  </div>
</template>

<style lang="scss">
.x-step {
  position: relative;
  flex: 1;
  overflow: hidden;

  &__head {
    display: flex;
    align-items: center;
  }

  &__circle {
    display: flex;
    flex: none;
    align-items: center;
    justify-content: center;
    width: 22px;
    height: 22px;
    font-size: 12px;
    font-weight: 500;
    color: var(--x-text-color-3);
    background: var(--x-background-2);
    border: 1px solid var(--x-border-color);
    border-radius: 50%;
    transition: background-color var(--x-duration-fast), border-color var(--x-duration-fast);
  }

  &__line {
    flex: 1;
    height: 1px;
    margin: 0 6px;
    background: var(--x-border-color);
  }

  &__line-inner {
    display: block;
    width: 0;
    height: 100%;
    background: var(--x-primary);
    transition: width var(--x-duration) var(--x-ease);
  }

  &--finish &__line-inner {
    width: 100%;
  }

  &__body {
    padding: 8px 8px 0 0;
  }

  &__title {
    font-size: 14px;
    color: var(--x-text-color);
  }

  &__description {
    margin-top: 4px;
    font-size: 12px;
    line-height: 18px;
    color: var(--x-text-color-3);
  }

  &--wait &__title {
    color: var(--x-text-color-3);
  }

  &--error &__title {
    color: var(--x-danger);
  }

  /* 垂直排列 */
  &--vertical {
    display: flex;

    .x-step__head {
      flex-direction: column;
    }

    .x-step__line {
      flex: 1;
      width: 1px;
      height: auto;
      min-height: 20px;
      margin: 4px 0;
    }

    .x-step__line-inner {
      width: 100%;
      height: 0;
      transition: height var(--x-duration) var(--x-ease);
    }

    &.x-step--finish .x-step__line-inner {
      width: 100%;
      height: 100%;
    }

    .x-step__body {
      flex: 1;
      padding: 0 0 20px 12px;
    }
  }

  &--vertical:last-child .x-step__body {
    padding-bottom: 0;
  }
}
</style>

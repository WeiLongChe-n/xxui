<script setup lang="ts">
import { computed } from 'vue'
import { addUnit, createNamespace } from '../../utils'
import XLoading from '../loading/Loading.vue'
import XIcon from '../icon/Icon.vue'

defineOptions({ name: 'XButton' })

const props = defineProps<{
  type?: 'primary' | 'success' | 'warning' | 'danger' | 'default'
  size?: 'large' | 'normal' | 'small' | 'mini'
  /** 朴素按钮 */
  plain?: boolean
  /** 块级按钮 */
  block?: boolean
  round?: boolean
  square?: boolean
  disabled?: boolean
  loading?: boolean
  loadingText?: string
  icon?: string
  iconPosition?: 'left' | 'right'
  /** 使用 0.5px 描边 */
  hairline?: boolean
  /** 自定义背景色，可用于渐变色 */
  color?: string
  tag?: string
  nativeType?: 'button' | 'submit' | 'reset'
}>()

const emit = defineEmits<{
  click: [event: MouseEvent]
}>()

const { bem } = createNamespace('button')

const classes = computed(() => [
  bem(),
  bem('', props.type),
  props.size && props.size !== 'normal' ? bem('', props.size) : '',
  {
    [bem('', 'plain')]: props.plain,
    [bem('', 'block')]: props.block,
    [bem('', 'round')]: props.round,
    [bem('', 'square')]: props.square,
    [bem('', 'disabled')]: props.disabled,
    [bem('', 'loading')]: props.loading,
    [bem('', 'hairline')]: props.hairline,
  },
])

const style = computed(() => (props.color ? { background: props.color, borderColor: props.color } : undefined))

const onClick = (event: MouseEvent) => {
  if (props.disabled || props.loading) return
  emit('click', event)
}

const loadingSize = computed(() => addUnit(props.size === 'mini' || props.size === 'small' ? 14 : 18))
</script>

<template>
  <component
    :is="tag || 'button'"
    :class="classes"
    :style="style"
    :type="tag ? undefined : nativeType || 'button'"
    :disabled="disabled || loading"
    @click="onClick"
  >
    <XLoading v-if="loading" :size="loadingSize" :class="bem('loading')" />
    <XIcon v-else-if="icon && iconPosition !== 'right'" :name="icon" :class="bem('icon')" />
    <span :class="bem('text')">
      <slot>{{ loading && loadingText ? loadingText : '' }}</slot>
    </span>
    <XIcon v-if="icon && iconPosition === 'right'" :name="icon" :class="bem('icon')" />
  </component>
</template>

<style lang="scss">
@use '../../styles/mixins' as *;

.x-button {
  --x-button-color: var(--x-text-color);
  --x-button-bg: var(--x-background-2);
  --x-button-border: var(--x-border-color);

  position: relative;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  height: 44px;
  padding: 0 18px;
  overflow: hidden;
  font-size: 15px;
  font-weight: 500;
  line-height: 1;
  color: var(--x-button-color);
  white-space: nowrap;
  vertical-align: middle;
  background: var(--x-button-bg);
  border: 1px solid var(--x-button-border);
  border-radius: 10px;
  outline: none;
  appearance: none;
  transition: opacity var(--x-duration-fast), transform var(--x-duration-fast);

  &::after {
    position: absolute;
    inset: 0;
    content: '';
    background: #000;
    opacity: 0;
    transition: opacity var(--x-duration-fast);
  }

  &:active::after {
    opacity: 0.06;
  }

  &__icon + &__text,
  &__text + &__icon {
    margin-left: 5px;
  }

  &__loading {
    margin-right: 4px;
  }

  &__text {
    display: inline-flex;
    align-items: center;
  }

  /* 类型 */
  &--primary {
    --x-button-color: #fff;
    --x-button-bg: var(--x-primary);
    --x-button-border: var(--x-primary);
  }

  &--success {
    --x-button-color: #fff;
    --x-button-bg: var(--x-success);
    --x-button-border: var(--x-success);
  }

  &--warning {
    --x-button-color: #fff;
    --x-button-bg: var(--x-warning);
    --x-button-border: var(--x-warning);
  }

  &--danger {
    --x-button-color: #fff;
    --x-button-bg: var(--x-danger);
    --x-button-border: var(--x-danger);
  }

  &--default {
    --x-button-color: var(--x-text-color);
    --x-button-bg: var(--x-background-2);
    --x-button-border: var(--x-border-color);
  }

  /* 朴素 */
  &--plain {
    background: transparent;
    border-color: var(--x-button-bg);
    color: var(--x-button-bg);

    &::after {
      display: none;
    }
  }

  &--plain.x-button--default {
    background: var(--x-background-2);
    border-color: var(--x-border-color);
    color: var(--x-text-color-2);
  }

  /* 尺寸 */
  &--large {
    width: 100%;
    height: 50px;
    font-size: 16px;
  }

  &--small {
    height: 34px;
    padding: 0 12px;
    font-size: 13px;
    border-radius: 8px;
  }

  &--mini {
    height: 26px;
    padding: 0 9px;
    font-size: 12px;
    font-weight: 400;
    border-radius: 6px;
  }

  &--block {
    display: flex;
    width: 100%;
  }

  &--round {
    border-radius: 999px;
  }

  &--square {
    border-radius: 0;
  }

  &--disabled {
    opacity: 0.45;
    cursor: not-allowed;
  }

  &--loading {
    cursor: default;
  }

  &--hairline {
    border-width: 0;

    &::before {
      position: absolute;
      inset: 0;
      content: '';
      border: 1px solid var(--x-button-border);
      border-radius: inherit;
      transform: scale(0.5);
      transform-origin: 0 0;
      width: 200%;
      height: 200%;
      pointer-events: none;
    }
  }
}
</style>

<script setup lang="ts">
import { computed } from 'vue'
import { addUnit, createNamespace } from '../../utils'
import VlLoading from '../loading/Loading.vue'
import VlIcon from '../icon/Icon.vue'

defineOptions({ name: 'VlButton' })

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
    <VlLoading v-if="loading" :size="loadingSize" :class="bem('loading')" />
    <VlIcon v-else-if="icon && iconPosition !== 'right'" :name="icon" :class="bem('icon')" />
    <span :class="bem('text')">
      <slot>{{ loading && loadingText ? loadingText : '' }}</slot>
    </span>
    <VlIcon v-if="icon && iconPosition === 'right'" :name="icon" :class="bem('icon')" />
  </component>
</template>

<style lang="scss">
@use '../../styles/mixins' as *;

.vl-button {
  --vl-button-color: var(--vl-text-color);
  --vl-button-bg: var(--vl-background-2);
  --vl-button-border: var(--vl-border-color);

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
  color: var(--vl-button-color);
  white-space: nowrap;
  vertical-align: middle;
  background: var(--vl-button-bg);
  border: 1px solid var(--vl-button-border);
  border-radius: 10px;
  outline: none;
  appearance: none;
  transition: opacity var(--vl-duration-fast), transform var(--vl-duration-fast);

  &::after {
    position: absolute;
    inset: 0;
    content: '';
    background: #000;
    opacity: 0;
    transition: opacity var(--vl-duration-fast);
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
    --vl-button-color: #fff;
    --vl-button-bg: var(--vl-primary);
    --vl-button-border: var(--vl-primary);
  }

  &--success {
    --vl-button-color: #fff;
    --vl-button-bg: var(--vl-success);
    --vl-button-border: var(--vl-success);
  }

  &--warning {
    --vl-button-color: #fff;
    --vl-button-bg: var(--vl-warning);
    --vl-button-border: var(--vl-warning);
  }

  &--danger {
    --vl-button-color: #fff;
    --vl-button-bg: var(--vl-danger);
    --vl-button-border: var(--vl-danger);
  }

  &--default {
    --vl-button-color: var(--vl-text-color);
    --vl-button-bg: var(--vl-background-2);
    --vl-button-border: var(--vl-border-color);
  }

  /* 朴素 */
  &--plain {
    background: transparent;
    border-color: var(--vl-button-bg);
    color: var(--vl-button-bg);

    &::after {
      display: none;
    }
  }

  &--plain.vl-button--default {
    background: var(--vl-background-2);
    border-color: var(--vl-border-color);
    color: var(--vl-text-color-2);
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
      border: 1px solid var(--vl-button-border);
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

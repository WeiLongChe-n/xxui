<script setup lang="ts">
import { computed } from 'vue'
import { addUnit, createNamespace } from '../../utils'
import VlIcon from '../icon/Icon.vue'

defineOptions({ name: 'VlCell' })

const props = withDefaults(
  defineProps<{
    title?: string | number
    value?: string | number
    /** 标题下方的描述文字 */
    label?: string
    icon?: string
    size?: 'normal' | 'large'
    /** 是否展示右侧箭头并开启点击反馈 */
    isLink?: boolean
    /** 是否必填（标题前显示红色星号） */
    required?: boolean
    /** 内容垂直居中 */
    center?: boolean
    clickable?: boolean
    /** 是否显示下边框 */
    border?: boolean
    /** 右侧内容宽度，默认自适应 */
    valueWidth?: string | number
  }>(),
  { size: 'normal', border: true },
)

const emit = defineEmits<{ click: [event: MouseEvent] }>()

const { bem } = createNamespace('cell')

const classes = computed(() => [
  bem(),
  props.size === 'large' ? bem('', 'large') : '',
  {
    [bem('', 'center')]: props.center,
    [bem('', 'borderless')]: !props.border,
    [bem('', 'clickable')]: props.isLink || props.clickable,
  },
])

const valueStyle = computed(() => (props.valueWidth ? { width: addUnit(props.valueWidth) } : undefined))

const onClick = (event: MouseEvent) => emit('click', event)
</script>

<template>
  <div :class="classes" role="button" tabindex="0" @click="onClick">
    <div :class="bem('left')">
      <slot name="icon">
        <VlIcon v-if="icon" :name="icon" :class="bem('icon')" />
      </slot>
      <div :class="bem('title')">
        <slot name="title">
          <span v-if="props.required" :class="bem('required')">*</span>
          {{ title }}
        </slot>
        <div v-if="label || $slots.label" :class="bem('label')">
          <slot name="label">{{ label }}</slot>
        </div>
      </div>
    </div>
    <div :class="bem('value')" :style="valueStyle">
      <slot name="value">
        <span v-if="value !== undefined && value !== ''">{{ value }}</span>
      </slot>
      <slot name="extra" />
      <VlIcon v-if="isLink" name="arrow-right" :class="bem('arrow')" />
    </div>
  </div>
</template>

<style lang="scss">
@use '../../styles/mixins' as *;

.vl-cell {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: var(--vl-cell-padding);
  overflow: hidden;
  font-size: var(--vl-cell-font-size);
  line-height: 24px;
  color: var(--vl-text-color);
  background: var(--vl-background-2);

  @include hairline(bottom);

  &--borderless::after {
    display: none;
  }

  &--center {
    align-items: center;
  }

  &--clickable {
    cursor: pointer;

    &:active {
      background: var(--vl-active-color);
    }
  }

  &--large {
    padding: 16px;
  }

  &__left {
    display: flex;
    flex: 1;
    align-items: center;
    min-width: 0;
  }

  &__icon {
    margin-right: 8px;
    font-size: 18px;
    color: var(--vl-text-color-2);
  }

  &__title {
    flex: 1;
    min-width: 0;
  }

  &--large &__title {
    font-size: 16px;
  }

  &__required {
    margin-right: 2px;
    color: var(--vl-danger);
  }

  &__label {
    margin-top: 2px;
    font-size: var(--vl-font-size-sm);
    line-height: 18px;
    color: var(--vl-text-color-3);
  }

  &__value {
    display: flex;
    flex-shrink: 0;
    align-items: center;
    justify-content: flex-end;
    max-width: 62%;
    margin-left: 12px;
    color: var(--vl-text-color-2);
    text-align: right;

    > * + * {
      margin-left: 6px;
    }
  }

  &__arrow {
    margin-left: 4px;
    font-size: 16px;
    color: var(--vl-text-color-4);
  }
}
</style>

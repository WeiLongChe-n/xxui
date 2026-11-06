<script setup lang="ts">
import { computed, inject } from 'vue'
import { createNamespace } from '../../utils'
import { COLLAPSE_KEY, type CollapseName } from './context'
import XIcon from '../icon/Icon.vue'

defineOptions({ name: 'XCollapseItem' })

const props = withDefaults(
  defineProps<{
    name?: CollapseName
    title?: string
    value?: string
    icon?: string
    disabled?: boolean
    /** 是否显示右侧箭头 */
    isLink?: boolean
    border?: boolean
  }>(),
  { isLink: true, border: true },
)

const emit = defineEmits<{
  open: []
  close: []
  click: [event: MouseEvent]
}>()

const parent = inject(COLLAPSE_KEY, null)
if (!parent) {
  throw new Error('[XXUI] <x-collapse-item> 必须放在 <x-collapse> 内部使用')
}

const { bem } = createNamespace('collapse-item')

const expanded = computed(() =>
  props.name === undefined ? false : parent.activeNames.value.includes(props.name),
)

const onClick = (event: MouseEvent) => {
  if (props.disabled) return
  emit('click', event)
  if (props.name === undefined) return
  parent.toggle(props.name, !expanded.value)
  if (expanded.value) emit('close')
  else emit('open')
}
</script>

<template>
  <div :class="[bem(), { [bem('', 'expanded')]: expanded, [bem('', 'disabled')]: disabled }]">
    <div
      :class="[bem('header'), { [bem('header', 'borderless')]: !border }]"
      role="button"
      :aria-expanded="expanded"
      @click="onClick"
    >
      <XIcon v-if="icon" :name="icon" :class="bem('icon')" />
      <div :class="bem('title')">
        <slot name="title">{{ title }}</slot>
      </div>
      <div :class="bem('value')">
        <slot name="value">{{ value }}</slot>
      </div>
      <XIcon v-if="isLink" name="arrow-down" :class="bem('arrow')" />
    </div>
    <div :class="bem('wrapper')">
      <div :class="bem('content')">
        <div :class="bem('inner')">
          <slot />
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss">
@use '../../styles/mixins' as *;

.x-collapse-item {
  &__header {
    position: relative;
    display: flex;
    align-items: center;
    padding: 13px 16px;
    font-size: var(--x-cell-font-size);
    color: var(--x-text-color);
    cursor: pointer;

    @include hairline(bottom);

    &--borderless::after {
      display: none;
    }

    &:active {
      background: var(--x-active-color);
    }
  }

  &__icon {
    margin-right: 8px;
    font-size: 18px;
    color: var(--x-text-color-2);
  }

  &__title {
    flex: 1;
    min-width: 0;
  }

  &__value {
    margin-left: 8px;
    font-size: var(--x-font-size);
    color: var(--x-text-color-3);
  }

  &__arrow {
    margin-left: 6px;
    font-size: 14px;
    color: var(--x-text-color-4);
    transition: transform var(--x-duration) var(--x-ease);
  }

  &--expanded &__arrow {
    transform: rotate(180deg);
  }

  &__wrapper {
    display: grid;
    grid-template-rows: 0fr;
    transition: grid-template-rows var(--x-duration) var(--x-ease);
  }

  &--expanded &__wrapper {
    grid-template-rows: 1fr;
  }

  &__content {
    overflow: hidden;
    background: var(--x-background-2);
  }

  &__inner {
    padding: 0 16px;
    font-size: var(--x-font-size);
    line-height: 22px;
    color: var(--x-text-color-2);
  }

  &--expanded &__inner {
    padding: 12px 16px;
  }

  &--disabled &__header {
    color: var(--x-text-color-4);
    cursor: not-allowed;
  }
}
</style>

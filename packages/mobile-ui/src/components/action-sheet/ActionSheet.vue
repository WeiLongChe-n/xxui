<script setup lang="ts">
import { computed } from 'vue'
import { createNamespace } from '../../utils'
import XPopup from '../popup/Popup.vue'
import XLoading from '../loading/Loading.vue'
import XIcon from '../icon/Icon.vue'

import type { ActionSheetAction } from './types'

defineOptions({ name: 'XActionSheet' })

const props = withDefaults(
  defineProps<{
    show?: boolean
    title?: string
    description?: string
    actions?: ActionSheetAction[]
    cancelText?: string
    /** 面板与取消按钮之间留出间距 */
    gap?: number
    closeOnClickAction?: boolean
    closeOnClickOverlay?: boolean
    safeAreaInsetBottom?: boolean
    lockScroll?: boolean
    zIndex?: number
  }>(),
  {
    actions: () => [],
    cancelText: '取消',
    closeOnClickAction: true,
    closeOnClickOverlay: true,
    lockScroll: true,
  },
)

const emit = defineEmits<{
  'update:show': [value: boolean]
  select: [action: ActionSheetAction, index: number]
  cancel: []
  closed: []
}>()

const { bem } = createNamespace('action-sheet')

const rootStyle = computed(() => (props.gap ? { paddingBottom: `${props.gap}px` } : undefined))

const close = () => emit('update:show', false)

const onSelect = (action: ActionSheetAction, index: number) => {
  if (action.disabled || action.loading) return
  emit('select', action, index)
  if (props.closeOnClickAction) close()
}

const onCancel = () => {
  emit('cancel')
  close()
}
</script>

<template>
  <XPopup
    :show="show"
    position="bottom"
    round
    :z-index="zIndex"
    :lock-scroll="lockScroll"
    :close-on-click-overlay="closeOnClickOverlay"
    :safe-area-inset-bottom="safeAreaInsetBottom"
    @update:show="emit('update:show', $event)"
    @closed="emit('closed')"
  >
    <div :class="bem()" :style="rootStyle">
      <div v-if="title || $slots.title" :class="bem('header')">
        <slot name="title">{{ title }}</slot>
      </div>
      <div v-if="description" :class="bem('description')">{{ description }}</div>
      <div :class="bem('content')">
        <button
          v-for="(action, index) in actions"
          :key="index"
          type="button"
          :class="[bem('item'), { [bem('item', 'disabled')]: action.disabled || action.loading }]"
          :style="{ color: action.color }"
          @click="onSelect(action, index)"
        >
          <XLoading v-if="action.loading" :size="18" :class="bem('loading')" />
          <XIcon v-else-if="action.icon" :name="action.icon" :class="bem('icon')" />
          <span :class="bem('name')">{{ action.name }}</span>
          <span v-if="action.subname" :class="bem('subname')">{{ action.subname }}</span>
        </button>
      </div>
      <div v-if="cancelText" :class="bem('gap')">
        <button type="button" :class="bem('cancel')" @click="onCancel">{{ cancelText }}</button>
      </div>
    </div>
  </XPopup>
</template>

<style lang="scss">
@use '../../styles/mixins' as *;

.x-action-sheet {
  &__header {
    padding: 18px 16px 12px;
    font-size: 16px;
    font-weight: 600;
    color: var(--x-text-color);
    text-align: center;
  }

  &__description {
    padding: 0 20px 15px;
    font-size: var(--x-font-size-sm);
    line-height: 18px;
    color: var(--x-text-color-3);
    text-align: center;
  }

  &__content {
    border-top: 1px solid var(--x-border-color);
  }

  &__item {
    @include reset-button;

    position: relative;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    width: 100%;
    padding: 14px 16px;
    font-size: 16px;
    color: var(--x-text-color);
    background: var(--x-background-2);
    cursor: pointer;

    @include hairline(bottom);

    &:last-child::after {
      display: none;
    }

    &:active {
      background: var(--x-active-color);
    }

    &--disabled {
      color: var(--x-text-color-4);
      cursor: not-allowed;

      &:active {
        background: var(--x-background-2);
      }
    }
  }

  &__icon,
  &__loading {
    margin-bottom: 4px;
    font-size: 22px;
  }

  &__subname {
    margin-top: 2px;
    font-size: var(--x-font-size-sm);
    color: var(--x-text-color-3);
  }

  &__gap {
    padding: 8px 0;
    background: var(--x-background);
  }

  &__cancel {
    @include reset-button;

    width: 100%;
    padding: 14px 16px;
    font-size: 16px;
    font-weight: 500;
    color: var(--x-text-color);
    background: var(--x-background-2);
    cursor: pointer;

    &:active {
      background: var(--x-active-color);
    }
  }
}
</style>

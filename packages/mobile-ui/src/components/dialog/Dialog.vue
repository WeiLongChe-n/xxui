<script setup lang="ts">
import { computed } from 'vue'
import { createNamespace } from '../../utils'
import XPopup from '../popup/Popup.vue'
import type { DialogAction } from './types'

defineOptions({ name: 'XDialog' })

const props = withDefaults(
  defineProps<{
    show?: boolean
    title?: string
    message?: string
    /** default 标准 / round-button 圆角按钮 */
    theme?: 'default' | 'round-button'
    showConfirmButton?: boolean
    showCancelButton?: boolean
    confirmButtonText?: string
    cancelButtonText?: string
    confirmButtonColor?: string
    cancelButtonColor?: string
    confirmButtonDisabled?: boolean
    cancelButtonDisabled?: boolean
    closeOnClickOverlay?: boolean
    zIndex?: number
    /** 关闭前拦截，返回 false 阻止关闭 */
    beforeClose?: (action: DialogAction) => boolean | Promise<boolean>
  }>(),
  {
    theme: 'default',
    showConfirmButton: true,
    showCancelButton: false,
    confirmButtonText: '确认',
    cancelButtonText: '取消',
    closeOnClickOverlay: false,
    zIndex: 8000,
  },
)

const emit = defineEmits<{
  'update:show': [value: boolean]
  confirm: []
  cancel: []
  closed: []
}>()

const { bem } = createNamespace('dialog')

const classes = computed(() => [bem(), bem('', props.theme)])

const updateShow = (value: boolean) => emit('update:show', value)

const runBeforeClose = async (action: DialogAction) => {
  if (!props.beforeClose) return true
  return props.beforeClose(action)
}

const onConfirm = async () => {
  if (props.confirmButtonDisabled) return
  if (!(await runBeforeClose('confirm'))) return
  emit('confirm')
  updateShow(false)
}

const onCancel = async () => {
  if (props.cancelButtonDisabled) return
  if (!(await runBeforeClose('cancel'))) return
  emit('cancel')
  updateShow(false)
}

const onClickOverlay = async () => {
  if (!props.closeOnClickOverlay) return
  if (!(await runBeforeClose('overlay'))) return
  emit('cancel')
  updateShow(false)
}
</script>

<template>
  <XPopup
    :show="show"
    position="center"
    round
    :z-index="zIndex"
    :close-on-click-overlay="false"
    @update:show="updateShow"
    @click-overlay="onClickOverlay"
    @closed="emit('closed')"
  >
    <div :class="classes" role="alertdialog">
      <div v-if="title || $slots.title" :class="bem('header')">
        <slot name="title">{{ title }}</slot>
      </div>
      <div v-if="message || $slots.default" :class="bem('message')">
        <slot>{{ message }}</slot>
      </div>
      <div :class="bem('footer')">
        <button
          v-if="showCancelButton"
          type="button"
          :class="[bem('btn'), bem('btn', 'cancel')]"
          :style="{ color: cancelButtonColor }"
          :disabled="cancelButtonDisabled"
          @click="onCancel"
        >
          {{ cancelButtonText }}
        </button>
        <button
          v-if="showConfirmButton"
          type="button"
          :class="[bem('btn'), bem('btn', 'confirm')]"
          :style="{ color: confirmButtonColor }"
          :disabled="confirmButtonDisabled"
          @click="onConfirm"
        >
          {{ confirmButtonText }}
        </button>
      </div>
    </div>
  </XPopup>
</template>

<style lang="scss">
@use '../../styles/mixins' as *;

.x-dialog {
  width: 320px;
  max-width: 84vw;
  overflow: hidden;
  text-align: center;
  background: var(--x-background-2);
  border-radius: var(--x-radius-lg);

  &__header {
    padding: 24px 20px 0;
    font-size: 17px;
    font-weight: 600;
    line-height: 24px;
    color: var(--x-text-color);
  }

  &__message {
    padding: 16px 24px 24px;
    font-size: 15px;
    line-height: 21px;
    color: var(--x-text-color-2);
  }

  &__header + &__message {
    padding-top: 8px;
  }

  &__footer {
    display: flex;

    @include hairline(top);
  }

  &__btn {
    @include reset-button;

    flex: 1;
    height: 50px;
    font-size: 16px;
    font-weight: 500;
    color: var(--x-text-color-2);
    cursor: pointer;

    &:active {
      background: var(--x-active-color);
    }

    &:disabled {
      @include disabled;
    }

    & + & {
      @include hairline(left);
    }

    &--confirm {
      color: var(--x-primary);
      font-weight: 600;
    }
  }

  /* 圆角按钮主题 */
  &--round-button {
    padding-bottom: 22px;

    .x-dialog__footer {
      gap: 12px;
      padding: 0 20px;
      border: none;

      &::after {
        display: none;
      }
    }

    .x-dialog__btn {
      height: 44px;
      font-size: 15px;
      background: var(--x-background-3);
      border-radius: 999px;

      & + & {
        margin-left: 0;
      }

      &::after {
        display: none;
      }

      &--confirm {
        color: #fff;
        background: var(--x-primary);
      }
    }
  }
}
</style>

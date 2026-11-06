<script setup lang="ts">
import { computed } from 'vue'
import { createNamespace } from '../../utils'
import XIcon from '../icon/Icon.vue'

defineOptions({ name: 'XTag' })

const props = withDefaults(
  defineProps<{
    type?: 'primary' | 'success' | 'danger' | 'warning' | 'default'
    size?: 'small' | 'normal' | 'large'
    plain?: boolean
    round?: boolean
    /** 圆角标记样式 */
    mark?: boolean
    color?: string
    textColor?: string
    closeable?: boolean
  }>(),
  { type: 'default', size: 'normal' },
)

const emit = defineEmits<{ close: [event: MouseEvent] }>()

const { bem } = createNamespace('tag')

const classes = computed(() => [
  bem(),
  bem('', props.type),
  props.size !== 'normal' ? bem('', props.size) : '',
  {
    [bem('', 'plain')]: props.plain,
    [bem('', 'round')]: props.round,
    [bem('', 'mark')]: props.mark,
  },
])

const style = computed(() => ({
  ...(props.color ? { background: props.color, borderColor: props.color } : {}),
  ...(props.textColor ? { color: props.textColor } : {}),
}))

const onClose = (event: MouseEvent) => {
  event.stopPropagation()
  emit('close', event)
}
</script>

<template>
  <span :class="classes" :style="style">
    <slot />
    <XIcon v-if="closeable" name="close" :class="bem('close')" @click="onClose" />
  </span>
</template>

<style lang="scss">
.x-tag {
  --x-tag-color: var(--x-text-color-2);
  --x-tag-bg: var(--x-background-3);

  display: inline-flex;
  align-items: center;
  padding: 0 6px;
  font-size: var(--x-font-size-sm);
  line-height: 20px;
  color: var(--x-tag-color);
  background: var(--x-tag-bg);
  border: 1px solid transparent;
  border-radius: var(--x-radius-sm);

  &--primary {
    --x-tag-color: var(--x-primary);
    --x-tag-bg: var(--x-primary-light);
  }

  &--success {
    --x-tag-color: var(--x-success);
    --x-tag-bg: rgba(22, 163, 74, 0.12);
  }

  &--danger {
    --x-tag-color: var(--x-danger);
    --x-tag-bg: rgba(239, 68, 68, 0.12);
  }

  &--warning {
    --x-tag-color: var(--x-warning);
    --x-tag-bg: rgba(245, 158, 11, 0.14);
  }

  &--plain {
    background: transparent;
    border-color: currentColor;
  }

  &--small {
    padding: 0 4px;
    font-size: var(--x-font-size-xs);
    line-height: 16px;
  }

  &--large {
    padding: 0 10px;
    font-size: var(--x-font-size);
    line-height: 26px;
  }

  &--round {
    border-radius: 999px;
  }

  &--mark {
    border-radius: 0 999px 999px 0;
  }

  &__close {
    margin-left: 4px;
    font-size: 12px;
    cursor: pointer;
  }
}
</style>

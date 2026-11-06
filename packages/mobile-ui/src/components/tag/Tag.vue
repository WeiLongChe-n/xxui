<script setup lang="ts">
import { computed } from 'vue'
import { createNamespace } from '../../utils'
import VlIcon from '../icon/Icon.vue'

defineOptions({ name: 'VlTag' })

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
    <VlIcon v-if="closeable" name="close" :class="bem('close')" @click="onClose" />
  </span>
</template>

<style lang="scss">
.vl-tag {
  --vl-tag-color: var(--vl-text-color-2);
  --vl-tag-bg: var(--vl-background-3);

  display: inline-flex;
  align-items: center;
  padding: 0 6px;
  font-size: var(--vl-font-size-sm);
  line-height: 20px;
  color: var(--vl-tag-color);
  background: var(--vl-tag-bg);
  border: 1px solid transparent;
  border-radius: var(--vl-radius-sm);

  &--primary {
    --vl-tag-color: var(--vl-primary);
    --vl-tag-bg: var(--vl-primary-light);
  }

  &--success {
    --vl-tag-color: var(--vl-success);
    --vl-tag-bg: rgba(22, 163, 74, 0.12);
  }

  &--danger {
    --vl-tag-color: var(--vl-danger);
    --vl-tag-bg: rgba(239, 68, 68, 0.12);
  }

  &--warning {
    --vl-tag-color: var(--vl-warning);
    --vl-tag-bg: rgba(245, 158, 11, 0.14);
  }

  &--plain {
    background: transparent;
    border-color: currentColor;
  }

  &--small {
    padding: 0 4px;
    font-size: var(--vl-font-size-xs);
    line-height: 16px;
  }

  &--large {
    padding: 0 10px;
    font-size: var(--vl-font-size);
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

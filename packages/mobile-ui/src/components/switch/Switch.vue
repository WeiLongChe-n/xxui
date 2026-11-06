<script setup lang="ts">
import { computed } from 'vue'
import { addUnit, createNamespace } from '../../utils'
import VlLoading from '../loading/Loading.vue'

defineOptions({ name: 'VlSwitch' })

const props = withDefaults(
  defineProps<{
    modelValue?: string | number | boolean
    activeValue?: string | number | boolean
    inactiveValue?: string | number | boolean
    /** 开关尺寸 */
    size?: string | number
    activeColor?: string
    inactiveColor?: string
    disabled?: boolean
    loading?: boolean
    activeText?: string
    inactiveText?: string
  }>(),
  { activeValue: true, inactiveValue: false },
)

const emit = defineEmits<{
  'update:modelValue': [value: unknown]
  change: [value: unknown]
  click: [event: MouseEvent]
}>()

const { bem } = createNamespace('switch')

const checked = computed(() => props.modelValue === props.activeValue)

const style = computed(() => ({
  fontSize: addUnit(props.size),
  backgroundColor: checked.value
    ? props.activeColor || 'var(--vl-primary)'
    : props.inactiveColor || 'var(--vl-text-color-4)',
  opacity: props.disabled || props.loading ? 0.55 : 1,
}))

const onClick = (event: MouseEvent) => {
  if (props.disabled || props.loading) return
  emit('click', event)
  const next = checked.value ? props.inactiveValue : props.activeValue
  emit('update:modelValue', next)
  emit('change', next)
}
</script>

<template>
  <button
    type="button"
    role="switch"
    :aria-checked="checked"
    :class="[bem(), { [bem('', 'checked')]: checked, [bem('', 'disabled')]: disabled }]"
    :style="style"
    @click="onClick"
  >
    <span :class="bem('node')">
      <VlLoading v-if="loading" :size="12" color="currentColor" />
    </span>
    <span v-if="activeText || inactiveText" :class="bem('text')">
      {{ checked ? activeText : inactiveText }}
    </span>
  </button>
</template>

<style lang="scss">
@use '../../styles/mixins' as *;

.vl-switch {
  @include reset-button;

  display: inline-flex;
  align-items: center;
  justify-content: flex-start;
  box-sizing: content-box;
  min-width: calc(2em - 0.2em);
  height: calc(1em - 0.2em);
  padding: 0.1em;
  font-size: 26px;
  line-height: 1;
  vertical-align: middle;
  cursor: pointer;
  background: var(--vl-text-color-4);
  border-radius: 1em;
  transition: background-color var(--vl-duration-fast);

  &__node {
    display: flex;
    flex: none;
    align-items: center;
    justify-content: center;
    width: 0.8em;
    height: 0.8em;
    color: var(--vl-primary);
    background: #fff;
    border-radius: 50%;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.2);
    transition: transform var(--vl-duration-fast) var(--vl-ease);
  }

  &--checked {
    justify-content: flex-end;
  }

  &--checked &__node {
    order: 1;
  }

  &--checked &__text {
    order: 0;
  }

  &__text {
    padding: 0 0.26em;
    font-size: 0.46em;
    color: #fff;
    white-space: nowrap;
  }
}
</style>

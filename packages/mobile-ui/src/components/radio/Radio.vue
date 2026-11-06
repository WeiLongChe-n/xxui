<script setup lang="ts">
import { computed, inject } from 'vue'
import { addUnit, createNamespace } from '../../utils'
import { RADIO_GROUP_KEY, type RadioValue } from '../checkbox/context'

defineOptions({ name: 'VlRadio' })

const props = withDefaults(
  defineProps<{
    /** 在 RadioGroup 中作为选项值 */
    name?: RadioValue
    modelValue?: RadioValue
    shape?: 'round' | 'square'
    disabled?: boolean
    checkedColor?: string
    iconSize?: string | number
  }>(),
  { shape: 'round' },
)

const emit = defineEmits<{
  'update:modelValue': [value: RadioValue]
  change: [value: RadioValue]
  click: [event: MouseEvent]
}>()

const parent = inject(RADIO_GROUP_KEY, null)
const { bem } = createNamespace('radio')

const checked = computed(() => {
  if (parent) return parent.value.value === props.name
  return props.modelValue === props.name
})

const disabled = computed(() => props.disabled || !!parent?.disabled.value)

const iconStyle = computed(() => ({
  borderColor: checked.value ? props.checkedColor || 'var(--vl-primary)' : '',
  fontSize: addUnit(props.iconSize),
}))

const dotStyle = computed(() => ({
  background: props.checkedColor || 'var(--vl-primary)',
}))

const select = (event: MouseEvent) => {
  if (disabled.value) return
  emit('click', event)
  if (parent) {
    parent.setValue(props.name as RadioValue)
    return
  }
  emit('update:modelValue', props.name as RadioValue)
  emit('change', props.name as RadioValue)
}
</script>

<template>
  <div
    :class="[
      bem(),
      {
        [bem('', 'checked')]: checked,
        [bem('', 'disabled')]: disabled,
        [bem('', 'square')]: shape === 'square',
      },
    ]"
    role="radio"
    :aria-checked="checked"
    @click="select"
  >
    <div :class="bem('icon')" :style="iconStyle">
      <i v-if="checked" :class="bem('dot')" :style="dotStyle" />
    </div>
    <span v-if="$slots.default" :class="bem('label')">
      <slot />
    </span>
  </div>
</template>

<style lang="scss">
.vl-radio {
  display: inline-flex;
  align-items: center;
  vertical-align: middle;
  cursor: pointer;

  &__icon {
    display: flex;
    flex: none;
    align-items: center;
    justify-content: center;
    width: 20px;
    height: 20px;
    font-size: 10px;
    background: var(--vl-background-2);
    border: 1px solid var(--vl-border-color);
    border-radius: 50%;
    transition: border-color var(--vl-duration-fast);
  }

  &--square &__icon {
    border-radius: 4px;
  }

  &__dot {
    width: 10px;
    height: 10px;
    background: var(--vl-primary);
    border-radius: 50%;
    animation: vl-radio-pop 0.2s var(--vl-ease);
  }

  &__label {
    margin-left: 8px;
    font-size: var(--vl-cell-font-size);
    color: var(--vl-text-color);
  }

  &--disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
}

@keyframes vl-radio-pop {
  from {
    transform: scale(0.4);
    opacity: 0.4;
  }

  to {
    transform: scale(1);
    opacity: 1;
  }
}
</style>

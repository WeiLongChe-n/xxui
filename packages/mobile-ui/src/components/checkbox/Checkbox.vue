<script setup lang="ts">
import { computed, inject } from 'vue'
import { addUnit, createNamespace } from '../../utils'
import { CHECKBOX_GROUP_KEY, type CheckboxValue } from './context'
import VlIcon from '../icon/Icon.vue'

defineOptions({ name: 'VlCheckbox' })

const props = withDefaults(
  defineProps<{
    /** 在 CheckboxGroup 中作为选项值 */
    name?: CheckboxValue
    modelValue?: boolean
    shape?: 'square' | 'round'
    disabled?: boolean
    checkedColor?: string
    iconSize?: string | number
    labelDisabled?: boolean
  }>(),
  { shape: 'square' },
)

const emit = defineEmits<{
  'update:modelValue': [value: boolean]
  change: [value: boolean]
  click: [event: MouseEvent]
}>()

const parent = inject(CHECKBOX_GROUP_KEY, null)
const { bem } = createNamespace('checkbox')

const checked = computed(() => {
  if (parent) return props.name !== undefined && parent.value.value.includes(props.name)
  return !!props.modelValue
})

const disabled = computed(() => props.disabled || !!parent?.disabled.value)

const classes = computed(() => [
  bem(),
  {
    [bem('', 'checked')]: checked.value,
    [bem('', 'disabled')]: disabled.value,
    [bem('', 'round')]: props.shape === 'round',
  },
])

const iconStyle = computed(() => ({
  backgroundColor: checked.value ? props.checkedColor || 'var(--vl-primary)' : '',
  borderColor: checked.value ? props.checkedColor || 'var(--vl-primary)' : '',
  fontSize: addUnit(props.iconSize),
}))

const toggle = (event: MouseEvent) => {
  if (disabled.value) return
  emit('click', event)
  if (parent) {
    parent.toggle(props.name as CheckboxValue)
    return
  }
  emit('update:modelValue', !props.modelValue)
  emit('change', !props.modelValue)
}

const onLabelClick = (event: MouseEvent) => {
  if (props.labelDisabled) event.stopPropagation()
}
</script>

<template>
  <div :class="classes" role="checkbox" :aria-checked="checked" @click="toggle">
    <div :class="bem('icon')" :style="iconStyle">
      <VlIcon v-if="checked" name="check" />
    </div>
    <span v-if="$slots.default" :class="bem('label')" @click="onLabelClick">
      <slot />
    </span>
  </div>
</template>

<style lang="scss">
.vl-checkbox {
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
    font-size: 14px;
    color: #fff;
    background: var(--vl-background-2);
    border: 1px solid var(--vl-border-color);
    border-radius: 4px;
    transition: background-color var(--vl-duration-fast), border-color var(--vl-duration-fast);

    .vl-icon {
      transform: scale(0.9);
    }
  }

  &--round &__icon {
    border-radius: 50%;
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
</style>

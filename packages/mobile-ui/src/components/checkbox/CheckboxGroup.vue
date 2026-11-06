<script setup lang="ts">
import { computed, provide } from 'vue'
import { createNamespace } from '../../utils'
import { CHECKBOX_GROUP_KEY, type CheckboxValue } from './context'

defineOptions({ name: 'VlCheckboxGroup' })

const props = withDefaults(
  defineProps<{
    modelValue?: CheckboxValue[]
    /** 最多可选数量 */
    max?: number
    disabled?: boolean
    /** 排列方向 */
    direction?: 'horizontal' | 'vertical'
  }>(),
  { modelValue: () => [], direction: 'horizontal' },
)

const emit = defineEmits<{
  'update:modelValue': [value: CheckboxValue[]]
  change: [value: CheckboxValue[]]
}>()

const { bem } = createNamespace('checkbox-group')

const value = computed(() => props.modelValue || [])

const toggle = (item: CheckboxValue) => {
  const list = [...value.value]
  const index = list.indexOf(item)
  if (index > -1) {
    list.splice(index, 1)
  } else {
    if (props.max !== undefined && list.length >= props.max) return
    list.push(item)
  }
  emit('update:modelValue', list)
  emit('change', list)
}

provide(CHECKBOX_GROUP_KEY, {
  value,
  disabled: computed(() => props.disabled),
  max: computed(() => props.max),
  toggle,
})
</script>

<template>
  <div :class="[bem(), bem('', direction)]">
    <slot />
  </div>
</template>

<style lang="scss">
.vl-checkbox-group {
  display: flex;
  flex-wrap: wrap;
  gap: 12px 20px;

  &--vertical {
    flex-direction: column;
    gap: 12px;
  }
}
</style>

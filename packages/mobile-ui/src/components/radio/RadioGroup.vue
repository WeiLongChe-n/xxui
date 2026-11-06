<script setup lang="ts">
import { computed, provide } from 'vue'
import { createNamespace } from '../../utils'
import { RADIO_GROUP_KEY, type RadioValue } from '../checkbox/context'

defineOptions({ name: 'VlRadioGroup' })

const props = withDefaults(
  defineProps<{
    modelValue?: RadioValue
    disabled?: boolean
    direction?: 'horizontal' | 'vertical'
  }>(),
  { direction: 'horizontal' },
)

const emit = defineEmits<{
  'update:modelValue': [value: RadioValue]
  change: [value: RadioValue]
}>()

const { bem } = createNamespace('radio-group')

const setValue = (value: RadioValue) => {
  emit('update:modelValue', value)
  emit('change', value)
}

provide(RADIO_GROUP_KEY, {
  value: computed(() => props.modelValue),
  disabled: computed(() => props.disabled),
  setValue,
})
</script>

<template>
  <div :class="[bem(), bem('', direction)]" role="radiogroup">
    <slot />
  </div>
</template>

<style lang="scss">
.vl-radio-group {
  display: flex;
  flex-wrap: wrap;
  gap: 12px 20px;

  &--vertical {
    flex-direction: column;
    gap: 12px;
  }
}
</style>

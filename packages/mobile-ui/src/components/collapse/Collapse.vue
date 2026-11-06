<script setup lang="ts">
import { computed, provide } from 'vue'
import { createNamespace } from '../../utils'
import { COLLAPSE_KEY, type CollapseName } from './context'

defineOptions({ name: 'XCollapse' })

const props = withDefaults(
  defineProps<{
    modelValue?: CollapseName | CollapseName[]
    /** 手风琴模式，同时只展开一个 */
    accordion?: boolean
    border?: boolean
  }>(),
  { modelValue: () => [] as CollapseName[], accordion: false, border: true },
)

const emit = defineEmits<{
  'update:modelValue': [value: CollapseName | CollapseName[]]
  change: [value: CollapseName | CollapseName[]]
}>()

const { bem } = createNamespace('collapse')

const activeNames = computed<CollapseName[]>(() => {
  const value = props.modelValue
  if (Array.isArray(value)) return value
  return value === undefined || value === null || value === '' ? [] : [value]
})

const toggle = (name: CollapseName, expanded: boolean) => {
  if (props.accordion) {
    const next = expanded ? name : undefined
    emit('update:modelValue', next as CollapseName)
    emit('change', next as CollapseName)
    return
  }
  const list = expanded
    ? [...activeNames.value, name]
    : activeNames.value.filter((item) => item !== name)
  emit('update:modelValue', list)
  emit('change', list)
}

provide(COLLAPSE_KEY, {
  activeNames,
  accordion: computed(() => props.accordion),
  border: computed(() => props.border),
  toggle,
})
</script>

<template>
  <div :class="[bem(), { [bem('', 'borderless')]: !border }]">
    <slot />
  </div>
</template>

<style lang="scss">
.x-collapse {
  overflow: hidden;
  background: var(--x-background-2);

  &--borderless .x-collapse-item__header::after {
    display: none;
  }
}
</style>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { addUnit, createNamespace } from '../../utils'
import VlIcon from '../icon/Icon.vue'

defineOptions({ name: 'VlRate' })

const props = withDefaults(
  defineProps<{
    modelValue?: number
    count?: number
    size?: string | number
    gutter?: string | number
    color?: string
    voidColor?: string
    icon?: string
    voidIcon?: string
    disabled?: boolean
    readonly?: boolean
    allowHalf?: boolean
  }>(),
  { count: 5, size: 20, gutter: 4, color: '#f59e0b', icon: 'star', voidIcon: 'star' },
)

const emit = defineEmits<{
  'update:modelValue': [value: number]
  change: [value: number]
}>()

const { bem } = createNamespace('rate')

const value = computed(() => Number(props.modelValue || 0))
const hoverValue = ref<number | null>(null)
const displayValue = computed(() => (hoverValue.value === null ? value.value : hoverValue.value))

const style = computed(() => ({
  fontSize: addUnit(props.size),
  gap: addUnit(props.gutter),
}))

const isActive = (index: number) => displayValue.value >= index
const isHalf = (index: number) => props.allowHalf && displayValue.value === index - 0.5

const select = (index: number, event: MouseEvent) => {
  if (props.disabled || props.readonly) return
  let next = index
  if (props.allowHalf) {
    const target = event.currentTarget as HTMLElement
    const rect = target.getBoundingClientRect()
    if (event.clientX - rect.left < rect.width / 2) next = index - 0.5
  }
  emit('update:modelValue', next)
  emit('change', next)
}

const onHover = (index: number, event: MouseEvent) => {
  if (props.disabled || props.readonly) return
  if (!props.allowHalf) {
    hoverValue.value = index
    return
  }
  const target = event.currentTarget as HTMLElement
  const rect = target.getBoundingClientRect()
  hoverValue.value = event.clientX - rect.left < rect.width / 2 ? index - 0.5 : index
}
</script>

<template>
  <div :class="[bem(), { [bem('', 'disabled')]: disabled }]" @mouseleave="hoverValue = null">
    <div
      v-for="index in count"
      :key="index"
      :class="[bem('item'), { [bem('item', 'active')]: isActive(index) }]"
      @click="select(index, $event)"
      @mousemove="onHover(index, $event)"
    >
      <VlIcon :name="voidIcon" :style="{ color: voidColor || 'var(--vl-text-color-4)' }" />
      <span
        :class="bem('active')"
        :style="{ width: isActive(index) ? '100%' : isHalf(index) ? '50%' : '0%', color }"
      >
        <VlIcon :name="icon" />
      </span>
    </div>
  </div>
</template>

<style lang="scss">
.vl-rate {
  display: inline-flex;
  align-items: center;

  &__item {
    position: relative;
    display: inline-flex;
    cursor: pointer;
    transition: transform var(--vl-duration-fast);

    &:active {
      transform: scale(1.15);
    }
  }

  &__active {
    position: absolute;
    top: 0;
    left: 0;
    display: flex;
    height: 100%;
    overflow: hidden;
    transition: width var(--vl-duration-fast) var(--vl-ease);

    .vl-icon__svg {
      fill: currentColor;
    }

    & > .vl-icon {
      flex: none;
      width: 1em;
      color: inherit;
    }
  }

  &--disabled &__item {
    cursor: not-allowed;
  }
}
</style>

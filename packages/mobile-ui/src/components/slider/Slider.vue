<script setup lang="ts">
import { computed, onBeforeUnmount, ref } from 'vue'
import { addUnit, clamp, createNamespace, getOwnerWindow } from '../../utils'

defineOptions({ name: 'XSlider' })

const props = withDefaults(
  defineProps<{
    modelValue?: number
    min?: number
    max?: number
    step?: number
    disabled?: boolean
    /** 进度条高度 */
    barHeight?: string | number
    buttonSize?: string | number
    activeColor?: string
    inactiveColor?: string
  }>(),
  { min: 0, max: 100, step: 1 },
)

const emit = defineEmits<{
  'update:modelValue': [value: number]
  change: [value: number]
  dragStart: []
  dragEnd: []
}>()

const { bem } = createNamespace('slider')

const trackRef = ref<HTMLElement>()
const dragging = ref(false)

const value = computed(() => clamp(Number(props.modelValue ?? props.min), props.min, props.max))
const percent = computed(() => ((value.value - props.min) / (props.max - props.min)) * 100)

const round = (input: number) => {
  const stepped = Math.round((input - props.min) / props.step) * props.step + props.min
  const fixed = Number(stepped.toFixed(10))
  return clamp(fixed, props.min, props.max)
}

const updateByClientX = (clientX: number) => {
  const track = trackRef.value
  if (!track) return
  const rect = track.getBoundingClientRect()
  const ratio = clamp((clientX - rect.left) / rect.width, 0, 1)
  const next = round(props.min + ratio * (props.max - props.min))
  if (next !== value.value) emit('update:modelValue', next)
}

const onPointerDown = (event: PointerEvent) => {
  if (props.disabled) return
  dragging.value = true
  updateByClientX(event.clientX)
  emit('dragStart')
  const win = getOwnerWindow(trackRef.value)
  win.addEventListener('pointermove', onPointerMove)
  win.addEventListener('pointerup', onPointerUp)
  win.addEventListener('pointercancel', onPointerUp)
}

const onPointerMove = (event: PointerEvent) => {
  if (!dragging.value) return
  updateByClientX(event.clientX)
}

const onPointerUp = () => {
  if (!dragging.value) return
  dragging.value = false
  emit('change', value.value)
  emit('dragEnd')
  removeListeners()
}

const removeListeners = () => {
  const win = getOwnerWindow(trackRef.value)
  win.removeEventListener('pointermove', onPointerMove)
  win.removeEventListener('pointerup', onPointerUp)
  win.removeEventListener('pointercancel', onPointerUp)
}

onBeforeUnmount(removeListeners)

const onClick = (event: MouseEvent) => {
  if (props.disabled || dragging.value) return
  updateByClientX(event.clientX)
  emit('change', value.value)
}
</script>

<template>
  <div
    :class="[bem(), { [bem('', 'disabled')]: disabled, [bem('', 'dragging')]: dragging }]"
  >
    <div
      ref="trackRef"
      :class="bem('track')"
      :style="{ height: addUnit(barHeight || 4), background: inactiveColor || 'var(--x-background-3)' }"
      @click="onClick"
    >
      <div
        :class="bem('bar')"
        :style="{ width: `${percent}%`, background: activeColor || 'var(--x-primary)' }"
      />
      <div
        :class="bem('button-wrap')"
        :style="{ left: `${percent}%` }"
        @pointerdown.stop="onPointerDown"
      >
        <div
          :class="bem('button')"
          :style="{ width: addUnit(buttonSize || 22), height: addUnit(buttonSize || 22) }"
        />
      </div>
    </div>
  </div>
</template>

<style lang="scss">
.x-slider {
  display: flex;
  align-items: center;
  width: 100%;
  padding: 10px 0;

  &__track {
    position: relative;
    flex: 1;
    border-radius: 999px;
    cursor: pointer;
    touch-action: none;
  }

  &__bar {
    position: absolute;
    top: 0;
    bottom: 0;
    left: 0;
    border-radius: inherit;
  }

  &__button-wrap {
    position: absolute;
    top: 50%;
    transform: translate(-50%, -50%);
    cursor: grab;
    touch-action: none;
  }

  &__button {
    background: var(--x-background-2);
    border-radius: 50%;
    box-shadow: 0 1px 6px rgba(31, 34, 51, 0.28);
    transition: transform var(--x-duration-fast);
  }

  &--dragging &__button {
    transform: scale(1.12);
  }

  &--disabled {
    opacity: 0.5;
    pointer-events: none;
  }
}
</style>

<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, provide, ref, watch } from 'vue'
import { addUnit, createNamespace, useTouch } from '../../utils'
import { SWIPE_KEY } from './context'

defineOptions({ name: 'VlSwipe' })

const props = withDefaults(
  defineProps<{
    /** 自动轮播间隔（ms），false 关闭 */
    autoplay?: number | false
    loop?: boolean
    duration?: number
    initialSwipe?: number
    showIndicators?: boolean
    indicatorColor?: string
    /** 自定义高度 */
    height?: number | string
    touchable?: boolean
  }>(),
  {
    autoplay: false,
    loop: true,
    duration: 500,
    initialSwipe: 0,
    showIndicators: true,
    indicatorColor: '#fff',
    touchable: true,
  },
)

const emit = defineEmits<{ change: [index: number] }>()

const { bem } = createNamespace('swipe')

const root = ref<HTMLElement>()
const count = ref(0)
const active = ref(props.initialSwipe)
const dragOffset = ref(0)
const dragging = ref(false)
const transitioning = ref(true)

const register = () => {
  count.value += 1
}

provide(SWIPE_KEY, {
  count: computed(() => count.value),
  active: computed(() => active.value),
  register,
})

const style = computed(() => ({
  height: props.height !== undefined ? addUnit(props.height) : undefined,
}))

const trackStyle = computed(() => {
  const width = root.value?.clientWidth || 0
  const offset = -active.value * width + dragOffset.value
  return {
    transform: `translate3d(${offset}px, 0, 0)`,
    transitionDuration: transitioning.value ? `${props.duration}ms` : '0ms',
  }
})

let rectWidth = 0
const { state, start, move } = useTouch()

const onTouchStart = (event: TouchEvent) => {
  if (!props.touchable || count.value <= 1) return
  stopAutoplay()
  rectWidth = root.value?.clientWidth || 0
  start(event)
  dragging.value = true
  transitioning.value = false
}

const onTouchMove = (event: TouchEvent) => {
  if (!dragging.value) return
  move(event)
  if (state.direction === 'horizontal') {
    event.preventDefault()
    dragOffset.value = state.deltaX
  }
}

const onTouchEnd = () => {
  if (!dragging.value) return
  dragging.value = false
  transitioning.value = true
  const threshold = Math.max(rectWidth / 4, 20)

  if (dragOffset.value < -threshold) {
    next()
  } else if (dragOffset.value > threshold) {
    prev()
  }
  dragOffset.value = 0
  if (props.autoplay) startAutoplay()
}

const setActive = (index: number, emitChange = true) => {
  const total = count.value
  if (!total) return
  let next = index
  if (next < 0) next = props.loop ? total - 1 : 0
  if (next >= total) next = props.loop ? 0 : total - 1
  if (next === active.value) return
  active.value = next
  if (emitChange) emit('change', next)
}

const next = () => setActive(active.value + 1)
const prev = () => setActive(active.value - 1)

let timer: ReturnType<typeof setInterval> | null = null

const startAutoplay = () => {
  if (!props.autoplay || count.value <= 1) return
  stopAutoplay()
  timer = setInterval(next, Number(props.autoplay))
}

const stopAutoplay = () => {
  if (timer) {
    clearInterval(timer)
    timer = null
  }
}

watch(() => props.autoplay, startAutoplay)

onMounted(() => {
  if (typeof ResizeObserver !== 'undefined' && root.value) {
    const observer = new ResizeObserver(() => {
      rectWidth = root.value?.clientWidth || 0
    })
    observer.observe(root.value)
  }
  startAutoplay()
})

onBeforeUnmount(stopAutoplay)

defineExpose({ next, prev, swipeTo: (index: number) => setActive(index) })
</script>

<template>
  <div
    ref="root"
    :class="bem()"
    :style="style"
    @touchstart.passive="onTouchStart"
    @touchmove="onTouchMove"
    @touchend="onTouchEnd"
    @touchcancel="onTouchEnd"
  >
    <div :class="bem('track')" :style="trackStyle">
      <slot />
    </div>
    <div v-if="showIndicators && count > 1" :class="bem('indicators')">
      <i
        v-for="index in count"
        :key="index"
        :class="[bem('indicator'), { [bem('indicator', 'active')]: index - 1 === active }]"
        :style="{ background: indicatorColor }"
        @click="setActive(index - 1)"
      />
    </div>
  </div>
</template>

<style lang="scss">
.vl-swipe {
  position: relative;
  width: 100%;
  overflow: hidden;
  touch-action: pan-y;

  &__track {
    display: flex;
    height: 100%;
    transition-property: transform;
    transition-timing-function: cubic-bezier(0.25, 0.1, 0.25, 1);
  }

  &__indicators {
    position: absolute;
    bottom: 8px;
    left: 50%;
    display: flex;
    gap: 4px;
    transform: translateX(-50%);
  }

  &__indicator {
    display: block;
    width: 5px;
    height: 5px;
    opacity: 0.4;
    border-radius: 999px;
    transition: width var(--vl-duration-fast), opacity var(--vl-duration-fast);

    &--active {
      width: 14px;
      opacity: 1;
    }
  }
}
</style>

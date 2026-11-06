<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref, type CSSProperties } from 'vue'
import { rafThrottle } from '../../utils'
import { createNamespace, getOwnerWindow } from '../../utils'

defineOptions({ name: 'VlSticky' })

const props = withDefaults(
  defineProps<{
    /** 吸顶距离 */
    offsetTop?: number | string
    /** 吸底距离 */
    offsetBottom?: number | string
    position?: 'top' | 'bottom'
    zIndex?: number
    /** 限制在某个容器内 */
    container?: HTMLElement | null
  }>(),
  { offsetTop: 0, position: 'top', zIndex: 99 },
)

const emit = defineEmits<{ change: [fixed: boolean] }>()

const { bem } = createNamespace('sticky')

const root = ref<HTMLElement>()
const fixed = ref(false)
const size = ref({ width: 0, height: 0, left: 0 })
const push = ref(0)

const toPx = (value?: number | string) => {
  if (value === undefined) return 0
  return typeof value === 'number' ? value : parseFloat(value) || 0
}

const onScroll = rafThrottle(() => {
  const el = root.value
  if (!el) return
  const rect = el.getBoundingClientRect()
  const offsetTop = toPx(props.offsetTop)
  const offsetBottom = toPx(props.offsetBottom)

  let nextFixed = false
  let nextPush = 0

  if (props.position === 'top') {
    const boundary = props.container ? props.container.getBoundingClientRect().top : 0
    nextFixed = rect.top <= boundary + offsetTop
    if (nextFixed && props.container) {
      const containerRect = props.container.getBoundingClientRect()
      const overflow = containerRect.bottom - (offsetTop + rect.height)
      if (overflow < 0) nextPush = overflow
    }
  } else {
    nextFixed = getOwnerWindow(root.value).innerHeight - rect.bottom <= offsetBottom
  }

  if (nextFixed !== fixed.value) {
    fixed.value = nextFixed
    emit('change', nextFixed)
  }
  push.value = nextPush
  size.value = { width: rect.width, height: rect.height, left: rect.left }
})

const contentStyle = computed<CSSProperties>(() => {
  if (!fixed.value) return {}
  const base: CSSProperties = {
    position: 'fixed',
    left: `${size.value.left}px`,
    width: `${size.value.width}px`,
    zIndex: props.zIndex,
  }
  if (props.position === 'top') {
    const boundary = props.container ? props.container.getBoundingClientRect().top : 0
    base.top = `${boundary + toPx(props.offsetTop) + push.value}px`
  } else {
    base.bottom = `${toPx(props.offsetBottom)}px`
  }
  return base
})

const wrapperStyle = computed<CSSProperties>(() =>
  fixed.value ? { width: `${size.value.width}px`, height: `${size.value.height}px` } : {},
)

onMounted(() => {
  const rect = root.value?.getBoundingClientRect()
  size.value = {
    width: rect?.width || 0,
    height: rect?.height || 0,
    left: rect?.left || 0,
  }
  const win = getOwnerWindow(root.value)
  win.addEventListener('scroll', onScroll, { passive: true, capture: true })
  win.addEventListener('resize', onScroll, { passive: true })
  onScroll()
})

onBeforeUnmount(() => {
  const win = getOwnerWindow(root.value)
  win.removeEventListener('scroll', onScroll, { capture: true })
  win.removeEventListener('resize', onScroll)
})
</script>

<template>
  <div ref="root" :class="bem()" :style="wrapperStyle">
    <div :class="[bem('content'), { [bem('content', 'fixed')]: fixed }]" :style="contentStyle">
      <slot />
    </div>
  </div>
</template>

<style lang="scss">
.vl-sticky {
  position: relative;

  &__content--fixed {
    position: fixed;
    top: 0;
    right: auto;
    left: auto;
  }
}
</style>

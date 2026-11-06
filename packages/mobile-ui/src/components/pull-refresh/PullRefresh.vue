<script setup lang="ts">
import { computed, onBeforeUnmount, ref, watch } from 'vue'
import { createNamespace, getOwnerWindow, useTouch } from '../../utils'
import VlLoading from '../loading/Loading.vue'

defineOptions({ name: 'VlPullRefresh' })

const props = withDefaults(
  defineProps<{
    /** loading 状态，配合 v-model 使用 */
    modelValue?: boolean
    disabled?: boolean
    /** 触发刷新的下拉距离 */
    threshold?: number
    /** 头部区域高度 */
    headHeight?: number
    pullingText?: string
    loosingText?: string
    loadingText?: string
    successText?: string
    successDuration?: number
  }>(),
  {
    threshold: 60,
    headHeight: 50,
    pullingText: '下拉即可刷新',
    loosingText: '释放立即刷新',
    loadingText: '加载中...',
    successText: '刷新成功',
    successDuration: 500,
  },
)

const emit = defineEmits<{
  'update:modelValue': [value: boolean]
  refresh: []
}>()

const { bem } = createNamespace('pull-refresh')

const root = ref<HTMLElement>()
const distance = ref(0)
const status = ref<'normal' | 'pulling' | 'loosing' | 'loading' | 'success'>('normal')
const { state, start, move } = useTouch()

const headStyle = computed(() => ({
  height: `${props.headHeight}px`,
  transform: `translateY(${distance.value - props.headHeight}px)`,
}))

const contentStyle = computed(() => ({
  transform: distance.value ? `translate3d(0, ${distance.value}px, 0)` : '',
  transition: distance.value && status.value !== 'loading' ? 'none' : 'transform 0.3s var(--vl-ease)',
}))

const text = computed(() => {
  if (status.value === 'loading') return props.loadingText
  if (status.value === 'success') return props.successText
  if (status.value === 'loosing') return props.loosingText
  return props.pullingText
})

const onTouchStart = (event: TouchEvent) => {
  if (props.disabled || props.modelValue) return
  const win = getOwnerWindow(root.value)
  const scrollTop = win.scrollY || win.document.documentElement.scrollTop
  if (scrollTop > 0) return
  start(event)
}

const onTouchMove = (event: TouchEvent) => {
  if (props.disabled || props.modelValue) return
  move(event)
  if (state.direction !== 'vertical' || state.deltaY <= 0) return
  event.preventDefault()
  const damped = Math.pow(state.deltaY, 0.85)
  distance.value = Math.min(damped, props.threshold * 2)
  status.value = distance.value >= props.threshold ? 'loosing' : 'pulling'
}

const onTouchEnd = () => {
  if (props.disabled || props.modelValue) return
  if (status.value === 'loading') return
  if (distance.value >= props.threshold) {
    distance.value = props.headHeight
    status.value = 'loading'
    emit('update:modelValue', true)
    emit('refresh')
  } else {
    distance.value = 0
    status.value = 'normal'
  }
}

let timer: ReturnType<typeof setTimeout> | null = null

watch(
  () => props.modelValue,
  (value) => {
    if (value) {
      status.value = 'loading'
      distance.value = props.headHeight
      return
    }
    if (status.value !== 'loading') return
    if (props.successText) {
      status.value = 'success'
      timer = setTimeout(() => {
        status.value = 'normal'
        distance.value = 0
      }, props.successDuration)
    } else {
      status.value = 'normal'
      distance.value = 0
    }
  },
)

onBeforeUnmount(() => timer && clearTimeout(timer))
</script>

<template>
  <div
    ref="root"
    :class="bem()"
    @touchstart.passive="onTouchStart"
    @touchmove="onTouchMove"
    @touchend="onTouchEnd"
    @touchcancel="onTouchEnd"
  >
    <div :class="[bem('head'), bem('head', status)]" :style="headStyle">
      <VlLoading v-if="status === 'loading'" :size="16" />
      <span :class="bem('text')">{{ text }}</span>
    </div>
    <div :class="bem('content')" :style="contentStyle">
      <slot />
    </div>
  </div>
</template>

<style lang="scss">
.vl-pull-refresh {
  position: relative;
  overflow: hidden;

  &__head {
    position: absolute;
    top: 0;
    left: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    width: 100%;
    color: var(--vl-text-color-3);
    transform: translateY(0);
    transition: transform 0.3s var(--vl-ease);
  }

  &__text {
    margin-left: 6px;
    font-size: var(--vl-font-size-sm);
  }
}
</style>

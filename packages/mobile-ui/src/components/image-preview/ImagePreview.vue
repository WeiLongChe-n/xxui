<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import { clamp, createNamespace, getOwnerWindow } from '../../utils'
import { useTeleportTarget } from '../../utils/teleport'
import XIcon from '../icon/Icon.vue'
import type { ImageSource } from './types'

defineOptions({ name: 'XImagePreview' })

const props = withDefaults(
  defineProps<{
    show?: boolean
    images?: ImageSource[]
    startPosition?: number
    closeable?: boolean
    showIndex?: boolean
    teleport?: string | HTMLElement
  }>(),
  {
    show: false,
    images: () => [],
    startPosition: 0,
    closeable: true,
    showIndex: true,
  },
)

const emit = defineEmits<{
  'update:show': [value: boolean]
  change: [index: number]
  close: []
}>()

const { bem } = createNamespace('image-preview')

const teleportTarget = useTeleportTarget(props.teleport)

const root = ref<HTMLElement | null>(null)
const index = ref(0)

const urls = computed(() =>
  props.images.map((item) => (typeof item === 'string' ? { url: item } : item)),
)

const syncIndex = (value: number) => {
  if (!urls.value.length) {
    index.value = 0
    return
  }
  index.value = clamp(value, 0, urls.value.length - 1)
}

watch(() => props.startPosition, (value) => syncIndex(value), { immediate: true })
watch(
  () => props.images,
  () => syncIndex(props.startPosition),
)

/* ---------------- 切换（拖拽 / 箭头 / 键盘） ---------------- */

const dragOffset = ref(0)
const dragging = ref(false)
const start = { x: 0, y: 0, locked: false }
/** 拖过之后紧随的 click 不能当成「关闭」 */
let moved = false

const viewportWidth = () => getOwnerWindow(root.value).innerWidth

const hasMultiple = computed(() => urls.value.length > 1)

const swipeTo = (target: number) => {
  const next = clamp(target, 0, urls.value.length - 1)
  if (next === index.value) return
  index.value = next
  emit('change', next)
}

/**
 * 用 Pointer Events 而不是 touch：鼠标、触控板、触屏走同一套逻辑，
 * 桌面端才能拖拽换图。
 */
const onPointerDown = (event: PointerEvent) => {
  if (!hasMultiple.value) return
  if (event.pointerType === 'mouse' && event.button !== 0) return

  start.x = event.clientX
  start.y = event.clientY
  start.locked = false
  moved = false
  dragging.value = true
  dragOffset.value = 0

  // 指针移出画面后仍能继续拖
  ;(event.currentTarget as HTMLElement | null)?.setPointerCapture?.(event.pointerId)
}

const onPointerMove = (event: PointerEvent) => {
  if (!dragging.value) return

  const dx = event.clientX - start.x
  const dy = event.clientY - start.y

  if (!start.locked) {
    if (Math.abs(dx) < 6 && Math.abs(dy) < 6) return
    start.locked = true
  }

  // 纵向为主时不抢手势
  if (Math.abs(dy) > Math.abs(dx)) return
  if (Math.abs(dx) > 8) moved = true

  const atEdge = (index.value === 0 && dx > 0) || (index.value === urls.value.length - 1 && dx < 0)
  dragOffset.value = atEdge ? dx * 0.3 : dx
}

const onPointerUp = (event: PointerEvent) => {
  if (!dragging.value) return
  dragging.value = false

  ;(event.currentTarget as HTMLElement | null)?.releasePointerCapture?.(event.pointerId)

  const threshold = viewportWidth() * 0.25
  if (dragOffset.value < -threshold) swipeTo(index.value + 1)
  else if (dragOffset.value > threshold) swipeTo(index.value - 1)
  dragOffset.value = 0
}

const trackStyle = computed(() => ({
  transform: `translate3d(calc(-${index.value * 100}% + ${dragOffset.value}px), 0, 0)`,
  transition: dragging.value ? 'none' : 'transform var(--x-duration) var(--x-ease)',
}))

/* ---------------- 关闭 ---------------- */

const close = () => {
  emit('update:show', false)
  emit('close')
}

/** 拖拽结束时浏览器还会补一个 click，这里屏蔽掉，避免一拖就关 */
const onItemClick = () => {
  if (moved) {
    moved = false
    return
  }
  close()
}

const onKeydown = (event: KeyboardEvent) => {
  if (!props.show) return
  if (event.key === 'Escape' && props.closeable) close()
  else if (event.key === 'ArrowLeft') swipeTo(index.value - 1)
  else if (event.key === 'ArrowRight') swipeTo(index.value + 1)
}

onMounted(() => window.addEventListener('keydown', onKeydown))
onBeforeUnmount(() => window.removeEventListener('keydown', onKeydown))
</script>

<template>
  <Teleport :to="teleportTarget" :disabled="!teleportTarget">
    <Transition name="x-fade">
      <div v-if="show" ref="root" :class="bem()" @click.self="close">
        <div
          :class="bem('swipe')"
          :style="trackStyle"
          @pointerdown="onPointerDown"
          @pointermove="onPointerMove"
          @pointerup="onPointerUp"
          @pointercancel="onPointerUp"
        >
          <div v-for="(item, i) in urls" :key="i" :class="bem('item')" @click="onItemClick">
            <img :src="item.url" :alt="item.alt" :class="bem('img')" draggable="false" />
          </div>
        </div>

        <button
          v-if="hasMultiple && index > 0"
          type="button"
          :class="[bem('arrow'), bem('arrow', 'prev')]"
          aria-label="上一张"
          @click.stop="swipeTo(index - 1)"
        >
          <XIcon name="arrow-left" />
        </button>
        <button
          v-if="hasMultiple && index < urls.length - 1"
          type="button"
          :class="[bem('arrow'), bem('arrow', 'next')]"
          aria-label="下一张"
          @click.stop="swipeTo(index + 1)"
        >
          <XIcon name="arrow-right" />
        </button>

        <button v-if="closeable" type="button" :class="bem('close')" aria-label="关闭预览" @click="close">
          <XIcon name="close" />
        </button>

        <div v-if="showIndex && urls.length > 1" :class="bem('index')">
          {{ index + 1 }} / {{ urls.length }}
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<style lang="scss">
.x-image-preview {
  position: fixed;
  inset: 0;
  z-index: 2500;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  background: #000;
  user-select: none;
  touch-action: none;

  &__swipe {
    display: flex;
    width: 100%;
    height: 100%;
    cursor: grab;
    will-change: transform;

    &:active {
      cursor: grabbing;
    }
  }

  &__item {
    display: flex;
    flex: 0 0 100%;
    align-items: center;
    justify-content: center;
    width: 100%;
    height: 100%;
  }

  &__img {
    max-width: 100%;
    max-height: 100%;
    object-fit: contain;
    pointer-events: none;
  }

  &__close {
    position: absolute;
    top: 16px;
    right: 16px;
    display: flex;
    align-items: center;
    justify-content: center;
    width: 36px;
    height: 36px;
    font-size: 18px;
    color: #fff;
    cursor: pointer;
    background: rgba(255, 255, 255, 0.16);
    border: 0;
    border-radius: 50%;
  }

  &__arrow {
    position: absolute;
    top: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    width: 40px;
    height: 40px;
    font-size: 20px;
    color: #fff;
    cursor: pointer;
    background: rgba(255, 255, 255, 0.16);
    border: 0;
    border-radius: 50%;
    transform: translateY(-50%);
    transition: background 0.2s;

    &:hover {
      background: rgba(255, 255, 255, 0.3);
    }

    &--prev {
      left: 16px;
    }

    &--next {
      right: 16px;
    }
  }

  &__index {
    position: absolute;
    bottom: 24px;
    left: 50%;
    padding: 4px 12px;
    font-size: 12px;
    color: #fff;
    background: rgba(255, 255, 255, 0.16);
    border-radius: 999px;
    transform: translateX(-50%);
  }
}
</style>

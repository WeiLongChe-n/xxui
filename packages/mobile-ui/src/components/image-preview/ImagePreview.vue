<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { clamp, createNamespace, getOwnerWindow } from '../../utils'
import { useTeleportTarget } from '../../utils/teleport'
import VlIcon from '../icon/Icon.vue'
import type { ImageSource } from './types'

defineOptions({ name: 'VlImagePreview' })

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

/* ---------------- 滑动切换 ---------------- */

const dragOffset = ref(0)
const dragging = ref(false)
const start = { x: 0, y: 0, locked: false }

const viewportWidth = () => getOwnerWindow(root.value).innerWidth

const onTouchStart = (event: TouchEvent) => {
  if (urls.value.length <= 1) return
  start.x = event.touches[0].clientX
  start.y = event.touches[0].clientY
  start.locked = false
  dragging.value = true
  dragOffset.value = 0
}

const onTouchMove = (event: TouchEvent) => {
  if (!dragging.value) return
  const dx = event.touches[0].clientX - start.x
  const dy = event.touches[0].clientY - start.y

  if (!start.locked) {
    if (Math.abs(dx) < 6 && Math.abs(dy) < 6) return
    start.locked = true
  }

  if (Math.abs(dy) > Math.abs(dx)) return

  const atEdge = (index.value === 0 && dx > 0) || (index.value === urls.value.length - 1 && dx < 0)
  dragOffset.value = atEdge ? dx * 0.3 : dx
}

const onTouchEnd = () => {
  if (!dragging.value) return
  dragging.value = false
  const threshold = viewportWidth() * 0.25
  if (dragOffset.value < -threshold) swipeTo(index.value + 1)
  else if (dragOffset.value > threshold) swipeTo(index.value - 1)
  dragOffset.value = 0
}

const swipeTo = (target: number) => {
  const next = clamp(target, 0, urls.value.length - 1)
  if (next === index.value) return
  index.value = next
  emit('change', next)
}

const trackStyle = computed(() => ({
  transform: `translate3d(calc(-${index.value * 100}% + ${dragOffset.value}px), 0, 0)`,
  transition: dragging.value ? 'none' : 'transform var(--vl-duration) var(--vl-ease)',
}))

/* ---------------- 关闭 ---------------- */

const close = () => {
  emit('update:show', false)
  emit('close')
}
</script>

<template>
  <Teleport :to="teleportTarget" :disabled="!teleportTarget">
    <Transition name="vl-fade">
      <div v-if="show" ref="root" :class="bem()" @click.self="close">
        <div
          :class="bem('swipe')"
          :style="trackStyle"
          @touchstart="onTouchStart"
          @touchmove="onTouchMove"
          @touchend="onTouchEnd"
          @touchcancel="onTouchEnd"
        >
          <div v-for="(item, i) in urls" :key="i" :class="bem('item')" @click="close">
            <img :src="item.url" :alt="item.alt" :class="bem('img')" draggable="false" />
          </div>
        </div>

        <button v-if="closeable" type="button" :class="bem('close')" aria-label="关闭预览" @click="close">
          <VlIcon name="close" />
        </button>

        <div v-if="showIndex && urls.length > 1" :class="bem('index')">
          {{ index + 1 }} / {{ urls.length }}
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<style lang="scss">
.vl-image-preview {
  position: fixed;
  inset: 0;
  z-index: 2500;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  background: #000;
  user-select: none;

  &__swipe {
    display: flex;
    width: 100%;
    height: 100%;
    will-change: transform;
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

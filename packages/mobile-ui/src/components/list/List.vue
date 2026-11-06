<script setup lang="ts">
import { nextTick, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import { createNamespace, getOwnerWindow } from '../../utils'
import VlLoading from '../loading/Loading.vue'

defineOptions({ name: 'VlList' })

const props = withDefaults(
  defineProps<{
    loading?: boolean
    finished?: boolean
    error?: boolean
    /** 距离底部多少像素时触发加载 */
    offset?: number
    immediateCheck?: boolean
    loadingText?: string
    finishedText?: string
    errorText?: string
    /** 是否禁用加载 */
    disabled?: boolean
  }>(),
  {
    offset: 200,
    immediateCheck: true,
    loadingText: '加载中...',
    finishedText: '没有更多了',
    errorText: '加载失败，点击重试',
  },
)

const emit = defineEmits<{
  load: []
  'update:error': [value: boolean]
}>()

const { bem } = createNamespace('list')

const placeholder = ref<HTMLElement>()
let observer: IntersectionObserver | null = null

const check = () => {
  if (props.disabled || props.loading || props.finished || props.error) return
  emit('load')
}

const onIntersect = (entries: IntersectionObserverEntry[]) => {
  if (entries[0]?.isIntersecting) check()
}

const createObserver = () => {
  const win = getOwnerWindow(placeholder.value)
  if (!placeholder.value || typeof win.IntersectionObserver === 'undefined') return
  observer?.disconnect()
  const io = new win.IntersectionObserver(onIntersect, {
    rootMargin: `0px 0px ${props.offset}px 0px`,
  })
  io.observe(placeholder.value)
  observer = io
}

const onClickError = () => {
  emit('update:error', false)
  nextTick(check)
}

watch(
  () => [props.loading, props.finished, props.error],
  async () => {
    await nextTick()
    if (!props.loading && !props.finished && !props.error) {
      createObserver()
    }
  },
)

onMounted(async () => {
  await nextTick()
  createObserver()
  if (props.immediateCheck) check()
})

onBeforeUnmount(() => observer?.disconnect())
</script>

<template>
  <div :class="bem()">
    <slot />
    <div ref="placeholder" :class="bem('placeholder')">
      <div v-if="loading" :class="bem('loading')">
        <VlLoading :size="16" type="spinner" />
        <span :class="bem('loading-text')">{{ loadingText }}</span>
      </div>
      <div v-else-if="error" :class="bem('error')" @click="onClickError">{{ errorText }}</div>
      <div v-else-if="finished" :class="bem('finished')">{{ finishedText }}</div>
    </div>
  </div>
</template>

<style lang="scss">
.vl-list {
  &__placeholder {
    min-height: 1px;
  }

  &__loading {
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 16px;
  }

  &__loading-text {
    margin-left: 8px;
    font-size: var(--vl-font-size-sm);
    color: var(--vl-text-color-3);
  }

  &__finished,
  &__error {
    padding: 18px 16px;
    font-size: var(--vl-font-size-sm);
    color: var(--vl-text-color-3);
    text-align: center;
  }

  &__error {
    color: var(--vl-primary);
    cursor: pointer;
  }
}
</style>

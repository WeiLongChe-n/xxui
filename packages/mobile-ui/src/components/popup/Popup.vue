<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { addUnit, createNamespace, nextZIndex, useLockScroll } from '../../utils'
import VlOverlay from '../overlay/Overlay.vue'
import VlIcon from '../icon/Icon.vue'

defineOptions({ name: 'VlPopup' })

const props = withDefaults(
  defineProps<{
    show?: boolean
    /** 弹出位置 */
    position?: 'center' | 'top' | 'bottom' | 'left' | 'right'
    /** 是否为圆角弹窗 */
    round?: boolean
    /** 是否显示关闭图标 */
    closeable?: boolean
    closeIcon?: string
    closeIconPosition?: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right'
    /** 是否显示遮罩 */
    overlay?: boolean
    overlayClass?: string
    overlayStyle?: Record<string, string>
    /** 点击遮罩是否关闭 */
    closeOnClickOverlay?: boolean
    zIndex?: number
    duration?: number | string
    lockScroll?: boolean
    safeAreaInsetBottom?: boolean
    safeAreaInsetTop?: boolean
    teleport?: string | HTMLElement | null
    transition?: string
    /** 点击关闭图标后是否阻止关闭 */
    beforeClose?: () => boolean | Promise<boolean>
  }>(),
  {
    position: 'center',
    closeIcon: 'close',
    closeIconPosition: 'top-right',
    overlay: true,
    closeOnClickOverlay: false,
    lockScroll: true,
    teleport: 'body',
  },
)

const emit = defineEmits<{
  'update:show': [value: boolean]
  open: []
  close: []
  opened: []
  closed: []
  'click-overlay': [event: MouseEvent]
  'click-close-icon': [event: MouseEvent]
}>()

const { bem } = createNamespace('popup')

const localZIndex = ref(props.zIndex || nextZIndex())
const durationStyle = computed(() =>
  props.duration !== undefined ? { '--vl-duration': addUnit(props.duration, 's') } : undefined,
)

watch(
  () => props.show,
  (value) => {
    if (value) {
      if (!props.zIndex) localZIndex.value = nextZIndex()
      emit('open')
    } else {
      emit('close')
    }
  },
  { immediate: true },
)

const showRef = computed(() => props.show)
useLockScroll(computed(() => !!props.show && props.lockScroll) as unknown as typeof showRef)

const classes = computed(() => [
  bem(),
  bem('', props.position),
  {
    [bem('', 'round')]: props.round,
    [bem('', 'safe-bottom')]: props.safeAreaInsetBottom,
    [bem('', 'safe-top')]: props.safeAreaInsetTop,
  },
])

const transitionName = computed(() => {
  if (props.transition) return props.transition
  if (props.position === 'center') return 'vl-zoom'
  return `vl-slide-${props.position}`
})

const style = computed(() => ({
  zIndex: props.zIndex || localZIndex.value,
  ...(durationStyle.value || {}),
}))

const updateShow = (value: boolean) => emit('update:show', value)

const onClickOverlay = (event: MouseEvent) => {
  emit('click-overlay', event)
  if (props.closeOnClickOverlay) updateShow(false)
}

const onClickClose = async (event: MouseEvent) => {
  emit('click-close-icon', event)
  if (props.beforeClose) {
    const allow = await props.beforeClose()
    if (!allow) return
  }
  updateShow(false)
}
</script>

<template>
  <Teleport :to="teleport" :disabled="!teleport">
    <VlOverlay
      v-if="show && overlay"
      :z-index="style.zIndex"
      :overlay-class="overlayClass"
      :custom-style="overlayStyle"
      @click="onClickOverlay"
    />
    <Transition
      :name="transitionName"
      @after-enter="emit('opened')"
      @after-leave="emit('closed')"
    >
      <div v-if="show" :class="classes" :style="style" role="dialog">
        <span
          v-if="closeable"
          :class="[bem('close-icon'), bem('close-icon', closeIconPosition)]"
          @click="onClickClose"
        >
          <VlIcon :name="closeIcon" />
        </span>
        <slot />
      </div>
    </Transition>
  </Teleport>
</template>

<style lang="scss">
@use '../../styles/mixins' as *;

.vl-popup {
  position: fixed;
  max-width: 100%;
  max-height: 100%;
  background: var(--vl-background-2);
  overflow-y: auto;
  overscroll-behavior: contain;

  &--center {
    top: 50%;
    left: 50%;
    overflow-y: visible;
    border-radius: var(--vl-radius-lg);
    transform: translate(-50%, -50%);
  }

  &--top {
    top: 0;
    left: 0;
    width: 100%;
  }

  &--bottom {
    bottom: 0;
    left: 0;
    width: 100%;
  }

  &--left {
    top: 0;
    bottom: 0;
    left: 0;
    height: 100%;
  }

  &--right {
    top: 0;
    right: 0;
    bottom: 0;
    height: 100%;
  }

  &--round.vl-popup--bottom {
    border-radius: var(--vl-radius-lg) var(--vl-radius-lg) 0 0;
  }

  &--round.vl-popup--top {
    border-radius: 0 0 var(--vl-radius-lg) var(--vl-radius-lg);
  }

  &--round.vl-popup--left {
    border-radius: 0 var(--vl-radius-lg) var(--vl-radius-lg) 0;
  }

  &--round.vl-popup--right {
    border-radius: var(--vl-radius-lg) 0 0 var(--vl-radius-lg);
  }

  &--safe-bottom {
    @include safe-area-bottom;
  }

  &--safe-top {
    padding-top: var(--vl-safe-top);
  }

  &__close-icon {
    position: absolute;
    z-index: 1;
    display: flex;
    align-items: center;
    justify-content: center;
    width: 32px;
    height: 32px;
    font-size: 18px;
    color: var(--vl-text-color-3);
    cursor: pointer;

    &--top-left {
      top: 10px;
      left: 10px;
    }

    &--top-right {
      top: 10px;
      right: 10px;
    }

    &--bottom-left {
      bottom: 10px;
      left: 10px;
    }

    &--bottom-right {
      right: 10px;
      bottom: 10px;
    }
  }
}
</style>

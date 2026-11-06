<script setup lang="ts">
import { computed, nextTick, onMounted, ref, watch } from 'vue'
import { createNamespace } from '../../utils'
import XIcon from '../icon/Icon.vue'

defineOptions({ name: 'XNoticeBar' })

const props = withDefaults(
  defineProps<{
    text?: string
    /** link 可点击 / closeable 可关闭 / none 无操作 */
    mode?: 'link' | 'closeable' | 'none'
    color?: string
    background?: string
    leftIcon?: string
    /** 滚动速度 px/s */
    speed?: number
    /** 文字换行展示（不滚动） */
    wrapable?: boolean
    scrollable?: boolean
    delay?: number
    /** 是否显示左侧喇叭图标 */
    showIcon?: boolean
  }>(),
  {
    mode: 'link',
    speed: 60,
    delay: 1,
    showIcon: true,
    leftIcon: 'bell',
  },
)

const emit = defineEmits<{
  click: [event: MouseEvent]
  close: []
  replay: []
}>()

const { bem } = createNamespace('notice-bar')

const wrapRef = ref<HTMLElement>()
const contentRef = ref<HTMLElement>()
const needScroll = ref(false)
const visible = ref(true)

const shouldScroll = computed(() => props.scrollable !== false && !props.wrapable && needScroll.value)

const duration = computed(() => {
  const length = (props.text || '').length
  const distance = Math.max(length * 16, 120)
  return `${Math.round(distance / props.speed)}s`
})

const checkOverflow = async () => {
  await nextTick()
  if (!wrapRef.value || !contentRef.value) return
  needScroll.value = contentRef.value.scrollWidth > wrapRef.value.clientWidth + 2
}

onMounted(() => {
  setTimeout(checkOverflow, 0)
})

watch(() => props.text, checkOverflow)

const onClick = (event: MouseEvent) => emit('click', event)

const onClose = () => {
  visible.value = false
  emit('close')
}

const replay = () => {
  needScroll.value = false
  nextTick(() => {
    checkOverflow()
    emit('replay')
  })
}

defineExpose({ replay })
</script>

<template>
  <div
    v-if="visible"
    :class="[bem(), { [bem('', 'wrapable')]: wrapable }]"
    :style="{ color, background }"
    role="alert"
    @click="onClick"
  >
    <XIcon v-if="showIcon" :name="leftIcon" :class="bem('icon')" />
    <div ref="wrapRef" :class="bem('wrap')">
      <div
        ref="contentRef"
        :class="[bem('content'), { [bem('content', 'scrollable')]: shouldScroll }]"
        :style="shouldScroll ? { animationDuration: duration, animationDelay: `${delay}s` } : undefined"
      >
        <span :class="bem('text')">{{ text }}<slot /></span>
        <span v-if="shouldScroll" :class="bem('text')" aria-hidden="true">{{ text }}<slot /></span>
      </div>
    </div>
    <XIcon
      v-if="mode === 'closeable'"
      name="close"
      :class="bem('right-icon')"
      @click.stop="onClose"
    />
    <XIcon v-else-if="mode === 'link'" name="arrow-right" :class="bem('right-icon')" />
  </div>
</template>

<style lang="scss">
.x-notice-bar {
  display: flex;
  align-items: center;
  height: 40px;
  padding: 0 12px;
  overflow: hidden;
  font-size: 13px;
  color: var(--x-warning);
  background: rgba(245, 158, 11, 0.12);
  border-radius: 0;

  &__icon {
    flex: none;
    margin-right: 8px;
    font-size: 16px;
  }

  &__wrap {
    flex: 1;
    overflow: hidden;
    line-height: 40px;
    white-space: nowrap;
  }

  &__content {
    display: inline-flex;

    &--scrollable {
      animation-name: x-notice-scroll;
      animation-timing-function: linear;
      animation-iteration-count: infinite;
    }
  }

  &__text {
    display: inline-block;
    padding-right: 32px;
  }

  &__right-icon {
    flex: none;
    margin-left: 8px;
    font-size: 14px;
    cursor: pointer;
  }

  &--wrapable {
    height: auto;
    padding: 8px 12px;

    .x-notice-bar__wrap {
      line-height: 20px;
      white-space: normal;
    }

    .x-notice-bar__content {
      display: block;
      animation: none;
    }
  }
}

@keyframes x-notice-scroll {
  from {
    transform: translateX(0);
  }

  to {
    transform: translateX(-50%);
  }
}
</style>

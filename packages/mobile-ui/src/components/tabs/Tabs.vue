<script setup lang="ts">
import { computed, nextTick, onBeforeUnmount, onMounted, provide, ref, watch, type Component } from 'vue'
import { createNamespace, getOwnerWindow } from '../../utils'
import { TABS_KEY, type TabItem, type TabsKey } from './context'
import VlBadge from '../badge/Badge.vue'

defineOptions({ name: 'VlTabs' })

const props = withDefaults(
  defineProps<{
    modelValue?: TabsKey
    /** line 下划线 / card 胶囊卡片 */
    type?: 'line' | 'card'
    /** 选中态主色 */
    color?: string
    /** 导航背景色 */
    background?: string
    titleActiveColor?: string
    titleInactiveColor?: string
    /** 下划线宽度，默认标题宽度的 60% */
    lineWidth?: number | string
    lineHeight?: number | string
    /** 吸顶 */
    sticky?: boolean
    offsetTop?: number | string
    /** 标题文字是否收缩宽度 */
    shrink?: boolean
    /** 是否开启懒加载（首次切换到该 Tab 时才渲染内容） */
    lazyRender?: boolean
    duration?: number
    zIndex?: number
  }>(),
  {
    type: 'line',
    shrink: true,
    lazyRender: true,
    duration: 0.3,
    zIndex: 99,
  },
)

const emit = defineEmits<{
  'update:modelValue': [key: TabsKey]
  change: [key: TabsKey]
  'click-tab': [key: TabsKey, title: string | undefined]
}>()

const { bem } = createNamespace('tabs')

const items = ref<TabItem[]>([])
const innerKey = ref<TabsKey | undefined>(undefined)

const activeKey = computed<TabsKey | undefined>(() => {
  if (props.modelValue !== undefined && props.modelValue !== null && props.modelValue !== '') {
    return props.modelValue
  }
  const exists = items.value.some((item) => (item.name ?? item.index) === innerKey.value)
  if (innerKey.value !== undefined && exists) return innerKey.value
  const first = items.value[0]
  return first ? first.name ?? first.index : undefined
})

const register = (item: TabItem) => {
  item.index = items.value.length
  items.value.push(item)
}

const unregister = (uid: number) => {
  items.value = items.value.filter((item) => item.uid !== uid)
}

const setActive = (key: TabsKey) => {
  innerKey.value = key
  emit('update:modelValue', key)
  emit('change', key)
}

provide(TABS_KEY, {
  activeKey,
  lazyRender: computed(() => props.lazyRender),
  setActive,
  register,
  unregister,
})

/* ---------------- 下划线位置计算 ---------------- */
const navRef = ref<HTMLElement>()
const itemRefs = ref<HTMLElement[]>([])
const lineStyle = ref<Record<string, string>>({ opacity: '0' })

const setItemRef = (el: Element | null, index: number) => {
  if (el) itemRefs.value[index] = el as HTMLElement
}

const updateLine = async () => {
  if (props.type !== 'line') return
  await nextTick()
  const index = items.value.findIndex((item) => (item.name ?? item.index) === activeKey.value)
  const el = itemRefs.value[index]
  const nav = navRef.value
  if (!el || !nav) return

  let width = el.offsetWidth * 0.6
  if (props.lineWidth !== undefined) {
    width = typeof props.lineWidth === 'number' ? props.lineWidth : parseFloat(props.lineWidth)
  }
  const left = el.offsetLeft + (el.offsetWidth - width) / 2
  lineStyle.value = {
    width: `${width}px`,
    height: props.lineHeight ? `${props.lineHeight}px` : undefined,
    transform: `translateX(${left}px)`,
    opacity: '1',
    transitionDuration: `${props.duration}s`,
  } as Record<string, string>

  if (nav.scrollWidth > nav.clientWidth + 1) {
    const target = el.offsetLeft - (nav.clientWidth - el.offsetWidth) / 2
    nav.scrollTo({ left: Math.max(target, 0), behavior: 'smooth' })
  }
}

watch([activeKey, () => items.value.length, () => props.type], updateLine)

let observer: ResizeObserver | null = null
onMounted(() => {
  updateLine()
  const win = getOwnerWindow(navRef.value)
  if (typeof win.ResizeObserver !== 'undefined' && navRef.value) {
    const ro = new win.ResizeObserver(() => updateLine())
    ro.observe(navRef.value)
    observer = ro
  }
  win.addEventListener('resize', updateLine)
})

onBeforeUnmount(() => {
  observer?.disconnect()
  getOwnerWindow(navRef.value).removeEventListener('resize', updateLine)
})

const onClickItem = (item: TabItem) => {
  if (item.disabled) return
  const key = item.name ?? item.index
  if (key !== activeKey.value) setActive(key)
  emit('click-tab', key, item.title)
}

const navItemClasses = (item: TabItem) => [
  bem('nav-item'),
  {
    [bem('nav-item', 'active')]: (item.name ?? item.index) === activeKey.value,
    [bem('nav-item', 'disabled')]: item.disabled,
  },
]

const stickyStyle = computed(() => {
  if (!props.sticky) return undefined
  const top = typeof props.offsetTop === 'number' ? `${props.offsetTop}px` : props.offsetTop
  return { position: 'sticky' as const, top, zIndex: props.zIndex }
})

const navStyle = computed(() => ({
  background: props.background,
  color: props.titleInactiveColor,
}))

const activeColorStyle = computed(() => ({
  '--vl-tabs-active-color': props.color || 'var(--vl-primary)',
  '--vl-tabs-active-text': props.titleActiveColor || props.color || 'var(--vl-primary)',
}))

/** 渲染 Tab 的 title 插槽（定位在导航栏内） */
const TitleSlot: Component = (slotProps: { tab: TabItem }) =>
  slotProps.tab.slots.title ? slotProps.tab.slots.title!() : slotProps.tab.title
</script>

<template>
  <div :class="bem()" :style="activeColorStyle">
    <div :class="[bem('nav'), { [bem('nav', 'card')]: type === 'card' }]" :style="[navStyle, stickyStyle]">
      <div ref="navRef" :class="[bem('nav-wrap'), { [bem('nav-wrap', 'shrink')]: shrink }]">
        <div
          v-for="(item, index) in items"
          :key="item.uid"
          :ref="(el) => setItemRef(el as Element | null, index)"
          :class="navItemClasses(item)"
          role="tab"
          :aria-selected="(item.name ?? item.index) === activeKey"
          @click="onClickItem(item)"
        >
          <span :class="bem('nav-title')">
            <TitleSlot :tab="item" />
          </span>
          <VlBadge
            v-if="item.dot || item.badge !== undefined"
            :content="item.badge"
            :dot="item.dot"
            standalone
            :class="bem('nav-badge')"
          />
        </div>
        <div v-if="type === 'line'" :class="bem('line')" :style="lineStyle" />
      </div>
      <div v-if="$slots['nav-right']" :class="bem('nav-right')">
        <slot name="nav-right" />
      </div>
    </div>
    <div :class="bem('content')">
      <slot />
    </div>
  </div>
</template>

<style lang="scss">
@use '../../styles/mixins' as *;

.vl-tabs {
  --vl-tabs-active-color: var(--vl-primary);
  --vl-tabs-active-text: var(--vl-primary);

  position: relative;

  &__nav {
    position: relative;
    display: flex;
    align-items: center;
    background: var(--vl-background-2);

    @include hairline(bottom);
  }

  &__nav-wrap {
    position: relative;
    display: flex;
    flex: 1;
    overflow-x: auto;
    scrollbar-width: none;

    &::-webkit-scrollbar {
      display: none;
    }
  }

  &__nav-item {
    position: relative;
    display: flex;
    flex: 0 0 auto;
    align-items: center;
    justify-content: center;
    padding: 13px 4px;
    font-size: 14px;
    color: var(--vl-text-color-2);
    cursor: pointer;
    transition: color var(--vl-duration-fast);

    &--active {
      font-weight: 600;
      color: var(--vl-tabs-active-text);
    }

    &--disabled {
      opacity: 0.4;
      cursor: not-allowed;
    }
  }

  &__nav-wrap--shrink &__nav-item {
    flex: 1 0 auto;
    min-width: 72px;
  }

  &__nav-title {
    display: inline-flex;
    align-items: center;
  }

  &__nav-badge {
    margin-left: 6px;
  }

  &__line {
    position: absolute;
    bottom: 0;
    left: 0;
    height: 3px;
    background: var(--vl-tabs-active-color);
    border-radius: 3px;
    transition-property: transform, width, opacity;
    transition-timing-function: var(--vl-ease);
  }

  &__nav-right {
    display: flex;
    align-items: center;
    padding: 0 12px;
    font-size: 13px;
    color: var(--vl-text-color-2);
  }

  /* 卡片风格 */
  &__nav--card {
    gap: 8px;
    padding: 8px 12px;

    &::after {
      display: none;
    }

    .vl-tabs__nav-wrap {
      gap: 8px;
    }

    .vl-tabs__nav-item {
      padding: 7px 14px;
      background: var(--vl-background-3);
      border-radius: 8px;
      transition: background var(--vl-duration-fast), color var(--vl-duration-fast);

      &--active {
        color: #fff;
        background: var(--vl-tabs-active-color);
      }
    }

    .vl-tabs__nav-badge {
      color: inherit;
    }
  }

  &__content {
    position: relative;
  }
}
</style>

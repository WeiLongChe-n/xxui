/**
 * 演示舞台
 *
 * 文档页的交互不再每个示例各占一个手机框，而是统一收进右侧的一个预览盒子：
 * 左侧只保留说明与代码，滚动到哪个示例，右侧就切换到哪个示例。
 *
 * 这里维护三件事：
 * - 每个 DemoBlock 的注册表（元素、顺序、标题、内边距）
 * - 当前激活的示例（滚动联动 + 点击切换）
 * - 沙箱 body（Teleport 目标）与宽屏标记
 */

import { computed, ref, shallowRef, watch } from 'vue'

export interface StageItem {
  id: string
  el: HTMLElement
  title: string
  padding: 'normal' | 'none'
  background: 'card' | 'page' | 'transparent'
}

const items = shallowRef<StageItem[]>([])

/** 沙箱 body，作为所有示例内容的 Teleport 目标 */
export const stageBody = shallowRef<HTMLElement | null>(null)

/** 当前激活的示例 id */
export const stageActiveId = ref<string | null>(null)

/** 宽屏才启用右侧舞台，窄屏回落到卡片内嵌预览 */
export const stageWide = ref(true)

/** 递增即重挂载当前示例，对应预览工具条的「重置」 */
export const stageResetKey = ref(0)

/** 手动切换后的短暂锁定，避免滚动监听立刻把选择改回去 */
let manualUntil = 0

export const stageHasDemos = computed(() => items.value.length > 0)

export const stageActiveItem = computed(
  () => items.value.find((item) => item.id === stageActiveId.value) ?? null,
)

export function registerDemo(item: StageItem) {
  if (items.value.some((i) => i.id === item.id)) return
  items.value = [...items.value, item]
  if (!stageActiveId.value) stageActiveId.value = item.id
  startSpy()
}

export function unregisterDemo(id: string) {
  items.value = items.value.filter((item) => item.id !== id)
  if (stageActiveId.value === id) stageActiveId.value = items.value[0]?.id ?? null
}

/** 点击左侧卡片时切换右侧预览 */
export function activateDemo(id: string, scroll = false) {
  stageActiveId.value = id
  manualUntil = Date.now() + 900

  if (!scroll) return
  const item = items.value.find((i) => i.id === id)
  if (!item) return
  const top = item.el.getBoundingClientRect().top + window.scrollY - 96
  window.scrollTo({ top: Math.max(0, top), behavior: 'smooth' })
}

export function resetStageDemo() {
  stageResetKey.value += 1
}

/* ---------------- 滚动联动 ---------------- */

let spying = false
let raf = 0

function startSpy() {
  if (spying || typeof window === 'undefined') return
  spying = true
  window.addEventListener('scroll', schedule, { passive: true })
  window.addEventListener('resize', schedule)
  schedule()
}

function schedule() {
  if (raf) return
  raf = requestAnimationFrame(() => {
    raf = 0
    computeActive()
  })
}

/**
 * 取「已经滚过判定线」的最后一个示例。
 *
 * 判定线放在视口上部，配合左侧卡片的排布，滚动时会自然地从上到下游走；
 * 判定线之上没有示例时选中第一个，保证右侧始终有内容。
 */
function computeActive() {
  const list = items.value
  if (!list.length) return
  if (Date.now() < manualUntil) return

  const line = window.innerHeight * 0.3
  let best: string | null = null

  for (const item of list) {
    if (item.el.getBoundingClientRect().top <= line) best = item.id
  }

  if (!best) {
    // 全部在判定线以下：选离判定线最近的一个
    const first = list[0]
    const visible = list.find((item) => item.el.getBoundingClientRect().bottom > 0)
    best = (visible ?? first).id
  }

  if (best && best !== stageActiveId.value) stageActiveId.value = best
}

/* ---------------- 宽屏判定 ---------------- */

let mediaBound = false

export function initStageViewport() {
  if (mediaBound || typeof window === 'undefined') return
  mediaBound = true

  const mq = window.matchMedia('(min-width: 1280px)')
  stageWide.value = mq.matches
  mq.addEventListener('change', (e) => {
    stageWide.value = e.matches
  })

  // 供 CSS 让出右侧空间、隐藏目录等
  watch(
    [stageHasDemos, stageWide],
    ([hasDemos, wide]) => {
      document.documentElement.classList.toggle('has-demo-stage', hasDemos && wide)
    },
    { immediate: true },
  )
}

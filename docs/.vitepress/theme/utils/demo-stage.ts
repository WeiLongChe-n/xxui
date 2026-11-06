/**
 * 演示舞台
 *
 * 文档页的交互不再每个示例各占一个手机框，而是统一收进右侧的一个预览盒子：
 * 左侧只保留说明与代码，滚动到哪个示例，右侧就切换到哪个示例。
 *
 * 这里维护四件事：
 * - 每个 DemoBlock 的注册表（元素、顺序、标题、内边距）
 * - 当前激活的示例（滚动联动 + 点击切换 + 菜单选择）
 * - 浏览历史（盒子里的「后退」按它回退）
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

/** 浏览过的示例，用于后退 */
const history = ref<string[]>([])

const HISTORY_LIMIT = 20

/** 手动切换后的短暂锁定，避免滚动监听立刻把选择改回去 */
let manualUntil = 0

export const stageHasDemos = computed(() => items.value.length > 0)

export const stageItems = computed(() => items.value)

export const stageActiveItem = computed(
  () => items.value.find((item) => item.id === stageActiveId.value) ?? null,
)

/** 当前示例在列表中的位置，用于导航栏的 3 / 4 */
export const stagePosition = computed(() => {
  const index = items.value.findIndex((item) => item.id === stageActiveId.value)
  return { index: index < 0 ? 0 : index + 1, total: items.value.length }
})

export const stageCanBack = computed(() => history.value.length > 1)

/* ---------------- 切换 ---------------- */

function remember(id: string) {
  if (history.value[history.value.length - 1] === id) return
  history.value = [...history.value.slice(-(HISTORY_LIMIT - 1)), id]
}

/** 统一的切换入口：保持当前值、历史与选择一致 */
function setActive(id: string, record = true) {
  if (stageActiveId.value === id) return
  stageActiveId.value = id
  if (record) remember(id)
}

export function registerDemo(item: StageItem) {
  if (items.value.some((i) => i.id === item.id)) return
  items.value = [...items.value, item]

  if (!stageActiveId.value) {
    stageActiveId.value = item.id
    history.value = [item.id]
  }
  startSpy()
}

export function unregisterDemo(id: string) {
  items.value = items.value.filter((item) => item.id !== id)
  history.value = history.value.filter((key) => key !== id)

  if (stageActiveId.value === id) {
    stageActiveId.value = items.value[0]?.id ?? null
    if (stageActiveId.value) history.value = [stageActiveId.value]
  }
}

/** 把左侧卡片滚到可视区，示例本身已经在视口里时不动 */
function scrollToDemo(id: string) {
  const item = items.value.find((i) => i.id === id)
  if (!item || typeof window === 'undefined') return

  const rect = item.el.getBoundingClientRect()
  const navOffset = 96
  if (rect.top >= navOffset && rect.bottom <= window.innerHeight) return

  window.scrollTo({ top: Math.max(0, rect.top + window.scrollY - navOffset), behavior: 'smooth' })
}

/** 点击左侧卡片或菜单项时切换右侧预览 */
export function activateDemo(id: string, scroll = false) {
  setActive(id)
  manualUntil = Date.now() + 900
  if (scroll) scrollToDemo(id)
}

/** 后退到上一个看过的示例 */
export function stageBack() {
  if (!stageCanBack.value) return

  const next = history.value.slice(0, -1)
  const prev = next[next.length - 1]
  if (!prev) return

  history.value = next
  stageActiveId.value = prev
  manualUntil = Date.now() + 900
  scrollToDemo(prev)
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

  if (best) setActive(best)
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

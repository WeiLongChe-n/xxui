<script setup lang="ts">
import { computed, nextTick, onBeforeUnmount, onMounted, ref, shallowRef, watch } from 'vue'
import { useData } from 'vitepress'
import { brandOptions, setDefaultTeleportTarget } from '@vela/mobile'
import {
  collectDemoHashes,
  collectStylesByHashes,
  collectVelaStyles,
  SANDBOX_BASE_STYLES,
} from '../utils/sandbox'
import { resetStageDemo, stageActiveId, stageBody } from '../utils/demo-stage'

type BrandName = (typeof brandOptions)[number]['name']

const props = withDefaults(
  defineProps<{
    /** 内边距：none 时内容贴边，用于整屏类组件（NavBar / Swipe 等） */
    padding?: 'normal' | 'none'
    /** 屏幕背景：card 白底、page 页面灰底、transparent 透出 */
    background?: 'card' | 'page' | 'transparent'
    /** 屏幕最大高度，超出后内部滚动 */
    maxHeight?: number
    /** 舞台模式：承接全页示例，高度锁定并对外暴露沙箱 body */
    stage?: boolean
  }>(),
  { padding: 'normal', background: 'card', maxHeight: 470, stage: false },
)

const { isDark } = useData()

const iframe = ref<HTMLIFrameElement | null>(null)
const sandboxDoc = shallowRef<Document | null>(null)
const bodyTarget = shallowRef<HTMLElement | null>(null)
const contentHeight = ref(160)

/** 手机内的主题与文档页独立，默认跟随文档页，可单独切换 */
const frameDark = ref(false)
const frameBrand = ref<BrandName>('default')
/** 递增即重新挂载演示内容，用于「重置」 */
const resetKey = ref(0)
const fullscreen = ref(false)

/** 已注入沙箱的演示 scoped hash，切换示例时只补新的 */
const injectedHashes = new Set<string>()
let demoStyleEl: HTMLStyleElement | null = null

let resizeObserver: ResizeObserver | null = null

watch(isDark, (v) => {
  frameDark.value = v
})

onMounted(async () => {
  frameDark.value = document.documentElement.classList.contains('dark')
  const brand = document.documentElement.dataset.brand as BrandName | undefined
  if (brand && brandOptions.some((b) => b.name === brand)) frameBrand.value = brand

  await nextTick()
  setupSandbox()

  // 开发环境下个别组件样式可能晚于首次收集，补一次
  setTimeout(() => {
    if (!collectVelaStyles()) setupSandbox()
  }, 400)

  window.addEventListener('keydown', onKeydown)
})

onBeforeUnmount(() => {
  window.removeEventListener('keydown', onKeydown)
  resizeObserver?.disconnect()
  document.body.style.overflow = ''
  detachPortal?.()
  setDefaultTeleportTarget('body')
  if (props.stage) stageBody.value = null
})

watch(fullscreen, (v) => {
  document.body.style.overflow = v ? 'hidden' : ''
})

function onKeydown(e: KeyboardEvent) {
  if (e.key === 'Escape' && fullscreen.value) fullscreen.value = false
}

/**
 * 建立沙箱文档：iframe 不加载任何外部资源，样式由父文档注入。
 * sandbox="allow-same-origin" 只授予同源读取权限，不放开脚本执行，
 * 因此沙箱内不会运行任何演示以外的东西。
 */
function setupSandbox() {
  const el = iframe.value
  const doc = el?.contentDocument
  if (!doc) return

  injectedHashes.clear()
  demoStyleEl = null

  doc.open()
  doc.write('<!doctype html><html><head><meta charset="utf-8"></head><body></body></html>')
  doc.close()

  const style = doc.createElement('style')
  style.dataset.vela = 'sandbox'
  style.textContent = `${SANDBOX_BASE_STYLES}\n${collectVelaStyles()}`
  doc.head.appendChild(style)

  sandboxDoc.value = doc
  applyTheme()
  applyBodyStyle()
  bodyTarget.value = doc.body
  if (props.stage) stageBody.value = doc.body
  bindPortalTarget(doc)

  nextTick(() => {
    observeHeight()
    syncHeight()
  })
}

let detachPortal: (() => void) | null = null

/**
 * 让弹层落进沙箱。
 *
 * Dialog / Toast / Popup 默认 Teleport 到 body，而 body 是宿主文档，
 * 弹层会盖在手机上而不是手机里。这里在沙箱内按下指针时把默认目标改成
 * 演示所在的容器（舞台模式下就是当前激活示例的包裹层）。
 */
function bindPortalTarget(doc: Document) {
  detachPortal?.()

  const onPointerDown = (event: Event) => {
    const target = event.target as Element | null
    const hold = target?.closest?.('.vl-demo-hold')
    setDefaultTeleportTarget((hold as HTMLElement | null) ?? doc.body)
  }

  doc.addEventListener('pointerdown', onPointerDown, true)
  detachPortal = () => doc.removeEventListener('pointerdown', onPointerDown, true)
}

function applyTheme(doc = sandboxDoc.value) {
  if (!doc) return
  doc.documentElement.dataset.theme = frameDark.value ? 'dark' : 'light'
  doc.documentElement.dataset.brand = frameBrand.value
  doc.documentElement.style.colorScheme = frameDark.value ? 'dark' : 'light'
}

function applyBodyStyle(doc = sandboxDoc.value) {
  if (!doc) return
  const bg =
    props.background === 'page'
      ? 'var(--vl-background)'
      : props.background === 'transparent'
        ? 'transparent'
        : 'var(--vl-background-2)'
  doc.body.style.padding = props.padding === 'none' ? '0' : '16px'
  doc.body.style.background = bg
}

watch([frameDark, frameBrand], () => applyTheme())
watch([() => props.padding, () => props.background], () => applyBodyStyle())

/** 舞台模式下示例切换：补注入新示例的样式，并把沙箱滚回顶部 */
watch(stageActiveId, async () => {
  if (!props.stage) return
  await nextTick()
  refreshDemoStyles()
  const doc = sandboxDoc.value
  if (doc) {
    doc.documentElement.scrollTop = 0
    doc.body.scrollTop = 0
  }
  // 新示例的内容可能分帧渲染，再补两次
  setTimeout(refreshDemoStyles, 60)
  setTimeout(refreshDemoStyles, 220)
})

/** 内容高度跟随内容变化，超出 maxHeight 后由沙箱内部滚动 */
function observeHeight() {
  const doc = sandboxDoc.value
  const win = doc?.defaultView
  if (!doc || !win || typeof win.ResizeObserver === 'undefined') return

  resizeObserver?.disconnect()
  resizeObserver = new win.ResizeObserver(() => syncHeight())
  resizeObserver.observe(doc.body)
}

/**
 * 注入演示自己的 scoped 样式。
 *
 * 演示是 Teleport 进 iframe 的，插进去之后才能从节点上读到 data-v-* 标记，
 * 所以这里等 body 有内容后再收集。舞台模式下多个示例共用一个沙箱，
 * 按 hash 增量补注入，切换示例时不会重复写入。
 */
function refreshDemoStyles() {
  const doc = sandboxDoc.value
  if (!doc || !doc.body.children.length) return

  const hashes = collectDemoHashes(doc.body).filter((h) => !injectedHashes.has(h))
  if (!hashes.length) return

  hashes.forEach((h) => injectedHashes.add(h))
  const css = collectStylesByHashes(hashes)
  if (!css) return

  if (!demoStyleEl) {
    demoStyleEl = doc.createElement('style')
    demoStyleEl.dataset.vela = 'demo'
    doc.head.appendChild(demoStyleEl)
  }
  demoStyleEl.textContent += `\n${css}`
}

function syncHeight() {
  const doc = sandboxDoc.value
  if (!doc) return
  refreshDemoStyles()
  if (props.stage) return
  contentHeight.value = doc.documentElement.scrollHeight
}

const frameHeight = computed(() => {
  if (fullscreen.value) return 'min(72vh, 720px)'
  const h = Math.max(84, Math.min(contentHeight.value || 84, props.maxHeight))
  return `${h}px`
})

const brandColor = (hue: number, saturation: string) => `hsl(${hue} ${saturation} 55%)`

function reset() {
  if (props.stage) {
    resetStageDemo()
    nextTick(() => setTimeout(refreshDemoStyles, 0))
    return
  }
  resetKey.value += 1
  nextTick(() => setTimeout(syncHeight, 0))
}

defineExpose({
  /** 供舞台在示例切换后立刻刷新一次样式 */
  refreshDemoStyles,
})
</script>

<template>
  <div :class="['mp', { 'mp--stage': stage }]">
    <!-- 工具条：换肤 / 明暗 / 重置 / 全屏，作用于沙箱内部，不影响文档站 -->
    <div class="mp__toolbar">
      <div class="mp__brands" role="group" aria-label="切换手机内主题色">
        <button
          v-for="b in brandOptions"
          :key="b.name"
          type="button"
          class="mp__brand"
          :class="{ 'is-active': frameBrand === b.name }"
          :style="{ '--brand-color': brandColor(b.hue, b.saturation) }"
          :title="b.label"
          :aria-label="b.label"
          @click="frameBrand = b.name"
        />
      </div>

      <div class="mp__tools">
        <span class="mp__hint">沙箱隔离 · 可直接点击</span>
        <button type="button" class="mp__btn" @click="frameDark = !frameDark">
          {{ frameDark ? '浅色' : '深色' }}
        </button>
        <button type="button" class="mp__btn" @click="reset">重置</button>
        <button type="button" class="mp__btn" @click="fullscreen = true">全屏</button>
      </div>
    </div>

    <div :class="['mp__stage', { 'mp__stage--fullscreen': fullscreen }]" @click.self="fullscreen = false">
      <button v-if="fullscreen" type="button" class="mp__close" @click="fullscreen = false">
        退出全屏
      </button>

      <div class="mp__device" :class="{ 'is-dark': frameDark, 'is-page': background === 'page' }">
        <div class="mp__bezel">
          <div class="mp__status">
            <span class="mp__clock">9:41</span>
            <span class="mp__notch" />
            <span class="mp__signals">
              <svg width="17" height="11" viewBox="0 0 17 11" aria-hidden="true">
                <rect x="0" y="7" width="3" height="4" rx="1" fill="currentColor" />
                <rect x="4.5" y="5" width="3" height="6" rx="1" fill="currentColor" />
                <rect x="9" y="2.5" width="3" height="8.5" rx="1" fill="currentColor" />
                <rect x="13.5" y="0" width="3" height="11" rx="1" fill="currentColor" opacity="0.35" />
              </svg>
              <svg width="16" height="11" viewBox="0 0 16 11" aria-hidden="true">
                <path
                  d="M8 10.2 5.6 7.6a3.6 3.6 0 0 1 4.8 0L8 10.2Zm-4.3-4.6-1.3-1.4a8.4 8.4 0 0 1 11.2 0l-1.3 1.4a6.4 6.4 0 0 0-8.6 0ZM.6 2.4 0 1.7a11.6 11.6 0 0 1 16 0l-.6.7a10.6 10.6 0 0 0-14.8 0Z"
                  fill="currentColor"
                />
              </svg>
              <svg width="25" height="12" viewBox="0 0 25 12" aria-hidden="true">
                <rect x="0.5" y="0.5" width="21" height="11" rx="3" fill="none" stroke="currentColor" stroke-opacity="0.4" />
                <rect x="2" y="2" width="16" height="8" rx="1.8" fill="currentColor" />
                <path d="M23 4.2v3.6a2 2 0 0 0 0-3.6Z" fill="currentColor" fill-opacity="0.5" />
              </svg>
            </span>
          </div>

          <iframe
            ref="iframe"
            class="mp__frame"
            :style="stage ? undefined : { height: frameHeight }"
            sandbox="allow-same-origin"
            title="组件交互预览"
          />

          <!-- 演示内容渲染进沙箱，与文档站 DOM / 样式完全隔离 -->
          <Teleport v-if="bodyTarget" :to="bodyTarget">
            <div :key="resetKey"><slot /></div>
          </Teleport>

          <div class="mp__home-bar"><span /></div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.mp {
  --mp-bezel: #14161d;
  --mp-bezel-edge: #2b2f3d;
  --mp-width: 360px;
  --mp-chrome-bg: #ffffff;
  --mp-chrome-fg: #1f2233;
}

/* 外壳的状态栏 / 指示条跟随沙箱背景，减少内外断层 */
.mp__device.is-page {
  --mp-chrome-bg: #f7f8fa;
}

.mp__device.is-dark {
  --mp-chrome-bg: #191c22;
  --mp-chrome-fg: #e9ebf0;
}

.mp__device.is-dark.is-page {
  --mp-chrome-bg: #0f1115;
}

/* ---------- 工具条 ---------- */
.mp__toolbar {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 12px;
}

.mp__brands {
  display: flex;
  gap: 8px;
  align-items: center;
  padding: 5px 9px;
  background: var(--vp-c-bg-soft);
  border: 1px solid var(--vp-c-divider);
  border-radius: 999px;
}

.mp__brand {
  position: relative;
  width: 16px;
  height: 16px;
  padding: 0;
  cursor: pointer;
  background: var(--brand-color);
  border: 0;
  border-radius: 50%;
  transition: transform 0.16s, box-shadow 0.16s;
}

.mp__brand:hover {
  transform: scale(1.12);
}

.mp__brand.is-active {
  box-shadow: 0 0 0 2px var(--vp-c-bg-soft), 0 0 0 4px var(--brand-color);
}

.mp__tools {
  display: flex;
  gap: 6px;
  align-items: center;
}

.mp__hint {
  margin-right: 2px;
  font-size: 11px;
  color: var(--vp-c-text-3);
}

.mp__btn {
  padding: 5px 10px;
  font-size: 12px;
  color: var(--vp-c-text-2);
  cursor: pointer;
  background: var(--vp-c-bg-soft);
  border: 1px solid var(--vp-c-divider);
  border-radius: 8px;
  transition: color 0.2s, border-color 0.2s, background 0.2s;
}

.mp__btn:hover {
  color: var(--vp-c-brand-1);
  background: var(--vp-c-bg);
  border-color: var(--vp-c-brand-2);
}

/* ---------- 设备外框 ---------- */
.mp__stage {
  display: flex;
  justify-content: center;
}

.mp__device {
  width: min(var(--mp-width), 100%);
  font-family: -apple-system, BlinkMacSystemFont, 'Helvetica Neue', 'PingFang SC', sans-serif;
  filter: drop-shadow(0 14px 34px rgba(16, 18, 26, 0.16));
}

.mp__bezel {
  position: relative;
  display: flex;
  flex-direction: column;
  padding: 9px;
  overflow: hidden;
  background: linear-gradient(160deg, var(--mp-bezel-edge), var(--mp-bezel) 42%);
  border-radius: 38px;
}

.mp__status {
  display: flex;
  flex-shrink: 0;
  align-items: center;
  justify-content: space-between;
  height: 30px;
  padding: 0 16px 0 20px;
  font-size: 13px;
  font-weight: 600;
  color: var(--mp-chrome-fg);
  background: var(--mp-chrome-bg);
  border-radius: 28px 28px 0 0;
}

.mp__notch {
  width: 74px;
  height: 16px;
  background: var(--mp-bezel);
  border-radius: 0 0 12px 12px;
}

.mp__clock {
  letter-spacing: 0.02em;
}

.mp__signals {
  display: inline-flex;
  gap: 4px;
  align-items: center;
  color: currentcolor;
}

.mp__frame {
  display: block;
  width: 100%;
  border: 0;
  background: transparent;
}

/* ---------- 舞台模式（文档右侧单例预览） ---------- */
.mp--stage {
  --mp-width: 100%;
}

/* 高度跟随视口锁定，示例切换时外框不跳动，内容在沙箱内部滚动 */
.mp--stage .mp__frame {
  height: clamp(340px, calc(100vh - 276px), 620px);
}

.mp--stage .mp__hint {
  display: none;
}

.mp--stage .mp__toolbar {
  gap: 8px;
  margin-bottom: 10px;
}

.mp--stage .mp__btn {
  padding: 4px 8px;
  font-size: 11px;
}

.mp--stage .mp__brands {
  gap: 7px;
  padding: 4px 8px;
}

.mp__home-bar {
  display: flex;
  flex-shrink: 0;
  justify-content: center;
  padding: 8px 0 4px;
  background: var(--mp-chrome-bg);
  border-radius: 0 0 28px 28px;
}

.mp__home-bar span {
  width: 108px;
  height: 4px;
  background: rgba(0, 0, 0, 0.18);
  border-radius: 999px;
}

.mp__device.is-dark .mp__home-bar span {
  background: rgba(255, 255, 255, 0.32);
}

/* ---------- 全屏 ---------- */
.mp__stage--fullscreen {
  position: fixed;
  inset: 0;
  z-index: 300;
  display: flex;
  flex-direction: column;
  gap: 16px;
  align-items: center;
  justify-content: center;
  padding: 40px 20px;
  background: rgba(12, 14, 20, 0.72);
  backdrop-filter: blur(6px);
}

.mp__stage--fullscreen .mp__device {
  width: min(384px, 100%);
}

.mp__close {
  position: absolute;
  top: 20px;
  right: 24px;
  padding: 8px 16px;
  font-size: 13px;
  color: #fff;
  cursor: pointer;
  background: rgba(255, 255, 255, 0.14);
  border: 1px solid rgba(255, 255, 255, 0.24);
  border-radius: 999px;
  transition: background 0.2s;
}

.mp__close:hover {
  background: rgba(255, 255, 255, 0.24);
}

@media (max-width: 640px) {
  .mp {
    --mp-width: 100%;
  }

  .mp__toolbar {
    justify-content: center;
  }

  .mp__hint {
    display: none;
  }

  .mp__status {
    height: 26px;
  }
}
</style>

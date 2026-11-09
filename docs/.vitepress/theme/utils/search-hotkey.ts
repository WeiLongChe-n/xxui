/**
 * 搜索快捷键兜底。
 *
 * VitePress 自带的搜索热键监听的是 `event.key === 'k'`，有两处会失效：
 *
 * 1. 中文输入法激活时，按字母键的 keydown 给的 `key` 是 `Process`，
 *    而不是 `k`，原生判断直接落空 —— 对中文用户几乎必现。
 * 2. 焦点落在右侧预览沙箱（iframe）里时，键盘事件只派发在沙箱文档内，
 *    主文档的监听收不到，搜一下就完全没反应。
 *
 * 这里统一改看物理键位 `event.code === 'KeyK'`，再派发一个规范化的
 * 合成事件交给 VitePress 处理，两条路径就都能打开搜索框。
 */

const isMac = () => /Mac|iPhone|iPad/.test(navigator.platform || navigator.userAgent)

/** 组合键 + K：优先看物理键位，兼容输入法把 key 变成 Process 的情况 */
export function isSearchHotkey(event: KeyboardEvent) {
  if (!(event.ctrlKey || event.metaKey)) return false
  if (event.altKey || event.shiftKey) return false
  return event.code === 'KeyK' || event.key?.toLowerCase() === 'k'
}

/** 只有未聚焦可编辑元素时，`/` 才当作搜索热键 */
function isEditingContent(target: EventTarget | null) {
  const el = target as HTMLElement | null
  if (!el || typeof el.tagName !== 'string') return false
  const tag = el.tagName.toUpperCase()
  return tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT' || el.isContentEditable
}

export function isSearchOpen() {
  return !!document.querySelector('.VPLocalSearchBox')
}

/**
 * 派发规范化事件唤醒 VitePress 的搜索。
 *
 * 清空修饰键状态会让 VitePress 认为只是普通按键，所以这里保持
 * ctrl/meta 与当前平台一致，只把 `key` 修正成 `k`。
 */
export function openSearch() {
  if (isSearchOpen()) return
  const EventCtor = window.KeyboardEvent
  window.dispatchEvent(
    new EventCtor('keydown', {
      key: 'k',
      code: 'KeyK',
      ctrlKey: !isMac(),
      metaKey: isMac(),
      bubbles: true,
      cancelable: true,
    }),
  )
}

/**
 * 在指定文档上挂热键转发。
 *
 * 沙箱 iframe 有自己独立的文档，主文档的监听永远收不到里面的按键，
 * 所以要在沙箱文档上再挂一份，把 Ctrl/Cmd+K 与 `/` 转发回宿主窗口。
 */
export function bindSearchHotkey(doc: Document, options: { forwardSlash?: boolean } = {}) {
  const handler = (event: KeyboardEvent) => {
    if (isSearchHotkey(event)) {
      // 阻止浏览器自身的 Ctrl+K（地址栏搜索）
      event.preventDefault()
      openSearch()
      return
    }
    if (options.forwardSlash && event.key === '/' && !isEditingContent(event.target)) {
      event.preventDefault()
      openSearch()
    }
  }

  doc.addEventListener('keydown', handler, true)
  return () => doc.removeEventListener('keydown', handler, true)
}

/**
 * 主文档守卫：只接管 VitePress 自己处理不了的情况。
 *
 * 输入法把 key 变成 `Process` 时原生监听会失效，需要在这里补一次；
 * 正常按下 `k` 时直接放行，避免和 VitePress 重复打开。
 */
export function installSearchHotkeyGuard() {
  const handler = (event: KeyboardEvent) => {
    if (!isSearchHotkey(event)) return
    // 原生能识别，交给 VitePress，避免重复触发
    if (event.key?.toLowerCase() === 'k') return
    event.preventDefault()
    openSearch()
  }

  window.addEventListener('keydown', handler, true)
  return () => window.removeEventListener('keydown', handler, true)
}

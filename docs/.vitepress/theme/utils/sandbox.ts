/**
 * 沙箱样式收集
 *
 * 演示内容渲染在 iframe 里，与文档站样式天然隔离。
 * 但组件库的样式需要显式注入沙箱，这里从父文档的样式表中筛选出
 * 只属于组件库的规则（`.vl-*` 选择器、`--vl-*` 令牌、`vl-*` 关键帧），
 * 拼成一份可直接写入 iframe 的样式表。
 *
 * 之所以不用「整份 CSS 都拷进去」：那样文档站样式会一起进去，
 * 隔离就失去意义了。
 */

let cached: string | null = null

const VL_CLASS = /\.vl-[a-zA-Z]/
const VL_TOKEN_DECL = /--vl-[a-z]/
/** 令牌块：:root / [data-theme] / [data-brand] */
const TOKEN_SELECTOR = /^(\[data-theme|\[data-brand|:root)/

function isVelaRule(rule: CSSStyleRule) {
  const sel = rule.selectorText || ''
  if (VL_CLASS.test(sel)) return true
  if (TOKEN_SELECTOR.test(sel.trim()) && VL_TOKEN_DECL.test(rule.cssText)) return true
  return false
}

function walk(rules: CSSRuleList, out: string[]) {
  for (const rule of Array.from(rules)) {
    if (rule instanceof CSSStyleRule) {
      if (isVelaRule(rule)) out.push(rule.cssText)
    } else if (rule instanceof CSSMediaRule) {
      const inner: string[] = []
      walk(rule.cssRules, inner)
      if (inner.length) out.push(`@media ${rule.conditionText}{${inner.join('')}}`)
    } else if (rule instanceof CSSKeyframesRule) {
      if (rule.name.startsWith('vl-')) out.push(rule.cssText)
    }
  }
}

/** 收集组件库样式；结果做缓存，多台设备共用一份 */
export function collectVelaStyles() {
  if (cached !== null) return cached

  const out: string[] = []
  for (const sheet of Array.from(document.styleSheets)) {
    let rules: CSSRuleList
    try {
      rules = sheet.cssRules
    } catch {
      // 跨域样式表读不到规则，跳过
      continue
    }
    if (!rules) continue
    walk(rules, out)
  }

  cached = out.join('\n')
  return cached
}

/** 沙箱内部的基础样式：复位 + 演示辅助类（不依赖文档站 CSS） */
export const SANDBOX_BASE_STYLES = `
*, *::before, *::after { box-sizing: border-box; }
html, body { margin: 0; padding: 0; }
body {
  font-family: var(--vl-font-family, -apple-system, BlinkMacSystemFont, 'PingFang SC', sans-serif);
  font-size: var(--vl-font-size, 14px);
  color: var(--vl-text-color, #1f2233);
  background: var(--vl-background-2, #fff);
  -webkit-font-smoothing: antialiased;
  overflow-x: hidden;
  overflow-y: auto;
  overscroll-behavior: contain;
}
body::-webkit-scrollbar { width: 3px; }
body::-webkit-scrollbar-thumb { background: var(--vl-border-color, #ebedf0); border-radius: 3px; }
.demo-row { display: flex; flex-wrap: wrap; gap: 12px; align-items: center; }
.demo-col { display: flex; flex-direction: column; gap: 12px; }
.demo-label { margin: 0 0 8px; font-size: 12px; color: var(--vl-text-color-3, #9699a6); }
.demo-note { margin: 8px 0 0; font-size: 12px; color: var(--vl-text-color-3, #9699a6); }
`

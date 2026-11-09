/**
 * 沙箱样式收集
 *
 * 演示内容渲染在 iframe 里，与文档站样式天然隔离。
 * 但组件库的样式需要显式注入沙箱，这里从父文档的样式表中筛选出
 * 只属于组件库的规则（`.x-*` 选择器、`--x-*` 令牌、`x-*` 关键帧），
 * 拼成一份可直接写入 iframe 的样式表。
 *
 * 之所以不用「整份 CSS 都拷进去」：那样文档站样式会一起进去，
 * 隔离就失去意义了。
 */

let cached: string | null = null

const LIB_CLASS = /\.x-[a-zA-Z]/
const LIB_TOKEN_DECL = /--x-[a-z]/
/** 令牌块：:root / [data-theme] / [data-brand] */
const TOKEN_SELECTOR = /^(\[data-theme|\[data-brand|:root)/

function isLibRule(selector: string, cssText: string) {
  if (LIB_CLASS.test(selector)) return true
  if (TOKEN_SELECTOR.test(selector.trim()) && LIB_TOKEN_DECL.test(cssText)) return true
  return false
}

interface FlatRule {
  selector: string
  css: string
}

/** 把声明块序列化成文本，嵌套声明合并时用 */
function declarationText(style: CSSStyleDeclaration) {
  return Array.from(style)
    .map((prop) => `${prop}:${style.getPropertyValue(prop)}`)
    .join(';')
}

/** 拼接父子选择器：子选择器带 `&` 时替换，否则按后代选择器连接 */
function joinSelector(parent: string, child: string) {
  return child.includes('&') ? child.replace(/&/g, parent) : `${parent} ${child}`
}

/**
 * 展开规则。
 *
 * 演示的 `<style scoped>` 里一旦用了嵌套写法，浏览器保留的是嵌套结构：
 * 外层 `selectorText` 只有 `.preview-demo__item`，`[data-v-xxx]` 挂在子选择器上。
 * 按 hash 匹配时外层就永远匹配不上，整条规则会连着子规则一起丢掉，
 * 所以这里先扁平化，再交给调用方按选择器筛选。
 *
 * 没有嵌套的规则原样返回 `cssText`，避免把简写拆成 longhand 让样式体积翻倍。
 */
function flattenRule(rule: CSSStyleRule, parent = ''): FlatRule[] {
  const nested = Array.from(rule.cssRules ?? [])

  if (!parent && !nested.length) {
    return [{ selector: rule.selectorText || '', css: rule.cssText }]
  }

  const selector = parent ? joinSelector(parent, rule.selectorText || '') : rule.selectorText || ''
  const out: FlatRule[] = []

  const own = declarationText(rule.style)
  if (own) out.push({ selector, css: `${selector}{${own}}` })

  // CSSNestedDeclarations：嵌套块里直接写的声明，归到当前选择器
  let loose = ''
  for (const child of nested) {
    if (child instanceof CSSStyleRule && child.selectorText) {
      out.push(...flattenRule(child, selector))
      continue
    }
    const style = (child as CSSStyleRule).style
    if (style) {
      const text = declarationText(style)
      if (text) loose += (loose ? ';' : '') + text
    }
  }
  if (loose) out.push({ selector, css: `${selector}{${loose}}` })

  return out
}

function walk(
  rules: CSSRuleList,
  out: string[],
  match: (selector: string, cssText: string) => boolean,
  keepKeyframes: (name: string, cssText: string) => boolean = () => false,
) {
  for (const rule of Array.from(rules)) {
    if (rule instanceof CSSStyleRule) {
      for (const flat of flattenRule(rule)) {
        if (match(flat.selector, flat.css)) out.push(flat.css)
      }
    } else if (rule instanceof CSSMediaRule) {
      const inner: string[] = []
      walk(rule.cssRules, inner, match, keepKeyframes)
      if (inner.length) out.push(`@media ${rule.conditionText}{${inner.join('')}}`)
    } else if (rule instanceof CSSKeyframesRule) {
      if (keepKeyframes(rule.name, rule.cssText)) out.push(rule.cssText)
    }
  }
}

/** 收集组件库样式；结果做缓存，多台设备共用一份 */
export function collectXXUIStyles() {
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
    walk(rules, out, isLibRule, (name) => name.startsWith('x-'))
  }

  cached = out.join('\n')
  return cached
}

/**
 * 收集「演示自己的样式」。
 *
 * 演示内容通过 Teleport 直接写进 iframe，父文档里没有对应节点，
 * 因此没法按 DOM 结构定位它的 <style>。但 Vue 的 scoped 样式会给选择器
 * 加上 `[data-v-xxxx]`，而演示节点上带着同名属性 —— 拿 iframe 里实际出现的
 * hash 去父文档样式表中反查，就能精确取出这个演示的规则，
 * 不会把文档站样式一起带进沙箱。
 */
export function collectDemoStyles(root: Element | null) {
  return collectStylesByHashes(collectDemoHashes(root))
}

/** 读出一个节点树里出现的 scoped hash 列表 */
export function collectDemoHashes(root: Element | null): string[] {
  if (!root) return []

  const hashes = new Set<string>()
  const add = (el: Element) => {
    for (const attr of Array.from(el.attributes)) {
      if (attr.name.startsWith('data-v-')) hashes.add(attr.name)
    }
  }
  add(root)
  root.querySelectorAll('*').forEach(add)
  return Array.from(hashes)
}

/** 按 hash 精确取出对应规则，多个示例可以增量注入、互不重复 */
export function collectStylesByHashes(hashes: string[]): string {
  if (!hashes.length) return ''

  const out: string[] = []
  for (const sheet of Array.from(document.styleSheets)) {
    let rules: CSSRuleList
    try {
      rules = sheet.cssRules
    } catch {
      continue
    }
    if (!rules) continue
    walk(
      rules,
      out,
      (selector) => hashes.some((h) => selector.includes(`[${h}]`)),
      (name, cssText) => hashes.some((h) => name.includes(h) || cssText.includes(h)),
    )
  }

  return out.join('\n')
}

/** 沙箱内部的基础样式：复位 + 演示辅助类（不依赖文档站 CSS） */
export const SANDBOX_BASE_STYLES = `
*, *::before, *::after { box-sizing: border-box; }
html, body { margin: 0; padding: 0; }
body {
  font-family: var(--x-font-family, -apple-system, BlinkMacSystemFont, 'PingFang SC', sans-serif);
  font-size: var(--x-font-size, 14px);
  color: var(--x-text-color, #1f2233);
  background: var(--x-background-2, #fff);
  -webkit-font-smoothing: antialiased;
  overflow-x: hidden;
  overflow-y: auto;
  overscroll-behavior: contain;
  scrollbar-width: none;
  -ms-overflow-style: none;
}
body::-webkit-scrollbar { display: none; width: 0; height: 0; }
.demo-row { display: flex; flex-wrap: wrap; gap: 12px; align-items: center; }
.demo-col { display: flex; flex-direction: column; gap: 12px; }
.demo-label { margin: 0 0 8px; font-size: 12px; color: var(--x-text-color-3, #9699a6); }
.demo-note { margin: 8px 0 0; font-size: 12px; color: var(--x-text-color-3, #9699a6); }

/* 右侧舞台：多个示例都挂在同一个沙箱里，只显示当前激活的那个 */
.x-demo-hold { display: none; }
.x-demo-hold.is-active { display: block; }
`

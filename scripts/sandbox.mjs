/**
 * 沙箱预览自检：确认演示内容确实渲染在 iframe 内，
 * 且交互（指针拖拽、点击、明暗切换）在沙箱自己的 window 上生效。
 * 用法：node scripts/sandbox.mjs
 */
import puppeteer from 'puppeteer-core'

const CHROME = process.env.CHROME || 'C:/Program Files/Google/Chrome/Application/chrome.exe'
const BASE = process.env.BASE || 'http://localhost:5173'

const browser = await puppeteer.launch({
  executablePath: CHROME,
  headless: 'new',
  args: ['--no-sandbox', '--disable-dev-shm-usage'],
})
const page = await browser.newPage()
await page.setViewport({ width: 1440, height: 1000 })

const results = []
const record = (name, ok, detail = '') => {
  results.push({ name, ok, detail })
  console.log(`${ok ? '✓' : '✗'} ${name}${detail ? ' — ' + detail : ''}`)
}

async function goto(path) {
  await page.goto(BASE + path, { waitUntil: 'networkidle2', timeout: 45000 })
  await new Promise((r) => setTimeout(r, 900))
  const handle = await page.$('.mp__frame')
  if (!handle) return null
  const frame = await handle.contentFrame()
  await new Promise((r) => setTimeout(r, 300))
  return frame
}

// 1. Slider：在沙箱内用指针事件拖拽
{
  const frame = await goto('/components/slider')
  record('slider: 沙箱 iframe 存在', !!frame)
  if (frame) {
    const before = await frame.evaluate(() => document.body.innerText.replace(/\s+/g, ' '))
    record('slider: 内容已注入沙箱', before.includes('音量'), before.slice(0, 40))

    const changed = await frame.evaluate(() => {
      const track = document.querySelector('.x-slider__track')
      const handle = document.querySelector('.x-slider__button-wrap')
      if (!track || !handle) return 'no-track'
      const r = track.getBoundingClientRect()
      const win = document.defaultView
      const opts = { bubbles: true, pointerId: 1, pointerType: 'mouse' }
      handle.dispatchEvent(new PointerEvent('pointerdown', { ...opts, clientX: r.left + 4 }))
      win.dispatchEvent(new PointerEvent('pointermove', { ...opts, clientX: r.left + r.width * 0.82 }))
      win.dispatchEvent(new PointerEvent('pointerup', opts))
      return 'dispatched'
    })
    await new Promise((r) => setTimeout(r, 200))
    const after = await frame.evaluate(() => document.body.innerText.replace(/\s+/g, ' '))
    const nums = (s) => (s.match(/\b\d+\b/g) || []).join(',')
    record(
      'slider: 拖拽在沙箱 window 上生效',
      changed === 'dispatched' && nums(before) !== nums(after),
      `${nums(before)} → ${nums(after)}`,
    )
  }
}

// 2. Tabs：点击切换
{
  const frame = await goto('/components/tabs')
  if (frame) {
    const ok = await frame.evaluate(() => {
      const items = [...document.querySelectorAll('.x-tabs__nav-item')]
      const target = items.find((el) => el.textContent.includes('关注'))
      if (!target) return 'no-tab'
      target.click()
      return 'clicked'
    })
    await new Promise((r) => setTimeout(r, 300))
    const active = await frame.evaluate(() => {
      // 页面里有多组 Tabs，只关心被点击的那一组
      return [...document.querySelectorAll('.x-tabs__nav-item--active')]
        .map((el) => el.textContent.trim())
        .join('|')
    })
    record('tabs: 点击切换生效', ok === 'clicked' && active.includes('关注'), `active=${active}`)
  }
}

// 3. 明暗开关只作用于沙箱
{
  const frame = await goto('/components/cell')
  if (frame) {
    const beforeBg = await frame.evaluate(() => getComputedStyle(document.body).backgroundColor)
    const pageBefore = await page.evaluate(() => getComputedStyle(document.body).backgroundColor)
    await page.evaluate(() => {
      const btn = [...document.querySelectorAll('.mp__btn')].find((b) => b.textContent.includes('深色'))
      btn?.click()
    })
    await new Promise((r) => setTimeout(r, 400))
    const afterBg = await frame.evaluate(() => getComputedStyle(document.body).backgroundColor)
    const pageAfter = await page.evaluate(() => getComputedStyle(document.body).backgroundColor)
    const themeAttr = await frame.evaluate(() => document.documentElement.dataset.theme)
    record('cell: 沙箱内切换为深色', themeAttr === 'dark' && beforeBg !== afterBg, `${beforeBg} → ${afterBg}`)
    record('cell: 文档站背景不受影响', pageBefore === pageAfter, `${pageBefore} / ${pageAfter}`)
  }
}

// 4. 样式隔离：文档站样式不应进入沙箱
{
  const frame = await goto('/components/button')
  if (frame) {
    const leaked = await frame.evaluate(() => {
      const el = document.querySelector('.demo-block, .VPDoc, .vp-doc')
      const vpVar = getComputedStyle(document.documentElement).getPropertyValue('--vp-c-brand-1').trim()
      return { docNodes: !!el, vpVar: vpVar || '(empty)' }
    })
    record('button: 沙箱内不存在文档站节点', !leaked.docNodes)
    record('button: 沙箱内无 --vp-* 令牌', leaked.vpVar === '(empty)', leaked.vpVar)
    const vlVar = await frame.evaluate(() =>
      getComputedStyle(document.documentElement).getPropertyValue('--x-primary').trim(),
    )
    record('button: 组件库令牌已注入', vlVar.length > 0, vlVar)
  }
}

await browser.close()

const failed = results.filter((r) => !r.ok)
console.log(`\n共 ${results.length} 项，失败 ${failed.length} 项`)
if (failed.length) process.exit(1)

/**
 * 单元素截图 + 尺寸测量，用于核对局部排版（对齐、溢出、高度不一致）。
 * 用法：node scripts/clip.mjs <url> <selector> <out.png> [宽度]
 *      DARK=1 node scripts/clip.mjs ...   以暗色模式与 ocean 品牌打开
 */
import puppeteer from 'puppeteer-core'

const CHROME = process.env.CHROME || 'C:/Program Files/Google/Chrome/Application/chrome.exe'
const url = process.argv[2]
const sel = process.argv[3]
const out = process.argv[4]
const width = Number(process.argv[5] || 1440)
const dark = process.env.DARK === '1'

if (!url || !sel || !out) {
  console.log('用法: node scripts/clip.mjs <url> <selector> <out.png> [宽度]')
  process.exit(1)
}

const browser = await puppeteer.launch({
  executablePath: CHROME,
  headless: 'new',
  args: ['--no-sandbox', '--disable-dev-shm-usage', '--force-device-scale-factor=2'],
})
const page = await browser.newPage()
await page.setViewport({ width, height: 1000, deviceScaleFactor: 2 })

if (dark) {
  await page.evaluateOnNewDocument(() => {
    localStorage.setItem('vitepress-theme-appearance', 'dark')
    localStorage.setItem('xxui-theme', JSON.stringify({ mode: 'dark', brand: 'ocean' }))
  })
}

await page.goto(url, { waitUntil: 'networkidle2', timeout: 45000 })
await new Promise((r) => setTimeout(r, 800))

const el = await page.$(sel)
if (!el) {
  console.log('NOT FOUND', sel)
  await browser.close()
  process.exit(1)
}
await el.screenshot({ path: out })

// 测量自身与直接子元素的尺寸，找出溢出与高度不齐
const report = await page.evaluate((s) => {
  const root = document.querySelector(s)
  const describe = (n) => {
    const r = n.getBoundingClientRect()
    const cs = getComputedStyle(n)
    return {
      tag: n.tagName.toLowerCase(),
      cls: n.className && typeof n.className === 'string' ? n.className : '',
      w: +r.width.toFixed(1),
      h: +r.height.toFixed(1),
      top: +r.top.toFixed(1),
      overflowX: n.scrollWidth > n.clientWidth + 1 ? `${n.scrollWidth}>${n.clientWidth}` : null,
      overflowY: n.scrollHeight > n.clientHeight + 1 ? `${n.scrollHeight}>${n.clientHeight}` : null,
      textOverflow: cs.textOverflow,
    }
  }
  return {
    box: describe(root),
    children: [...root.children].map(describe),
  }
}, sel)

console.log(JSON.stringify(report, null, 2))
await browser.close()

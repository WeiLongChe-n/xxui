/**
 * 站内链接巡检：从首页出发广度优先爬取所有站内链接，报告 >=400 的页面。
 * 用法：node scripts/check404.mjs        （默认 http://localhost:5173）
 *      BASE=http://localhost:4173 node scripts/check404.mjs
 */
import puppeteer from 'puppeteer-core'

const CHROME = process.env.CHROME || 'C:/Program Files/Google/Chrome/Application/chrome.exe'
const BASE = process.env.BASE || 'http://localhost:5173'
const LIMIT = Number(process.env.LIMIT || 300)

const browser = await puppeteer.launch({
  executablePath: CHROME,
  headless: 'new',
  args: ['--no-sandbox', '--disable-dev-shm-usage'],
})
const page = await browser.newPage()
await page.setViewport({ width: 1440, height: 900 })

const seen = new Set()
const queue = ['/']
const bad = []

while (queue.length && seen.size < LIMIT) {
  const path = queue.shift()
  if (seen.has(path)) continue
  seen.add(path)

  try {
    const res = await page.goto(BASE + path, { waitUntil: 'networkidle2', timeout: 45000 })
    const status = res ? res.status() : 0
    if (status >= 400) {
      bad.push({ path, status })
      console.log('  ✗', status, path)
      continue
    }
    console.log('  ✓', status, path)
  } catch (err) {
    bad.push({ path, status: 'error', reason: err.message })
    console.log('  ✗ ERR', path)
    continue
  }

  // 开发服务器下导航由客户端渲染，等链接出现后再采集
  await page.waitForSelector('a[href^="/"]', { timeout: 10000 }).catch(() => {})

  const links = await page.evaluate(() =>
    [...document.querySelectorAll('a[href]')].map((a) => a.getAttribute('href')),
  )
  for (const href of links) {
    if (!href || !href.startsWith('/')) continue
    const clean = href.split('#')[0].split('?')[0]
    if (!clean || clean === path) continue
    if (/\.(png|jpe?g|svg|ico|gif|webp|zip|pdf|txt)$/i.test(clean)) continue
    if (!seen.has(clean) && !queue.includes(clean)) queue.push(clean)
  }
}

await browser.close()

console.log(`\n共检查 ${seen.size} 个页面，异常 ${bad.length} 个`)
if (bad.length) {
  console.log(JSON.stringify(bad, null, 2))
  process.exit(1)
}

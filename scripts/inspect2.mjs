import puppeteer from 'puppeteer-core'
const browser = await puppeteer.launch({ executablePath: 'C:/Program Files/Google/Chrome/Application/chrome.exe', headless: 'new', args:['--no-sandbox'] })
const page = await browser.newPage()
await page.setViewport({ width: 1400, height: 900 })
await page.goto('http://localhost:5173/components/cell', { waitUntil: 'networkidle2' })
await new Promise(r=>setTimeout(r,500))
await page.evaluate(() => {
  document.querySelector('.theme-switcher__trigger')?.dispatchEvent(new MouseEvent('click', { bubbles: true }))
})
await new Promise(r=>setTimeout(r,300))
await page.evaluate(() => {
  ;[...document.querySelectorAll('.theme-switcher__mode')].find(b=>b.textContent.trim()==='深色')?.click()
})
await new Promise(r=>setTimeout(r,600))
const info = await page.evaluate(() => {
  const pick = (sel) => {
    const el = document.querySelector(sel)
    if (!el) return null
    const s = getComputedStyle(el)
    return { bg: s.backgroundColor, color: s.color }
  }
  return {
    htmlClass: document.documentElement.className,
    dataTheme: document.documentElement.dataset.theme,
    vpBgVar: getComputedStyle(document.documentElement).getPropertyValue('--vp-c-bg'),
    body: pick('body'),
    doc: pick('.VPDoc'),
    demo: pick('.demo-block'),
    header: pick('.demo-block__header'),
    demoBody: pick('.demo-block__body'),
    cell: pick('.vl-cell'),
    cellTitle: (() => { const el = document.querySelector('.vl-cell__title'); return el ? getComputedStyle(el).color : null })(),
  }
})
console.log(JSON.stringify(info, null, 2))
await browser.close()

import puppeteer from 'puppeteer-core'
const browser = await puppeteer.launch({ executablePath: 'C:/Program Files/Google/Chrome/Application/chrome.exe', headless: 'new', args:['--no-sandbox'] })
const page = await browser.newPage()
await page.goto('http://localhost:5173/components/tabs', { waitUntil: 'networkidle2' })
await new Promise(r=>setTimeout(r,800))
const info = await page.evaluate(() => {
  const navs = [...document.querySelectorAll('.demo-block__body .x-tabs__nav')]
  return navs.map(nav => ({
    cls: nav.className,
    html: nav.outerHTML.slice(0, 260),
    itemStyle: (() => { const i = nav.querySelector('.x-tabs__nav-item'); if(!i) return null; const s = getComputedStyle(i); return { bg: s.backgroundColor, pad: s.padding, radius: s.borderRadius } })()
  }))
})
console.log(JSON.stringify(info, null, 2))
await browser.close()

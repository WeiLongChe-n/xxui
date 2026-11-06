import puppeteer from 'puppeteer-core'
import fs from 'node:fs'

const CHROME = 'C:/Program Files/Google/Chrome/Application/chrome.exe'
const BASE = process.env.BASE || 'http://localhost:5173'
const outDir = process.env.OUT || './.shots'
fs.mkdirSync(outDir, { recursive: true })

const pages = JSON.parse(process.env.PAGES || '[]')
const mobile = process.env.MOBILE === '1'
const dark = process.env.DARK === '1'

const browser = await puppeteer.launch({
  executablePath: CHROME,
  headless: 'new',
  args: ['--no-sandbox', '--disable-dev-shm-usage', '--force-device-scale-factor=1'],
})

const page = await browser.newPage()
await page.setViewport(
  mobile ? { width: 390, height: 844, deviceScaleFactor: 2, isMobile: true, hasTouch: true } : { width: 1440, height: 1000, deviceScaleFactor: 1 },
)

const errors = []
page.on('console', (msg) => {
  if (msg.type() === 'error') errors.push(`[console] ${msg.text()}`)
})
page.on('pageerror', (err) => errors.push(`[pageerror] ${err.message}`))

if (dark) {
  await page.evaluateOnNewDocument(() => {
    localStorage.setItem('vitepress-theme-appearance', 'dark')
    localStorage.setItem('xxui-theme', JSON.stringify({ mode: 'dark', brand: 'ocean' }))
  })
}

for (const item of pages) {
  const [path, name] = Array.isArray(item) ? item : [item, item.replace(/\W+/g, '_')]
  await page.goto(BASE + path, { waitUntil: 'networkidle2', timeout: 60000 })
  await new Promise((r) => setTimeout(r, 900))
  await page.screenshot({ path: `${outDir}/${name}.png`, fullPage: process.env.FULL !== '1' ? false : true })
  console.log('shot', path)
}

if (errors.length) {
  console.log('ERRORS:\n' + [...new Set(errors)].join('\n'))
} else {
  console.log('NO CONSOLE ERRORS')
}

await browser.close()

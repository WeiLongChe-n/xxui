import puppeteer from 'puppeteer-core'
import fs from 'node:fs'

const CHROME = 'C:/Program Files/Google/Chrome/Application/chrome.exe'
const BASE = 'http://localhost:5173'
fs.mkdirSync('./.shots', { recursive: true })

const browser = await puppeteer.launch({
  executablePath: CHROME,
  headless: 'new',
  args: ['--no-sandbox', '--disable-dev-shm-usage'],
})

const page = await browser.newPage()
await page.setViewport({ width: 1440, height: 1000 })
const errors = []
page.on('console', (m) => m.type() === 'error' && errors.push(m.text()))
page.on('pageerror', (e) => errors.push('pageerror: ' + e.message))

const wait = (ms) => new Promise((r) => setTimeout(r, ms))

const clickButtonByText = async (text) => {
  const clicked = await page.evaluate((label) => {
    const buttons = [...document.querySelectorAll('button, .x-button')]
    const target = buttons.find((el) => el.textContent?.trim().includes(label))
    if (target) {
      target.click()
      return true
    }
    return false
  }, text)
  return clicked
}

// Dialog
await page.goto(BASE + '/components/dialog', { waitUntil: 'networkidle2' })
await wait(600)
console.log('dialog click', await clickButtonByText('确认对话框'))
await wait(600)
await page.screenshot({ path: './.shots/dialog-open.png' })

// ActionSheet
await page.goto(BASE + '/components/action-sheet', { waitUntil: 'networkidle2' })
await wait(600)
console.log('sheet click', await clickButtonByText('带标题描述'))
await wait(700)
await page.screenshot({ path: './.shots/action-sheet-open.png' })

// Popup
await page.goto(BASE + '/components/popup', { waitUntil: 'networkidle2' })
await wait(600)
console.log('popup click', await clickButtonByText('底部弹出'))
await wait(700)
await page.screenshot({ path: './.shots/popup-open.png' })

// Toast
await page.goto(BASE + '/components/toast', { waitUntil: 'networkidle2' })
await wait(600)
console.log('toast click', await clickButtonByText('成功'))
await wait(300)
await page.screenshot({ path: './.shots/toast-open.png' })

// Dark mode via theme switcher
await page.goto(BASE + '/components/cell', { waitUntil: 'networkidle2' })
await wait(600)
await page.evaluate(() => {
  const trigger = document.querySelector('.theme-switcher__trigger')
  trigger?.dispatchEvent(new MouseEvent('click', { bubbles: true }))
})
await wait(400)
const darkClicked = await page.evaluate(() => {
  const buttons = [...document.querySelectorAll('.theme-switcher__mode')]
  const target = buttons.find((b) => b.textContent?.trim() === '深色')
  target?.click()
  return !!target
})
console.log('dark toggle', darkClicked)
await wait(500)
await page.evaluate(() => document.querySelector('.theme-switcher__trigger')?.dispatchEvent(new MouseEvent('click', { bubbles: true })))
await page.screenshot({ path: './.shots/dark-cell.png' })

// mobile viewport check of a component page
await page.setViewport({ width: 390, height: 844, deviceScaleFactor: 2, isMobile: true, hasTouch: true })
await page.goto(BASE + '/components/form', { waitUntil: 'networkidle2' })
await wait(700)
await page.screenshot({ path: './.shots/mobile-form.png', fullPage: false })

console.log(errors.length ? 'ERRORS:\n' + [...new Set(errors)].join('\n') : 'NO CONSOLE ERRORS')
await browser.close()

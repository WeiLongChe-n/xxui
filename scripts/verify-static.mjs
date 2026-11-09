/**
 * 静态产物自检：确认 HTML 里所有带 base 前缀的绝对路径都能在磁盘上找到对应文件。
 * 用于部署前发现缺失的 favicon、图片、字体与脚本。
 *
 * 用法：node scripts/verify-static.mjs [产物目录] [base]
 *      node scripts/verify-static.mjs docs/.vitepress/dist xxui
 *
 * 注意：base 请传不带斜杠的仓库名（如 xxui），脚本会自行补成 /xxui/。
 * 在 Git Bash 下直接传 /xxui/ 会被 MSYS 当成路径做转换。
 */
import fs from 'node:fs'
import path from 'node:path'

const dir = path.resolve(process.argv[2] || 'docs/.vitepress/dist')
const rawBase = (process.argv[3] || '').replace(/^\/+|\/+$/g, '')
const base = rawBase ? `/${rawBase}/` : '/'

if (!fs.existsSync(dir)) {
  console.error('产物目录不存在:', dir)
  process.exit(1)
}

const walk = (d) =>
  fs.readdirSync(d, { withFileTypes: true }).flatMap((e) => {
    const p = path.join(d, e.name)
    return e.isDirectory() ? walk(p) : [p]
  })

const htmlFiles = walk(dir).filter((f) => f.endsWith('.html'))
const missing = new Map()
const checked = new Set()

for (const file of htmlFiles) {
  const html = fs.readFileSync(file, 'utf8')
  const urls = [...html.matchAll(/(?:href|src)="([^"]+)"/g)].map((m) => m[1])
  for (const url of urls) {
    if (!url.startsWith(base)) continue
    if (url.startsWith('//')) continue
    const clean = decodeURI(url.slice(base.length).split('#')[0].split('?')[0])
    if (!clean) continue
    if (checked.has(clean)) continue
    checked.add(clean)

    const target = path.join(dir, clean)
    const ok = fs.existsSync(target) && fs.statSync(target).isFile()
    if (!ok) {
      const page = path.relative(dir, file).replace(/\\/g, '/')
      if (!missing.has(clean)) missing.set(clean, [])
      missing.get(clean).push(page)
    }
  }
}

console.log(`扫描 ${htmlFiles.length} 个 HTML，检查 ${checked.size} 个引用`)

if (missing.size) {
  console.log(`\n发现 ${missing.size} 个缺失资源：`)
  for (const [asset, pages] of missing) {
    console.log(`  ✗ ${base}${asset}  ← ${pages.slice(0, 3).join(', ')}${pages.length > 3 ? ` 等 ${pages.length} 页` : ''}`)
  }
  process.exit(1)
}

console.log('✓ 所有引用均存在')

/**
 * 生成内置省市区数据（三级）。
 *
 * 数据源：china-area-data（仅作为开发依赖，不进产物）
 * 输出：packages/mobile-ui/src/components/area/area-data.ts
 *
 * 用法：node scripts/gen-area-data.mjs
 */
import { createRequire } from 'node:module'
import fs from 'node:fs'
import path from 'node:path'

const require = createRequire(import.meta.url)
const raw = require('china-area-data/data.json')

const build = (code) => {
  const children = raw[code]
  if (!children) return undefined
  const list = Object.entries(children)
    .filter(([childCode]) => childCode !== code)
    .map(([childCode, name]) => {
      const sub = build(childCode)
      return sub && sub.length
        ? { text: name, value: childCode, children: sub }
        : { text: name, value: childCode }
    })
  return list.length ? list : undefined
}

const provinces = build('86')
if (!provinces) throw new Error('数据源异常：缺少省级节点')

const count = (nodes) => nodes.reduce((sum, n) => sum + 1 + (n.children ? count(n.children) : 0), 0)
const total = count(provinces)

const json = JSON.stringify(provinces)
  // 紧凑输出：去掉属性名引号、缩小缩进，减少产物体积
  .replace(/"text":/g, 'text:')
  .replace(/"value":/g, 'value:')
  .replace(/"children":/g, 'children:')

const out = `/* eslint-disable */
// 该文件由 scripts/gen-area-data.mjs 自动生成，请勿手动修改。
// 数据源：china-area-data v5（省级 ${provinces.length} 个 / 节点 ${total} 个）
import type { AreaOption } from './types'

export const areaData: AreaOption[] = ${json}

export default areaData
`

const target = path.resolve('packages/mobile-ui/src/components/area/area-data.ts')
fs.mkdirSync(path.dirname(target), { recursive: true })
fs.writeFileSync(target, out, 'utf8')

const size = fs.statSync(target).size
console.log(`生成完成：省级 ${provinces.length} / 节点 ${total} / ${(size / 1024).toFixed(1)} KB`)

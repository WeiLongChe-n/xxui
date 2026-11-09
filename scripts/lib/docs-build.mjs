/**
 * 构建文档站的公共逻辑，供 build-docs.mjs 等脚本复用。
 */
import { execFileSync } from 'node:child_process'
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

export const root = path.resolve(fileURLToPath(new URL('../..', import.meta.url)))
export const distDir = path.join(root, 'docs/.vitepress/dist')
const vitepressBin = path.join(root, 'node_modules/vitepress/bin/vitepress.js')

/** 把 'xxui' / '/xxui/' / '' 统一成 '/xxui/' 或 '/' */
export function normalizeBase(raw) {
  const trimmed = (raw || '').replace(/^\/+|\/+$/g, '')
  return trimmed ? `/${trimmed}/` : '/'
}

/**
 * 清空产物目录。
 *
 * 某些环境（如带 safe-delete 钩子的托管终端）里 fs.rmSync 走的是回收站，
 * 回收站不可用时整个构建会失败。这里改成先把旧目录重命名挪开到 .old-dist，
 * 重命名不依赖回收站，再尽力删除旧目录；删不掉也不影响本次构建。
 */
export function resetDist() {
  if (!fs.existsSync(distDir)) return
  const old = path.join(path.dirname(distDir), '.old-dist')
  try {
    fs.rmSync(old, { recursive: true, force: true, maxRetries: 2 })
  } catch {
    /* 旧目录删不掉就留着，下次再试 */
  }
  try {
    fs.renameSync(distDir, old)
    console.log('已把上次的产物移开: .vitepress/.old-dist')
  } catch (err) {
    console.warn('清理旧产物时出现问题，继续构建:', err.message)
  }
}

/**
 * 构建文档站。
 * @param {string} repoName 仓库名（决定 base），空字符串表示根路径
 * @param {boolean} staticDeploy 是否为纯静态托管产物（关闭 cleanUrls）
 * @returns {string} 归一化后的 base
 */
export function buildDocs(repoName, staticDeploy) {
  const base = normalizeBase(repoName)
  resetDist()

  const env = { ...process.env }
  if (base === '/') delete env.DOCS_BASE
  else env.DOCS_BASE = base.slice(1, -1)
  if (staticDeploy) env.DOCS_STATIC = '1'
  else delete env.DOCS_STATIC

  execFileSync(process.execPath, [vitepressBin, 'build', 'docs'], {
    stdio: 'inherit',
    cwd: root,
    env,
  })

  return base
}

/** 校验产物中带 base 前缀的引用是否都存在 */
export function verifyStatic(repoName) {
  execFileSync(
    process.execPath,
    ['scripts/verify-static.mjs', 'docs/.vitepress/dist', (repoName || '').replace(/^\/+|\/+$/g, '')],
    { stdio: 'inherit', cwd: root },
  )
}

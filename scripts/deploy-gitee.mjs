/**
 * 一键部署文档站到 Gitee Pages。
 *
 * 用法：
 *   node scripts/deploy-gitee.mjs <仓库地址> [仓库名]
 *
 * 示例：
 *   node scripts/deploy-gitee.mjs git@gitee.com:someone/vela-ui.git
 *   node scripts/deploy-gitee.mjs https://gitee.com/someone/vela-ui.git vela-ui
 *
 * 做的事：
 *   1. 以 base=/<仓库名>/ 构建文档站（链接带 .html，适配纯静态托管）
 *   2. 校验产物中所有绝对路径引用的资源都存在
 *   3. 把产物推到仓库的 pages 分支（独立提交历史，不影响源码分支）
 *
 * 首次部署后，需在 Gitee 仓库「服务 → Gitee Pages」选择 pages 分支、部署目录留空，
 * 启动服务后地址为 https://<用户名>.gitee.io/<仓库名>/
 */
import { execFileSync } from 'node:child_process'
import fs from 'node:fs'
import os from 'node:os'
import path from 'node:path'

import { buildDocs, distDir, verifyStatic } from './lib/docs-build.mjs'

const repo = process.argv[2]
const BRANCH = process.env.PAGES_BRANCH || 'pages'

if (!repo) {
  console.error('缺少仓库地址。\n用法: node scripts/deploy-gitee.mjs <仓库地址> [仓库名]')
  process.exit(1)
}

// 仓库名用于推导 base；没传就从地址末尾取
const repoName =
  (process.argv[3] || '').trim() ||
  repo
    .replace(/\.git$/, '')
    .split(/[/:]/)
    .filter(Boolean)
    .pop()

console.log(`仓库: ${repo}`)
console.log(`仓库名: ${repoName}  →  base: /${repoName}/`)

// 1. 构建
console.log('\n[1/3] 构建文档站')
buildDocs(repoName, true)

if (!fs.existsSync(path.join(distDir, 'index.html'))) {
  console.error('构建产物缺少 index.html，中止')
  process.exit(1)
}

// 2. 自检
console.log('\n[2/3] 校验产物资源引用')
verifyStatic(repoName)

// 3. 推送到 pages 分支
console.log('\n[3/3] 推送到 pages 分支')
const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'vela-pages-'))

try {
  fs.cpSync(distDir, tmp, { recursive: true })
  // 让 Gitee Pages 不要对 md 等文件做 Jekyll 处理
  fs.writeFileSync(path.join(tmp, '.nojekyll'), '')
  // 产物是静态文件，不需要任何换行符转换
  fs.writeFileSync(path.join(tmp, '.gitattributes'), '* -text\n')

  const git = (args) =>
    execFileSync('git', args, { cwd: tmp, stdio: 'inherit' })

  git(['init', '-q', '-b', BRANCH])
  git(['config', 'core.autocrlf', 'false'])
  git(['add', '-A'])
  git([
    '-c',
    'user.name=vela-bot',
    '-c',
    'user.email=vela-bot@local',
    'commit',
    '-q',
    '-m',
    `docs: 发布文档站 ${new Date().toISOString().slice(0, 19).replace('T', ' ')}`,
  ])
  git(['push', '-f', repo, `HEAD:${BRANCH}`])

  console.log(`\n✓ 已推送到 ${repo} 的 ${BRANCH} 分支`)
  console.log('\n接下来在 Gitee 仓库页面操作一次：')
  console.log(`  服务 → Gitee Pages → 部署分支选 ${BRANCH}、部署目录留空 → 启动服务`)
  console.log(`  站点地址: https://<用户名>.gitee.io/${repoName}/`)
} finally {
  try {
    fs.rmSync(tmp, { recursive: true, force: true, maxRetries: 2 })
  } catch {
    /* 临时目录清不掉不影响部署结果 */
  }
}

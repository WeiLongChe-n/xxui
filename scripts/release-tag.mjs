#!/usr/bin/env node
/**
 * 走 GitHub Actions 的发布方式：本地只负责「定版本 → 打 tag → 推送」，真正的 npm publish 交给 CI。
 *
 * 用法：
 *   node scripts/release-tag.mjs                自动：当前版本还没发布过就用它，否则按提交内容判定（feat → minor，其余 patch）
 *   node scripts/release-tag.mjs patch          强制补丁号自增（0.3.0 → 0.3.1）
 *   node scripts/release-tag.mjs minor          次版本自增（0.3.1 → 0.4.0）
 *   node scripts/release-tag.mjs major          主版本自增
 *   node scripts/release-tag.mjs 1.0.0-rc.1     指定版本
 *
 * 常用参数：
 *   --dry-run     只打印将要做什么，不写文件、不提交、不推送
 *   --no-push     只本地提交并打 tag，不推送（之后要手动 git push origin master --tags）
 *   --yes         跳过确认
 *   --skip-check  跳过 git 工作区干净检查
 *
 * 流程：预检 → 定版本 → 同步 4 处版本号 → 提交 → 打 tag → 推送 → 提示 CI 进度
 * 推上去之后，.github/workflows/publish.yml 会用 OIDC（Trusted Publishing）发布，不再需要任何 token。
 */
import { execFileSync } from 'node:child_process'
import { existsSync, readFileSync, writeFileSync } from 'node:fs'
import { createInterface } from 'node:readline/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const ROOT = path.resolve(fileURLToPath(new URL('..', import.meta.url)))
const PKG_DIR = path.join(ROOT, 'packages/mobile-ui')
const PKG_FILE = path.join(PKG_DIR, 'package.json')
const PKG_NAME = JSON.parse(readFileSync(PKG_FILE, 'utf8')).name
const REGISTRY = 'https://registry.npmjs.org/'

/* ---------------------------------- 参数 ---------------------------------- */

const argv = process.argv.slice(2)
const options = {
  bump: argv.find((a) => !a.startsWith('-')) || 'auto',
  dryRun: argv.includes('--dry-run'),
  push: !argv.includes('--no-push'),
  yes: argv.includes('--yes'),
  skipCheck: argv.includes('--skip-check'),
}

/* ---------------------------------- 工具 ---------------------------------- */

const c = {
  dim: (s) => `\u001b[2m${s}\u001b[0m`,
  bold: (s) => `\u001b[1m${s}\u001b[0m`,
  green: (s) => `\u001b[32m${s}\u001b[0m`,
  red: (s) => `\u001b[31m${s}\u001b[0m`,
  yellow: (s) => `\u001b[33m${s}\u001b[0m`,
  cyan: (s) => `\u001b[36m${s}\u001b[0m`,
}

const step = (title) => console.log(`\n${c.cyan('▸')} ${c.bold(title)}`)
const info = (msg) => console.log(`  ${c.dim(msg)}`)
const ok = (msg) => console.log(`  ${c.green('✓')} ${msg}`)
const warn = (msg) => console.log(`  ${c.yellow('!')} ${msg}`)

const fail = (msg, hint) => {
  const err = new Error(msg)
  err.hint = hint
  throw err
}

const git = (args) =>
  execFileSync('git', args, { cwd: ROOT, encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'] }).trim()

const gitQuiet = (args) => {
  try {
    git(args)
    return true
  } catch {
    return false
  }
}

/* --------------------------------- 版本工具 -------------------------------- */

const parse = (v) => {
  const m = String(v).match(/^(\d+)\.(\d+)\.(\d+)(?:-([0-9A-Za-z.-]+))?$/)
  if (!m) fail(`版本号格式不对：${v}`, '形如 0.3.1 或 1.0.0-rc.1')
  return { major: +m[1], minor: +m[2], patch: +m[3], pre: m[4] }
}

const bump = (current, kind) => {
  const v = parse(current)
  if (kind === 'major') return `${v.major + 1}.0.0`
  if (kind === 'minor') return `${v.major}.${v.minor + 1}.0`
  if (kind === 'patch') return `${v.major}.${v.minor}.${v.patch + 1}`
  return kind
}

const compare = (a, b) => {
  const x = parse(a)
  const y = parse(b)
  return x.major - y.major || x.minor - y.minor || x.patch - y.patch
}

/** 查 npm 上是否已有该版本；网络异常时返回 null（当作未知，交给用户决定） */
const remoteHas = async (version) => {
  try {
    const res = await fetch(`${REGISTRY}${PKG_NAME}`, {
      headers: { accept: 'application/vnd.npm.install-v1+json' },
      signal: AbortSignal.timeout(12000),
    })
    if (res.status === 404) return false
    if (!res.ok) return null
    const doc = await res.json()
    return Boolean(doc.versions?.[version])
  } catch {
    return null
  }
}

/* ------------------------------ 版本号同步目标 ------------------------------ */

const SYNC_TARGETS = [
  {
    label: 'packages/mobile-ui/package.json',
    file: PKG_FILE,
    write: (raw, version) => `${JSON.stringify({ ...JSON.parse(raw), version }, null, 2)}\n`,
  },
  {
    label: 'package.json（根）',
    file: path.join(ROOT, 'package.json'),
    write: (raw, version) => `${JSON.stringify({ ...JSON.parse(raw), version }, null, 2)}\n`,
  },
  {
    label: 'packages/mobile-ui/src/index.ts',
    file: path.join(PKG_DIR, 'src/index.ts'),
    write: (raw, version) => raw.replace(/(export const version = ')[^']+(')/, `$1${version}$2`),
  },
  {
    label: 'docs/.vitepress/config.mts',
    file: path.join(ROOT, 'docs/.vitepress/config.mts'),
    write: (raw, version) => raw.replace(/(text: 'v)\d+\.\d+\.\d+(?:-[^']+)?(')/, `$1${version}$2`),
  },
]

/* --------------------------------- 主流程 --------------------------------- */

const confirm = async (summary) => {
  if (options.yes || options.dryRun) return
  if (!process.stdin.isTTY) {
    warn('非交互环境，自动继续（可加 --yes 显式确认）')
    return
  }
  const rl = createInterface({ input: process.stdin, output: process.stdout })
  const answer = await rl.question(`\n${summary}\n继续？输入 yes：`)
  rl.close()
  if (answer.trim().toLowerCase() !== 'yes') fail('已取消')
}

const main = async () => {
  console.log(`\n${c.bold('XXUI 发布（GitHub Actions + Trusted Publishing）')}`)

  /* 1. 预检 */
  step('1/6 预检')

  if (!options.skipCheck) {
    const dirty = git(['status', '--porcelain'])
    if (dirty) {
      fail(
        '工作区有未提交的改动',
        ['先提交或 stash：git stash -u', '或加 --skip-check 跳过检查'].join('\n    '),
      )
    }
    ok('工作区干净')
  } else {
    warn('已跳过工作区检查')
  }

  const branch = git(['branch', '--show-current'])
  if (!branch) fail('当前处于游离 HEAD，先切回分支')
  ok(`分支 ${branch}`)

  let remoteUrl = ''
  if (gitQuiet(['remote', 'get-url', 'origin'])) {
    remoteUrl = git(['remote', 'get-url', 'origin'])
  }
  if (!/github\.com/i.test(remoteUrl)) {
    warn(`origin 不是 GitHub：${remoteUrl || '未配置'}`)
    warn('Trusted Publishing 只认 GitHub / GitLab.com / CircleCI，发布前需要推到 GitHub')
  } else {
    ok(`origin ${remoteUrl}`)
  }

  if (!existsSync(path.join(ROOT, '.github/workflows/publish.yml'))) {
    fail('缺少 .github/workflows/publish.yml', '先补上 workflow 再发')
  }
  ok('发布 workflow 存在')

  /* 2. 定版本 */
  step('2/6 确定版本')
  const current = JSON.parse(readFileSync(PKG_FILE, 'utf8')).version
  info(`当前版本 ${current}`)

  let target = current
  if (options.bump !== 'auto') {
    target = bump(current, options.bump)
  } else {
    const exists = await remoteHas(current)
    if (exists === false) {
      ok(`${PKG_NAME}@${current} 在 npm 上还不存在，直接用当前版本`)
    } else {
      if (exists === null) warn('查不到 npm 上的版本信息，按提交内容判定')
      const lastTag = gitQuiet(['describe', '--tags', '--abbrev=0'])
        ? git(['describe', '--tags', '--abbrev=0'])
        : ''
      const range = lastTag ? `${lastTag}..HEAD` : 'HEAD'
      const log = git(['log', '--pretty=%s', range])
      const kind = /BREAKING CHANGE|^\w+(\(.+\))?!:/m.test(log)
        ? 'major'
        : /^\s*feat(\(.+\))?:/m.test(log)
          ? 'minor'
          : 'patch'
      target = bump(current, kind)
      info(`自 ${lastTag || '首个提交'} 以来的提交判定为 ${kind}`)
    }
  }

  if (compare(target, current) < 0) fail(`目标版本 ${target} 小于当前版本 ${current}`)
  if (gitQuiet(['rev-parse', '-q', '--verify', `refs/tags/v${target}`])) {
    fail(`tag v${target} 已存在`, '换一个版本号，或先删除旧 tag：git tag -d v' + target)
  }
  ok(`目标版本 ${target}（tag v${target}）`)

  /* 3. 同步版本号 */
  step('3/6 同步版本号')
  const changed = []
  for (const t of SYNC_TARGETS) {
    if (!existsSync(t.file)) continue
    const before = readFileSync(t.file, 'utf8')
    // 保留原文件的换行风格，否则 CRLF 的文件会被整篇改写成 LF，diff 里全是噪音
    const eol = before.includes('\r\n') ? '\r\n' : '\n'
    const after = t.write(before, target).replace(/\r?\n/g, eol)
    if (after === before) continue
    changed.push(t.file)
    if (!options.dryRun) writeFileSync(t.file, after)
    info(`${options.dryRun ? '将修改' : '已修改'} ${t.label}`)
  }
  if (!changed.length) warn('没有文件需要改动（版本号已是目标值）')
  else ok(`${changed.length} 个文件已更新`)

  /* 4. 提交 */
  step('4/6 提交')
  const message = `chore(release): v${target}`
  if (!changed.length) {
    info('版本号未变化，跳过提交（直接在当前提交上打 tag）')
  } else if (options.dryRun) {
    info(`将执行：git add ... && git commit -m "${message}"`)
  } else {
    execFileSync('git', ['add', ...changed], { cwd: ROOT, stdio: 'inherit' })
    try {
      execFileSync('git', ['commit', '-m', message], { cwd: ROOT, stdio: 'inherit' })
    } catch {
      fail('提交失败', '检查是否有 pre-commit hook 报错')
    }
    ok(message)
  }

  /* 5. 打 tag */
  step('5/6 打 tag')
  if (options.dryRun) {
    info(`将执行：git tag v${target}`)
  } else {
    git(['tag', `v${target}`])
    ok(`v${target}`)
  }

  /* 6. 推送 */
  step('6/6 推送')
  await confirm(`即将推送 ${branch} 与 tag v${target}，随后 CI 自动发布 ${PKG_NAME}@${target}`)

  if (options.dryRun) {
    info(`将执行：git push origin ${branch} && git push origin v${target}`)
    console.log(`\n${c.green('dry-run 完成')}，未推送\n`)
    return
  }

  if (options.push) {
    git(['push', 'origin', branch])
    git(['push', 'origin', `v${target}`])
    ok('已推送提交与 tag')
    if (/github\.com/i.test(remoteUrl)) {
      const m = remoteUrl.match(/github\.com[:/]([^/]+)\/([^/.]+)/i)
      if (m) info(`CI 进度：https://github.com/${m[1]}/${m[2]}/actions`)
    }
  } else {
    warn('未推送，执行下面两条命令才会触发 CI：')
    info(`git push origin ${branch}`)
    info(`git push origin v${target}`)
  }

  console.log(`\n${c.green('完成')} tag v${target} 已就绪，工作流跑完后可在 npm 查看：`)
  console.log(`  ${c.cyan(`https://www.npmjs.com/package/${PKG_NAME}/v/${target}`)}\n`)
}

main().catch((error) => {
  console.error(`\n${c.red('中断')} ${error.message}`)
  if (error.hint) console.error(`${c.yellow('建议：')}\n    ${error.hint}`)
  process.exit(1)
})

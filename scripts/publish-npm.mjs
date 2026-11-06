#!/usr/bin/env node
/**
 * 发布 @xxui/mobile 到 npm，版本号自动自增。
 *
 * 用法：
 *   node scripts/publish-npm.mjs                 自动：当前版本还没发布过就发它，否则补丁号自增
 *   node scripts/publish-npm.mjs patch           强制补丁号自增（0.3.0 → 0.3.1）
 *   node scripts/publish-npm.mjs minor           次版本自增（0.3.1 → 0.4.0）
 *   node scripts/publish-npm.mjs major           主版本自增
 *   node scripts/publish-npm.mjs 1.0.0-rc.1      发布指定版本
 *   node scripts/publish-npm.mjs --dry-run       跑完整流程但不真正发布（不上传、不打 tag）
 *
 * 常用参数：
 *   --tag <dist-tag>  发布到指定 dist-tag，如 beta / next（默认 latest）
 *   --otp <code>      两步验证码
 *   --yes             跳过发布前确认
 *   --skip-check      跳过 git 工作区干净检查
 *   --no-typecheck    跳过 vue-tsc 类型检查
 *   --no-git          不创建发布提交与 tag
 *   --push            发布成功后推送提交与 tag 到 origin
 *
 * 流程：预检 → 自增版本 → 同步版本号 → 类型检查 → 构建 → 产物校验
 *      → npm pack 预检 → 发布 → 提交 + 打 tag
 * 任一步失败都会回滚 package.json 与源码里的版本号。
 */
import { execFileSync } from 'node:child_process'
import { existsSync, readFileSync, statSync, writeFileSync } from 'node:fs'
import { createInterface } from 'node:readline/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const ROOT = path.resolve(fileURLToPath(new URL('..', import.meta.url)))
const PKG_DIR = path.join(ROOT, 'packages/mobile-ui')
const PKG_FILE = path.join(PKG_DIR, 'package.json')
const REGISTRY = 'https://registry.npmjs.org/'

/* ---------------------------------- 参数 ---------------------------------- */

const argv = process.argv.slice(2)

const readFlagValue = (name) => {
  const i = argv.indexOf(name)
  return i > -1 ? argv[i + 1] : undefined
}

const VALUE_FLAGS = ['--tag', '--otp']
const positional = argv.filter((arg, i) => {
  if (arg.startsWith('-')) return false
  return !VALUE_FLAGS.includes(argv[i - 1])
})

const options = {
  bump: positional[0] || 'auto',
  dryRun: argv.includes('--dry-run'),
  yes: argv.includes('--yes'),
  skipCheck: argv.includes('--skip-check'),
  typecheck: !argv.includes('--no-typecheck'),
  git: !argv.includes('--no-git'),
  push: argv.includes('--push'),
  tag: readFlagValue('--tag') || 'latest',
  otp: readFlagValue('--otp'),
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

/**
 * 不经过 shell 直接执行，避免 Windows 上 cmd 把提交信息里的括号当成语法。
 * npm 在 Windows 上是 .cmd，没法直接 execFile，所以优先定位 npm-cli.js 用 node 跑。
 */
const run = (cmd, args, extra = {}) => {
  const { inherit, ...rest } = extra
  try {
    return execFileSync(cmd, args, {
      cwd: ROOT,
      encoding: 'utf8',
      stdio: inherit ? 'inherit' : 'pipe',
      ...rest,
    })
  } catch (error) {
    const output = [error.stdout, error.stderr].filter(Boolean).join('\n').trim()
    if (output) console.error(c.dim(output.split('\n').slice(-12).join('\n')))
    throw error
  }
}

const node = (args, extra) => run(process.execPath, args, extra)

const npmCli = [
  process.env.npm_execpath,
  path.join(ROOT, 'node_modules', 'npm', 'bin', 'npm-cli.js'),
  'C:/Program Files/nodejs/node_modules/npm/bin/npm-cli.js',
].find((p) => p && p.endsWith('.js') && existsSync(p))

/** 统一走 npm CLI：有 npm-cli.js 就用 node 跑，否则退回 shell 里的 npm */
const npmX = (args, extra = {}) =>
  npmCli
    ? node([npmCli, ...args], extra)
    : run(process.platform === 'win32' ? 'npm.cmd' : 'npm', args, { ...extra, shell: true })

const sizeOf = (file) => {
  const bytes = statSync(file).size
  return bytes >= 1024 * 1024
    ? `${(bytes / 1024 / 1024).toFixed(2)} MB`
    : `${(bytes / 1024).toFixed(1)} kB`
}

/* --------------------------------- 版本号 --------------------------------- */

const parseVersion = (raw) => {
  const m = /^(\d+)\.(\d+)\.(\d+)(?:-([0-9A-Za-z.-]+))?(?:\+[0-9A-Za-z.-]+)?$/.exec(String(raw).trim())
  if (!m) fail(`无法解析版本号：${raw}`)
  return { major: +m[1], minor: +m[2], patch: +m[3], pre: m[4] }
}

const formatVersion = ({ major, minor, patch, pre }) =>
  `${major}.${minor}.${patch}${pre ? `-${pre}` : ''}`

const nextVersion = (current, bump) => {
  if (/^\d+\.\d+\.\d+([-+].*)?$/.test(bump)) return bump

  const v = parseVersion(current)
  switch (bump) {
    case 'major':
      return formatVersion({ major: v.major + 1, minor: 0, patch: 0 })
    case 'minor':
      return formatVersion({ major: v.major, minor: v.minor + 1, patch: 0 })
    case 'patch':
      return formatVersion({ major: v.major, minor: v.minor, patch: v.patch + 1 })
    default:
      return fail(
        `未知的版本类型：${bump}`,
        '可用：patch / minor / major，或直接写完整版本号，例如 1.2.0',
      )
  }
}

const compareVersion = (a, b) => {
  const left = parseVersion(a)
  const right = parseVersion(b)
  for (const key of ['major', 'minor', 'patch']) {
    if (left[key] !== right[key]) return left[key] - right[key]
  }
  if (left.pre === right.pre) return 0
  if (!left.pre) return 1
  if (!right.pre) return -1
  return left.pre.localeCompare(right.pre)
}

/* ------------------------------- registry -------------------------------- */

const fetchJson = async (url) => {
  const res = await fetch(url, { headers: { accept: 'application/json' } })
  if (res.status === 404) return null
  if (!res.ok) fail(`请求 ${url} 失败：HTTP ${res.status}`)
  return res.json()
}

const registryPackage = (name) => fetchJson(`${REGISTRY}${name.replace('/', '%2F')}`)

/** 探测 scope 是否已被占用，以及占用者是否包含当前登录用户 */
const inspectScope = async (name, whoami) => {
  const scope = name.startsWith('@') ? name.split('/')[0] : null
  if (!scope) return { scoped: false }

  // 搜索接口只做粗筛，必须再按 "@scope/" 前缀过滤，否则会把无关包算进来
  const search = await fetchJson(
    `${REGISTRY}-/v1/search?text=${encodeURIComponent(scope)}&size=20`,
  )
  const hits = (search?.objects ?? []).filter((hit) =>
    String(hit.package?.name || '').startsWith(`${scope}/`),
  )
  if (!hits.length) return { scoped: true, occupied: false }

  const owners = new Set()
  for (const hit of hits.slice(0, 3)) {
    const doc = await registryPackage(hit.package.name).catch(() => null)
    for (const person of doc?.maintainers ?? []) owners.add(person.name)
  }

  return {
    scoped: true,
    occupied: true,
    scope,
    owners: [...owners],
    ownedByMe: whoami ? owners.has(whoami) : false,
    sample: hits[0]?.package?.name,
  }
}

/* ------------------------------ 版本号同步 -------------------------------- */

const SYNC_TARGETS = [
  {
    label: 'packages/mobile-ui/package.json',
    file: PKG_FILE,
    write: (raw, version) => {
      const json = JSON.parse(raw)
      json.version = version
      return `${JSON.stringify(json, null, 2)}\n`
    },
  },
  {
    label: 'package.json（根，仅同步号）',
    file: path.join(ROOT, 'package.json'),
    write: (raw, version) => {
      const json = JSON.parse(raw)
      json.version = version
      return `${JSON.stringify(json, null, 2)}\n`
    },
  },
  {
    label: 'packages/mobile-ui/src/index.ts',
    file: path.join(PKG_DIR, 'src/index.ts'),
    write: (raw, version) =>
      raw.replace(/(export const version = ')[^']+(')/, `$1${version}$2`),
  },
  {
    label: 'docs/.vitepress/config.mts',
    file: path.join(ROOT, 'docs/.vitepress/config.mts'),
    write: (raw, version) => raw.replace(/(text: 'v)\d+\.\d+\.\d+(?:-[^']+)?(')/, `$1${version}$2`),
  },
]

const applyVersion = (version) => {
  const backups = []
  for (const target of SYNC_TARGETS) {
    if (!existsSync(target.file)) continue
    const before = readFileSync(target.file, 'utf8')
    const after = target.write(before, version)
    if (after === before) continue
    backups.push({ file: target.file, before })
    writeFileSync(target.file, after)
  }
  return backups
}

const rollback = (backups) => {
  for (const { file, before } of backups) {
    writeFileSync(file, before)
  }
  if (backups.length) warn(`已回滚版本号改动（${backups.length} 个文件）`)
}

/* -------------------------------- 校验产物 -------------------------------- */

const verifyArtifacts = (pkg) => {
  const entries = [
    ['main', pkg.main],
    ['module', pkg.module],
    ['types', pkg.types],
    ['style', pkg.style],
    ['unpkg', pkg.unpkg],
    ['exports["."].import', pkg.exports?.['.']?.import],
    ['exports["."].require', pkg.exports?.['.']?.require],
    ['exports["./style.css"]', pkg.exports?.['./style.css']],
  ].filter(([, value]) => typeof value === 'string')

  const missing = []
  const seen = new Set()

  for (const [field, rel] of entries) {
    if (seen.has(rel)) continue
    seen.add(rel)
    const file = path.join(PKG_DIR, rel)
    if (!existsSync(file) || statSync(file).size === 0) {
      missing.push(`${field} → ${rel}`)
    }
  }

  if (missing.length) {
    fail(`产物缺失或为空：\n    ${missing.join('\n    ')}`, '先执行 npm run build')
  }

  const distDir = path.join(PKG_DIR, 'dist')
  const typesEntry = path.join(distDir, 'types/index.d.ts')
  const dts = readFileSync(typesEntry, 'utf8')
  if (!/XXUI|components/.test(dts)) {
    fail('类型声明文件内容异常，可能没有生成 d.ts')
  }

  ok(`产物完整：${path.relative(ROOT, path.join(PKG_DIR, pkg.module))} 等 ${seen.size} 个入口`)
  info(`ES ${sizeOf(path.join(distDir, path.basename(pkg.module)))} · UMD ${sizeOf(path.join(distDir, path.basename(pkg.main)))} · CSS ${sizeOf(path.join(distDir, path.basename(pkg.style)))}`)
}

/* ------------------------------- pack 预检 -------------------------------- */

const execNpmJson = (args) => {
  const output = npmX(args, { env: { ...process.env, npm_config_loglevel: 'error' } })
  const start = output.indexOf('[')
  const end = output.lastIndexOf(']')
  if (start === -1 || end === -1) fail('npm pack 输出无法解析', output.slice(0, 400))
  return JSON.parse(output.slice(start, end + 1))
}

const expectedInTarball = (pkg) => {
  const required = ['package.json', 'README.md', 'LICENSE']
  for (const rel of [pkg.main, pkg.module, pkg.types, pkg.style]) {
    if (rel) required.push(rel.replace(/^\.\//, ''))
  }
  return required
}

const packPreflight = (pkg) => {
  const [result] = execNpmJson(['pack', '--dry-run', '--json', PKG_DIR])
  const files = result.files.map((f) => f.path)
  const required = expectedInTarball(pkg)
  const missing = required.filter((rel) => !files.includes(rel))

  if (missing.length) fail(`tarball 缺少文件：${missing.join(', ')}`)

  const hasSource = files.some((f) => f.startsWith('src/'))
  ok(`tarball ${result.filename.replace(/\.tgz$/, '')}：${files.length} 个文件，解压后 ${(result.unpackedSize / 1024).toFixed(0)} kB`)
  info(`压缩包 ${(result.size / 1024).toFixed(0)} kB${hasSource ? '，含 src 源码' : ''}`)
  return result
}

/* --------------------------------- 主流程 --------------------------------- */

const originalPkgRaw = readFileSync(PKG_FILE, 'utf8')
const pkg = JSON.parse(originalPkgRaw)
const currentVersion = pkg.version

/** 目标版本在拿到 registry 状态后才能确定（auto 依赖「当前版本是否已发布」） */
let targetVersion = ''

let backups = []
let published = false

const checkGit = () => {
  if (options.skipCheck) {
    warn('已跳过 git 工作区检查')
    return
  }
  const dirty = run('git', ['status', '--porcelain']).trim()
  if (dirty) {
    const lines = dirty.split('\n')
    fail(
      `工作区有 ${lines.length} 处未提交改动，发布会把版本号改动混在一起\n    ${lines.slice(0, 6).join('\n    ')}`,
      '先提交或暂存改动；确认要发布可用 --skip-check',
    )
  }
  ok('git 工作区干净')
}

const checkAuth = async (optional = false) => {
  try {
    const who = npmX(['whoami', '--registry', REGISTRY]).trim()
    ok(`npm 已登录：${c.bold(who)}`)
    return who
  } catch {
    if (optional) {
      warn('未登录 npm，dry-run 继续（真正发布会在此中断）')
      return null
    }
    return fail('未登录 npm（当前 registry 未提供有效凭据）', [
      '先执行 npm login --registry https://registry.npmjs.org/',
      '或者在 CI 中设置 NODE_AUTH_TOKEN',
      '只想预览流程可加 --dry-run',
    ].join('\n    '))
  }
}

const checkRemoteVersion = async (doc, whoami) => {
  const scope = await inspectScope(pkg.name, whoami)

  if (doc) {
    const latest = doc['dist-tags']?.latest
    const exists = Boolean(doc.versions?.[targetVersion])
    if (exists) fail(`${pkg.name}@${targetVersion} 已存在于 npm`, '换一个版本类型或指定更高的版本号')
    const owners = (doc.maintainers ?? []).map((m) => m.name)
    if (whoami && owners.length && !owners.includes(whoami)) {
      fail(
        `${pkg.name} 的维护者是 ${owners.join(', ')}，当前账号 ${whoami} 无权发布`,
        '确认账号，或者改 package.json 的 name 换个包名',
      )
    }
    ok(`npm 上已有版本 latest = ${c.bold(latest)}，本次发布 ${c.bold(targetVersion)}`)
    return
  }

  ok(`${pkg.name} 在 npm 上尚未存在，将创建新包`)

  if (scope.scoped && scope.occupied) {
    const owners = scope.owners?.length ? scope.owners.join(', ') : '未知用户'
    if (scope.ownedByMe) {
      ok(`scope ${scope.scope} 属于当前账号`)
    } else if (whoami) {
      fail(
        `scope ${scope.scope} 已被占用（${scope.sample} 的维护者：${owners}）\n    当前账号 ${whoami} 无权向该 scope 发包`,
        [
          `如果 ${owners} 不是你的账号，需要换包名，例如改成 "xxui-mobile"（未占用）`,
          `改完记得同步文档里的 import：docs/.vitepress/config.mts 的 alias、docs/demos/**、README`,
        ].join('\n    '),
      )
    } else {
      warn(`scope ${scope.scope} 已被占用（维护者：${owners}），登录后才能真正校验发布权限`)
    }
  }
}

const confirm = async (summary) => {
  if (options.yes || options.dryRun) return
  if (!process.stdin.isTTY) {
    warn('非交互环境，自动继续（可加 --yes 显式确认）')
    return
  }
  const rl = createInterface({ input: process.stdin, output: process.stdout })
  const answer = await rl.question(`\n${summary}\n确认发布？输入 yes 继续：`)
  rl.close()
  if (answer.trim().toLowerCase() !== 'yes') fail('已取消发布')
}

const gitRelease = (version) => {
  if (!options.git) {
    warn('已跳过 git 提交与 tag（--no-git）')
    return
  }

  const files = SYNC_TARGETS.map((t) => path.relative(ROOT, t.file)).filter((rel) =>
    existsSync(path.join(ROOT, rel)),
  )

  try {
    run('git', ['add', '--', ...files])
    run('git', ['commit', '-m', `chore(release): v${version}`])
    ok(`已提交 chore(release): v${version}`)
  } catch (error) {
    warn(`git 提交失败，跳过 tag：${error.message.split('\n')[0]}`)
    return
  }

  try {
    run('git', ['tag', 'v' + version])
    ok(`已打 tag v${version}`)
  } catch {
    warn(`tag v${version} 已存在，跳过`)
  }

  if (options.push) {
    try {
      run('git', ['push', 'origin', 'HEAD', '--follow-tags'], { inherit: true })
      ok('已推送到 origin')
    } catch {
      warn('推送失败，可稍后手动 git push --follow-tags')
    }
  }
}

const main = async () => {
  console.log(c.bold(`\n发布 ${pkg.name}`))

  step('1/8 预检仓库状态')
  checkGit()

  step('2/8 校验登录与包名')
  const whoami = await checkAuth(options.dryRun)
  const doc = await registryPackage(pkg.name)

  // auto：当前版本还没发布过就直接发它，避免凭空多出一个补丁号
  if (options.bump === 'auto') {
    const alreadyPublished = Boolean(doc?.versions?.[currentVersion])
    targetVersion = alreadyPublished ? nextVersion(currentVersion, 'patch') : currentVersion
    info(
      alreadyPublished
        ? `v${currentVersion} 已发布，自动补丁自增 → ${c.bold(targetVersion)}`
        : `v${currentVersion} 尚未发布，按当前版本发布`,
    )
  } else {
    targetVersion = nextVersion(currentVersion, options.bump)
    info(`当前版本 ${currentVersion} → ${c.bold(targetVersion)}`)
  }

  await checkRemoteVersion(doc, whoami)

  if (!options.dryRun && compareVersion(targetVersion, currentVersion) < 0) {
    fail(`目标版本 ${targetVersion} 低于当前 ${currentVersion}`, '换一个不低于当前版本的版本号')
  }

  step('3/8 同步版本号')
  backups = applyVersion(targetVersion)
  for (const { file } of backups) ok(path.relative(ROOT, file))
  if (!backups.length) warn('没有需要改写的版本号位置')

  step('4/8 类型检查')
  if (options.typecheck) {
    node([path.join(ROOT, 'node_modules', 'vue-tsc', 'bin', 'vue-tsc.js'), '--noEmit', '-p', path.join(PKG_DIR, 'tsconfig.json')], { inherit: true })
    ok('vue-tsc 通过')
  } else {
    warn('已跳过类型检查（--no-typecheck）')
  }

  step('5/8 构建')
  node(
    [
      path.join(ROOT, 'node_modules', 'vite', 'bin', 'vite.js'),
      'build',
      '--config',
      path.join(PKG_DIR, 'vite.config.ts'),
    ],
    { inherit: true },
  )
  ok('构建完成')

  step('6/8 校验产物')
  const nextPkg = JSON.parse(readFileSync(PKG_FILE, 'utf8'))
  verifyArtifacts(nextPkg)
  const tarball = packPreflight(nextPkg)

  await confirm(`本次发布 ${pkg.name}@${targetVersion}（${(tarball.size / 1024).toFixed(0)} kB）`)

  step(`7/8 发布到 npm${options.dryRun ? c.yellow('（dry-run，跳过）') : ''}`)
  if (options.dryRun) {
    info(`将执行：npm publish ${path.relative(ROOT, PKG_DIR)} --registry ${REGISTRY} --access public --tag ${options.tag}`)
    ok('dry-run 完成，未上传')
  } else {
    const args = ['publish', PKG_DIR, '--registry', REGISTRY, '--access', 'public', '--tag', options.tag]
    if (options.otp) args.push('--otp', options.otp)
    try {
      npmX(args, { inherit: true })
    } catch (error) {
      const message = String(error.message || '')
      if (/E403|forbidden|403/.test(message)) {
        fail('npm 拒绝了发布（403）', '确认当前账号对该 scope / 包名有发布权限；scoped 包需要 --access public 且 scope 归你所有')
      }
      if (/EOTP|one-time password/i.test(message)) {
        fail('需要两步验证码', '重新执行并带上 --otp <code>')
      }
      throw error
    }
    published = true
    ok(`已发布 ${pkg.name}@${targetVersion}`)
    info(`https://www.npmjs.com/package/${pkg.name}/v/${targetVersion}`)
  }

  step('8/8 提交与打 tag')
  if (options.dryRun) {
    warn('dry-run 模式，回滚版本号改动')
    rollback(backups)
    backups = []
    info('仓库保持原状')
  } else {
    gitRelease(targetVersion)
  }

  console.log(`\n${c.green('完成')} ${pkg.name}@${targetVersion}`)
  console.log(c.dim(`  安装：npm i ${pkg.name}@${options.tag === 'latest' ? targetVersion : `${targetVersion} --tag ${options.tag}`}`))
  if (published) {
    console.log(c.dim('  提示：npm 页面索引有几十秒延迟，稍等再刷新'))
  }
}

main().catch((error) => {
  if (backups.length) rollback(backups)
  console.error(`\n${c.red('发布中断')} ${error.message}`)
  if (error.hint) console.error(`\n  ${c.dim('建议：')}\n    ${error.hint}`)
  process.exitCode = 1
})

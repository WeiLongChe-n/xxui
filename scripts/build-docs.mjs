/**
 * 构建文档站。
 *
 * 用法：
 *   node scripts/build-docs.mjs              本地开发用，base 为 /，cleanUrls 开启
 *   node scripts/build-docs.mjs vela-ui      Gitee Pages 用，base 为 /vela-ui/，关闭 cleanUrls
 *
 * 传仓库名时会顺带校验产物里的资源引用是否完整。
 */
import { buildDocs, verifyStatic } from './lib/docs-build.mjs'

const repoName = process.argv.slice(2).filter((a) => !a.startsWith('-')).pop() || ''
const staticDeploy = Boolean(repoName)

if (staticDeploy) {
  console.log(`构建纯静态产物，base = /${repoName}/`)
}

buildDocs(repoName, staticDeploy)

if (staticDeploy) {
  console.log('')
  verifyStatic(repoName)
  console.log('\n本地预览：')
  console.log(`  node scripts/serve-static.mjs docs/.vitepress/dist ${repoName} 4180`)
  console.log(`  然后打开 http://localhost:4180/${repoName}/`)
}

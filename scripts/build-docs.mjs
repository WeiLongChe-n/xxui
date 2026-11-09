/**
 * 构建文档站。
 *
 * 用法：
 *   node scripts/build-docs.mjs              本地开发用，base 为 /，cleanUrls 开启
 *   node scripts/build-docs.mjs xxui         GitHub Pages 项目仓库，base 为 /xxui/，关闭 cleanUrls
 *   node scripts/build-docs.mjs --static     个人站点仓库（<user>.github.io），base 为 /，关闭 cleanUrls
 *
 * 只要产物要放到纯静态托管（传仓库名或 --static），就会顺带校验资源引用是否完整。
 */
import { buildDocs, verifyStatic } from './lib/docs-build.mjs'

const args = process.argv.slice(2)
const repoName = args.filter((a) => !a.startsWith('-')).pop() || ''
const staticDeploy = repoName !== '' || args.includes('--static')

if (staticDeploy) {
  console.log(`构建纯静态产物，base = ${repoName ? `/${repoName}/` : '/'}`)
}

buildDocs(repoName, staticDeploy)

if (staticDeploy) {
  console.log('')
  verifyStatic(repoName)
  if (repoName) {
    console.log('\n本地预览：')
    console.log(`  node scripts/serve-static.mjs docs/.vitepress/dist ${repoName} 4180`)
    console.log(`  然后打开 http://localhost:4180/${repoName}/`)
  } else {
    console.log('\n本地预览：')
    console.log('  node scripts/serve-static.mjs docs/.vitepress/dist "" 4180')
    console.log('  然后打开 http://localhost:4180/')
  }
}

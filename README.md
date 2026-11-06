# XXUI

Vue 3 + TypeScript 移动端组件库，内置多套主题与暗色模式，附带完整的技术文档站。

- 55 个组件，覆盖基础 / 表单 / 反馈 / 导航 / 展示五大类
- 主题由 CSS 变量与色相令牌驱动：6 套品牌配色 × 明暗双模式，运行时切换无需重新编译
- 命令式组件（Toast / Dialog / ImagePreview）与组件式并存
- 移动端细节：0.5px 细边框、安全区、滚动锁定、手势拖拽、懒渲染

## 环境要求

| 环境 | 最低版本 | 推荐版本 | 说明 |
| --- | --- | --- | --- |
| Node.js | `>= 18.0.0` | `20 LTS` / `22 LTS` | Vite 6、VitePress 1.6 的运行前提 |
| npm | `>= 9.0.0` | `10.x` | 也可使用 pnpm 8+ / yarn 1.22+ |
| Vue | `>= 3.3.0` | `3.5.x` | 组件使用 `<script setup>`、`defineOptions` |
| TypeScript | `>= 5.0` | `5.9.x` | 可选 |
| Vite | `>= 5.0` | `6.4.x` | 仅开发与构建需要 |

> 当前仓库的开发与验证环境：**Node.js v22.22.2 / npm 10.9.7 / Vue 3.5.44 / Vite 6.4.5 / VitePress 1.6.4 / TypeScript 5.9.3 / Sass 1.107.1**
>
> 根目录提供 `.nvmrc`（`22.22.2`），执行 `nvm use` 即可对齐版本。`package.json` 中的 `engines` 声明了 `node >= 18`，低于该版本安装会失败。

## 快速开始

```bash
# 安装依赖
npm install

# 启动文档站（默认 http://localhost:5173）
npm run dev

# 构建组件库（ES + UMD + d.ts）
npm run build

# 构建文档站静态产物
npm run docs:build
```

## 目录结构

```
vela-ui/
├── packages/mobile-ui/        # 组件库源码
│   ├── src/
│   │   ├── components/        # 55 个组件
│   │   ├── styles/            # 主题变量、mixin、过渡动效
│   │   ├── theme/             # 主题运行时（切换 / 持久化 / 跟随系统）
│   │   ├── utils/             # BEM、手势、滚动锁定、挂载工具
│   │   └── index.ts           # 库入口
│   ├── vite.config.ts         # 库构建配置
│   └── tsconfig.json
├── docs/                      # VitePress 文档站
│   ├── guide/                 # 指南：上手、主题、暗色、适配、FAQ、更新日志
│   ├── components/            # 43 篇组件文档
│   ├── demos/                 # 在线示例（通过 ?raw 展示源码）
│   └── .vitepress/            # 站点配置、自定义主题与主题切换器
└── scripts/                   # 截图与页面巡检脚本（开发辅助）
```

## 在项目中使用

```ts
import { createApp } from 'vue'
import XXUI from '@xxui/mobile'
import '@xxui/mobile/style.css'
import App from './App.vue'

createApp(App).use(XXUI).mount('#app')
```

```vue
<x-button type="primary" block @click="Toast.success('保存成功')">提交</x-button>
```

```ts
import { setTheme, useTheme, Toast } from '@xxui/mobile'

setTheme({ mode: 'dark', brand: 'ocean' })

const { isDark, brand, setBrand, toggleMode } = useTheme()
```

## 主题

主题 = 明暗模式（`light` / `dark` / `auto`）× 品牌配色（`default` / `ocean` / `emerald` / `violet` / `sunset` / `graphite`），共 12 种预设组合。实现方式：

- `html[data-theme='dark']` 覆盖一整套颜色令牌；
- `html[data-brand='ocean']` 只切换 `--x-hue`，主色及其所有状态色由 `hsl()` 推导；
- 任意作用域覆盖 CSS 变量即可实现局部定制，`<x-config-provider>` 提供组件化封装。

详见文档「[主题定制](docs/guide/theme.md)」。

## 文档

```bash
npm run dev
```

- 指南：`/guide/introduction`
- 主题定制：`/guide/theme`
- 组件：`/components/button` 起共 43 篇

文档站内右上角提供主题切换器，可实时预览 6 套配色与明暗模式。

### 交互预览

组件页右侧固定一个手机形态的实时预览：组件真实渲染、可直接点击，外层套了 iPhone 样式的机身、状态栏与 Home 指示条。

整个页面只有这一个预览盒，左侧只放说明与代码；滚动到哪个示例、或点击哪张卡片，右侧就切换过去（判定线式的滚动联动 + 点击切换）。窄于 1280px 时自动回落到卡片内嵌手机框。

盒子顶部是组件导航栏：`←` 返回上一个浏览过的组件，组件名下拉展开全部组件菜单（按侧边栏分组），右侧 `1/4` 展开本页示例列表。手机部分撑满盒子剩余高度，内容超出时在沙箱内部滚动。

预览内容跑在 **iframe 沙箱**里 —— 组件库样式被注入沙箱内部，文档站样式不会进入，两边互不干扰。预览上方工具条只作用于沙箱：

- 六个色点切换预览内品牌配色；
- 「深色 / 浅色」切换预览内明暗，不影响文档站；
- 「重置」重新挂载当前示例，复位弹窗 / 开关等状态；
- 「全屏」放大预览，`Esc` 退出。

为了让组件在沙箱（其他 document）里也能正常工作：

- `Slider`、`Sticky`、`Tabs`、`List`、`PullRefresh` 通过 `getOwnerWindow(el)` 获取元素所属 window，而非直接用全局 `window`；
- 弹层组件的挂载目标可被宿主改写：`setDefaultTeleportTarget(el)` 与 `<ConfigProvider teleport="...">`，文档站据此把 Dialog / Toast / Popup / ImagePreview 挂进沙箱，弹层只覆盖手机屏幕。

## 部署到 Gitee Pages

文档站是纯静态产物，可以直接托管在 Gitee Pages（需在 Gitee 完成实名认证后才能开启该服务）。

### 一次性准备

```bash
# 1. 在 Gitee 新建仓库（不要勾选「使用 Readme 初始化」）
# 2. 关联远程并推送源码
git remote add origin https://gitee.com/<用户名>/<仓库名>.git
git push -u origin master
```

### 发布文档站

```bash
# 只构建，先本地看效果
npm run docs:build:gitee -- vela-ui
node scripts/serve-static.mjs docs/.vitepress/dist vela-ui 4180
# → http://localhost:4180/vela-ui/

# 构建 + 校验 + 推送到 pages 分支
npm run deploy:gitee -- https://gitee.com/<用户名>/<仓库名>.git
```

脚本会完成三件事：按 `/<仓库名>/` 子路径构建、校验所有资源引用是否存在、把产物推送到仓库的 `pages` 分支（独立提交历史，不污染源码分支）。

推完之后在 Gitee 仓库页面 **服务 → Gitee Pages** 中选择分支 `pages`、部署目录留空，启动后地址为：

```
https://<用户名>.gitee.io/<仓库名>/
```

### 为什么需要单独一套构建参数

纯静态托管有两处和本地开发不同，`docs/.vitepress/config.mts` 里已处理：

| 问题 | 本地开发 | Gitee Pages | 处理方式 |
| --- | --- | --- | --- |
| 站点在子路径下 | `base` 为 `/` | `base` 为 `/<仓库名>/` | 读环境变量 `DOCS_BASE` |
| 链接形式 | `cleanUrls`，`/guide/theme` | 静态服务器不做 URL 重写，必须 `/guide/theme.html` | 部署时关闭 `cleanUrls` |

> 在 Git Bash 里请传**不带前导斜杠**的仓库名（`DOCS_BASE=vela-ui`），否则 MSYS 会把 `/vela-ui/` 当成路径转换成 Git 安装目录下的绝对路径。

如果仓库名就是 `<用户名>.gitee.io`（个人站点仓库），站点位于根路径，用下面的命令构建，脚本会自动识别并省略 base 前缀：

```bash
node scripts/deploy-gitee.mjs https://gitee.com/<用户名>/<用户名>.gitee.io.git
```

### 更新站点

免费版 Gitee Pages 不会在推送后自动重新部署，每次 `npm run deploy:gitee` 之后需要在 Pages 页面手动点一次「更新」。绑定自定义域名或使用 Pro 版可自动部署。

## 脚本

| 命令 | 说明 |
| --- | --- |
| `npm run dev` | 启动文档站开发服务器（5173） |
| `npm run docs:build` | 构建文档站到 `docs/.vitepress/dist` |
| `npm run docs:preview` | 预览文档站构建产物（4173） |
| `npm run docs:build:gitee` | 按 Gitee Pages 子路径构建并自检资源 |
| `npm run deploy:gitee` | 构建、自检并推送到 Gitee 的 `pages` 分支 |
| `npm run build` | 构建组件库到 `packages/mobile-ui/dist` |
| `npm run typecheck` | 使用 vue-tsc 做类型检查 |
| `npm run publish:npm` | 自动定版本、构建并发布到 npm |
| `npm run publish:npm:dry` | 只跑发布流程，不上传、不打 tag |

## 发布到 npm

发布脚本在 `scripts/publish-npm.mjs`，一条命令完成版本号、构建、校验与发布。

```bash
npm login --registry https://registry.npmjs.org/   # 首次需要登录

npm run publish:npm               # 当前版本没发布过就发它，否则补丁号自增
node scripts/publish-npm.mjs minor  # 次版本自增
node scripts/publish-npm.mjs major  # 主版本自增
node scripts/publish-npm.mjs 1.0.0  # 指定版本
npm run publish:npm:dry           # 预演，不上传
```

版本号会同步改写 `packages/mobile-ui/package.json`、根 `package.json`、`src/index.ts` 里的 `version`，以及文档站导航栏的版本号；发布成功后自动提交 `chore(release): vX.Y.Z` 并打 `vX.Y.Z` tag。

脚本依次做这些检查：git 工作区干净 → npm 登录态 → 包名与 scope 归属（含已被占用时的提示）→ 类型检查 → 构建 → 产物入口齐全 → `npm pack` 预检（README / LICENSE / 入口文件是否都在包内）。任一步失败都会回滚版本号改动。

其它参数：`--tag beta` 发到指定 dist-tag、`--otp <code>` 两步验证码、`--yes` 跳过确认、`--skip-check` 跳过 git 检查、`--no-git` 不提交、`--push` 发布后推送。

> 包是 scoped 的（`@xxui/mobile`），发布前需要 npm 上存在 `@xxui` 这个 scope（个人 scope 与用户名同名，或先建组织）。`publishConfig` 已固定 `access: public` 与官方 registry，所以本机配置的镜像源不影响发布。

### 开发辅助脚本

`scripts/` 下是开发期用来做视觉回归与控制台巡检的脚本，不在 npm scripts 中，需要时直接 `node` 运行。它们依赖 `puppeteer-core` 与本机已安装的 Chrome（路径写在脚本顶部的 `CHROME` 常量里），仅在开发文档站运行时才有意义。

| 脚本 | 用法 | 作用 |
| --- | --- | --- |
| `shot.mjs` | `PAGES='[["/","home"]]' node scripts/shot.mjs` | 批量截图页面，并汇总控制台报错；支持 `FULL=1` 整页、`MOBILE=1` 移动视口、`DARK=1` 暗色 |
| `clip.mjs` | `node scripts/clip.mjs <url> <selector> <out.png> [宽度]` | 截取单个元素并输出自身与子元素的尺寸、溢出情况，用于核对局部排版；`DARK=1` 走暗色 |
| `interact.mjs` | `node scripts/interact.mjs` | 自动打开 Dialog / ActionSheet / Popup / Toast 并截图，验证命令式组件 |
| `inspect2.mjs` | `node scripts/inspect2.mjs` | 通过主题切换器切到暗色，读取关键节点的计算样式，确认主题令牌真正生效 |
| `check404.mjs` | `node scripts/check404.mjs` | 从首页广度优先爬取全部站内链接，报告 >=400 的页面；`BASE=` 可指向预览服务 |
| `sandbox.mjs` | `node scripts/sandbox.mjs` | 沙箱自检：确认演示确实渲染在 iframe 内、指针拖拽在沙箱 window 上生效、换肤不影响文档站、`--vp-*` 未泄漏 |
| `verify-static.mjs` | `node scripts/verify-static.mjs <产物目录> <仓库名>` | 静态产物自检：确认 HTML 里所有带 base 前缀的绝对路径都能找到对应文件 |
| `serve-static.mjs` | `node scripts/serve-static.mjs <产物目录> <仓库名> [端口]` | 极简静态服务器，把产物挂到子路径下，模拟 Gitee Pages 的访问方式 |

> `verify-static.mjs` 与 `serve-static.mjs` 不依赖 Chrome，部署前排查与预览时使用；其余脚本只在本地开发时使用，不影响 `build` 与 `docs:build` 的产物。

## 说明与限制

- 按需引入目前只作用于 JS，CSS 仍为一次性引入；
- 未内置 RTL 布局支持；
- Tabs 在隐藏容器中首次渲染时，下划线位置需要容器可见后重新计算。

## License

MIT

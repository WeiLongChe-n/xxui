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
xxui/
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
import XXUI from 'xxui-mobile'
import 'xxui-mobile/style.css'
import App from './App.vue'

createApp(App).use(XXUI).mount('#app')
```

```vue
<x-button type="primary" block @click="Toast.success('保存成功')">提交</x-button>
```

```ts
import { setTheme, useTheme, Toast } from 'xxui-mobile'

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

## 部署到 GitHub Pages

文档站是纯静态产物，由 `.github/workflows/docs.yml` 自动构建并发布到 GitHub Pages：推送 `master` 且 `docs/`、`packages/` 或 `scripts/` 有变化时触发，也可在 Actions 页面手动运行。

站点地址：**https://weilongche-n.github.io/xxui/**

### 一次性准备

仓库 **Settings → Pages → Build and deployment → Source** 选择 **GitHub Actions**。工作流里已带 `actions/configure-pages`（`enablement: true`），首次运行会自动开启，通常不用手动点。

### 本地预览产物

```bash
# 按 /xxui/ 子路径构建，并自检所有资源引用是否存在
npm run docs:build:pages

# 把产物挂到子路径下模拟线上访问
node scripts/serve-static.mjs docs/.vitepress/dist xxui 4180
# → http://localhost:4180/xxui/
```

### 为什么需要单独一套构建参数

纯静态托管有两处和本地开发不同，`docs/.vitepress/config.mts` 里已处理：

| 问题 | 本地开发 | GitHub Pages | 处理方式 |
| --- | --- | --- | --- |
| 站点在子路径下 | `base` 为 `/` | `base` 为 `/xxui/` | 读环境变量 `DOCS_BASE` |
| 链接形式 | `cleanUrls`，`/guide/theme` | 静态托管不做 URL 重写，必须 `/guide/theme.html` | 部署时关闭 `cleanUrls` |

> 在 Git Bash 里请传**不带前导斜杠**的仓库名（`DOCS_BASE=xxui`），否则 MSYS 会把 `/xxui/` 当成路径转换成 Git 安装目录下的绝对路径。

### 更新站点

推送即部署，不需要手动操作。若在 Actions 里看到 `deploy` 任务被跳过，检查 Pages 的 Source 是否已切到 GitHub Actions。

## 脚本

| 命令 | 说明 |
| --- | --- |
| `npm run dev` | 启动文档站开发服务器（5173） |
| `npm run docs:build` | 构建文档站到 `docs/.vitepress/dist` |
| `npm run docs:preview` | 预览文档站构建产物（4173） |
| `npm run docs:build:pages` | 按 GitHub Pages 子路径（`/xxui/`）构建并自检资源 |
| `npm run build` | 构建组件库到 `packages/mobile-ui/dist` |
| `npm run typecheck` | 使用 vue-tsc 做类型检查 |
| `npm run publish:npm` | 本地发布（首发/应急）：自动定版本、构建并发布到 npm |
| `npm run publish:npm:dry` | 只跑本地发布流程，不上传、不打 tag |
| `npm run release` | 打 tag 并推送，由 GitHub Actions 发布 |
| `npm run release:dry` | 预演 release，不写文件、不推送 |

## 发布到 npm

**常规路径：GitHub Actions + Trusted Publishing（OIDC）。** 不需要 token、不需要验证码，凭证由 GitHub 每次发布时临时签发。

```bash
npm run release            # 自动定版本（有 feat 走 minor，否则 patch）→ 提交 → 打 tag → 推送
npm run release:minor      # 强制次版本，0.3.0 → 0.4.0
npm run release:patch      # 强制补丁号，0.3.0 → 0.3.1
npm run release:dry        # 预演，只打印不执行
```

推送后 `.github/workflows/publish.yml` 接手：类型检查 → 构建 → 产物校验 → OIDC 换临时凭证 → `npm publish`（自动附带 provenance）。

首次发布、Trusted Publisher 配置、本地应急发布、常见报错排查，见 **[RELEASING.md](./RELEASING.md)**。

## 开发辅助脚本

`scripts/` 下的截图、页面巡检与产物校验脚本不在 npm scripts 中，按需 `node` 直接运行。前置条件、脚本清单与典型用法见 **[DEVELOPMENT.md](./DEVELOPMENT.md)**。

## 说明与限制

- 按需引入目前只作用于 JS，CSS 仍为一次性引入；
- 未内置 RTL 布局支持；
- Tabs 在隐藏容器中首次渲染时，下划线位置需要容器可见后重新计算。

## License

MIT

# 快速上手

## 环境要求

组件库本身只依赖 Vue 3；下面的版本要求主要针对**本仓库开发与文档站构建**。

| 环境 | 最低版本 | 推荐版本 | 说明 |
| --- | --- | --- | --- |
| Node.js | `>= 18.0.0` | `20 LTS` / `22 LTS` | Vite 6 与 VitePress 1.6 的运行前提 |
| npm | `>= 9.0.0` | `10.x` | 或使用 pnpm 8+ / yarn 1.22+ |
| Vue | `>= 3.3.0` | `3.5.x` | 使用 `<script setup>`、`defineOptions` 等特性 |
| TypeScript | `>= 5.0` | `5.9.x` | 可选，使用 TS 时建议开启 |
| Vite | `>= 5.0` | `6.4.x` | 仅构建/开发时需要 |

::: info 本项目实际使用环境
本文档站与组件库在以下环境中开发与验证：

- Node.js **v22.22.2**
- npm **10.9.7**
- Vue **3.5.44** / Vite **6.4.5** / VitePress **1.6.4** / TypeScript **5.9.3** / Sass **1.107.1**

如果使用更低的 Node 版本（如 16），`npm install` 或 `npm run dev` 会因 Vite 6 的引擎限制失败，请先升级 Node。仓库根目录已提供 `.nvmrc`，执行 `nvm use` 即可切换到对应版本。
:::

## 安装

```bash
# npm
npm i @vela/mobile

# pnpm
pnpm add @vela/mobile

# yarn
yarn add @vela/mobile
```

::: tip 本地开发本仓库
文档站与组件库在同一个仓库中，直接执行 `npm install && npm run dev` 即可打开本文档站并实时修改组件源码。
:::

## 引入组件库

### 全量引入

```ts
import { createApp } from 'vue'
import VelaUI from '@vela/mobile'
import '@vela/mobile/style.css'
import App from './App.vue'

const app = createApp(App)
app.use(VelaUI)
app.mount('#app')
```

全量引入后会注册全部组件（`<vl-button>`、`<vl-cell>`……），并自动初始化主题（读取本地存储的偏好）。

`app.use` 的第二个参数可以指定默认主题，仅在用户没有本地偏好时生效：

```ts
app.use(VelaUI, { theme: 'light', brand: 'ocean' })
```

### 按需引入

推荐使用 `unplugin-vue-components`，详见 [按需引入](/guide/on-demand)。

## 一个最小示例

<DemoBlock title="订单数量" description="导航栏 + 单元格 + 步进器 + 命令式提示，组合出一个最小可用页面" :code="demoCode">
  <div class="demo-block-host">
    <VelaHomeDemo />
  </div>
</DemoBlock>


## TypeScript 支持

组件库使用 TypeScript 编写，构建时会输出 `dist/types`，无需额外配置即可获得类型提示：

```ts
import type { FieldRule, ThemeConfig, BrandName } from '@vela/mobile'
```

如果 `vue-tsc` 报找不到 `*.vue` 的类型，请在 `tsconfig.json` 中加入：

```json
{
  "compilerOptions": {
    "types": ["vite/client"],
    "moduleResolution": "bundler"
  }
}
```

## 移动端适配

组件默认按 `375px` 设计稿的尺寸实现，使用 `px` 单位，建议配合 viewport 方案：

```html
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover" />
```

`viewport-fit=cover` 是安全区适配（iPhone 底部小黑条）的前提，详见 [国际化与适配](/guide/adaptation)。

## 下一步

- [主题定制](/guide/theme)：换肤、暗色模式、自定义品牌色
- [组件总览](/components/button)：55 个组件的用法与 API

<script setup>
import VelaHomeDemo from '../demos/home/basic.vue'
import demoCode from '../demos/home/basic.vue?raw'
</script>

<style>
.demo-block-host {
  display: flex;
  justify-content: center;
}

.demo-block-host > * {
  width: 340px;
  max-width: 100%;
  overflow: hidden;
  border: 1px solid var(--vp-c-divider);
  border-radius: 16px;
}
</style>

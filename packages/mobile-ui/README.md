# XXUI

轻量、可定制的 Vue 3 移动端组件库，**55 个组件**，内置 6 套品牌配色与暗色模式，支持运行时切换主题。

- 🧩 **开箱即用**：组件自带完整 TypeScript 类型，BEM 命名，样式可覆盖
- 🎨 **多主题**：CSS 变量驱动，6 品牌 × 明暗 = 12 套预设，支持局部换肤
- 🌙 **暗色模式**：跟随系统或手动切换，刷新不闪白
- 📦 **按需引入**：ESM 产物支持 tree-shaking，运行时零依赖
- 📱 **移动端优先**：1px 边框、安全区适配、手势交互（滚轮、滑动、下拉刷新）
- 🔒 **沙箱友好**：弹层挂载目标可改写，可把组件限制在指定容器内渲染

## 环境要求

| 依赖 | 版本 |
| --- | --- |
| Node.js | ≥ 18.0.0 |
| npm | ≥ 9.0.0 |
| Vue | ≥ 3.3.0 |

## 安装

```bash
npm i @xxui/mobile
# 或
pnpm add @xxui/mobile
yarn add @xxui/mobile
```

## 快速上手

```ts
// main.ts
import { createApp } from 'vue'
import XXUI from '@xxui/mobile'
import '@xxui/mobile/style.css'
import App from './App.vue'

createApp(App).use(XXUI).mount('#app')
```

按需引入：

```ts
import { Button, Toast, setTheme } from '@xxui/mobile'
import '@xxui/mobile/style.css'

setTheme('ocean', 'dark')
Toast('已切换主题')
```

## 主题

主题由 CSS 变量驱动，运行时修改即可全局生效：

```ts
import { setBrand, setMode, toggleMode, resetTheme } from '@xxui/mobile'

setBrand('emerald')  // default | ocean | emerald | violet | sunset | graphite
setMode('dark')      // light | dark | auto
toggleMode()
resetTheme()
```

也支持局部换肤：

```vue
<ConfigProvider :theme-vars="{ '--x-primary': '#ff5000' }">
  <Button type="primary">局部主题</Button>
</ConfigProvider>
```

## 组件一览

| 分类 | 组件 |
| --- | --- |
| 基础 | Button、Cell、Icon、Row/Col、Grid、Divider、Badge、Tag |
| 表单 | Field、Form、Switch、Checkbox、Radio、Stepper、Slider、Rate、Search、Picker、Area、Cascader、Tree |
| 反馈 | Toast、Dialog、ActionSheet、Loading、Overlay、Skeleton、Progress、NoticeBar、PullRefresh、Empty |
| 导航 | NavBar、Tabbar、Tabs、Steps、DropdownMenu、Collapse、Sticky |
| 展示 | Popup、Swipe、List、ImagePreview、CountDown |

## 文档

完整文档、可交互的手机预览与示例代码见：

- Gitee Pages：https://chenweilong_1025.gitee.io/vela-ui/
- 源码仓库：https://gitee.com/chenweilong_1025/vela-ui

## 许可

[MIT](./LICENSE)

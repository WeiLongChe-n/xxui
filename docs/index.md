---
layout: home

hero:
  name: Vela UI
  text: 移动端组件库
  tagline: 面向 Vue 3 + TypeScript 的轻量组件库。46 个开箱即用的组件，内置 6 套品牌配色与暗色模式，一行代码完成主题切换。
  actions:
    - theme: brand
      text: 快速上手
      link: /guide/getting-started
    - theme: alt
      text: 浏览组件
      link: /components/button
    - theme: alt
      text: 主题定制
      link: /guide/theme

features:
  - title: 主题即变量
    details: 全部样式基于 CSS 变量与色相令牌（--vl-hue）构建，换肤只需切换一个 data-brand，无需重新编译。
  - title: 多套主题动态切换
    details: 内置 6 套品牌配色与明暗双模式，提供 useTheme / setTheme / setBrand 等运行时 API，支持持久化与跟随系统。
  - title: TypeScript 友好
    details: 全量类型定义随包发布，组件 Props、事件与命令式 API 均有完整类型提示。
  - title: 移动端细节到位
    details: 1px 细边框、安全区适配、滚动锁定、手势拖拽、按需渲染，都是移动端真正需要的能力。
  - title: 命令式组件
    details: Toast、Dialog 支持函数式调用，也可作为组件使用，覆盖声明式与命令式两种开发习惯。
  - title: 按需引入
    details: 支持 ES Module 按需引入与 Vite 自动按需加载，未使用的组件不会进入产物。
---

<div class="home-section">
  <div class="home-env">
    <div class="home-env__head">
      <span class="home-env__title">环境要求</span>
      <a class="home-env__link" href="/guide/getting-started">完整版本说明 →</a>
    </div>
    <div class="home-env__list">
      <div class="home-env__item"><span>Node.js</span><b>≥ 18.0.0</b><em>推荐 20 / 22 LTS</em></div>
      <div class="home-env__item"><span>npm</span><b>≥ 9.0.0</b><em>或 pnpm 8+ / yarn 1.22+</em></div>
      <div class="home-env__item"><span>Vue</span><b>≥ 3.3.0</b><em>3.5.x 已适配</em></div>
      <div class="home-env__item"><span>Vite</span><b>≥ 5.0</b><em>仅开发与构建需要</em></div>
    </div>
    <p class="home-env__note">开发与验证环境：Node.js v22.22.2 / npm 10.9.7 / Vue 3.5.44 / Vite 6.4.5 / VitePress 1.6.4<br>仓库根目录提供 <code>.nvmrc</code>，执行 <code>nvm use</code> 即可对齐版本；低于 Node 18 时安装会因 <code>engines</code> 校验失败。</p>
  </div>

  <h2>三十秒上手</h2>

```bash
npm i @vela/mobile
```

```ts
import { createApp } from 'vue'
import VelaUI from '@vela/mobile'
import '@vela/mobile/style.css'
import App from './App.vue'

createApp(App).use(VelaUI).mount('#app')
```

```vue
<template>
  <vl-button type="primary" block @click="Toast.success('保存成功')">
    主要按钮
  </vl-button>
</template>

<script setup lang="ts">
import { Toast } from '@vela/mobile'
</script>
```

  <h2>主题切换，只需一行</h2>

```ts
import { setTheme, useTheme } from '@vela/mobile'

// 方式一：直接切换
setTheme({ mode: 'dark', brand: 'ocean' })

// 方式二：组合式，配合自定义换肤面板
const { mode, brand, setMode, setBrand, isDark } = useTheme()
```

  <p class="home-note">
    Vela UI 的主题由「明暗模式 + 品牌配色」两个维度组成，任意组合共 12 种预设，也可以通过覆盖 CSS 变量完全自定义。
  </p>
</div>

<style>
.home-section {
  max-width: 900px;
  padding: 0 24px;
  margin: 64px auto 96px;
}

.home-section h2 {
  margin: 48px 0 16px;
  font-size: 24px;
  font-weight: 700;
  letter-spacing: -0.01em;
}

.home-section h2:first-child {
  margin-top: 0;
}

.home-note {
  margin-top: 12px;
  font-size: 14px;
  line-height: 1.8;
  color: var(--vp-c-text-2);
}

.home-env {
  padding: 18px 20px 16px;
  margin-bottom: 8px;
  background: var(--vp-c-bg-soft);
  border: 1px solid var(--vp-c-divider);
  border-radius: 14px;
}

.home-env__head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
}

.home-env__title {
  font-size: 13px;
  font-weight: 600;
  letter-spacing: 0.02em;
  color: var(--vp-c-brand-1);
}

.home-env__link {
  font-size: 13px;
  font-weight: 500;
  color: var(--vp-c-text-2);
  transition: color 0.2s;
}

.home-env__link:hover {
  color: var(--vp-c-brand-1);
}

.home-env__list {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 12px;
  align-items: stretch;
  padding: 14px 0 0;
  margin: 0;
}

.home-env__item {
  display: flex;
  flex-direction: column;
  gap: 2px;
  min-width: 0;
  padding: 10px 12px;
  margin: 0;
  background: var(--vp-c-bg);
  border: 1px solid var(--vp-c-divider);
  border-radius: 10px;
}

.home-env__item span {
  font-size: 12px;
  line-height: 1.5;
  color: var(--vp-c-text-3);
}

.home-env__item b {
  font-family: var(--vp-font-family-mono);
  font-size: 14px;
  font-weight: 600;
  line-height: 1.5;
  color: var(--vp-c-text-1);
}

.home-env__item em {
  font-size: 11px;
  font-style: normal;
  line-height: 1.5;
  color: var(--vp-c-text-3);
}

.home-env__note {
  padding: 0;
  margin: 12px 0 0;
  font-size: 12px;
  line-height: 1.7;
  color: var(--vp-c-text-3);
}

.home-env__note code {
  font-size: 12px;
}

@media (max-width: 640px) {
  .home-env__list {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}
</style>

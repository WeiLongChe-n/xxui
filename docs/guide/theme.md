# 主题定制

Vela UI 的主题不是「打包时选定」的，而是**运行时由 CSS 变量计算的**。这意味着：切换主题不需要重新编译、不会增加样式体积，甚至可以在同一个页面里并存两套主题。

## 主题模型

主题由两个相互独立的维度组成：

| 维度 | 取值 | 落地方式 | 影响范围 |
| --- | --- | --- | --- |
| 明暗模式 `mode` | `light` / `dark` / `auto` | `html[data-theme]` | 文本、背景、边框、阴影、主色亮度 |
| 品牌配色 `brand` | 6 套预设 | `html[data-brand]` | 主色色相 `--vl-hue` |

两者组合共 **12 种预设主题**，且可以任意扩展。

<DemoBlock title="主题切换" description="下面的面板直接调用组件库的主题 API，切换后整页组件实时响应" :code="switcherCode">
  <ThemeSwitcherDemo />
</DemoBlock>

## 切换主题

### 1. 直接调用 API

```ts
import { setTheme, setMode, setBrand, toggleMode, resetTheme } from '@vela/mobile'

setTheme({ mode: 'dark', brand: 'ocean' }) // 一次性设置
setMode('light')                           // 只切换明暗
setBrand('emerald')                        // 只切换配色
toggleMode()                               // 在明暗之间来回切
resetTheme()                               // 恢复默认（light + default）
```

### 2. 组合式 API

`useTheme()` 返回响应式状态与切换方法，适合自己实现换肤面板：

```ts
import { useTheme } from '@vela/mobile'

const {
  mode,          // Ref<'light' | 'dark' | 'auto'>
  brand,         // Ref<BrandName>
  resolvedMode,  // Ref<'light' | 'dark'>，auto 会被解析成具体值
  isDark,        // ComputedRef<boolean>
  brandOptions,  // [{ name, label, hue, saturation }]
  themeModes,    // [{ name, label }]
  setMode,
  setBrand,
  setTheme,
  toggleMode,
  resetTheme,
} = useTheme()
```

### 3. 局部主题

`<vl-config-provider>` 会把主题属性挂在包裹元素上，因此只影响其内部组件——常用来做「亮色/暗色对比」或局部强调区域。

<DemoBlock title="局部主题" description="同一个页面中并存两种模式与配色，互不干扰" :code="localCode">
  <LocalThemeDemo />
</DemoBlock>

```vue
<vl-config-provider theme="dark" brand="violet">
  <div class="preview">这块区域永远是深色 + 紫罗兰，与全局主题无关</div>
</vl-config-provider>
```

也可以只覆盖少量变量：

```vue
<vl-config-provider :theme-vars="{ '--vl-primary': '#ff5000', '--vl-radius': '2px' }">
  <vl-button type="primary">品牌红 + 直角按钮</vl-button>
</vl-config-provider>
```

## 内置品牌配色

每套配色只改变色相与饱和度，明暗模式下会自动调整亮度以保证对比度。

| brand | 名称 | 色相 | 饱和度 | 主色（浅色模式） |
| --- | --- | --- | --- | --- |
| `default` | 曜石蓝 | 217 | 88% | <span class="brand-swatch" style="background:#3b82f6"></span>`hsl(217 88% 55%)` |
| `ocean` | 海松青 | 195 | 88% | <span class="brand-swatch" style="background:#1fa8d8"></span>`hsl(195 88% 55%)` |
| `emerald` | 翡翠绿 | 158 | 82% | <span class="brand-swatch" style="background:#17c98a"></span>`hsl(158 82% 55%)` |
| `violet` | 紫罗兰 | 262 | 85% | <span class="brand-swatch" style="background:#8b4ef5"></span>`hsl(262 85% 55%)` |
| `sunset` | 落日橘 | 12 | 88% | <span class="brand-swatch" style="background:#ee5a24"></span>`hsl(12 88% 55%)` |
| `graphite` | 石墨灰 | 218 | 12% | <span class="brand-swatch" style="background:#7f8797"></span>`hsl(218 12% 55%)` |

::: tip 为什么用色相而不是十六进制？
用 `--vl-hue` 驱动主色，意味着「主色、悬停色、暗色模式下的亮色、浅色底」都能由一套规则推导出来，不会出现换肤后某个状态色仍然发蓝的割裂感。如果你更习惯直接指定颜色，也可以直接覆盖 `--vl-primary` 系列变量。
:::

## 明暗模式

### 跟随系统

```ts
setMode('auto') // 使用 prefers-color-scheme 自动解析
```

`auto` 模式下，系统外观变化时会自动重新应用，无需监听媒体查询。

### 持久化

主题偏好默认写入 `localStorage`，键名为 `vela-ui-theme`：

```ts
localStorage.getItem('vela-ui-theme') // '{"mode":"dark","brand":"ocean"}'
```

如果不希望持久化（例如多租户页面、嵌入式场景）：

```ts
import { initTheme } from '@vela/mobile'

initTheme({ storage: false, followSystem: true, defaultTheme: { mode: 'auto', brand: 'default' } })
```

### 避免首屏闪烁

SPA 在 JS 执行前无法读取主题，深色用户可能看到一瞬白屏。在 `index.html` 的 `<head>` 中插入一段内联脚本即可：

```html
<script>
  try {
    var theme = JSON.parse(localStorage.getItem('vela-ui-theme') || '{}')
    var dark =
      theme.mode === 'dark' ||
      (theme.mode !== 'light' && matchMedia('(prefers-color-scheme: dark)').matches)
    document.documentElement.dataset.theme = dark ? 'dark' : 'light'
    document.documentElement.dataset.brand = theme.brand || 'default'
  } catch (e) {}
</script>
```

## 自定义主题

### 覆盖 CSS 变量

所有设计令牌都是 CSS 变量，**不需要 SCSS 编译**，在任意作用域覆盖即可：

```css
:root {
  --vl-primary: #ff5000;
  --vl-radius: 4px;
  --vl-font-size: 15px;
  --vl-cell-padding: 14px 18px;
}

/* 只改深色模式下的背景 */
[data-theme='dark'] {
  --vl-background: #0a0c10;
  --vl-background-2: #12161d;
}
```

<DemoBlock title="自定义变量" description="通过覆盖变量实现圆角、字号、渐变主色等定制" :code="customCode">
  <CustomThemeDemo />
</DemoBlock>

### 新增一套品牌配色

```css
[data-brand='brand-red'] {
  --vl-hue: 4;
  --vl-saturation: 90%;
}
```

```ts
setBrand('brand-red' as BrandName) // 类型上需要扩展 BrandName
```

如果希望类型安全，可以扩展联合类型：

```ts
declare module '@vela/mobile' {
  interface BrandNameMap {
    'brand-red': true
  }
}
```

### 完整变量清单

**颜色**

| 变量 | 默认值（浅色） | 说明 |
| --- | --- | --- |
| `--vl-hue` | `217` | 品牌色相，换肤的核心令牌 |
| `--vl-saturation` | `88%` | 品牌饱和度 |
| `--vl-primary` | `hsl(var(--vl-hue) var(--vl-saturation) 55%)` | 主色 |
| `--vl-primary-dark` | `hsl(... 46%)` | 主色按下态 / 深色文字 |
| `--vl-primary-light` | `hsl(var(--vl-hue) 92% 95%)` | 主色浅底（标签、选中背景） |
| `--vl-success` | `#16a34a` | 成功 |
| `--vl-danger` | `#ef4444` | 危险 / 错误 |
| `--vl-warning` | `#f59e0b` | 警告 |
| `--vl-info` | `#64748b` | 中性信息 |

**文本与背景**

| 变量 | 浅色 | 深色 | 说明 |
| --- | --- | --- | --- |
| `--vl-text-color` | `#1f2233` | `#e9ebf0` | 主文本 |
| `--vl-text-color-2` | `#646b81` | `#b2b8c4` | 次要文本 |
| `--vl-text-color-3` | `#9699a6` | `#838a99` | 辅助文本 / 说明 |
| `--vl-text-color-4` | `#c8ccd4` | `#565d6b` | 占位符 / 禁用 |
| `--vl-background` | `#f7f8fa` | `#0f1115` | 页面背景 |
| `--vl-background-2` | `#ffffff` | `#191c22` | 卡片 / 单元格背景 |
| `--vl-background-3` | `#f2f3f5` | `#232730` | 填充块背景 |
| `--vl-border-color` | `#ebedf0` | `#2a2f39` | 分割线 / 描边 |
| `--vl-active-color` | `#f2f3f5` | `#232730` | 点击反馈色 |
| `--vl-overlay-bg` | `rgba(0,0,0,.62)` | `rgba(0,0,0,.78)` | 遮罩层 |

**字体**

| 变量 | 默认值 |
| --- | --- |
| `--vl-font-family` | 系统字体栈（PingFang SC / 微软雅黑 / San Francisco） |
| `--vl-font-size` | `14px` |
| `--vl-font-size-xs` / `sm` / `md` / `lg` | `10px` / `12px` / `14px` / `16px` |

**圆角与间距**

| 变量 | 默认值 |
| --- | --- |
| `--vl-radius-sm` / `--vl-radius` / `--vl-radius-lg` / `--vl-radius-xl` | `4px` / `8px` / `12px` / `20px` |
| `--vl-padding-xs` / `sm` / `-` / `md` / `lg` / `xl` | `4px` / `8px` / `12px` / `16px` / `24px` / `32px` |

**布局与动效**

| 变量 | 默认值 | 说明 |
| --- | --- | --- |
| `--vl-navbar-height` | `46px` | 导航栏高度 |
| `--vl-tabbar-height` | `50px` | 标签栏高度 |
| `--vl-cell-padding` | `12px 16px` | 单元格内边距 |
| `--vl-cell-font-size` | `15px` | 单元格字号 |
| `--vl-safe-top` / `--vl-safe-bottom` | `env(safe-area-inset-*)` | 安全区 |
| `--vl-duration-fast` / `--vl-duration` | `0.2s` / `0.3s` | 过渡时长 |
| `--vl-ease` | `cubic-bezier(.25,.1,.25,1)` | 缓动曲线 |
| `--vl-shadow-1` / `2` / `3` | 三级阴影 | 卡片 / 浮层 / 弹窗 |

## 主题 API

| 方法 | 说明 | 签名 |
| --- | --- | --- |
| `initTheme` | 初始化（读取本地偏好并应用），插件安装时自动调用 | `(options?: InitThemeOptions) => void` |
| `setTheme` | 同时设置模式与配色 | `(config: Partial<ThemeConfig>) => void` |
| `setMode` | 设置明暗模式 | `(mode: 'light' \| 'dark' \| 'auto') => void` |
| `setBrand` | 设置品牌配色 | `(brand: BrandName) => void` |
| `toggleMode` | 在浅色/深色间切换 | `() => void` |
| `resetTheme` | 恢复默认主题 | `() => void` |
| `useTheme` | 组合式 API，返回响应式状态与方法 | `() => ThemeContext` |

`initTheme` 的选项：

| 选项 | 类型 | 默认值 | 说明 |
| --- | --- | --- | --- |
| `defaultTheme` | `Partial<ThemeConfig>` | `{ mode: 'light', brand: 'default' }` | 无本地偏好时的默认值 |
| `storage` | `boolean` | `true` | 是否读写 `localStorage` |
| `followSystem` | `boolean` | `true` | 是否为 `auto` 模式监听系统外观 |

## 服务端渲染

主题状态保存在模块级 `reactive` 中，SSR 时不会访问 `window`（内部已做 `typeof window` 判断）。服务端渲染建议：

1. 在 HTML 模板中输出 `data-theme` / `data-brand`（见上文内联脚本）；
2. 客户端 `hydrate` 后再调用 `initTheme()`，避免水合不一致。

## 常见问题

**换肤后某些自定义样式没变？**

自定义样式如果写死了颜色值（如 `#3b82f6`），不会跟随主题。请改用变量：`color: var(--vl-primary)`。

**Toast / Dialog 没有跟随暗色？**

它们挂载在 `document.body` 下，依赖 `html` 上的 `data-theme`。如果你只在某个容器上设置了局部主题，函数式调用的弹层不会受影响——这是符合预期的，弹层应跟随全局主题。

**能同时存在两套主题吗？**

可以，使用 `<vl-config-provider>` 包裹即可。但命令式组件（Toast / Dialog）始终使用全局主题。

<script setup>
import ThemeSwitcherDemo from '../demos/theme/switcher.vue'
import LocalThemeDemo from '../demos/theme/local.vue'
import CustomThemeDemo from '../demos/theme/custom.vue'
import switcherCode from '../demos/theme/switcher.vue?raw'
import localCode from '../demos/theme/local.vue?raw'
import customCode from '../demos/theme/custom.vue?raw'
</script>

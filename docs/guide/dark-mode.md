# 暗色模式

暗色模式是主题系统的一部分，通过 `html[data-theme='dark']` 切换一整套暗色令牌，而不是简单地反色。

## 启用方式

```ts
import { setMode, toggleMode } from 'xxui-mobile'

setMode('dark')   // 固定深色
setMode('light')  // 固定浅色
setMode('auto')   // 跟随系统
toggleMode()      // 在浅色 / 深色之间切换
```

也可以直接在 HTML 上写死：

```html
<html data-theme="dark" data-brand="ocean">
```

## 暗色下发生了什么

| 令牌 | 浅色 | 深色 | 策略 |
| --- | --- | --- | --- |
| `--x-text-color` | `#1f2233` | `#e9ebf0` | 反相但略降对比，减少视觉疲劳 |
| `--x-background` | `#f7f8fa` | `#0f1115` | 不用纯黑，避免 OLED 拖影与边界丢失 |
| `--x-background-2` | `#ffffff` | `#191c22` | 卡片比页面略亮，形成层级 |
| `--x-border-color` | `#ebedf0` | `#2a2f39` | 用低对比描边替代阴影 |
| `--x-shadow-*` | 淡灰阴影 | 更深的黑色阴影 | 深色下阴影需要更重才有层次 |
| `--x-primary` | `hsl(h s 55%)` | `hsl(h s 64%)` | 提高亮度保证在深底上的可读性 |

主色亮度会自动提升约 9%，因此同一套品牌配色在两种模式下都满足对比度要求。

## 监听变化

```ts
import { watch } from 'vue'
import { isDark, resolvedMode } from 'xxui-mobile'

watch(isDark, (dark) => {
  document.querySelector('meta[name="theme-color"]')?.setAttribute('content', dark ? '#0f1115' : '#ffffff')
})
```

## 配合系统外观

`auto` 模式内部使用 `matchMedia('(prefers-color-scheme: dark)')`，系统切换时会自动重新应用，且不会覆盖用户手动选择过的模式。

## 图片与插图

暗色模式下，浅色的插画或截图会显得突兀。建议：

- 使用 SVG 且颜色走 `currentColor`（组件内置图标已这样做）；
- 为 `img` 增加 `filter: brightness(0.9)` 之类的降级处理；
- 需要两套图时，用 CSS 变量切换：

```css
.hero {
  background-image: var(--hero-image);
}

[data-theme='dark'] .hero {
  --hero-image: url('./hero-dark.png');
}
```

## 避免首屏闪烁

参考 [主题定制 - 避免首屏闪烁](/guide/theme#避免首屏闪烁)，在 `<head>` 中内联脚本提前写入 `data-theme`。

## 已知限制

- `backdrop-filter`（Toast 毛玻璃）在部分安卓 WebView 不支持，会降级为半透明纯色背景；
- 打印样式默认跟随浅色，建议在 `@media print` 中强制 `data-theme="light"` 或覆盖变量。

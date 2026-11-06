# 国际化与适配

Vela UI 默认使用 `px` 布局，不强制任何适配方案，因此可以自由选择 viewport、rem 或 vw 方案。

## Viewport 配置

```html
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover" />
```

`viewport-fit=cover` 是使用安全区变量（`env(safe-area-inset-*)`）的前提，导航栏、标签栏、弹出层的 `safe-area-inset-*` 属性依赖它。

## 安全区

组件内部使用以下变量：

```css
:root {
  --vl-safe-top: env(safe-area-inset-top, 0px);
  --vl-safe-bottom: env(safe-area-inset-bottom, 0px);
}
```

- `<vl-nav-bar fixed safe-area-inset-top>` 自动增加顶部内边距；
- `<vl-tabbar>` 默认适配底部安全区；
- `<vl-popup position="bottom" safe-area-inset-bottom>` 同样支持。

如果你的页面有自定义的固定底栏，记得加上：

```css
.my-footer {
  padding-bottom: var(--vl-safe-bottom);
}
```

## rem 适配

若使用 `postcss-pxtorem` 或 `amfe-flexible`，组件库的 `px` 也会被转换，通常无需额外配置。注意：

1. `1px` 细线使用 `transform: scale(0.5)` 实现，不会被 px 转换影响；
2. 如果只希望转换业务代码，可在插件中排除 `node_modules`。

```js
// postcss.config.js
module.exports = {
  plugins: {
    'postcss-pxtorem': {
      rootValue: 37.5,
      propList: ['*'],
      exclude: /node_modules/,
    },
  },
}
```

## 字号缩放

主题变量让全局字号调整变得简单：

```css
:root {
  --vl-font-size: 15px;
  --vl-cell-font-size: 16px;
}
```

## 桌面端适配

移动组件在桌面上会显得偏小。常见做法是用媒体查询放大：

```css
@media (min-width: 768px) {
  :root {
    --vl-font-size: 15px;
    --vl-cell-font-size: 16px;
    --vl-radius: 10px;
  }
}
```

或在外层加一个限宽容器，模拟手机视口：

```css
.mobile-shell {
  max-width: 420px;
  margin: 0 auto;
  box-shadow: 0 0 40px rgba(0, 0, 0, 0.08);
}
```

## 多语言

组件中的默认文案通过 Props 传入，天然支持多语言：

| 组件 | 文案 Props |
| --- | --- |
| ActionSheet | `cancelText` |
| Dialog | `confirmButtonText` / `cancelButtonText` |
| List | `loadingText` / `finishedText` / `errorText` |
| PullRefresh | `pullingText` / `loosingText` / `loadingText` / `successText` |
| Search | `placeholder` / `actionText` |
| Stepper | 无文案 |

建议封装统一的文案配置：

```ts
const locale = {
  confirm: 'OK',
  cancel: 'Cancel',
  loading: 'Loading...',
}
```

## RTL

当前版本未内置 RTL 支持。若需要，可在 `html[dir='rtl']` 下覆盖关键方向属性（如 `left/right`、`transform`），或使用 CSS 逻辑属性重写相关样式。组件内部的方向性样式主要集中在 Popup、Steps、NoticeBar。

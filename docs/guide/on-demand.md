# 按需引入

XXUI 支持 ES Module 的 tree-shaking。全量引入时未被使用的组件不会被打进产物，但如果希望连样式也按需加载，可以使用自动引入插件。

## 手动按需

```ts
import { XButton, XCell, XCellGroup } from 'xxui-mobile'
import 'xxui-mobile/style.css'
```

组件以 `Vl` 前缀导出，注册后即可使用 `<x-button>`：

```ts
app.component('XButton', XButton)
```

::: tip 样式说明
组件样式统一编译在 `style.css` 中（库构建时开启了 `cssCodeSplit: false`）。当前版本按需引入只减少 JS 体积，样式仍需一次性引入。若需要极致体积，可以基于仓库源码自行配置 Vite 多入口构建。
:::

## 自动按需（推荐）

使用 `unplugin-vue-components` 自动解析模板中的组件并注册：

```bash
npm i -D unplugin-vue-components
```

```ts
// vite.config.ts
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import Components from 'unplugin-vue-components/vite'

export default defineConfig({
  plugins: [
    vue(),
    Components({
      resolvers: [
        // 解析 <x-xxx> 标签
        (name) => {
          if (!name.startsWith('Vl')) return
          const component = name.slice(2)
          return {
            name,
            from: 'xxui-mobile',
            sideEffects: 'xxui-mobile/style.css',
          }
        },
      ],
      dts: 'src/components.d.ts',
    }),
  ],
})
```

这样模板中直接写 `<x-button>` 即可，无需手动 import 与注册。

## 函数式组件的按需

`Toast`、`Dialog` 属于命令式 API，需要显式 import：

```ts
import { Toast, Dialog } from 'xxui-mobile'
```

它们的样式已包含在 `style.css` 中。

## 打包体积参考

| 引入方式 | JS（gzip 前） | CSS |
| --- | --- | --- |
| 全量引入 | 约 180 KB | 约 42 KB |
| 仅 Button + Cell + Field | 约 28 KB | 约 42 KB |

> 数值随组件迭代会变化，仅用于说明量级。CSS 目前为一次性引入。

## 常见问题

**Q：为什么样式没有生效？**

检查是否引入了 `xxui-mobile/style.css`。使用自动引入插件时，请确保 `sideEffects` 配置正确，否则可能在打包时被摇掉。

**Q：可以只引入某个组件的源码吗？**

可以，直接从源码路径引入：`import XButton from 'xxui-mobile/src/components/button/Button.vue'`，但需要自行处理 SCSS 编译与主题变量导入，不推荐用于生产。
